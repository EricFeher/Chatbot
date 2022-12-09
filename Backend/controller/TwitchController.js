const constans = require("../Constants")
const TwitchService = require("../service/TwitchService");

class TwitchController{

    constructor() {
        this.twitchService = new TwitchService()
        this.postTwitchEventSub();
    }

    postTwitchEventSub(){
        app.post('/eventsub', (req, res) => {
            let secret = this.twitchService.getSecret();
            let message = this.twitchService.getHmacMessage(req);
            let hmac = constans.HMAC_PREFIX + this.twitchService.getHmac(secret, message);  // Signature to compare
            if (true === this.twitchService.verifyMessage(hmac, req.headers[constans.TWITCH_MESSAGE_SIGNATURE])) {
                console.log("[EVENT]: signatures match");
                //Get JSON object from body, so you can process the message.
                let notification = JSON.parse(req.body);

                if (constans.MESSAGE_TYPE_NOTIFICATION === req.headers[constans.MESSAGE_TYPE]) {
                    // TODO: Do something with the event's data.

                    console.log(`[EVENT]: Event type: ${notification.subscription.type}`);
                    console.log(JSON.stringify(notification.event, null, 4));

                    res.sendStatus(204);
                }
                else if (constans.MESSAGE_TYPE_VERIFICATION === req.headers[constans.MESSAGE_TYPE]) {
                    res.status(200).send(notification.challenge);
                }
                else if (constans.MESSAGE_TYPE_REVOCATION === req.headers[constans.MESSAGE_TYPE]) {
                    res.sendStatus(204);

                    console.log(`[EVENT]: ${notification.subscription.type} notifications revoked!`);
                    console.log(`[EVENT]: reason: ${notification.subscription.status}`);
                    console.log(`[EVENT]: condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
                }
                else {
                    res.sendStatus(204);
                    console.log(`[EVENT]: Unknown message type: ${req.headers[constans.MESSAGE_TYPE]}`);
                }
            }
            else {
                console.log('403');    // Signatures didn't match.
                res.sendStatus(403);
            }
        })
    }
}  module.exports = TwitchController;

//TODO: https://dev.twitch.tv/docs/eventsub