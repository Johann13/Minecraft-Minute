import {ActionError, defineAction} from "astro:actions";
import {z} from "astro:content";
import {DB} from "../lib/db/DB.ts";

export const server = {
  addClip: defineAction({
    input: z.string(),
    handler: (url, context) => {

      const {user} = context.locals
      if (!user) {
        throw new ActionError({
          code: 'UNAUTHORIZED'
        })
      }

      const db = new DB(context.locals.runtime.env)
      try {
        return db.addClipFromUrl(url)
      } catch (e: any) {
        console.error(e)
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: e?.message ?? 'Could not add clip, please try again.',
        })
      }
    }
  }),

  getTrustedUsers: defineAction({
    handler: (_, context) => {
      const db = new DB(context.locals.runtime.env)
      return db.getTrustedUsers()
    }
  }),

  getClips: defineAction({
    input: z.string(),
    handler: (order, context) => {
      const db = new DB(context.locals.runtime.env)

      if (!(order === 'newestfirst' || order === 'oldestfirst')) {
        throw new ActionError({
          code: 'BAD_REQUEST'
        })
      }


      return db.getClips(order)
    }
  })
}
