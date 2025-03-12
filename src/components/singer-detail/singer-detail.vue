<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { getSingerDetail } from 'api/singer'
import Song, { filterSinger, processSongsUrl } from 'common/js/song'
import { mapGetters } from 'vuex'

export default {
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters(['singer']),
  },
  data() {
    return {
      songs: [],
    }
  },
  created() {
    this._getDetail()
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        console.log('res: ', res)
        processSongsUrl(this._normalizeSongs(res.singer.data.songlist)).then(
          (songs) => {
            console.log('songs: ', songs)
            this.songs = songs.filter((song) => Boolean(song.url))
          }
        )
      })
    },
    _normalizeSongs(list) {
      let ret = []
      console.log('list: ', list)

      const isValidMusic = (data) =>
        data.ksong.id &&
        data.album.mid &&
        (!data.pay || data.pay.price_album === 0)

      const createSong = (data) =>
        new Song({
          id: data.ksong.id,
          mid: data.ksong.mid,
          singer: filterSinger(data.singer),
          name: data.name,
          album: data.album.name,
          duration: data.interval,
          image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.album.mid}.jpg?max_age=2592000`,
          url: data.url,
        })

      list.forEach((item) => {
        if (isValidMusic(item)) {
          ret.push(createSong(item))
        }
      })
      return ret
    },
  },
  components: {
    MusicList,
  },
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
