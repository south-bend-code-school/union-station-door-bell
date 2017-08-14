<template lang="pug">
  .preloader-wrapper.small.active
    .spinner-layer(style="border-color:blue;")
      .circle-clipper.left
        .circle
      .gap-patch
        .circle
      .circle-clipper.right
        .circle
</template>

<script>
export default {
  name: 'spinner'
}
</script>


<style lang="scss" scoped>
</style>
