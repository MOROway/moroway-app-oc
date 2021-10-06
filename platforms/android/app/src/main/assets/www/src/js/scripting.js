"use strict";

/******************************************
*             helper functions            *
******************************************/

function extendedMeasureViewspace() {
    client.isSmall = measureViewspace(1).isSmallDevice;
    client.isTiny = measureViewspace(2).isTinyDevice;
    client.devicePixelRatio = window.devicePixelRatio;
    client.width = window.innerWidth;
    client.height = window.innerHeight;
    canvasForeground.style.width = canvasSemiForeground.style.width = canvasBackground.style.width = canvas.style.width = window.innerWidth + "px";
    canvasForeground.style.height = canvasSemiForeground.style.height = canvasBackground.style.height = canvas.style.height = window.innerHeight + "px";
    canvasForeground.width = canvasSemiForeground.width = canvasBackground.width = canvas.width = window.innerWidth * client.devicePixelRatio;
    canvasForeground.height = canvasSemiForeground.height = canvasBackground.height = canvas.height = window.innerHeight * client.devicePixelRatio;
}

function drawImage(pic,x,y,width,height, cxt){
    if( cxt == undefined) {
        cxt = context;
    }
    cxt.drawImage(pic,Math.floor(x),Math.floor(y),Math.floor(width),Math.floor(height));
}

function measureFontSize(t,f,a,b,c, d, r){
    context.save();
    var font = (a) + "px " + f;
    context.font = font;
    var twidth = context.measureText(t).width;
    context.restore();
    if(twidth != b && (Math.abs(twidth-b) > d && r < 100)){
        a *= (twidth > b) ? (1-c/100) : (1+c/100);
        return measureFontSize(t,f,a,b,c,d, ++r);
    } else {
        return font;
    }
}

function getFontSize(f, a){
    return parseInt(f.substr(0,f.length-(f.length-f.indexOf(a))), 10);
}

/******************************************
*        mouse touch key functions        *
******************************************/

function getGesture(gesture){
    switch(gesture.type) {
    case "doubletap":
        if(client.lastTouchScale != 1 || client.touchScale != 1) {
            client.lastTouchScale = 1;
            client.touchScale = 1;
        } else {
            client.touchScale = client.realScale = client.realScaleMax/2;
            client.touchScaleX = (canvas.width/2-gesture.deltaX)*client.realScale;
            client.touchScaleY = (canvas.height/2-gesture.deltaY)*client.realScale;
        }
        delete gesture.deltaX;
        delete gesture.deltaY;
        break;
    case "pinch":
        client.touchScale = gesture.scale;
        client.touchScaleX = (canvas.width/2-gesture.deltaX)*client.realScale;
        client.touchScaleY = (canvas.height/2-gesture.deltaY)*client.realScale;
        delete gesture.deltaX;
        delete gesture.deltaY;
        break;
    case "pinchend":
        client.lastTouchScale = client.realScale;
        client.touchScale = 1;
        client.hasPinched = true;
        delete client.PinchOHypot;
        break;
    }
    var newScale = Math.max(Math.min(client.lastTouchScale * client.touchScale,client.realScaleMax),1);
    client.touchScaleX *= newScale/client.realScale;
    client.touchScaleY *= newScale/client.realScale;
    client.realScale = newScale;
    if(gesture.deltaX != undefined && gesture.deltaY != undefined && client.PinchOHypot == undefined && client.hasPinched == undefined) {
        client.touchScaleX += gesture.deltaX/4;
        client.touchScaleY += gesture.deltaY/4;
    }
    client.PinchX = canvas.width/2-client.touchScaleX/client.realScale;
    client.PinchY = canvas.height/2-client.touchScaleY/client.realScale;

    if(client.realScale < client.realScaleMin) {
        hardware.mouse.isMoving = false;
        client.realScale = 1;
        client.touchScale = 1;
        client.lastTouchScale = 1;
        client.touchScaleX=0;
        client.touchScaleY=0;
    } else {
        hardware.mouse.isMoving = true;
    }

    var xMax = (client.realScale - 1) * (canvas.width / 2-background.x/client.devicePixelRatio);
    var yMax = (client.realScale - 1) * (canvas.height / 2-background.y/client.devicePixelRatio);
    if (client.touchScaleX > xMax) {
        client.touchScaleX = xMax;
    }
    if (client.touchScaleX < -xMax) {
        client.touchScaleX = -xMax;
    }
    if (client.touchScaleY > yMax) {
        client.touchScaleY = yMax;
    }
    if (client.touchScaleY < -yMax) {
        client.touchScaleY = -yMax;
    }

    if(client.realScale == 1) {
        client.touchScaleXKeyFake = client.touchScaleYKeyFake = 0;
    }

}

function onMouseMove(event) {
    hardware.mouse.cursor = "default";
    hardware.mouse.moveX = event.clientX*client.devicePixelRatio;
    hardware.mouse.moveY = event.clientY*client.devicePixelRatio;
    if(client.realScale == 1) {
        hardware.mouse.isMoving = true;
        if(typeof movingTimeOut !== "undefined"){
            window.clearTimeout(movingTimeOut);
        }
        movingTimeOut = window.setTimeout(function(){hardware.mouse.isMoving = false;}, 5000);
    } else {
        hardware.mouse.isHold = false;
        client.PinchX = hardware.mouse.moveX+client.touchScaleXKeyFake;
        client.PinchY = hardware.mouse.moveY+client.touchScaleYKeyFake;
        client.PinchOHypot = 1;
        getGesture({type: "pinch", scale:1, deltaX:client.PinchX,deltaY:client.PinchY});
        getGesture({type: "pinchend"});
        delete client.hasPinched;
    }
}
function onMouseDown(event) {
    event.preventDefault();
    hardware.lastInputMouse = hardware.mouse.downTime = Date.now();
    hardware.mouse.isHold = (event.which == undefined || event.which == 1) && !hardware.mouse.rightClick;
    hardware.mouse.rightClickHold = (event.which == undefined || event.which == 1) && hardware.mouse.rightClick;
    hardware.mouse.moveX = hardware.mouse.downX = event.clientX*client.devicePixelRatio;
    hardware.mouse.moveY = hardware.mouse.downY = event.clientY*client.devicePixelRatio;
}
function onMouseUp(event) {
    event.preventDefault();
    hardware.mouse.upX = event.clientX*client.devicePixelRatio;
    hardware.mouse.upY = event.clientY*client.devicePixelRatio;
    hardware.mouse.upTime = Date.now();
    hardware.mouse.isHold = hardware.mouse.rightClickHold = false;
    hardware.mouse.rightClickEvent = event.which == 1 && hardware.mouse.rightClick;
}
function onMouseOut(event) {
    event.preventDefault();
    hardware.mouse.isHold = hardware.mouse.rightClickHold = false;
    hardware.mouse.cursor = "none";
}
function onMouseWheel(event) {
    event.preventDefault();
    if(event.ctrlKey && event.deltaY != 0) {
        client.PinchX = hardware.mouse.moveX+client.touchScaleXKeyFake;
        client.PinchY = hardware.mouse.moveY+client.touchScaleYKeyFake;
        if(event.deltaY < 0) {
            client.PinchOHypot = client.realScaleMin;
            getGesture({type: "pinch", scale:client.realScaleMin, deltaX:client.PinchX,deltaY:client.PinchY});
        } else {
            client.PinchOHypot = 1/client.realScaleMin;
            getGesture({type: "pinch", scale:1/client.realScaleMin, deltaX:client.PinchX,deltaY:client.PinchY});
        }
        getGesture({type: "pinchend"});
        delete client.hasPinched;
    } else {
        hardware.mouse.wheelScrolls = !hardware.mouse.rightClick;
        hardware.mouse.rightClickWheelScrolls = hardware.mouse.rightClick;
        hardware.mouse.isHold = hardware.mouse.rightClickHold = false;
        hardware.mouse.wheelX = event.clientX*client.devicePixelRatio;
        hardware.mouse.wheelY = event.clientY*client.devicePixelRatio;
        hardware.mouse.wheelScrollX = event.deltaX;
        hardware.mouse.wheelScrollY = event.deltaY;
        hardware.mouse.wheelScrollZ = event.deltaZ;
    }
}
function onMouseRight(event) {
    event.preventDefault();
    if(controlCenter.showCarCenter === null && hardware.mouse.rightClick && client.realScale == 1) {
        controlCenter.showCarCenter = true;
        notify("#canvas-notifier", getString("appScreenCarControlCenterTitle"), NOTIFICATION_PRIO_LOW, 1000,null,null, client.y, false);
    } else {
        hardware.mouse.rightClick = !hardware.mouse.rightClick;
        if(hardware.mouse.rightClick && client.realScale == 1) {
            notify("#canvas-notifier", getString("appScreenControlCenterTitle"), NOTIFICATION_PRIO_LOW, 1000,null,null, client.y, false);
        }
        hardware.mouse.rightClickEvent = false;
        hardware.mouse.rightClickWheelScrolls = false;
    }
}

function getTouchMove(event) {
    event.preventDefault();
    if( event.changedTouches.length == 1) {
        var deltaX=-2*(hardware.mouse.moveX - (event.changedTouches[0].clientX*client.devicePixelRatio));
        var deltaY=-2*(hardware.mouse.moveY - (event.changedTouches[0].clientY*client.devicePixelRatio));
        if(client.realScale > 1 && Math.max(Math.abs(deltaX), Math.abs(deltaY)) > Math.min(canvas.width, canvas.height)/10) {
            getGesture({type: "swipe", deltaX:deltaX,deltaY:deltaY});
            hardware.mouse.isHold = false;
        } else {
            hardware.mouse.moveX = (event.changedTouches[0].clientX*client.devicePixelRatio);
            hardware.mouse.moveY = (event.changedTouches[0].clientY*client.devicePixelRatio);
            hardware.mouse.isMoving = true;
            if(typeof movingTimeOut !== "undefined"){
                window.clearTimeout(movingTimeOut);
            }
            movingTimeOut = window.setTimeout(function(){hardware.mouse.isMoving = false;}, 5000);
        }
    } else if( event.changedTouches.length == 2) {
        hardware.mouse.isHold = false;
        var hypot = Math.hypot( event.changedTouches[0].clientX - event.changedTouches[1].clientX, event.changedTouches[0].clientY - event.touches[1].clientY);
        if(typeof(client.PinchOHypot) == "undefined") {
            client.PinchOHypot = hypot;
            if(client.realScale == 1) {
                client.PinchX = (event.changedTouches[0].clientX+(event.changedTouches[0].clientX, event.changedTouches[1].clientX)/2)*client.devicePixelRatio;
                client.PinchY = (event.changedTouches[0].clientY+(event.changedTouches[0].clientY, event.changedTouches[1].clientY)/2)*client.devicePixelRatio;
            }
        }
        getGesture({type: "pinch", scale:hypot/client.PinchOHypot, deltaX:client.PinchX,deltaY:client.PinchY});
    }
}
function getTouchStart(event) {
    event.preventDefault();
    delete client.hasPinched;
    var xTS = (event.changedTouches[0].clientX*client.devicePixelRatio);
    var yTS = (event.changedTouches[0].clientY*client.devicePixelRatio);
    if(Math.max(hardware.mouse.moveX,xTS) < 1.1*Math.min(hardware.mouse.moveX,xTS) && Math.max(hardware.mouse.moveY,yTS) < 1.1*Math.min(hardware.mouse.moveY,yTS) && Date.now() - hardware.mouse.downTime < 2*doubleClickTime && Date.now() - hardware.mouse.upTime < 2*doubleClickTime) {
        client.PinchX = xTS;
        client.PinchY = yTS;
        getGesture({type: "doubletap", deltaX:client.PinchX,deltaY:client.PinchY});
        hardware.mouse.isHold = false;
    } else if(event.touches.length == 3) {
        hardware.mouse.rightClickPrepare = true;
    } else {
        hardware.lastInputTouch = hardware.mouse.downTime = Date.now();
        hardware.mouse.moveX = hardware.mouse.downX =  xTS;
        hardware.mouse.moveY = hardware.mouse.downY =  yTS;
        if(hardware.mouse.isHoldTimeout !== undefined && hardware.mouse.isHoldTimeout !== null) {
            window.clearTimeout(hardware.mouse.isHoldTimeout);
        }
        hardware.mouse.isHold = !hardware.mouse.rightClick;
        hardware.mouse.rightClickHold = hardware.mouse.rightClick;
    }
}
function getTouchEnd(event) {
    event.preventDefault();
    getGesture({type: "pinchend"});
    hardware.mouse.upX = (event.changedTouches[0].clientX*client.devicePixelRatio);
    hardware.mouse.upY = (event.changedTouches[0].clientY*client.devicePixelRatio);
    hardware.mouse.upTime = Date.now();
    hardware.mouse.isHold = hardware.mouse.rightClickHold = false;
    hardware.mouse.rightClickEvent = hardware.mouse.rightClick;
    if(hardware.mouse.rightClickPrepare != undefined && hardware.mouse.rightClickPrepare) {
        if(controlCenter.showCarCenter === null && hardware.mouse.rightClick && client.realScale == 1) {
            controlCenter.showCarCenter = true;
            notify("#canvas-notifier", getString("appScreenCarControlCenterTitle"), NOTIFICATION_PRIO_LOW, 1000,null,null, client.y, false);
            hardware.mouse.rightClickPrepare = false;
        } else {
            hardware.mouse.rightClick = !hardware.mouse.rightClick;
            if(hardware.mouse.rightClick && client.realScale == 1) {
                notify("#canvas-notifier", getString("appScreenControlCenterTitle"), NOTIFICATION_PRIO_LOW, 1000,null,null, client.y, false);
            }
            hardware.mouse.rightClickEvent = hardware.mouse.rightClickHold = hardware.mouse.rightClickPrepare = false;
        }
    }

}
function getTouchLeave(event) {
    hardware.mouse.isHold = hardware.mouse.rightClickHold = false;
}

function onKeyDown(event) {
    if(event.ctrlKey && (event.key == "+" || event.key == "-" || (event.key == "0" && client.realScale > 1))) {
        event.preventDefault();
        if(client.realScale == 1) {
            client.PinchX = hardware.mouse.moveX+client.touchScaleXKeyFake;
            client.PinchY = hardware.mouse.moveY+client.touchScaleYKeyFake;
        }
        if(event.key == "+") {
            client.PinchOHypot = 2;
            getGesture({type: "pinch", scale:2, deltaX:client.PinchX,deltaY:client.PinchY});
        } else if(event.key == "-") {
            client.PinchOHypot = 0.5;
            getGesture({type: "pinch", scale:0.5, deltaX:client.PinchX,deltaY:client.PinchY});
        } else {
            getGesture({type: "doubletap", deltaX:client.PinchX,deltaY:client.PinchY});
        }
        getGesture({type: "pinchend"});
        delete client.hasPinched;
    } else if(client.realScale > 1 && isHardwareAvailable("cursorascircle") && settings.cursorascircle && (event.key == "ArrowRight" || event.key == "ArrowLeft" || event.key == "ArrowDown" || event.key == "ArrowUp")) {
        event.preventDefault();
        var oTSX=client.touchScaleX;
        var oTSY=client.touchScaleY;
        var deltaDiv = 20;
        var deltaX,deltaY;
        if(event.key == "ArrowRight") {
            deltaX=-canvas.width*client.realScale/deltaDiv;
            deltaY=0;
        } else if(event.key == "ArrowLeft") {
            deltaX=canvas.width*client.realScale/deltaDiv;
            deltaY=0;
        } else if(event.key == "ArrowUp") {
            deltaX=0;
            deltaY=canvas.height*client.realScale/deltaDiv;
        } else if(event.key == "ArrowDown") {
            deltaX=0;
            deltaY=-canvas.height*client.realScale/deltaDiv;
        }
        getGesture({type: "swipe", deltaX:deltaX,deltaY:deltaY});
        client.touchScaleXKeyFake -= (client.touchScaleX-oTSX)/client.realScale;
        client.touchScaleYKeyFake -= (client.touchScaleY-oTSY)/client.realScale;
    } else if ((event.key == "ArrowUp" && (konamistate === 0 || konamistate == 1)) || (event.key == "ArrowDown" && (konamistate == 2 || konamistate == 3)) || (event.key == "ArrowLeft" && (konamistate == 4 || konamistate == 6)) || (event.key == "ArrowRight" && (konamistate == 5 || konamistate == 7)) || (event.key == "b" && konamistate == 8)){
        if(typeof konamiTimeOut !== "undefined"){
            window.clearTimeout(konamiTimeOut);
        }
        konamistate +=1;
        konamiTimeOut = window.setTimeout(function(){konamistate = 0;}, 1000);
    } else if (event.key == "a" && konamistate == 9){
        if(typeof konamiTimeOut !== "undefined"){
            window.clearTimeout(konamiTimeOut);
        }
        konamistate = -1;
        drawBackground();
    } else {
        if(typeof konamiTimeOut !== "undefined"){
            window.clearTimeout(konamiTimeOut);
        }
        konamistate = (konamistate < 0 && konamistate > -2) ? --konamistate : 0;
        if(konamistate == 0) {
            drawBackground();
        }
    }
}

/******************************************
* Animation functions for load and resize *
******************************************/

function drawBackground() {

    ////DRAW/BACKGROUND/Margins-1/////
    contextBackground.clearRect(0, 0, canvas.width, canvas.height);
    contextBackground.setTransform(client.realScale,0,0,client.realScale,-(client.realScale-1)*canvas.width/2+client.touchScaleX,-(client.realScale-1)*canvas.height/2+client.touchScaleY);
    var pic = pics[background.src];
    var width = pic.height/pic.width - canvas.height/canvas.width < 0 ? canvas.height*(pic.width/pic.height) : canvas.width;
    var height = pic.height/pic.width - canvas.height/canvas.width < 0 ? canvas.height : canvas.width*(pic.height/pic.width);
    if(client.realScale == 1) {
        drawImage(pic, -(width-canvas.width)/2,-(height-canvas.height)/2, width,height, contextBackground);
    }
    /////DRAW/BACKGROUND/Layer-1/////
    drawImage(pic, background.x, background.y, background.width, background.height, contextBackground);

    contextSemiForeground.clearRect(0, 0, canvas.width, canvas.height);
    contextSemiForeground.setTransform(client.realScale,0,0,client.realScale,-(client.realScale-1)*canvas.width/2+client.touchScaleX,-(client.realScale-1)*canvas.height/2+client.touchScaleY);
    /////BACKGROUND/Layer-2/////
    drawImage(pics[background.secondLayer], background.x, background.y, background.width, background.height, contextSemiForeground);
    /////BACKGROUND/Margins-2////
    if(konamistate >= 0) {
        contextSemiForeground.save();
        var bgGradient = contextSemiForeground.createLinearGradient(0,0,canvas.width,canvas.height/2);
        bgGradient.addColorStop(0, "rgba(0,0,0,1)");
        bgGradient.addColorStop(0.2, "rgba(0,0,0,0.95)");
        bgGradient.addColorStop(0.4, "rgba(0,0,0,0.85)");
        bgGradient.addColorStop(0.6, "rgba(0,0,0,0.85)");
        bgGradient.addColorStop(0.8, "rgba(0,0,0,0.95)");
        bgGradient.addColorStop(1, "rgba(0,0,0,0.9)");
        contextSemiForeground.fillStyle = bgGradient;
        contextSemiForeground.fillRect(0,0,background.x,canvas.height);
        contextSemiForeground.fillRect(0,0,canvas.width,background.y);
        contextSemiForeground.fillRect(canvas.width-background.x,0,background.x,canvas.height);
        contextSemiForeground.fillRect(0,canvas.height-background.y,canvas.width,background.y);
        contextSemiForeground.restore();
    }

    /////DRAW/BACKGROUND/Konami/////
    if(konamistate < 0) {
        /////DRAW/BACKGROUND/Layer-1/////
        var imgData = contextBackground.getImageData(background.x, background.y, background.width, background.height);
        var data = imgData.data;
        for (var i = 0; i < data.length; i += 8) {
            data[i] = data[i+4] = Math.min(255,data[i] < 120 ? data[i]/1.3 : data[i]*1.1);
            data[i+1] = data[i+5] = Math.min(255,data[i+1] < 120 ? data[i+1]/1.3 : data[i+1]*1.1);
            data[i+2] = data[i+6] = Math.min(255,data[i+2] < 120 ? data[i+2]/1.3 : data[i+2]*1.1);
        }
        contextBackground.putImageData(imgData, background.x, background.y);
        /////DRAW/BACKGROUND/Layer-2/////
        imgData = contextSemiForeground.getImageData(background.x, background.y, background.width, background.height);
        data = imgData.data;
        for (i = 0; i < data.length; i += 8) {
            data[i] = data[i+4] = Math.min(255,data[i] < 120 ? data[i]/1.3 : data[i]*1.1);
            data[i+1] = data[i+5] = Math.min(255,data[i+1] < 120 ? data[i+1]/1.3 : data[i+1]*1.1);
            data[i+2] = data[i+6] = Math.min(255,data[i+2] < 120 ? data[i+2]/1.3 : data[i+2]*1.1);
        }
        contextSemiForeground.putImageData(imgData, background.x, background.y);
    }
}

function placeBackground() {

    if (canvasBackground.width / canvasBackground.height < pics[background.src].width / pics[background.src].height) {
        background.width = canvasBackground.width;
        background.height = pics[background.src].height * (canvas.width / pics[background.src].width);
        background.x = 0;
        background.y = canvasBackground.height / 2 - background.height / 2;
    } else {
        background.width = pics[background.src].width * (canvasBackground.height / pics[background.src].height);
        background.height = canvasBackground.height;
        background.x = canvasBackground.width / 2 - background.width / 2;
        background.y = 0;
    }
    client.x = background.x / client.devicePixelRatio;
    client.y = background.y / client.devicePixelRatio;

    drawBackground();

}

function placeClassicUIElements(){
    var fac = 0.042;
    classicUI.trainSwitch.width = fac * (background.width);
    classicUI.trainSwitch.height = fac * (pics[classicUI.trainSwitch.src].height * (background.width / pics[classicUI.trainSwitch.src].width));
    fac = 0.07;
    classicUI.transformer.width = fac * (background.width);
    classicUI.transformer.height = fac * (pics[classicUI.transformer.src].height * (background.width / pics[classicUI.transformer.src].width));
    fac = 0.7;
    classicUI.transformer.input.width = classicUI.transformer.input.height = fac * classicUI.transformer.width;
    fac = 0.17;
    classicUI.transformer.directionInput.width = fac * classicUI.transformer.width;
    classicUI.transformer.directionInput.height = fac * (pics[classicUI.transformer.directionInput.src].height * ( classicUI.transformer.width/ pics[classicUI.transformer.directionInput.src].width));

    classicUI.trainSwitch.x = background.x + background.width /99;
    classicUI.trainSwitch.y = background.y + background.height / 1.175;
    classicUI.transformer.x = background.x + background.width / 1.1;
    classicUI.transformer.y = background.y + background.height/1.4;
    classicUI.transformer.input.diffY = classicUI.transformer.height/6;
    classicUI.transformer.directionInput.diffX = classicUI.transformer.width*0.46-classicUI.transformer.directionInput.width;
    classicUI.transformer.directionInput.diffY = classicUI.transformer.height*0.46-classicUI.transformer.directionInput.height;

    var cwidth =  background.width*0.07;
    context.textBaseline = "middle";
    var longestName = 0;
    for (var i = 1; i < trains.length; i++){
        if (getString(["appScreenTrainNames",i]).length > getString(["appScreenTrainNames",longestName]).length){
            longestName = i;
        }
    }
    classicUI.trainSwitch.selectedTrainDisplay.font = measureFontSize(getString(["appScreenTrainNames",longestName]),"sans-serif",background.height*cwidth/background.width,cwidth, 5, background.height/100,0);
    context.font = classicUI.trainSwitch.selectedTrainDisplay.font;
    classicUI.trainSwitch.selectedTrainDisplay.width = 1.2*context.measureText(getString(["appScreenTrainNames",longestName])).width;
    classicUI.trainSwitch.selectedTrainDisplay.height = 1.6*getFontSize(classicUI.trainSwitch.selectedTrainDisplay.font, "px");
    classicUI.switches.radius = 0.02*background.width;
}

