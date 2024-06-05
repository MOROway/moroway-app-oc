/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: Apache-2.0
 */
window.addEventListener("error", function (event) {
    if (document.body != null) {
        document.body.style.background = "#110022";
        var errorElement = document.querySelector("#error-element");
        var actionElement = document.querySelector("#error-element-action");
        if (errorElement == null || actionElement == null) {
            document.body.innerHTML = '<div id="error-element"><div id="error-element-heading">FATAL ERROR</div><div id="error-element-action">Please report this error… Thanks!</div></div>';
            errorElement = document.querySelector("#error-element");
            actionElement = document.querySelector("#error-element-action");
        }
        if (errorElement != null && actionElement != null) {
            var messageElement = document.createElement("div");
            messageElement.textContent = event.message;
            messageElement.id = "error-element-message";
            errorElement.insertBefore(messageElement, actionElement);
        }
    }
});
