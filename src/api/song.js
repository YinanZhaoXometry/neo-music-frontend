import { makeAPIEndpoint } from './config'
import axios from 'axios'
import { ERR_OK } from 'api/config'

axios.defaults.withCredentials = true
axios.defaults.responseType = 'json;text/plain;charset=utf-8;'

export function getLyric(mid) {
  return axios
    .get(makeAPIEndpoint('getLyric'), {
      params: { songmid: mid }
    })
    .then(res => {
      console.log('axios res.data: ', res.data)
      return Promise.resolve(res.data.response)
    })
}

export function getSongsUrl(songs) {
  let mids = []
  let types = []
  songs.forEach(song => {
    mids.push(song.mid)
    types.push(0)
  })

  return new Promise((resolve, reject) => {
    let tryTime = 3
    function request() {
      return axios
        .get(makeAPIEndpoint('getMusicPlay'), {
          params: { songmid: mids.join(',') }
        })
        .then(response => {
          const res = response.data
          if (res.code === ERR_OK) {
            let urlMid = res.req_0
            if (urlMid && urlMid.code === ERR_OK) {
              const infoList = urlMid.data.midurlinfo
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
