window.addEventListener("error", function (event) {
    var body = document.querySelector("body");
    body.style.background = "#110022";
    if (body.querySelector("#error-element") == null) {
        body.innerHTML = '<div id="error-element"><div id="error-element-heading">FATAL ERROR</div><div id="error-element-action">Please report this error… Thanks!</div></div>';
    }
    var errorElement = body.querySelector("#error-element");
    var actionElement = errorElement.querySelector("#error-element-action");
    if (errorElement != null && actionElement != null) {
        var messageElement = document.createElement("div");
        messageElement.textContent = event.message;
        messageElement.id = "error-element-message";
        errorElement.insertBefore(messageElement, actionElement);
    }
});
