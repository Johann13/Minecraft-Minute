import type {APIRoute} from "astro";
import {generateState} from "arctic";

export const  GET: APIRoute = (ctx) => {
  const state = generateState();

  const params = new URLSearchParams({
    client_id: ctx.locals.runtime.env.TWITCH_CLIENT_ID,
    redirect_uri: ctx.locals.runtime.env.TWITCH_REDIRECT_URI,
    response_type: 'code',
    // scope: 'user:read:email',
    state
  });

  const url = new URL(`https://id.twitch.tv/oauth2/authorize?${params.toString()}`,);

  ctx.cookies.set("twitch_oauth_state", state, {
    httpOnly: true,
    maxAge: 60 * 10,
    secure: import.meta.env.PROD,
    path: "/",
    sameSite: "lax"
  });

  return ctx.redirect(url.toString());
}
