////Required code (needs to be set on each platform)

////Optional code (app works without it)
function placeOptions(state){
	var menu = {container: document.querySelector("#canvas-options"),items: {team:document.querySelector("#canvas-team"),single:document.querySelector("#canvas-single"),help:document.querySelector("#canvas-help"), settings:document.querySelector("#canvas-settings"), controlCenter: document.querySelector("#canvas-control-center")}};
	if(state == "hide") {
	  menu.container.style.opacity = "0";
	} else if (state == "show") {
	  menu.container.style.opacity = "1";
	} else {
		  if(state == "load") {
			var container = document.querySelector("#settingsimport");
			if (container !== null) {
				container.parentNode.removeChild(document.querySelector("#settingsimport"));
			}
			menu.items.controlCenter.addEventListener("click", function(){hardware.mouse.rightClick = !hardware.mouse.rightClick;}, false);
		  }
		  for (var item in menu.items) {
		  	menu.items[item].style.display = "none";
		  	menu.items[item].style.color = "rgb(210, 120, 27)";
		  	menu.items[item].style.background = "transparent";
		  }
		  menu.items.controlCenter.style.display = "inline";
		  if(menu.container.offsetHeight < client.y && 2*background.y < background.height) {
			  menu.containerMargin = Math.round((client.y - menu.container.offsetHeight)/2);
			  menu.container.style.right =  menu.containerMargin + "px";
			  menu.container.style.bottom =  menu.containerMargin +  "px";
		  } else {
		  	  menu.items.controlCenter.style.display = "none";
		  }
		  menu.container.style.opacity = "1";
	}
}
function localDR(){
	window.plugins.insomnia.keepAwake();
	var ocSettings = getSettingsOC();
	if(!ocSettings.landscapeGame || !ocSettings.landscapeApp) {
		screen.orientation.lock("landscape");
	}
	document.addEventListener("backbutton", function(e) {
		e.preventDefault();
		navigator.notification.confirm(getString("platformOcGameLeave"), function(button) {
			if (button == 1){
				followLink("html_platform/start.html","_self", LINK_STATE_INTERNAL_LICENSE_FILE);
			}
		}, getString("platformOcGameLeaveTitel"), [getString("platformOcGameLeaveYes"),getString("platformOcGameLeaveNo")]);
	}, false);
}