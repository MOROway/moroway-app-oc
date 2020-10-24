"use strict"

function chooseInputMethod (event){
    var type = event.type;           
	document.querySelector("body").removeEventListener("touchstart",chooseInputMethod);
    document.querySelector("body").removeEventListener("mousemove",chooseInputMethod);
	if(type == "touchstart"){
		type = "touch";
    } else {
		type = "mouse";
    }
	setCurrentHardwareConfig("input",type);
    hardware = getLastHardwareConfig();
}

function displaySettingsOpts(isInitial){
	for(var i = 0; i < Object.keys(settings).length; i++) {
			var a = Object.values(settings)[i];
			var b = Object.keys(settings)[i];
			var elem = document.querySelector("#"+b);
			if(elem !== null){

				var leftButton = document.querySelector("#"+b).querySelector(".leftButton");
				var textButton = document.querySelector("#"+b).querySelector(".textButton");
				
				if(a){
					leftButton.style.backgroundColor = "black";
					leftButton.style.transform = "rotate(360deg)";
				} else {
					leftButton.style.backgroundColor = "";
					leftButton.style.transform = "rotate(0deg)";		
				}
				if(isSettingActive(b) && isHardwareAvailable(b)) {
					elem.style.setProperty("display", "block");
				} else {
					elem.style.setProperty("display", "none");
				}
				
				if(isInitial){
					leftButton.style.transition = "transform 2s";
					leftButton.id = b+"leftButton";
					textButton.id = b+"textButton";
					leftButton.addEventListener("click", function(event){settingsChange(event, 'leftButton');})
					textButton.addEventListener("click", function(event){settingsChange(event, 'textButton');})
				}
			}
	}
}

function settingsChange(event, suffix) {
	var id = event.target.id.substr(0,event.target.id.length-suffix.length); 
	if( id !== undefined){
		if(isSettingActive(id)) {
			settings[id] = !settings[id];
			setSettings(settings);
			displaySettingsOpts(false);
			notify(getString("settingsScreenApply", "."), false, 900, null, null, window.innerHeight);
		}
	}
}

var settings = {};
var settingsComplete = {};
var hardware = getLastHardwareConfig();

window.addEventListener("load", function(){
	 
	document.querySelector("body").addEventListener("touchstart",chooseInputMethod);
    document.querySelector("body").addEventListener("mousemove",chooseInputMethod)
	;
 	if(typeof(window.localStorage) != "undefined") {
			
		settingsComplete = getSettings (true);
		settings = settingsComplete.values;
			
		displaySettingsOpts(true);

		Object.keys(STRINGS).forEach(function(val) {
			var elem = document.createElement("button");
			elem.className = "langvalue";
			elem.textContent = getString("langName", "", "", val);
			elem.dataset.langCode = val;
			if(val == CURRENT_LANG){
				elem.id="clang";
			} else {
				elem.addEventListener("click", function(){setCurrentLang(val); notify(getString("settingsScreenLangSelectChange", "!", "upper", val), true, 5000, function(){window.top.location.reload();}, getString("settingsScreenLangSelectChangeButton", "", "upper", val));});
			}
			document.querySelector("#langoption").appendChild(elem);
		});
		document.querySelector("#backOption").addEventListener("click", function(){try {window.close();}catch(err) {}; followLink("./","_self", LINK_STATE_INTERNAL_HTML);}, false);
		document.querySelector("#helpOption").addEventListener("click", function(){followLink("help","_self", LINK_STATE_INTERNAL_HTML);}, false);
		
	} else {
		document.querySelector("body").innerHTML = getString("generalNoDOMStorageSupport");
	}

});
