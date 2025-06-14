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