function calcControlCenter() {
    controlCenter.translateOffset = background.width/100;
    controlCenter.maxTextWidth = (background.width-2*controlCenter.translateOffset)/2;
    controlCenter.maxTextHeight = (background.height-2*controlCenter.translateOffset);
    if(controlCenter.fontSizes == undefined) {
        controlCenter.fontSizes = {};
    }
    if(controlCenter.fontSizes.trainSizes == undefined) {
        controlCenter.fontSizes.trainSizes = {};
    }
    if(controlCenter.fontSizes.trainSizes.trainNames == undefined) {
        controlCenter.fontSizes.trainSizes.trainNames = [];
    }
    if(controlCenter.fontSizes.trainSizes.trainNamesLength == undefined) {
        controlCenter.fontSizes.trainSizes.trainNamesLength = [];
    }
    contextForeground.save();
    controlCenter.fontSizes.closeTextHeight = Math.min(controlCenter.maxTextWidth/12,getFontSize(measureFontSize(getString("appScreenControlCenterClose",null,"upper"),controlCenter.fontFamily,controlCenter.maxTextWidth/12,controlCenter.maxTextHeight, 5, 1.2,0), "px"));
    controlCenter.fontSizes.trainSizes.speedTextHeight = Math.min(0.5*controlCenter.maxTextHeight/trains.length,getFontSize(measureFontSize(getString("appScreenControlCenterSpeedOff"),controlCenter.fontFamily,0.5*(controlCenter.maxTextWidth*0.5)/getString("appScreenControlCenterSpeedOff").length,0.5*(controlCenter.maxTextWidth*0.5), 5, 1.2,0), "px"));
    var cText;
    for(var cTrain = 0; cTrain < trains.length; cTrain++) {
        cText = getString(["appScreenTrainNames",cTrain]);
        controlCenter.fontSizes.trainSizes.trainNames[cTrain] = Math.min(0.625*controlCenter.maxTextHeight/trains.length,getFontSize(measureFontSize(cText,controlCenter.fontFamily,0.625*controlCenter.maxTextWidth/cText.length,0.625*controlCenter.maxTextWidth, 5, 1.2,0), "px"));
        contextForeground.font = controlCenter.fontSizes.trainSizes.trainNames[cTrain] +"px "+controlCenter.fontFamily;
        controlCenter.fontSizes.trainSizes.trainNamesLength[cTrain] = contextForeground.measureText(cText).width;
    }
    if(controlCenter.fontSizes.carSizes == undefined) {
        controlCenter.fontSizes.carSizes = {};
    }
    if(controlCenter.fontSizes.carSizes.init == undefined) {
        controlCenter.fontSizes.carSizes.init = {};
    }
    if(controlCenter.fontSizes.carSizes.init.carNames == undefined) {
        controlCenter.fontSizes.carSizes.init.carNames = [];
    }
    if(controlCenter.fontSizes.carSizes.init.carNamesLength == undefined) {
        controlCenter.fontSizes.carSizes.init.carNamesLength = [];
    }
    if(controlCenter.fontSizes.carSizes.manual == undefined) {
        controlCenter.fontSizes.carSizes.manual = {};
    }
    if(controlCenter.fontSizes.carSizes.manual.carNames == undefined) {
        controlCenter.fontSizes.carSizes.manual.carNames = [];
    }
    if(controlCenter.fontSizes.carSizes.manual.carNamesLength == undefined) {
        controlCenter.fontSizes.carSizes.manual.carNamesLength = [];
    }
    if(controlCenter.fontSizes.carSizes.auto == undefined) {
        controlCenter.fontSizes.carSizes.auto = {};
    }
    cText = getString("appScreenCarControlCenterAutoModeActivate");
    controlCenter.fontSizes.carSizes.init.autoModeActivate = Math.min(0.5*controlCenter.maxTextHeight/cars.length,getFontSize(measureFontSize(cText,controlCenter.fontFamily,1.5*controlCenter.maxTextWidth/cText.length,1.5*controlCenter.maxTextWidth, 5, 1.2,0), "px"));
    contextForeground.font = controlCenter.fontSizes.carSizes.init.autoModeActivate +"px "+controlCenter.fontFamily;
    controlCenter.fontSizes.carSizes.init.autoModeActivateLength = contextForeground.measureText(cText).width;
    for(var cCar = 0; cCar < cars.length; cCar++) {
        cText = formatJSString(getString("appScreenCarControlCenterStartCar"), getString(["appScreenCarNames",cCar]));
        controlCenter.fontSizes.carSizes.init.carNames[cCar] = Math.min(0.5*controlCenter.maxTextHeight/cars.length,getFontSize(measureFontSize(cText,controlCenter.fontFamily,1.5*controlCenter.maxTextWidth/cText.length,1.5*controlCenter.maxTextWidth, 5, 1.2,0), "px"));
        contextForeground.font = controlCenter.fontSizes.carSizes.init.carNames[cCar] +"px "+controlCenter.fontFamily;
        controlCenter.fontSizes.carSizes.init.carNamesLength[cCar] = contextForeground.measureText(cText).width;
        cText = formatJSString(getString(["appScreenCarNames",cCar]));
        controlCenter.fontSizes.carSizes.manual.carNames[cCar] = Math.min(0.625*controlCenter.maxTextHeight/cars.length,getFontSize(measureFontSize(cText,controlCenter.fontFamily,0.625*controlCenter.maxTextWidth/cText.length,0.625*controlCenter.maxTextWidth, 5, 1.2,0), "px"));
        contextForeground.font = controlCenter.fontSizes.carSizes.manual.carNames[cCar] +"px "+controlCenter.fontFamily;
        controlCenter.fontSizes.carSizes.manual.carNamesLength[cCar] = contextForeground.measureText(cText).width;
    }
    cText = getString("appScreenCarControlCenterAutoModePause");
    controlCenter.fontSizes.carSizes.auto.pause = Math.min(0.625*controlCenter.maxTextHeight/2,getFontSize(measureFontSize(cText,controlCenter.fontFamily,0.625*controlCenter.maxTextWidth/cText.length,0.625*controlCenter.maxTextWidth, 5, 1.2,0), "px"));
    contextForeground.font = controlCenter.fontSizes.carSizes.auto.pause +"px "+controlCenter.fontFamily;
    controlCenter.fontSizes.carSizes.auto.pauseLength = contextForeground.measureText(cText).width;
    cText = getString("appScreenCarControlCenterAutoModeResume");
    controlCenter.fontSizes.carSizes.auto.resume = Math.min(0.625*controlCenter.maxTextHeight/2,getFontSize(measureFontSize(cText,controlCenter.fontFamily,0.625*controlCenter.maxTextWidth/cText.length,0.625*controlCenter.maxTextWidth, 5, 1.2,0), "px"));
    contextForeground.font = controlCenter.fontSizes.carSizes.auto.resume +"px "+controlCenter.fontFamily;
    controlCenter.fontSizes.carSizes.auto.resumeLength = contextForeground.measureText(cText).width;
    cText = getString("appScreenCarControlCenterAutoModeBackToRoot");
    controlCenter.fontSizes.carSizes.auto.backToRoot = Math.min(0.625*controlCenter.maxTextHeight/2,getFontSize(measureFontSize(cText,controlCenter.fontFamily,0.625*controlCenter.maxTextWidth/cText.length,0.625*controlCenter.maxTextWidth, 5, 1.2,0), "px"));
    contextForeground.font = controlCenter.fontSizes.carSizes.auto.backToRoot +"px "+controlCenter.fontFamily;
    controlCenter.fontSizes.carSizes.auto.backToRootLength = contextForeground.measureText(cText).width;
    contextForeground.restore();
}

function showConfirmLeaveMultiplayerMode(){
    var tpLeave = document.querySelector("#tp-leave");
    if(onlineGame.enabled && tpLeave.style.display == "") {
        tpLeave.style.display = "block";
    }
}

