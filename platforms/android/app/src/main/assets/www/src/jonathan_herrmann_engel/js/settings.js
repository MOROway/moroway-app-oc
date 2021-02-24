"use strict";

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
}

window.addEventListener("load", function(){

    if(typeof(window.localStorage) != "undefined") {
        
        setSettingsHTML(document.querySelector("main"),true);

        document.querySelector("body").addEventListener("touchstart",chooseInputMethod);
        document.querySelector("body").addEventListener("mousemove",chooseInputMethod);
        
        document.querySelector("#backOption").addEventListener("click", function(){try {window.close();}catch(err) {} followLink("./","_self", LINK_STATE_INTERNAL_HTML);}, false);

    } else {
        document.querySelector("body").innerHTML = getString("generalNoDOMStorageSupport");
    }

});
