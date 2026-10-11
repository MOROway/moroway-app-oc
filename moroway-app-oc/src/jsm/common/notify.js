/**
 * Copyright 2026 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { APP_DATA } from "./app_data.js";
import { getSetting } from "./settings.js";
//NOTIFICATIONS
export function notify(selector, message, prio, timeout, actionHandler = null, actionText = null, minHeight = -1, channel = NotificationChannel.Default) {
    function sameChannelNo(ch, pr) {
        if (notificationContainer) {
            for (var i = notificationContainer.queue.length - 1; i >= 0; i--) {
                if (notificationContainer.queue[i].channel == ch && notificationContainer.queue[i].prio <= pr) {
                    return i;
                }
            }
        }
        return false;
    }
    const notificationContainer = document.querySelector(selector);
    if (!notificationContainer) {
        return false;
    }
    if (prio == undefined || prio == null) {
        prio = NotificationPriority.Default;
    }
    if (channel == undefined || channel == null) {
        channel = NotificationChannel.Default;
    }
    if (notificationContainer.queue == undefined) {
        notificationContainer.queue = [];
    }
    if (notificationContainer.active == undefined) {
        notificationContainer.active = false;
    }
    if (notificationContainer.show == undefined) {
        notificationContainer.show = function () {
            notificationContainer.active = true;
            notificationContainer.style.visibility = "";
            const button = notificationContainer.querySelector("button");
            if (button) {
                button.style.display = "none";
            }
            if (notificationContainer.queue.length > 0) {
                var obj = notificationContainer.queue[0];
                const text = notificationContainer.querySelector("span");
                if (text) {
                    text.textContent = obj.message;
                }
                notificationContainer.style.visibility = "visible";
                if (obj.actionHandler && obj.actionText && button) {
                    button.textContent = obj.actionText;
                    button.onclick = obj.actionHandler;
                    button.style.display = "";
                }
                notificationContainer.queue.shift();
                notificationContainer.showTimeout = window.setTimeout(function () {
                    delete notificationContainer.showTimeout;
                    notificationContainer.show();
                }, obj.timeout);
            }
            else {
                notificationContainer.active = false;
            }
        };
    }
    if (notificationContainer.hide == undefined) {
        notificationContainer.hide = function (stopFollowing) {
            notificationContainer.active = false;
            notificationContainer.style.visibility = "";
            if (notificationContainer.showTimeout !== undefined) {
                window.clearTimeout(notificationContainer.showTimeout);
                delete notificationContainer.showTimeout;
                if (!stopFollowing) {
                    notificationContainer.show();
                }
            }
        };
    }
    if (prio > NotificationPriority.Low || (notificationContainer.queue.length == 0 && !notificationContainer.active)) {
        var obj = actionHandler && actionText ? { message: message, timeout: timeout, prio: prio, channel: channel, actionHandler: actionHandler, actionText: actionText } : { message: message, timeout: timeout, prio: prio, channel: channel };
        if (prio === NotificationPriority.High || minHeight == -1 || (minHeight >= notificationContainer.offsetHeight - 15 && getSetting("showNotifications"))) {
            var chNo = sameChannelNo(channel, prio);
            if (channel != NotificationChannel.Default && chNo !== false) {
                notificationContainer.queue[chNo] = obj;
            }
            else {
                notificationContainer.queue.push(obj);
            }
            if (!notificationContainer.active) {
                notificationContainer.show();
            }
        }
        else if (APP_DATA.debug) {
            console.debug(message);
        }
    }
}
export var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority[NotificationPriority["Low"] = 0] = "Low";
    NotificationPriority[NotificationPriority["Default"] = 1] = "Default";
    NotificationPriority[NotificationPriority["High"] = 2] = "High";
})(NotificationPriority || (NotificationPriority = {}));
export var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel[NotificationChannel["Default"] = 0] = "Default";
    NotificationChannel[NotificationChannel["TrainSwitches"] = 1] = "TrainSwitches";
    NotificationChannel[NotificationChannel["ClassicUiTrainSwitch"] = 2] = "ClassicUiTrainSwitch";
    NotificationChannel[NotificationChannel["MultiplayerChat"] = 3] = "MultiplayerChat";
    NotificationChannel[NotificationChannel["Camera3D"] = 4] = "Camera3D";
})(NotificationChannel || (NotificationChannel = {}));
