function afterCalcOptionsMenuLocal(state) {
    if (state == "load") {
        for (var i = 0; i < menus.options.items.length; i++) {
            if (menus.options.items[i].id != "canvas-control-center" && menus.options.items[i].id != "canvas-car-control-center" && menus.options.items[i].id != "canvas-chat-open" && menus.options.items[i].id != "canvas-sound-toggle" && menus.options.items[i].id != "canvas-info-toggle") {
                menus.options.items[i].classList.add("hidden");
            }
        }
    }
}
function localDR() {
    window.plugins.insomnia.keepAwake();
    document.addEventListener(
        "backbutton",
        function (e) {
            e.preventDefault();
            if ((typeof settings == "object" && !settings.saveGame) || (typeof onlineGame == "object" && onlineGame.enabled)) {
                navigator.notification.confirm(
                    getString("platformOcGameLeave"),
                    function (button) {
                        if (button == 1) {
                            followLink("html_platform/start.html", "_self", LINK_STATE_INTERNAL_LICENSE_FILE);
                        }
                    },
                    getString("platformOcGameLeaveTitel"),
                    [getString("platformOcGameLeaveYes"), getString("platformOcGameLeaveNo")]
                );
            } else {
                followLink("html_platform/start.html", "_self", LINK_STATE_INTERNAL_LICENSE_FILE);
            }
        },
        false
    );
}
