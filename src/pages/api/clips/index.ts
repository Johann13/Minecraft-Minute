import type {APIRoute} from "astro";
import {DB} from "../../../lib/db/DB.ts";

export const GET: APIRoute = async (ctx) => {
  const ADMIN_PW = ctx.locals.runtime.env.ADMIN_PW
  const auth = ctx.request.headers.get("Authorization");
  if (!auth) {
    return new Response('Unauthorized', {
      status: 404,
    });
  }

  if (!auth.startsWith("Bearer")) {
    return new Response('Unauthorized', {
      status: 404,
    })
  }

  const str = auth.replace("Bearer", "")
  const encoded = Buffer.from(str, 'base64').toString('utf8')
  const [id, username, adminPW] = encoded.split(':');

  if (adminPW !== ADMIN_PW) {
    return new Response('Unauthorized', {
      status: 404,
    })
  }


  const db = new DB(ctx.locals.runtime.env)

  const user = await db.getUserById(id)

  if (!user) {
    return new Response('Unauthorized', {
      status: 404,
    })
  }

  if (user.login !== username) {
    return new Response('Unauthorized', {
      status: 404,
    })
  }

  const isTrusted = await db.isTrusted(id)

  if (!isTrusted) {
    return new Response('Unauthorized', {
      status: 404,
    })
  }

  const clips = await db.getClips('oldestfirst')

  return new Response(JSON.stringify(clips), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const POST: APIRoute = async (ctx) => {
  const ADMIN_PW = ctx.locals.runtime.env.ADMIN_PW
  const auth = ctx.request.headers.get("Authorization");
  if (!auth) {
    return new Response('Unauthorized', {
      status: 404,
    });
  }

  if (!auth.startsWith("Bearer")) {
    return new Response('Unauthorized', {
      status: 404,
    })
  }

  const str = auth.replace("Bearer", "")
  const encoded = Buffer.from(str, 'base64').toString('utf8')
  const [id, username, adminPW] = encoded.split(':');

  if (adminPW !== ADMIN_PW) {
    return new Response('Unauthorized', {
      status: 404,
    })
  }


  const db = new DB(ctx.locals.runtime.env)

  const user = await db.getUserById(id)

  if (!user) {
    return new Response('Unauthorized', {
      status: 404,
    })
  }

  if (user.login !== username) {
    return new Response('Unauthorized', {
      status: 404,
    })
  }

  const isTrusted = await db.isTrusted(id)

  if (!isTrusted) {
    return new Response('Unauthorized', {
      status: 404,
    })
  }

  const body = (await ctx.request.json()) as any

  try {
    const resp = await db.addClipFromUrl(body.url)
    return new Response(JSON.stringify(resp), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (e: any) {
    if (e.message) {
      return new Response(`Bad Request, ${e.message}`, {
        status: 404,
      })
    }
    return new Response('Bad Request', {
      status: 404,
    })
  }
}
