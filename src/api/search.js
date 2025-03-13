import jsonp from 'common/js/jsonp'
import { commonParams, ERR_OK, makeAPIEndpoint, options } from './config'
import axios from 'axios'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

export function search(query, page, zhida, perpage) {
  return new Promise((resolve, reject) => {
    function request() {
      return axios
        .get(makeAPIEndpoint('getSearchByKey'), {
          params: { key: query }
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
