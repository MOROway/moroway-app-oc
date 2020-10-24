//NOTIFICATIONS
function notify (a, b, c, d, e, f){
   var notificationContainer = document.querySelector('#canvas-notifier');     
   var obj = {message: a, timeout: c};
   if(d!= null && e!= null){
   	obj.actionHandler = d;
    obj.actionText = e;
   }
   if(b || (f >= notificationContainer.offsetHeight && settings.showNotifications)){
    		notificationContainer.MaterialSnackbar.showSnackbar(obj);
   } else {
    		console.log(a);
   }
}

//COPY & PASTE
function copy(selector) {
	var selection = window.getSelection();
	selection.removeAllRanges();
	var range = document.createRange();
	range.selectNodeContents(document.querySelector(selector));
	selection.addRange(range);
	if(document.execCommand("copy")){
		return true;
	} else {
		navigator.permissions.query({name: "clipboard-write"}).then(function(status) {
			if (status.state == "granted") {
				var text = document.querySelector(selector).textContent;
				navigator.clipboard.writeText(text).then(function() {
					return true;
				}, function() {
					return false;
				});
			} else {
				return false;
			}
		}).catch(function(error){
			return false;
		});
	}
}

//HANDLE OBJECTS
function copyJSObject(obj) {
	return JSON.parse(JSON.stringify(obj));
}

//HANDLE QUERY String
function getQueryString(key){
	var value = "";
	window.location.search.substr(1).split("&").forEach(function(part){
		if(part.indexOf("=") > 0 && part.substr(0,part.indexOf("=")) == key) {
			value = part.substr(part.indexOf("=")+1);
		}
	});
	return value;
}

//HANDLE LINKS
function getShareLink(id, key) {
	return formatJSString("https://app.moroway.de/{{0}}/{{1}}", id, key);
}
function getServerLink(protocol) {
	return ((protocol == undefined) ? "https:" : protocol) + "//herrmann-engel.de/projekte/moroway/moroway-app/server";
}
function getServerRedirectLink(key) {
	const SERVER_REDIRECT_LINK = getServerLink()+ "/redirect_to/index.php";
	return SERVER_REDIRECT_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG;
}
function getServerHTMLLink(key, showCloseButton) {
	const SERVER_HTML_LINK = getServerLink()+ "/html_content/index.php";
	if(showCloseButton === undefined){
		showCloseButton="";
	}
	return SERVER_HTML_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG + "&closeButton=" + showCloseButton;
}
function handleServerJSONValues(key, func) {
	const SERVER_JSON_LINK = getServerLink()+ "/json_content/index.php";
	fetch(SERVER_JSON_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG).then(function(response) {
		return response.json();
	})
	.catch(error => console.log('Fetch-Imprint-Error:', error))
	.then(function(response) {
		if(typeof response == "object" && typeof response.error == "undefined") {
			func(response);
		} else {
			console.log(typeof response != "undefined" && typeof response.error != "undefined" ? "ERROR: " + response.error : "ERROR: Can't handle request!");
		}
	});
}

//HANDLE STRINGS
function getString(prop, punctuationMark, caseType, lang) {
	if (typeof lang == "undefined") {
		lang = CURRENT_LANG;
	}
	var str;
	if(Array.isArray(prop)) {
		if(prop.length == 2 && typeof prop[0] == "string" && typeof prop[1] == "number") {
			if(typeof STRINGS[lang] != "undefined" && typeof STRINGS[lang][prop[0]] != "undefined") {
				str = STRINGS[lang][prop[0]][prop[1]];
			} else if (typeof STRINGS[DEFAULT_LANG] != "undefined" && typeof STRINGS[DEFAULT_LANG][prop[0]] != "undefined") {
				str = STRINGS[DEFAULT_LANG][prop[0]][prop[1]];
			} else {
				return "undefined";
			}
		} else {
				return "undefined";			
		}
	} else {
		str = typeof STRINGS[lang] == "undefined" || typeof STRINGS[lang][prop] == "undefined" ? typeof STRINGS[DEFAULT_LANG] == "undefined" ||  typeof STRINGS[DEFAULT_LANG][prop] == "undefined" ? "undefined" : STRINGS[DEFAULT_LANG][prop] : STRINGS[lang][prop];
	}
	str += typeof punctuationMark == "string" ? punctuationMark : "";
	return typeof caseType == "string" && caseType == "upper" ? str.toUpperCase() : typeof caseType == "string" && caseType == "lower" ? str.toLowerCase() : str;
}


function formatJSString (str) {
	if(typeof str !== "string") {
		return str;
	}
	for (var i = 0; i < arguments.length-1; i++) {
		if(str.indexOf("{{"+i+"}}") !== -1 && (typeof arguments[i+1] == "number" || typeof arguments[i+1] == "string")){
			var replace = new RegExp("\{\{["+i+"]\}\}","g");
			str = str.replace(replace,arguments[i+1]);
		}
	}
	var replace = new RegExp("\{\{[0-9]+\}\}","g");
	str = str.replace(replace,"");
	return str;
}

