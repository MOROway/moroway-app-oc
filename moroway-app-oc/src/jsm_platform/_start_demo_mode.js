/**
 * Copyright 2026 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { setHTMLStrings } from "../jsm/common/string_tools.js";
import { SYSTEM_TOOLS } from "../jsm/common/system_tools.js";
import { followLink, LinkStates } from "../jsm/common/web_tools.js";
document.addEventListener("DOMContentLoaded", function () {
    var demoModeGo = document.getElementById("demo-mode-go");
    var demoModeContainerManual = document.getElementById("demo-mode-manual-only");
    var demoModeContainer3D = document.getElementById("demo-mode-3d-only");
    var demoModeContainer3DBirdsEye = document.getElementById("demo-mode-3d-birdseye-only");
    var demoModeInputRandom = document.getElementById("demo-mode-random");
    var demoModeInputExitTimeout = document.getElementById("demo-mode-exit-timeout");
    var demoModeInput3D = document.getElementById("demo-mode-3d");
    var demoModeInput3DCamModeBirdsEye = document.getElementById("demo-mode-3d-camera-mode-birds-eye");
    var demoModeInput3DCamModeFollowTrain = document.getElementById("demo-mode-3d-camera-mode-follow-train");
    var demoModeInput3DCamModeFollowCar = document.getElementById("demo-mode-3d-camera-mode-follow-car");
    demoModeGo.addEventListener("click", function () {
        var cameraMode = "birds-eye";
        if (demoModeInput3DCamModeFollowTrain.checked) {
            cameraMode = "follow-train";
        }
        else if (demoModeInput3DCamModeFollowCar.checked) {
            cameraMode = "follow-car";
        }
        var url = "./?mode=demo&demo-standalone=1&gui-3d=" + (demoModeInput3D.checked ? 1 : 0) + "&gui-3d-night=" + (document.getElementById("demo-mode-3d-night").checked ? 1 : 0) + "&gui-demo-3d-rotation-speed-percent=" + parseInt(document.getElementById("demo-mode-3d-rotation-speed").value, 10) + "&gui-3d-cam-mode=" + cameraMode + "&gui-demo-random=" + (demoModeInputRandom.checked ? 1 : 0) + (demoModeInputExitTimeout.value !== "" ? "&exit-timeout=" + parseInt(demoModeInputExitTimeout.value, 10) : "");
        followLink(url, "_self", LinkStates.InternalHtml);
    });
    demoModeInputRandom.addEventListener("change", function () {
        demoModeContainerManual.style.display = demoModeInputRandom.checked ? "none" : "";
    });
    demoModeInput3D.addEventListener("change", function () {
        demoModeContainer3D.style.display = demoModeInput3D.checked ? "" : "none";
    });
    var cameraModes = document.querySelectorAll("input[type=radio][name=demo-mode-3d-camera-mode]");
    for (var i = 0; i < cameraModes.length; i++) {
        cameraModes[i].addEventListener("change", function () {
            demoModeContainer3DBirdsEye.style.display = demoModeInput3DCamModeBirdsEye.checked ? "" : "none";
        });
    }
    demoModeContainerManual.style.display = demoModeInputRandom.checked ? "none" : "";
    demoModeContainer3D.style.display = demoModeInput3D.checked ? "" : "none";
    demoModeContainer3DBirdsEye.style.display = demoModeInput3DCamModeBirdsEye.checked ? "" : "none";
    setHTMLStrings();
});
document.addEventListener("deviceready", function () {
    document.addEventListener("backbutton", SYSTEM_TOOLS.navigateBack, false);
});
