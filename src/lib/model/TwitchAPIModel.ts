export type TwitchAPIClip = {
  id: string
  url: string
  embed_url: string
  broadcaster_id: string
  broadcaster_name: string
  creator_id: string
  creator_name: string
  video_id: string
  game_id: string
  language: string
  title: string
  view_count: number
  created_at: string
  thumbnail_url: string
  duration: number
  vod_offset: number
  is_featured: boolean
}

export type TwitchAPIVideoMutedSegment = {
  duration: number
  offset: number
}

export type TwitchAPIVideo = {
  id: string
  stream_id: string | null
  user_id: string
  user_login: string
  user_name: string
  title: string
  description: string
  created_at: string
  published_at: string
  url: string
  thumbnail_url: string
  viewable: string
  view_count: number
  language: string
  type: string
  duration: string
  muted_segments: TwitchAPIVideoMutedSegment[]
}

export type TwitchAPIUser = {
  id: string
  login: string
  display_name: string
  type: string
  broadcaster_type: string
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: number
  email: string
  created_at: string
}

export type TwitchAPIToken = {
  access_token: string
  expires_in: number
  refresh_token: string
  token_type: string
}

export type TwitchAPIAppToken = {
  access_token: string
  expires_in: number
  token_type: string
}

type TwitchAPIData<T> = {
  data: T,
  error: null,
}
export type TwitchAPIError = {
  error: string
  status: number
  message: string
}

export type TwitchAPIErrorResponse = {
  data: null,
  error: TwitchAPIError
}

export type TwitchAPIResponse<T> = TwitchAPIData<T> | TwitchAPIErrorResponse
