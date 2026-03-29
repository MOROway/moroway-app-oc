/**
 * Copyright 2026 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { APP_DATA } from "../../jsm/common/app_data.js";
import { followLink, LinkStates } from "../../jsm/common/web_tools.js";
export const SYSTEM_TOOLS = {
    canAutoplayMedia: () => true,
    canExitApp: () => true,
    exitApp() {
        // Cordova wrapper contains this function
        // @ts-ignore
        cordova.commitSuicide();
    },
    forceModeSwitchHandling: () => false,
    keepAlive(acquire) {
        if (acquire) {
            try {
                navigator.wakeLock.request("screen");
            }
            catch (error) {
                if (APP_DATA.debug) {
                    console.error("Wake-Lock-Error:", error);
                }
            }
        }
    },
    navigateBack() {
        if (document.referrer.startsWith(document.baseURI) && document.referrer !== document.baseURI && window.history.length > 1) {
            window.history.back();
        }
        else {
            followLink("html_platform/start.html", "_self", LinkStates.InternalHtml);
        }
    }
};
