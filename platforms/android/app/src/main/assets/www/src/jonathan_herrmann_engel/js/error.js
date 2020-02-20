window.addEventListener("load",function(){
	
	document.querySelector("#backOption").addEventListener("click", function(){followLink("./","_self", LINK_STATE_INTERNAL_HTML);}, false);
	
	// Workaround for https://github.com/google/material-design-lite/issues/4140
	var hash = window.location.hash.replace(/[^a-zA-Z0-9\-\_]/i, "");
	if(hash){
		var elem = document.querySelector("#"+hash)
		if(elem){ 
			elem.scrollIntoView();
		}
	}
	
});