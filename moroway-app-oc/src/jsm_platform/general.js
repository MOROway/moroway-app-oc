/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";
import {followIntent} from "./common/follow_links.js";
document.addEventListener("deviceready", function () {
    window.plugins.webintent.onNewIntent(function (url) {
        followIntent(url);
    });
});
