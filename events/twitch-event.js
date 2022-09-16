const crypto = require('crypto');
    
// Notification request headers that twitch sends
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();


// Notification message types that twitch sends
const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
const MESSAGE_TYPE_NOTIFICATION = 'notification';
const MESSAGE_TYPE_REVOCATION = 'revocation';

// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = 'sha256=';

class EventSub{

    constructor() {
        this.app = app;
        this.postTwitchEventSub();
    }

    postTwitchEventSub(){
        this.app.post('/eventsub', (req, res) => {
            let secret = this.getSecret();
            let message = this.getHmacMessage(req);
            let hmac = HMAC_PREFIX + this.getHmac(secret, message);  // Signature to compare
            if (true === this.verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE])) {
                console.log("[EVENT]: signatures match");
//Get JSON object from body, so you can process the message.
                let notification = JSON.parse(req.body);

                if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
                    // TODO: Do something with the event's data.

                    console.log(`[EVENT]: Event type: ${notification.subscription.type}`);
                    console.log(JSON.stringify(notification.event, null, 4));

                    res.sendStatus(204);
                }
                else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
                    res.status(200).send(notification.challenge);
                }
                else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
                    res.sendStatus(204);

                    console.log(`[EVENT]: ${notification.subscription.type} notifications revoked!`);
                    console.log(`[EVENT]: reason: ${notification.subscription.status}`);
                    console.log(`[EVENT]: condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
                }
                else {
                    res.sendStatus(204);
                    console.log(`[EVENT]: Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
                }
            }
            else {
                console.log('403');    // Signatures didn't match.
                res.sendStatus(403);
            }
        })
    }

    getSecret() {
        // TODO: Get secret from secure storage. This is the secret you pass
        // when you subscribed to the event.
        return process.env.SECRET_HMAC;
    }
/*
Build the message used to get the HMAC.
 */
    getHmacMessage(request) {
        return (request.headers[TWITCH_MESSAGE_ID] +
            request.headers[TWITCH_MESSAGE_TIMESTAMP] +
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
}  module.exports = EventSub;

//TODO: https://dev.twitch.tv/docs/eventsub