import type {APIRoute} from "astro";
import {TwitchWebService} from "../../../lib/web-services/TwitchWebService.ts";
import {DB} from "../../../lib/db/DB.ts";
import {
  createNewUserSession,
  createSession,
  generateSessionToken,
  setSessionTokenCookie
} from "../../../lib/model/Session.ts";

export const ALL: APIRoute = async (ctx) => {

  const url = new URL(ctx.request.url);
  const code = url.searchParams.get("code");
  const state = ctx.url.searchParams.get("state");
  const storedState = ctx.cookies.get("twitch_oauth_state")?.value ?? null;

  if (!code || !state || storedState !== state) {
    return new Response('Invalid state or code', {status: 400});
  }

  const twitch = new TwitchWebService(ctx.locals.runtime.env)

  const tokenResp = await twitch.getTokenFromCode(code)

  if (!tokenResp.data) {
    return new Response('Invalid token', {status: 400});
  }

  const token = tokenResp.data

  const userResp = await twitch.getUserByToken(token.access_token)

  if (!userResp.data) {
    return new Response('Invalid User', {status: 400});
  }

  const user = userResp.data
  const db = new DB(ctx.locals.runtime.env)

  const userId = user.id

  const isTrusted =await db.isTrusted(userId)

  if (!isTrusted) {
    return ctx.redirect('/not-trusted')
  }


  const dbUser = await db.getUserById(user.id)
  if (dbUser) {
    const sessionToken = generateSessionToken();
    const session = await createSession(ctx, sessionToken, dbUser.id);
    setSessionTokenCookie(ctx, sessionToken, session.expiresAt);
    return ctx.redirect(`/`);
  }

  const sessionToken = generateSessionToken();
  const session = await createNewUserSession(ctx, sessionToken, user, token);
  if (!session) {
    return ctx.redirect('/');
  }
  setSessionTokenCookie(ctx, sessionToken, session.expiresAt);
  // const stub = await getRPCUserDO(ctx, session.userId)
  return ctx.redirect(`/`);



}