function formatHTMLString (str) {
	if(typeof str !== "string") {
		return str;
	}
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function setHTMLStrings() {
	var elems = document.querySelectorAll("*[data-stringid-content]");
	for (var i = 0; i < elems.length; i++) {
		var args =[];
		args[0] = typeof elems[i].dataset.stringidContentArrayno == "string" ? getString([elems[i].dataset.stringidContent, parseInt(elems[i].dataset.stringidContentArrayno, 10)],elems[i].dataset.stringidContentPunctuation,elems[i].dataset.stringidContentCase) : getString(elems[i].dataset.stringidContent,elems[i].dataset.stringidContentPunctuation,elems[i].dataset.stringidContentCase);
		var argsNo = 1;
		do {
			var elCArg = elems[i].dataset["stringidContentArgisstringref"+argsNo] == "1" ? getString(elems[i].dataset["stringidContentArg"+argsNo]) : elems[i].dataset["stringidContentArg"+argsNo];
			if(typeof elCArg == "string") {
				args[argsNo] = elCArg;
				argsNo++;
			} else {
				argsNo = 1;
			}
		} while (argsNo > 1);
		elems[i].textContent = formatJSString( ...args );
	}
	elems = document.querySelectorAll("*[data-stringid-title]");
	for (var i = 0; i < elems.length; i++) {
		var args =[];
		args[0] = typeof elems[i].dataset.stringidTitleArrayno == "string" ? getString([elems[i].dataset.stringidTitle, parseInt(elems[i].dataset.stringidTitleArrayno, 10)],elems[i].dataset.stringidTitlePunctuation,elems[i].dataset.stringidTitleCase) : getString(elems[i].dataset.stringidTitle,elems[i].dataset.stringidTitlePunctuation,elems[i].dataset.stringidTitleCase);
		var argsNo = 1;
		do {
			var elCArg = elems[i].dataset["stringidTitleArgisstringref"+argsNo] == "1" ? getString(elems[i].dataset["tringidTitleArg"+argsNo]) : elems[i].dataset["tringidTitleArg"+argsNo];
			if(typeof elCArg == "string") {
				args[argsNo] = elCArg;
				argsNo++;
			} else {
				argsNo = 1;
			}
		} while (argsNo > 1);
		elems[i].title = formatJSString( ...args );
	}
	elems = document.querySelectorAll("*[data-stringid-alt]");
	for (var i = 0; i < elems.length; i++) {
		var args =[];
		args[0] = typeof elems[i].dataset.stringidAltArrayno == "string" ? getString([elems[i].dataset.stringidAlt, parseInt(elems[i].dataset.stringidAltArrayno, 10)],elems[i].dataset.stringidAltPunctuation,elems[i].dataset.stringidAltCase) : getString(elems[i].dataset.stringidAlt,elems[i].dataset.stringidAltPunctuation,elems[i].dataset.stringidAltCase);
		var argsNo = 1;
		do {
			var elCArg = elems[i].dataset["stringidAltArgisstringref"+argsNo] == "1" ? getString(elems[i].dataset["stringidAltArg"+argsNo]) : elems[i].dataset["stringidAltArg"+argsNo];
			if(typeof elCArg == "string") {
				args[argsNo] = elCArg;
				argsNo++;
			} else {
				argsNo = 1;
			}
		} while (argsNo > 1);
		elems[i].alt = formatJSString( ...args );
	}
}

function setCurrentLang(lang){
 	if(typeof(window.localStorage) != "undefined") {
		window.localStorage.setItem("morowayAppLang", lang);
	}
}
//LOCAL APP DATA COPY
function getLocalAppDataCopy (){
	
	var localAppDataCopy = {};
	
	if(typeof(window.localStorage) != "undefined") {
    
		try{
			localAppDataCopy = JSON.parse(window.localStorage.getItem("morowayAppData") || "{}");
		} catch(e) {
			localAppDataCopy = {};
		}
      
	}

	return Object.keys(localAppDataCopy).length === 0 ? null : localAppDataCopy;
	
}

function setLocalAppDataCopy(){
 	if(typeof(window.localStorage) != "undefined") {
		window.localStorage.setItem("morowayAppData", JSON.stringify(APP_DATA));
	}
}

//Current Hardware Usage & Last Hardware Usage
function setCurrentHardwareConfig(a,b){
 	if(typeof(window.localStorage) != "undefined") {
		var hardware = {};
		try{
			hardware = JSON.parse(window.localStorage.getItem("morowayAppHardwareConf") || "{}");
		} catch(e) {
			hardware = {};
		}
		if(hardware[a] == undefined || hardware[a] != b){
			hardware[a] = b;
			window.localStorage.setItem("morowayAppHardwareConf", JSON.stringify(hardware));
		}
	}
}

function getLastHardwareConfig(){
 	if(typeof(window.localStorage) != "undefined") {
		var hardware = {};
		try{
			hardware = JSON.parse(window.localStorage.getItem("morowayAppHardwareConf") || "{}");
		} catch(e) {
			hardware = {};
		}
		return hardware;
	}
}

//SETTINGS  
function getSettings (asObject){
	
	asObject = asObject == undefined ? false : asObject;
	
	var values = {};
	var dependencies = {"alwaysShowSelectedTrain": ["classicUI"], "classicUIGreenTrainSwitch": ["classicUI"]};
	var hardware = {"cursorascircle": [{"input": "mouse"}]};
	
	if(typeof(window.localStorage) != "undefined") {
    
		try{
			values = JSON.parse(window.localStorage.getItem("morowayApp") || "{}");
		} catch(e) {
			settings = {};
		}
      
	}
	
	
  	if (typeof values.showNotifications != "boolean") 
      values.showNotifications = true;
  
  	if (typeof values.classicUI != "boolean") 
      values.classicUI = true;
  
	if (typeof values.alwaysShowSelectedTrain != "boolean") 
      values.alwaysShowSelectedTrain = true;
  
	if (typeof values.cursorascircle != "boolean") 
      values.cursorascircle = true;
  
    if (typeof values.burnTheTaxOffice != "boolean") 
      values.burnTheTaxOffice = false;
  
    if (typeof values.classicUIGreenTrainSwitch != "boolean") 
      values.classicUIGreenTrainSwitch = true;
  
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

function setSettings(settings, asObject){
 	
	asObject = asObject == undefined ? false : asObject;

	window.localStorage.setItem("morowayApp", JSON.stringify(asObject ? settings.values : settings));

}

function isSettingActive(a){
	var settingsComplete = getSettings(true);
	var isSettingActive = true;
		if(settingsComplete.dependencies[a] !== null){
			settingsComplete.dependencies[a].forEach(function(key){
				if(!(getSettings())[key]) {
					isSettingActive = false;
				}
			});
		}
	return isSettingActive;
}

function isHardwareAvailable(a){
		var settingsComplete = getSettings(true);
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

//WINDOW
function measureViewspace(a) {

    var b = [{hasTouch: ("ontouchstart" in document.documentElement)},{isSmallDevice: (window.innerHeight < 290 || window.innerWidth < 750)},{isTinyDevice: (window.innerHeight < 250 || window.innerWidth < 600)}];
    return a == -1 ? b : (a < b.length && a >= 0 ? b[a] : false);

} 

//GLOBAL CONSTANTS
const LINK_STATE_NORMAL = 0;
const LINK_STATE_INTERNAL_HTML = 1;
const LINK_STATE_INTERNAL_LICENSE_FILE = 2;

const STRINGS = {
	en:{
		langName: "English",
		generalTitle: "MOROway App", generalBack: "Back", generalTitleSettingsScreen: "Options", generalTitleHelpScreen: "Legal / Help", generalTitleErrorScreen: "Known Issues", generalTitleWhatsNewScreen: "Changelog", generalNoDOMStorageSupport: "Sorry - DOM Storage not supported",
		appScreenNoCanvas: "Please update your browser", appScreenFurtherInformation: "More information", appScreenHasLoaded:"App ready", appScreenHasUpdated:"New version", appScreenIsFail: "FAIL - WE GONNA FIX IT ASAP", appScreenTeamplayTitle: "Multiplayer", appScreenTeamplayUnsetTitle: "Single Player", appScreenTeamplayNoWebsocket: "Can't load multiplayer functions - please update your browser", appScreenTeamplayUpdateNote: "App update recommended", appScreenTeamplayUpdateError: "App update required", appScreenTeamplayConnectionError: "Error: Couldn't connect or connection lost", appScreenTeamplayUnknownRequest: "Server did not understand request", appScreenTeamplayCreateError: "Couldn't create game", appScreenTeamplayJoinError: "Couldn't join. Game is full or obsolete", appScreenTeamplayJoinTeammateError: "Teammate couldn't join game", appScreenTeamplayStartError: "Couldn't start game", appScreenTeamplaySetupInit: "Enter Name", appScreenTeamplaySetupInitDetail: "Allowed characters: Letters and numbers.",  appScreenTeamplaySetupInitButton: "Go", appScreenTeamplaySetupCreateLink: "Create a new game", appScreenTeamplaySetupStart: "Invite your teammate using the following link",  appScreenTeamplaySetupStartButton: "Copy", appScreenTeamplayGameStart: "Clicking start will start the game when you and your teammate(s) clicked the button.", appScreenTeamplayGameStartButton: "Start", appScreenTeamplayTeammateWait: "Please wait for teammate to get ready...", appScreenTeamplayTeammateReady: "Your teammate is ready. Are you, too", appScreenTeamplayTeammateLeft: "Teammate left. Game is obsolete", appScreenTeamplaySomebodyLeft: "Teammate left", appScreenTeamplayGamePaused: "Game paused", appScreenTeamplayGameResumed: "Game resumed", appScreenTrainSelected: "{{0}} {{1}}selected", appScreenTrainSelectedAuto: "auto", appScreenSwitchTurns: "Switch turned", appScreenObjectStops: "{{0}} stops", appScreenObjectStarts: "{{0}} starts", appScreenObjectChangesDirection: "{{0}}: Direction change", appScreenObjectHasCrashed: "Crash between {{0}} and {{1}}",appScreenControlCenterTitle: "Control Center", appScreenControlCenterSpeedOff:"paused",appScreenControlCenterClose:"close", appScreenAMillionFrames: "{{0}} millionen frames shown", appScreenKonami: "You hit the Konami Code", appScreenKonamiIconRow: "\uD83D\uDE82\uD83D\uDE82\uD83D\uDE82", appScreenKonamiAnimals: ["\uD83D\uDC22", "\uD83E\uDD94"], appScreenTrainNames: ["Steam engine", "TGV Duplex", "Railbus"], appScreenTrainIcons:  ["\uD83D\uDE82","\uD83D\uDE85","\uD83D\uDE8B"], appScreenTrainCarIcon: "\uD83D\uDE83", appScreenCarNames: ["Red car", "White car", "Yellow car"], appScreenCarIcons: ["\uD83C\uDFCE\uFE0F", "\uD83D\uDE97", "\uD83D\uDE95"], appScreenCarStepsBack: "{{0}} moves back", appScreenCarAutoModeChange: "Auto-Mode  {{0}}", appScreenCarAutoModeInit: "activated", appScreenCarAutoModePause: "paused", appScreenCarAutoModeCrash: "Auto mode: car crash! Switching over to manual control... good luck!",
		settingsScreenOptNotificationsTitle: "Notifications", settingsScreenOptNotificationsDesc: "Displays on-screen notifications", settingsScreenOptNotificationsInfo: "Some notifications are shown even if deactivated. Does not work on smallest screens.",settingsScreenOptClassicUITitle: "Classic UI", settingsScreenOptClassicUIDesc: "Displays control elements like transformer.", settingsScreenOptSelectedTrainTitle: "Selected train", settingsScreenOptSelectedTrainDesc: "Displays name of the selected train.", settingsScreenOptSelectedTrainInfo: "Requires Classic UI.", settingsScreenOptCursorTitle: "Displays cursor as color.", settingsScreenOptCursorDesc: "Replaces the cursor with a colored circle.", settingsScreenOptCursorInfo: "Does not work on touch screens.", settingsScreenOptTaxOfficeTitle: "Animate burning tax office", settingsScreenOptTaxOfficeDesc: "Shows some animations on the burning tax office.", settingsScreenApply: "New configuration saved", settingsScreenLangSelectInfo: "Language selection (requires reload)", settingsScreenLangSelectChange: "Preferences saved - reload app to apply", settingsScreenLangSelectChangeButton: "reload",
		helpScreenGeneral: "General",  helpScreenGeneralWelcome: "Welcome {{0}}",  helpScreenGeneralWelcomeIcon: "\uD83C\uDFE1",  helpScreenGeneralWelcomeVersion: "Current version: {{0}}.{{1}}.{{2}} ({{3}}-{{4}}-{{5}})",  helpScreenGeneralWelcomePs: ["Hello, you use MOROway App. Enjoy!"], helpScreenGeneralWelcomeButtonWhatsNew:  "Changelog",  helpScreenGeneralTrains: "Trains {{0}}", helpScreenGeneralTrainsIcon: "\uD83D\uDE82", helpScreenGeneralTrainsPs : ["You may operate three trains; a steam engine, a high speed train and a railbus. Start / stop a train by touching / clicking it. Touch and hold or double-click a train to change it's direction.", "To navigate by using \"Classic UI\", select a train by touching / clicking the button on the lower-left side. Start / stop the selected train by operating the transformer.", "On larger devices you are also able to control the trains's speed with the transformer. Tiny devices use a medium speed, but you may zoom in on the transformer to avoid this restriction.", "To change a train's direction use the arrow symbol in the lower right corner of the transformer; this is not possible on smaller devices.", "You may turn some switches. Touch / click and hold the background to located the switches. Touch / click a switch to turn it. A red switch symbol indicates that the switch is not turned, a green one that it is turned. The train takes the red or green colored way.", "You may access a train \"Control Center\" by touching with three fingers / right-clicking the background."], helpScreenGeneralCars: "Cars {{0}}", helpScreenGeneralCarsIcon: "\uD83D\uDE97", helpScreenGeneralCarsPs: ["By touching / clicking of the three cars left to the main station, it starts. By touching and holding or double-clicking one of them they enter auto mode, which means they navigate automatically.", "If you haven't enabled auto mode and operate more than one car, you risk a head-on collision. If this happens touch and hold or double-click one of the involved cars to move it back."],  helpScreenGeneralTeamplay: "Multiplayer mode {{0}}", helpScreenGeneralTeamplayIcon: "\uD83C\uDFAE", helpScreenGeneralTeamplayPs: ["If you wish to play together with your friends use the multiplayer mode.", "First you have to enter a nick name.", "Now a new game is created and the link can be shared with up to two friends. Please note: Closing the app will destroy the game. The links expire after a while.", "After your teammate(s) joined you should touch / click 'start' and the game will start as soon as all your teammates touched / clicked the button. If you invited more than just one teammate, do not start the game before everyone joined, because after your or a teammate pressed the button nobody can join anymore.", "Now all actions are synced and you can play together."], helpScreenGraphical: "Graphical help", helpScreenGraphicalDescription: "Graphical explanation {{0}}",  helpScreenGraphicalDescriptionIcon: "\uD83C\uDF88", helpScreenGraphicalDescriptionPs: ["1: Animated trains.", "2: Animated cars.", "3: Animated burning tax office.", "4: Train selection.", "5: Selected train.", "6: Transformer.", "7: Change train direction.", "8: Switches."], helpScreenGraphicalDescriptionPic:  "Descriptive image",  helpScreenLegal: "Legal",  helpScreenLegalLibraries: "Libraries {{0}}", helpScreenLegalLibrariesIcon: "\uD83C\uDFD7\uFE0F", helpScreenLegalStrCopyright: "Copyright",helpScreenLegalStrLicense: "License", helpScreenLegalLibrariesMDL: "Material Design Lite", helpScreenLegalLibrariesMDLPs: ["This app uses the design framework \"Material Design Lite\" by Google Inc."], helpScreenLegalLibrariesPace: "Pace.js", helpScreenLegalLibrariesPacePs: ["This app uses the loading animation \"Pace.js\" by HubSpot Inc."], helpScreenLegalFonts: "Fonts {{0}}", helpScreenLegalFontsIcon: "\uD83C\uDF10", helpScreenLegalFontsRoboto: "Roboto", helpScreenLegalFontsRobotoPs: ["This app uses \"Roboto\" font by Google Inc."], helpScreenLegalFontsMaterialIcons: "Material Icon Font", helpScreenLegalFontsMaterialIconsPs: ["This app uses \"Material Icon\" font by Google Inc."], helpScreenLegalAppOC: "MOROway App OC {{0}}", helpScreenLegalAppOCIcon: "\uD83D\uDCF1", helpScreenLegalAppOCCordova: "Apache Cordova", helpScreenLegalAppOCCordovaPs: ["The MOROway App OC variant is based upon Apache Cordova by The Apache Software Foundation."], helpScreenLegalAppOCInsomnia: "Insomnia (prevent screen sleep)", helpScreenLegalAppOCInsomniaPs: ["The MOROway App OC variant uses Insomnia-PhoneGap-Plugin by Eddy Verbruggen."], helpScreenLegalAppOCWebintent: "cordova-webintent", helpScreenLegalAppOCWebintentPs: ["The MOROway App OC variant uses WebIntent Android Plugin for Cordova by Boris Smus and contributors."], helpScreenLegalAppOCWhitelist: "Whitelist", helpScreenLegalAppOCWhitelistPs: ["The MOROway App OC variant uses the Whitelist Plugin by The Apache Software Foundation."], helpScreenLegalAppOCDialogs: "cordova-plugin-dialogs", helpScreenLegalAppOCDialogsPs: ["The MOROway App OC variant uses the Dialogs Plugin by The Apache Software Foundation."], helpScreenLegalAppOCOrientation: "cordova-plugin-screen-orientation", helpScreenLegalAppOCOrientationPs: ["The MOROway App OC variant uses the Screen Orientation Plugin by The Apache Software Foundation."], helpScreenLegalAppOCSplashscreen: "cordova-plugin-splashscreen", helpScreenLegalAppOCSplashscreenPs: ["The MOROway App OC variant uses the Splashscreen Plugin by The Apache Software Foundation."], helpScreenLegalOwn: "MOROway App {{0}}", helpScreenLegalOwnIcon: "\u270C\uFE0F", helpScreenLegalOwnCode: "General", helpScreenLegalOwnCodePs: ["Everything we created is licensed under the Apache License Version 2.0."], helpScreenLegalOwnPics: "Assets", helpScreenLegalOwnPicsPs: ["Our assets are also licensed under the Creative Commons Attribution 4.0 International-License."], helpScreenContact: "Contact",  helpScreenContactFeedback: "Feedback {{0}}", helpScreenContactFeedbackIcon: "\uD83D\uDCEB", helpScreenContactFeedbackPs: ["Get in touch using the contact infos displayed below!"], helpScreenContactFeedbackBugs: "Report a bug", helpScreenContactImprintTitle: "Contact info", helpScreenContactBackupLink: "Open contact info", helpScreenContactBackupLinkNotification: "Contact info opened", helpScreenContactFeedbackSend: "Send feedback", helpScreenContactFeedbackSendNotification: "Feedback page opened", helpScreenDownload: "Download",  helpScreenDownloadApps: "Apps {{0}}", helpScreenDownloadAppsIcon: "\uD83D\uDCBE", helpScreenDownloadAppsAndroid: "Android", helpScreenDownloadAppsAndroidPs: ["You can download this app via Google Play Store or F-Droid."], helpScreenDownloadAppsAndroidButton: "Play Store", helpScreenDownloadAppsFdroidButton: "F-Droid", helpScreenDownloadAppsWindows: "Windows", helpScreenDownloadAppsWindowsPs: ["You can download this app to your Laptop / PC via Microsoft Store."], helpScreenDownloadAppsWindowsButton: "Microsoft Store", helpScreenDownloadViewSource: "Get Code {{0}}",helpScreenDownloadViewSourceIcon: "\uD83D\uDD0D\uFE0F", helpScreenDownloadViewSourcePs: ["Get Source Code from GitHub."], helpScreenDownloadViewSourceCodePic: "Sample code", helpScreenDownloadViewSourceButtonSource: "GitHub", helpScreenMOROmore: "More about MOROway", helpScreenMOROmoreWebsite: "MOROway Website {{0}}", helpScreenMOROmoreWebsiteIcon: "\uD83D\uDEE4\uFE0F", helpScreenMOROmoreWebsitePs: ["Visit our website..."], helpScreenMOROmoreWebsiteButtonLink: "Website",
		whatsNewScreenVersionNumber: "Version {{0}}", whatsNewScreenVersionNumberMinor: "New in version {{0}}.{{1}}", whatsNewScreenVersionIsNew: "New", whatsNewScreenByVersionMa1Mi0: ["2011", "First release featuring steam locomotive."], whatsNewScreenByVersionMa2Mi0: ["2011", "{{0}}TGV Duplex.", "{{0}}First car."], whatsNewScreenByVersionMa3Mi0: ["2011", "{{0}}Second car.", "Car controls added.", "Improved paths."], whatsNewScreenByVersionMa3Mi1: ["2011", "Info section added."], whatsNewScreenByVersionMa3Mi2: ["2011", "Short intro added.", "Train controls added."], whatsNewScreenByVersionMa4Mi0: ["2015", "{{0}}Update from Action-Script 2 to Action-Script 3.", "{{0}}Added cars to steam engine.", "{{0}}Third train (railbus).", "{{0}}Start/stop train by clicking them.", "Improved background.", "Improved car paths.", "New intro.", "Improved controls and info text", "Bugfixes."], whatsNewScreenByVersionMa5Mi0: ["2018", "{{0}}Better background.", "{{0}}Custom train speed.", "{{0}}Change train direction.", "{{0}}Notifications.", "{{0}}Option menu added.", "{{0}}Better intro.", "{{0}}Animated burning tax office.", "Improved objects.", "Improved object paths.", "Improved controls.", "Optimized GUI.", "Improved help section.", "HTML/JS/CSS replaces Flash Action Script.", "Offline-Support as Progressive-Web-App.", "Use of Open-Source-Components.", "Own code is licensed differently."], whatsNewScreenByVersionMa5Mi1: ["2018", "{{0}}Turn switches.", "Improved train paths.", "Bugfixes."], whatsNewScreenByVersionMa5Mi2: ["2018", "{{0}}Trains: Acceleration delay.","{{0}}Cars: auto mode added.","{{0}}Cars: Option to move back a bit.", "Improved controls."], whatsNewScreenByVersionMa5Mi3: ["2018", "{{0}}Third car (yellow car).", "{{0}} English Version", "Better switch symbols", "Bugfixes."], whatsNewScreenByVersionMa5Mi4: ["2018", "Own code is licensed differently. (Apache License Version 2 replaces Two-Clause-BSD)"], whatsNewScreenByVersionMa5Mi5: ["2018", "Added website link in help section."], whatsNewScreenByVersionMa5Mi6: ["2018", "Cars: Improvements for auto mode.", "Only display active settings."], whatsNewScreenByVersionMa6Mi0: ["2019", "{{0}}Play with your friends using the new multiplayer mode.", "Bugfixes."], whatsNewScreenByVersionMa6Mi1: ["2020", "{{0}}Multithreading.", "Removed option to disable switches."], whatsNewScreenByVersionMa6Mi2: ["2020", "{{0}}Allow gameplay zoom by touch gestures, keyboard and mousewheel.", "{{0}}Gameplay \"Control Center\""], whatsNewScreenByVersionMa6Mi3: ["2020", "High precision handling of switches."],
		errorScreenErrorAnimate: "Animation – Web Worker", errorScreenErrorAnimateGeneral: "Unknown web worker error", errorScreenErrorAnimateGeneralP1: "An error with the animation web worker thread occured. Either it could not be registered or a runtime error occured. Is your browser up to date?", errorScreenErrorMissing: "Missing Elements", errorScreenErrorMissingPics: "Images", errorScreenErrorMissingPicsP1: "If the image is accidentally removed from the server you have to wait for us to fix this problem.", errorScreenErrorMissingPicsP2: "If you have problems with your internet connection or firewall you have to fix it.", errorScreenErrorTeamplay: "Multiplayer Errors", errorScreenErrorTeamplayJoin: "Can't join game", errorScreenErrorTeamplayJoinP1: "If you can't join a game, it might be full, obsolete or already running. Please create a new game.", errorScreenErrorTeamplayConnection: "Can't establish connection", errorScreenErrorTeamplayConnectionP1: "If you can't establish a connection to the game server, it can have multiple reasons. First of all make sure, you are connected to the Internet and use a modern browser as well as an up-to-date version of MOROway App.", errorScreenErrorTeamplayConnectionP2: "If following these steps does not helps there might be a server problem. If so try again later.", errorScreenErrorTeamplayUpdate: "Update required", errorScreenErrorTeamplayUpdateP1: "You have to update to the newest version of MOROway App.",
		platformOcStartGame: "Play", platformOcStartGameOnline: "Multiplayer", platformOcStartHelp: "Help/Legal", platformOcStartSettings: "Settings", platformOcStartSettingsOc: "Settings (Advanced)", platformOcSettingsOptLandscapeAppTitle: "App: Allow screen rotation", platformOcSettingsOptLandscapeAppDesc: "If disabled app always displays in landscape mode.", platformOcSettingsOptLandscapeGameTitle: "Gameplay: Allow screen rotation", platformOcSettingsOptLandscapeGameDesc: "If disabled game always displays in landscape mode.", platformOcSettingsOptLandscapeGameInfo: "Limit orientation lock to gameplay.", platformOcGameLeave: "Leave and destroy game?", platformOcGameLeaveTitel: "Are you sure?", platformOcGameLeaveYes: "Leave!", platformOcGameLeaveNo: "Cancel!", platformOcAppUpdate: "New features available!", platformOcAppUpdateTitel: "App-Update", platformOcAppUpdateYes: "View", platformOcAppUpdateNo: "Ignore", platformWebSettingsIframeApplyAndClose: "Apply and close", platformWindowsLinkError: "Error! Couldn't open link.", platformWindowsAppScreenFeedback: "Feedback", platformWindowsAppScreenChangelog: "Changelog"},
	de:{
		langName: "Deutsch",
		generalTitle: "MOROway App", generalBack: "Zurück", generalTitleSettingsScreen: "Einstellungen", generalTitleHelpScreen: "Hilfe & Informationen", generalTitleErrorScreen: "Bekannte Fehler", generalTitleWhatsNewScreen: "Versionsgeschichte", generalNoDOMStorageSupport: "Sorry - DOM Storage nicht unterstützt",
		appScreenNoCanvas: "Ihr Browser wird nicht unterstützt. UPDATE HILFT!", appScreenFurtherInformation: "Mehr Informationen", appScreenHasLoaded:"Anwendung geladen", appScreenHasUpdated:"Neue Version", appScreenIsFail: "FEHLER - Wir kümmern uns ASAP", appScreenTeamplayTitle: "Mehrspielermodus", appScreenTeamplayUnsetTitle: "Einzelspielermodus", appScreenTeamplayNoWebsocket: "Mehrspielerfunktionen nicht unterstützt - Browser bitte updaten", appScreenTeamplayUpdateNote: "App-Update empfohlen", appScreenTeamplayUpdateError: "App-Update erforderlich", appScreenTeamplayConnectionError: "Fehler: Keine Verbindung möglich oder Verbindung verloren", appScreenTeamplayUnknownRequest: "Der Server konnte die Anfrage nicht verarbeiten", appScreenTeamplayCreateError: "Spiel konnte nicht erstellt werden", appScreenTeamplayJoinError: "Beitritt zum Spiel nicht möglich (voll oder obsolet)", appScreenTeamplayJoinTeammateError: "Ihr Mitspieler konnte dem Spiel nicht beitreten", appScreenTeamplayStartError: "Spiel konnte nicht gestartet werden.", appScreenTeamplaySetupInit: "Namen eingeben", appScreenTeamplaySetupInitDetail: "Erlaubte Zeichen: Buchstaben und Zahlen.",  appScreenTeamplaySetupInitButton: "Los", appScreenTeamplaySetupCreateLink: "Neues Spiel erstellen", appScreenTeamplaySetupStart: "Laden Sie Ihre(n) Mitspieler über folgenden Link ein",  appScreenTeamplaySetupStartButton: "Kopieren", appScreenTeamplayGameStart: "Sobald Sie und alle Ihre Mitspieler auf Start geklickt haben, geht das Spiel los.", appScreenTeamplayGameStartButton: "Start", appScreenTeamplayTeammateWait: "Bitte warten sie auf Ihren Mitspieler...", appScreenTeamplayTeammateReady: "Ihr Mitspieler ist bereit. Sie auch?", appScreenTeamplayTeammateLeft: "Ein Mitspieler hat das Spiel verlassen. Das Spiel ist obsolet", appScreenTeamplaySomebodyLeft: "Ein Mitspieler hat das Spiel verlassen", appScreenTeamplayGamePaused: "Spiel angehalten", appScreenTeamplayGameResumed: "Spiel fortgesetzt", appScreenTrainSelected: "{{0}} {{1}}ausgewählt", appScreenTrainSelectedAuto: "automatisch", appScreenSwitchTurns: "Weiche gestellt", appScreenObjectStops: "{{0}} hält an", appScreenObjectStarts: "{{0}} fährt los", appScreenObjectChangesDirection: "{{0}}: Richtung gewechselt", appScreenObjectHasCrashed: "Crash zwischen {{0}} und {{1}}",appScreenControlCenterSpeedOff:"gestoppt",appScreenControlCenterClose:"schließen", appScreenAMillionFrames: "{{0}} Millionen Frames gezeigt", appScreenKonami: "Super - Sie haben den Konamicode geknackt", appScreenTrainNames: ["Dampflok", "TGV Duplex", "Schi-Stra-Bus"], appScreenCarNames: ["Rotes Auto", "Weißes Auto", "Gelbes Auto"], appScreenCarStepsBack: "{{0}} setzt zurück", appScreenCarAutoModeChange: "Automatische Autosteuerung  {{0}}", appScreenCarAutoModeInit: "gestartet", appScreenCarAutoModePause: "gestoppt", appScreenCarAutoModeCrash: "Auto-Mode: Autounfall! Schalte um auf manuelle Steuerung. Viel Glück!",
		settingsScreenOptNotificationsTitle: "Benachrichtigungen", settingsScreenOptNotificationsDesc: "Zeigt Texteinblendungen bei verschiedenen Aktionen an.", settingsScreenOptNotificationsInfo: "Funktioniert nicht auf kleinen Bildschirmen. Einige Benachrichtigungen werden trotz Deaktivierung dieser Option angezeigt.",settingsScreenOptClassicUITitle: "Klassische Steuerelemente", settingsScreenOptClassicUIDesc: "Zeigt die klassischen Steuerelemente wie Trafo und Zugauswahlbutton.", settingsScreenOptSelectedTrainTitle: "Ausgewählter Zug", settingsScreenOptSelectedTrainDesc: "Zeigt den Namen des ausgewählten Zuges immer an.", settingsScreenOptSelectedTrainInfo: "Erfodert aktivierte \"Klassische Steuerelemente\".", settingsScreenOptCursorTitle: "Cursor als Farbe darstellen", settingsScreenOptCursorDesc: "Zeigt statt dem Maussymbol einen Farbkreis.", settingsScreenOptCursorInfo: "Funktioniert nicht auf Touchscreens.", settingsScreenOptTaxOfficeTitle: "Brennendes Finanzamt animieren", settingsScreenOptTaxOfficeDesc: "Zeigt Animationen zum brennenden Finanzamt.", settingsScreenApply: "Einstellungen aktualisiert", settingsScreenLangSelectInfo: "Sprache wählen (erfordert Neuladen)", settingsScreenLangSelectChange: "Sprachwahl gespeichert - Erneut laden, um anzuwenden", settingsScreenLangSelectChangeButton: "Neuladen",
		helpScreenGeneral: "Allgemeines",  helpScreenGeneralWelcome: "Welcome {{0}}",  helpScreenGeneralWelcomeVersion: "Sie verwenden aktuell die am {{5}}. {{4}}. {{3}} erstellte Version {{0}}.{{1}}", helpScreenGeneralWelcomePs: ["Hallo! Sie benutzen die MOROway App. Der Hintergrund stellt eine Luftaufnahme der Modellbahn MOROway aus dem Jahre 2011 dar. Viel Fahrspaß!"], helpScreenGeneralWelcomeButtonWhatsNew:  "Neuigkeiten", helpScreenGeneralTrains: "Eisenbahnen {{0}}", helpScreenGeneralTrainsPs : ["Zur Zeit lassen sich drei Züge steuern; eine Dampflok, ein TGV Duplex und ein Schienen-Straßen-Bus. Das Starten bzw. Stoppen eines Zuges erfolgt durch Touch bzw. Klick auf den gewünschten Zug oder mit Hilfe der ausblendbaren klassischen Steuerelemente. Um einen Zug zu wenden, halten Sie den Zug an und touchen und halten bzw. doppelklicken Sie ihn.", "Um mittels der klassischen Steuerelemente zu fahren, wählen Sie zunächst einen Zug aus, indem Sie den Schalter unten links im Appbildschirm betätigen, bis der Name des gewünschten Zuges eingeblendet wird. Durch Anklicken des Transformators unten rechts im Appbildschirm wird der jeweils ausgewählte Zug gestartet und gestoppt.", "Wenn Sie einen größeren Bildschirm verwenden, so können Sie die Geschwindigkeit des Zuges beeinflussen, indem Sie den Regler des Transformators an die gewünschte Position ziehen, ihn an unterschiedlichen Stellen anklicken oder über ihm am Mausrad drehen. Auf kleinsten Bildschirmen wird unabhängig hiervon eine mittlere Geschwindigkeit eingestellt. Sie können diese Beschränkung umgehen durch Heranzoomen des Transformators.", "Um auf größeren Bildschirmen die Richtung des jeweils ausgewählten Zuges am Transformator zu ändern, halten Sie den Zug an und klicken dann das Symbol mit den gespiegelten Pfeilen unten rechts im Transformator an. Auf kleineren Bildschirmen kann die Richtung hier nicht verändert werden.", "Auch können Sie einige Weichen stellen. Das Stellen einer Weiche erfolgt durch Klick auf das farbige Symbol der jeweiligen Weiche. Die Position der Symbole kann durch langen Klick bzw. Touch auf den Hintergrund der Anlage ermittelt werden. Ein rotes Weichensymbol bedeutet, dass die Weiche nicht gestellt worden ist, ein grünes das Gegenteil. Der Zug befährt immer den eingefärbten Weg.","Sie können ein \"Control Center\" für die Züge aufrufen durch Drei-Finger-Touch / Rechtsklick auf den Hintergrund."], helpScreenGeneralCars: "Autos {{0}}", helpScreenGeneralCarsPs: ["Sie können die drei links neben dem Bahnhof geparkten Autos (gelbes Cabrio, rotes Cabrio, weißer VW-Bus) jeweils per Klick auf das Fahrzeug zum Fahren bringen. Um alle Autos automatisch fahren zu lassen, aktivieren Sie durch Touchen und halten bzw. Doppelklicken eines Autos den automatischen Modus.", "Sofern sie den automatischen Modus nicht aktiviert haben lassen sich die Autos getrennt per Klick starten und stoppen. Starten Sie mehrere Autos, riskieren Sie einen Frontalzusammenstoß. Um die betroffenen Autos hiernach erneut starten zu können, setzten Sie ein Auto durch Touchen und halten bzw. Doppelklicken des Autos zurück."], helpScreenGeneralTeamplay: "Mehrspielermodus {{0}}", helpScreenGeneralTeamplayPs: ["Um ein Spiel mit Freunden zu starten, wählen Sie den Mehrspielermodus in der Hauptansicht.", "Hier ist ein Spitzname einzugeben.", "Nun ist ein Spiel erstellt und kann mit bis zu zwei Freunden geteilt werden. Ein Schließen der App zerstört das Spiel. Nach einiger Zeit wird der Link ungültig.", "Sobald Sie und all Ihre Mitspieler 'Start' gedrückt haben, startet das Spiel. Drücken Sie nicht auf Start, bevor alle Spieler dem Spiel beigetreten sind, da von nun an kein Beitritt mehr möglich ist.", "Ab jetzt werden alle Aktionen synchronisiert und Sie können gemeinsam spielen."], helpScreenGraphical: "Grafische Hilfe", helpScreenGraphicalDescription: "Grafische Erläuterung {{0}}",  helpScreenGraphicalDescriptionPs: ["1: Animierte Züge.", "2: Animierte Autos.", "3: Animiertes brennendes Finanzamt.", "4: Zugauswahl.", "5: Ausgewählter Zug.", "6: Transformator.", "7: Zugrichtungswechsel.", "8: Weichen."],helpScreenGraphicalDescriptionPic:  "Beschreibendes Bild", helpScreenLegal: "Lizenzen",  helpScreenLegalLibraries: "Eingebaute Libraries {{0}}",  helpScreenLegalStrCopyright: "Copyright",helpScreenLegalStrLicense: "Lizenz", helpScreenLegalLibrariesMDL: "Material Design Lite", helpScreenLegalLibrariesMDLPs: ["Wir verwenden das Designframework \"Material Design Lite\" der Google Inc."],helpScreenLegalLibrariesPace: "Pace.js", helpScreenLegalLibrariesPacePs: ["Wir verwenden die Ladeanimation \"Pace.js\" der HubSpot Inc."],helpScreenLegalFonts: "Verwendete Schriften {{0}}", helpScreenLegalFontsRoboto: "Roboto", helpScreenLegalFontsRobotoPs: ["Wir verwenden an einigen Stellen die Schriftart \"Roboto\" der Google Inc."], helpScreenLegalFontsMaterialIcons: "Material Icon Font", helpScreenLegalFontsMaterialIconsPs: ["Wir verwenden an einigen Stellen die \"Material Icons\" der Google Inc."], helpScreenLegalAppOC: "MOROway App OC {{0}}", helpScreenLegalAppOCCordova: "Apache Cordova", helpScreenLegalAppOCCordovaPs: ["Die MOROway App OC Variante basiert auf Apache Cordova erstellt von der Apache Software Foundation."], helpScreenLegalAppOCInsomnia: "Insomnia", helpScreenLegalAppOCInsomniaPs: ["Die MOROway App OC Variante nutzt das Insomnia-PhoneGap-Plugin erstellt von Eddy Verbruggen."], helpScreenLegalAppOCWebintent: "Webintent", helpScreenLegalAppOCWebintentPs: ["Die MOROway App OC Variante nutzt das WebIntent Android Plugin for Cordova erstellt von Boris Smus und Beitragenden."], helpScreenLegalAppOCWhitelist: "Whitelist", helpScreenLegalAppOCWhitelistPs: ["Die MOROway App OC Variante nutzt das Whitelist-Plugin erstellt von der Apache Software Foundation."], helpScreenLegalAppOCDialogs: "cordova-plugin-dialogs", helpScreenLegalAppOCDialogsPs: ["Die MOROway App OC Variante nutzt das Dialogs-Plugin erstellt von der Apache Software Foundation."], helpScreenLegalAppOCOrientation: "cordova-plugin-screen-orientation", helpScreenLegalAppOCOrientationPs: ["Die MOROway App OC Variante nutzt das Screen Orientation Plugin erstellt von der Apache Software Foundation."], helpScreenLegalAppOCSplashscreen: "cordova-plugin-splashscreen", helpScreenLegalAppOCSplashscreenPs: ["Die MOROway App OC Variante nutzt das Splashscreen Plugin erstellt von der Apache Software Foundation."],helpScreenLegalOwn: "MOROway App {{0}}", helpScreenLegalOwnCode: "Allgemein", helpScreenLegalOwnCodePs: ["Sie dürfen unsere Inhalte unter der Apache License Version 2.0 verwenden."], helpScreenLegalOwnPics: "Grafiken", helpScreenLegalOwnPicsPs: ["Sie dürfen unsere Grafiken auch unter der Creative Commons Attribution 4.0 International-Lizenz verwenden."], helpScreenContact: "Noch Fragen?",  helpScreenContactFeedback: "Feedback {{0}}",  helpScreenContactFeedbackPs: ["Sie kennen uns unbekannte Bugs? Sie haben Vorschläge, Feedback, Lob, Kritik, Fragen oder ein anderes Anliegen, dass Sie kommunizieren möchten? Hier sind die Kontaktdaten!"], helpScreenContactFeedbackBugs: "Bugreport", helpScreenContactImprintTitle: "Impressum", helpScreenContactBackupLink: "Zu den Kontaktdaten", helpScreenContactBackupLinkNotification: "Kontaktdaten geöffnet", helpScreenContactFeedbackSend: "Feedback senden", helpScreenContactFeedbackSendNotification: "Feedback-Seite geöffnet", helpScreenDownload: "Downloads",  helpScreenDownloadApps: "Apps {{0}}", helpScreenDownloadAppsAndroid: "Android", helpScreenDownloadAppsAndroidPs: ["Laden Sie sich die App auf Ihr Android Gerät über den Google Play Store oder über F-Droid."], helpScreenDownloadAppsAndroidButton: "Play Store", helpScreenDownloadAppsFdroidButton: "F-Droid", helpScreenDownloadAppsWindows: "Windows", helpScreenDownloadAppsWindowsPs: ["Laden Sie sich die App auf Ihren Windows 10 Laptop bzw. PC über den Microsoft Store."], helpScreenDownloadAppsWindowsButton: "Microsoft Store", helpScreenDownloadViewSource: "Source Code {{0}}", helpScreenDownloadViewSourcePs: ["Den Source Code dieser App finden Sie auf GitHub."],  helpScreenDownloadViewSourceCodePic: "Beispiel-Code", helpScreenDownloadViewSourceButtonSource: "GitHub", helpScreenMOROmore: "Mehr über MOROway", helpScreenMOROmoreWebsite: "MOROway-Website {{0}}", helpScreenMOROmoreWebsitePs: ["Besuchen Sie unsere Website..."], helpScreenMOROmoreWebsiteButtonLink: "Website",
		whatsNewScreenVersionNumber: "Version {{0}}", whatsNewScreenVersionNumberMinor: "Neu in Version {{0}}.{{1}}", whatsNewScreenVersionIsNew: "Neu", whatsNewScreenByVersionMa1Mi0: ["2011", "Die animierte Dampflok stellt den Beginn der MOROway App dar."], whatsNewScreenByVersionMa2Mi0: ["2011", "Ein neuer Zug, der TGV, wurde hinzugefügt.", "Erstes animiertes Auto."], whatsNewScreenByVersionMa3Mi0: ["2011", "Verbesserter TGV-Pfad in umgekehrter Richtung.","Verbesserter Pfad für das erste Auto.","Zweites Auto wurde hinzugefügt.","Beide Autos sind nun steuerbar."], whatsNewScreenByVersionMa3Mi1: ["2011", "Erste Version eines Infotextes."], whatsNewScreenByVersionMa3Mi2: ["2011", "Ein Intro mit dem MOROway Logo wurde eingebaut.", "Beide Züge sind individuell steuerbar.", "Steuerung des Infotext wurde ergänzt."], whatsNewScreenByVersionMa4Mi0: ["2015", "{{0}}Update von Action-Script 2 auf Action-Script 3.", "{{0}}Einfügen von Wagen für die Dampflok.", "{{0}}Zweiter Zug im Innenkreis (Schi-Stra-Bus).", "{{0}}Steuerung durch Klick auf Zug ist nun möglich.", "Überarbeiteter Hintergrund.", "Überarbeitete Kreisführung für die Autos.", "Veränderter Vorspann.", "Veränderte Bedienelemente und neuer Hilfetext.", "Fehlerkorrekturen."], whatsNewScreenByVersionMa5Mi0: ["2018", "{{0}}Neuer Hintergrund (u.a. verbesserter Bildausschnitt).", "{{0}}Variable Zuggeschwindigkeit.", "{{0}}Richtungswechsel für alle Züge möglich.", "{{0}}Kurzzeitig eingeblendete Benachrichtigungen informieren über Events.", "{{0}}Basiseinstellungen.", "{{0}}Neuer Vorspann.", "{{0}}Animation des brennenden Finanzamtes.", "Optimierte Objekte (Züge, Autos, Trafo,...).", "Optimierte Objektpfade (\"Zugstrecken\", \"Autostrecken\").", "Optimierte Objektsteuerung (Züge und Autos).", "Optimierte User-Interface.", "Optimierte Hilfeseiten.", "Nativer HTML-, JavaScript- und CSS-Code (statt Flash-Action-Script).", "Offline-Support als Progressive-Web-App.", "Einbau diverser Open-Source-Komponenten.", "Neue Lizenzierung des eigenen Codes."], whatsNewScreenByVersionMa5Mi1: ["2018", "{{0}}Einige Weichen können gestellt werden.", "Optimierte Zugstrecken.", "Fehlerkorrekturen."], whatsNewScreenByVersionMa5Mi2: ["2018", "{{0}}Die Züge starten und halten zeitvergözert.","{{0}}Autos können automatisch fahren.","{{0}}Kurzes Zurücksetzen der Autos möglich.", "Optimierte  Objektsteuerung (Züge und Autos)."], whatsNewScreenByVersionMa5Mi3: ["2018", "{{0}}Drittes, gelbes Auto.", "{{0}}Englische Version.", "Verbesserte Weichensymbole", "Fehlerkorrekturen."], whatsNewScreenByVersionMa5Mi4: ["2018", "Neue Lizenzierung des eigenen Codes. (Apache License Version 2 statt Two-Clause-BSD)"], whatsNewScreenByVersionMa5Mi5: ["2018", "Verlinkung zur Website von MOROway in Hilfeseite eingebaut."], whatsNewScreenByVersionMa5Mi6: ["2018", "Autos: Verbesserungen an der automatischen Steuerung.", "Nur aktive Einstellungen werden angezeigt."], whatsNewScreenByVersionMa6Mi0: ["2019", "{{0}}Spielen Sie mit Freunden über den neuen Mehrspielermodus.", "Fehlerkorrekturen."], whatsNewScreenByVersionMa6Mi1: ["2020", "{{0}}Multithreading.", "Entfernen der Option, die Anzeige der Weichen zu deaktivieren."], whatsNewScreenByVersionMa6Mi2: ["2020", "{{0}}Verarbeiten des Spielfeldzooms mit Touch-Gesten, Tastatur und Mausrad.", "{{0}}Spielfeld \"Control Center\""], whatsNewScreenByVersionMa6Mi3: ["2020", "Hohe Präzision beim Weichenstellen."],
		errorScreenErrorAnimate: "Animations Web Worker", errorScreenErrorAnimateGeneral: "Web Worker Fehler", errorScreenErrorAnimateGeneralP1: "Der Thread für den Animations Web Worker konnte nicht erstellt werden oder es trat während der Laufzeit ein Fehler auf. Ist Ihr Browser aktuell?", errorScreenErrorMissing: "Fehlende Elemente", errorScreenErrorMissingPics: "Bilder", errorScreenErrorMissingPicsP1: "Erste Möglichkeit: Wir haben ein Bild falsch verlinkt oder fehlerhaft vom Server entfernt. Dies kann von Ihnen nicht behoben werden; Sie müssen sich gedulden, bis wir die Anwendung repariert haben.", errorScreenErrorMissingPicsP2: "Zweite Möglichkeit: Ihr Browser konnte eine richtig verlinkte Mediendatei nicht abrufen, da Sie kein Internet haben oder die Bilddatei blockiert wurde. In diesem Fall prüfen Sie bitte Ihre Verbindung / Firewall.", errorScreenErrorTeamplay: "Fehler beim Mehrspielermodus", errorScreenErrorTeamplayJoin: "Kein Spielbeitritt möglich", errorScreenErrorTeamplayJoinP1: "Wenn Sie einem Spiel nicht beitreten können, ist dies entweder voll, obsolet oder bereits gestartet. Erstellen Sie ein neues Spiel!", errorScreenErrorTeamplayConnection: "Verbindung kann nicht hergestellt werden", errorScreenErrorTeamplayConnectionP1: "Probleme beim Verbinden können verschiedene Ursachen haben. Bitte stellen Sie sicher, dass Sie mit dem Internet verbunden sind, einen aktuellen Browser und die neuste Version der MOROway App verwenden.", errorScreenErrorTeamplayConnectionP2: "Sollte dies nicht helfen, kann es sich um einen Serverfehler handeln. Hier ist folglich Geduld gefragt, bis der Server repariert ist.", errorScreenErrorTeamplayUpdate: "Update erforderlich", errorScreenErrorTeamplayUpdateP1: "Sie benötigen die neuste Version der MOROway App.",
		platformOcStartGame: "Spielen", platformOcStartGameOnline: "Mehrspieler", platformOcStartHelp: "Hilfe/Credits", platformOcStartSettings: "Optionen", platformOcStartSettingsOc: "Optionen (Erweitert)", platformOcSettingsOptLandscapeAppTitle: "App: Rotation erlauben", platformOcSettingsOptLandscapeAppDesc: "Wenn nicht aktiviert, wird die App ausschließlich im Querformat dargestellt.", platformOcSettingsOptLandscapeGameTitle: "Spiel: Rotation erlauben", platformOcSettingsOptLandscapeGameDesc: "Wenn nicht aktiviert, wird das Spiel ausschließlich im Querformat dargestellt.", platformOcSettingsOptLandscapeGameInfo: "Nur die Spielansicht auf Querformat beschränken.", platformOcGameLeave: "Verlassen und Spiel zerstören?", platformOcGameLeaveTitel: "Sind Sie sich sicher?", platformOcGameLeaveYes: "Verlassen!", platformOcGameLeaveNo: "Abbrechen!", platformOcAppUpdate: "Es sind neue Funktionen verfügbar!", platformOcAppUpdateTitel: "App-Update", platformOcAppUpdateYes: "Ansehen", platformOcAppUpdateNo: "Ignorieren", platformWebSettingsIframeApplyAndClose: "Anwenden und schließen", platformWindowsLinkError: "Fehler - Link konnte nicht geöffnet werden.", platformWindowsAppScreenFeedback: "Feedback", platformWindowsAppScreenChangelog: "Neuigkeiten"}};
Object.freeze(STRINGS);
const DEFAULT_LANG = "en";
const CURRENT_LANG = (typeof(window.localStorage) != "undefined" && typeof window.localStorage.getItem("morowayAppLang") == "string") ? (window.localStorage.getItem("morowayAppLang")) : ((typeof window.navigator.language != "undefined" && STRINGS.hasOwnProperty(window.navigator.language.substr(0,2))) ? window.navigator.language.substr(0,2) : DEFAULT_LANG);