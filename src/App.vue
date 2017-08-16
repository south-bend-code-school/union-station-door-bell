<template lang='pug'>
  #app
    header
      nav
        .nav-wrapper
          a.brand-logo.center(href='#') 113 Door Bell
    main.valign-wrapper.center-align
      router-view
    footer.page-footer(style='padding-top: 0;')
      .footer-copyright
        .container
          .right
            | Created by 
            span.code-works-link
              | Code Works 
              img(src='/static/images/code-works-logo.png',style='height:1em;')
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
