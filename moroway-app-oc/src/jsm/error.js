/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";
import { followLink, LINK_STATE_INTERNAL_HTML } from "../jsm_platform/common/follow_links.js";
import { getString, setHTMLStrings } from "./common/string_tools.js";
import { initTooltips } from "./common/tooltip.js";
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#backOption").addEventListener("click", function () {
        followLink("./", "_self", LINK_STATE_INTERNAL_HTML);
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
