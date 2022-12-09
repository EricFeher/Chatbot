
const Constants = {
// Notification request headers that twitch sends
    TWITCH_MESSAGE_ID: 'Twitch-Eventsub-Message-Id'.toLowerCase(),
    TWITCH_MESSAGE_TIMESTAMP: 'Twitch-Eventsub-Message-Timestamp'.toLowerCase(),
    TWITCH_MESSAGE_SIGNATURE: 'Twitch-Eventsub-Message-Signature'.toLowerCase(),
    MESSAGE_TYPE: 'Twitch-Eventsub-Message-Type'.toLowerCase(),


// Notification message types that twitch sends
    MESSAGE_TYPE_VERIFICATION: 'webhook_callback_verification',
    MESSAGE_TYPE_NOTIFICATION: 'notification',
    MESSAGE_TYPE_REVOCATION: 'revocation',

// Prepend this string to the HMAC that's created from the message
    HMAC_PREFIX: 'sha256='
}
module.exports = Constants;