/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
//HANDLE OBJECTS
export function copyJSObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export function deepFreeze(obj) {
    if (typeof obj == "object") {
        Object.keys(obj).forEach(function (key) {
            if (typeof obj[key] == "object") {
                deepFreeze(obj[key]);
            }
        });
        Object.freeze(obj);
    }
}
