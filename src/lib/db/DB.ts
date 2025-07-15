import {DrizzleD1Database} from "drizzle-orm/d1";
import {getDB} from "./getDB.ts";
import {clips, trustedUsers, users} from "./schema/schema.ts";
import {eq} from "drizzle-orm";
import {TwitchWebService} from "../web-services/TwitchWebService.ts";
import type {TwitchAPIUser} from "../model/TwitchAPIModel.ts";

export class DB {

  private env: Env
  private db: DrizzleD1Database

  private twitchAPI: TwitchWebService

  constructor(env: Env) {
    this.env = env;
    this.db = getDB(env)
    this.twitchAPI = new TwitchWebService(this.env);
  }

  async addUser(user: TwitchAPIUser) {
    const [x] = await this.db.insert(users)
      .values({
        id: user.id,
        login: user.login,
        displayName: user.display_name,
        profileImageUrl: user.profile_image_url,
      }).onConflictDoUpdate({
        target: users.id,
        set: {
          login: user.login,
          displayName: user.display_name,
          profileImageUrl: user.profile_image_url,
        }
      })
      .returning()
    return x
  }

  getUserById(id: string) {
    return this.db.select()
      .from(users)
      .where(eq(users.id, id))
      .get()
  }

  /**
   * @exampleUrl: https://www.twitch.tv/ravs_/clip/CrepuscularEasyDinosaurPeanutButterJellyTime-9a24HZ8YB_or4ps_
   * @param url
   */
  async addClipFromUrl(url: string) {
    const lastPart = url.lastIndexOf("/")
    if (lastPart === -1) {
      return
    }

    const id = url.substring(lastPart + 1)

    const clipResponse = await this.twitchAPI.getClip(id)
    if (!clipResponse.data) {
      throw new Error('Could not get the clip, please try again.')
    }

    const clip = clipResponse.data

    const videoResponse = await this.twitchAPI.getVideo(clip.video_id)
    console.log('videoResponse', videoResponse)
    if (!videoResponse.data) {
      throw new Error('Could not get the vod of the clip, please try again.')
    }

    const video = videoResponse.data

    return this.db.insert(clips)
      .values({
        clipId: clip.id,
        clipUrl: clip.url,
        clipEmbedUrl: clip.embed_url,
        clipTitle: clip.title,
        clipThumbnailUrl: clip.thumbnail_url,
        clipCreatedAt: clip.created_at,


        broadcasterId: clip.broadcaster_id,
        broadcasterName: clip.broadcaster_name,
        creatorName: clip.creator_name,
        creatorId: clip.creator_id,

        videoId: clip.video_id,
        vodOffset: clip.vod_offset,
        videoCreatedAt: video.created_at,
      }).returning()
  }

  async isTrusted(twitchId: string) {
    const result = await this.db
      .select().from(trustedUsers)
      .where(eq(trustedUsers.id, twitchId))
      .get()
    return result !== undefined
  }

  getTrustedUsers() {
    return this.db
      .select().from(trustedUsers)
      .all()
  }

  async getClips(order: 'newestfirst' | 'oldestfirst' = 'oldestfirst') {
    const clipsResult = await this.db
      .select().from(clips)
      .all()

    const startIndex = 2


    if (order === 'oldestfirst') {
      return clipsResult.toSorted((a, b) => {
        const aVideoCreatedAt = new Date(a.videoCreatedAt)
        const aOffset = a.vodOffset
        const aDate = new Date(aVideoCreatedAt.getTime() + (aOffset * 1000))

        const bVideoCreatedAt = new Date(b.videoCreatedAt)
        const bOffset = b.vodOffset
        const bDate = new Date(bVideoCreatedAt.getTime() + (bOffset * 1000))

        return aDate.getTime() - bDate.getTime()
      })
    } else {
      return clipsResult.toSorted((a, b) => {
        const aVideoCreatedAt = new Date(a.videoCreatedAt)
        const aOffset = a.vodOffset
        const aDate = new Date(aVideoCreatedAt.getTime() + (aOffset * 1000))

        const bVideoCreatedAt = new Date(b.videoCreatedAt)
        const bOffset = b.vodOffset
        const bDate = new Date(bVideoCreatedAt.getTime() + (bOffset * 1000))

        return bDate.getTime() - aDate.getTime()
      })
    }
  }
}
