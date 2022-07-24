function localDR() {
    window.plugins.webintent.getUri(function (url) {
        followIntent(url);
    }, false);
}
