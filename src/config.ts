import fs from 'fs'
import { Logger } from './logger'

export const PATH = {
  config: process.env.CONFIG_PATH || 'data/config.json'
}

export interface Configuration {
  twapi: {
    baseUrl: string
    basicUsername: string
    basicPassword: string
  }
}

const isConfig = (config: any): config is Configuration => {
  const logger = Logger.configure('isConfig')
  const checks: {
    [key: string]: boolean
  } = {
    'config is defined': !!config,
    'twapi is defined': !!config.twapi,
    'twapi.baseUrl is defined': !!config.twapi.baseUrl,
    'twapi.baseUrl is string': typeof config.twapi.baseUrl === 'string',
    'twapi.basicUsername is defined': !!config.twapi.basicUsername,
    'twapi.basicUsername is string':
      typeof config.twapi.basicUsername === 'string',
    'twapi.basicPassword is defined': !!config.twapi.basicPassword,
    'twapi.basicPassword is string':
      typeof config.twapi.basicPassword === 'string',
  }
  const result = Object.values(checks).every(Boolean)
  if (!result) {
    logger.error('Invalid config. Missing check(s):')
    for (const [key, value] of Object.entries(checks)) {
      if (!value) {
        logger.error(`- ${key}`)
      }
    }
  }
  return result
}

export function getConfig(): Configuration {
  if (!fs.existsSync(PATH.config)) {
    throw new Error(`Config file not found: ${PATH.config}`)
  }
  const config = JSON.parse(fs.readFileSync(PATH.config, 'utf8'))
  if (!isConfig(config)) {
    throw new Error('Invalid config')
  }
  return config
}
