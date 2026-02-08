/**
 * Copyright 2026 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
/*******************************************
 *                 Imports                 *
 ******************************************/
import { GLTFLoader } from "../lib/open_code/jsm/three.js/GLTFLoader.js";
import * as THREE from "../lib/open_code/jsm/three.js/three.module.min.js";
import { APP_DATA, getLocalAppDataCopy, setLocalAppDataCopy } from "./common/app_data.js";
import { copy } from "./common/copy_paste.js";
import { getGuiState, setGuiState, ThreeCameraModes } from "./common/gui_state.js";
import { copyJSObject } from "./common/js_objects.js";
import { NotificationChannel, NotificationPriority, notify } from "./common/notify.js";
import { getVersionCode, removeSavedGame, updateSavedGame } from "./common/saved_game.js";
import { getSetting } from "./common/settings.js";
import { formatJSString, getString, setHTMLStrings } from "./common/string_tools.js";
import { SYSTEM_TOOLS } from "./common/system_tools.js";
import { initTooltip, initTooltips } from "./common/tooltip.js";
import { followLink, getQueryStringValue, getServerLink, getShareLink, LinkStates, Protocols } from "./common/web_tools.js";
export var Modes;
(function (Modes) {
    Modes["SINGLEPLAYER"] = "singleplayer";
    Modes["MULTIPLAYER"] = "multiplayer";
    Modes["DEMO"] = "demo";
})(Modes || (Modes = {}));
/*******************************************
 *             Helper functions            *
 ******************************************/
function measureViewSpace() {
    client.isSmall = window.innerHeight < 290 || window.innerWidth < 750;
    client.isTiny = window.innerHeight < 250 || window.innerWidth < 600;
    client.devicePixelRatio = window.devicePixelRatio;
    client.width = window.innerWidth;
    client.height = window.innerHeight;
    canvasForeground.style.width = canvasSemiForeground.style.width = canvasBackground.style.width = canvasGesture.style.width = canvas.style.width = client.width + "px";
    canvasForeground.style.height = canvasSemiForeground.style.height = canvasBackground.style.height = canvasGesture.style.height = canvas.style.height = client.height + "px";
    canvasForeground.width = canvasSemiForeground.width = canvasBackground.width = canvasGesture.width = canvas.width = client.width * client.devicePixelRatio;
    canvasForeground.height = canvasSemiForeground.height = canvasBackground.height = canvasGesture.height = canvas.height = client.height * client.devicePixelRatio;
}
function drawImage(pic, x, y, width, height, cxt, sx, sy, sWidth, sHeight) {
    if (cxt === void 0) { cxt = context; }
    if (sx === void 0) { sx = undefined; }
    if (sy === void 0) { sy = undefined; }
    if (sWidth === void 0) { sWidth = undefined; }
    if (sHeight === void 0) { sHeight = undefined; }
    function floorIfBigEnough(num) {
        if (client.isTiny) {
            return num;
        }
        return Math.floor(num);
    }
    if (sx === undefined || sy === undefined || sWidth === undefined || sHeight === undefined) {
        cxt.drawImage(pic, floorIfBigEnough(x), floorIfBigEnough(y), floorIfBigEnough(width), floorIfBigEnough(height));
    }
    else {
        cxt.drawImage(pic, floorIfBigEnough(sx), floorIfBigEnough(sy), floorIfBigEnough(sWidth), floorIfBigEnough(sHeight), floorIfBigEnough(x), floorIfBigEnough(y), floorIfBigEnough(width), floorIfBigEnough(height));
    }
}
function resetAll() {
    resetGestures();
    resetScale();
    resetTilt();
}
function resetGestures() {
    hardware.mouse.isHold = hardware.mouse.isWheelHold = hardware.mouse.isDrag = controlCenter.mouse.hold = three.followCamControls.dragging = false;
}
function resetScale() {
    client.zoomAndTilt.realScale = 1;
    client.zoomAndTilt.pinchScale = 1;
    client.zoomAndTilt.pinchScaleOld = 1;
    client.zoomAndTilt.offsetX = 0;
    client.zoomAndTilt.offsetY = 0;
    three.camera.position.set(0, 0, 1);
    three.camera.zoom = three.zoom;
    three.camera.updateProjectionMatrix();
}
function resetTilt() {
    client.zoomAndTilt.tiltX = client.width / 2;
    client.zoomAndTilt.tiltY = client.height / 2;
    three.scene.rotation.x = 0;
    three.scene.rotation.y = 0;
}
function measureFontSize(text, fontFamily, fontSize, wantedTextWidth, approximation, tolerance, recursion) {
    if (recursion === void 0) { recursion = 0; }
    context.save();
    var font = fontSize + "px " + fontFamily;
    context.font = font;
    var textWidth = context.measureText(text).width;
    context.restore();
    if (textWidth != wantedTextWidth && Math.abs(textWidth - wantedTextWidth) > tolerance && recursion < 100) {
        fontSize *= textWidth > wantedTextWidth ? 1 - approximation / 100 : 1 + approximation / 100;
        return measureFontSize(text, fontFamily, fontSize, wantedTextWidth, approximation, tolerance, ++recursion);
    }
    else {
        return font;
    }
}
function getFontSize(font, unit) {
    return parseInt(font.substr(0, font.length - (font.length - font.indexOf(unit))), 10);
}
/*******************************************
 *             Mode functions              *
 ******************************************/
function showConfirmDialogLeaveMultiplayerMode() {
    resetConfirmDialog();
    var confirmDialog = document.querySelector("#confirm-dialog");
    if (confirmDialog) {
        var confirmDialogTitle = confirmDialog.querySelector("#confirm-dialog-title");
        var confirmDialogText = confirmDialog.querySelector("#confirm-dialog-text");
        confirmDialogTitle.textContent = getString("appScreenTeamplayLeaveDialogTitle");
        confirmDialogText.style.display = "none";
        var confirmDialogYes = document.querySelector("#confirm-dialog #confirm-dialog-yes");
        if (confirmDialogYes != null) {
            confirmDialogYes.onclick = function () {
                closeConfirmDialog();
                switchMode(Modes.SINGLEPLAYER, { id: "", key: "" });
            };
        }
        var confirmDialogNo = document.querySelector("#confirm-dialog #confirm-dialog-no");
        if (confirmDialogNo != null) {
            confirmDialogNo.onclick = closeConfirmDialog;
        }
        if (currentMode == Modes.MULTIPLAYER) {
            confirmDialog.style.display = "block";
        }
    }
}
function showConfirmDialogEnterDemoMode() {
    resetConfirmDialog();
    var confirmDialog = document.querySelector("#confirm-dialog");
    if (confirmDialog) {
        var confirmDialogTitle = confirmDialog.querySelector("#confirm-dialog-title");
        var confirmDialogText = confirmDialog.querySelector("#confirm-dialog-text");
        var confirmDialogParams = confirmDialog.querySelector("#confirm-dialog-params");
        confirmDialogTitle.textContent = getString("generalStartGameDemoMode", "?");
        confirmDialogText.textContent = getString("appScreenDemoModeEnterDialogText");
        confirmDialogParams.style.display = "block";
        var confirmDialogRandomId = "confirm-dialog-params-demo-random";
        var confirmDialogRandomContainer = document.createElement("div");
        var confirmDialogRandom_1 = document.createElement("input");
        confirmDialogRandom_1.id = confirmDialogRandomId;
        confirmDialogRandom_1.type = "checkbox";
        confirmDialogRandom_1.onchange = function () {
            var param3DRotationSpeedElem = confirmDialog.querySelector("#confirm-dialog-params-3d-rotation-speed-container");
            if (param3DRotationSpeedElem) {
                param3DRotationSpeedElem.style.display = confirmDialogRandom_1.checked ? "none" : "";
            }
        };
        confirmDialogRandom_1.checked = getGuiState("demo-random");
        var confirmDialogRandomLabel = document.createElement("label");
        confirmDialogRandomLabel.htmlFor = confirmDialogRandomId;
        confirmDialogRandomLabel.textContent = getString("generalStartDemoModeRandom");
        confirmDialogRandomContainer.appendChild(confirmDialogRandom_1);
        confirmDialogRandomContainer.appendChild(confirmDialogRandomLabel);
        confirmDialogParams.appendChild(confirmDialogRandomContainer);
        var confirmDialogExitTimeoutId = "confirm-dialog-params-exit-timeout";
        var confirmDialogExitTimeoutContainer = document.createElement("div");
        var confirmDialogExitTimeout_1 = document.createElement("input");
        confirmDialogExitTimeout_1.id = confirmDialogExitTimeoutId;
        confirmDialogExitTimeout_1.type = "number";
        confirmDialogExitTimeout_1.step = "1";
        confirmDialogExitTimeout_1.pattern = "d+";
        confirmDialogExitTimeout_1.min = "1";
        confirmDialogExitTimeout_1.value = "";
        var confirmDialogExitTimeoutLabel = document.createElement("label");
        confirmDialogExitTimeoutLabel.htmlFor = confirmDialogExitTimeoutId;
        confirmDialogExitTimeoutLabel.textContent = getString("generalStartDemoModeExitTimeout");
        confirmDialogExitTimeoutContainer.appendChild(confirmDialogExitTimeout_1);
        confirmDialogExitTimeoutContainer.appendChild(confirmDialogExitTimeoutLabel);
        if (!SYSTEM_TOOLS.canExitApp()) {
            confirmDialogExitTimeoutContainer.style.display = "none";
        }
        confirmDialogParams.appendChild(confirmDialogExitTimeoutContainer);
        if (gui.three && (three.cameraMode == undefined || three.cameraMode == ThreeCameraModes.BIRDS_EYE)) {
            var elemDiv = document.createElement("div");
            elemDiv.id = "confirm-dialog-params-3d-rotation-speed-container";
            elemDiv.style.display = confirmDialogRandom_1.checked ? "none" : "";
            var elementSpan = document.createElement("span");
            elementSpan.textContent = getString("generalStartDemoMode3DRotationSpeed");
            elemDiv.appendChild(elementSpan);
            var elementBr = document.createElement("br");
            elemDiv.appendChild(elementBr);
            var elementInput = document.createElement("input");
            elementInput.id = "confirm-dialog-params-3d-rotation-speed-input";
            elementInput.type = "range";
            elementInput.min = "0";
            elementInput.max = "100";
            elementInput.value = getGuiState("3d-rotation-speed");
            elemDiv.appendChild(elementInput);
            confirmDialogParams.appendChild(elemDiv);
        }
        var confirmDialogYes = document.querySelector("#confirm-dialog #confirm-dialog-yes");
        if (confirmDialogYes) {
            confirmDialogYes.onclick = function () {
                closeConfirmDialog();
                var param3DRotationSpeedElem = confirmDialog.querySelector("#confirm-dialog-params-3d-rotation-speed-input");
                if (param3DRotationSpeedElem) {
                    setGuiState("3d-rotation-speed", parseInt(param3DRotationSpeedElem.value, 10));
                }
                setGuiState("demo-random", confirmDialogRandom_1.checked);
                var switchDemoModeAdditionalParams = {};
                if (confirmDialogExitTimeout_1.value !== "") {
                    switchDemoModeAdditionalParams["exit-timeout"] = confirmDialogExitTimeout_1.value;
                }
                switchMode(Modes.DEMO, switchDemoModeAdditionalParams);
            };
        }
        var confirmDialogNo = document.querySelector("#confirm-dialog #confirm-dialog-no");
        if (confirmDialogNo != null) {
            confirmDialogNo.onclick = closeConfirmDialog;
        }
        if (currentMode != Modes.DEMO) {
            confirmDialog.style.display = "block";
        }
    }
}
function closeConfirmDialog() {
    var confirmDialog = document.querySelector("#confirm-dialog");
    if (confirmDialog) {
        confirmDialog.style.display = "";
    }
}
function resetConfirmDialog() {
    var confirmDialog = document.querySelector("#confirm-dialog");
    if (confirmDialog) {
        var confirmDialogTitle = confirmDialog.querySelector("#confirm-dialog-title");
        var confirmDialogText = confirmDialog.querySelector("#confirm-dialog-text");
        var confirmDialogParams = confirmDialog.querySelector("#confirm-dialog-params");
        confirmDialogTitle.textContent = "";
        confirmDialogText.textContent = "";
        confirmDialogText.style.display = "";
        confirmDialogParams.innerHTML = "";
        confirmDialogParams.style.display = "";
    }
}
function switchMode(mode, additionalParameters) {
    if (mode === void 0) { mode = Modes.SINGLEPLAYER; }
    if (additionalParameters === void 0) { additionalParameters = {}; }
    function requestModeSwitch() {
        var _a;
        if (modeSwitchingTimeout !== undefined && modeSwitchingTimeout !== null) {
            clearTimeout(modeSwitchingTimeout);
        }
        if (drawing || resized) {
            modeSwitchingTimeout = setTimeout(requestModeSwitch, 10);
        }
        else {
            //Update URL
            if (SYSTEM_TOOLS.forceModeSwitchHandling(currentMode != mode) == "navigate") {
                followLink(url, "_self", LinkStates.InternalHtml);
            }
            else if (SYSTEM_TOOLS.forceModeSwitchHandling(currentMode != mode) == "historyReplace") {
                history.replaceState(null, "", url);
            }
            else if (((_a = history.state) === null || _a === void 0 ? void 0 : _a.mode) == mode) {
                history.replaceState({ mode: mode }, "", url);
            }
            else {
                history.pushState({ mode: mode }, "", url);
            }
            //Reload app
            prepareInit(mode);
            animateWorker.postMessage({ k: "ready", state: "reload", online: currentMode == Modes.MULTIPLAYER, onlineInterval: multiplayerMode.animateInterval, demo: currentMode == Modes.DEMO });
        }
    }
    if (modeSwitching) {
        return;
    }
    modeSwitching = true;
    var lastUrlParams = new URLSearchParams(location.search);
    var urlParams = Object.assign(Object.fromEntries(lastUrlParams.entries()), additionalParameters);
    urlParams.mode = mode;
    if (urlParams.mode == Modes.SINGLEPLAYER || urlParams.mode.length == 0) {
        delete urlParams.mode;
    }
    var urlParamsString = new URLSearchParams(urlParams).toString();
    var url = "?" + urlParamsString;
    modeSwitchingReloadTimeout = setTimeout(function () {
        location.reload();
    }, 5000);
    requestModeSwitch();
}
export function getMode() {
    return currentMode;
}
/*******************************************
 *      Background and menus functions     *
 ******************************************/
function drawBackground() {
    /////DRAW/BACKGROUND/Layer-1/////
    contextBackground.clearRect(0, 0, canvas.width, canvas.height);
    contextBackground.setTransform(client.zoomAndTilt.realScale, 0, 0, client.zoomAndTilt.realScale, (-(client.zoomAndTilt.realScale - 1) * canvasBackground.width) / 2 + client.zoomAndTilt.offsetX, (-(client.zoomAndTilt.realScale - 1) * canvasBackground.height) / 2 + client.zoomAndTilt.offsetY);
    var pic = pics[background.src];
    drawImage(pic, background.x, background.y, background.width, background.height, contextBackground);
    contextSemiForeground.clearRect(0, 0, canvas.width, canvas.height);
    contextSemiForeground.setTransform(client.zoomAndTilt.realScale, 0, 0, client.zoomAndTilt.realScale, (-(client.zoomAndTilt.realScale - 1) * canvasSemiForeground.width) / 2 + client.zoomAndTilt.offsetX, (-(client.zoomAndTilt.realScale - 1) * canvasSemiForeground.height) / 2 + client.zoomAndTilt.offsetY);
    /////BACKGROUND/Layer-2/////
    drawImage(pics[background.secondLayer], background.x, background.y, background.width, background.height, contextSemiForeground);
    /////BACKGROUND/Margins-2////
    if (konamiState >= 0) {
        contextSemiForeground.save();
        if (client.zoomAndTilt.realScale == 1) {
            var width = pic.height / pic.width - canvas.height / canvas.width < 0 ? canvas.height * (pic.width / pic.height) : canvas.width;
            var height = pic.height / pic.width - canvas.height / canvas.width < 0 ? canvas.height : canvas.width * (pic.height / pic.width);
            var posX = 0;
            var posY = 0;
            var picPosX = (((width - canvas.width) / 2) * pic.width) / width;
            var picPosY = (((height - canvas.height) / 2) * pic.height) / height;
            var fillWidth = canvas.width;
            var fillHeight = background.y;
            var picWidth = (fillWidth * pic.width) / width;
            var picHeight = (fillHeight * pic.height) / height;
            drawImage(pic, posX, posY, fillWidth, fillHeight, contextSemiForeground, picPosX, picPosY, picWidth, picHeight);
            posY += background.y + background.height + menus.outerContainer.height * client.devicePixelRatio;
            picPosY += ((background.y + background.height + menus.outerContainer.height * client.devicePixelRatio) * pic.height) / height;
            drawImage(pic, posX, posY, fillWidth, fillHeight, contextSemiForeground, picPosX, picPosY, picWidth, picHeight);
            posX = 0;
            posY = 0;
            picPosX = (((width - canvas.width) / 2) * pic.width) / width;
            picPosY = (((height - canvas.height) / 2) * pic.height) / height;
            fillWidth = background.x;
            fillHeight = canvas.height;
            picWidth = (fillWidth * pic.width) / width;
            picHeight = (fillHeight * pic.height) / height;
            drawImage(pic, posX, posY, fillWidth, fillHeight, contextSemiForeground, picPosX, picPosY, picWidth, picHeight);
            posX += background.x + background.width;
            picPosX += ((background.x + background.width) * pic.width) / width;
            drawImage(pic, posX, posY, fillWidth, fillHeight, contextSemiForeground, picPosX, picPosY, picWidth, picHeight);
            var bgGradient = contextSemiForeground.createLinearGradient(0, 0, canvas.width, canvas.height / 2);
            bgGradient.addColorStop(0, "rgba(0,0,0,1)");
            bgGradient.addColorStop(0.2, "rgba(0,0,0,0.95)");
            bgGradient.addColorStop(0.4, "rgba(0,0,0,0.85)");
            bgGradient.addColorStop(0.6, "rgba(0,0,0,0.85)");
            bgGradient.addColorStop(0.8, "rgba(0,0,0,0.95)");
            bgGradient.addColorStop(1, "rgba(0,0,0,0.9)");
            contextSemiForeground.fillStyle = bgGradient;
        }
        else {
            contextSemiForeground.fillStyle = "black";
        }
        contextSemiForeground.fillRect(0, 0, background.x, canvas.height);
        contextSemiForeground.fillRect(0, 0, canvas.width, background.y);
        contextSemiForeground.fillRect(background.x + background.width, 0, background.x, canvas.height);
        contextSemiForeground.fillRect(0, background.y + background.height + menus.outerContainer.height * client.devicePixelRatio, canvas.width, background.y);
        contextSemiForeground.restore();
    }
    /////DRAW/BACKGROUND/Konami/////
    if (konamiState < 0) {
        /////DRAW/BACKGROUND/Layer-1/////
        var imgData = contextBackground.getImageData(0, 0, canvas.width, canvas.height);
        var data = imgData.data;
        for (var i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] < 120 ? data[i] / 1.2 : data[i] * 1.1);
            data[i + 1] = Math.min(255, data[i + 1] < 120 ? data[i + 1] / 1.2 : data[i + 1] * 1.1);
            data[i + 2] = Math.min(255, data[i + 2] < 120 ? data[i + 2] / 1.2 : data[i + 2] * 1.1);
        }
        contextBackground.putImageData(imgData, 0, 0);
        /////DRAW/BACKGROUND/Layer-2/////
        imgData = contextSemiForeground.getImageData(0, 0, canvas.width, canvas.height);
        data = imgData.data;
        for (i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] < 120 ? data[i] / 1.2 : data[i] * 1.1);
            data[i + 1] = Math.min(255, data[i + 1] < 120 ? data[i + 1] / 1.2 : data[i + 1] * 1.1);
            data[i + 2] = Math.min(255, data[i + 2] < 120 ? data[i + 2] / 1.2 : data[i + 2] * 1.1);
        }
        contextSemiForeground.putImageData(imgData, 0, 0);
    }
}
function drawMenu(state) {
    function drawMenuIcons(menu, state) {
        var menusInnerWidth = menus.innerWidth;
        if (menus.innerWidthRelativeToItemLength) {
            menusInnerWidth *= menu.items.length;
            if (menusInnerWidth > menus.outerContainer.width) {
                menusInnerWidth = menus.outerContainer.width;
            }
        }
        menu.container.elementInner.style.width = menusInnerWidth + "px";
        menu.container.elementInner.style.height = menus.outerContainer.element.style.height;
        switch (state) {
            case "hide-outer":
                menus.outerContainer.element.style.display = "none";
            case "hide":
                menu.container.elementInner.style.display = "";
                break;
            case "show":
                menu.container.elementInner.style.display = "inline-flex";
                menus.outerContainer.element.style.display = "";
                break;
            case "invisible":
                menu.container.elementInner.style.visibility = "hidden";
                break;
            case "visible":
                menus.outerContainer.element.style.visibility = menu.container.elementInner.style.visibility = "";
                break;
        }
        var itemSize = Math.min(menus.itemDefaultSize, (menus.itemDefaultSize * menusInnerWidth) / (menus.itemDefaultSize * menu.items.length));
        if (menus.floating) {
            itemSize = Math.min(itemSize, Math.max(itemSize / 2, 30));
        }
        for (var i = 0; i < menu.items.length; i++) {
            menu.items[i].style.display = "";
            var textItem = menu.items[i].querySelector("i") ? menu.items[i].querySelector("i") : menu.items[i];
            menu.items[i].style.width = menu.items[i].style.height = textItem.style.fontSize = textItem.style.lineHeight = itemSize + "px";
            if (gui.three) {
                menu.items[i].style.textShadow = "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
            }
            else {
                menu.items[i].style.textShadow = "";
            }
        }
    }
    function drawInfoOverlayMenu(state) {
        if (menus.infoOverlay.textTimeout != undefined && menus.infoOverlay.textTimeout != null) {
            clearTimeout(menus.infoOverlay.textTimeout);
            delete menus.infoOverlay.focus;
            menus.infoOverlay.overlayText.style.display = menus.infoOverlay.overlayText.style.fontSize = menus.infoOverlay.overlayText.style.height = "";
        }
        if (menus.infoOverlay.scaleInterval != undefined && menus.infoOverlay.scaleInterval != null) {
            clearInterval(menus.infoOverlay.scaleInterval);
        }
        menus.infoOverlay.scaleFac = 1;
        menus.infoOverlay.scaleFacGrow = true;
        menus.infoOverlay.items = [1, 2];
        if (getSetting("burnTheTaxOffice")) {
            menus.infoOverlay.items[menus.infoOverlay.items.length] = 3;
        }
        if (getSetting("classicUI") && !gui.controlCenter) {
            menus.infoOverlay.items[menus.infoOverlay.items.length] = 4;
            if (classicUI.trainSwitch.selectedTrainDisplay.visible) {
                menus.infoOverlay.items[menus.infoOverlay.items.length] = 5;
            }
            menus.infoOverlay.items[menus.infoOverlay.items.length] = 6;
            if (classicUI.transformer.directionInput.visible) {
                menus.infoOverlay.items[menus.infoOverlay.items.length] = 7;
            }
        }
        menus.infoOverlay.items[menus.infoOverlay.items.length] = 8;
        if (gui.controlCenter && !controlCenter.showCarCenter) {
            menus.infoOverlay.items[menus.infoOverlay.items.length] = 9;
            menus.infoOverlay.items[menus.infoOverlay.items.length] = 10;
            menus.infoOverlay.items[menus.infoOverlay.items.length] = 11;
        }
        var infoExit = document.querySelector("#canvas-info-exit");
        if (menus.infoOverlay.container.elementInner != null) {
            menus.infoOverlay.container.elementInner.innerHTML = "";
        }
        for (var i = 0; i < menus.infoOverlay.items.length; i++) {
            var element = document.createElement("button");
            element.className = "canvas-info-button";
            element.textContent = menus.infoOverlay.items[i];
            element.dataset.tooltip = getString(["appScreenGraphicalInfoList", menus.infoOverlay.items[i] - 1]);
            initTooltip(element);
            element.onclick = function (event) {
                var target = event.target;
                if (menus.infoOverlay.textTimeout != undefined && menus.infoOverlay.textTimeout != null) {
                    clearTimeout(menus.infoOverlay.textTimeout);
                }
                if (menus.infoOverlay.scaleInterval != undefined && menus.infoOverlay.scaleInterval != null) {
                    clearInterval(menus.infoOverlay.scaleInterval);
                }
                menus.infoOverlay.scaleFac = 1;
                menus.infoOverlay.scaleFacGrow = true;
                menus.infoOverlay.overlayText.style.display = menus.infoOverlay.overlayText.style.fontSize = menus.infoOverlay.overlayText.style.height = "";
                if (menus.infoOverlay.focus == target.textContent) {
                    delete menus.infoOverlay.focus;
                }
                else {
                    menus.infoOverlay.focus = target.textContent;
                    menus.infoOverlay.overlayText.textContent = getString(["appScreenGraphicalInfoList", parseInt(target.textContent, 10) - 1]);
                    menus.infoOverlay.overlayText.style.display = "flex";
                    while (menus.infoOverlay.overlayText.offsetWidth < menus.infoOverlay.overlayText.scrollWidth) {
                        var fontSize = getComputedStyle(menus.infoOverlay.overlayText).getPropertyValue("font-size");
                        menus.infoOverlay.overlayText.style.fontSize = parseFloat(fontSize.substring(0, fontSize.length - 2)) * 0.9 + "px";
                    }
                    var overlayTextHeight = menus.infoOverlay.overlayText.offsetHeight;
                    menus.infoOverlay.overlayText.style.height = Math.max(client.y, overlayTextHeight) + "px";
                    menus.infoOverlay.textTimeout = setTimeout(function () {
                        if (menus.infoOverlay.scaleInterval != undefined && menus.infoOverlay.scaleInterval != null) {
                            clearInterval(menus.infoOverlay.scaleInterval);
                        }
                        menus.infoOverlay.scaleFac = 1;
                        menus.infoOverlay.scaleFacGrow = true;
                        menus.infoOverlay.overlayText.style.display = menus.infoOverlay.overlayText.style.fontSize = menus.infoOverlay.overlayText.style.height = "";
                        delete menus.infoOverlay.focus;
                    }, 4000);
                    menus.infoOverlay.scaleInterval = setInterval(function () {
                        var scaleGrow = 1.002;
                        if (menus.infoOverlay.scaleFacGrow) {
                            menus.infoOverlay.scaleFac *= scaleGrow;
                        }
                        else {
                            menus.infoOverlay.scaleFac /= scaleGrow;
                        }
                        if (menus.infoOverlay.scaleFac < 1) {
                            menus.infoOverlay.scaleFacGrow = true;
                        }
                        else if (menus.infoOverlay.scaleFac > 1.075) {
                            menus.infoOverlay.scaleFacGrow = false;
                        }
                    }, drawInterval);
                }
            };
            menus.infoOverlay.container.elementInner.appendChild(element);
        }
        menus.infoOverlay.container.elementInner.appendChild(infoExit);
        menus.infoOverlay.items = menus.infoOverlay.container.elementInner.querySelectorAll("*:not(.hidden):not(.settings-hidden):not(.gui-hidden)");
        if (menus.options.items.length > 0 && menus.infoOverlay.items.length > 0) {
            drawMenuIcons(menus.infoOverlay, state);
        }
    }
    function drawOptionsMenu(state) {
        menus.options.items = document.querySelectorAll("#canvas-options-inner > *:not(.hidden):not(.settings-hidden):not(.gui-hidden)");
        if (menus.options.items.length > 0) {
            drawMenuIcons(menus.options, state);
        }
    }
    if (currentMode == Modes.DEMO) {
        drawOptionsMenu("hide");
        drawInfoOverlayMenu("hide");
    }
    else if (state == "menu-switch") {
        if (gui.infoOverlay) {
            drawOptionsMenu("hide");
            drawInfoOverlayMenu("show");
        }
        else {
            drawOptionsMenu("show");
            drawInfoOverlayMenu("hide");
        }
    }
    else if (gui.infoOverlay) {
        drawInfoOverlayMenu(state);
    }
    else {
        drawOptionsMenu(state);
    }
}
function beforeOptionsMenuChange() {
    closeConfirmDialog();
}
function calcMenusAndBackground(state) {
    function calcBackground(simulate) {
        if (simulate === void 0) { simulate = false; }
        var additionalHeight;
        if (simulate) {
            additionalHeight = 0;
        }
        else {
            additionalHeight = menus.outerContainer.height * client.devicePixelRatio;
        }
        if (canvasBackground.width / canvasBackground.height / ((canvasBackground.height - additionalHeight) / canvasBackground.height) < pics[background.src].width / pics[background.src].height) {
            client.normalRatio = true;
            background.width = canvasBackground.width;
            background.height = pics[background.src].height * (canvas.width / pics[background.src].width);
            background.x = 0;
            background.y = canvasBackground.height / 2 - background.height / 2 - additionalHeight / 2;
        }
        else {
            client.normalRatio = false;
            background.width = pics[background.src].width * (canvasBackground.height / pics[background.src].height) * ((canvasBackground.height - additionalHeight) / canvasBackground.height);
            background.height = canvasBackground.height - additionalHeight;
            background.x = canvasBackground.width / 2 - background.width / 2;
            background.y = 0;
        }
        if (APP_DATA.debug && debug.showHidden) {
            background.x = 0;
            background.y = canvasBackground.height - background.height;
            background.width /= 2;
            background.height /= 2;
            canvasSemiForeground.style.display = "none";
        }
        client.x = background.x / client.devicePixelRatio;
        client.y = background.y / client.devicePixelRatio;
        if (!simulate) {
            drawBackground();
        }
    }
    function setMediaItems() {
        if (audio.active) {
            menus.options.elements.soundToggle.querySelector("i").textContent = "volume_up";
            menus.options.elements.soundToggle.dataset.tooltip = formatJSString(getString("generalXAreY"), getString("appScreenSound"), getString("generalOn"));
        }
        else {
            menus.options.elements.soundToggle.querySelector("i").textContent = "volume_off";
            menus.options.elements.soundToggle.dataset.tooltip = formatJSString(getString("generalXAreY"), getString("appScreenSound"), getString("generalOff"));
        }
    }
    function set3DItems() {
        if (gui.three) {
            menus.options.elements.infoToggle.classList.add("gui-hidden");
            menus.options.elements.view3DNightToggle.classList.remove("gui-hidden");
            menus.options.elements.view3DToggle.querySelector("i").textContent = "2d";
            menus.options.elements.view3DToggle.dataset.tooltip = formatJSString(getString("generalXIsY"), getString("general3DView"), getString("generalOn"));
            menus.options.elements.view3DCameraSwitcherBackwards.classList.remove("gui-hidden");
            menus.options.elements.view3DCameraSwitcherForwards.classList.remove("gui-hidden");
        }
        else {
            menus.options.elements.infoToggle.classList.remove("gui-hidden");
            menus.options.elements.view3DNightToggle.classList.add("gui-hidden");
            menus.options.elements.view3DToggle.querySelector("i").textContent = "view_in_ar";
            menus.options.elements.view3DToggle.dataset.tooltip = formatJSString(getString("generalXIsY"), getString("general3DView"), getString("generalOff"));
            menus.options.elements.view3DCameraSwitcherBackwards.classList.add("gui-hidden");
            menus.options.elements.view3DCameraSwitcherForwards.classList.add("gui-hidden");
        }
    }
    if (!Object.hasOwn(menus, "options")) {
        menus.options = {};
    }
    if (!Object.hasOwn(menus.options, "elements")) {
        menus.options.elements = {};
        menus.options.elements.modeSingleplayer = document.querySelector("#canvas-single");
        menus.options.elements.modeMultiplayer = document.querySelector("#canvas-team");
        menus.options.elements.modeDemo = document.querySelector("#canvas-demo-mode");
        menus.options.elements.help = document.querySelector("#canvas-help");
        menus.options.elements.settings = document.querySelector("#canvas-settings");
        menus.options.elements.controlCenterTrains = document.querySelector("#canvas-control-center");
        menus.options.elements.controlCenterCars = document.querySelector("#canvas-car-control-center");
        menus.options.elements.infoToggle = document.querySelector("#canvas-info-toggle");
        menus.options.elements.soundToggle = document.querySelector("#canvas-sound-toggle");
        menus.options.elements.view3DToggle = document.querySelector("#canvas-3d-view-toggle");
        menus.options.elements.view3DNightToggle = document.querySelector("#canvas-3d-view-day-night");
        menus.options.elements.view3DCameraSwitcherBackwards = document.querySelector("#canvas-3d-view-camera-switcher-backwards");
        menus.options.elements.view3DCameraSwitcherForwards = document.querySelector("#canvas-3d-view-camera-switcher-forwards");
        menus.options.elements.multiplayerChat = document.querySelector("#canvas-chat-open");
    }
    if (getSetting("reduceOptMenuHideGraphicalInfoToggle")) {
        menus.options.elements.infoToggle.classList.add("settings-hidden");
        if (gui.infoOverlay) {
            gui.infoOverlay = false;
            drawMenu("menu-switch");
        }
    }
    else {
        menus.options.elements.infoToggle.classList.remove("settings-hidden");
    }
    if (getSetting("reduceOptMenuHideTrainControlCenter")) {
        menus.options.elements.controlCenterTrains.classList.add("settings-hidden");
    }
    else {
        menus.options.elements.controlCenterTrains.classList.remove("settings-hidden");
    }
    if (getSetting("reduceOptMenuHideCarControlCenter")) {
        menus.options.elements.controlCenterCars.classList.add("settings-hidden");
    }
    else {
        menus.options.elements.controlCenterCars.classList.remove("settings-hidden");
    }
    if (getSetting("reduceOptMenuHideAudioToggle")) {
        menus.options.elements.soundToggle.classList.add("settings-hidden");
        if (!getSetting("autoplayAudio")) {
            audioControl.setActivation(false);
            setMediaItems();
        }
    }
    else {
        menus.options.elements.soundToggle.classList.remove("settings-hidden");
    }
    if (getSetting("reduceOptMenuHideDemoMode")) {
        menus.options.elements.modeDemo.classList.add("settings-hidden");
    }
    else {
        menus.options.elements.modeDemo.classList.remove("settings-hidden");
    }
    if (getSetting("reduceOptMenuHide3DViewToggle")) {
        menus.options.elements.view3DToggle.classList.add("settings-hidden");
    }
    else {
        menus.options.elements.view3DToggle.classList.remove("settings-hidden");
    }
    if (getSetting("reduceOptMenuHide3DViewNightToggle")) {
        menus.options.elements.view3DNightToggle.classList.add("settings-hidden");
    }
    else {
        menus.options.elements.view3DNightToggle.classList.remove("settings-hidden");
    }
    if (getSetting("reduceOptMenuHide3DViewCameraSwitcher")) {
        menus.options.elements.view3DCameraSwitcherBackwards.classList.add("settings-hidden");
        menus.options.elements.view3DCameraSwitcherForwards.classList.add("settings-hidden");
    }
    else {
        menus.options.elements.view3DCameraSwitcherBackwards.classList.remove("settings-hidden");
        menus.options.elements.view3DCameraSwitcherForwards.classList.remove("settings-hidden");
    }
    if (state == "load") {
        menus.outerContainer = {};
        menus.outerContainer.element = document.querySelector("#canvas-menus");
        menus.outerContainer.element.onwheel = function (event) {
            event.preventDefault();
        };
        menus.options.container = {};
        menus.options.container.elementInner = document.querySelector("#canvas-options-inner");
        menus.infoOverlay = {};
        menus.infoOverlay.container = {};
        menus.infoOverlay.container.elementInner = document.querySelector("#canvas-info-inner");
        menus.infoOverlay.overlayText = document.querySelector("#info-overlay-text");
        menus.options.elements.modeDemo.onclick = function () {
            beforeOptionsMenuChange();
            showConfirmDialogEnterDemoMode();
        };
        menus.options.elements.soundToggle.onclick = function () {
            beforeOptionsMenuChange();
            audioControl.setActivation(!audio.active);
            setMediaItems();
        };
        menus.options.elements.modeSingleplayer.onclick = function () {
            beforeOptionsMenuChange();
            showConfirmDialogLeaveMultiplayerMode();
        };
        menus.options.elements.multiplayerChat.onclick = function () {
            beforeOptionsMenuChange();
            document.querySelector("#chat").openChat();
        };
        menus.options.elements.modeMultiplayer.onclick = function () {
            beforeOptionsMenuChange();
            switchMode(Modes.MULTIPLAYER);
        };
        var settingsElem_1 = document.querySelector("#settings");
        var settingsElemApply = settingsElem_1.querySelector("#settings-apply");
        menus.options.elements.settings.onclick = function () {
            beforeOptionsMenuChange();
            gui.settings = gui.sidebarRight = true;
            settingsElem_1.style.display = "block";
            drawMenu("invisible");
        };
        settingsElemApply.onclick = function () {
            gui.settings = gui.sidebarRight = false;
            settingsElem_1.scrollTo(0, 0);
            settingsElem_1.style.display = "";
            calcMenusAndBackground("settings-change");
            drawMenu("visible");
            if (getSetting("saveGame") && currentMode == Modes.SINGLEPLAYER) {
                animateWorker.postMessage({ k: "enable-save-game" });
            }
        };
        menus.options.elements.help.onclick = function () {
            beforeOptionsMenuChange();
            followLink("help", "_blank", LinkStates.InternalHtml);
        };
        menus.options.elements.infoToggle.onclick = function () {
            beforeOptionsMenuChange();
            gui.infoOverlay = true;
            drawMenu("menu-switch");
        };
        var infoExit = document.querySelector("#canvas-info-exit");
        infoExit.onclick = function () {
            gui.infoOverlay = false;
            drawMenu("menu-switch");
        };
        menus.options.elements.controlCenterTrains.onclick = function () {
            beforeOptionsMenuChange();
            gui.controlCenter = (!gui.controlCenter || controlCenter.showCarCenter) && !gui.konamiOverlay && !onlineConnection.stop;
            controlCenter.showCarCenter = false;
            if (gui.infoOverlay) {
                drawMenu("items-change");
            }
        };
        menus.options.elements.controlCenterCars.onclick = function () {
            beforeOptionsMenuChange();
            gui.controlCenter = (!gui.controlCenter || !controlCenter.showCarCenter) && !gui.konamiOverlay && !onlineConnection.stop;
            controlCenter.showCarCenter = true;
            if (gui.infoOverlay) {
                drawMenu("items-change");
            }
        };
        menus.options.elements.view3DToggle.onclick = function () {
            beforeOptionsMenuChange();
            gui.three = !gui.three;
            setGuiState("3d", gui.three);
            resetScale();
            resetTilt();
            set3DItems();
            calcMenusAndBackground("items-change");
            if (getSetting("classicUI") && !classicUI.trainSwitch.selectedTrainDisplay.visible && !gui.three) {
                notify("#canvas-notifier", formatJSString(getString("appScreenTrainSelected", "."), getString(["appScreenTrainNames", trainParams.selected])), NotificationPriority.High, 1250, null, null, client.y + menus.outerContainer.height);
            }
        };
        menus.options.elements.view3DNightToggle.onclick = function () {
            beforeOptionsMenuChange();
            three.night = !three.night;
            background3D.animateBehind(true);
            setGuiState("3d-night", three.night);
        };
        menus.options.elements.view3DCameraSwitcherBackwards.onclick = function () {
            beforeOptionsMenuChange();
            three.switchCamera(false);
        };
        menus.options.elements.view3DCameraSwitcherForwards.onclick = function () {
            beforeOptionsMenuChange();
            three.switchCamera(true);
        };
    }
    if (state == "load" || state == "reload") {
        setMediaItems();
        set3DItems();
        if (currentMode == Modes.MULTIPLAYER) {
            menus.options.elements.modeDemo.classList.add("mode-hidden");
            menus.options.elements.modeMultiplayer.classList.add("mode-hidden");
            menus.options.elements.modeSingleplayer.classList.remove("mode-hidden");
            menus.options.elements.multiplayerChat.classList.remove("mode-hidden");
        }
        else {
            menus.options.elements.modeDemo.classList.remove("mode-hidden");
            menus.options.elements.modeMultiplayer.classList.remove("mode-hidden");
            menus.options.elements.modeSingleplayer.classList.add("mode-hidden");
            menus.options.elements.multiplayerChat.classList.add("mode-hidden");
        }
    }
    menus.floating = false;
    menus.options.items = document.querySelectorAll("#canvas-options-inner > *:not(.hidden):not(.settings-hidden):not(.gui-hidden)");
    if (currentMode != Modes.DEMO && menus.options.items.length > 0) {
        menus.small = !client.isSmall;
        menus.outerContainer.height = menus.small ? Math.max(25, Math.ceil(client.height / 25)) : Math.max(50, Math.ceil(client.height / 15));
        menus.outerContainer.element.style.display = "";
        calcBackground(true);
        if (menus.small && client.y >= menus.outerContainer.height) {
            menus.floating = true;
            menus.outerContainer.height = 0;
        }
        else if (menus.outerContainer.height >= client.height / 2) {
            menus.small = true;
            menus.outerContainer.height = 0;
            menus.outerContainer.element.style.display = "none";
        }
    }
    else {
        menus.small = true;
        menus.outerContainer.height = 0;
        menus.outerContainer.element.style.display = "none";
    }
    calcBackground();
    menus.outerContainer.width = background.width / client.devicePixelRatio;
    if (window.innerWidth > window.innerHeight) {
        var unsafeArea = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--unsafe-area-bottom"));
        menus.outerContainer.width -= Math.min(background.width / client.devicePixelRatio / 20, unsafeArea);
    }
    menus.innerWidthRelativeToItemLength = false;
    menus.innerWidth = ((getSetting("classicUI") && !gui.three) || menus.floating ? 0.5 : 1) * menus.outerContainer.width;
    var availableHeight = menus.floating ? client.y : menus.outerContainer.height;
    menus.itemDefaultSize = availableHeight * 0.5;
    if (menus.small && (!menus.floating || client.width * 0.75 >= client.height)) {
        menus.innerWidthRelativeToItemLength = true;
        menus.innerWidth = menus.itemDefaultSize + background.width / client.devicePixelRatio / 90;
        menus.outerContainer.element.style.justifyContent = "flex-end";
    }
    else {
        menus.outerContainer.element.style.justifyContent = "";
    }
    menus.outerContainer.element.style.width = menus.outerContainer.width + "px";
    if (!gui.three || three.cameraMode == ThreeCameraModes.BIRDS_EYE) {
        menus.outerContainer.element.style.height = availableHeight + "px";
    }
    else {
        menus.outerContainer.element.style.height = menus.itemDefaultSize + "px";
        menus.outerContainer.height = menus.itemDefaultSize;
    }
    if (menus.floating) {
        menus.outerContainer.element.style.background = "transparent";
    }
    else {
        menus.outerContainer.element.style.background = gui.three ? "transparent" : "";
    }
    if (!gui.three || three.cameraMode == ThreeCameraModes.BIRDS_EYE) {
        menus.outerContainer.element.style.top = client.y + background.height / client.devicePixelRatio + "px";
        menus.outerContainer.element.style.bottom = "unset";
        menus.outerContainer.element.style.left = client.x + "px";
        menus.outerContainer.element.style.right = "unset";
    }
    else {
        menus.outerContainer.element.style.top = "unset";
        menus.outerContainer.element.style.bottom = "0px";
        menus.outerContainer.element.style.left = "unset";
        menus.outerContainer.element.style.right = "0px";
    }
    if (state == "load") {
        var event_1 = new CustomEvent("moroway-app-after-calc-options-menu-load");
        document.dispatchEvent(event_1);
    }
    else {
        drawMenu(state);
    }
}
export function optionsMenuEditorAdd(id, title, icon, onClickFunction) {
    var itemToAdd = document.createElement("button");
    var itemToAddChild = document.createElement("i");
    itemToAdd.classList.add("canvas-options-button");
    itemToAdd.id = id;
    itemToAdd.dataset.tooltip = title;
    initTooltip(itemToAdd);
    itemToAddChild.textContent = icon;
    itemToAddChild.classList.add("material-icons");
    itemToAdd.onclick = function () {
        beforeOptionsMenuChange();
        onClickFunction();
    };
    itemToAdd.appendChild(itemToAddChild);
    menus.options.container.elementInner.appendChild(itemToAdd);
    calcMenusAndBackground("items-change");
}
export function optionsMenuEditorHide(id) {
    for (var i = 0; i < menus.options.items.length; i++) {
        if (menus.options.items[i].id == id) {
            menus.options.items[i].classList.add("hidden");
        }
    }
    calcMenusAndBackground("items-change");
}
/*******************************************
 *     Mouse, touch and key functions      *
 ******************************************/
function getGesture(gesture) {
    if (!gui.controlCenter && !resized && (!gui.three || three.cameraMode == undefined || three.cameraMode == ThreeCameraModes.BIRDS_EYE)) {
        switch (gesture.type) {
            case "doubletap":
                if (client.zoomAndTilt.realScale != 1) {
                    client.zoomAndTilt.realScale = 1;
                }
                else {
                    client.zoomAndTilt.pinchScaleOld = client.zoomAndTilt.realScale = client.zoomAndTilt.maxScale / 2;
                    client.zoomAndTilt.pinchX = gesture.deltaX;
                    client.zoomAndTilt.pinchY = gesture.deltaY;
                }
                break;
            case "pinch":
                client.zoomAndTilt.pinchScale = gesture.scale;
                client.zoomAndTilt.realScale = Math.max(Math.min(client.zoomAndTilt.pinchScaleOld * client.zoomAndTilt.pinchScale, client.zoomAndTilt.maxScale), 1);
                client.zoomAndTilt.pinchX = gesture.deltaX;
                client.zoomAndTilt.pinchY = gesture.deltaY;
                break;
            case "pinchinit":
                client.zoomAndTilt.pinchX = gesture.deltaX;
                client.zoomAndTilt.pinchY = gesture.deltaY;
                client.zoomAndTilt.pinchHypot = gesture.pinchOHypot;
                break;
            case "pinchoffset":
                client.zoomAndTilt.offsetX += canvas.width / 2 - gesture.deltaX;
                client.zoomAndTilt.offsetY += canvas.height / 2 - gesture.deltaY;
                client.zoomAndTilt.pinchX = canvas.width / 2 - client.zoomAndTilt.offsetX / client.zoomAndTilt.realScale;
                client.zoomAndTilt.pinchY = canvas.height / 2 - client.zoomAndTilt.offsetY / client.zoomAndTilt.realScale;
                client.zoomAndTilt.pinchHypot = gesture.pinchOHypot;
                break;
            case "pinchend":
                client.zoomAndTilt.pinchScaleOld = client.zoomAndTilt.realScale;
                client.zoomAndTilt.pinchScale = 1;
                break;
            case "pinchreset":
                delete client.zoomAndTilt.pinchHypot;
                break;
            case "swipe":
                client.zoomAndTilt.pinchX -= gesture.deltaX / client.zoomAndTilt.realScale;
                client.zoomAndTilt.pinchY -= gesture.deltaY / client.zoomAndTilt.realScale;
                break;
            case "tilt":
                client.zoomAndTilt.tiltX -= gesture.deltaX;
                client.zoomAndTilt.tiltY -= gesture.deltaY;
                break;
        }
        client.zoomAndTilt.offsetX = (canvas.width / 2 - client.zoomAndTilt.pinchX) * client.zoomAndTilt.realScale;
        client.zoomAndTilt.offsetY = (canvas.height / 2 - client.zoomAndTilt.pinchY) * client.zoomAndTilt.realScale;
    }
    var xMaxOffset = (client.zoomAndTilt.realScale - 1) * (canvas.width / 2 - background.x);
    var yMaxOffset = (client.zoomAndTilt.realScale - 1) * (canvas.height / 2 - background.y);
    if (client.zoomAndTilt.offsetX > xMaxOffset) {
        client.zoomAndTilt.offsetX = xMaxOffset;
    }
    if (client.zoomAndTilt.offsetX < -xMaxOffset) {
        client.zoomAndTilt.offsetX = -xMaxOffset;
    }
    if (client.zoomAndTilt.offsetY > yMaxOffset) {
        client.zoomAndTilt.offsetY = yMaxOffset;
    }
    if (client.zoomAndTilt.offsetY < -yMaxOffset) {
        client.zoomAndTilt.offsetY = -yMaxOffset;
    }
    var xMinPinch = background.x;
    var xMaxPinch = canvas.width - background.x;
    var yMinPinch = background.y;
    var yMaxPinch = canvas.height - background.y;
    if (client.zoomAndTilt.pinchX > xMaxPinch) {
        client.zoomAndTilt.pinchX = xMaxPinch;
    }
    if (client.zoomAndTilt.pinchX < xMinPinch) {
        client.zoomAndTilt.pinchX = xMinPinch;
    }
    if (client.zoomAndTilt.pinchY > yMaxPinch) {
        client.zoomAndTilt.pinchY = yMaxPinch;
    }
    if (client.zoomAndTilt.pinchY < yMinPinch) {
        client.zoomAndTilt.pinchY = yMinPinch;
    }
    var xMinTilt = -client.width / 2;
    var xMaxTilt = client.width * 1.5;
    var yMinTilt = -client.height / 2;
    var yMaxTilt = client.height * 1.5;
    if (client.zoomAndTilt.tiltX > xMaxTilt) {
        client.zoomAndTilt.tiltX = xMaxTilt;
    }
    if (client.zoomAndTilt.tiltX < xMinTilt) {
        client.zoomAndTilt.tiltX = xMinTilt;
    }
    if (client.zoomAndTilt.tiltY > yMaxTilt) {
        client.zoomAndTilt.tiltY = yMaxTilt;
    }
    if (client.zoomAndTilt.tiltY < yMinTilt) {
        client.zoomAndTilt.tiltY = yMinTilt;
    }
    var scale = three.calcScale();
    three.camera.position.set(scale * ((client.zoomAndTilt.pinchX / client.devicePixelRatio - client.width / 2) / client.width), scale * (-(client.zoomAndTilt.pinchY / client.devicePixelRatio - client.height / 2) / client.width), 1);
    three.scene.rotation.x = (client.zoomAndTilt.tiltY - client.height / 2) / client.height;
    three.scene.rotation.y = (client.zoomAndTilt.tiltX - client.width / 2) / client.width;
    three.camera.zoom = three.zoom + (client.zoomAndTilt.realScale - 1);
    three.camera.updateProjectionMatrix();
    if (client.zoomAndTilt.realScale < client.zoomAndTilt.minScale) {
        resetScale();
    }
}
function onMouseMove(event) {
    client.chosenInputMethod = "mouse";
    hardware.mouse.isMoving = true;
    if (movingTimeOut !== undefined && movingTimeOut !== null) {
        clearTimeout(movingTimeOut);
    }
    movingTimeOut = setTimeout(function () {
        hardware.mouse.isMoving = false;
    }, 5000);
    if (client.zoomAndTilt.realScale > 1 && ((!classicUI.pointInTransformerInput(event.clientX * client.devicePixelRatio, event.clientY * client.devicePixelRatio) && hardware.mouse.isHold) || hardware.mouse.isDrag)) {
        var deltaX = -5 * (hardware.mouse.moveX - event.clientX * client.devicePixelRatio);
        var deltaY = -5 * (hardware.mouse.moveY - event.clientY * client.devicePixelRatio);
        if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) > Math.min(canvas.width, canvas.height) / 30) {
            getGesture({ type: "swipe", deltaX: deltaX / 4, deltaY: deltaY / 4 });
            hardware.mouse.isDrag = true;
            hardware.mouse.isHold = false;
        }
    }
    else if (gui.three && hardware.mouse.isWheelHold) {
        var deltaX = 5 * (hardware.mouse.moveX - event.clientX * client.devicePixelRatio);
        var deltaY = 5 * (hardware.mouse.moveY - event.clientY * client.devicePixelRatio);
        getGesture({ type: "tilt", deltaX: deltaX, deltaY: deltaY });
    }
    hardware.mouse.moveX = event.clientX * client.devicePixelRatio;
    hardware.mouse.moveY = event.clientY * client.devicePixelRatio;
}
function onMouseDown(event) {
    event.preventDefault();
    client.chosenInputMethod = "mouse";
    hardware.lastInputMouse = hardware.mouse.downTime = Date.now();
    hardware.mouse.isHold = event.button == 0 && !gui.controlCenter && !gui.konamiOverlay && !onlineConnection.stop;
    controlCenter.mouse.hold = event.button == 0 && gui.controlCenter && !gui.konamiOverlay && !onlineConnection.stop;
    hardware.mouse.isWheelHold = event.button == 1 && !gui.controlCenter && !gui.konamiOverlay && !onlineConnection.stop;
    hardware.mouse.moveX = hardware.mouse.downX = event.clientX * client.devicePixelRatio;
    hardware.mouse.moveY = hardware.mouse.downY = event.clientY * client.devicePixelRatio;
}
function onMouseUp(event) {
    event.preventDefault();
    resetGestures();
    client.chosenInputMethod = "mouse";
    hardware.mouse.upX = event.clientX * client.devicePixelRatio;
    hardware.mouse.upY = event.clientY * client.devicePixelRatio;
    hardware.mouse.upTime = Date.now();
    controlCenter.mouse.clickEvent = event.button == 0 && gui.controlCenter && !gui.konamiOverlay && !onlineConnection.stop;
}
function onMouseEnter(_event) {
    client.chosenInputMethod = "mouse";
    hardware.mouse.out = false;
}
function onMouseOut(event) {
    event.preventDefault();
    resetGestures();
    client.chosenInputMethod = null;
    hardware.mouse.out = true;
    hardware.keyboard.keysHold = [];
}
function onMouseWheel(event) {
    event.preventDefault();
    client.chosenInputMethod = "mouse";
    if (event.ctrlKey && event.deltaY != 0) {
        if (client.zoomAndTilt.realScale < client.zoomAndTilt.maxScale || event.deltaY > 0) {
            var hypot = client.zoomAndTilt.realScale;
            if (typeof client.zoomAndTilt.pinchHypot == "undefined") {
                var deltaX = hardware.mouse.moveX;
                var deltaY = hardware.mouse.moveY;
                if (client.zoomAndTilt.realScale == 1) {
                    getGesture({ type: "pinchinit", deltaX: deltaX, deltaY: deltaY, pinchOHypot: hypot });
                }
                else {
                    getGesture({ type: "pinchoffset", deltaX: deltaX, deltaY: deltaY, pinchOHypot: hypot });
                }
            }
            if (event.deltaY < 0) {
                hypot *= client.zoomAndTilt.minScale;
            }
            else {
                hypot /= client.zoomAndTilt.minScale;
            }
            getGesture({ type: "pinch", scale: hypot / client.zoomAndTilt.pinchHypot, deltaX: client.zoomAndTilt.pinchX, deltaY: client.zoomAndTilt.pinchY });
        }
    }
    else {
        resetGestures();
        hardware.mouse.wheelScrolls = !gui.controlCenter && !gui.konamiOverlay && !onlineConnection.stop;
        controlCenter.mouse.wheelScrolls = gui.controlCenter && !gui.konamiOverlay && !onlineConnection.stop;
        hardware.mouse.wheelX = event.clientX * client.devicePixelRatio;
        hardware.mouse.wheelY = event.clientY * client.devicePixelRatio;
        hardware.mouse.wheelScrollX = event.deltaX;
        hardware.mouse.wheelScrollY = event.deltaY;
        hardware.mouse.wheelScrollZ = event.deltaZ;
    }
}
function onMouseRight(event) {
    event.preventDefault();
    client.chosenInputMethod = "mouse";
    if (!controlCenter.showCarCenter && gui.controlCenter && !gui.konamiOverlay && !onlineConnection.stop && (client.zoomAndTilt.realScale == 1 || gui.three)) {
        controlCenter.showCarCenter = true;
        notify("#canvas-notifier", getString("appScreenCarControlCenterTitle"), NotificationPriority.Low, 1000, null, null, client.y + menus.outerContainer.height);
    }
    else {
        gui.controlCenter = !gui.controlCenter && !gui.konamiOverlay && !onlineConnection.stop && (client.zoomAndTilt.realScale == 1 || gui.three);
        if (gui.controlCenter) {
            notify("#canvas-notifier", getString("appScreenControlCenterTitle"), NotificationPriority.Low, 1000, null, null, client.y + menus.outerContainer.height);
        }
        controlCenter.mouse.clickEvent = false;
        controlCenter.mouse.wheelScrolls = false;
    }
    if (gui.infoOverlay) {
        drawMenu("items-change");
    }
}
function preventEvent(event) {
    event.preventDefault();
}
function getTouchMove(event) {
    event.preventDefault();
    client.chosenInputMethod = "touch";
    if (event.touches.length == 1 && typeof client.zoomAndTilt.pinchHypot == "undefined" && !client.zoomAndTilt.pinchGestureIsTilt) {
        var deltaX = -5 * (hardware.mouse.moveX - event.touches[0].clientX * client.devicePixelRatio);
        var deltaY = -5 * (hardware.mouse.moveY - event.touches[0].clientY * client.devicePixelRatio);
        if (client.zoomAndTilt.realScale > 1 && Math.max(Math.abs(deltaX), Math.abs(deltaY)) > Math.min(canvas.width, canvas.height) / 30 && !classicUI.pointInTransformerInput(event.touches[0].clientX * client.devicePixelRatio, event.touches[0].clientY * client.devicePixelRatio)) {
            resetGestures();
            getGesture({ type: "swipe", deltaX: deltaX / 4, deltaY: deltaY / 4 });
            if (clickTimeOut !== undefined && clickTimeOut !== null) {
                clearTimeout(clickTimeOut);
                clickTimeOut = null;
            }
            hardware.mouse.isDrag = true;
        }
        hardware.mouse.moveX = event.touches[0].clientX * client.devicePixelRatio;
        hardware.mouse.moveY = event.touches[0].clientY * client.devicePixelRatio;
    }
    else if (event.touches.length == 2) {
        resetGestures();
        if (clickTimeOut !== undefined && clickTimeOut !== null) {
            clearTimeout(clickTimeOut);
            clickTimeOut = null;
        }
        var deltaX = -(hardware.mouse.moveX - event.touches[1].clientX * client.devicePixelRatio);
        var deltaY = -(hardware.mouse.moveY - event.touches[1].clientY * client.devicePixelRatio);
        var hypot = Math.hypot(event.touches[0].clientX - event.touches[1].clientX, event.touches[0].clientY - event.touches[1].clientY);
        if (Math.abs(deltaX) > background.width / 20 || Math.abs(deltaY) > background.width / 20 || Math.abs(hypot - client.zoomAndTilt.pinchHypotDown) > background.width / 20 || typeof client.zoomAndTilt.pinchHypot != "undefined" || client.zoomAndTilt.pinchGestureIsTilt) {
            if (typeof client.zoomAndTilt.pinchHypot == "undefined" && !client.zoomAndTilt.pinchGestureIsTilt) {
                if (Math.abs(hypot - client.zoomAndTilt.pinchHypotDown) < background.width / 50) {
                    client.zoomAndTilt.tiltXOld = ((event.touches[0].clientX + event.touches[1].clientX) / 2) * client.devicePixelRatio;
                    client.zoomAndTilt.tiltYOld = ((event.touches[0].clientY + event.touches[1].clientY) / 2) * client.devicePixelRatio;
                    client.zoomAndTilt.pinchGestureIsTilt = true;
                    hardware.mouse.isDrag = true;
                }
                else {
                    var deltaX = ((event.touches[0].clientX + event.touches[1].clientX) / 2) * client.devicePixelRatio;
                    var deltaY = ((event.touches[0].clientY + event.touches[1].clientY) / 2) * client.devicePixelRatio;
                    if (client.zoomAndTilt.realScale == 1) {
                        getGesture({ type: "pinchinit", deltaX: deltaX, deltaY: deltaY, pinchOHypot: hypot });
                    }
                    else {
                        getGesture({ type: "pinchoffset", deltaX: deltaX, deltaY: deltaY, pinchOHypot: hypot });
                    }
                    hardware.mouse.isDrag = false;
                }
            }
            if (client.zoomAndTilt.pinchGestureIsTilt) {
                var tiltXNew = ((event.touches[0].clientX + event.touches[1].clientX) / 2) * client.devicePixelRatio;
                var tiltYNew = ((event.touches[0].clientY + event.touches[1].clientY) / 2) * client.devicePixelRatio;
                var deltaX = 3 * (client.zoomAndTilt.tiltXOld - tiltXNew);
                var deltaY = 3 * (client.zoomAndTilt.tiltYOld - tiltYNew);
                getGesture({ type: "tilt", deltaX: deltaX, deltaY: deltaY });
                client.zoomAndTilt.tiltXOld = tiltXNew;
                client.zoomAndTilt.tiltYOld = tiltYNew;
            }
            else {
                getGesture({ type: "pinch", scale: hypot / client.zoomAndTilt.pinchHypot, deltaX: client.zoomAndTilt.pinchX, deltaY: client.zoomAndTilt.pinchY });
            }
        }
    }
    else {
        resetGestures();
        if (clickTimeOut !== undefined && clickTimeOut !== null) {
            clearTimeout(clickTimeOut);
            clickTimeOut = null;
        }
    }
}
function getTouchStart(event) {
    event.preventDefault();
    client.chosenInputMethod = "touch";
    var xTS = event.changedTouches[0].clientX * client.devicePixelRatio;
    var yTS = event.changedTouches[0].clientY * client.devicePixelRatio;
    if (event.touches.length == 1 && Math.max(hardware.mouse.moveX, xTS) < 1.1 * Math.min(hardware.mouse.moveX, xTS) && Math.max(hardware.mouse.moveY, yTS) < 1.1 * Math.min(hardware.mouse.moveY, yTS) && Date.now() - hardware.mouse.downTime < doubleTouchTime && Date.now() - hardware.mouse.upTime < doubleTouchTime && !classicUI.pointInTrainSwitchInput(xTS, yTS) && !classicUI.pointInTransformerInput(xTS, yTS)) {
        resetGestures();
        if (clickTimeOut !== undefined && clickTimeOut !== null) {
            clearTimeout(clickTimeOut);
            clickTimeOut = null;
        }
        getGesture({ type: "doubletap", deltaX: xTS, deltaY: yTS });
    }
    else if (event.touches.length == 3) {
        resetGestures();
        if (clickTimeOut !== undefined && clickTimeOut !== null) {
            clearTimeout(clickTimeOut);
            clickTimeOut = null;
        }
        controlCenter.mouse.prepare = true;
    }
    else {
        resetGestures();
        if (event.touches.length > 1 && clickTimeOut !== undefined && clickTimeOut !== null) {
            clearTimeout(clickTimeOut);
            clickTimeOut = null;
        }
        if (event.touches.length == 2) {
            client.zoomAndTilt.pinchHypotDown = Math.hypot(event.touches[0].clientX - event.touches[1].clientX, event.touches[0].clientY - event.touches[1].clientY);
        }
        hardware.lastInputTouch = hardware.mouse.downTime = Date.now();
        hardware.mouse.moveX = hardware.mouse.downX = xTS;
        hardware.mouse.moveY = hardware.mouse.downY = yTS;
        hardware.mouse.isHold = event.touches.length == 1 && !gui.controlCenter && !gui.konamiOverlay && !onlineConnection.stop;
        controlCenter.mouse.hold = event.touches.length == 1 && gui.controlCenter && !gui.konamiOverlay && !onlineConnection.stop;
    }
}
function getTouchEnd(event) {
    event.preventDefault();
    resetGestures();
    client.chosenInputMethod = "touch";
    if (event.touches.length == 1) {
        getGesture({ type: "pinchend" });
    }
    else if (event.touches.length == 0) {
        client.zoomAndTilt.pinchGestureIsTilt = false;
        getGesture({ type: "pinchreset" });
    }
    hardware.mouse.upX = event.changedTouches[0].clientX * client.devicePixelRatio;
    hardware.mouse.upY = event.changedTouches[0].clientY * client.devicePixelRatio;
    hardware.mouse.upTime = Date.now();
    controlCenter.mouse.clickEvent = gui.controlCenter && !gui.konamiOverlay && !onlineConnection.stop;
    if (controlCenter.mouse.prepare && event.touches.length == 0) {
        if (!controlCenter.showCarCenter && gui.controlCenter && !gui.konamiOverlay && !onlineConnection.stop && (client.zoomAndTilt.realScale == 1 || gui.three)) {
            controlCenter.showCarCenter = true;
            notify("#canvas-notifier", getString("appScreenCarControlCenterTitle"), NotificationPriority.Low, 1000, null, null, client.y + menus.outerContainer.height);
            controlCenter.mouse.clickEvent = controlCenter.mouse.hold = controlCenter.mouse.prepare = false;
        }
        else {
            gui.controlCenter = !gui.controlCenter && !gui.konamiOverlay && !onlineConnection.stop && (client.zoomAndTilt.realScale == 1 || gui.three);
            if (gui.controlCenter) {
                notify("#canvas-notifier", getString("appScreenControlCenterTitle"), NotificationPriority.Low, 1000, null, null, client.y + menus.outerContainer.height);
            }
            controlCenter.mouse.clickEvent = controlCenter.mouse.hold = controlCenter.mouse.prepare = false;
        }
        if (gui.infoOverlay) {
            drawMenu("items-change");
        }
    }
}
function getTouchCancel(_event) {
    resetGestures();
    client.chosenInputMethod = "touch";
    hardware.keyboard.keysHold = [];
}
function onKeyDown(event) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    if (!client.hidden && !hardware.mouse.out) {
        if (!hardware.keyboard.keysHold[event.key]) {
            hardware.keyboard.keysHold[event.key] = {};
        }
        hardware.keyboard.keysHold[event.key].active = true;
        hardware.keyboard.keysHold[event.key].ctrlKey = event.ctrlKey;
    }
    if (event.key == "Tab" || event.key == "Enter") {
        event.preventDefault();
    }
    if (event.ctrlKey) {
        if (event.key == "0" && client.zoomAndTilt.realScale > 1) {
            event.preventDefault();
            getGesture({ type: "doubletap", deltaX: client.zoomAndTilt.pinchX, deltaY: client.zoomAndTilt.pinchY });
        }
        else if (event.key == "+" || event.key == "-") {
            event.preventDefault();
            if (client.zoomAndTilt.realScale < client.zoomAndTilt.maxScale || event.key == "-") {
                if (typeof client.zoomAndTilt.pinchHypot == "undefined") {
                    var deltaX = hardware.mouse.moveX;
                    var deltaY = hardware.mouse.moveY;
                    if (client.zoomAndTilt.realScale == 1) {
                        getGesture({ type: "pinchinit", deltaX: deltaX, deltaY: deltaY, pinchOHypot: client.zoomAndTilt.realScale });
                    }
                    else {
                        getGesture({ type: "pinchoffset", deltaX: deltaX, deltaY: deltaY, pinchOHypot: client.zoomAndTilt.realScale });
                    }
                }
                var hypot = client.zoomAndTilt.realScale;
                if (event.key == "+") {
                    hypot *= client.zoomAndTilt.minScale;
                }
                else {
                    hypot /= client.zoomAndTilt.minScale;
                }
                getGesture({ type: "pinch", scale: hypot / client.zoomAndTilt.pinchHypot, deltaX: client.zoomAndTilt.pinchX, deltaY: client.zoomAndTilt.pinchY });
            }
        }
    }
    else if (event.target.tagName != "INPUT" && event.target.tagName != "TEXTAREA" && !gui.konamiOverlay) {
        if (event.key == "/" && !gui.sidebarRight && !gui.textControl) {
            event.preventDefault();
            gui.textControl = true;
            drawMenu("hide-outer");
            textControl.elements.output.textContent = textControl.execute();
            textControl.elements.root.style.display = "block";
            textControl.elements.input.focus();
        }
        else if (event.key == " ") {
            event.preventDefault();
            (_c = (_b = (_a = menus.options) === null || _a === void 0 ? void 0 : _a.elements) === null || _b === void 0 ? void 0 : _b.view3DToggle) === null || _c === void 0 ? void 0 : _c.click();
        }
        else if (event.key == "-") {
            event.preventDefault();
            (_f = (_e = (_d = menus.options) === null || _d === void 0 ? void 0 : _d.elements) === null || _e === void 0 ? void 0 : _e.controlCenterTrains) === null || _f === void 0 ? void 0 : _f.click();
        }
        else if (event.key == "_") {
            event.preventDefault();
            (_j = (_h = (_g = menus.options) === null || _g === void 0 ? void 0 : _g.elements) === null || _h === void 0 ? void 0 : _h.controlCenterCars) === null || _j === void 0 ? void 0 : _j.click();
        }
        else if (event.key == "c" && gui.three) {
            event.preventDefault();
            (_m = (_l = (_k = menus.options) === null || _k === void 0 ? void 0 : _k.elements) === null || _l === void 0 ? void 0 : _l.view3DCameraSwitcherForwards) === null || _m === void 0 ? void 0 : _m.click();
        }
        else if (event.key == "C" && gui.three) {
            event.preventDefault();
            (_q = (_p = (_o = menus.options) === null || _o === void 0 ? void 0 : _o.elements) === null || _p === void 0 ? void 0 : _p.view3DCameraSwitcherBackwards) === null || _q === void 0 ? void 0 : _q.click();
        }
        else if ((event.key == "ArrowUp" && (konamiState === 0 || konamiState == 1)) || (event.key == "ArrowDown" && (konamiState == 2 || konamiState == 3)) || (event.key == "ArrowLeft" && (konamiState == 4 || konamiState == 6)) || (event.key == "ArrowRight" && (konamiState == 5 || konamiState == 7)) || (event.key == "b" && konamiState == 8)) {
            if (konamiTimeOut !== undefined && konamiTimeOut !== null) {
                clearTimeout(konamiTimeOut);
            }
            konamiState++;
            konamiTimeOut = setTimeout(function () {
                konamiState = 0;
            }, 500);
        }
        else if (event.key == "a" && konamiState == 9) {
            if (konamiTimeOut !== undefined && konamiTimeOut !== null) {
                clearTimeout(konamiTimeOut);
            }
            konamiState = -1;
            gui.konamiOverlay = true;
            drawBackground();
            background3D.animateBehind(true);
        }
        else if (konamiState < 0 && (event.key == "Enter" || event.key == "a" || event.key == "b")) {
            konamiState = konamiState > -2 ? --konamiState : 0;
            gui.konamiOverlay = false;
            if (konamiState == 0) {
                drawBackground();
                background3D.animateBehind(true);
            }
        }
        else if (konamiState > 0) {
            if (konamiTimeOut !== undefined && konamiTimeOut !== null) {
                clearTimeout(konamiTimeOut);
            }
            konamiState = 0;
        }
    }
}
function onKeyUp(event) {
    if (event.key == "Control") {
        getGesture({ type: "pinchend" });
        getGesture({ type: "pinchreset" });
    }
    if (!hardware.keyboard.keysHold[event.key]) {
        hardware.keyboard.keysHold[event.key] = {};
    }
    hardware.keyboard.keysHold[event.key].active = false;
    hardware.keyboard.keysHold[event.key].ctrlKey = false;
}
function preventKeyZoomDuringLoad(event) {
    if (event.key == "Escape" || (event.ctrlKey && (event.key == "+" || event.key == "-" || event.key == "0"))) {
        event.preventDefault();
    }
}
/*******************************************
 *               Classic UI                *
 ******************************************/
function calcClassicUIElements() {
    function realWidth(angle, width, height) {
        return Math.abs(Math.sin(angle)) * height + Math.abs(Math.cos(angle)) * width;
    }
    function realHeight(angle, width, height) {
        return Math.abs(Math.sin(angle)) * width + Math.abs(Math.cos(angle)) * height;
    }
    var fac = menus.small ? 0.042 : 0.059;
    classicUI.trainSwitch.width = fac * background.width;
    classicUI.trainSwitch.height = fac * (pics[classicUI.trainSwitch.src].height * (background.width / pics[classicUI.trainSwitch.src].width));
    if (menus.small) {
        fac = 0.07;
        classicUI.transformer.width = fac * background.width;
        classicUI.transformer.height = fac * (pics[classicUI.transformer.src].height * (background.width / pics[classicUI.transformer.src].width));
    }
    else {
        classicUI.transformer.height = Math.max(3 * menus.outerContainer.height * client.devicePixelRatio, background.height / 5);
        classicUI.transformer.width = (classicUI.transformer.height / pics[classicUI.transformer.src].height) * pics[classicUI.transformer.src].width;
        var i = 0;
        while (i < 100 && (realHeight(classicUI.transformer.angle, classicUI.transformer.width, classicUI.transformer.height) - menus.outerContainer.height * client.devicePixelRatio > background.height / 5 || realWidth(classicUI.transformer.angle, classicUI.transformer.width, classicUI.transformer.height) > background.width / 5)) {
            classicUI.transformer.height *= 0.9;
            classicUI.transformer.width = (classicUI.transformer.height / pics[classicUI.transformer.src].height) * pics[classicUI.transformer.src].width;
            i++;
        }
    }
    fac = 0.7;
    classicUI.transformer.wheelInput.width = classicUI.transformer.wheelInput.height = fac * classicUI.transformer.width;
    fac = 0.17;
    classicUI.transformer.directionInput.width = fac * classicUI.transformer.width;
    classicUI.transformer.directionInput.height = fac * (pics[classicUI.transformer.directionInput.srcStandardDirection].height * (classicUI.transformer.width / pics[classicUI.transformer.directionInput.srcStandardDirection].width));
    if (menus.small) {
        classicUI.trainSwitch.angle = 0;
        classicUI.trainSwitch.x = background.x + background.width / 99;
        classicUI.trainSwitch.y = background.y + background.height / 1.175;
        classicUI.transformer.x = background.x + background.width / 1.1;
        classicUI.transformer.y = background.y + background.height / 1.4;
    }
    else {
        classicUI.trainSwitch.angle = -classicUI.transformer.angle;
        classicUI.trainSwitch.x = background.x + (realWidth(classicUI.trainSwitch.angle, classicUI.trainSwitch.width, classicUI.trainSwitch.height) - classicUI.trainSwitch.width) / 2;
        classicUI.trainSwitch.y = background.y + background.height / 1.1;
        classicUI.transformer.x = background.x + background.width - classicUI.transformer.width - (realWidth(classicUI.transformer.angle, classicUI.transformer.width, classicUI.transformer.height) - classicUI.transformer.width) / 2;
        classicUI.transformer.y = background.y + background.height + menus.outerContainer.height * client.devicePixelRatio - classicUI.transformer.height - (realHeight(classicUI.transformer.angle, classicUI.transformer.width, classicUI.transformer.height) - classicUI.transformer.height) / 2;
        if (classicUI.transformer.y > background.y + background.height) {
            classicUI.transformer.y = background.y + background.height;
        }
    }
    classicUI.transformer.wheelInput.diffY = classicUI.transformer.height / 6;
    classicUI.transformer.directionInput.diffX = classicUI.transformer.width * 0.46 - classicUI.transformer.directionInput.width;
    classicUI.transformer.directionInput.diffY = classicUI.transformer.height * 0.46 - classicUI.transformer.directionInput.height;
    context.textBaseline = "middle";
    var longestName = 0;
    for (var i = 1; i < trains.length; i++) {
        if (getString(["appScreenTrainNames", i]).length > getString(["appScreenTrainNames", longestName]).length) {
            longestName = i;
        }
    }
    var heightMultiply = 1.6;
    var widthMultiply = 1.2;
    var wantedWidth = ((menus.small ? 0.35 : 0.9) * background.width) / 4 / widthMultiply;
    var tempFont = measureFontSize(getString(["appScreenTrainNames", longestName]), classicUI.trainSwitch.selectedTrainDisplay.fontFamily, wantedWidth / getString(["appScreenTrainNames", longestName]).length, wantedWidth, 3, background.width * 0.004);
    var tempFontSize = menus.small ? getFontSize(tempFont, "px") : Math.min((0.9 * menus.outerContainer.height * client.devicePixelRatio) / heightMultiply, getFontSize(tempFont, "px"));
    var currentSelectedTrainDisplayVisible = getSetting("alwaysShowSelectedTrain") && tempFontSize >= 7;
    if (classicUI.trainSwitch.selectedTrainDisplay.visible != currentSelectedTrainDisplayVisible) {
        classicUI.trainSwitch.selectedTrainDisplay.visible = currentSelectedTrainDisplayVisible;
        if (gui.infoOverlay) {
            drawMenu("items-change");
        }
    }
    classicUI.trainSwitch.selectedTrainDisplay.font = tempFontSize + "px " + classicUI.trainSwitch.selectedTrainDisplay.fontFamily;
    context.font = classicUI.trainSwitch.selectedTrainDisplay.font;
    classicUI.trainSwitch.selectedTrainDisplay.width = widthMultiply * context.measureText(getString(["appScreenTrainNames", longestName])).width;
    classicUI.trainSwitch.selectedTrainDisplay.height = heightMultiply * getFontSize(classicUI.trainSwitch.selectedTrainDisplay.font, "px");
    classicUI.trainSwitch.selectedTrainDisplay.x = (menus.small ? classicUI.trainSwitch.width : 0) + classicUI.trainSwitch.x;
    classicUI.trainSwitch.selectedTrainDisplay.y = menus.small ? classicUI.trainSwitch.y + classicUI.trainSwitch.height - classicUI.trainSwitch.selectedTrainDisplay.height * 1.3 : background.y + background.height + (menus.outerContainer.height * client.devicePixelRatio - classicUI.trainSwitch.selectedTrainDisplay.height) / 2;
    if (!menus.small && classicUI.trainSwitch.selectedTrainDisplay.visible) {
        classicUI.trainSwitch.y = classicUI.trainSwitch.selectedTrainDisplay.y - classicUI.trainSwitch.height * 0.9;
        var i = 0;
        while (i < 100 && classicUI.trainSwitch.height - (classicUI.trainSwitch.height - (background.y + background.height - classicUI.trainSwitch.y)) < background.height / 8) {
            classicUI.trainSwitch.height *= 1.1;
            classicUI.trainSwitch.width *= 1.1;
            classicUI.trainSwitch.y = classicUI.trainSwitch.selectedTrainDisplay.y - classicUI.trainSwitch.height * 0.9;
            i++;
        }
    }
    else if (!menus.small) {
        classicUI.trainSwitch.height = classicUI.transformer.height;
        classicUI.trainSwitch.width = pics[classicUI.trainSwitch.src].width * (classicUI.trainSwitch.height / pics[classicUI.trainSwitch.src].height);
        classicUI.trainSwitch.y = classicUI.transformer.y;
    }
}
/*******************************************
 *             Control Center              *
 ******************************************/
function calcControlCenter() {
    controlCenter.translateOffset = background.width / 100;
    controlCenter.maxTextWidth = (background.width - 2 * controlCenter.translateOffset) / 2;
    controlCenter.maxTextHeight = background.height - 2 * controlCenter.translateOffset;
    if (controlCenter.fontSizes == undefined) {
        controlCenter.fontSizes = {};
    }
    if (controlCenter.fontSizes.trainSizes == undefined) {
        controlCenter.fontSizes.trainSizes = {};
    }
    if (controlCenter.fontSizes.trainSizes.trainNames == undefined) {
        controlCenter.fontSizes.trainSizes.trainNames = [];
    }
    if (controlCenter.fontSizes.trainSizes.trainNamesLength == undefined) {
        controlCenter.fontSizes.trainSizes.trainNamesLength = [];
    }
    contextForeground.save();
    controlCenter.fontSizes.closeTextHeight = Math.min(controlCenter.maxTextWidth / 12, getFontSize(measureFontSize(getString("generalClose", "", "upper"), controlCenter.fontFamily, controlCenter.maxTextWidth / 12, controlCenter.maxTextHeight, 5, 1.2), "px"));
    controlCenter.fontSizes.trainSizes.speedTextHeight = Math.min((0.5 * controlCenter.maxTextHeight) / trains.length, getFontSize(measureFontSize(getString("appScreenControlCenterSpeedOff"), controlCenter.fontFamily, (0.5 * (controlCenter.maxTextWidth * 0.5)) / getString("appScreenControlCenterSpeedOff").length, 0.5 * (controlCenter.maxTextWidth * 0.5), 5, 1.2), "px"));
    var cText;
    for (var cTrain = 0; cTrain < trains.length; cTrain++) {
        cText = getString(["appScreenTrainNames", cTrain]);
        controlCenter.fontSizes.trainSizes.trainNames[cTrain] = Math.min((0.625 * controlCenter.maxTextHeight) / trains.length, getFontSize(measureFontSize(cText, controlCenter.fontFamily, (0.625 * controlCenter.maxTextWidth) / cText.length, 0.625 * controlCenter.maxTextWidth, 5, 1.2), "px"));
        contextForeground.font = controlCenter.fontSizes.trainSizes.trainNames[cTrain] + "px " + controlCenter.fontFamily;
        controlCenter.fontSizes.trainSizes.trainNamesLength[cTrain] = contextForeground.measureText(cText).width;
    }
    if (controlCenter.fontSizes.carSizes == undefined) {
        controlCenter.fontSizes.carSizes = {};
    }
    if (controlCenter.fontSizes.carSizes.init == undefined) {
        controlCenter.fontSizes.carSizes.init = {};
    }
    if (controlCenter.fontSizes.carSizes.init.carNames == undefined) {
        controlCenter.fontSizes.carSizes.init.carNames = [];
    }
    if (controlCenter.fontSizes.carSizes.init.carNamesLength == undefined) {
        controlCenter.fontSizes.carSizes.init.carNamesLength = [];
    }
    if (controlCenter.fontSizes.carSizes.manual == undefined) {
        controlCenter.fontSizes.carSizes.manual = {};
    }
    if (controlCenter.fontSizes.carSizes.manual.carNames == undefined) {
        controlCenter.fontSizes.carSizes.manual.carNames = [];
    }
    if (controlCenter.fontSizes.carSizes.manual.carNamesLength == undefined) {
        controlCenter.fontSizes.carSizes.manual.carNamesLength = [];
    }
    if (controlCenter.fontSizes.carSizes.auto == undefined) {
        controlCenter.fontSizes.carSizes.auto = {};
    }
    cText = getString("appScreenCarControlCenterAutoModeActivate");
    controlCenter.fontSizes.carSizes.init.autoModeActivate = Math.min((0.5 * controlCenter.maxTextHeight) / cars.length, getFontSize(measureFontSize(cText, controlCenter.fontFamily, (1.5 * controlCenter.maxTextWidth) / cText.length, 1.5 * controlCenter.maxTextWidth, 5, 1.2), "px"));
    contextForeground.font = controlCenter.fontSizes.carSizes.init.autoModeActivate + "px " + controlCenter.fontFamily;
    controlCenter.fontSizes.carSizes.init.autoModeActivateLength = contextForeground.measureText(cText).width;
    for (var cCar = 0; cCar < cars.length; cCar++) {
        cText = formatJSString(getString("appScreenCarControlCenterStartCar"), getString(["appScreenCarNames", cCar]));
        controlCenter.fontSizes.carSizes.init.carNames[cCar] = Math.min((0.5 * controlCenter.maxTextHeight) / cars.length, getFontSize(measureFontSize(cText, controlCenter.fontFamily, (1.5 * controlCenter.maxTextWidth) / cText.length, 1.5 * controlCenter.maxTextWidth, 5, 1.2), "px"));
        contextForeground.font = controlCenter.fontSizes.carSizes.init.carNames[cCar] + "px " + controlCenter.fontFamily;
        controlCenter.fontSizes.carSizes.init.carNamesLength[cCar] = contextForeground.measureText(cText).width;
        cText = formatJSString(getString(["appScreenCarNames", cCar]));
        controlCenter.fontSizes.carSizes.manual.carNames[cCar] = Math.min((0.625 * controlCenter.maxTextHeight) / cars.length, getFontSize(measureFontSize(cText, controlCenter.fontFamily, (0.625 * controlCenter.maxTextWidth) / cText.length, 0.625 * controlCenter.maxTextWidth, 5, 1.2), "px"));
        contextForeground.font = controlCenter.fontSizes.carSizes.manual.carNames[cCar] + "px " + controlCenter.fontFamily;
        controlCenter.fontSizes.carSizes.manual.carNamesLength[cCar] = contextForeground.measureText(cText).width;
    }
    cText = getString("appScreenCarControlCenterAutoModePause");
    controlCenter.fontSizes.carSizes.auto.pause = Math.min((0.625 * controlCenter.maxTextHeight) / 2, getFontSize(measureFontSize(cText, controlCenter.fontFamily, (0.625 * controlCenter.maxTextWidth) / cText.length, 0.625 * controlCenter.maxTextWidth, 5, 1.2), "px"));
    contextForeground.font = controlCenter.fontSizes.carSizes.auto.pause + "px " + controlCenter.fontFamily;
    controlCenter.fontSizes.carSizes.auto.pauseLength = contextForeground.measureText(cText).width;
    cText = getString("appScreenCarControlCenterAutoModeResume");
    controlCenter.fontSizes.carSizes.auto.resume = Math.min((0.625 * controlCenter.maxTextHeight) / 2, getFontSize(measureFontSize(cText, controlCenter.fontFamily, (0.625 * controlCenter.maxTextWidth) / cText.length, 0.625 * controlCenter.maxTextWidth, 5, 1.2), "px"));
    contextForeground.font = controlCenter.fontSizes.carSizes.auto.resume + "px " + controlCenter.fontFamily;
    controlCenter.fontSizes.carSizes.auto.resumeLength = contextForeground.measureText(cText).width;
    cText = getString("appScreenCarControlCenterAutoModeBackToRoot");
    controlCenter.fontSizes.carSizes.auto.backToRoot = Math.min((0.625 * controlCenter.maxTextHeight) / 2, getFontSize(measureFontSize(cText, controlCenter.fontFamily, (0.625 * controlCenter.maxTextWidth) / cText.length, 0.625 * controlCenter.maxTextWidth, 5, 1.2), "px"));
    contextForeground.font = controlCenter.fontSizes.carSizes.auto.backToRoot + "px " + controlCenter.fontFamily;
    controlCenter.fontSizes.carSizes.auto.backToRootLength = contextForeground.measureText(cText).width;
    contextForeground.restore();
}
/*******************************************
 *                  Resize                 *
 ******************************************/
function resizeCars(oldBg) {
    cars.forEach(function (car) {
        car.speed *= background.width / oldBg.width;
        car.width *= background.width / oldBg.width;
        car.height *= background.height / oldBg.height;
        car.x *= background.width / oldBg.width;
        car.y *= background.height / oldBg.height;
    });
}
function requestResize() {
    function resize() {
        if (modeSwitching) {
            return;
        }
        resized = true;
        if (currentMode == Modes.MULTIPLAYER) {
            if (multiplayerMode.resizedTimeout != undefined && multiplayerMode.resizedTimeout != null) {
                clearTimeout(multiplayerMode.resizedTimeout);
            }
            onlineConnection.resized = true;
        }
        resetScale();
        resetTilt();
        oldBackground = copyJSObject(background);
        measureViewSpace();
        calcMenusAndBackground("resize");
        three.renderer.setPixelRatio(client.devicePixelRatio);
        three.renderer.setSize(client.width, client.height);
        three.renderer.domElement.style.left = "0px";
        three.renderer.domElement.style.top = "0px";
        three.camera.aspect = client.width / client.height;
        three.camera.updateProjectionMatrix();
        three.followCamera.aspect = client.width / client.height;
        three.followCamera.fov = Math.min(45, 45 / (client.width / client.height / 2));
        three.followCamera.updateProjectionMatrix();
        background3D.behind.width = client.width * client.devicePixelRatio;
        background3D.behind.height = client.height * client.devicePixelRatio;
        background3D.behind.style.width = client.width + "px";
        background3D.behind.style.height = client.height + "px";
        background3D.behind.style.left = "0px";
        background3D.behind.style.top = "0px";
        background3D.animateBehind(true);
        animateWorker.postMessage({ k: "resize", background: background, oldBackground: oldBackground });
        switchParams.set();
        carWays.forEach(function (way) {
            Object.keys(way).forEach(function (cType) {
                way[cType].forEach(function (point) {
                    point.x *= background.width / oldBackground.width;
                    point.y *= background.height / oldBackground.height;
                });
            });
        });
        resizeCars(oldBackground);
        taxOffice.params.fire.x *= background.width / oldBackground.width;
        taxOffice.params.fire.y *= background.height / oldBackground.height;
        taxOffice.params.fire.size *= background.width / oldBackground.width;
        taxOffice.params.smoke.x *= background.width / oldBackground.width;
        taxOffice.params.smoke.y *= background.height / oldBackground.height;
        taxOffice.params.smoke.size *= background.width / oldBackground.width;
        for (var i = 0; i < taxOffice.params.number; i++) {
            taxOffice.fire[i].x *= background.width / oldBackground.width;
            taxOffice.fire[i].y *= background.height / oldBackground.height;
            taxOffice.fire[i].size *= background.width / oldBackground.width;
            taxOffice.smoke[i].x *= background.width / oldBackground.width;
            taxOffice.smoke[i].y *= background.height / oldBackground.height;
            taxOffice.smoke[i].size *= background.width / oldBackground.width;
        }
        taxOffice.params.blueLights.cars.forEach(function (car) {
            car.x[0] *= background.width / oldBackground.width;
            car.x[1] *= background.width / oldBackground.width;
            car.y[0] *= background.height / oldBackground.height;
            car.y[1] *= background.height / oldBackground.height;
            car.size *= background.width / oldBackground.width;
        });
        calcClassicUIElements();
        calcControlCenter();
        three.followCamControls.recalc();
        if (background3D.flat && background3D.flat.resize)
            background3D.flat.resize();
        if (background3D.three && background3D.three.resize)
            background3D.three.resize();
        cars3D.forEach(function (car) {
            if (car.resize) {
                car.resize();
            }
        });
    }
    if (modeSwitching) {
        return;
    }
    if (resizeTimeout !== undefined && resizeTimeout !== null) {
        clearTimeout(resizeTimeout);
    }
    if (resized) {
        resizeTimeout = setTimeout(requestResize, 10);
    }
    else {
        resize();
        resizeTimeout = setTimeout(resize, 50);
    }
}
/*******************************************
 *             Draw  functions             *
 ******************************************/
function carCollisionCourse(input1, sendNotification, fixFac) {
    if (fixFac === void 0) { fixFac = undefined; }
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    var collision = false;
    var currentObject;
    var fac;
    if ((!carParams.autoModeOff && carParams.isBackToRoot) || (carParams.autoModeOff && (cars[input1].backToInit || cars[input1].backwardsState > 0))) {
        fac = -1;
    }
    else {
        fac = 1;
    }
    if (fixFac && Math.abs(fixFac) == 1) {
        fac = fixFac;
    }
    currentObject = cars[input1];
    var x1 = currentObject.x + (fac * Math.sin(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2 + (Math.cos(-Math.PI / 2 - currentObject.displayAngle) * currentObject.height) / 2;
    var x2 = currentObject.x + (fac * Math.sin(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2 - (Math.cos(-Math.PI / 2 - currentObject.displayAngle) * currentObject.height) / 2;
    var x3 = currentObject.x + (fac * Math.sin(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2;
    var y1 = currentObject.y + (fac * Math.cos(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2 - (Math.sin(-Math.PI / 2 - currentObject.displayAngle) * currentObject.height) / 2;
    var y2 = currentObject.y + (fac * Math.cos(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2 + (Math.sin(-Math.PI / 2 - currentObject.displayAngle) * currentObject.height) / 2;
    var y3 = currentObject.y + (fac * Math.cos(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2;
    if (APP_DATA.debug && debug.paint) {
        context.save();
        context.setTransform(client.zoomAndTilt.realScale, 0, 0, client.zoomAndTilt.realScale, (-(client.zoomAndTilt.realScale - 1) * canvas.width) / 2 + client.zoomAndTilt.offsetX, (-(client.zoomAndTilt.realScale - 1) * canvas.height) / 2 + client.zoomAndTilt.offsetY);
        context.fillRect(background.x + x1 - 3, background.y + y1 - 3, 6, 6);
        context.fillRect(background.x + x2 - 3, background.y + y2 - 3, 6, 6);
        context.fillRect(background.x + x3 - 3, background.y + y3 - 3, 6, 6);
        context.restore();
    }
    for (var i = 0; i < cars.length; i++) {
        if (input1 != i) {
            currentObject = cars[i];
            context.save();
            context.translate(currentObject.x, currentObject.y);
            context.rotate(currentObject.displayAngle);
            context.beginPath();
            context.rect(-currentObject.width / 2, -currentObject.height / 2, currentObject.width, currentObject.height);
            if (context.isPointInPath(x1, y1) || context.isPointInPath(x2, y2) || context.isPointInPath(x3, y3)) {
                if (sendNotification && cars[input1].move) {
                    notify("#canvas-notifier", formatJSString(getString("appScreenObjectHasCrashed", "."), getString(["appScreenCarNames", input1]), getString(["appScreenCarNames", i])), NotificationPriority.Default, 2000, null, null, client.y + menus.outerContainer.height);
                }
                collision = true;
                cars[input1].move = cars[input1].backToInit = false;
                cars[input1].backwardsState = 0;
            }
            context.restore();
        }
    }
    context.restore();
    return collision;
}
function drawObjects() {
    var _a, _b, _c, _d;
    function setMaterialTransparent(mesh, opacity) {
        if (mesh.material && opacity && opacity >= 0 && opacity <= 1) {
            if (!mesh.material.opacityOriginal) {
                mesh.material.opacityOriginal = mesh.material.opacity;
            }
            var transparentOriginal = mesh.material.transparent;
            mesh.material.opacity = mesh.material.opacityOriginal * opacity;
            mesh.material.transparent = mesh.material.opacity < 1;
            mesh.material.needsUpdate = mesh.material.transparent != transparentOriginal;
        }
        if (mesh.children) {
            mesh.children.forEach(function (child) {
                setMaterialTransparent(child, opacity);
            });
        }
    }
    function drawTrains(input1) {
        function drawTrain(i) {
            var _a, _b, _c, _d;
            var currentObject = i < 0 ? trains[input1] : trains[input1].cars[i];
            var flickerDuration = 3;
            var flickerZoom = 1.01;
            if (frameNo <= trains[input1].lastDirectionChange + flickerDuration * 6 && !trains[input1].move && Math.random() > 0.7 && (i < 0 || i == trains[input1].cars.length - 1)) {
                context.save();
                context.translate(currentObject.x, currentObject.y);
                context.rotate(currentObject.displayAngle);
                context.strokeStyle = "rgba(255,255,224," + (client.isSmall ? 1 : 0.5) + ")";
                context.lineWidth = client.isTiny ? 1 : 3;
                if (i == -1 && trains[input1].standardDirection) {
                    if (trains[input1].flickerFacFront == undefined) {
                        trains[input1].flickerFacFront = 2;
                    }
                    if (trains[input1].flickerFacFrontOffset == undefined) {
                        trains[input1].flickerFacFrontOffset = 3.5;
                    }
                    context.beginPath();
                    context.moveTo(currentObject.width / trains[input1].flickerFacFront + background.width / 500, -currentObject.height / trains[input1].flickerFacFrontOffset);
                    context.lineTo(currentObject.width / trains[input1].flickerFacFront, -currentObject.height / 4);
                    context.moveTo(currentObject.width / trains[input1].flickerFacFront + background.width / 500, currentObject.height / trains[input1].flickerFacFrontOffset);
                    context.lineTo(currentObject.width / trains[input1].flickerFacFront, currentObject.height / 4);
                    context.stroke();
                    context.closePath();
                }
                if (i == trains[input1].cars.length - 1 && !trains[input1].standardDirection) {
                    if (trains[input1].flickerFacBack == undefined) {
                        trains[input1].flickerFacBack = 2;
                    }
                    if (trains[input1].flickerFacBackOffset == undefined) {
                        trains[input1].flickerFacBackOffset = 3.5;
                    }
                    context.beginPath();
                    context.moveTo(-currentObject.width / trains[input1].flickerFacBack - background.width / 500, -currentObject.height / trains[input1].flickerFacBackOffset);
                    context.lineTo(-currentObject.width / trains[input1].flickerFacBack, -currentObject.height / 4);
                    context.moveTo(-currentObject.width / trains[input1].flickerFacBack - background.width / 500, currentObject.height / trains[input1].flickerFacBackOffset);
                    context.lineTo(-currentObject.width / trains[input1].flickerFacBack, currentObject.height / 4);
                    context.stroke();
                    context.closePath();
                }
                context.restore();
            }
            if (((_b = (_a = currentObject.wheels) === null || _a === void 0 ? void 0 : _a.front) === null || _b === void 0 ? void 0 : _b.src2d) && konamiState >= 0) {
                var wheelWidthFront = currentObject.width * (pics[currentObject.wheels.front.src2d].width / pics[currentObject.src].width);
                var wheelHeightFront = currentObject.height * (pics[currentObject.wheels.front.src2d].height / pics[currentObject.src].height);
                context.save();
                context.translate(currentObject.wheels.front.leftX, currentObject.wheels.front.leftY);
                if (frameNo <= trains[input1].lastDirectionChange + flickerDuration * 3 && (frameNo <= trains[input1].lastDirectionChange + flickerDuration || frameNo > trains[input1].lastDirectionChange + flickerDuration * 2)) {
                    var xMove = currentObject.wheels.moveX * (flickerZoom - 1);
                    var yMove = currentObject.wheels.moveY * (flickerZoom - 1);
                    context.translate(xMove * Math.sin(Math.PI / 2 - currentObject.displayAngle) - yMove * Math.cos(-Math.PI / 2 - currentObject.displayAngle), xMove * Math.cos(Math.PI / 2 - currentObject.displayAngle) + yMove * Math.sin(-Math.PI / 2 - currentObject.displayAngle));
                }
                context.rotate(currentObject.front.angle);
                if (currentObject.assetFlip) {
                    context.scale(-1, 1);
                }
                if (frameNo <= trains[input1].lastDirectionChange + flickerDuration * 3 && (frameNo <= trains[input1].lastDirectionChange + flickerDuration || frameNo > trains[input1].lastDirectionChange + flickerDuration * 2)) {
                    context.scale(flickerZoom, flickerZoom);
                }
                drawImage(pics[currentObject.wheels.front.src2d], -wheelWidthFront / 2, -wheelHeightFront / 2, wheelWidthFront, wheelHeightFront);
                context.restore();
                context.save();
                context.translate(currentObject.wheels.front.rightX, currentObject.wheels.front.rightY);
                if (frameNo <= trains[input1].lastDirectionChange + flickerDuration * 3 && (frameNo <= trains[input1].lastDirectionChange + flickerDuration || frameNo > trains[input1].lastDirectionChange + flickerDuration * 2)) {
                    var xMove = currentObject.wheels.moveX * (flickerZoom - 1);
                    var yMove = -currentObject.wheels.moveY * (flickerZoom - 1);
                    context.translate(xMove * Math.sin(Math.PI / 2 - currentObject.displayAngle) - yMove * Math.cos(-Math.PI / 2 - currentObject.displayAngle), xMove * Math.cos(Math.PI / 2 - currentObject.displayAngle) + yMove * Math.sin(-Math.PI / 2 - currentObject.displayAngle));
                }
                context.rotate(currentObject.front.angle);
                if (currentObject.assetFlip) {
                    context.scale(-1, 1);
                }
                context.scale(1, -1);
                if (frameNo <= trains[input1].lastDirectionChange + flickerDuration * 3 && (frameNo <= trains[input1].lastDirectionChange + flickerDuration || frameNo > trains[input1].lastDirectionChange + flickerDuration * 2)) {
                    context.scale(flickerZoom, flickerZoom);
                }
                drawImage(pics[currentObject.wheels.front.src2d], -wheelWidthFront / 2, 0, wheelWidthFront, wheelHeightFront);
                context.restore();
            }
            if (((_d = (_c = currentObject.wheels) === null || _c === void 0 ? void 0 : _c.back) === null || _d === void 0 ? void 0 : _d.src2d) && konamiState >= 0) {
                var wheelWidthBack = currentObject.width * (pics[currentObject.wheels.back.src2d].width / pics[currentObject.src].width);
                var wheelHeightBack = currentObject.height * (pics[currentObject.wheels.back.src2d].height / pics[currentObject.src].height);
                context.save();
                context.translate(currentObject.wheels.back.leftX, currentObject.wheels.back.leftY);
                if (frameNo <= trains[input1].lastDirectionChange + flickerDuration * 3 && (frameNo <= trains[input1].lastDirectionChange + flickerDuration || frameNo > trains[input1].lastDirectionChange + flickerDuration * 2)) {
                    var xMove = -currentObject.wheels.moveX * (flickerZoom - 1);
                    var yMove = currentObject.wheels.moveY * (flickerZoom - 1);
                    context.translate(xMove * Math.sin(Math.PI / 2 - currentObject.displayAngle) - yMove * Math.cos(-Math.PI / 2 - currentObject.displayAngle), xMove * Math.cos(Math.PI / 2 - currentObject.displayAngle) + yMove * Math.sin(-Math.PI / 2 - currentObject.displayAngle));
                }
                context.rotate(currentObject.back.angle);
                if (currentObject.assetFlip) {
                    context.scale(-1, 1);
                }
                if (frameNo <= trains[input1].lastDirectionChange + flickerDuration * 3 && (frameNo <= trains[input1].lastDirectionChange + flickerDuration || frameNo > trains[input1].lastDirectionChange + flickerDuration * 2)) {
                    context.scale(flickerZoom, flickerZoom);
                }
                drawImage(pics[currentObject.wheels.back.src2d], -wheelWidthBack / 2, -wheelHeightBack / 2, wheelWidthBack, wheelHeightBack);
                context.restore();
                context.save();
                context.translate(currentObject.wheels.back.rightX, currentObject.wheels.back.rightY);
                if (frameNo <= trains[input1].lastDirectionChange + flickerDuration * 3 && (frameNo <= trains[input1].lastDirectionChange + flickerDuration || frameNo > trains[input1].lastDirectionChange + flickerDuration * 2)) {
                    var xMove = -currentObject.wheels.moveX * (flickerZoom - 1);
                    var yMove = -currentObject.wheels.moveY * (flickerZoom - 1);
                    context.translate(xMove * Math.sin(Math.PI / 2 - currentObject.displayAngle) - yMove * Math.cos(-Math.PI / 2 - currentObject.displayAngle), xMove * Math.cos(Math.PI / 2 - currentObject.displayAngle) + yMove * Math.sin(-Math.PI / 2 - currentObject.displayAngle));
                }
                context.rotate(currentObject.back.angle);
                if (currentObject.assetFlip) {
                    context.scale(-1, 1);
                }
                context.scale(1, -1);
                if (frameNo <= trains[input1].lastDirectionChange + flickerDuration * 3 && (frameNo <= trains[input1].lastDirectionChange + flickerDuration || frameNo > trains[input1].lastDirectionChange + flickerDuration * 2)) {
                    context.scale(flickerZoom, flickerZoom);
                }
                drawImage(pics[currentObject.wheels.back.src2d], -wheelWidthBack / 2, 0, wheelWidthBack, wheelHeightBack);
                context.restore();
            }
            context.save();
            context.translate(currentObject.x, currentObject.y);
            context.rotate(currentObject.displayAngle);
            context.save();
            if (currentObject.assetFlip) {
                context.scale(-1, 1);
            }
            if (konamiState < 0) {
                context.scale(-1, 1);
                context.textAlign = "center";
                var icon = i == -1 || ("konamiUseTrainIcon" in currentObject && currentObject.konamiUseTrainIcon) ? getString(["appScreenTrainIcons", input1]) : getString("appScreenTrainCarIcon");
                context.font = measureFontSize(icon, "sans-serif", 100, currentObject.width, 5, currentObject.width / 100);
                context.fillStyle = "white";
                context.scale(1, currentObject.height / getFontSize(context.font, "px"));
                context.fillText(icon, 0, 0);
            }
            else {
                if (frameNo <= trains[input1].lastDirectionChange + flickerDuration * 3 && (frameNo <= trains[input1].lastDirectionChange + flickerDuration || frameNo > trains[input1].lastDirectionChange + flickerDuration * 2)) {
                    context.scale(flickerZoom, flickerZoom);
                }
                drawImage(pics[currentObject.src], -currentObject.width / 2, -currentObject.height / 2, currentObject.width, currentObject.height);
            }
            context.restore();
            if (gui.infoOverlay && i == -1 && (menus.infoOverlay.focus == undefined || menus.infoOverlay.focus == 1)) {
                contextForeground.save();
                contextForeground.translate(currentObject.x, currentObject.y);
                var textWidth = background.width / 100;
                contextForeground.beginPath();
                contextForeground.fillStyle = "#42bb20";
                contextForeground.strokeStyle = "darkgreen";
                contextForeground.arc(0, 0, textWidth * 1.1 * menus.infoOverlay.scaleFac, 0, 2 * Math.PI);
                contextForeground.fill();
                contextForeground.stroke();
                contextForeground.font = measureFontSize("1", "monospace", 100, textWidth, 5, textWidth / 10);
                contextForeground.fillStyle = "black";
                contextForeground.textAlign = "center";
                contextForeground.textBaseline = "middle";
                var metrics = contextForeground.measureText("1");
                if (metrics.actualBoundingBoxAscent != undefined && metrics.actualBoundingBoxDescent != undefined) {
                    contextForeground.fillText("1", 0, (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2);
                }
                else {
                    contextForeground.fillText("1", 0, 0);
                }
                contextForeground.restore();
            }
            context.beginPath();
            context.rect(-currentObject.width / 2, -currentObject.height / 2, currentObject.width, currentObject.height);
            if (context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && !hardware.mouse.isDrag) {
                hardware.mouse.cursor = "pointer";
            }
            if (context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && hardware.mouse.isHold) {
                inTrain = true;
                if (hardware.lastInputTouch < hardware.lastInputMouse) {
                    hardware.mouse.isHold = false;
                }
                if ((hardware.lastInputTouch < hardware.lastInputMouse && hardware.mouse.downTime - hardware.mouse.upTime > 0 && context.isPointInPath(hardware.mouse.upX, hardware.mouse.upY) && context.isPointInPath(hardware.mouse.downX, hardware.mouse.downY) && hardware.mouse.downTime - hardware.mouse.upTime < doubleClickTime && !hardware.mouse.lastClickDoubleClick) || (hardware.lastInputTouch > hardware.lastInputMouse && context.isPointInPath(hardware.mouse.downX, hardware.mouse.downY) && Date.now() - hardware.mouse.downTime > longTouchTime)) {
                    if (clickTimeOut !== undefined && clickTimeOut !== null) {
                        clearTimeout(clickTimeOut);
                        clickTimeOut = null;
                    }
                    if (hardware.lastInputTouch > hardware.lastInputMouse) {
                        hardware.mouse.isHold = false;
                    }
                    else {
                        hardware.mouse.lastClickDoubleClick = true;
                    }
                    if (trains[input1].accelerationSpeed <= 0 && Math.abs(trains[input1].accelerationSpeed) < 0.2) {
                        trainActions.changeDirection(input1, true);
                    }
                }
                else {
                    if (clickTimeOut !== undefined && clickTimeOut !== null) {
                        clearTimeout(clickTimeOut);
                        clickTimeOut = null;
                    }
                    clickTimeOut = setTimeout(function () {
                        clickTimeOut = null;
                        if (hardware.lastInputTouch > hardware.lastInputMouse) {
                            hardware.mouse.isHold = false;
                        }
                        if (!trains[input1].crash) {
                            if (trains[input1].move && trains[input1].accelerationSpeed > 0) {
                                trainActions.stop(input1);
                            }
                            else {
                                trainActions.start(input1, 50);
                            }
                        }
                    }, hardware.lastInputTouch > hardware.lastInputMouse ? longTouchWaitTime : doubleClickWaitTime);
                }
            }
            context.restore();
        }
        for (var i = -1; i < trains[input1].cars.length; i++) {
            drawTrain(i);
        }
    }
    function trainInTrackElement(state) {
        for (var i_1 = 0; i_1 < trains.length; i_1++) {
            if ((trains[i_1].front.state == state || trains[i_1].back.state == state) && trains[i_1].opacity < 1) {
                return true;
            }
            for (var j = 0; j < trains[i_1].cars.length; j++) {
                if ((trains[i_1].cars[j].front.state == state || trains[i_1].cars[j].back.state == state) && trains[i_1].cars[j].opacity < 1) {
                    return true;
                }
            }
        }
        return false;
    }
    function drawContinueTrackElement(group, geometry, corrFac) {
        var material = new THREE.LineBasicMaterial({ color: three.night ? 0x541e03 : 0x963c0e });
        var objectA = new THREE.Line(geometry, material);
        objectA.translateX((-corrFac * background.width) / 990000);
        objectA.translateY(-background.width / 990000);
        objectA.translateZ(-background.width / 1000000);
        group.add(objectA);
        var objectB = new THREE.Line(geometry, material);
        objectB.translateX((corrFac * background.width) / 990000);
        objectB.translateY(background.width / 990000);
        objectB.translateZ(-background.width / 1000000);
        group.add(objectB);
    }
    function drawContinueTrackLine(group, lineName, corrFac) {
        if (corrFac === void 0) { corrFac = 1; }
        var points = [];
        points.push(new THREE.Vector3(three.calcScale() * ((rotationPoints.outer.rightSiding[lineName].x[0] - background.width / 2) / background.width), three.calcScale() * (-(rotationPoints.outer.rightSiding[lineName].y[0] - background.height / 2) / background.width) + three.calcPositionY(), -0));
        points.push(new THREE.Vector3(three.calcScale() * ((rotationPoints.outer.rightSiding[lineName].x[1] - background.width / 2) / background.width), three.calcScale() * (-(rotationPoints.outer.rightSiding[lineName].y[1] - background.height / 2) / background.width) + three.calcPositionY(), -0));
        drawContinueTrackElement(group, new THREE.BufferGeometry().setFromPoints(points), corrFac);
    }
    function drawContinueTrackCurve(group, curveName, corrFac) {
        if (corrFac === void 0) { corrFac = 1; }
        var curve = new THREE.CubicBezierCurve3(new THREE.Vector3(three.calcScale() * ((rotationPoints.outer.rightSiding[curveName].x[0] - background.width / 2) / background.width), three.calcScale() * (-(rotationPoints.outer.rightSiding[curveName].y[0] - background.height / 2) / background.width) + three.calcPositionY(), -0), new THREE.Vector3(three.calcScale() * ((rotationPoints.outer.rightSiding[curveName].x[1] - background.width / 2) / background.width), three.calcScale() * (-(rotationPoints.outer.rightSiding[curveName].y[1] - background.height / 2) / background.width) + three.calcPositionY(), -0), new THREE.Vector3(three.calcScale() * ((rotationPoints.outer.rightSiding[curveName].x[2] - background.width / 2) / background.width), three.calcScale() * (-(rotationPoints.outer.rightSiding[curveName].y[2] - background.height / 2) / background.width) + three.calcPositionY(), -0), new THREE.Vector3(three.calcScale() * ((rotationPoints.outer.rightSiding[curveName].x[3] - background.width / 2) / background.width), three.calcScale() * (-(rotationPoints.outer.rightSiding[curveName].y[3] - background.height / 2) / background.width) + three.calcPositionY(), -0));
        var points = curve.getPoints(30);
        drawContinueTrackElement(group, new THREE.BufferGeometry().setFromPoints(points), corrFac);
    }
    function calcCars() {
        function calcCarsAutoMode() {
            function carAutoModeIsFutureCollision(i, k, stop, j) {
                if (stop === void 0) { stop = -1; }
                if (j === void 0) { j = 0; }
                context.save();
                context.setTransform(1, 0, 0, 1, 0, 0);
                var coll = false;
                var jmax = false;
                var m = j;
                var n = j;
                if (m >= points.angle[i].length - 1 || n >= points.angle[k].length - 1) {
                    m = n = j = points.angle[i].length - 1;
                    jmax = true;
                }
                if (stop > -1) {
                    m = stop == i ? 0 : m;
                    n = stop == k ? 0 : n;
                }
                else {
                    n = cCars[k].collStop ? 0 : n;
                }
                var sizeNo = 1.06;
                var x1 = points.x[i][m] + ((carParams.isBackToRoot ? -1 : 1) * Math.sin(Math.PI / 2 - points.angle[i][m]) * cCars[i].width) / 2 + (Math.cos(-Math.PI / 2 - points.angle[i][m]) * cCars[i].height) / 2;
                var x2 = points.x[i][m] + ((carParams.isBackToRoot ? -1 : 1) * Math.sin(Math.PI / 2 - points.angle[i][m]) * cCars[i].width) / 2 - (Math.cos(-Math.PI / 2 - points.angle[i][m]) * cCars[i].height) / 2;
                var x3 = points.x[i][m] + ((carParams.isBackToRoot ? -1 : 1) * Math.sin(Math.PI / 2 - points.angle[i][m]) * cCars[i].width) / 2;
                var y1 = points.y[i][m] + ((carParams.isBackToRoot ? -1 : 1) * Math.cos(Math.PI / 2 - points.angle[i][m]) * cCars[i].width) / 2 - (Math.sin(-Math.PI / 2 - points.angle[i][m]) * cCars[i].height) / 2;
                var y2 = points.y[i][m] + ((carParams.isBackToRoot ? -1 : 1) * Math.cos(Math.PI / 2 - points.angle[i][m]) * cCars[i].width) / 2 + (Math.sin(-Math.PI / 2 - points.angle[i][m]) * cCars[i].height) / 2;
                var y3 = points.y[i][m] + ((carParams.isBackToRoot ? -1 : 1) * Math.cos(Math.PI / 2 - points.angle[i][m]) * cCars[i].width) / 2;
                context.translate(points.x[k][n], points.y[k][n]);
                context.rotate(points.angle[k][n]);
                context.beginPath();
                context.rect((-sizeNo * cCars[k].width) / 2, (-sizeNo * cCars[carParams.thickestCar].height) / 2, sizeNo * cCars[k].width, sizeNo * cCars[carParams.thickestCar].height);
                if (context.isPointInPath(x1, y1) || context.isPointInPath(x2, y2) || context.isPointInPath(x3, y3)) {
                    coll = true;
                }
                context.restore();
                return coll ? j : jmax ? -1 : carAutoModeIsFutureCollision(i, k, stop, ++j);
            }
            if (carParams.autoModeInit) {
                for (var i = 0; i < cars.length; i++) {
                    cars[i].parking = false;
                }
                carParams.autoModeInit = false;
            }
            var points = { x: [], y: [], angle: [] };
            var arrLen = carParams.wayNo * 23;
            var abstrNo = Math.ceil(arrLen * 0.05);
            var cCars = copyJSObject(cars);
            for (var i = 0; i < cCars.length; i++) {
                cCars[i].move = false;
                cCars[i].backwardsState = 0;
                cCars[i].collStop = false;
                var counter = cCars[i].counter;
                var cAbstrNo = Math.round((cCars[i].speed / cCars[carParams.lowestSpeedNo].speed) * abstrNo);
                var countJ = 0;
                points.x[i] = [];
                points.y[i] = [];
                points.angle[i] = [];
                if (APP_DATA.debug && debug.paint) {
                    context.save();
                    context.beginPath();
                    context.strokeStyle = "rgb(" + Math.floor((i / carWays.length) * 255) + ",0,0)";
                    context.lineWidth = 1;
                    context.moveTo(background.x + carWays[i][cCars[i].cType][counter].x, background.y + carWays[i][cCars[i].cType][counter].y);
                }
                if (carParams.isBackToRoot) {
                    for (var j = arrLen - 1; j >= 0; j -= cAbstrNo) {
                        points.x[i][countJ] = carWays[i][cCars[i].cType][counter].x;
                        points.y[i][countJ] = carWays[i][cCars[i].cType][counter].y;
                        points.angle[i][countJ] = carWays[i][cCars[i].cType][counter].angle;
                        if (APP_DATA.debug && debug.paint) {
                            context.lineTo(background.x + points.x[i][countJ], background.y + points.y[i][countJ]);
                        }
                        countJ++;
                        if (cCars[i].cType == "normal" && counter - cAbstrNo < 0) {
                            cCars[i].cType = "start";
                        }
                        else if (cCars[i].cType == "start" && counter - cAbstrNo < cCars[i].startFrame) {
                            counter = cCars[i].startFrame;
                        }
                        counter = counter - cAbstrNo < 0 ? carWays[i][cCars[i].cType].length - 1 + (counter - cAbstrNo) : counter - cAbstrNo;
                    }
                }
                else {
                    for (var j = 0; j < arrLen; j += cAbstrNo) {
                        points.x[i][countJ] = carWays[i][cCars[i].cType][counter].x;
                        points.y[i][countJ] = carWays[i][cCars[i].cType][counter].y;
                        points.angle[i][countJ] = carWays[i][cCars[i].cType][counter].angle;
                        if (APP_DATA.debug && debug.paint) {
                            context.lineTo(background.x + points.x[i][countJ], background.y + points.y[i][countJ]);
                        }
                        countJ++;
                        if (cCars[i].cType == "start" && counter + cAbstrNo > carWays[i][cCars[i].cType].length - 1) {
                            cCars[i].cType = "normal";
                            counter = 0;
                        }
                        counter = counter + cAbstrNo > carWays[i][cCars[i].cType].length - 1 ? counter + cAbstrNo - (carWays[i][cCars[i].cType].length - 1) : counter + cAbstrNo;
                    }
                }
                if (APP_DATA.debug && debug.paint) {
                    context.stroke();
                    context.restore();
                }
                cCars[i].cType = cars[i].cType;
            }
            var change;
            var changeNum = 0;
            do {
                change = false;
                changeNum++;
                for (var i = 0; i < cCars.length; i++) {
                    for (var k = 0; k < cCars.length; k++) {
                        if (i != k && !cCars[i].collStop && !cCars[i].parking) {
                            cCars[i].collStopNo[k] = carAutoModeIsFutureCollision(i, k);
                        }
                    }
                }
                for (var i = 0; i < cCars.length; i++) {
                    for (var k = 0; k < cCars.length; k++) {
                        if (i != k && !cCars[i].collStop) {
                            var a = cCars[i].collStopNo[k] / cCars[i].speed;
                            var b = cCars[i].collStopNo[k] / cCars[k].speed;
                            var isA;
                            if (cars[i].collStopNo[k] == -2) {
                                isA = true;
                            }
                            else if (cars[k].collStopNo[i] == -2) {
                                isA = false;
                            }
                            else {
                                isA = a < b;
                            }
                            if (isA) {
                                if (carAutoModeIsFutureCollision(i, k, i) > -1) {
                                    isA = false;
                                }
                            }
                            else {
                                if (carAutoModeIsFutureCollision(k, i, k) > -1) {
                                    isA = true;
                                }
                            }
                            if (isA && cCars[k].collStopNo[i] > -2 && cCars[i].collStopNo[k] > -1) {
                                cCars[i].collStop = !cCars[k].parking;
                                cCars[i].collStopNo[k] = -2;
                                change = true;
                            }
                            else if (!isA && cCars[i].collStopNo[k] > -2 && cCars[k].collStopNo[i] > -1) {
                                cCars[k].collStop = !cCars[i].parking;
                                cCars[k].collStopNo[i] = -2;
                                change = true;
                            }
                        }
                    }
                }
            } while (change && changeNum < Math.pow(cCars.length, cCars.length));
            cars = cCars;
            for (var i = 0; i < cCars.length; i++) {
                for (var k = 0; k < cCars.length; k++) {
                    if (i != k && carCollisionCourse(i, false) && carCollisionCourse(k, false)) {
                        if (currentMode == Modes.DEMO) {
                            sessionStorage.removeItem("demoCars");
                            sessionStorage.removeItem("demoCarParams");
                            sessionStorage.removeItem("demoBg");
                        }
                        else {
                            notify("#canvas-notifier", getString("appScreenCarAutoModeCrash", "."), NotificationPriority.High, 5000, null, null, client.height);
                        }
                        carParams.autoModeOff = true;
                        carParams.autoModeRuns = false;
                    }
                }
            }
            var collStopQuantity = 0;
            cars.forEach(function (car) {
                if (car.collStop && car.cType == "normal") {
                    collStopQuantity++;
                }
            });
            if (collStopQuantity == cars.length) {
                if (currentMode == Modes.DEMO) {
                    sessionStorage.removeItem("demoCars");
                    sessionStorage.removeItem("demoCarParams");
                    sessionStorage.removeItem("demoBg");
                }
                else {
                    notify("#canvas-notifier", getString("appScreenCarAutoModeCrash", "."), NotificationPriority.High, 5000, null, null, client.height);
                }
                carParams.autoModeOff = true;
                carParams.autoModeRuns = false;
            }
        }
        function calcCar(input1) {
            var currentObject = cars[input1];
            carCollisionCourse(input1, true);
            if (carParams.autoModeRuns) {
                var counter = carParams.isBackToRoot ? (currentObject.counter - 1 < 0 ? carWays[input1][currentObject.cType].length - 1 : currentObject.counter - 1) : currentObject.counter + 1 > carWays[input1][currentObject.cType].length - 1 ? 0 : currentObject.counter + 1;
                if (!carParams.isBackToRoot && counter === 0 && currentObject.cType == "start") {
                    currentObject.cType = "normal";
                }
                else if (carParams.isBackToRoot && currentObject.cType == "normal" && (counter === 0 || carWays[input1][currentObject.cType][counter].shortcutToParking)) {
                    currentObject.counter = counter = carWays[input1].start.length - 1;
                    currentObject.cType = "start";
                }
                else if (carParams.isBackToRoot && counter <= currentObject.startFrame && currentObject.cType == "start") {
                    currentObject.parking = true;
                    currentObject.counter = counter = currentObject.startFrame;
                    var allParking = true;
                    Object.keys(cars).forEach(function (cCar) {
                        if (!cars[cCar].parking || cars[cCar].counter != cars[cCar].startFrame) {
                            allParking = false;
                        }
                    });
                    carParams.autoModeOff = carParams.init = allParking;
                    carParams.autoModeRuns = carParams.isBackToRoot = !allParking;
                }
                currentObject.counter = currentObject.collStop || currentObject.parking ? currentObject.counter : counter;
                currentObject.x = carWays[input1][currentObject.cType][currentObject.counter].x;
                currentObject.y = carWays[input1][currentObject.cType][currentObject.counter].y;
                currentObject.displayAngle = carWays[input1][currentObject.cType][currentObject.counter].angle;
            }
            else if (currentObject.move) {
                if (currentObject.cType == "start") {
                    currentObject.counter = currentObject.backToInit || currentObject.backwardsState > 0 ? (--currentObject.counter < cars[input1].startFrame ? cars[input1].startFrame : currentObject.counter) : ++currentObject.counter > carWays[input1].start.length - 1 ? 0 : currentObject.counter;
                    if (currentObject.counter === 0) {
                        currentObject.cType = "normal";
                    }
                    else if (currentObject.counter == currentObject.startFrame) {
                        currentObject.parking = true;
                        currentObject.backToInit = false;
                        currentObject.backwardsState = 0;
                        currentObject.move = false;
                        if (!carParams.autoModeInit) {
                            var allParking = true;
                            Object.keys(cars).forEach(function (cCar) {
                                if (!cars[cCar].parking || cars[cCar].counter != cars[cCar].startFrame) {
                                    allParking = false;
                                }
                            });
                            carParams.init = allParking;
                        }
                    }
                }
                else if (currentObject.cType == "normal") {
                    currentObject.counter = currentObject.backToInit || currentObject.backwardsState > 0 ? (--currentObject.counter < 0 ? carWays[input1].normal.length - 1 : currentObject.counter) : ++currentObject.counter > carWays[input1].normal.length - 1 ? 0 : currentObject.counter;
                    if (currentObject.backToInit && (currentObject.counter === 0 || carWays[input1][currentObject.cType][currentObject.counter].shortcutToParking)) {
                        currentObject.counter = carWays[input1].start.length - 1;
                        currentObject.cType = "start";
                    }
                }
                currentObject.backwardsState *= 1 - (currentObject.speed / background.width) * 100;
                if (currentObject.backwardsState <= 0.1 && currentObject.backwardsState > 0) {
                    currentObject.backwardsState = 0;
                    currentObject.move = false;
                }
                currentObject.x = carWays[input1][currentObject.cType][currentObject.counter].x;
                currentObject.y = carWays[input1][currentObject.cType][currentObject.counter].y;
                currentObject.displayAngle = carWays[input1][currentObject.cType][currentObject.counter].angle;
            }
            var isFront = (!carParams.autoModeOff && !carParams.isBackToRoot) || (carParams.autoModeOff && !currentObject.backToInit && (currentObject.backwardsState === undefined || currentObject.backwardsState === 0));
            currentObject.outerX = currentObject.x + Math.cos(currentObject.displayAngle) * ((currentObject.width * 1.05) / 2) * (isFront ? 1 : -1);
            currentObject.outerY = currentObject.y + Math.sin(currentObject.displayAngle) * ((currentObject.width * 1.05) / 2) * (isFront ? 1 : -1);
        }
        if ((carParams.autoModeRuns && frameNo % carParams.wayNo === 0) || carParams.autoModeInit) {
            calcCarsAutoMode();
        }
        for (var i = 0; i < cars.length; i++) {
            calcCar(i);
        }
    }
    function drawCar(input1) {
        var currentObject = cars[input1];
        context.save();
        context.translate(background.x, background.y);
        context.translate(currentObject.x, currentObject.y);
        context.rotate(currentObject.displayAngle);
        var flickerDuration = 4;
        if (konamiState < 0) {
            context.scale(-1, 1);
            context.textAlign = "center";
            var icon = getString(["appScreenCarIcons", input1]);
            context.font = measureFontSize(icon, "sans-serif", 100, currentObject.width, 5, currentObject.width / 100);
            context.fillStyle = "white";
            context.scale(1, currentObject.height / getFontSize(context.font, "px"));
            context.fillText(icon, 0, 0);
        }
        else if (frameNo <= currentObject.lastDirectionChange + flickerDuration * 3 && (frameNo <= currentObject.lastDirectionChange + flickerDuration || frameNo > currentObject.lastDirectionChange + flickerDuration * 2)) {
            drawImage(pics[currentObject.src], (-currentObject.width * 1.03) / 2, (-currentObject.height * 1.03) / 2, currentObject.width * 1.03, currentObject.height * 1.03);
        }
        else {
            drawImage(pics[currentObject.src], -currentObject.width / 2, -currentObject.height / 2, currentObject.width, currentObject.height);
        }
        context.beginPath();
        context.rect(-currentObject.width / 2, -currentObject.height / 2, currentObject.width, currentObject.height);
        if (context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && !hardware.mouse.isDrag) {
            hardware.mouse.cursor = "pointer";
        }
        if (context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && hardware.mouse.isHold) {
            if (hardware.lastInputTouch < hardware.lastInputMouse) {
                hardware.mouse.isHold = false;
            }
            if ((hardware.lastInputTouch < hardware.lastInputMouse && hardware.mouse.downTime - hardware.mouse.upTime > 0 && context.isPointInPath(hardware.mouse.upX, hardware.mouse.upY) && context.isPointInPath(hardware.mouse.downX, hardware.mouse.downY) && hardware.mouse.downTime - hardware.mouse.upTime < doubleClickTime && !hardware.mouse.lastClickDoubleClick) || (hardware.lastInputTouch > hardware.lastInputMouse && context.isPointInPath(hardware.mouse.downX, hardware.mouse.downY) && Date.now() - hardware.mouse.downTime > longTouchTime)) {
                if (clickTimeOut !== undefined && clickTimeOut !== null) {
                    clearTimeout(clickTimeOut);
                    clickTimeOut = null;
                }
                if (hardware.lastInputTouch > hardware.lastInputMouse) {
                    hardware.mouse.isHold = false;
                }
                else {
                    hardware.mouse.lastClickDoubleClick = true;
                }
                if (carParams.init) {
                    carActions.auto.start();
                }
                else if (carParams.autoModeOff && !currentObject.move && currentObject.backwardsState === 0) {
                    carActions.manual.backwards(input1);
                }
            }
            else {
                if (clickTimeOut !== undefined && clickTimeOut !== null) {
                    clearTimeout(clickTimeOut);
                    clickTimeOut = null;
                }
                clickTimeOut = setTimeout(function () {
                    clickTimeOut = null;
                    if (hardware.lastInputTouch > hardware.lastInputMouse) {
                        hardware.mouse.isHold = false;
                    }
                    if (!carCollisionCourse(input1, false)) {
                        if (carParams.autoModeRuns) {
                            carActions.auto.pause();
                        }
                        else if (carParams.init || carParams.autoModeOff) {
                            if (currentObject.move) {
                                carActions.manual.stop(input1);
                            }
                            else {
                                carActions.manual.start(input1);
                            }
                        }
                        else {
                            carActions.auto.resume();
                        }
                    }
                }, hardware.lastInputTouch > hardware.lastInputMouse ? longTouchWaitTime : doubleClickWaitTime);
            }
        }
        context.restore();
        if (!currentObject.parking && !currentObject.move && !carParams.autoModeRuns && !carParams.isBackToRoot && !carCollisionCourse(input1, false, -1)) {
            context.save();
            context.translate(background.x + carWays[input1].start[currentObject.startFrame].x, background.y + carWays[input1].start[currentObject.startFrame].y);
            context.rotate(carWays[input1].start[currentObject.startFrame].angle);
            context.beginPath();
            context.rect(-currentObject.width / 2, -currentObject.height / 2, currentObject.width, currentObject.height);
            if (context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && !hardware.mouse.isDrag) {
                hardware.mouse.cursor = "pointer";
                if (hardware.mouse.isHold) {
                    if (clickTimeOut !== undefined && clickTimeOut !== null) {
                        clearTimeout(clickTimeOut);
                        clickTimeOut = null;
                    }
                    clickTimeOut = setTimeout(function () {
                        clickTimeOut = null;
                        hardware.mouse.isHold = false;
                        if (carParams.autoModeOff) {
                            carActions.manual.park(input1);
                        }
                        else {
                            carActions.auto.end();
                        }
                    }, hardware.lastInputTouch > hardware.lastInputMouse ? doubleTouchWaitTime : 0);
                }
            }
        }
        context.restore();
        if (APP_DATA.debug && debug.paint) {
            context.save();
            context.translate(background.x + currentObject.x, background.y + currentObject.y);
            context.rotate(currentObject.displayAngle);
            context.strokeRect(-currentObject.width / 2, -currentObject.height / 2, currentObject.width, currentObject.height);
            context.restore();
        }
        if (APP_DATA.debug && debug.paint && !carParams.autoModeRuns) {
            context.save();
            context.beginPath();
            context.strokeStyle = "rgb(" + Math.floor((input1 / carWays.length) * 255) + ",0,0)";
            context.lineWidth = 1;
            context.moveTo(background.x + carWays[input1][currentObject.cType][0].x, background.y + carWays[input1][currentObject.cType][0].y);
            for (var i = 1; i < carWays[input1][currentObject.cType].length; i += 10) {
                context.lineTo(background.x + carWays[input1][currentObject.cType][i].x, background.y + carWays[input1][currentObject.cType][i].y);
            }
            if (currentObject.cType == "normal") {
                context.lineTo(background.x + carWays[input1][currentObject.cType][0].x, background.y + carWays[input1][currentObject.cType][0].y);
            }
            context.stroke();
            context.restore();
        }
        if (gui.infoOverlay && (menus.infoOverlay.focus == undefined || menus.infoOverlay.focus == 2)) {
            contextForeground.save();
            contextForeground.translate(background.x + currentObject.x, background.y + currentObject.y);
            var textWidth = background.width / 200;
            contextForeground.beginPath();
            contextForeground.fillStyle = "#42bb20";
            contextForeground.strokeStyle = "darkgreen";
            contextForeground.arc(0, 0, textWidth * 1.1 * menus.infoOverlay.scaleFac, 0, 2 * Math.PI);
            contextForeground.fill();
            contextForeground.stroke();
            contextForeground.font = measureFontSize("2", "monospace", 100, textWidth, 5, textWidth / 10);
            contextForeground.fillStyle = "black";
            contextForeground.textAlign = "center";
            contextForeground.textBaseline = "middle";
            var metrics = contextForeground.measureText("2");
            if (metrics.actualBoundingBoxAscent != undefined && metrics.actualBoundingBoxDescent != undefined) {
                contextForeground.fillText("2", 0, (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2);
            }
            else {
                contextForeground.fillText("2", 0, 0);
            }
            contextForeground.restore();
        }
    }
    function switchesLocate(angle, radius, style) {
        contextForeground.save();
        contextForeground.rotate(angle);
        contextForeground.beginPath();
        contextForeground.moveTo(0, 0);
        contextForeground.lineTo(radius + (konamiState < 0 ? Math.random() * 0.3 * radius : 0), radius + (konamiState < 0 ? Math.random() * 0.3 * radius : 0));
        contextForeground.lineWidth = background.width / 333;
        contextForeground.strokeStyle = style;
        contextForeground.stroke();
        contextForeground.restore();
    }
    function adjustScaleX(x) {
        return ((canvas.width * client.zoomAndTilt.realScale) / 2 - canvas.width / 2) / client.zoomAndTilt.realScale + x / client.zoomAndTilt.realScale - client.zoomAndTilt.offsetX / client.zoomAndTilt.realScale;
    }
    function adjustScaleY(y) {
        return ((canvas.height * client.zoomAndTilt.realScale) / 2 - canvas.height / 2) / client.zoomAndTilt.realScale + y / client.zoomAndTilt.realScale - client.zoomAndTilt.offsetY / client.zoomAndTilt.realScale;
    }
    /////GENERAL/////
    if (modeSwitching) {
        return;
    }
    var startTime = Date.now();
    drawing = true;
    var lastClickDoubleClick = hardware.mouse.lastClickDoubleClick;
    var wasHold = hardware.mouse.isHold;
    frameNo++;
    if (frameNo % 1000000 === 0) {
        notify("#canvas-notifier", formatJSString(getString("appScreenAMillionFrames", "."), frameNo / 1000000), NotificationPriority.Default, 10000, null, null, client.y + menus.outerContainer.height);
    }
    if (client.zoomAndTilt.realScale != client.zoomAndTilt.realScaleOld || client.zoomAndTilt.offsetX != client.zoomAndTilt.offsetXOld || client.zoomAndTilt.offsetY != client.zoomAndTilt.offsetYOld) {
        client.zoomAndTilt.realScaleOld = client.zoomAndTilt.realScale;
        client.zoomAndTilt.offsetXOld = client.zoomAndTilt.offsetX;
        client.zoomAndTilt.offsetYOld = client.zoomAndTilt.offsetY;
        drawBackground();
        if (client.zoomAndTilt.realScale != 1) {
            drawMenu("hide-outer");
        }
        else if (!gui.textControl) {
            drawMenu("show");
        }
    }
    hardware.mouse.cursor = hardware.mouse.isDrag ? "move" : "default";
    if (gui.three) {
        /////THREE.JS/////
        canvasGesture.style.display = "none";
        canvasBackground.style.display = "none";
        canvas.style.display = "none";
        canvasSemiForeground.style.display = "none";
        background3D.behind.style.display = "block";
        if (background3D.behindClone) {
            background3D.behindClone.style.display = "block";
        }
        three.renderer.domElement.style.display = "block";
        contextForeground.clearRect(0, 0, canvasForeground.width, canvasForeground.height);
        contextForeground.setTransform(1, 0, 0, 1, 0, 0);
        /////THREE.JS/Background/////
        if (three.cameraMode == ThreeCameraModes.BIRDS_EYE) {
            background3D.animateBehind();
        }
    }
    else {
        canvasGesture.style.display = "";
        canvasBackground.style.display = "";
        canvas.style.display = "";
        canvasSemiForeground.style.display = "";
        background3D.behind.style.display = "none";
        if (background3D.behindClone) {
            background3D.behindClone.style.display = "none";
        }
        three.renderer.domElement.style.display = "none";
        contextForeground.clearRect(0, 0, canvasForeground.width, canvasForeground.height);
        contextForeground.setTransform(client.zoomAndTilt.realScale, 0, 0, client.zoomAndTilt.realScale, (-(client.zoomAndTilt.realScale - 1) * canvasForeground.width) / 2 + client.zoomAndTilt.offsetX, (-(client.zoomAndTilt.realScale - 1) * canvasForeground.height) / 2 + client.zoomAndTilt.offsetY);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.setTransform(client.zoomAndTilt.realScale, 0, 0, client.zoomAndTilt.realScale, (-(client.zoomAndTilt.realScale - 1) * canvas.width) / 2 + client.zoomAndTilt.offsetX, (-(client.zoomAndTilt.realScale - 1) * canvas.height) / 2 + client.zoomAndTilt.offsetY);
    }
    var deltaDiv = 80;
    if (client.zoomAndTilt.realScale > 1) {
        var deltaX = 0;
        var deltaY = 0;
        if (hardware.keyboard.keysHold["ArrowLeft"] && hardware.keyboard.keysHold["ArrowLeft"].active && !hardware.keyboard.keysHold["ArrowLeft"].ctrlKey) {
            deltaX += (canvas.width * client.zoomAndTilt.realScale) / deltaDiv;
        }
        if (hardware.keyboard.keysHold["ArrowUp"] && hardware.keyboard.keysHold["ArrowUp"].active && !hardware.keyboard.keysHold["ArrowUp"].ctrlKey) {
            deltaY += (canvas.height * client.zoomAndTilt.realScale) / deltaDiv;
        }
        if (hardware.keyboard.keysHold["ArrowRight"] && hardware.keyboard.keysHold["ArrowRight"].active && !hardware.keyboard.keysHold["ArrowRight"].ctrlKey) {
            deltaX -= (canvas.width * client.zoomAndTilt.realScale) / deltaDiv;
        }
        if (hardware.keyboard.keysHold["ArrowDown"] && hardware.keyboard.keysHold["ArrowDown"].active && !hardware.keyboard.keysHold["ArrowDown"].ctrlKey) {
            deltaY -= (canvas.height * client.zoomAndTilt.realScale) / deltaDiv;
        }
        if (deltaX != 0 || deltaY != 0) {
            getGesture({ type: "swipe", deltaX: deltaX, deltaY: deltaY });
        }
    }
    var deltaX = 0;
    var deltaY = 0;
    if (hardware.keyboard.keysHold["ArrowLeft"] && hardware.keyboard.keysHold["ArrowLeft"].active && hardware.keyboard.keysHold["ArrowLeft"].ctrlKey) {
        deltaX += canvas.width / deltaDiv;
    }
    if (hardware.keyboard.keysHold["ArrowUp"] && hardware.keyboard.keysHold["ArrowUp"].active && hardware.keyboard.keysHold["ArrowUp"].ctrlKey) {
        deltaY += canvas.height / deltaDiv;
    }
    if (hardware.keyboard.keysHold["ArrowRight"] && hardware.keyboard.keysHold["ArrowRight"].active && hardware.keyboard.keysHold["ArrowRight"].ctrlKey) {
        deltaX -= canvas.width / deltaDiv;
    }
    if (hardware.keyboard.keysHold["ArrowDown"] && hardware.keyboard.keysHold["ArrowDown"].active && hardware.keyboard.keysHold["ArrowDown"].ctrlKey) {
        deltaY -= canvas.height / deltaDiv;
    }
    if (deltaX != 0 || deltaY != 0) {
        getGesture({ type: "tilt", deltaX: deltaX, deltaY: deltaY });
    }
    /////CARS/////
    if (!onlineConnection.stop) {
        calcCars();
    }
    if (gui.three) {
        /////THREE.JS/////
        var raycasterActive = true;
        trains.forEach(function (train, i) {
            var flickerDuration = 3;
            if (trains3D[i] && trains3D[i].mesh) {
                trains3D[i].mesh.position.set((three.calcScale() * (train.x - background.x - background.width / 2)) / background.width, three.calcScale() * (-(train.y - background.y - background.height / 2) / background.width) + three.calcPositionY(), trains3D[i].positionZ);
                if (trains3D[i].meshFront) {
                    trains3D[i].meshFront.left.position.set((three.calcScale() * (train.wheels.front.leftX - background.x - background.width / 2)) / background.width, three.calcScale() * (-(train.wheels.front.leftY - background.y - background.height / 2) / background.width) + three.calcPositionY(), trains3D[i].positionZ);
                    trains3D[i].meshFront.right.position.set((three.calcScale() * (train.wheels.front.rightX - background.x - background.width / 2)) / background.width, three.calcScale() * (-(train.wheels.front.rightY - background.y - background.height / 2) / background.width) + three.calcPositionY(), trains3D[i].positionZ);
                }
                if (trains3D[i].meshBack) {
                    trains3D[i].meshBack.left.position.set((three.calcScale() * (train.wheels.back.leftX - background.x - background.width / 2)) / background.width, three.calcScale() * (-(train.wheels.back.leftY - background.y - background.height / 2) / background.width) + three.calcPositionY(), trains3D[i].positionZ);
                    trains3D[i].meshBack.right.position.set((three.calcScale() * (train.wheels.back.rightX - background.x - background.width / 2)) / background.width, three.calcScale() * (-(train.wheels.back.rightY - background.y - background.height / 2) / background.width) + three.calcPositionY(), trains3D[i].positionZ);
                }
                if (frameNo <= train.lastDirectionChange + flickerDuration * 3) {
                    var flickerRandom = (trains3D[i].positionZ / 5) * Math.random();
                    if (frameNo <= train.lastDirectionChange + flickerDuration || frameNo > train.lastDirectionChange + flickerDuration * 2) {
                        trains3D[i].mesh.position.z += flickerRandom;
                        if (trains3D[i].meshFront) {
                            trains3D[i].meshFront.left.position.z += flickerRandom;
                            trains3D[i].meshFront.right.position.z += flickerRandom;
                        }
                        if (trains3D[i].meshBack) {
                            trains3D[i].meshBack.left.position.z += flickerRandom;
                            trains3D[i].meshBack.right.position.z += flickerRandom;
                        }
                    }
                    else {
                        trains3D[i].mesh.position.z -= flickerRandom;
                        if (trains3D[i].meshFront) {
                            trains3D[i].meshFront.left.position.z -= flickerRandom;
                            trains3D[i].meshFront.right.position.z -= flickerRandom;
                        }
                        if (trains3D[i].meshBack) {
                            trains3D[i].meshBack.left.position.z -= flickerRandom;
                            trains3D[i].meshBack.right.position.z -= flickerRandom;
                        }
                    }
                }
                /* UPDATE: v9.1.5 */
                trains3D[i].mesh.visible = true;
                /* END UPDATE: v9.1.5 */
                setMaterialTransparent(trains3D[i].mesh, train.opacity);
                trains3D[i].mesh.rotation.z = -train.displayAngle;
                if (trains3D[i].meshFront) {
                    setMaterialTransparent(trains3D[i].meshFront.left, train.opacity);
                    setMaterialTransparent(trains3D[i].meshFront.right, train.opacity);
                    trains3D[i].meshFront.left.rotation.z = -train.front.angle;
                    trains3D[i].meshFront.right.rotation.z = -train.front.angle;
                }
                if (trains3D[i].meshBack) {
                    setMaterialTransparent(trains3D[i].meshBack.left, train.opacity);
                    setMaterialTransparent(trains3D[i].meshBack.right, train.opacity);
                    trains3D[i].meshBack.left.rotation.z = -train.back.angle;
                    trains3D[i].meshBack.right.rotation.z = -train.back.angle;
                }
            }
            train.cars.forEach(function (car, j) {
                if (trains3D[i].cars[j] && trains3D[i].cars[j].mesh) {
                    trains3D[i].cars[j].mesh.position.set(three.calcScale() * ((car.x - background.x - background.width / 2) / background.width), three.calcScale() * (-(car.y - background.y - background.height / 2) / background.width) + three.calcPositionY(), trains3D[i].cars[j].positionZ);
                    if (trains3D[i].cars[j].meshFront) {
                        trains3D[i].cars[j].meshFront.left.position.set((three.calcScale() * (car.wheels.front.leftX - background.x - background.width / 2)) / background.width, three.calcScale() * (-(car.wheels.front.leftY - background.y - background.height / 2) / background.width) + three.calcPositionY(), trains3D[i].cars[j].positionZ);
                        trains3D[i].cars[j].meshFront.right.position.set((three.calcScale() * (car.wheels.front.rightX - background.x - background.width / 2)) / background.width, three.calcScale() * (-(car.wheels.front.rightY - background.y - background.height / 2) / background.width) + three.calcPositionY(), trains3D[i].cars[j].positionZ);
                    }
                    if (trains3D[i].cars[j].meshBack) {
                        trains3D[i].cars[j].meshBack.left.position.set((three.calcScale() * (car.wheels.back.leftX - background.x - background.width / 2)) / background.width, three.calcScale() * (-(car.wheels.back.leftY - background.y - background.height / 2) / background.width) + three.calcPositionY(), trains3D[i].cars[j].positionZ);
                        trains3D[i].cars[j].meshBack.right.position.set((three.calcScale() * (car.wheels.back.rightX - background.x - background.width / 2)) / background.width, three.calcScale() * (-(car.wheels.back.rightY - background.y - background.height / 2) / background.width) + three.calcPositionY(), trains3D[i].cars[j].positionZ);
                    }
                    if (frameNo <= train.lastDirectionChange + flickerDuration * 3) {
                        var flickerRandom = (trains3D[i].cars[j].mesh.position.z / 5) * Math.random();
                        if (frameNo <= train.lastDirectionChange + flickerDuration || frameNo > train.lastDirectionChange + flickerDuration * 2) {
                            trains3D[i].cars[j].mesh.position.z += flickerRandom;
                            if (trains3D[i].cars[j].meshFront) {
                                trains3D[i].cars[j].meshFront.left.position.z += flickerRandom;
                                trains3D[i].cars[j].meshFront.right.position.z += flickerRandom;
                            }
                            if (trains3D[i].cars[j].meshBack) {
                                trains3D[i].cars[j].meshBack.left.position.z += flickerRandom;
                                trains3D[i].cars[j].meshBack.right.position.z += flickerRandom;
                            }
                        }
                        else {
                            trains3D[i].cars[j].mesh.position.z -= flickerRandom;
                            if (trains3D[i].cars[j].meshFront) {
                                trains3D[i].cars[j].meshFront.left.position.z -= flickerRandom;
                                trains3D[i].cars[j].meshFront.right.position.z -= flickerRandom;
                            }
                            if (trains3D[i].cars[j].meshBack) {
                                trains3D[i].cars[j].meshBack.left.position.z -= flickerRandom;
                                trains3D[i].cars[j].meshBack.right.position.z -= flickerRandom;
                            }
                        }
                    }
                    /* UPDATE: v9.1.5 */
                    trains3D[i].cars[j].mesh.visible = true;
                    /* END UPDATE: v9.1.5 */
                    setMaterialTransparent(trains3D[i].cars[j].mesh, car.opacity);
                    trains3D[i].cars[j].mesh.rotation.z = -car.displayAngle;
                    if (trains3D[i].cars[j].meshFront) {
                        setMaterialTransparent(trains3D[i].cars[j].meshFront.left, car.opacity);
                        setMaterialTransparent(trains3D[i].cars[j].meshFront.right, car.opacity);
                        trains3D[i].cars[j].meshFront.left.rotation.z = -car.front.angle;
                        trains3D[i].cars[j].meshFront.right.rotation.z = -car.front.angle;
                    }
                    if (trains3D[i].cars[j].meshBack) {
                        setMaterialTransparent(trains3D[i].cars[j].meshBack.left, car.opacity);
                        setMaterialTransparent(trains3D[i].cars[j].meshBack.right, car.opacity);
                        trains3D[i].cars[j].meshBack.left.rotation.z = -car.back.angle;
                        trains3D[i].cars[j].meshBack.right.rotation.z = -car.back.angle;
                    }
                }
            });
        });
        cars.forEach(function (car, i) {
            if (cars3D[i] && cars3D[i].mesh) {
                cars3D[i].mesh.position.set(three.calcScale() * ((car.x - background.width / 2) / background.width), three.calcScale() * (-(car.y - background.height / 2) / background.width) + three.calcPositionY(), cars3D[i].positionZ);
                cars3D[i].mesh.rotation.z = -car.displayAngle;
            }
            if (currentMode != Modes.DEMO && cars3D[i] && cars3D[i].meshParkingLot) {
                cars3D[i].meshParkingLot.visible = !carParams.init && ((carParams.autoModeOff && cars[i].cType == "normal" && !cars[i].move) || (!carParams.autoModeOff && !carParams.autoModeRuns && !carParams.isBackToRoot));
                cars3D[i].meshParkingLot.material.color.setHex(carParams.autoModeOff ? cars[i].hexColor : "0xffeeef");
            }
        });
        if (three.cameraMode == ThreeCameraModes.FOLLOW_CAR) {
            if (typeof three.followObject != "number" || !Number.isInteger(three.followObject) || three.followObject < 0 || three.followObject > cars.length - 1) {
                three.followObject = currentMode == Modes.DEMO ? Math.floor(Math.random() * cars.length) : 0;
            }
            if ((!carParams.autoModeOff && carParams.isBackToRoot) || (carParams.autoModeOff && (cars[three.followObject].backToInit || cars[three.followObject].backwardsState > 0))) {
                background3D.animateBehind(false, (cars[three.followObject].displayAngle - Math.PI) / (2 * Math.PI));
            }
            else {
                background3D.animateBehind(false, cars[three.followObject].displayAngle / (2 * Math.PI));
            }
            three.followCamera.position.set(three.calcScale() * ((cars[three.followObject].outerX - background.width / 2) / background.width), three.calcScale() * (-(cars[three.followObject].outerY - background.height / 2) / background.width) + three.calcPositionY(), cars3D[three.followObject].positionZ == undefined ? 0 : cars3D[three.followObject].positionZ);
            three.followCamera.rotation.set(0, 0, 0);
            three.followCamera.rotation.z = -cars[three.followObject].displayAngle;
            if ((!carParams.autoModeOff && carParams.isBackToRoot) || (carParams.autoModeOff && (cars[three.followObject].backToInit || cars[three.followObject].backwardsState > 0))) {
                three.followCamera.rotation.z += Math.PI;
            }
            var axis = new THREE.Vector3(0, 0, 1);
            var rad = -Math.PI / 2;
            three.followCamera.rotateOnAxis(axis, rad);
            var axis = new THREE.Vector3(1, 0, 0);
            var rad = Math.PI / 2;
            three.followCamera.rotateOnAxis(axis, rad);
            three.renderer.render(three.scene, three.followCamera);
            if (currentMode != Modes.DEMO && !gui.controlCenter && !gui.konamiOverlay && !multiplayerMode.waitingClock.visible) {
                contextForeground.save();
                contextForeground.translate(three.followCamControls.x, three.followCamControls.y + three.followCamControls.textSize);
                contextForeground.font = three.followCamControls.font;
                contextForeground.fillStyle = "white";
                if (carParams.init) {
                    contextForeground.fillText("motion_photos_auto", 0, 0);
                    contextForeground.fillText("power_settings_new", 0, three.followCamControls.padding + three.followCamControls.textSize);
                }
                else if (carParams.autoModeOff) {
                    contextForeground.fillText("power_settings_new", 0, 0);
                    if (!cars[three.followObject].move && !cars[three.followObject].parking) {
                        contextForeground.fillText("west", 0, three.followCamControls.padding + three.followCamControls.textSize);
                        contextForeground.fillText("cottage", 0, 2 * (three.followCamControls.padding + three.followCamControls.textSize));
                    }
                }
                else {
                    contextForeground.fillText("play_pause", 0, 0);
                    if (!carParams.isBackToRoot) {
                        contextForeground.fillText("cottage", 0, three.followCamControls.padding + three.followCamControls.textSize);
                    }
                }
                contextForeground.restore();
                if (hardware.mouse.moveX > three.followCamControls.x && hardware.mouse.moveY > three.followCamControls.y && hardware.mouse.moveX < three.followCamControls.x + three.followCamControls.width && hardware.mouse.moveY < three.followCamControls.y + three.followCamControls.textSize) {
                    raycasterActive = false;
                    hardware.mouse.cursor = "pointer";
                    if (hardware.mouse.isHold) {
                        if (carParams.init) {
                            carActions.auto.start();
                        }
                        else if (carParams.autoModeOff) {
                            if (cars[three.followObject].move) {
                                carActions.manual.stop(three.followObject);
                            }
                            else {
                                carActions.manual.start(three.followObject);
                            }
                        }
                        else {
                            if (carParams.autoModeRuns) {
                                carActions.auto.pause();
                            }
                            else {
                                carActions.auto.resume();
                            }
                        }
                        hardware.mouse.isHold = false;
                    }
                }
                else if (hardware.mouse.moveX > three.followCamControls.x && hardware.mouse.moveY > three.followCamControls.y + three.followCamControls.padding + three.followCamControls.textSize && hardware.mouse.moveX < three.followCamControls.x + three.followCamControls.width && hardware.mouse.moveY < three.followCamControls.y + three.followCamControls.padding + three.followCamControls.textSize * 2) {
                    if (carParams.init) {
                        raycasterActive = false;
                        hardware.mouse.cursor = "pointer";
                        if (hardware.mouse.isHold) {
                            carActions.manual.start(three.followObject);
                            hardware.mouse.isHold = false;
                        }
                    }
                    else if (carParams.autoModeOff) {
                        if (!cars[three.followObject].move && !cars[three.followObject].parking) {
                            raycasterActive = false;
                            hardware.mouse.cursor = "pointer";
                            if (hardware.mouse.isHold) {
                                carActions.manual.backwards(three.followObject);
                                hardware.mouse.isHold = false;
                            }
                        }
                    }
                    else {
                        if (!carParams.isBackToRoot) {
                            raycasterActive = false;
                            hardware.mouse.cursor = "pointer";
                            if (hardware.mouse.isHold) {
                                carActions.auto.end();
                                hardware.mouse.isHold = false;
                            }
                        }
                    }
                }
                else if (hardware.mouse.moveX > three.followCamControls.x && hardware.mouse.moveY > three.followCamControls.y + three.followCamControls.padding * 2 + three.followCamControls.textSize * 2 && hardware.mouse.moveX < three.followCamControls.x + three.followCamControls.width && hardware.mouse.moveY < three.followCamControls.y + three.followCamControls.padding * 2 + three.followCamControls.textSize * 3) {
                    if (!carParams.init && carParams.autoModeOff && !cars[three.followObject].move && !cars[three.followObject].parking) {
                        raycasterActive = false;
                        hardware.mouse.cursor = "pointer";
                        if (hardware.mouse.isHold) {
                            carActions.manual.park(three.followObject);
                            hardware.mouse.isHold = false;
                        }
                    }
                }
            }
        }
        else if (three.cameraMode == ThreeCameraModes.FOLLOW_TRAIN) {
            if (typeof three.followObject != "number" || !Number.isInteger(three.followObject) || three.followObject < 0 || three.followObject > trains.length - 1) {
                three.followObject = currentMode == Modes.DEMO ? Math.floor(Math.random() * trains.length) : 0;
            }
            var object = trains[three.followObject].standardDirection || trains[three.followObject].cars.length == 0 ? trains[three.followObject] : trains[three.followObject].cars[trains[three.followObject].cars.length - 1];
            var object3D = trains[three.followObject].standardDirection || trains3D[three.followObject].cars.length == 0 ? trains3D[three.followObject] : trains3D[three.followObject].cars[trains3D[three.followObject].cars.length - 1];
            background3D.animateBehind(false, (trains[three.followObject].standardDirection ? object.displayAngle : object.displayAngle - Math.PI) / (2 * Math.PI));
            three.followCamera.position.set((three.calcScale() * (trains[three.followObject].outerX - background.x - background.width / 2)) / background.width, three.calcScale() * (-(trains[three.followObject].outerY - background.y - background.height / 2) / background.width) + three.calcPositionY(), object3D.positionZ == undefined ? 0 : object3D.positionZ);
            three.followCamera.rotation.set(0, 0, 0);
            three.followCamera.rotation.z = -object.displayAngle;
            if (!trains[three.followObject].standardDirection) {
                three.followCamera.rotation.z += Math.PI;
            }
            var axis = new THREE.Vector3(0, 0, 1);
            var rad = -Math.PI / 2;
            three.followCamera.rotateOnAxis(axis, rad);
            var axis = new THREE.Vector3(1, 0, 0);
            var rad = Math.PI / 2;
            three.followCamera.rotateOnAxis(axis, rad);
            if (currentMode != Modes.DEMO && !gui.controlCenter && !gui.konamiOverlay && !multiplayerMode.waitingClock.visible) {
                contextForeground.save();
                contextForeground.translate(three.followCamControls.x, three.followCamControls.y);
                contextForeground.beginPath();
                if (contextForeground.roundRect) {
                    contextForeground.roundRect(0, 0, three.followCamControls.width, three.followCamControls.draggingAreaHeight, three.followCamControls.draggingAreaRadius);
                }
                else {
                    contextForeground.rect(0, 0, three.followCamControls.width, three.followCamControls.draggingAreaHeight);
                }
                contextForeground.fillStyle = trains[three.followObject].crash ? "rgba(255,150,150,0.2)" : "rgba(255,255,255,0.2)";
                contextForeground.fill();
                contextForeground.strokeStyle = "white";
                contextForeground.lineWidth = three.followCamControls.padding / 10;
                contextForeground.stroke();
                contextForeground.restore();
                contextForeground.save();
                contextForeground.translate(three.followCamControls.x, three.followCamControls.y);
                contextForeground.beginPath();
                var currentSpeed = (trains[three.followObject].currentSpeedInPercent == undefined || !trains[three.followObject].move || trains[three.followObject].accelerationSpeed < 0 ? 0 : Math.round(trains[three.followObject].currentSpeedInPercent)) / 100;
                if (contextForeground.roundRect) {
                    contextForeground.roundRect(0, three.followCamControls.draggingAreaHeight * (1 - currentSpeed), three.followCamControls.width, three.followCamControls.draggingAreaHeight * currentSpeed, [Math.max(0, three.followCamControls.draggingAreaHeight * currentSpeed - (three.followCamControls.draggingAreaHeight - three.followCamControls.draggingAreaRadius)), Math.max(0, three.followCamControls.draggingAreaHeight * currentSpeed - (three.followCamControls.draggingAreaHeight - three.followCamControls.draggingAreaRadius)), three.followCamControls.draggingAreaRadius, three.followCamControls.draggingAreaRadius]);
                }
                else {
                    contextForeground.rect(0, three.followCamControls.draggingAreaHeight * (1 - currentSpeed), three.followCamControls.width, three.followCamControls.draggingAreaHeight * currentSpeed);
                }
                contextForeground.fillStyle = "rgba(255,255,255,0.3)";
                contextForeground.fill();
                contextForeground.restore();
                contextForeground.save();
                contextForeground.font = three.followCamControls.font;
                contextForeground.fillStyle = "white";
                contextForeground.fillText("speed", three.followCamControls.x, three.followCamControls.y + three.followCamControls.textSize);
                if (trains[three.followObject].accelerationSpeed > 0) {
                    contextForeground.save();
                    var controlSpeedText = trains[three.followObject].speedInPercent + "%";
                    contextForeground.font = measureFontSize(controlSpeedText, defaultFont, 20, three.followCamControls.width * 0.7, 5, 1.2);
                    var controlSpeedTextMetrics = contextForeground.measureText(controlSpeedText);
                    if (three.followCamControls.draggingAreaHeight - three.followCamControls.padding - three.followCamControls.textSize > parseInt(contextForeground.font.replace(/^([0-9.]+)px.*$/, "$1"), 10)) {
                        contextForeground.fillText(controlSpeedText, three.followCamControls.x + (three.followCamControls.width - controlSpeedTextMetrics.width) / 2, three.followCamControls.y + three.followCamControls.draggingAreaHeight - three.followCamControls.padding);
                    }
                    contextForeground.restore();
                }
                if (trains[three.followObject].accelerationSpeed <= 0 && Math.abs(trains[three.followObject].accelerationSpeed) < 0.2) {
                    contextForeground.fillText("sync_alt", three.followCamControls.x, three.followCamControls.y + three.followCamControls.draggingAreaHeight + three.followCamControls.padding + three.followCamControls.textSize);
                }
                contextForeground.restore();
                if (hardware.mouse.moveX > three.followCamControls.x && hardware.mouse.moveY > three.followCamControls.y && hardware.mouse.moveX < three.followCamControls.x + three.followCamControls.width && hardware.mouse.moveY < three.followCamControls.y + three.followCamControls.draggingAreaHeight) {
                    raycasterActive = false;
                    hardware.mouse.cursor = three.followCamControls.dragging ? "grabbing" : trains[three.followObject].crash ? "default" : "pointer";
                    if (hardware.mouse.isHold || three.followCamControls.dragging) {
                        if (!trains[three.followObject].crash) {
                            three.followCamControls.dragging = true;
                            var newSpeedByUser = Math.round((1 - (hardware.mouse.moveY - three.followCamControls.y) / three.followCamControls.draggingAreaHeight) * 100);
                            if (newSpeedByUser > 95) {
                                newSpeedByUser = 100;
                            }
                            trainActions.setSpeed(three.followObject, newSpeedByUser, true);
                        }
                        else {
                            three.followCamControls.dragging = false;
                        }
                        hardware.mouse.isHold = false;
                    }
                    else if (hardware.mouse.wheelScrolls && hardware.mouse.wheelScrollY != 0 && hardware.mouse.wheelX > three.followCamControls.x && hardware.mouse.wheelY > three.followCamControls.y && hardware.mouse.wheelX < three.followCamControls.x + three.followCamControls.width && hardware.mouse.wheelY < three.followCamControls.y + three.followCamControls.draggingAreaHeight) {
                        if (trains[three.followObject].speedInPercent == undefined || trains[three.followObject].speedInPercent < trainParams.minSpeed) {
                            newSpeedByUser = trainParams.minSpeed;
                        }
                        else {
                            newSpeedByUser = Math.round(trains[three.followObject].speedInPercent * (hardware.mouse.wheelScrollY < 0 ? 1.1 : 0.9));
                        }
                        if (newSpeedByUser > 95) {
                            newSpeedByUser = 100;
                        }
                        trainActions.setSpeed(three.followObject, newSpeedByUser, true);
                        hardware.mouse.wheelScrolls = false;
                    }
                }
                else {
                    three.followCamControls.dragging = false;
                }
                if (trains[three.followObject].accelerationSpeed <= 0 && Math.abs(trains[three.followObject].accelerationSpeed) < 0.2 && hardware.mouse.moveX > three.followCamControls.x && hardware.mouse.moveY > three.followCamControls.y + three.followCamControls.draggingAreaHeight + three.followCamControls.padding && hardware.mouse.moveX < three.followCamControls.x + three.followCamControls.width && hardware.mouse.moveY < three.followCamControls.y + three.followCamControls.y + three.followCamControls.draggingAreaHeight + three.followCamControls.padding + three.followCamControls.textSize) {
                    raycasterActive = false;
                    hardware.mouse.cursor = "pointer";
                    if (hardware.mouse.isHold) {
                        trainActions.changeDirection(three.followObject, true);
                        hardware.mouse.isHold = false;
                    }
                }
            }
        }
        else if (currentMode == Modes.DEMO) {
            var rotation = (Math.random() / 500) * (three.demoRotationSpeedFac / 100);
            three.scene.rotation.x += three.demoRotationFacX * rotation;
            three.scene.rotation.y += three.demoRotationFacY * rotation;
        }
        if (currentMode != Modes.DEMO) {
            Object.keys(switches).forEach(function (key) {
                Object.keys(switches[key]).forEach(function (currentKey) {
                    function getFadeColor(fadeProgress, maxColor) {
                        if (maxColor === void 0) { maxColor = 255; }
                        var hex = Math.round(fadeProgress * maxColor).toString(16);
                        if (hex.length == 1) {
                            return "0" + hex;
                        }
                        return hex;
                    }
                    function getAngle(fadeProgress, newAngle, oldAngle) {
                        return fadeProgress * newAngle + (1 - fadeProgress) * oldAngle;
                    }
                    var hex = switches[key][currentKey].turned ? "0x00ff00" : "0xff0000";
                    var hexSquare = switches[key][currentKey].turned ? "0x005500" : "0x550000";
                    var angle = switches[key][currentKey].turned ? switches[key][currentKey].angles.turned : switches[key][currentKey].angles.normal;
                    var transparent = true;
                    if (switches[key][currentKey].lastStateChange != undefined && frameNo - switches[key][currentKey].lastStateChange < switchParams.showDuration) {
                        var fadeProgress = (frameNo - switches[key][currentKey].lastStateChange) / switchParams.showDuration;
                        if (switches[key][currentKey].turned) {
                            hex = "0x" + getFadeColor(1 - fadeProgress) + getFadeColor(fadeProgress) + "00";
                            hexSquare = "0x" + getFadeColor(1 - fadeProgress, 85) + getFadeColor(fadeProgress, 85) + "00";
                            angle = getAngle(fadeProgress, switches[key][currentKey].angles.turned, switches[key][currentKey].angles.normal);
                        }
                        else {
                            hex = "0x" + getFadeColor(fadeProgress) + getFadeColor(1 - fadeProgress) + "00";
                            hexSquare = "0x" + getFadeColor(fadeProgress, 85) + getFadeColor(1 - fadeProgress, 85) + "00";
                            angle = getAngle(fadeProgress, switches[key][currentKey].angles.normal, switches[key][currentKey].angles.turned);
                        }
                    }
                    if (switches[key][currentKey].lastStateChange != undefined && frameNo - switches[key][currentKey].lastStateChange < switchParams.showDuration) {
                        transparent = false;
                    }
                    switches3D[key][currentKey].circleMesh.material.color.setHex(hex);
                    switches3D[key][currentKey].circleMesh.material.transparent = transparent;
                    switches3D[key][currentKey].circleMeshSmall.material.color.setHex(hexSquare);
                    var scale = three.calcScale();
                    switches3D[key][currentKey].squareMeshHighlight.material.color.setHex(hexSquare);
                    switches3D[key][currentKey].squareMeshHighlight.rotation.y = -angle - Math.PI / 4;
                    switches3D[key][currentKey].squareMeshHighlight.position.set(scale * ((switches[key][currentKey].x - background.width / 2) / background.width + (switches3D[key][currentKey].squareMeshHighlight.geometry.parameters.width / 2) * Math.cos(switches3D[key][currentKey].squareMeshHighlight.rotation.y)), scale * (-(switches[key][currentKey].y - background.height / 2) / background.width + (switches3D[key][currentKey].squareMeshHighlight.geometry.parameters.width / 2) * Math.sin(switches3D[key][currentKey].squareMeshHighlight.rotation.y)) + three.calcPositionY(), scale * (switches3D[key][currentKey].squareMeshHighlight.geometry.parameters.depth / 2));
                    switches3D[key][currentKey].squareMeshNormal.rotation.y = -switches[key][currentKey].angles.normal - Math.PI / 4;
                    switches3D[key][currentKey].squareMeshNormal.position.set(scale * ((switches[key][currentKey].x - background.width / 2) / background.width + (switches3D[key][currentKey].squareMeshNormal.geometry.parameters.width / 2) * Math.cos(switches3D[key][currentKey].squareMeshNormal.rotation.y)), scale * (-(switches[key][currentKey].y - background.height / 2) / background.width + (switches3D[key][currentKey].squareMeshNormal.geometry.parameters.width / 2) * Math.sin(switches3D[key][currentKey].squareMeshNormal.rotation.y)) + three.calcPositionY(), scale * (switches3D[key][currentKey].squareMeshNormal.geometry.parameters.depth / 2));
                    switches3D[key][currentKey].squareMeshTurned.rotation.y = -switches[key][currentKey].angles.turned - Math.PI / 4;
                    switches3D[key][currentKey].squareMeshTurned.position.set(scale * ((switches[key][currentKey].x - background.width / 2) / background.width + (switches3D[key][currentKey].squareMeshTurned.geometry.parameters.width / 2) * Math.cos(switches3D[key][currentKey].squareMeshTurned.rotation.y)), scale * (-(switches[key][currentKey].y - background.height / 2) / background.width + (switches3D[key][currentKey].squareMeshTurned.geometry.parameters.width / 2) * Math.sin(switches3D[key][currentKey].squareMeshTurned.rotation.y)) + three.calcPositionY(), scale * (switches3D[key][currentKey].squareMeshTurned.geometry.parameters.depth / 2));
                });
            });
            if (!gui.controlCenter && raycasterActive) {
                var raycasterMove = new THREE.Raycaster();
                var mouseMove = new THREE.Vector2();
                mouseMove.x = (hardware.mouse.moveX / client.devicePixelRatio / three.renderer.domElement.clientWidth) * 2 - 1;
                mouseMove.y = (-hardware.mouse.moveY / client.devicePixelRatio / three.renderer.domElement.clientHeight) * 2 + 1;
                raycasterMove.setFromCamera(mouseMove, three.activeCamera);
                var raycasterDown = new THREE.Raycaster();
                var mouseDown = new THREE.Vector2();
                mouseDown.x = (hardware.mouse.downX / client.devicePixelRatio / three.renderer.domElement.clientWidth) * 2 - 1;
                mouseDown.y = (-hardware.mouse.downY / client.devicePixelRatio / three.renderer.domElement.clientHeight) * 2 + 1;
                raycasterDown.setFromCamera(mouseDown, three.activeCamera);
                var raycasterUp = new THREE.Raycaster();
                var mouseUp = new THREE.Vector2();
                mouseUp.x = (hardware.mouse.upX / client.devicePixelRatio / three.renderer.domElement.clientWidth) * 2 - 1;
                mouseUp.y = (-hardware.mouse.upY / client.devicePixelRatio / three.renderer.domElement.clientHeight) * 2 + 1;
                raycasterUp.setFromCamera(mouseUp, three.activeCamera);
                var intersects = raycasterMove.intersectObjects(three.mainGroup.children);
                if (intersects.length > 0) {
                    var parent = intersects[0].object;
                    while (parent.parent.name != "main_group") {
                        parent = parent.parent;
                    }
                    if (parent && parent.visible && parent.callback) {
                        if (hardware.mouse.isHold) {
                            parent.callback(raycasterDown.intersectObject(parent).length > 0, raycasterUp.intersectObject(parent).length > 0);
                        }
                        if (!hardware.mouse.isDrag) {
                            hardware.mouse.cursor = "pointer";
                        }
                    }
                }
                else if (hardware.mouse.isHold && raycasterDown.intersectObjects(three.mainGroup.children).length == 0 && ((hardware.lastInputTouch < hardware.lastInputMouse && hardware.mouse.downTime - hardware.mouse.upTime > 0 && hardware.mouse.downTime - hardware.mouse.upTime < doubleClickTime && !hardware.mouse.lastClickDoubleClick && raycasterUp.intersectObjects(three.mainGroup.children).length == 0) || (hardware.lastInputTouch > hardware.lastInputMouse && Date.now() - hardware.mouse.downTime > longTouchTime))) {
                    if (clickTimeOut !== undefined && clickTimeOut !== null) {
                        clearTimeout(clickTimeOut);
                        clickTimeOut = null;
                    }
                    hardware.mouse.isHold = false;
                    if (hardware.lastInputTouch < hardware.lastInputMouse) {
                        hardware.mouse.lastClickDoubleClick = true;
                    }
                    resetTilt();
                }
            }
        }
        var continueTrackGroupName = "continue_track_group";
        var continueTrackOldObject = three.scene.getObjectByName(continueTrackGroupName);
        if (continueTrackOldObject) {
            three.scene.remove(continueTrackOldObject);
        }
        var continueTrackNewObject = new THREE.Group();
        continueTrackNewObject.name = continueTrackGroupName;
        if (trainInTrackElement(212)) {
            drawContinueTrackLine(continueTrackNewObject, "end", -1);
        }
        if (trainInTrackElement(213)) {
            drawContinueTrackCurve(continueTrackNewObject, "continueCurve0", -1);
        }
        if (trainInTrackElement(214)) {
            drawContinueTrackLine(continueTrackNewObject, "continueLine0", -1);
            drawContinueTrackLine(continueTrackNewObject, "continueLine0");
        }
        if (trainInTrackElement(215)) {
            drawContinueTrackCurve(continueTrackNewObject, "continueCurve1");
        }
        if (trainInTrackElement(216)) {
            drawContinueTrackLine(continueTrackNewObject, "continueLine1");
            drawContinueTrackLine(continueTrackNewObject, "continueLine1", -1);
        }
        if (trainInTrackElement(217)) {
            drawContinueTrackCurve(continueTrackNewObject, "continueCurve2", -1);
        }
        if (trainInTrackElement(218)) {
            drawContinueTrackLine(continueTrackNewObject, "rejoin", -1);
        }
        three.scene.add(continueTrackNewObject);
        three.animateLights();
        three.renderer.render(three.scene, three.activeCamera);
    }
    else {
        /////CLASSIC UI/////
        var classicUISavedMouseHold;
        var classicUISavedMouseDrag;
        var classicUISavedWheelScroll;
        if (classicUI.ready()) {
            context.save();
            context.beginPath();
            context.rect(background.x, background.y, background.width, background.height);
            var moveInPath = context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY);
            var wheelInPath = context.isPointInPath(hardware.mouse.wheelX, hardware.mouse.wheelY);
            context.restore();
            if (!moveInPath || classicUI.pointInTransformerImage(hardware.mouse.moveX, hardware.mouse.moveY)) {
                classicUISavedMouseHold = hardware.mouse.isHold;
                classicUISavedMouseDrag = hardware.mouse.isDrag;
                hardware.mouse.isHold = false;
                hardware.mouse.isDrag = false;
            }
            if (!wheelInPath || classicUI.pointInTransformerImage(hardware.mouse.wheelX, hardware.mouse.wheelY)) {
                classicUISavedWheelScroll = hardware.mouse.wheelScrolls;
                hardware.mouse.wheelScrolls = false;
            }
        }
        /////TRAINS/////
        var inTrain = false;
        if (!resized) {
            for (var i = 0; i < trains.length; i++) {
                drawTrains(i);
            }
        }
        /////CARS/////
        for (var i = 0; i < cars.length; i++) {
            drawCar(i);
        }
        /////KONAMI/Animals/////
        if (konamiState < 0) {
            var animalPos = [
                { x: background.x + background.width * 0.88, y: background.y + background.height * 0.57 },
                { x: background.x + background.width * 0.055, y: background.y + background.height * 0.07 }
            ];
            var animals = [];
            var animal = 0;
            while (getString(["appScreenKonamiAnimals", animal]) != "undefined" && animal < animalPos.length) {
                animals[animal] = getString(["appScreenKonamiAnimals", animal]);
                animal++;
            }
            animals.forEach(function (animal, i) {
                context.save();
                context.translate(animalPos[i].x, animalPos[i].y);
                context.font = measureFontSize(animal, "sans-serif", 100, background.width * 0.001, 5, background.width * 0.012);
                context.fillStyle = "white";
                context.textAlign = "center";
                context.fillText(animal, 0, 0);
                context.restore();
            });
        }
        /////TAX OFFICE/////
        if (getSetting("burnTheTaxOffice") && !multiplayerMode.waitingClock.visible) {
            //General (BEGIN)
            contextForeground.save();
            contextForeground.translate(background.x, background.y);
            contextForeground.translate(background.width / 7.4 - background.width * 0.07, background.height / 3.1 - background.height * 0.06);
            if (gui.infoOverlay && (menus.infoOverlay.focus == undefined || menus.infoOverlay.focus == 3)) {
                contextForeground.save();
                var textWidth = background.width / 100;
                contextForeground.beginPath();
                contextForeground.fillStyle = "#bbbb20";
                contextForeground.strokeStyle = "orange";
                contextForeground.arc(0, 0, textWidth * 1.1 * menus.infoOverlay.scaleFac, 0, 2 * Math.PI);
                contextForeground.fill();
                contextForeground.stroke();
                contextForeground.font = measureFontSize("3", "monospace", 100, textWidth, 5, textWidth / 10);
                contextForeground.fillStyle = "black";
                contextForeground.textAlign = "center";
                contextForeground.textBaseline = "middle";
                var metrics = contextForeground.measureText("3");
                if (metrics.actualBoundingBoxAscent != undefined && metrics.actualBoundingBoxDescent != undefined) {
                    contextForeground.fillText("3", 0, (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2);
                }
                else {
                    contextForeground.fillText("3", 0, 0);
                }
                contextForeground.restore();
            }
            //Smoke and Fire
            for (var i = 0; i < taxOffice.params.number; i++) {
                if (frameNo % taxOffice.params.frameNo === 0) {
                    if (Math.random() > taxOffice.params.frameProbability) {
                        if (Math.random() >= taxOffice.params.fire.color.probability) {
                            taxOffice.fire[i].color = "rgba(" + taxOffice.params.fire.color.yellow.red + "," + taxOffice.params.fire.color.yellow.green + "," + taxOffice.params.fire.color.yellow.blue + "," + taxOffice.params.fire.color.yellow.alpha * Math.random() + ")";
                        }
                        else {
                            taxOffice.fire[i].color = "rgba(" + taxOffice.params.fire.color.red.red + "," + taxOffice.params.fire.color.red.green + "," + taxOffice.params.fire.color.red.blue + "," + taxOffice.params.fire.color.red.alpha * Math.random() + ")";
                        }
                        taxOffice.fire[i].x = Math.random() * taxOffice.params.fire.x;
                        taxOffice.fire[i].y = Math.random() * taxOffice.params.fire.y;
                        taxOffice.fire[i].size = Math.random() * taxOffice.params.fire.size;
                        taxOffice.smoke[i].color = "rgba(" + taxOffice.params.smoke.color.red + "," + taxOffice.params.smoke.color.green + "," + taxOffice.params.smoke.color.blue + "," + taxOffice.params.smoke.color.alpha * Math.random() + ")";
                        taxOffice.smoke[i].x = Math.random() * taxOffice.params.smoke.x;
                        taxOffice.smoke[i].y = Math.random() * taxOffice.params.smoke.y;
                        taxOffice.smoke[i].size = Math.random() * taxOffice.params.smoke.size;
                    }
                }
                contextForeground.fillStyle = taxOffice.fire[i].color;
                contextForeground.save();
                contextForeground.translate(taxOffice.fire[i].x, taxOffice.fire[i].y);
                contextForeground.beginPath();
                contextForeground.arc(0, 0, taxOffice.fire[i].size, 0, 2 * Math.PI);
                contextForeground.fill();
                contextForeground.restore();
                contextForeground.save();
                contextForeground.fillStyle = taxOffice.smoke[i].color;
                contextForeground.translate(taxOffice.smoke[i].x, taxOffice.smoke[i].y);
                contextForeground.beginPath();
                contextForeground.arc(0, 0, taxOffice.smoke[i].size, 0, 2 * Math.PI);
                contextForeground.fill();
                contextForeground.restore();
            }
            //Blue lights
            for (var i = 0; i < taxOffice.params.blueLights.cars.length; i++) {
                if ((frameNo + taxOffice.params.blueLights.cars[i].frameNo) % taxOffice.params.blueLights.frameNo < 4) {
                    contextForeground.fillStyle = "rgba(0, 0,255,1)";
                }
                else if ((frameNo + taxOffice.params.blueLights.cars[i].frameNo) % taxOffice.params.blueLights.frameNo < 6 || (frameNo + taxOffice.params.blueLights.cars[i].frameNo) % taxOffice.params.blueLights.frameNo > taxOffice.params.blueLights.frameNo - 3) {
                    contextForeground.fillStyle = "rgba(0, 0,255,0.5)";
                }
                else {
                    contextForeground.fillStyle = "rgba(0, 0,255,0.2)";
                }
                contextForeground.save();
                contextForeground.translate(taxOffice.params.blueLights.cars[i].x[0], taxOffice.params.blueLights.cars[i].y[0]);
                contextForeground.beginPath();
                contextForeground.arc(0, 0, taxOffice.params.blueLights.cars[i].size, 0, 2 * Math.PI);
                contextForeground.closePath();
                contextForeground.fill();
                contextForeground.translate(taxOffice.params.blueLights.cars[i].x[1], taxOffice.params.blueLights.cars[i].y[1]);
                contextForeground.beginPath();
                contextForeground.arc(0, 0, taxOffice.params.blueLights.cars[i].size, 0, 2 * Math.PI);
                contextForeground.closePath();
                contextForeground.fill();
                contextForeground.restore();
            }
            //General (END)
            contextForeground.restore();
        }
        /////CLASSIC UI/////
        if (classicUI.ready(true)) {
            if (classicUISavedMouseHold != undefined && classicUISavedMouseDrag != undefined) {
                hardware.mouse.isHold = classicUISavedMouseHold;
                hardware.mouse.isDrag = classicUISavedMouseDrag;
                hardware.mouse.cursor = hardware.mouse.isDrag ? "move" : "default";
            }
            if (classicUISavedWheelScroll != undefined) {
                hardware.mouse.wheelScrolls = classicUISavedWheelScroll;
            }
            if (gui.settings) {
                calcClassicUIElements();
            }
            var step = Math.PI / 30;
            if (trains[trainParams.selected].accelerationSpeed > 0) {
                if (classicUI.transformer.wheelInput.angle < (trains[trainParams.selected].speedInPercent / 100) * classicUI.transformer.wheelInput.maxAngle) {
                    classicUI.transformer.wheelInput.angle += step;
                    if (classicUI.transformer.wheelInput.angle >= (trains[trainParams.selected].speedInPercent / 100) * classicUI.transformer.wheelInput.maxAngle) {
                        classicUI.transformer.wheelInput.angle = (trains[trainParams.selected].speedInPercent / 100) * classicUI.transformer.wheelInput.maxAngle;
                    }
                }
                else {
                    classicUI.transformer.wheelInput.angle -= step;
                    if (classicUI.transformer.wheelInput.angle <= (trains[trainParams.selected].speedInPercent / 100) * classicUI.transformer.wheelInput.maxAngle) {
                        classicUI.transformer.wheelInput.angle = (trains[trainParams.selected].speedInPercent / 100) * classicUI.transformer.wheelInput.maxAngle;
                    }
                }
            }
            else {
                if (classicUI.transformer.wheelInput.angle > 0) {
                    classicUI.transformer.wheelInput.angle -= step;
                    if (classicUI.transformer.wheelInput.angle < 0) {
                        classicUI.transformer.wheelInput.angle = 0;
                    }
                }
            }
            var wasInSwitchPath = false;
            if (classicUI.trainSwitch.selectedTrainDisplay.visible) {
                contextForeground.save();
                if (((classicUI.pointInTrainSwitchInputText(hardware.mouse.wheelX, hardware.mouse.wheelY) && hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls) || classicUI.pointInTrainSwitchInputText(hardware.mouse.moveX, hardware.mouse.moveY)) && !hardware.mouse.isDrag) {
                    wasInSwitchPath = true;
                }
                contextForeground.font = classicUI.trainSwitch.selectedTrainDisplay.font;
                contextForeground.fillStyle = "#000";
                contextForeground.strokeStyle = "#eee";
                contextForeground.fillRect(classicUI.trainSwitch.selectedTrainDisplay.x, classicUI.trainSwitch.selectedTrainDisplay.y, classicUI.trainSwitch.selectedTrainDisplay.width, classicUI.trainSwitch.selectedTrainDisplay.height);
                contextForeground.strokeRect(classicUI.trainSwitch.selectedTrainDisplay.x, classicUI.trainSwitch.selectedTrainDisplay.y, classicUI.trainSwitch.selectedTrainDisplay.width, classicUI.trainSwitch.selectedTrainDisplay.height);
                contextForeground.fillStyle = "#eee";
                contextForeground.translate(classicUI.trainSwitch.selectedTrainDisplay.x + classicUI.trainSwitch.selectedTrainDisplay.width / 2, 0);
                contextForeground.textBaseline = "middle";
                contextForeground.fillText(getString(["appScreenTrainNames", trainParams.selected]), -contextForeground.measureText(getString(["appScreenTrainNames", trainParams.selected])).width / 2, classicUI.trainSwitch.selectedTrainDisplay.y + classicUI.trainSwitch.selectedTrainDisplay.height / 2);
                if (gui.infoOverlay && (menus.infoOverlay.focus == undefined || menus.infoOverlay.focus == 5)) {
                    contextForeground.save();
                    contextForeground.translate(classicUI.trainSwitch.selectedTrainDisplay.width / 2, classicUI.trainSwitch.selectedTrainDisplay.y);
                    var textWidth = background.width / (menus.small ? 100 : 50);
                    contextForeground.beginPath();
                    contextForeground.fillStyle = "#dfbbff";
                    contextForeground.strokeStyle = "violet";
                    contextForeground.arc(0, 0, textWidth * 1.1 * menus.infoOverlay.scaleFac, 0, 2 * Math.PI);
                    contextForeground.fill();
                    contextForeground.stroke();
                    contextForeground.font = measureFontSize("5", "monospace", 100, textWidth, 5, textWidth / 10);
                    contextForeground.fillStyle = "black";
                    contextForeground.textAlign = "center";
                    contextForeground.textBaseline = "middle";
                    var metrics = contextForeground.measureText("5");
                    if (metrics.actualBoundingBoxAscent != undefined && metrics.actualBoundingBoxDescent != undefined) {
                        contextForeground.fillText("5", 0, (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2);
                    }
                    else {
                        contextForeground.fillText("5", 0, 0);
                    }
                    contextForeground.restore();
                }
                contextForeground.restore();
            }
            contextForeground.save();
            contextForeground.translate(classicUI.trainSwitch.x + classicUI.trainSwitch.width / 2, classicUI.trainSwitch.y + classicUI.trainSwitch.height / 2);
            contextForeground.rotate(classicUI.trainSwitch.angle);
            drawImage(pics[classicUI.trainSwitch.src], -classicUI.trainSwitch.width / 2, -classicUI.trainSwitch.height / 2, classicUI.trainSwitch.width, classicUI.trainSwitch.height, contextForeground);
            contextForeground.save();
            var alpha = 0;
            var alphaFramesMax = 55;
            if (trainParams.selectedLastChange != undefined && frameNo - trainParams.selectedLastChange < alphaFramesMax) {
                alpha = 1;
            }
            else if (trainParams.selectedLastChange != undefined && frameNo - alphaFramesMax - trainParams.selectedLastChange < alphaFramesMax) {
                alpha = 1 - (frameNo - alphaFramesMax - trainParams.selectedLastChange) / alphaFramesMax;
            }
            contextForeground.globalAlpha = 1 - alpha;
            if (contextForeground.globalAlpha > 0) {
                drawImage(pics[classicUI.trainSwitch.srcFill], -classicUI.trainSwitch.width / 2, -classicUI.trainSwitch.height / 2, classicUI.trainSwitch.width, classicUI.trainSwitch.height, contextForeground);
            }
            contextForeground.globalAlpha = alpha;
            if (contextForeground.globalAlpha > 0) {
                drawImage(pics[trains[trainParams.selected].trainSwitchSrc], -classicUI.trainSwitch.width / 2, -classicUI.trainSwitch.height / 2, classicUI.trainSwitch.width, classicUI.trainSwitch.height, contextForeground);
            }
            contextForeground.restore();
            if (gui.infoOverlay && (menus.infoOverlay.focus == undefined || menus.infoOverlay.focus == 4)) {
                contextForeground.save();
                contextForeground.translate(classicUI.trainSwitch.width * 0.25, -classicUI.trainSwitch.height * 0.25);
                contextForeground.rotate(-classicUI.trainSwitch.angle);
                var textWidth = background.width / (menus.small ? 100 : 50);
                contextForeground.beginPath();
                contextForeground.fillStyle = "#dfbbff";
                contextForeground.strokeStyle = "violet";
                contextForeground.arc(0, 0, textWidth * 1.1 * menus.infoOverlay.scaleFac, 0, 2 * Math.PI);
                contextForeground.fill();
                contextForeground.stroke();
                contextForeground.font = measureFontSize("4", "monospace", 100, textWidth, 5, textWidth / 10);
                contextForeground.fillStyle = "black";
                contextForeground.textAlign = "center";
                contextForeground.textBaseline = "middle";
                var metrics = contextForeground.measureText("4");
                if (metrics.actualBoundingBoxAscent != undefined && metrics.actualBoundingBoxDescent != undefined) {
                    contextForeground.fillText("4", 0, (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2);
                }
                else {
                    contextForeground.fillText("4", 0, 0);
                }
                contextForeground.restore();
            }
            contextForeground.restore();
            if ((wasInSwitchPath || (classicUI.pointInTrainSwitchInputImage(hardware.mouse.wheelX, hardware.mouse.wheelY) && hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls) || classicUI.pointInTrainSwitchInputImage(hardware.mouse.moveX, hardware.mouse.moveY)) && !hardware.mouse.isDrag) {
                hardware.mouse.cursor = "pointer";
                if (movingTimeOut !== undefined && movingTimeOut !== null) {
                    clearTimeout(movingTimeOut);
                }
                if ((hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls) || hardware.mouse.isHold) {
                    if (hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls) {
                        trainParams.selected += hardware.mouse.wheelScrollY < 0 ? 1 : -1;
                    }
                    else {
                        trainParams.selected++;
                        hardware.mouse.isHold = false;
                    }
                    if (trainParams.selected >= trains.length) {
                        trainParams.selected = 0;
                    }
                    else if (trainParams.selected < 0) {
                        trainParams.selected = trains.length - 1;
                    }
                    trainParams.selectedLastChange = frameNo;
                    if (!classicUI.trainSwitch.selectedTrainDisplay.visible) {
                        notify("#canvas-notifier", formatJSString(getString("appScreenTrainSelected", "."), getString(["appScreenTrainNames", trainParams.selected])), NotificationPriority.High, 1250, null, null, client.height, NotificationChannel.ClassicUiTrainSwitch);
                    }
                }
            }
            contextForeground.save();
            contextForeground.translate(classicUI.transformer.x + classicUI.transformer.width / 2, classicUI.transformer.y + classicUI.transformer.height / 2);
            contextForeground.rotate(classicUI.transformer.angle);
            drawImage(pics[classicUI.transformer.src], -classicUI.transformer.width / 2, -classicUI.transformer.height / 2, classicUI.transformer.width, classicUI.transformer.height, contextForeground);
            if (!trains[trainParams.selected].crash) {
                drawImage(pics[classicUI.transformer.readySrc], -classicUI.transformer.width / 2, -classicUI.transformer.height / 2, classicUI.transformer.width, classicUI.transformer.height, contextForeground);
            }
            if (trains[trainParams.selected].accelerationSpeed > 0) {
                drawImage(pics[classicUI.transformer.onSrc], -classicUI.transformer.width / 2, -classicUI.transformer.height / 2, classicUI.transformer.width, classicUI.transformer.height, contextForeground);
            }
            if (!client.isTiny || !(typeof client.zoomAndTilt.realScale == "undefined" || client.zoomAndTilt.realScale <= Math.max(1, client.zoomAndTilt.maxScale / 3))) {
                if (!classicUI.transformer.directionInput.visible) {
                    classicUI.transformer.directionInput.visible = true;
                    if (gui.infoOverlay) {
                        drawMenu("items-change");
                    }
                }
                contextForeground.save();
                contextForeground.translate(classicUI.transformer.directionInput.diffX, classicUI.transformer.directionInput.diffY);
                if (trains[trainParams.selected].move) {
                    contextForeground.globalAlpha = 0.5;
                }
                if (trains[trainParams.selected].standardDirection) {
                    drawImage(pics[classicUI.transformer.directionInput.srcStandardDirection], -classicUI.transformer.directionInput.width / 2, -classicUI.transformer.directionInput.height / 2, classicUI.transformer.directionInput.width, classicUI.transformer.directionInput.height, contextForeground);
                }
                else {
                    drawImage(pics[classicUI.transformer.directionInput.srcNotStandardDirection], -classicUI.transformer.directionInput.width / 2, -classicUI.transformer.directionInput.height / 2, classicUI.transformer.directionInput.width, classicUI.transformer.directionInput.height, contextForeground);
                }
                if (gui.infoOverlay && (menus.infoOverlay.focus == undefined || menus.infoOverlay.focus == 7)) {
                    contextForeground.save();
                    contextForeground.translate(-classicUI.transformer.directionInput.width, -classicUI.transformer.directionInput.height);
                    contextForeground.rotate(-classicUI.transformer.angle);
                    var textWidth = background.width / (menus.small ? 125 : 75);
                    contextForeground.beginPath();
                    contextForeground.fillStyle = "#dfbbff";
                    contextForeground.strokeStyle = "violet";
                    contextForeground.arc(0, 0, textWidth * 1.1 * menus.infoOverlay.scaleFac, 0, 2 * Math.PI);
                    contextForeground.fill();
                    contextForeground.stroke();
                    contextForeground.font = measureFontSize("7", "monospace", 100, textWidth, 5, textWidth / 10);
                    contextForeground.fillStyle = "black";
                    contextForeground.textAlign = "center";
                    contextForeground.textBaseline = "middle";
                    var metrics = contextForeground.measureText("7");
                    if (metrics.actualBoundingBoxAscent != undefined && metrics.actualBoundingBoxDescent != undefined) {
                        contextForeground.fillText("7", 0, (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2);
                    }
                    else {
                        contextForeground.fillText("7", 0, 0);
                    }
                    contextForeground.restore();
                }
                if (classicUI.pointInTransformerDirectionInput(hardware.mouse.moveX, hardware.mouse.moveY) && !trains[trainParams.selected].move && !hardware.mouse.isDrag) {
                    if (movingTimeOut !== undefined && movingTimeOut !== null) {
                        clearTimeout(movingTimeOut);
                    }
                    hardware.mouse.cursor = "pointer";
                    if (hardware.mouse.isHold) {
                        hardware.mouse.isHold = false;
                        trainActions.changeDirection(trainParams.selected);
                    }
                }
                contextForeground.restore();
            }
            else {
                if (classicUI.transformer.directionInput.visible) {
                    classicUI.transformer.directionInput.visible = false;
                    if (gui.infoOverlay) {
                        drawMenu("items-change");
                    }
                }
            }
            contextForeground.save();
            contextForeground.translate(0, -classicUI.transformer.wheelInput.diffY);
            contextForeground.rotate(classicUI.transformer.wheelInput.angle);
            drawImage(pics[classicUI.transformer.wheelInput.src], -classicUI.transformer.wheelInput.width / 2, -classicUI.transformer.wheelInput.height / 2, classicUI.transformer.wheelInput.width, classicUI.transformer.wheelInput.height, contextForeground);
            if (gui.infoOverlay && (menus.infoOverlay.focus == undefined || menus.infoOverlay.focus == 6)) {
                contextForeground.save();
                if (trains[trainParams.selected].crash) {
                    contextForeground.globalAlpha = 0.5;
                }
                contextForeground.rotate(-classicUI.transformer.angle);
                contextForeground.rotate(-classicUI.transformer.wheelInput.angle);
                var textWidth = background.width / (menus.small ? 100 : 50);
                contextForeground.beginPath();
                contextForeground.fillStyle = "#dfbbff";
                contextForeground.strokeStyle = "violet";
                contextForeground.arc(0, 0, textWidth * 1.1 * menus.infoOverlay.scaleFac, 0, 2 * Math.PI);
                contextForeground.fill();
                contextForeground.stroke();
                contextForeground.font = measureFontSize("6", "monospace", 100, textWidth, 5, textWidth / 10);
                contextForeground.fillStyle = "black";
                contextForeground.textAlign = "center";
                contextForeground.textBaseline = "middle";
                var metrics = contextForeground.measureText("6");
                if (metrics.actualBoundingBoxAscent != undefined && metrics.actualBoundingBoxDescent != undefined) {
                    contextForeground.fillText("6", 0, (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2);
                }
                else {
                    contextForeground.fillText("6", 0, 0);
                }
                contextForeground.restore();
            }
            if (APP_DATA.debug && debug.paint) {
                contextForeground.fillRect(-classicUI.transformer.wheelInput.width / 2, classicUI.transformer.wheelInput.height / 2, 6, 6);
                contextForeground.fillRect(-3, -3, 6, 6);
            }
            var isMouseMoveInWheelInput = classicUI.pointInTransformerWheelInput(hardware.mouse.moveX, hardware.mouse.moveY);
            var isMouseWheelInWheelInput = classicUI.pointInTransformerWheelInput(hardware.mouse.wheelX, hardware.mouse.wheelY);
            if (isMouseMoveInWheelInput && !trains[trainParams.selected].crash && !hardware.mouse.isDrag) {
                hardware.mouse.cursor = "pointer";
            }
            contextForeground.restore();
            contextForeground.restore();
            if ((isMouseMoveInWheelInput && hardware.mouse.isHold) || (isMouseWheelInWheelInput && hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls)) {
                if (movingTimeOut !== undefined && movingTimeOut !== null) {
                    clearTimeout(movingTimeOut);
                }
                var x = classicUI.transformer.x + classicUI.transformer.width / 2 + classicUI.transformer.wheelInput.diffY * Math.sin(classicUI.transformer.angle);
                var y = classicUI.transformer.y + classicUI.transformer.height / 2 - classicUI.transformer.wheelInput.diffY * Math.cos(classicUI.transformer.angle);
                if (!trains[trainParams.selected].crash) {
                    if (client.isTiny && (typeof client.zoomAndTilt.realScale == "undefined" || client.zoomAndTilt.realScale <= Math.max(1, client.zoomAndTilt.maxScale / 3))) {
                        if (hardware.mouse.isHold) {
                            hardware.mouse.isHold = false;
                            if (trains[trainParams.selected].move && trains[trainParams.selected].accelerationSpeed > 0) {
                                trainActions.stop(trainParams.selected);
                            }
                            else {
                                trainActions.start(trainParams.selected, 50);
                            }
                        }
                    }
                    else if ((hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls && !(adjustScaleY(hardware.mouse.wheelY > y) && adjustScaleX(hardware.mouse.wheelX < x))) || !(adjustScaleY(hardware.mouse.moveY) > y && adjustScaleX(hardware.mouse.moveX) < x)) {
                        var angle;
                        if (hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls && !(adjustScaleY(hardware.mouse.wheelY) > y && adjustScaleX(hardware.mouse.wheelX) < x)) {
                            angle = classicUI.transformer.wheelInput.angle * (hardware.mouse.wheelScrollY < 0 ? 1.1 : 0.9);
                        }
                        else {
                            if (adjustScaleY(hardware.mouse.moveY) > y) {
                                angle = Math.PI + Math.abs(Math.atan((adjustScaleY(hardware.mouse.moveY) - y) / (adjustScaleX(hardware.mouse.moveX) - x)));
                            }
                            else if (adjustScaleY(hardware.mouse.moveY) < y && adjustScaleX(hardware.mouse.moveX) > x) {
                                angle = Math.PI - Math.abs(Math.atan((adjustScaleY(hardware.mouse.moveY) - y) / (adjustScaleX(hardware.mouse.moveX) - x)));
                            }
                            else {
                                angle = Math.abs(Math.atan((adjustScaleY(hardware.mouse.moveY) - y) / (adjustScaleX(hardware.mouse.moveX) - x)));
                            }
                        }
                        classicUI.transformer.wheelInput.angle = angle >= 0 ? (angle <= classicUI.transformer.wheelInput.maxAngle ? angle : classicUI.transformer.wheelInput.maxAngle) : 0;
                        var cSpeedPercent = (classicUI.transformer.wheelInput.angle / classicUI.transformer.wheelInput.maxAngle) * 100;
                        if (hardware.mouse.wheelScrollY < 0 && hardware.mouse.wheelScrolls && !(adjustScaleY(hardware.mouse.wheelY) > y && adjustScaleX(hardware.mouse.wheelX) < x) && cSpeedPercent < trainParams.minSpeed) {
                            cSpeedPercent = trainParams.minSpeed;
                            classicUI.transformer.wheelInput.angle = (cSpeedPercent * classicUI.transformer.wheelInput.maxAngle) / 100;
                        }
                        trainActions.setSpeed(trainParams.selected, cSpeedPercent);
                        if (cSpeedPercent == 0) {
                            hardware.mouse.isHold = false;
                        }
                    }
                    else {
                        hardware.mouse.isHold = false;
                    }
                }
                else {
                    classicUI.transformer.wheelInput.angle = 0;
                    trains[trainParams.selected].speedInPercent = 0;
                    trains[trainParams.selected].move = false;
                    hardware.mouse.isHold = false;
                }
                if (classicUI.transformer.wheelInput.angle > 0 && classicUI.transformer.wheelInput.angle < classicUI.transformer.wheelInput.maxAngle && !hardware.mouse.isDrag) {
                    hardware.mouse.cursor = "grabbing";
                }
            }
            if (APP_DATA.debug && debug.paint) {
                contextForeground.save();
                var x = classicUI.transformer.x + classicUI.transformer.width / 2 + classicUI.transformer.wheelInput.diffY * Math.sin(classicUI.transformer.angle);
                var y = classicUI.transformer.y + classicUI.transformer.height / 2 - classicUI.transformer.wheelInput.diffY * Math.cos(classicUI.transformer.angle);
                contextForeground.fillStyle = "red";
                contextForeground.fillRect(x - 2, y - 2, 4, 4);
                var a = -(classicUI.transformer.wheelInput.diffY - classicUI.transformer.wheelInput.height / 2);
                var b = classicUI.transformer.width / 2 - (classicUI.transformer.width / 2 - classicUI.transformer.wheelInput.width / 2);
                var c = classicUI.transformer.wheelInput.diffY + classicUI.transformer.wheelInput.height / 2;
                var d = b;
                var x1 = classicUI.transformer.x + classicUI.transformer.width / 2;
                var y1 = classicUI.transformer.y + classicUI.transformer.height / 2;
                var xArr = [x1 + c * Math.sin(classicUI.transformer.angle) - d * Math.cos(classicUI.transformer.angle), x1 + c * Math.sin(classicUI.transformer.angle), x1 + c * Math.sin(classicUI.transformer.angle) + d * Math.cos(classicUI.transformer.angle), x1 - (a + b) * Math.cos(classicUI.transformer.angle), x1 - a * Math.cos(classicUI.transformer.angle), x1 - (a - b) * Math.cos(classicUI.transformer.angle)];
                var yArr = [y1 - c * Math.cos(classicUI.transformer.angle) - d * Math.sin(classicUI.transformer.angle), y1 - c * Math.cos(classicUI.transformer.angle), y1 - c * Math.cos(classicUI.transformer.angle) + d * Math.sin(classicUI.transformer.angle), y1 + (a - b) * Math.sin(classicUI.transformer.angle), y1 + a * Math.sin(classicUI.transformer.angle), y1 + (a + b) * Math.sin(classicUI.transformer.angle)];
                contextForeground.fillRect(xArr[0], yArr[0], 4, 4);
                contextForeground.fillRect(xArr[1], yArr[1], 4, 4);
                contextForeground.fillRect(xArr[2], yArr[2], 4, 4);
                contextForeground.fillRect(xArr[3], yArr[3], 4, 4);
                contextForeground.fillRect(xArr[4], yArr[4], 4, 4);
                contextForeground.fillRect(xArr[5], yArr[5], 4, 4);
                var x = x1 + classicUI.transformer.wheelInput.diffY * Math.sin(classicUI.transformer.angle);
                var y = y1 - classicUI.transformer.wheelInput.diffY * Math.cos(classicUI.transformer.angle);
                contextForeground.beginPath();
                contextForeground.strokeStyle = "black";
                contextForeground.arc(x, y, classicUI.transformer.wheelInput.width / 2, Math.PI, Math.PI + classicUI.transformer.wheelInput.maxAngle, false);
                contextForeground.stroke();
                contextForeground.beginPath();
                contextForeground.strokeStyle = "red";
                contextForeground.arc(x, y, classicUI.transformer.wheelInput.width / 2, Math.PI, Math.PI + (trainParams.minSpeed * classicUI.transformer.wheelInput.maxAngle) / 100, false);
                contextForeground.stroke();
                contextForeground.restore();
            }
        }
        /////SWITCHES/////
        var wasPointer = hardware.mouse.cursor != "default" || gui.controlCenter;
        Object.keys(switches).forEach(function (key) {
            Object.keys(switches[key]).forEach(function (side) {
                contextForeground.save();
                contextForeground.beginPath();
                contextForeground.arc(background.x + switches[key][side].x, background.y + switches[key][side].y, switchParams.radius, 0, 2 * Math.PI);
                if (!wasPointer && contextForeground.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && !hardware.mouse.isDrag) {
                    hardware.mouse.cursor = "pointer";
                }
                contextForeground.restore();
            });
        });
        Object.keys(switches).forEach(function (key) {
            Object.keys(switches[key]).forEach(function (side) {
                contextForeground.save();
                contextForeground.beginPath();
                contextForeground.arc(background.x + switches[key][side].x, background.y + switches[key][side].y, switchParams.radius, 0, 2 * Math.PI);
                if (hardware.mouse.isHold && contextForeground.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && !inTrain) {
                    if (clickTimeOut !== undefined && clickTimeOut !== null) {
                        clearTimeout(clickTimeOut);
                        clickTimeOut = null;
                    }
                    clickTimeOut = setTimeout(function () {
                        clickTimeOut = null;
                        hardware.mouse.isHold = false;
                        switchActions.turn(key, side);
                    }, hardware.lastInputTouch > hardware.lastInputMouse ? doubleTouchWaitTime : 0);
                    contextForeground.restore();
                }
                else if (!hardware.mouse.isHold && switches[key][side].lastStateChange != undefined && frameNo - switches[key][side].lastStateChange < switchParams.showDuration) {
                    contextForeground.fillStyle = switches[key][side].turned ? "rgba(144, 255, 144,1)" : "rgba(255,0,0,1)";
                    contextForeground.fill();
                    contextForeground.restore();
                }
                else if (!hardware.mouse.isHold && switches[key][side].lastStateChange != undefined && frameNo - switches[key][side].lastStateChange < switchParams.showDurationFade) {
                    contextForeground.restore();
                    contextForeground.save();
                    contextForeground.beginPath();
                    var fac = 1 - (frameNo - switchParams.showDuration - switches[key][side].lastStateChange) / (switchParams.showDurationFade - switchParams.showDuration);
                    contextForeground.fillStyle = switches[key][side].turned ? "rgba(144, 255, 144," + fac + ")" : "rgba(255,0,0," + fac + ")";
                    contextForeground.arc(background.x + switches[key][side].x, background.y + switches[key][side].y, fac * switchParams.radius, 0, 2 * Math.PI);
                    contextForeground.fill();
                    contextForeground.restore();
                }
                else if ((client.chosenInputMethod == "mouse" && !wasPointer && !hardware.mouse.isHold && (switches[key][side].lastStateChange == undefined || frameNo - switches[key][side].lastStateChange > switchParams.showDurationEnd) && contextForeground.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY)) || (hardware.mouse.isHold && hardware.mouse.cursor == "default" && (clickTimeOut === null || clickTimeOut === undefined))) {
                    contextForeground.restore();
                    contextForeground.save();
                    contextForeground.lineWidth = 5;
                    contextForeground.translate(background.x + switches[key][side].x, background.y + switches[key][side].y);
                    if (switches[key][side].turned) {
                        switchesLocate(switches[key][side].angles.normal, 0.9 * switchParams.radius, "rgba(255, 235, 235, 1)");
                        switchesLocate(switches[key][side].angles.turned, 1.25 * switchParams.radius, "rgba(170, 255, 170,1)");
                    }
                    else {
                        switchesLocate(switches[key][side].angles.turned, 0.9 * switchParams.radius, "rgba(235, 255, 235, 1)");
                        switchesLocate(switches[key][side].angles.normal, 1.25 * switchParams.radius, "rgba(255,40,40,1)");
                    }
                    contextForeground.save();
                    contextForeground.beginPath();
                    contextForeground.lineWidth = 5;
                    contextForeground.arc(0, 0, 0.2 * switchParams.radius + (konamiState < 0 ? Math.random() * 0.3 * switchParams.radius : 0), 0, 2 * Math.PI);
                    contextForeground.fillStyle = switches[key][side].turned ? "rgba(144, 238, 144,1)" : "rgba(255,0,0,1)";
                    contextForeground.fill();
                    contextForeground.restore();
                    contextForeground.restore();
                    if (APP_DATA.debug && debug.paint) {
                        contextForeground.save();
                        contextForeground.beginPath();
                        contextForeground.lineWidth = 1;
                        contextForeground.arc(background.x + switches[key][side].x, background.y + switches[key][side].y, switchParams.radius, 0, 2 * Math.PI);
                        contextForeground.closePath();
                        contextForeground.strokeStyle = switches[key][side].turned ? "rgba(144, 238, 144,1)" : "rgba(255,0,0,1)";
                        contextForeground.stroke();
                        contextForeground.restore();
                    }
                }
                else {
                    if (gui.infoOverlay && (menus.infoOverlay.focus == undefined || menus.infoOverlay.focus == 8)) {
                        contextForeground.save();
                        var textWidth = background.width / 100;
                        contextForeground.translate(background.x + switches[key][side].x, background.y + switches[key][side].y);
                        contextForeground.beginPath();
                        contextForeground.fillStyle = "#bb4220";
                        contextForeground.strokeStyle = "darkred";
                        contextForeground.arc(0, 0, textWidth * 1.1 * menus.infoOverlay.scaleFac, 0, 2 * Math.PI);
                        contextForeground.fill();
                        contextForeground.stroke();
                        contextForeground.font = measureFontSize("8", "monospace", 100, textWidth, 5, textWidth / 10);
                        contextForeground.fillStyle = "black";
                        contextForeground.textAlign = "center";
                        contextForeground.textBaseline = "middle";
                        var metrics = contextForeground.measureText("8");
                        if (metrics.actualBoundingBoxAscent != undefined && metrics.actualBoundingBoxDescent != undefined) {
                            contextForeground.fillText("8", 0, (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2);
                        }
                        else {
                            contextForeground.fillText("8", 0, 0);
                        }
                        contextForeground.restore();
                    }
                    contextForeground.restore();
                }
            });
        });
        /////DEBUG/////
        if (APP_DATA.debug && debug.paint && debug.trainReady) {
            context.save();
            context.setTransform(client.zoomAndTilt.realScale, 0, 0, client.zoomAndTilt.realScale, (-(client.zoomAndTilt.realScale - 1) * canvas.width) / 2 + client.zoomAndTilt.offsetX, (-(client.zoomAndTilt.realScale - 1) * canvas.height) / 2 + client.zoomAndTilt.offsetY);
            debug.drawPoints.forEach(function (point) {
                var c = Math.max(Math.round(100 * (100 - 100 * point.weight)) / 100, 0);
                context.fillStyle = "rgb(" + c + "," + c + "," + c + ")";
                context.fillRect(point.x - 3, point.y - 3, 6, 6);
            });
            context.restore();
            if (client.zoomAndTilt.realScale > 1) {
                context.save();
                context.fillStyle = "violet";
                context.fillRect(client.zoomAndTilt.pinchX - 10, client.zoomAndTilt.pinchY - 10, 20, 20);
                context.restore();
            }
            context.save();
            context.lineWidth = 5;
            context.strokeStyle = "red";
            context.fillStyle = "blue";
            var debugPoints = [rotationPoints.inner.narrow, rotationPoints.inner.wide, rotationPoints.outer.narrow];
            for (var debugPoint in debugPoints) {
                context.save();
                for (var debugPointI in debugPoints[debugPoint].x) {
                    context.beginPath();
                    context.arc(debugPoints[debugPoint].x[debugPointI] + background.x, debugPoints[debugPoint].y[debugPointI] + background.y, background.width / 100, 0, 2 * Math.PI);
                    context.fill();
                }
                context.restore();
                context.save();
                context.beginPath();
                context.moveTo(debugPoints[debugPoint].x[0] + background.x, debugPoints[debugPoint].y[0] + background.y);
                context.lineTo(debugPoints[debugPoint].x[1] + background.x, debugPoints[debugPoint].y[1] + background.y);
                context.stroke();
                context.restore();
                context.save();
                context.beginPath();
                context.moveTo(debugPoints[debugPoint].x[2] + background.x, debugPoints[debugPoint].y[2] + background.y);
                context.lineTo(debugPoints[debugPoint].x[3] + background.x, debugPoints[debugPoint].y[3] + background.y);
                context.stroke();
                context.restore();
                context.save();
                context.beginPath();
                context.moveTo(debugPoints[debugPoint].x[1] + background.x, debugPoints[debugPoint].y[1] + background.y);
                context.bezierCurveTo(debugPoints[debugPoint].x[4] + background.x, debugPoints[debugPoint].y[4] + background.y, debugPoints[debugPoint].x[5] + background.x, debugPoints[debugPoint].y[5] + background.y, debugPoints[debugPoint].x[2] + background.x, debugPoints[debugPoint].y[2] + background.y);
                context.stroke();
                context.restore();
                context.save();
                context.beginPath();
                context.moveTo(debugPoints[debugPoint].x[3] + background.x, debugPoints[debugPoint].y[3] + background.y);
                context.bezierCurveTo(debugPoints[debugPoint].x[6] + background.x, debugPoints[debugPoint].y[6] + background.y, debugPoints[debugPoint].x[7] + background.x, debugPoints[debugPoint].y[7] + background.y, debugPoints[debugPoint].x[0] + background.x, debugPoints[debugPoint].y[0] + background.y);
                context.stroke();
                context.restore();
            }
            context.save();
            context.beginPath();
            context.moveTo(rotationPoints.outer.narrow.x[1] + background.x, rotationPoints.outer.narrow.y[1] + background.y);
            context.bezierCurveTo(rotationPoints.inner2outer.right.x[1] + background.x, rotationPoints.inner2outer.right.y[1] + background.y, rotationPoints.inner2outer.right.x[2] + background.x, rotationPoints.inner2outer.right.y[2] + background.y, rotationPoints.inner.narrow.x[2] + background.x, rotationPoints.inner.narrow.y[2] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.inner.narrow.x[3] + background.x, rotationPoints.inner.narrow.y[3] + background.y);
            context.bezierCurveTo(rotationPoints.inner2outer.left.x[1] + background.x, rotationPoints.inner2outer.left.y[1] + background.y, rotationPoints.inner2outer.left.x[2] + background.x, rotationPoints.inner2outer.left.y[2] + background.y, rotationPoints.outer.narrow.x[0] + background.x, rotationPoints.outer.narrow.y[0] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.outer.altState3.left.x[1] + background.x, rotationPoints.outer.altState3.left.y[1] + background.y);
            context.lineTo(rotationPoints.outer.altState3.right.x[1] + background.x, rotationPoints.outer.altState3.right.y[1] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.outer.altState3.left.x[0] + background.x, rotationPoints.outer.altState3.left.y[0] + background.y);
            context.bezierCurveTo(rotationPoints.outer.altState3.left.x[3] + background.x, rotationPoints.outer.altState3.left.y[3] + background.y, rotationPoints.outer.altState3.left.x[3] + background.x, rotationPoints.outer.altState3.left.y[3] + background.y, rotationPoints.outer.altState3.left.x[2] + background.x, rotationPoints.outer.altState3.left.y[2] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.outer.altState3.left.x[2] + background.x, rotationPoints.outer.altState3.left.y[2] + background.y);
            context.bezierCurveTo(rotationPoints.outer.altState3.left.x[4] + background.x, rotationPoints.outer.altState3.left.y[4] + background.y, rotationPoints.outer.altState3.left.x[4] + background.x, rotationPoints.outer.altState3.left.y[4] + background.y, rotationPoints.outer.altState3.left.x[1] + background.x, rotationPoints.outer.altState3.left.y[1] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.outer.altState3.right.x[0] + background.x, rotationPoints.outer.altState3.right.y[0] + background.y);
            context.bezierCurveTo(rotationPoints.outer.altState3.right.x[3] + background.x, rotationPoints.outer.altState3.right.y[3] + background.y, rotationPoints.outer.altState3.right.x[3] + background.x, rotationPoints.outer.altState3.right.y[3] + background.y, rotationPoints.outer.altState3.right.x[2] + background.x, rotationPoints.outer.altState3.right.y[2] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.outer.altState3.right.x[2] + background.x, rotationPoints.outer.altState3.right.y[2] + background.y);
            context.bezierCurveTo(rotationPoints.outer.altState3.right.x[4] + background.x, rotationPoints.outer.altState3.right.y[4] + background.y, rotationPoints.outer.altState3.right.x[4] + background.x, rotationPoints.outer.altState3.right.y[4] + background.y, rotationPoints.outer.altState3.right.x[1] + background.x, rotationPoints.outer.altState3.right.y[1] + background.y);
            context.stroke();
            for (var debugPointI in rotationPoints.outer.altState3.left.x) {
                context.beginPath();
                context.arc(rotationPoints.outer.altState3.left.x[debugPointI] + background.x, rotationPoints.outer.altState3.left.y[debugPointI] + background.y, background.width / 100, 0, 2 * Math.PI);
                context.arc(rotationPoints.outer.altState3.right.x[debugPointI] + background.x, rotationPoints.outer.altState3.right.y[debugPointI] + background.y, background.width / 100, 0, 2 * Math.PI);
                context.fill();
            }
            context.beginPath();
            context.moveTo(rotationPoints.outer.rightSiding.enter.x[0] + background.x, rotationPoints.outer.rightSiding.enter.y[0] + background.y);
            context.lineTo(rotationPoints.outer.rightSiding.enter.x[1] + background.x, rotationPoints.outer.rightSiding.enter.y[1] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.outer.rightSiding.curve.x[0] + background.x, rotationPoints.outer.rightSiding.curve.y[0] + background.y);
            context.bezierCurveTo(rotationPoints.outer.rightSiding.curve.x[1] + background.x, rotationPoints.outer.rightSiding.curve.y[1] + background.y, rotationPoints.outer.rightSiding.curve.x[2] + background.x, rotationPoints.outer.rightSiding.curve.y[2] + background.y, rotationPoints.outer.rightSiding.curve.x[3] + background.x, rotationPoints.outer.rightSiding.curve.y[3] + background.y);
            context.stroke();
            context.beginPath();
            context.arc(rotationPoints.outer.rightSiding.curve.x[0] + background.x, rotationPoints.outer.rightSiding.curve.x[0] + background.y, background.width / 100, 0, 2 * Math.PI);
            context.arc(rotationPoints.outer.rightSiding.curve.x[1] + background.x, rotationPoints.outer.rightSiding.curve.y[1] + background.y, background.width / 100, 0, 2 * Math.PI);
            context.fill();
            context.beginPath();
            context.moveTo(rotationPoints.outer.rightSiding.end.x[0] + background.x, rotationPoints.outer.rightSiding.end.y[0] + background.y);
            context.lineTo(rotationPoints.outer.rightSiding.end.x[1] + background.x, rotationPoints.outer.rightSiding.end.y[1] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.outer.rightSiding.continueCurve0.x[0] + background.x, rotationPoints.outer.rightSiding.continueCurve0.y[0] + background.y);
            context.bezierCurveTo(rotationPoints.outer.rightSiding.continueCurve0.x[1] + background.x, rotationPoints.outer.rightSiding.continueCurve0.y[1] + background.y, rotationPoints.outer.rightSiding.continueCurve0.x[2] + background.x, rotationPoints.outer.rightSiding.continueCurve0.y[2] + background.y, rotationPoints.outer.rightSiding.continueCurve0.x[3] + background.x, rotationPoints.outer.rightSiding.continueCurve0.y[3] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.outer.rightSiding.continueLine0.x[0] + background.x, rotationPoints.outer.rightSiding.continueLine0.y[0] + background.y);
            context.lineTo(rotationPoints.outer.rightSiding.continueLine0.x[1] + background.x, rotationPoints.outer.rightSiding.continueLine0.y[1] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.outer.rightSiding.continueCurve1.x[0] + background.x, rotationPoints.outer.rightSiding.continueCurve1.y[0] + background.y);
            context.bezierCurveTo(rotationPoints.outer.rightSiding.continueCurve1.x[1] + background.x, rotationPoints.outer.rightSiding.continueCurve1.y[1] + background.y, rotationPoints.outer.rightSiding.continueCurve1.x[2] + background.x, rotationPoints.outer.rightSiding.continueCurve1.y[2] + background.y, rotationPoints.outer.rightSiding.continueCurve1.x[3] + background.x, rotationPoints.outer.rightSiding.continueCurve1.y[3] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.outer.rightSiding.continueLine1.x[0] + background.x, rotationPoints.outer.rightSiding.continueLine1.y[0] + background.y);
            context.lineTo(rotationPoints.outer.rightSiding.continueLine1.x[1] + background.x, rotationPoints.outer.rightSiding.continueLine1.y[1] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.outer.rightSiding.continueCurve2.x[0] + background.x, rotationPoints.outer.rightSiding.continueCurve2.y[0] + background.y);
            context.bezierCurveTo(rotationPoints.outer.rightSiding.continueCurve2.x[1] + background.x, rotationPoints.outer.rightSiding.continueCurve2.y[1] + background.y, rotationPoints.outer.rightSiding.continueCurve2.x[2] + background.x, rotationPoints.outer.rightSiding.continueCurve2.y[2] + background.y, rotationPoints.outer.rightSiding.continueCurve2.x[3] + background.x, rotationPoints.outer.rightSiding.continueCurve2.y[3] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.outer.rightSiding.rejoin.x[0] + background.x, rotationPoints.outer.rightSiding.rejoin.y[0] + background.y);
            context.lineTo(rotationPoints.outer.rightSiding.rejoin.x[1] + background.x, rotationPoints.outer.rightSiding.rejoin.y[1] + background.y);
            context.stroke();
            context.strokeStyle = "rgba(175,0,0," + (switches.sidings1.left.turned && switches.sidings2.left.turned ? "1" : "0.3") + ")";
            context.beginPath();
            context.moveTo(rotationPoints.inner.sidings.first.x[0] + background.x, rotationPoints.inner.sidings.first.y[0] + background.y);
            context.bezierCurveTo(rotationPoints.inner.sidings.first.x[1] + background.x, rotationPoints.inner.sidings.first.y[1] + background.y, rotationPoints.inner.sidings.first.x[2] + background.x, rotationPoints.inner.sidings.first.y[2] + background.y, rotationPoints.inner.sidings.first.x[3] + background.x, rotationPoints.inner.sidings.first.y[3] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.inner.sidings.firstS1.x[0] + background.x, rotationPoints.inner.sidings.firstS1.y[0] + background.y);
            context.lineTo(rotationPoints.inner.sidings.firstS1.x[1] + background.x, rotationPoints.inner.sidings.firstS1.y[1] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.inner.sidings.firstS2.x[0] + background.x, rotationPoints.inner.sidings.firstS2.y[0] + background.y);
            context.bezierCurveTo(rotationPoints.inner.sidings.firstS2.x[1] + background.x, rotationPoints.inner.sidings.firstS2.y[1] + background.y, rotationPoints.inner.sidings.firstS2.x[2] + background.x, rotationPoints.inner.sidings.firstS2.y[2] + background.y, rotationPoints.inner.sidings.firstS2.x[3] + background.x, rotationPoints.inner.sidings.firstS2.y[3] + background.y);
            context.stroke();
            context.strokeStyle = "rgba(150,0,0," + (switches.sidings1.left.turned && !switches.sidings2.left.turned && switches.sidings3.left.turned ? "1" : "0.3") + ")";
            context.beginPath();
            context.moveTo(rotationPoints.inner.sidings.second.x[0] + background.x, rotationPoints.inner.sidings.second.y[0] + background.y);
            context.bezierCurveTo(rotationPoints.inner.sidings.second.x[1] + background.x, rotationPoints.inner.sidings.second.y[1] + background.y, rotationPoints.inner.sidings.second.x[2] + background.x, rotationPoints.inner.sidings.second.y[2] + background.y, rotationPoints.inner.sidings.second.x[3] + background.x, rotationPoints.inner.sidings.second.y[3] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.inner.sidings.secondS1.x[0] + background.x, rotationPoints.inner.sidings.secondS1.y[0] + background.y);
            context.lineTo(rotationPoints.inner.sidings.secondS1.x[1] + background.x, rotationPoints.inner.sidings.secondS1.y[1] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.inner.sidings.secondS2.x[0] + background.x, rotationPoints.inner.sidings.secondS2.y[0] + background.y);
            context.bezierCurveTo(rotationPoints.inner.sidings.secondS2.x[1] + background.x, rotationPoints.inner.sidings.secondS2.y[1] + background.y, rotationPoints.inner.sidings.secondS2.x[2] + background.x, rotationPoints.inner.sidings.secondS2.y[2] + background.y, rotationPoints.inner.sidings.secondS2.x[3] + background.x, rotationPoints.inner.sidings.secondS2.y[3] + background.y);
            context.stroke();
            context.beginPath();
            context.strokeStyle = "rgba(125,0,0," + (switches.sidings1.left.turned && !switches.sidings2.left.turned && !switches.sidings3.left.turned ? "1" : "0.3") + ")";
            context.beginPath();
            context.moveTo(rotationPoints.inner.sidings.third.x[0] + background.x, rotationPoints.inner.sidings.third.y[0] + background.y);
            context.bezierCurveTo(rotationPoints.inner.sidings.third.x[1] + background.x, rotationPoints.inner.sidings.third.y[1] + background.y, rotationPoints.inner.sidings.third.x[2] + background.x, rotationPoints.inner.sidings.third.y[2] + background.y, rotationPoints.inner.sidings.third.x[3] + background.x, rotationPoints.inner.sidings.third.y[3] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.inner.sidings.thirdS1.x[0] + background.x, rotationPoints.inner.sidings.thirdS1.y[0] + background.y);
            context.lineTo(rotationPoints.inner.sidings.thirdS1.x[1] + background.x, rotationPoints.inner.sidings.thirdS1.y[1] + background.y);
            context.stroke();
            context.beginPath();
            context.moveTo(rotationPoints.inner.sidings.thirdS2.x[0] + background.x, rotationPoints.inner.sidings.thirdS2.y[0] + background.y);
            context.bezierCurveTo(rotationPoints.inner.sidings.thirdS2.x[1] + background.x, rotationPoints.inner.sidings.thirdS2.y[1] + background.y, rotationPoints.inner.sidings.thirdS2.x[2] + background.x, rotationPoints.inner.sidings.thirdS2.y[2] + background.y, rotationPoints.inner.sidings.thirdS2.x[3] + background.x, rotationPoints.inner.sidings.thirdS2.y[3] + background.y);
            context.stroke();
            context.restore();
            context.save();
            context.fillStyle = "yellow";
            context.beginPath();
            context.arc(switches.outer2inner.right.x + background.x, switches.outer2inner.right.y / switchParams.beforeFac + background.y, background.width / 100, 0, 2 * Math.PI);
            context.fill();
            context.beginPath();
            context.arc(switches.outer2inner.left.x + background.x, switches.outer2inner.left.y / switchParams.beforeFac + background.y, background.width / 100, 0, 2 * Math.PI);
            context.fill();
            context.beginPath();
            context.arc(switches.innerWide.right.x + background.x, switches.innerWide.right.y * switchParams.beforeFac + background.y, background.width / 100, 0, 2 * Math.PI);
            context.fill();
            context.beginPath();
            context.arc(switches.innerWide.left.x + background.x, switches.innerWide.left.y * switchParams.beforeFac + background.y, background.width / 100, 0, 2 * Math.PI);
            context.fill();
            context.restore();
            if (switchParams.beforeAddSidings && switchParams.beforeAddSidings.length >= 2) {
                context.save();
                context.strokeStyle = "orange";
                context.lineWidth = 3;
                context.beginPath();
                context.moveTo(switches.sidings2.left.x + background.x - background.width / 20, switches.sidings2.left.y + background.y + switchParams.beforeAddSidings[0]);
                context.lineTo(switches.sidings2.left.x + background.x, switches.sidings2.left.y + background.y + switchParams.beforeAddSidings[0]);
                context.stroke();
                context.beginPath();
                context.moveTo(switches.sidings3.left.x + background.x - background.width / 20, switches.sidings3.left.y + background.y + switchParams.beforeAddSidings[1]);
                context.lineTo(switches.sidings3.left.x + background.x, switches.sidings3.left.y + background.y + switchParams.beforeAddSidings[1]);
                context.stroke();
                context.restore();
            }
            context.lineWidth = 2;
            context.fillStyle = "black";
            context.strokeStyle = "black";
            for (var debugTrain in trains) {
                context.save();
                context.translate(trains[debugTrain].x, trains[debugTrain].y);
                context.rotate(trains[debugTrain].displayAngle);
                context.strokeRect(-trains[debugTrain].width / 2, -trains[debugTrain].height / 2, trains[debugTrain].width, trains[debugTrain].height);
                context.restore();
                context.save();
                context.translate(trains[debugTrain].front.x, trains[debugTrain].front.y);
                context.rotate(trains[debugTrain].front.angle);
                context.beginPath();
                context.arc(0, -trains[debugTrain].height / 2, background.width / 200, 0, 2 * Math.PI);
                context.arc(0, 0, background.width / 200, 0, 2 * Math.PI);
                context.arc(0, trains[debugTrain].height / 2, background.width / 200, 0, 2 * Math.PI);
                context.fill();
                context.restore();
                context.save();
                context.translate(trains[debugTrain].back.x, trains[debugTrain].back.y);
                context.rotate(trains[debugTrain].back.angle);
                context.beginPath();
                context.arc(0, -trains[debugTrain].height / 2, background.width / 200, 0, 2 * Math.PI);
                context.arc(0, 0, background.width / 200, 0, 2 * Math.PI);
                context.arc(0, trains[debugTrain].height / 2, background.width / 200, 0, 2 * Math.PI);
                context.fill();
                context.restore();
                context.save();
                context.translate(trains[debugTrain].x, trains[debugTrain].y);
                context.rotate(trains[debugTrain].displayAngle);
                context.translate(trains[debugTrain].width / 2, 0);
                context.beginPath();
                context.moveTo(0, -(background.width * (trainParams.trackWidth / 2)));
                context.lineTo(0, background.width * (trainParams.trackWidth / 2));
                context.lineWidth = background.width / 150;
                context.strokeStyle = "orange";
                context.stroke();
                context.restore();
                if ((_a = trains[debugTrain].wheels) === null || _a === void 0 ? void 0 : _a.front) {
                    context.save();
                    context.translate(trains[debugTrain].wheels.front.leftX, trains[debugTrain].wheels.front.leftY);
                    context.beginPath();
                    context.arc(0, 0, background.width / 400, 0, 2 * Math.PI);
                    context.fillStyle = "#ffff00";
                    context.fill();
                    context.restore();
                    context.save();
                    context.translate(trains[debugTrain].wheels.front.rightX, trains[debugTrain].wheels.front.rightY);
                    context.beginPath();
                    context.arc(0, 0, background.width / 400, 0, 2 * Math.PI);
                    context.fillStyle = "#dddd00";
                    context.fill();
                    context.restore();
                }
                if ((_b = trains[debugTrain].wheels) === null || _b === void 0 ? void 0 : _b.back) {
                    context.save();
                    context.translate(trains[debugTrain].wheels.back.leftX, trains[debugTrain].wheels.back.leftY);
                    context.beginPath();
                    context.arc(0, 0, background.width / 400, 0, 2 * Math.PI);
                    context.fillStyle = "#bbbb00";
                    context.fill();
                    context.restore();
                    context.save();
                    context.translate(trains[debugTrain].wheels.back.rightX, trains[debugTrain].wheels.back.rightY);
                    context.beginPath();
                    context.arc(0, 0, background.width / 400, 0, 2 * Math.PI);
                    context.fillStyle = "#999900";
                    context.fill();
                    context.restore();
                }
                for (var debugTrainCar in trains[debugTrain].cars) {
                    context.save();
                    context.translate(trains[debugTrain].cars[debugTrainCar].x, trains[debugTrain].cars[debugTrainCar].y);
                    context.rotate(trains[debugTrain].cars[debugTrainCar].displayAngle);
                    context.strokeRect(-trains[debugTrain].cars[debugTrainCar].width / 2, -trains[debugTrain].cars[debugTrainCar].height / 2, trains[debugTrain].cars[debugTrainCar].width, trains[debugTrain].cars[debugTrainCar].height);
                    context.restore();
                    context.save();
                    context.translate(trains[debugTrain].cars[debugTrainCar].front.x, trains[debugTrain].cars[debugTrainCar].front.y);
                    context.rotate(trains[debugTrain].cars[debugTrainCar].front.angle);
                    context.beginPath();
                    context.arc(0, -trains[debugTrain].cars[debugTrainCar].height / 2, background.width / 200, 0, 2 * Math.PI);
                    context.arc(0, 0, background.width / 200, 0, 2 * Math.PI);
                    context.arc(0, trains[debugTrain].cars[debugTrainCar].height / 2, background.width / 200, 0, 2 * Math.PI);
                    context.fill();
                    context.restore();
                    context.save();
                    context.translate(trains[debugTrain].cars[debugTrainCar].back.x, trains[debugTrain].cars[debugTrainCar].back.y);
                    context.rotate(trains[debugTrain].cars[debugTrainCar].back.angle);
                    context.beginPath();
                    context.arc(0, -trains[debugTrain].cars[debugTrainCar].height / 2, background.width / 200, 0, 2 * Math.PI);
                    context.arc(0, 0, background.width / 200, 0, 2 * Math.PI);
                    context.arc(0, trains[debugTrain].cars[debugTrainCar].height / 2, background.width / 200, 0, 2 * Math.PI);
                    context.fill();
                    context.restore();
                    if ((_c = trains[debugTrain].cars[debugTrainCar].wheels) === null || _c === void 0 ? void 0 : _c.front) {
                        context.save();
                        context.translate(trains[debugTrain].cars[debugTrainCar].wheels.front.leftX, trains[debugTrain].cars[debugTrainCar].wheels.front.leftY);
                        context.beginPath();
                        context.arc(0, 0, background.width / 400, 0, 2 * Math.PI);
                        context.fillStyle = "#ffff00";
                        context.fill();
                        context.restore();
                        context.save();
                        context.translate(trains[debugTrain].cars[debugTrainCar].wheels.front.rightX, trains[debugTrain].cars[debugTrainCar].wheels.front.rightY);
                        context.beginPath();
                        context.arc(0, 0, background.width / 400, 0, 2 * Math.PI);
                        context.fillStyle = "#dddd00";
                        context.fill();
                        context.restore();
                    }
                    if ((_d = trains[debugTrain].cars[debugTrainCar].wheels) === null || _d === void 0 ? void 0 : _d.back) {
                        context.save();
                        context.translate(trains[debugTrain].cars[debugTrainCar].wheels.back.leftX, trains[debugTrain].cars[debugTrainCar].wheels.back.leftY);
                        context.beginPath();
                        context.arc(0, 0, background.width / 400, 0, 2 * Math.PI);
                        context.fillStyle = "#bbbb00";
                        context.fill();
                        context.restore();
                        context.save();
                        context.translate(trains[debugTrain].cars[debugTrainCar].wheels.back.rightX, trains[debugTrain].cars[debugTrainCar].wheels.back.rightY);
                        context.beginPath();
                        context.arc(0, 0, background.width / 400, 0, 2 * Math.PI);
                        context.fillStyle = "#999900";
                        context.fill();
                        context.restore();
                    }
                }
                context.save();
                context.translate(trains[debugTrain].outerX, trains[debugTrain].outerY);
                context.beginPath();
                context.arc(0, 0, background.width / 450, 0, 2 * Math.PI);
                context.fillStyle = "green";
                context.fill();
                context.restore();
            }
            debug.drawPointsCrash.forEach(function (point) {
                context.fillStyle = "rgb(" + Math.round(100 + Math.random() * 155) + "," + Math.round(100 + Math.random() * 155) + "," + Math.round(100 + Math.random() * 155) + ")";
                context.fillRect(point.x - 4, point.y - 4, 8, 8);
            });
            context.restore();
        }
    }
    /////CONTROL CENTER/////
    if ((client.zoomAndTilt.realScale == 1 || gui.three) && gui.controlCenter) {
        var colorLight = "floralwhite";
        var colorDark = "rgb(120,120,120)";
        var colorBorder = "rgba(255,255,255,0.7)";
        var contextClick = controlCenter.mouse.clickEvent && Math.abs(hardware.mouse.downX - hardware.mouse.upX) < canvas.width / 100 && Math.abs(hardware.mouse.downY - hardware.mouse.upY) < canvas.width / 100;
        controlCenter.mouse.clickEvent = false;
        hardware.mouse.cursor = "default";
        contextForeground.save();
        contextForeground.textBaseline = "middle";
        contextForeground.translate(background.x + controlCenter.translateOffset, background.y + controlCenter.translateOffset);
        contextForeground.fillStyle = "rgba(0,0,0,0.5)";
        contextForeground.fillRect(0, 0, background.width - 2 * controlCenter.translateOffset, background.height - 2 * controlCenter.translateOffset);
        if (hardware.mouse.moveX > background.x + controlCenter.translateOffset && hardware.mouse.moveY > background.y + controlCenter.translateOffset && hardware.mouse.moveX < background.x + controlCenter.translateOffset + controlCenter.maxTextWidth / 8 && hardware.mouse.moveY < background.y + controlCenter.translateOffset + controlCenter.maxTextHeight) {
            hardware.mouse.cursor = "pointer";
        }
        contextForeground.fillStyle = "rgb(255,120,120)";
        contextForeground.strokeStyle = colorBorder;
        contextForeground.strokeRect(0, 0, controlCenter.maxTextWidth / 8, controlCenter.maxTextHeight);
        contextForeground.save();
        contextForeground.translate(controlCenter.maxTextWidth / 16, controlCenter.maxTextHeight / 2);
        contextForeground.rotate(-Math.PI / 2);
        contextForeground.font = controlCenter.fontSizes.closeTextHeight + "px " + controlCenter.fontFamily;
        contextForeground.fillText(getString("generalClose", "", "upper"), -controlCenter.maxTextHeight / 2 + (controlCenter.maxTextHeight / 2 - contextForeground.measureText(getString("generalClose", "", "upper")).width / 2), controlCenter.fontSizes.closeTextHeight / 6);
        contextForeground.restore();
        if (contextClick && hardware.mouse.upX - background.x - controlCenter.translateOffset > 0 && hardware.mouse.upX - background.x - controlCenter.translateOffset < controlCenter.maxTextWidth / 8 && hardware.mouse.upY - background.y - controlCenter.translateOffset > 0 && hardware.mouse.upY - background.y - controlCenter.translateOffset < controlCenter.maxTextHeight * trains.length) {
            gui.controlCenter = false;
            controlCenter.mouse.wheelScrolls = false;
            if (gui.infoOverlay) {
                drawMenu("items-change");
            }
        }
        /////CONTROL CENTER/Cars/////
        if (controlCenter.showCarCenter) {
            if (carParams.init) {
                var maxTextHeight = controlCenter.maxTextHeight / (cars.length + 1);
                for (var cCar = -1; cCar < cars.length; cCar++) {
                    var cText, cTextHeight, cTextWidth;
                    if (cCar == -1) {
                        cText = getString("appScreenCarControlCenterAutoModeActivate");
                        cTextHeight = controlCenter.fontSizes.carSizes.init.autoModeActivate;
                        cTextWidth = controlCenter.fontSizes.carSizes.init.autoModeActivateLength;
                    }
                    else {
                        cText = formatJSString(getString("appScreenCarControlCenterStartCar"), getString(["appScreenCarNames", cCar]));
                        cTextHeight = controlCenter.fontSizes.carSizes.init.carNames[cCar];
                        cTextWidth = controlCenter.fontSizes.carSizes.init.carNamesLength[cCar];
                    }
                    contextForeground.font = cTextHeight + "px " + controlCenter.fontFamily;
                    contextForeground.fillStyle = colorLight;
                    contextForeground.fillText(cText, controlCenter.maxTextWidth / 8 + 0.9375 * controlCenter.maxTextWidth - cTextWidth / 2, maxTextHeight * (cCar + 1) + maxTextHeight / 2);
                    contextForeground.strokeStyle = colorLight;
                    contextForeground.strokeRect(controlCenter.maxTextWidth / 8, maxTextHeight * (cCar + 1), 1.875 * controlCenter.maxTextWidth, maxTextHeight);
                    if (hardware.mouse.moveX > background.x + controlCenter.translateOffset + controlCenter.maxTextWidth / 8 && hardware.mouse.moveY > background.y + controlCenter.translateOffset + maxTextHeight * (cCar + 1) && hardware.mouse.moveX < background.x + controlCenter.translateOffset + 2 * controlCenter.maxTextWidth && hardware.mouse.moveY < background.y + controlCenter.translateOffset + maxTextHeight * (cCar + 2)) {
                        hardware.mouse.cursor = "pointer";
                        if (contextClick && cCar == -1) {
                            carActions.auto.start();
                        }
                        else if (contextClick) {
                            carActions.manual.start(cCar);
                        }
                    }
                }
            }
            else if (carParams.autoModeOff) {
                var maxTextHeight = controlCenter.maxTextHeight / cars.length;
                for (var cCar = 0; cCar < cars.length; cCar++) {
                    var noCollisionCCar = !carCollisionCourse(cCar, false);
                    var noCollisionCCar2 = !carCollisionCourse(cCar, false, -1);
                    var cText = formatJSString(getString(["appScreenCarNames", cCar]));
                    contextForeground.font = controlCenter.fontSizes.carSizes.manual.carNames[cCar] + "px " + controlCenter.fontFamily;
                    contextForeground.fillStyle = colorLight;
                    contextForeground.fillText(cText, controlCenter.maxTextWidth / 8 + 0.5625 * controlCenter.maxTextWidth - controlCenter.fontSizes.carSizes.manual.carNamesLength[cCar] / 2, maxTextHeight * cCar + maxTextHeight / 2);
                    contextForeground.strokeStyle = colorLight;
                    contextForeground.strokeRect(controlCenter.maxTextWidth / 8, maxTextHeight * cCar, 1.125 * controlCenter.maxTextWidth, maxTextHeight);
                    var canMove = noCollisionCCar && (cars[cCar].backwardsState === undefined || cars[cCar].backwardsState === 0);
                    contextForeground.save();
                    contextForeground.translate(1.375 * controlCenter.maxTextWidth, maxTextHeight * cCar + maxTextHeight / 2);
                    contextForeground.strokeStyle = canMove ? (cars[cCar].move ? "rgb(255,180,180)" : "rgb(180,255,180)") : colorDark;
                    contextForeground.fillStyle = contextForeground.strokeStyle;
                    contextForeground.lineWidth = Math.ceil(maxTextHeight / 20);
                    contextForeground.beginPath();
                    contextForeground.moveTo(0, -maxTextHeight / 18);
                    contextForeground.lineTo(0, -maxTextHeight / 3);
                    contextForeground.stroke();
                    contextForeground.strokeStyle = canMove ? colorLight : colorDark;
                    contextForeground.beginPath();
                    contextForeground.rotate(-Math.PI / 2);
                    contextForeground.arc(0, 0, maxTextHeight / 3.5, 0.15 * Math.PI, 1.85 * Math.PI);
                    contextForeground.stroke();
                    contextForeground.restore();
                    contextForeground.strokeRect(1.25 * controlCenter.maxTextWidth, maxTextHeight * cCar, 0.25 * controlCenter.maxTextWidth, maxTextHeight);
                    if (canMove) {
                        if (hardware.mouse.moveX > background.x + controlCenter.translateOffset + controlCenter.maxTextWidth * 1.25 && hardware.mouse.moveY > background.y + controlCenter.translateOffset + maxTextHeight * cCar && hardware.mouse.moveX < background.x + controlCenter.translateOffset + 1.5 * controlCenter.maxTextWidth && hardware.mouse.moveY < background.y + controlCenter.translateOffset + maxTextHeight * (cCar + 1)) {
                            hardware.mouse.cursor = "pointer";
                            if (contextClick) {
                                if (cars[cCar].move) {
                                    carActions.manual.stop(cCar);
                                }
                                else {
                                    carActions.manual.start(cCar);
                                }
                            }
                        }
                    }
                    var canStepBack = !cars[cCar].move && cars[cCar].backwardsState === 0 && !(cars[cCar].cType == "start" && cars[cCar].counter == cars[cCar].startFrame) && noCollisionCCar2;
                    contextForeground.save();
                    contextForeground.translate(1.625 * controlCenter.maxTextWidth, maxTextHeight * cCar + maxTextHeight / 2);
                    contextForeground.rotate(Math.PI);
                    contextForeground.strokeStyle = canStepBack ? colorLight : colorDark;
                    contextForeground.fillStyle = contextForeground.strokeStyle;
                    contextForeground.lineWidth = Math.ceil(maxTextHeight / 5);
                    contextForeground.beginPath();
                    contextForeground.moveTo(-controlCenter.maxTextWidth * 0.075, 0);
                    contextForeground.lineTo(controlCenter.maxTextWidth * 0.051, 0);
                    contextForeground.stroke();
                    contextForeground.beginPath();
                    contextForeground.moveTo(controlCenter.maxTextWidth * 0.05, -0.25 * maxTextHeight);
                    contextForeground.lineTo(controlCenter.maxTextWidth * 0.05, 0.25 * maxTextHeight);
                    contextForeground.lineTo(controlCenter.maxTextWidth * 0.1, 0);
                    contextForeground.lineTo(controlCenter.maxTextWidth * 0.05, -0.25 * maxTextHeight);
                    contextForeground.fill();
                    contextForeground.restore();
                    contextForeground.strokeRect(1.5 * controlCenter.maxTextWidth, maxTextHeight * cCar, 0.25 * controlCenter.maxTextWidth, maxTextHeight);
                    if (canStepBack) {
                        if (hardware.mouse.moveX > background.x + controlCenter.translateOffset + controlCenter.maxTextWidth * 1.5 && hardware.mouse.moveY > background.y + controlCenter.translateOffset + maxTextHeight * cCar && hardware.mouse.moveX < background.x + controlCenter.translateOffset + 1.75 * controlCenter.maxTextWidth && hardware.mouse.moveY < background.y + controlCenter.translateOffset + maxTextHeight * (cCar + 1)) {
                            hardware.mouse.cursor = "pointer";
                            if (contextClick) {
                                carActions.manual.backwards(cCar);
                            }
                        }
                    }
                    var canBackToRoot = !cars[cCar].move && cars[cCar].backwardsState === 0 && !(cars[cCar].cType == "start" && cars[cCar].counter == cars[cCar].startFrame) && noCollisionCCar2;
                    contextForeground.save();
                    contextForeground.translate(1.75 * controlCenter.maxTextWidth, maxTextHeight * cCar);
                    contextForeground.strokeStyle = canBackToRoot ? "rgb(225,220,210)" : colorDark;
                    contextForeground.fillStyle = contextForeground.strokeStyle;
                    var maxHouseWidth = 4 * maxTextHeight;
                    contextForeground.translate((controlCenter.maxTextWidth / 4 - maxHouseWidth / 4) / 2, 0);
                    contextForeground.fillRect((5 * maxHouseWidth) / 64, maxHouseWidth / 8.1, (3 * maxHouseWidth) / 32, maxHouseWidth / 15.8);
                    contextForeground.fillStyle = canBackToRoot ? "rgb(255,180,180)" : colorDark;
                    contextForeground.fillRect(0.085 * maxHouseWidth, maxHouseWidth / 12, maxHouseWidth / 32, maxHouseWidth / 30);
                    contextForeground.beginPath();
                    contextForeground.moveTo((4.5 * maxHouseWidth) / 64, maxHouseWidth / 8);
                    contextForeground.lineTo((11.5 * maxHouseWidth) / 64, maxHouseWidth / 8);
                    contextForeground.lineTo(maxHouseWidth / 8, maxHouseWidth / 16);
                    contextForeground.lineTo((4.5 * maxHouseWidth) / 64, maxHouseWidth / 8);
                    contextForeground.fill();
                    contextForeground.closePath();
                    if (canBackToRoot) {
                        contextForeground.fillStyle = "rgb(70,121,70)";
                        contextForeground.fillRect((6 * maxHouseWidth) / 64, maxHouseWidth / 8.1 + maxHouseWidth / 31.6, maxHouseWidth / 32, maxHouseWidth / 31.6);
                        contextForeground.beginPath();
                        contextForeground.moveTo((6 * maxHouseWidth) / 64, maxHouseWidth / 8 + maxHouseWidth / 31.6);
                        contextForeground.arc((6 * maxHouseWidth) / 64 + maxHouseWidth / 63.2, maxHouseWidth / 8 + maxHouseWidth / 31.6, maxHouseWidth / 63.2, 0, Math.PI, true);
                        contextForeground.fill();
                    }
                    contextForeground.restore();
                    contextForeground.strokeRect(1.75 * controlCenter.maxTextWidth, maxTextHeight * cCar, 0.25 * controlCenter.maxTextWidth, maxTextHeight);
                    if (canBackToRoot) {
                        if (hardware.mouse.moveX > background.x + controlCenter.translateOffset + controlCenter.maxTextWidth * 1.75 && hardware.mouse.moveY > background.y + controlCenter.translateOffset + maxTextHeight * cCar && hardware.mouse.moveX < background.x + controlCenter.translateOffset + 2 * controlCenter.maxTextWidth && hardware.mouse.moveY < background.y + controlCenter.translateOffset + maxTextHeight * (cCar + 1)) {
                            hardware.mouse.cursor = "pointer";
                            if (contextClick) {
                                carActions.manual.park(cCar);
                            }
                        }
                    }
                }
            }
            else {
                var maxTextHeight = controlCenter.maxTextHeight / 2;
                for (var cCar = 0; cCar < 2; cCar++) {
                    var cText, cTextHeight, cTextWidth;
                    if (cCar == 0 && carParams.autoModeRuns) {
                        cText = getString("appScreenCarControlCenterAutoModePause");
                        cTextHeight = controlCenter.fontSizes.carSizes.auto.pause;
                        cTextWidth = controlCenter.fontSizes.carSizes.auto.pauseLength;
                    }
                    else if (cCar == 0) {
                        cText = getString("appScreenCarControlCenterAutoModeResume");
                        cTextHeight = controlCenter.fontSizes.carSizes.auto.resume;
                        cTextWidth = controlCenter.fontSizes.carSizes.auto.resumeLength;
                    }
                    else {
                        cText = getString("appScreenCarControlCenterAutoModeBackToRoot");
                        cTextHeight = controlCenter.fontSizes.carSizes.auto.backToRoot;
                        cTextWidth = controlCenter.fontSizes.carSizes.auto.backToRootLength;
                    }
                    contextForeground.font = cTextHeight + "px " + controlCenter.fontFamily;
                    contextForeground.fillStyle = colorLight;
                    if (hardware.mouse.moveX > background.x + controlCenter.translateOffset + controlCenter.maxTextWidth / 8 && hardware.mouse.moveY > background.y + controlCenter.translateOffset + maxTextHeight * cCar && hardware.mouse.moveX < background.x + controlCenter.translateOffset + 2 * controlCenter.maxTextWidth && hardware.mouse.moveY < background.y + controlCenter.translateOffset + maxTextHeight * (cCar + 1)) {
                        if (cCar == 0) {
                            hardware.mouse.cursor = "pointer";
                            if (contextClick && carParams.autoModeRuns) {
                                carActions.auto.pause();
                            }
                            else if (contextClick) {
                                carActions.auto.resume();
                            }
                        }
                        else if (cCar == 1) {
                            if (!carParams.autoModeRuns && !carParams.isBackToRoot) {
                                hardware.mouse.cursor = "pointer";
                                if (contextClick) {
                                    carActions.auto.end();
                                }
                            }
                        }
                    }
                    if (cCar == 1 && (carParams.autoModeRuns || carParams.isBackToRoot)) {
                        contextForeground.fillStyle = colorDark;
                    }
                    contextForeground.fillText(cText, controlCenter.maxTextWidth / 8 + 0.9375 * controlCenter.maxTextWidth - cTextWidth / 2, maxTextHeight * cCar + maxTextHeight / 2);
                    contextForeground.strokeStyle = colorLight;
                    contextForeground.strokeRect(controlCenter.maxTextWidth / 8, maxTextHeight * cCar, 1.875 * controlCenter.maxTextWidth, maxTextHeight);
                }
            }
            /////CONTROL CENTER/Trains/////
        }
        else {
            for (var cTrain = 0; cTrain < trains.length; cTrain++) {
                var maxTextHeight = controlCenter.maxTextHeight / trains.length;
                var noCollisionCTrain = !trains[cTrain].crash;
                if (noCollisionCTrain && hardware.mouse.moveX > background.x + controlCenter.translateOffset + controlCenter.maxTextWidth && hardware.mouse.moveY > background.y + controlCenter.translateOffset + maxTextHeight * cTrain && hardware.mouse.moveX < background.x + controlCenter.translateOffset + 1.75 * controlCenter.maxTextWidth && hardware.mouse.moveY < background.y + controlCenter.translateOffset + maxTextHeight * (cTrain + 1)) {
                    hardware.mouse.cursor = "pointer";
                }
                contextForeground.font = controlCenter.fontSizes.trainSizes.trainNames[cTrain] + "px " + controlCenter.fontFamily;
                contextForeground.fillStyle = colorLight;
                contextForeground.fillText(getString(["appScreenTrainNames", cTrain]), controlCenter.maxTextWidth / 8 + (0.875 * controlCenter.maxTextWidth) / 2 - controlCenter.fontSizes.trainSizes.trainNamesLength[cTrain] / 2, maxTextHeight * cTrain + maxTextHeight / 2);
                var cTrainPercent = trains[cTrain].speedInPercent == undefined || !trains[cTrain].move || trains[cTrain].accelerationSpeed < 0 ? 0 : Math.round(trains[cTrain].speedInPercent);
                contextForeground.fillStyle = contextForeground.strokeStyle = colorBorder;
                contextForeground.strokeRect(controlCenter.maxTextWidth / 8, maxTextHeight * cTrain, 0.875 * controlCenter.maxTextWidth, maxTextHeight);
                if (cTrainPercent == 0) {
                    contextForeground.fillStyle = noCollisionCTrain ? colorLight : colorDark;
                    contextForeground.font = controlCenter.fontSizes.trainSizes.speedTextHeight + "px " + controlCenter.fontFamily;
                    contextForeground.fillText(getString("appScreenControlCenterSpeedOff"), controlCenter.maxTextWidth + (controlCenter.maxTextWidth * 0.5) / 2 - contextForeground.measureText(getString("appScreenControlCenterSpeedOff")).width / 2, maxTextHeight * cTrain + maxTextHeight / 2);
                }
                contextForeground.fillRect(controlCenter.maxTextWidth, maxTextHeight * cTrain, (controlCenter.maxTextWidth * 0.5 * cTrainPercent) / 100, maxTextHeight);
                if (cTrainPercent > 0) {
                    contextForeground.fillStyle = colorDark;
                    contextForeground.font = controlCenter.fontSizes.trainSizes.speedTextHeight + "px " + controlCenter.fontFamily;
                    contextForeground.fillText(cTrainPercent + "%", controlCenter.maxTextWidth + (controlCenter.maxTextWidth * 0.5) / 2 - contextForeground.measureText(cTrainPercent + "%").width / 2, maxTextHeight * cTrain + maxTextHeight / 2);
                }
                var isClick = contextClick && hardware.mouse.upX - background.x - controlCenter.translateOffset > controlCenter.maxTextWidth && hardware.mouse.upX - background.x - controlCenter.translateOffset < controlCenter.maxTextWidth * 1.5 && hardware.mouse.upY - background.y - controlCenter.translateOffset > maxTextHeight * cTrain && hardware.mouse.upY - background.y - controlCenter.translateOffset < maxTextHeight * cTrain + maxTextHeight;
                var isHold = controlCenter.mouse.hold && hardware.mouse.downX - background.x - controlCenter.translateOffset > controlCenter.maxTextWidth && hardware.mouse.downX - background.x - controlCenter.translateOffset < controlCenter.maxTextWidth * 1.5 && hardware.mouse.downY - background.y - controlCenter.translateOffset > maxTextHeight * cTrain && hardware.mouse.downY - background.y - controlCenter.translateOffset < maxTextHeight * cTrain + maxTextHeight && hardware.mouse.moveX - background.x - controlCenter.translateOffset > controlCenter.maxTextWidth && hardware.mouse.moveX - background.x - controlCenter.translateOffset < controlCenter.maxTextWidth * 1.5 && hardware.mouse.moveY - background.y - controlCenter.translateOffset > maxTextHeight * cTrain && hardware.mouse.moveY - background.y - controlCenter.translateOffset < maxTextHeight * cTrain + maxTextHeight;
                if (noCollisionCTrain && (isClick || isHold || (controlCenter.mouse.wheelScrolls && hardware.mouse.wheelScrollY != 0 && hardware.mouse.wheelX - background.x - controlCenter.translateOffset > controlCenter.maxTextWidth && hardware.mouse.wheelX - background.x - controlCenter.translateOffset < controlCenter.maxTextWidth * 1.5 && hardware.mouse.wheelY - background.y - controlCenter.translateOffset > maxTextHeight * cTrain && hardware.mouse.wheelY - background.y - controlCenter.translateOffset < maxTextHeight * cTrain + maxTextHeight))) {
                    var newSpeed;
                    if (isClick || isHold) {
                        newSpeed = Math.round((((isClick ? hardware.mouse.upX : hardware.mouse.moveX) - background.x - controlCenter.translateOffset - controlCenter.maxTextWidth) / controlCenter.maxTextWidth / 0.5) * 100);
                        hardware.mouse.cursor = "grabbing";
                    }
                    else {
                        if (trains[cTrain].speedInPercent == undefined || trains[cTrain].speedInPercent < trainParams.minSpeed) {
                            newSpeed = trainParams.minSpeed;
                        }
                        else {
                            newSpeed = Math.round(trains[cTrain].speedInPercent * (hardware.mouse.wheelScrollY < 0 ? 1.1 : 0.9));
                        }
                    }
                    if (newSpeed > 95) {
                        newSpeed = 100;
                    }
                    trainActions.setSpeed(cTrain, newSpeed, true);
                }
                contextForeground.strokeRect(controlCenter.maxTextWidth, maxTextHeight * cTrain, controlCenter.maxTextWidth * 0.5, maxTextHeight);
                if (gui.infoOverlay && (menus.infoOverlay.focus == undefined || menus.infoOverlay.focus == 9)) {
                    contextForeground.save();
                    var textWidth = background.width / 100;
                    contextForeground.translate(controlCenter.maxTextWidth + textWidth * 1.5, maxTextHeight * cTrain + textWidth * 1.5);
                    contextForeground.beginPath();
                    contextForeground.fillStyle = "#dfbbff";
                    contextForeground.strokeStyle = "violet";
                    contextForeground.arc(0, 0, textWidth * 1.1 * menus.infoOverlay.scaleFac, 0, 2 * Math.PI);
                    contextForeground.fill();
                    contextForeground.stroke();
                    contextForeground.font = measureFontSize("9", "monospace", 100, textWidth, 5, textWidth / 10);
                    contextForeground.fillStyle = "black";
                    contextForeground.textAlign = "center";
                    contextForeground.textBaseline = "middle";
                    var metrics = contextForeground.measureText("9");
                    if (metrics.actualBoundingBoxAscent != undefined && metrics.actualBoundingBoxDescent != undefined) {
                        contextForeground.fillText("9", 0, (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2);
                    }
                    else {
                        contextForeground.fillText("9", 0, 0);
                    }
                    contextForeground.restore();
                }
                if (noCollisionCTrain && contextClick && hardware.mouse.upX - background.x - controlCenter.translateOffset > controlCenter.maxTextWidth * 1.5 && hardware.mouse.upX - background.x - controlCenter.translateOffset < controlCenter.maxTextWidth * 1.75 && hardware.mouse.upY - background.y - controlCenter.translateOffset > maxTextHeight * cTrain && hardware.mouse.upY - background.y - controlCenter.translateOffset < maxTextHeight * cTrain + maxTextHeight) {
                    if (trains[cTrain].accelerationSpeed > 0) {
                        trainActions.stop(cTrain, true);
                    }
                    else {
                        trainActions.start(cTrain, 50, true);
                    }
                }
                contextForeground.save();
                contextForeground.translate(controlCenter.maxTextWidth * 1.625, maxTextHeight / 2 + maxTextHeight * cTrain);
                contextForeground.strokeStyle = noCollisionCTrain ? (trains[cTrain].move && trains[cTrain].accelerationSpeed > 0 ? "rgb(255,180,180)" : "rgb(180,255,180)") : colorDark;
                contextForeground.fillStyle = contextForeground.strokeStyle;
                contextForeground.lineWidth = Math.ceil(maxTextHeight / 20);
                contextForeground.beginPath();
                contextForeground.moveTo(0, -maxTextHeight / 18);
                contextForeground.lineTo(0, -maxTextHeight / 3);
                contextForeground.stroke();
                contextForeground.strokeStyle = noCollisionCTrain ? colorLight : colorDark;
                contextForeground.beginPath();
                contextForeground.rotate(-Math.PI / 2);
                contextForeground.arc(0, 0, maxTextHeight / 3.5, 0.15 * Math.PI, 1.85 * Math.PI);
                contextForeground.stroke();
                contextForeground.restore();
                contextForeground.strokeRect(controlCenter.maxTextWidth * 1.5, maxTextHeight * cTrain, controlCenter.maxTextWidth * 0.25, maxTextHeight);
                if (gui.infoOverlay && (menus.infoOverlay.focus == undefined || menus.infoOverlay.focus == 10)) {
                    contextForeground.save();
                    var textWidth = background.width / 100;
                    contextForeground.translate(controlCenter.maxTextWidth * 1.5 + textWidth * 1.5, maxTextHeight * cTrain + textWidth * 1.5);
                    contextForeground.beginPath();
                    contextForeground.fillStyle = "#dfbbff";
                    contextForeground.strokeStyle = "violet";
                    contextForeground.arc(0, 0, textWidth * 1.1 * menus.infoOverlay.scaleFac, 0, 2 * Math.PI);
                    contextForeground.fill();
                    contextForeground.stroke();
                    contextForeground.font = measureFontSize("10", "monospace", 100, textWidth, 5, textWidth / 10);
                    contextForeground.fillStyle = "black";
                    contextForeground.textAlign = "center";
                    contextForeground.textBaseline = "middle";
                    var metrics = contextForeground.measureText("10");
                    if (metrics.actualBoundingBoxAscent != undefined && metrics.actualBoundingBoxDescent != undefined) {
                        contextForeground.fillText("10", 0, (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2);
                    }
                    else {
                        contextForeground.fillText("10", 0, 0);
                    }
                    contextForeground.restore();
                }
                if (contextClick && !trains[cTrain].move && hardware.mouse.upX - background.x - controlCenter.translateOffset > controlCenter.maxTextWidth * 1.7 && hardware.mouse.upX - background.x - controlCenter.translateOffset < controlCenter.maxTextWidth * 2 && hardware.mouse.upY - background.y - controlCenter.translateOffset > maxTextHeight * cTrain && hardware.mouse.upY - background.y - controlCenter.translateOffset < maxTextHeight * cTrain + maxTextHeight) {
                    trainActions.changeDirection(cTrain, false, true);
                }
                contextForeground.save();
                contextForeground.translate(controlCenter.maxTextWidth * 1.875, maxTextHeight / 2 + maxTextHeight * cTrain);
                if (!trains[cTrain].standardDirection) {
                    contextForeground.rotate(Math.PI);
                }
                if (trains[cTrain].move) {
                    contextForeground.strokeStyle = colorDark;
                }
                else {
                    contextForeground.strokeStyle = colorLight;
                    if (hardware.mouse.moveX > background.x + controlCenter.translateOffset + 1.75 * controlCenter.maxTextWidth && hardware.mouse.moveY > background.y + controlCenter.translateOffset + maxTextHeight * cTrain && hardware.mouse.moveX < background.x + controlCenter.translateOffset + 2 * controlCenter.maxTextWidth && hardware.mouse.moveY < background.y + controlCenter.translateOffset + maxTextHeight * cTrain + maxTextHeight) {
                        hardware.mouse.cursor = "pointer";
                    }
                }
                contextForeground.fillStyle = contextForeground.strokeStyle;
                contextForeground.lineWidth = Math.ceil(maxTextHeight / 5);
                contextForeground.beginPath();
                contextForeground.moveTo(-controlCenter.maxTextWidth * 0.075, 0);
                contextForeground.lineTo(controlCenter.maxTextWidth * 0.051, 0);
                contextForeground.stroke();
                contextForeground.beginPath();
                contextForeground.moveTo(controlCenter.maxTextWidth * 0.05, -0.25 * maxTextHeight);
                contextForeground.lineTo(controlCenter.maxTextWidth * 0.05, 0.25 * maxTextHeight);
                contextForeground.lineTo(controlCenter.maxTextWidth * 0.1, 0);
                contextForeground.lineTo(controlCenter.maxTextWidth * 0.05, -0.25 * maxTextHeight);
                contextForeground.fill();
                contextForeground.restore();
                contextForeground.strokeRect(controlCenter.maxTextWidth * 1.75, maxTextHeight * cTrain, controlCenter.maxTextWidth * 0.25, maxTextHeight);
                if (gui.infoOverlay && (menus.infoOverlay.focus == undefined || menus.infoOverlay.focus == 11)) {
                    contextForeground.save();
                    var textWidth = background.width / 100;
                    contextForeground.translate(controlCenter.maxTextWidth * 1.75 + textWidth * 1.5, maxTextHeight * cTrain + textWidth * 1.5);
                    contextForeground.beginPath();
                    contextForeground.fillStyle = "#dfbbff";
                    contextForeground.strokeStyle = "violet";
                    contextForeground.arc(0, 0, textWidth * 1.1 * menus.infoOverlay.scaleFac, 0, 2 * Math.PI);
                    contextForeground.fill();
                    contextForeground.stroke();
                    contextForeground.font = measureFontSize("11", "monospace", 100, textWidth, 5, textWidth / 10);
                    contextForeground.fillStyle = "black";
                    contextForeground.textAlign = "center";
                    contextForeground.textBaseline = "middle";
                    var metrics = contextForeground.measureText("11");
                    if (metrics.actualBoundingBoxAscent != undefined && metrics.actualBoundingBoxDescent != undefined) {
                        contextForeground.fillText("11", 0, (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2);
                    }
                    else {
                        contextForeground.fillText("11", 0, 0);
                    }
                    contextForeground.restore();
                }
            }
        }
        contextForeground.restore();
        controlCenter.mouse.wheelScrolls = false;
    }
    else {
        controlCenter.showCarCenter = false;
        gui.controlCenter = false;
    }
    /////Multiplayer Mode/Waiting Animation/////
    if (onlineConnection.stop) {
        hardware.mouse.cursor = "default";
        multiplayerMode.waitingClock.draw();
    }
    /////BACKGROUND/Margins-2////
    if (konamiState < 0) {
        var bgGradient = contextForeground.createRadialGradient(0, canvas.height / 2, canvas.height / 2, canvas.width + canvas.height / 2, canvas.height / 2, canvas.height / 2);
        bgGradient.addColorStop(0, "red");
        bgGradient.addColorStop(0.2, "orange");
        bgGradient.addColorStop(0.4, "yellow");
        bgGradient.addColorStop(0.6, "lightgreen");
        bgGradient.addColorStop(0.8, "blue");
        bgGradient.addColorStop(1, "violet");
        if (gui.konamiOverlay) {
            hardware.mouse.cursor = "default";
            contextForeground.save();
            contextForeground.fillStyle = "black";
            contextForeground.fillRect(background.x, background.y, background.width, background.height);
            contextForeground.textAlign = "center";
            contextForeground.fillStyle = bgGradient;
            var konamiText = getString("appScreenKonami", "!");
            contextForeground.font = measureFontSize(konamiText, "monospace", 100, background.width / 1.1, 5, background.width / 300);
            contextForeground.fillText(konamiText, background.x + background.width / 2, background.y + background.height / 2);
            contextForeground.fillText(getString("appScreenKonamiIconRow"), background.x + background.width / 2, background.y + background.height / 4);
            contextForeground.fillText(getString("appScreenKonamiIconRow"), background.x + background.width / 2, background.y + background.height / 2 + background.height / 4);
            contextForeground.restore();
        }
        if (!gui.three) {
            context.save();
            context.fillStyle = bgGradient;
            context.fillRect(0, 0, background.x, canvas.height);
            context.fillRect(0, 0, canvas.width, background.y);
            context.fillRect(background.x + background.width, 0, background.x, canvas.height);
            context.fillRect(0, background.y + background.height + menus.outerContainer.height * client.devicePixelRatio, canvas.width, background.y);
            context.restore();
        }
    }
    /////CURSOR/////
    if (gui.three) {
        canvasForeground.style.cursor = client.chosenInputMethod != "mouse" || currentMode == Modes.DEMO ? "none" : hardware.mouse.cursor;
    }
    else {
        if (getSetting("cursorascircle") && client.chosenInputMethod == "mouse" && (hardware.mouse.isMoving || hardware.mouse.isHold || client.zoomAndTilt.realScale > 1)) {
            contextForeground.save();
            contextForeground.translate(adjustScaleX(hardware.mouse.moveX), adjustScaleY(hardware.mouse.moveY));
            contextForeground.fillStyle = hardware.mouse.cursor == "move" ? "rgba(155,155,69," + (Math.random() * 0.3 + 0.6) + ")" : hardware.mouse.cursor == "grabbing" ? "rgba(65,56,65," + (Math.random() * 0.3 + 0.6) + ")" : hardware.mouse.cursor == "pointer" ? "rgba(99,118,140," + (Math.random() * 0.3 + 0.6) + ")" : hardware.mouse.isHold ? "rgba(144,64,64," + (Math.random() * 0.3 + 0.6) + ")" : "rgba(255,250,240,0.5)";
            var rectSize = canvas.width / 75;
            contextForeground.beginPath();
            contextForeground.arc(0, 0, rectSize / 2, 0, 2 * Math.PI);
            contextForeground.fill();
            contextForeground.fillStyle = hardware.mouse.cursor == "move" ? "rgba(220,220,71,1)" : hardware.mouse.cursor == "grabbing" ? "rgba(50,45,50,1)" : hardware.mouse.cursor == "pointer" ? "rgba(50,63,95,1)" : hardware.mouse.isHold ? "rgba(200,64,64,1)" : "rgba((255,250,240,0.5)";
            contextForeground.beginPath();
            contextForeground.arc(0, 0, rectSize / 4, 0, 2 * Math.PI);
            contextForeground.fill();
            contextForeground.restore();
        }
        canvasForeground.style.cursor = client.chosenInputMethod != "mouse" || getSetting("cursorascircle") || currentMode == Modes.DEMO ? "none" : hardware.mouse.cursor;
    }
    hardware.mouse.wheelScrolls = false;
    if (lastClickDoubleClick == hardware.mouse.lastClickDoubleClick && wasHold) {
        hardware.mouse.lastClickDoubleClick = false;
    }
    drawing = false;
    /////REPAINT/////
    if (drawTimeout !== undefined && drawTimeout !== null) {
        clearTimeout(drawTimeout);
    }
    if (!client.hidden) {
        var restTime = drawInterval - (Date.now() - startTime);
        if (restTime <= 0) {
            requestAnimationFrame(drawObjects);
        }
        else {
            drawTimeout = setTimeout(function () {
                requestAnimationFrame(drawObjects);
            }, restTime);
        }
    }
}
function actionSync(objectName, index, params, notification, notificationOnlyForOthers) {
    if (index === void 0) { index = undefined; }
    if (params === void 0) { params = undefined; }
    if (notification === void 0) { notification = undefined; }
    if (notificationOnlyForOthers === void 0) { notificationOnlyForOthers = false; }
    if (currentMode == Modes.MULTIPLAYER) {
        if (!onlineConnection.stop) {
            onlineConnection.send("action", JSON.stringify({
                objectName: objectName,
                index: index,
                params: params,
                notification: notification,
                notificationOnlyForOthers: notificationOnlyForOthers
            }));
        }
    }
    else {
        switch (objectName) {
            case "trains":
                animateWorker.postMessage({ k: "train", i: index, params: params });
                if (notification && !notificationOnlyForOthers) {
                    var notifyArr = [];
                    notification.forEach(function (elem) {
                        notifyArr.push(getString.apply(null, elem.getString));
                    });
                    var notifyStr = formatJSString.apply(null, notifyArr);
                    notify("#canvas-notifier", notifyStr, NotificationPriority.Default, 1000, null, null, client.y + menus.outerContainer.height);
                }
                break;
        }
    }
}
/*******************************************
 *                Constants                *
 ******************************************/
//Font
var defaultFont = "Roboto, sans-serif";
//Gesture Delays
var longTouchTime = 350;
var longTouchWaitTime = longTouchTime + 50;
var doubleTouchTime = 250;
var doubleTouchWaitTime = doubleTouchTime + 50;
var doubleClickTime = 200;
var doubleClickWaitTime = doubleClickTime + 50;
//Background
var background = { src: 9, secondLayer: 10 };
var background3D = { flat: { src: "background-flat" }, three: { src: "background-3d" } };
//Loading animation
var loadingAnimation = {
    updateProgress: function (progress) {
        progress = Math.min(progress, 100);
        if (this.elementProgressText && this.elementProgressBar) {
            this.elementProgressText.textContent = progress + "%";
            this.elementProgressBar.style.left = -100 + progress + "%";
        }
    },
    init: function () {
        this.element = document.querySelector("#loading-anim");
        this.elementBranding = document.querySelector("#branding");
        this.elementBrandingImageAnimation = document.querySelector("#branding img");
        var element = this.elementBrandingImageAnimation;
        this.brandingImageAnimation = {
            start: function () {
                if (element) {
                    var filter_1 = "blur(1px) saturate(5) sepia(1) hue-rotate({{0}}deg)";
                    element.style.transition = "filter 0.08s";
                    element.style.filter = formatJSString(filter_1, Math.random() * 260 + 100);
                    if (this.interval) {
                        clearInterval(this.interval);
                    }
                    this.interval = setInterval(function () {
                        element.style.filter = formatJSString(filter_1, Math.random() * 260 + 100);
                    }, 10);
                }
            },
            stop: function () {
                if (this.interval) {
                    clearInterval(this.interval);
                }
                if (element) {
                    element.style.filter = "unset";
                }
            }
        };
        this.elementProgress = document.querySelector("#percent");
        this.elementProgressText = document.querySelector("#percent #percent-text");
        this.elementProgressBar = document.querySelector("#percent #percent-progress");
        this.elementSnake = document.querySelector("#snake");
    },
    show: function (animate) {
        var _a, _b, _c;
        if (this.element) {
            this.element.classList.remove("hidden");
            this.element.style.transition = "unset";
            this.element.style.opacity = "unset";
        }
        (_a = this.elementBranding) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
        (_b = this.elementProgress) === null || _b === void 0 ? void 0 : _b.classList.add("hidden");
        //Show progress bar if app loads slowly
        var element = this.elementProgress;
        var elementProgressHide = function () {
            element === null || element === void 0 ? void 0 : element.classList.remove("hidden");
        };
        this.showProgressTimeout = setTimeout(elementProgressHide, 2500);
        (_c = this.elementSnake) === null || _c === void 0 ? void 0 : _c.classList.remove("hidden");
        if (animate) {
            this.brandingImageAnimation.start();
        }
    },
    hide: function () {
        var _a;
        this.brandingImageAnimation.stop();
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
    },
    fade: function (fadeOutFunction) {
        var _a, _b;
        if (this.showProgressTimeout != undefined && this.showProgressTimeout != null) {
            clearTimeout(this.showProgressTimeout);
        }
        (_a = this.elementProgress) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        (_b = this.elementSnake) === null || _b === void 0 ? void 0 : _b.classList.add("hidden");
        var fadeOutTime = 1.5;
        if (this.element) {
            this.element.style.transition = "opacity " + fadeOutTime + "s ease-in";
            this.element.style.opacity = "0";
            setTimeout(function () {
                loadingAnimation.hide();
                fadeOutFunction();
            }, fadeOutTime * 900);
        }
    }
};
//Text control
var textControl = {
    elements: {},
    validateSubcommand: function (command, args) {
        if (args.length - 1 < this.commands[command].subcommands[args[0]].args.min || args.length - 1 > this.commands[command].subcommands[args[0]].args.max) {
            return false;
        }
        for (var i = 1; i < args.length; i++) {
            if (typeof this.commands[command].subcommands[args[0]].args.patterns == "object") {
                var pattern = this.commands[command].subcommands[args[0]].args.patterns[i - 1];
                if (pattern instanceof RegExp) {
                    if (!pattern.test(args[i])) {
                        return false;
                    }
                }
            }
        }
        return true;
    },
    getSubcommandNames: function (command) {
        return Object.keys(this.commands[command].subcommands);
    },
    execute: function (command, args) {
        var commandNames = Object.keys(this.commands);
        if (!commandNames.includes(command)) {
            commandNames.shift();
            return formatJSString(getString("appScreenTextCommandsGeneralCommands"), "", commandNames.join(", "));
        }
        if (typeof args == "object" && args.length > 0 && this.getSubcommandNames(command).includes(args[0])) {
            if (this.validateSubcommand(command, args)) {
                return this.commands[command].subcommands[args[0]].execute(args);
            }
            return formatJSString(getString("appScreenTextCommandsGeneralUsage"), [command, args[0], this.commands[command].subcommands[args[0]].usage].join(" "));
        }
        return formatJSString(getString("appScreenTextCommandsGeneralCommands"), getString(this.commands[command].nameIdentifier, "-"), textControl.getSubcommandNames(command).join(", "));
    },
    commands: {
        "/": {
            action: function () {
                return textControl.execute();
            }
        },
        trains: {
            subcommands: {
                list: {
                    args: { min: 0, max: 0 },
                    execute: function () {
                        var trainNames = [];
                        for (var i = 0; i < trains.length; i++) {
                            trainNames[i] = i + ": " + getString(["appScreenTrainNames", i]);
                        }
                        return trainNames.join(", ");
                    },
                    usage: ""
                },
                status: {
                    args: { min: 1, max: 1, patterns: [/^[0-9]+$/] },
                    execute: function (args) {
                        var train = parseInt(args[1], 10);
                        if (trainActions.checkRange(train)) {
                            var statusPrefix = getString(["appScreenTrainNames", train]);
                            var status = [];
                            status[status.length] = formatJSString(getString("appScreenTextCommandsTrainsMoving"), getString(trains[train].move ? "generalYes" : "generalNo"));
                            if (trains[train].move) {
                                status[status.length] = formatJSString(getString("appScreenTextCommandsTrainsStopping"), getString(trains[train].accelerationSpeed < 0 && trains[train].accelerationSpeed > -1 ? "generalYes" : "generalNo"));
                                status[status.length] = formatJSString(getString("appScreenTextCommandsTrainsStarting"), getString(trains[train].accelerationSpeed > 0 && trains[train].accelerationSpeed < 1 ? "generalYes" : "generalNo"));
                                status[status.length] = formatJSString(getString("appScreenTextCommandsTrainsSpeedInPercent"), Math.round(trains[train].speedInPercent));
                            }
                            else {
                                status[status.length] = formatJSString(getString("appScreenTextCommandsTrainsCrash"), getString(trains[train].crash ? "generalYes" : "generalNo"));
                            }
                            return formatJSString("{{0}}: {{1}}", statusPrefix, status.join(", "));
                        }
                        return getString("appScreenTextCommandsGeneralFailure", "!", "upper");
                    },
                    usage: "{number}"
                },
                start: {
                    args: { min: 1, max: 1, patterns: [/^[0-9]+$/] },
                    execute: function (args) {
                        var train = parseInt(args[1], 10);
                        if (trainActions.start(train, 50)) {
                            return getString("appScreenTextCommandsGeneralSuccess", "!", "upper");
                        }
                        return getString("appScreenTextCommandsGeneralFailure", "!", "upper");
                    },
                    usage: "{number}"
                },
                stop: {
                    args: { min: 1, max: 1, patterns: [/^[0-9]+|all$/] },
                    execute: function (args) {
                        if (args[1] == "all") {
                            for (var i = 0; i < trains.length; i++) {
                                this.execute([args[0], i]);
                            }
                            return getString("appScreenTextCommandsGeneralSuccess", "!", "upper");
                        }
                        var train = parseInt(args[1], 10);
                        if (trainActions.stop(train)) {
                            return getString("appScreenTextCommandsGeneralSuccess", "!", "upper");
                        }
                        return getString("appScreenTextCommandsGeneralFailure", "!", "upper");
                    },
                    usage: "{number}|all"
                },
                turn: {
                    args: { min: 1, max: 1, patterns: [/^[0-9]+$/] },
                    execute: function (args) {
                        var train = parseInt(args[1], 10);
                        if (trainActions.changeDirection(train, true)) {
                            return getString("appScreenTextCommandsGeneralSuccess", "!", "upper");
                        }
                        return getString("appScreenTextCommandsGeneralFailure", "!", "upper");
                    },
                    usage: "{number}"
                },
                speed: {
                    args: { min: 1, max: 2, patterns: [/^[0-9]+$/, /^[+-]?[0-9]+$/] },
                    execute: function (args) {
                        var train = parseInt(args[1], 10);
                        if (!trainActions.checkRange(train)) {
                            return getString("appScreenTextCommandsGeneralFailure", "!", "upper");
                        }
                        if (args.length == 3) {
                            var speed = args[2];
                            if (speed.match(/^[+][0-9]+$/)) {
                                if (trains[train].accelerationSpeed <= 0) {
                                    speed = parseInt(speed, 10);
                                }
                                else {
                                    speed = trains[train].speedInPercent + parseInt(speed.replace(/[^0-9]/g, ""), 10);
                                }
                            }
                            else if (speed.match(/^[-][0-9]+$/)) {
                                if (trains[train].accelerationSpeed <= 0) {
                                    return getString("appScreenTextCommandsGeneralFailure", "!", "upper");
                                }
                                speed = trains[train].speedInPercent - parseInt(speed.replace(/[^0-9]/g, ""), 10);
                            }
                            else if (speed.match(/^[0-9]+$/)) {
                                speed = parseInt(speed, 10);
                            }
                            else {
                                return getString("appScreenTextCommandsGeneralFailure", "!", "upper");
                            }
                            if (trainActions.setSpeed(train, speed)) {
                                return getString("appScreenTextCommandsGeneralSuccess", "!", "upper");
                            }
                        }
                        else if (trains[train].accelerationSpeed > 0) {
                            return formatJSString(getString("appScreenTextCommandsTrainsSpeedInPercent"), Math.round(trains[train].speedInPercent));
                        }
                        return getString("appScreenTextCommandsGeneralFailure", "!", "upper");
                    },
                    usage: "{number} [[+/-]{speed}]"
                }
            },
            nameIdentifier: "appScreenTextCommandsTrainsName",
            action: function (args) {
                return textControl.execute("trains", args);
            }
        },
        cars: {
            subcommands: {
                list: {
                    args: { min: 0, max: 0 },
                    execute: function () {
                        var carNames = [];
                        for (var i = 0; i < cars.length; i++) {
                            carNames[i] = i + ": " + getString(["appScreenCarNames", i]);
                        }
                        return carNames.join(", ");
                    },
                    usage: ""
                },
                mode: {
                    args: { min: 0, max: 0 },
                    execute: function () {
                        if (carParams.init) {
                            return formatJSString(getString("appScreenTextCommandsCarsMode"), getString("appScreenTextCommandsCarsModeStop"));
                        }
                        else if (carParams.autoModeOff) {
                            return formatJSString(getString("appScreenTextCommandsCarsMode"), getString("appScreenTextCommandsCarsModeManual"));
                        }
                        return formatJSString(getString("appScreenTextCommandsCarsMode"), getString("appScreenTextCommandsCarsModeAuto"));
                    },
                    usage: ""
                },
                auto: {
                    args: { min: 1, max: 1, patterns: [/^start|end|pause|resume$/] },
                    execute: function (args) {
                        if (args[1] == "start" && carActions.auto.start()) {
                            return getString("appScreenTextCommandsGeneralSuccess", "!", "upper");
                        }
                        else if (args[1] == "end" && carActions.auto.end()) {
                            return getString("appScreenTextCommandsGeneralSuccess", "!", "upper");
                        }
                        else if (args[1] == "pause" && carActions.auto.pause()) {
                            return getString("appScreenTextCommandsGeneralSuccess", "!", "upper");
                        }
                        else if (args[1] == "resume" && carActions.auto.resume()) {
                            return getString("appScreenTextCommandsGeneralSuccess", "!", "upper");
                        }
                        return getString("appScreenTextCommandsGeneralFailure", "!", "upper");
                    },
                    usage: "start|end|pause|resume"
                },
                manual: {
                    args: { min: 2, max: 2, patterns: [/^start|stop|back|park$/, /^[0-9]+$/] },
                    execute: function (args) {
                        var car = parseInt(args[2], 10);
                        if (args[1] == "start" && carActions.manual.start(car)) {
                            return getString("appScreenTextCommandsGeneralSuccess", "!", "upper");
                        }
                        else if (args[1] == "stop" && carActions.manual.stop(car)) {
                            return getString("appScreenTextCommandsGeneralSuccess", "!", "upper");
                        }
                        else if (args[1] == "back" && carActions.manual.backwards(car)) {
                            return getString("appScreenTextCommandsGeneralSuccess", "!", "upper");
                        }
                        else if (args[1] == "park" && carActions.manual.park(car)) {
                            return getString("appScreenTextCommandsGeneralSuccess", "!", "upper");
                        }
                        return getString("appScreenTextCommandsGeneralFailure", "!", "upper");
                    },
                    usage: "start|stop|back|park {number}"
                }
            },
            nameIdentifier: "appScreenTextCommandsCarsName",
            action: function (args) {
                return textControl.execute("cars", args);
            }
        },
        exit: {
            action: function () {
                textControl.elements.root.style.display = "";
                if (client.zoomAndTilt.realScale == 1) {
                    drawMenu("show");
                }
                gui.textControl = false;
                return "";
            }
        }
    }
};
//Control center
var controlCenter = { showCarCenter: false, fontFamily: defaultFont, mouse: {} };
//Demo mode
var demoMode = {
    leaveKeyUp: function (event) {
        if (event.key == "Escape") {
            switchMode(Modes.SINGLEPLAYER);
        }
    },
    leaveTimeMin: 1500,
    leaveTimeoutStart: function () {
        if (demoMode.leaveTimeout != undefined && demoMode.leaveTimeout != null) {
            clearTimeout(demoMode.leaveTimeout);
        }
        demoMode.leaveTimeout = setTimeout(function () {
            switchMode(Modes.SINGLEPLAYER);
        }, demoMode.leaveTimeMin);
    },
    leaveTimeoutEnd: function () {
        if (demoMode.leaveTimeout != undefined && demoMode.leaveTimeout != null) {
            clearTimeout(demoMode.leaveTimeout);
        }
    },
    reload: function () {
        switchMode(Modes.DEMO);
    }
};
//Media
var audio = {};
var audioControl = {
    init: function () {
        function createAudio(destinationName, destinationIndex, buffer, volume) {
            var gainNode = audio.context.createGain();
            gainNode.gain.value = volume;
            gainNode.connect(audio.context.destination);
            if (typeof destinationIndex == "number") {
                audio.gainNode[destinationName][destinationIndex] = gainNode;
                audio.buffer[destinationName][destinationIndex] = buffer;
            }
            else {
                audio.gainNode[destinationName] = gainNode;
                audio.buffer[destinationName] = buffer;
            }
        }
        function createTrainAudio(cTrainNumber) {
            try {
                fetch("./assets/audio_asset_" + cTrainNumber + "." + soundFileExtension)
                    .then(function (response) {
                    if (response.ok) {
                        return response.arrayBuffer();
                    }
                    throw new Error("response not ok");
                })
                    .then(function (response) {
                    audio.context.decodeAudioData(response, function (buffer) {
                        createAudio("train", cTrainNumber, buffer, 0);
                    });
                })
                    .catch(function (error) {
                    if (APP_DATA.debug) {
                        console.error("Fetch-Error:", error);
                    }
                });
            }
            catch (e) {
                if (APP_DATA.debug) {
                    console.error(e);
                }
            }
        }
        var soundFileExtension = "ogg";
        if (audio.context) {
            audioControl.stopAll();
            audio.context.close();
        }
        if (trains) {
            audio.context = new AudioContext();
            audio.buffer = {};
            audio.buffer.train = [];
            audio.gainNode = {};
            audio.gainNode.train = [];
            audio.source = {};
            audio.source.train = [];
            try {
                fetch("./assets/audio_asset_crash." + soundFileExtension)
                    .then(function (response) {
                    return response.arrayBuffer();
                })
                    .catch(function (error) {
                    if (APP_DATA.debug) {
                        console.error("Fetch-Error:", error);
                    }
                })
                    .then(function (response) {
                    audio.context.decodeAudioData(response, function (buffer) {
                        createAudio("trainCrash", null, buffer, 1);
                    });
                });
            }
            catch (e) {
                if (APP_DATA.debug) {
                    console.error(e);
                }
            }
            try {
                fetch("./assets/audio_asset_switch." + soundFileExtension)
                    .then(function (response) {
                    return response.arrayBuffer();
                })
                    .catch(function (error) {
                    if (APP_DATA.debug) {
                        console.error("Fetch-Error:", error);
                    }
                })
                    .then(function (response) {
                    audio.context.decodeAudioData(response, function (buffer) {
                        createAudio("switch", null, buffer, 1);
                    });
                });
            }
            catch (e) {
                if (APP_DATA.debug) {
                    console.error(e);
                }
            }
            for (var i = 0; i < trains.length; i++) {
                createTrainAudio(trains[i].audioSrc);
            }
        }
    },
    setActivation: function (activate) {
        if (activate) {
            audioControl.init();
        }
        audio.active = activate;
        audioControl.playAndPauseAll();
    },
    playAndPauseAll: function () {
        if (typeof audio.context == "object") {
            var play = audioControl.mayPlay();
            if (play && audio.context.state == "suspended") {
                audio.context.resume();
            }
            else if (!play && audio.context.state == "running") {
                audio.context.suspend();
            }
            return true;
        }
        return false;
    },
    mayPlay: function () {
        return audio.active && !client.hidden && !onlineConnection.paused;
    },
    existsObject: function (destinationName, destinationIndex) {
        if (destinationIndex === void 0) { destinationIndex = undefined; }
        if (typeof audio.context == "object") {
            if (typeof destinationIndex == "number") {
                if (typeof audio.source[destinationName][destinationIndex] == "object") {
                    return true;
                }
            }
            else {
                if (typeof audio.source[destinationName] == "object" && !Array.isArray(audio.source[destinationName])) {
                    return true;
                }
            }
        }
        return false;
    },
    startObject: function (destinationName, destinationIndex, loop) {
        if (audioControl.existsObject(destinationName, destinationIndex)) {
            return false;
        }
        if (typeof audio.context == "object") {
            var source = audio.context.createBufferSource();
            source.loop = loop;
            if (typeof destinationIndex == "number") {
                if (typeof audio.buffer[destinationName][destinationIndex] == "object" && typeof audio.gainNode[destinationName][destinationIndex] == "object") {
                    source.buffer = audio.buffer[destinationName][destinationIndex];
                    source.connect(audio.gainNode[destinationName][destinationIndex]);
                    audio.source[destinationName][destinationIndex] = source;
                }
                else {
                    return false;
                }
            }
            else {
                if (typeof audio.buffer[destinationName] == "object" && typeof audio.gainNode[destinationName] == "object" && !Array.isArray(audio.buffer[destinationName]) && !Array.isArray(audio.gainNode[destinationName])) {
                    source.buffer = audio.buffer[destinationName];
                    source.connect(audio.gainNode[destinationName]);
                    audio.source[destinationName] = source;
                }
                else {
                    return false;
                }
            }
            source.start();
            return true;
        }
        return false;
    },
    setObjectVolume: function (destinationName, destinationIndex, volume) {
        if (typeof audio.context == "object") {
            var gainNode;
            if (typeof destinationIndex == "number") {
                gainNode = audio.gainNode[destinationName][destinationIndex];
            }
            else {
                gainNode = audio.gainNode[destinationName];
            }
            if (typeof gainNode == "object" && !Array.isArray(gainNode) && volume != undefined) {
                gainNode.gain.value = Math.round(volume) / 100;
                return true;
            }
        }
        return false;
    },
    stopObject: function (destinationName, destinationIndex) {
        if (destinationIndex === void 0) { destinationIndex = undefined; }
        if (!audioControl.existsObject(destinationName, destinationIndex)) {
            return false;
        }
        if (typeof audio.context == "object") {
            if (typeof destinationIndex == "number") {
                if (typeof audio.source[destinationName][destinationIndex] == "object") {
                    audio.source[destinationName][destinationIndex].stop();
                    delete audio.source[destinationName][destinationIndex];
                    return true;
                }
            }
            else {
                if (typeof audio.source[destinationName] == "object") {
                    audio.source[destinationName].stop();
                    delete audio.source[destinationName];
                    return true;
                }
            }
        }
        return false;
    },
    stopAll: function () {
        if (audio.source) {
            Object.keys(audio.source).forEach(function (name) {
                var value = audio.source[name];
                if (typeof value != "object") {
                    return;
                }
                if (Array.isArray(value)) {
                    value.forEach(function (_element, index) {
                        audioControl.stopObject(name, index);
                    });
                }
                else {
                    audioControl.stopObject(name, undefined);
                }
            });
        }
    }
};
//3D view
var three = {
    calcScale: function () {
        return background.height / client.devicePixelRatio / client.height;
    },
    calcPositionY: function () {
        return ((client.height - (background.y * 2 + background.height) / client.devicePixelRatio) / client.height) * (background.height / background.width / 2);
    },
    cloneNode: function (src, cloneMaterial) {
        if (cloneMaterial === void 0) { cloneMaterial = false; }
        var target = src.clone();
        if (cloneMaterial) {
            target.traverse(function (node) {
                if (node.isMesh) {
                    node.material = node.material.clone();
                }
            });
        }
        return target;
    },
    switchCamera: function (forwards) {
        if (forwards === void 0) { forwards = true; }
        if (forwards) {
            if (three.cameraMode == ThreeCameraModes.FOLLOW_CAR) {
                if (three.followObject < cars.length - 1) {
                    three.followObject++;
                }
                else {
                    three.cameraMode = ThreeCameraModes.BIRDS_EYE;
                    three.activeCamera = three.camera;
                }
            }
            else if (three.cameraMode == ThreeCameraModes.FOLLOW_TRAIN) {
                if (three.followObject < trains.length - 1) {
                    three.followObject++;
                }
                else {
                    if (cars.length == 0) {
                        //If car calc did not work
                        three.cameraMode = ThreeCameraModes.BIRDS_EYE;
                        three.activeCamera = three.camera;
                    }
                    else {
                        three.followObject = 0;
                        three.cameraMode = ThreeCameraModes.FOLLOW_CAR;
                        three.followCamControls.recalc();
                    }
                }
            }
            else {
                three.followObject = 0;
                three.cameraMode = ThreeCameraModes.FOLLOW_TRAIN;
                three.followCamControls.recalc();
                three.activeCamera = three.followCamera;
            }
        }
        else {
            if (three.cameraMode == ThreeCameraModes.FOLLOW_CAR) {
                if (three.followObject == 0) {
                    three.followObject = trains.length - 1;
                    three.cameraMode = ThreeCameraModes.FOLLOW_TRAIN;
                    three.followCamControls.recalc();
                }
                else {
                    three.followObject--;
                }
            }
            else if (three.cameraMode == ThreeCameraModes.FOLLOW_TRAIN) {
                if (three.followObject == 0) {
                    three.cameraMode = ThreeCameraModes.BIRDS_EYE;
                    three.activeCamera = three.camera;
                }
                else {
                    three.followObject--;
                }
            }
            else {
                if (cars.length == 0) {
                    //If car calc did not work
                    three.followObject = trains.length - 1;
                    three.cameraMode = ThreeCameraModes.FOLLOW_TRAIN;
                }
                else {
                    three.followObject = cars.length - 1;
                    three.cameraMode = ThreeCameraModes.FOLLOW_CAR;
                }
                three.followCamControls.recalc();
                three.activeCamera = three.followCamera;
            }
        }
        if (three.cameraMode == ThreeCameraModes.FOLLOW_CAR) {
            notify("#canvas-notifier", formatJSString(getString("appScreen3DViewCameraNotify", "."), getString(["appScreenCarNames", three.followObject])), NotificationPriority.Default, 2500, null, null, client.y + menus.outerContainer.height, NotificationChannel.Camera3D);
        }
        else if (three.cameraMode == ThreeCameraModes.FOLLOW_TRAIN) {
            notify("#canvas-notifier", formatJSString(getString("appScreen3DViewCameraNotify", "."), getString(["appScreenTrainNames", three.followObject])), NotificationPriority.Default, 2500, null, null, client.y + menus.outerContainer.height, NotificationChannel.Camera3D);
        }
        setGuiState("3d-cam-mode", three.cameraMode);
        setGuiState("3d-follow-object", three.followObject);
        resetScale();
        resetTilt();
        calcMenusAndBackground("resize");
    },
    zoom: 3,
    followCamControls: {
        recalc: function () {
            three.followCamControls.width = Math.min(50, client.width / 10) * client.devicePixelRatio;
            three.followCamControls.height = 0;
            three.followCamControls.padding = three.followCamControls.width / 3;
            three.followCamControls.font = measureFontSize("speed", "Material Icons", 20, three.followCamControls.width, 5, 1.2);
            three.followCamControls.textSize = parseFloat(three.followCamControls.font.replace(/^([0-9.]+)px.*$/, "$1"));
            three.followCamControls.x = client.width * client.devicePixelRatio - three.followCamControls.width - three.followCamControls.padding;
            three.followCamControls.y = Math.min(three.followCamControls.padding, (client.height * client.devicePixelRatio) / 5);
            if ("windowControlsOverlay" in navigator) {
                var windowControlsOverlayRect = navigator.windowControlsOverlay.getTitlebarAreaRect();
                //TODO: Remove cast once TS is ready
                if (windowControlsOverlayRect.top === 0) {
                    three.followCamControls.y += windowControlsOverlayRect.height * client.devicePixelRatio;
                }
            }
            three.followCamControls.maxHeight = (client.height - menus.outerContainer.height) * client.devicePixelRatio - three.followCamControls.y * 2;
            if (three.cameraMode == ThreeCameraModes.FOLLOW_CAR) {
                var maxSymbolsInUse = 3;
                three.followCamControls.height = three.followCamControls.padding * (maxSymbolsInUse - 1) + three.followCamControls.textSize * maxSymbolsInUse;
                if (three.followCamControls.height > three.followCamControls.maxHeight) {
                    var controlWidthOld = three.followCamControls.width;
                    three.followCamControls.width *= 1 - (1 - three.followCamControls.maxHeight / three.followCamControls.height);
                    three.followCamControls.x += controlWidthOld - three.followCamControls.width;
                    three.followCamControls.padding *= 1 - (1 - three.followCamControls.maxHeight / three.followCamControls.height);
                    three.followCamControls.font = measureFontSize("speed", "Material Icons", 20, three.followCamControls.width, 5, 1.2);
                    three.followCamControls.textSize = parseFloat(three.followCamControls.font.replace(/^([0-9.]+)px.*$/, "$1"));
                }
            }
            else if (three.cameraMode == ThreeCameraModes.FOLLOW_TRAIN) {
                var maxSymbolsInUse = 1;
                three.followCamControls.draggingAreaHeight = Math.max(three.followCamControls.textSize, Math.min(three.followCamControls.width * 8, Math.min(250, (client.height - menus.outerContainer.height) / 2) * client.devicePixelRatio));
                three.followCamControls.height = three.followCamControls.draggingAreaHeight + three.followCamControls.padding * maxSymbolsInUse + three.followCamControls.textSize * maxSymbolsInUse;
                if (three.followCamControls.height > three.followCamControls.maxHeight) {
                    var controlWidthOld = three.followCamControls.width;
                    three.followCamControls.width *= 1 - (1 - three.followCamControls.maxHeight / three.followCamControls.height);
                    three.followCamControls.x += controlWidthOld - three.followCamControls.width;
                    three.followCamControls.draggingAreaHeight *= 1 - (1 - three.followCamControls.maxHeight / three.followCamControls.height);
                    three.followCamControls.padding *= 1 - (1 - three.followCamControls.maxHeight / three.followCamControls.height);
                    three.followCamControls.font = measureFontSize("speed", "Material Icons", 20, three.followCamControls.width, 5, 1.2);
                    three.followCamControls.textSize = parseFloat(three.followCamControls.font.replace(/^([0-9.]+)px.*$/, "$1"));
                }
                three.followCamControls.draggingAreaRadius = three.followCamControls.width / 4;
            }
        },
        dragging: false
    }
};
//Debug view
var debug = { paint: true };
//Client and input configuration
var hardware = { mouse: { moveX: 0, moveY: 0, downX: 0, downY: 0, downTime: 0, upX: 0, upY: 0, upTime: 0, isMoving: false, isHold: false, cursor: "default" }, keyboard: { keysHold: [] } };
var client = { devicePixelRatio: 1, zoomAndTilt: { maxScale: 6, minScale: 1.2 } };
//Action definitions
var trainActions = {
    checkRange: function (i) {
        return i >= 0 && i < trains.length;
    },
    checkReady: function () {
        return currentMode != Modes.DEMO && !onlineConnection.stop;
    },
    checkAll: function (i) {
        return this.checkRange(i) && this.checkReady();
    },
    start: function (i, speed, notificationOnlyForOthers) {
        if (notificationOnlyForOthers === void 0) { notificationOnlyForOthers = false; }
        if (!this.checkAll(i) || trains[i].crash || trains[i].accelerationSpeed > 0 || speed <= 0 || speed > 100) {
            return false;
        }
        if (trains[i].move) {
            actionSync("trains", i, [{ accelerationSpeed: (trains[i].accelerationSpeed *= -1) }, { speedInPercent: speed }, { accelerationSpeedCustom: 1 }], [{ getString: ["appScreenObjectStarts", "."] }, { getString: [["appScreenTrainNames", i]] }], notificationOnlyForOthers);
        }
        else {
            actionSync("trains", i, [{ move: true }, { accelerationSpeed: 0 }, { speedInPercent: speed }, { accelerationSpeedCustom: 1 }], [{ getString: ["appScreenObjectStarts", "."] }, { getString: [["appScreenTrainNames", i]] }], notificationOnlyForOthers);
        }
        return true;
    },
    stop: function (i, notificationOnlyForOthers) {
        if (notificationOnlyForOthers === void 0) { notificationOnlyForOthers = false; }
        if (!this.checkAll(i) || trains[i].accelerationSpeed <= 0) {
            return false;
        }
        actionSync("trains", i, [{ accelerationSpeed: (trains[i].accelerationSpeed *= -1) }], [{ getString: ["appScreenObjectStops", "."] }, { getString: [["appScreenTrainNames", i]] }], notificationOnlyForOthers);
        return true;
    },
    changeDirection: function (i, highlight, notificationOnlyForOthers) {
        if (highlight === void 0) { highlight = false; }
        if (notificationOnlyForOthers === void 0) { notificationOnlyForOthers = false; }
        if (!this.checkAll(i) || trains[i].accelerationSpeed > 0 || Math.abs(trains[i].accelerationSpeed) >= 0.2) {
            return false;
        }
        if (highlight) {
            actionSync("trains", i, [{ move: false }, { standardDirection: !trains[i].standardDirection }, { lastDirectionChange: frameNo }], [{ getString: ["appScreenObjectChangesDirection", "."] }, { getString: [["appScreenTrainNames", i]] }], notificationOnlyForOthers);
        }
        else {
            actionSync("trains", i, [{ move: false }, { standardDirection: !trains[i].standardDirection }], [{ getString: ["appScreenObjectChangesDirection", "."] }, { getString: [["appScreenTrainNames", i]] }], notificationOnlyForOthers);
        }
        return true;
    },
    setSpeed: function (i, speed, notificationOnlyForOthers) {
        if (notificationOnlyForOthers === void 0) { notificationOnlyForOthers = false; }
        if (!this.checkAll(i) || speed < 0 || speed > 100) {
            return false;
        }
        if (speed < trainParams.minSpeed) {
            return this.stop(i, notificationOnlyForOthers);
        }
        if (trains[i].accelerationSpeed <= 0) {
            return this.start(i, speed, notificationOnlyForOthers);
        }
        if (trains[i].speedInPercent != speed) {
            var accSpeed = trains[i].currentSpeedInPercent / speed;
            actionSync("trains", i, [{ accelerationSpeedCustom: accSpeed }, { speedInPercent: speed }]);
        }
        return true;
    }
};
var switchActions = {
    turn: function (key, side) {
        if (currentMode == Modes.MULTIPLAYER) {
            actionSync("switches", [key, side], [{ turned: !switches[key][side].turned }], [{ getString: ["appScreenSwitchTurns", "."] }]);
        }
        else {
            switches[key][side].turned = !switches[key][side].turned;
            switches[key][side].lastStateChange = frameNo;
            animateWorker.postMessage({ k: "switches", switches: switches });
            notify("#canvas-notifier", getString("appScreenSwitchTurns", "."), NotificationPriority.Default, 500, null, null, client.y + menus.outerContainer.height, NotificationChannel.TrainSwitches);
        }
        if (audioControl.existsObject("switch")) {
            audioControl.stopObject("switch");
        }
        if (audioControl.mayPlay()) {
            audioControl.startObject("switch", null, false);
        }
    }
};
var carActions = {
    auto: {
        checkReady: function () {
            return currentMode != Modes.DEMO && !onlineConnection.stop;
        },
        start: function () {
            if (this.checkReady() && carParams.init) {
                carParams.init = false;
                carParams.autoModeOff = false;
                carParams.autoModeRuns = true;
                carParams.autoModeInit = true;
                notify("#canvas-notifier", formatJSString(getString("appScreenCarAutoModeChange", "."), getString("appScreenCarAutoModeInit")), NotificationPriority.Default, 500, null, null, client.y + menus.outerContainer.height);
                return true;
            }
            return false;
        },
        end: function () {
            if (this.checkReady() && !carParams.autoModeOff && !carParams.isBackToRoot) {
                carParams.autoModeRuns = true;
                carParams.isBackToRoot = true;
                notify("#canvas-notifier", getString("appScreenCarAutoModeParking", "."), NotificationPriority.Default, 750, null, null, client.y + menus.outerContainer.height);
                return true;
            }
            return false;
        },
        pause: function () {
            if (!this.checkReady() || !carParams.autoModeRuns) {
                return false;
            }
            carParams.autoModeRuns = false;
            notify("#canvas-notifier", formatJSString(getString("appScreenCarAutoModeChange", "."), getString("appScreenCarAutoModePause")), NotificationPriority.Default, 500, null, null, client.y + menus.outerContainer.height);
            return true;
        },
        resume: function () {
            if (!this.checkReady() || carParams.autoModeRuns || carParams.autoModeOff) {
                return false;
            }
            carParams.autoModeRuns = true;
            carParams.autoModeInit = true;
            notify("#canvas-notifier", formatJSString(getString("appScreenCarAutoModeChange", "."), getString("appScreenCarAutoModeInit")), NotificationPriority.Default, 500, null, null, client.y + menus.outerContainer.height);
            return true;
        }
    },
    manual: {
        checkRange: function (car) {
            return car >= 0 && car < cars.length;
        },
        checkReady: function () {
            return currentMode != Modes.DEMO && !onlineConnection.stop;
        },
        checkAll: function (car) {
            return this.checkRange(car) && this.checkReady();
        },
        start: function (car) {
            if (!this.checkAll(car) || carCollisionCourse(car, false) || (!carParams.init && !carParams.autoModeOff) || cars[car].move) {
                return false;
            }
            cars[car].move = true;
            cars[car].parking = false;
            cars[car].backwardsState = 0;
            cars[car].backToInit = false;
            carParams.init = false;
            carParams.autoModeOff = true;
            notify("#canvas-notifier", formatJSString(getString("appScreenObjectStarts", "."), getString(["appScreenCarNames", car])), NotificationPriority.Default, 500, null, null, client.y + menus.outerContainer.height);
            return true;
        },
        stop: function (car) {
            if (!this.checkAll(car) || !carParams.autoModeOff || !cars[car].move) {
                return false;
            }
            cars[car].move = false;
            cars[car].parking = false;
            cars[car].backwardsState = 0;
            cars[car].backToInit = false;
            carParams.init = false;
            carParams.autoModeOff = true;
            notify("#canvas-notifier", formatJSString(getString("appScreenObjectStops", "."), getString(["appScreenCarNames", car])), NotificationPriority.Default, 500, null, null, client.y + menus.outerContainer.height);
            return true;
        },
        backwards: function (car) {
            if (!this.checkAll(car) || !carParams.autoModeOff || cars[car].move || cars[car].backwardsState !== 0 || cars[car].parking) {
                return false;
            }
            cars[car].lastDirectionChange = frameNo;
            cars[car].backwardsState = 1;
            cars[car].backToInit = false;
            if (carCollisionCourse(car, false)) {
                return false;
            }
            cars[car].move = true;
            notify("#canvas-notifier", formatJSString(getString("appScreenCarStepsBack", "."), getString(["appScreenCarNames", car])), NotificationPriority.Default, 750, null, null, client.y + menus.outerContainer.height);
            return true;
        },
        park: function (car) {
            if (!this.checkAll(car) || carCollisionCourse(car, false, -1) || !carParams.autoModeOff || cars[car].move || cars[car].parking) {
                return false;
            }
            cars[car].move = true;
            cars[car].backToInit = true;
            notify("#canvas-notifier", formatJSString(getString("appScreenCarParking", "."), getString(["appScreenCarNames", car])), NotificationPriority.Default, 500, null, null, client.y + menus.outerContainer.height);
            return true;
        }
    }
};
/*******************************************
 *                Variables                *
 ******************************************/
//Canvas and drawing
var canvas;
var canvasGesture;
var canvasBackground;
var canvasSemiForeground;
var canvasForeground;
var context;
var contextGesture;
var contextBackground;
var contextSemiForeground;
var contextForeground;
var drawInterval;
var drawTimeout;
var drawing = false;
//Multithreading
var animateWorker;
//Animation Counter
var frameNo = 0;
//Media
var pics;
var objects3D;
//Resize
var resizeTimeout;
var resized = false;
//Modes
var currentMode;
var modeSwitchingTimeout;
var modeSwitchingReloadTimeout;
var modeSwitching = true;
//Background
var oldBackground;
//Trains
var trains;
var trains3D;
var rotationPoints;
var trainParams;
//Switches
var switches;
var switches3D;
var switchParams;
//Cars
var cars;
var cars3D;
var carWays;
var carParams;
//Tax office
var taxOffice;
//Classic UI
var classicUI;
//GUI configuration
var gui;
var menus = {};
var konamiState = 0;
var konamiTimeOut;
//Multiplayer mode
var multiplayerMode = {
    animateInterval: 40,
    syncInterval: 10000,
    excludeFromSync: { t: ["width", "height", "assetFlip", "lastDirectionChange", "crash", "src", "trainSwitchSrc", "flickerFacFront", "flickerFacFrontOffset", "flickerFacBack", "flickerFacBackOffset", "fac", "margin", "bogieDistance", "accelerationSpeedStartFac", "accelerationSpeedFac", "speed", "speedFac", "wheels", "cars"], tc: ["width", "height", "assetFlip", "konamiUseTrainIcon", "src", "fac", "bogieDistance", "wheels"] },
    chatSticker: 7,
    serverURI: getServerLink(Protocols.WebSocket) + "/multiplay",
    waitingClock: {
        init: function () {
            var initialZoom = 0.45;
            multiplayerMode.waitingClock.initTime = Date.now();
            multiplayerMode.waitingClock.zoom = initialZoom;
            multiplayerMode.waitingClock.secondHandBackwards = false;
        },
        draw: function () {
            if (Date.now() - multiplayerMode.waitingClock.initTime < 5000) {
                return;
            }
            multiplayerMode.waitingClock.visible = onlineConnection.stop;
            //WAITING CLOCK/GLOBAL/SETUP/1
            contextForeground.save();
            contextForeground.translate(canvasForeground.width / 2, canvasForeground.height / 2);
            contextForeground.translate(0, (-menus.outerContainer.height * client.devicePixelRatio) / 2);
            var size = Math.min(background.width, background.height);
            var radius = size / 2.2;
            //WAITING CLOCK/STATIC/BACKGROUND
            contextForeground.save();
            var bgGradient = contextForeground.createRadialGradient(0, 0, radius * multiplayerMode.waitingClock.zoom, 0, 0, radius * 2);
            bgGradient.addColorStop(0, "rgba(239,224,227,1)");
            bgGradient.addColorStop(0.1, "rgba(239,224,227,0.3)");
            bgGradient.addColorStop(1, "rgba(100,92,130,0.3)");
            contextForeground.fillStyle = bgGradient;
            contextForeground.globalAlpha = 0.6;
            contextForeground.fillStyle = bgGradient;
            contextForeground.fillRect(-canvasForeground.width / 2, -canvasForeground.height / 2 + (menus.outerContainer.height * client.devicePixelRatio) / 2, canvasForeground.width, canvasForeground.height);
            contextForeground.restore();
            //WAITING CLOCK/GLOBAL/SCALE
            contextForeground.scale(multiplayerMode.waitingClock.zoom, multiplayerMode.waitingClock.zoom);
            //WAITING CLOCK/STATIC/CLOCK FACE
            var circleWidth = size / 20;
            contextForeground.beginPath();
            contextForeground.arc(0, 0, radius - circleWidth / 4, 0, Math.PI * 2);
            contextForeground.lineWidth = circleWidth / 2;
            contextForeground.strokeStyle = "rgba(0,0,0,0.7)";
            contextForeground.stroke();
            for (var i = 0; i < 60; i++) {
                var rectWidth = size / 70;
                var rectHeight = size / 25;
                if (i % 5 == 0) {
                    rectWidth *= 2;
                    rectHeight *= 2.5;
                }
                if (i % 15 == 0) {
                    rectHeight *= 1.2;
                }
                var angle = (Math.PI * 2 * i) / 60;
                contextForeground.save();
                contextForeground.fillStyle = "rgba(15,15,15,0.5)";
                contextForeground.translate(radius * Math.sin(angle), radius * Math.cos(angle));
                contextForeground.rotate(-angle);
                contextForeground.fillRect(-rectWidth / 2, -rectHeight - circleWidth / 1.5, rectWidth, rectHeight);
                contextForeground.restore();
            }
            //WAITING CLOCK/DYNAMIC/CLOCK HANDS
            var date = new Date();
            //WAITING CLOCK/DYNAMIC/CLOCK HAND/HOURS
            var hours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
            if (hours > 12) {
                hours -= 12;
            }
            var rectWidth = size / 28;
            var rectHeight = size / 4;
            var angle = (Math.PI * 2 * hours) / 12;
            contextForeground.save();
            contextForeground.rotate(angle);
            contextForeground.save();
            contextForeground.globalCompositeOperation = "destination-out";
            contextForeground.fillStyle = "white";
            contextForeground.fillRect(-rectWidth / 2, -rectHeight, rectWidth, rectHeight);
            contextForeground.restore();
            contextForeground.fillStyle = "rgba(0,0,0,0.5)";
            contextForeground.fillRect(-rectWidth / 2, -rectHeight, rectWidth, rectHeight);
            contextForeground.restore();
            //WAITING CLOCK/DYNAMIC/CLOCK HAND/MINUTES
            var minutes = date.getMinutes();
            var rectWidth = size / 30;
            var rectHeight = size / 3;
            var angle = (Math.PI * 2 * minutes) / 60;
            contextForeground.save();
            contextForeground.rotate(angle);
            contextForeground.save();
            contextForeground.globalCompositeOperation = "destination-out";
            contextForeground.fillStyle = "white";
            contextForeground.fillRect(-rectWidth / 2, -rectHeight, rectWidth, rectHeight);
            contextForeground.restore();
            contextForeground.fillStyle = "rgba(0,0,0,0.5)";
            contextForeground.fillRect(-rectWidth / 2, -rectHeight, rectWidth, rectHeight);
            contextForeground.restore();
            //WAITING CLOCK/DYNAMIC/CLOCK HAND/SECONDS
            var seconds = date.getSeconds() + date.getMilliseconds() / 1000;
            var rectWidth = size / 100;
            var rectHeight = size / 2.95;
            var angle = Math.min(2 * Math.PI, (Math.PI * 2 * seconds) / 58);
            if (Math.round(angle * 100) % Math.round(Math.PI * 100) == 0) {
                multiplayerMode.waitingClock.secondHandBackwards = konamiState < 0;
            }
            if (multiplayerMode.waitingClock.secondHandBackwards) {
                angle = Math.PI * 2 - angle;
            }
            contextForeground.save();
            contextForeground.rotate(angle);
            contextForeground.save();
            contextForeground.globalCompositeOperation = "destination-out";
            contextForeground.fillStyle = "white";
            contextForeground.fillRect(-rectWidth / 2, -rectHeight, rectWidth, rectHeight);
            contextForeground.restore();
            contextForeground.fillStyle = "rgba(139,0,0,0.5)";
            contextForeground.fillRect(-rectWidth / 2, -rectHeight, rectWidth, rectHeight);
            contextForeground.restore();
            var rectWidth = size / 55;
            var rectHeight = size / 8;
            contextForeground.save();
            contextForeground.rotate(angle);
            contextForeground.save();
            contextForeground.globalCompositeOperation = "destination-out";
            contextForeground.fillStyle = "white";
            contextForeground.fillRect(-rectWidth / 2, 0, rectWidth, rectHeight);
            contextForeground.restore();
            contextForeground.fillStyle = "rgba(139,0,0,0.5)";
            contextForeground.fillRect(-rectWidth / 2, 0, rectWidth, rectHeight);
            contextForeground.restore();
            //WAITING CLOCK/STATIC/CLOCK HANDS
            contextForeground.save();
            contextForeground.globalCompositeOperation = "destination-out";
            contextForeground.beginPath();
            contextForeground.arc(0, 0, size / 30, 0, Math.PI * 2);
            contextForeground.fillStyle = "white";
            contextForeground.fill();
            contextForeground.restore();
            contextForeground.beginPath();
            contextForeground.arc(0, 0, size / 30, 0, Math.PI * 2);
            contextForeground.fillStyle = "rgba(0,0,0,0.5)";
            contextForeground.fill();
            contextForeground.beginPath();
            contextForeground.arc(0, 0, size / 60, 0, Math.PI * 2);
            contextForeground.fillStyle = "rgba(192,192,192,0.5)";
            contextForeground.fill();
            contextForeground.beginPath();
            contextForeground.arc(0, 0, size / 120, 0, Math.PI * 2);
            contextForeground.fillStyle = "rgba(0,0,0,0.5)";
            contextForeground.fill();
            //WAITING CLOCK/GLOBAL/SETUP/2
            contextForeground.restore();
            multiplayerMode.waitingClock.zoom *= 1.0375;
            if (multiplayerMode.waitingClock.zoom > 1) {
                multiplayerMode.waitingClock.zoom = 1;
            }
        }
    }
};
var onlineConnection = {};
//Client and input configuration
var movingTimeOut;
var clickTimeOut;
/*******************************************
 *            Event Listeners              *
 ******************************************/
function prepareInit(selectedMode) {
    function setMode() {
        if (selectedMode == undefined) {
            //Default mode
            currentMode = Modes.SINGLEPLAYER;
            //Demo by settings
            if (getSetting("startDemoMode")) {
                currentMode = Modes.DEMO;
            }
            //Determine mode
            var queryStringMode = getQueryStringValue("mode");
            if (Object.values(Modes).includes(queryStringMode)) {
                currentMode = queryStringMode;
            }
        }
        else {
            currentMode = selectedMode;
        }
        document.body.style.cursor = "";
        if (currentMode == Modes.MULTIPLAYER) {
            if (!("WebSocket" in window)) {
                notify("#canvas-notifier", getString("appScreenTeamplayNoWebsocket", "!", "upper"), NotificationPriority.High, 6000, null, null, client.y + menus.outerContainer.height);
                currentMode = Modes.SINGLEPLAYER;
            }
        }
        else if (currentMode == Modes.DEMO) {
            document.body.style.cursor = "none";
            demoMode.standalone = getQueryStringValue("demo-standalone") == "1";
        }
    }
    //Reset GUI
    gui = {};
    //Reconfigure mode
    setMode();
    //Show loading image
    loadingAnimation.init();
    loadingAnimation.show(currentMode != Modes.SINGLEPLAYER);
}
function init(state) {
    var _a;
    if (state === void 0) { state = "reload"; }
    function defineCarWays() {
        function defineCarWay(cType, isFirst, i, j, obj, currentObjectInput, stateNullAgain) {
            if (j === void 0) { j = 0; }
            if (obj === void 0) { obj = []; }
            if (currentObjectInput === void 0) { currentObjectInput = undefined; }
            if (stateNullAgain === void 0) { stateNullAgain = false; }
            function curve_right(p) {
                if (p.x[0] != p.x[1]) {
                    p.x[1] = p.x[0];
                }
                var radius = Math.abs(p.y[0] - p.y[1]) / 2;
                var arc = Math.abs(currentObject.angle) * radius;
                arc += currentObject.speed;
                currentObject.angle = arc / radius;
                var chord = 2 * radius * Math.sin(currentObject.angle / 2);
                var gamma = Math.PI / 2 - (Math.PI - currentObject.angle) / 2;
                var x = Math.cos(gamma) * chord;
                var y = Math.sin(gamma) * chord;
                currentObject.x = p.y[1] < p.y[0] ? x + p.x[1] : x + p.x[0];
                currentObject.y = p.y[1] < p.y[0] ? y + p.y[1] : y + p.y[0];
                if (p.y[1] > p.y[0]) {
                    if (arc >= Math.PI * radius || currentObject.angle >= Math.PI) {
                        currentObject.x = p.x[1];
                        currentObject.y = p.y[1];
                        currentObject.angle = Math.PI;
                        testShortcutToParking();
                        currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                    }
                }
                else {
                    if (arc >= 2 * Math.PI * radius || currentObject.angle >= 2 * Math.PI) {
                        currentObject.x = p.x[1];
                        currentObject.y = p.y[1];
                        currentObject.angle = 0;
                        testShortcutToParking();
                        currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                    }
                }
                currentObject.displayAngle = currentObject.angle;
            }
            function curve_left(p) {
                if (p.x[0] != p.x[1]) {
                    p.x[1] = p.x[0];
                }
                var radius = Math.abs(p.y[0] - p.y[1]) / 2;
                var arc = Math.abs(currentObject.angle) * radius;
                arc += currentObject.speed;
                currentObject.angle = arc / radius;
                var chord = 2 * radius * Math.sin(currentObject.angle / 2);
                var gamma = Math.PI / 2 - (Math.PI - currentObject.angle) / 2;
                var x = Math.cos(gamma) * chord;
                var y = Math.sin(gamma) * chord;
                currentObject.x = p.y[1] < p.y[0] ? p.x[0] + x : p.x[1] + x;
                currentObject.y = p.y[1] < p.y[0] ? p.y[0] - y : p.y[1] - y;
                if (p.y[1] > p.y[0]) {
                    if (arc >= 2 * Math.PI * radius || currentObject.angle >= 2 * Math.PI) {
                        currentObject.x = p.x[1];
                        currentObject.y = p.y[1];
                        currentObject.angle = 0;
                        testShortcutToParking();
                        currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                    }
                }
                else {
                    if (arc >= Math.PI * radius || currentObject.angle >= Math.PI) {
                        currentObject.x = p.x[1];
                        currentObject.y = p.y[1];
                        currentObject.angle = Math.PI;
                        testShortcutToParking();
                        currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                    }
                }
                currentObject.displayAngle = -currentObject.angle;
            }
            function testShortcutToParking() {
                if (carPaths[i][cType][currentObject.state].x[1] == carPaths[i]["start"][carPaths[i]["start"].length - 1].x[1] && carPaths[i][cType][currentObject.state].y[1] == carPaths[i]["start"][carPaths[i]["start"].length - 1].y[1]) {
                    currentObject.shortcutToParking = true;
                }
            }
            var currentObject;
            if (typeof currentObjectInput == "undefined") {
                currentObject = copyJSObject(cars[i]);
                currentObject.speed = cars[i].speedFac * background.width;
                currentObject.state = 0;
                currentObject.angle = currentObject.displayAngle = cars[i].angles[cType];
                currentObject.x = carPaths[i][cType][0].x[0];
                currentObject.y = carPaths[i][cType][0].y[0];
            }
            else {
                currentObject = currentObjectInput;
            }
            obj[j] = {};
            obj[j].x = currentObject.x;
            obj[j].y = currentObject.y;
            if (currentObject.shortcutToParking) {
                obj[j].shortcutToParking = true;
                currentObject.shortcutToParking = false;
            }
            while (currentObject.displayAngle < 0) {
                currentObject.displayAngle += Math.PI * 2;
            }
            while (currentObject.displayAngle >= Math.PI * 2) {
                currentObject.displayAngle -= Math.PI * 2;
            }
            obj[j].angle = currentObject.displayAngle;
            switch (carPaths[i][cType][currentObject.state].type) {
                case "linear":
                    currentObject.angle = currentObject.angle < Math.PI / 2 ? 0 : Math.PI;
                    currentObject.x += currentObject.speed * (currentObject.angle < Math.PI / 2 ? 1 : -1);
                    if (currentObject.angle < Math.PI / 2) {
                        if (currentObject.x >= carPaths[i][cType][currentObject.state].x[1]) {
                            currentObject.x = carPaths[i][cType][currentObject.state].x[1];
                            testShortcutToParking();
                            currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                        }
                    }
                    else {
                        if (currentObject.x <= carPaths[i][cType][currentObject.state].x[1]) {
                            currentObject.x = carPaths[i][cType][currentObject.state].x[1];
                            testShortcutToParking();
                            currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                        }
                    }
                    currentObject.displayAngle = currentObject.angle;
                    break;
                case "linear_vertical":
                    currentObject.angle = currentObject.angle < Math.PI ? 0.5 * Math.PI : 1.5 * Math.PI;
                    currentObject.y += currentObject.speed * (currentObject.angle < Math.PI ? 1 : -1);
                    if (currentObject.angle < Math.PI) {
                        if (currentObject.y >= carPaths[i][cType][currentObject.state].y[1]) {
                            currentObject.y = carPaths[i][cType][currentObject.state].y[1];
                            testShortcutToParking();
                            currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                        }
                    }
                    else {
                        if (currentObject.y <= carPaths[i][cType][currentObject.state].y[1]) {
                            currentObject.y = carPaths[i][cType][currentObject.state].y[1];
                            testShortcutToParking();
                            currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                        }
                    }
                    currentObject.displayAngle = currentObject.angle;
                    break;
                case "curve_right":
                    curve_right(carPaths[i][cType][currentObject.state]);
                    break;
                case "curve_left":
                    curve_left(carPaths[i][cType][currentObject.state]);
                    break;
                case "curve_r2l":
                    var p = copyJSObject(carPaths[i][cType][currentObject.state]);
                    if (carPaths[i][cType][currentObject.state].y[0] < carPaths[i][cType][currentObject.state].y[1]) {
                        var dx = (carPaths[i][cType][currentObject.state].x[1] - carPaths[i][cType][currentObject.state].x[0]) / 2;
                        var dy = (carPaths[i][cType][currentObject.state].y[1] - carPaths[i][cType][currentObject.state].y[0]) / 2;
                        if (currentObject.angle <= Math.PI) {
                            p.y[1] = carPaths[i][cType][currentObject.state].y[0] + 2 * ((Math.pow(dy, 2) + Math.pow(dx, 2)) / (2 * dy));
                            curve_right(p);
                            if (currentObject.y >= carPaths[i][cType][currentObject.state].y[0] + (carPaths[i][cType][currentObject.state].y[1] - carPaths[i][cType][currentObject.state].y[0]) / 2) {
                                var diff = currentObject.angle - (Math.PI * 45) / 180;
                                currentObject.angle = (Math.PI * 315) / 180 - diff;
                                currentObject.x = carPaths[i][cType][currentObject.state].x[0] - (carPaths[i][cType][currentObject.state].x[0] - carPaths[i][cType][currentObject.state].x[1]) / 2;
                                currentObject.y = carPaths[i][cType][currentObject.state].y[0] + (carPaths[i][cType][currentObject.state].y[1] - carPaths[i][cType][currentObject.state].y[0]) / 2;
                            }
                        }
                        else {
                            p.x[0] = carPaths[i][cType][currentObject.state].x[1];
                            p.y[0] = carPaths[i][cType][currentObject.state].y[1] - 2 * ((Math.pow(dy, 2) + Math.pow(dx, 2)) / (2 * dy));
                            curve_left(p);
                        }
                    }
                    else {
                        var dx = (carPaths[i][cType][currentObject.state].x[0] - carPaths[i][cType][currentObject.state].x[1]) / 2;
                        var dy = (carPaths[i][cType][currentObject.state].y[0] - carPaths[i][cType][currentObject.state].y[1]) / 2;
                        if (currentObject.angle >= Math.PI) {
                            p.y[1] = carPaths[i][cType][currentObject.state].y[0] - 2 * ((Math.pow(dy, 2) + Math.pow(dx, 2)) / (2 * dy));
                            curve_right(p);
                            if (currentObject.y <= carPaths[i][cType][currentObject.state].y[0] - (carPaths[i][cType][currentObject.state].y[0] - carPaths[i][cType][currentObject.state].y[1]) / 2) {
                                var diff = currentObject.angle - (Math.PI * 225) / 180;
                                currentObject.angle = (Math.PI * 135) / 180 - diff;
                                currentObject.x = carPaths[i][cType][currentObject.state].x[0] + (carPaths[i][cType][currentObject.state].x[1] - carPaths[i][cType][currentObject.state].x[0]) / 2;
                                currentObject.y = carPaths[i][cType][currentObject.state].y[0] - (carPaths[i][cType][currentObject.state].y[0] - carPaths[i][cType][currentObject.state].y[1]) / 2;
                            }
                        }
                        else {
                            p.x[0] = carPaths[i][cType][currentObject.state].x[1];
                            p.y[0] = carPaths[i][cType][currentObject.state].y[1] + 2 * ((Math.pow(dy, 2) + Math.pow(dx, 2)) / (2 * dy));
                            curve_left(p);
                        }
                    }
                    break;
                case "curve_l2r":
                    if (carPaths[i][cType][currentObject.state].y[0] < carPaths[i][cType][currentObject.state].y[1]) {
                        var dx = (carPaths[i][cType][currentObject.state].x[0] - carPaths[i][cType][currentObject.state].x[1]) / 2;
                        var dy = (carPaths[i][cType][currentObject.state].y[1] - carPaths[i][cType][currentObject.state].y[0]) / 2;
                        var p = copyJSObject(carPaths[i][cType][currentObject.state]);
                        if (currentObject.angle >= Math.PI) {
                            p.y[1] = carPaths[i][cType][currentObject.state].y[0] + 2 * ((Math.pow(dy, 2) + Math.pow(dx, 2)) / (2 * dy));
                            curve_left(p);
                            if (currentObject.y >= carPaths[i][cType][currentObject.state].y[0] + (carPaths[i][cType][currentObject.state].y[1] - carPaths[i][cType][currentObject.state].y[0]) / 2) {
                                var diff = currentObject.angle - (Math.PI * 225) / 180;
                                currentObject.angle = (Math.PI * 135) / 180 - diff;
                                currentObject.x = carPaths[i][cType][currentObject.state].x[0] - (carPaths[i][cType][currentObject.state].x[0] - carPaths[i][cType][currentObject.state].x[1]) / 2;
                                currentObject.y = carPaths[i][cType][currentObject.state].y[0] + (carPaths[i][cType][currentObject.state].y[1] - carPaths[i][cType][currentObject.state].y[0]) / 2;
                            }
                        }
                        else {
                            p.x[0] = carPaths[i][cType][currentObject.state].x[1];
                            p.y[0] = carPaths[i][cType][currentObject.state].y[1] - 2 * ((Math.pow(dy, 2) + Math.pow(dx, 2)) / (2 * dy));
                            curve_right(p);
                        }
                    }
                    else {
                        var dx = (carPaths[i][cType][currentObject.state].x[1] - carPaths[i][cType][currentObject.state].x[0]) / 2;
                        var dy = (carPaths[i][cType][currentObject.state].y[0] - carPaths[i][cType][currentObject.state].y[1]) / 2;
                        var p = copyJSObject(carPaths[i][cType][currentObject.state]);
                        if (currentObject.angle <= Math.PI) {
                            p.y[1] = carPaths[i][cType][currentObject.state].y[0] - 2 * ((Math.pow(dy, 2) + Math.pow(dx, 2)) / (2 * dy));
                            curve_left(p);
                            if (currentObject.y <= carPaths[i][cType][currentObject.state].y[0] - (carPaths[i][cType][currentObject.state].y[0] - carPaths[i][cType][currentObject.state].y[1]) / 2) {
                                var diff = currentObject.angle - (Math.PI * 45) / 180;
                                currentObject.angle = (Math.PI * 315) / 180 - diff;
                                currentObject.x = carPaths[i][cType][currentObject.state].x[0] + (carPaths[i][cType][currentObject.state].x[1] - carPaths[i][cType][currentObject.state].x[0]) / 2;
                                currentObject.y = carPaths[i][cType][currentObject.state].y[0] - (carPaths[i][cType][currentObject.state].y[0] - carPaths[i][cType][currentObject.state].y[1]) / 2;
                            }
                        }
                        else {
                            p.x[0] = carPaths[i][cType][currentObject.state].x[1];
                            p.y[0] = carPaths[i][cType][currentObject.state].y[1] + 2 * ((Math.pow(dy, 2) + Math.pow(dx, 2)) / (2 * dy));
                            curve_right(p);
                        }
                    }
                    break;
                case "curve_hright":
                    var p = copyJSObject(carPaths[i][cType][currentObject.state]);
                    curve_right(p);
                    if (p.y[1] > p.y[0]) {
                        if (currentObject.angle >= 0.5 * Math.PI) {
                            currentObject.x = p.x[1] + (p.y[1] - p.y[0]) / 2;
                            currentObject.y = p.y[1] - (p.y[1] - p.y[0]) / 2;
                            currentObject.angle = currentObject.displayAngle = 0.5 * Math.PI;
                            testShortcutToParking();
                            currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                        }
                    }
                    else {
                        if (currentObject.angle >= 1.5 * Math.PI) {
                            currentObject.x = p.x[1] - (p.y[0] - p.y[1]) / 2;
                            currentObject.y = p.y[1] + (p.y[0] - p.y[1]) / 2;
                            currentObject.angle = currentObject.displayAngle = 1.5 * Math.PI;
                            testShortcutToParking();
                            currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                        }
                    }
                    break;
                case "curve_hleft":
                    var p = copyJSObject(carPaths[i][cType][currentObject.state]);
                    curve_left(p);
                    if (p.y[1] > p.y[0]) {
                        //TODO: Add definition
                    }
                    else {
                        if (currentObject.angle >= 0.5 * Math.PI) {
                            currentObject.x = p.x[1] + (p.y[0] - p.y[1]) / 2;
                            currentObject.y = p.y[1] + (p.y[0] - p.y[1]) / 2;
                            currentObject.angle = currentObject.displayAngle = 1.5 * Math.PI;
                            testShortcutToParking();
                            currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                        }
                    }
                    break;
                case "curve_hright2":
                    curve_right(carPaths[i][cType][currentObject.state]);
                    break;
                case "curve_hleft2":
                    if (currentObject.angle == 0.5 * Math.PI || currentObject.angle == 1.5 * Math.PI) {
                        currentObject.angle = 2 * Math.PI - currentObject.angle;
                    }
                    curve_left(carPaths[i][cType][currentObject.state]);
                    break;
            }
            if (!stateNullAgain && (currentObject.state > 0 || currentObject.state == -1)) {
                stateNullAgain = true;
                if (isFirst) {
                    cars[i].startFrame = cars[i].counter = Math.floor(cars[i].startFrameFac * j);
                }
            }
            return (currentObject.state === 0 || currentObject.state == -1) && stateNullAgain ? obj : defineCarWay(cType, isFirst, i, ++j, obj, currentObject, stateNullAgain);
        }
        var carPaths = [
            {
                start: [{ type: "curve_right", x: [0.29, 0.29], y: [0.38, 0.227] }],
                normal: [
                    { type: "curve_hright", x: [0.29, 0.29], y: [0.227, 0.347] },
                    { type: "linear_vertical", x: [0, 0], y: [0, 0] },
                    { type: "curve_hright2", x: [0, 0], y: [0.282, 0.402] },
                    { type: "curve_l2r", x: [0, 0.25], y: [0.402, 0.412] },
                    { type: "linear", x: [0.25, 0.225], y: [0.412, 0.412] },
                    { type: "curve_right", x: [0.225, 0.225], y: [0.412, 0.227] },
                    { type: "linear", x: [0.225, 0.29], y: [0.227, 0.227] }
                ]
            },
            {
                start: [
                    { type: "curve_left", x: [0.26, 0.26], y: [0.3, 0.198] },
                    { type: "curve_r2l", x: [0.26, 0.216], y: [0.198, 0.197] }
                ],
                normal: [
                    { type: "curve_left", x: [0.216, 0.216], y: [0.197, 0.419] },
                    { type: "linear", x: [0.216, 0.246], y: [0.419, 419] },
                    { type: "curve_r2l", x: [0.246, 0.286], y: [0.419, 0.43] },
                    { type: "linear", x: [0.286, 0.31], y: [0.43, 0.43] },
                    { type: "curve_hleft", x: [0.31, 0.31], y: [0.43, 0.33] },
                    { type: "linear_vertical", x: [0, 0], y: [0, 0] },
                    { type: "curve_hleft2", x: [0, 0], y: [0.347, 0.197] },
                    { type: "linear", x: [0, 0.216], y: [0.197, 0.197] },
                    { type: "curve_left", x: [0.216, 0.216], y: [0.197, 0.419] },
                    { type: "linear", x: [0.216, 0.246], y: [0.419, 419] },
                    { type: "curve_r2l", x: [0.246, 0.276], y: [0.419, 0.434] },
                    { type: "linear", x: [0.276, 0.38], y: [0.434, 434] },
                    { type: "curve_l2r", x: [0.38, 0.46], y: [0.434, 0.419] },
                    { type: "linear", x: [0.46, 0.631], y: [0.419, 0.419] },
                    { type: "curve_r2l", x: [0.631, 0.665], y: [0.419, 0.43] },
                    { type: "curve_left", x: [0.665, 0.665], y: [0.43, 0.322] },
                    { type: "curve_l2r", x: [0.665, 0.59], y: [0.322, 0.39] },
                    { type: "linear", x: [0.59, 0.339], y: [0.39, 0.39] },
                    { type: "curve_hright", x: [0.339, 0.339], y: [0.39, 0.32] },
                    { type: "linear_vertical", x: [0, 0], y: [0, 0] },
                    { type: "curve_hleft2", x: [0, 0], y: [0.347, 0.197] },
                    { type: "linear", x: [0, 0.216], y: [0.197, 0.197] }
                ]
            },
            {
                start: [
                    { type: "curve_right", x: [0.2773, 0.2773], y: [0.38, 0.227] },
                    { type: "linear", x: [0.2773, 0.29], y: [0.227, 0.227] }
                ],
                normal: [
                    { type: "curve_hright", x: [0.29, 0.29], y: [0.227, 0.347] },
                    { type: "linear_vertical", x: [0, 0], y: [0, 0] },
                    { type: "curve_hleft2", x: [0, 0], y: [0.299, 0.419] },
                    { type: "linear", x: [0, 0.631], y: [0.419, 0.419] },
                    { type: "curve_r2l", x: [0.631, 0.665], y: [0.419, 0.43] },
                    { type: "curve_left", x: [0.665, 0.665], y: [0.43, 0.322] },
                    { type: "curve_l2r", x: [0.665, 0.59], y: [0.322, 0.39] },
                    { type: "linear", x: [0.59, 0.339], y: [0.39, 0.39] },
                    { type: "curve_l2r", x: [0.339, 0.25], y: [0.39, 0.412] },
                    { type: "linear", x: [0.25, 0.225], y: [0.412, 0.412] },
                    { type: "curve_right", x: [0.225, 0.225], y: [0.412, 0.227] },
                    { type: "linear", x: [0.225, 0.29], y: [0.227, 0.227] }
                ]
            }
        ];
        cars.forEach(function (car) {
            car.collStop = true;
            car.collStopNo = [];
        });
        for (var i = 0; i < cars.length; i++) {
            var types = Object.keys(carPaths[i]);
            for (var cTypeNo = 0; cTypeNo < types.length; cTypeNo++) {
                var cType = types[cTypeNo];
                carPaths[i][cType].forEach(function (cPoint) {
                    for (var k = 0; k < cPoint.x.length && k < cPoint.y.length; k++) {
                        cPoint.x[k] *= background.width;
                        cPoint.y[k] *= background.height;
                    }
                });
                for (var j = 0; j < carPaths[i][cType].length; j++) {
                    for (var k = 0; k < carPaths[i][cType][j].type.length; k++) {
                        switch (carPaths[i][cType][j].type) {
                            case "linear_vertical":
                                carPaths[i][cType][j].x[0] = carPaths[i][cType][j].x[1] = carPaths[i][cType][j - 1].x[1] + Math.abs((carPaths[i][cType][j - 1].y[1] - carPaths[i][cType][j - 1].y[0]) / 2) * (carPaths[i][cType][j - 1].type == "curve_hright" ? 1 : -1) * (carPaths[i][cType][j - 1].y[1] > carPaths[i][cType][j - 1].y[0] ? 1 : -1);
                                carPaths[i][cType][j].y[0] = carPaths[i][cType][j - 1].y[0] + (carPaths[i][cType][j - 1].y[1] - carPaths[i][cType][j - 1].y[0]) / 2;
                                carPaths[i][cType][j].y[1] = carPaths[i][cType][j + 1].y[1] + (carPaths[i][cType][j + 1].y[0] - carPaths[i][cType][j + 1].y[1]) / 2;
                                break;
                            case "curve_hright2":
                                var x0 = carPaths[i][cType][j - 1].x[0] - (carPaths[i][cType][j].y[1] - carPaths[i][cType][j].y[0]) / 2;
                                carPaths[i][cType][j].x = [x0, x0];
                                carPaths[i][cType][j + 1 >= carPaths[i][cType].length ? 0 : j + 1].x[0] = x0;
                                break;
                            case "curve_hleft2":
                                var x0 = carPaths[i][cType][j - 1].x[0] - (carPaths[i][cType][j].y[0] - carPaths[i][cType][j].y[1]) / 2;
                                carPaths[i][cType][j].x = [x0, x0];
                                carPaths[i][cType][j + 1 >= carPaths[i][cType].length ? 0 : j + 1].x[0] = x0;
                                break;
                        }
                    }
                }
                if (typeof carWays[i] == "undefined") {
                    carWays[i] = {};
                }
                try {
                    carWays[i][cType] = defineCarWay(cType, (typeof carPaths[i].start == "undefined" && cType == "normal") || cType == "start", i);
                }
                catch (e) {
                    carWays = cars = cars3D = [];
                    if (three.cameraMode == ThreeCameraModes.FOLLOW_CAR) {
                        three.cameraMode = ThreeCameraModes.BIRDS_EYE;
                    }
                    return false;
                }
            }
        }
        return true;
    }
    if (state == "reload") {
        //Reset multiplayer mode
        (_a = onlineConnection.socket) === null || _a === void 0 ? void 0 : _a.close();
        //Reset timeouts
        if (drawTimeout !== undefined && drawTimeout !== null) {
            clearTimeout(drawTimeout);
        }
        if (resizeTimeout !== undefined && resizeTimeout !== null) {
            clearTimeout(resizeTimeout);
        }
        if (movingTimeOut !== undefined && movingTimeOut !== null) {
            clearTimeout(movingTimeOut);
        }
        if (clickTimeOut !== undefined && clickTimeOut !== null) {
            clearTimeout(clickTimeOut);
        }
        if (konamiTimeOut !== undefined && konamiTimeOut !== null) {
            clearTimeout(konamiTimeOut);
        }
        if (demoMode.leaveTimeout != undefined && demoMode.leaveTimeout != null) {
            clearTimeout(demoMode.leaveTimeout);
        }
        if (demoMode.reloadTimeout != undefined && demoMode.reloadTimeout != null) {
            clearTimeout(demoMode.reloadTimeout);
        }
        if (demoMode.reloadOnExitTimeout != undefined && demoMode.reloadOnExitTimeout != null) {
            clearTimeout(demoMode.reloadOnExitTimeout);
        }
        if (multiplayerMode.resizedTimeout !== undefined && multiplayerMode.resizedTimeout !== null) {
            clearTimeout(multiplayerMode.resizedTimeout);
        }
        if (multiplayerMode.syncRequestTimeout !== undefined && multiplayerMode.syncRequestTimeout !== null) {
            clearTimeout(multiplayerMode.syncRequestTimeout);
        }
        if (menus.infoOverlay.textTimeout != undefined && menus.infoOverlay.textTimeout != null) {
            clearTimeout(menus.infoOverlay.textTimeout);
        }
        //Reset all canvases
        canvas.style.display = "none";
        canvasGesture.style.display = "none";
        canvasBackground.style.display = "none";
        canvasSemiForeground.style.display = "none";
        background3D.behind.style.display = "none";
        if (background3D.behindClone) {
            background3D.behindClone.remove();
        }
        three.renderer.domElement.style.display = "none";
        //Reset three scene
        while (three.scene.children.length > 0) {
            three.scene.remove(three.scene.children[0]);
        }
        //Reset previous event listeners
        //Load
        document.removeEventListener("contextmenu", preventEvent);
        document.removeEventListener("wheel", preventEvent);
        document.removeEventListener("keydown", preventKeyZoomDuringLoad);
        document.removeEventListener("keyup", preventKeyZoomDuringLoad);
        window.removeEventListener("resize", requestResize);
        //Normal mode
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
        canvasForeground.removeEventListener("touchmove", getTouchMove);
        canvasForeground.removeEventListener("touchstart", getTouchStart);
        canvasForeground.removeEventListener("touchend", getTouchEnd);
        canvasForeground.removeEventListener("touchcancel", getTouchCancel);
        canvasForeground.removeEventListener("mousemove", onMouseMove);
        canvasForeground.removeEventListener("mousedown", onMouseDown);
        canvasForeground.removeEventListener("mouseup", onMouseUp);
        canvasForeground.removeEventListener("mouseout", onMouseOut);
        canvasForeground.removeEventListener("mouseenter", onMouseEnter);
        canvasForeground.removeEventListener("contextmenu", onMouseRight);
        canvasForeground.removeEventListener("wheel", onMouseWheel);
        //Demo mode
        document.removeEventListener("keyup", demoMode.leaveKeyUp);
        document.removeEventListener("touchstart", demoMode.leaveTimeoutStart);
        document.removeEventListener("touchend", demoMode.leaveTimeoutEnd);
        document.removeEventListener("touchcancel", demoMode.leaveTimeoutEnd);
        document.removeEventListener("mousedown", demoMode.leaveTimeoutStart);
        document.removeEventListener("mouseup", demoMode.leaveTimeoutEnd);
        document.removeEventListener("mouseout", demoMode.leaveTimeoutEnd);
        //Reset konami state
        konamiState = 0;
        //Reset gestures
        resetAll();
        //Reset resize
        resized = false;
    }
    //Default multiplayer mode
    onlineConnection = {
        send: function (mode, message) {
            if (onlineConnection.socket && onlineConnection.socket.readyState == WebSocket.OPEN) {
                onlineConnection.socket.send(JSON.stringify({
                    mode: mode,
                    data: message
                }));
            }
            else if (APP_DATA.debug) {
                console.error("Websocket: Error sending message");
            }
        }
    };
    trainParams.selected = Math.floor(Math.random() * trains.length);
    //Default switches
    var switchParamsDefault = {
        showDuration: 11,
        showDurationFade: 33,
        showDurationEnd: 44,
        set: function () {
            switchParams.radius = 0.02 * background.width;
        }
    };
    var switchesDefault = {
        inner2outer: { left: { turned: false, angles: { normal: 1.01 * Math.PI, turned: 0.941 * Math.PI } }, right: { turned: false, angles: { normal: 1.5 * Math.PI, turned: 1.56 * Math.PI } } },
        outer2inner: { left: { turned: false, angles: { normal: 0.25 * Math.PI, turned: 0.2 * Math.PI } }, right: { turned: false, angles: { normal: 0.27 * Math.PI, turned: 0.35 * Math.PI } } },
        innerWide: { left: { turned: false, angles: { normal: 1.44 * Math.PI, turned: 1.37 * Math.PI } }, right: { turned: false, angles: { normal: 1.02 * Math.PI, turned: 1.1 * Math.PI } } },
        outerAltState3: { left: { turned: true, angles: { normal: 1.75 * Math.PI, turned: 1.85 * Math.PI } }, right: { turned: true, angles: { normal: 0.75 * Math.PI, turned: 0.65 * Math.PI } } },
        sidings1: { left: { turned: false, angles: { normal: 1.75 * Math.PI, turned: 1.7 * Math.PI } } },
        sidings2: { left: { turned: false, angles: { normal: 1.65 * Math.PI, turned: 1.72 * Math.PI } } },
        sidings3: { left: { turned: false, angles: { normal: 1.65 * Math.PI, turned: 1.73 * Math.PI } } },
        outerRightSiding: { left: { turned: false, angles: { normal: 1.71 * Math.PI, turned: 1.76 * Math.PI } } },
        outerRightSidingTurn: { left: { turned: false, angles: { normal: 1.7 * Math.PI, turned: 1.75 * Math.PI } } }
    };
    switches = switchesDefault;
    switches3D = {};
    switchParams = switchParamsDefault;
    //Default cars
    var carParamsDefault = { init: true, wayNo: 6 };
    var carsDefault = [
        { src: 16, fac: 0.02, speedFac: 0.0008, startFrameFac: 0.65, angles: { start: Math.PI, normal: 0 }, hexColor: "0xff0000" },
        { src: 17, fac: 0.02, speedFac: 0.001, startFrameFac: 0.335, angles: { start: 0, normal: Math.PI }, hexColor: "0xffffff" },
        { src: 0, fac: 0.0202, speedFac: 0.00082, startFrameFac: 0.65, angles: { start: Math.PI, normal: 0 }, hexColor: "0xffee00" }
    ];
    carParams = carParamsDefault;
    carWays = [];
    cars = carsDefault;
    cars3D = [];
    //Default Classic UI
    var classicUIDefault = {
        trainSwitch: { src: 11, srcFill: 31, selectedTrainDisplay: { fontFamily: defaultFont } },
        transformer: { src: 12, onSrc: 13, readySrc: 23, angle: Math.PI / 5, wheelInput: { src: 14, angle: 0, maxAngle: 1.5 * Math.PI }, directionInput: { srcStandardDirection: 24, srcNotStandardDirection: 15 } },
        ready: function (displayOnly) {
            if (displayOnly === void 0) { displayOnly = false; }
            return getSetting("classicUI") && !(gui.controlCenter || gui.konamiOverlay || gui.three || currentMode == Modes.DEMO || multiplayerMode.waitingClock.visible || canvasGesture == undefined || contextGesture == undefined) && (displayOnly || !onlineConnection.stop);
        },
        pointInTransformerImage: function (x, y) {
            if (!classicUI.ready()) {
                return false;
            }
            if (classicUI.transformer.angle == undefined || classicUI.transformer.x == undefined || classicUI.transformer.y == undefined || classicUI.transformer.width == undefined || classicUI.transformer.height == undefined) {
                return false;
            }
            contextGesture.setTransform(client.zoomAndTilt.realScale, 0, 0, client.zoomAndTilt.realScale, (-(client.zoomAndTilt.realScale - 1) * canvasGesture.width) / 2 + client.zoomAndTilt.offsetX, (-(client.zoomAndTilt.realScale - 1) * canvasGesture.height) / 2 + client.zoomAndTilt.offsetY);
            contextGesture.translate(classicUI.transformer.x + classicUI.transformer.width / 2, classicUI.transformer.y + classicUI.transformer.height / 2);
            contextGesture.rotate(classicUI.transformer.angle);
            contextGesture.beginPath();
            contextGesture.rect(-classicUI.transformer.width / 2, -classicUI.transformer.height / 2, classicUI.transformer.width, classicUI.transformer.height);
            if (contextGesture.isPointInPath(x, y)) {
                return true;
            }
            return false;
        },
        pointInTransformerWheelInput: function (x, y) {
            if (!classicUI.pointInTransformerImage(x, y)) {
                return false;
            }
            if (classicUI.transformer.wheelInput.diffY == undefined || classicUI.transformer.wheelInput.angle == undefined || classicUI.transformer.wheelInput.width == undefined || classicUI.transformer.wheelInput.height == undefined) {
                return false;
            }
            contextGesture.setTransform(client.zoomAndTilt.realScale, 0, 0, client.zoomAndTilt.realScale, (-(client.zoomAndTilt.realScale - 1) * canvasGesture.width) / 2 + client.zoomAndTilt.offsetX, (-(client.zoomAndTilt.realScale - 1) * canvasGesture.height) / 2 + client.zoomAndTilt.offsetY);
            contextGesture.translate(classicUI.transformer.x + classicUI.transformer.width / 2, classicUI.transformer.y + classicUI.transformer.height / 2);
            contextGesture.rotate(classicUI.transformer.angle);
            contextGesture.translate(0, -classicUI.transformer.wheelInput.diffY);
            contextGesture.rotate(classicUI.transformer.wheelInput.angle);
            contextGesture.beginPath();
            contextGesture.rect(-classicUI.transformer.wheelInput.width / 2, -classicUI.transformer.wheelInput.height / 2, classicUI.transformer.wheelInput.width, classicUI.transformer.wheelInput.height);
            if (contextGesture.isPointInPath(x, y)) {
                return true;
            }
            return false;
        },
        pointInTransformerDirectionInput: function (x, y) {
            if (!classicUI.pointInTransformerImage(x, y)) {
                return false;
            }
            if (classicUI.transformer.directionInput.diffX == undefined || classicUI.transformer.directionInput.diffY == undefined || classicUI.transformer.directionInput.width == undefined || classicUI.transformer.directionInput.height == undefined) {
                return false;
            }
            contextGesture.setTransform(client.zoomAndTilt.realScale, 0, 0, client.zoomAndTilt.realScale, (-(client.zoomAndTilt.realScale - 1) * canvasGesture.width) / 2 + client.zoomAndTilt.offsetX, (-(client.zoomAndTilt.realScale - 1) * canvasGesture.height) / 2 + client.zoomAndTilt.offsetY);
            contextGesture.translate(classicUI.transformer.x + classicUI.transformer.width / 2, classicUI.transformer.y + classicUI.transformer.height / 2);
            contextGesture.rotate(classicUI.transformer.angle);
            contextGesture.translate(classicUI.transformer.directionInput.diffX, classicUI.transformer.directionInput.diffY);
            contextGesture.beginPath();
            contextGesture.rect(-classicUI.transformer.directionInput.width / 2, -classicUI.transformer.directionInput.height / 2, classicUI.transformer.directionInput.width, classicUI.transformer.directionInput.height);
            if (contextGesture.isPointInPath(x, y)) {
                return true;
            }
            return false;
        },
        pointInTransformerInput: function (x, y) {
            return classicUI.pointInTransformerWheelInput(x, y) || classicUI.pointInTransformerDirectionInput(x, y);
        },
        pointInTrainSwitchInputImage: function (x, y) {
            if (!classicUI.ready()) {
                return false;
            }
            if (classicUI.trainSwitch.angle == undefined || classicUI.trainSwitch.x == undefined || classicUI.trainSwitch.y == undefined || classicUI.trainSwitch.width == undefined || classicUI.trainSwitch.height == undefined) {
                return false;
            }
            contextGesture.setTransform(client.zoomAndTilt.realScale, 0, 0, client.zoomAndTilt.realScale, (-(client.zoomAndTilt.realScale - 1) * canvasGesture.width) / 2 + client.zoomAndTilt.offsetX, (-(client.zoomAndTilt.realScale - 1) * canvasGesture.height) / 2 + client.zoomAndTilt.offsetY);
            contextGesture.translate(classicUI.trainSwitch.x + classicUI.trainSwitch.width / 2, classicUI.trainSwitch.y + classicUI.trainSwitch.height / 2);
            contextGesture.rotate(classicUI.trainSwitch.angle);
            contextGesture.beginPath();
            contextGesture.rect(-classicUI.trainSwitch.width / 2, -classicUI.trainSwitch.height / 2, classicUI.trainSwitch.width, classicUI.trainSwitch.height);
            if (contextGesture.isPointInPath(x, y)) {
                return true;
            }
            return false;
        },
        pointInTrainSwitchInputText: function (x, y) {
            if (!classicUI.ready()) {
                return false;
            }
            if (!classicUI.trainSwitch.selectedTrainDisplay.visible) {
                return false;
            }
            if (classicUI.trainSwitch.selectedTrainDisplay.x == undefined || classicUI.trainSwitch.selectedTrainDisplay.y == undefined || classicUI.trainSwitch.selectedTrainDisplay.width == undefined || classicUI.trainSwitch.selectedTrainDisplay.height == undefined) {
                return false;
            }
            contextGesture.setTransform(client.zoomAndTilt.realScale, 0, 0, client.zoomAndTilt.realScale, (-(client.zoomAndTilt.realScale - 1) * canvasGesture.width) / 2 + client.zoomAndTilt.offsetX, (-(client.zoomAndTilt.realScale - 1) * canvasGesture.height) / 2 + client.zoomAndTilt.offsetY);
            contextGesture.beginPath();
            contextGesture.rect(classicUI.trainSwitch.selectedTrainDisplay.x, classicUI.trainSwitch.selectedTrainDisplay.y, classicUI.trainSwitch.selectedTrainDisplay.width, classicUI.trainSwitch.selectedTrainDisplay.height);
            if (contextGesture.isPointInPath(x, y)) {
                return true;
            }
            return false;
        },
        pointInTrainSwitchInput: function (x, y) {
            return classicUI.pointInTrainSwitchInputImage(x, y) || classicUI.pointInTrainSwitchInputText(x, y);
        }
    };
    classicUI = classicUIDefault;
    //Default animations
    var taxOfficeDefault = {
        params: {
            number: 45,
            frameNo: 6,
            frameProbability: 0.6,
            fire: { x: 0.07, y: 0.06, size: 0.000833, color: { red: { red: 200, green: 0, blue: 0, alpha: 0.4 }, yellow: { red: 255, green: 160, blue: 0, alpha: 1 }, probability: 0.8 } },
            smoke: { x: 0.07, y: 0.06, size: 0.02, color: { red: 130, green: 120, blue: 130, alpha: 0.3 } },
            blueLights: {
                frameNo: 16,
                cars: [
                    { frameNo: 0, x: [-0.0105, -0.0026], y: [0.175, 0.0045], size: 0.0008 },
                    { frameNo: 3, x: [0.0275, -0.00275], y: [0.1472, 0.0092], size: 0.001 },
                    { frameNo: 5, x: [0.0568, 0.0008], y: [0.177, 0.0148], size: 0.001 }
                ]
            }
        }
    };
    taxOffice = taxOfficeDefault;
    //GUI State
    var queryString3D = getQueryStringValue("gui-3d");
    if (queryString3D == "0" || queryString3D == "1") {
        gui.three = getGuiState("3d", queryString3D == "1");
    }
    else {
        gui.three = getGuiState("3d");
    }
    var queryString3DNight = getQueryStringValue("gui-3d-night");
    if (queryString3DNight == "0" || queryString3DNight == "1") {
        three.night = getGuiState("3d-night", queryString3DNight == "1");
    }
    else {
        three.night = getGuiState("3d-night");
    }
    var queryString3DCamMode = getQueryStringValue("gui-3d-cam-mode");
    three.cameraMode = getGuiState("3d-cam-mode", queryString3DCamMode);
    var queryString3DFollowObject = getQueryStringValue("gui-3d-follow-object");
    three.followObject = currentMode == Modes.DEMO ? -1 : getGuiState("3d-follow-object", parseInt(queryString3DFollowObject, 10));
    three.demoRotationSpeedFac = getGuiState("3d-rotation-speed", parseInt(getQueryStringValue("gui-demo-3d-rotation-speed-percent"), 10));
    if (currentMode == Modes.DEMO) {
        var queryStringDemoRandom = getQueryStringValue("gui-demo-random");
        var randomDemoMode;
        if (queryStringDemoRandom == "0" || queryStringDemoRandom == "1") {
            randomDemoMode = getGuiState("demo-random", queryStringDemoRandom == "1");
        }
        else {
            randomDemoMode = getGuiState("demo-random");
        }
        if (randomDemoMode) {
            gui.three = Math.random() < 0.6;
            three.night = Math.random() < 0.5;
            var cameraModes = Object.values(ThreeCameraModes);
            three.cameraMode = cameraModes[Math.floor(Math.random() * cameraModes.length)];
            three.demoRotationSpeedFac = Math.floor(Math.random() * 101);
        }
        var queryStringDemoExitTimeout = parseInt(getQueryStringValue("exit-timeout"), 10);
        if (typeof queryStringDemoExitTimeout == "number" && Number.isInteger(queryStringDemoExitTimeout) && queryStringDemoExitTimeout > 0) {
            demoMode.exitAppDelay = queryStringDemoExitTimeout * 60000;
        }
    }
    //Input handling
    hardware.lastInputMouse = hardware.lastInputTouch = 0;
    document.addEventListener("contextmenu", preventEvent, { passive: false });
    document.addEventListener("wheel", preventEvent, { passive: false });
    document.addEventListener("keydown", preventKeyZoomDuringLoad, { passive: false });
    document.addEventListener("keyup", preventKeyZoomDuringLoad, { passive: false });
    //Prepare game
    if (currentMode != Modes.MULTIPLAYER) {
        var elements = document.querySelectorAll("#content > *:not(#game), #game > *:not(#game-gameplay)");
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = "none";
        }
        elements = document.querySelectorAll("#content > #game, #game > #game-gameplay");
        for (i = 0; i < elements.length; i++) {
            elements[i].style.display = "block";
        }
    }
    if (getSetting("saveGame")) {
        updateSavedGame();
    }
    else {
        removeSavedGame();
    }
    //Audio context
    if (state == "load") {
        audioControl.setActivation(getSetting("autoplayAudio"));
    }
    else {
        audioControl.setActivation(audio.active);
    }
    measureViewSpace();
    context.clearRect(0, 0, canvas.width, canvas.height);
    calcMenusAndBackground(state);
    var savedGameBg = localStorage.getItem("morowayAppSavedGame_v-" + getVersionCode() + "_Bg");
    var savedGameTrains = localStorage.getItem("morowayAppSavedGame_v-" + getVersionCode() + "_Trains");
    var savedGameSwitches = localStorage.getItem("morowayAppSavedGame_v-" + getVersionCode() + "_Switches");
    var savedGameCars = localStorage.getItem("morowayAppSavedGame_v-" + getVersionCode() + "_Cars");
    var savedGameCarParams = localStorage.getItem("morowayAppSavedGame_v-" + getVersionCode() + "_CarParams");
    var savedGameBgSession = sessionStorage.getItem("demoBg");
    var savedGameCarsSession = sessionStorage.getItem("demoCars");
    var savedGameCarParamsSession = sessionStorage.getItem("demoCarParams");
    //Cars
    if (defineCarWays()) {
        if (getSetting("saveGame") && currentMode == Modes.SINGLEPLAYER && savedGameCars != null && savedGameCarParams != null && savedGameBg != null) {
            /* UPDATE: v9.0.0 */
            var carColors = [];
            for (var i = 0; i < cars.length; i++) {
                carColors[i] = cars[i].hexColor;
            }
            /* END UPDATE: v9.0.0 */
            cars = JSON.parse(savedGameCars);
            /* UPDATE: v9.0.0 */
            for (var i = 0; i < cars.length; i++) {
                cars[i].hexColor = carColors[i];
            }
            /* END UPDATE: v9.0.0 */
            carParams = JSON.parse(savedGameCarParams);
            resizeCars(JSON.parse(savedGameBg));
        }
        else if (currentMode == Modes.DEMO && savedGameCarsSession != null && savedGameCarParamsSession != null && savedGameBgSession != null) {
            cars = JSON.parse(savedGameCarsSession);
            carParams = JSON.parse(savedGameCarParamsSession);
            resizeCars(JSON.parse(savedGameBgSession));
        }
        else {
            cars.forEach(function (car, i) {
                car.speed = car.speedFac * background.width;
                car.width = car.fac * background.width;
                car.height = car.fac * (pics[car.src].height * (background.width / pics[car.src].width));
                car.cType = typeof carWays[i].start == "undefined" ? "normal" : "start";
                car.displayAngle = carWays[i][car.cType][car.counter].angle;
                car.x = carWays[i][car.cType][car.counter].x;
                car.y = carWays[i][car.cType][car.counter].y;
                car.backToInit = false;
                car.parking = true;
                if (i === 0) {
                    carParams.lowestSpeedNo = i;
                }
                else if (car.speed < cars[carParams.lowestSpeedNo].speed) {
                    carParams.lowestSpeedNo = i;
                }
                if (i === 0) {
                    carParams.thickestCar = i;
                }
                else if (car.height > cars[carParams.thickestCar].height) {
                    carParams.thickestCar = i;
                }
            });
            if (currentMode == Modes.DEMO) {
                carParams.init = false;
                carParams.autoModeOff = false;
                carParams.autoModeRuns = true;
                carParams.autoModeInit = true;
            }
        }
    }
    //TAX OFFICE
    taxOffice.fire = [];
    taxOffice.smoke = [];
    taxOffice.params.fire.x *= background.width;
    taxOffice.params.fire.y *= background.height;
    taxOffice.params.fire.size *= background.width;
    taxOffice.params.smoke.x *= background.width;
    taxOffice.params.smoke.y *= background.height;
    taxOffice.params.smoke.size *= background.width;
    for (var i = 0; i < taxOffice.params.number; i++) {
        taxOffice.fire[i] = {};
        taxOffice.smoke[i] = {};
        if (Math.random() >= taxOffice.params.fire.color.probability) {
            taxOffice.fire[i].color = "rgba(" + taxOffice.params.fire.color.yellow.red + "," + taxOffice.params.fire.color.yellow.green + "," + taxOffice.params.fire.color.yellow.blue + "," + taxOffice.params.fire.color.yellow.alpha * Math.random() + ")";
        }
        else {
            taxOffice.fire[i].color = "rgba(" + taxOffice.params.fire.color.red.red + "," + taxOffice.params.fire.color.red.green + "," + taxOffice.params.fire.color.red.blue + "," + taxOffice.params.fire.color.red.alpha * Math.random() + ")";
        }
        taxOffice.fire[i].x = Math.random() * taxOffice.params.fire.x;
        taxOffice.fire[i].y = Math.random() * taxOffice.params.fire.y;
        taxOffice.fire[i].size = Math.random() * taxOffice.params.fire.size;
        taxOffice.smoke[i].color = "rgba(" + taxOffice.params.smoke.color.red + "," + taxOffice.params.smoke.color.green + "," + taxOffice.params.smoke.color.blue + "," + taxOffice.params.smoke.color.alpha * Math.random() + ")";
        taxOffice.smoke[i].x = Math.random() * taxOffice.params.smoke.x;
        taxOffice.smoke[i].y = Math.random() * taxOffice.params.smoke.y;
        taxOffice.smoke[i].size = Math.random() * taxOffice.params.smoke.size;
    }
    for (var i = 0; i < taxOffice.params.blueLights.cars.length; i++) {
        taxOffice.params.blueLights.cars[i].x[0] *= background.width;
        taxOffice.params.blueLights.cars[i].x[1] *= background.width;
        taxOffice.params.blueLights.cars[i].y[0] *= background.height;
        taxOffice.params.blueLights.cars[i].y[1] *= background.height;
        taxOffice.params.blueLights.cars[i].size *= background.width;
    }
    //Text Control
    textControl.elements.root = document.querySelector("#text-control");
    textControl.elements.input = textControl.elements.root.querySelector("#text-control-input input");
    textControl.elements.output = textControl.elements.root.querySelector("#text-control-output");
    textControl.elements.input.onkeydown = function (event) {
        if (event.key == "Enter") {
            var commandsInput = textControl.elements.input.value.replace(/\s+/g, " ").replace(/\s+$/, "").replace(/^\s+/, "");
            var commands = commandsInput.split(" ");
            var command = commands.shift();
            textControl.elements.input.value = "";
            if (!Object.keys(textControl.commands).includes(command)) {
                command = "/";
            }
            textControl.elements.output.textContent = textControl.commands[command].action(commands);
        }
    };
    //Switches
    switchParams.set();
    if (getSetting("saveGame") && currentMode == Modes.SINGLEPLAYER && savedGameTrains != null && savedGameSwitches != null && savedGameBg != null) {
        var savedSwitches = JSON.parse(savedGameSwitches);
        Object.keys(savedSwitches).forEach(function (key) {
            Object.keys(savedSwitches[key]).forEach(function (side) {
                switches[key][side].turned = savedSwitches[key][side];
            });
        });
    }
    else if (currentMode == Modes.DEMO) {
        Object.keys(switches).forEach(function (key) {
            Object.keys(switches[key]).forEach(function (side) {
                if (key == "inner2outer" || key == "outer2inner") {
                    switches[key][side].turned = false;
                }
                else {
                    switches[key][side].turned = Math.random() > 0.4;
                }
            });
        });
    }
    //Three.js
    three.scene = new THREE.Scene();
    three.mainGroup = new THREE.Group();
    three.mainGroup.name = "main_group";
    three.scene.add(three.mainGroup);
    three.renderer = new THREE.WebGLRenderer({ alpha: true });
    THREE.ColorManagement.enabled = false;
    three.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    three.renderer.setClearColor(0xffffff, 0);
    document.querySelector("#game-gameplay").insertBefore(three.renderer.domElement, document.querySelector("#canvas-menus"));
    three.renderer.domElement.id = "game-gameplay-three";
    three.ambientLightNight = 0.25 * Math.PI;
    three.ambientLightDay = 0.75 * Math.PI;
    three.ambientLight = new THREE.AmbientLight(0xfffefe, three.night ? three.ambientLightNight : three.ambientLightDay);
    three.scene.add(three.ambientLight);
    three.directionalLight = new THREE.DirectionalLight(0xeedfdf, 0.45 * Math.PI);
    three.directionalLight.position.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 1);
    three.scene.add(three.directionalLight);
    three.directionalLightXFac = Math.round(Math.random()) * 2 - 1;
    three.directionalLightYFac = Math.round(Math.random()) * 2 - 1;
    three.animateLights = function () {
        var add = 0.001;
        var addX = add * three.directionalLightXFac;
        var addY = add * three.directionalLightYFac;
        three.directionalLight.position.x += addX;
        three.directionalLight.position.y += addY;
        if (three.directionalLight.position.x >= 1) {
            three.directionalLight.position.x = 1;
            three.directionalLightXFac = -1;
        }
        else if (three.directionalLight.position.x <= -1) {
            three.directionalLight.position.x = -1;
            three.directionalLightXFac = 1;
        }
        if (three.directionalLight.position.y >= 1) {
            three.directionalLight.position.y = 1;
            three.directionalLightYFac = -1;
        }
        else if (three.directionalLight.position.y <= -1) {
            three.directionalLight.position.y = -1;
            three.directionalLightYFac = 1;
        }
        var add = 0.005 * Math.PI;
        if (three.night) {
            if (three.ambientLight.intensity > three.ambientLightNight) {
                three.ambientLight.intensity -= add;
            }
            if (three.ambientLight.intensity < three.ambientLightNight) {
                three.ambientLight.intensity = three.ambientLightNight;
            }
        }
        else {
            if (three.ambientLight.intensity < three.ambientLightDay) {
                three.ambientLight.intensity += add;
            }
            if (three.ambientLight.intensity > three.ambientLightDay) {
                three.ambientLight.intensity = three.ambientLightDay;
            }
        }
    };
    if (objects3D[background3D.flat.src]) {
        var material = new THREE.MeshLambertMaterial({
            map: objects3D[background3D.flat.src].clone(),
            reflectivity: 1
        });
        var geometry = new THREE.PlaneGeometry(1, background.height / background.width);
        background3D.flat.mesh = new THREE.Mesh(geometry, material);
        background3D.flat.resize = function () {
            var scale = three.calcScale();
            background3D.flat.mesh.scale.x = scale;
            background3D.flat.mesh.scale.y = scale;
            background3D.flat.mesh.position.set(0, three.calcPositionY(), 0);
        };
        background3D.flat.resize();
        three.mainGroup.add(background3D.flat.mesh);
    }
    if (background3D.three.src) {
        background3D.three.mesh = three.cloneNode(objects3D[background3D.three.src]);
        background3D.three.resize = function () {
            var scale = three.calcScale();
            background3D.three.mesh.scale.x = scale;
            background3D.three.mesh.scale.y = scale;
            background3D.three.mesh.scale.z = scale;
            background3D.three.mesh.position.set(0, three.calcPositionY(), 0);
        };
        background3D.three.resize();
        three.mainGroup.add(background3D.three.mesh);
    }
    if (state == "load") {
        background3D.behind = document.getElementById("game-gameplay-three-bg");
        background3D.animateBehind = function (reset, forceFac) {
            if (reset === void 0) { reset = false; }
            if (forceFac === void 0) { forceFac = undefined; }
            if (reset) {
                background3D.behind.style.transform = "";
                var behindCloneId = background3D.behind.id + "-clone";
                var oldBehindClone = document.getElementById(behindCloneId);
                if (oldBehindClone != null) {
                    oldBehindClone.parentNode.removeChild(oldBehindClone);
                }
                background3D.animateBehindFac = 0;
                background3D.animateBehindStars = [];
                if (three.night) {
                    var length_1 = 200 + 100 * Math.random();
                    var starBaseColor = 100;
                    for (var i_2 = 0; i_2 < length_1; i_2++) {
                        var alpha = konamiState < 0 ? 1 : 0.25 + Math.random() / 2;
                        var starColorRed = konamiState < 0 ? Math.round(Math.random() * 255) : starBaseColor + Math.round((255 - starBaseColor) * Math.random());
                        var starColorGreen = konamiState < 0 ? Math.round(Math.random() * 255) : Math.round(0.65 * starColorRed + 0.35 * starColorRed * Math.random());
                        var starColorBlue = konamiState < 0 ? Math.round(Math.random() * 255) : starBaseColor;
                        var left = Math.random() * background3D.behind.width;
                        var top_1 = Math.random() * background3D.behind.height;
                        var radius = Math.min(background3D.behind.width, background3D.behind.height) / 1000 + (Math.random() * Math.min(background3D.behind.width, background3D.behind.height)) / 500;
                        var fill = "rgba(" + starColorRed + "," + starColorGreen + "," + starColorBlue + "," + alpha + ")";
                        background3D.animateBehindStars.push({ left: left, top: top_1, radius: radius, fill: fill });
                        background3D.animateBehindStars.push({ left: left + background3D.behind.width, top: top_1, radius: radius, fill: fill });
                        background3D.animateBehindStars.push({ left: left - background3D.behind.width, top: top_1, radius: radius, fill: fill });
                    }
                }
                else {
                    var length_2 = 15 + 15 * Math.random();
                    var starBaseColor = 20;
                    for (var i_3 = 0; i_3 < length_2; i_3++) {
                        var alpha = Math.random() / 8;
                        var starColorRed = starBaseColor + Math.round((120 - starBaseColor) * Math.random());
                        var starColorGreen = starBaseColor + Math.round((120 - starBaseColor) * Math.random());
                        var starColorBlue = starBaseColor + Math.round((120 - starBaseColor) * Math.random());
                        var left = Math.random() * background3D.behind.width;
                        var top_2 = Math.random() * background3D.behind.height;
                        var radius = Math.min(background3D.behind.width, background3D.behind.height) / 3 + (Math.random() * Math.min(background3D.behind.width, background3D.behind.height)) / 3;
                        var fill = "rgba(" + starColorRed + "," + starColorGreen + "," + starColorBlue + "," + alpha + ")";
                        background3D.animateBehindStars.push({ left: left, top: top_2, radius: radius, fill: fill });
                    }
                }
                var behindContext = background3D.behind.getContext("2d");
                behindContext.save();
                if (konamiState < 0 && !three.night) {
                    var bgGradient = behindContext.createRadialGradient(0, canvas.height / 2, canvas.height / 2, canvas.width + canvas.height / 2, canvas.height / 2, canvas.height / 2);
                    bgGradient.addColorStop(0, "#550400");
                    bgGradient.addColorStop(0.2, "#542400");
                    bgGradient.addColorStop(0.4, "#442200");
                    bgGradient.addColorStop(0.6, "#054000");
                    bgGradient.addColorStop(0.8, "#040037");
                    bgGradient.addColorStop(1, "#350037");
                    behindContext.fillStyle = bgGradient;
                }
                else {
                    behindContext.fillStyle = "black";
                }
                behindContext.fillRect(0, 0, background3D.behind.width, background3D.behind.height);
                for (var i_4 = 0; i_4 < background3D.animateBehindStars.length; i_4++) {
                    behindContext.save();
                    behindContext.fillStyle = background3D.animateBehindStars[i_4].fill;
                    behindContext.translate(background3D.animateBehindStars[i_4].left, background3D.animateBehindStars[i_4].top);
                    behindContext.beginPath();
                    behindContext.arc(0, 0, background3D.animateBehindStars[i_4].radius, 0, 2 * Math.PI);
                    behindContext.fill();
                    behindContext.restore();
                }
                behindContext.restore();
                if (three.night) {
                    background3D.behindClone = background3D.behind.cloneNode();
                    background3D.behindClone.id = behindCloneId;
                    background3D.behind.parentNode.insertBefore(background3D.behindClone, background3D.behind);
                    var behindCloneContext = background3D.behindClone.getContext("2d");
                    behindCloneContext.drawImage(background3D.behind, 0, 0);
                }
                else {
                    background3D.behindClone = null;
                }
            }
            if (three.night) {
                if (typeof forceFac == "number") {
                    background3D.animateBehindFac = forceFac;
                }
                else {
                    background3D.animateBehindFac += 0.00025;
                }
                while (background3D.animateBehindFac >= 1) {
                    background3D.animateBehindFac -= 1;
                }
                while (background3D.animateBehindFac < 0) {
                    background3D.animateBehindFac += 1;
                }
                background3D.behind.style.transform = "translateX(" + -background3D.animateBehindFac * background3D.behind.offsetWidth + "px)";
                background3D.behindClone.style.transform = "translateX(" + (1 - background3D.animateBehindFac) * background3D.behind.offsetWidth + "px)";
            }
        };
    }
    three.camera = new THREE.PerspectiveCamera(60, client.width / client.height, 0.1, 10);
    three.camera.position.set(0, 0, 1);
    three.camera.zoom = three.zoom;
    three.camera.aspect = client.width / client.height;
    three.camera.updateProjectionMatrix();
    three.followCamera = new THREE.PerspectiveCamera(45, client.width / client.height, 0.001, 1);
    three.followCamera.zoom = 1;
    three.followCamera.updateProjectionMatrix();
    three.activeCamera = three.cameraMode == ThreeCameraModes.BIRDS_EYE ? three.camera : three.followCamera;
    if (currentMode == Modes.DEMO) {
        three.demoRotationFacX = Math.round(Math.random()) * 2 - 1;
        three.demoRotationFacY = Math.round(Math.random()) * 2 - 1;
    }
    if (APP_DATA.debug && debug.paint) {
        var axesHelper = new THREE.AxesHelper(15);
        three.scene.add(axesHelper);
    }
    if (currentMode == Modes.SINGLEPLAYER && getSetting("saveGame") && savedGameTrains != null && savedGameSwitches != null && savedGameBg != null) {
        animateWorker.postMessage({ k: "go", background: background, switches: switches, savedTrains: JSON.parse(savedGameTrains), savedBg: JSON.parse(savedGameBg) });
    }
    else {
        animateWorker.postMessage({ k: "go", background: background, switches: switches });
    }
}
window.addEventListener("load", function () {
    function initAnimateWorker() {
        //Animation worker
        animateWorker = new Worker("./src/jsm/scripting_worker_animate.js", { type: "module" });
        animateWorker.onerror = function () {
            notify("#canvas-notifier", getString("generalIsFail", "!", "upper"), NotificationPriority.High, 950, null, null, client.height);
            setTimeout(function () {
                followLink("error#animate", "_self", LinkStates.InternalHtml);
            }, 1000);
        };
        animateWorker.onmessage = function (message) {
            if (message.data.k == "ready") {
                trainParams = message.data.trainParams;
                trains = message.data.trains;
                if (currentMode == Modes.MULTIPLAYER) {
                    var chatControlsReactionsTrain = document.querySelector("#chat #chat-msg-trains-inner");
                    chatControlsReactionsTrain.innerHTML = "";
                    for (var stickerTrain = 0; stickerTrain < trains.length; stickerTrain++) {
                        var elem = document.createElement("img");
                        elem.src = "./assets/chat_train_" + stickerTrain + ".png";
                        elem.alt = getString(["appScreenTrainNames", stickerTrain]);
                        elem.dataset.tooltip = getString(["appScreenTrainNames", stickerTrain]);
                        initTooltip(elem);
                        elem.dataset.stickerNumber = stickerTrain.toString();
                        elem.onclick = function (event) {
                            onlineConnection.send("chat-msg", "{{stickerTrain=" + event.target.dataset.stickerNumber + "}}");
                        };
                        chatControlsReactionsTrain.appendChild(elem);
                    }
                }
                var trainPics = [];
                for (var i = 0; i < trains.length; i++) {
                    trainPics[i] = {};
                    trainPics[i].height = pics[trains[i].src].height;
                    trainPics[i].width = pics[trains[i].src].width;
                    trainPics[i].cars = [];
                    for (var j = 0; j < trains[i].cars.length; j++) {
                        trainPics[i].cars[j] = {};
                        trainPics[i].cars[j].height = pics[trains[i].cars[j].src].height;
                        trainPics[i].cars[j].width = pics[trains[i].cars[j].src].width;
                    }
                }
                animateWorker.postMessage({ k: "set", trainPics: trainPics });
            }
            else if (message.data.k == "set") {
                init(message.data.state);
            }
            else if (message.data.k == "go") {
                var chatNotify_1 = document.querySelector("#tp-chat-notifier");
                var chat_1 = document.querySelector("#chat");
                var chatInner_1 = chat_1.querySelector("#chat-inner");
                var chatInnerNone_1 = chatInner_1.querySelector("#chat-no-messages");
                var chatInnerMessages_1 = chatInner_1.querySelector("#chat-inner-messages");
                var chatInnerScrollToBottom_1 = chatInner_1.querySelector("#chat-scroll-to-bottom");
                var chatControls_1 = chat_1.querySelector("#chat-controls");
                var chatControlsInner_1 = chatControls_1.querySelectorAll("#chat-send > *");
                var chatControlsReactions_1 = chatControls_1.querySelector("#chat-msg-reactions");
                var chatControlsReactionsSmiley = chatControlsReactions_1.querySelector("#chat-msg-smileys-inner");
                var chatControlsReactionsSmileyButtons_1 = chatControlsReactionsSmiley.querySelectorAll("button");
                var chatControlsReactionsSticker = chatControlsReactions_1.querySelector("#chat-msg-stickers-inner");
                var chatControlsSendMsg_1 = chatControls_1.querySelector("#chat-msg-send-text");
                var chatControlsSendButton = chatControls_1.querySelector("#chat-msg-send-button");
                var chatControlsNavClose = chat_1.querySelector("#chat-close");
                var chatControlsNavClear_1 = chat_1.querySelector("#chat-clear");
                chatInnerScrollToBottom_1.toggleDisplay = function () {
                    if (chatInnerMessages_1.lastChild != null) {
                        chatInnerScrollToBottom_1.style.display = chatInner_1.scrollHeight > chatInner_1.offsetHeight && chatInner_1.scrollHeight - chatInner_1.scrollTop > chatInner_1.offsetHeight + chatInnerMessages_1.lastChild.offsetHeight ? "flex" : "";
                        chatInnerScrollToBottom_1.style.top = Math.max(0, chatInner_1.offsetHeight - chatInnerScrollToBottom_1.offsetHeight - 50) + "px";
                    }
                    else {
                        chatInnerScrollToBottom_1.style.display = "";
                    }
                };
                chat_1.resizeChat = function () {
                    chatInner_1.style.maxHeight = Math.max(50, Math.min(client.height, chat_1.offsetHeight) - chatControls_1.offsetHeight) + "px";
                    chatInnerScrollToBottom_1.toggleDisplay();
                };
                window.addEventListener("resize", chat_1.resizeChat);
                chat_1.openChat = function () {
                    if (typeof chatNotify_1.hide == "function") {
                        chatNotify_1.hide(chatNotify_1, true);
                    }
                    chat_1.style.display = "block";
                    gui.sidebarRight = true;
                    drawMenu("invisible");
                    chat_1.resizeChat();
                };
                chat_1.closeChat = function () {
                    chat_1.style.display = "";
                    gui.sidebarRight = false;
                    drawMenu("visible");
                };
                window.addEventListener("keyup", function (event) {
                    if (event.key === "Escape") {
                        chat_1.closeChat();
                    }
                });
                chatInner_1.onscroll = chatInnerScrollToBottom_1.toggleDisplay;
                chatNotify_1.onclick = chat_1.openChat;
                chatControlsNavClose.onclick = chat_1.closeChat;
                chatControlsSendButton.onclick = function () {
                    if (chatControlsSendMsg_1.value != "") {
                        onlineConnection.send("chat-msg", chatControlsSendMsg_1.value);
                        chatControlsSendMsg_1.value = "";
                    }
                };
                chatControlsSendMsg_1.onkeyup = function (event) {
                    if (chatControlsSendMsg_1.value != "") {
                        if (event.key === "Enter") {
                            onlineConnection.send("chat-msg", chatControlsSendMsg_1.value);
                            chatControlsSendMsg_1.value = "";
                        }
                    }
                };
                for (var cSI = 0; cSI < chatControlsInner_1.length; cSI++) {
                    chatControlsInner_1[cSI].querySelector(".chat-send-toggle").onclick = function (event) {
                        var target = event.target;
                        var elem = target.parentNode.querySelector(".chat-send-inner");
                        var display = getComputedStyle(elem).getPropertyValue("display");
                        for (var cSI = 0; cSI < chatControlsInner_1.length; cSI++) {
                            chatControlsInner_1[cSI].querySelector(".chat-send-inner").style.display = "none";
                        }
                        elem.style.display = display == "none" ? "block" : "none";
                        chat_1.resizeChat();
                        var smileySupport = true;
                        for (var smiley = 1; smiley < chatControlsReactionsSmileyButtons_1.length; smiley++) {
                            if (chatControlsReactionsSmileyButtons_1[smiley].offsetWidth != chatControlsReactionsSmileyButtons_1[smiley - 1].offsetWidth) {
                                smileySupport = false;
                                break;
                            }
                        }
                        if (!smileySupport) {
                            notify("#canvas-notifier", getString("appScreenTeamplayChatNoEmojis"), NotificationPriority.High, 6000, null, null, client.y + menus.outerContainer.height);
                        }
                    };
                }
                for (var smiley = 0; smiley < chatControlsReactionsSmileyButtons_1.length; smiley++) {
                    chatControlsReactionsSmileyButtons_1[smiley].onclick = function (event) {
                        var target = event.target;
                        onlineConnection.send("chat-msg", target.textContent);
                    };
                }
                chatControlsReactionsSticker.innerHTML = "";
                for (var sticker = 0; sticker < multiplayerMode.chatSticker; sticker++) {
                    var elem = document.createElement("img");
                    elem.src = "./assets/chat_sticker_" + sticker + ".png";
                    elem.dataset.stickerNumber = sticker.toString();
                    elem.onclick = function (event) {
                        var target = event.target;
                        onlineConnection.send("chat-msg", "{{sticker=" + target.dataset.stickerNumber + "}}");
                    };
                    chatControlsReactionsSticker.appendChild(elem);
                }
                chatControlsNavClear_1.clearChat = function () {
                    chatInnerMessages_1.innerHTML = "";
                    chatInnerNone_1.style.display = "";
                    chatControlsReactions_1.style.display = "none";
                    chatInnerScrollToBottom_1.toggleDisplay();
                };
                chatControlsNavClear_1.clearChat();
                chatControlsNavClear_1.onclick = chatControlsNavClear_1.clearChat;
                chatInnerScrollToBottom_1.onclick = function () {
                    if (chatInnerMessages_1.lastChild != null) {
                        chatInnerMessages_1.lastChild.scrollIntoView();
                        chatInnerScrollToBottom_1.toggleDisplay();
                    }
                };
                document.querySelector("#setup #setup-exit").onclick = function () {
                    switchMode(Modes.SINGLEPLAYER, { id: "", key: "" });
                };
                if (currentMode == Modes.MULTIPLAYER) {
                    onlineConnection.connect = function () {
                        function resetForElement(parent, elem, to) {
                            if (to === void 0) { to = ""; }
                            var elements = parent.childNodes;
                            for (var i = 0; i < elements.length; i++) {
                                if (elements[i].nodeName.substr(0, 1) != "#") {
                                    elements[i].style.display = elements[i] == elem ? to : "none";
                                }
                            }
                        }
                        function endLoading() {
                            loadingAnimation.hide();
                            chat_1.closeChat();
                            chatControlsNavClear_1.clearChat();
                        }
                        function showStartGame(teamNum) {
                            endLoading();
                            var parent = document.querySelector("#content");
                            var elem = parent.querySelector("#game");
                            resetForElement(parent, elem, "block");
                            var parent = document.querySelector("#game");
                            var elem = parent.querySelector("#game-start");
                            elem.querySelector("#game-start-text").textContent = formatJSString(getString("appScreenTeamplayGameStart"), teamNum);
                            resetForElement(parent, elem);
                            elem.querySelector("#game-start-button").onclick = function () {
                                onlineConnection.send("start");
                            };
                        }
                        function showNewGameLink() {
                            endLoading();
                            audioControl.playAndPauseAll();
                            var parent = document.querySelector("#content");
                            var elem = parent.querySelector("#setup");
                            resetForElement(parent, elem, "block");
                            var parent = document.querySelector("#setup-inner-content");
                            var elem = parent.querySelector("#setup-create");
                            resetForElement(parent, elem);
                            var elem = document.querySelector("#setup #setup-create #setup-create-link");
                            elem.onclick = function () {
                                switchMode(Modes.MULTIPLAYER, { id: "", key: "" });
                            };
                            var elem = document.querySelector("#setup #setup-create #setup-create-escape");
                            elem.onclick = function () {
                                switchMode(Modes.SINGLEPLAYER, { id: "", key: "" });
                            };
                        }
                        function getPlayerNameFromInput() {
                            var elem = document.querySelector("#setup-init-name");
                            var name = elem.value;
                            var nameCheck = name.replace(/[^a-zA-Z0-9]/g, "");
                            if (name.length > 0 && name == nameCheck) {
                                sessionStorage.setItem("playername", name);
                                return name;
                            }
                            else {
                                elem.value = nameCheck;
                            }
                            return false;
                        }
                        function sendPlayerName(name) {
                            onlineConnection.send("init", name);
                        }
                        function sendSyncRequest() {
                            if (!onlineConnection.syncing) {
                                if (onlineConnection.resized) {
                                    if (multiplayerMode.syncRequestTimeout !== undefined && multiplayerMode.syncRequestTimeout !== null) {
                                        clearTimeout(multiplayerMode.syncRequestTimeout);
                                    }
                                    if (onlineConnection.locomotive) {
                                        multiplayerMode.syncRequestTimeout = setTimeout(sendSyncRequest, multiplayerMode.syncInterval);
                                    }
                                }
                                else if (!onlineConnection.paused) {
                                    var number = 0;
                                    number += trains.length;
                                    trains.forEach(function (train) {
                                        number += train.cars.length;
                                    });
                                    number++; //Switches
                                    onlineConnection.send("sync-request", number.toString());
                                }
                            }
                        }
                        function sendSyncData() {
                            var task = {};
                            task.o = "s";
                            var obj = copyJSObject(switches);
                            task.d = obj;
                            if (!onlineConnection.resized) {
                                onlineConnection.send("sync-task", JSON.stringify(task));
                            }
                            for (var i = 0; i < trains.length; i++) {
                                task = {};
                                task.o = "t";
                                task.i = i;
                                obj = copyJSObject(trains[i]);
                                obj.front.x = (obj.front.x - background.x) / background.width;
                                obj.back.x = (obj.back.x - background.x) / background.width;
                                obj.x = (obj.x - background.x) / background.width;
                                obj.front.y = (obj.front.y - background.y) / background.height;
                                obj.back.y = (obj.back.y - background.y) / background.height;
                                obj.y = (obj.y - background.y) / background.height;
                                obj.width = obj.width / background.width;
                                obj.height = obj.height / background.height;
                                multiplayerMode.excludeFromSync[task.o].forEach(function (key) {
                                    delete obj[key];
                                });
                                if (obj.circleFamily != null) {
                                    Object.keys(rotationPoints).forEach(function (key) {
                                        if (trains[i].circleFamily == rotationPoints[key]) {
                                            obj.circleFamily = key;
                                        }
                                    });
                                    if (typeof obj.circleFamily == "string") {
                                        Object.keys(rotationPoints[obj.circleFamily]).forEach(function (key) {
                                            if (trains[i].circle == rotationPoints[obj.circleFamily][key]) {
                                                obj.circle = key;
                                            }
                                        });
                                    }
                                    else {
                                        delete obj.circle;
                                    }
                                }
                                else {
                                    delete obj.circle;
                                }
                                task.d = obj;
                                if (!onlineConnection.resized) {
                                    onlineConnection.send("sync-task", JSON.stringify(task));
                                }
                                for (var j = 0; j < trains[i].cars.length; j++) {
                                    task = {};
                                    task.o = "tc";
                                    task.i = [i, j];
                                    obj = copyJSObject(trains[i].cars[j]);
                                    obj.front.x = (obj.front.x - background.x) / background.width;
                                    obj.back.x = (obj.back.x - background.x) / background.width;
                                    obj.x = (obj.x - background.x) / background.width;
                                    obj.front.y = (obj.front.y - background.y) / background.height;
                                    obj.back.y = (obj.back.y - background.y) / background.height;
                                    obj.y = (obj.y - background.y) / background.height;
                                    obj.width = obj.width / background.width;
                                    obj.height = obj.height / background.height;
                                    multiplayerMode.excludeFromSync[task.o].forEach(function (key) {
                                        delete obj[key];
                                    });
                                    task.d = obj;
                                    if (!onlineConnection.resized) {
                                        onlineConnection.send("sync-task", JSON.stringify(task));
                                    }
                                }
                            }
                        }
                        onlineConnection.socket = new WebSocket(multiplayerMode.serverURI);
                        onlineConnection.socket.onopen = function () {
                            onlineConnection.send("hello", (APP_DATA.version.major + APP_DATA.version.minor / 10).toString());
                        };
                        onlineConnection.socket.onclose = function () {
                            if (currentMode == Modes.MULTIPLAYER) {
                                showNewGameLink();
                                notify("#canvas-notifier", getString("appScreenTeamplayGameEnded", "."), NotificationPriority.High, 900, null, null, client.height);
                            }
                        };
                        onlineConnection.socket.onmessage = function (message) {
                            var ERROR_LEVEL_OKAY = 0;
                            var ERROR_LEVEL_WARNING = 1;
                            var ERROR_LEVEL_ERROR = 2;
                            var json = JSON.parse(message.data);
                            if (APP_DATA.debug) {
                                if (json.errorLevel === ERROR_LEVEL_ERROR) {
                                    console.error(json);
                                }
                                else if (json.errorLevel === ERROR_LEVEL_WARNING) {
                                    console.warn(json);
                                }
                                else {
                                    console.debug(json);
                                }
                            }
                            switch (json.mode) {
                                case "hello":
                                    if (json.errorLevel === ERROR_LEVEL_ERROR) {
                                        document.querySelector("#content").style.display = "none";
                                        setTimeout(function () {
                                            followLink("error#tp-update", "_self", LinkStates.InternalHtml);
                                        }, 1000);
                                        notify("#canvas-notifier", getString("appScreenTeamplayUpdateError", "!"), NotificationPriority.High, 6000, null, null, client.height);
                                    }
                                    else {
                                        if (json.errorLevel === ERROR_LEVEL_WARNING) {
                                            notify("#canvas-notifier", getString("appScreenTeamplayUpdateNote", "!"), NotificationPriority.Default, 900, null, null, client.height);
                                        }
                                        var parent = document.querySelector("#content");
                                        var elem = parent.querySelector("#setup");
                                        resetForElement(parent, elem, "block");
                                        if (sessionStorage.getItem("playername") != null) {
                                            sendPlayerName(sessionStorage.getItem("playername"));
                                        }
                                        else {
                                            endLoading();
                                            parent = document.querySelector("#setup-inner-content");
                                            elem = parent.querySelector("#setup-init");
                                            resetForElement(parent, elem);
                                            elem.querySelector("#setup-init-button").onclick = function (_event) {
                                                var name = getPlayerNameFromInput();
                                                if (name !== false) {
                                                    sendPlayerName(name);
                                                }
                                            };
                                            elem.querySelector("#setup-init-name").onkeyup = function (event) {
                                                if (event.key === "Enter") {
                                                    var name = getPlayerNameFromInput();
                                                    if (name !== false) {
                                                        sendPlayerName(name);
                                                    }
                                                }
                                            };
                                            elem.querySelector("#setup-init-name").focus();
                                        }
                                    }
                                    break;
                                case "init":
                                    if (json.errorLevel === ERROR_LEVEL_OKAY) {
                                        onlineConnection.sessionId = json.sessionId;
                                        if (onlineConnection.gameId == "" || onlineConnection.gameKey == "") {
                                            onlineConnection.send("connect");
                                        }
                                        else {
                                            onlineConnection.send("join", JSON.stringify({ key: onlineConnection.gameKey, id: onlineConnection.gameId }));
                                        }
                                    }
                                    else {
                                        showNewGameLink();
                                        notify("#canvas-notifier", getString("appScreenTeamplayConnectionError", "."), NotificationPriority.High, 6000, function () {
                                            followLink("error#tp-connection", "_self", LinkStates.InternalHtml);
                                        }, getString("appScreenFurtherInformation"), client.height);
                                    }
                                    break;
                                case "connect":
                                    if (json.errorLevel === ERROR_LEVEL_OKAY) {
                                        onlineConnection.locomotive = true;
                                        var connectData = JSON.parse(json.data);
                                        onlineConnection.gameId = connectData.id;
                                        onlineConnection.gameKey = connectData.key;
                                        endLoading();
                                        var parent = document.querySelector("#setup-inner-content");
                                        var elem = parent.querySelector("#setup-start");
                                        resetForElement(parent, elem);
                                        elem.querySelector("#setup-start-gamelink").textContent = getShareLink(onlineConnection.gameId, onlineConnection.gameKey);
                                        elem.querySelector("#setup-start-button").onclick = function () {
                                            copy("#setup #setup-start #setup-start-gamelink", null, function () {
                                                notify("#canvas-notifier", getString("appScreenTeamplaySetupStartButtonError", "!"), NotificationPriority.High, 6000, null, null, client.height);
                                            });
                                        };
                                    }
                                    else {
                                        showNewGameLink();
                                        notify("#canvas-notifier", getString("appScreenTeamplayCreateError", "!"), NotificationPriority.High, 6000, function () {
                                            followLink("error#tp-connection", "_self", LinkStates.InternalHtml);
                                        }, getString("appScreenFurtherInformation"), client.height);
                                    }
                                    break;
                                case "join":
                                    if (json.sessionId == onlineConnection.sessionId) {
                                        if (json.errorLevel === ERROR_LEVEL_OKAY) {
                                            onlineConnection.locomotive = false;
                                            showStartGame(json.data);
                                        }
                                        else {
                                            showNewGameLink();
                                            notify("#canvas-notifier", getString("appScreenTeamplayJoinError", "!"), NotificationPriority.High, 6000, function () {
                                                followLink("error#tp-join", "_self", LinkStates.InternalHtml);
                                            }, getString("appScreenFurtherInformation"), client.height);
                                        }
                                    }
                                    else {
                                        if (json.errorLevel === ERROR_LEVEL_OKAY) {
                                            showStartGame(json.data);
                                        }
                                        else {
                                            showNewGameLink();
                                            notify("#canvas-notifier", getString("appScreenTeamplayJoinTeammateError", "!"), NotificationPriority.High, 6000, function () {
                                                followLink("error#tp-connection", "_self", LinkStates.InternalHtml);
                                            }, getString("appScreenFurtherInformation"), client.height);
                                        }
                                    }
                                    break;
                                case "start":
                                    if (json.errorLevel === ERROR_LEVEL_ERROR) {
                                        showNewGameLink();
                                        notify("#canvas-notifier", getString("appScreenTeamplayStartError", "!"), NotificationPriority.High, 6000, function () {
                                            followLink("error#tp-connection", "_self", LinkStates.InternalHtml);
                                        }, getString("appScreenFurtherInformation"), client.height);
                                    }
                                    else {
                                        switch (json.data) {
                                            case "wait":
                                                if (json.sessionId == onlineConnection.sessionId) {
                                                    var parent = document.querySelector("#game");
                                                    var elem = parent.querySelector("#game-wait");
                                                    resetForElement(parent, elem);
                                                }
                                                else {
                                                    notify("#canvas-notifier", getString("appScreenTeamplayTeammateReady", "?"), NotificationPriority.Default, 1000, null, null, client.height);
                                                }
                                                break;
                                            case "run":
                                                onlineConnection.stop = false;
                                                onlineConnection.paused = false;
                                                onlineConnection.syncing = false;
                                                multiplayerMode.waitingClock.visible = false;
                                                if (multiplayerMode.syncRequestTimeout !== undefined && multiplayerMode.syncRequestTimeout !== null) {
                                                    clearTimeout(multiplayerMode.syncRequestTimeout);
                                                }
                                                if (onlineConnection.locomotive) {
                                                    multiplayerMode.syncRequestTimeout = setTimeout(sendSyncRequest, multiplayerMode.syncInterval);
                                                }
                                                var parent = document.querySelector("#game");
                                                var elem = parent.querySelector("#game-gameplay");
                                                resetForElement(parent, elem);
                                                calcMenusAndBackground("resize");
                                                break;
                                        }
                                    }
                                    break;
                                case "action":
                                    var input_1 = JSON.parse(json.data);
                                    var notifyArr = [];
                                    if (typeof input_1.notification == "object" && Array.isArray(input_1.notification)) {
                                        input_1.notification.forEach(function (elem) {
                                            if (typeof elem == "object" && Array.isArray(elem.getString)) {
                                                notifyArr.push(getString.apply(null, elem.getString));
                                            }
                                            else if (typeof elem == "string") {
                                                notifyArr.push(elem);
                                            }
                                        });
                                        var notifyStr = formatJSString.apply(null, notifyArr);
                                        if (onlineConnection.sessionId != json.sessionId) {
                                            notifyStr = json.sessionName + ": " + notifyStr;
                                        }
                                        if (onlineConnection.sessionId != json.sessionId || !input_1.notificationOnlyForOthers) {
                                            notify("#canvas-notifier", notifyStr, NotificationPriority.Default, 1000, null, null, client.y + menus.outerContainer.height);
                                        }
                                    }
                                    switch (input_1.objectName) {
                                        case "trains":
                                            if (onlineConnection.sessionId != json.sessionId) {
                                                multiplayerMode.excludeFromSync["t"].forEach(function (key) {
                                                    input_1.params.forEach(function (param, paramNo) {
                                                        if (Object.keys(param)[0] == key) {
                                                            delete input_1.params[paramNo];
                                                        }
                                                    });
                                                });
                                            }
                                            animateWorker.postMessage({ k: "train", i: input_1.index, params: input_1.params });
                                            break;
                                        case "train-crash":
                                            if (multiplayerMode.syncRequestTimeout !== undefined && multiplayerMode.syncRequestTimeout !== null) {
                                                clearTimeout(multiplayerMode.syncRequestTimeout);
                                            }
                                            if (onlineConnection.locomotive) {
                                                multiplayerMode.syncRequestTimeout = setTimeout(sendSyncRequest, 200);
                                            }
                                            break;
                                        case "switches":
                                            if (Object.hasOwn(switches, input_1.index[0]) && Object.hasOwn(switches[input_1.index[0]], input_1.index[1])) {
                                                var obj_1 = switches[input_1.index[0]][input_1.index[1]];
                                                input_1.params.forEach(function (param) {
                                                    var key = Object.keys(param)[0];
                                                    if (Object.hasOwn(obj_1, key)) {
                                                        obj_1[key] = Object.values(param)[0];
                                                    }
                                                });
                                                obj_1.lastStateChange = frameNo;
                                                animateWorker.postMessage({ k: "switches", switches: switches });
                                            }
                                            break;
                                    }
                                    break;
                                case "sync-request":
                                    onlineConnection.syncingCounter = 0;
                                    onlineConnection.syncingCounterFinal = parseInt(json.data, 10);
                                    if (!onlineConnection.stop) {
                                        multiplayerMode.waitingClock.init();
                                        onlineConnection.stop = true;
                                    }
                                    onlineConnection.syncing = true;
                                    animateWorker.postMessage({ k: "sync-request" });
                                    break;
                                case "sync-ready":
                                    if (onlineConnection.locomotive) {
                                        sendSyncData();
                                    }
                                    break;
                                case "sync-task":
                                    if (onlineConnection.syncing) {
                                        onlineConnection.syncingCounter++;
                                        var task_1 = JSON.parse(json.data);
                                        switch (task_1.o) {
                                            case "t":
                                                animateWorker.postMessage({ k: "sync-t", i: task_1.i, d: task_1.d });
                                                break;
                                            case "tc":
                                                animateWorker.postMessage({ k: "sync-tc", i: task_1.i, d: task_1.d });
                                                break;
                                            case "s":
                                                Object.keys(task_1.d).forEach(function (key) {
                                                    Object.keys(switches[key]).forEach(function (currentKey) {
                                                        switches[key][currentKey].turned = task_1["d"][key][currentKey].turned;
                                                    });
                                                });
                                                animateWorker.postMessage({ k: "switches", switches: switches });
                                                break;
                                        }
                                        if (onlineConnection.syncingCounter == onlineConnection.syncingCounterFinal) {
                                            onlineConnection.send("sync-done");
                                        }
                                    }
                                    break;
                                case "sync-done":
                                    onlineConnection.stop = onlineConnection.paused;
                                    onlineConnection.syncing = false;
                                    if (!onlineConnection.stop) {
                                        multiplayerMode.waitingClock.visible = false;
                                    }
                                    if (json.errorLevel !== ERROR_LEVEL_OKAY) {
                                        notify("#canvas-notifier", getString("appScreenTeamplaySyncError", "."), NotificationPriority.High, 900, null, null, client.y + menus.outerContainer.height);
                                    }
                                    if (!onlineConnection.paused) {
                                        if (multiplayerMode.syncRequestTimeout !== undefined && multiplayerMode.syncRequestTimeout !== null) {
                                            clearTimeout(multiplayerMode.syncRequestTimeout);
                                        }
                                        if (onlineConnection.locomotive) {
                                            multiplayerMode.syncRequestTimeout = setTimeout(sendSyncRequest, multiplayerMode.syncInterval);
                                        }
                                        animateWorker.postMessage({ k: "resume" });
                                    }
                                    break;
                                case "pause":
                                    if (multiplayerMode.syncRequestTimeout !== undefined && multiplayerMode.syncRequestTimeout !== null) {
                                        clearTimeout(multiplayerMode.syncRequestTimeout);
                                    }
                                    if (!onlineConnection.stop) {
                                        multiplayerMode.waitingClock.init();
                                        onlineConnection.stop = true;
                                    }
                                    onlineConnection.paused = true;
                                    audioControl.playAndPauseAll();
                                    animateWorker.postMessage({ k: "pause" });
                                    notify("#canvas-notifier", getString("appScreenTeamplayGamePaused", "."), NotificationPriority.High, 900, null, null, client.y + menus.outerContainer.height);
                                    break;
                                case "resume":
                                    if (onlineConnection.paused) {
                                        if (multiplayerMode.syncRequestTimeout !== undefined && multiplayerMode.syncRequestTimeout !== null) {
                                            clearTimeout(multiplayerMode.syncRequestTimeout);
                                        }
                                        if (onlineConnection.locomotive) {
                                            multiplayerMode.syncRequestTimeout = setTimeout(sendSyncRequest, multiplayerMode.syncInterval);
                                        }
                                        onlineConnection.stop = onlineConnection.syncing;
                                        onlineConnection.paused = false;
                                        if (!onlineConnection.stop) {
                                            multiplayerMode.waitingClock.visible = false;
                                        }
                                        audioControl.playAndPauseAll();
                                        notify("#canvas-notifier", getString("appScreenTeamplayGameResumed", "."), NotificationPriority.High, 900, null, null, client.y + menus.outerContainer.height);
                                        animateWorker.postMessage({ k: "resume" });
                                    }
                                    break;
                                case "leave":
                                    notify("#canvas-notifier", json.sessionName + ": " + getString("appScreenTeamplayTeammateLeft", "."), NotificationPriority.High, 900, null, null, client.y + menus.outerContainer.height);
                                    break;
                                case "chat-msg":
                                    chatInnerNone_1.style.display = "none";
                                    chatControlsReactions_1.style.display = "";
                                    var chatInnerContainerMsg = document.createElement("div");
                                    var chatInnerPlayerName = document.createElement(onlineConnection.sessionId != json.sessionId ? "i" : "b");
                                    var chatInnerMessageImg = document.createElement("img");
                                    var chatInnerMessage = document.createElement("p");
                                    var chatInnerSeparator = document.createElement("br");
                                    chatInnerContainerMsg.className = "chat-inner-container";
                                    chatInnerPlayerName.textContent = (onlineConnection.sessionId != json.sessionId ? json.sessionName : json.sessionName + " (" + getString("appScreenTeamplayChatMe") + ")") + " - " + new Date().toLocaleTimeString();
                                    var isSticker = json.data.match(/^\{\{sticker=[0-9]+\}\}$/);
                                    var isTrainSticker = json.data.match(/^\{\{stickerTrain=[0-9]+\}\}$/);
                                    if (isSticker || isTrainSticker) {
                                        var stickerNumber = json.data.replace(/[^0-9]/g, "");
                                        if ((isSticker && stickerNumber < multiplayerMode.chatSticker) || (isTrainSticker && stickerNumber < trains.length)) {
                                            chatInnerMessageImg.src = "./assets/chat_" + (isTrainSticker ? "train_" : "sticker_") + stickerNumber + ".png";
                                            chatInnerMessageImg.className = isTrainSticker ? "train-sticker" : "sticker";
                                            json.data = isTrainSticker ? getString(["appScreenTrainIcons", parseInt(stickerNumber, 10)]) + " " + getString(["appScreenTrainNames", parseInt(stickerNumber, 10)]) : formatJSString(getString("appScreenTeamplayChatStickerNote"), getString(["appScreenTeamplayChatStickerEmojis", parseInt(stickerNumber, 10)]));
                                        }
                                        else {
                                            isSticker = isTrainSticker = false;
                                        }
                                    }
                                    chatInnerMessage.textContent = json.data;
                                    chatInnerContainerMsg.appendChild(chatInnerPlayerName);
                                    chatInnerContainerMsg.appendChild(chatInnerSeparator);
                                    if (isSticker || isTrainSticker) {
                                        chatInnerContainerMsg.appendChild(chatInnerMessageImg);
                                    }
                                    if (!isSticker) {
                                        chatInnerContainerMsg.appendChild(chatInnerMessage);
                                    }
                                    chatInnerMessages_1.appendChild(chatInnerContainerMsg);
                                    if (onlineConnection.sessionId != json.sessionId && chat_1.style.display == "") {
                                        notify("#tp-chat-notifier", json.sessionName + ": " + json.data, NotificationPriority.Default, 4000, null, null, client.height, NotificationChannel.MultiplayerChat + json.sessionId);
                                    }
                                    chat_1.resizeChat();
                                    break;
                                case "unknown":
                                    notify("#canvas-notifier", getString("appScreenTeamplayUnknownRequest", "."), NotificationPriority.High, 2000, null, null, client.y + menus.outerContainer.height);
                                    break;
                            }
                        };
                        onlineConnection.socket.onerror = function () {
                            showNewGameLink();
                            notify("#canvas-notifier", getString("appScreenTeamplayConnectionError", "!"), NotificationPriority.High, 6000, function () {
                                followLink("error#tp-connection", "_self", LinkStates.InternalHtml);
                            }, getString("appScreenFurtherInformation"), client.height);
                        };
                    };
                    onlineConnection.gameId = getQueryStringValue("id");
                    onlineConnection.gameKey = getQueryStringValue("key");
                    document.getElementById("setup").onmousemove = function (event) {
                        document.getElementById("setup-ball").style.left = event.pageX + "px";
                        document.getElementById("setup-ball").style.top = event.pageY + "px";
                    };
                    document.getElementById("setup").onmouseout = function (_event) {
                        document.getElementById("setup-ball").style.left = "-1vw";
                        document.getElementById("setup-ball").style.top = "-1vw";
                    };
                    onlineConnection.connect();
                }
                //Initialize trains
                switches = message.data.switches;
                rotationPoints = message.data.rotationPoints;
                trains = message.data.trains;
                trains3D = [];
                trains.forEach(function (train, i) {
                    var _a, _b, _c, _d;
                    var trainCallback = function (downIntersects, upIntersects) {
                        if (hardware.lastInputTouch < hardware.lastInputMouse) {
                            hardware.mouse.isHold = false;
                        }
                        if ((hardware.lastInputTouch < hardware.lastInputMouse && hardware.mouse.downTime - hardware.mouse.upTime > 0 && upIntersects && downIntersects && hardware.mouse.downTime - hardware.mouse.upTime < doubleClickTime && !hardware.mouse.lastClickDoubleClick) || (hardware.lastInputTouch > hardware.lastInputMouse && downIntersects && Date.now() - hardware.mouse.downTime > longTouchTime)) {
                            if (clickTimeOut !== undefined && clickTimeOut !== null) {
                                clearTimeout(clickTimeOut);
                                clickTimeOut = null;
                            }
                            if (hardware.lastInputTouch > hardware.lastInputMouse) {
                                hardware.mouse.isHold = false;
                            }
                            else {
                                hardware.mouse.lastClickDoubleClick = true;
                            }
                            if (trains[i].accelerationSpeed <= 0 && Math.abs(trains[i].accelerationSpeed) < 0.2) {
                                trainActions.changeDirection(i, true);
                            }
                        }
                        else {
                            if (clickTimeOut !== undefined && clickTimeOut !== null) {
                                clearTimeout(clickTimeOut);
                                clickTimeOut = null;
                            }
                            clickTimeOut = setTimeout(function () {
                                clickTimeOut = null;
                                if (hardware.lastInputTouch > hardware.lastInputMouse) {
                                    hardware.mouse.isHold = false;
                                }
                                if (!trains[i].crash) {
                                    if (trains[i].move && trains[i].accelerationSpeed > 0) {
                                        trainActions.stop(i);
                                    }
                                    else {
                                        trainActions.start(i, 50);
                                    }
                                }
                            }, hardware.lastInputTouch > hardware.lastInputMouse ? longTouchWaitTime : doubleClickWaitTime);
                        }
                    };
                    //Three.js
                    trains3D[i] = {};
                    if (objects3D[train.src]) {
                        trains3D[i].mesh = three.cloneNode(objects3D[train.src], true);
                        trains3D[i].resize = function () {
                            var scale = three.calcScale();
                            trains3D[i].mesh.scale.set(scale * (trains[i].width / background.width), scale * (trains[i].width / background.width), scale * (trains[i].width / background.width));
                            if (train.assetFlip) {
                                trains3D[i].mesh.scale.x *= -1;
                            }
                            if (trains3D[i].meshFront) {
                                trains3D[i].meshFront.left.scale.set(scale * (trains[i].width / background.width), scale * (trains[i].width / background.width), scale * (trains[i].width / background.width));
                                trains3D[i].meshFront.right.scale.set(scale * (trains[i].width / background.width), scale * (trains[i].width / background.width), scale * (trains[i].width / background.width));
                                if (train.assetFlip) {
                                    trains3D[i].meshFront.left.scale.x *= -1;
                                    trains3D[i].meshFront.right.scale.x *= -1;
                                }
                            }
                            if (trains3D[i].meshBack) {
                                trains3D[i].meshBack.left.scale.set(scale * (trains[i].width / background.width), scale * (trains[i].width / background.width), scale * (trains[i].width / background.width));
                                trains3D[i].meshBack.right.scale.set(scale * (trains[i].width / background.width), scale * (trains[i].width / background.width), scale * (trains[i].width / background.width));
                                if (train.assetFlip) {
                                    trains3D[i].meshBack.left.scale.x *= -1;
                                    trains3D[i].meshBack.right.scale.x *= -1;
                                }
                            }
                            trains3D[i].mesh.position.set(0, 0, 0);
                            trains3D[i].positionZ = new THREE.Box3().setFromObject(trains3D[i].mesh).getSize(new THREE.Vector3()).z / 2;
                        };
                        trains3D[i].resize();
                        trains3D[i].mesh.callback = trainCallback;
                        three.mainGroup.add(trains3D[i].mesh);
                        if (((_b = (_a = train.wheels) === null || _a === void 0 ? void 0 : _a.front) === null || _b === void 0 ? void 0 : _b.use3d) && objects3D[train.src + "_front"]) {
                            trains3D[i].meshFront = {};
                            trains3D[i].meshFront.left = three.cloneNode(objects3D[train.src + "_front"], true);
                            trains3D[i].meshFront.right = three.cloneNode(objects3D[train.src + "_front"], true);
                            trains3D[i].resize();
                            trains3D[i].meshFront.left.callback = trainCallback;
                            trains3D[i].meshFront.right.callback = trainCallback;
                            three.mainGroup.add(trains3D[i].meshFront.left);
                            three.mainGroup.add(trains3D[i].meshFront.right);
                        }
                        if (((_d = (_c = train.wheels) === null || _c === void 0 ? void 0 : _c.back) === null || _d === void 0 ? void 0 : _d.use3d) && objects3D[train.src + "_back"]) {
                            trains3D[i].meshBack = {};
                            trains3D[i].meshBack.left = three.cloneNode(objects3D[train.src + "_back"], true);
                            trains3D[i].meshBack.right = three.cloneNode(objects3D[train.src + "_back"], true);
                            trains3D[i].resize();
                            trains3D[i].meshBack.left.callback = trainCallback;
                            trains3D[i].meshBack.right.callback = trainCallback;
                            three.mainGroup.add(trains3D[i].meshBack.left);
                            three.mainGroup.add(trains3D[i].meshBack.right);
                        }
                    }
                    else {
                        var height3D = 0.0125;
                        trains3D[i].resize = function () {
                            if (three.mainGroup.getObjectByName("train_" + i)) {
                                three.mainGroup.remove(trains3D[i].mesh);
                            }
                            var scale = three.calcScale();
                            trains3D[i].mesh = new THREE.Mesh(new THREE.BoxGeometry(scale * (trains[i].width / background.width), scale * (trains[i].height / background.height / 2), scale * height3D), new THREE.MeshBasicMaterial({ color: 0x00aa00, transparent: true, opacity: 0.5 }));
                            trains3D[i].mesh.position.set(0, 0, 0);
                            trains3D[i].positionZ = (scale * height3D) / 2;
                            trains3D[i].mesh.callback = trainCallback;
                            trains3D[i].mesh.name = "train_" + i;
                            three.mainGroup.add(trains3D[i].mesh);
                        };
                        trains3D[i].resize();
                    }
                    trains3D[i].cars = [];
                    train.cars.forEach(function (car, j) {
                        var _a, _b, _c, _d;
                        trains3D[i].cars[j] = {};
                        if (objects3D[car.src]) {
                            trains3D[i].cars[j].mesh = three.cloneNode(objects3D[car.src], true);
                            trains3D[i].cars[j].resize = function () {
                                var scale = three.calcScale();
                                trains3D[i].cars[j].mesh.scale.set(scale * (trains[i].cars[j].width / background.width), scale * (trains[i].cars[j].width / background.width), scale * (trains[i].cars[j].width / background.width));
                                if (car.assetFlip) {
                                    trains3D[i].cars[j].mesh.scale.x *= -1;
                                }
                                if (trains3D[i].cars[j].meshFront) {
                                    trains3D[i].cars[j].meshFront.left.scale.set(scale * (trains[i].cars[j].width / background.width), scale * (trains[i].cars[j].width / background.width), scale * (trains[i].cars[j].width / background.width));
                                    trains3D[i].cars[j].meshFront.right.scale.set(scale * (trains[i].cars[j].width / background.width), scale * (trains[i].cars[j].width / background.width), scale * (trains[i].cars[j].width / background.width));
                                    if (car.assetFlip) {
                                        trains3D[i].cars[j].meshFront.left.scale.x *= -1;
                                        trains3D[i].cars[j].meshFront.right.scale.x *= -1;
                                    }
                                }
                                if (trains3D[i].cars[j].meshBack) {
                                    trains3D[i].cars[j].meshBack.left.scale.set(scale * (trains[i].cars[j].width / background.width), scale * (trains[i].cars[j].width / background.width), scale * (trains[i].cars[j].width / background.width));
                                    trains3D[i].cars[j].meshBack.right.scale.set(scale * (trains[i].cars[j].width / background.width), scale * (trains[i].cars[j].width / background.width), scale * (trains[i].cars[j].width / background.width));
                                    if (car.assetFlip) {
                                        trains3D[i].cars[j].meshBack.left.scale.x *= -1;
                                        trains3D[i].cars[j].meshBack.right.scale.x *= -1;
                                    }
                                }
                                trains3D[i].cars[j].mesh.position.set(0, 0, 0);
                                trains3D[i].cars[j].positionZ = new THREE.Box3().setFromObject(trains3D[i].cars[j].mesh).getSize(new THREE.Vector3()).z / 2;
                            };
                            trains3D[i].cars[j].resize();
                            trains3D[i].cars[j].mesh.callback = trainCallback;
                            three.mainGroup.add(trains3D[i].cars[j].mesh);
                            if (((_b = (_a = car.wheels) === null || _a === void 0 ? void 0 : _a.front) === null || _b === void 0 ? void 0 : _b.use3d) && objects3D[car.src + "_front"]) {
                                trains3D[i].cars[j].meshFront = {};
                                trains3D[i].cars[j].meshFront.left = three.cloneNode(objects3D[car.src + "_front"], true);
                                trains3D[i].cars[j].meshFront.right = three.cloneNode(objects3D[car.src + "_front"], true);
                                trains3D[i].cars[j].resize();
                                trains3D[i].cars[j].meshFront.left.callback = trainCallback;
                                trains3D[i].cars[j].meshFront.right.callback = trainCallback;
                                three.mainGroup.add(trains3D[i].cars[j].meshFront.left);
                                three.mainGroup.add(trains3D[i].cars[j].meshFront.right);
                            }
                            if (((_d = (_c = car.wheels) === null || _c === void 0 ? void 0 : _c.back) === null || _d === void 0 ? void 0 : _d.use3d) && objects3D[car.src + "_back"]) {
                                trains3D[i].cars[j].meshBack = {};
                                trains3D[i].cars[j].meshBack.left = three.cloneNode(objects3D[car.src + "_back"], true);
                                trains3D[i].cars[j].meshBack.right = three.cloneNode(objects3D[car.src + "_back"], true);
                                trains3D[i].cars[j].resize();
                                trains3D[i].cars[j].meshBack.left.callback = trainCallback;
                                trains3D[i].cars[j].meshBack.right.callback = trainCallback;
                                three.mainGroup.add(trains3D[i].cars[j].meshBack.left);
                                three.mainGroup.add(trains3D[i].cars[j].meshBack.right);
                            }
                        }
                        else {
                            var height3D = 0.01;
                            trains3D[i].cars[j].resize = function () {
                                if (three.mainGroup.getObjectByName("train_" + i + "_car_" + j)) {
                                    three.mainGroup.remove(trains3D[i].cars[j].mesh);
                                }
                                var scale = three.calcScale();
                                trains3D[i].cars[j].mesh = new THREE.Mesh(new THREE.BoxGeometry(scale * (trains[i].cars[j].width / background.width), scale * (trains[i].cars[j].height / background.height / 2), scale * height3D), new THREE.MeshBasicMaterial({ color: 0xaa0000, transparent: true, opacity: 0.5 }));
                                trains3D[i].cars[j].mesh.position.set(0, 0, 0);
                                trains3D[i].cars[j].positionZ = (scale * height3D) / 2;
                                trains3D[i].cars[j].mesh.callback = trainCallback;
                                trains3D[i].cars[j].mesh.name = "train_" + i + "_car_" + j;
                                three.mainGroup.add(trains3D[i].cars[j].mesh);
                            };
                            trains3D[i].cars[j].resize();
                        }
                    });
                });
                cars.forEach(function (car, i) {
                    var carCallback = function (downIntersects, upIntersects) {
                        if (hardware.lastInputTouch < hardware.lastInputMouse) {
                            hardware.mouse.isHold = false;
                        }
                        if ((hardware.lastInputTouch < hardware.lastInputMouse && hardware.mouse.downTime - hardware.mouse.upTime > 0 && upIntersects && downIntersects && hardware.mouse.downTime - hardware.mouse.upTime < doubleClickTime && !hardware.mouse.lastClickDoubleClick) || (hardware.lastInputTouch > hardware.lastInputMouse && downIntersects && Date.now() - hardware.mouse.downTime > longTouchTime)) {
                            if (clickTimeOut !== undefined && clickTimeOut !== null) {
                                clearTimeout(clickTimeOut);
                                clickTimeOut = null;
                            }
                            if (hardware.lastInputTouch > hardware.lastInputMouse) {
                                hardware.mouse.isHold = false;
                            }
                            else {
                                hardware.mouse.lastClickDoubleClick = true;
                            }
                            if (carParams.init) {
                                carActions.auto.start();
                            }
                            else if (carParams.autoModeOff && !cars[i].move && cars[i].backwardsState === 0) {
                                carActions.manual.backwards(i);
                            }
                        }
                        else {
                            if (clickTimeOut !== undefined && clickTimeOut !== null) {
                                clearTimeout(clickTimeOut);
                                clickTimeOut = null;
                            }
                            clickTimeOut = setTimeout(function () {
                                clickTimeOut = null;
                                if (hardware.lastInputTouch > hardware.lastInputMouse) {
                                    hardware.mouse.isHold = false;
                                }
                                if (!carCollisionCourse(i, false)) {
                                    if (carParams.autoModeRuns) {
                                        carActions.auto.pause();
                                    }
                                    else if (carParams.init || carParams.autoModeOff) {
                                        if (cars[i].move) {
                                            carActions.manual.stop(i);
                                        }
                                        else {
                                            carActions.manual.start(i);
                                        }
                                    }
                                    else {
                                        carActions.auto.resume();
                                    }
                                }
                            }, hardware.lastInputTouch > hardware.lastInputMouse ? longTouchWaitTime : doubleClickWaitTime);
                        }
                    };
                    cars3D[i] = {};
                    var radius = 0.0036;
                    var height3D = 0.0005;
                    cars3D[i].meshParkingLot = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height3D, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true }));
                    cars3D[i].meshParkingLot.rotation.x = Math.PI / 2;
                    cars3D[i].resizeParkingLot = function () {
                        var scale = three.calcScale();
                        cars3D[i].meshParkingLot.scale.set(scale, scale, scale);
                        cars3D[i].meshParkingLot.position.set(scale * ((carWays[i].start[cars[i].startFrame].x - background.width / 2) / background.width), scale * (-(carWays[i].start[cars[i].startFrame].y - background.height / 2) / background.width) + three.calcPositionY(), scale * (height3D / 2));
                    };
                    cars3D[i].meshParkingLot.callback = function () {
                        if (carParams.autoModeOff) {
                            carActions.manual.park(i);
                        }
                        else {
                            carActions.auto.end();
                        }
                    };
                    cars3D[i].meshParkingLot.visible = false;
                    cars3D[i].resizeParkingLot();
                    if (objects3D[car.src]) {
                        cars3D[i].mesh = three.cloneNode(objects3D[car.src]);
                        cars3D[i].resize = function () {
                            var scale = three.calcScale();
                            cars3D[i].mesh.scale.set(scale * (cars[i].width / background.width), scale * (cars[i].width / background.width), scale * (cars[i].width / background.width));
                            cars3D[i].mesh.position.set(0, 0, 0);
                            cars3D[i].positionZ = new THREE.Box3().setFromObject(cars3D[i].mesh).getSize(new THREE.Vector3()).z / 2;
                            cars3D[i].resizeParkingLot();
                        };
                        cars3D[i].resize();
                        cars3D[i].mesh.callback = carCallback;
                        three.mainGroup.add(cars3D[i].mesh);
                    }
                    else {
                        var height3D = 0.005;
                        cars3D[i].resize = function () {
                            if (three.mainGroup.getObjectByName("car_" + i)) {
                                three.mainGroup.remove(cars3D[i].mesh);
                            }
                            var scale = three.calcScale();
                            cars3D[i].mesh = new THREE.Mesh(new THREE.BoxGeometry(scale * (cars[i].width / background.width), scale * (cars[i].height / background.height / 2), scale * height3D), new THREE.MeshBasicMaterial({ color: 0xaaaa00, transparent: true, opacity: 0.5 }));
                            cars3D[i].mesh.position.set(0, 0, 0);
                            cars3D[i].positionZ = (scale * height3D) / 2;
                            cars3D[i].mesh.callback = carCallback;
                            cars3D[i].mesh.name = "car_" + i;
                            three.mainGroup.add(cars3D[i].mesh);
                            cars3D[i].resizeParkingLot();
                        };
                        cars3D[i].resize();
                    }
                    three.mainGroup.add(cars3D[i].meshParkingLot);
                });
                if (currentMode != Modes.DEMO) {
                    Object.keys(switches).forEach(function (key) {
                        switches3D[key] = {};
                        Object.keys(switches[key]).forEach(function (currentKey) {
                            switches3D[key][currentKey] = {};
                            var radius = 0.01;
                            var length = radius * 1.25;
                            var height3D = 0.0005;
                            var meshCallback = function () {
                                if (clickTimeOut !== undefined && clickTimeOut !== null) {
                                    clearTimeout(clickTimeOut);
                                    clickTimeOut = null;
                                }
                                clickTimeOut = setTimeout(function () {
                                    clickTimeOut = null;
                                    hardware.mouse.isHold = false;
                                    switchActions.turn(key, currentKey);
                                }, hardware.lastInputTouch > hardware.lastInputMouse ? doubleTouchWaitTime : 0);
                            };
                            switches3D[key][currentKey].circleMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height3D, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.25, transparent: true }));
                            switches3D[key][currentKey].circleMesh.rotation.x = Math.PI / 2;
                            switches3D[key][currentKey].circleMesh.callback = meshCallback;
                            switches3D[key][currentKey].circleMeshSmall = new THREE.Mesh(new THREE.CylinderGeometry(radius / 8, radius / 8, radius / 4, 24), new THREE.MeshBasicMaterial({ color: 0xffffff }));
                            switches3D[key][currentKey].circleMeshSmall.rotation.x = Math.PI / 2;
                            switches3D[key][currentKey].circleMeshSmall.callback = meshCallback;
                            switches3D[key][currentKey].squareMeshHighlight = new THREE.Mesh(new THREE.BoxGeometry(length * 1.25, radius / 4, radius / 4), new THREE.MeshBasicMaterial({ color: 0xffffff }));
                            switches3D[key][currentKey].squareMeshHighlight.rotation.x = Math.PI / 2;
                            switches3D[key][currentKey].squareMeshHighlight.callback = meshCallback;
                            switches3D[key][currentKey].squareMeshNormal = new THREE.Mesh(new THREE.BoxGeometry(length, radius / 6, radius / 6), new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.45, transparent: true }));
                            switches3D[key][currentKey].squareMeshNormal.rotation.x = Math.PI / 2;
                            switches3D[key][currentKey].squareMeshNormal.callback = meshCallback;
                            switches3D[key][currentKey].squareMeshTurned = new THREE.Mesh(new THREE.BoxGeometry(length, radius / 6, radius / 6), new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.45, transparent: true }));
                            switches3D[key][currentKey].squareMeshTurned.rotation.x = Math.PI / 2;
                            switches3D[key][currentKey].squareMeshTurned.callback = meshCallback;
                            switches3D[key][currentKey].resize = function () {
                                var scale = three.calcScale();
                                switches3D[key][currentKey].circleMesh.scale.set(scale, scale, scale);
                                switches3D[key][currentKey].circleMeshSmall.scale.set(scale, scale, scale);
                                switches3D[key][currentKey].squareMeshHighlight.scale.set(scale, scale, scale);
                                switches3D[key][currentKey].squareMeshNormal.scale.set(scale, scale, scale);
                                switches3D[key][currentKey].squareMeshTurned.scale.set(scale, scale, scale);
                                switches3D[key][currentKey].circleMesh.position.set(scale * ((switches[key][currentKey].x - background.width / 2) / background.width), scale * (-(switches[key][currentKey].y - background.height / 2) / background.width) + three.calcPositionY(), scale * (height3D / 2));
                                switches3D[key][currentKey].circleMeshSmall.position.set(scale * ((switches[key][currentKey].x - background.width / 2) / background.width), scale * (-(switches[key][currentKey].y - background.height / 2) / background.width) + three.calcPositionY(), scale * (radius / 8));
                            };
                            switches3D[key][currentKey].resize();
                            three.mainGroup.add(switches3D[key][currentKey].circleMesh);
                            three.mainGroup.add(switches3D[key][currentKey].circleMeshSmall);
                            three.mainGroup.add(switches3D[key][currentKey].squareMeshHighlight);
                            three.mainGroup.add(switches3D[key][currentKey].squareMeshNormal);
                            three.mainGroup.add(switches3D[key][currentKey].squareMeshTurned);
                        });
                    });
                }
                //Calc and show UI
                calcClassicUIElements();
                calcControlCenter();
                drawMenu("menu-switch");
                document.fonts.ready.then(function () {
                    //Recalc canvas fonts (font loading may take longer than resize)
                    calcClassicUIElements();
                    calcControlCenter();
                    three.followCamControls.recalc();
                });
                //Reset mode switch block
                if (modeSwitchingReloadTimeout !== undefined && modeSwitchingReloadTimeout !== null) {
                    clearTimeout(modeSwitchingReloadTimeout);
                }
                modeSwitching = false;
                //Trigger resize
                window.addEventListener("resize", requestResize);
                requestResize();
                //Initialize canvas
                drawInterval = message.data.animateInterval;
                drawObjects();
                //Gestures
                if (currentMode == Modes.DEMO) {
                    var demoModeTimeoutDelay_1 = 90000;
                    demoMode.reloadTimeout = setTimeout(function () {
                        if (carParams.autoModeRuns) {
                            sessionStorage.setItem("demoCars", JSON.stringify(cars));
                            sessionStorage.setItem("demoCarParams", JSON.stringify(carParams));
                            sessionStorage.setItem("demoBg", JSON.stringify(background));
                        }
                        if (Object.hasOwn(demoMode, "exitAppDelay")) {
                            var elapsedTime = demoModeTimeoutDelay_1;
                            var storedElapsedTime = parseInt(sessionStorage.getItem("demoElapsedTime"), 10);
                            if (Number.isInteger(storedElapsedTime)) {
                                elapsedTime += storedElapsedTime;
                            }
                            if (elapsedTime >= demoMode.exitAppDelay) {
                                sessionStorage.removeItem("demoElapsedTime");
                                SYSTEM_TOOLS.exitApp();
                                demoMode.reloadOnExitTimeout = setTimeout(function () {
                                    demoMode.reload();
                                }, 500);
                            }
                            else {
                                sessionStorage.setItem("demoElapsedTime", JSON.stringify(elapsedTime));
                                demoMode.reload();
                            }
                        }
                        else {
                            demoMode.reload();
                        }
                    }, demoModeTimeoutDelay_1);
                    if (!demoMode.standalone) {
                        document.addEventListener("keyup", demoMode.leaveKeyUp);
                        document.addEventListener("touchstart", demoMode.leaveTimeoutStart, { passive: false });
                        document.addEventListener("touchend", demoMode.leaveTimeoutEnd, { passive: false });
                        document.addEventListener("touchcancel", demoMode.leaveTimeoutEnd, { passive: false });
                        document.addEventListener("mousedown", demoMode.leaveTimeoutStart, { passive: false });
                        document.addEventListener("mouseup", demoMode.leaveTimeoutEnd, { passive: false });
                        document.addEventListener("mouseout", demoMode.leaveTimeoutEnd, { passive: false });
                    }
                }
                else {
                    canvasForeground.addEventListener("touchmove", getTouchMove, { passive: false });
                    canvasForeground.addEventListener("touchstart", getTouchStart, { passive: false });
                    canvasForeground.addEventListener("touchend", getTouchEnd, { passive: false });
                    canvasForeground.addEventListener("touchcancel", getTouchCancel, { passive: false });
                    canvasForeground.addEventListener("mousemove", onMouseMove, { passive: false });
                    canvasForeground.addEventListener("mousedown", onMouseDown, { passive: false });
                    canvasForeground.addEventListener("mouseup", onMouseUp, { passive: false });
                    canvasForeground.addEventListener("mouseout", onMouseOut, { passive: false });
                    canvasForeground.addEventListener("mouseenter", onMouseEnter, { passive: false });
                    canvasForeground.addEventListener("contextmenu", onMouseRight, { passive: false });
                    canvasForeground.addEventListener("wheel", onMouseWheel, { passive: false });
                    document.addEventListener("keydown", onKeyDown);
                    document.addEventListener("keyup", onKeyUp);
                    document.removeEventListener("contextmenu", preventEvent);
                    document.removeEventListener("wheel", preventEvent);
                    document.removeEventListener("keydown", preventKeyZoomDuringLoad);
                }
                document.removeEventListener("keyup", preventKeyZoomDuringLoad);
                var state_1 = message.data.state;
                //Ready event
                if (state_1 == "load") {
                    var event_2 = new CustomEvent("moroway-app-ready");
                    document.dispatchEvent(event_2);
                }
                //Show app
                if (currentMode == Modes.DEMO) {
                    loadingAnimation.hide();
                }
                else if (currentMode == Modes.SINGLEPLAYER) {
                    loadingAnimation.fade(function () {
                        var localAppData = getLocalAppDataCopy();
                        if (getSetting("classicUI") && !classicUI.trainSwitch.selectedTrainDisplay.visible && !gui.three) {
                            notify("#canvas-notifier", formatJSString(getString("appScreenTrainSelected", "."), getString(["appScreenTrainNames", trainParams.selected]), getString("appScreenTrainSelectedAuto", " ")), NotificationPriority.High, 3000, null, null, client.y + menus.outerContainer.height);
                        }
                        else if (state_1 == "load" && localAppData != null && (localAppData.version.major < APP_DATA.version.major || (localAppData.version.major == APP_DATA.version.major && localAppData.version.minor < APP_DATA.version.minor))) {
                            var event_3 = new CustomEvent("moroway-app-update-notification", { detail: { notifyMinHeight: client.y + menus.outerContainer.height } });
                            document.dispatchEvent(event_3);
                        }
                        else if (state_1 == "load") {
                            var event_4 = new CustomEvent("moroway-app-ready-notification", { detail: { notifyMinHeight: client.y + menus.outerContainer.height } });
                            document.dispatchEvent(event_4);
                        }
                        setLocalAppDataCopy();
                    });
                }
            }
            else if (message.data.k == "setTrains") {
                if (message.data.switches) {
                    switches = message.data.switches;
                }
                rotationPoints = message.data.rotationPoints;
                message.data.trains.forEach(function (train, i) {
                    trains[i].x = train.x;
                    trains[i].y = train.y;
                    trains[i].front.state = train.front.state;
                    trains[i].back.state = train.back.state;
                    trains[i].front.x = train.front.x;
                    trains[i].front.y = train.front.y;
                    trains[i].front.angle = train.front.angle;
                    trains[i].back.x = train.back.x;
                    trains[i].back.y = train.back.y;
                    trains[i].back.angle = train.back.angle;
                    trains[i].width = train.width;
                    trains[i].height = train.height;
                    trains[i].displayAngle = train.displayAngle;
                    trains[i].outerX = train.outerX;
                    trains[i].outerY = train.outerY;
                    trains[i].assetFlip = train.assetFlip;
                    trains[i].circleFamily = train.circleFamily;
                    trains[i].move = train.move;
                    trains[i].lastDirectionChange = train.lastDirectionChange;
                    trains[i].speedInPercent = train.speedInPercent;
                    trains[i].currentSpeedInPercent = train.currentSpeedInPercent;
                    trains[i].accelerationSpeed = train.accelerationSpeed;
                    trains[i].accelerationSpeedCustom = train.accelerationSpeedCustom;
                    trains[i].standardDirection = train.standardDirection;
                    trains[i].crash = train.crash;
                    trains[i].mute = train.mute;
                    trains[i].volume = train.volume;
                    trains[i].invisible = train.invisible;
                    trains[i].opacity = train.opacity;
                    trains[i].wheels = train.wheels;
                    train.cars.forEach(function (car, j) {
                        trains[i].cars[j].x = car.x;
                        trains[i].cars[j].y = car.y;
                        trains[i].cars[j].width = car.width;
                        trains[i].cars[j].height = car.height;
                        trains[i].cars[j].displayAngle = car.displayAngle;
                        trains[i].cars[j].assetFlip = car.assetFlip;
                        trains[i].cars[j].konamiUseTrainIcon = car.konamiUseTrainIcon;
                        trains[i].cars[j].invisible = car.invisible;
                        trains[i].cars[j].opacity = car.opacity;
                        trains[i].cars[j].front.state = car.front.state;
                        trains[i].cars[j].back.state = car.back.state;
                        trains[i].cars[j].front.x = car.front.x;
                        trains[i].cars[j].front.y = car.front.y;
                        trains[i].cars[j].front.angle = car.front.angle;
                        trains[i].cars[j].back.x = car.back.x;
                        trains[i].cars[j].back.y = car.back.y;
                        trains[i].cars[j].back.angle = car.back.angle;
                        trains[i].cars[j].wheels = car.wheels;
                    });
                    if (train.move && !train.mute && audioControl.mayPlay()) {
                        audioControl.startObject("train", trains[i].audioSrc, true);
                        if (train.currentSpeedInPercent == undefined) {
                            train.currentSpeedInPercent = 0;
                        }
                        audioControl.setObjectVolume("train", trains[i].audioSrc, train.volume);
                    }
                    else {
                        audioControl.stopObject("train", trains[i].audioSrc);
                    }
                });
                if (message.data.resized) {
                    trains3D.forEach(function (train) {
                        if (train.resize) {
                            train.resize();
                        }
                        train.cars.forEach(function (car) {
                            if (car.resize) {
                                car.resize();
                            }
                        });
                    });
                    if (currentMode != Modes.DEMO) {
                        Object.keys(switches).forEach(function (key) {
                            Object.keys(switches[key]).forEach(function (currentKey) {
                                switches3D[key][currentKey].resize();
                            });
                        });
                    }
                    if (currentMode == Modes.MULTIPLAYER) {
                        if (multiplayerMode.resizedTimeout != undefined && multiplayerMode.resizedTimeout != null) {
                            clearTimeout(multiplayerMode.resizedTimeout);
                        }
                        multiplayerMode.resizedTimeout = setTimeout(function () {
                            onlineConnection.resized = false;
                        }, 3000);
                    }
                    resized = false;
                    if (APP_DATA.debug) {
                        animateWorker.postMessage({ k: "debug" });
                    }
                }
            }
            else if (message.data.k == "trainCrash") {
                actionSync("trains", message.data.i, [{ move: false }], [{ getString: ["appScreenObjectHasCrashed", "."] }, { getString: [["appScreenTrainNames", message.data.i]] }, { getString: [["appScreenTrainNames", message.data.j]] }]);
                actionSync("train-crash");
                if (audioControl.existsObject("trainCrash")) {
                    audioControl.stopObject("trainCrash");
                }
                if (audioControl.mayPlay()) {
                    audioControl.startObject("trainCrash", null, false);
                }
            }
            else if (message.data.k == "sync-ready") {
                rotationPoints = message.data.rotationPoints;
                trains = message.data.trains;
                onlineConnection.send("sync-ready");
            }
            else if (message.data.k == "save-game") {
                if (getSetting("saveGame") && currentMode == Modes.SINGLEPLAYER) {
                    try {
                        localStorage.setItem("morowayAppSavedGame_v-" + getVersionCode() + "_Trains", JSON.stringify(message.data.saveTrains));
                        var saveSwitches = {};
                        Object.keys(switches).forEach(function (key) {
                            saveSwitches[key] = {};
                            Object.keys(switches[key]).forEach(function (side) {
                                saveSwitches[key][side] = switches[key][side].turned;
                            });
                        });
                        localStorage.setItem("morowayAppSavedGame_v-" + getVersionCode() + "_Switches", JSON.stringify(saveSwitches));
                        if (cars.length == carWays.length && cars.length > 0) {
                            localStorage.setItem("morowayAppSavedGame_v-" + getVersionCode() + "_Cars", JSON.stringify(cars));
                            localStorage.setItem("morowayAppSavedGame_v-" + getVersionCode() + "_CarParams", JSON.stringify(carParams));
                        }
                        localStorage.setItem("morowayAppSavedGame_v-" + getVersionCode() + "_Bg", JSON.stringify(background));
                    }
                    catch (e) {
                        if (APP_DATA.debug) {
                            console.error(e.name, e.message);
                        }
                        notify("#canvas-notifier", getString("appScreenSaveGameError", "."), NotificationPriority.High, 1000, null, null, client.y + menus.outerContainer.height);
                    }
                    animateWorker.postMessage({ k: "game-saved" });
                }
            }
            else if (message.data.k == "debug") {
                switchParams.beforeFac = message.data.switchesBeforeFac;
                switchParams.beforeAddSidings = message.data.switchesBeforeAddSidings;
                if (!debug.trainReady) {
                    console.debug("Animate Interval:", message.data.animateInterval);
                }
                console.debug("Trains: ", message.data.trains);
            }
            else if (message.data.k == "debugDrawPoints") {
                debug.drawPoints = message.data.p;
                debug.drawPointsCrash = message.data.pC;
                debug.trainCollisions = message.data.tC;
                debug.trainReady = true;
            }
        };
        animateWorker.postMessage({ k: "ready", state: "load", online: currentMode == Modes.MULTIPLAYER, onlineInterval: multiplayerMode.animateInterval, demo: currentMode == Modes.DEMO });
    }
    function onVisibilityChange() {
        client.hidden = document.visibilityState == "hidden";
        resetGestures();
        hardware.keyboard.keysHold = [];
        audioControl.playAndPauseAll();
        SYSTEM_TOOLS.keepAlive(!client.hidden);
        if (!modeSwitching) {
            if (!client.hidden) {
                if (drawTimeout !== undefined && drawTimeout !== null) {
                    clearTimeout(drawTimeout);
                }
                drawObjects();
            }
            if (currentMode == Modes.MULTIPLAYER) {
                if (client.hidden) {
                    onlineConnection.send("pause-request");
                }
                else {
                    onlineConnection.send("resume-request");
                }
            }
            else {
                if (client.hidden) {
                    animateWorker.postMessage({ k: "pause" });
                }
                else {
                    animateWorker.postMessage({ k: "resume" });
                }
            }
        }
    }
    prepareInit();
    //Visibility handling
    document.addEventListener("visibilitychange", onVisibilityChange);
    onVisibilityChange();
    //Initialize canvases and contexts
    canvas = document.querySelector("canvas#game-gameplay-main");
    canvasGesture = document.querySelector("canvas#game-gameplay-gesture");
    canvasBackground = document.querySelector("canvas#game-gameplay-bg");
    canvasSemiForeground = document.querySelector("canvas#game-gameplay-sfg");
    canvasForeground = document.querySelector("canvas#game-gameplay-fg");
    context = canvas.getContext("2d");
    contextGesture = canvasGesture.getContext("2d");
    contextBackground = canvasBackground.getContext("2d");
    contextSemiForeground = canvasSemiForeground.getContext("2d");
    contextForeground = canvasForeground.getContext("2d");
    //Load media
    var finalLoadNo = 0;
    var currentLoadNo = 0;
    //Load 3d objects
    var defaultObjects3D = [
        { object: "background-flat.jpg", path: "assets/3d/", id: "background-flat", type: "texture" },
        { object: "background-3d.gltf", path: "assets/3d/background-3d/", id: "background-3d", type: "mesh" },
        { object: "asset0.glb", path: "assets/3d/", id: "0", type: "mesh" },
        { object: "asset1.glb", path: "assets/3d/", id: "1", type: "mesh" },
        { object: "asset2.glb", path: "assets/3d/", id: "2", type: "mesh" },
        { object: "asset3.glb", path: "assets/3d/", id: "3", type: "mesh" },
        { object: "asset4.glb", path: "assets/3d/", id: "4", type: "mesh" },
        { object: "asset5.glb", path: "assets/3d/", id: "5", type: "mesh" },
        { object: "asset6.glb", path: "assets/3d/", id: "6", type: "mesh" },
        { object: "asset7.glb", path: "assets/3d/", id: "7", type: "mesh" },
        { object: "asset8.glb", path: "assets/3d/", id: "8", type: "mesh" },
        { object: "asset16.glb", path: "assets/3d/", id: "16", type: "mesh" },
        { object: "asset17.glb", path: "assets/3d/", id: "17", type: "mesh" },
        { object: "asset18.glb", path: "assets/3d/", id: "18", type: "mesh" },
        { object: "asset19.glb", path: "assets/3d/", id: "19", type: "mesh" },
        { object: "asset20.glb", path: "assets/3d/", id: "20", type: "mesh" },
        { object: "asset21.glb", path: "assets/3d/", id: "21", type: "mesh" },
        { object: "asset22.glb", path: "assets/3d/", id: "22", type: "mesh" },
        { object: "asset33.glb", path: "assets/3d/", id: "33", type: "mesh" },
        { object: "asset34.glb", path: "assets/3d/", id: "34", type: "mesh" },
        { object: "asset35.glb", path: "assets/3d/", id: "35", type: "mesh" },
        { object: "asset36.glb", path: "assets/3d/", id: "36", type: "mesh" },
        { object: "asset37.glb", path: "assets/3d/", id: "37", type: "mesh" },
        { object: "asset2_front.glb", path: "assets/3d/", id: "2_front", type: "mesh" },
        { object: "asset3_front.glb", path: "assets/3d/", id: "3_front", type: "mesh" },
        { object: "asset4_front.glb", path: "assets/3d/", id: "4_front", type: "mesh" },
        { object: "asset5_front.glb", path: "assets/3d/", id: "5_front", type: "mesh" },
        { object: "asset6_front.glb", path: "assets/3d/", id: "6_front", type: "mesh" },
        { object: "asset7_front.glb", path: "assets/3d/", id: "7_front", type: "mesh" },
        { object: "asset8_front.glb", path: "assets/3d/", id: "8_front", type: "mesh" },
        { object: "asset18_front.glb", path: "assets/3d/", id: "18_front", type: "mesh" },
        { object: "asset19_front.glb", path: "assets/3d/", id: "19_front", type: "mesh" },
        { object: "asset20_front.glb", path: "assets/3d/", id: "20_front", type: "mesh" },
        { object: "asset21_front.glb", path: "assets/3d/", id: "21_front", type: "mesh" },
        { object: "asset22_front.glb", path: "assets/3d/", id: "22_front", type: "mesh" },
        { object: "asset34_front.glb", path: "assets/3d/", id: "34_front", type: "mesh" },
        { object: "asset35_front.glb", path: "assets/3d/", id: "35_front", type: "mesh" },
        { object: "asset36_front.glb", path: "assets/3d/", id: "36_front", type: "mesh" },
        { object: "asset37_front.glb", path: "assets/3d/", id: "37_front", type: "mesh" },
        { object: "asset2_back.glb", path: "assets/3d/", id: "2_back", type: "mesh" },
        { object: "asset3_back.glb", path: "assets/3d/", id: "3_back", type: "mesh" },
        { object: "asset4_back.glb", path: "assets/3d/", id: "4_back", type: "mesh" },
        { object: "asset5_back.glb", path: "assets/3d/", id: "5_back", type: "mesh" },
        { object: "asset6_back.glb", path: "assets/3d/", id: "6_back", type: "mesh" },
        { object: "asset7_back.glb", path: "assets/3d/", id: "7_back", type: "mesh" },
        { object: "asset8_back.glb", path: "assets/3d/", id: "8_back", type: "mesh" },
        { object: "asset18_back.glb", path: "assets/3d/", id: "18_back", type: "mesh" },
        { object: "asset19_back.glb", path: "assets/3d/", id: "19_back", type: "mesh" },
        { object: "asset20_back.glb", path: "assets/3d/", id: "20_back", type: "mesh" },
        { object: "asset21_back.glb", path: "assets/3d/", id: "21_back", type: "mesh" },
        { object: "asset22_back.glb", path: "assets/3d/", id: "22_back", type: "mesh" },
        { object: "asset34_back.glb", path: "assets/3d/", id: "34_back", type: "mesh" },
        { object: "asset35_back.glb", path: "assets/3d/", id: "35_back", type: "mesh" },
        { object: "asset36_back.glb", path: "assets/3d/", id: "36_back", type: "mesh" },
        { object: "asset37_back.glb", path: "assets/3d/", id: "37_back", type: "mesh" }
    ];
    objects3D = [];
    finalLoadNo += defaultObjects3D.length;
    defaultObjects3D.forEach(function (object3D) {
        if (object3D.type == "mesh") {
            var loaderGLTF = new GLTFLoader();
            loaderGLTF.setPath(object3D.path).load(object3D.object, function (gltf) {
                objects3D[object3D.id] = gltf.scene;
                currentLoadNo++;
                var progressPercent = Math.round(100 * (currentLoadNo / finalLoadNo));
                loadingAnimation.updateProgress(progressPercent);
                if (currentLoadNo == finalLoadNo) {
                    //Initialize content
                    initAnimateWorker();
                }
            }, null, function () {
                objects3D[object3D.id] = null;
                currentLoadNo++;
                var progressPercent = Math.round(100 * (currentLoadNo / finalLoadNo));
                loadingAnimation.updateProgress(progressPercent);
                if (currentLoadNo == finalLoadNo) {
                    //Initialize content
                    initAnimateWorker();
                }
            });
        }
        else if (object3D.type == "texture") {
            var loaderTexture = new THREE.TextureLoader();
            loaderTexture.setPath(object3D.path).load(object3D.object, function (texture) {
                objects3D[object3D.id] = texture;
                currentLoadNo++;
                var progressPercent = Math.round(100 * (currentLoadNo / finalLoadNo));
                loadingAnimation.updateProgress(progressPercent);
                if (currentLoadNo == finalLoadNo) {
                    //Initialize content
                    initAnimateWorker();
                }
            }, null, function () {
                objects3D[object3D.id] = null;
                currentLoadNo++;
                var progressPercent = Math.round(100 * (currentLoadNo / finalLoadNo));
                loadingAnimation.updateProgress(progressPercent);
                if (currentLoadNo == finalLoadNo) {
                    //Initialize content
                    initAnimateWorker();
                }
            });
        }
    });
    //Load images
    var defaultPics = [
        { id: 0, extension: "png" },
        { id: 1, extension: "png" },
        { id: 2, extension: "png" },
        { id: 3, extension: "png" },
        { id: 4, extension: "png" },
        { id: 5, extension: "png" },
        { id: 6, extension: "png" },
        { id: 7, extension: "png" },
        { id: 8, extension: "png" },
        { id: 9, extension: "jpg" },
        { id: 10, extension: "png" },
        { id: 11, extension: "png" },
        { id: 12, extension: "png" },
        { id: 13, extension: "png" },
        { id: 14, extension: "png" },
        { id: 15, extension: "png" },
        { id: 16, extension: "png" },
        { id: 17, extension: "png" },
        { id: 18, extension: "png" },
        { id: 19, extension: "png" },
        { id: 20, extension: "png" },
        { id: 21, extension: "png" },
        { id: 22, extension: "png" },
        { id: 23, extension: "png" },
        { id: 24, extension: "png" },
        { id: 25, extension: "png" },
        { id: 26, extension: "png" },
        { id: 27, extension: "png" },
        { id: 28, extension: "png" },
        { id: 29, extension: "png" },
        { id: 30, extension: "png" },
        { id: 31, extension: "png" },
        { id: 32, extension: "png" },
        { id: 33, extension: "png" },
        { id: 34, extension: "png" },
        { id: 35, extension: "png" },
        { id: 36, extension: "png" },
        { id: 37, extension: "png" },
        { id: 38, extension: "png" },
        { id: 39, extension: "png" }
    ];
    pics = [];
    defaultObjects3D.length;
    finalLoadNo += defaultPics.length;
    defaultPics.forEach(function (pic) {
        pics[pic.id] = new Image();
        pics[pic.id].src = "assets/asset" + pic.id + "." + pic.extension;
        pics[pic.id].onload = function () {
            currentLoadNo++;
            var progressPercent = Math.round(100 * (currentLoadNo / finalLoadNo));
            loadingAnimation.updateProgress(progressPercent);
            if (currentLoadNo == finalLoadNo) {
                //Initialize content
                initAnimateWorker();
            }
        };
        pics[pic.id].onerror = function () {
            notify("#canvas-notifier", getString("generalIsFail", "!", "upper"), NotificationPriority.High, 950, null, null, client.height);
            setTimeout(function () {
                followLink("error#pic", "_self", LinkStates.InternalHtml);
            }, 1000);
        };
    });
});
window.addEventListener("error", function () {
    var _a;
    (_a = onlineConnection.socket) === null || _a === void 0 ? void 0 : _a.close();
    audioControl.stopAll();
});
window.addEventListener("popstate", function (event) {
    if (event.state) {
        var historyStateMode = event.state.mode;
        if (Object.values(Modes).includes(historyStateMode)) {
            switchMode(historyStateMode);
        }
        else {
            switchMode(Modes.SINGLEPLAYER);
        }
    }
    else {
        var queryStringMode = getQueryStringValue("mode");
        if (Object.values(Modes).includes(queryStringMode)) {
            switchMode(queryStringMode);
        }
        else {
            switchMode(Modes.SINGLEPLAYER);
        }
    }
});
document.addEventListener("DOMContentLoaded", function () {
    setHTMLStrings();
    initTooltips();
});
