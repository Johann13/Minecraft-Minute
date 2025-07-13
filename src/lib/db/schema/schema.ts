import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {sql} from "drizzle-orm";

export const users = sqliteTable('users', {
  id: text('id').notNull().primaryKey(), // twitch id
  login: text('login').notNull(), // twitch login
  displayName: text('display_name').notNull(),
  profileImageUrl: text('profile_image_url'),
});

export const clips = sqliteTable('clips', {
  clipId: text('id').notNull().primaryKey(),
  clipUrl: text('clip_url').notNull(),
  clipEmbedUrl: text('clip_embed_url').notNull(),
  clipTitle: text('clip_title').notNull(),
  clipThumbnailUrl: text('clip_thumbnail_url').notNull(),
  clipCreatedAt: text('clip_created_at').notNull(),

  broadcasterId: text('broadcaster_id').notNull(),
  broadcasterName: text('broadcaster_name').notNull(),
  creatorId: text('creator_id').notNull(),
  creatorName: text('creator_name').notNull(),

  videoId: text('video_id').notNull(),
  vodOffset: integer('vod_offset').notNull(),

  videoCreatedAt: text('video_created_at').notNull(),
})


export const trustedUsers = sqliteTable('trusted_users', {
  id: text('id').notNull(), // twitch id
  login: text('login').notNull(), // twitch login
})
