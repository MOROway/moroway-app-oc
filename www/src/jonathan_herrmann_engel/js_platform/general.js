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
        input1 = input1.length == 0 ? "./index.html" : (input1.substr(input1.length-1,1) == "/" ? input1 + "index.html" : (input1.substr(input1.length-5,5) == ".html" ? input1 : input1 + "/index.html"));
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

////Optional code (app works without it))
function globalDR() {
    screen.orientation.lock('landscape');
    window.plugins.webintent.onNewIntent(function (url) {
        followIntent(url);
    });
}