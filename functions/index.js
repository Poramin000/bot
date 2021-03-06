const functions = require('firebase-functions');
const request = require('request-promise');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer 8OcohGJo3N4oJS29nad1NHZDvG6rJTweDvgGO6/dgeBVpVQ89ro02oqqOvVfZuoE5yLkeboJqliLhxr3CAGsU2cGLzracSI58zIX2th6oMywUcZr/PB08TpzTtkGVkunX/2Jl5Sbora/t4nRDtk1egdB04t89/1O/w1cDnyilFU=`
};

exports.webhook = functions.https.onRequest((req, res) => {
  if (req.method === "POST") {
    let event = req.body.events[0]
    if (event.type === "message" && event.message.type === "text") {
      postToDialogflow(req);
    } else {
      reply(req);
    }
  }
  return res.status(200).send(req.method);
});

const reply = req => {
  return request.post({
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: "text",
          text: JSON.stringify(req.body)
        }
      ]
    })
  });
};

const postToDialogflow = req => {
  req.headers.host = "bots.dialogflow.com";
  return request.post({
    uri: "https://bots.dialogflow.com/line/29a1b91c-649e-4d15-8805-e49d8af9dd0d/webhook",
    headers: req.headers,
    body: JSON.stringify(req.body)
  });
};