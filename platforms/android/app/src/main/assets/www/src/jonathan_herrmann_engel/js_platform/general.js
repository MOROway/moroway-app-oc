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

////Optional code (app works without it)
//Enable offline functionality
