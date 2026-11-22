/**
 * Copyright 2026 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { copyJSObject } from "./common/js_objects.js";
function safePostMessage(message) {
    if (init) {
        return;
    }
    postMessage(message);
}
function saveTrainCirclePrepare(train, trainOriginal) {
    delete train.lastDirectionChange;
    if (trainOriginal.circleFamily != null) {
        const cF = Object.keys(rotationPoints).filter(function (key) {
            return rotationPoints[key] === trainOriginal.circleFamily;
        })[0];
        const c = Object.keys(rotationPoints[cF]).filter(function (key) {
            return rotationPoints[cF][key] === trainOriginal.circle;
        })[0];
        train.circleFamily = cF;
        train.circle = c;
    }
    return train;
}
function saveTheGameSend() {
    var saveTrains = copyJSObject(trains);
    for (var t = 0; t < saveTrains.length; t++) {
        saveTrains[t] = saveTrainCirclePrepare(saveTrains[t], trains[t]);
    }
    safePostMessage({ k: "save-game", saveTrains: saveTrains, background: background });
}
function getRealStandardDirection(cO, input1, reverse = false) {
    var realStandardDirection = (trains[input1].standardDirection && !reverse) || (!trains[input1].standardDirection && reverse);
    if (cO.turned) {
        realStandardDirection = !realStandardDirection;
    }
    return realStandardDirection;
}
function getIsFirst(cO, isFront, input1, i) {
    var isFirst = isFront && i == -1;
    if (cO.turned) {
        isFirst = !isFront && i == trains[input1].cars.length - 1;
    }
    return isFirst;
}
function getIsLast(cO, isFront, input1, i) {
    var isLast = !isFront && i == trains[input1].cars.length - 1;
    if (cO.turned) {
        isLast = isFront && i == -1;
    }
    return isLast;
}
function getIsSecond(cO, isFront, input1, i) {
    return getIsFirst(cO, !isFront, input1, i);
}
function getIsSecondLast(cO, isFront, input1, i) {
    return getIsLast(cO, !isFront, input1, i);
}
function getLeadingBogie(cO, input1, realStandardDirection) {
    const train = trains[input1];
    if (realStandardDirection != cO.turned) {
        return train.front;
    }
    return train.cars.length == 0 ? train.back : train.cars[train.cars.length - 1].back;
}
function getUpperTrackInside(cO) {
    // Distance along the track to the background edge the upper track crosses (top or right); negative outside
    if (cO.state >= 313 && cO.state <= 315) {
        // The pillar track and its adjoining curves run nearly parallel to the right edge: measure along them via y between where the pillar track enters and leaves the background
        return Math.min(cO.y - background.y - 0.1654 * background.height, 0.6486 * background.height - (cO.y - background.y));
    }
    return Math.min((cO.y - background.y) / Math.abs(Math.sin(cO.angle)), (background.x + background.width - cO.x) / Math.abs(Math.cos(cO.angle)));
}
function changeCOSection(cO, isFront, input1, currentObject, i, reverse = false) {
    var realStandardDirection = getRealStandardDirection(cO, input1, reverse);
    var isFirst = getIsFirst(cO, isFront, input1, i);
    var isLast = getIsLast(cO, isFront, input1, i);
    var realIsFront = isFront != cO.turned;
    var leadingBogie = getLeadingBogie(cO, input1, realStandardDirection);
    if (i == -1 && isFront) {
        // Train sound on the upper track: audible while any part of the train is inside the background
        const bogies = [trains[input1].front, trains[input1].back];
        trains[input1].cars.forEach(function (car) {
            bogies.push(car.front, car.back);
        });
        if (bogies.some((bogie) => bogie.state > 300 && bogie.state < 400)) {
            const stillInside = Math.max(...bogies.map((bogie) => getUpperTrackInside(bogie))) / (trains[input1].width - 2 * trains[input1].bogieDistance * trains[input1].width);
            trains[input1].volumeCustom = stillInside;
        }
    }
    if (realStandardDirection) {
        // Switch sections
        if (cO.state == 1 && Math.round(cO.x - background.x) >= Math.round(trains[input1].circle.x[1])) {
            if (isFirst && trains[input1].circleFamily == rotationPoints.outer && switches.outer2inner.right.turned) {
                trains[input1].switchCircles = true;
                trains[input1].circleFamily = null;
            }
            cO.stateChange = true;
            cO.state = trains[input1].switchCircles ? -2 : 2;
        }
        else if (Math.abs(cO.state) == 2 && Math.round(cO.x - background.x) <= Math.round(trains[input1].switchCircles ? rotationPoints.inner.narrow.x[2] : trains[input1].circle.x[2]) && cO.y - background.y > trains[input1].circle.y[1] + (trains[input1].circle.y[2] - trains[input1].circle.y[1]) / 2) {
            if (cO.state == -2 && isLast) {
                trains[input1].circle = rotationPoints.inner.narrow;
                trains[input1].circleFamily = rotationPoints.inner;
                trains[input1].switchCircles = false;
            }
            cO.stateChange = true;
            cO.state = (trains[input1].circleFamily == rotationPoints.outer && switches.outerAltState3.right.turned && isFirst) || leadingBogie.state == -3 ? -3 : 3;
        }
        else if ((Math.abs(cO.state) == 3 || (cO.state > 100 && cO.state < 200)) && Math.round(cO.x - background.x) <= Math.round(trains[input1].circle.x[3])) {
            if (isFirst && trains[input1].circleFamily == rotationPoints.inner && switches.inner2outer.left.turned) {
                trains[input1].switchCircles = true;
                trains[input1].circleFamily = null;
            }
            else if (isFirst && trains[input1].circleFamily == rotationPoints.inner && switches.innerWide.left.turned) {
                trains[input1].circle = rotationPoints.inner.wide;
            }
            else if (isFirst && trains[input1].circleFamily == rotationPoints.inner) {
                trains[input1].circle = rotationPoints.inner.narrow;
            }
            cO.stateChange = true;
            cO.state = trains[input1].switchCircles ? -4 : 4;
        }
        else if (Math.abs(cO.state) == 4 && Math.round(cO.x - background.x) >= Math.round(trains[input1].switchCircles ? rotationPoints.outer.narrow.x[0] : trains[input1].circle.x[0]) && cO.y - background.y < trains[input1].circle.y[0] + (trains[input1].circle.y[3] - trains[input1].circle.y[0]) / 2) {
            if (cO.state == -4 && isLast) {
                trains[input1].circle = rotationPoints.outer.narrow;
                trains[input1].circleFamily = rotationPoints.outer;
                trains[input1].switchCircles = false;
            }
            cO.stateChange = true;
            cO.state = 1;
        }
        else if (Math.abs(cO.state) == 111 && Math.round(cO.x - background.x) <= Math.round(rotationPoints.inner.sidings.firstS1.x[0])) {
            cO.stateChange = true;
            cO.state = 110;
        }
        else if (Math.abs(cO.state) == 112 && Math.round(cO.x - background.x) <= Math.round(rotationPoints.inner.sidings.firstS2.x[0])) {
            cO.stateChange = true;
            cO.state = 111;
        }
        else if (Math.abs(cO.state) == 121 && Math.round(cO.x - background.x) <= Math.round(rotationPoints.inner.sidings.secondS1.x[0])) {
            cO.stateChange = true;
            cO.state = 120;
        }
        else if (Math.abs(cO.state) == 122 && Math.round(cO.x - background.x) <= Math.round(rotationPoints.inner.sidings.secondS2.x[0])) {
            cO.stateChange = true;
            cO.state = 121;
        }
        else if (Math.abs(cO.state) == 131 && Math.round(cO.x - background.x) <= Math.round(rotationPoints.inner.sidings.thirdS1.x[0])) {
            cO.stateChange = true;
            cO.state = 130;
        }
        else if (Math.abs(cO.state) == 132 && Math.round(cO.x - background.x) <= Math.round(rotationPoints.inner.sidings.thirdS2.x[0])) {
            cO.stateChange = true;
            cO.state = 131;
        }
        else if (cO.state == 210 && Math.round(cO.x - background.x) <= Math.round(rotationPoints.outer.rightSiding.enter.x[0])) {
            cO.stateChange = true;
            cO.stateChangeLocal = true;
            cO.state = -3;
            cO.stateLocal = 3;
        }
        else if (cO.state == 211 && Math.round(cO.x - background.x) <= Math.round(rotationPoints.outer.rightSiding.curve.x[0])) {
            cO.stateChange = true;
            cO.state = 210;
        }
        else if (cO.state == 212 && cO.y - background.y >= rotationPoints.outer.rightSiding.end.y[0]) {
            cO.stateChange = true;
            cO.state = 211;
        }
        else if (cO.state == 212 && cO.y - background.y > 0) {
            const stillInside = (cO.y - background.y) / (currentObject.width - 2 * currentObject.bogieDistance * currentObject.width);
            if (realIsFront) {
                currentObject.invisible = false;
                currentObject.opacity = trainParams.minOpacity + (1 - trainParams.minOpacity) * stillInside;
            }
            if (isFirst) {
                trains[input1].volumeCustom = stillInside;
            }
        }
        else if (cO.state == 213 && cO.y - background.y >= rotationPoints.outer.rightSiding.continueCurve0.y[0]) {
            cO.stateChange = true;
            cO.state = 212;
        }
        else if (cO.state == 214 && cO.x - background.x <= rotationPoints.outer.rightSiding.continueLine0.x[0]) {
            cO.stateChange = true;
            cO.state = 213;
        }
        else if (cO.state == 215 && cO.x - background.x <= rotationPoints.outer.rightSiding.continueCurve1.x[0]) {
            cO.stateChange = true;
            cO.state = 214;
        }
        else if (cO.state == 216 && cO.y - background.y <= rotationPoints.outer.rightSiding.continueLine1.y[0]) {
            cO.stateChange = true;
            cO.state = 215;
        }
        else if (cO.state == 217 && cO.y - background.y <= rotationPoints.outer.rightSiding.continueCurve2.y[0]) {
            cO.stateChange = true;
            cO.state = 216;
        }
        else if (cO.state == 218 && cO.x - background.x >= rotationPoints.outer.rightSiding.rejoin.x[0]) {
            cO.stateChange = true;
            cO.state = 217;
        }
        else if (cO.state == 220 && cO.y - background.y >= rotationPoints.outer.rightSidingPassing.diverge.y[0]) {
            cO.stateChange = true;
            cO.state = 212;
        }
        else if (cO.state == 221 && cO.y - background.y >= rotationPoints.outer.rightSidingPassing.curve0.y[0]) {
            cO.stateChange = true;
            cO.state = 220;
        }
        else if (cO.state == 222 && cO.x - background.x <= rotationPoints.outer.rightSidingPassing.line0.x[0]) {
            cO.stateChange = true;
            cO.state = 221;
        }
        else if (cO.state == 223 && cO.x - background.x <= rotationPoints.outer.rightSidingPassing.curve1.x[0]) {
            cO.stateChange = true;
            cO.state = 222;
        }
        else if (cO.state == 224 && cO.y - background.y <= rotationPoints.outer.rightSidingPassing.line1.y[0]) {
            cO.stateChange = true;
            cO.state = 223;
        }
        else if (cO.state == 225 && cO.y - background.y <= rotationPoints.outer.rightSidingPassing.curve2.y[0]) {
            cO.stateChange = true;
            cO.state = 224;
        }
        else if (cO.state == 226 && cO.x - background.x >= rotationPoints.outer.rightSidingPassing.line2.x[0]) {
            cO.stateChange = true;
            cO.state = 225;
        }
        else if (cO.state == 227 && cO.x - background.x >= rotationPoints.outer.rightSidingPassing.merge.x[0]) {
            cO.stateChange = true;
            cO.state = 226;
        }
        else if ((cO.state == 218 || cO.state == 227) && cO.x - background.x > background.width) {
            const stillInside = 1 + (background.width - cO.x + background.x) / (currentObject.width - 2 * currentObject.bogieDistance * currentObject.width);
            if (!realIsFront) {
                currentObject.invisible = true;
            }
            else {
                currentObject.opacity = trainParams.minOpacity + (1 - trainParams.minOpacity) * stillInside;
            }
            if (isLast) {
                trains[input1].volumeCustom = 0;
            }
            else if (getIsSecondLast(cO, isFront, input1, i)) {
                trains[input1].volumeCustom = stillInside;
            }
        }
        else if (cO.state == 310 && cO.x - background.x >= rotationPoints.outer.upperSiding.sCurve0.x[3]) {
            cO.stateChange = true;
            cO.state = 311;
        }
        else if (cO.state == 311 && cO.x - background.x >= rotationPoints.outer.upperSiding.sCurve1.x[3]) {
            cO.stateChange = true;
            cO.state = 312;
        }
        else if (cO.state == 312 && cO.x - background.x >= rotationPoints.outer.upperSiding.parallel.x[1]) {
            cO.stateChange = true;
            if (leadingBogie.state == 318 || leadingBogie.state == 319) {
                // A train reversed while standing across the turnout on its way out of the loop: its bogies follow the leading bogie back onto the loop's return line (319) instead of entering the loop start (313)
                cO.turned = !cO.turned;
                if (isFirst) {
                    trains[input1].trainTurned = cO.turned;
                }
                cO.state = 319;
            }
            else {
                cO.state = 313;
            }
        }
        else if (cO.state == 313 && cO.y - background.y >= rotationPoints.outer.upperSiding.loopCurve0.y[3]) {
            cO.stateChange = true;
            cO.state = 314;
        }
        else if (cO.state == 314 && cO.y - background.y >= rotationPoints.outer.upperSiding.pillar.y[3]) {
            cO.stateChange = true;
            cO.state = 315;
        }
        else if (cO.state == 315 && cO.x - background.x >= rotationPoints.outer.upperSiding.loopCurve1.x[3]) {
            cO.stateChange = true;
            cO.state = 316;
        }
        else if (cO.state == 316 && cO.y - background.y <= rotationPoints.outer.upperSiding.loopCurve2.y[3]) {
            cO.stateChange = true;
            cO.state = 317;
        }
        else if (cO.state == 317 && cO.y - background.y <= rotationPoints.outer.upperSiding.loopLine0.y[1]) {
            cO.stateChange = true;
            cO.state = 318;
        }
        else if (cO.state == 318 && cO.x - background.x <= rotationPoints.outer.upperSiding.loopCurve3.x[3]) {
            cO.stateChange = true;
            cO.state = 319;
        }
        else if (cO.state == 319 && cO.x - background.x <= rotationPoints.outer.upperSiding.loopLine1.x[1]) {
            cO.stateChange = true;
            cO.turned = !cO.turned;
            if (isFirst) {
                trains[input1].trainTurned = cO.turned;
            }
            cO.state = 312;
        }
    }
    else {
        if (cO.state == 1 && Math.round(cO.x - background.x) <= Math.round(trains[input1].circle.x[0])) {
            if (isLast && trains[input1].circleFamily == rotationPoints.outer && switches.outer2inner.left.turned) {
                trains[input1].switchCircles = true;
                trains[input1].circleFamily = null;
            }
            cO.stateChange = true;
            cO.state = trains[input1].switchCircles ? -4 : 4;
        }
        else if (Math.abs(cO.state) == 2 && Math.round(cO.x - background.x) <= Math.round(trains[input1].switchCircles ? rotationPoints.outer.narrow.x[1] : trains[input1].circle.x[1]) && cO.y - background.y < trains[input1].circle.y[1] + (trains[input1].circle.y[2] - trains[input1].circle.y[1]) / 2) {
            if (cO.state == -2 && isFirst) {
                trains[input1].circle = rotationPoints.outer.narrow;
                trains[input1].circleFamily = rotationPoints.outer;
                trains[input1].switchCircles = false;
            }
            cO.stateChange = true;
            cO.state = 1;
        }
        else if (Math.abs(cO.state) == 3 && Math.round(cO.x - background.x) >= Math.round(trains[input1].circle.x[2]) && Math.round(cO.y - background.y) >= background.height / 2) {
            if (isLast && trains[input1].circleFamily == rotationPoints.inner && switches.inner2outer.right.turned) {
                trains[input1].switchCircles = true;
                trains[input1].circleFamily = null;
            }
            else if (isLast && trains[input1].circleFamily == rotationPoints.inner && switches.innerWide.right.turned) {
                trains[input1].circle = rotationPoints.inner.wide;
            }
            else if (isLast && trains[input1].circleFamily == rotationPoints.inner) {
                trains[input1].circle = rotationPoints.inner.narrow;
            }
            cO.stateChange = true;
            cO.state = trains[input1].switchCircles ? -2 : 2;
        }
        else if (trains[input1].circleFamily == rotationPoints.outer && cO.state == -3 && Math.round(cO.x - background.x) >= Math.round(rotationPoints.outer.altState3.right.x[1])) {
            if ((isLast && switches.outerRightSiding.left.turned && cO.stateChangeLocal) || (leadingBogie.state > 200 && leadingBogie.state < 300)) {
                cO.stateChange = true;
                cO.state = 210;
            }
        }
        else if (Math.abs(cO.state) == 4 && Math.round(cO.x - background.x) >= Math.round(trains[input1].switchCircles ? rotationPoints.inner.narrow.x[3] : trains[input1].circle.x[3]) && cO.y - background.y > trains[input1].circle.y[0] + (trains[input1].circle.y[3] - trains[input1].circle.y[0]) / 2) {
            if (cO.state == -4 && isFirst) {
                trains[input1].circle = rotationPoints.inner.narrow;
                trains[input1].circleFamily = rotationPoints.inner;
                trains[input1].switchCircles = false;
            }
            cO.stateChange = true;
            cO.state = (trains[input1].circleFamily == rotationPoints.outer && switches.outerAltState3.left.turned && isLast) || leadingBogie.state == -3 ? -3 : 3;
            if ((trains[input1].circleFamily == null || trains[input1].circleFamily == rotationPoints.inner) && ((isLast && switches.sidings1.left.turned) || (leadingBogie.state > 100 && leadingBogie.state < 200))) {
                if ((trains[input1].circleFamily == null || trains[input1].circleFamily == rotationPoints.inner) && ((isLast && switches.sidings2.left.turned) || (leadingBogie.state >= 110 && leadingBogie.state < 120))) {
                    cO.state = 110;
                }
                else if ((trains[input1].circleFamily == null || trains[input1].circleFamily == rotationPoints.inner) && ((isLast && switches.sidings3.left.turned) || (leadingBogie.state >= 110 && leadingBogie.state < 130))) {
                    cO.state = 120;
                }
                else {
                    cO.state = 130;
                }
            }
        }
        else if (Math.abs(cO.state) == 110 && Math.round(cO.x - background.x) >= Math.round(rotationPoints.inner.sidings.first.x[3])) {
            cO.stateChange = true;
            cO.state = 111;
        }
        else if (Math.abs(cO.state) == 111 && Math.round(cO.x - background.x) >= Math.round(rotationPoints.inner.sidings.firstS1.x[1])) {
            cO.stateChange = true;
            cO.state = 112;
        }
        else if (Math.abs(cO.state) == 112 && cO.x - background.x - rotationPoints.inner.sidings.firstS2.x[0] >= 0.95 * (rotationPoints.inner.sidings.firstS2.x[3] - rotationPoints.inner.sidings.firstS2.x[0])) {
            if (demoMode) {
                trains[input1].standardDirection = !trains[input1].standardDirection;
                trains[input1].accelerationSpeed = trains[input1].accelerationSpeedStartFac;
            }
            else {
                trains[input1].move = false;
                trains[input1].endOfTrack = true;
                trains[input1].endOfTrackStandardDirection = false;
            }
        }
        else if (Math.abs(cO.state) == 120 && Math.round(cO.x - background.x) >= Math.round(rotationPoints.inner.sidings.second.x[3])) {
            cO.stateChange = true;
            cO.state = 121;
        }
        else if (Math.abs(cO.state) == 121 && Math.round(cO.x - background.x) >= Math.round(rotationPoints.inner.sidings.secondS1.x[1])) {
            cO.stateChange = true;
            cO.state = 122;
        }
        else if (Math.abs(cO.state) == 122 && cO.x - background.x - rotationPoints.inner.sidings.secondS2.x[0] >= 0.95 * (rotationPoints.inner.sidings.secondS2.x[3] - rotationPoints.inner.sidings.secondS2.x[0])) {
            if (demoMode) {
                trains[input1].standardDirection = !trains[input1].standardDirection;
                trains[input1].accelerationSpeed = trains[input1].accelerationSpeedStartFac;
            }
            else {
                trains[input1].move = false;
                trains[input1].endOfTrack = true;
                trains[input1].endOfTrackStandardDirection = false;
            }
        }
        else if (Math.abs(cO.state) == 130 && Math.round(cO.x - background.x) >= Math.round(rotationPoints.inner.sidings.third.x[3])) {
            cO.stateChange = true;
            cO.state = 131;
        }
        else if (Math.abs(cO.state) == 131 && Math.round(cO.x - background.x) >= Math.round(rotationPoints.inner.sidings.thirdS1.x[1])) {
            cO.stateChange = true;
            cO.state = 132;
        }
        else if (Math.abs(cO.state) == 132 && cO.x - background.x - rotationPoints.inner.sidings.thirdS2.x[0] >= 0.95 * (rotationPoints.inner.sidings.thirdS2.x[3] - rotationPoints.inner.sidings.thirdS2.x[0])) {
            if (demoMode) {
                trains[input1].standardDirection = !trains[input1].standardDirection;
                trains[input1].accelerationSpeed = trains[input1].accelerationSpeedStartFac;
            }
            else {
                trains[input1].move = false;
                trains[input1].endOfTrack = true;
                trains[input1].endOfTrackStandardDirection = false;
            }
        }
        else if (cO.state == 210 && Math.round(cO.x - background.x) >= Math.round(rotationPoints.outer.rightSiding.enter.x[1])) {
            cO.stateChange = true;
            // A leading bogie on the passing track went the 218 way only if it already turned here
            if ((isLast && switches.outerRightSidingTurn.left.turned) || (leadingBogie.state > 215 && leadingBogie.state < 219) || (leadingBogie.state > 219 && leadingBogie.state < 228 && leadingBogie.turned != cO.turned)) {
                cO.state = 218;
                cO.turned = !cO.turned;
                if (isFirst) {
                    trains[input1].trainTurned = cO.turned;
                }
            }
            else {
                cO.state = 211;
            }
        }
        else if (cO.state == 211 && Math.round(cO.y - background.y) <= Math.round(rotationPoints.outer.rightSiding.curve.y[3])) {
            cO.stateChange = true;
            cO.state = 212;
        }
        else if (cO.state == 212 && cO.y - background.y <= rotationPoints.outer.rightSiding.end.y[1]) {
            cO.stateChange = true;
            cO.state = 213;
        }
        else if (cO.state == 220 && cO.y - background.y <= rotationPoints.outer.rightSidingPassing.diverge.y[3]) {
            cO.stateChange = true;
            cO.state = 221;
        }
        else if (cO.state == 221 && cO.x - background.x >= rotationPoints.outer.rightSidingPassing.curve0.x[3]) {
            cO.stateChange = true;
            cO.state = 222;
        }
        else if (cO.state == 222 && cO.x - background.x >= rotationPoints.outer.rightSidingPassing.line0.x[1]) {
            cO.stateChange = true;
            cO.state = 223;
        }
        else if (cO.state == 223 && cO.y - background.y >= rotationPoints.outer.rightSidingPassing.curve1.y[3]) {
            cO.stateChange = true;
            cO.state = 224;
        }
        else if (cO.state == 224 && cO.y - background.y >= rotationPoints.outer.rightSidingPassing.line1.y[1]) {
            cO.stateChange = true;
            cO.state = 225;
        }
        else if (cO.state == 225 && cO.x - background.x <= rotationPoints.outer.rightSidingPassing.curve2.x[3]) {
            cO.stateChange = true;
            cO.state = 226;
        }
        else if (cO.state == 226 && cO.x - background.x <= rotationPoints.outer.rightSidingPassing.line2.x[1]) {
            cO.stateChange = true;
            cO.state = 227;
        }
        else if (cO.state == 227 && cO.x - background.x <= rotationPoints.outer.rightSidingPassing.merge.x[3]) {
            cO.stateChange = true;
            cO.state = 218;
        }
        else if ((cO.state == 212 || cO.state == 220) && cO.y - background.y < 0) {
            const stillInside = 1 + (cO.y - background.y) / (currentObject.width - 2 * currentObject.bogieDistance * currentObject.width);
            if (realIsFront) {
                currentObject.invisible = true;
            }
            else {
                currentObject.opacity = trainParams.minOpacity + (1 - trainParams.minOpacity) * stillInside;
            }
            if (isFirst) {
                trains[input1].volumeCustom = 0;
            }
            else if (getIsSecond(cO, isFront, input1, i)) {
                trains[input1].volumeCustom = stillInside;
            }
        }
        else if (cO.state == 213 && cO.x - background.x >= rotationPoints.outer.rightSiding.continueCurve0.x[3]) {
            cO.stateChange = true;
            cO.state = 214;
        }
        else if (cO.state == 214 && cO.x - background.x >= rotationPoints.outer.rightSiding.continueLine0.x[1]) {
            cO.stateChange = true;
            cO.state = 215;
        }
        else if (cO.state == 215 && cO.y - background.y >= rotationPoints.outer.rightSiding.continueCurve1.y[3]) {
            cO.stateChange = true;
            cO.state = 216;
        }
        else if (cO.state == 216 && cO.y - background.y >= rotationPoints.outer.rightSiding.continueLine1.y[1]) {
            cO.stateChange = true;
            cO.state = 217;
        }
        else if (cO.state == 217 && cO.x - background.x <= rotationPoints.outer.rightSiding.continueCurve2.x[3]) {
            cO.stateChange = true;
            cO.state = 218;
        }
        else if (cO.state == 218 && cO.x - background.x <= rotationPoints.outer.rightSiding.rejoin.x[1]) {
            cO.stateChange = true;
            cO.turned = !cO.turned;
            if (isFirst) {
                trains[input1].trainTurned = cO.turned;
            }
            cO.state = 210;
        }
        else if (cO.state == 218 && cO.x - background.x < background.width) {
            const stillInside = (background.width - cO.x + background.x) / (currentObject.width - 2 * currentObject.bogieDistance * currentObject.width);
            if (!realIsFront) {
                currentObject.invisible = false;
                currentObject.opacity = trainParams.minOpacity + (1 - trainParams.minOpacity) * stillInside;
            }
            if (isLast) {
                trains[input1].volumeCustom = stillInside;
            }
        }
        else if (cO.state == 310 && cO.x - background.x <= rotationPoints.outer.upperSiding.sCurve0.x[0]) {
            cO.stateChange = true;
            cO.state = 1;
        }
        else if (cO.state == 311 && cO.x - background.x <= rotationPoints.outer.upperSiding.sCurve1.x[0]) {
            cO.stateChange = true;
            cO.state = 310;
        }
        else if (cO.state == 312 && cO.x - background.x <= rotationPoints.outer.upperSiding.parallel.x[0]) {
            cO.stateChange = true;
            cO.state = 311;
        }
        else if (cO.state == 313 && cO.x - background.x <= rotationPoints.outer.upperSiding.loopCurve0.x[0]) {
            cO.stateChange = true;
            cO.state = 312;
        }
        else if (cO.state == 314 && cO.y - background.y <= rotationPoints.outer.upperSiding.pillar.y[0]) {
            cO.stateChange = true;
            cO.state = 313;
        }
        else if (cO.state == 315 && cO.y - background.y <= rotationPoints.outer.upperSiding.loopCurve1.y[0]) {
            cO.stateChange = true;
            cO.state = 314;
        }
        else if (cO.state == 316 && cO.x - background.x <= rotationPoints.outer.upperSiding.loopCurve2.x[0]) {
            cO.stateChange = true;
            cO.state = 315;
        }
        else if (cO.state == 317 && cO.y - background.y >= rotationPoints.outer.upperSiding.loopLine0.y[0]) {
            cO.stateChange = true;
            cO.state = 316;
        }
        else if (cO.state == 318 && cO.y - background.y >= rotationPoints.outer.upperSiding.loopCurve3.y[0]) {
            cO.stateChange = true;
            cO.state = 317;
        }
        else if (cO.state == 319 && cO.x - background.x >= rotationPoints.outer.upperSiding.loopLine1.x[0]) {
            cO.stateChange = true;
            cO.state = 318;
        }
    }
}
function getBezierPoints(fac, a, b, c, d) {
    return Math.pow(1 - fac, 3) * a + 3 * fac * Math.pow(1 - fac, 2) * b + 3 * Math.pow(fac, 2) * (1 - fac) * c + Math.pow(fac, 3) * d;
}
function setCOPos(cO, isFront, input1, i, speed, customSpeed) {
    function setCOPosLinear(linearPoints, isBackwards, isRotated) {
        var angleCorr = isRotated ? Math.PI : 0;
        var calcCorr = 1;
        if (isRotated != isBackwards) {
            calcCorr = -1;
        }
        var x = cO.x;
        var y = cO.y;
        var angle = Math.atan((linearPoints.y[1] - linearPoints.y[0]) / (linearPoints.x[1] - linearPoints.x[0]));
        var hypotenuse = Math.sqrt(Math.pow(x - linearPoints.x[0], 2) + Math.pow(y - linearPoints.y[0], 2));
        hypotenuse += speed * customSpeed;
        x = linearPoints.x[0] + calcCorr * (Math.cos(angle) * hypotenuse);
        y = linearPoints.y[0] + calcCorr * (Math.sin(angle) * hypotenuse);
        cO.x = x;
        cO.y = y;
        cO.angle = angle + angleCorr;
        if (linearPoints.z) {
            // Height on tracks that have one, from the position projected onto the line
            var lineLengthSquare = Math.pow(linearPoints.x[1] - linearPoints.x[0], 2) + Math.pow(linearPoints.y[1] - linearPoints.y[0], 2);
            cO.z = linearPoints.z[0] + ((linearPoints.z[1] - linearPoints.z[0]) * ((x - linearPoints.x[0]) * (linearPoints.x[1] - linearPoints.x[0]) + (y - linearPoints.y[0]) * (linearPoints.y[1] - linearPoints.y[0]))) / lineLengthSquare;
        }
        else {
            cO.z = 0;
        }
    }
    function getBezierFac(fac, approxNO, maxDuration, cCO, bezierPoints, closeEnough = 0.1) {
        var x = getBezierPoints(fac, bezierPoints.x[0], bezierPoints.x[1], bezierPoints.x[2], bezierPoints.x[3]);
        var y = getBezierPoints(fac, bezierPoints.y[0], bezierPoints.y[1], bezierPoints.y[2], bezierPoints.y[3]);
        var distance = Math.sqrt(Math.pow(cCO.x - x, 2) + Math.pow(cCO.y - y, 2));
        var fac1 = fac + 1 / approxNO;
        var fac2 = fac - 1 / approxNO;
        var x1 = getBezierPoints(fac1, bezierPoints.x[0], bezierPoints.x[1], bezierPoints.x[2], bezierPoints.x[3]);
        var x2 = getBezierPoints(fac2, bezierPoints.x[0], bezierPoints.x[1], bezierPoints.x[2], bezierPoints.x[3]);
        var y1 = getBezierPoints(fac1, bezierPoints.y[0], bezierPoints.y[1], bezierPoints.y[2], bezierPoints.y[3]);
        var y2 = getBezierPoints(fac2, bezierPoints.y[0], bezierPoints.y[1], bezierPoints.y[2], bezierPoints.y[3]);
        var distance1 = Math.sqrt(Math.pow(cCO.x - x1, 2) + Math.pow(cCO.y - y1, 2));
        var distance2 = Math.sqrt(Math.pow(cCO.x - x2, 2) + Math.pow(cCO.y - y2, 2));
        var newFac = Math.abs(distance1) < Math.abs(distance2) ? fac1 : fac2;
        var newDistance = Math.abs(distance1) < Math.abs(distance2) ? distance1 : distance2;
        newFac = newFac < 0 ? 0 : newFac > 1 ? 1 : newFac;
        return Math.abs(distance) <= Math.abs(newDistance) ? fac : Math.abs(newDistance) < closeEnough * Math.abs(bezierPoints.x[0] - bezierPoints.x[3]) || --maxDuration < 1 ? newFac : getBezierFac(newFac, approxNO, maxDuration, cCO, bezierPoints, closeEnough);
    }
    function getBezierAngle(fac, a, b) {
        function getBezierPointsDifferential(fac, a, b, c, d) {
            return 3 * Math.pow(1 - fac, 2) * (b - a) + 6 * fac * (1 - fac) * (c - b) + 3 * Math.pow(fac, 2) * (d - c);
        }
        var dxdt = getBezierPointsDifferential(fac, a[0], a[1], a[2], a[3]);
        var dydt = getBezierPointsDifferential(fac, b[0], b[1], b[2], b[3]);
        return Math.atan2(dydt, dxdt);
    }
    function setCOPosBezier(bezierPoints, isBackwards, length) {
        var backwardsCorr = isBackwards ? -1 : 1;
        var fac = i < 0 && isFront ? cO.currentCurveFac : getBezierFac(cO.currentCurveFac, 500, 100, cO, bezierPoints);
        cO.currentCurveFac = fac + backwardsCorr * ((speed * customSpeed) / length);
        cO.x = getBezierPoints(cO.currentCurveFac, bezierPoints.x[0], bezierPoints.x[1], bezierPoints.x[2], bezierPoints.x[3]);
        cO.y = getBezierPoints(cO.currentCurveFac, bezierPoints.y[0], bezierPoints.y[1], bezierPoints.y[2], bezierPoints.y[3]);
        cO.angle = getBezierAngle(cO.currentCurveFac, bezierPoints.x, bezierPoints.y);
        if (bezierPoints.z) {
            cO.z = getBezierPoints(cO.currentCurveFac, bezierPoints.z[0], bezierPoints.z[1], bezierPoints.z[2], bezierPoints.z[3]);
        }
        else {
            cO.z = 0;
        }
    }
    var realStandardDirection = getRealStandardDirection(cO, input1);
    var isFirst = getIsFirst(cO, isFront, input1, i);
    var isLast = getIsLast(cO, isFront, input1, i);
    var leadingBogie = getLeadingBogie(cO, input1, realStandardDirection);
    var points;
    if (cO.state == 1) {
        // Calc bogie position
        if (cO.stateChange) {
            cO.stateChange = false;
        }
        points = { x: [trains[input1].circle.x[0] + background.x, trains[input1].circle.x[1] + background.x], y: [trains[input1].circle.y[0] + background.y, trains[input1].circle.y[1] + background.y] };
        var pointsSwitch = { x: [rotationPoints.outer.narrow.x[0] + background.x, rotationPoints.outer.narrow.x[1] + background.x], y: [rotationPoints.outer.narrow.y[0] + background.y, rotationPoints.outer.narrow.y[1] + background.y] };
        if (!realStandardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (!realStandardDirection) {
            pointsSwitch.x.reverse();
            pointsSwitch.y.reverse();
        }
        var beforeUpperSiding = cO.x - background.x < rotationPoints.outer.upperSiding.sCurve0.x[0];
        setCOPosLinear(trains[input1].switchCircles ? pointsSwitch : points, !realStandardDirection, false);
        // The first object turns off only when it crosses the switch in this step, so a train already past it is not diverted when the switch is turned; the others follow the leading bogie onto the upper track as soon as they are past the switch, by position, because setCOPosCorr may move them past it between two checks
        if (realStandardDirection && cO.x - background.x >= rotationPoints.outer.upperSiding.sCurve0.x[0] && ((isFirst && beforeUpperSiding && trains[input1].circleFamily == rotationPoints.outer && switches.outerUpperSiding.left.turned) || (leadingBogie.state > 300 && leadingBogie.state < 400))) {
            cO.stateChange = true;
            cO.state = 310;
        }
    }
    else if (Math.abs(cO.state) == 2) {
        cO.state = trains[input1].switchCircles ? -2 : 2;
        var pointsSwitch = { x: [rotationPoints.outer.narrow.x[1] + background.x, rotationPoints.inner2outer.right.x[1] + background.x, rotationPoints.inner2outer.right.x[2] + background.x, rotationPoints.inner.narrow.x[2] + background.x], y: [rotationPoints.outer.narrow.y[1] + background.y, rotationPoints.inner2outer.right.y[1] + background.y, rotationPoints.inner2outer.right.y[2] + background.y, rotationPoints.inner.narrow.y[2] + background.y] };
        points = { x: [trains[input1].circle.x[1] + background.x, trains[input1].circle.x[4] + background.x, trains[input1].circle.x[5] + background.x, trains[input1].circle.x[2] + background.x], y: [trains[input1].circle.y[1] + background.y, trains[input1].circle.y[4] + background.y, trains[input1].circle.y[5] + background.y, trains[input1].circle.y[2] + background.y] };
        if (cO.stateChange) {
            cO.angle = realStandardDirection ? 0 : Math.PI;
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, trains[input1].switchCircles ? pointsSwitch : points);
            cO.stateChange = false;
        }
        setCOPosBezier(trains[input1].switchCircles ? pointsSwitch : points, !realStandardDirection, trains[input1].switchCircles ? rotationPoints.inner2outer.right.bezierLength : trains[input1].circle.bezierLength.right);
        if ((trains[input1].circleFamily == null || trains[input1].circleFamily == rotationPoints.outer) && realStandardDirection && isFirst) {
            if ((cO.y - background.y) * switchesBeforeFac < switches.outer2inner.right.y && trains[input1].switchCircles != switches.outer2inner.right.turned) {
                trains[input1].switchCircles = !trains[input1].switchCircles;
                cO.state *= -1;
                cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 5000, 1000, cO, !trains[input1].switchCircles ? pointsSwitch : points);
            }
            trains[input1].circleFamily = trains[input1].switchCircles ? null : rotationPoints.outer;
            trains[input1].circle = rotationPoints.outer.narrow;
        }
        else if (!realStandardDirection && trains[input1].circleFamily == rotationPoints.inner && isLast && cO.y - background.y > switches.innerWide.right.y * switchesBeforeFac && ((trains[input1].circle == rotationPoints.inner.wide && !switches.innerWide.right.turned) || (trains[input1].circle == rotationPoints.inner.narrow && switches.innerWide.right.turned))) {
            var pointsAlt = trains[input1].circle == rotationPoints.inner.wide ? { x: [rotationPoints.inner.narrow.x[1] + background.x, rotationPoints.inner.narrow.x[4] + background.x, rotationPoints.inner.narrow.x[5] + background.x, rotationPoints.inner.narrow.x[2] + background.x], y: [rotationPoints.inner.narrow.y[1] + background.y, rotationPoints.inner.narrow.y[4] + background.y, rotationPoints.inner.narrow.y[5] + background.y, rotationPoints.inner.narrow.y[2] + background.y] } : { x: [rotationPoints.inner.wide.x[1] + background.x, rotationPoints.inner.wide.x[4] + background.x, rotationPoints.inner.wide.x[5] + background.x, rotationPoints.inner.wide.x[2] + background.x], y: [rotationPoints.inner.wide.y[1] + background.y, rotationPoints.inner.wide.y[4] + background.y, rotationPoints.inner.wide.y[5] + background.y, rotationPoints.inner.wide.y[2] + background.y] };
            trains[input1].circle = trains[input1].circle == rotationPoints.inner.wide ? rotationPoints.inner.narrow : rotationPoints.inner.wide;
            trains[input1].front.currentCurveFac = getBezierFac(trains[input1].front.currentCurveFac, 5000, 1000, trains[input1].front, pointsAlt);
        }
    }
    else if (cO.state == 3) {
        if (cO.stateChange) {
            cO.stateChange = false;
        }
        points = { x: [trains[input1].circle.x[2] + background.x, trains[input1].circle.x[3] + background.x], y: [trains[input1].circle.y[2] + background.y, trains[input1].circle.y[3] + background.y] };
        var pointsSwitch = { x: [rotationPoints.inner.narrow.x[2] + background.x, rotationPoints.inner.narrow.x[3] + background.x], y: [rotationPoints.inner.narrow.y[2] + background.y, rotationPoints.inner.narrow.y[3] + background.y] };
        if (!realStandardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (!realStandardDirection) {
            pointsSwitch.x.reverse();
            pointsSwitch.y.reverse();
        }
        setCOPosLinear(trains[input1].switchCircles ? pointsSwitch : points, !realStandardDirection, true);
    }
    else if (cO.state == -3) {
        if (trains[input1].circleFamily == rotationPoints.outer) {
            if (cO.x > rotationPoints.outer.altState3.right.x[1] + background.x) {
                if (cO.x - background.x > rotationPoints.outer.altState3.right.x[2]) {
                    if (cO.stateChange && realStandardDirection) {
                        cO.stateLocal = 1;
                    }
                    else if (cO.stateLocal == 2 && !realStandardDirection) {
                        cO.stateLocal = 1;
                        cO.stateChangeLocal = true;
                    }
                }
                else {
                    if (cO.stateLocal == 3 && !realStandardDirection) {
                        cO.stateLocal = 2;
                        cO.stateChangeLocal = true;
                    }
                    else if (cO.stateLocal == 1 && realStandardDirection) {
                        cO.stateLocal = 2;
                        cO.stateChangeLocal = true;
                    }
                }
            }
            else if (cO.x > rotationPoints.outer.altState3.left.x[1] + background.x) {
                if (cO.stateLocal != 3) {
                    cO.stateLocal = 3;
                    cO.stateChangeLocal = true;
                }
            }
            else {
                if (cO.x - background.x > rotationPoints.outer.altState3.left.x[2]) {
                    if (cO.stateLocal == 3 && realStandardDirection) {
                        cO.stateLocal = 4;
                        cO.stateChangeLocal = true;
                    }
                    else if (cO.stateLocal == 5 && !realStandardDirection) {
                        cO.stateLocal = 4;
                        cO.stateChangeLocal = true;
                    }
                }
                else {
                    if (cO.stateChange && !realStandardDirection) {
                        cO.stateLocal = 5;
                        cO.stateChangeLocal = true;
                    }
                    else if (cO.stateLocal == 4 && realStandardDirection) {
                        cO.stateLocal = 5;
                        cO.stateChangeLocal = true;
                    }
                }
            }
            if (cO.stateLocal == 1) {
                points = { x: [background.x + rotationPoints.outer.altState3.right.x[0], background.x + rotationPoints.outer.altState3.right.x[3], background.x + rotationPoints.outer.altState3.right.x[3], background.x + rotationPoints.outer.altState3.right.x[2]], y: [background.y + rotationPoints.outer.altState3.right.y[0], background.y + rotationPoints.outer.altState3.right.y[3], background.y + rotationPoints.outer.altState3.right.y[3], background.y + rotationPoints.outer.altState3.right.y[2]] };
                if (cO.stateChange && realStandardDirection) {
                    cO.currentCurveFac = getBezierFac(0, 2000, 1000, cO, points);
                    cO.stateChange = false;
                }
                else if (cO.stateChangeLocal && !realStandardDirection) {
                    cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 2000, 1000, cO, points);
                    cO.stateChangeLocal = false;
                }
                setCOPosBezier(points, !realStandardDirection, 0.5 * rotationPoints.outer.altState3.right.bezierLength);
            }
            else if (cO.stateLocal == 2) {
                points = { x: [background.x + rotationPoints.outer.altState3.right.x[2], background.x + rotationPoints.outer.altState3.right.x[4], background.x + rotationPoints.outer.altState3.right.x[4], background.x + rotationPoints.outer.altState3.right.x[1]], y: [background.y + rotationPoints.outer.altState3.right.y[2], background.y + rotationPoints.outer.altState3.right.y[4], background.y + rotationPoints.outer.altState3.right.y[4], background.y + rotationPoints.outer.altState3.right.y[1]] };
                points.x.reverse();
                points.y.reverse();
                if (cO.stateChangeLocal && !realStandardDirection) {
                    cO.currentCurveFac = getBezierFac(0, 2000, 1000, cO, points);
                    cO.stateChangeLocal = false;
                }
                else if (cO.stateChangeLocal && realStandardDirection) {
                    cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 2000, 1000, cO, points);
                    cO.stateChangeLocal = false;
                }
                setCOPosBezier(points, realStandardDirection, 0.5 * rotationPoints.outer.altState3.right.bezierLength);
                cO.angle += Math.PI;
            }
            else if (cO.stateLocal == 3) {
                points = { x: [rotationPoints.outer.altState3.right.x[1] + background.x, rotationPoints.outer.altState3.left.x[1] + background.x], y: [rotationPoints.outer.altState3.right.y[1] + background.y, rotationPoints.outer.altState3.left.y[1] + background.y] };
                if (!realStandardDirection) {
                    points.x.reverse();
                    points.y.reverse();
                }
                setCOPosLinear(points, !realStandardDirection, true);
            }
            else if (cO.stateLocal == 4) {
                var x1 = rotationPoints.outer.altState3.left.x[1] + background.x;
                var x2 = rotationPoints.outer.altState3.left.x[2] + background.x;
                var x3 = rotationPoints.outer.altState3.left.x[4] + background.x;
                var y1 = rotationPoints.outer.altState3.left.y[1] + background.y;
                var y2 = rotationPoints.outer.altState3.left.y[2] + background.y;
                var y3 = rotationPoints.outer.altState3.left.y[4] + background.y;
                points = { x: [x1, x3, x3, x2], y: [y1, y3, y3, y2] };
                if (cO.stateChangeLocal && realStandardDirection) {
                    cO.currentCurveFac = getBezierFac(0, 2000, 1000, cO, points);
                    cO.stateChangeLocal = false;
                }
                else if (cO.stateChangeLocal && !realStandardDirection) {
                    cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 2000, 1000, cO, points);
                    cO.stateChangeLocal = false;
                }
                setCOPosBezier(points, !realStandardDirection, 0.5 * rotationPoints.outer.altState3.left.bezierLength);
            }
            else if (cO.stateLocal == 5) {
                var x1 = rotationPoints.outer.altState3.left.x[2] + background.x;
                var x2 = rotationPoints.outer.altState3.left.x[0] + background.x;
                var x3 = rotationPoints.outer.altState3.left.x[3] + background.x;
                var y1 = rotationPoints.outer.altState3.left.y[2] + background.y;
                var y2 = rotationPoints.outer.altState3.left.y[0] + background.y;
                var y3 = rotationPoints.outer.altState3.left.y[3] + background.y;
                points = { x: [x1, x3, x3, x2], y: [y1, y3, y3, y2] };
                points.x.reverse();
                points.y.reverse();
                if (cO.stateChange && !realStandardDirection) {
                    cO.currentCurveFac = getBezierFac(0, 2000, 1000, cO, points);
                    cO.stateChange = false;
                }
                else if (cO.stateChangeLocal && realStandardDirection) {
                    cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 2000, 1000, cO, points);
                    cO.stateChangeLocal = false;
                }
                setCOPosBezier(points, realStandardDirection, 0.5 * rotationPoints.outer.altState3.left.bezierLength);
                cO.angle += Math.PI;
            }
        }
    }
    else if (Math.abs(cO.state) == 4) {
        cO.state = trains[input1].switchCircles ? -4 : 4;
        var pointsSwitch = { x: [rotationPoints.inner.narrow.x[3] + background.x, rotationPoints.inner2outer.left.x[1] + background.x, rotationPoints.inner2outer.left.x[2] + background.x, rotationPoints.outer.narrow.x[0] + background.x], y: [rotationPoints.inner.narrow.y[3] + background.y, rotationPoints.inner2outer.left.y[1] + background.y, rotationPoints.inner2outer.left.y[2] + background.y, rotationPoints.outer.narrow.y[0] + background.y] };
        points = { x: [trains[input1].circle.x[3] + background.x, trains[input1].circle.x[6] + background.x, trains[input1].circle.x[7] + background.x, trains[input1].circle.x[0] + background.x], y: [trains[input1].circle.y[3] + background.y, trains[input1].circle.y[6] + background.y, trains[input1].circle.y[7] + background.y, trains[input1].circle.y[0] + background.y] };
        if (cO.stateChange) {
            cO.angle = realStandardDirection ? Math.PI : 2 * Math.PI;
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, trains[input1].switchCircles ? pointsSwitch : points);
            cO.stateChange = false;
        }
        setCOPosBezier(trains[input1].switchCircles ? pointsSwitch : points, !realStandardDirection, trains[input1].switchCircles ? rotationPoints.inner2outer.left.bezierLength : trains[input1].circle.bezierLength.left);
        if ((trains[input1].circleFamily == null || trains[input1].circleFamily == rotationPoints.outer) && !realStandardDirection && isLast) {
            if ((cO.y - background.y) * switchesBeforeFac < switches.outer2inner.left.y && trains[input1].switchCircles != switches.outer2inner.left.turned) {
                trains[input1].switchCircles = !trains[input1].switchCircles;
                cO.state *= -1;
                trains[input1].front.currentCurveFac = getBezierFac(trains[input1].front.currentCurveFac, 5000, 1000, trains[input1].front, !trains[input1].switchCircles ? pointsSwitch : points);
            }
            trains[input1].circleFamily = trains[input1].switchCircles ? null : rotationPoints.outer;
            trains[input1].circle = rotationPoints.outer.narrow;
        }
        else if (realStandardDirection && trains[input1].circleFamily == rotationPoints.inner && isFirst && cO.y - background.y > switches.innerWide.left.y * switchesBeforeFac && ((trains[input1].circle == rotationPoints.inner.wide && !switches.innerWide.left.turned) || (trains[input1].circle == rotationPoints.inner.narrow && switches.innerWide.left.turned))) {
            var pointsAlt = trains[input1].circle == rotationPoints.inner.wide ? { x: [rotationPoints.inner.narrow.x[3] + background.x, rotationPoints.inner.narrow.x[6] + background.x, rotationPoints.inner.narrow.x[7] + background.x, rotationPoints.inner.narrow.x[0] + background.x], y: [rotationPoints.inner.narrow.y[3] + background.y, rotationPoints.inner.narrow.y[6] + background.y, rotationPoints.inner.narrow.y[7] + background.y, rotationPoints.inner.narrow.y[0] + background.y] } : { x: [rotationPoints.inner.wide.x[3] + background.x, rotationPoints.inner.wide.x[6] + background.x, rotationPoints.inner.wide.x[7] + background.x, rotationPoints.inner.wide.x[0] + background.x], y: [rotationPoints.inner.wide.y[3] + background.y, rotationPoints.inner.wide.y[6] + background.y, rotationPoints.inner.wide.y[7] + background.y, rotationPoints.inner.wide.y[0] + background.y] };
            trains[input1].circle = trains[input1].circle == rotationPoints.inner.wide ? rotationPoints.inner.narrow : rotationPoints.inner.wide;
            cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 5000, 1000, cO, pointsAlt);
        }
    }
    else if (cO.state == 110) {
        points = { x: [rotationPoints.inner.sidings.first.x[0] + background.x, rotationPoints.inner.sidings.first.x[1] + background.x, rotationPoints.inner.sidings.first.x[2] + background.x, rotationPoints.inner.sidings.first.x[3] + background.x], y: [rotationPoints.inner.sidings.first.y[0] + background.y, rotationPoints.inner.sidings.first.y[1] + background.y, rotationPoints.inner.sidings.first.y[2] + background.y, rotationPoints.inner.sidings.first.y[3] + background.y] };
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        if (cO.stateChangeLocal) {
            cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 1000, 2100, cO, points, 0.005);
            cO.stateChangeLocal = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.inner.sidings.first.bezierLength);
        if (!realStandardDirection && ((isLast && cO.y - background.y > switches.sidings2.left.y + switchesBeforeAddSidings[0] && !switches.sidings2.left.turned) || (!isLast && leadingBogie.state >= 120))) {
            cO.state = isLast ? (switches.sidings3.left.turned ? 120 : 130) : leadingBogie.state >= 130 ? 130 : 120;
            cO.stateChangeLocal = true;
        }
    }
    else if (cO.state == 111) {
        points = { x: [rotationPoints.inner.sidings.firstS1.x[0] + background.x, rotationPoints.inner.sidings.firstS1.x[1] + background.x], y: [rotationPoints.inner.sidings.firstS1.y[0] + background.y, rotationPoints.inner.sidings.firstS1.y[1] + background.y] };
        if (realStandardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (cO.stateChange) {
            cO.angle = Math.PI;
            cO.stateChange = false;
        }
        setCOPosLinear(points, !realStandardDirection, true);
    }
    else if (cO.state == 112) {
        if (realStandardDirection) {
            trains[input1].endOfTrack = false;
        }
        points = { x: [rotationPoints.inner.sidings.firstS2.x[0] + background.x, rotationPoints.inner.sidings.firstS2.x[1] + background.x, rotationPoints.inner.sidings.firstS2.x[2] + background.x, rotationPoints.inner.sidings.firstS2.x[3] + background.x], y: [rotationPoints.inner.sidings.firstS2.y[0] + background.y, rotationPoints.inner.sidings.firstS2.y[1] + background.y, rotationPoints.inner.sidings.firstS2.y[2] + background.y, rotationPoints.inner.sidings.firstS2.y[3] + background.y] };
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.inner.sidings.firstS2.bezierLength);
    }
    else if (cO.state == 120) {
        points = { x: [rotationPoints.inner.sidings.second.x[0] + background.x, rotationPoints.inner.sidings.second.x[1] + background.x, rotationPoints.inner.sidings.second.x[2] + background.x, rotationPoints.inner.sidings.second.x[3] + background.x], y: [rotationPoints.inner.sidings.second.y[0] + background.y, rotationPoints.inner.sidings.second.y[1] + background.y, rotationPoints.inner.sidings.second.y[2] + background.y, rotationPoints.inner.sidings.second.y[3] + background.y] };
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        if (cO.stateChangeLocal) {
            cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 1000, 2100, cO, points, 0.005);
            cO.stateChangeLocal = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.inner.sidings.second.bezierLength);
        if (!realStandardDirection && ((isLast && cO.y - background.y > switches.sidings2.left.y + switchesBeforeAddSidings[0] && switches.sidings2.left.turned) || (!isLast && leadingBogie.state < 120))) {
            cO.state = 110;
            cO.stateChangeLocal = true;
        }
        else if (!realStandardDirection && ((isLast && cO.y - background.y > switches.sidings3.left.y + switchesBeforeAddSidings[1] && !switches.sidings3.left.turned) || (!isLast && leadingBogie.state >= 130))) {
            cO.state = 130;
            cO.stateChangeLocal = true;
        }
    }
    else if (cO.state == 121) {
        points = { x: [rotationPoints.inner.sidings.secondS1.x[0] + background.x, rotationPoints.inner.sidings.secondS1.x[1] + background.x], y: [rotationPoints.inner.sidings.secondS1.y[0] + background.y, rotationPoints.inner.sidings.secondS1.y[1] + background.y] };
        if (realStandardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (cO.stateChange) {
            cO.angle = Math.PI;
            cO.stateChange = false;
        }
        setCOPosLinear(points, !realStandardDirection, true);
    }
    else if (cO.state == 122) {
        if (realStandardDirection) {
            trains[input1].endOfTrack = false;
        }
        points = { x: [rotationPoints.inner.sidings.secondS2.x[0] + background.x, rotationPoints.inner.sidings.secondS2.x[1] + background.x, rotationPoints.inner.sidings.secondS2.x[2] + background.x, rotationPoints.inner.sidings.secondS2.x[3] + background.x], y: [rotationPoints.inner.sidings.secondS2.y[0] + background.y, rotationPoints.inner.sidings.secondS2.y[1] + background.y, rotationPoints.inner.sidings.secondS2.y[2] + background.y, rotationPoints.inner.sidings.secondS2.y[3] + background.y] };
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.inner.sidings.secondS2.bezierLength);
    }
    else if (cO.state == 130) {
        points = { x: [rotationPoints.inner.sidings.third.x[0] + background.x, rotationPoints.inner.sidings.third.x[1] + background.x, rotationPoints.inner.sidings.third.x[2] + background.x, rotationPoints.inner.sidings.third.x[3] + background.x], y: [rotationPoints.inner.sidings.third.y[0] + background.y, rotationPoints.inner.sidings.third.y[1] + background.y, rotationPoints.inner.sidings.third.y[2] + background.y, rotationPoints.inner.sidings.third.y[3] + background.y] };
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        if (cO.stateChangeLocal) {
            cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 1000, 2100, cO, points, 0.005);
            cO.stateChangeLocal = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.inner.sidings.third.bezierLength);
        if (!realStandardDirection && ((isLast && cO.y - background.y > switches.sidings2.left.y + switchesBeforeAddSidings[0] && switches.sidings2.left.turned) || (!isLast && leadingBogie.state < 120))) {
            cO.state = 110;
            cO.stateChangeLocal = true;
        }
        else if (!realStandardDirection && ((isLast && cO.y - background.y > switches.sidings3.left.y + switchesBeforeAddSidings[1] && switches.sidings3.left.turned) || (!isLast && leadingBogie.state < 130))) {
            cO.state = 120;
            cO.stateChangeLocal = true;
        }
    }
    else if (cO.state == 131) {
        points = { x: [rotationPoints.inner.sidings.thirdS1.x[0] + background.x, rotationPoints.inner.sidings.thirdS1.x[1] + background.x], y: [rotationPoints.inner.sidings.thirdS1.y[0] + background.y, rotationPoints.inner.sidings.thirdS1.y[1] + background.y] };
        if (realStandardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (cO.stateChange) {
            cO.angle = Math.PI;
            cO.stateChange = false;
        }
        setCOPosLinear(points, !realStandardDirection, true);
    }
    else if (cO.state == 132) {
        if (realStandardDirection) {
            trains[input1].endOfTrack = false;
        }
        points = { x: [rotationPoints.inner.sidings.thirdS2.x[0] + background.x, rotationPoints.inner.sidings.thirdS2.x[1] + background.x, rotationPoints.inner.sidings.thirdS2.x[2] + background.x, rotationPoints.inner.sidings.thirdS2.x[3] + background.x], y: [rotationPoints.inner.sidings.thirdS2.y[0] + background.y, rotationPoints.inner.sidings.thirdS2.y[1] + background.y, rotationPoints.inner.sidings.thirdS2.y[2] + background.y, rotationPoints.inner.sidings.thirdS2.y[3] + background.y] };
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.inner.sidings.thirdS2.bezierLength);
    }
    else if (cO.state == 210) {
        points = { x: [rotationPoints.outer.rightSiding.enter.x[0] + background.x, rotationPoints.outer.rightSiding.enter.x[1] + background.x], y: [rotationPoints.outer.rightSiding.enter.y[0] + background.y, rotationPoints.outer.rightSiding.enter.y[1] + background.y] };
        if (realStandardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (cO.stateChange) {
            cO.stateChange = false;
        }
        setCOPosLinear(points, !realStandardDirection, true);
    }
    else if (cO.state == 211) {
        points = { x: [rotationPoints.outer.rightSiding.curve.x[0] + background.x, rotationPoints.outer.rightSiding.curve.x[1] + background.x, rotationPoints.outer.rightSiding.curve.x[2] + background.x, rotationPoints.outer.rightSiding.curve.x[3] + background.x], y: [rotationPoints.outer.rightSiding.curve.y[0] + background.y, rotationPoints.outer.rightSiding.curve.y[1] + background.y, rotationPoints.outer.rightSiding.curve.y[2] + background.y, rotationPoints.outer.rightSiding.curve.y[3] + background.y] };
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            if (realStandardDirection) {
                cO.currentCurveFac = getBezierFac(0, 2000, 1000, cO, points);
            }
            else {
                cO.currentCurveFac = getBezierFac(1, 2000, 1000, cO, points);
            }
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.outer.rightSiding.curve.bezierLength);
    }
    else if (cO.state == 212) {
        points = { x: [rotationPoints.outer.rightSiding.end.x[0] + background.x, rotationPoints.outer.rightSiding.end.x[1] + background.x], y: [rotationPoints.outer.rightSiding.end.y[0] + background.y, rotationPoints.outer.rightSiding.end.y[1] + background.y] };
        if (realStandardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (cO.stateChange) {
            cO.stateChange = false;
        }
        setCOPosLinear(points, !realStandardDirection, false);
        // Right-hand running: clockwise trains stay on the inner track here; objects follow a leading bogie that is already on the passing track (a train turned while partly on it)
        if (!realStandardDirection && cO.y - background.y <= rotationPoints.outer.rightSidingPassing.diverge.y[0] && leadingBogie.state > 219 && leadingBogie.state < 228) {
            cO.stateChange = true;
            cO.state = 220;
        }
    }
    else if (cO.state == 213) {
        points = { x: [rotationPoints.outer.rightSiding.continueCurve0.x[0] + background.x, rotationPoints.outer.rightSiding.continueCurve0.x[1] + background.x, rotationPoints.outer.rightSiding.continueCurve0.x[2] + background.x, rotationPoints.outer.rightSiding.continueCurve0.x[3] + background.x], y: [rotationPoints.outer.rightSiding.continueCurve0.y[0] + background.y, rotationPoints.outer.rightSiding.continueCurve0.y[1] + background.y, rotationPoints.outer.rightSiding.continueCurve0.y[2] + background.y, rotationPoints.outer.rightSiding.continueCurve0.y[3] + background.y] };
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            if (realStandardDirection) {
                cO.currentCurveFac = getBezierFac(0, 2000, 1000, cO, points);
            }
            else {
                cO.currentCurveFac = getBezierFac(1, 2000, 1000, cO, points);
            }
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.outer.rightSiding.continueCurve0.bezierLength);
    }
    else if (cO.state == 214) {
        points = { x: [rotationPoints.outer.rightSiding.continueLine0.x[0] + background.x, rotationPoints.outer.rightSiding.continueLine0.x[1] + background.x], y: [rotationPoints.outer.rightSiding.continueLine0.y[0] + background.y, rotationPoints.outer.rightSiding.continueLine0.y[1] + background.y] };
        if (realStandardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (cO.stateChange) {
            cO.stateChange = false;
        }
        setCOPosLinear(points, !realStandardDirection, true);
    }
    else if (cO.state == 215) {
        points = { x: [rotationPoints.outer.rightSiding.continueCurve1.x[0] + background.x, rotationPoints.outer.rightSiding.continueCurve1.x[1] + background.x, rotationPoints.outer.rightSiding.continueCurve1.x[2] + background.x, rotationPoints.outer.rightSiding.continueCurve1.x[3] + background.x], y: [rotationPoints.outer.rightSiding.continueCurve1.y[0] + background.y, rotationPoints.outer.rightSiding.continueCurve1.y[1] + background.y, rotationPoints.outer.rightSiding.continueCurve1.y[2] + background.y, rotationPoints.outer.rightSiding.continueCurve1.y[3] + background.y] };
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            if (realStandardDirection) {
                cO.currentCurveFac = 0;
            }
            else {
                cO.currentCurveFac = 1;
            }
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.outer.rightSiding.continueCurve1.bezierLength);
    }
    else if (cO.state == 216) {
        points = { x: [rotationPoints.outer.rightSiding.continueLine1.x[0] + background.x, rotationPoints.outer.rightSiding.continueLine1.x[1] + background.x], y: [rotationPoints.outer.rightSiding.continueLine1.y[0] + background.y, rotationPoints.outer.rightSiding.continueLine1.y[1] + background.y] };
        if (realStandardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (cO.stateChange) {
            cO.stateChange = false;
        }
        setCOPosLinear(points, !realStandardDirection, !realStandardDirection);
    }
    else if (cO.state == 217) {
        points = { x: [rotationPoints.outer.rightSiding.continueCurve2.x[0] + background.x, rotationPoints.outer.rightSiding.continueCurve2.x[1] + background.x, rotationPoints.outer.rightSiding.continueCurve2.x[2] + background.x, rotationPoints.outer.rightSiding.continueCurve2.x[3] + background.x], y: [rotationPoints.outer.rightSiding.continueCurve2.y[0] + background.y, rotationPoints.outer.rightSiding.continueCurve2.y[1] + background.y, rotationPoints.outer.rightSiding.continueCurve2.y[2] + background.y, rotationPoints.outer.rightSiding.continueCurve2.y[3] + background.y] };
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            if (realStandardDirection) {
                cO.currentCurveFac = 0;
            }
            else {
                cO.currentCurveFac = 1;
            }
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.outer.rightSiding.continueCurve2.bezierLength);
    }
    else if (cO.state == 218) {
        points = { x: [rotationPoints.outer.rightSiding.rejoin.x[0] + background.x, rotationPoints.outer.rightSiding.rejoin.x[1] + background.x], y: [rotationPoints.outer.rightSiding.rejoin.y[0] + background.y, rotationPoints.outer.rightSiding.rejoin.y[1] + background.y] };
        if (realStandardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (cO.stateChange) {
            cO.stateChange = false;
        }
        var beforePassingBottom = cO.x - background.x < rotationPoints.outer.rightSidingPassing.merge.x[3];
        setCOPosLinear(points, !realStandardDirection, false);
        // Right-hand running: counterclockwise trains take the passing track; the leading object turns off only when it crosses the junction in this step, the others follow it
        if (realStandardDirection && cO.x - background.x >= rotationPoints.outer.rightSidingPassing.merge.x[3] && ((isFirst && beforePassingBottom) || (leadingBogie.state > 219 && leadingBogie.state < 228))) {
            cO.stateChange = true;
            cO.state = 227;
        }
    }
    else if (cO.state == 220) {
        points = { x: [rotationPoints.outer.rightSidingPassing.diverge.x[0] + background.x, rotationPoints.outer.rightSidingPassing.diverge.x[1] + background.x, rotationPoints.outer.rightSidingPassing.diverge.x[2] + background.x, rotationPoints.outer.rightSidingPassing.diverge.x[3] + background.x], y: [rotationPoints.outer.rightSidingPassing.diverge.y[0] + background.y, rotationPoints.outer.rightSidingPassing.diverge.y[1] + background.y, rotationPoints.outer.rightSidingPassing.diverge.y[2] + background.y, rotationPoints.outer.rightSidingPassing.diverge.y[3] + background.y] };
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.outer.rightSidingPassing.diverge.bezierLength);
    }
    else if (cO.state == 221) {
        points = { x: [rotationPoints.outer.rightSidingPassing.curve0.x[0] + background.x, rotationPoints.outer.rightSidingPassing.curve0.x[1] + background.x, rotationPoints.outer.rightSidingPassing.curve0.x[2] + background.x, rotationPoints.outer.rightSidingPassing.curve0.x[3] + background.x], y: [rotationPoints.outer.rightSidingPassing.curve0.y[0] + background.y, rotationPoints.outer.rightSidingPassing.curve0.y[1] + background.y, rotationPoints.outer.rightSidingPassing.curve0.y[2] + background.y, rotationPoints.outer.rightSidingPassing.curve0.y[3] + background.y] };
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.outer.rightSidingPassing.curve0.bezierLength);
    }
    else if (cO.state == 222) {
        points = { x: [rotationPoints.outer.rightSidingPassing.line0.x[0] + background.x, rotationPoints.outer.rightSidingPassing.line0.x[1] + background.x], y: [rotationPoints.outer.rightSidingPassing.line0.y[0] + background.y, rotationPoints.outer.rightSidingPassing.line0.y[1] + background.y] };
        if (realStandardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (cO.stateChange) {
            cO.stateChange = false;
        }
        setCOPosLinear(points, !realStandardDirection, true);
    }
    else if (cO.state == 223) {
        points = { x: [rotationPoints.outer.rightSidingPassing.curve1.x[0] + background.x, rotationPoints.outer.rightSidingPassing.curve1.x[1] + background.x, rotationPoints.outer.rightSidingPassing.curve1.x[2] + background.x, rotationPoints.outer.rightSidingPassing.curve1.x[3] + background.x], y: [rotationPoints.outer.rightSidingPassing.curve1.y[0] + background.y, rotationPoints.outer.rightSidingPassing.curve1.y[1] + background.y, rotationPoints.outer.rightSidingPassing.curve1.y[2] + background.y, rotationPoints.outer.rightSidingPassing.curve1.y[3] + background.y] };
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.outer.rightSidingPassing.curve1.bezierLength);
    }
    else if (cO.state == 224) {
        points = { x: [rotationPoints.outer.rightSidingPassing.line1.x[0] + background.x, rotationPoints.outer.rightSidingPassing.line1.x[1] + background.x], y: [rotationPoints.outer.rightSidingPassing.line1.y[0] + background.y, rotationPoints.outer.rightSidingPassing.line1.y[1] + background.y] };
        if (realStandardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (cO.stateChange) {
            cO.stateChange = false;
        }
        setCOPosLinear(points, !realStandardDirection, !realStandardDirection);
    }
    else if (cO.state == 225) {
        points = { x: [rotationPoints.outer.rightSidingPassing.curve2.x[0] + background.x, rotationPoints.outer.rightSidingPassing.curve2.x[1] + background.x, rotationPoints.outer.rightSidingPassing.curve2.x[2] + background.x, rotationPoints.outer.rightSidingPassing.curve2.x[3] + background.x], y: [rotationPoints.outer.rightSidingPassing.curve2.y[0] + background.y, rotationPoints.outer.rightSidingPassing.curve2.y[1] + background.y, rotationPoints.outer.rightSidingPassing.curve2.y[2] + background.y, rotationPoints.outer.rightSidingPassing.curve2.y[3] + background.y] };
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.outer.rightSidingPassing.curve2.bezierLength);
    }
    else if (cO.state == 226) {
        points = { x: [rotationPoints.outer.rightSidingPassing.line2.x[0] + background.x, rotationPoints.outer.rightSidingPassing.line2.x[1] + background.x], y: [rotationPoints.outer.rightSidingPassing.line2.y[0] + background.y, rotationPoints.outer.rightSidingPassing.line2.y[1] + background.y] };
        if (realStandardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (cO.stateChange) {
            cO.stateChange = false;
        }
        setCOPosLinear(points, !realStandardDirection, false);
    }
    else if (cO.state == 227) {
        points = { x: [rotationPoints.outer.rightSidingPassing.merge.x[0] + background.x, rotationPoints.outer.rightSidingPassing.merge.x[1] + background.x, rotationPoints.outer.rightSidingPassing.merge.x[2] + background.x, rotationPoints.outer.rightSidingPassing.merge.x[3] + background.x], y: [rotationPoints.outer.rightSidingPassing.merge.y[0] + background.y, rotationPoints.outer.rightSidingPassing.merge.y[1] + background.y, rotationPoints.outer.rightSidingPassing.merge.y[2] + background.y, rotationPoints.outer.rightSidingPassing.merge.y[3] + background.y] };
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.outer.rightSidingPassing.merge.bezierLength);
    }
    else if (cO.state == 310) {
        points = { x: [rotationPoints.outer.upperSiding.sCurve0.x[0] + background.x, rotationPoints.outer.upperSiding.sCurve0.x[1] + background.x, rotationPoints.outer.upperSiding.sCurve0.x[2] + background.x, rotationPoints.outer.upperSiding.sCurve0.x[3] + background.x], y: [rotationPoints.outer.upperSiding.sCurve0.y[0] + background.y, rotationPoints.outer.upperSiding.sCurve0.y[1] + background.y, rotationPoints.outer.upperSiding.sCurve0.y[2] + background.y, rotationPoints.outer.upperSiding.sCurve0.y[3] + background.y], z: [rotationPoints.outer.upperSiding.sCurve0.z[0], rotationPoints.outer.upperSiding.sCurve0.z[1], rotationPoints.outer.upperSiding.sCurve0.z[2], rotationPoints.outer.upperSiding.sCurve0.z[3]] };
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.outer.upperSiding.sCurve0.bezierLength);
    }
    else if (cO.state == 311) {
        points = { x: [rotationPoints.outer.upperSiding.sCurve1.x[0] + background.x, rotationPoints.outer.upperSiding.sCurve1.x[1] + background.x, rotationPoints.outer.upperSiding.sCurve1.x[2] + background.x, rotationPoints.outer.upperSiding.sCurve1.x[3] + background.x], y: [rotationPoints.outer.upperSiding.sCurve1.y[0] + background.y, rotationPoints.outer.upperSiding.sCurve1.y[1] + background.y, rotationPoints.outer.upperSiding.sCurve1.y[2] + background.y, rotationPoints.outer.upperSiding.sCurve1.y[3] + background.y], z: [rotationPoints.outer.upperSiding.sCurve1.z[0], rotationPoints.outer.upperSiding.sCurve1.z[1], rotationPoints.outer.upperSiding.sCurve1.z[2], rotationPoints.outer.upperSiding.sCurve1.z[3]] };
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.outer.upperSiding.sCurve1.bezierLength);
    }
    else if (cO.state == 312) {
        points = { x: [rotationPoints.outer.upperSiding.parallel.x[0] + background.x, rotationPoints.outer.upperSiding.parallel.x[1] + background.x], y: [rotationPoints.outer.upperSiding.parallel.y[0] + background.y, rotationPoints.outer.upperSiding.parallel.y[1] + background.y], z: [rotationPoints.outer.upperSiding.parallel.z[0], rotationPoints.outer.upperSiding.parallel.z[1]] };
        if (!realStandardDirection) {
            points.x.reverse();
            points.y.reverse();
            points.z.reverse();
        }
        if (cO.stateChange) {
            cO.stateChange = false;
        }
        setCOPosLinear(points, !realStandardDirection, false);
    }
    else if (cO.state == 313) {
        points = { x: [rotationPoints.outer.upperSiding.loopCurve0.x[0] + background.x, rotationPoints.outer.upperSiding.loopCurve0.x[1] + background.x, rotationPoints.outer.upperSiding.loopCurve0.x[2] + background.x, rotationPoints.outer.upperSiding.loopCurve0.x[3] + background.x], y: [rotationPoints.outer.upperSiding.loopCurve0.y[0] + background.y, rotationPoints.outer.upperSiding.loopCurve0.y[1] + background.y, rotationPoints.outer.upperSiding.loopCurve0.y[2] + background.y, rotationPoints.outer.upperSiding.loopCurve0.y[3] + background.y], z: [rotationPoints.outer.upperSiding.loopCurve0.z[0], rotationPoints.outer.upperSiding.loopCurve0.z[1], rotationPoints.outer.upperSiding.loopCurve0.z[2], rotationPoints.outer.upperSiding.loopCurve0.z[3]] };
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.outer.upperSiding.loopCurve0.bezierLength);
    }
    else if (cO.state == 314) {
        points = { x: [rotationPoints.outer.upperSiding.pillar.x[0] + background.x, rotationPoints.outer.upperSiding.pillar.x[1] + background.x, rotationPoints.outer.upperSiding.pillar.x[2] + background.x, rotationPoints.outer.upperSiding.pillar.x[3] + background.x], y: [rotationPoints.outer.upperSiding.pillar.y[0] + background.y, rotationPoints.outer.upperSiding.pillar.y[1] + background.y, rotationPoints.outer.upperSiding.pillar.y[2] + background.y, rotationPoints.outer.upperSiding.pillar.y[3] + background.y], z: [rotationPoints.outer.upperSiding.pillar.z[0], rotationPoints.outer.upperSiding.pillar.z[1], rotationPoints.outer.upperSiding.pillar.z[2], rotationPoints.outer.upperSiding.pillar.z[3]] };
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.outer.upperSiding.pillar.bezierLength);
    }
    else if (cO.state == 315) {
        points = { x: [rotationPoints.outer.upperSiding.loopCurve1.x[0] + background.x, rotationPoints.outer.upperSiding.loopCurve1.x[1] + background.x, rotationPoints.outer.upperSiding.loopCurve1.x[2] + background.x, rotationPoints.outer.upperSiding.loopCurve1.x[3] + background.x], y: [rotationPoints.outer.upperSiding.loopCurve1.y[0] + background.y, rotationPoints.outer.upperSiding.loopCurve1.y[1] + background.y, rotationPoints.outer.upperSiding.loopCurve1.y[2] + background.y, rotationPoints.outer.upperSiding.loopCurve1.y[3] + background.y], z: [rotationPoints.outer.upperSiding.loopCurve1.z[0], rotationPoints.outer.upperSiding.loopCurve1.z[1], rotationPoints.outer.upperSiding.loopCurve1.z[2], rotationPoints.outer.upperSiding.loopCurve1.z[3]] };
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.outer.upperSiding.loopCurve1.bezierLength);
    }
    else if (cO.state == 316) {
        points = { x: [rotationPoints.outer.upperSiding.loopCurve2.x[0] + background.x, rotationPoints.outer.upperSiding.loopCurve2.x[1] + background.x, rotationPoints.outer.upperSiding.loopCurve2.x[2] + background.x, rotationPoints.outer.upperSiding.loopCurve2.x[3] + background.x], y: [rotationPoints.outer.upperSiding.loopCurve2.y[0] + background.y, rotationPoints.outer.upperSiding.loopCurve2.y[1] + background.y, rotationPoints.outer.upperSiding.loopCurve2.y[2] + background.y, rotationPoints.outer.upperSiding.loopCurve2.y[3] + background.y], z: [rotationPoints.outer.upperSiding.loopCurve2.z[0], rotationPoints.outer.upperSiding.loopCurve2.z[1], rotationPoints.outer.upperSiding.loopCurve2.z[2], rotationPoints.outer.upperSiding.loopCurve2.z[3]] };
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.outer.upperSiding.loopCurve2.bezierLength);
    }
    else if (cO.state == 317) {
        points = { x: [rotationPoints.outer.upperSiding.loopLine0.x[0] + background.x, rotationPoints.outer.upperSiding.loopLine0.x[1] + background.x], y: [rotationPoints.outer.upperSiding.loopLine0.y[0] + background.y, rotationPoints.outer.upperSiding.loopLine0.y[1] + background.y], z: [rotationPoints.outer.upperSiding.loopLine0.z[0], rotationPoints.outer.upperSiding.loopLine0.z[1]] };
        if (!realStandardDirection) {
            points.x.reverse();
            points.y.reverse();
            points.z.reverse();
        }
        if (cO.stateChange) {
            cO.stateChange = false;
        }
        setCOPosLinear(points, !realStandardDirection, !realStandardDirection);
    }
    else if (cO.state == 318) {
        points = { x: [rotationPoints.outer.upperSiding.loopCurve3.x[0] + background.x, rotationPoints.outer.upperSiding.loopCurve3.x[1] + background.x, rotationPoints.outer.upperSiding.loopCurve3.x[2] + background.x, rotationPoints.outer.upperSiding.loopCurve3.x[3] + background.x], y: [rotationPoints.outer.upperSiding.loopCurve3.y[0] + background.y, rotationPoints.outer.upperSiding.loopCurve3.y[1] + background.y, rotationPoints.outer.upperSiding.loopCurve3.y[2] + background.y, rotationPoints.outer.upperSiding.loopCurve3.y[3] + background.y], z: [rotationPoints.outer.upperSiding.loopCurve3.z[0], rotationPoints.outer.upperSiding.loopCurve3.z[1], rotationPoints.outer.upperSiding.loopCurve3.z[2], rotationPoints.outer.upperSiding.loopCurve3.z[3]] };
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(realStandardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !realStandardDirection, rotationPoints.outer.upperSiding.loopCurve3.bezierLength);
    }
    else if (cO.state == 319) {
        points = { x: [rotationPoints.outer.upperSiding.loopLine1.x[0] + background.x, rotationPoints.outer.upperSiding.loopLine1.x[1] + background.x], y: [rotationPoints.outer.upperSiding.loopLine1.y[0] + background.y, rotationPoints.outer.upperSiding.loopLine1.y[1] + background.y], z: [rotationPoints.outer.upperSiding.loopLine1.z[0], rotationPoints.outer.upperSiding.loopLine1.z[1]] };
        if (!realStandardDirection) {
            points.x.reverse();
            points.y.reverse();
            points.z.reverse();
        }
        if (cO.stateChange) {
            cO.stateChange = false;
        }
        setCOPosLinear(points, !realStandardDirection, true);
    }
}
function setCOPosCorr(cO, isFront, input1, currentObject, i) {
    // Fix car position and angle relative to locomotive
    function getPointsForPosCorr(x, y, angle, height) {
        var xa = [];
        var ya = [];
        xa[0] = x;
        xa[1] = x + (Math.cos(-Math.PI / 2 - angle) * height) / 2;
        xa[2] = x - (Math.cos(-Math.PI / 2 - angle) * height) / 2;
        ya[0] = y;
        ya[1] = y - (Math.sin(-Math.PI / 2 - angle) * height) / 2;
        ya[2] = y + (Math.sin(-Math.PI / 2 - angle) * height) / 2;
        return { x: xa, y: ya };
    }
    var prevCurrentObject = isFront ? (i > 0 ? trains[input1].cars[i - 1] : trains[input1]) : currentObject;
    var prevCO = isFront ? (i > 0 ? trains[input1].cars[i - 1].back : trains[input1].back) : currentObject.front;
    var prevPoints = getPointsForPosCorr(prevCO.x, prevCO.y, prevCO.angle, prevCurrentObject.height);
    var supposedDistance = isFront ? prevCurrentObject.width * prevCurrentObject.bogieDistance + trains[input1].width / trains[input1].margin + currentObject.width * currentObject.bogieDistance : currentObject.width - 2 * currentObject.width * currentObject.bogieDistance;
    var maxRepeatNo = 100;
    var distance;
    var calcAngle = cO.angle;
    if (cO.turned) {
        calcAngle -= Math.PI;
    }
    do {
        var points = getPointsForPosCorr(cO.x, cO.y, calcAngle, currentObject.height);
        distance = Math.min(Math.abs(Math.sqrt(Math.pow(points.x[0] - prevPoints.x[0], 2) + Math.pow(points.y[0] - prevPoints.y[0], 2))), Math.abs(Math.sqrt(Math.pow(points.x[1] - prevPoints.x[1], 2) + Math.pow(points.y[1] - prevPoints.y[1], 2))), Math.abs(Math.sqrt(Math.pow(points.x[2] - prevPoints.x[2], 2) + Math.pow(points.y[2] - prevPoints.y[2], 2))));
        cO.x -= (supposedDistance - distance) * Math.cos(calcAngle);
        cO.y -= (supposedDistance - distance) * Math.sin(calcAngle);
    } while (Math.abs(supposedDistance - distance) > 0.001 && --maxRepeatNo > 0);
}
function setTrainOuterPos(input1) {
    const isFront = trains[input1].standardDirection;
    const carObject = isFront || trains[input1].cars.length == 0 ? trains[input1] : trains[input1].cars[trains[input1].cars.length - 1];
    trains[input1].outerX = carObject.x + Math.cos(carObject.displayAngle) * ((carObject.width * 1.05) / 2) * (isFront ? 1 : -1);
    trains[input1].outerY = carObject.y + Math.sin(carObject.displayAngle) * ((carObject.width * 1.05) / 2) * (isFront ? 1 : -1);
}
function setCurrentObjectDisplayAngle(input1, currentObject) {
    function adjustAngle() {
        while (currentObject.displayAngle < 0) {
            currentObject.displayAngle += Math.PI * 2;
        }
        while (currentObject.displayAngle >= Math.PI * 2) {
            currentObject.displayAngle -= Math.PI * 2;
        }
    }
    if (currentObject.front.state == 1) {
        currentObject.displayAngle = Math.atan((currentObject.front.y - currentObject.back.y) / (currentObject.front.x - currentObject.back.x));
    }
    else if (Math.abs(currentObject.front.state) == 2) {
        currentObject.displayAngle = Math.atan((currentObject.front.y - currentObject.back.y) / (currentObject.front.x - currentObject.back.x));
        if (currentObject.y > background.y + trains[input1].circle.y[1] + (trains[input1].circle.y[2] - trains[input1].circle.y[1]) / 2 && currentObject.displayAngle < 0) {
            currentObject.displayAngle = Math.PI + currentObject.displayAngle;
        }
        if (currentObject.displayAngle < 0 || currentObject.displayAngle > Math.PI || (currentObject.y > background.y + trains[input1].circle.y[1] + (trains[input1].circle.y[2] - trains[input1].circle.y[1]) * 0.75 && currentObject.displayAngle < Math.PI / 2) || (currentObject.y < background.y + trains[input1].circle.y[1] + (trains[input1].circle.y[2] - trains[input1].circle.y[1]) * 0.25 && currentObject.displayAngle > Math.PI / 2)) {
            if (currentObject.y > background.y + trains[input1].circle.y[1] + (trains[input1].circle.y[2] - trains[input1].circle.y[1]) * 0.75) {
                currentObject.displayAngle = Math.PI;
            }
            else if (currentObject.y < background.y + trains[input1].circle.y[1] + (trains[input1].circle.y[2] - trains[input1].circle.y[1]) * 0.25) {
                currentObject.displayAngle = 0;
            }
            else {
                currentObject.displayAngle -= Math.PI;
            }
        }
    }
    else if (Math.abs(currentObject.front.state) == 3) {
        currentObject.displayAngle = Math.PI + Math.atan((currentObject.front.y - currentObject.back.y) / (currentObject.front.x - currentObject.back.x));
    }
    else if (Math.abs(currentObject.front.state) == 4) {
        currentObject.displayAngle = Math.PI + Math.atan((currentObject.front.y - currentObject.back.y) / (currentObject.front.x - currentObject.back.x));
        if (currentObject.y < background.y + trains[input1].circle.y[0] + (trains[input1].circle.y[3] - trains[input1].circle.y[0]) / 2 && currentObject.displayAngle < Math.PI) {
            currentObject.displayAngle = 2 * Math.PI - (Math.PI - currentObject.displayAngle);
        }
        if (currentObject.displayAngle < Math.PI || currentObject.displayAngle > 2 * Math.PI || (currentObject.y > background.y + trains[input1].circle.y[0] + (trains[input1].circle.y[3] - trains[input1].circle.y[0]) * 0.75 && currentObject.displayAngle > 1.5 * Math.PI) || (currentObject.y < background.y + trains[input1].circle.y[0] + (trains[input1].circle.y[3] - trains[input1].circle.y[0]) * 0.25 && currentObject.displayAngle < 1.5 * Math.PI)) {
            if (currentObject.y < background.y + trains[input1].circle.y[0] + (trains[input1].circle.y[3] - trains[input1].circle.y[0]) * 0.25) {
                currentObject.displayAngle = 2 * Math.PI;
            }
            else if (currentObject.y > background.y + trains[input1].circle.y[0] + (trains[input1].circle.y[3] - trains[input1].circle.y[0]) * 0.75) {
                currentObject.displayAngle = Math.PI;
            }
            else {
                currentObject.displayAngle += Math.PI;
            }
        }
        if (currentObject.back.state > 100 && currentObject.back.state < 200) {
            currentObject.displayAngle = Math.PI + Math.atan((currentObject.front.y - currentObject.back.y) / (currentObject.front.x - currentObject.back.x));
        }
    }
    else if (currentObject.front.state > 100 && currentObject.front.state < 200) {
        currentObject.displayAngle = Math.PI + Math.atan((currentObject.front.y - currentObject.back.y) / (currentObject.front.x - currentObject.back.x));
    }
    else if (currentObject.front.state > 200 && currentObject.front.state < 400) {
        // Orientation straight from the bogies, valid for turned objects too
        currentObject.displayAngle = Math.atan2(currentObject.front.y - currentObject.back.y, currentObject.front.x - currentObject.back.x);
    }
    adjustAngle();
    if (!(currentObject.front.state > 200 && currentObject.front.state < 400) && ((currentObject.back.turned && currentObject.front.turned) || (currentObject.back.turned && !currentObject.front.turned && currentObject.back.angle - currentObject.front.angle > 0))) {
        currentObject.displayAngle -= Math.PI;
    }
    adjustAngle();
}
/******************************************
 * Animation functions for load and resize *
 ******************************************/
