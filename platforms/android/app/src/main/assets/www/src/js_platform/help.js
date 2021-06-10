////Required code (needs to be set on each platform)

////Optional code (app works without it)
function init_local(){
    var pics = document.querySelector("#website-pics");
    pics.style.display = "none";
    handleServerJSONValues("webpics", function(res){
        if(typeof(res.pics) == "object") {
            res.pics.forEach(function(pic){
                var img = document.createElement("div");
                img.onclick = function(){followLink(pic.links.normal,"_blank", LINK_STATE_NORMAL);};
                img.style.backgroundImage = "url('" + pic.urls.thumb.url + "')";
                pics.appendChild(img);
            });
            pics.style.display = "";
        }
    });
    var elem = document.getElementById("backOption"),
        elemClone = elem.cloneNode(true);
    elem.parentNode.replaceChild(elemClone, elem);
    document.querySelector("#backOption").addEventListener("click", function(){followLink("html_platform/start.html","_self", LINK_STATE_INTERNAL_LICENSE_FILE);});
    document.querySelector("#legal-appoc-licenses").classList.remove("hidden");
    document.querySelector("#legal-appoc-cordova-license").addEventListener("click", function(){followLink("licenses_platform/cordova","_self", LINK_STATE_INTERNAL_LICENSE_FILE);}, false);
    document.querySelector("#legal-appoc-insomnia-license").addEventListener("click", function(){followLink("licenses_platform/insomnia","_self", LINK_STATE_INTERNAL_LICENSE_FILE);}, false);
    document.querySelector("#legal-appoc-webintent-license").addEventListener("click", function(){followLink("licenses_platform/webintent","_self", LINK_STATE_INTERNAL_LICENSE_FILE);}, false);
    document.querySelector("#legal-appoc-dialogs-license").addEventListener("click", function(){followLink("licenses_platform/dialogs","_self", LINK_STATE_INTERNAL_LICENSE_FILE);}, false);
    document.querySelector("#legal-appoc-splashscreen-license").addEventListener("click", function(){followLink("licenses_platform/splashscreen","_self", LINK_STATE_INTERNAL_LICENSE_FILE);}, false);
    document.querySelector("#download-sourcelink").style.display = "none";
    document.querySelector("#download-sourcelink-oc").addEventListener("click", function(){followLink(getServerRedirectLink("source_code_appoc"),"_blank", LINK_STATE_NORMAL);}, false);


}
