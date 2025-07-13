// mostly copied fom jj.ostof.dev (unreleased version)

import type {User} from "./User.ts";
import {encodeBase32, encodeHexLowerCase} from "@oslojs/encoding";
import {sha256} from "@oslojs/crypto/sha2";
import {eq} from "drizzle-orm";
import type {AstroContext} from "./AstroContext.ts";
import {drizzle} from "drizzle-orm/d1";
import {getDB} from "../db/getDB.ts";
import {users} from "../db/schema/schema.ts";
import type {TwitchAPIToken, TwitchAPIUser} from "./twitch.ts";
import {DB} from "../db/DB.ts";

export interface Session {
  id: string;
  userId: string
  expiresAt: Date;
}

/**
 * Transforms a raw session string into a valid Session object.
 * This function ensures that the expiresAt property is properly converted from a string to a Date object.
 *
 * @param {string} rawSession - The raw session string from KV storage
 * @returns {Session} A valid Session object with proper types
 * @throws {Error} If the session JSON cannot be parsed, returns a default expired session
 */
export function transformRawSession(rawSession: string): Session {
  try {
    const parsedSession = JSON.parse(rawSession);
    return {
      ...parsedSession,
      expiresAt: new Date(parsedSession.expiresAt)
    };
  } catch (error) {
    console.error('Failed to parse session JSON:', error);
    // Return a default session with minimal valid data
    return {
      id: '',
      userId: '',
      expiresAt: new Date(0) // Expired session
    };
  }
}

/**
 * Result type for session validation, containing either a valid session and user or null values for both.
 */
type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };

/**
 * Validates a session token and retrieves the associated user.
 *
 * This function:
 * 1. Converts the token to a session ID
 * 2. Retrieves the session from KV storage
 * 3. Validates the session expiration
 * 4. Retrieves the associated user account
 * 5. Extends the session if it's close to expiration
 *
 * @param {AstroContext} ctx - The Astro context object
 * @param {string} token - The session token from the cookie
 * @returns {Promise<SessionValidationResult>} Object containing the session and user if valid, or null values if invalid
 */
export async function validateSessionToken(ctx: AstroContext, token: string): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const KV = ctx.locals.runtime.env.KV;
  const db = getDB(ctx);
  const rawSession = await KV.get(`session:${sessionId}`);
  if (!rawSession) {
    return {session: null, user: null};
  }

  const session = transformRawSession(rawSession);

  // If session ID is empty, it means the session couldn't be parsed properly
  // or the default session was returned from transformRawSession
  if (!session.id) {
    console.error('Session not found');
    return {session: null, user: null};
  }

  const account = await db.select()
    .from(users)
    .where(eq(users.id, session.userId))
    .get();

  if (!account) {
    return {session: null, user: null};
  }

  const user: User = {
    id: account.id,
    displayName: account.displayName,
    login: account.login,
  };

  // Check if session has expired
  if (Date.now() >= session.expiresAt.getTime()) {
    await KV.delete(`session:${sessionId}`);
    return {session: null, user: null};
  }

  // Extend session if it's within 15 days of expiration
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // Extend by 30 days
    await KV.put(`session:${sessionId}`, JSON.stringify(session));
  }

  return {session, user};
}


export async function validateSessionTokenFromEnv(env: Env, token: string): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const KV = env.KV;
  const db = drizzle(env.DB)
  const rawSession = await KV.get(`session:${sessionId}`);
  if (!rawSession) {
    return {session: null, user: null};
  }

  const session = transformRawSession(rawSession);

// If session ID is empty, it means the session couldn't be parsed properly
// or the default session was returned from transformRawSession
  if (!session.id) {
    return {session: null, user: null};
  }

  const account = await db.select()
    .from(users)
    .where(eq(users.id, session.id))
    .get();

  if (!account) {
    return {session: null, user: null};
  }

  const user: User = {
    id: account.id,
    displayName: account.displayName,
    login: account.login,
  };

