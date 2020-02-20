////Required code (needs to be set on each platform)

////Optional code (app works without it)
function init_local(){
	handleServerJSONValues("webpics", function(res){
		if(typeof(res.pics) == "object") {
			var pics = document.querySelector("#website-pics");
			res.pics.forEach(function(pic){
				var img = document.createElement("div");
				img.style.backgroundImage = "url('" + pic.urls.thumb.url + "')";
				pics.appendChild(img);
			});
			
		} else {
			console.log("ERROR handling Website-Pics");
		}
	});
	var elem = document.getElementById('backOption'),
    elemClone = elem.cloneNode(true);
	elem.parentNode.replaceChild(elemClone, elem);
	document.querySelector("#backOption").addEventListener("click", function(){followLink("html_platform/start.html","_self", LINK_STATE_INTERNAL_LICENSE_FILE);});
}