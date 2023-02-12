import axios, { AxiosInstance } from 'axios'
import { Status } from 'twitter-d'

export interface TwApiOptions {
  baseUrl: string
  username: string
  password: string
}

export class TwApi {
  private axios: AxiosInstance

  constructor(options: TwApiOptions) {
    this.axios = axios.create({
      baseURL: options.baseUrl,
      auth: {
        username: options.username,
        password: options.password
      }
    })
  }

  async searchTweet(query: string, limit: number): Promise<Status[]> {
    const response = await this.axios.get(
      `/search/${encodeURIComponent(query)}`,
      {
        params: {
          limit
        }
      }
    )
    return response.data
  }

  async retweet(tweetId: string): Promise<void> {
    await this.axios.post(
      `/tweets/${tweetId}/retweet`,
      {},
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
