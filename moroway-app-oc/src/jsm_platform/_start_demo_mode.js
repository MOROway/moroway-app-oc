/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import {followLink, LINK_STATE_INTERNAL_HTML} from "./common/follow_links.js";
import {setHTMLStrings} from "../jsm/common/string_tools.js";

document.addEventListener("DOMContentLoaded", function () {
    const demoModeGo = document.getElementById("demo-mode-go");
    const demoModeContainerManual = document.getElementById("demo-mode-manual-only");
    const demoModeContainer3D = document.getElementById("demo-mode-3d-only");
    const demoModeContainer3DBirdsEye = document.getElementById("demo-mode-3d-birdseye-only");
    const demoModeInputRandom = document.getElementById("demo-mode-random");
    const demoModeInput3D = document.getElementById("demo-mode-3d");
    const demoModeInput3DCamModeBirdsEye = document.getElementById("demo-mode-3d-camera-mode-birds-eye");
    const demoModeInput3DCamModeFollowTrain = document.getElementById("demo-mode-3d-camera-mode-follow-train");
    const demoModeInput3DCamModeFollowCar = document.getElementById("demo-mode-3d-camera-mode-follow-car");
    demoModeGo.addEventListener("click", function () {
        var cameraMode = "birds-eye";
        if (demoModeInput3DCamModeFollowTrain.checked) {
            cameraMode = "follow-train";
        } else if (demoModeInput3DCamModeFollowCar.checked) {
            cameraMode = "follow-car";
        }
        const url = "./?mode=demoStandalone&gui-3d=" + (demoModeInput3D.checked ? 1 : 0) + "&gui-3d-night=" + (document.getElementById("demo-mode-3d-night").checked ? 1 : 0) + "&gui-demo-3d-rotation-speed-percent=" + document.getElementById("demo-mode-3d-rotation-speed").value + "&gui-3d-cam-mode=" + cameraMode + "&gui-demo-random=" + (demoModeInputRandom.checked ? 1 : 0);
        followLink(url, "_self", LINK_STATE_INTERNAL_HTML);
    });
    demoModeInputRandom.addEventListener("change", function () {
        demoModeContainerManual.style.display = demoModeInputRandom.checked ? "none" : "";
    });
    demoModeInput3D.addEventListener("change", function () {
        demoModeContainer3D.style.display = demoModeInput3D.checked ? "" : "none";
    });
    const cameraModes = document.querySelectorAll("input[type=radio][name=demo-mode-3d-camera-mode]");
    for (let i = 0; i < cameraModes.length; i++) {
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
    document.addEventListener("backbutton", function () {
        followLink("html_platform/start.html", "_self", LINK_STATE_INTERNAL_HTML);
    });
});
