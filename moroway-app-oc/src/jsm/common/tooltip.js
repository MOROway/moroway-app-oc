/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
//TOOLTIPS
function reset() {
    tooltipContainer.classList.remove("active");
}
export function initTooltip(elem) {
    function activate() {
        tooltipContainer.classList.add("active");
        tooltipContainer.textContent = elem.dataset.tooltip;
        var rect = elem.getBoundingClientRect();
        var margin = tooltipContainer.offsetHeight * 0.2;
        tooltipContainer.style.top = (rect.top - tooltipContainer.offsetHeight - margin >= 0 ? rect.top - tooltipContainer.offsetHeight - margin : rect.top + elem.offsetHeight + margin) + "px";
        tooltipContainer.style.left = (rect.left + tooltipContainer.offsetWidth <= window.innerWidth ? rect.left : window.innerWidth - tooltipContainer.offsetWidth - margin) + "px";
    }
    if (elem.dataset.tooltipInit == undefined) {
        elem.addEventListener("mouseenter", function () {
            activate();
        });
        elem.addEventListener("mouseover", function () {
            activate();
        });
        elem.addEventListener("mousemove", function () {
            activate();
        });
        elem.addEventListener("mousedown", function () {
            reset();
        });
        elem.addEventListener("mouseup", function () {
            reset();
        });
        elem.addEventListener("mouseout", function () {
            reset();
        });
        elem.dataset.tooltipInit = "1";
    }
}
export function initTooltips() {
    var elemsTooltip = document.querySelectorAll("*[data-tooltip]");
    for (var i = 0; i < elemsTooltip.length; i++) {
        initTooltip(elemsTooltip[i]);
    }
}
var tooltipContainer = document.createElement("div");
tooltipContainer.classList.add("tooltip-container");
document.addEventListener("DOMContentLoaded", function () {
    document.body.appendChild(tooltipContainer);
    document.addEventListener("touchstart", function () {
        reset();
    });
});
