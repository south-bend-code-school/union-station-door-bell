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
      if(snapshot.exists()) {
        rp({
          method: 'POST',
          uri: snapshot.child('webhookUrl').val(),
          body: {
            text: `<!channel>: ${userName} is waiting downstairs.`,
            attachments: [
              {
                text: 'Please respond.',
                fallback: 'You are unable to respond.',
                callback_id: event.params.alertId,
                color: '#FF0000',
                attachment_type: 'default',
                actions: [
                  {
                    name: 'respond',
                    text: 'I\'m coming!',
                    type: 'button',
                    value: 'true'
                  }
                ]
              }
            ]
          },
          json: true
        }).then(resolve,reject);
      } else {
        rp({
          method: 'POST',
          uri: functions.config().webhookUrl,
          body: {
            text: `<!channel>: ${companyId} is not setup yet.`
          },
          json: true
        }).then(resolve,reject);
      }
    }).catch(reject);
  });
});


exports.respond = functions.https.onRequest((req, res) => {
  const payload = JSON.parse(req.body.payload);

  const user = payload.user;
  const alertId = payload.callback_id;
  var waitingName = null;

  return admin.database().ref('alerts').child(alertId).transaction(function(data){
    if(!data){
      return null;
    }
    waitingName = data.name;
    data.response = `${user.name} is coming to get you.`
    return data;
  }, function(err, committed, snapshot) {
    if(err) {
      console.error(err);
      return res.status(200).send('Something happened while responding.')
    }

    if(!committed) {
      console.error('Failed to commit the response.')
      return res.status(200).send('Failed to respond correctly.')
    }

    res.status(200).send(`<@${user.id}|${user.name}> is headed to get ${waitingName}.`)
  });
});
