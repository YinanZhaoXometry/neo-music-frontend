<template>
  <div class="search-box" @click="focus">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder" />
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from 'common/js/util'

export default {
  props: {
    placeholder: {
      type: String,
      default: 'Search for songs, singers',
    },
  },
  data() {
    return {
      query: '',
    }
  },
  methods: {
    clear() {
      this.query = ''
    },
    setQuery(query) {
      this.query = query
    },
    focus() {
      this.$refs.query.focus()
    },
    blur() {
      this.$refs.query.blur()
    },
  },
  created() {
    this.$watch(
      'query',
      debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 200)
    )
  },
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $color-highlight-background;
  border-radius: 6px;

  .icon-search {
    font-size: 24px;
    color: $color-text-l;
  }

  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;

    &::placeholder {
      color: $color-text-d;
    }
  }

  .icon-dismiss {
    font-size: 16px;
    color: $color-text-l;
  }
}
</style>
