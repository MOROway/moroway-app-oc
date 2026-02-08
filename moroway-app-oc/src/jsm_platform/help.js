/**
 * Copyright 2026 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { SYSTEM_TOOLS } from "../jsm/common/system_tools.js";
import { followLink, LinkStates } from "../jsm/common/web_tools.js";
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#legal-appoc-licenses").classList.remove("hidden");
    document.querySelector("#legal-appoc-cordova-license").addEventListener("click", function () {
        followLink("licenses_platform/cordova", "_self", LinkStates.InternalLicense);
    });
    document.querySelector("#legal-appoc-webintent-license").addEventListener("click", function () {
        followLink("licenses_platform/webintent", "_self", LinkStates.InternalLicense);
    });
    document.querySelector("#legal-appoc-dialogs-license").addEventListener("click", function () {
        followLink("licenses_platform/dialogs", "_self", LinkStates.InternalLicense);
    });
});
document.addEventListener("deviceready", function () {
    document.addEventListener("backbutton", SYSTEM_TOOLS.navigateBack, false);
});
