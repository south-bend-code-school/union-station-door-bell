<script>
import firebase from '@/firebase'
import Vue from 'vue'

export default {
  name: 'Home',
  data () {
    return {
      loaded: false,
      companies: [],
      logoSrcs: [],
      name: '',
      company: null
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
    openDialog: function (company) {
      this.company = company
      this.$nextTick(() => {
        window.$('#modal1').modal('open')
      })
    },
    sendAlert: function () {
      firebase.database().ref('alerts').push({
        company: this.company['.key'],
        name: this.name,
        time: Date.now()
      }).then(() => {
        this.name = ''
        this.company = null
        this.$nextTick(() => {
          window.$('#modal1').modal('close')
          window.Materialize.toast('Someone will be down shortly!', 2000)
        })
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      window.$('.modal').modal()
    })
  }
}
</script>

<template lang="pug">
  #home
    div
      spinner(v-if='!loaded')
      .container(v-else)
        .row
          .col.s12.m6.scale-transition.scale-out(v-for='(company, index) in companies',:id="'company-'+index")
            .card(v-if='logoSrcs[index]')
              .card-image.blue-grey.lighten-2(v-bind:style='{minHeight: "40vh", backgroundImage: "url("+logoSrcs[index]+")", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat"}')
                span.card-title
                  .truncate {{company.name}}
                .btn-floating.halfway-fab.btn-small.waves-effect.waves-light.red.pulse(@click='openDialog(company)')
                  i.material-icons notifications_active
              .card-content.white-text.blue-grey.lighten-1
                p {{company.description}}
            spinner(v-else)
    #modal1.modal.bottom-sheet
      .modal-content
        h4 Your Name?
        .input-field
          input#user-name(v-model='name',type='text')
          label(for='user-name') Your Name
      .modal-footer
        a.modal-action.modal-close.waves-effect.waves-green.btn-flat(@click='sendAlert()') Ring!
</template>

<style lang="scss" scoped>
#home {
  width: 100%;
}
</style>
