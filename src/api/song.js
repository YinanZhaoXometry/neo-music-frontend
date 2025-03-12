import { commonParams } from './config'
import { getUid } from 'common/js/uid'
import axios from 'axios'
import { ERR_OK } from 'api/config'

axios.defaults.withCredentials = true
axios.defaults.responseType = 'json;text/plain;charset=utf-8;'

const debug = process.env.NODE_ENV !== 'production'

export function getLyric(mid) {
  const url = debug ? '/api/lyric' : 'http://ustbhuangyi.com/music/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}

export function getSongsUrl(songs) {
  const url = debug
    ? '/api/getMusicPlay'
    : 'http://ustbhuangyi.com/music/api/getPurlUrl'

  let mids = []
  let types = []
  const newSongs = songs.slice(0, 10)
  newSongs.forEach(song => {
    mids.push(song.mid)
    types.push(0)
  })

  const urlMid = genUrlMid(mids, [0])

  const data = Object.assign({}, commonParams, {
    g_tk: 1928093487,
    format: 'json',
    platform: 'yqq.json',
    needNewCode: 0,
    uin: 0
  })

  return new Promise((resolve, reject) => {
    let tryTime = 3
    function request() {
      return axios
        .get(url, {
          loginUin: '0',
          hostUin: 0,
          inCharset: 'utf8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'yqq.json',
          needNewCode: 0,
          headers: {
            referer: 'https://y.qq.com/portal/player.html',
            host: 'u.y.qq.com',
            'content-type': 'application/x-www-form-urlencoded',
            cookie: '',
            cookies: ''
          },
          params: { songmid: mids.join(',') }
        })
        .then(response => {
          const res = response.data
          if (res.code === ERR_OK) {
            let urlMid = res.req_0
            if (urlMid && urlMid.code === ERR_OK) {
              const infoList = urlMid.data.midurlinfo
              console.log('info: ', infoList)
              if (infoList.some(info => info.purl)) {
                resolve(res)
              } else {
                retry()
              }
            } else {
              retry()
            }
          } else {
            retry()
          }
        })
    }

    function retry() {
      if (--tryTime >= 0) {
        request()
      } else {
        reject(new Error('Can not get the songs url'))
      }
    }

    request()
  })
}

function genUrlMid(mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}
