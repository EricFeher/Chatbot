const constans = require("../Constants")
const crypto = require('crypto');

class TwitchService{

    constructor() {}

    getSecret() {
        // TODO: Get secret from secure storage. This is the secret you pass
        // when you subscribed to the event.
        return process.env.SECRET_HMAC;
    }
    /*
    Build the message used to get the HMAC.
     */
    getHmacMessage(request) {
        return (request.headers[constans.TWITCH_MESSAGE_ID] +
            request.headers[constans.TWITCH_MESSAGE_TIMESTAMP] +
            request.body);
    }
    /*
    Get the HMAC  (hash-based message authentication code) .
     */
    getHmac(secret, message) {
        return crypto.createHmac('sha256', secret)
            .update(message)
            .digest('hex');
    }
    /*
    Verify whether our hash matches the hash that Twitch passed in the header.
     */
    verifyMessage(hmac, verifySignature) {
        console.log(Buffer.from(hmac)+"\n")
        console.log(Buffer.from(verifySignature)+"\n")
        return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
    }
}  module.exports = TwitchService;

//TODO: https://dev.twitch.tv/docs/eventsub