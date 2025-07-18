import type {APIRoute} from "astro";
import {DB} from "../../../lib/db/DB.ts";

// Define the ClipObject type to match the DB.addClip parameter
type ClipObject = {
  clipId: string;
  clipUrl: string;
  clipEmbedUrl: string;
  clipTitle: string;
  clipThumbnailUrl: string;
  clipCreatedAt: string;
  broadcasterId: string;
  broadcasterName: string;
  creatorId: string;
  creatorName: string;
  videoId: string;
  vodOffset: number;
  videoCreatedAt: string;
};

// Function to validate if an object is a valid ClipObject
function isValidClipObject(obj: any): obj is ClipObject {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.clipId === 'string' &&
    typeof obj.clipUrl === 'string' &&
    typeof obj.clipEmbedUrl === 'string' &&
    typeof obj.clipTitle === 'string' &&
    typeof obj.clipThumbnailUrl === 'string' &&
    typeof obj.clipCreatedAt === 'string' &&
    typeof obj.broadcasterId === 'string' &&
    typeof obj.broadcasterName === 'string' &&
    typeof obj.creatorId === 'string' &&
    typeof obj.creatorName === 'string' &&
    typeof obj.videoId === 'string' &&
    typeof obj.vodOffset === 'number' &&
    typeof obj.videoCreatedAt === 'string'
  );
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

  try {
    const body = await ctx.request.json();

    // Validate that the body is a valid clip object
    if (!isValidClipObject(body)) {
      return new Response('Invalid clip object', {
        status: 400,
      });
    }

    // Add the clip to the database
    const result = await db.addClip(body);

    return new Response(JSON.stringify({ success: true, clip: result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error adding clip:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to add clip' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
