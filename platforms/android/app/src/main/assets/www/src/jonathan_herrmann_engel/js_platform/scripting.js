////Required code (needs to be set on each platform)

////Optional code (app works without it)
function placeOptions(state){
	if(state == "load") {
		var container = document.querySelector("#settingsimport");
		if (container !== null) {
			container.parentNode.removeChild(document.querySelector("#settingsimport"));
		}
	}
}
document.addEventListener('deviceready', function() {
	window.plugins.insomnia.keepAwake();
	document.addEventListener("backbutton", function(e) {
		e.preventDefault();
		navigator.notification.confirm(getString("platformOcGameLeave"), function(button) {
			if (button == 1){
				followLink("html_platform/start.html","_self", LINK_STATE_INTERNAL_LICENSE_FILE);
			}
		}, getString("platformOcGameLeaveTitel"), [getString("platformOcGameLeaveYes"),getString("platformOcGameLeaveNo")]);
	}, false);
});