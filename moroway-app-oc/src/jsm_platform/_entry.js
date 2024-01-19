"use strict";
import {followIntent} from "./common/follow_links.js";
document.addEventListener("deviceready", function () {
    window.plugins.webintent.getUri(function (url) {
        followIntent(url);
    }, false);
});