// Check if session has expired
  if (Date.now() >= session.expiresAt.getTime()) {
    await KV.delete(`session:${sessionId}`);
    return {session: null, user: null};
  }

// Extend session if it's within 15 days of expiration
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // Extend by 30 days
    await KV.put(`session:${sessionId}`, JSON.stringify(session));
  }

  return {session, user};
}

/**
 * Invalidates a specific session by its ID and removes it from the user's session list.
 *
 * This function:
 * 1. Retrieves the session from KV storage
 * 2. Deletes the session from KV storage
 * 3. Updates the user's session list to remove this session ID
 *
 * @param {AstroContext} ctx - The Astro context object
 * @param {string} sessionId - The ID of the session to invalidate
 * @returns {Promise<void>}
 */
export async function invalidateSession(ctx: AstroContext, sessionId: string): Promise<void> {
  const KV = ctx.locals.runtime.env.KV;
  const rawSession = await KV.get(`session:${sessionId}`);
  if (!rawSession) {
    return;
  }

  const session = transformRawSession(rawSession);

  // If session ID is empty, it means the session couldn't be parsed properly
  // or the default session was returned from transformRawSession
  if (!session.id) {
    return;
  }

  // Delete the session from KV storage
  await KV.delete(`session:${sessionId}`);

  // Update the user's session list
  const id = session.id;
  const userSessionsKey = `user-sessions:${id}`;
  const rawSessionIds = await KV.get(userSessionsKey);
  if (!rawSessionIds) {
    return;
  }

  // Parse the user's session list
  let sessionIds: string[] = [];
  try {
    sessionIds = JSON.parse(rawSessionIds);
  } catch (error) {
    console.error('Failed to parse rawSessionIds JSON:', error);
    return;
  }

  // Remove this session ID from the list
  const newSessionIds = sessionIds.filter(id => id !== sessionId);

  // Update the user's session list in KV storage
  await KV.put(userSessionsKey, JSON.stringify(newSessionIds), {
    expirationTtl: 30 * 24 * 60 * 60 // 30 days TTL for the index
  });
}


/**
 * Sets the session token cookie in the response.
 *
 * @param {AstroContext} context - The Astro context object
 * @param {string} token - The session token to set in the cookie
 * @param {Date} expiresAt - The expiration date for the cookie
 * @returns {void}
 */
export function setSessionTokenCookie(context: AstroContext, token: string, expiresAt: Date): void {
  context.cookies.set("session", token, {
    httpOnly: true,
    path: "/",
    secure: import.meta.env.PROD, // Only use secure in production
    sameSite: "lax",
    expires: expiresAt
  });
}

/**
 * Deletes the session token cookie by setting an empty value with immediate expiration.
 *
 * @param {AstroContext} context - The Astro context object
 * @returns {void}
 */
export function deleteSessionTokenCookie(context: AstroContext): void {
  context.cookies.set("session", "", {
    httpOnly: true,
    path: "/",
    secure: import.meta.env.PROD, // Only use secure in production
    sameSite: "lax",
    maxAge: 0 // Expire immediately
  });
}

/**
 * Invalidates all sessions for a specific user.
 *
 * This function:
 * 1. Retrieves all session IDs for the user
 * 2. Deletes each session from KV storage
 * 3. Deletes the user's session index
 *
 * @param {AstroContext} ctx - The Astro context object
 * @param {number} userId - The ID of the user whose sessions should be invalidated
 * @returns {Promise<void>}
 */
export async function invalidateUserSessions(ctx: AstroContext, userId: number): Promise<void> {
  const KV = ctx.locals.runtime.env.KV;

  // Get all sessionIds for this user
  const userSessionsKey = `user-sessions:${userId}`;
  const rawSessionIds = await KV.get(userSessionsKey);

  if (rawSessionIds) {
    let sessionIds: string[] = [];
    try {
      sessionIds = JSON.parse(rawSessionIds);
    } catch (error) {
      console.error('Failed to parse user sessions JSON:', error);
      // Use empty array as default
    }

    // Delete each session
    const deletePromises = sessionIds.map(sessionId =>
      KV.delete(`session:${sessionId}`)
    );

    // Wait for all deletions to complete
    await Promise.all(deletePromises);

    // Delete the index
    await KV.delete(userSessionsKey);
  }
}

