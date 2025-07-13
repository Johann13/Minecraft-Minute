import type {
  TwitchAPIAppToken,
  TwitchAPIClip,
  TwitchAPIError,
  TwitchAPIResponse,
  TwitchAPIToken,
  TwitchAPIUser,
  TwitchAPIVideo
} from "../model/twitch.ts";

export class TwitchWebService {
  private env: Env
  private clientId: string
  private clientSecret: string

  constructor(env: Env) {
    this.env = env;
    this.clientId = env.TWITCH_CLIENT_ID
    this.clientSecret = env.TWITCH_CLIENT_SECRET
  }

  private async parseResponse<T>(response: Response): Promise<TwitchAPIResponse<T>> {
    const body = await response.json();
    if (!response.ok) {
      return {
        data: null,
        error: body as TwitchAPIError,
      }
    }
    return {
      error: null,
      data: body as T
    }
  }

  private async parseResponseSingle<T>(response: Response): Promise<TwitchAPIResponse<T>> {
    const body = await response.json();
    if (!response.ok) {
      return {
        data: null,
        error: body as TwitchAPIError,
      }
    }
    const arr = (body as any)['data'] as any[]
    if (arr.length === 0) {
      return {
        error: {
          error: 'string',
          status: 0,
          message: 'string'
        },
        data: null
      }
    }
    return {
      error: null,
      data: (arr[0]) as T
    }

  }

  private async getAppToken(): Promise<TwitchAPIResponse<TwitchAPIAppToken>> {
    const url = "https://id.twitch.tv/oauth2/token?" +
      "client_id=" + this.clientId  +
      "&client_secret=" + this.clientSecret +
      "&grant_type=client_credentials";

    const response = await fetch(url, {method: "POST"});

    return this.parseResponse(response);
  }

  private async getToken() {

    const KV = this.env.KV
    const cachedToken = await KV.get<TwitchAPIAppToken>('APP_TOKEN', {
      type: 'json'
    });

    if (!cachedToken) {
      const tokenResponse = await this.getAppToken()

      if (!tokenResponse.data) {
        console.error('Failed to get token');
        return null
      }

      const token = tokenResponse.data
      await KV.put('APP_TOKEN', JSON.stringify(token), {
        expirationTtl: token.expires_in
      })
      return token;
    }
    return cachedToken;
  }

  async getTokenFromCode(code: string): Promise<TwitchAPIResponse<TwitchAPIToken>> {
    // https://id.twitch.tv/oauth2/token

    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({
        client_id: this.clientId ,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.env.TWITCH_REDIRECT_URI,
      })
    });

    return this.parseResponse(response);
  }

  async getUserByToken(token: string): Promise<TwitchAPIResponse<TwitchAPIUser>> {
    const userRes = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Client-ID': this.clientId
      }
    })
    return this.parseResponseSingle(userRes);
  }


  async getClip(id: string): Promise<TwitchAPIResponse<TwitchAPIClip>> {
    // GET https://api.twitch.tv/helix/clips
    const token = await this.getToken();
    if (!token) {
      return {
        data: null,
        error: {
          status: 404,
          error: 'No Token',
          message: 'No token found'
        }
      }
    }

    const response = await fetch(`https://api.twitch.tv/helix/clips?id=${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        'Client-ID': this.clientId
      }
    })
    return this.parseResponseSingle(response);
  }

  async getVideo(id: string): Promise<TwitchAPIResponse<TwitchAPIVideo>> {
    // GET https://api.twitch.tv/helix/videos
    const token = await this.getToken();
    if (!token) {
      return {
        data: null,
        error: {
          status: 404,
          error: 'No Token',
          message: 'No token found'
        }
      }
    }
    const response = await fetch(`https://api.twitch.tv/helix/videos?id=${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        'Client-ID': this.clientId
      }
    })
    return this.parseResponseSingle(response);
  }
}
