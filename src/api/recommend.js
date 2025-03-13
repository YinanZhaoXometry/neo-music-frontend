import { makeAPIEndpoint } from './config'
import axios from 'axios'

export function getRecommend() {
  return axios.get(makeAPIEndpoint('getRecommend')).then(res => {
    return Promise.resolve(res.data.response)
  })
}

export function getDiscList() {
  return axios.get(makeAPIEndpoint('getRecommendPlaylists')).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSongList(disstid) {
  return axios
    .get(makeAPIEndpoint('getSongListDetail'), {
      params: { disstid }
    })
    .then(res => {
      return Promise.resolve(res.data.response)
    })
}
