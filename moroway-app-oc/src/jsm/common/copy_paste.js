/**
 * Copyright 2026 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { APP_DATA } from "./app_data.js";
//COPY & PASTE
export function copy(selector, successFunction, failFunction) {
    const elem = document.querySelector(selector);
    if (elem) {
        var selection = window.getSelection();
        selection?.removeAllRanges();
        var range = document.createRange();
        range.selectNodeContents(elem);
        selection?.addRange(range);
        if (document.execCommand && document.execCommand("copy")) {
            if (typeof successFunction == "function") {
                successFunction();
            }
        }
        else if (typeof navigator.permissions == "object") {
            navigator.permissions
                .query({ name: "clipboard-write" })
                .then((status) => {
                if (status.state == "granted") {
                    var text = elem.textContent;
                    navigator.clipboard
                        .writeText(text)
                        .then(() => {
                        if (typeof successFunction == "function") {
                            successFunction();
                        }
                    })
                        .catch((error) => {
                        if (typeof failFunction == "function") {
                            failFunction();
                        }
                        if (APP_DATA.debug) {
                            console.error(error);
                        }
                    });
                }
                else {
                    if (typeof failFunction == "function") {
                        failFunction();
                    }
                }
            })
                .catch((error) => {
                if (typeof failFunction == "function") {
                    failFunction();
                }
                if (APP_DATA.debug) {
                    console.error(error);
                }
            });
        }
        else if (typeof failFunction == "function") {
            failFunction();
        }
    }
    else if (typeof failFunction == "function") {
        failFunction();
    }
}
