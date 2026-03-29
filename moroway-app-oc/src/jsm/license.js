/**
 * Copyright 2026 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { APP_DATA } from "./common/app_data.js";
import { getString, setHTMLStrings } from "./common/string_tools.js";
import { SYSTEM_TOOLS } from "./common/system_tools.js";
import { initTooltips } from "./common/tooltip.js";
import { getQueryStringValue } from "./common/web_tools.js";
document.addEventListener("DOMContentLoaded", function () {
    const backButton = document.querySelector("#backOption");
    backButton.addEventListener("click", function () {
        SYSTEM_TOOLS.navigateBack();
    });
    setHTMLStrings();
    initTooltips();
    const elementTitle = document.querySelector("#license-title");
    const elementContent = document.querySelector("#license-content");
    if (elementTitle && elementContent) {
        const file = getQueryStringValue("license-file");
        if ((file.startsWith(document.baseURI) || (!file.startsWith("/") && !file.includes("://"))) && (file.endsWith(".txt") || file.match(/([/]|^)[^.]+$/)) && !file.endsWith("/")) {
            fetch(file)
                .then((response) => {
                if (response.ok && response.status == 200) {
                    return response.text();
                }
            })
                .then((text) => {
                if (text) {
                    const textArray = text
                        .replace(/\r\n/g, "\n")
                        .replace(/\r/g, "\n")
                        .replace(/\n\n+/g, "\n\n")
                        .replace(/^\n+/g, "")
                        .split(/[\n]{2}/);
                    for (let i = 0; i < textArray.length; i++) {
                        var currentTextArray = textArray[i].split(/[\n]/);
                        var element2Add = document.createElement("p");
                        for (let i = 0; i < currentTextArray.length; i++) {
                            var localElement2AddSpan = document.createElement("span");
                            localElement2AddSpan.textContent = currentTextArray[i];
                            element2Add.appendChild(localElement2AddSpan);
                            var localElement2AddBr = document.createElement("br");
                            element2Add.appendChild(localElement2AddBr);
                        }
                        if (i == 0) {
                            elementTitle.appendChild(element2Add);
                        }
                        else {
                            elementContent.appendChild(element2Add);
                        }
                    }
                }
                else {
                    elementTitle.textContent = getString("generalIsFail", "!", "upper");
                    elementContent.textContent = getString("licenseScreenNotFound");
                }
            })
                .catch((error) => {
                if (APP_DATA.debug) {
                    console.error("Fetch-Error:", error);
                }
                elementTitle.textContent = getString("generalIsFail", "!", "upper");
                elementContent.textContent = getString("licenseScreenNotFound");
            });
        }
    }
});
