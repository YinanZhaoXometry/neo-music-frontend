import jsonp from 'common/js/jsonp'
import { commonParams, ERR_OK, options } from './config'
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'

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
  // const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  // const data = Object.assign({}, commonParams, {
  //   hostUin: 0,
  //   needNewCode: 0,
  //   platform: 'yqq',
  //   order: 'listen',
  //   begin: 0,
  //   num: 80,
  //   songstatus: 1,
  //   singermid: singerId
  // })
  // return jsonp(url, data, options)

  return new Promise((resolve, reject) => {
    function request() {
      const url = debug
        ? '/api/getSingerHotsong'
        : 'http://ustbhuangyi.com/music/api/getSingerHotsong'

      return axios
        .get(url, {
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
