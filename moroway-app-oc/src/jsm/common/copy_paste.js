/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { APP_DATA } from "./app_data.js";
//COPY & PASTE
export function copy(selector, successFunction, failFunction) {
    var selection = window.getSelection();
    selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
    var range = document.createRange();
    range.selectNodeContents(document.querySelector(selector));
    selection === null || selection === void 0 ? void 0 : selection.addRange(range);
    if (document.execCommand && document.execCommand("copy")) {
        if (typeof successFunction == "function") {
            successFunction();
        }
    }
    else if (typeof navigator.permissions == "object") {
        navigator.permissions
            .query({ name: "clipboard-write" })
            .then(function (status) {
            if (status.state == "granted") {
                var text = document.querySelector(selector).textContent;
                navigator.clipboard
                    .writeText(text)
                    .then(function () {
                    if (typeof successFunction == "function") {
                        successFunction();
                    }
                })
                    .catch(function (error) {
                    if (typeof failFunction == "function") {
                        failFunction();
                    }
                    if (APP_DATA.debug) {
                        console.log(error);
                    }
                });
            }
            else {
                if (typeof failFunction == "function") {
                    failFunction();
                }
            }
        })
            .catch(function (error) {
            if (typeof failFunction == "function") {
                failFunction();
            }
            if (APP_DATA.debug) {
                console.log(error);
            }
        });
    }
    else if (typeof failFunction == "function") {
        failFunction();
    }
}
