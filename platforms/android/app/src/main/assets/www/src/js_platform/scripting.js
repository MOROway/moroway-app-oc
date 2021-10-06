////Required code (needs to be set on each platform)

////Optional code (app works without it)
function placeOptions(state){
    var menu = {container: document.querySelector("#canvas-options"),items: {team:document.querySelector("#canvas-team"),single:document.querySelector("#canvas-single"),help:document.querySelector("#canvas-help"), settings:document.querySelector("#canvas-settings"), controlCenter: document.querySelector("#canvas-control-center"), carControlCenter: document.querySelector("#canvas-car-control-center"), chat: document.querySelector("#canvas-chat-open")}};
    if(state == "hide") {
        menu.container.style.display = "none";
    } else if (state == "show") {
        menu.container.style.display = "block";
    } else if (state == "invisible") {
        menu.container.style.visibility = "hidden";
    } else if (state == "visible") {
        menu.container.style.visibility = "";
    } else {
        if(state == "load") {
            var container = document.querySelector("#settings");
            if (container !== null) {
                container.parentNode.removeChild(container);
            }
            menu.items.controlCenter.addEventListener("click", function(){hardware.mouse.rightClick = !hardware.mouse.rightClick || controlCenter.showCarCenter; controlCenter.showCarCenter = false;});
            menu.items.carControlCenter.addEventListener("click", function(){hardware.mouse.rightClick = !hardware.mouse.rightClick || !controlCenter.showCarCenter; controlCenter.showCarCenter = true;});
            menu.items.chat.addEventListener("click", function(){
                document.querySelector("#chat").openChat();
            });
        }
        for (var item in menu.items) {
            menu.items[item].style.display = "none";
        }
        menu.items.controlCenter.style.display = "inline";
        menu.items.carControlCenter.style.display = "inline";
        menu.items.chat.style.display = onlineGame.enabled ? "inline" : "none";
        menu.containerMargin = Math.round((client.y - menu.container.offsetHeight)/2);
        menu.container.style.right =  Math.max(0,menu.containerMargin) + "px";
        menu.container.style.bottom =  Math.max(0,menu.containerMargin) +  "px";
        if(menu.container.offsetHeight > client.y || 2*background.y > background.height) {
            menu.items.controlCenter.style.display = "none";
            menu.items.carControlCenter.style.display = "none";
        }
        menu.container.style.display = "block";
    }
}
function localDR(){
    window.plugins.insomnia.keepAwake();
    document.addEventListener("backbutton", function(e) {
        e.preventDefault();
        if((typeof settings == "object" && !settings.saveGame) || (typeof onlineGame == "object" && onlineGame.enabled)) {
            navigator.notification.confirm(getString("platformOcGameLeave"), function(button) {
                if (button == 1){
                    followLink("html_platform/start.html","_self", LINK_STATE_INTERNAL_LICENSE_FILE);
                }
            }, getString("platformOcGameLeaveTitel"), [getString("platformOcGameLeaveYes"),getString("platformOcGameLeaveNo")]);
        } else {
            followLink("html_platform/start.html","_self", LINK_STATE_INTERNAL_LICENSE_FILE);
        }
    }, false);
}
