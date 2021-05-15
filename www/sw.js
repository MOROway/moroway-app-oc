var updatedSW = 93; //TO BE INCREASED ON EACH NEW VERSION

//generate cache-name from branch and sw-version
var locationstr = location.pathname;
locationstr = locationstr.substr(0,locationstr.length-(locationstr.length-locationstr.lastIndexOf("/")));
locationstr = locationstr.substr(locationstr.lastIndexOf("/")-locationstr.length+1);
var CACHE_NAME = "moroway-app-" + locationstr + "-sw-" + updatedSW;

//list of all files related to moroway app
var urlsToCache = [
    ".",
    "error/",
    "help/",
    "settings/",
    "whatsnew/",
    "manifest.webmanifest",
    "ABOUT",
    "LICENSE",
    "LICENSE_ASSETS",
    "assets/asset_background_train.png",
    "assets/asset0.png",
    "assets/asset1.png",
    "assets/asset2.png",
    "assets/asset3.png",
    "assets/asset4.png",
    "assets/asset5.png",
    "assets/asset6.png",
    "assets/asset7.png",
    "assets/asset8.png",
    "assets/asset9.jpg",
    "assets/asset10.png",
    "assets/asset11.png",
    "assets/asset12.png",
    "assets/asset13.png",
    "assets/asset14.png",
    "assets/asset15.png",
    "assets/asset16.png",
    "assets/asset17.png",
    "assets/asset18.png",
    "assets/asset19.png",
    "assets/asset20.png",
    "assets/asset21.png",
    "assets/asset22.png",
    "assets/helpasset1_bug_report.png",
    "assets/helpasset2_desc.jpg",
    "assets/helpasset3_source.png",
    "src/jonathan_herrmann_engel/js/error_handler.js",
    "src/jonathan_herrmann_engel/js/appdata.js",
    "src/jonathan_herrmann_engel/js/general.js",
    "src/jonathan_herrmann_engel/js/error.js",
    "src/jonathan_herrmann_engel/js/help.js",
    "src/jonathan_herrmann_engel/js/scripting.js",
    "src/jonathan_herrmann_engel/js/scripting_worker_animate.js",
    "src/jonathan_herrmann_engel/js/settings.js",
    "src/jonathan_herrmann_engel/js/whatsnew.js",
    "src/jonathan_herrmann_engel/js_platform/error_handler.js",
    "src/jonathan_herrmann_engel/js_platform/appdata.js",
    "src/jonathan_herrmann_engel/js_platform/general.js",
    "src/jonathan_herrmann_engel/js_platform/error.js",
    "src/jonathan_herrmann_engel/js_platform/help.js",
    "src/jonathan_herrmann_engel/js_platform/scripting.js",
    "src/jonathan_herrmann_engel/js_platform/settings.js",
    "src/jonathan_herrmann_engel/js_platform/whatsnew.js",
    "src/jonathan_herrmann_engel/css/general.css",
    "src/jonathan_herrmann_engel/css/error.css",
    "src/jonathan_herrmann_engel/css/help.css",
    "src/jonathan_herrmann_engel/css/styling.css",
    "src/jonathan_herrmann_engel/css/settings.css",
    "src/jonathan_herrmann_engel/css/whatsnew.css",
    "src/jonathan_herrmann_engel/css_platform/general.css",
    "src/jonathan_herrmann_engel/css_platform/error.css",
    "src/jonathan_herrmann_engel/css_platform/help.css",
    "src/jonathan_herrmann_engel/css_platform/styling.css",
    "src/jonathan_herrmann_engel/css_platform/settings.css",
    "src/jonathan_herrmann_engel/css_platform/whatsnew.css",
    "src/others/open_source/open_fonts/google/MaterialIcons/ABOUT",
    "src/others/open_source/open_fonts/google/MaterialIcons/LICENSE",
    "src/others/open_source/open_fonts/google/MaterialIcons/font.css",
    "src/others/open_source/open_fonts/google/MaterialIcons/MaterialIcons-Regular.ttf",
    "src/others/open_source/open_fonts/google/Roboto/ABOUT",
    "src/others/open_source/open_fonts/google/Roboto/COPYRIGHT",
    "src/others/open_source/open_fonts/google/Roboto/LICENSE",
    "src/others/open_source/open_fonts/google/Roboto/font.css",
    "src/others/open_source/open_fonts/google/Roboto/Roboto-Medium.ttf",
    "src/others/open_source/open_fonts/google/Roboto/Roboto-Regular.ttf"
];

//service worker code to let them do their service work

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response !== undefined) {
                    return response;
                }
                var fetchRequest = event.request.clone();
                return fetch(fetchRequest).then(
                    function(response) {
                        return response;
                    }
                ).catch(function(error) {
                    return caches.open(CACHE_NAME).then(function(cache) {
                        return cache.match(event.request, {ignoreSearch: true});
                    });
                });
            }));
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key, i) {
                if (key !== CACHE_NAME) {
                    return caches.delete(keyList[i]);
                }
            }));
        })
    );
});

