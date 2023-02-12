import { isAxiosError } from 'axios'
import { isFullUser } from 'twitter-d'
import { getConfig } from './config'
import { Logger } from './logger'
import { TwApi } from './twapi'
;(async () => {
  const logger = Logger.configure('main')
  logger.info('✨ main()')

  const config = getConfig()

  const twapi = new TwApi({
    baseUrl: config.twapi.baseUrl,
    username: config.twapi.basicUsername,
    password: config.twapi.basicPassword
  })
  const tweets = await twapi.searchTweet('#jaoafa -from:jaoafa', 10)
  console.log(`📰 Tweets: ${tweets.length}`)
  const promises = []
  for (const tweet of tweets) {
    if (!isFullUser(tweet.user)) continue
    if (!tweet.full_text.includes('#jaoafa')) continue
    logger.info(`🔄 Retweet: ${tweet.id_str} by ${tweet.user.screen_name}`)
    promises.push(
      twapi.retweet(tweet.id_str).catch((err) => {
        if (isAxiosError(err)) {
          logger.warn(`${tweet.id_str}: ${err.response?.data.message}`)
          return
        }
        logger.warn(`${tweet.id_str}: ${err.message}`)
      })
    )
  }
  await Promise.all(promises)
})()
