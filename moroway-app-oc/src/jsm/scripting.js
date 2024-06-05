/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";
import { followLink, LINK_STATE_INTERNAL_HTML } from "../jsm_platform/common/follow_links.js";
import { getLocalAppDataCopy, setLocalAppDataCopy, APP_DATA } from "./common/app_data.js";
import { formatJSString, getString, setHTMLStrings } from "./common/string_tools.js";
import { getQueryString, getServerLink, getShareLink, PROTOCOL_WS } from "./common/web_tools.js";
import { getSetting } from "./common/settings.js";
import { notify, NOTIFICATION_CHANNEL_CLASSIC_UI_TRAIN_SWITCH, NOTIFICATION_CHANNEL_TEAMPLAY_CHAT, NOTIFICATION_CHANNEL_TRAIN_SWITCHES, NOTIFICATION_PRIO_DEFAULT, NOTIFICATION_PRIO_LOW, NOTIFICATION_PRIO_HIGH } from "./common/notify.js";
import { copyJSObject } from "./common/js_objects.js";
import { copy } from "./common/copy_paste.js";
import { getGuiState, setGuiState } from "./common/gui_state.js";
import { getVersionCode, updateSavedGame, removeSavedGame } from "./common/saved_game.js";
import { initTooltip, initTooltips } from "./common/tooltip.js";
import * as THREE from "../lib/open_code/jsm/three.js/three.module.min.js";
import { GLTFLoader } from "../lib/open_code/jsm/three.js/GLTFLoader.js";
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
    if (sx === undefined || sy === undefined || sWidth === undefined || sHeight === undefined) {
        cxt.drawImage(pic, Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height));
    }
    else {
        cxt.drawImage(pic, Math.floor(sx), Math.floor(sy), Math.floor(sWidth), Math.floor(sHeight), Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height));
    }
}
function resetGestures() {
    hardware.mouse.isHold = hardware.mouse.isWheelHold = hardware.mouse.isDrag = controlCenter.mouse.hold = false;
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
function onVisibilityChange() {
    resetGestures();
    client.hidden = document.visibilityState == "hidden";
    hardware.keyboard.keysHold = [];
    playAndPauseAudio();
}
/*******************************************
 *            Audio functions              *
 ******************************************/
function playAndPauseAudio() {
    if (typeof audio.context == "object") {
        var play = audio.active && !client.hidden && !onlineGame.stop;
        if (play && audio.context.state == "suspended") {
            audio.context.resume();
        }
        else if (!play && audio.context.state == "running") {
            audio.context.suspend();
        }
        return true;
    }
    return false;
}
function existsAudio(destinationName, destinationIndex) {
    if (destinationIndex === void 0) { destinationIndex = undefined; }
    if (typeof audio.context == "object") {
        if (typeof destinationIndex == "number") {
            if (typeof audio.source[destinationName][destinationIndex] == "object") {
                return true;
            }
        }
        else {
            if (typeof audio.source[destinationName] == "object") {
                return true;
            }
        }
    }
    return false;
}
function startAudio(destinationName, destinationIndex, loop) {
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
            if (typeof audio.buffer[destinationName] == "object" && typeof audio.gainNode[destinationName] == "object") {
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
}
function setAudioVolume(destinationName, destinationIndex, volume) {
    if (typeof audio.context == "object") {
        var gainNode;
        if (typeof destinationIndex == "number") {
            gainNode = audio.gainNode[destinationName][destinationIndex];
        }
        else {
            gainNode = audio.gainNode[destinationName];
        }
        if (typeof gainNode == "object" && volume != undefined) {
            gainNode.gain.value = Math.round(volume) / 100;
            return true;
        }
    }
    return false;
}
function stopAudio(destinationName, destinationIndex) {
    if (destinationIndex === void 0) { destinationIndex = undefined; }
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
}
/*******************************************
 *             Mode functions              *
 ******************************************/
function showConfirmDialogLeaveMultiplayerMode() {
    var confirmDialog = document.querySelector("#confirm-dialog");
    if (confirmDialog != null) {
        var confirmDialogTitle = confirmDialog.querySelector("#confirm-dialog-title");
        var confirmDialogText = confirmDialog.querySelector("#confirm-dialog-text");
        confirmDialogTitle.textContent = getString("appScreenTeamplayLeaveDialogTitle");
        confirmDialogText.style.display = "none";
        var confirmDialogYes = document.querySelector("#confirm-dialog #confirm-dialog-yes");
        if (confirmDialogYes != null) {
            confirmDialogYes.onclick = function () {
                switchMode();
                closeConfirmDialog();
            };
        }
        var confirmDialogNo = document.querySelector("#confirm-dialog #confirm-dialog-no");
        if (confirmDialogNo != null) {
            confirmDialogNo.onclick = closeConfirmDialog;
        }
        if (onlineGame.enabled && confirmDialog.style.display == "") {
            confirmDialog.style.display = "block";
        }
    }
}
function showConfirmDialogEnterDemoMode() {
    var confirmDialog = document.querySelector("#confirm-dialog");
    if (confirmDialog != null) {
        var confirmDialogTitle = confirmDialog.querySelector("#confirm-dialog-title");
        var confirmDialogText = confirmDialog.querySelector("#confirm-dialog-text");
        var confirmDialogParams = confirmDialog.querySelector("#confirm-dialog-params");
        confirmDialogTitle.textContent = getString("generalStartGameDemoMode", "?");
        confirmDialogText.textContent = getString("appScreenDemoModeEnterDialogText");
        if (gui.three) {
            confirmDialogParams.style.display = "block";
            var elementSpan = document.createElement("span");
            elementSpan.textContent = getString("generalStartDemoMode3DRotationSpeed");
            confirmDialogParams.appendChild(elementSpan);
            var elementBr = document.createElement("br");
            confirmDialogParams.appendChild(elementBr);
            var elementInput = document.createElement("input");
            elementInput.id = "confirm-dialog-params-3d-rotation-speed";
            elementInput.type = "range";
            elementInput.min = "0";
            elementInput.max = "100";
            elementInput.value = getGuiState("3d-rotation-speed");
            elementInput.style.accentColor = "rgb(210, 120, 27)";
            confirmDialogParams.appendChild(elementInput);
        }
        var confirmDialogYes = document.querySelector("#confirm-dialog #confirm-dialog-yes");
        if (confirmDialogYes != null) {
            confirmDialogYes.onclick = function () {
                var param3DRotationSpeedElem = confirmDialog.querySelector("#confirm-dialog-params-3d-rotation-speed");
                if (param3DRotationSpeedElem != null) {
                    setGuiState("3d-rotation-speed", parseInt(param3DRotationSpeedElem.value, 10));
                }
                switchMode("demo");
                closeConfirmDialog();
            };
        }
        var confirmDialogNo = document.querySelector("#confirm-dialog #confirm-dialog-no");
        if (confirmDialogNo != null) {
            confirmDialogNo.onclick = closeConfirmDialog;
        }
        if (!gui.demo && confirmDialog.style.display == "") {
            confirmDialog.style.display = "block";
        }
    }
}
function closeConfirmDialog() {
    var confirmDialog = document.querySelector("#confirm-dialog");
    if (confirmDialog != null) {
        confirmDialog.style.display = "";
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
function switchMode(mode) {
    if (mode === void 0) { mode = "normal"; }
    followLink("?mode=" + mode, "_self", LINK_STATE_INTERNAL_HTML);
}
export function getMode() {
    if (onlineGame.enabled) {
        return "online";
    }
    else if (gui.demo) {
        return "demo";
    }
    return "normal";
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
function drawMenuIcons(menu, state) {
    var innerWidth = menus.innerWidth;
    if (menus.innerWidthRelativeToItemLength) {
        innerWidth *= menu.items.length;
        if (innerWidth > menus.outerContainer.width) {
            innerWidth = menus.outerContainer.width;
        }
    }
    menu.container.elementInner.style.width = innerWidth + "px";
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
        case "invisible-outer":
            menus.outerContainer.element.style.visibility = "hidden";
        case "invisible":
            menu.container.elementInner.style.visibility = "hidden";
            break;
        case "visible":
            menus.outerContainer.element.style.visibility = menu.container.elementInner.style.visibility = "";
            break;
    }
    var itemSize = Math.min(menus.itemDefaultSize, (menus.itemDefaultSize * innerWidth) / (menus.itemDefaultSize * menu.items.length));
    if (menus.floating) {
        itemSize = Math.min(itemSize, Math.max(itemSize / 2, 30));
    }
    for (var i = 0; i < menu.items.length; i++) {
        menu.items[i].style.display = "";
        var textItem = menu.items[i].querySelector("i") == undefined ? menu.items[i] : menu.items[i].querySelector("i");
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
        window.clearTimeout(menus.infoOverlay.textTimeout);
        delete menus.infoOverlay.focus;
        menus.infoOverlay.overlayText.style.display = menus.infoOverlay.overlayText.style.fontSize = menus.infoOverlay.overlayText.style.height = "";
    }
    if (menus.infoOverlay.scaleInterval != undefined && menus.infoOverlay.scaleInterval != null) {
        window.clearInterval(menus.infoOverlay.scaleInterval);
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
                window.clearTimeout(menus.infoOverlay.textTimeout);
            }
            if (menus.infoOverlay.scaleInterval != undefined && menus.infoOverlay.scaleInterval != null) {
                window.clearInterval(menus.infoOverlay.scaleInterval);
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
                    var fontSize = window.getComputedStyle(menus.infoOverlay.overlayText).getPropertyValue("font-size");
                    menus.infoOverlay.overlayText.style.fontSize = parseFloat(fontSize.substring(0, fontSize.length - 2)) * 0.9 + "px";
                }
                var overlayTextHeight = menus.infoOverlay.overlayText.offsetHeight;
                menus.infoOverlay.overlayText.style.height = Math.max(client.y, overlayTextHeight) + "px";
                menus.infoOverlay.textTimeout = window.setTimeout(function () {
                    if (menus.infoOverlay.scaleInterval != undefined && menus.infoOverlay.scaleInterval != null) {
                        window.clearInterval(menus.infoOverlay.scaleInterval);
                    }
                    menus.infoOverlay.scaleFac = 1;
                    menus.infoOverlay.scaleFacGrow = true;
                    menus.infoOverlay.overlayText.style.display = menus.infoOverlay.overlayText.style.fontSize = menus.infoOverlay.overlayText.style.height = "";
                    delete menus.infoOverlay.focus;
                }, 4000);
                menus.infoOverlay.scaleInterval = window.setInterval(function () {
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
    if (menus.options.items.length > 0 && menus.infoOverlay.items.length > 0 && !gui.demo) {
        drawMenuIcons(menus.infoOverlay, state);
    }
}
function drawOptionsMenu(state) {
    menus.options.items = document.querySelectorAll("#canvas-options-inner > *:not(.hidden):not(.settings-hidden):not(.gui-hidden)");
    if (menus.options.items.length > 0 && !gui.demo) {
        drawMenuIcons(menus.options, state);
    }
}
function commonOnOptionsMenuClick() {
    closeConfirmDialog();
}
function calcMenusAndBackground(state) {
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
                    console.log("Fetch-Error:", error);
                }
            });
        }
        catch (e) {
            if (APP_DATA.debug) {
                console.log(e);
            }
        }
    }
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
    function set3DItems() {
        if (gui.three) {
            elementInfoToggle === null || elementInfoToggle === void 0 ? void 0 : elementInfoToggle.classList.add("gui-hidden");
            element3DViewNightToggle === null || element3DViewNightToggle === void 0 ? void 0 : element3DViewNightToggle.classList.remove("gui-hidden");
            if (element3DViewToggle != null) {
                element3DViewToggle.querySelector("i").textContent = "2d";
                element3DViewToggle.dataset.tooltip = formatJSString(getString("generalXIsY"), getString("general3DView"), getString("generalOn"));
            }
        }
        else {
            elementInfoToggle === null || elementInfoToggle === void 0 ? void 0 : elementInfoToggle.classList.remove("gui-hidden");
            element3DViewNightToggle === null || element3DViewNightToggle === void 0 ? void 0 : element3DViewNightToggle.classList.add("gui-hidden");
            if (element3DViewToggle != null) {
                element3DViewToggle.querySelector("i").textContent = "view_in_ar";
                element3DViewToggle.dataset.tooltip = formatJSString(getString("generalXIsY"), getString("general3DView"), getString("generalOff"));
            }
        }
    }
    var soundFileExtension = "ogg";
    var elementNormalMode = document.querySelector("#canvas-single");
    var elementTeamMode = document.querySelector("#canvas-team");
    var elementDemoMode = document.querySelector("#canvas-demo-mode");
    var elementHelp = document.querySelector("#canvas-help");
    var elementSettings = document.querySelector("#canvas-settings");
    var elementInfoToggle = document.querySelector("#canvas-info-toggle");
    var elementSoundToggle = document.querySelector("#canvas-sound-toggle");
    var element3DViewToggle = document.querySelector("#canvas-3d-view-toggle");
    var element3DViewNightToggle = document.querySelector("#canvas-3d-view-day-night");
    var elementControlCenterTrains = document.querySelector("#canvas-control-center");
    var elementControlCenterCars = document.querySelector("#canvas-car-control-center");
    var elementTeamChat = document.querySelector("#canvas-chat-open");
    if (elementInfoToggle != null) {
        if (getSetting("reduceOptMenuHideGraphicalInfoToggle")) {
            elementInfoToggle.classList.add("settings-hidden");
            if (gui.infoOverlay) {
                gui.infoOverlay = false;
                drawOptionsMenu("show");
                drawInfoOverlayMenu("hide");
            }
        }
        else {
            elementInfoToggle.classList.remove("settings-hidden");
        }
    }
    if (elementControlCenterTrains != null) {
        if (getSetting("reduceOptMenuHideTrainControlCenter")) {
            elementControlCenterTrains.classList.add("settings-hidden");
        }
        else {
            elementControlCenterTrains.classList.remove("settings-hidden");
        }
    }
    if (elementControlCenterCars != null) {
        if (getSetting("reduceOptMenuHideCarControlCenter")) {
            elementControlCenterCars.classList.add("settings-hidden");
        }
        else {
            elementControlCenterCars.classList.remove("settings-hidden");
        }
    }
    if (elementSoundToggle != null) {
        if (getSetting("reduceOptMenuHideAudioToggle")) {
            elementSoundToggle.classList.add("settings-hidden");
            audio.active = false;
            playAndPauseAudio();
            elementSoundToggle.querySelector("i").textContent = "volume_off";
            elementSoundToggle.dataset.tooltip = formatJSString(getString("generalXAreY"), getString("appScreenSound"), getString("generalOff"));
        }
        else {
            elementSoundToggle.classList.remove("settings-hidden");
        }
    }
    if (elementDemoMode != null) {
        if (getSetting("reduceOptMenuHideDemoMode")) {
            elementDemoMode.classList.add("settings-hidden");
        }
        else {
            elementDemoMode.classList.remove("settings-hidden");
        }
    }
    if (element3DViewToggle != null) {
        if (getSetting("reduceOptMenuHide3DViewToggle")) {
            element3DViewToggle.classList.add("settings-hidden");
        }
        else {
            element3DViewToggle.classList.remove("settings-hidden");
        }
    }
    if (element3DViewNightToggle != null) {
        if (getSetting("reduceOptMenuHide3DViewNightToggle")) {
            element3DViewNightToggle.classList.add("settings-hidden");
        }
        else {
            element3DViewNightToggle.classList.remove("settings-hidden");
        }
    }
    if (state == "load") {
        menus.outerContainer = {};
        menus.outerContainer.element = document.querySelector("#canvas-menus");
        menus.outerContainer.element.addEventListener("wheel", function (event) {
            event.preventDefault();
        }, { passive: false });
        menus.options = {};
        menus.options.container = {};
        menus.options.container.elementInner = document.querySelector("#canvas-options-inner");
        menus.infoOverlay = {};
        menus.infoOverlay.container = {};
        menus.infoOverlay.container.elementInner = document.querySelector("#canvas-info-inner");
        menus.infoOverlay.overlayText = document.querySelector("#info-overlay-text");
        if (elementDemoMode != null) {
            if (onlineGame.enabled) {
                elementDemoMode.classList.add("hidden");
            }
            else {
                elementDemoMode.addEventListener("click", function () {
                    commonOnOptionsMenuClick();
                    showConfirmDialogEnterDemoMode();
                });
            }
        }
        if (elementSoundToggle != null) {
            elementSoundToggle.dataset.tooltip = formatJSString(getString("generalXAreY"), getString("appScreenSound"), getString("generalOff"));
            elementSoundToggle.addEventListener("click", function () {
                commonOnOptionsMenuClick();
                if (audio.context == undefined) {
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
                                console.log("Fetch-Error:", error);
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
                            console.log(e);
                        }
                    }
                    try {
                        fetch("./assets/audio_asset_switch." + soundFileExtension)
                            .then(function (response) {
                            return response.arrayBuffer();
                        })
                            .catch(function (error) {
                            if (APP_DATA.debug) {
                                console.log("Fetch-Error:", error);
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
                            console.log(e);
                        }
                    }
                    for (var i = 0; i < trains.length; i++) {
                        createTrainAudio(i);
                    }
                }
                audio.active = !audio.active;
                playAndPauseAudio();
                if (elementSoundToggle != null) {
                    if (audio.active) {
                        elementSoundToggle.querySelector("i").textContent = "volume_up";
                        elementSoundToggle.dataset.tooltip = formatJSString(getString("generalXAreY"), getString("appScreenSound"), getString("generalOn"));
                    }
                    else {
                        elementSoundToggle.querySelector("i").textContent = "volume_off";
                        elementSoundToggle.dataset.tooltip = formatJSString(getString("generalXAreY"), getString("appScreenSound"), getString("generalOff"));
                    }
                }
            });
        }
        if (onlineGame.enabled) {
            elementTeamMode === null || elementTeamMode === void 0 ? void 0 : elementTeamMode.classList.add("hidden");
            elementTeamChat === null || elementTeamChat === void 0 ? void 0 : elementTeamChat.addEventListener("click", function () {
                commonOnOptionsMenuClick();
                document.querySelector("#chat").openChat();
            });
            elementNormalMode === null || elementNormalMode === void 0 ? void 0 : elementNormalMode.addEventListener("click", function () {
                commonOnOptionsMenuClick();
                showConfirmDialogLeaveMultiplayerMode();
            });
        }
        else {
            elementNormalMode === null || elementNormalMode === void 0 ? void 0 : elementNormalMode.classList.add("hidden");
            elementTeamChat === null || elementTeamChat === void 0 ? void 0 : elementTeamChat.classList.add("hidden");
            elementTeamMode === null || elementTeamMode === void 0 ? void 0 : elementTeamMode.addEventListener("click", function () {
                commonOnOptionsMenuClick();
                switchMode("multiplay");
            });
        }
        var settingsElem_1 = document.querySelector("#settings");
        var settingsElemApply = settingsElem_1.querySelector("#settings-apply");
        elementSettings === null || elementSettings === void 0 ? void 0 : elementSettings.addEventListener("click", function () {
            commonOnOptionsMenuClick();
            gui.settings = gui.sidebarRight = true;
            settingsElem_1.style.display = "block";
            drawOptionsMenu("invisible");
        });
        settingsElemApply.onclick = function () {
            gui.settings = gui.sidebarRight = false;
            settingsElem_1.scrollTo(0, 0);
            settingsElem_1.style.display = "";
            calcMenusAndBackground("settings-change");
            drawOptionsMenu("visible");
            if (getSetting("saveGame") && !onlineGame.enabled && !gui.demo) {
                animateWorker.postMessage({ k: "enable-save-game" });
            }
        };
        elementHelp === null || elementHelp === void 0 ? void 0 : elementHelp.addEventListener("click", function () {
            commonOnOptionsMenuClick();
            followLink("help", "_blank", LINK_STATE_INTERNAL_HTML);
        });
        elementInfoToggle === null || elementInfoToggle === void 0 ? void 0 : elementInfoToggle.addEventListener("click", function () {
            commonOnOptionsMenuClick();
            gui.infoOverlay = true;
            drawOptionsMenu("hide");
            drawInfoOverlayMenu("show");
        });
        var infoExit = document.querySelector("#canvas-info-exit");
        infoExit === null || infoExit === void 0 ? void 0 : infoExit.addEventListener("click", function () {
            gui.infoOverlay = false;
            drawOptionsMenu("show");
            drawInfoOverlayMenu("hide");
        });
        elementControlCenterTrains === null || elementControlCenterTrains === void 0 ? void 0 : elementControlCenterTrains.addEventListener("click", function () {
            commonOnOptionsMenuClick();
            gui.controlCenter = (!gui.controlCenter || controlCenter.showCarCenter) && !gui.konamiOverlay;
            controlCenter.showCarCenter = false;
            if (gui.infoOverlay) {
                drawInfoOverlayMenu("items-change");
            }
        });
        elementControlCenterCars === null || elementControlCenterCars === void 0 ? void 0 : elementControlCenterCars.addEventListener("click", function () {
            commonOnOptionsMenuClick();
            gui.controlCenter = (!gui.controlCenter || !controlCenter.showCarCenter) && !gui.konamiOverlay;
            controlCenter.showCarCenter = true;
            if (gui.infoOverlay) {
                drawInfoOverlayMenu("items-change");
            }
        });
        element3DViewToggle === null || element3DViewToggle === void 0 ? void 0 : element3DViewToggle.addEventListener("click", function () {
            commonOnOptionsMenuClick();
            gui.three = !gui.three;
            setGuiState("3d", gui.three);
            resetScale();
            resetTilt();
            set3DItems();
            calcMenusAndBackground("items-change");
            if (getSetting("classicUI") && !classicUI.trainSwitch.selectedTrainDisplay.visible && !gui.demo && !gui.three) {
                notify("#canvas-notifier", formatJSString(getString("appScreenTrainSelected", "."), getString(["appScreenTrainNames", trainParams.selected])), NOTIFICATION_PRIO_HIGH, 1250, null, null, client.y + menus.outerContainer.height);
            }
        });
        element3DViewNightToggle === null || element3DViewNightToggle === void 0 ? void 0 : element3DViewNightToggle.addEventListener("click", function () {
            commonOnOptionsMenuClick();
            three.night = !three.night;
            background3D.animateBehind(true);
            setGuiState("3d-night", three.night);
        });
        set3DItems();
    }
    menus.floating = false;
    menus.options.items = document.querySelectorAll("#canvas-options-inner > *:not(.hidden):not(.settings-hidden):not(.gui-hidden)");
    if (menus.options.items.length > 0 && !gui.demo) {
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
    menus.outerContainer.element.style.height = availableHeight + "px";
    if (menus.floating) {
        menus.outerContainer.element.style.background = "transparent";
        menus.outerContainer.element.style.top = client.y + background.height / client.devicePixelRatio + "px";
    }
    else {
        menus.outerContainer.element.style.background = gui.three ? "transparent" : "";
        menus.outerContainer.element.style.top = client.y + background.height / client.devicePixelRatio + "px";
    }
    menus.outerContainer.element.style.left = client.x + "px";
    if (state != "load" && gui.infoOverlay) {
        drawInfoOverlayMenu(state);
    }
    else if (state != "load") {
        drawOptionsMenu(state);
    }
    else if (state == "load") {
        var event_1 = new CustomEvent("moroway-app-after-calc-options-menu-load");
        document.dispatchEvent(event_1);
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
    itemToAdd.addEventListener("click", function () {
        commonOnOptionsMenuClick();
        onClickFunction();
    });
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
    if (!gui.controlCenter && !resized) {
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
function notInTransformerImage(x, y) {
    if (!getSetting("classicUI") || gui.controlCenter || gui.three || canvasGesture == undefined || contextGesture == undefined) {
        return true;
    }
    contextGesture.setTransform(client.zoomAndTilt.realScale, 0, 0, client.zoomAndTilt.realScale, (-(client.zoomAndTilt.realScale - 1) * canvasGesture.width) / 2 + client.zoomAndTilt.offsetX, (-(client.zoomAndTilt.realScale - 1) * canvasGesture.height) / 2 + client.zoomAndTilt.offsetY);
    if (classicUI.transformer.angle == undefined || classicUI.transformer.x == undefined || classicUI.transformer.y == undefined || classicUI.transformer.width == undefined || classicUI.transformer.height == undefined) {
        return true;
    }
    contextGesture.save();
    contextGesture.translate(classicUI.transformer.x + classicUI.transformer.width / 2, classicUI.transformer.y + classicUI.transformer.height / 2);
    contextGesture.rotate(classicUI.transformer.angle);
    contextGesture.beginPath();
    contextGesture.rect(-classicUI.transformer.width / 2, -classicUI.transformer.height / 2, classicUI.transformer.width, classicUI.transformer.height);
    if (contextGesture.isPointInPath(x, y)) {
        return false;
    }
    contextGesture.restore();
    return true;
}
function notInTransformerInput(x, y) {
    if (!getSetting("classicUI") || gui.controlCenter || gui.three || canvasGesture == undefined || contextGesture == undefined) {
        return true;
    }
    contextGesture.setTransform(client.zoomAndTilt.realScale, 0, 0, client.zoomAndTilt.realScale, (-(client.zoomAndTilt.realScale - 1) * canvasGesture.width) / 2 + client.zoomAndTilt.offsetX, (-(client.zoomAndTilt.realScale - 1) * canvasGesture.height) / 2 + client.zoomAndTilt.offsetY);
    if (classicUI.transformer.angle == undefined || classicUI.transformer.x == undefined || classicUI.transformer.y == undefined || classicUI.transformer.width == undefined || classicUI.transformer.height == undefined || classicUI.transformer.input.diffY == undefined || classicUI.transformer.input.angle == undefined || classicUI.transformer.input.width == undefined || classicUI.transformer.input.height == undefined) {
        return true;
    }
    contextGesture.save();
    contextGesture.translate(classicUI.transformer.x + classicUI.transformer.width / 2, classicUI.transformer.y + classicUI.transformer.height / 2);
    contextGesture.rotate(classicUI.transformer.angle);
    contextGesture.save();
    contextGesture.translate(0, -classicUI.transformer.input.diffY);
    contextGesture.rotate(classicUI.transformer.input.angle);
    contextGesture.beginPath();
    contextGesture.rect(-classicUI.transformer.input.width / 2, -classicUI.transformer.input.height / 2, classicUI.transformer.input.width, classicUI.transformer.input.height);
    if (contextGesture.isPointInPath(x, y)) {
        return false;
    }
    contextGesture.restore();
    if (classicUI.transformer.directionInput.diffX == undefined || classicUI.transformer.directionInput.diffY == undefined || classicUI.transformer.directionInput.width == undefined || classicUI.transformer.directionInput.height == undefined) {
        return true;
    }
    contextGesture.save();
    contextGesture.translate(classicUI.transformer.directionInput.diffX, classicUI.transformer.directionInput.diffY);
    contextGesture.beginPath();
    contextGesture.rect(-classicUI.transformer.directionInput.width / 2, -classicUI.transformer.directionInput.height / 2, classicUI.transformer.directionInput.width, classicUI.transformer.directionInput.height);
    if (contextGesture.isPointInPath(x, y)) {
        return false;
    }
    contextGesture.restore();
    contextGesture.restore();
    return true;
}
function notInTransformerTrainSwitch(x, y) {
    if (!getSetting("classicUI") || gui.controlCenter || gui.three || canvasGesture == undefined || contextGesture == undefined) {
        return true;
    }
    contextGesture.setTransform(client.zoomAndTilt.realScale, 0, 0, client.zoomAndTilt.realScale, (-(client.zoomAndTilt.realScale - 1) * canvasGesture.width) / 2 + client.zoomAndTilt.offsetX, (-(client.zoomAndTilt.realScale - 1) * canvasGesture.height) / 2 + client.zoomAndTilt.offsetY);
    if (classicUI.trainSwitch.selectedTrainDisplay.visible) {
        if (classicUI.trainSwitch.selectedTrainDisplay.x == undefined || classicUI.trainSwitch.selectedTrainDisplay.y == undefined || classicUI.trainSwitch.selectedTrainDisplay.width == undefined || classicUI.trainSwitch.selectedTrainDisplay.height == undefined) {
            return true;
        }
        contextGesture.save();
        contextGesture.beginPath();
        contextGesture.rect(classicUI.trainSwitch.selectedTrainDisplay.x, classicUI.trainSwitch.selectedTrainDisplay.y, classicUI.trainSwitch.selectedTrainDisplay.width, classicUI.trainSwitch.selectedTrainDisplay.height);
        if (contextGesture.isPointInPath(x, y)) {
            return false;
        }
        contextGesture.restore();
    }
    if (classicUI.trainSwitch.angle == undefined || classicUI.trainSwitch.x == undefined || classicUI.trainSwitch.y == undefined || classicUI.trainSwitch.width == undefined || classicUI.trainSwitch.height == undefined) {
        return true;
    }
    contextGesture.save();
    contextGesture.translate(classicUI.trainSwitch.x + classicUI.trainSwitch.width / 2, classicUI.trainSwitch.y + classicUI.trainSwitch.height / 2);
    contextGesture.rotate(classicUI.trainSwitch.angle);
    contextGesture.beginPath();
    contextGesture.rect(-classicUI.trainSwitch.width / 2, -classicUI.trainSwitch.height / 2, classicUI.trainSwitch.width, classicUI.trainSwitch.height);
    if (contextGesture.isPointInPath(x, y)) {
        return false;
    }
    contextGesture.restore();
    return true;
}
function onMouseMove(event) {
    client.chosenInputMethod = "mouse";
    hardware.mouse.isMoving = true;
    if (typeof movingTimeOut !== "undefined") {
        window.clearTimeout(movingTimeOut);
    }
    movingTimeOut = window.setTimeout(function () {
        hardware.mouse.isMoving = false;
    }, 5000);
    if (client.zoomAndTilt.realScale > 1 && ((notInTransformerInput(event.clientX * client.devicePixelRatio, event.clientY * client.devicePixelRatio) && hardware.mouse.isHold) || hardware.mouse.isDrag)) {
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
    hardware.mouse.isHold = event.button == 0 && !gui.controlCenter && !gui.konamiOverlay;
    controlCenter.mouse.hold = event.button == 0 && gui.controlCenter && !gui.konamiOverlay;
    hardware.mouse.isWheelHold = event.button == 1 && !gui.controlCenter && !gui.konamiOverlay;
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
    controlCenter.mouse.clickEvent = event.button == 0 && gui.controlCenter && !gui.konamiOverlay;
}
function onMouseEnter(event) {
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
        hardware.mouse.wheelScrolls = !gui.controlCenter && !gui.konamiOverlay;
        controlCenter.mouse.wheelScrolls = gui.controlCenter && !gui.konamiOverlay;
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
    if (!controlCenter.showCarCenter && gui.controlCenter && !gui.konamiOverlay && (client.zoomAndTilt.realScale == 1 || gui.three)) {
        controlCenter.showCarCenter = true;
        notify("#canvas-notifier", getString("appScreenCarControlCenterTitle"), NOTIFICATION_PRIO_LOW, 1000, null, null, client.y + menus.outerContainer.height);
    }
    else {
        gui.controlCenter = !gui.controlCenter && !gui.konamiOverlay && (client.zoomAndTilt.realScale == 1 || gui.three);
        if (gui.controlCenter) {
            notify("#canvas-notifier", getString("appScreenControlCenterTitle"), NOTIFICATION_PRIO_LOW, 1000, null, null, client.y + menus.outerContainer.height);
        }
        controlCenter.mouse.clickEvent = false;
        controlCenter.mouse.wheelScrolls = false;
    }
    if (gui.infoOverlay) {
        drawInfoOverlayMenu("items-change");
    }
}
function preventMouseZoomDuringLoad(event) {
    event.preventDefault();
}
function getTouchMove(event) {
    event.preventDefault();
    client.chosenInputMethod = "touch";
    if (event.touches.length == 1 && typeof client.zoomAndTilt.pinchHypot == "undefined" && !client.zoomAndTilt.pinchGestureIsTilt) {
        var deltaX = -5 * (hardware.mouse.moveX - event.touches[0].clientX * client.devicePixelRatio);
        var deltaY = -5 * (hardware.mouse.moveY - event.touches[0].clientY * client.devicePixelRatio);
        if (client.zoomAndTilt.realScale > 1 && Math.max(Math.abs(deltaX), Math.abs(deltaY)) > Math.min(canvas.width, canvas.height) / 30 && notInTransformerInput(event.touches[0].clientX * client.devicePixelRatio, event.touches[0].clientY * client.devicePixelRatio)) {
            resetGestures();
            getGesture({ type: "swipe", deltaX: deltaX / 4, deltaY: deltaY / 4 });
            if (typeof clickTimeOut !== "undefined") {
                window.clearTimeout(clickTimeOut);
                clickTimeOut = null;
            }
            hardware.mouse.isDrag = true;
        }
        hardware.mouse.moveX = event.touches[0].clientX * client.devicePixelRatio;
        hardware.mouse.moveY = event.touches[0].clientY * client.devicePixelRatio;
    }
    else if (event.touches.length == 2) {
        resetGestures();
        if (typeof clickTimeOut !== "undefined") {
            window.clearTimeout(clickTimeOut);
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
        if (typeof clickTimeOut !== "undefined") {
            window.clearTimeout(clickTimeOut);
            clickTimeOut = null;
        }
    }
}
function getTouchStart(event) {
    event.preventDefault();
    client.chosenInputMethod = "touch";
    var xTS = event.changedTouches[0].clientX * client.devicePixelRatio;
    var yTS = event.changedTouches[0].clientY * client.devicePixelRatio;
    if (event.touches.length == 1 && Math.max(hardware.mouse.moveX, xTS) < 1.1 * Math.min(hardware.mouse.moveX, xTS) && Math.max(hardware.mouse.moveY, yTS) < 1.1 * Math.min(hardware.mouse.moveY, yTS) && Date.now() - hardware.mouse.downTime < doubleTouchTime && Date.now() - hardware.mouse.upTime < doubleTouchTime && notInTransformerTrainSwitch(xTS, yTS) && notInTransformerInput(xTS, yTS)) {
        resetGestures();
        if (typeof clickTimeOut !== "undefined") {
            window.clearTimeout(clickTimeOut);
            clickTimeOut = null;
        }
        getGesture({ type: "doubletap", deltaX: xTS, deltaY: yTS });
    }
    else if (event.touches.length == 3) {
        resetGestures();
        if (typeof clickTimeOut !== "undefined") {
            window.clearTimeout(clickTimeOut);
            clickTimeOut = null;
        }
        controlCenter.mouse.prepare = true;
    }
    else {
        resetGestures();
        if (event.touches.length > 1 && typeof clickTimeOut !== "undefined") {
            window.clearTimeout(clickTimeOut);
            clickTimeOut = null;
        }
        if (event.touches.length == 2) {
            client.zoomAndTilt.pinchHypotDown = Math.hypot(event.touches[0].clientX - event.touches[1].clientX, event.touches[0].clientY - event.touches[1].clientY);
        }
        hardware.lastInputTouch = hardware.mouse.downTime = Date.now();
        hardware.mouse.moveX = hardware.mouse.downX = xTS;
        hardware.mouse.moveY = hardware.mouse.downY = yTS;
        hardware.mouse.isHold = event.touches.length == 1 && !gui.controlCenter && !gui.konamiOverlay;
        controlCenter.mouse.hold = event.touches.length == 1 && gui.controlCenter && !gui.konamiOverlay;
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
    controlCenter.mouse.clickEvent = gui.controlCenter && !gui.konamiOverlay;
    if (controlCenter.mouse.prepare && event.touches.length == 0) {
        if (!controlCenter.showCarCenter && gui.controlCenter && !gui.konamiOverlay && (client.zoomAndTilt.realScale == 1 || gui.three)) {
            controlCenter.showCarCenter = true;
            notify("#canvas-notifier", getString("appScreenCarControlCenterTitle"), NOTIFICATION_PRIO_LOW, 1000, null, null, client.y + menus.outerContainer.height);
            controlCenter.mouse.clickEvent = controlCenter.mouse.hold = controlCenter.mouse.prepare = false;
        }
        else {
            gui.controlCenter = !gui.controlCenter && !gui.konamiOverlay && (client.zoomAndTilt.realScale == 1 || gui.three);
            if (gui.controlCenter) {
                notify("#canvas-notifier", getString("appScreenControlCenterTitle"), NOTIFICATION_PRIO_LOW, 1000, null, null, client.y + menus.outerContainer.height);
            }
            controlCenter.mouse.clickEvent = controlCenter.mouse.hold = controlCenter.mouse.prepare = false;
        }
        if (gui.infoOverlay) {
            drawInfoOverlayMenu("items-change");
        }
    }
}
function getTouchCancel(event) {
    resetGestures();
    client.chosenInputMethod = "touch";
    hardware.keyboard.keysHold = [];
}
function onKeyDown(event) {
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
    if (event.key == "/" && event.target.tagName != "INPUT" && event.target.tagName != "TEXTAREA") {
        event.preventDefault();
        if (!gui.sidebarRight && !gui.textControl) {
            gui.textControl = true;
            if (gui.infoOverlay) {
                drawInfoOverlayMenu("hide-outer");
            }
            else {
                drawOptionsMenu("hide-outer");
            }
            textControl.elements.output.textContent = textControl.execute();
            textControl.elements.root.style.display = "block";
            textControl.elements.input.focus();
        }
    }
    if (event.ctrlKey && event.key == "0" && client.zoomAndTilt.realScale > 1) {
        event.preventDefault();
        getGesture({ type: "doubletap", deltaX: client.zoomAndTilt.pinchX, deltaY: client.zoomAndTilt.pinchY });
    }
    else if (event.ctrlKey && (event.key == "+" || event.key == "-")) {
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
    else if ((event.key == "ArrowUp" && (konamiState === 0 || konamiState == 1)) || (event.key == "ArrowDown" && (konamiState == 2 || konamiState == 3)) || (event.key == "ArrowLeft" && (konamiState == 4 || konamiState == 6)) || (event.key == "ArrowRight" && (konamiState == 5 || konamiState == 7)) || (event.key == "b" && konamiState == 8)) {
        if (typeof konamiTimeOut !== "undefined") {
            window.clearTimeout(konamiTimeOut);
        }
        konamiState++;
        konamiTimeOut = window.setTimeout(function () {
            konamiState = 0;
        }, 500);
    }
    else if (event.key == "a" && konamiState == 9) {
        if (typeof konamiTimeOut !== "undefined") {
            window.clearTimeout(konamiTimeOut);
        }
        konamiState = -1;
        gui.konamiOverlay = true;
        drawBackground();
        background3D.animateBehind(true);
    }
    else if (konamiState < 0 && (event.key == "Enter" || event.key == " " || event.key == "a" || event.key == "b")) {
        konamiState = konamiState > -2 ? --konamiState : 0;
        gui.konamiOverlay = false;
        if (konamiState == 0) {
            drawBackground();
            background3D.animateBehind(true);
        }
    }
    else if (konamiState > 0) {
        if (typeof konamiTimeOut !== "undefined") {
            window.clearTimeout(konamiTimeOut);
        }
        konamiState = 0;
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
    if (event.ctrlKey && (event.key == "+" || event.key == "-" || event.key == "0")) {
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
    classicUI.transformer.input.width = classicUI.transformer.input.height = fac * classicUI.transformer.width;
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
    classicUI.transformer.input.diffY = classicUI.transformer.height / 6;
    classicUI.transformer.directionInput.diffX = classicUI.transformer.width * 0.46 - classicUI.transformer.directionInput.width;
    classicUI.transformer.directionInput.diffY = classicUI.transformer.height * 0.46 - classicUI.transformer.directionInput.height;
    context.textBaseline = "middle";
    var longestName = 0;
    for (var i = 1; i < trains.length; i++) {
        if (getString(["appScreenTrainNames", i]).length > getString(["appScreenTrainNames", longestName]).length) {
            longestName = i;
        }
    }
    classicUI.trainSwitch.selectedTrainDisplay.fontFamily = "sans-serif";
    var heightMultiply = 1.6;
    var widthMultiply = 1.2;
    var wantedWidth = ((menus.small ? 0.35 : 0.9) * background.width) / 4 / widthMultiply;
    var tempFont = measureFontSize(getString(["appScreenTrainNames", longestName]), classicUI.trainSwitch.selectedTrainDisplay.fontFamily, wantedWidth / getString(["appScreenTrainNames", longestName]).length, wantedWidth, 3, background.width * 0.004);
    var tempFontSize = menus.small ? getFontSize(tempFont, "px") : Math.min((0.9 * menus.outerContainer.height * client.devicePixelRatio) / heightMultiply, getFontSize(tempFont, "px"));
    var currentSelectedTrainDisplayVisible = getSetting("alwaysShowSelectedTrain") && tempFontSize >= 7;
    if (classicUI.trainSwitch.selectedTrainDisplay.visible != currentSelectedTrainDisplayVisible) {
        classicUI.trainSwitch.selectedTrainDisplay.visible = currentSelectedTrainDisplayVisible;
        if (gui.infoOverlay) {
            drawInfoOverlayMenu("items-change");
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
    classicUI.switches.radius = 0.02 * background.width;
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
        car.x *= background.width / oldBg.width;
        car.y *= background.height / oldBg.height;
        car.width *= background.width / oldBg.width;
        car.height *= background.height / oldBg.height;
    });
}
function requestResize() {
    function resize() {
        resized = true;
        if (onlineGame.enabled) {
            if (onlineGame.resizedTimeout != undefined && onlineGame.resizedTimeout != null) {
                window.clearTimeout(onlineGame.resizedTimeout);
            }
            onlineGame.resized = true;
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
        background3D.behind.width = client.width * client.devicePixelRatio;
        background3D.behind.height = client.height * client.devicePixelRatio;
        background3D.behind.style.width = client.width + "px";
        background3D.behind.style.height = client.height + "px";
        background3D.behind.style.left = "0px";
        background3D.behind.style.top = "0px";
        background3D.animateBehind(true);
        animateWorker.postMessage({ k: "resize", background: background, oldBackground: oldBackground });
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
    if (resizeTimeout !== undefined && resizeTimeout !== null) {
        window.clearTimeout(resizeTimeout);
    }
    if (resized) {
        resizeTimeout = window.setTimeout(requestResize, 10);
    }
    else {
        resize();
        resizeTimeout = window.setTimeout(resize, 50);
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
                    notify("#canvas-notifier", formatJSString(getString("appScreenObjectHasCrashed", "."), getString(["appScreenCarNames", input1]), getString(["appScreenCarNames", i])), NOTIFICATION_PRIO_DEFAULT, 2000, null, null, client.y + menus.outerContainer.height);
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
            var currentObject = i < 0 ? trains[input1] : trains[input1].cars[i];
            context.save();
            context.translate(currentObject.x, currentObject.y);
            context.rotate(currentObject.displayAngle);
            var flickerDuration = 3;
            if (frameNo <= trains[input1].lastDirectionChange + flickerDuration * 6 && !trains[input1].move && Math.random() > 0.7 && (i < 0 || i == trains[input1].cars.length - 1)) {
                context.save();
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
            else if (frameNo <= trains[input1].lastDirectionChange + flickerDuration * 3 && (frameNo <= trains[input1].lastDirectionChange + flickerDuration || frameNo > trains[input1].lastDirectionChange + flickerDuration * 2)) {
                drawImage(pics[currentObject.src], (-currentObject.width * 1.01) / 2, (-currentObject.height * 1.01) / 2, currentObject.width * 1.01, currentObject.height * 1.01);
            }
            else {
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
                    if (typeof clickTimeOut !== "undefined") {
                        window.clearTimeout(clickTimeOut);
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
                    if (typeof clickTimeOut !== "undefined") {
                        window.clearTimeout(clickTimeOut);
                        clickTimeOut = null;
                    }
                    clickTimeOut = window.setTimeout(function () {
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
            var arrLen = carParams.wayNo * 20;
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
                        if (gui.demo) {
                            window.sessionStorage.removeItem("demoCars");
                            window.sessionStorage.removeItem("demoCarParams");
                            window.sessionStorage.removeItem("demoBg");
                        }
                        else {
                            notify("#canvas-notifier", getString("appScreenCarAutoModeCrash", "."), NOTIFICATION_PRIO_HIGH, 5000, null, null, client.height);
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
                if (gui.demo) {
                    window.sessionStorage.removeItem("demoCars");
                    window.sessionStorage.removeItem("demoCarParams");
                    window.sessionStorage.removeItem("demoBg");
                }
                else {
                    notify("#canvas-notifier", getString("appScreenCarAutoModeCrash", "."), NOTIFICATION_PRIO_HIGH, 5000, null, null, client.height);
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
        if (!onlineGame.stop) {
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
                    if (typeof clickTimeOut !== "undefined") {
                        window.clearTimeout(clickTimeOut);
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
                    if (typeof clickTimeOut !== "undefined") {
                        window.clearTimeout(clickTimeOut);
                        clickTimeOut = null;
                    }
                    clickTimeOut = window.setTimeout(function () {
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
            context.closePath();
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
                        if (typeof clickTimeOut !== "undefined") {
                            window.clearTimeout(clickTimeOut);
                            clickTimeOut = null;
                        }
                        clickTimeOut = window.setTimeout(function () {
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
            context.closePath();
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
        }
        else {
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
        contextForeground.closePath();
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
    var startTime = Date.now();
    var lastClickDoubleClick = hardware.mouse.lastClickDoubleClick;
    var wasHold = hardware.mouse.isHold;
    frameNo++;
    if (frameNo % 1000000 === 0) {
        notify("#canvas-notifier", formatJSString(getString("appScreenAMillionFrames", "."), frameNo / 1000000), NOTIFICATION_PRIO_DEFAULT, 5000, null, null, client.y + menus.outerContainer.height);
    }
    if (client.zoomAndTilt.realScale != client.zoomAndTilt.realScaleOld || client.zoomAndTilt.offsetX != client.zoomAndTilt.offsetXOld || client.zoomAndTilt.offsetY != client.zoomAndTilt.offsetYOld) {
        client.zoomAndTilt.realScaleOld = client.zoomAndTilt.realScale;
        client.zoomAndTilt.offsetXOld = client.zoomAndTilt.offsetX;
        client.zoomAndTilt.offsetYOld = client.zoomAndTilt.offsetY;
        drawBackground();
        if (client.zoomAndTilt.realScale != 1 && gui.infoOverlay) {
            drawInfoOverlayMenu("hide-outer");
        }
        else if (client.zoomAndTilt.realScale != 1) {
            drawOptionsMenu("hide-outer");
        }
        else if (gui.infoOverlay && !gui.textControl) {
            drawInfoOverlayMenu("show");
        }
        else if (!gui.textControl) {
            drawOptionsMenu("show");
        }
    }
    hardware.mouse.cursor = hardware.mouse.isDrag ? "move" : "default";
    if (gui.three) {
        /////THREE.JS/////
        canvasGesture.style.display = "none";
        canvasBackground.style.display = "none";
        canvas.style.display = "none";
        canvasSemiForeground.style.display = "none";
        contextForeground.clearRect(0, 0, canvasForeground.width, canvasForeground.height);
        contextForeground.setTransform(1, 0, 0, 1, 0, 0);
        background3D.behind.style.display = "block";
        if (background3D.behindClone) {
            background3D.behindClone.style.display = "block";
        }
        three.renderer.domElement.style.display = "block";
        /////THREE.JS/Background/////
        background3D.animateBehind();
    }
    else {
        canvasGesture.style.display = "";
        canvasBackground.style.display = "";
        canvas.style.display = "";
        canvasSemiForeground.style.display = "";
        canvasForeground.style.display = "";
        background3D.behind.style.display = "none";
        if (background3D.behindClone) {
            background3D.behindClone.style.display = "none";
        }
        three.renderer.domElement.style.display = "none";
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.setTransform(client.zoomAndTilt.realScale, 0, 0, client.zoomAndTilt.realScale, (-(client.zoomAndTilt.realScale - 1) * canvas.width) / 2 + client.zoomAndTilt.offsetX, (-(client.zoomAndTilt.realScale - 1) * canvas.height) / 2 + client.zoomAndTilt.offsetY);
        contextForeground.clearRect(0, 0, canvasForeground.width, canvasForeground.height);
        contextForeground.setTransform(client.zoomAndTilt.realScale, 0, 0, client.zoomAndTilt.realScale, (-(client.zoomAndTilt.realScale - 1) * canvasForeground.width) / 2 + client.zoomAndTilt.offsetX, (-(client.zoomAndTilt.realScale - 1) * canvasForeground.height) / 2 + client.zoomAndTilt.offsetY);
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
    calcCars();
    if (gui.three) {
        /////THREE.JS/////
        trains.forEach(function (train, i) {
            var flickerDuration = 3;
            if (trains3D[i] && trains3D[i].mesh) {
                trains3D[i].mesh.position.set((three.calcScale() * (train.x - background.x - background.width / 2)) / background.width, three.calcScale() * (-(train.y - background.y - background.height / 2) / background.width) + three.calcPositionY(), trains3D[i].positionZ);
                if (frameNo <= train.lastDirectionChange + flickerDuration * 3) {
                    if (frameNo <= train.lastDirectionChange + flickerDuration || frameNo > train.lastDirectionChange + flickerDuration * 2) {
                        trains3D[i].mesh.position.z += (trains3D[i].positionZ / 5) * Math.random();
                    }
                    else {
                        trains3D[i].mesh.position.z -= (trains3D[i].positionZ / 5) * Math.random();
                    }
                }
                /* UPDATE: v9.1.5 */
                trains3D[i].mesh.visible = true;
                /* END UPDATE: v9.1.5 */
                setMaterialTransparent(trains3D[i].mesh, train.opacity);
                trains3D[i].mesh.rotation.z = -train.displayAngle;
            }
            train.cars.forEach(function (car, j) {
                if (trains3D[i].cars[j] && trains3D[i].cars[j].mesh) {
                    trains3D[i].cars[j].mesh.position.set(three.calcScale() * ((car.x - background.x - background.width / 2) / background.width), three.calcScale() * (-(car.y - background.y - background.height / 2) / background.width) + three.calcPositionY(), trains3D[i].cars[j].positionZ);
                    if (frameNo <= train.lastDirectionChange + flickerDuration * 3) {
                        if (frameNo <= train.lastDirectionChange + flickerDuration || frameNo > train.lastDirectionChange + flickerDuration * 2) {
                            trains3D[i].cars[j].mesh.position.z += (trains3D[i].cars[j].mesh.position.z / 5) * Math.random();
                        }
                        else {
                            trains3D[i].cars[j].mesh.position.z -= (trains3D[i].cars[j].mesh.position.z / 5) * Math.random();
                        }
                    }
                    /* UPDATE: v9.1.5 */
                    trains3D[i].cars[j].mesh.visible = true;
                    /* END UPDATE: v9.1.5 */
                    setMaterialTransparent(trains3D[i].cars[j].mesh, car.opacity);
                    trains3D[i].cars[j].mesh.rotation.z = -car.displayAngle;
                }
            });
        });
        cars.forEach(function (car, i) {
            if (cars3D[i] && cars3D[i].mesh) {
                cars3D[i].mesh.position.set(three.calcScale() * ((car.x - background.width / 2) / background.width), three.calcScale() * (-(car.y - background.height / 2) / background.width) + three.calcPositionY(), cars3D[i].positionZ);
                cars3D[i].mesh.rotation.z = -car.displayAngle;
            }
            if (!gui.demo && cars3D[i] && cars3D[i].meshParkingLot) {
                cars3D[i].meshParkingLot.visible = !carParams.init && ((carParams.autoModeOff && cars[i].cType == "normal" && !cars[i].move) || (!carParams.autoModeOff && !carParams.autoModeRuns && !carParams.isBackToRoot));
                cars3D[i].meshParkingLot.material.color.setHex(carParams.autoModeOff ? cars[i].hexColor : "0xffeeef");
            }
        });
        if (gui.demo) {
            var rotation = (Math.random() / 500) * (three.demoRotationSpeedFac / 100);
            three.scene.rotation.x += three.demoRotationFacX * rotation;
            three.scene.rotation.y += three.demoRotationFacY * rotation;
        }
        else {
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
                    if (switches[key][currentKey].lastStateChange != undefined && frameNo - switches[key][currentKey].lastStateChange < classicUI.switches.showDuration) {
                        var fadeProgress = (frameNo - switches[key][currentKey].lastStateChange) / classicUI.switches.showDuration;
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
                    if (switches[key][currentKey].lastStateChange != undefined && frameNo - switches[key][currentKey].lastStateChange < classicUI.switches.showDuration) {
                        transparent = false;
                    }
                    switches3D[key][currentKey].circleMesh.material.color.setHex(hex);
                    switches3D[key][currentKey].circleMesh.material.transparent = transparent;
                    switches3D[key][currentKey].circleMeshSmall.material.color.setHex(hexSquare);
                    var scale = three.calcScale();
                    switches3D[key][currentKey].squareMeshHighlight.material.color.setHex(hexSquare);
                    switches3D[key][currentKey].squareMeshHighlight.rotation.y = -angle - Math.PI / 4;
                    switches3D[key][currentKey].squareMeshHighlight.position.set(scale * ((switches[key][currentKey].x - background.width / 2) / background.width + (switches3D[key][currentKey].squareMeshHighlight.geometry.parameters.width / 2) * Math.cos(switches3D[key][currentKey].squareMeshHighlight.rotation.y)), scale * (-(switches[key][currentKey].y - background.height / 2) / background.width + (switches3D[key][currentKey].squareMeshHighlight.geometry.parameters.width / 2) * Math.sin(switches3D[key][currentKey].squareMeshHighlight.rotation.y)) + three.calcPositionY(), switches3D[key][currentKey].squareMeshHighlight.geometry.parameters.depth / 2);
                    switches3D[key][currentKey].squareMeshNormal.rotation.y = -switches[key][currentKey].angles.normal - Math.PI / 4;
                    switches3D[key][currentKey].squareMeshNormal.position.set(scale * ((switches[key][currentKey].x - background.width / 2) / background.width + (switches3D[key][currentKey].squareMeshNormal.geometry.parameters.width / 2) * Math.cos(switches3D[key][currentKey].squareMeshNormal.rotation.y)), scale * (-(switches[key][currentKey].y - background.height / 2) / background.width + (switches3D[key][currentKey].squareMeshNormal.geometry.parameters.width / 2) * Math.sin(switches3D[key][currentKey].squareMeshNormal.rotation.y)) + three.calcPositionY(), switches3D[key][currentKey].squareMeshNormal.geometry.parameters.depth / 2);
                    switches3D[key][currentKey].squareMeshTurned.rotation.y = -switches[key][currentKey].angles.turned - Math.PI / 4;
                    switches3D[key][currentKey].squareMeshTurned.position.set(scale * ((switches[key][currentKey].x - background.width / 2) / background.width + (switches3D[key][currentKey].squareMeshTurned.geometry.parameters.width / 2) * Math.cos(switches3D[key][currentKey].squareMeshTurned.rotation.y)), scale * (-(switches[key][currentKey].y - background.height / 2) / background.width + (switches3D[key][currentKey].squareMeshTurned.geometry.parameters.width / 2) * Math.sin(switches3D[key][currentKey].squareMeshTurned.rotation.y)) + three.calcPositionY(), switches3D[key][currentKey].squareMeshTurned.geometry.parameters.depth / 2);
                });
            });
            if (!gui.controlCenter) {
                var raycasterMove = new THREE.Raycaster();
                var mouseMove = new THREE.Vector2();
                mouseMove.x = (hardware.mouse.moveX / client.devicePixelRatio / three.renderer.domElement.clientWidth) * 2 - 1;
                mouseMove.y = (-hardware.mouse.moveY / client.devicePixelRatio / three.renderer.domElement.clientHeight) * 2 + 1;
                raycasterMove.setFromCamera(mouseMove, three.camera);
                var raycasterDown = new THREE.Raycaster();
                var mouseDown = new THREE.Vector2();
                mouseDown.x = (hardware.mouse.downX / client.devicePixelRatio / three.renderer.domElement.clientWidth) * 2 - 1;
                mouseDown.y = (-hardware.mouse.downY / client.devicePixelRatio / three.renderer.domElement.clientHeight) * 2 + 1;
                raycasterDown.setFromCamera(mouseDown, three.camera);
                var raycasterUp = new THREE.Raycaster();
                var mouseUp = new THREE.Vector2();
                mouseUp.x = (hardware.mouse.upX / client.devicePixelRatio / three.renderer.domElement.clientWidth) * 2 - 1;
                mouseUp.y = (-hardware.mouse.upY / client.devicePixelRatio / three.renderer.domElement.clientHeight) * 2 + 1;
                raycasterUp.setFromCamera(mouseUp, three.camera);
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
                    if (typeof clickTimeOut !== "undefined") {
                        window.clearTimeout(clickTimeOut);
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
        three.renderer.render(three.scene, three.camera);
    }
    else {
        /////CLASSIC UI/////
        var classicUISavedMouseHold;
        var classicUISavedMouseDrag;
        var classicUISavedWheelScroll;
        context.save();
        context.beginPath();
        context.rect(background.x, background.y, background.width, background.height);
        var moveInPath = context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY);
        var wheelInPath = context.isPointInPath(hardware.mouse.wheelX, hardware.mouse.wheelY);
        context.restore();
        if (!moveInPath || (getSetting("classicUI") && !gui.controlCenter && !notInTransformerImage(hardware.mouse.moveX, hardware.mouse.moveY))) {
            classicUISavedMouseHold = hardware.mouse.isHold;
            classicUISavedMouseDrag = hardware.mouse.isDrag;
            hardware.mouse.isHold = false;
            hardware.mouse.isDrag = false;
        }
        if (!wheelInPath || (getSetting("classicUI") && !gui.controlCenter && !notInTransformerImage(hardware.mouse.wheelX, hardware.mouse.wheelY))) {
            classicUISavedWheelScroll = hardware.mouse.wheelScrolls;
            hardware.mouse.wheelScrolls = false;
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
        if (getSetting("burnTheTaxOffice")) {
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
                contextForeground.closePath();
                contextForeground.fill();
                contextForeground.restore();
                contextForeground.save();
                contextForeground.fillStyle = taxOffice.smoke[i].color;
                contextForeground.translate(taxOffice.smoke[i].x, taxOffice.smoke[i].y);
                contextForeground.beginPath();
                contextForeground.arc(0, 0, taxOffice.smoke[i].size, 0, 2 * Math.PI);
                contextForeground.closePath();
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
        if (getSetting("classicUI") && !gui.controlCenter && !gui.demo) {
            if (classicUISavedMouseHold != undefined && classicUISavedMouseDrag != undefined) {
                hardware.mouse.isHold = classicUISavedMouseHold;
                hardware.mouse.isDrag = classicUISavedMouseDrag;
                hardware.mouse.cursor = "default";
            }
            if (classicUISavedWheelScroll != undefined) {
                hardware.mouse.wheelScrolls = classicUISavedWheelScroll;
            }
            if (gui.settings) {
                calcClassicUIElements();
            }
            var step = Math.PI / 30;
            if (trains[trainParams.selected].accelerationSpeed > 0) {
                if (classicUI.transformer.input.angle < (trains[trainParams.selected].speedInPercent / 100) * classicUI.transformer.input.maxAngle) {
                    classicUI.transformer.input.angle += step;
                    if (classicUI.transformer.input.angle >= (trains[trainParams.selected].speedInPercent / 100) * classicUI.transformer.input.maxAngle) {
                        classicUI.transformer.input.angle = (trains[trainParams.selected].speedInPercent / 100) * classicUI.transformer.input.maxAngle;
                    }
                }
                else {
                    classicUI.transformer.input.angle -= step;
                    if (classicUI.transformer.input.angle <= (trains[trainParams.selected].speedInPercent / 100) * classicUI.transformer.input.maxAngle) {
                        classicUI.transformer.input.angle = (trains[trainParams.selected].speedInPercent / 100) * classicUI.transformer.input.maxAngle;
                    }
                }
            }
            else {
                if (classicUI.transformer.input.angle > 0) {
                    classicUI.transformer.input.angle -= step;
                    if (classicUI.transformer.input.angle < 0) {
                        classicUI.transformer.input.angle = 0;
                    }
                }
            }
            var wasInSwitchPath = false;
            if (classicUI.trainSwitch.selectedTrainDisplay.visible) {
                contextForeground.save();
                contextForeground.beginPath();
                contextForeground.rect(classicUI.trainSwitch.selectedTrainDisplay.x, classicUI.trainSwitch.selectedTrainDisplay.y, classicUI.trainSwitch.selectedTrainDisplay.width, classicUI.trainSwitch.selectedTrainDisplay.height);
                if (((contextForeground.isPointInPath(hardware.mouse.wheelX, hardware.mouse.wheelY) && hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls) || contextForeground.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY)) && !hardware.mouse.isDrag) {
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
            contextForeground.beginPath();
            contextForeground.rect(-classicUI.trainSwitch.width / 2, -classicUI.trainSwitch.height / 2, classicUI.trainSwitch.width, classicUI.trainSwitch.height);
            if ((wasInSwitchPath || (contextForeground.isPointInPath(hardware.mouse.wheelX, hardware.mouse.wheelY) && hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls) || contextForeground.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY)) && !hardware.mouse.isDrag) {
                hardware.mouse.cursor = "pointer";
                if (typeof movingTimeOut !== "undefined") {
                    window.clearTimeout(movingTimeOut);
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
                        notify("#canvas-notifier", formatJSString(getString("appScreenTrainSelected", "."), getString(["appScreenTrainNames", trainParams.selected])), NOTIFICATION_PRIO_HIGH, 1250, null, null, client.height, NOTIFICATION_CHANNEL_CLASSIC_UI_TRAIN_SWITCH);
                    }
                }
            }
            contextForeground.restore();
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
                        drawInfoOverlayMenu("items-change");
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
                    contextForeground.rotate(-classicUI.transformer.directionInput.angle);
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
                contextForeground.beginPath();
                contextForeground.rect(-classicUI.transformer.directionInput.width / 2, -classicUI.transformer.directionInput.height / 2, classicUI.transformer.directionInput.width, classicUI.transformer.directionInput.height);
                if (contextForeground.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && !trains[trainParams.selected].move && !hardware.mouse.isDrag) {
                    if (typeof movingTimeOut !== "undefined") {
                        window.clearTimeout(movingTimeOut);
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
                        drawInfoOverlayMenu("items-change");
                    }
                }
            }
            contextForeground.save();
            contextForeground.translate(0, -classicUI.transformer.input.diffY);
            contextForeground.rotate(classicUI.transformer.input.angle);
            drawImage(pics[classicUI.transformer.input.src], -classicUI.transformer.input.width / 2, -classicUI.transformer.input.height / 2, classicUI.transformer.input.width, classicUI.transformer.input.height, contextForeground);
            if (gui.infoOverlay && (menus.infoOverlay.focus == undefined || menus.infoOverlay.focus == 6)) {
                contextForeground.save();
                if (trains[trainParams.selected].crash) {
                    contextForeground.globalAlpha = 0.5;
                }
                contextForeground.rotate(-classicUI.transformer.angle);
                contextForeground.rotate(-classicUI.transformer.input.angle);
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
                contextForeground.fillRect(-classicUI.transformer.input.width / 2, classicUI.transformer.input.height / 2, 6, 6);
                contextForeground.fillRect(-3, -3, 6, 6);
            }
            contextForeground.beginPath();
            contextForeground.rect(-classicUI.transformer.input.width / 2, -classicUI.transformer.input.height / 2, classicUI.transformer.input.width, classicUI.transformer.input.height);
            if (contextForeground.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && !trains[trainParams.selected].crash && !hardware.mouse.isDrag) {
                hardware.mouse.cursor = "pointer";
            }
            if ((contextForeground.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && hardware.mouse.isHold) || (contextForeground.isPointInPath(hardware.mouse.wheelX, hardware.mouse.wheelY) && hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls)) {
                contextForeground.restore();
                contextForeground.restore();
                if (typeof movingTimeOut !== "undefined") {
                    window.clearTimeout(movingTimeOut);
                }
                var x = classicUI.transformer.x + classicUI.transformer.width / 2 + classicUI.transformer.input.diffY * Math.sin(classicUI.transformer.angle);
                var y = classicUI.transformer.y + classicUI.transformer.height / 2 - classicUI.transformer.input.diffY * Math.cos(classicUI.transformer.angle);
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
                            angle = classicUI.transformer.input.angle * (hardware.mouse.wheelScrollY < 0 ? 1.1 : 0.9);
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
                        classicUI.transformer.input.angle = angle >= 0 ? (angle <= classicUI.transformer.input.maxAngle ? angle : classicUI.transformer.input.maxAngle) : 0;
                        var cAngle = (classicUI.transformer.input.angle / classicUI.transformer.input.maxAngle) * 100;
                        if (hardware.mouse.wheelScrollY < 0 && hardware.mouse.wheelScrolls && !(adjustScaleY(hardware.mouse.wheelY) > y && adjustScaleX(hardware.mouse.wheelX) < x) && cAngle < classicUI.transformer.input.minAngle) {
                            cAngle = classicUI.transformer.input.minAngle;
                            classicUI.transformer.input.angle = (cAngle * classicUI.transformer.input.maxAngle) / 100;
                        }
                        trainActions.setSpeed(trainParams.selected, cAngle);
                        if (cAngle == 0) {
                            hardware.mouse.isHold = false;
                        }
                    }
                    else {
                        hardware.mouse.isHold = false;
                    }
                }
                else {
                    classicUI.transformer.input.angle = 0;
                    trains[trainParams.selected].speedInPercent = 0;
                    trains[trainParams.selected].move = false;
                    hardware.mouse.isHold = false;
                }
                if (classicUI.transformer.input.angle > 0 && classicUI.transformer.input.angle < classicUI.transformer.input.maxAngle && !hardware.mouse.isDrag) {
                    hardware.mouse.cursor = "grabbing";
                }
            }
            else {
                contextForeground.restore();
                contextForeground.restore();
            }
            if (APP_DATA.debug && debug.paint) {
                contextForeground.save();
                var x = classicUI.transformer.x + classicUI.transformer.width / 2 + classicUI.transformer.input.diffY * Math.sin(classicUI.transformer.angle);
                var y = classicUI.transformer.y + classicUI.transformer.height / 2 - classicUI.transformer.input.diffY * Math.cos(classicUI.transformer.angle);
                contextForeground.fillStyle = "red";
                contextForeground.fillRect(x - 2, y - 2, 4, 4);
                var a = -(classicUI.transformer.input.diffY - classicUI.transformer.input.height / 2);
                var b = classicUI.transformer.width / 2 - (classicUI.transformer.width / 2 - classicUI.transformer.input.width / 2);
                var c = classicUI.transformer.input.diffY + classicUI.transformer.input.height / 2;
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
                var x = x1 + classicUI.transformer.input.diffY * Math.sin(classicUI.transformer.angle);
                var y = y1 - classicUI.transformer.input.diffY * Math.cos(classicUI.transformer.angle);
                contextForeground.beginPath();
                contextForeground.strokeStyle = "black";
                contextForeground.arc(x, y, classicUI.transformer.input.width / 2, Math.PI, Math.PI + classicUI.transformer.input.maxAngle, false);
                contextForeground.stroke();
                contextForeground.beginPath();
                contextForeground.strokeStyle = "red";
                contextForeground.arc(x, y, classicUI.transformer.input.width / 2, Math.PI, Math.PI + (classicUI.transformer.input.minAngle * classicUI.transformer.input.maxAngle) / 100, false);
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
                contextForeground.arc(background.x + switches[key][side].x, background.y + switches[key][side].y, classicUI.switches.radius, 0, 2 * Math.PI);
                if (!wasPointer && contextForeground.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && !hardware.mouse.isDrag) {
                    hardware.mouse.cursor = "pointer";
                }
                contextForeground.closePath();
                contextForeground.restore();
            });
        });
        Object.keys(switches).forEach(function (key) {
            Object.keys(switches[key]).forEach(function (side) {
                contextForeground.save();
                contextForeground.beginPath();
                contextForeground.arc(background.x + switches[key][side].x, background.y + switches[key][side].y, classicUI.switches.radius, 0, 2 * Math.PI);
                if (hardware.mouse.isHold && contextForeground.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && !inTrain) {
                    if (typeof clickTimeOut !== "undefined") {
                        window.clearTimeout(clickTimeOut);
                        clickTimeOut = null;
                    }
                    clickTimeOut = window.setTimeout(function () {
                        clickTimeOut = null;
                        hardware.mouse.isHold = false;
                        switchActions.turn(key, side);
                    }, hardware.lastInputTouch > hardware.lastInputMouse ? doubleTouchWaitTime : 0);
                    contextForeground.restore();
                }
                else if (!hardware.mouse.isHold && switches[key][side].lastStateChange != undefined && frameNo - switches[key][side].lastStateChange < classicUI.switches.showDuration) {
                    contextForeground.fillStyle = switches[key][side].turned ? "rgba(144, 255, 144,1)" : "rgba(255,0,0,1)";
                    contextForeground.closePath();
                    contextForeground.fill();
                    contextForeground.restore();
                }
                else if (!hardware.mouse.isHold && switches[key][side].lastStateChange != undefined && frameNo - switches[key][side].lastStateChange < classicUI.switches.showDurationFade) {
                    contextForeground.closePath();
                    contextForeground.restore();
                    contextForeground.save();
                    contextForeground.beginPath();
                    var fac = 1 - (frameNo - classicUI.switches.showDuration - switches[key][side].lastStateChange) / (classicUI.switches.showDurationFade - classicUI.switches.showDuration);
                    contextForeground.fillStyle = switches[key][side].turned ? "rgba(144, 255, 144," + fac + ")" : "rgba(255,0,0," + fac + ")";
                    contextForeground.arc(background.x + switches[key][side].x, background.y + switches[key][side].y, fac * classicUI.switches.radius, 0, 2 * Math.PI);
                    contextForeground.closePath();
                    contextForeground.fill();
                    contextForeground.restore();
                }
                else if ((client.chosenInputMethod == "mouse" && !wasPointer && !hardware.mouse.isHold && (switches[key][side].lastStateChange == undefined || frameNo - switches[key][side].lastStateChange > classicUI.switches.showDurationEnd) && contextForeground.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY)) || (hardware.mouse.isHold && hardware.mouse.cursor == "default" && (clickTimeOut === null || clickTimeOut === undefined))) {
                    contextForeground.closePath();
                    contextForeground.restore();
                    contextForeground.save();
                    contextForeground.lineWidth = 5;
                    contextForeground.translate(background.x + switches[key][side].x, background.y + switches[key][side].y);
                    if (switches[key][side].turned) {
                        switchesLocate(switches[key][side].angles.normal, 0.9 * classicUI.switches.radius, "rgba(255, 235, 235, 1)");
                        switchesLocate(switches[key][side].angles.turned, 1.25 * classicUI.switches.radius, "rgba(170, 255, 170,1)");
                    }
                    else {
                        switchesLocate(switches[key][side].angles.turned, 0.9 * classicUI.switches.radius, "rgba(235, 255, 235, 1)");
                        switchesLocate(switches[key][side].angles.normal, 1.25 * classicUI.switches.radius, "rgba(255,40,40,1)");
                    }
                    contextForeground.save();
                    contextForeground.beginPath();
                    contextForeground.lineWidth = 5;
                    contextForeground.arc(0, 0, 0.2 * classicUI.switches.radius + (konamiState < 0 ? Math.random() * 0.3 * classicUI.switches.radius : 0), 0, 2 * Math.PI);
                    contextForeground.closePath();
                    contextForeground.fillStyle = switches[key][side].turned ? "rgba(144, 238, 144,1)" : "rgba(255,0,0,1)";
                    contextForeground.fill();
                    contextForeground.restore();
                    contextForeground.restore();
                    if (APP_DATA.debug && debug.paint) {
                        contextForeground.save();
                        contextForeground.beginPath();
                        contextForeground.lineWidth = 1;
                        contextForeground.arc(background.x + switches[key][side].x, background.y + switches[key][side].y, classicUI.switches.radius, 0, 2 * Math.PI);
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
                    contextForeground.closePath();
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
            context.arc(switches.outer2inner.right.x + background.x, switches.outer2inner.right.y / switchesBeforeFac + background.y, background.width / 100, 0, 2 * Math.PI);
            context.fill();
            context.beginPath();
            context.arc(switches.outer2inner.left.x + background.x, switches.outer2inner.left.y / switchesBeforeFac + background.y, background.width / 100, 0, 2 * Math.PI);
            context.fill();
            context.beginPath();
            context.arc(switches.innerWide.right.x + background.x, switches.innerWide.right.y * switchesBeforeFac + background.y, background.width / 100, 0, 2 * Math.PI);
            context.fill();
            context.beginPath();
            context.arc(switches.innerWide.left.x + background.x, switches.innerWide.left.y * switchesBeforeFac + background.y, background.width / 100, 0, 2 * Math.PI);
            context.fill();
            context.restore();
            context.save();
            context.strokeStyle = "orange";
            context.lineWidth = 3;
            context.beginPath();
            context.moveTo(switches.sidings2.left.x + background.x - background.width / 20, switches.sidings2.left.y + background.y + switchesBeforeAddSidings[0]);
            context.lineTo(switches.sidings2.left.x + background.x, switches.sidings2.left.y + background.y + switchesBeforeAddSidings[0]);
            context.stroke();
            context.beginPath();
            context.moveTo(switches.sidings3.left.x + background.x - background.width / 20, switches.sidings3.left.y + background.y + switchesBeforeAddSidings[1]);
            context.lineTo(switches.sidings3.left.x + background.x, switches.sidings3.left.y + background.y + switchesBeforeAddSidings[1]);
            context.stroke();
            context.restore();
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
                }
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
                drawInfoOverlayMenu("items-change");
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
                    }
                    else {
                        if (trains[cTrain].speedInPercent == undefined || trains[cTrain].speedInPercent < minTrainSpeed) {
                            newSpeed = minTrainSpeed;
                        }
                        else {
                            newSpeed = Math.round(trains[cTrain].speedInPercent * (hardware.mouse.wheelScrollY < 0 ? 1.1 : 0.9));
                        }
                    }
                    if (newSpeed > 95) {
                        newSpeed = 100;
                    }
                    trainActions.setSpeed(cTrain, newSpeed, true);
                    if (newSpeed > 0 && newSpeed < 100) {
                        hardware.mouse.cursor = "grabbing";
                    }
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
        canvasForeground.style.cursor = client.chosenInputMethod != "mouse" || gui.demo ? "none" : hardware.mouse.cursor;
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
        canvasForeground.style.cursor = client.chosenInputMethod != "mouse" || getSetting("cursorascircle") || gui.demo ? "none" : hardware.mouse.cursor;
    }
    hardware.mouse.wheelScrolls = false;
    if (lastClickDoubleClick == hardware.mouse.lastClickDoubleClick && wasHold) {
        hardware.mouse.lastClickDoubleClick = false;
    }
    /////REPAINT/////
    if (drawTimeout !== undefined && drawTimeout !== null) {
        window.clearTimeout(drawTimeout);
    }
    if (!client.hidden) {
        var restTime = drawInterval - (Date.now() - startTime);
        if (restTime <= 0) {
            window.requestAnimationFrame(drawObjects);
        }
        else {
            drawTimeout = window.setTimeout(function () {
                window.requestAnimationFrame(drawObjects);
            }, restTime);
        }
    }
}
function actionSync(objectName, index, params, notification, notificationOnlyForOthers) {
    if (index === void 0) { index = undefined; }
    if (params === void 0) { params = undefined; }
    if (notification === void 0) { notification = undefined; }
    if (notificationOnlyForOthers === void 0) { notificationOnlyForOthers = false; }
    if (onlineGame.enabled) {
        if (!onlineGame.stop) {
            teamplaySync("action", objectName, index, params, notification, notificationOnlyForOthers);
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
                    notify("#canvas-notifier", notifyStr, NOTIFICATION_PRIO_DEFAULT, 1000, null, null, client.y + menus.outerContainer.height);
                }
                break;
        }
    }
}
function teamplaySync(mode, objectName, index, params, notification, notificationOnlyForOthers) {
    if (objectName === void 0) { objectName = undefined; }
    if (index === void 0) { index = undefined; }
    if (params === void 0) { params = undefined; }
    if (notification === void 0) { notification = undefined; }
    if (notificationOnlyForOthers === void 0) { notificationOnlyForOthers = false; }
    switch (mode) {
        case "action":
            var output = {};
            output.objectName = objectName;
            output.index = index;
            output.params = params;
            output.notification = notification;
            output.notificationOnlyForOthers = notificationOnlyForOthers;
            onlineConnection.send({ mode: "action", gameId: onlineGame.id, message: JSON.stringify(output) });
            break;
        case "sync-ready":
            onlineConnection.send({ mode: "sync-ready" });
            break;
    }
}
/*******************************************
 *               Variables                *
 ******************************************/
var animateWorker = new Worker("./src/jsm/scripting_worker_animate.js", { type: "module" });
var frameNo = 0;
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
var movingTimeOut;
var clickTimeOut;
var longTouchTime = 350;
var longTouchWaitTime = longTouchTime + 50;
var doubleTouchTime = 250;
var doubleTouchWaitTime = doubleTouchTime + 50;
var doubleClickTime = 200;
var doubleClickWaitTime = doubleClickTime + 50;
var konamiState = 0;
var konamiTimeOut;
var gui = {};
var pics = [
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
    { id: 37, extension: "png" }
];
var background = { src: 9, secondLayer: 10 };
var oldBackground;
var background3D = { flat: { src: "assets/3d/background-flat.jpg" }, three: { src: "background-3d.gltf" } };
var audio = {};
var rotationPoints;
var trains;
var trains3D = [];
var trainActions = {
    checkRange: function (i) {
        return i >= 0 && i < trains.length;
    },
    start: function (i, speed, notificationOnlyForOthers) {
        if (notificationOnlyForOthers === void 0) { notificationOnlyForOthers = false; }
        if (!this.checkRange(i) || trains[i].crash || trains[i].accelerationSpeed > 0 || speed <= 0 || speed > 100) {
            return false;
        }
        if (trains[i].move) {
            actionSync("trains", i, [{ accelerationSpeed: (trains[i].accelerationSpeed *= -1) }, { speedInPercent: speed }, { accelerationSpeedCustom: 1 }], [{ getString: ["appScreenObjectStarts", "."] }, { getString: [["appScreenTrainNames", i]] }], notificationOnlyForOthers);
        }
        else {
            actionSync("trains", i, [{ move: true }, { speedInPercent: speed }, { accelerationSpeedCustom: 1 }], [{ getString: ["appScreenObjectStarts", "."] }, { getString: [["appScreenTrainNames", i]] }], notificationOnlyForOthers);
        }
        return true;
    },
    stop: function (i, notificationOnlyForOthers) {
        if (notificationOnlyForOthers === void 0) { notificationOnlyForOthers = false; }
        if (!this.checkRange(i) || trains[i].accelerationSpeed <= 0) {
            return false;
        }
        actionSync("trains", i, [{ accelerationSpeed: (trains[i].accelerationSpeed *= -1) }, { accelerationSpeedCustom: 1 }], [{ getString: ["appScreenObjectStops", "."] }, { getString: [["appScreenTrainNames", i]] }], notificationOnlyForOthers);
        return true;
    },
    changeDirection: function (i, highlight, notificationOnlyForOthers) {
        if (highlight === void 0) { highlight = false; }
        if (notificationOnlyForOthers === void 0) { notificationOnlyForOthers = false; }
        if (!this.checkRange(i) || trains[i].accelerationSpeed > 0 || Math.abs(trains[i].accelerationSpeed) >= 0.2) {
            return false;
        }
        if (highlight) {
            actionSync("trains", i, [{ accelerationSpeed: 0 }, { move: false }, { standardDirection: !trains[i].standardDirection }, { lastDirectionChange: frameNo }], [{ getString: ["appScreenObjectChangesDirection", "."] }, { getString: [["appScreenTrainNames", i]] }], notificationOnlyForOthers);
        }
        else {
            actionSync("trains", i, [{ accelerationSpeed: 0 }, { move: false }, { standardDirection: !trains[i].standardDirection }], [{ getString: ["appScreenObjectChangesDirection", "."] }, { getString: [["appScreenTrainNames", i]] }], notificationOnlyForOthers);
        }
        return true;
    },
    setSpeed: function (i, speed, notificationOnlyForOthers) {
        if (notificationOnlyForOthers === void 0) { notificationOnlyForOthers = false; }
        if (!this.checkRange(i) || speed < 0 || speed > 100) {
            return false;
        }
        if (speed < minTrainSpeed) {
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
var minTrainSpeed = 10;
var trainParams;
var switches = {
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
var switches3D = {};
var switchActions = {
    turn: function (key, side) {
        if (onlineGame.enabled) {
            actionSync("switches", [key, side], [{ turned: !switches[key][side].turned }], [{ getString: ["appScreenSwitchTurns", "."] }]);
        }
        else {
            switches[key][side].turned = !switches[key][side].turned;
            switches[key][side].lastStateChange = frameNo;
            animateWorker.postMessage({ k: "switches", switches: switches });
            notify("#canvas-notifier", getString("appScreenSwitchTurns", "."), NOTIFICATION_PRIO_DEFAULT, 500, null, null, client.y + menus.outerContainer.height, NOTIFICATION_CHANNEL_TRAIN_SWITCHES);
        }
        if (existsAudio("switch")) {
            stopAudio("switch");
        }
        if (audio.active) {
            startAudio("switch", null, false);
        }
    }
};
var switchesBeforeFac, switchesBeforeAddSidings;
var cars = [
    { src: 16, fac: 0.02, speed: 0.0008, startFrameFac: 0.65, angles: { start: Math.PI, normal: 0 }, hexColor: "0xff0000" },
    { src: 17, fac: 0.02, speed: 0.001, startFrameFac: 0.335, angles: { start: 0, normal: Math.PI }, hexColor: "0xffffff" },
    { src: 0, fac: 0.0202, speed: 0.00082, startFrameFac: 0.65, angles: { start: Math.PI, normal: 0 }, hexColor: "0xffee00" }
];
var cars3D = [];
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
var carWays = [];
var carParams = { init: true, wayNo: 7 };
var carActions = {
    auto: {
        start: function () {
            if (carParams.init) {
                carParams.init = false;
                carParams.autoModeOff = false;
                carParams.autoModeRuns = true;
                carParams.autoModeInit = true;
                notify("#canvas-notifier", formatJSString(getString("appScreenCarAutoModeChange", "."), getString("appScreenCarAutoModeInit")), NOTIFICATION_PRIO_DEFAULT, 500, null, null, client.y + menus.outerContainer.height);
                return true;
            }
            return false;
        },
        end: function () {
            if (!carParams.autoModeOff && !carParams.isBackToRoot) {
                carParams.autoModeRuns = true;
                carParams.isBackToRoot = true;
                notify("#canvas-notifier", getString("appScreenCarAutoModeParking", "."), NOTIFICATION_PRIO_DEFAULT, 750, null, null, client.y + menus.outerContainer.height);
                return true;
            }
            return false;
        },
        pause: function () {
            if (!carParams.autoModeRuns) {
                return false;
            }
            carParams.autoModeRuns = false;
            notify("#canvas-notifier", formatJSString(getString("appScreenCarAutoModeChange", "."), getString("appScreenCarAutoModePause")), NOTIFICATION_PRIO_DEFAULT, 500, null, null, client.y + menus.outerContainer.height);
            return true;
        },
        resume: function () {
            if (carParams.autoModeRuns || carParams.autoModeOff) {
                return false;
            }
            carParams.autoModeRuns = true;
            carParams.autoModeInit = true;
            notify("#canvas-notifier", formatJSString(getString("appScreenCarAutoModeChange", "."), getString("appScreenCarAutoModeInit")), NOTIFICATION_PRIO_DEFAULT, 500, null, null, client.y + menus.outerContainer.height);
            return true;
        }
    },
    manual: {
        checkRange: function (car) {
            return car >= 0 && car < cars.length;
        },
        start: function (car) {
            if (!this.checkRange(car) || carCollisionCourse(car, false) || (!carParams.init && !carParams.autoModeOff) || cars[car].move) {
                return false;
            }
            cars[car].move = true;
            cars[car].parking = false;
            cars[car].backwardsState = 0;
            cars[car].backToInit = false;
            carParams.init = false;
            carParams.autoModeOff = true;
            notify("#canvas-notifier", formatJSString(getString("appScreenObjectStarts", "."), getString(["appScreenCarNames", car])), NOTIFICATION_PRIO_DEFAULT, 500, null, null, client.y + menus.outerContainer.height);
            return true;
        },
        stop: function (car) {
            if (!this.checkRange(car) || !carParams.autoModeOff || !cars[car].move) {
                return false;
            }
            cars[car].move = false;
            cars[car].parking = false;
            cars[car].backwardsState = 0;
            cars[car].backToInit = false;
            carParams.init = false;
            carParams.autoModeOff = true;
            notify("#canvas-notifier", formatJSString(getString("appScreenObjectStops", "."), getString(["appScreenCarNames", car])), NOTIFICATION_PRIO_DEFAULT, 500, null, null, client.y + menus.outerContainer.height);
            return true;
        },
        backwards: function (car) {
            if (!this.checkRange(car) || !carParams.autoModeOff || cars[car].move || cars[car].backwardsState !== 0 || cars[car].parking) {
                return false;
            }
            cars[car].lastDirectionChange = frameNo;
            cars[car].backwardsState = 1;
            cars[car].backToInit = false;
            if (carCollisionCourse(car, false)) {
                return false;
            }
            cars[car].move = true;
            notify("#canvas-notifier", formatJSString(getString("appScreenCarStepsBack", "."), getString(["appScreenCarNames", car])), NOTIFICATION_PRIO_DEFAULT, 750, null, null, client.y + menus.outerContainer.height);
            return true;
        },
        park: function (car) {
            if (!this.checkRange(car) || carCollisionCourse(car, false, -1) || !carParams.autoModeOff || cars[car].move || cars[car].parking) {
                return false;
            }
            cars[car].move = true;
            cars[car].backToInit = true;
            notify("#canvas-notifier", formatJSString(getString("appScreenCarParking", "."), getString(["appScreenCarNames", car])), NOTIFICATION_PRIO_DEFAULT, 500, null, null, client.y + menus.outerContainer.height);
            return true;
        }
    }
};
var taxOffice = {
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
var classicUI = { trainSwitch: { src: 11, srcFill: 31, selectedTrainDisplay: {} }, transformer: { src: 12, onSrc: 13, readySrc: 23, angle: Math.PI / 5, input: { src: 14, angle: 0, minAngle: minTrainSpeed, maxAngle: 1.5 * Math.PI }, directionInput: { srcStandardDirection: 24, srcNotStandardDirection: 15 } }, switches: { showDuration: 11, showDurationFade: 33, showDurationEnd: 44 } };
var controlCenter = { showCarCenter: false, fontFamily: "sans-serif", mouse: {} };
var hardware = { mouse: { moveX: 0, moveY: 0, downX: 0, downY: 0, downTime: 0, upX: 0, upY: 0, upTime: 0, isMoving: false, isHold: false, cursor: "default" }, keyboard: { keysHold: [] } };
var client = { devicePixelRatio: 1, zoomAndTilt: { maxScale: 6, minScale: 1.2 } };
var menus = {};
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
                if (gui.infoOverlay && client.zoomAndTilt.realScale == 1) {
                    drawInfoOverlayMenu("show");
                }
                else if (client.zoomAndTilt.realScale == 1) {
                    drawOptionsMenu("show");
                }
                gui.textControl = false;
                return "";
            }
        }
    }
};
var onlineGame = { animateInterval: 40, syncInterval: 10000, excludeFromSync: { t: ["src", "trainSwitchSrc", "assetFlip", "fac", "speedFac", "accelerationSpeedStartFac", "accelerationSpeedFac", "lastDirectionChange", "bogieDistance", "width", "height", "speed", "crash", "flickerFacBack", "flickerFacBackOffset", "flickerFacFront", "flickerFacFrontOffset", "margin", "cars"], tc: ["src", "assetFlip", "fac", "bogieDistance", "width", "height", "konamiUseTrainIcon"] }, chatSticker: 7, resized: false };
var onlineConnection = { serverURI: getServerLink(PROTOCOL_WS) + "/multiplay" };
var resizeTimeout;
var resized = false;
var demoMode = {
    leaveTimeMin: 1500,
    leaveTimeoutStart: function () {
        if (demoMode.leaveTimeout != undefined && demoMode.leaveTimeout != null) {
            window.clearTimeout(demoMode.leaveTimeout);
        }
        demoMode.leaveTimeout = window.setTimeout(function () {
            switchMode();
        }, demoMode.leaveTimeMin);
    },
    leaveTimeoutEnd: function () {
        if (demoMode.leaveTimeout != undefined && demoMode.leaveTimeout != null) {
            window.clearTimeout(demoMode.leaveTimeout);
        }
    }
};
var debug = { paint: true };
var three = {
    calcScale: function () {
        return background.height / client.devicePixelRatio / client.height;
    },
    calcPositionY: function () {
        return ((client.height - (background.y * 2 + background.height) / client.devicePixelRatio) / client.height) * (background.height / background.width / 2);
    },
    zoom: 3
};
/*******************************************
 *            Event Listeners              *
 ******************************************/
window.onload = function () {
    function initialDisplay() {
        function defineCarParams() {
            function defineCarWays(cType, isFirst, i, j, obj, currentObjectInput, stateNullAgain) {
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
                            //TODO
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
                return (currentObject.state === 0 || currentObject.state == -1) && stateNullAgain ? obj : defineCarWays(cType, isFirst, i, ++j, obj, currentObject, stateNullAgain);
            }
            cars.forEach(function (car, i) {
                car.speed *= background.width;
                car.collStop = true;
                car.collStopNo = [];
                if (i === 0) {
                    carParams.lowestSpeedNo = i;
                }
                else if (car.speed < cars[carParams.lowestSpeedNo].speed) {
                    carParams.lowestSpeedNo = i;
                }
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
                        carWays[i][cType] = defineCarWays(cType, (typeof carPaths[i].start == "undefined" && cType == "normal") || cType == "start", i);
                    }
                    catch (e) {
                        return false;
                    }
                }
            }
            return true;
        }
        function placeCarsAtInitialPositions() {
            for (var i = 0; i < cars.length; i++) {
                cars[i].width = cars[i].fac * background.width;
                cars[i].height = cars[i].fac * (pics[cars[i].src].height * (background.width / pics[cars[i].src].width));
                cars[i].cType = typeof carWays[i].start == "undefined" ? "normal" : "start";
                cars[i].displayAngle = carWays[i][cars[i].cType][cars[i].counter].angle;
                cars[i].x = carWays[i][cars[i].cType][cars[i].counter].x;
                cars[i].y = carWays[i][cars[i].cType][cars[i].counter].y;
                cars[i].backToInit = false;
                cars[i].parking = true;
                if (i === 0) {
                    carParams.thickestCar = i;
                }
                else if (cars[i].height > cars[carParams.thickestCar].height) {
                    carParams.thickestCar = i;
                }
            }
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        calcMenusAndBackground("load");
        var savedGameBg = window.localStorage.getItem("morowayAppSavedGame_v-" + getVersionCode() + "_Bg");
        var savedGameTrains = window.localStorage.getItem("morowayAppSavedGame_v-" + getVersionCode() + "_Trains");
        var savedGameSwitches = window.localStorage.getItem("morowayAppSavedGame_v-" + getVersionCode() + "_Switches");
        var savedGameCars = window.localStorage.getItem("morowayAppSavedGame_v-" + getVersionCode() + "_Cars");
        var savedGameCarParams = window.localStorage.getItem("morowayAppSavedGame_v-" + getVersionCode() + "_CarParams");
        var savedGameBgSession = window.sessionStorage.getItem("demoBg");
        var savedGameCarsSession = window.sessionStorage.getItem("demoCars");
        var savedGameCarParamsSession = window.sessionStorage.getItem("demoCarParams");
        //Cars
        if (defineCarParams()) {
            if (getSetting("saveGame") && !onlineGame.enabled && !gui.demo && savedGameCars != null && savedGameCarParams != null && savedGameBg != null) {
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
            else if (gui.demo && savedGameCarsSession != null && savedGameCarParamsSession != null && savedGameBgSession != null) {
                cars = JSON.parse(savedGameCarsSession);
                carParams = JSON.parse(savedGameCarParamsSession);
                resizeCars(JSON.parse(savedGameBgSession));
            }
            else {
                placeCarsAtInitialPositions();
                if (gui.demo) {
                    carParams.init = false;
                    carParams.autoModeOff = false;
                    carParams.autoModeRuns = true;
                    carParams.autoModeInit = true;
                }
            }
        }
        else {
            carWays = cars = [];
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
        textControl.elements.input.addEventListener("keydown", function (event) {
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
        });
        //Switches
        if (getSetting("saveGame") && !onlineGame.enabled && !gui.demo && savedGameTrains != null && savedGameSwitches != null && savedGameBg != null) {
            var savedSwitches = JSON.parse(savedGameSwitches);
            Object.keys(savedSwitches).forEach(function (key) {
                Object.keys(savedSwitches[key]).forEach(function (side) {
                    switches[key][side].turned = savedSwitches[key][side];
                });
            });
        }
        else if (gui.demo) {
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
        var loaderTexture = new THREE.TextureLoader();
        loaderTexture.load(background3D.flat.src, function (texture) {
            var material = new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 0.85,
                metalness: 0.15
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
        });
        var loaderGLTF = new GLTFLoader();
        loaderGLTF.setPath("assets/3d/background-3d/").load(background3D.three.src, function (gltf) {
            background3D.three.mesh = gltf.scene;
            background3D.three.resize = function () {
                var scale = three.calcScale();
                background3D.three.mesh.scale.x = scale;
                background3D.three.mesh.scale.y = scale;
                background3D.three.mesh.scale.z = scale;
                background3D.three.mesh.position.set(0, three.calcPositionY(), 0);
            };
            background3D.three.resize();
            three.mainGroup.add(background3D.three.mesh);
        });
        background3D.behind = document.getElementById("game-gameplay-three-bg");
        background3D.animateBehind = function (reset) {
            if (reset === void 0) { reset = false; }
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
                background3D.animateBehindFac += 0.00025;
                if (background3D.animateBehindFac >= 1) {
                    background3D.animateBehindFac -= 1;
                }
                background3D.behind.style.transform = "translateX(" + -background3D.animateBehindFac * background3D.behind.offsetWidth + "px)";
                background3D.behindClone.style.transform = "translateX(" + (1 - background3D.animateBehindFac) * background3D.behind.offsetWidth + "px)";
            }
        };
        three.camera = new THREE.PerspectiveCamera(60, client.width / client.height, 0.1, 10);
        three.camera.position.set(0, 0, 1);
        three.camera.zoom = three.zoom;
        three.camera.aspect = client.width / client.height;
        three.camera.updateProjectionMatrix();
        if (gui.demo) {
            three.demoRotationFacX = Math.round(Math.random()) * 2 - 1;
            three.demoRotationFacY = Math.round(Math.random()) * 2 - 1;
        }
        if (APP_DATA.debug && debug.paint) {
            var axesHelper = new THREE.AxesHelper(15);
            three.scene.add(axesHelper);
        }
        //Animate Worker
        animateWorker.onerror = function () {
            notify("#canvas-notifier", getString("generalIsFail", "!", "upper"), NOTIFICATION_PRIO_HIGH, 950, null, null, client.height);
            window.setTimeout(function () {
                followLink("error#animate", "_self", LINK_STATE_INTERNAL_HTML);
            }, 1000);
        };
        animateWorker.onmessage = function (message) {
            if (message.data.k == "getTrainPics") {
                trains = message.data.trains;
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
                if (getSetting("saveGame") && !onlineGame.enabled && !gui.demo && savedGameTrains != null && savedGameSwitches != null && savedGameBg != null) {
                    animateWorker.postMessage({ k: "setTrainPics", trainPics: trainPics, savedTrains: JSON.parse(savedGameTrains), savedBg: JSON.parse(savedGameBg) });
                }
                else {
                    animateWorker.postMessage({ k: "setTrainPics", trainPics: trainPics });
                }
                if (onlineGame.enabled) {
                    var chatTrainContainer = document.querySelector("#chat #chat-msg-trains-inner");
                    for (var stickerTrain = 0; stickerTrain < trains.length; stickerTrain++) {
                        var elem = document.createElement("img");
                        elem.src = "./assets/chat_train_" + stickerTrain + ".png";
                        elem.alt = getString(["appScreenTrainNames", stickerTrain]);
                        elem.dataset.tooltip = getString(["appScreenTrainNames", stickerTrain]);
                        initTooltip(elem);
                        elem.dataset.stickerNumber = stickerTrain.toString();
                        elem.addEventListener("click", function (event) {
                            onlineConnection.send({ mode: "chat-msg", message: "{{stickerTrain=" + event.target.dataset.stickerNumber + "}}" });
                        });
                        chatTrainContainer.appendChild(elem);
                    }
                }
            }
            else if (message.data.k == "setTrainParams") {
                trainParams = message.data.trainParams;
            }
            else if (message.data.k == "ready") {
                if (onlineGame.enabled) {
                    var chatNotify_1 = document.querySelector("#tp-chat-notifier");
                    var chat_1 = document.querySelector("#chat");
                    var chatClose = document.querySelector("#chat #chat-close");
                    var chatControls_1 = document.querySelector("#chat #chat-controls");
                    var chatInnerContainer_1 = document.querySelector("#chat #chat-inner");
                    var chatInner_1 = document.querySelector("#chat #chat-inner-messages");
                    var chatInnerNone_1 = document.querySelector("#chat #chat-no-messages");
                    var chatScrollToBottom_1 = document.querySelector("#chat #chat-scroll-to-bottom");
                    var chatSendInner_1 = document.querySelectorAll("#chat #chat-send > *");
                    var chatSend = document.querySelector("#chat #chat-msg-send-button");
                    var chatMsg_1 = document.querySelector("#chat #chat-msg-send-text");
                    var chatReactions_1 = document.querySelector("#chat #chat-msg-reactions");
                    var chatSmileyContainer = document.querySelector("#chat #chat-msg-smileys-inner");
                    var smileyElements_1 = chatSmileyContainer.querySelectorAll("button");
                    var chatStickerContainer = document.querySelector("#chat #chat-msg-stickers-inner");
                    var chatClear_1 = document.querySelector("#chat #chat-clear");
                    chatScrollToBottom_1.toggleDisplay = function () {
                        if (chatInner_1.lastChild != null) {
                            chatScrollToBottom_1.style.display = chatInnerContainer_1.scrollHeight > chatInnerContainer_1.offsetHeight && chatInnerContainer_1.scrollHeight - chatInnerContainer_1.scrollTop > chatInnerContainer_1.offsetHeight + chatInner_1.lastChild.offsetHeight ? "flex" : "";
                            chatScrollToBottom_1.style.top = Math.max(0, chatInnerContainer_1.offsetHeight - chatScrollToBottom_1.offsetHeight - 50) + "px";
                        }
                        else {
                            chatScrollToBottom_1.style.display = "";
                        }
                    };
                    chat_1.resizeChat = function () {
                        chatInnerContainer_1.style.maxHeight = Math.max(50, Math.min(client.height, chat_1.offsetHeight) - chatControls_1.offsetHeight) + "px";
                        chatScrollToBottom_1.toggleDisplay();
                    };
                    window.addEventListener("resize", chat_1.resizeChat);
                    chat_1.openChat = function () {
                        if (typeof chatNotify_1.hide == "function") {
                            chatNotify_1.hide(chatNotify_1, true);
                        }
                        chat_1.style.display = "block";
                        gui.sidebarRight = true;
                        drawOptionsMenu("invisible");
                        chat_1.resizeChat();
                    };
                    chat_1.closeChat = function () {
                        chat_1.style.display = "";
                        gui.sidebarRight = false;
                        drawOptionsMenu("visible");
                    };
                    window.addEventListener("keyup", function (event) {
                        if (event.key === "Escape") {
                            chat_1.closeChat();
                        }
                    });
                    chatInner_1.parentNode.addEventListener("scroll", function () {
                        chatScrollToBottom_1.toggleDisplay();
                    });
                    chatNotify_1.addEventListener("click", chat_1.openChat);
                    chatClose.addEventListener("click", chat_1.closeChat);
                    chatSend.addEventListener("click", function () {
                        if (chatMsg_1.value != "") {
                            onlineConnection.send({ mode: "chat-msg", message: chatMsg_1.value });
                            chatMsg_1.value = "";
                        }
                    });
                    chatMsg_1.addEventListener("keyup", function (event) {
                        if (chatMsg_1.value != "") {
                            if (event.key === "Enter") {
                                onlineConnection.send({ mode: "chat-msg", message: chatMsg_1.value });
                                chatMsg_1.value = "";
                            }
                        }
                    });
                    for (var cSI = 0; cSI < chatSendInner_1.length; cSI++) {
                        chatSendInner_1[cSI].querySelector(".chat-send-toggle").addEventListener("click", function (event) {
                            var target = event.target;
                            var elem = target.parentNode.querySelector(".chat-send-inner");
                            var display = window.getComputedStyle(elem).getPropertyValue("display");
                            for (var cSI = 0; cSI < chatSendInner_1.length; cSI++) {
                                chatSendInner_1[cSI].querySelector(".chat-send-inner").style.display = "none";
                            }
                            elem.style.display = display == "none" ? "block" : "none";
                            chat_1.resizeChat();
                            var smileySupport = true;
                            for (var smiley = 1; smiley < smileyElements_1.length; smiley++) {
                                if (smileyElements_1[smiley].offsetWidth != smileyElements_1[smiley - 1].offsetWidth) {
                                    smileySupport = false;
                                    break;
                                }
                            }
                            if (!smileySupport) {
                                notify("#canvas-notifier", getString("appScreenTeamplayChatNoEmojis"), NOTIFICATION_PRIO_HIGH, 6000, null, null, client.y + menus.outerContainer.height);
                            }
                        });
                    }
                    for (var smiley = 0; smiley < smileyElements_1.length; smiley++) {
                        smileyElements_1[smiley].addEventListener("click", function (event) {
                            var target = event.target;
                            onlineConnection.send({ mode: "chat-msg", message: target.textContent });
                        });
                    }
                    for (var sticker = 0; sticker < onlineGame.chatSticker; sticker++) {
                        var elem = document.createElement("img");
                        elem.src = "./assets/chat_sticker_" + sticker + ".png";
                        elem.dataset.stickerNumber = sticker.toString();
                        elem.addEventListener("click", function (event) {
                            var target = event.target;
                            onlineConnection.send({ mode: "chat-msg", message: "{{sticker=" + target.dataset.stickerNumber + "}}" });
                        });
                        chatStickerContainer.appendChild(elem);
                    }
                    chatClear_1.clearChat = function () {
                        var chat2Clear = document.querySelectorAll(".chat-inner-container");
                        if (chat2Clear.length != 0) {
                            for (var clearNo = 0; clearNo < chat2Clear.length; clearNo++) {
                                destroy(chat2Clear[clearNo]);
                            }
                        }
                        chatInnerNone_1.style.display = "";
                        chatReactions_1.style.display = "none";
                        chatScrollToBottom_1.toggleDisplay();
                    };
                    chatClear_1.addEventListener("click", chatClear_1.clearChat);
                    chatScrollToBottom_1.addEventListener("click", function () {
                        if (chatInner_1.lastChild != null) {
                            chatInner_1.lastChild.scrollIntoView();
                            chatScrollToBottom_1.toggleDisplay();
                        }
                    });
                    document.querySelector("#setup #setup-exit").addEventListener("click", function () {
                        switchMode();
                    });
                    onlineConnection.connect = function (host) {
                        function hideLoadingAnimation() {
                            window.clearInterval(loadingAnimElemChangingFilter);
                            destroy([document.querySelector("#branding"), document.querySelector("#snake"), document.querySelector("#percent")]);
                            chat_1.closeChat();
                            chatClear_1.clearChat();
                        }
                        function showStartGame(teamNum) {
                            hideLoadingAnimation();
                            onlineGame.stop = false;
                            document.addEventListener("visibilitychange", function () {
                                if (document.visibilityState == "hidden") {
                                    onlineConnection.send({ mode: "pause-request" });
                                }
                                else {
                                    onlineConnection.send({ mode: "resume-request" });
                                }
                            });
                            var parent = document.querySelector("#content");
                            var elem = parent.querySelector("#game");
                            resetForElem(parent, elem, "block");
                            var parent = document.querySelector("#game");
                            var elem = parent.querySelector("#game-start");
                            elem.querySelector("#game-start-text").textContent = formatJSString(getString("appScreenTeamplayGameStart"), teamNum);
                            resetForElem(parent, elem);
                            elem.querySelector("#game-start-button").onclick = function () {
                                onlineConnection.send({ mode: "start" });
                            };
                        }
                        function showNewGameLink() {
                            hideLoadingAnimation();
                            var parent = document.querySelector("#content");
                            var elem = parent.querySelector("#setup");
                            resetForElem(parent, elem, "block");
                            var parent = document.querySelector("#setup-inner-content");
                            var elem = parent.querySelector("#setup-create");
                            resetForElem(parent, elem);
                            var elem = document.querySelector("#setup #setup-create #setup-create-link");
                            elem.addEventListener("click", function () {
                                switchMode("multiplay");
                            });
                            var elem = document.querySelector("#setup #setup-create #setup-create-escape");
                            elem.addEventListener("click", function () {
                                switchMode();
                            });
                        }
                        function getPlayerNameFromInput() {
                            var elem = document.querySelector("#setup-init-name");
                            var name = elem.value;
                            var nameCheck = name.replace(/[^a-zA-Z0-9]/g, "");
                            if (name.length > 0 && name == nameCheck) {
                                window.sessionStorage.setItem("playername", name);
                                return name;
                            }
                            else {
                                elem.value = nameCheck;
                            }
                            return false;
                        }
                        function sendPlayerName(name) {
                            onlineConnection.send({ mode: "init", message: name });
                        }
                        function sendSyncRequest() {
                            if (!onlineGame.syncing) {
                                if (onlineGame.resized) {
                                    if (onlineGame.syncRequest !== undefined && onlineGame.syncRequest !== null) {
                                        window.clearTimeout(onlineGame.syncRequest);
                                    }
                                    if (onlineGame.locomotive) {
                                        onlineGame.syncRequest = window.setTimeout(sendSyncRequest, onlineGame.syncInterval);
                                    }
                                }
                                else if (!onlineGame.stop) {
                                    var number = 0;
                                    number += trains.length;
                                    trains.forEach(function (train) {
                                        number += train.cars.length;
                                    });
                                    number++; //Switches
                                    var obj = { number: number };
                                    onlineConnection.send({ mode: "sync-request", message: JSON.stringify(obj) });
                                }
                            }
                        }
                        function sendSyncData() {
                            var task = {};
                            task.o = "s";
                            var obj = copyJSObject(switches);
                            task.d = obj;
                            if (!onlineGame.resized) {
                                onlineConnection.send({ mode: "sync-task", message: JSON.stringify(task) });
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
                                onlineGame.excludeFromSync[task.o].forEach(function (key) {
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
                                if (!onlineGame.resized) {
                                    onlineConnection.send({ mode: "sync-task", message: JSON.stringify(task) });
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
                                    onlineGame.excludeFromSync[task.o].forEach(function (key) {
                                        delete obj[key];
                                    });
                                    task.d = obj;
                                    if (!onlineGame.resized) {
                                        onlineConnection.send({ mode: "sync-task", message: JSON.stringify(task) });
                                    }
                                }
                            }
                        }
                        onlineConnection.socket = new WebSocket(host);
                        onlineConnection.socket.onopen = function () {
                            window.addEventListener("error", function () {
                                onlineConnection.socket.close();
                            });
                            onlineConnection.send({ mode: "hello", message: APP_DATA.version.major + APP_DATA.version.minor / 10 });
                        };
                        onlineConnection.socket.onclose = function () {
                            showNewGameLink();
                            notify("#canvas-notifier", getString("appScreenTeamplayConnectionError", "."), NOTIFICATION_PRIO_HIGH, 6000, function () {
                                followLink("error#tp-connection", "_self", LINK_STATE_INTERNAL_HTML);
                            }, getString("appScreenFurtherInformation"), client.height);
                        };
                        onlineConnection.socket.onmessage = function (message) {
                            var json = JSON.parse(message.data);
                            if (APP_DATA.debug) {
                                console.log(json);
                            }
                            switch (json.mode) {
                                case "hello":
                                    if (json.errorLevel < 2) {
                                        if (json.errorLevel == 1) {
                                            notify("#canvas-notifier", getString("appScreenTeamplayUpdateNote", "!"), NOTIFICATION_PRIO_DEFAULT, 900, null, null, client.height);
                                        }
                                        var parent = document.querySelector("#content");
                                        var elem = parent.querySelector("#setup");
                                        resetForElem(parent, elem, "block");
                                        if (window.sessionStorage.getItem("playername") != null) {
                                            sendPlayerName(window.sessionStorage.getItem("playername"));
                                        }
                                        else {
                                            hideLoadingAnimation();
                                            parent = document.querySelector("#setup-inner-content");
                                            elem = parent.querySelector("#setup-init");
                                            resetForElem(parent, elem);
                                            elem.querySelector("#setup-init-button").addEventListener("click", function (event) {
                                                var name = getPlayerNameFromInput();
                                                if (name !== false) {
                                                    sendPlayerName(name);
                                                }
                                            });
                                            elem.querySelector("#setup-init-name").addEventListener("keyup", function (event) {
                                                if (event.key === "Enter") {
                                                    var name = getPlayerNameFromInput();
                                                    if (name !== false) {
                                                        sendPlayerName(name);
                                                    }
                                                }
                                            });
                                            elem.querySelector("#setup-init-name").focus();
                                        }
                                    }
                                    else {
                                        document.querySelector("#content").style.display = "none";
                                        window.setTimeout(function () {
                                            followLink("error#tp-update", "_self", LINK_STATE_INTERNAL_HTML);
                                        }, 1000);
                                        notify("#canvas-notifier", getString("appScreenTeamplayUpdateError", "!"), NOTIFICATION_PRIO_HIGH, 6000, null, null, client.height);
                                    }
                                    break;
                                case "init":
                                    if (json.errorLevel === 0) {
                                        onlineGame.sessionId = json.sessionId;
                                        if (onlineGame.gameKey == "" || onlineGame.gameId == "") {
                                            onlineConnection.send({ mode: "connect" });
                                        }
                                        else {
                                            onlineConnection.send({ mode: "join", gameKey: onlineGame.gameKey, gameId: onlineGame.gameId });
                                        }
                                    }
                                    else {
                                        showNewGameLink();
                                        notify("#canvas-notifier", getString("appScreenTeamplayConnectionError", "."), NOTIFICATION_PRIO_HIGH, 6000, function () {
                                            followLink("error#tp-connection", "_self", LINK_STATE_INTERNAL_HTML);
                                        }, getString("appScreenFurtherInformation"), client.height);
                                    }
                                    break;
                                case "connect":
                                    if (json.errorLevel === 0) {
                                        onlineGame.locomotive = true;
                                        onlineGame.gameKey = json.gameKey;
                                        onlineGame.gameId = json.gameId;
                                        hideLoadingAnimation();
                                        var parent = document.querySelector("#setup-inner-content");
                                        var elem = parent.querySelector("#setup-start");
                                        resetForElem(parent, elem);
                                        elem.querySelector("#setup-start-gamelink").textContent = getShareLink(onlineGame.gameId, onlineGame.gameKey);
                                        elem.querySelector("#setup-start-button").onclick = function () {
                                            copy("#setup #setup-start #setup-start-gamelink", null, function () {
                                                notify("#canvas-notifier", getString("appScreenTeamplaySetupStartButtonError", "!"), NOTIFICATION_PRIO_HIGH, 6000, null, null, client.height);
                                            });
                                        };
                                    }
                                    else {
                                        showNewGameLink();
                                        notify("#canvas-notifier", getString("appScreenTeamplayCreateError", "!"), NOTIFICATION_PRIO_HIGH, 6000, function () {
                                            followLink("error#tp-connection", "_self", LINK_STATE_INTERNAL_HTML);
                                        }, getString("appScreenFurtherInformation"), client.height);
                                    }
                                    break;
                                case "join":
                                    if (json.sessionId == onlineGame.sessionId) {
                                        if (json.errorLevel === 0) {
                                            onlineGame.locomotive = false;
                                            showStartGame(json.message);
                                        }
                                        else {
                                            showNewGameLink();
                                            notify("#canvas-notifier", getString("appScreenTeamplayJoinError", "!"), NOTIFICATION_PRIO_HIGH, 6000, function () {
                                                followLink("error#tp-join", "_self", LINK_STATE_INTERNAL_HTML);
                                            }, getString("appScreenFurtherInformation"), client.height);
                                        }
                                    }
                                    else {
                                        if (json.errorLevel === 0) {
                                            showStartGame(json.message);
                                        }
                                        else {
                                            showNewGameLink();
                                            notify("#canvas-notifier", getString("appScreenTeamplayJoinTeammateError", "!"), NOTIFICATION_PRIO_HIGH, 6000, function () {
                                                followLink("error#tp-connection", "_self", LINK_STATE_INTERNAL_HTML);
                                            }, getString("appScreenFurtherInformation"), client.height);
                                        }
                                    }
                                    break;
                                case "start":
                                    if (json.errorLevel < 2) {
                                        switch (json.message) {
                                            case "wait":
                                                if (json.sessionId == onlineGame.sessionId) {
                                                    var parent = document.querySelector("#game");
                                                    var elem = parent.querySelector("#game-wait");
                                                    resetForElem(parent, elem);
                                                }
                                                else {
                                                    notify("#canvas-notifier", getString("appScreenTeamplayTeammateReady", "?"), NOTIFICATION_PRIO_DEFAULT, 1000, null, null, client.height);
                                                }
                                                break;
                                            case "run":
                                                onlineGame.syncing = false;
                                                if (onlineGame.syncRequest !== undefined && onlineGame.syncRequest !== null) {
                                                    window.clearTimeout(onlineGame.syncRequest);
                                                }
                                                if (onlineGame.locomotive) {
                                                    onlineGame.syncRequest = window.setTimeout(sendSyncRequest, onlineGame.syncInterval);
                                                }
                                                var parent = document.querySelector("#game");
                                                var elem = parent.querySelector("#game-gameplay");
                                                resetForElem(parent, elem);
                                                calcMenusAndBackground("resize");
                                                break;
                                        }
                                    }
                                    else {
                                        showNewGameLink();
                                        notify("#canvas-notifier", getString("appScreenTeamplayStartError", "!"), NOTIFICATION_PRIO_HIGH, 6000, function () {
                                            followLink("error#tp-connection", "_self", LINK_STATE_INTERNAL_HTML);
                                        }, getString("appScreenFurtherInformation"), client.height);
                                    }
                                    break;
                                case "action":
                                    var json = JSON.parse(message.data);
                                    var input = JSON.parse(json.message);
                                    var notifyArr = [];
                                    if (typeof input.notification == "object" && Array.isArray(input.notification)) {
                                        input.notification.forEach(function (elem) {
                                            if (typeof elem == "object" && Array.isArray(elem.getString)) {
                                                notifyArr.push(getString.apply(null, elem.getString));
                                            }
                                            else if (typeof elem == "string") {
                                                notifyArr.push(elem);
                                            }
                                        });
                                        var notifyStr = formatJSString.apply(null, notifyArr);
                                        if (onlineGame.sessionId != json.sessionId) {
                                            notifyStr = json.sessionName + ": " + notifyStr;
                                        }
                                        if (onlineGame.sessionId != json.sessionId || !input.notificationOnlyForOthers) {
                                            notify("#canvas-notifier", notifyStr, NOTIFICATION_PRIO_DEFAULT, 1000, null, null, client.y + menus.outerContainer.height);
                                        }
                                    }
                                    switch (input.objectName) {
                                        case "trains":
                                            if (onlineGame.sessionId != json.sessionId) {
                                                onlineGame.excludeFromSync["t"].forEach(function (key) {
                                                    input.params.forEach(function (param, paramNo) {
                                                        if (Object.keys(param)[0] == key) {
                                                            delete input.params[paramNo];
                                                        }
                                                    });
                                                });
                                            }
                                            animateWorker.postMessage({ k: "train", i: input.index, params: input.params });
                                            break;
                                        case "train-crash":
                                            if (onlineGame.syncRequest !== undefined && onlineGame.syncRequest !== null) {
                                                window.clearTimeout(onlineGame.syncRequest);
                                            }
                                            if (onlineGame.locomotive) {
                                                onlineGame.syncRequest = window.setTimeout(sendSyncRequest, 200);
                                            }
                                            break;
                                        case "switches":
                                            var obj = switches[input.index[0]][input.index[1]];
                                            input.params.forEach(function (param) {
                                                obj[Object.keys(param)[0]] = Object.values(param)[0];
                                            });
                                            obj.lastStateChange = frameNo;
                                            animateWorker.postMessage({ k: "switches", switches: switches });
                                            break;
                                    }
                                    break;
                                case "sync-request":
                                    var json = JSON.parse(message.data);
                                    var json_message = JSON.parse(json.message);
                                    onlineGame.syncingCounter = 0;
                                    onlineGame.syncingCounterFinal = parseInt(json_message.number, 10);
                                    onlineGame.syncing = true;
                                    animateWorker.postMessage({ k: "sync-request" });
                                    break;
                                case "sync-ready":
                                    if (onlineGame.locomotive) {
                                        sendSyncData();
                                    }
                                    break;
                                case "sync-task":
                                    if (onlineGame.syncing) {
                                        onlineGame.syncingCounter++;
                                        var json = JSON.parse(message.data);
                                        var task = JSON.parse(json.message);
                                        switch (task.o) {
                                            case "t":
                                                animateWorker.postMessage({ k: "sync-t", i: task.i, d: task.d });
                                                break;
                                            case "tc":
                                                animateWorker.postMessage({ k: "sync-tc", i: task.i, d: task.d });
                                                break;
                                            case "s":
                                                Object.keys(task.d).forEach(function (key) {
                                                    Object.keys(switches[key]).forEach(function (currentKey) {
                                                        switches[key][currentKey].turned = task["d"][key][currentKey].turned;
                                                    });
                                                });
                                                animateWorker.postMessage({ k: "switches", switches: switches });
                                                break;
                                        }
                                        if (onlineGame.syncingCounter == onlineGame.syncingCounterFinal) {
                                            onlineConnection.send({ mode: "sync-done" });
                                        }
                                    }
                                    break;
                                case "sync-done":
                                    onlineGame.syncing = false;
                                    if (json.message == "sync-cancel") {
                                        notify("#canvas-notifier", getString("appScreenTeamplaySyncError", "."), NOTIFICATION_PRIO_HIGH, 900, null, null, client.y + menus.outerContainer.height);
                                    }
                                    if (!onlineGame.stop) {
                                        if (onlineGame.syncRequest !== undefined && onlineGame.syncRequest !== null) {
                                            window.clearTimeout(onlineGame.syncRequest);
                                        }
                                        if (onlineGame.locomotive) {
                                            onlineGame.syncRequest = window.setTimeout(sendSyncRequest, onlineGame.syncInterval);
                                        }
                                        animateWorker.postMessage({ k: "resume" });
                                    }
                                    break;
                                case "pause":
                                    if (onlineGame.syncRequest !== undefined && onlineGame.syncRequest !== null) {
                                        window.clearTimeout(onlineGame.syncRequest);
                                    }
                                    onlineGame.stop = true;
                                    playAndPauseAudio();
                                    animateWorker.postMessage({ k: "pause" });
                                    notify("#canvas-notifier", getString("appScreenTeamplayGamePaused", "."), NOTIFICATION_PRIO_HIGH, 900, null, null, client.y + menus.outerContainer.height);
                                    break;
                                case "resume":
                                    if (onlineGame.stop) {
                                        if (onlineGame.syncRequest !== undefined && onlineGame.syncRequest !== null) {
                                            window.clearTimeout(onlineGame.syncRequest);
                                        }
                                        if (onlineGame.locomotive) {
                                            onlineGame.syncRequest = window.setTimeout(sendSyncRequest, onlineGame.syncInterval);
                                        }
                                        onlineGame.stop = false;
                                        playAndPauseAudio();
                                        notify("#canvas-notifier", getString("appScreenTeamplayGameResumed", "."), NOTIFICATION_PRIO_HIGH, 900, null, null, client.y + menus.outerContainer.height);
                                        animateWorker.postMessage({ k: "resume" });
                                    }
                                    break;
                                case "leave":
                                    if (json.errorLevel == 2) {
                                        showNewGameLink();
                                        notify("#canvas-notifier", getString("appScreenTeamplayTeammateLeft", "."), NOTIFICATION_PRIO_HIGH, 900, null, null, client.height);
                                    }
                                    else {
                                        notify("#canvas-notifier", json.sessionName + ": " + getString("appScreenTeamplaySomebodyLeft", "."), NOTIFICATION_PRIO_HIGH, 900, null, null, client.y + menus.outerContainer.height);
                                    }
                                    break;
                                case "chat-msg":
                                    chatInnerNone_1.style.display = "none";
                                    chatReactions_1.style.display = "";
                                    var chatInnerContainerMsg = document.createElement("div");
                                    var chatInnerPlayerName = document.createElement(onlineGame.sessionId != json.sessionId ? "i" : "b");
                                    var isSticker = json.message.match(/^\{\{sticker=[0-9]+\}\}$/);
                                    var isTrainSticker = json.message.match(/^\{\{stickerTrain=[0-9]+\}\}$/);
                                    var chatInnerMessageImg = document.createElement("img");
                                    var chatInnerMessage = document.createElement("p");
                                    var chatInnerSeparator = document.createElement("br");
                                    chatInnerContainerMsg.className = "chat-inner-container";
                                    chatInnerPlayerName.textContent = (onlineGame.sessionId != json.sessionId ? json.sessionName : json.sessionName + " (" + getString("appScreenTeamplayChatMe") + ")") + " - " + new Date().toLocaleTimeString();
                                    if (isSticker || isTrainSticker) {
                                        var stickerNumber = json.message.replace(/[^0-9]/g, "");
                                        if ((isSticker && stickerNumber < onlineGame.chatSticker) || (isTrainSticker && stickerNumber < trains.length)) {
                                            chatInnerMessageImg.src = "./assets/chat_" + (isTrainSticker ? "train_" : "sticker_") + stickerNumber + ".png";
                                            chatInnerMessageImg.className = isTrainSticker ? "train-sticker" : "sticker";
                                            json.message = isTrainSticker ? getString(["appScreenTrainIcons", parseInt(stickerNumber, 10)]) + " " + getString(["appScreenTrainNames", parseInt(stickerNumber, 10)]) : formatJSString(getString("appScreenTeamplayChatStickerNote"), getString(["appScreenTeamplayChatStickerEmojis", parseInt(stickerNumber, 10)]));
                                        }
                                        else {
                                            isSticker = isTrainSticker = false;
                                        }
                                    }
                                    chatInnerMessage.textContent = json.message;
                                    chatInnerContainerMsg.appendChild(chatInnerPlayerName);
                                    chatInnerContainerMsg.appendChild(chatInnerSeparator);
                                    if (isSticker || isTrainSticker) {
                                        chatInnerContainerMsg.appendChild(chatInnerMessageImg);
                                    }
                                    if (!isSticker) {
                                        chatInnerContainerMsg.appendChild(chatInnerMessage);
                                    }
                                    chatInner_1.appendChild(chatInnerContainerMsg);
                                    if (onlineGame.sessionId != json.sessionId && chat_1.style.display == "") {
                                        notify("#tp-chat-notifier", json.sessionName + ": " + json.message, NOTIFICATION_PRIO_DEFAULT, 4000, null, null, client.height, NOTIFICATION_CHANNEL_TEAMPLAY_CHAT + json.sessionId);
                                    }
                                    chat_1.resizeChat();
                                    break;
                                case "unknown":
                                    notify("#canvas-notifier", getString("appScreenTeamplayUnknownRequest", "."), NOTIFICATION_PRIO_HIGH, 2000, null, null, client.y + menus.outerContainer.height);
                                    break;
                            }
                        };
                        onlineConnection.socket.onerror = function () {
                            showNewGameLink();
                            notify("#canvas-notifier", getString("appScreenTeamplayConnectionError", "!"), NOTIFICATION_PRIO_HIGH, 6000, function () {
                                followLink("error#tp-connection", "_self", LINK_STATE_INTERNAL_HTML);
                            }, getString("appScreenFurtherInformation"), client.height);
                        };
                    };
                    onlineConnection.send = function (obj) {
                        onlineConnection.socket.send(JSON.stringify(obj));
                    };
                    onlineGame.gameKey = getQueryString("key");
                    onlineGame.gameId = getQueryString("id");
                    document.getElementById("setup").addEventListener("mousemove", function (event) {
                        document.getElementById("setup-ball").style.left = event.pageX + "px";
                        document.getElementById("setup-ball").style.top = event.pageY + "px";
                    });
                    document.getElementById("setup").addEventListener("mouseout", function (event) {
                        document.getElementById("setup-ball").style.left = "-1vw";
                        document.getElementById("setup-ball").style.top = "-1vw";
                    });
                    onlineConnection.connect(onlineConnection.serverURI);
                }
                else {
                    document.addEventListener("visibilitychange", function () {
                        if (document.visibilityState == "hidden") {
                            animateWorker.postMessage({ k: "pause" });
                        }
                        else {
                            animateWorker.postMessage({ k: "resume" });
                        }
                    });
                }
                //Initialize trains
                rotationPoints = message.data.rotationPoints;
                trains = message.data.trains;
                trains.forEach(function (train, i) {
                    var trainCallback = function (downIntersects, upIntersects) {
                        if (hardware.lastInputTouch < hardware.lastInputMouse) {
                            hardware.mouse.isHold = false;
                        }
                        if ((hardware.lastInputTouch < hardware.lastInputMouse && hardware.mouse.downTime - hardware.mouse.upTime > 0 && upIntersects && downIntersects && hardware.mouse.downTime - hardware.mouse.upTime < doubleClickTime && !hardware.mouse.lastClickDoubleClick) || (hardware.lastInputTouch > hardware.lastInputMouse && downIntersects && Date.now() - hardware.mouse.downTime > longTouchTime)) {
                            if (typeof clickTimeOut !== "undefined") {
                                window.clearTimeout(clickTimeOut);
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
                            if (typeof clickTimeOut !== "undefined") {
                                window.clearTimeout(clickTimeOut);
                                clickTimeOut = null;
                            }
                            clickTimeOut = window.setTimeout(function () {
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
                    var loaderGLTF = new GLTFLoader();
                    loaderGLTF.setPath("assets/3d/").load("asset" + train.src + ".glb", function (gltf) {
                        trains3D[i].mesh = gltf.scene;
                        trains3D[i].resize = function () {
                            var scale = three.calcScale();
                            trains3D[i].mesh.scale.set(scale * (trains[i].width / background.width), scale * (trains[i].width / background.width), scale * (trains[i].width / background.width));
                            if (train.assetFlip) {
                                trains3D[i].mesh.scale.x *= -1;
                            }
                            trains3D[i].mesh.position.set(0, 0, 0);
                            trains3D[i].positionZ = new THREE.Box3().setFromObject(trains3D[i].mesh).getSize(new THREE.Vector3()).z / 2;
                        };
                        trains3D[i].resize();
                        trains3D[i].mesh.callback = trainCallback;
                        three.mainGroup.add(trains3D[i].mesh);
                    }, null, function () {
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
                    });
                    trains3D[i].cars = [];
                    train.cars.forEach(function (car, j) {
                        trains3D[i].cars[j] = {};
                        var loaderGLTF = new GLTFLoader();
                        loaderGLTF.setPath("assets/3d/").load("asset" + car.src + ".glb", function (gltf) {
                            trains3D[i].cars[j].mesh = gltf.scene;
                            trains3D[i].cars[j].resize = function () {
                                var scale = three.calcScale();
                                trains3D[i].cars[j].mesh.scale.set(scale * (trains[i].cars[j].width / background.width), scale * (trains[i].cars[j].width / background.width), scale * (trains[i].cars[j].width / background.width));
                                if (car.assetFlip) {
                                    trains3D[i].cars[j].mesh.scale.x *= -1;
                                }
                                trains3D[i].cars[j].mesh.position.set(0, 0, 0);
                                trains3D[i].cars[j].positionZ = new THREE.Box3().setFromObject(trains3D[i].cars[j].mesh).getSize(new THREE.Vector3()).z / 2;
                            };
                            trains3D[i].cars[j].resize();
                            trains3D[i].cars[j].mesh.callback = trainCallback;
                            three.mainGroup.add(trains3D[i].cars[j].mesh);
                        }, null, function () {
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
                        });
                    });
                });
                cars.forEach(function (car, i) {
                    var carCallback = function (downIntersects, upIntersects) {
                        if (hardware.lastInputTouch < hardware.lastInputMouse) {
                            hardware.mouse.isHold = false;
                        }
                        if ((hardware.lastInputTouch < hardware.lastInputMouse && hardware.mouse.downTime - hardware.mouse.upTime > 0 && upIntersects && downIntersects && hardware.mouse.downTime - hardware.mouse.upTime < doubleClickTime && !hardware.mouse.lastClickDoubleClick) || (hardware.lastInputTouch > hardware.lastInputMouse && downIntersects && Date.now() - hardware.mouse.downTime > longTouchTime)) {
                            if (typeof clickTimeOut !== "undefined") {
                                window.clearTimeout(clickTimeOut);
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
                            if (typeof clickTimeOut !== "undefined") {
                                window.clearTimeout(clickTimeOut);
                                clickTimeOut = null;
                            }
                            clickTimeOut = window.setTimeout(function () {
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
                    var loaderGLTF = new GLTFLoader();
                    loaderGLTF.setPath("assets/3d/").load("asset" + car.src + ".glb", function (gltf) {
                        cars3D[i].mesh = gltf.scene;
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
                    }, null, function () {
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
                    });
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
                    three.mainGroup.add(cars3D[i].meshParkingLot);
                });
                if (!gui.demo) {
                    Object.keys(switches).forEach(function (key) {
                        switches3D[key] = {};
                        Object.keys(switches[key]).forEach(function (currentKey) {
                            switches3D[key][currentKey] = {};
                            var radius = 0.01;
                            var length = radius * 1.25;
                            var height3D = 0.0005;
                            var meshCallback = function () {
                                if (typeof clickTimeOut !== "undefined") {
                                    window.clearTimeout(clickTimeOut);
                                    clickTimeOut = null;
                                }
                                clickTimeOut = window.setTimeout(function () {
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
                drawOptionsMenu("show");
                //Trigger resize
                window.addEventListener("resize", requestResize);
                requestResize();
                //Initialize canvas
                drawInterval = message.data.animateInterval;
                drawObjects();
                document.addEventListener("visibilitychange", function () {
                    if (document.visibilityState != "hidden") {
                        if (drawTimeout !== undefined && drawTimeout !== null) {
                            window.clearTimeout(drawTimeout);
                        }
                        drawObjects();
                    }
                });
                //Gestures
                if (gui.demo) {
                    window.setTimeout(function () {
                        if (carParams.autoModeRuns) {
                            window.sessionStorage.setItem("demoCars", JSON.stringify(cars));
                            window.sessionStorage.setItem("demoCarParams", JSON.stringify(carParams));
                            window.sessionStorage.setItem("demoBg", JSON.stringify(background));
                        }
                        followLink(window.location.href, "_self", LINK_STATE_INTERNAL_HTML);
                    }, 90000);
                    if (!demoMode.standalone) {
                        document.addEventListener("keyup", function (event) {
                            if (event.key == "Escape") {
                                switchMode();
                            }
                        });
                        document.addEventListener("touchstart", demoMode.leaveTimeoutStart, { passive: false });
                        document.addEventListener("touchend", demoMode.leaveTimeoutEnd, { passive: false });
                        document.addEventListener("mousedown", demoMode.leaveTimeoutStart, { passive: false });
                        document.addEventListener("mouseup", demoMode.leaveTimeoutEnd, { passive: false });
                    }
                }
                else {
                    canvasForeground.addEventListener("touchmove", getTouchMove, { passive: false });
                    canvasForeground.addEventListener("touchstart", getTouchStart, { passive: false });
                    canvasForeground.addEventListener("touchend", getTouchEnd, { passive: false });
                    canvasForeground.addEventListener("touchcancel", getTouchCancel);
                    canvasForeground.addEventListener("mousemove", onMouseMove);
                    canvasForeground.addEventListener("mousedown", onMouseDown, { passive: false });
                    canvasForeground.addEventListener("mouseup", onMouseUp, { passive: false });
                    canvasForeground.addEventListener("mouseout", onMouseOut, { passive: false });
                    canvasForeground.addEventListener("mouseenter", onMouseEnter);
                    canvasForeground.addEventListener("contextmenu", onMouseRight, { passive: false });
                    canvasForeground.addEventListener("wheel", onMouseWheel, { passive: false });
                    document.addEventListener("keydown", onKeyDown);
                    document.addEventListener("keyup", onKeyUp);
                    document.removeEventListener("wheel", preventMouseZoomDuringLoad);
                    document.removeEventListener("keydown", preventKeyZoomDuringLoad);
                }
                document.removeEventListener("keyup", preventKeyZoomDuringLoad);
                //Show everything
                var timeWait = 0.5;
                var timeLoad = 1.5;
                if (gui.demo) {
                    window.clearInterval(loadingAnimElemChangingFilter);
                }
                window.setTimeout(function () {
                    destroy([document.querySelector("#snake"), document.querySelector("#percent")]);
                    var event = new CustomEvent("moroway-app-ready");
                    document.dispatchEvent(event);
                    var toHide = document.querySelector("#branding");
                    if (toHide != null && !onlineGame.enabled) {
                        toHide.style.transition = "opacity " + timeLoad + "s ease-in";
                        toHide.style.opacity = "0";
                        window.setTimeout(function () {
                            var localAppData = getLocalAppDataCopy();
                            if (getSetting("classicUI") && !classicUI.trainSwitch.selectedTrainDisplay.visible && !gui.demo && !gui.three) {
                                notify("#canvas-notifier", formatJSString(getString("appScreenTrainSelected", "."), getString(["appScreenTrainNames", trainParams.selected]), getString("appScreenTrainSelectedAuto", " ")), NOTIFICATION_PRIO_HIGH, 3000, null, null, client.y + menus.outerContainer.height);
                            }
                            else if (localAppData != null && (localAppData.version.major < APP_DATA.version.major || (localAppData.version.major == APP_DATA.version.major && localAppData.version.minor < APP_DATA.version.minor)) && !gui.demo) {
                                var event_2 = new CustomEvent("moroway-app-update-notification", { detail: { notifyMinHeight: client.y + menus.outerContainer.height } });
                                document.dispatchEvent(event_2);
                            }
                            else if (!gui.demo) {
                                var event_3 = new CustomEvent("moroway-app-ready-notification", { detail: { notifyMinHeight: client.y + menus.outerContainer.height } });
                                document.dispatchEvent(event_3);
                            }
                            setLocalAppDataCopy();
                            destroy(toHide);
                        }, timeLoad * 900);
                    }
                }, timeWait * 1000);
            }
            else if (message.data.k == "setTrains") {
                rotationPoints = message.data.rotationPoints;
                message.data.trains.forEach(function (train, i) {
                    trains[i].x = train.x;
                    trains[i].y = train.y;
                    trains[i].front.state = train.front.state;
                    trains[i].front.state = train.front.state;
                    trains[i].back.state = train.back.state;
                    trains[i].back.state = train.back.state;
                    if (APP_DATA.debug) {
                        trains[i].front.x = train.front.x;
                        trains[i].front.y = train.front.y;
                        trains[i].front.angle = train.front.angle;
                        trains[i].back.x = train.back.x;
                        trains[i].back.y = train.back.y;
                        trains[i].back.angle = train.back.angle;
                    }
                    trains[i].width = train.width;
                    trains[i].height = train.height;
                    trains[i].displayAngle = train.displayAngle;
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
                        trains[i].cars[j].front.state = car.front.state;
                        trains[i].cars[j].back.state = car.back.state;
                        trains[i].cars[j].back.state = car.back.state;
                        if (APP_DATA.debug) {
                            trains[i].cars[j].front.x = car.front.x;
                            trains[i].cars[j].front.y = car.front.y;
                            trains[i].cars[j].front.angle = car.front.angle;
                            trains[i].cars[j].back.x = car.back.x;
                            trains[i].cars[j].back.y = car.back.y;
                            trains[i].cars[j].back.angle = car.back.angle;
                        }
                    });
                    if (train.move && !train.mute && audio.active) {
                        if (!existsAudio("train", i)) {
                            startAudio("train", i, true);
                        }
                        if (train.currentSpeedInPercent == undefined) {
                            train.currentSpeedInPercent = 0;
                        }
                        setAudioVolume("train", i, train.volume);
                    }
                    else if (existsAudio("train", i)) {
                        stopAudio("train", i);
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
                    if (!gui.demo) {
                        Object.keys(switches).forEach(function (key) {
                            Object.keys(switches[key]).forEach(function (currentKey) {
                                switches3D[key][currentKey].resize();
                            });
                        });
                    }
                    if (onlineGame.enabled) {
                        if (onlineGame.resizedTimeout != undefined && onlineGame.resizedTimeout != null) {
                            window.clearTimeout(onlineGame.resizedTimeout);
                        }
                        onlineGame.resizedTimeout = window.setTimeout(function () {
                            onlineGame.resized = false;
                        }, 3000);
                    }
                    resized = false;
                    if (APP_DATA.debug) {
                        animateWorker.postMessage({ k: "debug" });
                    }
                }
            }
            else if (message.data.k == "trainCrash") {
                actionSync("trains", message.data.i, [{ move: false }, { accelerationSpeed: 0 }, { accelerationSpeedCustom: 1 }], [{ getString: ["appScreenObjectHasCrashed", "."] }, { getString: [["appScreenTrainNames", message.data.i]] }, { getString: [["appScreenTrainNames", message.data.j]] }]);
                actionSync("train-crash");
                if (existsAudio("trainCrash")) {
                    stopAudio("trainCrash");
                }
                if (audio.active) {
                    startAudio("trainCrash", null, false);
                }
            }
            else if (message.data.k == "switches") {
                switches = message.data.switches;
            }
            else if (message.data.k == "sync-ready") {
                rotationPoints = message.data.rotationPoints;
                trains = message.data.trains;
                teamplaySync("sync-ready");
            }
            else if (message.data.k == "save-game") {
                if (getSetting("saveGame") && !onlineGame.enabled && !gui.demo) {
                    try {
                        window.localStorage.setItem("morowayAppSavedGame_v-" + getVersionCode() + "_Trains", JSON.stringify(message.data.saveTrains));
                        var saveSwitches = {};
                        Object.keys(switches).forEach(function (key) {
                            saveSwitches[key] = {};
                            Object.keys(switches[key]).forEach(function (side) {
                                saveSwitches[key][side] = switches[key][side].turned;
                            });
                        });
                        window.localStorage.setItem("morowayAppSavedGame_v-" + getVersionCode() + "_Switches", JSON.stringify(saveSwitches));
                        if (cars.length == carWays.length && cars.length > 0) {
                            window.localStorage.setItem("morowayAppSavedGame_v-" + getVersionCode() + "_Cars", JSON.stringify(cars));
                            window.localStorage.setItem("morowayAppSavedGame_v-" + getVersionCode() + "_CarParams", JSON.stringify(carParams));
                        }
                        window.localStorage.setItem("morowayAppSavedGame_v-" + getVersionCode() + "_Bg", JSON.stringify(background));
                    }
                    catch (e) {
                        if (APP_DATA.debug) {
                            console.log(e.name + "/" + e.message);
                        }
                        notify("#canvas-notifier", getString("appScreenSaveGameError", "."), NOTIFICATION_PRIO_HIGH, 1000, null, null, client.y + menus.outerContainer.height);
                    }
                    animateWorker.postMessage({ k: "game-saved" });
                }
            }
            else if (message.data.k == "debug") {
                switchesBeforeFac = message.data.switchesBeforeFac;
                switchesBeforeAddSidings = message.data.switchesBeforeAddSidings;
                if (!debug.trainReady) {
                    console.log("Animate Interval:", message.data.animateInterval);
                }
                console.log("Trains: ", message.data.trains);
            }
            else if (message.data.k == "debugDrawPoints") {
                debug.drawPoints = message.data.p;
                debug.drawPointsCrash = message.data.pC;
                debug.trainCollisions = message.data.tC;
                debug.trainReady = true;
            }
        };
        animateWorker.postMessage({ k: "start", background: background, switches: switches, online: onlineGame.enabled, onlineInterval: onlineGame.animateInterval, demo: gui.demo });
    }
    function resetForElem(parent, elem, to) {
        if (to === void 0) { to = ""; }
        var elements = parent.childNodes;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].nodeName.substr(0, 1) != "#") {
                elements[i].style.display = elements[i] == elem ? to : "none";
            }
        }
    }
    function destroy(toDestroyElements) {
        if (typeof toDestroyElements == "object") {
            if (!Array.isArray(toDestroyElements)) {
                toDestroyElements = [toDestroyElements];
            }
            toDestroyElements.forEach(function (toDestroy) {
                if (toDestroy != null) {
                    toDestroy.parentNode.removeChild(toDestroy);
                }
            });
        }
    }
    function loadingImageAnimation() {
        var loadingAnimElem = document.querySelector("#branding img");
        var loadingAnimElemDefaultFilter = "blur(1px) saturate(5) sepia(1) hue-rotate({{0}}deg)";
        loadingAnimElem.style.transition = "filter 0.08s";
        loadingAnimElem.style.filter = formatJSString(loadingAnimElemDefaultFilter, Math.random() * 260 + 100);
        return window.setInterval(function () {
            loadingAnimElem.style.filter = formatJSString(loadingAnimElemDefaultFilter, Math.random() * 260 + 100);
        }, 10);
    }
    function keepScreenAlive() {
        var event = new CustomEvent("moroway-app-keep-screen-alive", { detail: { acquire: document.visibilityState == "visible" } });
        document.dispatchEvent(event);
    }
    var queryStringMode = getQueryString("mode");
    //Set mode: demo
    gui.demo = queryStringMode == "demo" || queryStringMode == "demoStandalone" || (getSetting("startDemoMode") && queryStringMode == "");
    if (gui.demo) {
        document.body.style.cursor = "none";
        var loadingAnimElemChangingFilter = loadingImageAnimation();
        demoMode.standalone = queryStringMode == "demoStandalone";
    }
    //Set mode: multiplay
    if (queryStringMode == "multiplay") {
        if ("WebSocket" in window) {
            onlineGame.enabled = true;
            var loadingAnimElemChangingFilter = loadingImageAnimation();
        }
        else {
            onlineGame.enabled = false;
            notify("#canvas-notifier", getString("appScreenTeamplayNoWebsocket", "!", "upper"), NOTIFICATION_PRIO_HIGH, 6000, null, null, client.y + menus.outerContainer.height);
        }
    }
    else {
        onlineGame.enabled = false;
    }
    //GUI State
    var queryString3D = getQueryString("gui-3d");
    if (queryString3D == "0" || queryString3D == "1") {
        gui.three = getGuiState("3d", queryString3D == "1");
    }
    else {
        gui.three = getGuiState("3d");
    }
    var queryString3DNight = getQueryString("gui-3d-night");
    if (queryString3DNight == "0" || queryString3DNight == "1") {
        three.night = getGuiState("3d-night", queryString3DNight == "1");
    }
    else {
        three.night = getGuiState("3d-night");
    }
    three.demoRotationSpeedFac = getGuiState("3d-rotation-speed", parseInt(getQueryString("gui-demo-3d-rotation-speed-percent"), 10));
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
    //Input handling
    hardware.lastInputMouse = hardware.lastInputTouch = 0;
    document.addEventListener("wheel", preventMouseZoomDuringLoad, { passive: false });
    document.addEventListener("keydown", preventKeyZoomDuringLoad, { passive: false });
    document.addEventListener("keyup", preventKeyZoomDuringLoad, { passive: false });
    //Visibility handling
    document.addEventListener("visibilitychange", onVisibilityChange);
    onVisibilityChange();
    document.addEventListener("visibilitychange", keepScreenAlive);
    keepScreenAlive();
    //Prepare game
    if (!onlineGame.enabled) {
        var elements = document.querySelectorAll("#content > *:not(#game), #game > *:not(#game-gameplay)");
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = "none";
        }
        elements = document.querySelectorAll("#content > #game, #game > #game-gameplay");
        for (i = 0; i < elements.length; i++) {
            elements[i].style.display = "block";
        }
    }
    measureViewSpace();
    if (getSetting("saveGame")) {
        updateSavedGame();
    }
    else {
        removeSavedGame();
    }
    //Show progress bar if app loads slowly
    window.setTimeout(function () {
        var toShowElements = [document.querySelector("#percent")];
        toShowElements.forEach(function (toShow) {
            if (toShow != null) {
                toShow.style.display = "block";
            }
        });
    }, 2500);
    //Load app
    var defaultPics = copyJSObject(pics);
    var finalPicNo = defaultPics.length;
    pics = [];
    var loadNo = 0;
    defaultPics.forEach(function (pic) {
        pics[pic.id] = new Image();
        pics[pic.id].src = "assets/asset" + pic.id + "." + pic.extension;
        pics[pic.id].onload = function () {
            loadNo++;
            var cPercent = Math.round(100 * (loadNo / finalPicNo));
            var elementPercentText = document.querySelector("#percent #percent-text");
            var elementPercentProgress = document.querySelector("#percent #percent-progress");
            if (elementPercentText != null && elementPercentProgress != null) {
                elementPercentText.textContent = cPercent + "%";
                elementPercentProgress.style.left = -100 + cPercent + "%";
            }
            if (loadNo == finalPicNo) {
                initialDisplay();
            }
        };
        pics[pic.id].onerror = function () {
            notify("#canvas-notifier", getString("generalIsFail", "!", "upper"), NOTIFICATION_PRIO_HIGH, 950, null, null, client.height);
            window.setTimeout(function () {
                followLink("error#pic", "_self", LINK_STATE_INTERNAL_HTML);
            }, 1000);
        };
    });
};
document.addEventListener("DOMContentLoaded", function () {
    setHTMLStrings();
    initTooltips();
});
