const Rx = require("rxjs/Rx");
const R = require("ramda");

const Rx = require("rxjs/Rx");
const R = require("ramda");
const BroidCallr = require("broid-callr");
const BroidDiscord = require("broid-discord");
const BroidFlowdock = require("broid-flowdock");
const BroidLine = require("broid-line");
const BroidKik = require("broid-kik");
const BroidMessenger = require("broid-messenger");
const BroidSkype = require("broid-skype");
const BroidSlack = require("broid-slack");
const BroidTelegram = require("broid-telegram");
const BroidTwilio = require("broid-twilio");
const BroidTwitter = require("broid-twitter");
const BroidViber = require("broid-viber");

const clients = {
  callr: new BroidCallr({<config>}),
  discord: new BroidDiscord({<config>}),
  flowdock: new BroidFlowdock({<config>});
  line: new BroidLine({<config>}),
  kik: new BroidKik({<config>}),
  messenger: new BroidMessenger({<config>}),
  skype: new BroidSkype({<config>}),
  slack: new BroidSlack({<config>}),
  telegram: new BroidTelegram({<config>})
  twitter: new BroidTwitter({<config>}),
  twilio: new BroidTwilio({<config>}),
  viber: new BroidViber({<config>}),
};

Rx.Observable.merge(...R.map(client => client.connect(), R.values(clients)))
.subscribe({
  next: data => console.log(JSON.stringify(data, null, 2)),
  error: err => console.error(`Something went wrong: ${err.message}`),
});


Rx.Observable.merge(...R.map(client => client.listen(), R.values(clients)))
.subscribe({
  next: message => {
    if (message.type === "Create") {
      const to = R.path(["target", "id"], data);
      const to_type = R.path(["target", "type"], data);
      const content = R.path(["object", "content"], data);
      const service_id = R.path(["generator", "id"], data);
      const service_name = R.path(["generator", "name"], data);
      const type = R.path(["object", "type"], data);

      if (type === "Note" && content.toLowerCase() === "hello world") {
        const message = {
          "@context": "https://www.w3.org/ns/activitystreams",
          "type": "Create",
          "generator": {
            "id": service_id,
            "type": "Service",
            "name": service_name
          },
          "object": {
            "type": "Note",
            "content": "Hello, how are you?"
          },
          "to": {
            "type": to_type,
            "id": to
          }
        };

        clients[service_name].send(message)
          .then(console.log)
          .catch(console.error);
      }

    }
  },
  error: err => console.error(`Something went wrong: ${err.message}`),
});
