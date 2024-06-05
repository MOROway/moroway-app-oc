/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";
import { followLink, LINK_STATE_INTERNAL_HTML } from "../jsm_platform/common/follow_links.js";
import { formatHTMLString, formatJSString, getString, setHTMLStrings } from "./common/string_tools.js";
import { initTooltips } from "./common/tooltip.js";
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#backOption").addEventListener("click", function () {
        if (document.referrer === document.baseURI + "help/") {
            followLink("./help", "_self", LINK_STATE_INTERNAL_HTML);
        }
        else {
            try {
                window.close();
            }
            catch (err) { }
            followLink("./", "_self", LINK_STATE_INTERNAL_HTML);
        }
    });
    var i = 0;
    var versions = [];
    do {
        if (getString("whatsNewScreenByVersionMa" + (i + 1) + "Mi0") != "undefined") {
            var j = 0;
            var elem = document.createElement("article");
            elem.id = "v" + (i + 1);
            var elem1 = document.createElement("h2");
            elem1.textContent = formatJSString(getString("whatsNewScreenVersionNumber"), i + 1);
            elem.appendChild(elem1);
            elem1 = document.createElement("div");
            elem1.className = "card-container card-container-highlightable";
            do {
                if (getString("whatsNewScreenByVersionMa" + (i + 1) + "Mi" + j) != "undefined") {
                    var subElement = document.createElement("div");
                    subElement.className = "card";
                    var subElement1 = document.createElement("div");
                    subElement1.className = "card-title";
                    var subElement2 = document.createElement("h2");
                    subElement2.textContent = formatJSString(getString("whatsNewScreenVersionNumberMinor"), i + 1, j);
                    subElement1.appendChild(subElement2);
                    subElement.appendChild(subElement1);
                    elem.appendChild(subElement);
                    subElement1 = document.createElement("div");
                    subElement1.className = "card-content";
                    subElement2 = document.createElement("p");
                    var subElement3I = document.createElement("i");
                    subElement3I.textContent = formatJSString(getString(["whatsNewScreenByVersionMa" + (i + 1) + "Mi" + j, 0]));
                    subElement2.appendChild(subElement3I);
                    subElement1.appendChild(subElement2);
                    subElement2 = document.createElement("p");
                    var k = 1;
                    do {
                        if (getString(["whatsNewScreenByVersionMa" + (i + 1) + "Mi" + j, k]) != "undefined") {
                            if (k > 1) {
                                var subElement3Br = document.createElement("br");
                                subElement2.appendChild(subElement3Br);
                            }
                            var subElement3Span = document.createElement("span");
                            subElement3Span.innerHTML = formatJSString(formatHTMLString(getString(["whatsNewScreenByVersionMa" + (i + 1) + "Mi" + j, k])), "<b>" + formatHTMLString(getString("whatsNewScreenVersionIsNew", "", "upper")) + "</b>! ");
                            subElement2.appendChild(subElement3Span);
                            k++;
                        }
                        else {
                            k = 1;
                        }
                    } while (k > 1);
                    subElement1.appendChild(subElement2);
                    subElement.appendChild(subElement1);
                    elem1.appendChild(subElement);
                    j++;
                }
                else {
                    j = 0;
                }
            } while (j > 0);
            elem.appendChild(elem1);
            versions[i] = elem;
            i++;
        }
        else {
            i = 0;
        }
    } while (i > 0);
    var newestFamily;
    for (var i = versions.length - 1; i >= 0; i--) {
        if (i == versions.length - 1) {
            newestFamily = versions[i].id;
        }
        document.querySelector("main").appendChild(versions[i]);
    }
    document.querySelector("#" + newestFamily).querySelector(".card-container").lastChild.id = "newest";
    setHTMLStrings();
    initTooltips();
});