/**
 * Generates a cryptographically secure random session token.
 *
 * This function creates a 20-byte random token and encodes it as a lowercase base32 string.
 * The resulting token is suitable for use as a session identifier.
 *
 * @returns {string} A random session token
 */
export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  return encodeBase32(tokenBytes).toLowerCase();
}


/**
 * Creates a new session for a user and stores it in KV storage.
 *
 * This function:
 * 1. Generates a session ID from the token
 * 2. Creates a session object with a 30-day expiration
 * 3. Stores the session in KV storage
 * 4. Updates the user's session list to include this session
 *
 * @param {AstroContext} context - The Astro context object
 * @param {string} token - The session token
 * @param {string} userId - The ID of the user for whom to create the session
 * @returns {Promise<Session>} The created session object
 */
export async function createSession(context: AstroContext, token: string, userId: string): Promise<Session> {
  const KV = context.locals.runtime.env.KV;
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  // Create a new session with 30-day expiration
  const session: Session = {
    id: sessionId,
    userId: userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
  };

  // Store the session in KV storage with 7-day TTL
  await KV.put(`session:${sessionId}`, JSON.stringify(session), {
    expirationTtl: 7 * 24 * 60 * 60 // 7 days
  });

  // Get existing sessionIds for this user
  const userSessionsKey = `user-sessions:${userId}`;
  const existingSessions = await KV.get(userSessionsKey);
  let sessionIds: string[] = [];
  if (existingSessions) {
    try {
      sessionIds = JSON.parse(existingSessions);
    } catch (error) {
      console.error('Failed to parse existing sessions JSON:', error);
      // Use empty array as default
    }
  }

  // Add this sessionId to the user's session list if not already present
  if (!sessionIds.includes(sessionId)) {
    sessionIds.push(sessionId);
    await KV.put(userSessionsKey, JSON.stringify(sessionIds), {
      expirationTtl: 30 * 24 * 60 * 60 // 30 days TTL for the index
    });
  }

  return session;
}

/**
 * Creates a new user account and session for a Tiltify user.
 *
 * This function:
 * 1. Creates a new user record in the database
 * 2. Creates an account record linking the user to their Tiltify account
 * 3. Stores the Tiltify access and refresh tokens
 * 4. Creates a new session for the user
 *
 * @param {AstroContext} ctx - The Astro context object
 * @param {string} token - The session token to use
 * @param {TiltifyUserData} twitchUser - The user's Tiltify user
 * @param {TiltifyToken} twitchToken - The Tiltify access and refresh tokens
 * @returns {Promise<Session|null>} The created session object, or null if an error occurred
 */
export async function createNewUserSession(
  ctx: AstroContext,
  token: string,
  twitchUser: TwitchAPIUser,
  twitchToken: TwitchAPIToken,
): Promise<Session | null> {
  const KV = ctx.locals.runtime.env.KV;
  const db = new DB(ctx.locals.runtime.env)

  try {
    // Create a new user record
    const user = await db.addUser(twitchUser)

    // Generate a session ID from the token
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    // Create a new session with 30-day expiration
    const session: Session = {
      id: sessionId,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
    };

    // Store the session in KV storage with 7-day TTL
    await KV.put(`session:${sessionId}`, JSON.stringify(session), {
      expirationTtl: 7 * 24 * 60 * 60 // 7 days
    });

    // Store the session in KV storage with 7-day TTL
    await KV.put(`token:${user.id}`, JSON.stringify(twitchToken), {
      expirationTtl: twitchToken.expires_in
    });

    return session;
  } catch (error) {
    console.error('createNewUserSession', error);
    return null;
  }
}
