import jsonp from 'common/js/jsonp'
import {
  commonParams,
  ERR_OK,
  isDebug,
  makeAPIEndpoint,
  options
} from './config'
import axios from 'axios'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, options)
}

export function getSingerDetail(singerId) {
  return new Promise((resolve, reject) => {
    function request() {
      return axios
        .get(makeAPIEndpoint('getSingerHotsong'), {
          params: { singermid: singerId }
        })
        .then(response => {
          const res = response.data.response

          if (res.code === ERR_OK) {
            resolve(res)
          }
        })
    }

    request()
  })
}
