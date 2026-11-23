cordova.lockOrientationLandscape = function (lock) {
    cordova.exec(
        function () {},
        function (error) {
            console.error(error);
        },
        "SysTools",
        "lockOrientationLandscape",
        [lock]
    );
};
cordova.commitSuicide = function () {
    cordova.exec(
        function () {},
        function (error) {
            console.error(error);
        },
        "SysTools",
        "exitApp",
        []
    );
};
