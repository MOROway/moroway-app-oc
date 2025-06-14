/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { getString, setHTMLStrings } from "./common/string_tools.js";
import { SYSTEM_TOOLS } from "./common/system_tools.js";
import { initTooltips } from "./common/tooltip.js";
document.addEventListener("DOMContentLoaded", function () {
    var backButton = document.querySelector("#backOption");
    backButton.addEventListener("click", function () {
        SYSTEM_TOOLS.navigateBack();
    });
    var elements = document.querySelectorAll(".content");
    for (var i = 0; i < elements.length; i++) {
        var elemString = elements[i].dataset.stringidContent;
        var j = 0;
        do {
            if (elemString && getString([elemString, j]) != "undefined") {
                var subElement = document.createElement("p");
                subElement.setAttribute("data-stringid-content", elemString);
                subElement.setAttribute("data-stringid-content-arrayno", j.toString());
                elements[i].appendChild(subElement);
                j++;
            }
            else {
                j = 0;
            }
        } while (j > 0);
        elements[i].removeAttribute("data-stringid-content");
    }
    setHTMLStrings();
    initTooltips();
});
