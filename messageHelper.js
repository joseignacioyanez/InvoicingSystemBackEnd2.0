// Code of the Whatsapp API heavily modified from https://developers.facebook.com/blog/post/2022/10/31/sending-messages-with-whatsapp-in-your-nodejs-application/
var axios = require('axios');// To send HTTP requests

function sendMessage(data) {
    console.log(data);
    var config = {
    method: 'post',
    url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
    headers: {
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: data
  };
  return axios(config)
}

function getTextMessageInput(recipient, text) {
  return JSON.stringify({
    "messaging_product": "whatsapp",
    "to": Number.parseInt(recipient),
    "type": "text",
    "text": {
      "body": text
    }
  });
}

module.exports = {
  sendMessage: sendMessage,
  getTextMessageInput: getTextMessageInput
};