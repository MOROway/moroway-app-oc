function init(){

    document.querySelector("#backOption").addEventListener("click", function(){try {window.close();}catch(err) {} followLink("./help","_self", LINK_STATE_INTERNAL_HTML);});

    var i = 0;
    var versions = [];
    do {
        if(getString("whatsNewScreenByVersionMa"+(i+1)+"Mi0") != "undefined") {
            var j = 0;
            var elem = document.createElement("article");
            elem.id = "v"+(i+1);
            var elem1 = document.createElement("h2");
            elem1.textContent=formatJSString(getString("whatsNewScreenVersionNumber"), i+1);
            elem.appendChild(elem1);
            elem1 = document.createElement("div");
            elem1.className = "card-container card-container-highlightable";
            do {
                if(getString("whatsNewScreenByVersionMa"+(i+1)+"Mi"+j) != "undefined") {
                    var selem = document.createElement("div");
                    selem.className = "card";
                    var selem1 = document.createElement("div");
                    selem1.className = "card-title";
                    var selem2 = document.createElement("h2");
                    selem2.textContent=formatJSString(getString("whatsNewScreenVersionNumberMinor"), i+1, j);
                    selem1.appendChild(selem2);
                    selem.appendChild(selem1);
                    elem.appendChild(selem);
                    selem1 = document.createElement("div");
                    selem1.className = "card-content";
                    selem2 = document.createElement("p");
                    selem3 = document.createElement("i");
                    selem3.textContent = formatJSString(getString(["whatsNewScreenByVersionMa"+(i+1)+"Mi"+j,0]));
                    selem2.appendChild(selem3);
                    selem1.appendChild(selem2);
                    selem2 = document.createElement("p");
                    var k = 1;
                    do {
                        if(getString(["whatsNewScreenByVersionMa"+(i+1)+"Mi"+j,k]) != "undefined") {
                            if(k > 1) {
                                var selem3 = document.createElement("br");
                                selem2.appendChild(selem3);
                            }
                            var selem3 = document.createElement("span");
                            selem3.innerHTML = formatJSString(formatHTMLString(getString(["whatsNewScreenByVersionMa"+(i+1)+"Mi"+j,k])),"<b>" + formatHTMLString(getString("whatsNewScreenVersionIsNew", "", "upper")) + "</b>! ");
                            selem2.appendChild(selem3);
                            k++;
                        } else {
                            k = 1;
                        }
                    } while (k > 1);
                    selem1.appendChild(selem2);
                    selem.appendChild(selem1);
                    elem1.appendChild(selem);
                    j++;
                } else {
                    j = 0;
                }
            } while (j > 0);
            elem.appendChild(elem1);
            versions[i] = elem;
            i++;
        } else {
            i = 0;
        }
    } while (i > 0);
    var newestFamily;
    for(var i = versions.length-1; i >= 0; i--) {
        if( i == versions.length-1) {
            newestFamily = versions[i].id;
        }
        document.querySelector("main").appendChild(versions[i]);
    }
    document.querySelector("#" + newestFamily).querySelector(".card-container").lastChild.id = "newest";


    setHTMLStrings();

}
