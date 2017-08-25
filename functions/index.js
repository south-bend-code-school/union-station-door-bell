const functions = require('firebase-functions');
const admin = require('firebase-admin');
const rp = require('request-promise');

admin.initializeApp(functions.config().firebase)

exports.postToSlack = functions.database.ref('alerts/{alertId}')
.onCreate(function (event) {
  const companyId = event.data.child('company').val()
  const userName = event.data.child('name').val()
  const time = new Date(event.data.child('time').val())

  return new Promise(function (resolve, reject) {
    admin.database().ref('slackInfo').child(companyId).once('value',function (snapshot) {
      rp({
        method: 'POST',
        uri: snapshot.child('webhookUrl').val(),
        body: {
          text: `<!channel>: ${userName} is waiting downstairs.`
        },
        json: true
      }).then(resolve,reject);
    }).catch(reject)
  })
})