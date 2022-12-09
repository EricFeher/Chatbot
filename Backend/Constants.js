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
    HMAC_PREFIX: 'sha256=',

// Twitch event subscription types
    FOLLOW_EVENT_TYPE: 'channel.follow',
    CHANNEL_POINT_REDEMPTION_EVENT_TYPE: 'channel.channel_points_custom_reward_redemption.add',
    SUBSCRIPTION_EVENT_TYPE: 'channel.subscribe',
    RESUBSCRIPTION_MESSAGE_EVENT_TYPE: 'channel.subscription.message',
    SUBSCRIPTION_GIFT_EVENT_TYPE: 'channel.subscription.gift',
    CHEER_EVENT_TYPE: 'channel.cheer',
    RAID_EVENT_TYPE: 'channel.raid',
    USER_UPDATE_EVENT_TYPE: 'user.update',
    ACCESS_REVOKED_EVENT_TYPE: 'user.authorization.revoke',

}

Constants["EVENT_TYPES"] = [Constants.FOLLOW_EVENT_TYPE, Constants.CHANNEL_POINT_REDEMPTION_EVENT_TYPE, Constants.SUBSCRIPTION_EVENT_TYPE,
    Constants.RESUBSCRIPTION_MESSAGE_EVENT_TYPE, Constants.SUBSCRIPTION_GIFT_EVENT_TYPE, Constants.CHEER_EVENT_TYPE,
    Constants.RAID_EVENT_TYPE, Constants.USER_UPDATE_EVENT_TYPE, Constants.ACCESS_REVOKED_EVENT_TYPE]
module.exports = Constants;