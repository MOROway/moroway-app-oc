/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import {followIntent} from "./common/follow_links.js";
document.addEventListener("deviceready", function () {
    window.plugins.webintent.onNewIntent(function (url) {
        followIntent(url);
    });
});