function placeTrainsAtInitialPositions(trainNumber = -1) {
    trains.forEach(function (train, i) {
        if (trainNumber == -1 || trainNumber == i) {
            train.standardDirection = train.standardDirectionStartValue;
            delete train.standardDirectionStartValue;
            train.endOfTrack = false;
            train.trainTurned = false;
            train.width = train.fac * background.width;
            train.height = train.fac * (trainPics[i].height * (background.width / trainPics[i].width));
            train.move = train.switchCircles = false;
            train.front = { turned: false };
            train.back = { turned: false };
            train.front.state = train.back.state = train.state;
            if (train.margin == undefined) {
                train.margin = trainParams.margin;
            }
            var currentTrainMargin = train.width / train.margin;
            var currentTrainWidth = train.width;
            train.cars.forEach(function (car, j) {
                car.width = car.fac * background.width;
                car.height = car.fac * (trainPics[i].cars[j].height * (background.width / trainPics[i].cars[j].width));
                currentTrainWidth += car.width + currentTrainMargin;
                car.front = { turned: false };
                car.back = { turned: false };
                car.front.state = car.back.state = train.state;
            });
            if (train.state == 1) {
                if (train.circleStartPosDiv == undefined) {
                    train.circleStartPosDiv = 2;
                }
                train.front.angle = train.back.angle = train.displayAngle = Math.asin((train.circle.y[1] - train.circle.y[0]) / (train.circle.x[1] - train.circle.x[0]));
                var hypotenuse = Math.sqrt(Math.pow(train.circle.x[1] - train.circle.x[0], 2) + Math.pow(train.circle.y[1] - train.circle.y[0], 2));
                train.front.x = background.x + train.circle.x[0] + (hypotenuse / train.circleStartPosDiv) * Math.cos(train.displayAngle) + (currentTrainWidth / 2 - train.width * train.bogieDistance) * Math.cos(train.displayAngle);
                train.front.y = background.y + train.circle.y[0] + (hypotenuse / train.circleStartPosDiv) * Math.sin(train.displayAngle) + (currentTrainWidth / 2 - train.width * train.bogieDistance) * Math.sin(train.displayAngle);
                train.back.x = background.x + train.circle.x[0] + (hypotenuse / train.circleStartPosDiv) * Math.cos(train.displayAngle) + (currentTrainWidth / 2 - train.width + train.width * train.bogieDistance) * Math.cos(train.displayAngle);
                train.back.y = background.y + train.circle.y[0] + (hypotenuse / train.circleStartPosDiv) * Math.sin(train.displayAngle) + (currentTrainWidth / 2 - train.width + train.width * train.bogieDistance) * Math.sin(train.displayAngle);
                train.x = background.x + train.circle.x[0] + (hypotenuse / train.circleStartPosDiv) * Math.cos(train.displayAngle) + (currentTrainWidth / 2 - train.width / 2) * Math.cos(train.displayAngle);
                train.y = background.y + train.circle.y[0] + (hypotenuse / train.circleStartPosDiv) * Math.sin(train.displayAngle) + (currentTrainWidth / 2 - train.width / 2) * Math.sin(train.displayAngle);
                for (var j = 0; j < train.cars.length; j++) {
                    train.cars[j].displayAngle = train.displayAngle;
                    train.cars[j].front.angle = train.front.angle;
                    train.cars[j].back.angle = train.back.angle;
                    if (j >= 1) {
                        train.cars[j].front.x = train.cars[j - 1].x - Math.cos(train.cars[j].displayAngle) * (train.cars[j].width * train.bogieDistance + currentTrainMargin + train.cars[j - 1].width / 2);
                        train.cars[j].front.y = train.cars[j - 1].y - Math.sin(train.cars[j].displayAngle) * (train.cars[j].width * train.bogieDistance + currentTrainMargin + train.cars[j - 1].width / 2);
                        train.cars[j].back.x = train.cars[j - 1].x - Math.cos(train.cars[j].displayAngle) * (train.cars[j].width * (1 - train.bogieDistance) + currentTrainMargin + train.cars[j - 1].width / 2);
                        train.cars[j].back.y = train.cars[j - 1].y - Math.sin(train.cars[j].displayAngle) * (train.cars[j].width * (1 - train.bogieDistance) + currentTrainMargin + train.cars[j - 1].width / 2);
                        train.cars[j].x = train.cars[j - 1].x - Math.cos(train.cars[j].displayAngle) * (train.cars[j].width / 2 + currentTrainMargin + train.cars[j - 1].width / 2);
                        train.cars[j].y = train.cars[j - 1].y - Math.sin(train.cars[j].displayAngle) * (train.cars[j].width / 2 + currentTrainMargin + train.cars[j - 1].width / 2);
                    }
                    else {
                        train.cars[j].front.x = train.x - Math.cos(train.cars[j].displayAngle) * (train.cars[j].width * train.bogieDistance + currentTrainMargin + train.width / 2);
                        train.cars[j].front.y = train.y - Math.sin(train.cars[j].displayAngle) * (train.cars[j].width * train.bogieDistance + currentTrainMargin + train.width / 2);
                        train.cars[j].back.x = train.x - Math.cos(train.cars[j].displayAngle) * (train.cars[j].width * (1 - train.bogieDistance) + currentTrainMargin + train.width / 2);
                        train.cars[j].back.y = train.y - Math.sin(train.cars[j].displayAngle) * (train.cars[j].width * (1 - train.bogieDistance) + currentTrainMargin + train.width / 2);
                        train.cars[j].x = train.x - Math.cos(train.cars[j].displayAngle) * (train.cars[j].width / 2 + currentTrainMargin + train.width / 2);
                        train.cars[j].y = train.y - Math.sin(train.cars[j].displayAngle) * (train.cars[j].width / 2 + currentTrainMargin + train.width / 2);
                    }
                }
            }
            else if (train.state == 3) {
                if (train.circleStartPosDiv == undefined) {
                    train.circleStartPosDiv = 2;
                }
                train.front.angle = train.back.angle = train.displayAngle = Math.PI + Math.asin((train.circle.y[2] - train.circle.y[3]) / (train.circle.x[2] - train.circle.x[3]));
                var hypotenuse = Math.sqrt(Math.pow(train.circle.x[2] - train.circle.x[3], 2) + Math.pow(train.circle.y[2] - train.circle.y[3], 2));
                train.front.x = background.x + train.circle.x[2] - (hypotenuse / train.circleStartPosDiv) * Math.cos(train.displayAngle - Math.PI) - (currentTrainWidth / 2 - train.width * train.bogieDistance) * Math.cos(train.displayAngle - Math.PI);
                train.front.y = background.y + train.circle.y[2] - (hypotenuse / train.circleStartPosDiv) * Math.sin(train.displayAngle - Math.PI) - (currentTrainWidth / 2 - train.width * train.bogieDistance) * Math.sin(train.displayAngle - Math.PI);
                train.back.x = background.x + train.circle.x[2] - (hypotenuse / train.circleStartPosDiv) * Math.cos(train.displayAngle - Math.PI) - (currentTrainWidth / 2 - train.width * (1 - train.bogieDistance)) * Math.cos(train.displayAngle - Math.PI);
                train.back.y = background.y + train.circle.y[2] - (hypotenuse / train.circleStartPosDiv) * Math.sin(train.displayAngle - Math.PI) - (currentTrainWidth / 2 - train.width * (1 - train.bogieDistance)) * Math.sin(train.displayAngle - Math.PI);
                train.x = background.x + train.circle.x[2] - (hypotenuse / train.circleStartPosDiv) * Math.cos(train.displayAngle - Math.PI) - (currentTrainWidth / 2 - train.width / 2) * Math.cos(train.displayAngle - Math.PI);
                train.y = background.y + train.circle.y[2] - (hypotenuse / train.circleStartPosDiv) * Math.sin(train.displayAngle - Math.PI) - (currentTrainWidth / 2 - train.width / 2) * Math.sin(train.displayAngle - Math.PI);
                for (var j = 0; j < train.cars.length; j++) {
                    train.cars[j].displayAngle = train.displayAngle;
                    train.cars[j].front.angle = train.front.angle;
                    train.cars[j].back.angle = train.back.angle;
                    if (j >= 1) {
                        train.cars[j].front.x = train.cars[j - 1].x + Math.cos(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width * train.bogieDistance + currentTrainMargin + train.cars[j - 1].width / 2);
                        train.cars[j].front.y = train.cars[j - 1].y + Math.sin(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width * train.bogieDistance + currentTrainMargin + train.cars[j - 1].width / 2);
                        train.cars[j].back.x = train.cars[j - 1].x + Math.cos(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width * (1 - train.bogieDistance) + currentTrainMargin + train.cars[j - 1].width / 2);
                        train.cars[j].back.y = train.cars[j - 1].y + Math.sin(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width * (1 - train.bogieDistance) + currentTrainMargin + train.cars[j - 1].width / 2);
                        train.cars[j].x = train.cars[j - 1].x + Math.cos(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width / 2 + currentTrainMargin + train.cars[j - 1].width / 2);
                        train.cars[j].y = train.cars[j - 1].y + Math.sin(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width / 2 + currentTrainMargin + train.cars[j - 1].width / 2);
                    }
                    else {
                        train.cars[j].front.x = train.x + Math.cos(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width * train.bogieDistance + currentTrainMargin + train.width / 2);
                        train.cars[j].front.y = train.y + Math.sin(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width * train.bogieDistance + currentTrainMargin + train.width / 2);
                        train.cars[j].back.x = train.x + Math.cos(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width * (1 - train.bogieDistance) + currentTrainMargin + train.width / 2);
                        train.cars[j].back.y = train.y + Math.sin(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width * (1 - train.bogieDistance) + currentTrainMargin + train.width / 2);
                        train.cars[j].x = train.x + Math.cos(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width / 2 + currentTrainMargin + train.width / 2);
                        train.cars[j].y = train.y + Math.sin(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width / 2 + currentTrainMargin + train.width / 2);
                    }
                }
            }
            else if (train.state == 314) {
                // In the middle of the pillar track, where it runs on the background: the front bogie from its curve factor, the back bogie the bogie distance behind it
                var bogieDistance = train.width * (1 - 2 * train.bogieDistance);
                var halfBogieDistanceFac = bogieDistance / 2 / rotationPoints.outer.upperSiding.pillar.bezierLength;
                train.front.currentCurveFac = 0.5 + halfBogieDistanceFac;
                setCOPos(train.front, true, i, -1, 1, 1);
                train.back.currentCurveFac = 0.5 - halfBogieDistanceFac;
                train.back.x = train.front.x - Math.cos(train.front.angle) * bogieDistance;
                train.back.y = train.front.y - Math.sin(train.front.angle) * bogieDistance;
                setCOPos(train.back, false, i, -1, 1, 1);
                setCOPosCorr(train.back, false, i, train, -1);
                train.x = (train.front.x + train.back.x) / 2;
                train.y = (train.front.y + train.back.y) / 2;
                setCurrentObjectDisplayAngle(i, train);
            }
            else if ((train.state > 100 && train.state < 200 && train.state % 10 == 1) || (train.state > 200 && train.state < 300 && train.state % 10 == 0)) {
                if (train.circleStartPosDiv == undefined) {
                    train.circleStartPosDiv = 0.9;
                }
                train.front.state = train.state;
                train.back.state = train.state;
                if (train.state < 200) {
                    var sidingID = train.state == 131 ? "thirdS1" : train.state == 121 ? "secondS1" : "firstS1";
                    train.front.angle = train.back.angle = train.displayAngle = Math.PI + Math.asin((rotationPoints.inner.sidings[sidingID].y[1] - rotationPoints.inner.sidings[sidingID].y[0]) / (rotationPoints.inner.sidings[sidingID].x[1] - rotationPoints.inner.sidings[sidingID].x[0]));
                    train.front.x = background.x + rotationPoints.inner.sidings[sidingID].x[0] / train.circleStartPosDiv;
                    train.front.y = background.y + rotationPoints.inner.sidings[sidingID].y[0];
                }
                else {
                    train.front.angle = train.back.angle = train.displayAngle = Math.PI + Math.asin((rotationPoints.outer.rightSiding.enter.y[1] - rotationPoints.outer.rightSiding.enter.y[0]) / (rotationPoints.outer.rightSiding.enter.x[1] - rotationPoints.outer.rightSiding.enter.x[0]));
                    train.front.x = background.x + rotationPoints.outer.rightSiding.enter.x[0] / train.circleStartPosDiv;
                    train.front.y = background.y + rotationPoints.outer.rightSiding.enter.y[0];
                }
                train.back.x = train.front.x + train.width;
                train.back.y = train.front.y;
                setCOPos(train.front, true, i, -1, 1, 1);
                setCOPos(train.back, false, i, -1, 1, 1);
                setCOPosCorr(train.back, false, i, train, -1);
                train.x = (train.front.x + train.back.x) / 2;
                train.y = (train.front.y + train.back.y) / 2;
                setCurrentObjectDisplayAngle(i, train);
                train.front.currentCurveFac = train.back.currentCurveFac = train.state < 200 ? 1 : 0;
                for (var j = 0; j < train.cars.length; j++) {
                    if (j > 0) {
                        train.cars[j].front.state = train.cars[j - 1].back.state;
                        train.cars[j].back.state = train.cars[j - 1].back.state;
                        train.cars[j].front.angle = train.cars[j - 1].back.angle;
                        train.cars[j].front.x = train.cars[j - 1].back.x;
                        train.cars[j].front.y = train.cars[j - 1].back.y;
                        train.cars[j].back.angle = train.cars[j - 1].back.angle;
                        train.cars[j].back.x = train.cars[j - 1].back.x;
                        train.cars[j].back.y = train.cars[j - 1].back.y;
                        train.cars[j].front.currentCurveFac = train.cars[j - 1].back.currentCurveFac;
                        train.cars[j].back.currentCurveFac = train.cars[j - 1].back.currentCurveFac;
                        changeCOSection(train.cars[j].front, true, i, train.cars[j], j, true);
                        changeCOSection(train.cars[j].back, false, i, train.cars[j], j, true);
                        setCOPos(train.cars[j].front, true, i, j, -1, train.cars[j].width * train.cars[j].bogieDistance + currentTrainMargin + train.cars[j - 1].width / 2);
                        setCOPos(train.cars[j].back, false, i, j, -1, train.cars[j].width * (1 - train.cars[j].bogieDistance) + currentTrainMargin + train.cars[j - 1].width / 2);
                    }
                    else {
                        train.cars[j].front.state = train.back.state;
                        train.cars[j].back.state = train.back.state;
                        train.cars[j].front.angle = train.back.angle;
                        train.cars[j].front.x = train.back.x;
                        train.cars[j].front.y = train.back.y;
                        train.cars[j].back.angle = train.back.angle;
                        train.cars[j].back.x = train.back.x;
                        train.cars[j].back.y = train.back.y;
                        train.cars[j].front.currentCurveFac = train.back.currentCurveFac;
                        train.cars[j].back.currentCurveFac = train.back.currentCurveFac;
                        changeCOSection(train.cars[j].front, true, i, train.cars[j], j, true);
                        changeCOSection(train.cars[j].back, false, i, train.cars[j], j, true);
                        setCOPos(train.cars[j].front, true, i, j, -1, train.cars[j].width * train.cars[j].bogieDistance + currentTrainMargin + train.width / 2);
                        setCOPos(train.cars[j].back, false, i, j, -1, train.cars[j].width * (1 - train.cars[j].bogieDistance) + currentTrainMargin + train.width / 2);
                    }
                    setCOPosCorr(train.cars[j].front, true, i, train.cars[j], j);
                    setCOPosCorr(train.cars[j].back, false, i, train.cars[j], j);
                }
                for (var k = 0; k < 2; k++) {
                    for (var j = 0; j < train.cars.length; j++) {
                        if (j > 0) {
                            changeCOSection(train.cars[j].front, true, i, train.cars[j], j, true);
                            changeCOSection(train.cars[j].back, false, i, train.cars[j], j, true);
                            setCOPos(train.cars[j].front, true, i, j, 1, 1);
                            setCOPos(train.cars[j].back, false, i, j, 1, 1);
                        }
                        else {
                            changeCOSection(train.cars[j].front, true, i, train.cars[j], j, true);
                            changeCOSection(train.cars[j].back, false, i, train.cars[j], j, true);
                            setCOPos(train.cars[j].front, true, i, j, 1, 1);
                            setCOPos(train.cars[j].back, false, i, j, 1, 1);
                        }
                        setCOPosCorr(train.cars[j].front, true, i, train.cars[j], j);
                        setCOPosCorr(train.cars[j].back, false, i, train.cars[j], j);
                        train.cars[j].x = (train.cars[j].front.x + train.cars[j].back.x) / 2;
                        train.cars[j].y = (train.cars[j].front.y + train.cars[j].back.y) / 2;
                        setCurrentObjectDisplayAngle(i, train.cars[j]);
                    }
                }
            }
            if (train.state == 1 || train.state == 3) {
                // Like all other start states, the circles' bogies pass through setCOPos once, so that they get everything it sets (e.g. the height); speed 0 keeps the positions computed above
                [train, ...train.cars].forEach(function (object, j) {
                    setCOPos(object.front, true, i, j - 1, 0, 1);
                    setCOPos(object.back, false, i, j - 1, 0, 1);
                });
            }
            delete train.state;
            delete train.circleStartPosDiv;
        }
    });
}
function defineTrainSpeed(train) {
    train.speed = train.speedFac * background.width;
}
function defineTrainParams() {
    function getBezierLength(bezierPoints, repNo) {
        var x = [];
        var y = [];
        var dis = 0;
        for (var i = 0; i <= repNo; i++) {
            x[i] = getBezierPoints(i / repNo, bezierPoints.x[0], bezierPoints.x[1], bezierPoints.x[2], bezierPoints.x[3]);
            y[i] = getBezierPoints(i / repNo, bezierPoints.y[0], bezierPoints.y[1], bezierPoints.y[2], bezierPoints.y[3]);
            if (i > 0) {
                dis += Math.sqrt(Math.pow(Math.abs(x[i - 1] - x[i]), 2) + Math.pow(Math.abs(Math.abs(y[i - 1] - y[i])), 2));
            }
        }
        return dis;
    }
    /////Rotation Points/////
    const repNo = 1000;
    const circles = [];
    var bezierPoints;
    //INNER/NARROW
    rotationPoints.inner.narrow.x[0] = 0.17 * background.width;
    rotationPoints.inner.narrow.x[1] = 0.75 * background.width;
    rotationPoints.inner.narrow.x[2] = 0.78 * background.width;
    rotationPoints.inner.narrow.x[3] = 0.16 * background.width;
    rotationPoints.inner.narrow.x[4] = 0.952 * background.width;
    rotationPoints.inner.narrow.x[5] = 0.962 * background.width;
    rotationPoints.inner.narrow.x[6] = 0.0024 * background.width;
    rotationPoints.inner.narrow.x[7] = -0.025 * background.width;
    rotationPoints.inner.narrow.y[0] = 0.126 * background.height;
    rotationPoints.inner.narrow.y[1] = 0.145 * background.height;
    rotationPoints.inner.narrow.y[2] = 0.823 * background.height;
    rotationPoints.inner.narrow.y[3] = 0.817 * background.height;
    rotationPoints.inner.narrow.y[4] = 0.124 * background.height;
    rotationPoints.inner.narrow.y[5] = 0.856 * background.height;
    rotationPoints.inner.narrow.y[6] = 0.82 * background.height;
    rotationPoints.inner.narrow.y[7] = 0.16 * background.height;
    circles[0] = rotationPoints.inner.narrow;
    //INNER/WIDE
    rotationPoints.inner.wide.x[0] = 0.17 * background.width;
    rotationPoints.inner.wide.x[1] = 0.749 * background.width;
    rotationPoints.inner.wide.x[2] = rotationPoints.inner.narrow.x[2];
    rotationPoints.inner.wide.x[3] = rotationPoints.inner.narrow.x[3];
    rotationPoints.inner.wide.x[4] = 0.94 * background.width;
    rotationPoints.inner.wide.x[5] = 0.97 * background.width;
    rotationPoints.inner.wide.x[6] = 0.0013 * background.width;
    rotationPoints.inner.wide.x[7] = -0.024 * background.width;
    rotationPoints.inner.wide.y[0] = 0.0826 * background.height;
    rotationPoints.inner.wide.y[1] = 0.1 * background.height;
    rotationPoints.inner.wide.y[2] = rotationPoints.inner.narrow.y[2];
    rotationPoints.inner.wide.y[3] = rotationPoints.inner.narrow.y[3];
    rotationPoints.inner.wide.y[4] = 0.082 * background.height;
    rotationPoints.inner.wide.y[5] = 0.847 * background.height;
    rotationPoints.inner.wide.y[6] = 0.822 * background.height;
    rotationPoints.inner.wide.y[7] = 0.13 * background.height;
    circles[1] = rotationPoints.inner.wide;
    switches.innerWide.left.x = 0.044 * background.width;
    switches.innerWide.left.y = 0.34 * background.height;
    switches.innerWide.right.x = 0.9 * background.width;
    switches.innerWide.right.y = 0.356 * background.height;
    //OUTER/NARROW
    rotationPoints.outer.narrow.x[0] = rotationPoints.outer.narrow.x[3] = 0.17 * background.width;
    rotationPoints.outer.narrow.x[1] = 0.77 * background.width;
    rotationPoints.outer.narrow.x[2] = 0.795 * background.width;
    rotationPoints.outer.narrow.x[4] = 0.971 * background.width;
    rotationPoints.outer.narrow.x[5] = 0.994 * background.width;
    rotationPoints.outer.narrow.x[6] = -0.052 * background.width;
    rotationPoints.outer.narrow.x[7] = -0.038 * background.width;
    rotationPoints.outer.narrow.y[0] = 0.013 * background.height;
    rotationPoints.outer.narrow.y[1] = 0.017 * background.height;
    rotationPoints.outer.narrow.y[2] = 0.893 * background.height;
    rotationPoints.outer.narrow.y[3] = 0.882 * background.height;
    rotationPoints.outer.narrow.y[4] = -0.001 * background.height;
    rotationPoints.outer.narrow.y[5] = 0.88 * background.height;
    rotationPoints.outer.narrow.y[6] = 0.905 * background.height;
    rotationPoints.outer.narrow.y[7] = 0.008 * background.height;
    circles[2] = rotationPoints.outer.narrow;
    for (var i = 0; i < circles.length; i++) {
        bezierPoints = { x: [circles[i].x[1], circles[i].x[4], circles[i].x[5], circles[i].x[2]], y: [circles[i].y[1], circles[i].y[4], circles[i].y[5], circles[i].y[2]] };
        circles[i].bezierLength.right = getBezierLength(bezierPoints, repNo);
        bezierPoints = { x: [circles[i].x[3], circles[i].x[6], circles[i].x[7], circles[i].x[0]], y: [circles[i].y[3], circles[i].y[6], circles[i].y[7], circles[i].y[0]] };
        circles[i].bezierLength.left = getBezierLength(bezierPoints, repNo);
    }
    /*------------------------------------------------------------------------------------------------------------------*
     *  0---------------------------------------------------------1                                                     *
     *  -      ___       ___                                      -                                                     *
     *  -     |   \      |   \   ________  _____   _______        -        0-7: required                                *
     *  7    |    \     |    \   | __   |  ||__|  | __   |        4                                                     *
     *  -   |  / \ \   |  / \ \  | |__| |  ||\    | |__| |        -                                                     *
     *  6  |  /   \ \ |  /   \ \ |______|  ||\\   |______|        5           Rotation Points                           *
     *  -  ______________________________________________         -                                                     *
     *  -  _______________________________________________        -                                                     *
     *  3---------------------------------------------------------2                                                     *
     *------------------------------------------------------------------------------------------------------------------*/
    //INNER2OUTER/LEFT
    rotationPoints.inner2outer.left.x[1] = -0.039 * background.width;
    rotationPoints.inner2outer.left.x[2] = -0.038 * background.width;
    rotationPoints.inner2outer.left.y[1] = 0.83 * background.height;
    rotationPoints.inner2outer.left.y[2] = 0.03 * background.height;
    bezierPoints = { x: [rotationPoints.inner.narrow.x[3], rotationPoints.inner2outer.left.x[1], rotationPoints.inner2outer.left.x[2], rotationPoints.outer.narrow.x[0]], y: [rotationPoints.inner.narrow.y[3], rotationPoints.inner2outer.left.y[1], rotationPoints.inner2outer.left.y[2], rotationPoints.outer.narrow.y[0]] };
    rotationPoints.inner2outer.left.bezierLength = getBezierLength(bezierPoints, repNo);
    switches.inner2outer.left.x = 0.087 * background.width;
    switches.inner2outer.left.y = 0.77 * background.height;
    switches.outer2inner.left.x = 0.011 * background.width;
    switches.outer2inner.left.y = 0.465 * background.height;
    //INNER2OUTER/RIGHT
    rotationPoints.inner2outer.right.x[1] = 0.98 * background.width;
    rotationPoints.inner2outer.right.x[2] = 0.986 * background.width;
    rotationPoints.inner2outer.right.y[1] = 0.015 * background.height;
    rotationPoints.inner2outer.right.y[2] = 0.858 * background.height;
    bezierPoints = { x: [rotationPoints.outer.narrow.x[1], rotationPoints.inner2outer.right.x[1], rotationPoints.inner2outer.right.x[2], rotationPoints.inner.narrow.x[2]], y: [rotationPoints.outer.narrow.y[1], rotationPoints.inner2outer.right.y[1], rotationPoints.inner2outer.right.y[2], rotationPoints.inner.narrow.y[2]] };
    rotationPoints.inner2outer.right.bezierLength = getBezierLength(bezierPoints, repNo);
    switches.inner2outer.right.x = 0.85 * background.width;
    switches.inner2outer.right.y = 0.786 * background.height;
    switches.outer2inner.right.x = 0.934 * background.width;
    switches.outer2inner.right.y = 0.505 * background.height;
    /*------------------------------------------------------------------------------------------------------------------*
     *  left--------------------------------------------------right                                                     *
     *  -      ___       ___                                      -                                                     *
     *  -     |   \      |   \   ________  _____   _______        -                                                     *
     *  2    |    \     |    \   | __   |  ||__|  | __   |        1        1-2: required                                *
     *  -   |  / \ \   |  / \ \  | |__| |  ||\    | |__| |        -                                                     *
     *  1  |  /   \ \ |  /   \ \ |______|  ||\\   |______|        2           Rotation Points                           *
     *  -  ______________________________________________         -                                                     *
     *  -  _______________________________________________        -                                                     *
     *  -----------------------------------------------------------                                                     *
     *------------------------------------------------------------------------------------------------------------------*/
    //INNER/SIDINGS/FIRST
    rotationPoints.inner.sidings.first.x[0] = rotationPoints.inner.narrow.x[3];
    rotationPoints.inner.sidings.first.x[1] = 0.26 * background.width;
    rotationPoints.inner.sidings.first.x[2] = 0.22 * background.width;
    rotationPoints.inner.sidings.first.x[3] = 0.3 * background.width;
    rotationPoints.inner.sidings.first.y[0] = rotationPoints.inner.narrow.y[3];
    rotationPoints.inner.sidings.first.y[1] = 0.8 * background.height;
    rotationPoints.inner.sidings.first.y[2] = 0.76 * background.height;
    rotationPoints.inner.sidings.first.y[3] = 0.76 * background.height;
    bezierPoints = { x: [rotationPoints.inner.sidings.first.x[0], rotationPoints.inner.sidings.first.x[1], rotationPoints.inner.sidings.first.x[2], rotationPoints.inner.sidings.first.x[3]], y: [rotationPoints.inner.sidings.first.y[0], rotationPoints.inner.sidings.first.y[1], rotationPoints.inner.sidings.first.y[2], rotationPoints.inner.sidings.first.y[3]] };
    rotationPoints.inner.sidings.first.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.inner.sidings.firstS1.x[0] = rotationPoints.inner.sidings.first.x[3];
    rotationPoints.inner.sidings.firstS1.x[1] = 0.7 * background.width;
    rotationPoints.inner.sidings.firstS1.y[0] = rotationPoints.inner.sidings.firstS1.y[1] = rotationPoints.inner.sidings.first.y[3];
    rotationPoints.inner.sidings.firstS2.x[0] = rotationPoints.inner.sidings.firstS1.x[1];
    rotationPoints.inner.sidings.firstS2.x[1] = 0.823 * background.width;
    rotationPoints.inner.sidings.firstS2.x[2] = 0.84 * background.width;
    rotationPoints.inner.sidings.firstS2.x[3] = 0.86 * background.width;
    rotationPoints.inner.sidings.firstS2.y[0] = rotationPoints.inner.sidings.firstS1.y[1];
    rotationPoints.inner.sidings.firstS2.y[1] = 0.77 * background.height;
    rotationPoints.inner.sidings.firstS2.y[2] = 0.569 * background.height;
    rotationPoints.inner.sidings.firstS2.y[3] = 0.5 * background.height;
    bezierPoints = { x: [rotationPoints.inner.sidings.firstS2.x[0], rotationPoints.inner.sidings.firstS2.x[1], rotationPoints.inner.sidings.firstS2.x[2], rotationPoints.inner.sidings.firstS2.x[3]], y: [rotationPoints.inner.sidings.firstS2.y[0], rotationPoints.inner.sidings.firstS2.y[1], rotationPoints.inner.sidings.firstS2.y[2], rotationPoints.inner.sidings.firstS2.y[3]] };
    rotationPoints.inner.sidings.firstS2.bezierLength = getBezierLength(bezierPoints, repNo);
    //INNER/SIDINGS/SECOND
    rotationPoints.inner.sidings.second.x[0] = rotationPoints.inner.narrow.x[3];
    rotationPoints.inner.sidings.second.x[1] = 0.25 * background.width;
    rotationPoints.inner.sidings.second.x[2] = 0.3 * background.width;
    rotationPoints.inner.sidings.second.x[3] = 0.355 * background.width;
    rotationPoints.inner.sidings.second.y[0] = rotationPoints.inner.narrow.y[3];
    rotationPoints.inner.sidings.second.y[1] = 0.802 * background.height;
    rotationPoints.inner.sidings.second.y[2] = 0.71 * background.height;
    rotationPoints.inner.sidings.second.y[3] = 0.695 * background.height;
    bezierPoints = { x: [rotationPoints.inner.sidings.second.x[0], rotationPoints.inner.sidings.second.x[1], rotationPoints.inner.sidings.second.x[2], rotationPoints.inner.sidings.second.x[3]], y: [rotationPoints.inner.sidings.second.y[0], rotationPoints.inner.sidings.second.y[1], rotationPoints.inner.sidings.second.y[2], rotationPoints.inner.sidings.second.y[3]] };
    rotationPoints.inner.sidings.second.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.inner.sidings.secondS1.x[0] = rotationPoints.inner.sidings.second.x[3];
    rotationPoints.inner.sidings.secondS1.x[1] = 0.7 * background.width;
    rotationPoints.inner.sidings.secondS1.y[0] = rotationPoints.inner.sidings.secondS1.y[1] = rotationPoints.inner.sidings.second.y[3];
    rotationPoints.inner.sidings.secondS2.x[0] = rotationPoints.inner.sidings.secondS1.x[1];
    rotationPoints.inner.sidings.secondS2.x[1] = 0.799 * background.width;
    rotationPoints.inner.sidings.secondS2.x[2] = 0.819 * background.width;
    rotationPoints.inner.sidings.secondS2.x[3] = 0.845 * background.width;
    rotationPoints.inner.sidings.secondS2.y[0] = rotationPoints.inner.sidings.secondS1.y[1];
    rotationPoints.inner.sidings.secondS2.y[1] = 0.674 * background.height;
    rotationPoints.inner.sidings.secondS2.y[2] = 0.543 * background.height;
    rotationPoints.inner.sidings.secondS2.y[3] = 0.41 * background.height;
    bezierPoints = { x: [rotationPoints.inner.sidings.secondS2.x[0], rotationPoints.inner.sidings.secondS2.x[1], rotationPoints.inner.sidings.secondS2.x[2], rotationPoints.inner.sidings.secondS2.x[3]], y: [rotationPoints.inner.sidings.secondS2.y[0], rotationPoints.inner.sidings.secondS2.y[1], rotationPoints.inner.sidings.secondS2.y[2], rotationPoints.inner.sidings.secondS2.y[3]] };
    rotationPoints.inner.sidings.secondS2.bezierLength = getBezierLength(bezierPoints, repNo);
    //INNER/SIDINGS/THIRD
    rotationPoints.inner.sidings.third.x[0] = rotationPoints.inner.narrow.x[3];
    rotationPoints.inner.sidings.third.x[1] = 0.269 * background.width;
    rotationPoints.inner.sidings.third.x[2] = 0.35 * background.width;
    rotationPoints.inner.sidings.third.x[3] = 0.45 * background.width;
    rotationPoints.inner.sidings.third.y[0] = rotationPoints.inner.narrow.y[3];
    rotationPoints.inner.sidings.third.y[1] = 0.81 * background.height;
    rotationPoints.inner.sidings.third.y[2] = 0.627 * background.height;
    rotationPoints.inner.sidings.third.y[3] = 0.639 * background.height;
    bezierPoints = { x: [rotationPoints.inner.sidings.third.x[0], rotationPoints.inner.sidings.third.x[1], rotationPoints.inner.sidings.third.x[2], rotationPoints.inner.sidings.third.x[3]], y: [rotationPoints.inner.sidings.third.y[0], rotationPoints.inner.sidings.third.y[1], rotationPoints.inner.sidings.third.y[2], rotationPoints.inner.sidings.third.y[3]] };
    rotationPoints.inner.sidings.third.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.inner.sidings.thirdS1.x[0] = rotationPoints.inner.sidings.third.x[3];
    rotationPoints.inner.sidings.thirdS1.x[1] = 0.65 * background.width;
    rotationPoints.inner.sidings.thirdS1.y[0] = rotationPoints.inner.sidings.thirdS1.y[1] = rotationPoints.inner.sidings.third.y[3];
    rotationPoints.inner.sidings.thirdS2.x[0] = rotationPoints.inner.sidings.thirdS1.x[1];
    rotationPoints.inner.sidings.thirdS2.x[1] = 0.781 * background.width;
    rotationPoints.inner.sidings.thirdS2.x[2] = 0.81 * background.width;
    rotationPoints.inner.sidings.thirdS2.x[3] = 0.804 * background.width;
    rotationPoints.inner.sidings.thirdS2.y[0] = rotationPoints.inner.sidings.thirdS1.y[1];
    rotationPoints.inner.sidings.thirdS2.y[1] = 0.653 * background.height;
    rotationPoints.inner.sidings.thirdS2.y[2] = 0.35 * background.height;
    rotationPoints.inner.sidings.thirdS2.y[3] = 0.36 * background.height;
    bezierPoints = { x: [rotationPoints.inner.sidings.thirdS2.x[0], rotationPoints.inner.sidings.thirdS2.x[1], rotationPoints.inner.sidings.thirdS2.x[2], rotationPoints.inner.sidings.thirdS2.x[3]], y: [rotationPoints.inner.sidings.thirdS2.y[0], rotationPoints.inner.sidings.thirdS2.y[1], rotationPoints.inner.sidings.thirdS2.y[2], rotationPoints.inner.sidings.thirdS2.y[3]] };
    rotationPoints.inner.sidings.thirdS2.bezierLength = getBezierLength(bezierPoints, repNo);
    switches.sidings1.left.x = rotationPoints.inner.narrow.x[3];
    switches.sidings1.left.y = 0.82 * background.height;
    switches.sidings2.left.x = 0.25 * background.width;
    switches.sidings2.left.y = 0.77 * background.height;
    switches.sidings3.left.x = 0.33 * background.width;
    switches.sidings3.left.y = 0.7 * background.height;
    /*------------------------------------------------------------------------------------------------------------------*
     *  -----------------------------------------------------------                                                     *
     *  -    Sidings:                                             -                                                     *
     *  -         States per Track:                               -   State % 10 == 0: BezierCurve From Main Track      *
     *  -                                .                        -   State % 10 == 1: Linear Siding Track              *
     *  -   ____________________________/  . Third: 130-132       -   State % 10 == 2: BezierCurve End of Siding Track  *
     *  -  /______________________________/  . Second: 120-122    -                                                     *
     *  - /_________________________________/    First: 110-112   -                                                     *
     *  -/                                                        -                                                     *
     *  -----------------------------------------------------------                                                     *
     *------------------------------------------------------------------------------------------------------------------*/
    //OUTER/ALTSTATE3
    switches.outerAltState3.left.x = 0.194 * background.width;
    switches.outerAltState3.left.y = 0.886 * background.height;
    switches.outerAltState3.right.x = 0.77 * background.width;
    switches.outerAltState3.right.y = 0.89 * background.height;
    rotationPoints.outer.altState3.right.x[0] = rotationPoints.outer.narrow.x[2];
    rotationPoints.outer.altState3.right.x[1] = 0.64 * background.width;
    rotationPoints.outer.altState3.right.x[2] = rotationPoints.outer.altState3.right.x[0] - (rotationPoints.outer.altState3.right.x[0] - rotationPoints.outer.altState3.right.x[1]) / 2;
    rotationPoints.outer.altState3.right.x[3] = rotationPoints.outer.altState3.right.x[0] - (rotationPoints.outer.altState3.right.x[0] - rotationPoints.outer.altState3.right.x[1]) / 4;
    rotationPoints.outer.altState3.right.x[4] = rotationPoints.outer.altState3.right.x[1] + (rotationPoints.outer.altState3.right.x[0] - rotationPoints.outer.altState3.right.x[1]) / 4;
    rotationPoints.outer.altState3.right.y[0] = rotationPoints.outer.narrow.y[2];
    rotationPoints.outer.altState3.right.y[1] = 0.957 * background.height;
    rotationPoints.outer.altState3.right.y[2] = rotationPoints.outer.altState3.right.y[0] + (rotationPoints.outer.altState3.right.y[1] - rotationPoints.outer.altState3.right.y[0]) / 2;
    rotationPoints.outer.altState3.right.y[3] = rotationPoints.outer.altState3.right.y[0] + (rotationPoints.outer.altState3.right.y[1] - rotationPoints.outer.altState3.right.y[0]) / 8;
    rotationPoints.outer.altState3.right.y[4] = rotationPoints.outer.altState3.right.y[1] - (rotationPoints.outer.altState3.right.y[1] - rotationPoints.outer.altState3.right.y[0]) / 8;
    rotationPoints.outer.altState3.left.x[0] = rotationPoints.outer.narrow.x[3];
    rotationPoints.outer.altState3.left.x[1] = 0.289 * background.width;
    rotationPoints.outer.altState3.left.x[2] = rotationPoints.outer.altState3.left.x[0] + (rotationPoints.outer.altState3.left.x[1] - rotationPoints.outer.altState3.left.x[0]) / 2;
    rotationPoints.outer.altState3.left.x[3] = rotationPoints.outer.altState3.left.x[0] + (rotationPoints.outer.altState3.left.x[1] - rotationPoints.outer.altState3.left.x[0]) / 4;
    rotationPoints.outer.altState3.left.x[4] = rotationPoints.outer.altState3.left.x[1] - (rotationPoints.outer.altState3.left.x[1] - rotationPoints.outer.altState3.left.x[0]) / 4;
    rotationPoints.outer.altState3.left.y[0] = rotationPoints.outer.narrow.y[3];
    rotationPoints.outer.altState3.left.y[1] = 0.95 * background.height;
    rotationPoints.outer.altState3.left.y[2] = rotationPoints.outer.altState3.left.y[0] + (rotationPoints.outer.altState3.left.y[1] - rotationPoints.outer.altState3.left.y[0]) / 2;
    rotationPoints.outer.altState3.left.y[3] = rotationPoints.outer.altState3.left.y[0] + (rotationPoints.outer.altState3.left.y[1] - rotationPoints.outer.altState3.left.y[0]) / 8;
    rotationPoints.outer.altState3.left.y[4] = rotationPoints.outer.altState3.left.y[1] - (rotationPoints.outer.altState3.left.y[1] - rotationPoints.outer.altState3.left.y[0]) / 8;
    bezierPoints = { x: [rotationPoints.outer.altState3.right.x[0], rotationPoints.outer.altState3.right.x[3], rotationPoints.outer.altState3.right.x[3], rotationPoints.outer.altState3.right.x[2]], y: [rotationPoints.outer.altState3.right.y[0], rotationPoints.outer.altState3.right.y[3], rotationPoints.outer.altState3.right.y[3], rotationPoints.outer.altState3.right.y[2]] };
    var templenright = getBezierLength(bezierPoints, 100);
    bezierPoints = { x: [rotationPoints.outer.altState3.right.x[2], rotationPoints.outer.altState3.right.x[4], rotationPoints.outer.altState3.right.x[4], rotationPoints.outer.altState3.right.x[1]], y: [rotationPoints.outer.altState3.right.y[2], rotationPoints.outer.altState3.right.y[4], rotationPoints.outer.altState3.right.y[4], rotationPoints.outer.altState3.right.y[1]] };
    rotationPoints.outer.altState3.right.bezierLength = templenright + getBezierLength(bezierPoints, 100);
    bezierPoints = { x: [rotationPoints.outer.altState3.left.x[0], rotationPoints.outer.altState3.left.x[3], rotationPoints.outer.altState3.left.x[3], rotationPoints.outer.altState3.left.x[2]], y: [rotationPoints.outer.altState3.left.y[0], rotationPoints.outer.altState3.left.y[3], rotationPoints.outer.altState3.left.y[3], rotationPoints.outer.altState3.left.y[2]] };
    var templenleft = getBezierLength(bezierPoints, 100);
    bezierPoints = { x: [rotationPoints.outer.altState3.left.x[2], rotationPoints.outer.altState3.left.x[4], rotationPoints.outer.altState3.left.x[4], rotationPoints.outer.altState3.left.x[1]], y: [rotationPoints.outer.altState3.left.y[2], rotationPoints.outer.altState3.left.y[4], rotationPoints.outer.altState3.left.y[4], rotationPoints.outer.altState3.left.y[1]] };
    rotationPoints.outer.altState3.left.bezierLength = templenleft + getBezierLength(bezierPoints, 100);
    /*------------------------------------------------------------------------------------------------------------------*
     *  -----------------------------------------------------------                                                     *
     *  -      ___       ___                                      -                                                     *
     *  -     |   \      |   \   ________  _____   _______        -                                                     *
     *  -    |    \     |    \   | __   |  ||__|  | __   |        -        0-4: required                                *
     *  -   |  / \ \   |  / \ \  | |__| |  ||\    | |__| |        -                                                     *
     *  -  |  /   \ \ |  /   \ \ |______|  ||\\   |______|        -           Rotation Points                           *
     *  -  ______________________________________________         -                                                     *
     *  - 3_3__4_4________________________________________4 4 3 3 -                                                     *
     *  0----2----1-------------------------------------1----2----0                                                     *
     *------------------------------------------------------------------------------------------------------------------*/
    //OUTER/RIGHTSIDING
    switches.outerRightSiding.left.x = rotationPoints.outer.altState3.right.x[1];
    switches.outerRightSiding.left.y = rotationPoints.outer.altState3.right.y[1];
    rotationPoints.outer.rightSiding.enter.x[0] = rotationPoints.outer.altState3.right.x[1];
    rotationPoints.outer.rightSiding.enter.x[1] = rotationPoints.outer.rightSiding.enter.x[0] + background.width * 0.18;
    rotationPoints.outer.rightSiding.enter.y[0] = rotationPoints.outer.altState3.right.y[1];
    rotationPoints.outer.rightSiding.enter.y[1] = rotationPoints.outer.rightSiding.enter.y[0] + background.height * 0.0073;
    switches.outerRightSidingTurn.left.x = rotationPoints.outer.rightSiding.enter.x[1];
    switches.outerRightSidingTurn.left.y = rotationPoints.outer.rightSiding.enter.y[1];
    rotationPoints.outer.rightSiding.curve.x[0] = rotationPoints.outer.rightSiding.enter.x[1];
    rotationPoints.outer.rightSiding.curve.x[1] = 0.89 * background.width;
    rotationPoints.outer.rightSiding.curve.x[2] = 0.967 * background.width;
    rotationPoints.outer.rightSiding.curve.x[3] = rotationPoints.outer.rightSiding.curve.x[0] + 0.137 * background.width;
    rotationPoints.outer.rightSiding.curve.y[0] = rotationPoints.outer.rightSiding.enter.y[1];
    rotationPoints.outer.rightSiding.curve.y[1] = rotationPoints.outer.rightSiding.curve.y[0] + 0.005 * background.height;
    rotationPoints.outer.rightSiding.curve.y[2] = rotationPoints.outer.rightSiding.curve.y[0] - 0.11 * background.height;
    rotationPoints.outer.rightSiding.curve.y[3] = rotationPoints.outer.rightSiding.curve.y[0] - 0.39 * background.height;
    bezierPoints = { x: [rotationPoints.outer.rightSiding.curve.x[0], rotationPoints.outer.rightSiding.curve.x[1], rotationPoints.outer.rightSiding.curve.x[2], rotationPoints.outer.rightSiding.curve.x[3]], y: [rotationPoints.outer.rightSiding.curve.y[0], rotationPoints.outer.rightSiding.curve.y[1], rotationPoints.outer.rightSiding.curve.y[2], rotationPoints.outer.rightSiding.curve.y[3]] };
    rotationPoints.outer.rightSiding.curve.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.outer.rightSiding.end.x[0] = rotationPoints.outer.rightSiding.curve.x[3];
    rotationPoints.outer.rightSiding.end.x[1] = rotationPoints.outer.rightSiding.end.x[0] - 0.015 * background.width;
    rotationPoints.outer.rightSiding.end.y[0] = rotationPoints.outer.rightSiding.curve.y[3];
    rotationPoints.outer.rightSiding.end.y[1] = rotationPoints.outer.rightSiding.end.y[0] - 0.85 * background.height;
    // The two top corners' control points lie on the adjoining straights; their distances make each corner's tightest spot as wide as possible
    var rightSidingEndLength = Math.hypot(rotationPoints.outer.rightSiding.end.x[1] - rotationPoints.outer.rightSiding.end.x[0], rotationPoints.outer.rightSiding.end.y[1] - rotationPoints.outer.rightSiding.end.y[0]);
    rotationPoints.outer.rightSiding.continueCurve0.x[0] = rotationPoints.outer.rightSiding.end.x[1];
    rotationPoints.outer.rightSiding.continueCurve0.x[3] = rotationPoints.outer.rightSiding.continueCurve0.x[0] + 0.15 * background.width;
    rotationPoints.outer.rightSiding.continueCurve0.y[0] = rotationPoints.outer.rightSiding.end.y[1];
    rotationPoints.outer.rightSiding.continueCurve0.y[3] = rotationPoints.outer.rightSiding.continueCurve0.y[0] - 0.21 * background.height;
    rotationPoints.outer.rightSiding.continueCurve0.x[1] = rotationPoints.outer.rightSiding.continueCurve0.x[0] + (0.1116 * background.width * (rotationPoints.outer.rightSiding.end.x[1] - rotationPoints.outer.rightSiding.end.x[0])) / rightSidingEndLength;
    rotationPoints.outer.rightSiding.continueCurve0.y[1] = rotationPoints.outer.rightSiding.continueCurve0.y[0] + (0.1116 * background.width * (rotationPoints.outer.rightSiding.end.y[1] - rotationPoints.outer.rightSiding.end.y[0])) / rightSidingEndLength;
    rotationPoints.outer.rightSiding.continueCurve0.x[2] = rotationPoints.outer.rightSiding.continueCurve0.x[3] - 0.033 * background.width;
    rotationPoints.outer.rightSiding.continueCurve0.y[2] = rotationPoints.outer.rightSiding.continueCurve0.y[3];
    bezierPoints = { x: [rotationPoints.outer.rightSiding.continueCurve0.x[0], rotationPoints.outer.rightSiding.continueCurve0.x[1], rotationPoints.outer.rightSiding.continueCurve0.x[2], rotationPoints.outer.rightSiding.continueCurve0.x[3]], y: [rotationPoints.outer.rightSiding.continueCurve0.y[0], rotationPoints.outer.rightSiding.continueCurve0.y[1], rotationPoints.outer.rightSiding.continueCurve0.y[2], rotationPoints.outer.rightSiding.continueCurve0.y[3]] };
    rotationPoints.outer.rightSiding.continueCurve0.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.outer.rightSiding.continueLine0.x[0] = rotationPoints.outer.rightSiding.continueCurve0.x[3];
    rotationPoints.outer.rightSiding.continueLine0.x[1] = rotationPoints.outer.rightSiding.continueCurve0.x[3] + 0.2 * background.width;
    rotationPoints.outer.rightSiding.continueLine0.y[0] = rotationPoints.outer.rightSiding.continueCurve0.y[3];
    rotationPoints.outer.rightSiding.continueLine0.y[1] = rotationPoints.outer.rightSiding.continueCurve0.y[3];
    rotationPoints.outer.rightSiding.continueCurve1.x[0] = rotationPoints.outer.rightSiding.continueLine0.x[1];
    rotationPoints.outer.rightSiding.continueCurve1.x[3] = rotationPoints.outer.rightSiding.continueCurve1.x[0] + 0.15 * background.width;
    rotationPoints.outer.rightSiding.continueCurve1.y[0] = rotationPoints.outer.rightSiding.continueLine0.y[1];
    rotationPoints.outer.rightSiding.continueCurve1.y[3] = rotationPoints.outer.rightSiding.continueCurve1.y[0] + 0.2 * background.height;
    rotationPoints.outer.rightSiding.continueCurve1.x[1] = rotationPoints.outer.rightSiding.continueCurve1.x[0] + 0.0268 * background.width;
    rotationPoints.outer.rightSiding.continueCurve1.y[1] = rotationPoints.outer.rightSiding.continueCurve1.y[0];
    rotationPoints.outer.rightSiding.continueCurve1.x[2] = rotationPoints.outer.rightSiding.continueCurve1.x[3];
    rotationPoints.outer.rightSiding.continueCurve1.y[2] = rotationPoints.outer.rightSiding.continueCurve1.y[3] - 0.0967 * background.width;
    bezierPoints = { x: [rotationPoints.outer.rightSiding.continueCurve1.x[0], rotationPoints.outer.rightSiding.continueCurve1.x[1], rotationPoints.outer.rightSiding.continueCurve1.x[2], rotationPoints.outer.rightSiding.continueCurve1.x[3]], y: [rotationPoints.outer.rightSiding.continueCurve1.y[0], rotationPoints.outer.rightSiding.continueCurve1.y[1], rotationPoints.outer.rightSiding.continueCurve1.y[2], rotationPoints.outer.rightSiding.continueCurve1.y[3]] };
    rotationPoints.outer.rightSiding.continueCurve1.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.outer.rightSiding.continueLine1.x[0] = rotationPoints.outer.rightSiding.continueCurve1.x[3];
    rotationPoints.outer.rightSiding.continueLine1.x[1] = rotationPoints.outer.rightSiding.continueLine1.x[0];
    rotationPoints.outer.rightSiding.continueLine1.y[0] = rotationPoints.outer.rightSiding.continueCurve1.y[3];
    rotationPoints.outer.rightSiding.continueLine1.y[1] = rotationPoints.outer.rightSiding.continueLine1.y[0] + 0.9 * background.height;
    rotationPoints.outer.rightSiding.continueCurve2.x[0] = rotationPoints.outer.rightSiding.continueLine1.x[1];
    rotationPoints.outer.rightSiding.continueCurve2.x[1] = rotationPoints.outer.rightSiding.continueCurve2.x[0] + 0.0 * background.width;
    rotationPoints.outer.rightSiding.continueCurve2.x[2] = rotationPoints.outer.rightSiding.continueCurve2.x[0] + 0.02 * background.width;
    rotationPoints.outer.rightSiding.continueCurve2.x[3] = rotationPoints.outer.rightSiding.continueCurve1.x[0];
    rotationPoints.outer.rightSiding.continueCurve2.y[0] = rotationPoints.outer.rightSiding.continueLine1.y[1];
    rotationPoints.outer.rightSiding.continueCurve2.y[1] = rotationPoints.outer.rightSiding.continueCurve2.y[0] + 0.21 * background.height;
    rotationPoints.outer.rightSiding.continueCurve2.y[2] = rotationPoints.outer.rightSiding.continueCurve2.y[0] + 0.37 * background.height;
    rotationPoints.outer.rightSiding.continueCurve2.y[3] = rotationPoints.outer.rightSiding.curve.y[0];
    bezierPoints = { x: [rotationPoints.outer.rightSiding.continueCurve2.x[0], rotationPoints.outer.rightSiding.continueCurve2.x[1], rotationPoints.outer.rightSiding.continueCurve2.x[2], rotationPoints.outer.rightSiding.continueCurve2.x[3]], y: [rotationPoints.outer.rightSiding.continueCurve2.y[0], rotationPoints.outer.rightSiding.continueCurve2.y[1], rotationPoints.outer.rightSiding.continueCurve2.y[2], rotationPoints.outer.rightSiding.continueCurve2.y[3]] };
    rotationPoints.outer.rightSiding.continueCurve2.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.outer.rightSiding.rejoin.x[0] = rotationPoints.outer.rightSiding.continueCurve2.x[3];
    rotationPoints.outer.rightSiding.rejoin.x[1] = rotationPoints.outer.rightSiding.enter.x[1];
    rotationPoints.outer.rightSiding.rejoin.y[0] = rotationPoints.outer.rightSiding.continueCurve2.y[3];
    rotationPoints.outer.rightSiding.rejoin.y[1] = rotationPoints.outer.rightSiding.enter.y[1];
    /*------------------------------------------------------------------------------------------------------------------*
     *  -----------------------------------------------------------                                                     *
     *  -      ___       ___                                      -                                                     *
     *  -     |   \      |   \   ________  _____   _______        -                                                     *
     *  -    |    \     |    \   | __   |  ||__|  | __   |        -        all  required                                *
     *  -   |  / \ \   |  / \ \  | |__| |  ||\    | |__| |        -                                                     *
     *  -  |  /   \ \ |  /   \ \ |______|  ||\\   |______|        -           Rotation Points                           *
     *  -  ______________________________________________         -                                                     *
     *  - ________________________________________________________-                                                     *
     *  -----------------------------------------------------------                                                     *
     *------------------------------------------------------------------------------------------------------------------*/
    //OUTER/UPPERSIDING
    var outerTopAngle = Math.atan((rotationPoints.outer.narrow.y[1] - rotationPoints.outer.narrow.y[0]) / (rotationPoints.outer.narrow.x[1] - rotationPoints.outer.narrow.x[0]));
    var sCurveRadius0 = 0.199 * background.width;
    var sCurveRadius1 = 0.12 * background.width;
    var sCurveAngle = Math.acos(1 - (0.329 * background.height) / (sCurveRadius0 + sCurveRadius1));
    var sCurveControl0 = (4 / 3) * Math.tan(sCurveAngle / 4) * sCurveRadius0;
    var sCurveControl1 = (4 / 3) * Math.tan(sCurveAngle / 4) * sCurveRadius1;
    rotationPoints.outer.upperSiding.sCurve0.x[0] = 0.577 * background.width;
    rotationPoints.outer.upperSiding.sCurve0.y[0] = rotationPoints.outer.narrow.y[0] + (rotationPoints.outer.upperSiding.sCurve0.x[0] - rotationPoints.outer.narrow.x[0]) * Math.tan(outerTopAngle);
    rotationPoints.outer.upperSiding.sCurve0.x[3] = rotationPoints.outer.upperSiding.sCurve0.x[0] + sCurveRadius0 * (Math.sin(outerTopAngle) - Math.sin(outerTopAngle - sCurveAngle));
    rotationPoints.outer.upperSiding.sCurve0.y[3] = rotationPoints.outer.upperSiding.sCurve0.y[0] + sCurveRadius0 * (Math.cos(outerTopAngle - sCurveAngle) - Math.cos(outerTopAngle));
    rotationPoints.outer.upperSiding.sCurve0.x[1] = rotationPoints.outer.upperSiding.sCurve0.x[0] + sCurveControl0 * Math.cos(outerTopAngle);
    rotationPoints.outer.upperSiding.sCurve0.y[1] = rotationPoints.outer.upperSiding.sCurve0.y[0] + sCurveControl0 * Math.sin(outerTopAngle);
    rotationPoints.outer.upperSiding.sCurve0.x[2] = rotationPoints.outer.upperSiding.sCurve0.x[3] - sCurveControl0 * Math.cos(outerTopAngle - sCurveAngle);
    rotationPoints.outer.upperSiding.sCurve0.y[2] = rotationPoints.outer.upperSiding.sCurve0.y[3] - sCurveControl0 * Math.sin(outerTopAngle - sCurveAngle);
    bezierPoints = { x: [rotationPoints.outer.upperSiding.sCurve0.x[0], rotationPoints.outer.upperSiding.sCurve0.x[1], rotationPoints.outer.upperSiding.sCurve0.x[2], rotationPoints.outer.upperSiding.sCurve0.x[3]], y: [rotationPoints.outer.upperSiding.sCurve0.y[0], rotationPoints.outer.upperSiding.sCurve0.y[1], rotationPoints.outer.upperSiding.sCurve0.y[2], rotationPoints.outer.upperSiding.sCurve0.y[3]] };
    rotationPoints.outer.upperSiding.sCurve0.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.outer.upperSiding.sCurve1.x[0] = rotationPoints.outer.upperSiding.sCurve0.x[3];
    rotationPoints.outer.upperSiding.sCurve1.y[0] = rotationPoints.outer.upperSiding.sCurve0.y[3];
    rotationPoints.outer.upperSiding.sCurve1.x[3] = rotationPoints.outer.upperSiding.sCurve1.x[0] + sCurveRadius1 * (Math.sin(outerTopAngle) - Math.sin(outerTopAngle - sCurveAngle));
    rotationPoints.outer.upperSiding.sCurve1.y[3] = rotationPoints.outer.upperSiding.sCurve1.y[0] + sCurveRadius1 * (Math.cos(outerTopAngle - sCurveAngle) - Math.cos(outerTopAngle));
    rotationPoints.outer.upperSiding.sCurve1.x[1] = rotationPoints.outer.upperSiding.sCurve1.x[0] + sCurveControl1 * Math.cos(outerTopAngle - sCurveAngle);
    rotationPoints.outer.upperSiding.sCurve1.y[1] = rotationPoints.outer.upperSiding.sCurve1.y[0] + sCurveControl1 * Math.sin(outerTopAngle - sCurveAngle);
    rotationPoints.outer.upperSiding.sCurve1.x[2] = rotationPoints.outer.upperSiding.sCurve1.x[3] - sCurveControl1 * Math.cos(outerTopAngle);
    rotationPoints.outer.upperSiding.sCurve1.y[2] = rotationPoints.outer.upperSiding.sCurve1.y[3] - sCurveControl1 * Math.sin(outerTopAngle);
    bezierPoints = { x: [rotationPoints.outer.upperSiding.sCurve1.x[0], rotationPoints.outer.upperSiding.sCurve1.x[1], rotationPoints.outer.upperSiding.sCurve1.x[2], rotationPoints.outer.upperSiding.sCurve1.x[3]], y: [rotationPoints.outer.upperSiding.sCurve1.y[0], rotationPoints.outer.upperSiding.sCurve1.y[1], rotationPoints.outer.upperSiding.sCurve1.y[2], rotationPoints.outer.upperSiding.sCurve1.y[3]] };
    rotationPoints.outer.upperSiding.sCurve1.bezierLength = getBezierLength(bezierPoints, repNo);
    switches.outerUpperSiding.left.x = rotationPoints.outer.upperSiding.sCurve0.x[0];
    switches.outerUpperSiding.left.y = rotationPoints.outer.upperSiding.sCurve0.y[0];
    rotationPoints.outer.upperSiding.parallel.x[0] = rotationPoints.outer.upperSiding.sCurve1.x[3];
    rotationPoints.outer.upperSiding.parallel.x[1] = 0.88 * background.width;
    rotationPoints.outer.upperSiding.parallel.y[0] = rotationPoints.outer.upperSiding.sCurve1.y[3];
    rotationPoints.outer.upperSiding.parallel.y[1] = rotationPoints.outer.upperSiding.parallel.y[0] + (rotationPoints.outer.upperSiding.parallel.x[1] - rotationPoints.outer.upperSiding.parallel.x[0]) * Math.tan(outerTopAngle);
    var loopRadius0 = 0.1306 * background.width;
    var loopAngle0 = (108 / 180) * Math.PI;
    var loopControl0 = (4 / 3) * Math.tan(loopAngle0 / 4) * loopRadius0;
    rotationPoints.outer.upperSiding.loopCurve0.x[0] = rotationPoints.outer.upperSiding.parallel.x[1];
    rotationPoints.outer.upperSiding.loopCurve0.y[0] = rotationPoints.outer.upperSiding.parallel.y[1];
    rotationPoints.outer.upperSiding.loopCurve0.x[3] = rotationPoints.outer.upperSiding.loopCurve0.x[0] + loopRadius0 * (Math.sin(outerTopAngle + loopAngle0) - Math.sin(outerTopAngle));
    rotationPoints.outer.upperSiding.loopCurve0.y[3] = rotationPoints.outer.upperSiding.loopCurve0.y[0] + loopRadius0 * (Math.cos(outerTopAngle) - Math.cos(outerTopAngle + loopAngle0));
    rotationPoints.outer.upperSiding.loopCurve0.x[1] = rotationPoints.outer.upperSiding.loopCurve0.x[0] + loopControl0 * Math.cos(outerTopAngle);
    rotationPoints.outer.upperSiding.loopCurve0.y[1] = rotationPoints.outer.upperSiding.loopCurve0.y[0] + loopControl0 * Math.sin(outerTopAngle);
    rotationPoints.outer.upperSiding.loopCurve0.x[2] = rotationPoints.outer.upperSiding.loopCurve0.x[3] - loopControl0 * Math.cos(outerTopAngle + loopAngle0);
    rotationPoints.outer.upperSiding.loopCurve0.y[2] = rotationPoints.outer.upperSiding.loopCurve0.y[3] - loopControl0 * Math.sin(outerTopAngle + loopAngle0);
    bezierPoints = { x: [rotationPoints.outer.upperSiding.loopCurve0.x[0], rotationPoints.outer.upperSiding.loopCurve0.x[1], rotationPoints.outer.upperSiding.loopCurve0.x[2], rotationPoints.outer.upperSiding.loopCurve0.x[3]], y: [rotationPoints.outer.upperSiding.loopCurve0.y[0], rotationPoints.outer.upperSiding.loopCurve0.y[1], rotationPoints.outer.upperSiding.loopCurve0.y[2], rotationPoints.outer.upperSiding.loopCurve0.y[3]] };
    rotationPoints.outer.upperSiding.loopCurve0.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.outer.upperSiding.pillar.x[0] = rotationPoints.outer.upperSiding.loopCurve0.x[3];
    rotationPoints.outer.upperSiding.pillar.y[0] = rotationPoints.outer.upperSiding.loopCurve0.y[3];
    rotationPoints.outer.upperSiding.pillar.x[3] = 1.0022 * background.width;
    rotationPoints.outer.upperSiding.pillar.y[3] = 0.8095 * background.height;
    rotationPoints.outer.upperSiding.pillar.x[1] = rotationPoints.outer.upperSiding.pillar.x[0] + 0.1137 * background.width * Math.cos(outerTopAngle + loopAngle0);
    rotationPoints.outer.upperSiding.pillar.y[1] = rotationPoints.outer.upperSiding.pillar.y[0] + 0.1137 * background.width * Math.sin(outerTopAngle + loopAngle0);
    rotationPoints.outer.upperSiding.pillar.x[2] = rotationPoints.outer.upperSiding.pillar.x[3];
    rotationPoints.outer.upperSiding.pillar.y[2] = rotationPoints.outer.upperSiding.pillar.y[3] - 0.1497 * background.width;
    bezierPoints = { x: [rotationPoints.outer.upperSiding.pillar.x[0], rotationPoints.outer.upperSiding.pillar.x[1], rotationPoints.outer.upperSiding.pillar.x[2], rotationPoints.outer.upperSiding.pillar.x[3]], y: [rotationPoints.outer.upperSiding.pillar.y[0], rotationPoints.outer.upperSiding.pillar.y[1], rotationPoints.outer.upperSiding.pillar.y[2], rotationPoints.outer.upperSiding.pillar.y[3]] };
    rotationPoints.outer.upperSiding.pillar.bezierLength = getBezierLength(bezierPoints, repNo);
    var loopRadius1 = 0.2395 * background.width;
    var loopControl1 = (4 / 3) * Math.tan(Math.PI / 8) * loopRadius1;
    rotationPoints.outer.upperSiding.loopCurve1.x[0] = rotationPoints.outer.upperSiding.pillar.x[3];
    rotationPoints.outer.upperSiding.loopCurve1.y[0] = rotationPoints.outer.upperSiding.pillar.y[3];
    rotationPoints.outer.upperSiding.loopCurve1.x[1] = rotationPoints.outer.upperSiding.loopCurve1.x[0];
    rotationPoints.outer.upperSiding.loopCurve1.y[1] = rotationPoints.outer.upperSiding.loopCurve1.y[0] + loopControl1;
    rotationPoints.outer.upperSiding.loopCurve1.x[3] = rotationPoints.outer.upperSiding.loopCurve1.x[0] + loopRadius1;
    rotationPoints.outer.upperSiding.loopCurve1.y[3] = rotationPoints.outer.upperSiding.loopCurve1.y[0] + loopRadius1;
    rotationPoints.outer.upperSiding.loopCurve1.x[2] = rotationPoints.outer.upperSiding.loopCurve1.x[3] - loopControl1;
    rotationPoints.outer.upperSiding.loopCurve1.y[2] = rotationPoints.outer.upperSiding.loopCurve1.y[3];
    bezierPoints = { x: [rotationPoints.outer.upperSiding.loopCurve1.x[0], rotationPoints.outer.upperSiding.loopCurve1.x[1], rotationPoints.outer.upperSiding.loopCurve1.x[2], rotationPoints.outer.upperSiding.loopCurve1.x[3]], y: [rotationPoints.outer.upperSiding.loopCurve1.y[0], rotationPoints.outer.upperSiding.loopCurve1.y[1], rotationPoints.outer.upperSiding.loopCurve1.y[2], rotationPoints.outer.upperSiding.loopCurve1.y[3]] };
    rotationPoints.outer.upperSiding.loopCurve1.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.outer.upperSiding.loopCurve2.x[0] = rotationPoints.outer.upperSiding.loopCurve1.x[3];
    rotationPoints.outer.upperSiding.loopCurve2.y[0] = rotationPoints.outer.upperSiding.loopCurve1.y[3];
    rotationPoints.outer.upperSiding.loopCurve2.x[1] = rotationPoints.outer.upperSiding.loopCurve2.x[0] + loopControl1;
    rotationPoints.outer.upperSiding.loopCurve2.y[1] = rotationPoints.outer.upperSiding.loopCurve2.y[0];
    rotationPoints.outer.upperSiding.loopCurve2.x[3] = rotationPoints.outer.upperSiding.loopCurve2.x[0] + loopRadius1;
    rotationPoints.outer.upperSiding.loopCurve2.y[3] = rotationPoints.outer.upperSiding.loopCurve2.y[0] - loopRadius1;
    rotationPoints.outer.upperSiding.loopCurve2.x[2] = rotationPoints.outer.upperSiding.loopCurve2.x[3];
    rotationPoints.outer.upperSiding.loopCurve2.y[2] = rotationPoints.outer.upperSiding.loopCurve2.y[3] + loopControl1;
    bezierPoints = { x: [rotationPoints.outer.upperSiding.loopCurve2.x[0], rotationPoints.outer.upperSiding.loopCurve2.x[1], rotationPoints.outer.upperSiding.loopCurve2.x[2], rotationPoints.outer.upperSiding.loopCurve2.x[3]], y: [rotationPoints.outer.upperSiding.loopCurve2.y[0], rotationPoints.outer.upperSiding.loopCurve2.y[1], rotationPoints.outer.upperSiding.loopCurve2.y[2], rotationPoints.outer.upperSiding.loopCurve2.y[3]] };
    rotationPoints.outer.upperSiding.loopCurve2.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.outer.upperSiding.loopLine0.x[0] = rotationPoints.outer.upperSiding.loopCurve2.x[3];
    rotationPoints.outer.upperSiding.loopLine0.y[0] = rotationPoints.outer.upperSiding.loopCurve2.y[3];
    rotationPoints.outer.upperSiding.loopLine0.x[1] = rotationPoints.outer.upperSiding.loopLine0.x[0];
    rotationPoints.outer.upperSiding.loopLine0.y[1] = rotationPoints.outer.upperSiding.parallel.y[1] + loopRadius1;
    rotationPoints.outer.upperSiding.loopCurve3.x[0] = rotationPoints.outer.upperSiding.loopLine0.x[1];
    rotationPoints.outer.upperSiding.loopCurve3.y[0] = rotationPoints.outer.upperSiding.loopLine0.y[1];
    rotationPoints.outer.upperSiding.loopCurve3.x[1] = rotationPoints.outer.upperSiding.loopCurve3.x[0];
    rotationPoints.outer.upperSiding.loopCurve3.y[1] = rotationPoints.outer.upperSiding.loopCurve3.y[0] - loopControl1;
    rotationPoints.outer.upperSiding.loopCurve3.x[3] = rotationPoints.outer.upperSiding.loopCurve3.x[0] - loopRadius1;
    rotationPoints.outer.upperSiding.loopCurve3.y[3] = rotationPoints.outer.upperSiding.loopCurve3.y[0] - loopRadius1;
    rotationPoints.outer.upperSiding.loopCurve3.x[2] = rotationPoints.outer.upperSiding.loopCurve3.x[3] + loopControl1;
    rotationPoints.outer.upperSiding.loopCurve3.y[2] = rotationPoints.outer.upperSiding.loopCurve3.y[3];
    bezierPoints = { x: [rotationPoints.outer.upperSiding.loopCurve3.x[0], rotationPoints.outer.upperSiding.loopCurve3.x[1], rotationPoints.outer.upperSiding.loopCurve3.x[2], rotationPoints.outer.upperSiding.loopCurve3.x[3]], y: [rotationPoints.outer.upperSiding.loopCurve3.y[0], rotationPoints.outer.upperSiding.loopCurve3.y[1], rotationPoints.outer.upperSiding.loopCurve3.y[2], rotationPoints.outer.upperSiding.loopCurve3.y[3]] };
    rotationPoints.outer.upperSiding.loopCurve3.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.outer.upperSiding.loopLine1.x[0] = rotationPoints.outer.upperSiding.loopCurve3.x[3];
    rotationPoints.outer.upperSiding.loopLine1.y[0] = rotationPoints.outer.upperSiding.loopCurve3.y[3];
    rotationPoints.outer.upperSiding.loopLine1.x[1] = rotationPoints.outer.upperSiding.parallel.x[1];
    rotationPoints.outer.upperSiding.loopLine1.y[1] = rotationPoints.outer.upperSiding.loopLine1.y[0];
    var outerUpperHeight = 0.025 * background.width;
    // Rise along the S-curve: z = J * t^3 on sCurve0 stays nearly flat at first, so the track rises only after it has left the background; then up to the full height, gradient 0 at both ends and continuous at the join
    // 0.43 was found numerically for this geometry: the gentlest maximum gradient that keeps the track below 1 px at the background's edge; check it again when the S-curve changes
    var sCurveJoinHeight = 0.43 * outerUpperHeight;
    rotationPoints.outer.upperSiding.sCurve0.z = [0, 0, 0, sCurveJoinHeight];
    rotationPoints.outer.upperSiding.sCurve1.z = [sCurveJoinHeight, sCurveJoinHeight * (1 + rotationPoints.outer.upperSiding.sCurve1.bezierLength / rotationPoints.outer.upperSiding.sCurve0.bezierLength), outerUpperHeight, outerUpperHeight];
    rotationPoints.outer.upperSiding.parallel.z = [outerUpperHeight, outerUpperHeight];
    rotationPoints.outer.upperSiding.loopCurve0.z = [outerUpperHeight, outerUpperHeight, outerUpperHeight, outerUpperHeight];
    rotationPoints.outer.upperSiding.pillar.z = [outerUpperHeight, outerUpperHeight, outerUpperHeight, outerUpperHeight];
    rotationPoints.outer.upperSiding.loopCurve1.z = [outerUpperHeight, outerUpperHeight, outerUpperHeight, outerUpperHeight];
    rotationPoints.outer.upperSiding.loopCurve2.z = [outerUpperHeight, outerUpperHeight, outerUpperHeight, outerUpperHeight];
    rotationPoints.outer.upperSiding.loopLine0.z = [outerUpperHeight, outerUpperHeight];
    rotationPoints.outer.upperSiding.loopCurve3.z = [outerUpperHeight, outerUpperHeight, outerUpperHeight, outerUpperHeight];
    rotationPoints.outer.upperSiding.loopLine1.z = [outerUpperHeight, outerUpperHeight];
    /*------------------------------------------------------------------------------------------------------------------*
     *                                           _1__2_3____T_____________________________________________              *
     *                                     /1__2_3/           \                                           |             *
     *  ----------------------------------0--------------------\---                                       |             *
     *  -      ___       ___                                    | -                                       |             *
     *  -     |   \      |   \   ________  _____   _______      | -                                       |             *
     *  -    |    \     |    \   | __   |  ||__|  | __   |      | -        all  required                  |             *
     *  -   |  / \ \   |  / \ \  | |__| |  ||\    | |__| |      |P-                                       |             *
     *  -  |  /   \ \ |  /   \ \ |______|  ||\\   |______|      | -           Rotation Points             |             *
     *  -  ______________________________________________       | -                                       |             *
     *  -  _______________________________________________      | -                                       |             *
     *  --------------------------------------------------------|--                                       |             *
     *                                                          \_________________________________________/             *
     *------------------------------------------------------------------------------------------------------------------*/
    //OUTER/RIGHTSIDING/PASSING
    // Second track outside rightSiding's loop from its left leg (diverge) to its bottom straight (merge).
    // Straights stay passingSpacing outside the red loop's straights, corners are quarter circles.
    // The right straight runs under the upper loop's right straight instead; the portals there have to span it.
    var passingSpacing = 0.044 * background.width;
    var passingRadius = 0.072 * background.width;
    var passingControl = (4 / 3) * Math.tan(Math.PI / 8) * passingRadius;
    var passingLeft = rotationPoints.outer.rightSiding.end.x[1] - passingSpacing;
    var passingTop = rotationPoints.outer.rightSiding.continueLine0.y[0] - passingSpacing;
    var passingRight = rotationPoints.outer.upperSiding.loopLine0.x[0];
    var passingBottom = rotationPoints.outer.rightSiding.rejoin.y[0] + passingSpacing;
    var passingEndLength = Math.hypot(rotationPoints.outer.rightSiding.end.x[1] - rotationPoints.outer.rightSiding.end.x[0], rotationPoints.outer.rightSiding.end.y[1] - rotationPoints.outer.rightSiding.end.y[0]);
    rotationPoints.outer.rightSidingPassing.diverge.y[0] = -0.006 * background.height;
    rotationPoints.outer.rightSidingPassing.diverge.x[0] = rotationPoints.outer.rightSiding.end.x[0] + ((rotationPoints.outer.rightSidingPassing.diverge.y[0] - rotationPoints.outer.rightSiding.end.y[0]) * (rotationPoints.outer.rightSiding.end.x[1] - rotationPoints.outer.rightSiding.end.x[0])) / (rotationPoints.outer.rightSiding.end.y[1] - rotationPoints.outer.rightSiding.end.y[0]);
    rotationPoints.outer.rightSidingPassing.diverge.x[3] = passingLeft;
    rotationPoints.outer.rightSidingPassing.diverge.y[3] = passingTop + passingRadius;
    var passingDivergeControl = (rotationPoints.outer.rightSidingPassing.diverge.y[0] - rotationPoints.outer.rightSidingPassing.diverge.y[3]) / 3;
    rotationPoints.outer.rightSidingPassing.diverge.x[1] = rotationPoints.outer.rightSidingPassing.diverge.x[0] + (passingDivergeControl * (rotationPoints.outer.rightSiding.end.x[1] - rotationPoints.outer.rightSiding.end.x[0])) / passingEndLength;
    rotationPoints.outer.rightSidingPassing.diverge.y[1] = rotationPoints.outer.rightSidingPassing.diverge.y[0] + (passingDivergeControl * (rotationPoints.outer.rightSiding.end.y[1] - rotationPoints.outer.rightSiding.end.y[0])) / passingEndLength;
    rotationPoints.outer.rightSidingPassing.diverge.x[2] = passingLeft;
    rotationPoints.outer.rightSidingPassing.diverge.y[2] = rotationPoints.outer.rightSidingPassing.diverge.y[3] + passingDivergeControl;
    bezierPoints = { x: [rotationPoints.outer.rightSidingPassing.diverge.x[0], rotationPoints.outer.rightSidingPassing.diverge.x[1], rotationPoints.outer.rightSidingPassing.diverge.x[2], rotationPoints.outer.rightSidingPassing.diverge.x[3]], y: [rotationPoints.outer.rightSidingPassing.diverge.y[0], rotationPoints.outer.rightSidingPassing.diverge.y[1], rotationPoints.outer.rightSidingPassing.diverge.y[2], rotationPoints.outer.rightSidingPassing.diverge.y[3]] };
    rotationPoints.outer.rightSidingPassing.diverge.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.outer.rightSidingPassing.curve0.x[0] = passingLeft;
    rotationPoints.outer.rightSidingPassing.curve0.x[1] = passingLeft;
    rotationPoints.outer.rightSidingPassing.curve0.x[2] = passingLeft + passingRadius - passingControl;
    rotationPoints.outer.rightSidingPassing.curve0.x[3] = passingLeft + passingRadius;
    rotationPoints.outer.rightSidingPassing.curve0.y[0] = passingTop + passingRadius;
    rotationPoints.outer.rightSidingPassing.curve0.y[1] = passingTop + passingRadius - passingControl;
    rotationPoints.outer.rightSidingPassing.curve0.y[2] = passingTop;
    rotationPoints.outer.rightSidingPassing.curve0.y[3] = passingTop;
    bezierPoints = { x: [rotationPoints.outer.rightSidingPassing.curve0.x[0], rotationPoints.outer.rightSidingPassing.curve0.x[1], rotationPoints.outer.rightSidingPassing.curve0.x[2], rotationPoints.outer.rightSidingPassing.curve0.x[3]], y: [rotationPoints.outer.rightSidingPassing.curve0.y[0], rotationPoints.outer.rightSidingPassing.curve0.y[1], rotationPoints.outer.rightSidingPassing.curve0.y[2], rotationPoints.outer.rightSidingPassing.curve0.y[3]] };
    rotationPoints.outer.rightSidingPassing.curve0.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.outer.rightSidingPassing.line0.x[0] = passingLeft + passingRadius;
    rotationPoints.outer.rightSidingPassing.line0.x[1] = passingRight - passingRadius;
    rotationPoints.outer.rightSidingPassing.line0.y[0] = passingTop;
    rotationPoints.outer.rightSidingPassing.line0.y[1] = passingTop;
    rotationPoints.outer.rightSidingPassing.curve1.x[0] = passingRight - passingRadius;
    rotationPoints.outer.rightSidingPassing.curve1.x[1] = passingRight - passingRadius + passingControl;
    rotationPoints.outer.rightSidingPassing.curve1.x[2] = passingRight;
    rotationPoints.outer.rightSidingPassing.curve1.x[3] = passingRight;
    rotationPoints.outer.rightSidingPassing.curve1.y[0] = passingTop;
    rotationPoints.outer.rightSidingPassing.curve1.y[1] = passingTop;
    rotationPoints.outer.rightSidingPassing.curve1.y[2] = passingTop + passingRadius - passingControl;
    rotationPoints.outer.rightSidingPassing.curve1.y[3] = passingTop + passingRadius;
    bezierPoints = { x: [rotationPoints.outer.rightSidingPassing.curve1.x[0], rotationPoints.outer.rightSidingPassing.curve1.x[1], rotationPoints.outer.rightSidingPassing.curve1.x[2], rotationPoints.outer.rightSidingPassing.curve1.x[3]], y: [rotationPoints.outer.rightSidingPassing.curve1.y[0], rotationPoints.outer.rightSidingPassing.curve1.y[1], rotationPoints.outer.rightSidingPassing.curve1.y[2], rotationPoints.outer.rightSidingPassing.curve1.y[3]] };
    rotationPoints.outer.rightSidingPassing.curve1.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.outer.rightSidingPassing.line1.x[0] = passingRight;
    rotationPoints.outer.rightSidingPassing.line1.x[1] = passingRight;
    rotationPoints.outer.rightSidingPassing.line1.y[0] = passingTop + passingRadius;
    rotationPoints.outer.rightSidingPassing.line1.y[1] = passingBottom - passingRadius;
    rotationPoints.outer.rightSidingPassing.curve2.x[0] = passingRight;
    rotationPoints.outer.rightSidingPassing.curve2.x[1] = passingRight;
    rotationPoints.outer.rightSidingPassing.curve2.x[2] = passingRight - passingRadius + passingControl;
    rotationPoints.outer.rightSidingPassing.curve2.x[3] = passingRight - passingRadius;
    rotationPoints.outer.rightSidingPassing.curve2.y[0] = passingBottom - passingRadius;
    rotationPoints.outer.rightSidingPassing.curve2.y[1] = passingBottom - passingRadius + passingControl;
    rotationPoints.outer.rightSidingPassing.curve2.y[2] = passingBottom;
    rotationPoints.outer.rightSidingPassing.curve2.y[3] = passingBottom;
    bezierPoints = { x: [rotationPoints.outer.rightSidingPassing.curve2.x[0], rotationPoints.outer.rightSidingPassing.curve2.x[1], rotationPoints.outer.rightSidingPassing.curve2.x[2], rotationPoints.outer.rightSidingPassing.curve2.x[3]], y: [rotationPoints.outer.rightSidingPassing.curve2.y[0], rotationPoints.outer.rightSidingPassing.curve2.y[1], rotationPoints.outer.rightSidingPassing.curve2.y[2], rotationPoints.outer.rightSidingPassing.curve2.y[3]] };
    rotationPoints.outer.rightSidingPassing.curve2.bezierLength = getBezierLength(bezierPoints, repNo);
    var passingMergeLength = 0.144 * background.width;
    rotationPoints.outer.rightSidingPassing.merge.x[3] = 1.018 * background.width;
    rotationPoints.outer.rightSidingPassing.merge.y[3] = rotationPoints.outer.rightSiding.rejoin.y[0];
    rotationPoints.outer.rightSidingPassing.merge.x[0] = rotationPoints.outer.rightSidingPassing.merge.x[3] + passingMergeLength;
    rotationPoints.outer.rightSidingPassing.merge.y[0] = passingBottom;
    rotationPoints.outer.rightSidingPassing.merge.x[1] = rotationPoints.outer.rightSidingPassing.merge.x[0] - passingMergeLength / 3;
    rotationPoints.outer.rightSidingPassing.merge.y[1] = passingBottom;
    rotationPoints.outer.rightSidingPassing.merge.x[2] = rotationPoints.outer.rightSidingPassing.merge.x[3] + passingMergeLength / 3;
    rotationPoints.outer.rightSidingPassing.merge.y[2] = rotationPoints.outer.rightSidingPassing.merge.y[3];
    bezierPoints = { x: [rotationPoints.outer.rightSidingPassing.merge.x[0], rotationPoints.outer.rightSidingPassing.merge.x[1], rotationPoints.outer.rightSidingPassing.merge.x[2], rotationPoints.outer.rightSidingPassing.merge.x[3]], y: [rotationPoints.outer.rightSidingPassing.merge.y[0], rotationPoints.outer.rightSidingPassing.merge.y[1], rotationPoints.outer.rightSidingPassing.merge.y[2], rotationPoints.outer.rightSidingPassing.merge.y[3]] };
    rotationPoints.outer.rightSidingPassing.merge.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.outer.rightSidingPassing.line2.x[0] = passingRight - passingRadius;
    rotationPoints.outer.rightSidingPassing.line2.x[1] = rotationPoints.outer.rightSidingPassing.merge.x[0];
    rotationPoints.outer.rightSidingPassing.line2.y[0] = passingBottom;
    rotationPoints.outer.rightSidingPassing.line2.y[1] = passingBottom;
    /////SPEED/////
    trains.forEach(function (train) {
        defineTrainSpeed(train);
    });
}
/******************************************
             animate  functions
******************************************/
function animateObjects() {
    function collisionMatrix() {
        function collisionWeight(input1) {
            // The collision test reads only these values of the train and its cars; facs and points
            // are added to this object instead of the train
            function collisionObject(object) {
                return { x: object.x, y: object.y, displayAngle: object.displayAngle, width: object.width, height: object.height, front: { z: object.front.z }, back: { z: object.back.z } };
            }
            var currentObjects = [];
            currentObjects[0] = collisionObject(trains[input1]);
            if (trains[input1].cars.length == 0 && trains[input1].standardDirection) {
                currentObjects[0].facs = [
                    { x: -0.5, weight: trainParams.innerCollisionFac / 4 },
                    { x: 0, weight: trainParams.innerCollisionFac / 3 },
                    { x: 0.5, weight: trainParams.innerCollisionFac / 2 },
                    { x: 1, weight: 1 }
                ];
            }
            else if (trains[input1].cars.length == 0) {
                currentObjects[0].facs = [
                    { x: -1, weight: 1 },
                    { x: -0.5, weight: trainParams.innerCollisionFac / 2 },
                    { x: 0, weight: trainParams.innerCollisionFac / 3 },
                    { x: 0.5, weight: trainParams.innerCollisionFac / 4 }
                ];
            }
            else if (trains[input1].standardDirection) {
                currentObjects[0].facs = [
                    { x: -1, weight: trainParams.innerCollisionFac },
                    { x: -0.5, weight: trainParams.innerCollisionFac },
                    { x: 0, weight: trainParams.innerCollisionFac },
                    { x: 0.5, weight: trainParams.innerCollisionFac },
                    { x: 1, weight: 1 }
                ];
            }
            else {
                currentObjects[0].facs = [
                    { x: -1, weight: trainParams.innerCollisionFac },
                    { x: -0.5, weight: trainParams.innerCollisionFac / 2 },
                    { x: 0, weight: trainParams.innerCollisionFac / 3 },
                    { x: 0.5, weight: trainParams.innerCollisionFac / 4 }
                ];
            }
            for (var i = 0; i < trains[input1].cars.length; i++) {
                currentObjects[i + 1] = collisionObject(trains[input1].cars[i]);
                if (i == trains[input1].cars.length - 1 && !trains[input1].standardDirection) {
                    currentObjects[i + 1].facs = [
                        { x: -1, weight: 1 },
                        { x: -0.5, weight: trainParams.innerCollisionFac },
                        { x: 0, weight: trainParams.innerCollisionFac },
                        { x: 0.5, weight: trainParams.innerCollisionFac },
                        { x: 1, weight: trainParams.innerCollisionFac }
                    ];
                }
                else if (i == trains[input1].cars.length - 1) {
                    currentObjects[i + 1].facs = [
                        { x: -0.5, weight: trainParams.innerCollisionFac / 4 },
                        { x: 0, weight: trainParams.innerCollisionFac / 3 },
                        { x: 0.5, weight: trainParams.innerCollisionFac / 2 },
                        { x: 1, weight: trainParams.innerCollisionFac }
                    ];
                }
                else {
                    currentObjects[i + 1].facs = [
                        { x: -1, weight: trainParams.innerCollisionFac },
                        { x: -0.5, weight: trainParams.innerCollisionFac },
                        { x: 0, weight: trainParams.innerCollisionFac },
                        { x: 0.5, weight: trainParams.innerCollisionFac },
                        { x: 1, weight: trainParams.innerCollisionFac }
                    ];
                }
            }
            var collisionMatrix = [];
            currentObjects.forEach(function (currentObject) {
                currentObject.points = [];
                currentObject.facs.forEach(function (fac) {
                    currentObject.points[0] = {};
                    currentObject.points[1] = {};
                    currentObject.points[0].x = currentObject.x + (fac.x * Math.sin(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2 + (Math.cos(-Math.PI / 2 - currentObject.displayAngle) * currentObject.height) / 2;
                    currentObject.points[0].y = currentObject.y + (fac.x * Math.cos(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2 - (Math.sin(-Math.PI / 2 - currentObject.displayAngle) * currentObject.height) / 2;
                    currentObject.points[0].weight = fac.weight;
                    currentObject.points[1].x = currentObject.x + (fac.x * Math.sin(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2 - (Math.cos(-Math.PI / 2 - currentObject.displayAngle) * currentObject.height) / 2;
                    currentObject.points[1].y = currentObject.y + (fac.x * Math.cos(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2 + (Math.sin(-Math.PI / 2 - currentObject.displayAngle) * currentObject.height) / 2;
                    currentObject.points[1].weight = fac.weight;
                    if (fac.weight == 1) {
                        currentObject.points[2] = {};
                        currentObject.points[3] = {};
                        currentObject.points[4] = {};
                        currentObject.points[5] = {};
                        currentObject.points[2].x = currentObject.x + (fac.x * Math.sin(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2;
                        currentObject.points[2].y = currentObject.y + (fac.x * Math.cos(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2;
                        currentObject.points[2].weight = fac.weight;
                        currentObject.points[3].x = currentObject.x + (fac.x * 1.2 * Math.sin(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2;
                        currentObject.points[3].y = currentObject.y + (fac.x * 1.2 * Math.cos(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2;
                        currentObject.points[3].weight = fac.weight;
                        currentObject.points[4].x = currentObject.x + (fac.x * 1.1 * Math.sin(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2 + (1.1 * Math.cos(-Math.PI / 2 - currentObject.displayAngle) * currentObject.height) / 2;
                        currentObject.points[4].y = currentObject.y + (fac.x * 1.1 * Math.cos(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2 - (1.1 * Math.sin(-Math.PI / 2 - currentObject.displayAngle) * currentObject.height) / 2;
                        currentObject.points[4].weight = fac.weight;
                        currentObject.points[5].x = currentObject.x + (fac.x * 1.1 * Math.sin(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2 - (1.1 * Math.cos(-Math.PI / 2 - currentObject.displayAngle) * currentObject.height) / 2;
                        currentObject.points[5].y = currentObject.y + (fac.x * 1.1 * Math.cos(Math.PI / 2 - currentObject.displayAngle) * currentObject.width) / 2 + (1.1 * Math.sin(-Math.PI / 2 - currentObject.displayAngle) * currentObject.height) / 2;
                        currentObject.points[5].weight = fac.weight;
                    }
                    if (debug) {
                        for (var p = 0; p < currentObject.points.length; p++) {
                            debugDrawPoints.push(currentObject.points[p]);
                        }
                    }
                });
                for (var i = 0; i < trains.length; i++) {
                    if (collisionMatrix[i] === undefined) {
                        collisionMatrix[i] = 0;
                    }
                    if (input1 != i && (trains[input1].circleFamily === null || trains[i].circleFamily === null || trains[input1].circleFamily == trains[i].circleFamily)) {
                        for (var j = -1; j < trains[i].cars.length; j++) {
                            var currentObject2 = j >= 0 ? trains[i].cars[j] : trains[i];
                            if (Math.abs((currentObject.front.z + currentObject.back.z) / 2 - (currentObject2.front.z + currentObject2.back.z) / 2) >= trainParams.heightClearance * background.width) {
                                // One object passes over the other
                                continue;
                            }
                            currentObject.points.forEach(function (point) {
                                var testXC = point.x - currentObject2.x;
                                var testYC = point.y - currentObject2.y;
                                var testX = testXC * Math.cos(-currentObject2.displayAngle) - testYC * Math.sin(-currentObject2.displayAngle);
                                var testY = testXC * Math.sin(-currentObject2.displayAngle) + testYC * Math.cos(-currentObject2.displayAngle);
                                if (testX >= -currentObject2.width / 2 && testX <= currentObject2.width / 2 && testY >= -currentObject2.height / 2 && testY <= currentObject2.height / 2 && point.weight > collisionMatrix[i]) {
                                    collisionMatrix[i] = point.weight;
                                    debugDrawPointsCrash.push(point);
                                }
                            });
                        }
                    }
                }
            });
            return collisionMatrix;
        }
        var collisionMatrix = [];
        for (var i = 0; i < trains.length; i++) {
            collisionMatrix[i] = collisionWeight(i);
        }
        return collisionMatrix;
    }
    function animateTrains(input1) {
        function animateTrain(i) {
            var currentObject = i < 0 ? trains[input1] : trains[input1].cars[i];
            if (trains[input1].move) {
                //Calc train position
                var speed = Math.abs(trains[input1].speed * trains[input1].accelerationSpeed);
                var customSpeed = trains[input1].currentSpeedInPercent / 100;
                changeCOSection(currentObject.front, true, input1, currentObject, i);
                changeCOSection(currentObject.back, false, input1, currentObject, i);
                setCOPos(currentObject.front, true, input1, i, speed, customSpeed);
                setCOPos(currentObject.back, false, input1, i, speed, customSpeed);
                if (i == -1) {
                    setCOPosCorr(currentObject.back, false, input1, currentObject, i);
                }
                else {
                    setCOPosCorr(currentObject.front, true, input1, currentObject, i);
                    setCOPosCorr(currentObject.back, false, input1, currentObject, i);
                }
                currentObject.x = (currentObject.front.x + currentObject.back.x) / 2;
                currentObject.y = (currentObject.front.y + currentObject.back.y) / 2;
                setCurrentObjectDisplayAngle(input1, currentObject);
                if (currentObject.opacity == undefined) {
                    currentObject.opacity = 1;
                }
                else if (currentObject.opacity < trainParams.minOpacity) {
                    currentObject.opacity = trainParams.minOpacity;
                }
                else if (currentObject.opacity > 1) {
                    currentObject.opacity = 1;
                }
            }
            if (currentObject.wheels) {
                currentObject.wheels.moveX = currentObject.width / 2 - currentObject.bogieDistance * currentObject.width;
                currentObject.wheels.moveY = (trainParams.trackWidth / 2) * background.width;
                if (currentObject.wheels.front) {
                    currentObject.wheels.front.leftX = currentObject.x + currentObject.wheels.moveX * Math.sin(Math.PI / 2 - currentObject.displayAngle) - currentObject.wheels.moveY * Math.cos(-Math.PI / 2 - currentObject.displayAngle);
                    currentObject.wheels.front.leftY = currentObject.y + currentObject.wheels.moveX * Math.cos(Math.PI / 2 - currentObject.displayAngle) + currentObject.wheels.moveY * Math.sin(-Math.PI / 2 - currentObject.displayAngle);
                    currentObject.wheels.front.rightX = currentObject.x + currentObject.wheels.moveX * Math.sin(Math.PI / 2 - currentObject.displayAngle) + currentObject.wheels.moveY * Math.cos(-Math.PI / 2 - currentObject.displayAngle);
                    currentObject.wheels.front.rightY = currentObject.y + currentObject.wheels.moveX * Math.cos(Math.PI / 2 - currentObject.displayAngle) - currentObject.wheels.moveY * Math.sin(-Math.PI / 2 - currentObject.displayAngle);
                }
                if (currentObject.wheels.back) {
                    currentObject.wheels.back.leftX = currentObject.x - currentObject.wheels.moveX * Math.sin(Math.PI / 2 - currentObject.displayAngle) - currentObject.wheels.moveY * Math.cos(-Math.PI / 2 - currentObject.displayAngle);
                    currentObject.wheels.back.leftY = currentObject.y - currentObject.wheels.moveX * Math.cos(Math.PI / 2 - currentObject.displayAngle) + currentObject.wheels.moveY * Math.sin(-Math.PI / 2 - currentObject.displayAngle);
                    currentObject.wheels.back.rightX = currentObject.x - currentObject.wheels.moveX * Math.sin(Math.PI / 2 - currentObject.displayAngle) + currentObject.wheels.moveY * Math.cos(-Math.PI / 2 - currentObject.displayAngle);
                    currentObject.wheels.back.rightY = currentObject.y - currentObject.wheels.moveX * Math.cos(Math.PI / 2 - currentObject.displayAngle) - currentObject.wheels.moveY * Math.sin(-Math.PI / 2 - currentObject.displayAngle);
                }
            }
        }
        if (trains[input1].move) {
            //Calc acceleration
            if (trains[input1].accelerationSpeed === 0) {
                trains[input1].accelerationSpeed = trains[input1].accelerationSpeedStartFac;
            }
            if (trains[input1].accelerationSpeed > 0 && trains[input1].accelerationSpeed < 1) {
                trains[input1].accelerationSpeed *= trains[input1].accelerationSpeedFac;
                if (trains[input1].accelerationSpeed >= 1) {
                    trains[input1].accelerationSpeed = 1;
                }
            }
            else if (trains[input1].accelerationSpeed < 0 && trains[input1].accelerationSpeed >= -1) {
                trains[input1].accelerationSpeed /= trains[input1].accelerationSpeedFac;
                if (trains[input1].accelerationSpeed >= -trains[input1].accelerationSpeedStartFac) {
                    trains[input1].accelerationSpeed = 0;
                    trains[input1].move = false;
                }
            }
            if (trains[input1].accelerationSpeedCustom < 1) {
                trains[input1].accelerationSpeedCustom *= trains[input1].accelerationSpeedFac;
                if (trains[input1].accelerationSpeedCustom >= 1) {
                    trains[input1].accelerationSpeedCustom = 1;
                }
            }
            else {
                trains[input1].accelerationSpeedCustom /= trains[input1].accelerationSpeedFac;
                if (trains[input1].accelerationSpeedCustom <= 1) {
                    trains[input1].accelerationSpeedCustom = 1;
                }
            }
            trains[input1].currentSpeedInPercent = trains[input1].accelerationSpeedCustom * trains[input1].speedInPercent;
            trains[input1].volume = Math.abs(trains[input1].accelerationSpeed) * trains[input1].currentSpeedInPercent;
        }
        else {
            trains[input1].accelerationSpeed = 0;
            trains[input1].accelerationSpeedCustom = 1;
        }
        for (var i = -1; i < trains[input1].cars.length; i++) {
            animateTrain(i);
        }
        if (trains[input1].volumeCustom == undefined) {
            trains[input1].volumeCustom = 1;
        }
        else if (trains[input1].volumeCustom < 0) {
            trains[input1].volumeCustom = 0;
        }
        else if (trains[input1].volumeCustom > 1) {
            trains[input1].volumeCustom = 1;
        }
        setTrainOuterPos(input1);
    }
    var starttime = Date.now();
    /////TRAINS/////
    for (var i = 0; i < trains.length; i++) {
        animateTrains(i);
    }
    var debugDrawPoints = [];
    var debugDrawPointsCrash = [];
    var trainCollisions = collisionMatrix();
    var newCrash = [];
    for (var i = 0; i < trains.length; i++) {
        trains[i].crash = false;
        for (var j = 0; j < trains.length; j++) {
            if (i != j) {
                if (trainCollisions[i][j] >= trainParams.innerCollisionFac || trainCollisions[i][j] > trainCollisions[j][i] || (trains[i].endOfTrack && trains[i].endOfTrackStandardDirection == (trains[i].standardDirection != trains[i].trainTurned))) {
                    trains[i].crash = true;
                    if (trains[i].move) {
                        trains[i].move = false;
                        trains[i].accelerationSpeed = 0;
                        trains[i].accelerationSpeedCustom = 1;
                        newCrash.push({ i: i, j: j });
                    }
                }
            }
        }
    }
    /////RECALC/////
    if (animateTimeout !== undefined && animateTimeout !== null) {
        clearTimeout(animateTimeout);
    }
    if (init) {
        return;
    }
    if (firstRun) {
        firstRun = false;
        safePostMessage({ k: "go", state: initState, switches: switches, trains: trains, rotationPoints: rotationPoints, animateInterval: animateTimeoutDelay });
    }
    else {
        safePostMessage({ k: "setTrains", trains: trains, rotationPoints: rotationPoints });
    }
    for (var i = 0; i < newCrash.length; i++) {
        safePostMessage({ k: "trainCrash", i: newCrash[i].i, j: newCrash[i].j });
    }
    if (debug) {
        safePostMessage({ k: "debugDrawPoints", p: debugDrawPoints, pC: debugDrawPointsCrash, tC: trainCollisions });
    }
    if (online && syncing) {
        safePostMessage({ k: "sync-ready", trains: trains, rotationPoints: rotationPoints });
        syncing = false;
    }
    else if (!pause) {
        var resttime = Math.max(animateTimeoutDelay - (Date.now() - starttime), 0);
        animateTimeout = setTimeout(animateObjects, resttime);
    }
}
var animateTimeout;
var animateTimeoutDelay;
const rotationPoints = {
    inner: { narrow: { x: [], y: [], bezierLength: { left: 0, right: 0 } }, wide: { x: [], y: [], bezierLength: { left: 0, right: 0 } }, sidings: { first: { x: [], y: [], bezierLength: 0 }, firstS1: { x: [], y: [] }, firstS2: { x: [], y: [], bezierLength: 0 }, second: { x: [], y: [], bezierLength: 0 }, secondS1: { x: [], y: [] }, secondS2: { x: [], y: [], bezierLength: 0 }, third: { x: [], y: [], bezierLength: 0 }, thirdS1: { x: [], y: [] }, thirdS2: { x: [], y: [], bezierLength: 0 } } },
    outer: {
        narrow: { x: [], y: [], bezierLength: { left: 0, right: 0 } },
        altState3: { left: { x: [], y: [], bezierLength: 0 }, right: { x: [], y: [], bezierLength: 0 } },
        rightSiding: { enter: { x: [], y: [] }, curve: { x: [], y: [], bezierLength: 0 }, continueCurve0: { x: [], y: [], bezierLength: 0 }, continueLine0: { x: [], y: [], bezierLength: 0 }, continueCurve1: { x: [], y: [], bezierLength: 0 }, continueLine1: { x: [], y: [] }, continueCurve2: { x: [], y: [], bezierLength: 0 }, rejoin: { x: [], y: [] }, end: { x: [], y: [] } },
        rightSidingPassing: { diverge: { x: [], y: [], bezierLength: 0 }, curve0: { x: [], y: [], bezierLength: 0 }, line0: { x: [], y: [] }, curve1: { x: [], y: [], bezierLength: 0 }, line1: { x: [], y: [] }, curve2: { x: [], y: [], bezierLength: 0 }, line2: { x: [], y: [] }, merge: { x: [], y: [], bezierLength: 0 } },
        upperSiding: { sCurve0: { x: [], y: [], bezierLength: 0 }, sCurve1: { x: [], y: [], bezierLength: 0 }, parallel: { x: [], y: [] }, loopCurve0: { x: [], y: [], bezierLength: 0 }, pillar: { x: [], y: [], bezierLength: 0 }, loopCurve1: { x: [], y: [], bezierLength: 0 }, loopCurve2: { x: [], y: [], bezierLength: 0 }, loopLine0: { x: [], y: [] }, loopCurve3: { x: [], y: [], bezierLength: 0 }, loopLine1: { x: [], y: [] } }
    },
    inner2outer: { left: { x: [], y: [], bezierLength: 0 }, right: { x: [], y: [], bezierLength: 0 } }
};
const trainsDefault = [
    {
        src: 1,
        fac: 0.051,
        speedFac: 1 / 500,
        accelerationSpeedStartFac: 0.02,
        accelerationSpeedFac: 1.008,
        circle: rotationPoints.inner.wide,
        circleFamily: rotationPoints.inner,
        standardDirectionStartValue: true,
        bogieDistance: 0.15,
        state: 1,
        flickerFacFront: 2.5,
        trainSwitchSrc: 25,
        audioSrc: 0,
        cars: [
            { src: 2, fac: 0.06, bogieDistance: 0.15, wheels: { front: { use3d: true }, back: { use3d: true } } },
            { src: 2, fac: 0.06, bogieDistance: 0.15, wheels: { front: { use3d: true }, back: { use3d: true } } },
            { src: 2, fac: 0.06, bogieDistance: 0.15, wheels: { front: { use3d: true }, back: { use3d: true } } },
            { src: 3, fac: 0.044, bogieDistance: 0.15, wheels: { front: { use3d: true }, back: { use3d: true } } }
        ]
    },
    {
        src: 4,
        fac: 0.093,
        speedFac: 1 / 250,
        accelerationSpeedStartFac: 0.035,
        accelerationSpeedFac: 1.013,
        circle: rotationPoints.outer.narrow,
        circleFamily: rotationPoints.outer,
        standardDirectionStartValue: true,
        bogieDistance: 0.15,
        state: 3,
        flickerFacFront: 2.1,
        flickerFacBack: 2.1,
        trainSwitchSrc: 26,
        audioSrc: 1,
        wheels: { front: { use3d: true }, back: { use3d: true } },
        cars: [
            { src: 5, fac: 0.11, bogieDistance: 0.15, wheels: { front: { use3d: true }, back: { use3d: true } } },
            { src: 5, fac: 0.11, bogieDistance: 0.15, assetFlip: true, wheels: { front: { use3d: true }, back: { use3d: true } } },
            { src: 4, fac: 0.093, bogieDistance: 0.15, assetFlip: true, konamiUseTrainIcon: true, wheels: { front: { use3d: true }, back: { use3d: true } } }
        ]
    },
    { src: 8, fac: 0.068, speedFac: 1 / 375, accelerationSpeedStartFac: 0.04, accelerationSpeedFac: 1.01, circle: rotationPoints.inner.wide, circleFamily: rotationPoints.inner, circleStartPosDiv: 0.8, standardDirectionStartValue: true, bogieDistance: 0.04, state: 121, flickerFacFront: 2.4, flickerFacBack: 2.3, flickerFacFrontOffset: 2.82, flickerFacBackOffset: 2.75, trainSwitchSrc: 27, audioSrc: 2, wheels: { front: { use3d: true, src2d: 39 }, back: { use3d: true, src2d: 38 } }, cars: [] },
    {
        src: 7,
        fac: 0.1,
        speedFac: 1 / 250,
        accelerationSpeedStartFac: 0.034,
        accelerationSpeedFac: 1.014,
        circle: rotationPoints.inner.narrow,
        circleFamily: rotationPoints.inner,
        circleStartPosDiv: 0.865,
        standardDirectionStartValue: true,
        bogieDistance: 0.15,
        state: 111,
        margin: 500,
        flickerFacFront: 2.1,
        flickerFacBack: 2.1,
        trainSwitchSrc: 28,
        audioSrc: 3,
        wheels: { front: { use3d: true }, back: { use3d: true } },
        cars: [
            { src: 6, fac: 0.1, bogieDistance: 0.15, wheels: { front: { use3d: true }, back: { use3d: true } } },
            { src: 6, fac: 0.1, bogieDistance: 0.15, assetFlip: true, wheels: { front: { use3d: true }, back: { use3d: true } } },
            { src: 7, fac: 0.1, bogieDistance: 0.15, assetFlip: true, konamiUseTrainIcon: true, wheels: { front: { use3d: true }, back: { use3d: true } } }
        ]
    },
    {
        src: 20,
        fac: 0.0534,
        speedFac: 1 / 410,
        accelerationSpeedStartFac: 0.034,
        accelerationSpeedFac: 1.03,
        circle: rotationPoints.inner.narrow,
        circleFamily: rotationPoints.inner,
        circleStartPosDiv: 0.65,
        standardDirectionStartValue: true,
        bogieDistance: 0.15,
        state: 121,
        margin: 500,
        flickerFacFront: 2.1,
        flickerFacBack: 2.1,
        trainSwitchSrc: 29,
        audioSrc: 4,
        wheels: { front: { use3d: true }, back: { use3d: true } },
        cars: [
            { src: 21, fac: 0.043, bogieDistance: 0.15, wheels: { front: { use3d: true }, back: { use3d: true } } },
            { src: 22, fac: 0.055, bogieDistance: 0.15, wheels: { front: { use3d: true }, back: { use3d: true } } }
        ]
    },
    {
        src: 18,
        fac: 0.093,
        speedFac: 1 / 360,
        accelerationSpeedStartFac: 0.034,
        accelerationSpeedFac: 1.025,
        circle: rotationPoints.inner.narrow,
        circleFamily: rotationPoints.inner,
        circleStartPosDiv: 0.99,
        standardDirectionStartValue: true,
        bogieDistance: 0.16,
        state: 131,
        margin: 500,
        trainSwitchSrc: 30,
        audioSrc: 5,
        wheels: { front: { use3d: true }, back: { use3d: true } },
        cars: [
            { src: 19, fac: 0.08, bogieDistance: 0.15, wheels: { front: { use3d: true }, back: { use3d: true } } },
            { src: 18, fac: 0.093, bogieDistance: 0.19, assetFlip: true, konamiUseTrainIcon: true, wheels: { front: { use3d: true }, back: { use3d: true } } }
        ]
    },
    {
        src: 33,
        fac: 0.074,
        speedFac: 1 / 475,
        accelerationSpeedStartFac: 0.026,
        accelerationSpeedFac: 1.009,
        circle: rotationPoints.outer.narrow,
        circleFamily: rotationPoints.outer,
        circleStartPosDiv: 0.85,
        standardDirectionStartValue: true,
        bogieDistance: 0.16,
        state: 210,
        margin: 35,
        flickerFacFront: 2.1,
        trainSwitchSrc: 32,
        audioSrc: 6,
        cars: [
            { src: 34, fac: 0.054, bogieDistance: 0.15, wheels: { front: { use3d: true }, back: { use3d: true } } },
            { src: 35, fac: 0.054, bogieDistance: 0.15, wheels: { front: { use3d: true }, back: { use3d: true } } },
            { src: 36, fac: 0.064, bogieDistance: 0.15, wheels: { front: { use3d: true }, back: { use3d: true } } },
            { src: 37, fac: 0.045, bogieDistance: 0.15, wheels: { front: { use3d: true }, back: { use3d: true } } }
        ]
    },
    {
        src: 44,
        fac: 0.0475,
        speedFac: 1 / 500,
        accelerationSpeedStartFac: 0.026,
        accelerationSpeedFac: 1.009,
        circle: rotationPoints.outer.narrow,
        circleFamily: rotationPoints.outer,
        standardDirectionStartValue: true,
        bogieDistance: 0.31,
        state: 314,
        flickerFacFront: 2.1,
        trainSwitchSrc: 45,
        audioSrc: 7,
        wheels: { front: { use3d: true }, back: { use3d: true } },
        cars: []
    }
];
var trains;
var trainPics;
// heightClearance (fraction of the background width): objects whose heights differ by at least this much pass over each other
// instead of colliding; it is the height of the tallest train object in 3D (measured 0.0196 w), so a train on the elevated
// track (0.025 w) clears a train below, while on the low start of the S-curve collisions with the outer circle still count
const trainParams = { margin: 25, innerCollisionFac: 0.5, minOpacity: 0.6, trackWidth: 0.0066, minSpeed: 10, heightClearance: 0.02, flickerFac: 2, flickerFacOffset: 3.5 };
var switches;
var switchesBeforeAddSidings;
var background;
const switchesBeforeFac = 1.3;
var init;
var initState;
var firstRun;
var online;
var demoMode;
var pause;
var syncing;
var debug;
var saveTheGameSendTimeout;
onmessage = function (message) {
    function resizeTrains(oldBackground, excludes = []) {
        for (var i = 0; i < trains.length; i++) {
            if (!excludes.includes(i)) {
                trains[i].front.x = background.x + ((trains[i].front.x - oldBackground.x) * background.width) / oldBackground.width;
                trains[i].back.x = background.x + ((trains[i].back.x - oldBackground.x) * background.width) / oldBackground.width;
                trains[i].x = background.x + ((trains[i].x - oldBackground.x) * background.width) / oldBackground.width;
                trains[i].front.y = background.y + ((trains[i].front.y - oldBackground.y) * background.height) / oldBackground.height;
                trains[i].back.y = background.y + ((trains[i].back.y - oldBackground.y) * background.height) / oldBackground.height;
                trains[i].front.z = (trains[i].front.z * background.width) / oldBackground.width;
                trains[i].back.z = (trains[i].back.z * background.width) / oldBackground.width;
                trains[i].y = background.y + ((trains[i].y - oldBackground.y) * background.height) / oldBackground.height;
                trains[i].width = (trains[i].width * background.width) / oldBackground.width;
                trains[i].height = (trains[i].height * background.height) / oldBackground.height;
                for (var j = 0; j < trains[i].cars.length; j++) {
                    trains[i].cars[j].front.x = background.x + ((trains[i].cars[j].front.x - oldBackground.x) * background.width) / oldBackground.width;
                    trains[i].cars[j].back.x = background.x + ((trains[i].cars[j].back.x - oldBackground.x) * background.width) / oldBackground.width;
                    trains[i].cars[j].x = background.x + ((trains[i].cars[j].x - oldBackground.x) * background.width) / oldBackground.width;
                    trains[i].cars[j].front.y = background.y + ((trains[i].cars[j].front.y - oldBackground.y) * background.height) / oldBackground.height;
                    trains[i].cars[j].back.y = background.y + ((trains[i].cars[j].back.y - oldBackground.y) * background.height) / oldBackground.height;
                    trains[i].cars[j].front.z = (trains[i].cars[j].front.z * background.width) / oldBackground.width;
                    trains[i].cars[j].back.z = (trains[i].cars[j].back.z * background.width) / oldBackground.width;
                    trains[i].cars[j].y = background.y + ((trains[i].cars[j].y - oldBackground.y) * background.height) / oldBackground.height;
                    trains[i].cars[j].width = (trains[i].cars[j].width * background.width) / oldBackground.width;
                    trains[i].cars[j].height = (trains[i].cars[j].height * background.height) / oldBackground.height;
                }
            }
        }
    }
    function getAnimateInterval(interval = undefined) {
        function performanceTest() {
            const startTime = performance.now();
            for (var i = 0; i < 3; i++) {
                const startNo = 12500000;
                var newNo = 1;
                var res = 1;
                while (newNo < startNo) {
                    res *= startNo - newNo;
                    newNo++;
                }
            }
            return (performance.now() - startTime) / 90;
        }
        const defaultInterval = 22;
        if (typeof interval != "number") {
            interval = performanceTest();
        }
        return Math.min(Math.max(interval * defaultInterval, defaultInterval), 3 * defaultInterval);
    }
    function isRotationPointCircle(point) {
        return typeof point == "object" && point != null && "bezierLength" in point && typeof point.bezierLength == "object";
    }
    function updateStateNegative3V8(cO) {
        if (cO.state == -3) {
            if (cO.x > rotationPoints.outer.altState3.right.x[2] + background.x) {
                cO.stateLocal = 1;
            }
            else if (cO.x > rotationPoints.outer.altState3.right.x[1] + background.x) {
                cO.stateLocal = 2;
            }
            else if (cO.x > rotationPoints.outer.altState3.left.x[1] + background.x) {
                cO.stateLocal = 3;
            }
            else if (cO.x > rotationPoints.outer.altState3.left.x[2] + background.x) {
                cO.stateLocal = 4;
            }
            else {
                cO.stateLocal = 5;
            }
        }
    }
    if (message.data.k == "ready") {
        init = true;
        initState = message.data.state;
        firstRun = true;
        online = message.data.online;
        demoMode = message.data.demo;
        pause = false;
        syncing = false;
        debug = false;
        if (animateTimeout !== undefined && animateTimeout !== null) {
            clearTimeout(animateTimeout);
        }
        if (saveTheGameSendTimeout !== undefined && saveTheGameSendTimeout !== null) {
            clearTimeout(saveTheGameSendTimeout);
        }
        trains = copyJSObject(trainsDefault);
        for (var t = 0; t < trains.length; t++) {
            trains[t] = saveTrainCirclePrepare(trains[t], trainsDefault[t]);
            if (trains[t].circleFamily !== null) {
                const cF = trains[t].circleFamily;
                const c = trains[t].circle;
                trains[t].circleFamily = rotationPoints[cF];
                trains[t].circle = rotationPoints[cF][c];
            }
        }
        if (online) {
            animateTimeoutDelay = getAnimateInterval(message.data.onlineInterval);
        }
        else {
            animateTimeoutDelay = getAnimateInterval();
        }
        if (demoMode) {
            var i = Math.floor(Math.random() * trains.length);
            var j;
            do {
                j = Math.floor(Math.random() * trains.length);
            } while (trains.length >= 2 && i == j);
            trains[i].state = 1;
            trains[i].standardDirectionStartValue = Math.random() > 0.3;
            trains[i].circleFamily = rotationPoints.inner;
            trains[i].circle = rotationPoints.inner.wide;
            trains[i].demoModeMove = true;
            trains[j].state = 3;
            trains[j].standardDirectionStartValue = Math.random() > 0.7;
            trains[j].circleFamily = rotationPoints.outer;
            trains[j].circle = rotationPoints.outer.narrow;
            trains[j].demoModeMove = true;
            delete trains[i].circleStartPosDiv;
            delete trains[j].circleStartPosDiv;
            var newTrains = [];
            newTrains[0] = trains[i];
            newTrains[1] = trains[j];
            var newTrainIds = [i, j];
            var k;
            if (trains.length > newTrainIds.length && Math.random() > 0.3 && newTrains[0].standardDirectionStartValue) {
                do {
                    k = Math.floor(Math.random() * trains.length);
                } while (newTrainIds.includes(k));
                trains[k].demoModeEquals = 0;
                trains[k].state = newTrains[trains[k].demoModeEquals].state == 1 ? 3 : 1;
                trains[k].standardDirectionStartValue = newTrains[trains[k].demoModeEquals].standardDirectionStartValue;
                trains[k].circleFamily = newTrains[trains[k].demoModeEquals].circleFamily;
                trains[k].circle = newTrains[trains[k].demoModeEquals].circle;
                trains[k].speedFac = newTrains[trains[k].demoModeEquals].speedFac;
                trains[k].accelerationSpeedStartFac = newTrains[trains[k].demoModeEquals].accelerationSpeedStartFac;
                trains[k].accelerationSpeedFac = newTrains[trains[k].demoModeEquals].accelerationSpeedFac;
                trains[k].demoModeMove = true;
                delete trains[k].circleStartPosDiv;
                newTrains[newTrains.length] = trains[k];
                newTrainIds[newTrainIds.length] = k;
            }
            var l;
            if (trains.length > newTrainIds.length && Math.random() > 0.6) {
                do {
                    l = Math.floor(Math.random() * trains.length);
                } while (newTrainIds.includes(l));
                trains[l].demoModeEquals = 1;
                trains[l].state = newTrains[trains[l].demoModeEquals].state == 1 ? 3 : 1;
                trains[l].standardDirectionStartValue = newTrains[trains[l].demoModeEquals].standardDirectionStartValue;
                trains[l].circleFamily = newTrains[trains[l].demoModeEquals].circleFamily;
                trains[l].circle = newTrains[trains[l].demoModeEquals].circle;
                trains[l].speedFac = newTrains[trains[l].demoModeEquals].speedFac;
                trains[l].accelerationSpeedStartFac = newTrains[trains[l].demoModeEquals].accelerationSpeedStartFac;
                trains[l].accelerationSpeedFac = newTrains[trains[l].demoModeEquals].accelerationSpeedFac;
                trains[l].demoModeMove = true;
                delete trains[l].circleStartPosDiv;
                newTrains[newTrains.length] = trains[l];
                newTrainIds[newTrainIds.length] = l;
            }
            var m;
            if (trains.length > newTrainIds.length && Math.random() > 0.6 && newTrains[0].standardDirectionStartValue) {
                do {
                    m = Math.floor(Math.random() * trains.length);
                } while (newTrainIds.includes(m));
                trains[m].state = 111;
                trains[m].circleFamily = rotationPoints.inner;
                trains[m].circle = rotationPoints.inner.narrow;
                trains[m].demoModeMove = false;
                trains[m].standardDirectionStartValue = true;
                trains[m].circleStartPosDiv = 0.8;
                newTrains[newTrains.length] = trains[m];
                newTrainIds[newTrainIds.length] = m;
            }
            var n;
            if (trains.length > newTrainIds.length && Math.random() > 0.4 && newTrains[0].standardDirectionStartValue) {
                do {
                    n = Math.floor(Math.random() * trains.length);
                } while (newTrainIds.includes(n));
                trains[n].state = 121;
                trains[n].circleFamily = rotationPoints.inner;
                trains[n].circle = rotationPoints.inner.narrow;
                trains[n].demoModeMove = false;
                trains[n].standardDirectionStartValue = true;
                trains[n].circleStartPosDiv = 0.85;
                newTrains[newTrains.length] = trains[n];
                newTrainIds[newTrainIds.length] = n;
            }
            var o;
            if (trains.length > newTrainIds.length && Math.random() > 0.8 && newTrains[0].standardDirectionStartValue) {
                do {
                    o = Math.floor(Math.random() * trains.length);
                } while (newTrainIds.includes(o));
                trains[o].state = 131;
                trains[o].circleFamily = rotationPoints.inner;
                trains[o].circle = rotationPoints.inner.narrow;
                trains[o].demoModeMove = false;
                trains[o].standardDirectionStartValue = true;
                trains[o].circleStartPosDiv = 1;
                newTrains[newTrains.length] = trains[o];
                newTrainIds[newTrainIds.length] = o;
            }
            trains = newTrains;
        }
        postMessage({ k: "ready", trains: trains, trainParams: trainParams });
    }
    else if (message.data.k == "set") {
        trainPics = message.data.trainPics;
        postMessage({ k: "set", state: initState });
    }
    else if (message.data.k == "go") {
        background = message.data.background;
        init = false;
        switches = message.data.switches;
        switchesBeforeAddSidings = [0.008 * background.width, 0.012 * background.width];
        defineTrainParams();
        if (typeof message.data.savedTrains == "object") {
            /* UPDATE: v7.4.0 */
            for (var t = 0; t < trains.length && t < message.data.savedTrains.length; t++) {
                if (message.data.savedTrains[t].trainSwitchSrc == undefined) {
                    message.data.savedTrains[t].trainSwitchSrc = trains[t].trainSwitchSrc;
                }
            }
            /* END UPDATE: v7.4.0 */
            /* UPDATE: v8.0.0 */
            var addedTrainIds = [];
            for (var t = 0; t < trains.length; t++) {
                if (message.data.savedTrains[t] == undefined) {
                    placeTrainsAtInitialPositions(t);
                    message.data.savedTrains[t] = saveTrainCirclePrepare(trains[t], trains[t]);
                    addedTrainIds[addedTrainIds.length] = t;
                }
            }
            /* END UPDATE: v8.0.0 */
            trains = copyJSObject(message.data.savedTrains);
            for (var t = 0; t < trains.length; t++) {
                if (message.data.savedTrains[t].circleFamily != null) {
                    if (message.data.savedTrains[t].circleFamily == "outerUpper") {
                        /* UPDATE: v11.0.0 (beta 1) */
                        trains[t].circleFamily = rotationPoints["outer"];
                        trains[t].circle = rotationPoints["outer"]["narrow"];
                        /* END UPDATE: v11.0.0 (beta 1) */
                    }
                    else {
                        trains[t].circleFamily = rotationPoints[message.data.savedTrains[t].circleFamily];
                        trains[t].circle = rotationPoints[message.data.savedTrains[t].circleFamily][message.data.savedTrains[t].circle];
                    }
                }
                else if ([trains[t], ...trains[t].cars].some((object) => [object.front, object.back].some((bogie) => bogie.state > 300 && bogie.state < 400))) {
                    /* UPDATE: v11.0.0 (beta 1) */
                    trains[t].circleFamily = rotationPoints["outer"];
                    trains[t].circle = rotationPoints["outer"]["narrow"];
                    /* END UPDATE: v11.0.0 (beta 1) */
                }
                else {
                    // Without a circle family (while changing between them), the saved circle
                    // is a copy made for the saved background: link the circle it matches
                    const copy = message.data.savedTrains[t].circle;
                    const savedWidth = message.data.savedBg.width;
                    const circles = Object.values(rotationPoints).flatMap(function (family) {
                        return Object.values(family).filter(isRotationPointCircle);
                    });
                    const circle = circles.find(function (candidate) {
                        return candidate.x.every(function (x, k) {
                            return Math.abs(x / background.width - copy.x[k] / savedWidth) < 1e-6;
                        });
                    });
                    if (circle != undefined) {
                        trains[t].circle = circle;
                    }
                }
            }
            /* UPDATE: v11.0.0 */
            for (var t = 0; t < trains.length; t++) {
                if (trains[t].trainTurned == undefined) {
                    trains[t].trainTurned = false;
                }
                // Older versions marked a silent train with mute instead of a volume of 0
                if (message.data.savedTrains[t].mute) {
                    trains[t].volumeCustom = 0;
                }
                Reflect.deleteProperty(trains[t], "mute");
                [trains[t], ...trains[t].cars].forEach(function (object) {
                    [object.front, object.back].forEach(function (bogie) {
                        if (bogie.z == undefined) {
                            bogie.z = 0;
                        }
                        if (bogie.turned == undefined) {
                            bogie.turned = false;
                        }
                    });
                });
            }
            /* END UPDATE: v11.0.0 */
            resizeTrains(message.data.savedBg, addedTrainIds);
            /* UPDATE: v8.0.0 */
            for (var t = 0; t < trains.length; t++) {
                for (var i = -1; i < trains[t].cars.length; i++) {
                    if (i == -1) {
                        updateStateNegative3V8(trains[t].back);
                        updateStateNegative3V8(trains[t].front);
                    }
                    else {
                        updateStateNegative3V8(trains[t].cars[i].back);
                        updateStateNegative3V8(trains[t].cars[i].front);
                    }
                }
            }
            /* END UPDATE: v8.0.0 */
            /* UPDATE: v10.0.0 */
            trains[2].bogieDistance = 0.04;
            /* END UPDATE: v10.0.0 */
            /* UPDATE: v10.1.1 */
            trains[0].cars[0].wheels = {};
            trains[0].cars[0].wheels.front = {};
            trains[0].cars[0].wheels.back = {};
            trains[0].cars[0].wheels.front.use3d = true;
            trains[0].cars[0].wheels.back.use3d = true;
            trains[0].cars[1].wheels = {};
            trains[0].cars[1].wheels.front = {};
            trains[0].cars[1].wheels.back = {};
            trains[0].cars[1].wheels.front.use3d = true;
            trains[0].cars[1].wheels.back.use3d = true;
            trains[0].cars[2].wheels = {};
            trains[0].cars[2].wheels.front = {};
            trains[0].cars[2].wheels.back = {};
            trains[0].cars[2].wheels.front.use3d = true;
            trains[0].cars[2].wheels.back.use3d = true;
            trains[0].cars[3].wheels = {};
            trains[0].cars[3].wheels.front = {};
            trains[0].cars[3].wheels.back = {};
            trains[0].cars[3].wheels.front.use3d = true;
            trains[0].cars[3].wheels.back.use3d = true;
            trains[1].wheels = {};
            trains[1].wheels.front = {};
            trains[1].wheels.back = {};
            trains[1].wheels.front.use3d = true;
            trains[1].wheels.back.use3d = true;
            trains[1].cars[0].wheels = {};
            trains[1].cars[0].wheels.front = {};
            trains[1].cars[0].wheels.back = {};
            trains[1].cars[0].wheels.front.use3d = true;
            trains[1].cars[0].wheels.back.use3d = true;
            trains[1].cars[1].wheels = {};
            trains[1].cars[1].wheels.front = {};
            trains[1].cars[1].wheels.back = {};
            trains[1].cars[1].wheels.front.use3d = true;
            trains[1].cars[1].wheels.back.use3d = true;
            trains[1].cars[2].wheels = {};
            trains[1].cars[2].wheels.front = {};
            trains[1].cars[2].wheels.back = {};
            trains[1].cars[2].wheels.front.use3d = true;
            trains[1].cars[2].wheels.back.use3d = true;
            trains[2].wheels = {};
            trains[2].wheels.front = {};
            trains[2].wheels.back = {};
            trains[2].wheels.front.use3d = true;
            trains[2].wheels.back.use3d = true;
            trains[2].wheels.front.src2d = 39;
            trains[2].wheels.back.src2d = 38;
            trains[3].wheels = {};
            trains[3].wheels.front = {};
            trains[3].wheels.back = {};
            trains[3].wheels.front.use3d = true;
            trains[3].wheels.back.use3d = true;
            trains[3].cars[0].wheels = {};
            trains[3].cars[0].wheels.front = {};
            trains[3].cars[0].wheels.back = {};
            trains[3].cars[0].wheels.front.use3d = true;
            trains[3].cars[0].wheels.back.use3d = true;
            trains[3].cars[1].wheels = {};
            trains[3].cars[1].wheels.front = {};
            trains[3].cars[1].wheels.back = {};
            trains[3].cars[1].wheels.front.use3d = true;
            trains[3].cars[1].wheels.back.use3d = true;
            trains[3].cars[2].wheels = {};
            trains[3].cars[2].wheels.front = {};
            trains[3].cars[2].wheels.back = {};
            trains[3].cars[2].wheels.front.use3d = true;
            trains[3].cars[2].wheels.back.use3d = true;
            trains[4].wheels = {};
            trains[4].wheels.front = {};
            trains[4].wheels.back = {};
            trains[4].wheels.front.use3d = true;
            trains[4].wheels.back.use3d = true;
            trains[4].cars[0].wheels = {};
            trains[4].cars[0].wheels.front = {};
            trains[4].cars[0].wheels.back = {};
            trains[4].cars[0].wheels.front.use3d = true;
            trains[4].cars[0].wheels.back.use3d = true;
            trains[4].cars[1].wheels = {};
            trains[4].cars[1].wheels.front = {};
            trains[4].cars[1].wheels.back = {};
            trains[4].cars[1].wheels.front.use3d = true;
            trains[4].cars[1].wheels.back.use3d = true;
            trains[5].wheels = {};
            trains[5].wheels.front = {};
            trains[5].wheels.back = {};
            trains[5].wheels.front.use3d = true;
            trains[5].wheels.back.use3d = true;
            trains[5].cars[0].wheels = {};
            trains[5].cars[0].wheels.front = {};
            trains[5].cars[0].wheels.back = {};
            trains[5].cars[0].wheels.front.use3d = true;
            trains[5].cars[0].wheels.back.use3d = true;
            trains[5].cars[1].wheels = {};
            trains[5].cars[1].wheels.front = {};
            trains[5].cars[1].wheels.back = {};
            trains[5].cars[1].wheels.front.use3d = true;
            trains[5].cars[1].wheels.back.use3d = true;
            trains[6].cars[0].wheels = {};
            trains[6].cars[0].wheels.front = {};
            trains[6].cars[0].wheels.back = {};
            trains[6].cars[0].wheels.front.use3d = true;
            trains[6].cars[0].wheels.back.use3d = true;
            trains[6].cars[1].wheels = {};
            trains[6].cars[1].wheels.front = {};
            trains[6].cars[1].wheels.back = {};
            trains[6].cars[1].wheels.front.use3d = true;
            trains[6].cars[1].wheels.back.use3d = true;
            trains[6].cars[2].wheels = {};
            trains[6].cars[2].wheels.front = {};
            trains[6].cars[2].wheels.back = {};
            trains[6].cars[2].wheels.front.use3d = true;
            trains[6].cars[2].wheels.back.use3d = true;
            trains[6].cars[3].wheels = {};
            trains[6].cars[3].wheels.front = {};
            trains[6].cars[3].wheels.back = {};
            trains[6].cars[3].wheels.front.use3d = true;
            trains[6].cars[3].wheels.back.use3d = true;
            /* END UPDATE: v10.1.1 */
            /* UPDATE: v10.3.12 */
            trains[0].audioSrc = 0;
            trains[1].audioSrc = 1;
            trains[2].audioSrc = 2;
            trains[3].audioSrc = 3;
            trains[4].audioSrc = 4;
            trains[5].audioSrc = 5;
            trains[6].audioSrc = 6;
            /* END UPDATE: v10.3.12 */
        }
        else {
            placeTrainsAtInitialPositions();
        }
        animateObjects();
        if (demoMode) {
            trains.forEach(function (train) {
                if (train.demoModeMove) {
                    train.speedInPercent = train.demoModeEquals == undefined ? 50 + Math.random() * 50 : trains[train.demoModeEquals].speedInPercent;
                    train.move = true;
                    train.accelerationSpeedCustom = 1;
                }
            });
        }
    }
    else if (message.data.k == "resize") {
        background = message.data.background;
        for (var i = 0; i < trains.length; i++) {
            for (var j = 0; j < trains[i].circle.x.length; j++) {
                trains[i].circle.x[j] *= background.width / message.data.oldBackground.width;
                trains[i].circle.y[j] *= background.height / message.data.oldBackground.height;
            }
        }
        resizeTrains(message.data.oldBackground);
        defineTrainParams();
        for (var i = 0; i < switchesBeforeAddSidings.length; i++) {
            switchesBeforeAddSidings[i] *= background.width / message.data.oldBackground.width;
        }
        safePostMessage({ k: "setTrains", switches: switches, trains: trains, rotationPoints: rotationPoints, resized: true });
        saveTheGameSend();
    }
    else if (message.data.k == "train") {
        message.data.params.forEach(function (param) {
            trains[message.data.i][Object.keys(param)[0]] = Object.values(param)[0];
        });
    }
    else if (message.data.k == "switches") {
        switches = message.data.switches;
    }
    else if (message.data.k == "sync-request") {
        syncing = true;
    }
    else if (message.data.k == "sync-t") {
        Object.keys(message.data.d).forEach(function (key) {
            trains[message.data.i][key] = message.data.d[key];
        });
        trains[message.data.i].front.x = background.x + trains[message.data.i].front.x * background.width;
        trains[message.data.i].back.x = background.x + trains[message.data.i].back.x * background.width;
        trains[message.data.i].x = background.x + trains[message.data.i].x * background.width;
        trains[message.data.i].front.y = background.y + trains[message.data.i].front.y * background.height;
        trains[message.data.i].back.y = background.y + trains[message.data.i].back.y * background.height;
        trains[message.data.i].y = background.y + trains[message.data.i].y * background.height;
        trains[message.data.i].front.z *= background.width;
        trains[message.data.i].back.z *= background.width;
        if (trains[message.data.i].circleFamily != null) {
            const cF = trains[message.data.i].circleFamily;
            const c = trains[message.data.i].circle;
            trains[message.data.i].circleFamily = rotationPoints[cF];
            trains[message.data.i].circle = rotationPoints[cF][c];
        }
        defineTrainSpeed(trains[message.data.i]);
    }
    else if (message.data.k == "sync-tc") {
        Object.keys(message.data.d).forEach(function (key) {
            trains[message.data.i[0]].cars[message.data.i[1]][key] = message.data.d[key];
        });
        trains[message.data.i[0]].cars[message.data.i[1]].front.x = background.x + trains[message.data.i[0]].cars[message.data.i[1]].front.x * background.width;
        trains[message.data.i[0]].cars[message.data.i[1]].back.x = background.x + trains[message.data.i[0]].cars[message.data.i[1]].back.x * background.width;
        trains[message.data.i[0]].cars[message.data.i[1]].x = background.x + trains[message.data.i[0]].cars[message.data.i[1]].x * background.width;
        trains[message.data.i[0]].cars[message.data.i[1]].front.y = background.y + trains[message.data.i[0]].cars[message.data.i[1]].front.y * background.height;
        trains[message.data.i[0]].cars[message.data.i[1]].back.y = background.y + trains[message.data.i[0]].cars[message.data.i[1]].back.y * background.height;
        trains[message.data.i[0]].cars[message.data.i[1]].y = background.y + trains[message.data.i[0]].cars[message.data.i[1]].y * background.height;
        trains[message.data.i[0]].cars[message.data.i[1]].front.z *= background.width;
        trains[message.data.i[0]].cars[message.data.i[1]].back.z *= background.width;
    }
    else if (message.data.k == "pause") {
        pause = true;
    }
    else if (message.data.k == "resume") {
        pause = false;
        animateObjects();
    }
    else if (message.data.k == "game-saved") {
        if (saveTheGameSendTimeout !== undefined && saveTheGameSendTimeout !== null) {
            clearTimeout(saveTheGameSendTimeout);
        }
        if (init) {
            return;
        }
        saveTheGameSendTimeout = setTimeout(saveTheGameSend, 5000);
    }
    else if (message.data.k == "enable-save-game") {
        saveTheGameSend();
    }
    else if (message.data.k == "debug") {
        debug = true;
        safePostMessage({ k: "debug", animateInterval: animateTimeoutDelay, trains: trains, switchesBeforeFac: switchesBeforeFac, switchesBeforeAddSidings: switchesBeforeAddSidings });
    }
};
