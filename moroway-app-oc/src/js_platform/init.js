document.addEventListener("deviceready", function () {
    if (typeof localDR == "function") {
        localDR();
    }
    if (typeof globalDR == "function") {
        globalDR();
    }
});
