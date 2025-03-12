/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { followLink, LINK_STATE_INTERNAL_HTML } from "../jsm_platform/common/follow_links.js";
import { setHTMLStrings } from "./common/string_tools.js";
import { setSettingsHTML } from "./common/settings.js";
import { initTooltips } from "./common/tooltip.js";
document.addEventListener("DOMContentLoaded", function () {
    setHTMLStrings();
    initTooltips();
});
document.addEventListener("DOMContentLoaded", function () {
    setSettingsHTML(document.querySelector("main"), true);
    document.querySelector("#backOption").addEventListener("click", function () {
        try {
            window.close();
        }
        catch (err) { }
        followLink("./", "_self", LINK_STATE_INTERNAL_HTML);
    });
});
