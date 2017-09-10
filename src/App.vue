<template lang='pug'>
  #app.blue-grey.lighten-5
    header(style='margin:20px 0;')
      .row
        .col.s10.m4.offset-s1.offset-m4
          img(src='/static/images/door113_logo.png',style='width:100%;')
      .row
        .col.s10.m4.offset-s1.offset-m4.center
          | Visiting a business in Building 113? Ring the doorbell and let them know you're here.
          i.material-icons(style='font-size:14px;') notifications_active
    main.valign-wrapper.center-align
      router-view
    footer(style='width:100%;margin:20px 0;')
      div(style='width:200px;margin:auto;')
        img(src='/static/images/createdbyW.svg',style='width:100%;')
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang='scss'>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

#app {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

main {
  flex: 1 0 auto;
}

.code-works-link {
  text-decoration: none;
  color: black;
}

nav, .page-footer {
  background-color: #607d8b;
}
</style>
