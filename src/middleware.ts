// mostly copied fom jj.ostof.dev (unreleased version)

import {defineMiddleware} from "astro:middleware";
import {deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken} from "./lib/model/Session.ts";

/**
 * Middleware that handles session validation and user authentication.
 *
 * This middleware:
 * 1. Checks for a session cookie
 * 2. Validates the session token if present
 * 3. Sets the user and session in context.locals
 * 4. Refreshes the session cookie if needed
 *
 * @param {AstroContext} context - The Astro context object
 * @param {Function} next - The function to call to continue to the next middleware or route handler
 * @returns {Promise<Response>} The response from the next middleware or route handler
 */
export const onRequest = defineMiddleware(async (context, next) => {
  // console.log('onRequest', context.url)
  const token = context.cookies.get("session")?.value ?? null;
  try {
    if (token === null) {
      context.locals.session = null;
      context.locals.user = null;
      return next();
    }
    const {user, session} = await validateSessionToken(context, token);
    if (session !== null) {
      setSessionTokenCookie(context, token, session.expiresAt);
    } else {
      deleteSessionTokenCookie(context);
    }
    context.locals.session = session;
    context.locals.user = user;
  } catch (e) {
    console.error('middleware', e);
    // Ensure locals are set to null in case of error
    context.locals.session = null;
    context.locals.user = null;
  }


  return next();
});
