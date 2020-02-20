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
});