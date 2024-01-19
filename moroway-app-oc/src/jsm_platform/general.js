"use strict";
import {followIntent} from "./common/follow_links.js";
document.addEventListener("deviceready", function () {
    window.plugins.webintent.onNewIntent(function (url) {
        followIntent(url);
    });
});