/******************************************
             draw  functions
******************************************/
function drawObjects() {
    function drawTrains(input1){
        function drawTrain(i) {
            var currentObject = (i < 0)?trains[input1]:trains[input1].cars[i];

            context.save();
            context.translate(currentObject.x, currentObject.y);
            context.rotate(currentObject.displayAngle);

            var flickerDuration = 3;
            if(frameNo <= trains[input1].lastDirectionChange+flickerDuration*6 && !trains[input1].move && Math.random() > 0.7 && (i < 0 || i == trains[input1].cars.length-1)) {
                context.save();
                context.strokeStyle = "rgba(255,255,224," + (client.isSmall ? 1 : 0.5) + ")";
                context.lineWidth = (client.isTiny ? 1 : 3);
                if(i == -1 && trains[input1].standardDirection) {
                    if(trains[input1].flickerFacFront == undefined) {
                        trains[input1].flickerFacFront = 2;
                    }
                    if(trains[input1].flickerFacFrontOffset == undefined) {
                        trains[input1].flickerFacFrontOffset = 3.5;
                    }
                    context.beginPath();
                    context.moveTo(currentObject.width/trains[input1].flickerFacFront+background.width/500,-currentObject.height/trains[input1].flickerFacFrontOffset);
                    context.lineTo(currentObject.width/trains[input1].flickerFacFront, -currentObject.height/4);
                    context.moveTo(currentObject.width/trains[input1].flickerFacFront+background.width/500, currentObject.height/trains[input1].flickerFacFrontOffset);
                    context.lineTo(currentObject.width/trains[input1].flickerFacFront, currentObject.height/4);
                    context.stroke();
                    context.closePath();
                }
                if(i == trains[input1].cars.length-1 && !trains[input1].standardDirection) {
                    if(trains[input1].flickerFacBack == undefined) {
                        trains[input1].flickerFacBack = 2;
                    }
                    if(trains[input1].flickerFacBackOffset == undefined) {
                        trains[input1].flickerFacBackOffset = 3.5;
                    }
                    context.beginPath();
                    context.moveTo(-currentObject.width/trains[input1].flickerFacBack-background.width/500,-currentObject.height/trains[input1].flickerFacBackOffset);
                    context.lineTo(-currentObject.width/trains[input1].flickerFacBack, -currentObject.height/4);
                    context.moveTo(-currentObject.width/trains[input1].flickerFacBack-background.width/500, currentObject.height/trains[input1].flickerFacBackOffset);
                    context.lineTo(-currentObject.width/trains[input1].flickerFacBack, currentObject.height/4);
                    context.stroke();
                    context.closePath();
                }
                context.restore();
            }
            context.save();
            if(currentObject.assetFlip) {
                context.scale(-1, 1);
            }
            if (konamistate < 0) {
                context.scale(-1,1);
                context.textAlign = "center";
                var icon = i == -1 || currentObject.konamiUseTrainIcon ? getString(["appScreenTrainIcons",input1]) : getString("appScreenTrainCarIcon");
                context.font = measureFontSize(icon, "sans-serif",100,currentObject.width, 5, currentObject.width/100, 0);
                context.fillStyle = "white";
                context.scale(1,currentObject.height/getFontSize(context.font,"px"));
                context.fillText(icon,0,0);
            } else if(frameNo <= trains[input1].lastDirectionChange+flickerDuration*3 && (frameNo <= trains[input1].lastDirectionChange+flickerDuration || frameNo > trains[input1].lastDirectionChange+flickerDuration*2)) {
                drawImage(pics[currentObject.src], -currentObject.width*1.01/2,-currentObject.height*1.01/2, currentObject.width*1.01, currentObject.height*1.01);
            } else {
                drawImage(pics[currentObject.src], -currentObject.width/2,-currentObject.height/2, currentObject.width, currentObject.height);
            }
            context.restore();
            context.beginPath();
            context.rect(-currentObject.width/2, -currentObject.height/2, currentObject.width, currentObject.height);
            if(context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY)) {
                hardware.mouse.cursor = "pointer";
            }
            if (context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && hardware.mouse.isHold) {
                inTrain = true;
                if(hardware.lastInputTouch < hardware.lastInputMouse) {
                    hardware.mouse.isHold = false;
                }
                if((hardware.lastInputTouch < hardware.lastInputMouse && hardware.mouse.downTime - hardware.mouse.upTime > 0 && context.isPointInPath(hardware.mouse.upX, hardware.mouse.upY) && context.isPointInPath(hardware.mouse.downX, hardware.mouse.downY) && hardware.mouse.downTime - hardware.mouse.upTime < doubleClickTime) || (hardware.lastInputTouch > hardware.lastInputMouse && context.isPointInPath(hardware.mouse.downX, hardware.mouse.downY) && Date.now()-hardware.mouse.downTime > longTouchTime)) {
                    if(typeof clickTimeOut !== "undefined"){
                        window.clearTimeout(clickTimeOut);
                        clickTimeOut = null;
                    }
                    if(hardware.lastInputTouch > hardware.lastInputMouse) {
                        hardware.mouse.isHold = false;
                    }
                    if(trains[input1].accelerationSpeed <= 0 && Math.abs(trains[input1].accelerationSpeed) < 0.2){
                        actionSync("trains", input1, [{"accelerationSpeed": 0}, {"move": false}, {"lastDirectionChange": frameNo}, {"standardDirection": !trains[input1].standardDirection}], [{getString: ["appScreenObjectChangesDirection","."]}, {getString: [["appScreenTrainNames",input1]]}]);
                    }
                } else {
                    if(typeof clickTimeOut !== "undefined"){
                        window.clearTimeout(clickTimeOut);
                        clickTimeOut = null;
                    }
                    clickTimeOut = window.setTimeout(function(){
                        clickTimeOut = null;
                        if(hardware.lastInputTouch > hardware.lastInputMouse) {
                            hardware.mouse.isHold = false;
                        }
                        if(!collisionCourse(input1)) {
                            if(trains[input1].move && trains[input1].accelerationSpeed > 0){
                                actionSync("trains", input1, [{"accelerationSpeed": trains[input1].accelerationSpeed *= -1}], [{getString: ["appScreenObjectStops", "."]}, {getString:[["appScreenTrainNames",input1]]}]);
                            } else {
                                if(trains[input1].move){
                                    actionSync("trains", input1, [{"accelerationSpeed": trains[input1].accelerationSpeed *= -1},{"speedInPercent":50}], [{getString:["appScreenObjectStarts", "."]}, {getString:[["appScreenTrainNames",input1]]}]);
                                } else {
                                    actionSync("trains", input1, [{"move": true},{"speedInPercent":50}], [{getString:["appScreenObjectStarts", "."]}, {getString:[["appScreenTrainNames",input1]]}]);
                                    trains[input1].move = true;
                                    trains[input1].accelerationSpeed = 1;
                                }
                                trains[input1].speedInPercent = 50;
                            }
                        }
                    }, (hardware.lastInputTouch > hardware.lastInputMouse) ? longTouchWaitTime : doubleClickWaitTime);
                }
            }
            context.restore();
        }

        for(var i = -1; i < trains[input1].cars.length; i++){
            drawTrain(i);
        }
    }

    function collisionCourse(input1){
        return trains[input1].crash;
    }

    function drawCars(input1){
        var currentObject = cars[input1];
        carCollisionCourse(input1,true);
        context.save();
        context.translate(background.x, background.y);
        context.translate(currentObject.x, currentObject.y);
        context.rotate(currentObject.displayAngle);
        var flickerDuration = 4;
        if (konamistate < 0) {
            context.scale(-1,1);
            context.textAlign = "center";
            var icon = getString(["appScreenCarIcons",input1]);
            context.font = measureFontSize(icon,"sans-serif",100,currentObject.width, 5, currentObject.width/100, 0);
            context.fillStyle = "white";
            context.scale(1,currentObject.height/getFontSize(context.font,"px"));
            context.fillText(icon,0,0);
        } else if ( frameNo <= currentObject.lastDirectionChange+flickerDuration*3 && (frameNo <= currentObject.lastDirectionChange+flickerDuration || frameNo > currentObject.lastDirectionChange+flickerDuration*2)) {
            drawImage(pics[currentObject.src], -currentObject.width*1.03/2,-currentObject.height*1.03/2, currentObject.width*1.03, currentObject.height*1.03);
        } else {
            drawImage(pics[currentObject.src], -currentObject.width/2,-currentObject.height/2, currentObject.width, currentObject.height);
        }
        if(!onlineGame.stop) {
            context.beginPath();
            context.rect(-currentObject.width/2, -currentObject.height/2, currentObject.width, currentObject.height);
            if(context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY)) {
                hardware.mouse.cursor = "pointer";
            }
            if (context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && hardware.mouse.isHold) {
                if(hardware.lastInputTouch < hardware.lastInputMouse) {
                    hardware.mouse.isHold = false;
                }
                if ((hardware.lastInputTouch < hardware.lastInputMouse && hardware.mouse.downTime - hardware.mouse.upTime > 0 && context.isPointInPath(hardware.mouse.upX, hardware.mouse.upY) && context.isPointInPath(hardware.mouse.downX, hardware.mouse.downY) && hardware.mouse.downTime - hardware.mouse.upTime < doubleClickTime) || (hardware.lastInputTouch > hardware.lastInputMouse && context.isPointInPath(hardware.mouse.downX, hardware.mouse.downY) && Date.now()-hardware.mouse.downTime > longTouchTime)) {
                    if(typeof clickTimeOut !== "undefined"){
                        window.clearTimeout(clickTimeOut);
                        clickTimeOut = null;
                    }
                    if(hardware.lastInputTouch > hardware.lastInputMouse) {
                        hardware.mouse.isHold = false;
                    }
                    if(carParams.init) {
                        carParams.init = false;
                        carParams.autoModeOff = false;
                        carParams.autoModeRuns = true;
                        carParams.autoModeInit = true;
                        notify("#canvas-notifier", formatJSString(getString("appScreenCarAutoModeChange", "."), getString("appScreenCarAutoModeInit")), NOTIFICATION_PRIO_DEFAULT, 500,null, null, client.y);
                    } else if(carParams.autoModeOff && !currentObject.move && currentObject.backwardsState === 0) {
                        currentObject.lastDirectionChange = frameNo;
                        currentObject.backwardsState = 1;
                        currentObject.backToInit = false;
                        currentObject.move = !carCollisionCourse(input1,false);
                        notify("#canvas-notifier", formatJSString(getString("appScreenCarStepsBack","."), getString(["appScreenCarNames",input1])), NOTIFICATION_PRIO_DEFAULT, 750,null,null, client.y);
                    }
                } else {
                    if(typeof clickTimeOut !== "undefined"){
                        window.clearTimeout(clickTimeOut);
                        clickTimeOut = null;
                    }
                    clickTimeOut = window.setTimeout(function(){
                        clickTimeOut = null;
                        if(hardware.lastInputTouch > hardware.lastInputMouse) {
                            hardware.mouse.isHold = false;
                        }
                        if(!carCollisionCourse(input1,false)) {
                            if(carParams.autoModeRuns) {
                                notify("#canvas-notifier", formatJSString(getString("appScreenCarAutoModeChange", "."), getString("appScreenCarAutoModePause")), NOTIFICATION_PRIO_DEFAULT, 500,null, null, client.y);
                                carParams.autoModeRuns = false;
                            } else if(carParams.init || carParams.autoModeOff) {
                                currentObject.parking = false;
                                if (currentObject.move){
                                    currentObject.move = false;
                                    notify("#canvas-notifier", formatJSString(getString("appScreenObjectStops", "."), getString(["appScreenCarNames",input1])), NOTIFICATION_PRIO_DEFAULT, 500 ,null,  null, client.y);
                                } else {
                                    currentObject.move = !carCollisionCourse(input1,false);
                                    notify("#canvas-notifier", formatJSString(getString("appScreenObjectStarts", "."), getString(["appScreenCarNames",input1])), NOTIFICATION_PRIO_DEFAULT, 500,null, null, client.y);
                                }
                                currentObject.backwardsState = 0;
                                currentObject.backToInit = false;
                                carParams.init = false;
                                carParams.autoModeOff = true;
                            } else {
                                notify("#canvas-notifier", formatJSString(getString("appScreenCarAutoModeChange", "."), getString("appScreenCarAutoModeInit")), NOTIFICATION_PRIO_DEFAULT, 500,null, null, client.y);
                                carParams.autoModeRuns = true;
                                carParams.autoModeInit = true;
                            }
                        }
                    }, (hardware.lastInputTouch > hardware.lastInputMouse) ? longTouchWaitTime : doubleClickWaitTime);

                }
            }
            context.closePath();
            context.restore();
            if(!currentObject.parking && !currentObject.move && !carParams.autoModeRuns && ! carParams.isBackToRoot && !carCollisionCourse(input1,false,-1)) {
                context.save();
                context.translate(background.x+carWays[input1].start[currentObject.startFrame].x, background.y+carWays[input1].start[currentObject.startFrame].y);
                context.rotate(carWays[input1].start[currentObject.startFrame].angle);
                context.beginPath();
                context.rect(-currentObject.width/2, -currentObject.height/2, currentObject.width, currentObject.height);
                if (context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY)) {
                    hardware.mouse.cursor = "pointer";
                    if(hardware.mouse.isHold) {
                        hardware.mouse.isHold = false;
                        if(carParams.autoModeOff) {
                            currentObject.move = true;
                            currentObject.backToInit = true;
                            notify("#canvas-notifier", formatJSString(getString("appScreenCarParking", "."), getString(["appScreenCarNames",input1])), NOTIFICATION_PRIO_DEFAULT, 500 ,null,  null, client.y);
                        } else {
                            carParams.autoModeRuns = true;
                            carParams.isBackToRoot = true;
                            notify("#canvas-notifier", getString("appScreenCarAutoModeParking", "."), NOTIFICATION_PRIO_DEFAULT, 750 ,null,  null, client.y);
                        }
                    }
                }
            }
            context.closePath();
            context.restore();
            if(debug){
                context.save();
                context.translate(background.x+currentObject.x, background.y+currentObject.y);
                context.rotate(currentObject.displayAngle);
                context.strokeRect(-currentObject.width/2,-currentObject.height/2, currentObject.width, currentObject.height);
                context.restore();
            }
            if(debug && !carParams.autoModeRuns) {
                context.save();
                context.beginPath();
                context.strokeStyle = "rgb(" + Math.floor(input1/carWays.length*255) + ",0,0)";
                context.lineWidth = 1;
                context.moveTo(background.x+carWays[input1][currentObject.cType][0].x,background.y+carWays[input1][currentObject.cType][0].y);
                for(var i = 1; i < carWays[input1][currentObject.cType].length;i+=10){
                    context.lineTo(background.x+carWays[input1][currentObject.cType][i].x,background.y+carWays[input1][currentObject.cType][i].y);
                }
                if(currentObject.cType == "normal") {
                    context.lineTo(background.x+carWays[input1][currentObject.cType][0].x,background.y+carWays[input1][currentObject.cType][0].y);
                }
                context.stroke();
                context.restore();
            }
            if(carParams.autoModeRuns) {
                var counter = carParams.isBackToRoot ? (currentObject.counter-1 < 0 ? carWays[input1][currentObject.cType].length-1 : currentObject.counter-1) : (currentObject.counter+1 > carWays[input1][currentObject.cType].length-1 ? 0 : currentObject.counter+1);
                if(!carParams.isBackToRoot && counter === 0 && currentObject.cType == "start") {
                    currentObject.cType = "normal";
                } else if (carParams.isBackToRoot && counter === 0 && currentObject.cType == "normal") {
                    currentObject.counter = counter = carWays[input1].start.length-1;
                    currentObject.cType = "start";
                } else if (carParams.isBackToRoot && counter <= currentObject.startFrame && currentObject.cType == "start") {
                    currentObject.parking = true;
                    currentObject.counter = counter = currentObject.startFrame;
                    var allParking = true;
                    Object.keys(cars).forEach(function(cCar) {
                        if(!cars[cCar].parking || cars[cCar].counter != cars[cCar].startFrame) {
                            allParking = false;
                        }
                    });
                    carParams.init = allParking;
                    carParams.autoModeRuns = carParams.isBackToRoot = !allParking;
                }
                currentObject.counter = currentObject.collStop || currentObject.parking ? currentObject.counter : counter;
                currentObject.x = carWays[input1][currentObject.cType][currentObject.counter].x;
                currentObject.y = carWays[input1][currentObject.cType][currentObject.counter].y;
                currentObject.displayAngle = carWays[input1][currentObject.cType][currentObject.counter].angle;
            } else if (currentObject.move) {
                if(currentObject.cType == "start") {
                    currentObject.counter = currentObject.backToInit || currentObject.backwardsState > 0 ? (--currentObject.counter < cars[input1].startFrame ? cars[input1].startFrame : currentObject.counter) : (++currentObject.counter > carWays[input1].start.length-1 ? 0 : currentObject.counter);
                    if(currentObject.counter === 0) {
                        currentObject.cType = "normal";
                    } else if (currentObject.counter == currentObject.startFrame) {
                        currentObject.parking = true;
                        currentObject.backToInit = false;
                        currentObject.backwardsState = 0;
                        currentObject.move = false;
                        if(!carParams.autoModeInit) {
                            var allParking = true;
                            Object.keys(cars).forEach(function(cCar) {
                                if(!cars[cCar].parking || cars[cCar].counter != cars[cCar].startFrame) {
                                    allParking = false;
                                }
                            });
                            carParams.init = allParking;
                        }
                    }
                } else if (currentObject.cType == "normal") {
                    currentObject.counter = currentObject.backToInit || currentObject.backwardsState > 0 ? (--currentObject.counter < 0 ? carWays[input1].normal.length-1 : currentObject.counter) : (++currentObject.counter > carWays[input1].normal.length-1 ? 0 : currentObject.counter);
                    if(currentObject.backToInit && currentObject.counter === 0) {
                        currentObject.counter = carWays[input1].start.length-1;
                        currentObject.cType = "start";
                    }
                }
                currentObject.backwardsState *= (1-currentObject.speed/background.width*100);
                if (currentObject.backwardsState <=  0.1 && currentObject.backwardsState > 0) {
                    currentObject.backwardsState = 0;
                    currentObject.move = false;
                }
                currentObject.x = carWays[input1][currentObject.cType][currentObject.counter].x;
                currentObject.y = carWays[input1][currentObject.cType][currentObject.counter].y;
                currentObject.displayAngle = carWays[input1][currentObject.cType][currentObject.counter].angle;
            }
        } else {
            context.restore();
        }
    }

    function carCollisionCourse(input1, input2, fixFac){
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        var collision = false;
        var currentObject;
        var fac;
        if((!carParams.autoModeOff && carParams.isBackToRoot) || (carParams.autoModeOff && (cars[input1].backToInit || cars[input1].backwardsState > 0))){
            fac = -1;
        } else {
            fac = 1;
        }
        if(Math.abs(fixFac) == 1) {
            fac = fixFac;
        }
        currentObject = cars[input1];
        var x1 = currentObject.x+fac*Math.sin(Math.PI/2-currentObject.displayAngle)*currentObject.width/2+Math.cos(-Math.PI/2-currentObject.displayAngle)*currentObject.height/2;
        var x2 = currentObject.x+fac*Math.sin(Math.PI/2-currentObject.displayAngle)*currentObject.width/2-Math.cos(-Math.PI/2-currentObject.displayAngle)*currentObject.height/2;
        var x3 = currentObject.x+fac*Math.sin(Math.PI/2-currentObject.displayAngle)*currentObject.width/2;
        var y1 = currentObject.y+fac*Math.cos(Math.PI/2-currentObject.displayAngle)*currentObject.width/2-Math.sin(-Math.PI/2-currentObject.displayAngle)*currentObject.height/2;
        var y2 = currentObject.y+fac*Math.cos(Math.PI/2-currentObject.displayAngle)*currentObject.width/2+Math.sin(-Math.PI/2-currentObject.displayAngle)*currentObject.height/2;
        var y3 = currentObject.y+fac*Math.cos(Math.PI/2-currentObject.displayAngle)*currentObject.width/2;
        if(debug) {
            context.save();
            context.setTransform(client.realScale,0,0,client.realScale,-(client.realScale-1)*canvas.width/2+client.touchScaleX,-(client.realScale-1)*canvas.height/2+client.touchScaleY);
            context.fillRect(background.x+x1-3,background.y+y1-3,6,6);
            context.fillRect(background.x+x2-3,background.y+y2-3,6,6);
            context.fillRect(background.x+x3-3,background.y+y3-3,6,6);
            context.restore();
        }
        for(var i = 0; i < cars.length; i++){
            if(input1 != i){
                currentObject = cars[i];
                context.save();
                context.translate(currentObject.x, currentObject.y);
                context.rotate(currentObject.displayAngle);
                context.beginPath();
                context.rect(-currentObject.width/2, -currentObject.height/2, currentObject.width, currentObject.height);
                if (context.isPointInPath(x1, y1) || context.isPointInPath(x2, y2) || context.isPointInPath(x3, y3)){
                    if(input2 && cars[input1].move){
                        notify("#canvas-notifier", formatJSString(getString("appScreenObjectHasCrashed", "."), getString(["appScreenCarNames",input1]), getString(["appScreenCarNames",i])), NOTIFICATION_PRIO_DEFAULT, 2000,null,null, client.y);
                    }
                    collision = true;
                    cars[input1].move = cars[input1].backToInit = false;
                    cars[input1].backwardsState = 0;
                }
                context.restore();
            }
        }
        context.restore();
        return(collision);
    }

    function carAutoModeIsFutureCollision(i,k,stop,j) {
        if(typeof stop == "undefined"){
            stop = -1;
        }
        if(typeof j == "undefined"){
            j = 0;
        }
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        var coll = false;
        var jmax = false;
        var m = j;
        var n = j;
        if(m >= points.angle[i].length-1 || n >= points.angle[k].length-1) {
            m = n = j = points.angle[i].length-1;
            jmax = true;
        }
        if(stop > -1) {
            m = stop == i ? 0 : m;
            n = stop == k ? 0 : n;
        } else {
            n = cCars[k].collStop ? 0 : n;
        }
        var sizeNo = 1.06;
        var x1 = points.x[i][m]+(carParams.isBackToRoot ? -1 : 1)*Math.sin(Math.PI/2-points.angle[i][m])*cCars[i].width/2+Math.cos(-Math.PI/2-points.angle[i][m])*cCars[i].height/2;
        var x2 = points.x[i][m]+(carParams.isBackToRoot ? -1 : 1)*Math.sin(Math.PI/2-points.angle[i][m])*cCars[i].width/2-Math.cos(-Math.PI/2-points.angle[i][m])*cCars[i].height/2;
        var x3 = points.x[i][m]+(carParams.isBackToRoot ? -1 : 1)*Math.sin(Math.PI/2-points.angle[i][m])*cCars[i].width/2;
        var y1 = points.y[i][m]+(carParams.isBackToRoot ? -1 : 1)*Math.cos(Math.PI/2-points.angle[i][m])*cCars[i].width/2-Math.sin(-Math.PI/2-points.angle[i][m])*cCars[i].height/2;
        var y2 = points.y[i][m]+(carParams.isBackToRoot ? -1 : 1)*Math.cos(Math.PI/2-points.angle[i][m])*cCars[i].width/2+Math.sin(-Math.PI/2-points.angle[i][m])*cCars[i].height/2;
        var y3 = points.y[i][m]+(carParams.isBackToRoot ? -1 : 1)*Math.cos(Math.PI/2-points.angle[i][m])*cCars[i].width/2;
        context.translate(points.x[k][n], points.y[k][n]);
        context.rotate(points.angle[k][n]);
        context.beginPath();
        context.rect(-sizeNo*cCars[k].width/2, -sizeNo*cCars[carParams.thickestCar].height/2, sizeNo*cCars[k].width, sizeNo*cCars[carParams.thickestCar].height);
        if (context.isPointInPath(x1, y1) || context.isPointInPath(x2, y2) || context.isPointInPath(x3, y3)){
            coll = true;
        }
        context.restore();
        return (coll) ? j : ((jmax) ? -1 : carAutoModeIsFutureCollision(i,k,stop,++j));
    }

    function classicUISwicthesLocate(angle, radius, style){
        contextForeground.save();
        contextForeground.rotate(angle);
        contextForeground.beginPath();
        contextForeground.moveTo(0,0);
        contextForeground.lineTo(radius + (konamistate < 0 ? Math.random()*0.3*radius : 0), radius + (konamistate < 0 ? Math.random()*0.3*radius : 0));
        contextForeground.closePath();
        contextForeground.strokeStyle = style;
        contextForeground.stroke();
        contextForeground.restore();
    }

    function adjustScaleX(x) {
        return (canvas.width*client.realScale/2-canvas.width/2)/client.realScale+x/client.realScale-client.touchScaleX/client.realScale;
    }
    function adjustScaleY(y) {
        return (canvas.height*client.realScale/2-canvas.height/2)/client.realScale+y/client.realScale-client.touchScaleY/client.realScale;
    }

    /////GENERAL/////
    var starttime = Date.now();
    if(client.realScale != client.oldRealScale || client.touchScaleX != client.oldTouchScaleX || client.touchScaleY != client.oldTouchScaleY) {
        client.oldRealScale = client.realScale;
        client.oldTouchScaleX = client.touchScaleX;
        client.oldTouchScaleY = client.touchScaleY;
        drawBackground();
        if(client.realScale > 1 && typeof placeOptions == "function") {
            placeOptions("hide");
        } else if(typeof placeOptions == "function") {
            placeOptions("show");
        }
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(client.realScale,0,0,client.realScale,-(client.realScale-1)*canvas.width/2+client.touchScaleX,-(client.realScale-1)*canvas.height/2+client.touchScaleY);
    contextForeground.clearRect(0, 0, canvasForeground.width, canvasForeground.height);
    contextForeground.setTransform(client.realScale,0,0,client.realScale,-(client.realScale-1)*canvas.width/2+client.touchScaleX,-(client.realScale-1)*canvas.height/2+client.touchScaleY);
    frameNo++;
    if(frameNo % 1000000 === 0){
        notify("#canvas-notifier", formatJSString(getString("appScreenAMillionFrames","."),frameNo/1000000), NOTIFICATION_PRIO_DEFAULT, 500, null, null, client.y);
    }
    if(hardware.mouse.cursor != "none") {
        hardware.mouse.cursor = "default";
    }

    /////TRAINS/////
    var inTrain = false;
    if(!resized) {
        for(var i = 0; i < trains.length; i++) {
            drawTrains(i);
        }
    }

    /////CARS/////
    //Auto Mode
    if((carParams.autoModeRuns && frameNo % carParams.wayNo === 0) || carParams.autoModeInit) {
        if(carParams.autoModeInit) {
            for(var i = 0; i < cars.length; i++) {
                cars[i].parking = false;
            }
            carParams.autoModeInit = false;
        }
        var points = {x:[], y:[], angle:[]};
        var arrLen =  carParams.wayNo*20;
        var abstrNo = Math.ceil(arrLen*0.05);
        var cCars = copyJSObject(cars);
        for(var i = 0; i < cCars.length; i++) {
            cCars[i].move = false;
            cCars[i].backwardsState = 0;
            cCars[i].collStop = false;
            var counter = cCars[i].counter;
            var cAbstrNo = Math.round((cCars[i].speed/cCars[carParams.lowestSpeedNo].speed)*abstrNo);
            var countJ = 0;
            points.x[i] = [];
            points.y[i] = [];
            points.angle[i] = [];
            if(debug) {
                context.save();
                context.beginPath();
                context.strokeStyle = "rgb(" + Math.floor(i/carWays.length*255) + ",0,0)";
                context.lineWidth = 1;
                context.moveTo(background.x+carWays[i][cCars[i].cType][counter].x,background.y+carWays[i][cCars[i].cType][counter].y);
            }
            if(carParams.isBackToRoot) {
                for(var j = arrLen-1; j >= 0; j-=cAbstrNo) {
                    points.x[i][countJ] = carWays[i][cCars[i].cType][counter].x;
                    points.y[i][countJ] = carWays[i][cCars[i].cType][counter].y;
                    points.angle[i][countJ] = carWays[i][cCars[i].cType][counter].angle;
                    if(debug) {
                        context.lineTo(background.x+points.x[i][countJ],background.y+points.y[i][countJ]);
                    }
                    countJ++;
                    if(cCars[i].cType == "normal" && counter-cAbstrNo < 0) {
                        cCars[i].cType = "start";
                    } else if(cCars[i].cType == "start" && counter-cAbstrNo < cCars[i].startFrame) {
                        counter = cCars[i].startFrame;
                    }
                    counter = counter-cAbstrNo < 0 ? (carWays[i][cCars[i].cType].length-1)+(counter-cAbstrNo) : counter-cAbstrNo;
                }
            } else {
                for(var j = 0; j < arrLen; j+=cAbstrNo) {
                    points.x[i][countJ] = carWays[i][cCars[i].cType][counter].x;
                    points.y[i][countJ] = carWays[i][cCars[i].cType][counter].y;
                    points.angle[i][countJ] = carWays[i][cCars[i].cType][counter].angle;
                    if(debug) {
                        context.lineTo(background.x+points.x[i][countJ],background.y+points.y[i][countJ]);
                    }
                    countJ++;
                    if(cCars[i].cType == "start" && counter+cAbstrNo > carWays[i][cCars[i].cType].length-1) {
                        cCars[i].cType = "normal";
                        counter = 0;
                    }
                    counter = counter+cAbstrNo > carWays[i][cCars[i].cType].length-1 ? counter+cAbstrNo-(carWays[i][cCars[i].cType].length-1) : counter+cAbstrNo;
                }
            }
            if(debug) {
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
            for(var i = 0; i < cCars.length; i++) {
                for(var k = 0; k < cCars.length; k++) {
                    if(i!=k && !cCars[i].collStop && !cCars[i].parking) {
                        cCars[i].collStopNo[k] = carAutoModeIsFutureCollision(i,k);
                    }
                }
            }
            for(var i = 0; i < cCars.length; i++) {
                for(var k = 0; k < cCars.length; k++) {
                    if(i!=k && !cCars[i].collStop){
                        var a = cCars[i].collStopNo[k]/cCars[i].speed;
                        var b = cCars[i].collStopNo[k]/cCars[k].speed;
                        var isA;
                        if(cars[i].collStopNo[k] == -2){
                            isA = true;
                        }else if(cars[k].collStopNo[i] == -2){
                            isA = false;
                        } else {
                            isA = a < b;
                        }
                        if(isA) {
                            if(carAutoModeIsFutureCollision(i,k,i) > -1) {
                                isA = false;
                            }
                        } else {
                            if(carAutoModeIsFutureCollision(k,i,k) > -1) {
                                isA = true;
                            }
                        }
                        if(isA && cCars[k].collStopNo[i] > -2 && cCars[i].collStopNo[k] > -1){
                            cCars[i].collStop = !cCars[k].parking;
                            cCars[i].collStopNo[k] = -2;
                            change = true;
                        } else if(!isA && cCars[i].collStopNo[k] > -2 && cCars[k].collStopNo[i] > -1) {
                            cCars[k].collStop = !cCars[i].parking;
                            cCars[k].collStopNo[i] = -2;
                            change = true;
                        }
                    }
                }
            }
        } while (change && changeNum < Math.pow(cCars.length,cCars.length));
        cars = cCars;
        for(var i = 0; i < cCars.length; i++) {
            for(var k = 0; k < cCars.length; k++) {
                if(i!= k && carCollisionCourse(i,false) && carCollisionCourse(k,false)){
                    notify("#canvas-notifier", getString("appScreenCarAutoModeCrash", "."), NOTIFICATION_PRIO_HIGH, 5000, null, null, window.innerHeight);
                    carParams.autoModeOff = true;
                    carParams.autoModeRuns = false;
                }
            }
        }
        var collStopQuantity = 0;
        cars.forEach(function(car){
            if(car.collStop && car.cType == "normal"){
                collStopQuantity++;
            }
        });
        if(collStopQuantity == cars.length){
            notify("#canvas-notifier", getString("appScreenCarAutoModeCrash", "."), NOTIFICATION_PRIO_HIGH, 5000, null, null, window.innerHeight);
            carParams.autoModeOff = true;
            carParams.autoModeRuns = false;
        }
    }
    //General
    for(var i = 0; i < cars.length; i++) {
        drawCars(i);
    }

    /////KONAMI/Animals/////
    if(konamistate < 0) {
        var animalPos = [{x: background.x+background.width*0.88, y: background.y+background.height*0.58},{x: background.x+background.width*0.055, y: background.y+background.height*0.07}];
        var animals = [];
        var animal = 0;
        while (getString(["appScreenKonamiAnimals",animal]) != "undefined" && animal < animalPos.length) {
            animals[animal] = getString(["appScreenKonamiAnimals",animal]);
            animal++;
        }
        animals.forEach(function(animal,i){
            context.save();
            context.translate(animalPos[i].x, animalPos[i].y);
            context.font = measureFontSize(animal, "sans-serif",100,background.width*0.001, 5,background.width*0.012, 0);
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText(animal, 0, 0);
            context.restore();
        });
    }

    /////TAX OFFICE/////
    if(settings.burnTheTaxOffice){
        //General (BEGIN)
        contextForeground.save();
        contextForeground.translate(background.x,background.y);
        contextForeground.translate(background.width/7.4-background.width*0.07, background.height/3.1-background.height*0.06);
        //Smoke and Fire
        for (var i = 0; i <  taxOffice.params.number; i++) {
            if(frameNo % taxOffice.params.frameNo === 0) {
                if ( Math.random() > taxOffice.params.frameProbability ) {
                    if ( Math.random() >= taxOffice.params.fire.color.probability ) {
                        taxOffice.fire[i].color = "rgba(" + taxOffice.params.fire.color.yellow.red + "," + taxOffice.params.fire.color.yellow.green + "," + taxOffice.params.fire.color.yellow.blue + "," + (taxOffice.params.fire.color.yellow.alpha * Math.random()) + ")";
                    } else {
                        taxOffice.fire[i].color = "rgba(" + taxOffice.params.fire.color.red.red + "," + taxOffice.params.fire.color.red.green + "," + taxOffice.params.fire.color.red.blue + "," + (taxOffice.params.fire.color.red.alpha * Math.random()) + ")";
                    }
                    taxOffice.fire[i].x = Math.random() * taxOffice.params.fire.x;
                    taxOffice.fire[i].y = Math.random() * taxOffice.params.fire.y;
                    taxOffice.fire[i].size = Math.random() * taxOffice.params.fire.size;
                    taxOffice.smoke[i].color = "rgba(" + taxOffice.params.smoke.color.red + "," + taxOffice.params.smoke.color.green + "," + taxOffice.params.smoke.color.blue + "," + (taxOffice.params.smoke.color.alpha * Math.random()) + ")";
                    taxOffice.smoke[i].x = Math.random() * taxOffice.params.smoke.x;
                    taxOffice.smoke[i].y = Math.random() * taxOffice.params.smoke.y;
                    taxOffice.smoke[i].size = Math.random() * taxOffice.params.smoke.size;
                }
            }
            contextForeground.fillStyle = taxOffice.fire[i].color;
            contextForeground.save();
            contextForeground.translate(taxOffice.fire[i].x, taxOffice.fire[i].y);
            contextForeground.beginPath();
            contextForeground.arc(0,0, taxOffice.fire[i].size, 0, 2*Math.PI);
            contextForeground.closePath();
            contextForeground.fill();
            contextForeground.restore();
            contextForeground.save();
            contextForeground.fillStyle = taxOffice.smoke[i].color;
            contextForeground.translate(taxOffice.smoke[i].x, taxOffice.smoke[i].y);
            contextForeground.beginPath();
            contextForeground.arc(0,0, taxOffice.smoke[i].size, 0, 2*Math.PI);
            contextForeground.closePath();
            contextForeground.fill();
            contextForeground.restore();
        }
        //Blue lights
        for(var i = 0; i <  taxOffice.params.bluelights.cars.length; i++) {
            if((frameNo +  taxOffice.params.bluelights.cars[i].frameNo) %  taxOffice.params.bluelights.frameNo < 4) {
                contextForeground.fillStyle = "rgba(0, 0,255,1)";
            } else if ((frameNo +  taxOffice.params.bluelights.cars[i].frameNo) %  taxOffice.params.bluelights.frameNo < 6 || (frameNo +  taxOffice.params.bluelights.cars[i].frameNo) %  taxOffice.params.bluelights.frameNo > (taxOffice.params.bluelights.frameNo  - 3)) {
                contextForeground.fillStyle = "rgba(0, 0,255,0.5)";
            } else {
                contextForeground.fillStyle = "rgba(0, 0,255,0.2)";
            }
            contextForeground.save();
            contextForeground.translate(taxOffice.params.bluelights.cars[i].x[0],taxOffice.params.bluelights.cars[i].y[0]);
            contextForeground.beginPath();
            contextForeground.arc(0,0, taxOffice.params.bluelights.cars[i].size, 0, 2*Math.PI);
            contextForeground.closePath();
            contextForeground.fill();
            contextForeground.translate(taxOffice.params.bluelights.cars[i].x[1],taxOffice.params.bluelights.cars[i].y[1]);
            contextForeground.beginPath();
            contextForeground.arc(0,0, taxOffice.params.bluelights.cars[i].size, 0, 2*Math.PI);
            contextForeground.closePath();
            contextForeground.fill();
            contextForeground.restore();
        }
        //General (END)
        contextForeground.restore();
    }

    /////CLASSIC UI/////
    if(settings.classicUI) {
        var step = Math.PI/30;
        if(trains[trainParams.selected].accelerationSpeed > 0){
            if(classicUI.transformer.input.angle < trains[trainParams.selected].speedInPercent/100 * classicUI.transformer.input.maxAngle){
                classicUI.transformer.input.angle += step;
                if(classicUI.transformer.input.angle >= trains[trainParams.selected].speedInPercent/100 * classicUI.transformer.input.maxAngle){
                    classicUI.transformer.input.angle = trains[trainParams.selected].speedInPercent/100 * classicUI.transformer.input.maxAngle;
                }
            } else {
                classicUI.transformer.input.angle -= step;
                if(classicUI.transformer.input.angle <= trains[trainParams.selected].speedInPercent/100 * classicUI.transformer.input.maxAngle){
                    classicUI.transformer.input.angle = trains[trainParams.selected].speedInPercent/100 * classicUI.transformer.input.maxAngle;
                }
            }
        } else {
            if(classicUI.transformer.input.angle > 0){
                classicUI.transformer.input.angle -= step;
                if(classicUI.transformer.input.angle < 0){
                    classicUI.transformer.input.angle = 0;
                }
            }
        }
        context.save();
        drawImage(pics[classicUI.trainSwitch.src], classicUI.trainSwitch.x, classicUI.trainSwitch.y, classicUI.trainSwitch.width, classicUI.trainSwitch.height);
        context.beginPath();
        var wasInSwitchPath = false;
        context.rect(classicUI.trainSwitch.x, classicUI.trainSwitch.y, classicUI.trainSwitch.width, classicUI.trainSwitch.height);
        if ((context.isPointInPath(hardware.mouse.wheelX, hardware.mouse.wheelY) && hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls) || context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY)) {
            wasInSwitchPath = true;
        }
        context.restore();
        context.save();
        context.beginPath();
        var sTDposY = classicUI.trainSwitch.selectedTrainDisplay.height*1.3;
        context.rect(classicUI.trainSwitch.x+classicUI.trainSwitch.width,classicUI.trainSwitch.y+classicUI.trainSwitch.height-sTDposY, classicUI.trainSwitch.selectedTrainDisplay.width, classicUI.trainSwitch.selectedTrainDisplay.height);
        if (wasInSwitchPath || (context.isPointInPath(hardware.mouse.wheelX, hardware.mouse.wheelY) && hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls) || context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY)) {
            hardware.mouse.cursor = "pointer";
            if(typeof movingTimeOut !== "undefined"){
                window.clearTimeout(movingTimeOut);
            }
            if((hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls) || hardware.mouse.isHold) {
                if(hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls) {
                    trainParams.selected += hardware.mouse.wheelScrollY < 0 ? 1 : -1;
                } else {
                    trainParams.selected++;
                    hardware.mouse.isHold = false;
                }
                if(trainParams.selected >= trains.length) {
                    trainParams.selected=0;
                } else if (trainParams.selected < 0) {
                    trainParams.selected = trains.length-1;
                }
                if (!settings.alwaysShowSelectedTrain) {
                    notify("#canvas-notifier", formatJSString(getString("appScreenTrainSelected", "."), getString(["appScreenTrainNames",trainParams.selected])), NOTIFICATION_PRIO_HIGH, 1250, null, null, window.innerHeight, NOTIFICATION_CHANNEL_CLASSIC_UI_TRAIN_SWITCH);
                }
            }
        }
        if(settings.alwaysShowSelectedTrain){
            context.font = classicUI.trainSwitch.selectedTrainDisplay.font;
            context.fillStyle="#000";
            context.strokeStyle="#eee";
            context.fillRect(classicUI.trainSwitch.x+classicUI.trainSwitch.width,classicUI.trainSwitch.y+classicUI.trainSwitch.height-sTDposY, classicUI.trainSwitch.selectedTrainDisplay.width, classicUI.trainSwitch.selectedTrainDisplay.height);
            context.strokeRect(classicUI.trainSwitch.x+classicUI.trainSwitch.width,classicUI.trainSwitch.y+classicUI.trainSwitch.height-sTDposY, classicUI.trainSwitch.selectedTrainDisplay.width, classicUI.trainSwitch.selectedTrainDisplay.height);
            context.fillStyle="#eee";
            context.translate(classicUI.trainSwitch.x+classicUI.trainSwitch.width+classicUI.trainSwitch.selectedTrainDisplay.width/2,0);
            context.textBaseline = "middle";
            context.fillText(getString(["appScreenTrainNames",trainParams.selected]), -context.measureText(getString(["appScreenTrainNames",trainParams.selected])).width/2,classicUI.trainSwitch.y+classicUI.trainSwitch.height-sTDposY+classicUI.trainSwitch.selectedTrainDisplay.height/2);
        }
        context.restore();
        context.save();
        context.translate(classicUI.transformer.x+classicUI.transformer.width/2, classicUI.transformer.y+classicUI.transformer.height/2);
        context.rotate(classicUI.transformer.angle);
        drawImage(pics[classicUI.transformer.asrc], -classicUI.transformer.width/2, -classicUI.transformer.height/2 , classicUI.transformer.width, classicUI.transformer.height);
        if(trains[trainParams.selected].accelerationSpeed > 0){
            drawImage(pics[classicUI.transformer.src], -classicUI.transformer.width/2, -classicUI.transformer.height/2 , classicUI.transformer.width, classicUI.transformer.height);
        }
        if(!client.isSmall){
            context.save();
            context.translate( classicUI.transformer.directionInput.diffX, classicUI.transformer.directionInput.diffY);
            drawImage(pics[classicUI.transformer.directionInput.src], -classicUI.transformer.directionInput.width/2, -classicUI.transformer.directionInput.height/2, classicUI.transformer.directionInput.width, classicUI.transformer.directionInput.height);
            context.beginPath();
            context.rect(-classicUI.transformer.directionInput.width/2, -classicUI.transformer.directionInput.height/2, classicUI.transformer.directionInput.width, classicUI.transformer.directionInput.height);
            if (context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && !trains[trainParams.selected].move) {
                if(typeof movingTimeOut !== "undefined"){
                    window.clearTimeout(movingTimeOut);
                }
                hardware.mouse.cursor = "pointer";
                if(hardware.mouse.isHold){
                    hardware.mouse.isHold = false;
                    actionSync("trains", trainParams.selected, [{"standardDirection":!trains[trainParams.selected].standardDirection}], [{getString:["appScreenObjectChangesDirection","."]}, {getString:[["appScreenTrainNames",trainParams.selected]]}]);
                }
            }
            context.restore();
        }
        context.save();
        context.translate(0, -classicUI.transformer.input.diffY);
        context.rotate(classicUI.transformer.input.angle);
        drawImage(pics[classicUI.transformer.input.src], -classicUI.transformer.input.width/2, -classicUI.transformer.input.height/2, classicUI.transformer.input.width, classicUI.transformer.input.height);
        if(debug){
            context.fillRect(-classicUI.transformer.input.width/2, classicUI.transformer.input.height/2,6,6);
            context.fillRect(-3,-3,6,6);
        }
        context.beginPath();
        context.rect(-classicUI.transformer.input.width/2, -classicUI.transformer.input.height/2, classicUI.transformer.input.width, classicUI.transformer.input.height);
        if (context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY)) {
            hardware.mouse.cursor = "pointer";
        }
        if ((context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && hardware.mouse.isHold) || (context.isPointInPath(hardware.mouse.wheelX, hardware.mouse.wheelY) && hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls)) {
            context.restore();
            context.restore();
            if(typeof movingTimeOut !== "undefined"){
                window.clearTimeout(movingTimeOut);
            }
            var x = classicUI.transformer.x+classicUI.transformer.width/2+classicUI.transformer.input.diffY*Math.sin(classicUI.transformer.angle);
            var y = classicUI.transformer.y+classicUI.transformer.height/2-classicUI.transformer.input.diffY*Math.cos(classicUI.transformer.angle);
            if(!collisionCourse(trainParams.selected)){
                if(client.isTiny && (typeof(client.realScale) == "undefined" || client.realScale <= Math.max(1,client.realScaleMax/3))){
                    if(hardware.mouse.isHold){
                        hardware.mouse.isHold = false;
                        if(trains[trainParams.selected].move && trains[trainParams.selected].accelerationSpeed > 0){
                            actionSync("trains", trainParams.selected, [{"accelerationSpeed": trains[trainParams.selected].accelerationSpeed *= -1}], [{getString: ["appScreenObjectStops", "."]}, {getString:[["appScreenTrainNames",trainParams.selected]]}]);
                        } else {
                            if(trains[trainParams.selected].move){
                                actionSync("trains", trainParams.selected, [{"speedInPercent":50},{"accelerationSpeed": trains[trainParams.selected].accelerationSpeed *= -1}], [{getString:["appScreenObjectStarts", "."]}, {getString:[["appScreenTrainNames",trainParams.selected]]}]);
                            } else {
                                actionSync("trains", trainParams.selected, [{"speedInPercent":50},{"move": true}], [{getString:["appScreenObjectStarts", "."]}, {getString:[["appScreenTrainNames",trainParams.selected]]}]);
                                trains[trainParams.selected].move=true;
                                trains[trainParams.selected].accelerationSpeed = 1;
                            }
                        }
                        trains[trainParams.selected].speedInPercent=50;
                    }
                } else if((hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls && !(adjustScaleY(hardware.mouse.wheelY > y) && adjustScaleX(hardware.mouse.wheelX < x) )) || (!(adjustScaleY(hardware.mouse.moveY) > y && adjustScaleX(hardware.mouse.moveX) < x ))) {
                    var angle;
                    var oldAngle = classicUI.transformer.input.angle;
                    if(hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls && !(adjustScaleY(hardware.mouse.wheelY) > y && adjustScaleX(hardware.mouse.wheelX) < x)) {
                        angle = classicUI.transformer.input.angle * (hardware.mouse.wheelScrollY < 0 ? 1.1 : 0.9);
                    } else {
                        if (adjustScaleY(hardware.mouse.moveY)>y){
                            angle = Math.PI + Math.abs(Math.atan(((adjustScaleY(hardware.mouse.moveY)-y)/(adjustScaleX(hardware.mouse.moveX)-x))));
                        } else if (adjustScaleY(hardware.mouse.moveY)<y && adjustScaleX(hardware.mouse.moveX) > x){
                            angle = Math.PI - Math.abs(Math.atan(((adjustScaleY(hardware.mouse.moveY)-y)/(adjustScaleX(hardware.mouse.moveX)-x))));
                        } else {
                            angle = Math.abs(Math.atan(((adjustScaleY(hardware.mouse.moveY)-y)/(adjustScaleX(hardware.mouse.moveX)-x))));
                        }
                    }
                    classicUI.transformer.input.angle = angle >= 0 ? (angle <= classicUI.transformer.input.maxAngle ? angle : classicUI.transformer.input.maxAngle) : 0;
                    var cAngle = classicUI.transformer.input.angle/classicUI.transformer.input.maxAngle*100;
                    if (hardware.mouse.wheelScrollY < 0 && hardware.mouse.wheelScrolls && !(adjustScaleY(hardware.mouse.wheelY) > y && adjustScaleX(hardware.mouse.wheelX) < x) && cAngle === 0){
                        cAngle = classicUI.transformer.input.minAngle;
                        classicUI.transformer.input.angle = cAngle*classicUI.transformer.input.maxAngle/100;
                    } else if(classicUI.transformer.input.angle < 0.95*oldAngle && cAngle < classicUI.transformer.input.minAngle) {
                        cAngle = classicUI.transformer.input.angle = 0;
                    }
                    if(cAngle > 0 && trains[trainParams.selected].accelerationSpeed > 0 && trains[trainParams.selected].speedInPercent != cAngle) {
                        var accSpeed = (trains[trainParams.selected].currentSpeedInPercent)/cAngle;
                        actionSync("trains", trainParams.selected, [{"accelerationSpeedCustom":accSpeed}], null);
                        trains[trainParams.selected].accelerationSpeedCustom=accSpeed;
                        trains[trainParams.selected].currentSpeedInPercent = trains[trainParams.selected].accelerationSpeedCustom*trains[trainParams.selected].speedInPercent;
                    }
                    if(cAngle > 0) {
                        actionSync("trains", trainParams.selected, [{"speedInPercent":cAngle}], null);
                        trains[trainParams.selected].speedInPercent=cAngle;
                        trains[trainParams.selected].currentSpeedInPercent = trains[trainParams.selected].accelerationSpeedCustom*trains[trainParams.selected].speedInPercent;
                    } else {
                        hardware.mouse.isHold = false;
                    }
                    if(cAngle === 0 && trains[trainParams.selected].accelerationSpeed > 0){
                        actionSync("trains", trainParams.selected, [{"accelerationSpeed":trains[trainParams.selected].accelerationSpeed *= -1}], [{getString:["appScreenObjectStops", "."]}, {getString:[["appScreenTrainNames",trainParams.selected]]}]);
                    } else if(cAngle > 0 && !trains[trainParams.selected].move) {
                        actionSync("trains", trainParams.selected, [{"move":true}],[{getString:["appScreenObjectStarts", "."]}, {getString:[["appScreenTrainNames",trainParams.selected]]}]);
                        trains[trainParams.selected].move = true;
                        trains[trainParams.selected].accelerationSpeed = 1;
                    } else if (cAngle > 0 && trains[trainParams.selected].accelerationSpeed < 0) {
                        actionSync("trains", trainParams.selected, [{"accelerationSpeed":trains[trainParams.selected].accelerationSpeed *= -1}], null);
                    }
                } else {
                    hardware.mouse.isHold = false;
                }
            } else {
                classicUI.transformer.input.angle = 0;
                trains[trainParams.selected].speedInPercent = 0;
                trains[trainParams.selected].move =  false;
                hardware.mouse.isHold = false;
            }
            if(classicUI.transformer.input.angle > 0 && classicUI.transformer.input.angle < classicUI.transformer.input.maxAngle) {
                hardware.mouse.cursor = "grabbing";
            }
        } else {
            context.restore();
            context.restore();
        }
        if(debug){
            context.save();
            var x = classicUI.transformer.x+classicUI.transformer.width/2+ classicUI.transformer.input.diffY*Math.sin(classicUI.transformer.angle);
            var y = classicUI.transformer.y+classicUI.transformer.height/2- classicUI.transformer.input.diffY*Math.cos( classicUI.transformer.angle);
            context.fillStyle = "red";
            context.fillRect(x-2,y-2,4,4);
            var a = -(classicUI.transformer.input.diffY-classicUI.transformer.input.height/2); var b = classicUI.transformer.width/2-(classicUI.transformer.width/2-classicUI.transformer.input.width/2);
            var c = classicUI.transformer.input.diffY+classicUI.transformer.input.height/2; var d = b;
            var x1 = classicUI.transformer.x+classicUI.transformer.width/2; var y1 =classicUI.transformer.y+classicUI.transformer.height/2;
            var x =[x1+c*Math.sin(classicUI.transformer.angle)-d*Math.cos(classicUI.transformer.angle),x1+c*Math.sin(classicUI.transformer.angle), x1+c*Math.sin(classicUI.transformer.angle)+d*Math.cos(classicUI.transformer.angle), x1 -(a+b)*Math.cos(classicUI.transformer.angle),x1-a*Math.cos(classicUI.transformer.angle),x1 -(a-b)*Math.cos(classicUI.transformer.angle)];
            var y =[y1-c*Math.cos(classicUI.transformer.angle)-d*Math.sin(classicUI.transformer.angle),y1-c*Math.cos(classicUI.transformer.angle),y1-c*Math.cos(classicUI.transformer.angle)+d*Math.sin(classicUI.transformer.angle), y1+(a-b)*Math.sin(classicUI.transformer.angle),y1+a*Math.sin(classicUI.transformer.angle),y1+(a+b)*Math.sin(classicUI.transformer.angle)];
            context.fillRect(x[0],y[0],4,4);
            context.fillRect(x[1],y[1],4,4);
            context.fillRect(x[2],y[2],4,4);
            context.fillRect(x[3],y[3],4,4);
            context.fillRect(x[4],y[4],4,4);
            context.fillRect(x[5],y[5],4,4);
            context.fillStyle = "black";
            var x=x1+ classicUI.transformer.input.diffY*Math.sin(classicUI.transformer.angle);
            var y=y1- classicUI.transformer.input.diffY*Math.cos(classicUI.transformer.angle);
            context.beginPath();
            context.arc(x,y,classicUI.transformer.input.width/2,Math.PI,Math.PI+classicUI.transformer.input.maxAngle,false);
            context.stroke();
            context.restore();
        }
    }

    /////SWITCHES/////
    var wasPointer = hardware.mouse.cursor != "default" || hardware.mouse.rightClick;
    Object.keys(switches).forEach(function(key) {
        Object.keys(switches[key]).forEach(function(side) {
            contextForeground.save();
            contextForeground.beginPath();
            contextForeground.arc(background.x+switches[key][side].x, background.y+switches[key][side].y, classicUI.switches.radius, 0, 2*Math.PI);
            if (!wasPointer && contextForeground.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY)) {
                hardware.mouse.cursor = "pointer";
            }
            contextForeground.closePath();
            contextForeground.restore();
        });
    });
    Object.keys(switches).forEach(function(key) {
        Object.keys(switches[key]).forEach(function(side) {
            contextForeground.save();
            contextForeground.beginPath();
            contextForeground.arc(background.x+switches[key][side].x, background.y+switches[key][side].y, classicUI.switches.radius, 0, 2*Math.PI);
            if (hardware.mouse.isHold && contextForeground.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && !inTrain){
                hardware.mouse.isHold = false;
                if(onlineGame.enabled){
                    teamplaySync("action","switches", [key,side], [{"turned":!switches[key][side].turned}], [{getString:["appScreenSwitchTurns", "."]}]);
                } else {
                    switches[key][side].turned = !switches[key][side].turned;
                    switches[key][side].lastStateChange = frameNo;
                    animateWorker.postMessage({k: "switches", switches: switches});
                    notify("#canvas-notifier", getString("appScreenSwitchTurns", "."), NOTIFICATION_PRIO_DEFAULT, 500,null, null, client.y,NOTIFICATION_CHANNEL_TRAIN_SWITCHES);
                }
                contextForeground.fillStyle = switches[key][side].turned ? "rgba(144, 255, 144,1)" : "rgba(255,0,0,1)";
                contextForeground.closePath();
                contextForeground.fill();
                contextForeground.restore();
            } else if (!hardware.mouse.isHold && switches[key][side].lastStateChange != undefined && frameNo-switches[key][side].lastStateChange < classicUI.switches.showDuration) {
                contextForeground.fillStyle = switches[key][side].turned ? "rgba(144, 255, 144,1)" : "rgba(255,0,0,1)";
                contextForeground.closePath();
                contextForeground.fill();
                contextForeground.restore();
            } else if (!hardware.mouse.isHold && switches[key][side].lastStateChange != undefined && frameNo-switches[key][side].lastStateChange < classicUI.switches.showDurationFade) {
                contextForeground.closePath();
                contextForeground.restore();
                contextForeground.save();
                contextForeground.beginPath();
                var fac = (1-((frameNo-classicUI.switches.showDuration-switches[key][side].lastStateChange))/(classicUI.switches.showDurationFade-classicUI.switches.showDuration));
                contextForeground.fillStyle = switches[key][side].turned ? "rgba(144, 255, 144," + fac + ")" : "rgba(255,0,0," + fac + ")";
                contextForeground.arc(background.x+switches[key][side].x, background.y+switches[key][side].y, fac*classicUI.switches.radius, 0, 2*Math.PI);
                contextForeground.closePath();
                contextForeground.fill();
                contextForeground.restore();
            } else if((client.chosenInputMethod == "mouse" && !wasPointer && !hardware.mouse.isHold && (switches[key][side].lastStateChange == undefined || frameNo-switches[key][side].lastStateChange > classicUI.switches.showDurationEnd) && contextForeground.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY)) || (hardware.mouse.isHold && hardware.mouse.cursor == "default" && (clickTimeOut === null || clickTimeOut === undefined))){
                contextForeground.closePath();
                contextForeground.restore();
                contextForeground.save();
                contextForeground.lineWidth = 5;
                contextForeground.translate(background.x+switches[key][side].x, background.y+switches[key][side].y);
                if( switches[key][side].turned ){
                    classicUISwicthesLocate(switches[key][side].angles.normal, 0.9 * classicUI.switches.radius, "rgba(255, 235, 235, 1)");
                    classicUISwicthesLocate(switches[key][side].angles.turned, 1.25 * classicUI.switches.radius, "rgba(170, 255, 170,1)");
                } else {
                    classicUISwicthesLocate(switches[key][side].angles.turned, 0.9 * classicUI.switches.radius , "rgba(235, 255, 235, 1)");
                    classicUISwicthesLocate(switches[key][side].angles.normal, 1.25 * classicUI.switches.radius , "rgba(255,40,40,1)");
                }
                contextForeground.save();
                contextForeground.beginPath();
                contextForeground.lineWidth = 5;
                contextForeground.arc(0, 0, 0.2*classicUI.switches.radius + (konamistate < 0 ? Math.random()*0.3*classicUI.switches.radius : 0), 0, 2*Math.PI);
                contextForeground.closePath();
                contextForeground.fillStyle = switches[key][side].turned ? "rgba(144, 238, 144,1)" : "rgba(255,0,0,1)";
                contextForeground.fill();
                contextForeground.restore();
                contextForeground.restore();
                if(debug) {
                    contextForeground.save();
                    contextForeground.beginPath();
                    contextForeground.lineWidth = 1;
                    contextForeground.arc(background.x+switches[key][side].x, background.y+switches[key][side].y, classicUI.switches.radius, 0, 2*Math.PI);
                    contextForeground.closePath();
                    contextForeground.strokeStyle = switches[key][side].turned ? "rgba(144, 238, 144,1)" : "rgba(255,0,0,1)";
                    contextForeground.stroke();
                    contextForeground.restore();
                }
            } else {
                contextForeground.closePath();
                contextForeground.restore();
            }
        });
    });

    /////DEBUG/////
    if(debug) {
        context.save();
        context.setTransform(client.realScale,0,0,client.realScale,-(client.realScale-1)*canvas.width/2+client.touchScaleX,-(client.realScale-1)*canvas.height/2+client.touchScaleY);
        debugDrawPoints.forEach(function(point) {
            var c = Math.max(Math.round(100*(100-100*point.weight))/100,0);
            context.fillStyle = "rgb(" + c + "," + c + "," + c + ")";
            context.fillRect(point.x-3,point.y-3,6,6);
        });
        context.restore();
        context.save();
        context.lineWidth = 5;
        context.strokeStyle= "red";
        context.fillStyle = "blue";
        var debugPoints = [ rotationPoints.inner.narrow, rotationPoints.inner.wide, rotationPoints.outer.narrow ];
        for (var debugPoint in debugPoints) {
            context.save();
            for (var debugPointI in debugPoints[debugPoint].x) {
                context.beginPath();
                context.arc(debugPoints[debugPoint].x[debugPointI]+background.x,debugPoints[debugPoint].y[debugPointI]+background.y, background.width/100,0,2*Math.PI);
                context.fill();
            }
            context.restore();
            context.save();
            context.beginPath();
            context.moveTo(debugPoints[debugPoint].x[0]+background.x, debugPoints[debugPoint].y[0]+background.y);
            context.lineTo(debugPoints[debugPoint].x[1]+background.x, debugPoints[debugPoint].y[1]+background.y);
            context.stroke();
            context.restore();
            context.save();
            context.beginPath();
            context.moveTo(debugPoints[debugPoint].x[2]+background.x, debugPoints[debugPoint].y[2]+background.y);
            context.lineTo(debugPoints[debugPoint].x[3]+background.x, debugPoints[debugPoint].y[3]+background.y);
            context.stroke();
            context.restore();
            context.save();
            context.beginPath();
            context.moveTo(debugPoints[debugPoint].x[1]+background.x, debugPoints[debugPoint].y[1]+background.y);
            context.bezierCurveTo(debugPoints[debugPoint].x[4]+background.x, debugPoints[debugPoint].y[4]+background.y,debugPoints[debugPoint].x[5]+background.x, debugPoints[debugPoint].y[5]+background.y,debugPoints[debugPoint].x[2]+background.x, debugPoints[debugPoint].y[2]+background.y);
            context.stroke();
            context.restore();
            context.save();
            context.beginPath();
            context.moveTo(debugPoints[debugPoint].x[3]+background.x, debugPoints[debugPoint].y[3]+background.y);
            context.bezierCurveTo(debugPoints[debugPoint].x[6]+background.x, debugPoints[debugPoint].y[6]+background.y,debugPoints[debugPoint].x[7]+background.x, debugPoints[debugPoint].y[7]+background.y,debugPoints[debugPoint].x[0]+background.x, debugPoints[debugPoint].y[0]+background.y);
            context.stroke();
            context.restore();
        }
        context.save();
        context.beginPath();
        context.moveTo(rotationPoints.outer.narrow.x[1]+background.x, rotationPoints.outer.narrow.y[1]+background.y);
        context.bezierCurveTo(rotationPoints.inner2outer.right.x[1]+background.x, rotationPoints.inner2outer.right.y[1]+background.y,rotationPoints.inner2outer.right.x[2]+background.x, rotationPoints.inner2outer.right.y[2]+background.y,rotationPoints.inner.narrow.x[2]+background.x, rotationPoints.inner.narrow.y[2]+background.y);
        context.stroke();
        context.beginPath();
        context.moveTo(rotationPoints.inner.narrow.x[3]+background.x, rotationPoints.inner.narrow.y[3]+background.y);
        context.bezierCurveTo(rotationPoints.inner2outer.left.x[1]+background.x, rotationPoints.inner2outer.left.y[1]+background.y,rotationPoints.inner2outer.left.x[2]+background.x, rotationPoints.inner2outer.left.y[2]+background.y,rotationPoints.outer.narrow.x[0]+background.x, rotationPoints.outer.narrow.y[0]+background.y);
        context.stroke();
        context.beginPath();
        context.moveTo(rotationPoints.outer.altState3.left.x[1]+background.x, rotationPoints.outer.altState3.left.y[1]+background.y);
        context.lineTo(rotationPoints.outer.altState3.right.x[1]+background.x, rotationPoints.outer.altState3.right.y[1]+background.y);
        context.stroke();
        context.beginPath();
        context.moveTo(rotationPoints.outer.altState3.left.x[0]+background.x, rotationPoints.outer.altState3.left.y[0]+background.y);
        context.bezierCurveTo(rotationPoints.outer.altState3.left.x[3]+background.x, rotationPoints.outer.altState3.left.y[3]+background.y,rotationPoints.outer.altState3.left.x[3]+background.x, rotationPoints.outer.altState3.left.y[3]+background.y,rotationPoints.outer.altState3.left.x[2]+background.x, rotationPoints.outer.altState3.left.y[2]+background.y);
        context.stroke();
        context.beginPath();
        context.moveTo(rotationPoints.outer.altState3.left.x[2]+background.x, rotationPoints.outer.altState3.left.y[2]+background.y);
        context.bezierCurveTo(rotationPoints.outer.altState3.left.x[4]+background.x, rotationPoints.outer.altState3.left.y[4]+background.y,rotationPoints.outer.altState3.left.x[4]+background.x, rotationPoints.outer.altState3.left.y[4]+background.y,rotationPoints.outer.altState3.left.x[1]+background.x, rotationPoints.outer.altState3.left.y[1]+background.y);
        context.stroke();
        context.beginPath();
        context.moveTo(rotationPoints.outer.altState3.right.x[0]+background.x, rotationPoints.outer.altState3.right.y[0]+background.y);
        context.bezierCurveTo(rotationPoints.outer.altState3.right.x[3]+background.x, rotationPoints.outer.altState3.right.y[3]+background.y,rotationPoints.outer.altState3.right.x[3]+background.x, rotationPoints.outer.altState3.right.y[3]+background.y,rotationPoints.outer.altState3.right.x[2]+background.x, rotationPoints.outer.altState3.right.y[2]+background.y);
        context.stroke();
        context.beginPath();
        context.moveTo(rotationPoints.outer.altState3.right.x[2]+background.x, rotationPoints.outer.altState3.right.y[2]+background.y);
        context.bezierCurveTo(rotationPoints.outer.altState3.right.x[4]+background.x, rotationPoints.outer.altState3.right.y[4]+background.y,rotationPoints.outer.altState3.right.x[4]+background.x, rotationPoints.outer.altState3.right.y[4]+background.y,rotationPoints.outer.altState3.right.x[1]+background.x, rotationPoints.outer.altState3.right.y[1]+background.y);
        context.stroke();
        for (var debugPointI in rotationPoints.outer.altState3.left.x) {
            context.beginPath();
            context.arc(rotationPoints.outer.altState3.left.x[debugPointI]+background.x,rotationPoints.outer.altState3.left.y[debugPointI]+background.y, background.width/100,0,2*Math.PI);
            context.arc(rotationPoints.outer.altState3.right.x[debugPointI]+background.x,rotationPoints.outer.altState3.right.y[debugPointI]+background.y, background.width/100,0,2*Math.PI);
            context.fill();
        }
        context.strokeStyle= "rgba(175,0,0," + (switches.sidings1.left.turned && switches.sidings2.left.turned ? "1" : "0.3") + ")";
        context.beginPath();
        context.moveTo(rotationPoints.inner.sidings.first.x[0]+background.x,rotationPoints.inner.sidings.first.y[0]+background.y);
        context.bezierCurveTo(rotationPoints.inner.sidings.first.x[1]+background.x, rotationPoints.inner.sidings.first.y[1]+background.y,rotationPoints.inner.sidings.first.x[2]+background.x, rotationPoints.inner.sidings.first.y[2]+background.y,rotationPoints.inner.sidings.first.x[3]+background.x, rotationPoints.inner.sidings.first.y[3]+background.y);
        context.stroke();
        context.beginPath();
        context.moveTo(rotationPoints.inner.sidings.firstS1.x[0]+background.x,rotationPoints.inner.sidings.firstS1.y[0]+background.y);
        context.lineTo(rotationPoints.inner.sidings.firstS1.x[1]+background.x,rotationPoints.inner.sidings.firstS1.y[1]+background.y);
        context.stroke();
        context.beginPath();
        context.moveTo(rotationPoints.inner.sidings.firstS2.x[0]+background.x,rotationPoints.inner.sidings.firstS2.y[0]+background.y);
        context.bezierCurveTo(rotationPoints.inner.sidings.firstS2.x[1]+background.x, rotationPoints.inner.sidings.firstS2.y[1]+background.y,rotationPoints.inner.sidings.firstS2.x[2]+background.x, rotationPoints.inner.sidings.firstS2.y[2]+background.y,rotationPoints.inner.sidings.firstS2.x[3]+background.x, rotationPoints.inner.sidings.firstS2.y[3]+background.y);
        context.stroke();
        context.strokeStyle= "rgba(150,0,0," + (switches.sidings1.left.turned && !switches.sidings2.left.turned && switches.sidings3.left.turned ? "1" : "0.3") + ")";
        context.beginPath();
        context.moveTo(rotationPoints.inner.sidings.second.x[0]+background.x,rotationPoints.inner.sidings.second.y[0]+background.y);
        context.bezierCurveTo(rotationPoints.inner.sidings.second.x[1]+background.x, rotationPoints.inner.sidings.second.y[1]+background.y,rotationPoints.inner.sidings.second.x[2]+background.x, rotationPoints.inner.sidings.second.y[2]+background.y,rotationPoints.inner.sidings.second.x[3]+background.x, rotationPoints.inner.sidings.second.y[3]+background.y);
        context.stroke();
        context.beginPath();
        context.moveTo(rotationPoints.inner.sidings.secondS1.x[0]+background.x,rotationPoints.inner.sidings.secondS1.y[0]+background.y);
        context.lineTo(rotationPoints.inner.sidings.secondS1.x[1]+background.x,rotationPoints.inner.sidings.secondS1.y[1]+background.y);
        context.stroke();
        context.beginPath();
        context.moveTo(rotationPoints.inner.sidings.secondS2.x[0]+background.x,rotationPoints.inner.sidings.secondS2.y[0]+background.y);
        context.bezierCurveTo(rotationPoints.inner.sidings.secondS2.x[1]+background.x, rotationPoints.inner.sidings.secondS2.y[1]+background.y,rotationPoints.inner.sidings.secondS2.x[2]+background.x, rotationPoints.inner.sidings.secondS2.y[2]+background.y,rotationPoints.inner.sidings.secondS2.x[3]+background.x, rotationPoints.inner.sidings.secondS2.y[3]+background.y);
        context.stroke();
        context.beginPath();
        context.strokeStyle= "rgba(125,0,0," + (switches.sidings1.left.turned && !switches.sidings2.left.turned && !switches.sidings3.left.turned ? "1" : "0.3") + ")";
        context.beginPath();
        context.moveTo(rotationPoints.inner.sidings.third.x[0]+background.x,rotationPoints.inner.sidings.third.y[0]+background.y);
        context.bezierCurveTo(rotationPoints.inner.sidings.third.x[1]+background.x, rotationPoints.inner.sidings.third.y[1]+background.y,rotationPoints.inner.sidings.third.x[2]+background.x, rotationPoints.inner.sidings.third.y[2]+background.y,rotationPoints.inner.sidings.third.x[3]+background.x, rotationPoints.inner.sidings.third.y[3]+background.y);
        context.stroke();
        context.beginPath();
        context.moveTo(rotationPoints.inner.sidings.thirdS1.x[0]+background.x,rotationPoints.inner.sidings.thirdS1.y[0]+background.y);
        context.lineTo(rotationPoints.inner.sidings.thirdS1.x[1]+background.x,rotationPoints.inner.sidings.thirdS1.y[1]+background.y);
        context.stroke();
        context.beginPath();
        context.moveTo(rotationPoints.inner.sidings.thirdS2.x[0]+background.x,rotationPoints.inner.sidings.thirdS2.y[0]+background.y);
        context.bezierCurveTo(rotationPoints.inner.sidings.thirdS2.x[1]+background.x, rotationPoints.inner.sidings.thirdS2.y[1]+background.y,rotationPoints.inner.sidings.thirdS2.x[2]+background.x, rotationPoints.inner.sidings.thirdS2.y[2]+background.y,rotationPoints.inner.sidings.thirdS2.x[3]+background.x, rotationPoints.inner.sidings.thirdS2.y[3]+background.y);
        context.stroke();
        context.restore();
        context.save();
        context.fillStyle = "yellow";
        context.beginPath();
        context.arc(switches.outer2inner.right.x+background.x,(switches.outer2inner.right.y)/switchesBeforeFac+background.y, background.width/100,0,2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(switches.outer2inner.left.x+background.x,(switches.outer2inner.left.y)/switchesBeforeFac+background.y, background.width/100,0,2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(switches.innerWide.right.x+background.x,(switches.innerWide.right.y)*switchesBeforeFac+background.y, background.width/100,0,2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(switches.innerWide.left.x+background.x,(switches.innerWide.left.y)*switchesBeforeFac+background.y, background.width/100,0,2*Math.PI);
        context.fill();
        context.restore();
        context.lineWidth = 2;
        context.fillStyle = "black";
        context.strokeStyle= "black";
        for(var debugTrain in trains){
            context.save();
            context.translate(trains[debugTrain].x, trains[debugTrain].y);
            context.rotate(trains[debugTrain].displayAngle);
            context.strokeRect(-trains[debugTrain].width/2,-trains[debugTrain].height/2, trains[debugTrain].width, trains[debugTrain].height);
            context.restore();
            context.save();
            context.translate(trains[debugTrain].front.x, trains[debugTrain].front.y);
            context.rotate(trains[debugTrain].front.angle);
            context.beginPath();
            context.arc(0,-trains[debugTrain].height/2,background.width/200,0,2*Math.PI);
            context.arc(0,0,background.width/200,0,2*Math.PI);
            context.arc(0,trains[debugTrain].height/2,background.width/200,0,2*Math.PI);
            context.fill();
            context.restore();
            context.save();
            context.translate(trains[debugTrain].back.x, trains[debugTrain].back.y);
            context.rotate(trains[debugTrain].back.angle);
            context.beginPath();
            context.arc(0,-trains[debugTrain].height/2,background.width/200,0,2*Math.PI);
            context.arc(0,0,background.width/200,0,2*Math.PI);
            context.arc(0,trains[debugTrain].height/2,background.width/200,0,2*Math.PI);
            context.fill();
            context.restore();
            for(var debugTrainCar in trains[debugTrain].cars){
                context.save();
                context.translate(trains[debugTrain].cars[debugTrainCar].x, trains[debugTrain].cars[debugTrainCar].y);
                context.rotate(trains[debugTrain].cars[debugTrainCar].displayAngle);
                context.strokeRect(-trains[debugTrain].cars[debugTrainCar].width/2,-trains[debugTrain].cars[debugTrainCar].height/2, trains[debugTrain].cars[debugTrainCar].width, trains[debugTrain].cars[debugTrainCar].height);
                context.restore();
                context.save();
                context.translate(trains[debugTrain].cars[debugTrainCar].front.x, trains[debugTrain].cars[debugTrainCar].front.y);
                context.rotate(trains[debugTrain].cars[debugTrainCar].front.angle);
                context.beginPath();
                context.arc(0,-trains[debugTrain].cars[debugTrainCar].height/2,background.width/200,0,2*Math.PI);
                context.arc(0,0,background.width/200,0,2*Math.PI);
                context.arc(0,trains[debugTrain].cars[debugTrainCar].height/2,background.width/200,0,2*Math.PI);
                context.fill();
                context.restore();
                context.save();
                context.translate(trains[debugTrain].cars[debugTrainCar].back.x, trains[debugTrain].cars[debugTrainCar].back.y);
                context.rotate(trains[debugTrain].cars[debugTrainCar].back.angle);
                context.beginPath();
                context.arc(0,-trains[debugTrain].cars[debugTrainCar].height/2,background.width/200,0,2*Math.PI);
                context.arc(0,0,background.width/200,0,2*Math.PI);
                context.arc(0,trains[debugTrain].cars[debugTrainCar].height/2,background.width/200,0,2*Math.PI);
                context.fill();
                context.restore();
            }
        }
        debugDrawPointsCrash.forEach(function(point) {
            context.fillStyle = "rgb(" + Math.round(100+Math.random()*155) + "," + Math.round(100+Math.random()*155) + "," + Math.round(100+Math.random()*155) + ")";
            context.fillRect(point.x-4,point.y-4,8,8);
        });
        context.restore();
    }

    /////CONTROL CENTER/////
    if(client.realScale == 1 && hardware.mouse.rightClick){
        var colorLight =  "floralwhite";
        var colorDark =  "rgb(120,120,120)";
        var colorBorder =  "rgba(255,255,255,0.7)";
        var contextClick = (hardware.mouse.rightClickEvent && Math.abs(hardware.mouse.downX-hardware.mouse.upX) < canvas.width/100 && Math.abs(hardware.mouse.downY-hardware.mouse.upY) < canvas.width/100);
        hardware.mouse.rightClickEvent = false;
        if(hardware.mouse.cursor != "none") {
            hardware.mouse.cursor = "default";
        }
        contextForeground.save();
        contextForeground.textBaseline = "middle";
        contextForeground.translate(background.x+controlCenter.translateOffset,background.y+controlCenter.translateOffset);
        contextForeground.fillStyle = "rgba(0,0,0,0.5)";
        contextForeground.fillRect(0,0,background.width-2*controlCenter.translateOffset,background.height-2*controlCenter.translateOffset);
        if(hardware.mouse.moveX > background.x+controlCenter.translateOffset && hardware.mouse.moveY > background.y+controlCenter.translateOffset && hardware.mouse.moveX < background.x+controlCenter.translateOffset+controlCenter.maxTextWidth/8 && hardware.mouse.moveY < background.y+controlCenter.translateOffset+controlCenter.maxTextHeight) {
            hardware.mouse.cursor = "pointer";
        }
        contextForeground.fillStyle = "rgb(255,120,120)";
        contextForeground.strokeStyle = colorBorder;
        contextForeground.strokeRect(0,0,controlCenter.maxTextWidth/8,controlCenter.maxTextHeight);
        contextForeground.save();
        contextForeground.translate(controlCenter.maxTextWidth/16,controlCenter.maxTextHeight/2);
        contextForeground.rotate(-Math.PI/2);
        contextForeground.font = controlCenter.fontSizes.closeTextHeight +"px "+controlCenter.fontFamily;
        contextForeground.fillText(getString("appScreenControlCenterClose",null,"upper"),-controlCenter.maxTextHeight/2+(controlCenter.maxTextHeight/2-contextForeground.measureText(getString("appScreenControlCenterClose",null,"upper")).width/2),controlCenter.fontSizes.closeTextHeight/6);
        contextForeground.restore();
        if(contextClick && hardware.mouse.upX-background.x-controlCenter.translateOffset > 0 && hardware.mouse.upX-background.x-controlCenter.translateOffset < controlCenter.maxTextWidth/8 && hardware.mouse.upY-background.y-controlCenter.translateOffset > 0 && hardware.mouse.upY-background.y-controlCenter.translateOffset < controlCenter.maxTextHeight*trains.length) {
            hardware.mouse.rightClick = false;
            hardware.mouse.rightClickWheelScrolls = false;
        }
        /////CONTROL CENTER/Cars/////
        if(controlCenter.showCarCenter) {
            if(carParams.init) {
                var maxTextHeight = controlCenter.maxTextHeight/(cars.length+1);
                for(var cCar = -1; cCar < cars.length; cCar++) {
                    var cText, cTextHeight, cTextWidth;
                    if(cCar == -1) {
                        cText = getString("appScreenCarControlCenterAutoModeActivate");
                        cTextHeight = controlCenter.fontSizes.carSizes.init.autoModeActivate;
                        cTextWidth = controlCenter.fontSizes.carSizes.init.autoModeActivateLength;
                    } else {
                        cText = formatJSString(getString("appScreenCarControlCenterStartCar"), getString(["appScreenCarNames",cCar]));
                        cTextHeight = controlCenter.fontSizes.carSizes.init.carNames[cCar];
                        cTextWidth = controlCenter.fontSizes.carSizes.init.carNamesLength[cCar];
                    }
                    contextForeground.font = cTextHeight +"px "+controlCenter.fontFamily;
                    contextForeground.fillStyle = colorLight;
                    contextForeground.fillText(cText,controlCenter.maxTextWidth/8+0.9375*controlCenter.maxTextWidth-cTextWidth/2,maxTextHeight*(cCar+1)+maxTextHeight/2);
                    contextForeground.strokeStyle = colorLight;
                    contextForeground.strokeRect(controlCenter.maxTextWidth/8,maxTextHeight*(cCar+1), 1.875*controlCenter.maxTextWidth,maxTextHeight);
                    if(hardware.mouse.moveX > background.x+controlCenter.translateOffset+controlCenter.maxTextWidth/8 && hardware.mouse.moveY > background.y+controlCenter.translateOffset+maxTextHeight*(cCar+1) && hardware.mouse.moveX < background.x+controlCenter.translateOffset+2*controlCenter.maxTextWidth && hardware.mouse.moveY < background.y+controlCenter.translateOffset+maxTextHeight*(cCar+2)) {
                        hardware.mouse.cursor = "pointer";
                        if(contextClick && cCar == -1) {
                            carParams.init = false;
                            carParams.autoModeOff = false;
                            carParams.autoModeRuns = true;
                            carParams.autoModeInit = true;
                            notify("#canvas-notifier", formatJSString(getString("appScreenCarAutoModeChange", "."), getString("appScreenCarAutoModeInit")), NOTIFICATION_PRIO_DEFAULT, 500,null, null, client.y);

                        } else if(contextClick) {
                            cars[cCar].move = !carCollisionCourse(cCar,false);
                            cars[cCar].parking = false;
                            cars[cCar].backwardsState = 0;
                            cars[cCar].backToInit = false;
                            carParams.init = false;
                            carParams.autoModeOff = true;
                            notify("#canvas-notifier", formatJSString(getString("appScreenObjectStarts", "."), getString(["appScreenCarNames",cCar])), NOTIFICATION_PRIO_DEFAULT, 500,null, null, client.y);
                        }
                    }
                }
            } else if(carParams.autoModeOff) {
                var maxTextHeight = controlCenter.maxTextHeight/cars.length;
                for(var cCar = 0; cCar < cars.length; cCar++) {
                    var noCollisionCCar = !carCollisionCourse(cCar,false);
                    var noCollisionCCar2 = !carCollisionCourse(cCar,false,-1);
                    var cText = formatJSString(getString(["appScreenCarNames",cCar]));
                    contextForeground.font = controlCenter.fontSizes.carSizes.manual.carNames[cCar] +"px "+controlCenter.fontFamily;
                    contextForeground.fillStyle = colorLight;
                    contextForeground.fillText(cText,controlCenter.maxTextWidth/8+0.5625*controlCenter.maxTextWidth-controlCenter.fontSizes.carSizes.manual.carNamesLength[cCar]/2,maxTextHeight*(cCar)+maxTextHeight/2);
                    contextForeground.strokeStyle = colorLight;
                    contextForeground.strokeRect(controlCenter.maxTextWidth/8,maxTextHeight*(cCar), 1.125*controlCenter.maxTextWidth,maxTextHeight);
                    var canMove = noCollisionCCar  && (cars[cCar].backwardsState === undefined || cars[cCar].backwardsState === 0);
                    contextForeground.save();
                    contextForeground.translate(1.375*controlCenter.maxTextWidth,maxTextHeight*(cCar)+maxTextHeight/2);
                    contextForeground.strokeStyle = canMove ? (cars[cCar].move ? "rgb(255,180,180)" : "rgb(180,255,180)") : colorDark;
                    contextForeground.fillStyle = contextForeground.strokeStyle;
                    contextForeground.lineWidth = Math.ceil(maxTextHeight/20);
                    contextForeground.beginPath();
                    contextForeground.moveTo(0, -maxTextHeight/18);
                    contextForeground.lineTo(0, -maxTextHeight/3);
                    contextForeground.stroke();
                    contextForeground.strokeStyle = canMove ? colorLight : colorDark;
                    contextForeground.beginPath();
                    contextForeground.rotate(-Math.PI/2);
                    contextForeground.arc(0,0,maxTextHeight/3.5,0.15*Math.PI,1.85*Math.PI);
                    contextForeground.stroke();
                    contextForeground.restore();
                    contextForeground.strokeRect(1.25*controlCenter.maxTextWidth,maxTextHeight*(cCar), 0.25*controlCenter.maxTextWidth,maxTextHeight);
                    if(canMove) {
                        if(hardware.mouse.moveX > background.x+controlCenter.translateOffset+controlCenter.maxTextWidth*1.25 && hardware.mouse.moveY > background.y+controlCenter.translateOffset+maxTextHeight*(cCar) && hardware.mouse.moveX < background.x+controlCenter.translateOffset+1.5*controlCenter.maxTextWidth && hardware.mouse.moveY < background.y+controlCenter.translateOffset+maxTextHeight*(cCar+1)) {
                            hardware.mouse.cursor = "pointer";
                            if(contextClick) {
                                cars[cCar].parking = false;
                                cars[cCar].backwardsState = 0;
                                cars[cCar].backToInit = false;
                                if (cars[cCar].move){
                                    cars[cCar].move = false;
                                    notify("#canvas-notifier", formatJSString(getString("appScreenObjectStops", "."), getString(["appScreenCarNames",cCar])), NOTIFICATION_PRIO_DEFAULT, 500 ,null,  null, client.y);
                                } else {
                                    cars[cCar].move = noCollisionCCar;
                                    notify("#canvas-notifier", formatJSString(getString("appScreenObjectStarts", "."), getString(["appScreenCarNames",cCar])), NOTIFICATION_PRIO_DEFAULT, 500,null, null, client.y);
                                }
                            }
                        }
                    }
                    var canStepBack = !cars[cCar].move && cars[cCar].backwardsState === 0 && !(cars[cCar].cType == "start" && cars[cCar].counter == cars[cCar].startFrame) && noCollisionCCar2;
                    contextForeground.save();
                    contextForeground.translate(1.625*controlCenter.maxTextWidth,maxTextHeight*(cCar)+maxTextHeight/2);
                    contextForeground.rotate(Math.PI);
                    contextForeground.strokeStyle = canStepBack ? colorLight : colorDark;
                    contextForeground.fillStyle = contextForeground.strokeStyle;
                    contextForeground.lineWidth = Math.ceil(maxTextHeight/5);
                    contextForeground.beginPath();
                    contextForeground.moveTo(-controlCenter.maxTextWidth*0.075, 0);
                    contextForeground.lineTo(controlCenter.maxTextWidth*0.051, 0);
                    contextForeground.stroke();
                    contextForeground.beginPath();
                    contextForeground.moveTo(controlCenter.maxTextWidth*0.05, -0.25*maxTextHeight);
                    contextForeground.lineTo(controlCenter.maxTextWidth*0.05, 0.25*maxTextHeight);
                    contextForeground.lineTo(controlCenter.maxTextWidth*0.1, 0);
                    contextForeground.lineTo(controlCenter.maxTextWidth*0.05, -0.25*maxTextHeight);
                    contextForeground.fill();
                    contextForeground.restore();
                    contextForeground.strokeRect(1.5*controlCenter.maxTextWidth,maxTextHeight*(cCar), 0.25*controlCenter.maxTextWidth,maxTextHeight);
                    if(canStepBack) {
                        if(hardware.mouse.moveX > background.x+controlCenter.translateOffset+controlCenter.maxTextWidth*1.5 && hardware.mouse.moveY > background.y+controlCenter.translateOffset+maxTextHeight*(cCar) && hardware.mouse.moveX < background.x+controlCenter.translateOffset+1.75*controlCenter.maxTextWidth && hardware.mouse.moveY < background.y+controlCenter.translateOffset+maxTextHeight*(cCar+1)) {
                            hardware.mouse.cursor = "pointer";
                            if(contextClick) {
                                cars[cCar].lastDirectionChange = frameNo;
                                cars[cCar].backwardsState = 1;
                                cars[cCar].backToInit = false;
                                cars[cCar].move = !carCollisionCourse(cCar,false);
                                notify("#canvas-notifier", formatJSString(getString("appScreenCarStepsBack","."), getString(["appScreenCarNames",cCar])), NOTIFICATION_PRIO_DEFAULT, 750,null,null, client.y);
                            }
                        }
                    }
                    var canBackToRoot = !cars[cCar].move && cars[cCar].backwardsState === 0 && !(cars[cCar].cType == "start" && cars[cCar].counter == cars[cCar].startFrame) && noCollisionCCar2;
                    contextForeground.save();
                    contextForeground.translate(1.75*controlCenter.maxTextWidth,maxTextHeight*(cCar));
                    contextForeground.strokeStyle = canBackToRoot ? "rgb(225,220,210)" : colorDark;
                    contextForeground.fillStyle = contextForeground.strokeStyle;
                    var maxHouseWidth = 4 * maxTextHeight;
                    contextForeground.translate((controlCenter.maxTextWidth/4-maxHouseWidth/4)/2,0);
                    contextForeground.fillRect(5*maxHouseWidth/64,maxHouseWidth/8.1,3*maxHouseWidth/32,maxHouseWidth/15.8);
                    contextForeground.fillStyle = canBackToRoot ? "rgb(255,180,180)" : colorDark;
                    contextForeground.fillRect(0.085*maxHouseWidth,maxHouseWidth/12,maxHouseWidth/32,maxHouseWidth/30);
                    contextForeground.beginPath();
                    contextForeground.moveTo(4.5*maxHouseWidth/64, maxHouseWidth/8);
                    contextForeground.lineTo(11.5*maxHouseWidth/64, maxHouseWidth/8);
                    contextForeground.lineTo(maxHouseWidth/8, maxHouseWidth/16);
                    contextForeground.lineTo(4.5*maxHouseWidth/64, maxHouseWidth/8);
                    contextForeground.fill();
                    contextForeground.closePath();
                    if(canBackToRoot) {
                        contextForeground.fillStyle = "rgb(70,121,70)";
                        contextForeground.fillRect(6*maxHouseWidth/64,maxHouseWidth/8.1+maxHouseWidth/31.6,maxHouseWidth/32,maxHouseWidth/31.6);
                        contextForeground.beginPath();
                        contextForeground.moveTo(6*maxHouseWidth/64,maxHouseWidth/8+maxHouseWidth/31.6);
                        contextForeground.arc(6*maxHouseWidth/64+maxHouseWidth/63.2,maxHouseWidth/8+maxHouseWidth/31.6,maxHouseWidth/63.2,0,Math.PI, true);
                        contextForeground.fill();
                    }
                    contextForeground.restore();
                    contextForeground.strokeRect(1.75*controlCenter.maxTextWidth,maxTextHeight*(cCar), 0.25*controlCenter.maxTextWidth,maxTextHeight);
                    if(canBackToRoot) {
                        if(hardware.mouse.moveX > background.x+controlCenter.translateOffset+controlCenter.maxTextWidth*1.75 && hardware.mouse.moveY > background.y+controlCenter.translateOffset+maxTextHeight*(cCar) && hardware.mouse.moveX < background.x+controlCenter.translateOffset+2*controlCenter.maxTextWidth && hardware.mouse.moveY < background.y+controlCenter.translateOffset+maxTextHeight*(cCar+1)) {
                            hardware.mouse.cursor = "pointer";
                            if(contextClick) {
                                cars[cCar].move = true;
                                cars[cCar].backToInit = true;
                                notify("#canvas-notifier", formatJSString(getString("appScreenCarParking", "."), getString(["appScreenCarNames",cCar])), NOTIFICATION_PRIO_DEFAULT, 500 ,null,  null, client.y);
                            }
                        }
                    }
                }
            } else {
                var maxTextHeight = controlCenter.maxTextHeight/2;
                for(var cCar = 0; cCar < 2; cCar++) {
                    var cText, cTextHeight, cTextWidth;
                    if(cCar == 0 && carParams.autoModeRuns) {
                        cText = getString("appScreenCarControlCenterAutoModePause");
                        cTextHeight = controlCenter.fontSizes.carSizes.auto.pause;
                        cTextWidth = controlCenter.fontSizes.carSizes.auto.pauseLength;
                    } else if(cCar == 0) {
                        cText = getString("appScreenCarControlCenterAutoModeResume");
                        cTextHeight = controlCenter.fontSizes.carSizes.auto.resume;
                        cTextWidth = controlCenter.fontSizes.carSizes.auto.resumeLength;
                    } else {
                        cText = getString("appScreenCarControlCenterAutoModeBackToRoot");
                        cTextHeight = controlCenter.fontSizes.carSizes.auto.backToRoot;
                        cTextWidth = controlCenter.fontSizes.carSizes.auto.backToRootLength;
                    }
                    contextForeground.font = cTextHeight +"px "+controlCenter.fontFamily;
                    contextForeground.fillStyle = colorLight;
                    if(hardware.mouse.moveX > background.x+controlCenter.translateOffset+controlCenter.maxTextWidth/8 && hardware.mouse.moveY > background.y+controlCenter.translateOffset+maxTextHeight*(cCar) && hardware.mouse.moveX < background.x+controlCenter.translateOffset+2*controlCenter.maxTextWidth && hardware.mouse.moveY < background.y+controlCenter.translateOffset+maxTextHeight*(cCar+1)) {
                        if(cCar == 0) {
                            hardware.mouse.cursor = "pointer";
                            if(contextClick && carParams.autoModeRuns) {
                                notify("#canvas-notifier", formatJSString(getString("appScreenCarAutoModeChange", "."), getString("appScreenCarAutoModePause")), NOTIFICATION_PRIO_DEFAULT, 500,null, null, client.y);
                                carParams.autoModeRuns = false;
                            } else if(contextClick) {
                                notify("#canvas-notifier", formatJSString(getString("appScreenCarAutoModeChange", "."), getString("appScreenCarAutoModeInit")), NOTIFICATION_PRIO_DEFAULT, 500,null, null, client.y);
                                carParams.autoModeRuns = true;
                                carParams.autoModeInit = true;
                            }
                        } else if(cCar == 1) {
                            if(!carParams.autoModeRuns && !carParams.isBackToRoot) {
                                hardware.mouse.cursor = "pointer";
                                if(contextClick) {
                                    carParams.autoModeRuns = true;
                                    carParams.isBackToRoot = true;
                                    notify("#canvas-notifier", getString("appScreenCarAutoModeParking", "."), NOTIFICATION_PRIO_DEFAULT, 750 ,null,  null, client.y);
                                }
                            }
                        }
                    }
                    if(cCar == 1 && (carParams.autoModeRuns || carParams.isBackToRoot)) {
                        contextForeground.fillStyle = colorDark;
                    }
                    contextForeground.fillText(cText,controlCenter.maxTextWidth/8+0.9375*controlCenter.maxTextWidth-cTextWidth/2,maxTextHeight*(cCar)+maxTextHeight/2);
                    contextForeground.strokeStyle = colorLight;
                    contextForeground.strokeRect(controlCenter.maxTextWidth/8,maxTextHeight*(cCar), 1.875*controlCenter.maxTextWidth,maxTextHeight);
                }
            }
        /////CONTROL CENTER/Trains/////
        } else {
            for(var cTrain = 0; cTrain < trains.length; cTrain++) {
                var maxTextHeight = controlCenter.maxTextHeight/trains.length;
                var noCollisionCTrain = !collisionCourse(cTrain);
                if(noCollisionCTrain && hardware.mouse.moveX > background.x+controlCenter.translateOffset+controlCenter.maxTextWidth && hardware.mouse.moveY > background.y+controlCenter.translateOffset+maxTextHeight*cTrain && hardware.mouse.moveX < background.x+controlCenter.translateOffset+1.75*controlCenter.maxTextWidth && hardware.mouse.moveY < background.y+controlCenter.translateOffset+maxTextHeight*(cTrain+1)) {
                    hardware.mouse.cursor = "pointer";
                }
                contextForeground.font = controlCenter.fontSizes.trainSizes.trainNames[cTrain] +"px "+controlCenter.fontFamily;
                contextForeground.fillStyle = colorLight;
                contextForeground.fillText(getString(["appScreenTrainNames",cTrain]),controlCenter.maxTextWidth/8+0.875*controlCenter.maxTextWidth/2-controlCenter.fontSizes.trainSizes.trainNamesLength[cTrain]/2,maxTextHeight*cTrain+maxTextHeight/2);
                var cTrainPercent = trains[cTrain].speedInPercent == undefined || !trains[cTrain].move || trains[cTrain].accelerationSpeed < 0 ? 0 : Math.round(trains[cTrain].speedInPercent);
                contextForeground.fillStyle = contextForeground.strokeStyle = colorBorder;
                contextForeground.strokeRect(controlCenter.maxTextWidth/8,maxTextHeight*cTrain,0.875*controlCenter.maxTextWidth,maxTextHeight);
                if(cTrainPercent == 0) {
                    contextForeground.fillStyle = noCollisionCTrain ? colorLight : colorDark;
                    contextForeground.font = controlCenter.fontSizes.trainSizes.speedTextHeight +"px "+controlCenter.fontFamily;
                    contextForeground.fillText(getString("appScreenControlCenterSpeedOff"),controlCenter.maxTextWidth+(controlCenter.maxTextWidth*0.5)/2-contextForeground.measureText(getString("appScreenControlCenterSpeedOff")).width/2,maxTextHeight*cTrain+maxTextHeight/2);
                }
                contextForeground.fillRect(controlCenter.maxTextWidth,maxTextHeight*cTrain,controlCenter.maxTextWidth*0.5*cTrainPercent/100,maxTextHeight);
                if(cTrainPercent > 0) {
                    contextForeground.fillStyle = colorDark;
                    contextForeground.font = controlCenter.fontSizes.trainSizes.speedTextHeight +"px "+controlCenter.fontFamily;
                    contextForeground.fillText((cTrainPercent+"%"),controlCenter.maxTextWidth+(controlCenter.maxTextWidth*0.5)/2-contextForeground.measureText((cTrainPercent+"%")).width/2,maxTextHeight*cTrain+maxTextHeight/2);
                }
                var isClick = (contextClick && hardware.mouse.upX-background.x-controlCenter.translateOffset > controlCenter.maxTextWidth && hardware.mouse.upX-background.x-controlCenter.translateOffset < controlCenter.maxTextWidth*1.5 && hardware.mouse.upY-background.y-controlCenter.translateOffset > maxTextHeight*cTrain && hardware.mouse.upY-background.y-controlCenter.translateOffset < maxTextHeight*cTrain+maxTextHeight);
                var isHold = (hardware.mouse.rightClickHold && hardware.mouse.downX-background.x-controlCenter.translateOffset > controlCenter.maxTextWidth && hardware.mouse.downX-background.x-controlCenter.translateOffset < controlCenter.maxTextWidth*1.5 && hardware.mouse.downY-background.y-controlCenter.translateOffset > maxTextHeight*cTrain && hardware.mouse.downY-background.y-controlCenter.translateOffset < maxTextHeight*cTrain+maxTextHeight && hardware.mouse.moveX-background.x-controlCenter.translateOffset > controlCenter.maxTextWidth && hardware.mouse.moveX-background.x-controlCenter.translateOffset < controlCenter.maxTextWidth*1.5 && hardware.mouse.moveY-background.y-controlCenter.translateOffset > maxTextHeight*cTrain && hardware.mouse.moveY-background.y-controlCenter.translateOffset < maxTextHeight*cTrain+maxTextHeight);
                if(noCollisionCTrain && (isClick || isHold || (hardware.mouse.rightClickWheelScrolls && hardware.mouse.wheelScrollY != 0 && hardware.mouse.wheelX-background.x-controlCenter.translateOffset > controlCenter.maxTextWidth && hardware.mouse.wheelX-background.x-controlCenter.translateOffset < controlCenter.maxTextWidth*1.5 && hardware.mouse.wheelY-background.y-controlCenter.translateOffset > maxTextHeight*cTrain && hardware.mouse.wheelY-background.y-controlCenter.translateOffset < maxTextHeight*cTrain+maxTextHeight))) {
                    var newSpeed;
                    if(isClick || isHold) {
                        newSpeed = Math.round(((isClick ? hardware.mouse.upX : hardware.mouse.moveX)-background.x-controlCenter.translateOffset-controlCenter.maxTextWidth)/controlCenter.maxTextWidth/0.5*100);
                    } else {
                        if(trains[cTrain].speedInPercent ==undefined || trains[cTrain].speedInPercent == 0) {
                            trains[cTrain].speedInPercent = minTrainSpeed;
                        }
                        newSpeed = Math.round(trains[cTrain].speedInPercent*(hardware.mouse.wheelScrollY < 0 ? 1.1 : 0.9));
                    }
                    if(newSpeed < minTrainSpeed) {
                        newSpeed = 0;
                    } else if(newSpeed > 100) {
                        newSpeed = 100;
                    }
                    if(trains[cTrain].accelerationSpeed > 0 && newSpeed == 0) {
                        actionSync("trains", cTrain, [{"accelerationSpeed":trains[cTrain].accelerationSpeed *= -1}], null);
                    } else if(trains[cTrain].accelerationSpeed > 0 ) {
                        actionSync("trains", cTrain, [{"speedInPercent": newSpeed}],null);
                    } else if(!trains[cTrain].move && newSpeed > 0) {
                        actionSync("trains", cTrain, [{"move":true},{"speedInPercent":newSpeed}], null);
                    } else if (trains[cTrain].accelerationSpeed < 0 && newSpeed > 0) {
                        actionSync("trains", cTrain, [{"accelerationSpeed":trains[cTrain].accelerationSpeed *= -1},{"speedInPercent":newSpeed}], null);
                    }
                    if(newSpeed > 0 && newSpeed < 100) {
                        hardware.mouse.cursor = "grabbing";
                    }
                }
                contextForeground.strokeRect(controlCenter.maxTextWidth,maxTextHeight*cTrain,controlCenter.maxTextWidth*0.5,maxTextHeight);
                if(noCollisionCTrain && (contextClick && hardware.mouse.upX-background.x-controlCenter.translateOffset > controlCenter.maxTextWidth*1.5 && hardware.mouse.upX-background.x-controlCenter.translateOffset < controlCenter.maxTextWidth*1.75 && hardware.mouse.upY-background.y-controlCenter.translateOffset > maxTextHeight*cTrain && hardware.mouse.upY-background.y-controlCenter.translateOffset < maxTextHeight*cTrain+maxTextHeight)) {
                    if(trains[cTrain].accelerationSpeed > 0){
                        actionSync("trains", cTrain, [{"accelerationSpeed":trains[cTrain].accelerationSpeed *= -1}], null);
                    } else if(!trains[cTrain].move) {
                        actionSync("trains", cTrain, [{"move":true},{"speedInPercent":50}], null);
                    } else if (trains[cTrain].accelerationSpeed < 0) {
                        actionSync("trains", cTrain, [{"accelerationSpeed":trains[cTrain].accelerationSpeed *= -1},{"speedInPercent":50}], null);
                    }
                }
                contextForeground.save();
                contextForeground.translate(controlCenter.maxTextWidth*1.625,maxTextHeight/2+maxTextHeight*cTrain);
                contextForeground.strokeStyle = noCollisionCTrain ? (trains[cTrain].move && trains[cTrain].accelerationSpeed > 0 ? "rgb(255,180,180)" : "rgb(180,255,180)") : colorDark;
                contextForeground.fillStyle = contextForeground.strokeStyle;
                contextForeground.lineWidth = Math.ceil(maxTextHeight/20);
                contextForeground.beginPath();
                contextForeground.moveTo(0, -maxTextHeight/18);
                contextForeground.lineTo(0, -maxTextHeight/3);
                contextForeground.stroke();
                contextForeground.strokeStyle = noCollisionCTrain ? colorLight : colorDark;
                contextForeground.beginPath();
                contextForeground.rotate(-Math.PI/2);
                contextForeground.arc(0,0,maxTextHeight/3.5,0.15*Math.PI,1.85*Math.PI);
                contextForeground.stroke();
                contextForeground.restore();
                contextForeground.strokeRect(controlCenter.maxTextWidth*1.5,maxTextHeight*cTrain,controlCenter.maxTextWidth*0.25,maxTextHeight);
                if(contextClick && !trains[cTrain].move && hardware.mouse.upX-background.x-controlCenter.translateOffset > controlCenter.maxTextWidth*1.7 && hardware.mouse.upX-background.x-controlCenter.translateOffset < controlCenter.maxTextWidth*2 && hardware.mouse.upY-background.y-controlCenter.translateOffset > maxTextHeight*cTrain && hardware.mouse.upY-background.y-controlCenter.translateOffset < maxTextHeight*cTrain+maxTextHeight) {
                    actionSync("trains", cTrain, [{"standardDirection":!trains[cTrain].standardDirection}],null);
                }
                contextForeground.save();
                contextForeground.translate(controlCenter.maxTextWidth*1.875,maxTextHeight/2+maxTextHeight*cTrain);
                if(!trains[cTrain].standardDirection) {
                    contextForeground.rotate(Math.PI);
                }
                if(trains[cTrain].move) {
                    contextForeground.strokeStyle = colorDark;
                } else {
                    contextForeground.strokeStyle = colorLight;
                    if(hardware.mouse.moveX > background.x+controlCenter.translateOffset+1.75*controlCenter.maxTextWidth && hardware.mouse.moveY > background.y+controlCenter.translateOffset+maxTextHeight*cTrain && hardware.mouse.moveX < background.x+controlCenter.translateOffset+2*controlCenter.maxTextWidth && hardware.mouse.moveY < background.y+controlCenter.translateOffset+maxTextHeight*cTrain+maxTextHeight) {
                        hardware.mouse.cursor = "pointer";
                    }
                }
                contextForeground.fillStyle = contextForeground.strokeStyle;
                contextForeground.lineWidth = Math.ceil(maxTextHeight/5);
                contextForeground.beginPath();
                contextForeground.moveTo(-controlCenter.maxTextWidth*0.075, 0);
                contextForeground.lineTo(controlCenter.maxTextWidth*0.051, 0);
                contextForeground.stroke();
                contextForeground.beginPath();
                contextForeground.moveTo(controlCenter.maxTextWidth*0.05, -0.25*maxTextHeight);
                contextForeground.lineTo(controlCenter.maxTextWidth*0.05, 0.25*maxTextHeight);
                contextForeground.lineTo(controlCenter.maxTextWidth*0.1, 0);
                contextForeground.lineTo(controlCenter.maxTextWidth*0.05, -0.25*maxTextHeight);
                contextForeground.fill();
                contextForeground.restore();
                contextForeground.strokeRect(controlCenter.maxTextWidth*1.75,maxTextHeight*cTrain,controlCenter.maxTextWidth*0.25,maxTextHeight);
            }
        }
        contextForeground.restore();
        hardware.mouse.rightClickWheelScrolls = false;
    } else {
        controlCenter.showCarCenter = null;
        hardware.mouse.rightClick = false;
    }

    /////KONAMI/Colors/////
    if(konamistate < -1) {
        var imgData = context.getImageData(background.x, background.y, background.width, background.height);
        var data = imgData.data;
        for (var i = 0; i < data.length; i += 8) {
            data[i] = data[i+4] = Math.min(255,data[i] < 120 ? data[i]/1.3 : data[i]*1.1);
            data[i+1] = data[i+5] = Math.min(255,data[i+1] < 120 ? data[i+1]/1.3 : data[i+1]*1.1);
            data[i+2] = data[i+6] = Math.min(255,data[i+2] < 120 ? data[i+2]/1.3 : data[i+2]*1.1);
        }
        context.putImageData(imgData, background.x, background.y);
        imgData = contextForeground.getImageData(background.x, background.y, background.width, background.height);
        var data = imgData.data;
        for (var i = 0; i < data.length; i += 8) {
            data[i] = data[i+4] = Math.min(255,data[i] < 120 ? data[i]/1.3 : data[i]*1.1);
            data[i+1] = data[i+5] = Math.min(255,data[i+1] < 120 ? data[i+1]/1.3 : data[i+1]*1.1);
            data[i+2] = data[i+6] = Math.min(255,data[i+2] < 120 ? data[i+2]/1.3 : data[i+2]*1.1);
        }
        contextForeground.putImageData(imgData, background.x, background.y);
    }

    /////BACKGROUND/Margins-2////
    if(konamistate < 0) {
        context.save();
        var bgGradient = context.createRadialGradient(0,canvas.height/2,canvas.height/2,canvas.width+canvas.height/2,canvas.height/2,canvas.height/2);
        bgGradient.addColorStop(0, "red");
        bgGradient.addColorStop(0.2,"orange");
        bgGradient.addColorStop(0.4,"yellow");
        bgGradient.addColorStop(0.6,"lightgreen");
        bgGradient.addColorStop(0.8,"blue");
        bgGradient.addColorStop(1,"violet");
        if(konamistate == -1) {
            contextForeground.save();
            contextForeground.fillStyle = "black";
            contextForeground.fillRect(background.x,background.y,background.width,background.height);
            contextForeground.textAlign = "center";
            contextForeground.fillStyle = bgGradient;
            var konamiText = getString("appScreenKonami", "!");
            contextForeground.font = measureFontSize(konamiText,"monospace",100,background.width/1.1,5, background.width/300, 0);
            contextForeground.fillText(konamiText,background.x+background.width/2,background.y+background.height/2);
            contextForeground.fillText(getString("appScreenKonamiIconRow"),background.x+background.width/2,background.y+background.height/4);
            contextForeground.fillText(getString("appScreenKonamiIconRow"),background.x+background.width/2,background.y+background.height/2+background.height/4);
            contextForeground.restore();
        }
        context.fillStyle = bgGradient;
        context.fillRect(0,0,background.x,canvas.height);
        context.fillRect(0,0,canvas.width,background.y);
        context.fillRect(canvas.width-background.x,0,background.x,canvas.height);
        context.fillRect(0,canvas.height-background.y,canvas.width,background.y);
        context.restore();
    }

    /////CURSOR/////
    if(settings.cursorascircle && isHardwareAvailable("cursorascircle") && (hardware.mouse.isMoving || hardware.mouse.isHold) && hardware.mouse.cursor != "none") {
        contextForeground.save();
        contextForeground.translate(adjustScaleX(hardware.mouse.moveX),adjustScaleY(hardware.mouse.moveY));
        contextForeground.fillStyle = hardware.mouse.cursor == "grabbing" ? "rgba(65,56,65," + (Math.random() * (0.3) + 0.6) + ")" : (hardware.mouse.cursor == "pointer" ? "rgba(99,118,140," + (Math.random() * (0.3) + 0.6) + ")" : (hardware.mouse.isHold ? "rgba(144,64,64," + (Math.random() * (0.3) + 0.6) + ")" : "rgba(255,250,240,0.5)"));
        var rectsize = canvas.width / 75;
        contextForeground.beginPath();
        contextForeground.arc(0,0,rectsize/2,0,2*Math.PI);
        contextForeground.fill();
        contextForeground.fillStyle = hardware.mouse.cursor == "grabbing" ? "rgba(50,45,50,1)" : (hardware.mouse.cursor == "pointer" ? "rgba(50,63,95,1)" : (hardware.mouse.isHold ? "rgba(200,64,64,1)" : "rgba((255,250,240,0.5)"));
        contextForeground.beginPath();
        contextForeground.arc(0,0,rectsize/4,0,2*Math.PI);
        contextForeground.fill();
        contextForeground.restore();
    }
    canvasForeground.style.cursor =  isHardwareAvailable("cursorascircle") ? (settings.cursorascircle ? "none" : hardware.mouse.cursor) : "default";
    hardware.mouse.wheelScrolls = false;

    /////REPAINT/////
    if(drawTimeout !== undefined && drawTimeout !== null) {
        window.clearTimeout(drawTimeout);
    }
    var resttime = drawInterval-(Date.now()-starttime);
    if(resttime <= 0) {
        window.requestAnimationFrame(drawObjects);
    } else {
        drawTimeout = window.setTimeout(function(){
            window.requestAnimationFrame(drawObjects);
        }, resttime);
    }

}

function actionSync (objname, index, params, notification) {
    if(onlineGame.enabled) {
        if(!onlineGame.stop) {
            teamplaySync ("action", objname, index, params, notification);
        }
    } else {
        switch (objname) {
        case "trains":
            animateWorker.postMessage({k: "train", i: index, params: params});
            if(notification !== null) {
                var notifyArr = [];
                notification.forEach(function(elem){
                    notifyArr.push(getString.apply( null, elem.getString ));
                });
                var notifyStr = formatJSString.apply( null, notifyArr );
                notify("#canvas-notifier", notifyStr, NOTIFICATION_PRIO_DEFAULT, 1000, null,null,client.y);
            }
            break;
        }
    }
}

function teamplaySync (mode, objname, index, params, notification) {
    switch (mode) {
    case "action":
        var output = {};
        output.objname = objname;
        output.index = index;
        output.params = params;
        output.notification = notification;
        onlineConnection.send({mode: "action", gameId: onlineGame.id, message: JSON.stringify(output)});
        break;
    case "sync-ready":
        onlineConnection.send({mode: "sync-ready"});
        break;
    }
}

/**************
Variablen-Namen
**************/
var animateWorker = new Worker("./src/js/scripting_worker_animate.js");
var settings = {};

var frameNo = 0;
var canvas;
var canvasBackground;
var canvasSemiForeground;
var canvasForeground;
var context;
var contextBackground;
var contextSemiForeground;
var contextForeground;
var drawInterval;
var drawTimeout;

var movingTimeOut;
var clickTimeOut;
var longTouchTime = 500;
var longTouchWaitTime = Math.floor(longTouchTime*0.8);
var doubleClickTime = 100;
var doubleClickWaitTime = doubleClickTime*2;

var konamistate = 0;
var konamiTimeOut;

var pics = [{id: 0, extension: "png"},{id: 1, extension: "png"},{id: 2, extension: "png"},{id: 3, extension: "png"},{id: 4, extension: "png"},{id: 5, extension: "png"},{id: 6, extension: "png"},{id: 7, extension: "png"},{id: 8, extension: "png"},{id: 9, extension: "jpg"},{id: 10, extension: "png"},{id: 11, extension: "png"},{id: 12, extension: "png"},{id: 13, extension: "png"},{id: 14, extension: "png"},{id: 15, extension: "png"},{id: 16, extension: "png"},{id: 17, extension: "png"},{id: 18, extension: "png"},{id: 19, extension: "png"},{id: 20, extension: "png"},{id: 21, extension: "png"},{id: 22, extension: "png"}];

var background = {src: 9, secondLayer: 10};
var oldbackground;

var rotationPoints;
var trains;
var minTrainSpeed = 10;
var trainParams;
var switches = {inner2outer: {left: {turned: false, angles: {normal: 1.01*Math.PI, turned: 0.941*Math.PI}}, right: {turned: false, angles: {normal: 1.5*Math.PI, turned: 1.56*Math.PI}}}, outer2inner: {left: {turned: false, angles: {normal: 0.25*Math.PI, turned: 2.2*Math.PI}}, right: {turned: false, angles: {normal: 0.27*Math.PI, turned: 0.35*Math.PI}}}, innerWide: {left: {turned: false, angles: {normal: 1.44*Math.PI, turned: 1.37*Math.PI}}, right: {turned: false, angles: {normal: 1.02*Math.PI, turned: 1.1*Math.PI}}}, outerAltState3: {left: {turned: true, angles: {normal: 1.75*Math.PI, turned: 1.85*Math.PI}}, right: {turned: true, angles: {normal: 0.75*Math.PI, turned: 0.65*Math.PI}}}, sidings1: {left: {turned: false, angles: {normal: 1.75*Math.PI, turned: 1.7*Math.PI}}}, sidings2: {left: {turned: false, angles: {normal: 1.65*Math.PI, turned: 1.72*Math.PI}}}, sidings3: {left: {turned: false, angles: {normal: 1.65*Math.PI, turned: 1.73*Math.PI}}}};
var switchesBeforeFac;

var cars = [{src: 16, fac: 0.02, speed: 0.0008, startFrameFac: 0.65, angles: {start: Math.PI,normal: 0}},{src: 17, fac: 0.02, speed: 0.001, startFrameFac: 0.335, angles: {start: 0, normal: Math.PI}},{src: 0, fac: 0.0202, speed: 0.00082, startFrameFac: 0.65, angles: {start: Math.PI, normal: 0}}];
var carPaths = [{start: [{type: "curve_right", x:[0.29,0.29],y:[0.38,0.227]}], normal: [{type: "curve_hright", x:[0.29,0.29],y:[0.227,0.347]},{type: "linear_vertical", x:[0,0], y: [0,0]},{type: "curve_hright2", x:[0,0], y: [0.282,0.402]},{type: "curve_l2r", x:[0,0.25], y: [0.402,0.412]},{type: "linear", x: [0.25,0.225], y: [0.412,0.412]},{type: "curve_right", x: [0.225,0.225], y: [0.412,0.227]},{type: "linear", x:[0.225,0.29], y:[0.227,0.227]}]},{start: [{type: "curve_left", x:[0.26,0.26], y: [0.3,0.198]},{type: "curve_r2l", x:[0.26,0.216], y: [0.198,0.197]}], normal: [{type: "curve_left", x:[0.216,0.216], y: [0.197,0.419]},{type: "linear", x:[0.216,0.246], y:[0.419,419]},{type: "curve_r2l", x:[0.246,0.286], y:[0.419,0.43]},{type: "linear", x:[0.286,0.31], y:[0.43,0.43]},{type: "curve_hleft", x:[0.31,0.31], y: [0.43,0.33]},{type: "linear_vertical", x:[0,0], y: [0,0]},{type: "curve_hleft2", x:[0,0], y: [0.347,0.197]},{type: "linear", x:[0,0.216], y:[0.197,0.197]},{type: "curve_left", x:[0.216,0.216], y: [0.197,0.419]},{type: "linear", x:[0.216,0.246], y:[0.419,419]},{type: "curve_r2l", x:[0.246,0.276], y:[0.419,0.434]},{type: "linear", x:[0.276,0.38], y:[0.434,434]},{type: "curve_l2r", x:[0.38,0.46], y:[0.434,0.419]},{type: "linear", x:[0.46,0.631], y:[0.419,0.419]},{type: "curve_r2l", x:[0.631,0.665], y:[0.419,0.43]},{type: "curve_left", x:[0.665,0.665], y: [0.43,0.322]},{type: "curve_l2r", x:[0.665,0.59], y: [0.322,0.39]},{type: "linear", x:[0.59,0.339], y:[0.39,0.39]},{type: "curve_hright", x:[0.339,0.339], y: [0.39,0.32]},{type: "linear_vertical", x:[0,0], y: [0,0]},{type: "curve_hleft2", x:[0,0], y: [0.347,0.197]},{type: "linear", x:[0,0.216], y:[0.197,0.197]}]},{start: [{type: "curve_right", x:[0.2773,0.2773],y:[0.38,0.227]},{type: "linear", x:[0.2773,0.29],y:[0.227,0.227]}], normal: [{type: "curve_hright", x:[0.29,0.29],y:[0.227,0.347]},{type: "linear_vertical", x:[0,0], y: [0,0]},{type: "curve_hleft2", x:[0,0], y: [0.299,0.419]},{type: "linear", x:[0,0.631], y:[0.419,0.419]},{type: "curve_r2l", x:[0.631,0.665], y:[0.419,0.43]},{type: "curve_left", x:[0.665,0.665], y: [0.43,0.322]},{type: "curve_l2r", x:[0.665,0.59], y: [0.322,0.39]},{type: "linear", x:[0.59,0.339], y:[0.39,0.39]},{type: "curve_l2r", x:[0.339,0.25], y: [0.39,0.412]},{type: "linear", x: [0.25,0.225], y: [0.412,0.412]},{type: "curve_right", x: [0.225,0.225], y: [0.412,0.227]},{type: "linear", x:[0.225,0.29], y:[0.227,0.227]}]}];
var carWays = [];
var carParams = {init: true, wayNo: 7};

var taxOffice = {params: {number: 45, frameNo: 6, frameProbability: 0.6, fire: {x: 0.07, y: 0.06, size: 0.000833, color:{red: {red: 200, green: 0, blue: 0, alpha: 0.4}, yellow: {red: 255, green: 160, blue: 0, alpha: 1}, probability: 0.8}}, smoke: {x: 0.07, y: 0.06, size: 0.02, color: {red: 130, green: 120, blue: 130, alpha: 0.3}}, bluelights: {frameNo: 16, cars: [{frameNo: 0, x: [-0.0105, -0.0026], y: [0.175, 0.0045], size: 0.0008},{frameNo: 3, x: [0.0275, -0.00275], y: [0.1472, 0.0092], size: 0.001},{frameNo: 5, x: [0.0568, 0.0008], y: [0.177, 0.0148], size: 0.001}]}}};

var classicUI = {trainSwitch: {src: 11, selectedTrainDisplay: {}}, transformer: {src:13, asrc: 12, angle:(Math.PI/5),input:{src:14,angle:0,minAngle:minTrainSpeed,maxAngle:1.5*Math.PI},directionInput:{src:15,}}, switches: {showDuration: 11, showDurationFade: 33, showDurationEnd: 44}};

var controlCenter = {showCarCenter: null, fontFamily: "sans-serif"};

var hardware = {mouse: {moveX:0, moveY:0,downX:0, downY:0, downTime: 0,upX:0, upY:0, upTime: 0, isMoving: false, isHold: false, rightClick: false, cursor: "default"}};
var client = {devicePixelRatio: 1,realScaleMax:6,realScaleMin:1.2};
var onlineGame = {animateInterval: 40, syncInterval: 10000, excludeFromSync: {"t": ["src", "assetFlip", "fac", "speedFac", "accelerationSpeedStartFac", "accelerationSpeedFac", "lastDirectionChange", "bogieDistance", "width", "height", "speed", "crash", "flickerFacBack", "flickerFacBackOffset", "flickerFacFront", "flickerFacFrontOffset", "margin", "cars"], "tc": ["src", "assetFlip", "fac", "bogieDistance", "width", "height", "konamiUseTrainIcon"]}, chatSticker: 7, resized: false};
var onlineConnection = {serverURI: getServerLink(PROTOCOL_WS) + "/multiplay"};

var resizeTimeout;
var resized = false;

var debug = false;
var debugDrawPoints = [];
var debugDrawPointsCrash = [];
var debugTrainCollisions;

/******************************************
*         Window Event Listeners          *
******************************************/
function resizeCars(oldBg) {
    cars.forEach(function(car){
        car.speed *= background.width/oldBg.width;
        car.x *= background.width/oldBg.width;
        car.y *= background.height/oldBg.height;
        car.width *= background.width / oldBg.width;
        car.height *= background.height / oldBg.height;
    });
}
function resize() {
    resized = true;
    if(onlineGame.enabled) {
        if(onlineGame.resizedTimeout != undefined && onlineGame.resizedTimeout != null) {
            window.clearTimeout(onlineGame.resizedTimeout);
        }
        onlineGame.resized = true;
    }
    client.realScale = client.touchScale = client.lastTouchScale = 1;
    client.touchScaleX = client.touchScaleY = client.touchScaleXKeyFake = client.touchScaleYKeyFake = 0;
    oldbackground = copyJSObject(background);
    extendedMeasureViewspace();
    placeBackground();

    animateWorker.postMessage({k: "resize", background: background,oldbackground: oldbackground});

    carWays.forEach(function(way){
        Object.keys(way).forEach(function(cType) {
            way[cType].forEach(function(point){
                point.x*=background.width/oldbackground.width;
                point.y*=background.height/oldbackground.height;
            });
        });
    });
    resizeCars(oldbackground);

    taxOffice.params.fire.x *= background.width/oldbackground.width;
    taxOffice.params.fire.y *= background.height/oldbackground.height;
    taxOffice.params.fire.size *= background.width/oldbackground.width;
    taxOffice.params.smoke.x *= background.width/oldbackground.width;
    taxOffice.params.smoke.y *= background.height/oldbackground.height;
    taxOffice.params.smoke.size *= background.width/oldbackground.width;
    for (var i = 0; i <  taxOffice.params.number; i++) {
        taxOffice.fire[i].x *= background.width/oldbackground.width;
        taxOffice.fire[i].y *= background.height/oldbackground.height;
        taxOffice.fire[i].size *= background.width/oldbackground.width;
        taxOffice.smoke[i].x *= background.width/oldbackground.width;
        taxOffice.smoke[i].y *= background.height/oldbackground.height;
        taxOffice.smoke[i].size *= background.width/oldbackground.width;
    }
    taxOffice.params.bluelights.cars.forEach(function(car){
        car.x[0] *= background.width/oldbackground.width;
        car.x[1] *= background.width/oldbackground.width;
        car.y[0] *= background.height/oldbackground.height;
        car.y[1] *= background.height/oldbackground.height;
        car.size *= background.width/oldbackground.width;
    });

    placeClassicUIElements();
    calcControlCenter();

    if(typeof placeOptions == "function") {
        placeOptions("resize");
    }
}
window.onload = function() {

    function chooseInputMethod(event){
        client.realScale = 1;
        client.lastTouchScale=1;
        client.touchScale=1;
        client.touchScaleX=0;
        client.touchScaleY=0;
        client.touchScaleXKeyFake=0;
        client.touchScaleYKeyFake=0;
        var type = event.type;
        canvasForeground.removeEventListener("touchstart",chooseInputMethod);
        canvasForeground.removeEventListener("mousemove",chooseInputMethod);
        canvasForeground.addEventListener("touchmove", getTouchMove);
        canvasForeground.addEventListener("touchstart", getTouchStart);
        canvasForeground.addEventListener("touchleave", getTouchLeave);
        canvasForeground.addEventListener("touchend", getTouchEnd);
        canvasForeground.addEventListener("mousemove", onMouseMove);
        canvasForeground.addEventListener("mousedown", onMouseDown);
        canvasForeground.addEventListener("mouseup", onMouseUp);
        canvasForeground.addEventListener("mouseout", onMouseOut);
        canvasForeground.addEventListener("wheel", onMouseWheel);
        canvasForeground.addEventListener("contextmenu", onMouseRight);
        if(type == "touchstart"){
            client.chosenInputMethod = "touch";
            getTouchStart(event);
        } else {
            client.chosenInputMethod = "mouse";
            onMouseMove(event);
        }
        setCurrentHardwareConfig("input",client.chosenInputMethod);
    }

    function initialDisplay() {

        function defineCarParams(){
            cars.forEach(function(car, i){
                car.speed *= background.width;
                car.collStop = true;
                car.collStopNo = [];
                if(i === 0){
                    carParams.lowestSpeedNo = i;
                } else if (car.speed < cars[carParams.lowestSpeedNo].speed) {
                    carParams.lowestSpeedNo = i;
                }
            });
            cars.forEach(function(car,i){
                Object.keys(carPaths[i]).forEach(function(cType) {
                    carPaths[i][cType].forEach(function(cPoint){
                        for(var k = 0; k < cPoint.x.length && k < cPoint.y.length; k++){
                            cPoint.x[k]*=background.width;
                            cPoint.y[k]*=background.height;
                        }
                    });
                    for(var j = 0; j < carPaths[i][cType].length; j++){
                        for(var k = 0; k < carPaths[i][cType][j].type.length; k++){
                            switch(carPaths[i][cType][j].type){
                            case "linear_vertical":
                                carPaths[i][cType][j].x[0] = carPaths[i][cType][j].x[1] = carPaths[i][cType][j-1].x[1]+Math.abs((carPaths[i][cType][j-1].y[1]-carPaths[i][cType][j-1].y[0])/2)*((carPaths[i][cType][j-1].type == "curve_hright") ? 1 : -1)*((carPaths[i][cType][j-1].y[1] > carPaths[i][cType][j-1].y[0]) ? 1 : -1);
                                carPaths[i][cType][j].y[0] = carPaths[i][cType][j-1].y[0]+(carPaths[i][cType][j-1].y[1]-carPaths[i][cType][j-1].y[0])/2;
                                carPaths[i][cType][j].y[1] = carPaths[i][cType][j+1].y[1]+(carPaths[i][cType][j+1].y[0]-carPaths[i][cType][j+1].y[1])/2;
                                break;
                            case "curve_hright2":
                                var x0 = carPaths[i][cType][j-1].x[0]-(carPaths[i][cType][j].y[1]-carPaths[i][cType][j].y[0])/2;
                                carPaths[i][cType][j].x =[x0,x0];
                                carPaths[i][cType][j+1 >= carPaths[i][cType].length ? 0 : j+1].x[0]=x0;
                                break;
                            case "curve_hleft2":
                                var x0 = carPaths[i][cType][j-1].x[0]-(carPaths[i][cType][j].y[0]-carPaths[i][cType][j].y[1])/2;
                                carPaths[i][cType][j].x =[x0,x0];
                                carPaths[i][cType][j+1 >= carPaths[i][cType].length ? 0 : j+1].x[0]=x0;
                                break;
                            }
                        }
                    }
                    if(typeof carWays[i] == "undefined"){
                        carWays[i] = {};
                    }
                    carWays[i][cType] = defineCarWays(cType, ((typeof carPaths[i].start == "undefined" && cType == "normal") || (cType == "start")), i);
                });
            });
        }

        function placeCarsAtInitialPositions() {
            for (var i = 0; i < cars.length; i++){
                cars[i].width = cars[i].fac * background.width;
                cars[i].height = cars[i].fac * (pics[cars[i].src].height * (background.width / pics[cars[i].src].width));
                if(i === 0){
                    carParams.thickestCar = i;
                } else if (cars[i].height > cars[carParams.thickestCar].height) {
                    carParams.thickestCar = i;
                }
                cars[i].cType =  typeof carWays[i].start == "undefined" ?  "normal" : "start";
                cars[i].displayAngle = carWays[i][cars[i].cType][cars[i].counter].angle;
                cars[i].x = carWays[i][cars[i].cType][cars[i].counter].x;
                cars[i].y = carWays[i][cars[i].cType][cars[i].counter].y;
                cars[i].backToInit = false;
                cars[i].parking = true;
            }
        }

        function defineCarWays(cType, isFirst, i, j, obj, currentObject, stateNullAgain) {

            function curve_right(p){
                if(p.x[0]!=p.x[1]){
                    p.x[1]=p.x[0];
                }
                var radius = Math.abs(p.y[0]-p.y[1])/2;
                var arc = Math.abs(currentObject.angle)*radius;
                arc += currentObject.speed;
                currentObject.angle = (arc / radius);
                var chord = 2* radius * Math.sin((currentObject.angle)/2);
                var gamma = Math.PI/2-(Math.PI-(currentObject.angle))/2;
                var x = Math.cos(gamma)*chord;
                var y = Math.sin(gamma)*chord;
                currentObject.x = ( p.y[1] < p.y[0] ) ? x + p.x[1] : x + p.x[0];
                currentObject.y = ( p.y[1] < p.y[0] ) ? y + p.y[1] : y + p.y[0];
                if(p.y[1] > p.y[0]) {
                    if(arc >= Math.PI*radius || currentObject.angle >= Math.PI){
                        currentObject.x = p.x[1];
                        currentObject.y = p.y[1];
                        currentObject.angle = Math.PI;
                        currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                    }
                } else {
                    if(arc >= 2*Math.PI*radius || currentObject.angle >= 2*Math.PI){
                        currentObject.x = p.x[1];
                        currentObject.y = p.y[1];
                        currentObject.angle = 0;
                        currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                    }
                }
                currentObject.displayAngle = currentObject.angle;
            }

            function curve_left(p){
                if(p.x[0]!=p.x[1]){
                    p.x[1]=p.x[0];
                }
                var radius = Math.abs(p.y[0]-p.y[1])/2;
                var arc = Math.abs(currentObject.angle)*radius;
                arc += currentObject.speed;
                currentObject.angle = (arc / radius);
                var chord = 2* radius * Math.sin((currentObject.angle)/2);
                var gamma = Math.PI/2-(Math.PI-(currentObject.angle))/2;
                var x = Math.cos(gamma)*chord;
                var y = Math.sin(gamma)*chord;
                currentObject.x = ( p.y[1] < p.y[0] ) ? p.x[0] + x : p.x[1] + x;
                currentObject.y = ( p.y[1] < p.y[0] ) ? p.y[0] - y : p.y[1] - y;
                if(p.y[1] > p.y[0]) {
                    if(arc >= 2*Math.PI*radius || currentObject.angle >= 2*Math.PI){
                        currentObject.x = p.x[1];
                        currentObject.y = p.y[1];
                        currentObject.angle = 0;
                        currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                    }
                } else {
                    if(arc >= Math.PI*radius || currentObject.angle >= Math.PI){
                        currentObject.x = p.x[1];
                        currentObject.y = p.y[1];
                        currentObject.angle = Math.PI;
                        currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                    }
                }
                currentObject.displayAngle = -currentObject.angle;
            }

            if(typeof j == "undefined") {
                j = 0;
            }
            if(typeof obj == "undefined") {
                obj = [];
            }
            if(typeof currentObject == "undefined"){
                currentObject = copyJSObject(cars[i]);
                currentObject.state = 0;
                currentObject.angle = currentObject.displayAngle = cars[i].angles[cType];
                currentObject.x = carPaths[i][cType][0].x[0];
                currentObject.y = carPaths[i][cType][0].y[0];
            }
            if(typeof stateNullAgain == "undefined"){
                stateNullAgain = false;
            }
            obj[j] = {};
            obj[j].x = currentObject.x;
            obj[j].y = currentObject.y;
            while(currentObject.displayAngle  < 0) {
                currentObject.displayAngle  += Math.PI*2;
            }

            while (currentObject.displayAngle  >= Math.PI*2){
                currentObject.displayAngle -= Math.PI*2;
            }
            obj[j].angle = currentObject.displayAngle;
            switch(carPaths[i][cType][currentObject.state].type){

            case "linear":
                currentObject.angle = currentObject.angle < Math.PI/2 ? 0 : Math.PI;
                currentObject.x += currentObject.speed*(currentObject.angle < Math.PI/2 ? 1 : -1);
                if(currentObject.angle < Math.PI/2) {
                    if(currentObject.x >= carPaths[i][cType][currentObject.state].x[1]){
                        currentObject.x = carPaths[i][cType][currentObject.state].x[1];
                        currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                    }
                } else {
                    if(currentObject.x <= carPaths[i][cType][currentObject.state].x[1]){
                        currentObject.x = carPaths[i][cType][currentObject.state].x[1];
                        currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                    }
                }
                currentObject.displayAngle = currentObject.angle;
                break;

            case "linear_vertical":
                currentObject.angle = currentObject.angle < Math.PI ? 0.5*Math.PI : 1.5*Math.PI;
                currentObject.y += currentObject.speed*(currentObject.angle < Math.PI ? 1 : -1);
                if(currentObject.angle < Math.PI) {
                    if(currentObject.y >= carPaths[i][cType][currentObject.state].y[1]){
                        currentObject.y = carPaths[i][cType][currentObject.state].y[1];
                        currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                    }
                } else {
                    if(currentObject.y <= carPaths[i][cType][currentObject.state].y[1]){
                        currentObject.y = carPaths[i][cType][currentObject.state].y[1];
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
                if(carPaths[i][cType][currentObject.state].y[0] < carPaths[i][cType][currentObject.state].y[1]) {
                    var dx = (carPaths[i][cType][currentObject.state].x[1]-carPaths[i][cType][currentObject.state].x[0])/2;
                    var dy = (carPaths[i][cType][currentObject.state].y[1]-carPaths[i][cType][currentObject.state].y[0])/2;
                    if(currentObject.angle <= Math.PI){
                        p.y[1] = carPaths[i][cType][currentObject.state].y[0]+2*((Math.pow(dy,2)+Math.pow(dx,2))/(2*dy));
                        curve_right(p);
                        if(currentObject.y >= carPaths[i][cType][currentObject.state].y[0]+(carPaths[i][cType][currentObject.state].y[1]-carPaths[i][cType][currentObject.state].y[0])/2) {
                            var diff = currentObject.angle-Math.PI*45/180;
                            currentObject.angle = Math.PI*315/180-diff;
                            currentObject.x = carPaths[i][cType][currentObject.state].x[0]-(carPaths[i][cType][currentObject.state].x[0]-carPaths[i][cType][currentObject.state].x[1])/2;
                            currentObject.y = carPaths[i][cType][currentObject.state].y[0]+(carPaths[i][cType][currentObject.state].y[1]-carPaths[i][cType][currentObject.state].y[0])/2;
                        }
                    } else {
                        p.x[0] = carPaths[i][cType][currentObject.state].x[1];
                        p.y[0] = carPaths[i][cType][currentObject.state].y[1]-2*((Math.pow(dy,2)+Math.pow(dx,2))/(2*dy));
                        curve_left(p);
                    }
                } else {
                    var dx = (carPaths[i][cType][currentObject.state].x[0]-carPaths[i][cType][currentObject.state].x[1])/2;
                    var dy = (carPaths[i][cType][currentObject.state].y[0]-carPaths[i][cType][currentObject.state].y[1])/2;
                    if(currentObject.angle >= Math.PI){
                        p.y[1] = carPaths[i][cType][currentObject.state].y[0]-2*((Math.pow(dy,2)+Math.pow(dx,2))/(2*dy));
                        curve_right(p);
                        if(currentObject.y <= carPaths[i][cType][currentObject.state].y[0]-(carPaths[i][cType][currentObject.state].y[0]-carPaths[i][cType][currentObject.state].y[1])/2) {
                            var diff = currentObject.angle-Math.PI*225/180;
                            currentObject.angle = Math.PI*135/180-diff;
                            currentObject.x = carPaths[i][cType][currentObject.state].x[0]+(carPaths[i][cType][currentObject.state].x[1]-carPaths[i][cType][currentObject.state].x[0])/2;
                            currentObject.y = carPaths[i][cType][currentObject.state].y[0]-(carPaths[i][cType][currentObject.state].y[0]-carPaths[i][cType][currentObject.state].y[1])/2;
                        }
                    } else {
                        p.x[0] = carPaths[i][cType][currentObject.state].x[1];
                        p.y[0] = carPaths[i][cType][currentObject.state].y[1]+2*((Math.pow(dy,2)+Math.pow(dx,2))/(2*dy));
                        curve_left(p);
                    }
                }
                break;

            case "curve_l2r":
                if(carPaths[i][cType][currentObject.state].y[0] < carPaths[i][cType][currentObject.state].y[1]) {
                    var dx = (carPaths[i][cType][currentObject.state].x[0]-carPaths[i][cType][currentObject.state].x[1])/2;
                    var dy = (carPaths[i][cType][currentObject.state].y[1]-carPaths[i][cType][currentObject.state].y[0])/2;
                    var p = copyJSObject(carPaths[i][cType][currentObject.state]);
                    if(currentObject.angle >= Math.PI){
                        p.y[1] = carPaths[i][cType][currentObject.state].y[0]+2*((Math.pow(dy,2)+Math.pow(dx,2))/(2*dy));
                        curve_left(p);
                        if(currentObject.y >= carPaths[i][cType][currentObject.state].y[0]+(carPaths[i][cType][currentObject.state].y[1]-carPaths[i][cType][currentObject.state].y[0])/2) {
                            var diff = currentObject.angle-Math.PI*225/180;
                            currentObject.angle = Math.PI*135/180-diff;
                            currentObject.x = carPaths[i][cType][currentObject.state].x[0]-(carPaths[i][cType][currentObject.state].x[0]-carPaths[i][cType][currentObject.state].x[1])/2;
                            currentObject.y = carPaths[i][cType][currentObject.state].y[0]+(carPaths[i][cType][currentObject.state].y[1]-carPaths[i][cType][currentObject.state].y[0])/2;
                        }
                    } else {
                        p.x[0] = carPaths[i][cType][currentObject.state].x[1];
                        p.y[0] = carPaths[i][cType][currentObject.state].y[1]-2*((Math.pow(dy,2)+Math.pow(dx,2))/(2*dy));
                        curve_right(p);

                    }
                } else {
                    var dx = (carPaths[i][cType][currentObject.state].x[1]-carPaths[i][cType][currentObject.state].x[0])/2;
                    var dy = (carPaths[i][cType][currentObject.state].y[0]-carPaths[i][cType][currentObject.state].y[1])/2;
                    var p = copyJSObject(carPaths[i][cType][currentObject.state]);
                    if(currentObject.angle <= Math.PI){
                        p.y[1] = carPaths[i][cType][currentObject.state].y[0]-2*((Math.pow(dy,2)+Math.pow(dx,2))/(2*dy));
                        curve_left(p);
                        if(currentObject.y <= carPaths[i][cType][currentObject.state].y[0]-(carPaths[i][cType][currentObject.state].y[0]-carPaths[i][cType][currentObject.state].y[1])/2) {
                            var diff = currentObject.angle-Math.PI*45/180;
                            currentObject.angle = Math.PI*315/180-diff;
                            currentObject.x = carPaths[i][cType][currentObject.state].x[0]+(carPaths[i][cType][currentObject.state].x[1]-carPaths[i][cType][currentObject.state].x[0])/2;
                            currentObject.y = carPaths[i][cType][currentObject.state].y[0]-(carPaths[i][cType][currentObject.state].y[0]-carPaths[i][cType][currentObject.state].y[1])/2;
                        }
                    } else {
                        p.x[0] = carPaths[i][cType][currentObject.state].x[1];
                        p.y[0] = carPaths[i][cType][currentObject.state].y[1]+2*((Math.pow(dy,2)+Math.pow(dx,2))/(2*dy));
                        curve_right(p);
                    }
                }
                break;

            case "curve_hright":
                var p = copyJSObject(carPaths[i][cType][currentObject.state]);
                curve_right(p);
                if(p.y[1] > p.y[0]) {
                    if(currentObject.angle >= 0.5*Math.PI){
                        currentObject.x = p.x[1]+(p.y[1]-p.y[0])/2;
                        currentObject.y = p.y[1]-(p.y[1]-p.y[0])/2;
                        currentObject.angle = currentObject.displayAngle = 0.5*Math.PI;
                        currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                    }
                } else {
                    if(currentObject.angle >= 1.5*Math.PI){
                        currentObject.x = p.x[1]-(p.y[0]-p.y[1])/2;
                        currentObject.y = p.y[1]+(p.y[0]-p.y[1])/2;
                        currentObject.angle = currentObject.displayAngle = 1.5*Math.PI;
                        currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                    }
                }
                break;

            case "curve_hleft":
                var p = copyJSObject(carPaths[i][cType][currentObject.state]);
                curve_left(p);
                if (p.y[1] > p.y[0]) {
                    //TODO
                } else {
                    if(currentObject.angle >= 0.5*Math.PI){
                        currentObject.x = p.x[1]+(p.y[0]-p.y[1])/2;
                        currentObject.y = p.y[1]+(p.y[0]-p.y[1])/2;
                        currentObject.angle = currentObject.displayAngle = 1.5*Math.PI;
                        currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                    }
                }
                break;

            case "curve_hright2":
                curve_right(carPaths[i][cType][currentObject.state]);
                break;

            case "curve_hleft2":
                if((currentObject.angle == 0.5*Math.PI || currentObject.angle == 1.5*Math.PI)){
                    currentObject.angle = (2 * Math.PI - (currentObject.angle));
                }
                curve_left(carPaths[i][cType][currentObject.state]);
                break;

            }
            if(!stateNullAgain && (currentObject.state > 0 || currentObject.state == -1)) {
                stateNullAgain = true;
                if(isFirst){
                    cars[i].startFrame = cars[i].counter = Math.floor(cars[i].startFrameFac*j);
                }
            }
            return ((currentObject.state === 0 || currentObject.state == -1)  && stateNullAgain) ? obj : defineCarWays(cType,isFirst,i,++j,obj, currentObject, stateNullAgain);
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        placeBackground();

        defineCarParams();
        if(settings.saveGame && !onlineGame.enabled && window.localStorage.getItem("morowayAppSavedCars") != null && window.localStorage.getItem("morowayAppSavedCarParams") != null && window.localStorage.getItem("morowayAppSavedBg") != null && window.localStorage.getItem("morowayAppSavedWithVersion") != null) {
            cars = JSON.parse(window.localStorage.getItem("morowayAppSavedCars"));
            carParams = JSON.parse(window.localStorage.getItem("morowayAppSavedCarParams"));
            resizeCars(JSON.parse(window.localStorage.getItem("morowayAppSavedBg")));
        } else {
            placeCarsAtInitialPositions();
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
        for (var i = 0; i <  taxOffice.params.number; i++) {
            taxOffice.fire[i] = {};
            taxOffice.smoke[i] = {};
            if ( Math.random() >= taxOffice.params.fire.color.probability) {
                taxOffice.fire[i].color = "rgba(" + taxOffice.params.fire.color.yellow.red + "," + taxOffice.params.fire.color.yellow.green + "," + taxOffice.params.fire.color.yellow.blue + "," + (taxOffice.params.fire.color.yellow.alpha * Math.random()) + ")";
            } else {
                taxOffice.fire[i].color = "rgba(" + taxOffice.params.fire.color.red.red + "," + taxOffice.params.fire.color.red.green + "," + taxOffice.params.fire.color.red.blue + "," + (taxOffice.params.fire.color.red.alpha * Math.random()) + ")";
            }
            taxOffice.fire[i].x = Math.random()*taxOffice.params.fire.x;
            taxOffice.fire[i].y = Math.random()*taxOffice.params.fire.y;
            taxOffice.fire[i].size = Math.random() * taxOffice.params.fire.size;
            taxOffice.smoke[i].color = "rgba(" + taxOffice.params.smoke.color.red + "," + taxOffice.params.smoke.color.green + "," + taxOffice.params.smoke.color.blue + "," + (taxOffice.params.smoke.color.alpha * Math.random()) + ")";
            taxOffice.smoke[i].x = Math.random() * taxOffice.params.smoke.x;
            taxOffice.smoke[i].y = Math.random() * taxOffice.params.smoke.y;
            taxOffice.smoke[i].size = Math.random() * taxOffice.params.smoke.size;
        }
        for(var i = 0; i <  taxOffice.params.bluelights.cars.length; i++) {
            taxOffice.params.bluelights.cars[i].x[0] *= background.width;
            taxOffice.params.bluelights.cars[i].x[1] *= background.width;
            taxOffice.params.bluelights.cars[i].y[0] *= background.height;
            taxOffice.params.bluelights.cars[i].y[1] *= background.height;
            taxOffice.params.bluelights.cars[i].size *= background.width;
        }

        animateWorker.onerror = function() {
            notify("#canvas-notifier", getString("appScreenIsFail", "!", "upper"), NOTIFICATION_PRIO_HIGH, 60000, function(){followLink("error#animate", "_blank", LINK_STATE_INTERNAL_HTML);}, getString("appScreenFurtherInformation"), client.y);
        };
        animateWorker.onmessage = function(message) {
            if(message.data.k == "getTrainPics") {
                trains = message.data.trains;
                var trainPics = [];
                for(var i = 0; i < trains.length; i++) {
                    trainPics[i] = {};
                    trainPics[i].height = pics[trains[i].src].height;
                    trainPics[i].width = pics[trains[i].src].width;
                    trainPics[i].cars = [];

                    for(var j = 0; j < trains[i].cars.length; j++) {
                        trainPics[i].cars[j] = {};
                        trainPics[i].cars[j].height = pics[trains[i].cars[j].src].height;
                        trainPics[i].cars[j].width = pics[trains[i].cars[j].src].width;
                    }
                }
                if(settings.saveGame && !onlineGame.enabled && window.localStorage.getItem("morowayAppSavedGameTrains") != null && window.localStorage.getItem("morowayAppSavedGameSwitches") != null && window.localStorage.getItem("morowayAppSavedBg") != null && window.localStorage.getItem("morowayAppSavedWithVersion") != null) {
                    animateWorker.postMessage({k: "setTrainPics", trainPics: trainPics, savedTrains: JSON.parse(window.localStorage.getItem("morowayAppSavedGameTrains")), savedBg:  JSON.parse(window.localStorage.getItem("morowayAppSavedBg")), savedWithVersion: JSON.parse(window.localStorage.getItem("morowayAppSavedWithVersion"))});
                } else {
                    animateWorker.postMessage({k: "setTrainPics", trainPics: trainPics});
                }
                if(onlineGame.enabled) {
                    var chatTrainContainer = document.querySelector("#chat #chat-msg-trains-inner");
                    for(var stickerTrain = 0; stickerTrain < trains.length; stickerTrain++){
                        var elem = document.createElement("img");
                        elem.title=getString(["appScreenTrainNames", stickerTrain]);
                        elem.src="./assets/chat_train_" + stickerTrain + ".png";
                        elem.dataset.stickerNumber = stickerTrain;
                        elem.addEventListener("click", function(event){
                            onlineConnection.send({mode:"chat-msg", message: "{{stickerTrain=" + event.target.dataset.stickerNumber + "}}"});
                        });
                        chatTrainContainer.appendChild(elem);
                    }
                }
            } else if(message.data.k == "setTrainParams") {
                trainParams = message.data.trainParams;
            } else if(message.data.k == "ready") {
                trains = message.data.trains;
                placeClassicUIElements();
                calcControlCenter();
                if(typeof placeOptions == "function") {
                    placeOptions("load");
                }
                window.addEventListener("resize", function(){
                    if(resizeTimeout !== undefined && resizeTimeout !== null) {
                        window.clearTimeout(resizeTimeout);
                    }
                    resizeTimeout = window.setTimeout(resize, 20);
                });
                resize();
                drawInterval = message.data.animateInterval;
                drawObjects();
                var timeWait = 0.5;
                var timeLoad = 1.5;
                window.setTimeout(function(){
                    destroy([document.querySelector("#snake"),document.querySelector("#percent")]);
                    var toHide = document.querySelector("#branding");
                    if(toHide != null && !onlineGame.enabled) {
                        toHide.style.transition = "opacity " + timeLoad + "s ease-in";
                        toHide.style.opacity = "0";
                        window.setTimeout(function(){
                            var localAppData = getLocalAppDataCopy();
                            if(settings.classicUI && !settings.alwaysShowSelectedTrain){
                                notify("#canvas-notifier", formatJSString(getString("appScreenTrainSelected", "."), getString(["appScreenTrainNames",trainParams.selected]), getString("appScreenTrainSelectedAuto", " ")), NOTIFICATION_PRIO_HIGH,3000,null,null, client.y);
                            } else if(localAppData !== null && (localAppData.version.major < APP_DATA.version.major || localAppData.version.minor < APP_DATA.version.minor) && typeof appUpdateNotification == "function") {
                                appUpdateNotification();
                            } else if (typeof appReadyNotification == "function") {
                                appReadyNotification();
                            }
                            setLocalAppDataCopy();
                            destroy(toHide);
                        }, timeLoad*900);
                    }
                }, timeWait*1000);
            } else if(message.data.k == "setTrains") {
                message.data.trains.forEach(function(train,i){
                    trains[i].x = train.x;
                    trains[i].y = train.y;
                    if(debug) {
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
                    train.cars.forEach(function(car,j){
                        trains[i].cars[j].x = car.x;
                        trains[i].cars[j].y = car.y;
                        trains[i].cars[j].width = car.width;
                        trains[i].cars[j].height = car.height;
                        trains[i].cars[j].displayAngle = car.displayAngle;
                        trains[i].cars[j].assetFlip = car.assetFlip;
                        trains[i].cars[j].konamiUseTrainIcon = car.konamiUseTrainIcon;
                        if(debug) {
                            trains[i].cars[j].front.x = car.front.x;
                            trains[i].cars[j].front.y = car.front.y;
                            trains[i].cars[j].front.angle = car.front.angle;
                            trains[i].cars[j].back.x = car.back.x;
                            trains[i].cars[j].back.y = car.back.y;
                            trains[i].cars[j].back.angle = car.back.angle;
                        }
                    });
                });
            } else if(message.data.k == "trainCrash") {
                actionSync("trains",message.data.i, [{move:false},{accelerationSpeed:0},{accelerationSpeedCustom:1}],[{getString:["appScreenObjectHasCrashed", "."]}, {getString:[["appScreenTrainNames",message.data.i]]}, {getString:[["appScreenTrainNames",message.data.j]]}]);
                actionSync("train-crash");
            } else if(message.data.k == "resized") {
                resized = false;
                if(onlineGame.enabled) {
                    if(onlineGame.resizedTimeout != undefined && onlineGame.resizedTimeout != null) {
                        window.clearTimeout(onlineGame.resizedTimeout);
                    }
                    onlineGame.resizedTimeout = window.setTimeout(function() {
                        onlineGame.resized = false;
                    }, 3000);
                }
                if(debug || APP_DATA.debug){
                    animateWorker.postMessage({k:"debug"});
                }
            } else if(message.data.k == "switches") {
                switches = message.data.switches;
            } else if(message.data.k == "sync-ready") {
                trains = message.data.trains;
                rotationPoints = message.data.rotationPoints;
                teamplaySync("sync-ready");
            } else if(message.data.k == "save-game") {
                if(typeof(window.localStorage) != "undefined") {
                    if(settings.saveGame && !onlineGame.enabled) {
                        window.localStorage.setItem("morowayAppSavedGameTrains", JSON.stringify(message.data.saveTrains));
                        var saveSwitches = {};
                        Object.keys(switches).forEach(function(key) {
                            saveSwitches[key] = {};
                            Object.keys(switches[key]).forEach(function(side) {
                                saveSwitches[key][side] = switches[key][side].turned;
                            });
                        });
                        window.localStorage.setItem("morowayAppSavedGameSwitches", JSON.stringify(saveSwitches));
                        window.localStorage.setItem("morowayAppSavedCars", JSON.stringify(cars));
                        window.localStorage.setItem("morowayAppSavedCarParams", JSON.stringify(carParams));
                        window.localStorage.setItem("morowayAppSavedBg", JSON.stringify(background));
                        window.localStorage.setItem("morowayAppSavedWithVersion", JSON.stringify(APP_DATA.version));
                    } else if (!settings.saveGame){
                        removeSavedGame();
                    }
                    animateWorker.postMessage({k: "game-saved"});
                }
            } else if(message.data.k == "debug") {
                rotationPoints = message.data.rotationPoints;
                switchesBeforeFac =message.data.switchesBeforeFac;
                if(!debug) {
                    console.log(message.data.animateInterval);
                }
                console.log(message.data.trains);
                debug=true;
            } else if(message.data.k == "debugDrawPoints") {
                debugDrawPoints = message.data.p;
                debugDrawPointsCrash = message.data.pC;
                debugTrainCollisions = message.data.tC;
            }
        };
        if(settings.saveGame && !onlineGame.enabled && window.localStorage.getItem("morowayAppSavedGameTrains") != null && window.localStorage.getItem("morowayAppSavedGameSwitches") != null && window.localStorage.getItem("morowayAppSavedBg") != null && window.localStorage.getItem("morowayAppSavedWithVersion") != null) {
            var savedSwitches = JSON.parse(window.localStorage.getItem("morowayAppSavedGameSwitches"));
            Object.keys(savedSwitches).forEach(function(key) {
                Object.keys(savedSwitches[key]).forEach(function(side) {
                    switches[key][side].turned = savedSwitches[key][side];
                });
            });
        } else if(!settings.saveGame) {
            removeSavedGame();
        }
        animateWorker.postMessage({k: "start", background: background, switches: switches, online: onlineGame.enabled, onlineInterval: onlineGame.animateInterval});
    }
    function resetForElem(parent, elem, to) {
        if (to == undefined) {
            to = "";
        }
        var elems = parent.childNodes;
        for(var i = 0; i < elems.length; i++) {
            if(elems[i].nodeName.substr(0,1) != "#"){
                elems[i].style.display = elems[i] == elem ? to : "none";
            }
        }
    }

    function destroy(toDestroyElems) {
        if(typeof toDestroyElems == "object") {
            if(!Array.isArray(toDestroyElems)){
                toDestroyElems = [toDestroyElems];
            }
            toDestroyElems.forEach( function(toDestroy) {
                if(toDestroy != null) {
                    toDestroy.parentNode.removeChild(toDestroy);
                }
            });
        }
    }

    settings = getSettings();
    canvas = document.querySelector("canvas#game-gameplay-main");
    canvasBackground = document.querySelector("canvas#game-gameplay-bg");
    canvasSemiForeground = document.querySelector("canvas#game-gameplay-sfg");
    canvasForeground = document.querySelector("canvas#game-gameplay-fg");
    context = canvas.getContext("2d");
    contextBackground = canvasBackground.getContext("2d");
    contextSemiForeground = canvasSemiForeground.getContext("2d");
    contextForeground = canvasForeground.getContext("2d");

    document.addEventListener("keydown", onKeyDown);
    if(getQueryString("mode") == "multiplay") {
        if ("WebSocket" in window) {
            onlineGame.enabled = true;
        } else {
            onlineGame.enabled = false;
            notify("#canvas-notifier", getString("appScreenTeamplayNoWebsocket", "!", "upper"), NOTIFICATION_PRIO_HIGH, 6000, null, null, client.y);
        }
    } else {
        onlineGame.enabled = false;
    }

    if(onlineGame.enabled){
        var loadingAnimElem = document.querySelector("#branding img");
        var loadingAnimElemDefaultFilter = "blur(1px) saturate(5) sepia(1) hue-rotate({{0}}deg)";
        loadingAnimElem.style.transition = "filter 0.08s";
        loadingAnimElem.style.filter = formatJSString(loadingAnimElemDefaultFilter, Math.random()*260+100);
        var loadingAnimElemChangingFilter = window.setInterval(function(){
            loadingAnimElem.style.filter = formatJSString(loadingAnimElemDefaultFilter, Math.random()*260+100);
        }, 10);
    } else {
        var elems = document.querySelectorAll("#content > *:not(#game), #game > *:not(#game-gameplay)");
        for (var i = 0; i < elems.length; i++) {
            elems[i].style.display = "none";
        }
        elems = document.querySelectorAll("#content > #game, #game > #game-gameplay");
        for (i = 0; i < elems.length; i++) {
            elems[i].style.display = "block";
        }
    }
    window.setTimeout(function() {
        var toShowElems = [document.querySelector("#percent")];
        toShowElems.forEach( function(toShow) {
            if(toShow != null) {
                toShow.style.display = "block";
            }
        });
    },2500);
    hardware.lastInputMouse = hardware.lastInputTouch = 0;
    canvasForeground.addEventListener("touchstart",chooseInputMethod);
    canvasForeground.addEventListener("mousemove",chooseInputMethod);

    extendedMeasureViewspace();

    var defaultPics = copyJSObject(pics);
    var finalPicNo = defaultPics.length;
    pics = [];
    var loadNo = 0;
    defaultPics.forEach(function(pic) {
        pics[pic.id] = new Image();
        pics[pic.id].src = "assets/asset" +  pic.id + "." + pic.extension;
        pics[pic.id].onload = function() {
            loadNo++;
            var cPercent = Math.round(100 * (loadNo / finalPicNo));
            if(document.querySelector("#percent #percent-text") != null && document.querySelector("#percent #percent-progress") != null) {
                document.querySelector("#percent #percent-text").textContent = cPercent + "%";
                document.querySelector("#percent #percent-progress").style.left = -100+cPercent + "%";
            }
            if (loadNo == finalPicNo) {
                initialDisplay();
                if(onlineGame.enabled) {
                    var chatNotify = document.querySelector("#tp-chat-notifier");
                    var chat = document.querySelector("#chat");
                    var chatClose = document.querySelector("#chat #chat-close");
                    var chatControls = document.querySelector("#chat #chat-controls");
                    var chatInnerContainer = document.querySelector("#chat #chat-inner");
                    var chatInner = document.querySelector("#chat #chat-inner-messages");
                    var chatInnerNone = document.querySelector("#chat #chat-no-messages");
                    var chatScrollToBottom = document.querySelector("#chat #chat-scroll-to-bottom");
                    var chatSendInner = document.querySelectorAll("#chat #chat-send > *");
                    var chatSend = document.querySelector("#chat #chat-msg-send-button");
                    var chatMsg = document.querySelector("#chat #chat-msg-send-text");
                    var chatReactions = document.querySelector("#chat #chat-msg-reactions");
                    var chatSmileyContainer = document.querySelector("#chat #chat-msg-smileys-inner");
                    var smileyElems = chatSmileyContainer.querySelectorAll("button");
                    var chatStickerContainer = document.querySelector("#chat #chat-msg-stickers-inner");
                    var chatClear = document.querySelector("#chat #chat-clear");
                    chatScrollToBottom.toggleDisplay = function() {
                        if(chatInner.lastChild != null) {
                            chatScrollToBottom.style.display = chatInnerContainer.scrollHeight > chatInnerContainer.offsetHeight &&
    chatInnerContainer.scrollHeight - chatInnerContainer.scrollTop > chatInnerContainer.offsetHeight + chatInner.lastChild.offsetHeight ? "flex" : "";
                            chatScrollToBottom.style.top = Math.max(0,(chatInnerContainer.offsetHeight - chatScrollToBottom.offsetHeight - 50)) + "px";
                        } else {
                            chatScrollToBottom.style.display = "";
                        }
                    }
                    chat.resizeChat = function () {
                        chatInnerContainer.style.maxHeight = Math.max(50,(Math.min(window.innerHeight,chat.offsetHeight) - chatControls.offsetHeight)) + "px";
                        chatScrollToBottom.toggleDisplay();
                    }
                    window.addEventListener("resize", chat.resizeChat);
                    chat.openChat = function () {
                        if(typeof(chatNotify.hide) == "function") {
                            chatNotify.hide(chatNotify, true);
                        }
                        chat.style.display = "block";
                        if(typeof placeOptions == "function") {
                            placeOptions("invisible");
                        }
                        chat.resizeChat();
                    }
                    chat.closeChat = function () {
                       chat.style.display = "";
                       if(typeof placeOptions == "function") {
                           placeOptions("visible");
                       }
                    }
                    window.addEventListener("keyup", function(){
                       if (event.key === "Escape") {
                           chat.closeChat();
                       }
                    });
                    chatInner.parentNode.addEventListener("scroll", function(){
                        chatScrollToBottom.toggleDisplay();
                    });
                    chatNotify.addEventListener("click", chat.openChat);
                    chatClose.addEventListener("click", chat.closeChat);
                    chatSend.addEventListener("click", function(){
                        if(chatMsg.value != "") {
                            onlineConnection.send({mode:"chat-msg", message: chatMsg.value});
                            chatMsg.value = "";
                        }
                    });
                    chatMsg.addEventListener("keyup", function(event) {
                        if(chatMsg.value != "") {
                            if (event.key === "Enter") {
                                onlineConnection.send({mode:"chat-msg", message: chatMsg.value});
                                chatMsg.value = "";
                            }
                        }
                    });
                    for(var cSI = 0; cSI < chatSendInner.length; cSI++){
                        chatSendInner[cSI].querySelector(".chat-send-toggle").addEventListener("click", function(event){
                            var elem = event.target.parentNode.querySelector(".chat-send-inner");
                            var display = window.getComputedStyle(elem).getPropertyValue("display");
                            for(var cSI = 0; cSI < chatSendInner.length; cSI++){
                                chatSendInner[cSI].querySelector(".chat-send-inner").style.display = "none";
                            }
                            elem.style.display = display == "none" ? "block" : "none";
                            chat.resizeChat();
                            var smileySupport = true;
                            for(var smiley = 1; smiley < smileyElems.length; smiley++){
                                if(smileyElems[smiley].offsetWidth != smileyElems[smiley-1].offsetWidth) {
                                    smileySupport = false;
                                    break;
                                }
                            }
                            if(!smileySupport) {
                                notify("#canvas-notifier", getString("appScreenTeamplayChatNoEmojis"), NOTIFICATION_PRIO_HIGH, 6000, null, null, client.y);
                            }
                        });
                    }
                    for(var smiley = 0; smiley < smileyElems.length; smiley++){
                        smileyElems[smiley].addEventListener("click", function(event){
                            onlineConnection.send({mode:"chat-msg", message: event.target.textContent});
                        });
                    }
                    for(var sticker = 0; sticker < onlineGame.chatSticker; sticker++){
                        var elem = document.createElement("img");
                        elem.src="./assets/chat_sticker_" + sticker + ".png";
                        elem.dataset.stickerNumber = sticker;
                        elem.addEventListener("click", function(event){
                            onlineConnection.send({mode:"chat-msg", message: "{{sticker=" + event.target.dataset.stickerNumber + "}}"});
                        });
                        chatStickerContainer.appendChild(elem);
                    }
                    chatClear.clearChat = function(){
                        var chat2Clear = document.querySelectorAll(".chat-inner-container");
                        if(chat2Clear.length != 0) {
                            for(var clearNo = 0; clearNo < chat2Clear.length; clearNo++) {
                                destroy(chat2Clear[clearNo]);
                            }
                        }
                        chatInnerNone.style.display = "";
                        chatReactions.style.display = "none";
                        chatScrollToBottom.toggleDisplay();
                    }
                    chatClear.addEventListener("click", chatClear.clearChat);
                    chatScrollToBottom.addEventListener("click", function() {
                        if(chatInner.lastChild != null) {
                            chatInner.lastChild.scrollIntoView();
                            chatScrollToBottom.toggleDisplay();
                        }
                    });
                    var tpLeaveYes = document.querySelector("#tp-leave #tp-leave-yes");
                    var tpLeaveNo = document.querySelector("#tp-leave #tp-leave-no");
                    tpLeaveYes.addEventListener("click", function(){ followLink("?", "_self", LINK_STATE_INTERNAL_HTML); });
                    tpLeaveNo.addEventListener("click", function(){ document.querySelector("#tp-leave").style.display = ""; });
                    onlineConnection.connect = (function(host) {
                        function hideLoadingAnimation(){
                            window.clearInterval(loadingAnimElemChangingFilter);
                            destroy([document.querySelector("#branding"),document.querySelector("#snake"),document.querySelector("#percent")]);
                            chat.closeChat();
                            chatClear.clearChat();
                        }
                        function showStartGame(teamNum){
                            hideLoadingAnimation();
                            onlineGame.stop = false;
                            document.addEventListener("visibilitychange", function() {
                                if (document.hidden) {
                                    onlineConnection.send({mode: "pause-request"});
                                } else {
                                    onlineConnection.send({mode: "resume-request"});
                                }
                            });
                            var parent = document.querySelector("#content");
                            var elem = parent.querySelector("#game");
                            resetForElem(parent, elem, "block");
                            var parent = document.querySelector("#game");
                            var elem = parent.querySelector("#game-start");
                            elem.querySelector("#game-start-text").textContent = formatJSString(getString("appScreenTeamplayGameStart"), teamNum);
                            resetForElem(parent, elem);
                            elem.querySelector("#game-start-button").onclick = function(){
                                onlineConnection.send({mode:"start"});
                            };
                        }
                        function showNewGameLink(){
                            hideLoadingAnimation();
                            var parent = document.querySelector("#content");
                            var elem = parent.querySelector("#setup");
                            resetForElem(parent, elem, "block");
                            var parent = document.querySelector("#setup-inner-content");
                            var elem = parent.querySelector("#setup-create");
                            resetForElem(parent, elem);
                            var elem = document.querySelector("#setup #setup-create #setup-create-link");
                            elem.addEventListener("click",function(){followLink("?mode=multiplay", "_self", LINK_STATE_INTERNAL_HTML);});
                            var elem = document.querySelector("#setup #setup-create #setup-create-escape");
                            elem.addEventListener("click",function(){followLink("?", "_self", LINK_STATE_INTERNAL_HTML);});
                        }
                        function getPlayerNameFromInput(){
                            var elem = document.querySelector("#setup-init-name");
                            var name = elem.value;
                            var nameCheck = name.replace(/[^a-zA-Z0-9]/g, "");
                            if(name.length > 0 && name == nameCheck){
                                window.sessionStorage.setItem("playername", name);
                                return name;
                            } else {
                                elem.value = nameCheck;
                            }
                            return false;
                        }
                        function sendPlayerName(name){
                            onlineConnection.send({mode:"init", message: name});
                        }
                        function sendSyncRequest(){
                            if(!onlineGame.syncing) {
                                if(onlineGame.resized) {
                                    if(onlineGame.syncRequest !== undefined && onlineGame.syncRequest !== null) {
                                        window.clearTimeout(onlineGame.syncRequest);
                                    }
                                    if(onlineGame.locomotive){
                                        onlineGame.syncRequest = window.setTimeout(sendSyncRequest, onlineGame.syncInterval);
                                    }
                                } else if(!onlineGame.stop){
                                    var number = 0;
                                    number += trains.length;
                                    trains.forEach(function(train){
                                        number += train.cars.length;
                                    });
                                    number++; //Switches
                                    var obj = {"number": number};
                                    onlineConnection.send({mode: "sync-request", message: JSON.stringify(obj)});
                                }
                            }
                        }
                        function sendSyncData(){
                            var task = {};
                            task.o = "s";
                            var obj = copyJSObject(switches);
                            task.d = obj;
                            if(!onlineGame.resized) {
                                onlineConnection.send({mode:"sync-task", message: JSON.stringify(task)});
                            }
                            for(var i = 0; i < trains.length; i++){
                                task = {};
                                task.o = "t";
                                task.i = i;
                                obj = copyJSObject(trains[i]);
                                obj.front.x = (obj.front.x-background.x) / background.width;
                                obj.back.x = (obj.back.x-background.x) / background.width;
                                obj.x = (obj.x-background.x) / background.width;
                                obj.front.y = (obj.front.y - background.y) / background.height;
                                obj.back.y = (obj.back.y-background.y) / background.height;
                                obj.y = (obj.y-background.y) / background.height;
                                obj.width = obj.width / background.width;
                                obj.height = obj.height / background.height;
                                onlineGame.excludeFromSync[task.o].forEach(function(key){
                                    delete obj[key];
                                });
                                if(obj.circleFamily != null){
                                    Object.keys(rotationPoints).forEach(function(key){
                                        if(trains[i].circleFamily == rotationPoints[key]) {
                                            obj.circleFamily = key;
                                        }
                                    });
                                    if(typeof obj.circleFamily == "string") {
                                        Object.keys(rotationPoints[obj.circleFamily]).forEach(function(key){
                                            if(trains[i].circle == rotationPoints[obj.circleFamily][key]) {
                                                obj.circle = key;
                                            }
                                        });
                                    } else {
                                        delete obj.circle;
                                    }
                                } else {
                                    delete obj.circle;
                                }
                                task.d = obj;
                                if(!onlineGame.resized) {
                                    onlineConnection.send({mode:"sync-task", message: JSON.stringify(task)});
                                }
                                for(var j = 0; j < trains[i].cars.length; j++){
                                    task = {};
                                    task.o = "tc";
                                    task.i = [i,j];
                                    obj = copyJSObject(trains[i].cars[j]);
                                    obj.front.x = (obj.front.x-background.x) / background.width;
                                    obj.back.x = (obj.back.x-background.x) / background.width;
                                    obj.x = (obj.x-background.x) / background.width;
                                    obj.front.y = (obj.front.y - background.y) / background.height;
                                    obj.back.y = (obj.back.y-background.y) / background.height;
                                    obj.y = (obj.y-background.y) / background.height;
                                    obj.width = obj.width / background.width;
                                    obj.height = obj.height / background.height;
                                    onlineGame.excludeFromSync[task.o].forEach(function(key){
                                        delete obj[key];
                                    });
                                    task.d = obj;
                                    if(!onlineGame.resized) {
                                        onlineConnection.send({mode:"sync-task", message: JSON.stringify(task)});
                                    }
                                }
                            }
                        }
                        onlineConnection.socket = new WebSocket(host);
                        onlineConnection.socket.onopen = function () {
                            window.addEventListener("error", function() {onlineConnection.socket.close();});
                            onlineConnection.send({mode:"hello", message: APP_DATA.version.major+APP_DATA.version.minor/10});
                        };
                        onlineConnection.socket.onclose = function () {
                            showNewGameLink();
                            notify("#canvas-notifier", getString("appScreenTeamplayConnectionError", "."), NOTIFICATION_PRIO_HIGH, 6000, function(){followLink("error#tp-connection", "_self", LINK_STATE_INTERNAL_HTML);}, getString("appScreenFurtherInformation"), client.y);
                        };
                        onlineConnection.socket.onmessage = function (message) {
                            var json = JSON.parse(message.data);
                            if(debug){
                                console.log(json);
                            }
                            switch (json.mode) {
                            case "hello":
                                if(json.errorLevel < 2) {
                                    if(json.errorLevel == 1){
                                        notify("#canvas-notifier", getString("appScreenTeamplayUpdateNote", "!"), NOTIFICATION_PRIO_DEFAULT, 900, null,null,client.y);
                                    }
                                    var parent = document.querySelector("#content");
                                    var elem = parent.querySelector("#setup");
                                    resetForElem(parent, elem, "block");
                                    if(window.sessionStorage.getItem("playername") != null){
                                        sendPlayerName(window.sessionStorage.getItem("playername"));
                                    } else {
                                        hideLoadingAnimation();
                                        var parent = document.querySelector("#setup-inner-content");
                                        var elem = parent.querySelector("#setup-init");
                                        resetForElem(parent, elem);
                                        elem.querySelector("#setup-init-button").addEventListener("click", function(event) {
                                            var name = getPlayerNameFromInput();
                                            if(name !== false) {
                                                sendPlayerName(name);
                                            }
                                        });
                                        elem.querySelector("#setup-init-name").addEventListener("keyup", function(event) {
                                            if(event.key === "Enter") {
                                                var name = getPlayerNameFromInput();
                                                if(name !== false) {
                                                    sendPlayerName(name);
                                                }
                                            }
                                        });
                                        elem.querySelector("#setup-init-name").focus();
                                    }
                                } else {
                                    document.querySelector("#content").style.display = "none";
                                    window.setTimeout(function(){followLink("error#tp-update", "_self", LINK_STATE_INTERNAL_HTML);},1000);
                                    notify("#canvas-notifier", getString("appScreenTeamplayUpdateError", "!"), NOTIFICATION_PRIO_HIGH, 6000, null,null,client.y);
                                }
                                break;
                            case "init":
                                if(json.errorLevel === 0){
                                    onlineGame.sessionId = json.sessionId;
                                    if(onlineGame.gameKey == "" || onlineGame.gameId == ""){
                                        onlineConnection.send({mode:"connect"});
                                    } else {
                                        onlineConnection.send({mode:"join",gameKey:onlineGame.gameKey,gameId:onlineGame.gameId});
                                    }
                                } else {
                                    showNewGameLink();
                                    notify("#canvas-notifier", getString("appScreenTeamplayConnectionError", "."), NOTIFICATION_PRIO_HIGH, 6000, function(){followLink("error#tp-connection", "_self", LINK_STATE_INTERNAL_HTML);}, getString("appScreenFurtherInformation"), client.y);
                                }
                                break;
                            case "connect":
                                if(json.errorLevel === 0){
                                    onlineGame.locomotive = true;
                                    onlineGame.gameKey = json.gameKey;
                                    onlineGame.gameId = json.gameId;
                                    hideLoadingAnimation();
                                    var parent = document.querySelector("#setup-inner-content");
                                    var elem = parent.querySelector("#setup-start");
                                    resetForElem(parent, elem);
                                    elem.querySelector("#setup-start-gamelink").textContent = getShareLink(onlineGame.gameId, onlineGame.gameKey);
                                    elem.querySelector("#setup-start-button").onclick = function(){
                                        if(!copy("#setup #setup-start #setup-start-gamelink")) {
                                            notify("#canvas-notifier", getString("appScreenTeamplaySetupStartButtonError", "!"), NOTIFICATION_PRIO_HIGH, 6000, null, null, client.y);
                                        }
                                    };
                                } else {
                                    showNewGameLink();
                                    notify("#canvas-notifier", getString("appScreenTeamplayCreateError", "!"), NOTIFICATION_PRIO_HIGH, 6000, function(){followLink("error#tp-connection", "_self", LINK_STATE_INTERNAL_HTML);}, getString("appScreenFurtherInformation"), client.y);
                                }
                                break;
                            case "join":
                                if(json.sessionId == onlineGame.sessionId) {
                                    if(json.errorLevel === 0){
                                        onlineGame.locomotive = false;
                                        showStartGame(json.message);
                                    } else {
                                        showNewGameLink();
                                        notify("#canvas-notifier", getString("appScreenTeamplayJoinError", "!"), NOTIFICATION_PRIO_HIGH, 6000, function(){followLink("error#tp-join", "_self", LINK_STATE_INTERNAL_HTML);}, getString("appScreenFurtherInformation"), client.y);
                                    }
                                } else {
                                    if(json.errorLevel === 0){
                                        showStartGame(json.message);
                                    } else {
                                        showNewGameLink();
                                        notify("#canvas-notifier", getString("appScreenTeamplayJoinTeammateError", "!"), NOTIFICATION_PRIO_HIGH, 6000, function(){followLink("error#tp-connection", "_self", LINK_STATE_INTERNAL_HTML);}, getString("appScreenFurtherInformation"), client.y);
                                    }
                                }
                                break;
                            case "start":
                                if(json.errorLevel < 2){
                                    switch(json.message){
                                    case "wait":
                                        if(json.sessionId == onlineGame.sessionId) {
                                            var parent = document.querySelector("#game");
                                            var elem = parent.querySelector("#game-wait");
                                            resetForElem(parent, elem);
                                        } else {
                                            notify("#canvas-notifier", getString("appScreenTeamplayTeammateReady", "?"), NOTIFICATION_PRIO_DEFAULT, 1000, null,null,client.y);
                                        }
                                        break;
                                    case "run":
                                        onlineGame.syncing = false;
                                        if(onlineGame.syncRequest !== undefined && onlineGame.syncRequest !== null) {
                                            window.clearTimeout(onlineGame.syncRequest);
                                        }
                                        if(onlineGame.locomotive){
                                            onlineGame.syncRequest = window.setTimeout(sendSyncRequest, onlineGame.syncInterval);
                                        }
                                        var parent = document.querySelector("#game");
                                        var elem = parent.querySelector("#game-gameplay");
                                        resetForElem(parent, elem);
                                        if(typeof placeOptions == "function") {
                                            placeOptions("resize");
                                        }
                                        break;
                                    }
                                } else {
                                    showNewGameLink();
                                    notify("#canvas-notifier", getString("appScreenTeamplayStartError", "!"), NOTIFICATION_PRIO_HIGH, 6000, function(){followLink("error#tp-connection", "_self", LINK_STATE_INTERNAL_HTML);}, getString("appScreenFurtherInformation"), client.y);
                                }
                                break;
                            case "action":
                                var json = JSON.parse(message.data);
                                var input = JSON.parse(json.message);
                                var notifyArr = [];
                                if(typeof input.notification == "object" && Array.isArray(input.notification)){
                                    input.notification.forEach(function(elem){
                                        if(typeof elem == "object" && Array.isArray(elem.getString)) {
                                            notifyArr.push(getString.apply( null, elem.getString ));
                                        } else if(typeof elem == "string") {
                                            notifyArr.push( elem );
                                        }
                                    });
                                    var notifyStr = formatJSString.apply( null, notifyArr );
                                    if(onlineGame.sessionId != json.sessionId){
                                        notifyStr = json.sessionName + ": " + notifyStr;
                                    }
                                    notify("#canvas-notifier", notifyStr, NOTIFICATION_PRIO_DEFAULT, 1000, null,null,client.y);
                                }
                                var obj;
                                switch (input.objname){
                                case "trains":
                                    if(onlineGame.sessionId != json.sessionId){
                                        onlineGame.excludeFromSync["t"].forEach(function(key){
                                            input.params.forEach(function(param, paramNo){
                                                if(Object.keys(param)[0] == key) {
                                                    delete input.params[paramNo];
                                                }
                                            });
                                        });
                                    }
                                    animateWorker.postMessage({k: "train", i: input.index, params: input.params});
                                    break;
                                case "train-crash":
                                    if(onlineGame.syncRequest !== undefined && onlineGame.syncRequest !== null) {
                                        window.clearTimeout(onlineGame.syncRequest);
                                    }
                                    if(onlineGame.locomotive){
                                        onlineGame.syncRequest = window.setTimeout(sendSyncRequest, 200);
                                    }
                                    break;
                                case "switches":
                                    obj = switches[input.index[0]][input.index[1]];
                                    input.params.forEach(function(param){
                                        obj[Object.keys(param)[0]] = Object.values(param)[0];
                                    });
                                    obj.lastStateChange = frameNo;
                                    animateWorker.postMessage({k: "switches", switches: switches});
                                    break;
                                }
                                break;
                            case "sync-request":
                                var json = JSON.parse(message.data);
                                var json_message = JSON.parse(json.message);
                                onlineGame.syncingCounter = 0;
                                onlineGame.syncingCounterFinal = parseInt(json_message.number,10);
                                onlineGame.syncing = true;
                                animateWorker.postMessage({k: "sync-request"});
                                break;
                            case "sync-ready":
                                if(onlineGame.locomotive){
                                    sendSyncData();
                                }
                                break;
                            case "sync-task":
                                if(onlineGame.syncing) {
                                    onlineGame.syncingCounter++;
                                    var json = JSON.parse(message.data);
                                    var task = JSON.parse(json.message);
                                    switch(task.o){
                                    case "t":
                                        animateWorker.postMessage({k: "sync-t", i: task.i, d: task.d});
                                        break;
                                    case "tc":
                                        animateWorker.postMessage({k: "sync-tc", i: task.i, d: task.d});
                                        break;
                                    case "s":
                                        Object.keys(task.d).forEach(function(key){
                                            Object.keys(switches[key]).forEach(function(currentKey){
                                                switches[key][currentKey].turned = task["d"][key][currentKey].turned;
                                            });
                                        });
                                        animateWorker.postMessage({k: "switches", switches: switches});
                                        break;
                                    }
                                    if(onlineGame.syncingCounter == onlineGame.syncingCounterFinal){
                                        onlineConnection.send({mode: "sync-done"});
                                    }
                                }
                                break;
                            case "sync-done":
                                onlineGame.syncing = false;
                                if(json.message == "sync-cancel") {
                                    notify("#canvas-notifier", getString("appScreenTeamplaySyncError", "."), NOTIFICATION_PRIO_HIGH, 900, null, null, client.y);
                                }
                                if(!onlineGame.stop){
                                    if(onlineGame.syncRequest !== undefined && onlineGame.syncRequest !== null) {
                                        window.clearTimeout(onlineGame.syncRequest);
                                    }
                                    if(onlineGame.locomotive){
                                        onlineGame.syncRequest = window.setTimeout(sendSyncRequest, onlineGame.syncInterval);
                                    }
                                    animateWorker.postMessage({k: "resume"});
                                }
                                break;
                            case "pause":
                                if(onlineGame.syncRequest !== undefined && onlineGame.syncRequest !== null) {
                                    window.clearTimeout(onlineGame.syncRequest);
                                }
                                onlineGame.stop = true;
                                animateWorker.postMessage({k: "pause"});
                                notify("#canvas-notifier", getString("appScreenTeamplayGamePaused", "."), NOTIFICATION_PRIO_HIGH, 900, null, null, client.y);
                                break;
                            case "resume":
                                if(onlineGame.stop){
                                    if(onlineGame.syncRequest !== undefined && onlineGame.syncRequest !== null) {
                                        window.clearTimeout(onlineGame.syncRequest);
                                    }
                                    if(onlineGame.locomotive){
                                        onlineGame.syncRequest = window.setTimeout(sendSyncRequest, onlineGame.syncInterval);
                                    }
                                    onlineGame.stop = false;
                                    notify("#canvas-notifier", getString("appScreenTeamplayGameResumed", "."), NOTIFICATION_PRIO_HIGH, 900, null, null, client.y);
                                    animateWorker.postMessage({k: "resume"});
                                }
                                break;
                            case "leave":
                                if(json.errorLevel == 2){
                                    showNewGameLink();
                                    notify("#canvas-notifier", getString("appScreenTeamplayTeammateLeft", "."), NOTIFICATION_PRIO_HIGH, 900, null, null, client.y);
                                } else {
                                    notify("#canvas-notifier", json.sessionName + ": " + getString("appScreenTeamplaySomebodyLeft", "."), NOTIFICATION_PRIO_HIGH, 900, null, null, client.y);
                                }
                                break;
                            case "chat-msg":
                                chatInnerNone.style.display = "none";
                                chatReactions.style.display = "";
                                var chatInnerContainerMsg = document.createElement("div");
                                var chatInnerPlayerName = document.createElement(onlineGame.sessionId != json.sessionId ? "i" : "b");
                                var isSticker = json.message.match(/^\{\{sticker=[0-9]+\}\}$/);
                                var isTrainSticker = json.message.match(/^\{\{stickerTrain=[0-9]+\}\}$/);
                                var chatInnerMessageImg = document.createElement("img");
                                var chatInnerMessage = document.createElement("p");
                                var chatInnerSeperator = document.createElement("br");
                                chatInnerContainerMsg.className = "chat-inner-container";
                                chatInnerPlayerName.textContent = (onlineGame.sessionId != json.sessionId ? json.sessionName : json.sessionName + " (" + getString("appScreenTeamplayChatMe") + ")") + " - " + (new Date()).toLocaleTimeString();
                                if(isSticker || isTrainSticker) {
                                    var stickerNumber = json.message.replace(/[^0-9]/g, "");
                                    if((isSticker && stickerNumber < onlineGame.chatSticker) || (isTrainSticker && stickerNumber < trains.length)) {
                                        chatInnerMessageImg.src = "./assets/chat_" + (isTrainSticker ? "train_" : "sticker_") + stickerNumber + ".png";
                                        chatInnerMessageImg.className = isTrainSticker ? "train-sticker" : "sticker";
                                        json.message = isTrainSticker ? getString(["appScreenTrainIcons", parseInt(stickerNumber,10)]) + " " + getString(["appScreenTrainNames", parseInt(stickerNumber,10)]) : formatJSString(getString("appScreenTeamplayChatStickerNote"),getString(["appScreenTeamplayChatStickerEmojis", parseInt(stickerNumber,10)]));
                                    } else {
                                        isSticker = isTrainSticker = false;
                                    }
                                }
                                chatInnerMessage.textContent = json.message;
                                chatInnerContainerMsg.appendChild(chatInnerPlayerName);
                                chatInnerContainerMsg.appendChild(chatInnerSeperator);
                                if(isSticker || isTrainSticker) {
                                    chatInnerContainerMsg.appendChild(chatInnerMessageImg);
                                }
                                if(!isSticker) {
                                    chatInnerContainerMsg.appendChild(chatInnerMessage);
                                }
                                chatInner.appendChild(chatInnerContainerMsg);
                                if(onlineGame.sessionId != json.sessionId && chat.style.display == "") {
                                    notify("#tp-chat-notifier", json.sessionName + ": " + json.message, NOTIFICATION_PRIO_DEFAULT, 4000, null, null, window.innerHeight, NOTIFICATION_CHANNEL_TEAMPLAY_CHAT+json.sessionId);
                                }
                                chat.resizeChat();
                                break;
                            case "unknown":
                                notify("#canvas-notifier", getString("appScreenTeamplayUnknownRequest", "."), NOTIFICATION_PRIO_HIGH, 2000, null, null, client.y);
                                break;
                            }
                        };
                        onlineConnection.socket.onerror = function () {
                            showNewGameLink();
                            notify("#canvas-notifier", getString("appScreenTeamplayConnectionError", "!"), NOTIFICATION_PRIO_HIGH, 6000, function(){followLink("error#tp-connection", "_self", LINK_STATE_INTERNAL_HTML);}, getString("appScreenFurtherInformation"), client.y);
                        };
                    });
                    onlineConnection.send = (function(obj) {
                        onlineConnection.socket.send(JSON.stringify(obj));
                    });
                    onlineGame.gameKey = getQueryString("key");
                    onlineGame.gameId = getQueryString("id");
                    document.getElementById("setup").addEventListener("mousemove", function(event) {
                        document.getElementById("setup-ball").style.left = event.pageX + "px";
                        document.getElementById("setup-ball").style.top = event.pageY + "px";
                    });
                    document.getElementById("setup").addEventListener("mouseout", function(event) {
                        document.getElementById("setup-ball").style.left = "-1vw";
                        document.getElementById("setup-ball").style.top = "-1vw";
                    });
                    onlineConnection.connect(onlineConnection.serverURI);
                }
            }
        };
        pics[pic.id].onerror = function() {
            notify("#canvas-notifier", getString("appScreenIsFail", "!", "upper"), NOTIFICATION_PRIO_HIGH, 60000, function(){followLink("error#pic", "_blank", LINK_STATE_INTERNAL_HTML);}, getString("appScreenFurtherInformation"), client.y);
        };
    });
};
