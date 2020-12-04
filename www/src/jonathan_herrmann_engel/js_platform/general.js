////Required code (needs to be set on each platform)
function followLink(input1, input2, input3){
        switch (input3) {
            case LINK_STATE_NORMAL:
                input2="_system";
            break;
            case LINK_STATE_INTERNAL_HTML:
		var hash, queryString;
                if(input1.indexOf("#") != -1) {
                    hash = input1.substr(input1.indexOf("#"));
                    input1 = input1.substr(0,input1.length-(input1.length-input1.indexOf("#")));
                }
                if(input1.indexOf("?") != -1) {
                    queryString = input1.substr(input1.indexOf("?"));
                    input1 = input1.substr(0,input1.length-(input1.length-input1.indexOf("?")));
                }
                input1 = input1.length == 0 ? "./index.html" : (input1.endsWith("/") ? input1 + "index.html" : input1 + "/index.html");
	        if(queryString !== undefined) {
		    input1 += queryString;
                }
		if(hash !== undefined) {
                    input1 += hash;
                }
            break;
            case LINK_STATE_INTERNAL_LICENSE_FILE:
            break;
        }
        window.open(input1, input2);
}

function followIntent(url) {
        var redirect = "./";
	var server = "https://app.moroway.de/";
	if(url !== null && url.indexOf(server) === 0) {
	   url = url.replace(server,"");
	   var id = url.replace(/[/].*$/,""); 
	   var key = url.replace(/.*[/]([^/]+)([/])?$/,"$1");
	   if(url.length > 0 && id.match(/^[0-9]+$/)  !== null && key.match(/^[a-zA-Z0-9]+$/) !== null) {
                redirect += "?mode=multiplay&id=" + id + "&key=" + key;
	   }
	   followLink(redirect, "_blank", LINK_STATE_INTERNAL_HTML);
	} else {
	   followLink(redirect + "html_platform/start.html","_self", LINK_STATE_INTERNAL_LICENSE_FILE);		
	}
}

//SETTINGS  
function getSettingsOC (asObject){
	
	asObject = asObject == undefined ? false : asObject;
	
	var values = {};
	var dependencies = {"landscapeGame": ["landscapeApp"]};
	var hardware = {};
	
	if(typeof(window.localStorage) != "undefined") {
    
		try{
			values = JSON.parse(window.localStorage.getItem("morowayAppOC") || "{}");
		} catch(e) {
			settings = {};
		}
      
	}
	
	
  	if (typeof values.landscapeApp != "boolean") {
                values.landscapeApp = true;
        }
  	if (typeof values.landscapeGame != "boolean") {
                values.landscapeGame = true;
        }
  
	Object.keys(values).forEach(function(value){
		
		if(dependencies[value] == undefined){
			dependencies[value] = null;
		}
		if(hardware[value] == undefined){
			hardware[value] = null;
		}
		
	});
  
  
  
	return asObject ? {"values": values, "dependencies": dependencies, "hardware": hardware} : values;
	
}

function setSettingsOC(settings, asObject){
 	
	asObject = asObject == undefined ? false : asObject;

	window.localStorage.setItem("morowayAppOC", JSON.stringify(asObject ? settings.values : settings));

}

function isSettingActiveOC(a){
	var settingsComplete = getSettingsOC(true);
	var isSettingActive = true;
		if(settingsComplete.dependencies[a] !== null){
			settingsComplete.dependencies[a].forEach(function(key){
				if(!(getSettingsOC())[key]) {
					isSettingActive = false;
				}
			});
		}
	return isSettingActive;
}

function isHardwareAvailableOC(a){
		var settingsComplete = getSettingsOC(true);
        var isHardwareAvailable = true;
		var hardware = getLastHardwareConfig();
		if(settingsComplete.hardware[a] !== null){
			settingsComplete.hardware[a].forEach(function(current){
				Object.keys(current).forEach(function(key){
					switch (key) {
						case "input":
							if(!(hardware[key] == undefined || current[key] == hardware[key])) {
                                isHardwareAvailable = false;
                            }
						break;
					}
				});
			});
		}
	return isHardwareAvailable;
}

////Optional code (app works without it))
function globalDR() {
	window.plugins.webintent.onNewIntent(function (url) {
		followIntent(url);
	});
}