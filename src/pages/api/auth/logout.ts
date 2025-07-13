import type {APIRoute} from "astro";
import {deleteSessionTokenCookie, invalidateSession} from "../../../lib/model/Session.ts";


export const ALL: APIRoute = async (context) => {
  if (context.locals.session === null) {
    return context.redirect('/')
  }
  await invalidateSession(context, context.locals.session.id);
  deleteSessionTokenCookie(context);
  return context.redirect('/')
}
