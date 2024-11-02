<template>
  <div class="vp-footer">
    Made with ❤️ by <a target="_blank" :href="link">{{username}}</a>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        link: 'https://github.com/neilveil',
        username: 'neilveil'
      }
    }
  }
</script>
