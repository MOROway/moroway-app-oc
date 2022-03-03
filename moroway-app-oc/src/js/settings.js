"use strict";

function chooseInputMethod (event){
    if(event.type == "touchstart"){
        document.querySelector("body").removeEventListener("touchstart",chooseInputMethod);
        setCurrentHardwareConfig("touch",true);
    } else {
        document.querySelector("body").removeEventListener("mousemove",chooseInputMethod);
        setCurrentHardwareConfig("mouse",true);
    }
    setSettingsHTML(document.querySelector("main"),true);
}

window.addEventListener("load", function(){
    if(typeof(window.localStorage) != "undefined") {

        setSettingsHTML(document.querySelector("main"),true);

        document.querySelector("body").addEventListener("touchstart",chooseInputMethod);
        document.querySelector("body").addEventListener("mousemove",chooseInputMethod);

        document.querySelector("#backOption").addEventListener("click", function(){
            try {
                window.close();
            } catch(err) {}
            followLink("./","_self", LINK_STATE_INTERNAL_HTML);
        });
    } else {
        document.querySelector("body").innerHTML = getString("generalNoDOMStorageSupport");
    }
});
