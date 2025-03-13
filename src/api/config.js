export const commonParams = {
  g_tk: 1928093487,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

export const options = {
  param: 'jsonpCallback',
  prefix: 'jp'
}

export const ERR_OK = 0

export const isDebug = process.env.NODE_ENV !== 'production'

export function makeAPIEndpoint(path) {
  const baseURL = isDebug
    ? 'http://localhost:3000/api'
    : 'http://localhost:3200'
  const shouldPrependSlash = !path.startsWith('/')

  return `${baseURL}${shouldPrependSlash ? '/' : ''}${path}`
}
