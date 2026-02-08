/**
 * Copyright 2026 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { followLink, LinkStates } from "../jsm/common/web_tools.js";
document.addEventListener("deviceready", function () {
    // Cordova wrapper contains this function
    // @ts-ignore
    window.plugins.webintent.onNewIntent(function (url) {
        followLink(url, "", LinkStates.Intent);
    });
});
