<script>
import firebase from '@/firebase'
import Vue from 'vue'

export default {
  name: 'Home',
  data () {
    return {
      loaded: false,
      companies: [],
      logoSrcs: []
    }
  },
  firebase: function () {
    return {
      companies: {
        source: firebase.database().ref('companies'),
        readyCallback: function () {
          this.loaded = true
          this.$nextTick(function () {
            window.$('.collapsible').collapsible()
          })
        }
      }
    }
  },
  watch: {
    companies: function (newCompanies) {
      newCompanies.forEach(function (company, index) {
        firebase.storage().ref('logos').child(company.logo).getDownloadURL().then(function (url) {
          Vue.set(this.logoSrcs, index, url)
          this.$nextTick(function () {
            setTimeout(function () {
              window.$('#company-' + index).addClass('scale-in')
            }, 500)
          })
        }.bind(this))
      }, this)
    }
  },
  methods: {
    sendAlert: function (company) {
      firebase.database().ref('alerts').push({
        company: company['.key'],
        time: Date.now()
      })
    }
  }
}
</script>

<template lang="pug">
  #home
    spinner(v-if='!loaded')
    .container(v-else)
      .row
        .col.s12.m6.scale-transition.scale-out(v-for='(company, index) in companies',:id="'company-'+index")
          .card(v-if='logoSrcs[index]')
            .card-image.blue-grey.lighten-2(v-bind:style='{minHeight: "40vh", backgroundImage: "url("+logoSrcs[index]+")", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat"}')
              span.card-title
                .truncate {{company.name}}
              .btn-floating.halfway-fab.btn-small.waves-effect.waves-light.red.pulse(@click='sendAlert(company)')
                i.material-icons notifications_active
            .card-content.white-text.blue-grey.lighten-1
              p {{company.description}}
          spinner(v-else)
</template>

<style lang="scss" scoped>
#home {
  width: 100%;
}
</style>
