const Rx = require("rxjs/Rx");
const R = require("ramda");

const broidCallr = require("broid-callr");
const broidDiscord = require("broid-discord");
const broidFlowdock = require("broid-flowdock");
const broidLine = require("broid-line");
const broidKik = require("broid-kik");
const broidMessenger = require("broid-messenger");
const broidSkype = require("broid-skype");
const broidSlack = require("broid-slack");
const broidTelegram = require("broid-telegram");
const broidTwilio = require("broid-twilio");
const broidTwitter = require("broid-twitter");
const broidViber = require("broid-viber");

const clients = {
  callr: new broidCallr({}),
  discord: new broidDiscord({}),
  flowdock: new broidFlowdock({}),
  line: new broidLine({}),
  kik: new broidKik({}),
  messenger: new broidMessenger({}),
  skype: new broidSkype({}),
  slack: new broidSlack({}),
  telegram: new broidTelegram({})
  twitter: new broidTwitter({}),
  twilio: new broidTwilio({}),
  viber: new broidViber({}),
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
