/**
 * Copyright 2026 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { APP_DATA } from "./app_data.js";
import { getSetting } from "./settings.js";
//NOTIFICATIONS
export function notify(elem, message, prio, timeout, actionHandler, actionText, minHeight, channel) {
    if (minHeight === void 0) { minHeight = -1; }
    if (channel === void 0) { channel = NotificationChannel.Default; }
    var notificationContainer = document.querySelector(elem);
    if (notificationContainer == undefined || notificationContainer == null) {
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
        notificationContainer.show = function (elem) {
            elem.active = true;
            elem.style.visibility = "";
            elem.querySelector("button").style.display = "none";
            if (elem.queue.length > 0) {
                var obj = elem.queue[0];
                elem.querySelector("span").textContent = obj.message;
                elem.style.visibility = "visible";
                if (obj.actionHandler != null && obj.actionText != null) {
                    elem.querySelector("button").textContent = obj.actionText;
                    elem.querySelector("button").onclick = obj.actionHandler;
                    elem.querySelector("button").style.display = "";
                }
                elem.queue.shift();
                elem.showTimeoutFunction = function () {
                    elem.show(elem);
                    elem.showTimeoutFunction = null;
                };
                elem.showTimeout = window.setTimeout(elem.showTimeoutFunction, obj.timeout);
            }
            else {
                elem.active = false;
            }
        };
    }
    if (notificationContainer.hide == undefined) {
        notificationContainer.hide = function (elem, stopFollowing) {
            elem.active = false;
            elem.style.visibility = "";
            if (elem.showTimeout !== undefined && elem.showTimeout !== null) {
                window.clearTimeout(elem.showTimeout);
            }
            if (typeof elem.showTimeoutFunction == "function" && !stopFollowing) {
                elem.showTimeoutFunction();
            }
        };
    }
    if (notificationContainer.sameChannelNo == undefined) {
        notificationContainer.sameChannelNo = function (elem, ch, pr) {
            for (var i = elem.queue.length - 1; i >= 0; i--) {
                if (elem.queue[i].channel == ch && elem.queue[i].prio <= pr) {
                    return i;
                }
            }
            return false;
        };
    }
    if (prio > NotificationPriority.Low || (notificationContainer.queue.length == 0 && !notificationContainer.active)) {
        var obj = { message: message, timeout: timeout, prio: prio, channel: channel, actionHandler: actionHandler, actionText: actionText };
        if (prio === NotificationPriority.High || minHeight == -1 || (minHeight >= notificationContainer.offsetHeight - 15 && getSetting("showNotifications"))) {
            var chNo = notificationContainer.sameChannelNo(notificationContainer, channel, prio);
            if (channel != NotificationChannel.Default && chNo !== false) {
                notificationContainer.queue[chNo] = obj;
            }
            else {
                notificationContainer.queue.push(obj);
            }
            if (!notificationContainer.active) {
                notificationContainer.show(notificationContainer);
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
