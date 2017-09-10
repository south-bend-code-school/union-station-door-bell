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
      const companyName = this.company.name
      const alertRef = firebase.database().ref('alerts').push()
      alertRef.set({
        company: this.company['.key'],
        name: this.name,
        time: Date.now()
      }).then(() => {
        this.name = ''
        this.company = null
        this.$nextTick(() => {
          window.$('#modal1').modal('close')
          window.Materialize.toast(companyName + ' has been notified!', 2000)
        })
        const off = alertRef.on('value', (snapshot) => {
          if (snapshot && snapshot.child('response').exists()) {
            off()
            window.Materialize.toast(snapshot.child('response').val(), 2000)
          }
        })
        setTimeout(() => {
          off()
        }, 300000)
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
      .row(v-else)
        .col.s12.m3(
          v-for='(company, index) in companies'
          :id="'company-'+index")
          .card.z-depth-0(
            v-if='logoSrcs[index]'
            style='background-color:white;')
            .btn-floating.btn-small.waves-effect.waves-light.red.pulse(
            @click='openDialog(company)'
            style='position:absolute;top:1em;right:1em;')
              i.material-icons notifications_active
            .card-image(v-bind:style='{minHeight: "30vh", backgroundImage: "url("+logoSrcs[index]+")", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat"}')
            .card-content
              .card-title.center
                b.truncate(
                  style='font-size:18px;'
                ) {{company.name}}
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
