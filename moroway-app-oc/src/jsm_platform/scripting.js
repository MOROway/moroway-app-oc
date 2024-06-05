/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";
import {followLink, LINK_STATE_INTERNAL_HTML} from "./common/follow_links.js";
import {APP_DATA} from "../jsm/common/app_data.js";
import {getString} from "../jsm/common/string_tools.js";
import {getSetting} from "../jsm/common/settings.js";
import {optionsMenuEditorHide, getMode} from "../jsm/scripting.js";

document.addEventListener("moroway-app-after-calc-options-menu-load", function () {
    optionsMenuEditorHide("canvas-team");
    optionsMenuEditorHide("canvas-single");
    optionsMenuEditorHide("canvas-settings");
    optionsMenuEditorHide("canvas-help");
    optionsMenuEditorHide("canvas-demo-mode");
});

document.addEventListener("deviceready", function () {
    document.addEventListener(
        "backbutton",
        function (e) {
            e.preventDefault();
            if (getMode() != "demo" && (!getSetting("saveGame") || getMode() == "online")) {
                navigator.notification.confirm(
                    getString("generalLeaveAndDestroyGame"),
                    function (button) {
                        if (button == 1) {
                            followLink("html_platform/start.html", "_self", LINK_STATE_INTERNAL_HTML);
                        }
                    },
                    getString("generalLeaveAndDestroyGameTitle"),
                    [getString("generalLeaveAndDestroyGameYes"), getString("generalLeaveAndDestroyGameNo")]
                );
            } else {
                followLink("html_platform/start.html", "_self", LINK_STATE_INTERNAL_HTML);
            }
        },
        false
    );
});

document.addEventListener("moroway-app-keep-screen-alive", function (event) {
    if (event.detail) {
        if (event.detail.acquire) {
            try {
                navigator.wakeLock.request("screen");
            } catch (error) {
                if (APP_DATA.debug) {
                    console.log("Wake-Lock-Error:", error);
                }
            }
        }
    }
});
