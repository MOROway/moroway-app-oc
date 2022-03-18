function saveTheGameSend() {
    var saveTrains = JSON.parse(JSON.stringify(trains));
    for (var t = 0; t < saveTrains.length; t++) {
        delete saveTrains[t].lastDirectionChange;
        if (trains[t].circleFamily != null) {
            var cF = Object.keys(rotationPoints).filter(function (key) {
                return rotationPoints[key] === trains[t].circleFamily;
            })[0];
            var c = Object.keys(rotationPoints[cF]).filter(function (key) {
                return rotationPoints[cF][key] === trains[t].circle;
            })[0];
            saveTrains[t].circleFamily = cF;
            saveTrains[t].circle = c;
        }
    }
    postMessage({k: "save-game", saveTrains: saveTrains});
}
function changeCOSection(cO, isFront, input1, i, reverse) {
    if (reverse == undefined) {
        reverse = false;
    }
    if ((trains[input1].standardDirection && !reverse) || (!trains[input1].standardDirection && reverse)) {
        // Switch sections
        if (cO.state == 1 && Math.round(cO.x - background.x) >= Math.round(trains[input1].circle.x[1])) {
            if (isFront && i == -1 && trains[input1].circleFamily == rotationPoints.outer && switches.outer2inner.right.turned) {
                trains[input1].switchCircles = true;
                trains[input1].circleFamily = null;
            }
            cO.stateChange = true;
            cO.state = trains[input1].switchCircles ? -2 : 2;
        } else if (Math.abs(cO.state) == 2 && Math.round(cO.x - background.x) <= Math.round(trains[input1].switchCircles ? rotationPoints.inner.narrow.x[2] : trains[input1].circle.x[2]) && cO.y - background.y > trains[input1].circle.y[1] + (trains[input1].circle.y[2] - trains[input1].circle.y[1]) / 2) {
            if (cO.state == -2 && !isFront && i == trains[input1].cars.length - 1) {
                trains[input1].circle = rotationPoints.inner.narrow;
                trains[input1].circleFamily = rotationPoints.inner;
                trains[input1].switchCircles = false;
            }
            cO.stateChange = true;
            cO.state = (trains[input1].circleFamily == rotationPoints.outer && switches.outerAltState3.right.turned && isFront && i == -1) || trains[input1].front.state == -3 ? -3 : 3;
        } else if ((Math.abs(cO.state) == 3 || cO.state > 100) && Math.round(cO.x - background.x) <= Math.round(trains[input1].circle.x[3])) {
            if (isFront && i == -1 && trains[input1].circleFamily == rotationPoints.inner && switches.inner2outer.left.turned) {
                trains[input1].switchCircles = true;
                trains[input1].circleFamily = null;
            } else if (isFront && i == -1 && trains[input1].circleFamily == rotationPoints.inner && switches.innerWide.left.turned) {
                trains[input1].circle = rotationPoints.inner.wide;
            } else if (isFront && i == -1 && trains[input1].circleFamily == rotationPoints.inner) {
                trains[input1].circle = rotationPoints.inner.narrow;
            }
            cO.stateChange = true;
            cO.state = trains[input1].switchCircles ? -4 : 4;
        } else if (Math.abs(cO.state) == 4 && Math.round(cO.x - background.x) >= Math.round(trains[input1].switchCircles ? rotationPoints.outer.narrow.x[0] : trains[input1].circle.x[0]) && cO.y - background.y < trains[input1].circle.y[0] + (trains[input1].circle.y[3] - trains[input1].circle.y[0]) / 2) {
            if (cO.state == -4 && !isFront && i == trains[input1].cars.length - 1) {
                trains[input1].circle = rotationPoints.outer.narrow;
                trains[input1].circleFamily = rotationPoints.outer;
                trains[input1].switchCircles = false;
            }
            cO.stateChange = true;
            cO.state = 1;
        } else if (Math.abs(cO.state) == 111 && Math.round(cO.x - background.x) <= Math.round(rotationPoints.inner.sidings.firstS1.x[0])) {
            cO.stateChange = true;
            cO.state = 110;
        } else if (Math.abs(cO.state) == 112 && Math.round(cO.x - background.x) <= Math.round(rotationPoints.inner.sidings.firstS2.x[0])) {
            cO.stateChange = true;
            cO.state = 111;
        } else if (Math.abs(cO.state) == 121 && Math.round(cO.x - background.x) <= Math.round(rotationPoints.inner.sidings.secondS1.x[0])) {
            cO.stateChange = true;
            cO.state = 120;
        } else if (Math.abs(cO.state) == 122 && Math.round(cO.x - background.x) <= Math.round(rotationPoints.inner.sidings.secondS2.x[0])) {
            cO.stateChange = true;
            cO.state = 121;
        } else if (Math.abs(cO.state) == 131 && Math.round(cO.x - background.x) <= Math.round(rotationPoints.inner.sidings.thirdS1.x[0])) {
            cO.stateChange = true;
            cO.state = 130;
        } else if (Math.abs(cO.state) == 132 && Math.round(cO.x - background.x) <= Math.round(rotationPoints.inner.sidings.thirdS2.x[0])) {
            cO.stateChange = true;
            cO.state = 131;
        }
    } else {
        if (cO.state == 1 && Math.round(cO.x - background.x) <= Math.round(trains[input1].circle.x[0])) {
            if (!isFront && i == trains[input1].cars.length - 1 && trains[input1].circleFamily == rotationPoints.outer && switches.outer2inner.left.turned) {
                trains[input1].switchCircles = true;
                trains[input1].circleFamily = null;
            }
            cO.stateChange = true;
            cO.state = trains[input1].switchCircles ? -4 : 4;
        } else if (Math.abs(cO.state) == 2 && Math.round(cO.x - background.x) <= Math.round(trains[input1].switchCircles ? rotationPoints.outer.narrow.x[1] : trains[input1].circle.x[1]) && cO.y - background.y < trains[input1].circle.y[1] + (trains[input1].circle.y[2] - trains[input1].circle.y[1]) / 2) {
            if (cO.state == -2 && isFront && i == -1) {
                trains[input1].circle = rotationPoints.outer.narrow;
                trains[input1].circleFamily = rotationPoints.outer;
                trains[input1].switchCircles = false;
            }
            cO.stateChange = true;
            cO.state = 1;
        } else if (Math.abs(cO.state) == 3 && Math.round(cO.x - background.x) >= Math.round(trains[input1].circle.x[2]) && Math.round(cO.y - background.y) >= background.height / 2) {
            if (!isFront && i == trains[input1].cars.length - 1 && trains[input1].circleFamily == rotationPoints.inner && switches.inner2outer.right.turned) {
                trains[input1].switchCircles = true;
                trains[input1].circleFamily = null;
            } else if (!isFront && i == trains[input1].cars.length - 1 && trains[input1].circleFamily == rotationPoints.inner && switches.innerWide.right.turned) {
                trains[input1].circle = rotationPoints.inner.wide;
            } else if (!isFront && i == trains[input1].cars.length - 1 && trains[input1].circleFamily == rotationPoints.inner) {
                trains[input1].circle = rotationPoints.inner.narrow;
            }
            cO.stateChange = true;
            cO.state = trains[input1].switchCircles ? -2 : 2;
        } else if (Math.abs(cO.state) == 4 && Math.round(cO.x - background.x) >= Math.round(trains[input1].switchCircles ? rotationPoints.inner.narrow.x[3] : trains[input1].circle.x[3]) && cO.y - background.y > trains[input1].circle.y[0] + (trains[input1].circle.y[3] - trains[input1].circle.y[0]) / 2) {
            if (cO.state == -4 && isFront && i == -1) {
                trains[input1].circle = rotationPoints.inner.narrow;
                trains[input1].circleFamily = rotationPoints.inner;
                trains[input1].switchCircles = false;
            }
            cO.stateChange = true;
            cO.state = (trains[input1].circleFamily == rotationPoints.outer && switches.outerAltState3.left.turned && ((trains[input1].cars.length === 0 && trains[input1].back.state == -3) || (trains[input1].cars.length === 0 && !isFront) || (trains[input1].cars.length > 0 && !isFront && i == trains[input1].cars.length - 1))) || (trains[input1].cars.length > 0 && trains[input1].cars[trains[input1].cars.length - 1].back.state == -3) ? -3 : 3;
            var lastObj = trains[input1].cars.length == 0 ? trains[input1] : trains[input1].cars[trains[input1].cars.length - 1];
            if ((trains[input1].circleFamily == null || trains[input1].circleFamily == rotationPoints.inner) && ((!isFront && i == trains[input1].cars.length - 1 && switches.sidings1.left.turned) || lastObj.back.state > 100)) {
                if ((trains[input1].circleFamily == null || trains[input1].circleFamily == rotationPoints.inner) && ((!isFront && i == trains[input1].cars.length - 1 && switches.sidings2.left.turned) || (lastObj.back.state >= 110 && lastObj.back.state < 120))) {
                    cO.state = 110;
                } else if ((trains[input1].circleFamily == null || trains[input1].circleFamily == rotationPoints.inner) && ((!isFront && i == trains[input1].cars.length - 1 && switches.sidings3.left.turned) || (lastObj.back.state >= 110 && lastObj.back.state < 130))) {
                    cO.state = 120;
                } else {
                    cO.state = 130;
                }
            }
        } else if (Math.abs(cO.state) == 110 && Math.round(cO.x - background.x) >= Math.round(rotationPoints.inner.sidings.first.x[3])) {
            cO.stateChange = true;
            cO.state = 111;
        } else if (Math.abs(cO.state) == 111 && Math.round(cO.x - background.x) >= Math.round(rotationPoints.inner.sidings.firstS1.x[1])) {
            cO.stateChange = true;
            cO.state = 112;
        } else if (Math.abs(cO.state) == 112 && cO.x - background.x - rotationPoints.inner.sidings.firstS2.x[0] >= 0.95 * (rotationPoints.inner.sidings.firstS2.x[3] - rotationPoints.inner.sidings.firstS2.x[0])) {
            trains[input1].move = false;
            trains[input1].endOfTrack = true;
            trains[input1].endOfTrackStandardDirection = false;
        } else if (Math.abs(cO.state) == 120 && Math.round(cO.x - background.x) >= Math.round(rotationPoints.inner.sidings.second.x[3])) {
            cO.stateChange = true;
            cO.state = 121;
        } else if (Math.abs(cO.state) == 121 && Math.round(cO.x - background.x) >= Math.round(rotationPoints.inner.sidings.secondS1.x[1])) {
            cO.stateChange = true;
            cO.state = 122;
        } else if (Math.abs(cO.state) == 122 && cO.x - background.x - rotationPoints.inner.sidings.secondS2.x[0] >= 0.95 * (rotationPoints.inner.sidings.secondS2.x[3] - rotationPoints.inner.sidings.secondS2.x[0])) {
            trains[input1].move = false;
            trains[input1].endOfTrack = true;
            trains[input1].endOfTrackStandardDirection = false;
        } else if (Math.abs(cO.state) == 130 && Math.round(cO.x - background.x) >= Math.round(rotationPoints.inner.sidings.third.x[3])) {
            cO.stateChange = true;
            cO.state = 131;
        } else if (Math.abs(cO.state) == 131 && Math.round(cO.x - background.x) >= Math.round(rotationPoints.inner.sidings.thirdS1.x[1])) {
            cO.stateChange = true;
            cO.state = 132;
        } else if (Math.abs(cO.state) == 132 && cO.x - background.x - rotationPoints.inner.sidings.thirdS2.x[0] >= 0.95 * (rotationPoints.inner.sidings.thirdS2.x[3] - rotationPoints.inner.sidings.thirdS2.x[0])) {
            trains[input1].move = false;
            trains[input1].endOfTrack = true;
            trains[input1].endOfTrackStandardDirection = false;
        }
    }
}

function setCOPos(cO, isFront, input1, currentObject, i, speed, customSpeed) {
    function setCOPosLinear(linearPoints, isBackwards, isRotated) {
        var angleCorr = isRotated ? Math.PI : 0;
        var calcCorr = 1;
        if ((isRotated && !isBackwards) || (!isRotated && isBackwards)) {
            calcCorr = -1;
        }
        var x = cO.x;
        var y = cO.y;
        var angle = Math.asin((linearPoints.y[1] - linearPoints.y[0]) / (linearPoints.x[1] - linearPoints.x[0]));
        var hypotenuse = Math.sqrt(Math.pow(x - linearPoints.x[0], 2) + Math.pow(y - linearPoints.y[0], 2), 2);
        hypotenuse += speed * customSpeed;
        x = linearPoints.x[0] + calcCorr * (Math.cos(angle) * hypotenuse);
        y = linearPoints.y[0] + calcCorr * (Math.sin(angle) * hypotenuse);
        angle += angleCorr;
        cO.x = x;
        cO.y = y;
        cO.angle = angle;
    }

    function getBezierPoints(fac, a, b, c, d) {
        return Math.pow(1 - fac, 3) * a + 3 * fac * Math.pow(1 - fac, 2) * b + 3 * Math.pow(fac, 2) * (1 - fac) * c + Math.pow(fac, 3) * d;
    }
    function getBezierFac(fac, approxNO, maxDuration, cCO, bezierPoints, closeEnough) {
        if (closeEnough == undefined) {
            closeEnough = 0.1;
        }
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
    }
    var points;
    if (cO.state == 1) {
        // Calc bogie position
        if (cO.stateChange) {
            cO.stateChange = false;
        }
        points = {x: [trains[input1].circle.x[0] + background.x, trains[input1].circle.x[1] + background.x], y: [trains[input1].circle.y[0] + background.y, trains[input1].circle.y[1] + background.y]};
        var pointsSwitch = {x: [rotationPoints.outer.narrow.x[0] + background.x, rotationPoints.outer.narrow.x[1] + background.x], y: [rotationPoints.outer.narrow.y[0] + background.y, rotationPoints.outer.narrow.y[1] + background.y]};
        if (!trains[input1].standardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (!trains[input1].standardDirection) {
            pointsSwitch.x.reverse();
            pointsSwitch.y.reverse();
        }
        setCOPosLinear(trains[input1].switchCircles ? pointsSwitch : points, !trains[input1].standardDirection, false);
    } else if (Math.abs(cO.state) == 2) {
        cO.state = trains[input1].switchCircles ? -2 : 2;
        var pointsSwitch = {x: [rotationPoints.outer.narrow.x[1] + background.x, rotationPoints.inner2outer.right.x[1] + background.x, rotationPoints.inner2outer.right.x[2] + background.x, rotationPoints.inner.narrow.x[2] + background.x], y: [rotationPoints.outer.narrow.y[1] + background.y, rotationPoints.inner2outer.right.y[1] + background.y, rotationPoints.inner2outer.right.y[2] + background.y, rotationPoints.inner.narrow.y[2] + background.y]};
        points = {x: [trains[input1].circle.x[1] + background.x, trains[input1].circle.x[4] + background.x, trains[input1].circle.x[5] + background.x, trains[input1].circle.x[2] + background.x], y: [trains[input1].circle.y[1] + background.y, trains[input1].circle.y[4] + background.y, trains[input1].circle.y[5] + background.y, trains[input1].circle.y[2] + background.y]};
        if (cO.stateChange) {
            cO.angle = trains[input1].standardDirection ? 0 : Math.PI;
            cO.currentCurveFac = getBezierFac(trains[input1].standardDirection ? 0 : 1, 2000, 1000, cO, trains[input1].switchCircles ? pointsSwitch : points);
            cO.stateChange = false;
        }
        setCOPosBezier(trains[input1].switchCircles ? pointsSwitch : points, !trains[input1].standardDirection, trains[input1].switchCircles ? rotationPoints.inner2outer.right.bezierLength : trains[input1].circle.bezierLength.right);
        if ((trains[input1].circleFamily == null || trains[input1].circleFamily == rotationPoints.outer) && trains[input1].standardDirection && isFront && i == -1) {
            if ((cO.y - background.y) * switchesBeforeFac < switches.outer2inner.right.y && trains[input1].switchCircles != switches.outer2inner.right.turned) {
                trains[input1].switchCircles = !trains[input1].switchCircles;
                cO.state *= -1;
                cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 5000, 1000, cO, !trains[input1].switchCircles ? pointsSwitch : points);
            }
            trains[input1].circleFamily = trains[input1].switchCircles ? null : rotationPoints.outer;
            trains[input1].circle = rotationPoints.outer.narrow;
        } else if (!trains[input1].standardDirection && trains[input1].circleFamily == rotationPoints.inner && !isFront && i == trains[input1].cars.length - 1 && cO.y - background.y > switches.innerWide.right.y * switchesBeforeFac && ((trains[input1].circle == rotationPoints.inner.wide && !switches.innerWide.right.turned) || (trains[input1].circle == rotationPoints.inner.narrow && switches.innerWide.right.turned))) {
            var pointsAlt = trains[input1].circle == rotationPoints.inner.wide ? {x: [rotationPoints.inner.narrow.x[1] + background.x, rotationPoints.inner.narrow.x[4] + background.x, rotationPoints.inner.narrow.x[5] + background.x, rotationPoints.inner.narrow.x[2] + background.x], y: [rotationPoints.inner.narrow.y[1] + background.y, rotationPoints.inner.narrow.y[4] + background.y, rotationPoints.inner.narrow.y[5] + background.y, rotationPoints.inner.narrow.y[2] + background.y]} : {x: [rotationPoints.inner.wide.x[1] + background.x, rotationPoints.inner.wide.x[4] + background.x, rotationPoints.inner.wide.x[5] + background.x, rotationPoints.inner.wide.x[2] + background.x], y: [rotationPoints.inner.wide.y[1] + background.y, rotationPoints.inner.wide.y[4] + background.y, rotationPoints.inner.wide.y[5] + background.y, rotationPoints.inner.wide.y[2] + background.y]};
            trains[input1].circle = trains[input1].circle == rotationPoints.inner.wide ? rotationPoints.inner.narrow : rotationPoints.inner.wide;
            trains[input1].front.currentCurveFac = getBezierFac(trains[input1].front.currentCurveFac, 5000, 1000, trains[input1].front, pointsAlt);
        }
    } else if (cO.state == 3) {
        if (cO.stateChange) {
            cO.stateChange = false;
        }
        points = {x: [trains[input1].circle.x[2] + background.x, trains[input1].circle.x[3] + background.x], y: [trains[input1].circle.y[2] + background.y, trains[input1].circle.y[3] + background.y]};
        var pointsSwitch = {x: [rotationPoints.inner.narrow.x[2] + background.x, rotationPoints.inner.narrow.x[3] + background.x], y: [rotationPoints.inner.narrow.y[2] + background.y, rotationPoints.inner.narrow.y[3] + background.y]};
        if (!trains[input1].standardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (!trains[input1].standardDirection) {
            pointsSwitch.x.reverse();
            pointsSwitch.y.reverse();
        }
        setCOPosLinear(trains[input1].switchCircles ? pointsSwitch : points, !trains[input1].standardDirection, true, false);
    } else if (cO.state == -3) {
        if (trains[input1].circleFamily == rotationPoints.outer) {
            if (cO.x > rotationPoints.outer.altState3.right.x[1] + background.x) {
                if (cO.x - background.x > rotationPoints.outer.altState3.right.x[2]) {
                    points = {x: [background.x + rotationPoints.outer.altState3.right.x[0], background.x + rotationPoints.outer.altState3.right.x[3], background.x + rotationPoints.outer.altState3.right.x[3], background.x + rotationPoints.outer.altState3.right.x[2]], y: [background.y + rotationPoints.outer.altState3.right.y[0], background.y + rotationPoints.outer.altState3.right.y[3], background.y + rotationPoints.outer.altState3.right.y[3], background.y + rotationPoints.outer.altState3.right.y[2]]};
                    if (cO.stateChange && trains[input1].standardDirection) {
                        cO.currentCurveFac = getBezierFac(0, 2000, 1000, cO, points);
                        cO.stateLocal = 1;
                        cO.stateChange = false;
                    } else if (cO.stateLocal == 2 && !trains[input1].standardDirection) {
                        cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 2000, 1000, cO, points);
                        cO.stateLocal = 1;
                    }
                    setCOPosBezier(points, !trains[input1].standardDirection, 0.5 * rotationPoints.outer.altState3.right.bezierLength);
                } else {
                    points = {x: [background.x + rotationPoints.outer.altState3.right.x[2], background.x + rotationPoints.outer.altState3.right.x[4], background.x + rotationPoints.outer.altState3.right.x[4], background.x + rotationPoints.outer.altState3.right.x[1]], y: [background.y + rotationPoints.outer.altState3.right.y[2], background.y + rotationPoints.outer.altState3.right.y[4], background.y + rotationPoints.outer.altState3.right.y[4], background.y + rotationPoints.outer.altState3.right.y[1]]};
                    points.x.reverse();
                    points.y.reverse();
                    if (cO.stateChangeLocal && !trains[input1].standardDirection) {
                        cO.currentCurveFac = getBezierFac(0, 2000, 1000, cO, points);
                        cO.stateChangeLocal = false;
                    } else if (cO.stateLocal == 1 && trains[input1].standardDirection) {
                        cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 2000, 1000, cO, points);
                        cO.stateLocal = 2;
                    }
                    setCOPosBezier(points, trains[input1].standardDirection, 0.5 * rotationPoints.outer.altState3.right.bezierLength);
                    cO.angle += Math.PI;
                }
            } else if (cO.x > rotationPoints.outer.altState3.left.x[1] + background.x) {
                points = {x: [rotationPoints.outer.altState3.right.x[1] + background.x, rotationPoints.outer.altState3.left.x[1] + background.x], y: [rotationPoints.outer.altState3.right.y[1] + background.y, rotationPoints.outer.altState3.left.y[1] + background.y]};
                if (!trains[input1].standardDirection) {
                    points.x.reverse();
                    points.y.reverse();
                }
                setCOPosLinear(points, !trains[input1].standardDirection, true);
                cO.stateChangeLocal = true;
            } else {
                if (cO.x - background.x > rotationPoints.outer.altState3.left.x[2]) {
                    var x1 = rotationPoints.outer.altState3.left.x[1] + background.x;
                    var x2 = rotationPoints.outer.altState3.left.x[2] + background.x;
                    var x3 = rotationPoints.outer.altState3.left.x[4] + background.x;
                    var y1 = rotationPoints.outer.altState3.left.y[1] + background.y;
                    var y2 = rotationPoints.outer.altState3.left.y[2] + background.y;
                    var y3 = rotationPoints.outer.altState3.left.y[4] + background.y;
                    points = {x: [x1, x3, x3, x2], y: [y1, y3, y3, y2]};
                    if (cO.stateChangeLocal && trains[input1].standardDirection) {
                        cO.currentCurveFac = getBezierFac(0, 2000, 1000, cO, points);
                        cO.stateChangeLocal = false;
                    } else if (cO.stateLocal == 1 && !trains[input1].standardDirection) {
                        cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 2000, 1000, cO, points);
                        cO.stateLocal = 2;
                    }
                    setCOPosBezier(points, !trains[input1].standardDirection, 0.5 * rotationPoints.outer.altState3.left.bezierLength);
                } else {
                    var x1 = rotationPoints.outer.altState3.left.x[2] + background.x;
                    var x2 = rotationPoints.outer.altState3.left.x[0] + background.x;
                    var x3 = rotationPoints.outer.altState3.left.x[3] + background.x;
                    var y1 = rotationPoints.outer.altState3.left.y[2] + background.y;
                    var y2 = rotationPoints.outer.altState3.left.y[0] + background.y;
                    var y3 = rotationPoints.outer.altState3.left.y[3] + background.y;
                    points = {x: [x1, x3, x3, x2], y: [y1, y3, y3, y2]};
                    points.x.reverse();
                    points.y.reverse();
                    if (cO.stateChange && !trains[input1].standardDirection) {
                        cO.currentCurveFac = getBezierFac(0, 2000, 1000, cO, points);
                        cO.stateLocal = 1;
                        cO.stateChange = false;
                    } else if (cO.stateLocal == 2 && trains[input1].standardDirection) {
                        cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 2000, 1000, cO, points);
                        cO.stateLocal = 1;
                    }
                    setCOPosBezier(points, trains[input1].standardDirection, 0.5 * rotationPoints.outer.altState3.left.bezierLength);
                    cO.angle += Math.PI;
                }
            }
        }
    } else if (Math.abs(cO.state) == 4) {
        cO.state = trains[input1].switchCircles ? -4 : 4;
        var pointsSwitch = {x: [rotationPoints.inner.narrow.x[3] + background.x, rotationPoints.inner2outer.left.x[1] + background.x, rotationPoints.inner2outer.left.x[2] + background.x, rotationPoints.outer.narrow.x[0] + background.x], y: [rotationPoints.inner.narrow.y[3] + background.y, rotationPoints.inner2outer.left.y[1] + background.y, rotationPoints.inner2outer.left.y[2] + background.y, rotationPoints.outer.narrow.y[0] + background.y]};
        points = {x: [trains[input1].circle.x[3] + background.x, trains[input1].circle.x[6] + background.x, trains[input1].circle.x[7] + background.x, trains[input1].circle.x[0] + background.x], y: [trains[input1].circle.y[3] + background.y, trains[input1].circle.y[6] + background.y, trains[input1].circle.y[7] + background.y, trains[input1].circle.y[0] + background.y]};
        if (cO.stateChange) {
            cO.angle = trains[input1].standardDirection ? Math.PI : 2 * Math.PI;
            cO.currentCurveFac = getBezierFac(trains[input1].standardDirection ? 0 : 1, 2000, 1000, cO, trains[input1].switchCircles ? pointsSwitch : points);
            cO.stateChange = false;
        }
        setCOPosBezier(trains[input1].switchCircles ? pointsSwitch : points, !trains[input1].standardDirection, trains[input1].switchCircles ? rotationPoints.inner2outer.left.bezierLength : trains[input1].circle.bezierLength.left);
        if ((trains[input1].circleFamily == null || trains[input1].circleFamily == rotationPoints.outer) && !trains[input1].standardDirection && !isFront && i == trains[input1].cars.length - 1) {
            if ((cO.y - background.y) * switchesBeforeFac < switches.outer2inner.left.y && trains[input1].switchCircles != switches.outer2inner.left.turned) {
                trains[input1].switchCircles = !trains[input1].switchCircles;
                cO.state *= -1;
                trains[input1].front.currentCurveFac = getBezierFac(trains[input1].front.currentCurveFac, 5000, 1000, trains[input1].front, !trains[input1].switchCircles ? pointsSwitch : points);
            }
            trains[input1].circleFamily = trains[input1].switchCircles ? null : rotationPoints.outer;
            trains[input1].circle = rotationPoints.outer.narrow;
        } else if (trains[input1].standardDirection && trains[input1].circleFamily == rotationPoints.inner && isFront && i == -1 && cO.y - background.y > switches.innerWide.left.y * switchesBeforeFac && ((trains[input1].circle == rotationPoints.inner.wide && !switches.innerWide.left.turned) || (trains[input1].circle == rotationPoints.inner.narrow && switches.innerWide.left.turned))) {
            var pointsAlt = trains[input1].circle == rotationPoints.inner.wide ? {x: [rotationPoints.inner.narrow.x[3] + background.x, rotationPoints.inner.narrow.x[6] + background.x, rotationPoints.inner.narrow.x[7] + background.x, rotationPoints.inner.narrow.x[0] + background.x], y: [rotationPoints.inner.narrow.y[3] + background.y, rotationPoints.inner.narrow.y[6] + background.y, rotationPoints.inner.narrow.y[7] + background.y, rotationPoints.inner.narrow.y[0] + background.y]} : {x: [rotationPoints.inner.wide.x[3] + background.x, rotationPoints.inner.wide.x[6] + background.x, rotationPoints.inner.wide.x[7] + background.x, rotationPoints.inner.wide.x[0] + background.x], y: [rotationPoints.inner.wide.y[3] + background.y, rotationPoints.inner.wide.y[6] + background.y, rotationPoints.inner.wide.y[7] + background.y, rotationPoints.inner.wide.y[0] + background.y]};
            trains[input1].circle = trains[input1].circle == rotationPoints.inner.wide ? rotationPoints.inner.narrow : rotationPoints.inner.wide;
            cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 5000, 1000, cO, pointsAlt);
        }
    } else if (cO.state == 110) {
        points = {x: [rotationPoints.inner.sidings.first.x[0] + background.x, rotationPoints.inner.sidings.first.x[1] + background.x, rotationPoints.inner.sidings.first.x[2] + background.x, rotationPoints.inner.sidings.first.x[3] + background.x], y: [rotationPoints.inner.sidings.first.y[0] + background.y, rotationPoints.inner.sidings.first.y[1] + background.y, rotationPoints.inner.sidings.first.y[2] + background.y, rotationPoints.inner.sidings.first.y[3] + background.y]};
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(trains[input1].standardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        if (cO.stateChangeLocal) {
            cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 1000, 2100, cO, points, 0.005);
            cO.stateChangeLocal = false;
        }
        var lastObj = trains[input1].cars.length == 0 ? trains[input1] : trains[input1].cars[trains[input1].cars.length - 1];
        setCOPosBezier(points, !trains[input1].standardDirection, rotationPoints.inner.sidings.first.bezierLength);
        if (!trains[input1].standardDirection && ((!isFront && i == trains[input1].cars.length - 1 && cO.y - background.y > switches.sidings2.left.y + switchesBeforeAddSidings[0] && !switches.sidings2.left.turned) || ((isFront || i != trains[input1].cars.length - 1) && lastObj.back.state >= 120))) {
            cO.state = !isFront && i == trains[input1].cars.length - 1 ? (switches.sidings3.left.turned ? 120 : 130) : lastObj.back.state >= 130 ? 130 : 120;
            cO.stateChangeLocal = true;
        }
    } else if (cO.state == 111) {
        points = {x: [rotationPoints.inner.sidings.firstS1.x[0] + background.x, rotationPoints.inner.sidings.firstS1.x[1] + background.x], y: [rotationPoints.inner.sidings.firstS1.y[0] + background.y, rotationPoints.inner.sidings.firstS1.y[1] + background.y]};
        if (trains[input1].standardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (cO.stateChange) {
            cO.angle = Math.PI;
            cO.stateChange = false;
        }
        setCOPosLinear(points, !trains[input1].standardDirection, true, false);
    } else if (cO.state == 112) {
        if (trains[input1].standardDirection) {
            trains[input1].endOfTrack = false;
        }
        points = {x: [rotationPoints.inner.sidings.firstS2.x[0] + background.x, rotationPoints.inner.sidings.firstS2.x[1] + background.x, rotationPoints.inner.sidings.firstS2.x[2] + background.x, rotationPoints.inner.sidings.firstS2.x[3] + background.x], y: [rotationPoints.inner.sidings.firstS2.y[0] + background.y, rotationPoints.inner.sidings.firstS2.y[1] + background.y, rotationPoints.inner.sidings.firstS2.y[2] + background.y, rotationPoints.inner.sidings.firstS2.y[3] + background.y]};
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !trains[input1].standardDirection, rotationPoints.inner.sidings.firstS2.bezierLength);
    } else if (cO.state == 120) {
        points = {x: [rotationPoints.inner.sidings.second.x[0] + background.x, rotationPoints.inner.sidings.second.x[1] + background.x, rotationPoints.inner.sidings.second.x[2] + background.x, rotationPoints.inner.sidings.second.x[3] + background.x], y: [rotationPoints.inner.sidings.second.y[0] + background.y, rotationPoints.inner.sidings.second.y[1] + background.y, rotationPoints.inner.sidings.second.y[2] + background.y, rotationPoints.inner.sidings.second.y[3] + background.y]};
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(trains[input1].standardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        if (cO.stateChangeLocal) {
            cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 1000, 2100, cO, points, 0.005);
            cO.stateChangeLocal = false;
        }
        setCOPosBezier(points, !trains[input1].standardDirection, rotationPoints.inner.sidings.second.bezierLength);
        var lastObj = trains[input1].cars.length == 0 ? trains[input1] : trains[input1].cars[trains[input1].cars.length - 1];
        if (!trains[input1].standardDirection && ((!isFront && i == trains[input1].cars.length - 1 && cO.y - background.y > switches.sidings2.left.y + switchesBeforeAddSidings[0] && switches.sidings2.left.turned) || ((isFront || i != trains[input1].cars.length - 1) && lastObj.back.state < 120))) {
            cO.state = 110;
            cO.stateChangeLocal = true;
        } else if (!trains[input1].standardDirection && ((!isFront && i == trains[input1].cars.length - 1 && cO.y - background.y > switches.sidings3.left.y + switchesBeforeAddSidings[1] && !switches.sidings3.left.turned) || ((isFront || i != trains[input1].cars.length - 1) && lastObj.back.state >= 130))) {
            cO.state = 130;
            cO.stateChangeLocal = true;
        }
    } else if (cO.state == 121) {
        points = {x: [rotationPoints.inner.sidings.secondS1.x[0] + background.x, rotationPoints.inner.sidings.secondS1.x[1] + background.x], y: [rotationPoints.inner.sidings.secondS1.y[0] + background.y, rotationPoints.inner.sidings.secondS1.y[1] + background.y]};
        if (trains[input1].standardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (cO.stateChange) {
            cO.angle = Math.PI;
            cO.stateChange = false;
        }
        setCOPosLinear(points, !trains[input1].standardDirection, true, false);
    } else if (cO.state == 122) {
        if (trains[input1].standardDirection) {
            trains[input1].endOfTrack = false;
        }
        points = {x: [rotationPoints.inner.sidings.secondS2.x[0] + background.x, rotationPoints.inner.sidings.secondS2.x[1] + background.x, rotationPoints.inner.sidings.secondS2.x[2] + background.x, rotationPoints.inner.sidings.secondS2.x[3] + background.x], y: [rotationPoints.inner.sidings.secondS2.y[0] + background.y, rotationPoints.inner.sidings.secondS2.y[1] + background.y, rotationPoints.inner.sidings.secondS2.y[2] + background.y, rotationPoints.inner.sidings.secondS2.y[3] + background.y]};
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !trains[input1].standardDirection, rotationPoints.inner.sidings.secondS2.bezierLength);
    } else if (cO.state == 130) {
        points = {x: [rotationPoints.inner.sidings.third.x[0] + background.x, rotationPoints.inner.sidings.third.x[1] + background.x, rotationPoints.inner.sidings.third.x[2] + background.x, rotationPoints.inner.sidings.third.x[3] + background.x], y: [rotationPoints.inner.sidings.third.y[0] + background.y, rotationPoints.inner.sidings.third.y[1] + background.y, rotationPoints.inner.sidings.third.y[2] + background.y, rotationPoints.inner.sidings.third.y[3] + background.y]};
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(trains[input1].standardDirection ? 0 : 1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        if (cO.stateChangeLocal) {
            cO.currentCurveFac = getBezierFac(cO.currentCurveFac, 1000, 2100, cO, points, 0.005);
            cO.stateChangeLocal = false;
        }
        var lastObj = trains[input1].cars.length == 0 ? trains[input1] : trains[input1].cars[trains[input1].cars.length - 1];
        setCOPosBezier(points, !trains[input1].standardDirection, rotationPoints.inner.sidings.third.bezierLength);
        if (!trains[input1].standardDirection && ((!isFront && i == trains[input1].cars.length - 1 && cO.y - background.y > switches.sidings2.left.y + switchesBeforeAddSidings[0] && switches.sidings2.left.turned) || ((isFront || i != trains[input1].cars.length - 1) && lastObj.back.state < 120))) {
            cO.state = 110;
            cO.stateChangeLocal = true;
        } else if (!trains[input1].standardDirection && ((!isFront && i == trains[input1].cars.length - 1 && cO.y - background.y > switches.sidings3.left.y + switchesBeforeAddSidings[1] && switches.sidings3.left.turned) || ((isFront || i != trains[input1].cars.length - 1) && lastObj.back.state < 130))) {
            cO.state = 120;
            cO.stateChangeLocal = true;
        }
    } else if (cO.state == 131) {
        points = {x: [rotationPoints.inner.sidings.thirdS1.x[0] + background.x, rotationPoints.inner.sidings.thirdS1.x[1] + background.x], y: [rotationPoints.inner.sidings.thirdS1.y[0] + background.y, rotationPoints.inner.sidings.thirdS1.y[1] + background.y]};
        if (trains[input1].standardDirection) {
            points.x.reverse();
            points.y.reverse();
        }
        if (cO.stateChange) {
            cO.angle = Math.PI;
            cO.stateChange = false;
        }
        setCOPosLinear(points, !trains[input1].standardDirection, true, false);
    } else if (cO.state == 132) {
        if (trains[input1].standardDirection) {
            trains[input1].endOfTrack = false;
        }
        points = {x: [rotationPoints.inner.sidings.thirdS2.x[0] + background.x, rotationPoints.inner.sidings.thirdS2.x[1] + background.x, rotationPoints.inner.sidings.thirdS2.x[2] + background.x, rotationPoints.inner.sidings.thirdS2.x[3] + background.x], y: [rotationPoints.inner.sidings.thirdS2.y[0] + background.y, rotationPoints.inner.sidings.thirdS2.y[1] + background.y, rotationPoints.inner.sidings.thirdS2.y[2] + background.y, rotationPoints.inner.sidings.thirdS2.y[3] + background.y]};
        points.x.reverse();
        points.y.reverse();
        if (cO.stateChange) {
            cO.currentCurveFac = getBezierFac(1, 2000, 1000, cO, points);
            cO.stateChange = false;
        }
        setCOPosBezier(points, !trains[input1].standardDirection, rotationPoints.inner.sidings.thirdS2.bezierLength);
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
        return {x: xa, y: ya};
    }
    var prevCurrentObject = isFront ? (i > 0 ? trains[input1].cars[i - 1] : trains[input1]) : currentObject;
    var prevCO = isFront ? (i > 0 ? trains[input1].cars[i - 1].back : trains[input1].back) : currentObject.front;
    var prevPoints = getPointsForPosCorr(prevCO.x, prevCO.y, prevCO.angle, prevCurrentObject.height);
    var supposedDistance = isFront ? prevCurrentObject.width * prevCurrentObject.bogieDistance + trains[input1].width / trains[input1].margin + currentObject.width * currentObject.bogieDistance : currentObject.width - 2 * currentObject.width * currentObject.bogieDistance;
    var maxRepeatNo = 100;
    var distance;
    do {
        var points = getPointsForPosCorr(cO.x, cO.y, cO.angle, currentObject.height);
        distance = Math.min(Math.abs(Math.sqrt(Math.pow(points.x[0] - prevPoints.x[0], 2) + Math.pow(points.y[0] - prevPoints.y[0], 2), 2)), Math.abs(Math.sqrt(Math.pow(points.x[1] - prevPoints.x[1], 2) + Math.pow(points.y[1] - prevPoints.y[1], 2), 2)), Math.abs(Math.sqrt(Math.pow(points.x[2] - prevPoints.x[2], 2) + Math.pow(points.y[2] - prevPoints.y[2], 2), 2)));
        cO.x -= (supposedDistance - distance) * Math.cos(cO.angle);
        cO.y -= (supposedDistance - distance) * Math.sin(cO.angle);
    } while (Math.abs(supposedDistance - distance) > 0.001 && --maxRepeatNo > 0);
}

function setCurrentObjectDisplayAngle(input1, currentObject) {
    if (currentObject.front.state == 1) {
        currentObject.displayAngle = Math.atan((currentObject.front.y - currentObject.back.y) / (currentObject.front.x - currentObject.back.x));
    } else if (Math.abs(currentObject.front.state) == 2) {
        currentObject.displayAngle = Math.atan((currentObject.front.y - currentObject.back.y) / (currentObject.front.x - currentObject.back.x));
        if (currentObject.y > background.y + trains[input1].circle.y[1] + (trains[input1].circle.y[2] - trains[input1].circle.y[1]) / 2 && currentObject.displayAngle < 0) {
            currentObject.displayAngle = Math.PI + currentObject.displayAngle;
        }
        if (currentObject.displayAngle < 0 || currentObject.displayAngle > Math.PI || (currentObject.y > background.y + trains[input1].circle.y[1] + (trains[input1].circle.y[2] - trains[input1].circle.y[1]) * 0.75 && currentObject.displayAngle < Math.PI / 2) || (currentObject.y < background.y + trains[input1].circle.y[1] + (trains[input1].circle.y[2] - trains[input1].circle.y[1]) * 0.25 && currentObject.displayAngle > Math.PI / 2)) {
            if (currentObject.y > background.y + trains[input1].circle.y[1] + (trains[input1].circle.y[2] - trains[input1].circle.y[1]) * 0.75) {
                currentObject.displayAngle = Math.PI;
            } else if (currentObject.y < background.y + trains[input1].circle.y[1] + (trains[input1].circle.y[2] - trains[input1].circle.y[1]) * 0.25) {
                currentObject.displayAngle = 0;
            } else {
                currentObject.displayAngle -= Math.PI;
            }
        }
    } else if (Math.abs(currentObject.front.state) == 3) {
        currentObject.displayAngle = Math.PI + Math.atan((currentObject.front.y - currentObject.back.y) / (currentObject.front.x - currentObject.back.x));
    } else if (Math.abs(currentObject.front.state) == 4) {
        currentObject.displayAngle = Math.PI + Math.atan((currentObject.front.y - currentObject.back.y) / (currentObject.front.x - currentObject.back.x));
        if (currentObject.y < background.y + trains[input1].circle.y[0] + (trains[input1].circle.y[3] - trains[input1].circle.y[0]) / 2 && currentObject.displayAngle < Math.PI) {
            currentObject.displayAngle = 2 * Math.PI - (Math.PI - currentObject.displayAngle);
        }
        if (currentObject.displayAngle < Math.PI || currentObject.displayAngle > 2 * Math.PI || (currentObject.y > background.y + trains[input1].circle.y[0] + (trains[input1].circle.y[3] - trains[input1].circle.y[0]) * 0.75 && currentObject.displayAngle > 1.5 * Math.PI) || (currentObject.y < background.y + trains[input1].circle.y[0] + (trains[input1].circle.y[3] - trains[input1].circle.y[0]) * 0.25 && currentObject.displayAngle < 1.5 * Math.PI)) {
            if (currentObject.y < background.y + trains[input1].circle.y[0] + (trains[input1].circle.y[3] - trains[input1].circle.y[0]) * 0.25) {
                currentObject.displayAngle = 2 * Math.PI;
            } else if (currentObject.y > background.y + trains[input1].circle.y[0] + (trains[input1].circle.y[3] - trains[input1].circle.y[0]) * 0.75) {
                currentObject.displayAngle = Math.PI;
            } else {
                currentObject.displayAngle += Math.PI;
            }
        }
        if (currentObject.back.state > 100) {
            currentObject.displayAngle = Math.PI + Math.atan((currentObject.front.y - currentObject.back.y) / (currentObject.front.x - currentObject.back.x));
        }
    } else if (currentObject.front.state > 100) {
        currentObject.displayAngle = Math.PI + Math.atan((currentObject.front.y - currentObject.back.y) / (currentObject.front.x - currentObject.back.x));
    }
    while (currentObject.displayAngle < 0) {
        currentObject.displayAngle += Math.PI * 2;
    }
    while (currentObject.displayAngle > Math.PI * 2) {
        currentObject.displayAngle -= Math.PI * 2;
    }
}

/******************************************
 * Animation functions for load and resize *
 ******************************************/

function placeTrainsAtInitialPositions() {
    trains.forEach(function (train, i) {
        train.standardDirection = train.standardDirectionStartValue;
        delete train.standardDirectionStartValue;
        train.endOfTrack = false;

        train.width = train.fac * background.width;
        train.height = train.fac * (trainPics[i].height * (background.width / trainPics[i].width));
        train.move = train.switchCircles = false;
        train.front = {};
        train.back = {};
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
            car.front = {};
            car.back = {};
            car.front.state = car.back.state = train.state;
        });
        if (train.state == 1) {
            if (train.circleStartPosDiv == undefined) {
                train.circleStartPosDiv = 2;
            }
            train.front.angle = train.back.angle = train.displayAngle = Math.asin((train.circle.y[1] - train.circle.y[0]) / (train.circle.x[1] - train.circle.x[0]));
            var hypotenuse = Math.sqrt(Math.pow(train.circle.x[1] - train.circle.x[0], 2) + Math.pow(train.circle.y[1] - train.circle.y[0], 2), 2);
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
                } else {
                    train.cars[j].front.x = train.x - Math.cos(train.cars[j].displayAngle) * (train.cars[j].width * train.bogieDistance + currentTrainMargin + train.width / 2);
                    train.cars[j].front.y = train.y - Math.sin(train.cars[j].displayAngle) * (train.cars[j].width * train.bogieDistance + currentTrainMargin + train.width / 2);
                    train.cars[j].back.x = train.x - Math.cos(train.cars[j].displayAngle) * (train.cars[j].width * (1 - train.bogieDistance) + currentTrainMargin + train.width / 2);
                    train.cars[j].back.y = train.y - Math.sin(train.cars[j].displayAngle) * (train.cars[j].width * (1 - train.bogieDistance) + currentTrainMargin + train.width / 2);
                    train.cars[j].x = train.x - Math.cos(train.cars[j].displayAngle) * (train.cars[j].width / 2 + currentTrainMargin + train.width / 2);
                    train.cars[j].y = train.y - Math.sin(train.cars[j].displayAngle) * (train.cars[j].width / 2 + currentTrainMargin + train.width / 2);
                }
            }
        } else if (train.state == 3) {
            if (train.circleStartPosDiv == undefined) {
                train.circleStartPosDiv = 2;
            }
            train.front.angle = train.back.angle = train.displayAngle = Math.PI + Math.asin((train.circle.y[2] - train.circle.y[3]) / (train.circle.x[2] - train.circle.x[3]));
            var hypotenuse = Math.sqrt(Math.pow(train.circle.x[2] - train.circle.x[3], 2) + Math.pow(train.circle.y[2] - train.circle.y[3], 2), 2);
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
                } else {
                    train.cars[j].front.x = train.x + Math.cos(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width * train.bogieDistance + currentTrainMargin + train.width / 2);
                    train.cars[j].front.y = train.y + Math.sin(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width * train.bogieDistance + currentTrainMargin + train.width / 2);
                    train.cars[j].back.x = train.x + Math.cos(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width * (1 - train.bogieDistance) + currentTrainMargin + train.width / 2);
                    train.cars[j].back.y = train.y + Math.sin(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width * (1 - train.bogieDistance) + currentTrainMargin + train.width / 2);
                    train.cars[j].x = train.x + Math.cos(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width / 2 + currentTrainMargin + train.width / 2);
                    train.cars[j].y = train.y + Math.sin(train.cars[j].displayAngle - Math.PI) * (train.cars[j].width / 2 + currentTrainMargin + train.width / 2);
                }
            }
        } else if (train.state > 100 && train.state % 10 == 1) {
            if (train.circleStartPosDiv == undefined) {
                train.circleStartPosDiv = 0.9;
            }
            var sidingID = train.state == 131 ? "thirdS1" : train.state == 121 ? "secondS1" : "firstS1";
            train.front.state = train.state;
            train.back.state = train.state;
            train.front.angle = train.back.angle = train.displayAngle = Math.PI + Math.asin((rotationPoints.inner.sidings[sidingID].y[1] - rotationPoints.inner.sidings[sidingID].y[0]) / (rotationPoints.inner.sidings[sidingID].x[1] - rotationPoints.inner.sidings[sidingID].x[0]));
            train.front.x = background.x + rotationPoints.inner.sidings[sidingID].x[0] / train.circleStartPosDiv;
            train.front.y = background.y + rotationPoints.inner.sidings[sidingID].y[0];
            train.back.x = background.x + rotationPoints.inner.sidings[sidingID].x[0] / train.circleStartPosDiv + train.width;
            train.back.y = background.y + rotationPoints.inner.sidings[sidingID].y[0];
            setCOPos(train.front, true, i, train, -1, 1, 1);
            setCOPos(train.back, false, i, train, -1, 1, 1);
            setCOPosCorr(train.back, false, i, train, -1);
            train.x = (train.front.x + train.back.x) / 2;
            train.y = (train.front.y + train.back.y) / 2;
            setCurrentObjectDisplayAngle(i, train);
            for (var j = 0; j < train.cars.length; j++) {
                if (j > 0) {
                    train.cars[j].front.state = train.cars[j - 1].back.state;
                    train.cars[j].back.state = train.cars[j - 1].back.state;
                    train.cars[j].front.angle = train.cars[j - 1].back.angle;
                    train.cars[j].front.x = train.cars[j - 1].x;
                    train.cars[j].front.y = train.cars[j - 1].y;
                    train.cars[j].back.angle = train.cars[j - 1].back.angle;
                    train.cars[j].back.x = train.cars[j - 1].x;
                    train.cars[j].back.y = train.cars[j - 1].y;
                    changeCOSection(train.cars[j].front, true, i, j, true);
                    changeCOSection(train.cars[j].back, false, i, j, true);
                    setCOPos(train.cars[j].front, true, i, train.cars[j], j, -1, train.cars[j].width * train.cars[j].bogieDistance + currentTrainMargin + train.cars[j - 1].width / 2);
                    setCOPos(train.cars[j].back, false, i, train.cars[j], j, -1, train.cars[j].width * (1 - train.cars[j].bogieDistance) + currentTrainMargin + train.cars[j - 1].width / 2);
                    changeCOSection(train.cars[j].front, true, i, j, true);
                    changeCOSection(train.cars[j].back, false, i, j, true);
                    setCOPos(train.cars[j].front, true, i, train.cars[j], j, 1, 1);
                    setCOPos(train.cars[j].back, false, i, train.cars[j], j, 1, 1);
                } else {
                    train.cars[j].front.state = train.back.state;
                    train.cars[j].back.state = train.back.state;
                    train.cars[j].front.angle = train.back.angle;
                    train.cars[j].front.x = train.x;
                    train.cars[j].front.y = train.y;
                    train.cars[j].back.angle = train.back.angle;
                    train.cars[j].back.x = train.x;
                    train.cars[j].back.y = train.y;
                    changeCOSection(train.cars[j].front, true, i, j, true);
                    changeCOSection(train.cars[j].back, false, i, j, true);
                    setCOPos(train.cars[j].front, true, i, train.cars[j], j, -1, train.cars[j].width * train.cars[j].bogieDistance + currentTrainMargin + train.width / 2);
                    setCOPos(train.cars[j].back, false, i, train.cars[j], j, -1, train.cars[j].width * (1 - train.cars[j].bogieDistance) + currentTrainMargin + train.width / 2);
                    changeCOSection(train.cars[j].front, true, i, j, true);
                    changeCOSection(train.cars[j].back, false, i, j, true);
                    setCOPos(train.cars[j].front, true, i, train.cars[j], j, 1, 1);
                    setCOPos(train.cars[j].back, false, i, train.cars[j], j, 1, 1);
                }
                setCOPosCorr(train.cars[j].front, true, i, train.cars[j], j);
                setCOPosCorr(train.cars[j].back, false, i, train.cars[j], j);
                train.cars[j].x = (train.cars[j].front.x + train.cars[j].back.x) / 2;
                train.cars[j].y = (train.cars[j].front.y + train.cars[j].back.y) / 2;
                setCurrentObjectDisplayAngle(i, train.cars[j]);
            }
        }
        delete train.state;
        delete train.circleStartPosDiv;
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
                dis += Math.sqrt(Math.pow(Math.abs(x[i - 1] - x[i]), 2) + Math.pow(Math.abs(Math.abs(y[i - 1] - y[i]), 2), 2));
            }
        }
        return dis;
    }

    function getBezierPoints(fac, a, b, c, d) {
        return Math.pow(1 - fac, 3) * a + 3 * fac * Math.pow(1 - fac, 2) * b + 3 * Math.pow(fac, 2) * (1 - fac) * c + Math.pow(fac, 3) * d;
    }

    /////Rotation Points/////
    var circles = [];
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
    rotationPoints.outer.narrow.x[4] = 0.98 * background.width;
    rotationPoints.outer.narrow.x[5] = 0.985 * background.width;
    rotationPoints.outer.narrow.x[6] = -0.05 * background.width;
    rotationPoints.outer.narrow.x[7] = -0.04 * background.width;
    rotationPoints.outer.narrow.y[0] = 0.013 * background.height;
    rotationPoints.outer.narrow.y[1] = 0.017 * background.height;
    rotationPoints.outer.narrow.y[2] = 0.893 * background.height;
    rotationPoints.outer.narrow.y[3] = 0.882 * background.height;
    rotationPoints.outer.narrow.y[4] = 0.001 * background.height;
    rotationPoints.outer.narrow.y[5] = 0.908 * background.height;
    rotationPoints.outer.narrow.y[6] = 0.9 * background.height;
    rotationPoints.outer.narrow.y[7] = 0.03 * background.height;
    circles[2] = rotationPoints.outer.narrow;

    var repNo = 1000;
    for (var i = 0; i < circles.length; i++) {
        circles[i].bezierLength = {};
        if (circles[i].x[4] !== undefined && circles[i].x[5] !== undefined) {
            bezierPoints = {x: [circles[i].x[1], circles[i].x[4], circles[i].x[5], circles[i].x[2]], y: [circles[i].y[1], circles[i].y[4], circles[i].y[5], circles[i].y[2]]};
            circles[i].bezierLength.right = getBezierLength(bezierPoints, repNo);
        }
        if (circles[i].x[6] !== undefined && circles[i].x[7] !== undefined) {
            bezierPoints = {x: [circles[i].x[3], circles[i].x[6], circles[i].x[7], circles[i].x[0]], y: [circles[i].y[3], circles[i].y[6], circles[i].y[7], circles[i].y[0]]};
            circles[i].bezierLength.left = getBezierLength(bezierPoints, repNo);
        }
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
    bezierPoints = {x: [rotationPoints.inner.narrow.x[3], rotationPoints.inner2outer.left.x[1], rotationPoints.inner2outer.left.x[2], rotationPoints.outer.narrow.x[0]], y: [rotationPoints.inner.narrow.y[3], rotationPoints.inner2outer.left.y[1], rotationPoints.inner2outer.left.y[2], rotationPoints.outer.narrow.y[0]]};
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
    bezierPoints = {x: [rotationPoints.outer.narrow.x[1], rotationPoints.inner2outer.right.x[1], rotationPoints.inner2outer.right.x[2], rotationPoints.inner.narrow.x[2]], y: [rotationPoints.outer.narrow.y[1], rotationPoints.inner2outer.right.y[1], rotationPoints.inner2outer.right.y[2], rotationPoints.inner.narrow.y[2]]};
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
    bezierPoints = {x: [rotationPoints.inner.sidings.first.x[0], rotationPoints.inner.sidings.first.x[1], rotationPoints.inner.sidings.first.x[2], rotationPoints.inner.sidings.first.x[3]], y: [rotationPoints.inner.sidings.first.y[0], rotationPoints.inner.sidings.first.y[1], rotationPoints.inner.sidings.first.y[2], rotationPoints.inner.sidings.first.y[3]]};
    rotationPoints.inner.sidings.first.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.inner.sidings.firstS1.x[0] = rotationPoints.inner.sidings.first.x[3];
    rotationPoints.inner.sidings.firstS1.x[1] = 0.7 * background.width;
    rotationPoints.inner.sidings.firstS1.y[0] = rotationPoints.inner.sidings.firstS1.y[1] = rotationPoints.inner.sidings.first.y[3];
    rotationPoints.inner.sidings.firstS2.x[0] = rotationPoints.inner.sidings.firstS1.x[1];
    rotationPoints.inner.sidings.firstS2.x[1] = 0.835 * background.width;
    rotationPoints.inner.sidings.firstS2.x[2] = 0.84 * background.width;
    rotationPoints.inner.sidings.firstS2.x[3] = 0.86 * background.width;
    rotationPoints.inner.sidings.firstS2.y[0] = rotationPoints.inner.sidings.firstS1.y[1];
    rotationPoints.inner.sidings.firstS2.y[1] = 0.76 * background.height;
    rotationPoints.inner.sidings.firstS2.y[2] = 0.55 * background.height;
    rotationPoints.inner.sidings.firstS2.y[3] = 0.5 * background.height;
    bezierPoints = {x: [rotationPoints.inner.sidings.firstS2.x[0], rotationPoints.inner.sidings.firstS2.x[1], rotationPoints.inner.sidings.firstS2.x[2], rotationPoints.inner.sidings.firstS2.x[3]], y: [rotationPoints.inner.sidings.firstS2.y[0], rotationPoints.inner.sidings.firstS2.y[1], rotationPoints.inner.sidings.firstS2.y[2], rotationPoints.inner.sidings.firstS2.y[3]]};
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
    bezierPoints = {x: [rotationPoints.inner.sidings.second.x[0], rotationPoints.inner.sidings.second.x[1], rotationPoints.inner.sidings.second.x[2], rotationPoints.inner.sidings.second.x[3]], y: [rotationPoints.inner.sidings.second.y[0], rotationPoints.inner.sidings.second.y[1], rotationPoints.inner.sidings.second.y[2], rotationPoints.inner.sidings.second.y[3]]};
    rotationPoints.inner.sidings.second.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.inner.sidings.secondS1.x[0] = rotationPoints.inner.sidings.second.x[3];
    rotationPoints.inner.sidings.secondS1.x[1] = 0.7 * background.width;
    rotationPoints.inner.sidings.secondS1.y[0] = rotationPoints.inner.sidings.secondS1.y[1] = rotationPoints.inner.sidings.second.y[3];
    rotationPoints.inner.sidings.secondS2.x[0] = rotationPoints.inner.sidings.secondS1.x[1];
    rotationPoints.inner.sidings.secondS2.x[1] = 0.8 * background.width;
    rotationPoints.inner.sidings.secondS2.x[2] = 0.82 * background.width;
    rotationPoints.inner.sidings.secondS2.x[3] = 0.845 * background.width;
    rotationPoints.inner.sidings.secondS2.y[0] = rotationPoints.inner.sidings.secondS1.y[1];
    rotationPoints.inner.sidings.secondS2.y[1] = 0.66 * background.height;
    rotationPoints.inner.sidings.secondS2.y[2] = 0.54 * background.height;
    rotationPoints.inner.sidings.secondS2.y[3] = 0.41 * background.height;
    bezierPoints = {x: [rotationPoints.inner.sidings.secondS2.x[0], rotationPoints.inner.sidings.secondS2.x[1], rotationPoints.inner.sidings.secondS2.x[2], rotationPoints.inner.sidings.secondS2.x[3]], y: [rotationPoints.inner.sidings.secondS2.y[0], rotationPoints.inner.sidings.secondS2.y[1], rotationPoints.inner.sidings.secondS2.y[2], rotationPoints.inner.sidings.secondS2.y[3]]};
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
    bezierPoints = {x: [rotationPoints.inner.sidings.third.x[0], rotationPoints.inner.sidings.third.x[1], rotationPoints.inner.sidings.third.x[2], rotationPoints.inner.sidings.third.x[3]], y: [rotationPoints.inner.sidings.third.y[0], rotationPoints.inner.sidings.third.y[1], rotationPoints.inner.sidings.third.y[2], rotationPoints.inner.sidings.third.y[3]]};
    rotationPoints.inner.sidings.third.bezierLength = getBezierLength(bezierPoints, repNo);
    rotationPoints.inner.sidings.thirdS1.x[0] = rotationPoints.inner.sidings.third.x[3];
    rotationPoints.inner.sidings.thirdS1.x[1] = 0.65 * background.width;
    rotationPoints.inner.sidings.thirdS1.y[0] = rotationPoints.inner.sidings.thirdS1.y[1] = rotationPoints.inner.sidings.third.y[3];
    rotationPoints.inner.sidings.thirdS2.x[0] = rotationPoints.inner.sidings.thirdS1.x[1];
    rotationPoints.inner.sidings.thirdS2.x[1] = 0.81 * background.width;
    rotationPoints.inner.sidings.thirdS2.x[2] = 0.803 * background.width;
    rotationPoints.inner.sidings.thirdS2.x[3] = 0.804 * background.width;
    rotationPoints.inner.sidings.thirdS2.y[0] = rotationPoints.inner.sidings.thirdS1.y[1];
    rotationPoints.inner.sidings.thirdS2.y[1] = 0.63 * background.height;
    rotationPoints.inner.sidings.thirdS2.y[2] = 0.3 * background.height;
    rotationPoints.inner.sidings.thirdS2.y[3] = 0.36 * background.height;
    bezierPoints = {x: [rotationPoints.inner.sidings.thirdS2.x[0], rotationPoints.inner.sidings.thirdS2.x[1], rotationPoints.inner.sidings.thirdS2.x[2], rotationPoints.inner.sidings.thirdS2.x[3]], y: [rotationPoints.inner.sidings.thirdS2.y[0], rotationPoints.inner.sidings.thirdS2.y[1], rotationPoints.inner.sidings.thirdS2.y[2], rotationPoints.inner.sidings.thirdS2.y[3]]};
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

    rotationPoints.outer.altState3.right = {x: [], y: []};
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

    rotationPoints.outer.altState3.left = {x: [], y: []};
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

    bezierPoints = {x: [rotationPoints.outer.altState3.right.x[0], rotationPoints.outer.altState3.right.x[3], rotationPoints.outer.altState3.right.x[3], rotationPoints.outer.altState3.right.x[2]], y: [rotationPoints.outer.altState3.right.y[0], rotationPoints.outer.altState3.right.y[3], rotationPoints.outer.altState3.right.y[3], rotationPoints.outer.altState3.right.y[2]]};
    var templenright = getBezierLength(bezierPoints, 100);
    bezierPoints = {x: [rotationPoints.outer.altState3.right.x[2], rotationPoints.outer.altState3.right.x[4], rotationPoints.outer.altState3.right.x[4], rotationPoints.outer.altState3.right.x[1]], y: [rotationPoints.outer.altState3.right.y[2], rotationPoints.outer.altState3.right.y[4], rotationPoints.outer.altState3.right.y[4], rotationPoints.outer.altState3.right.y[1]]};
    rotationPoints.outer.altState3.right.bezierLength = templenright + getBezierLength(bezierPoints, 100);

    bezierPoints = {x: [rotationPoints.outer.altState3.left.x[0], rotationPoints.outer.altState3.left.x[3], rotationPoints.outer.altState3.left.x[3], rotationPoints.outer.altState3.left.x[2]], y: [rotationPoints.outer.altState3.left.y[0], rotationPoints.outer.altState3.left.y[3], rotationPoints.outer.altState3.left.y[3], rotationPoints.outer.altState3.left.y[2]]};
    var templenleft = getBezierLength(bezierPoints, 100);
    bezierPoints = {x: [rotationPoints.outer.altState3.left.x[2], rotationPoints.outer.altState3.left.x[4], rotationPoints.outer.altState3.left.x[4], rotationPoints.outer.altState3.left.x[1]], y: [rotationPoints.outer.altState3.left.y[2], rotationPoints.outer.altState3.left.y[4], rotationPoints.outer.altState3.left.y[4], rotationPoints.outer.altState3.left.y[1]]};
    rotationPoints.outer.altState3.left.bezierLength = templenleft + getBezierLength(bezierPoints, 100);

    /*------------------------------------------------------------------------------------------------------------------*
     *  -----------------------------------------------------------                                                     *
     *  -      ___       ___                                      -                                                     *
     *  -     |   \      |   \   ________  _____   _______        -                                                     *
     *  -    |    \     |    \   | __   |  ||__|  | __   |        -        0-1: required                                *
     *  -   |  / \ \   |  / \ \  | |__| |  ||\    | |__| |        -                                                     *
     *  -  |  /   \ \ |  /   \ \ |______|  ||\\   |______|        -           Rotation Points                           *
     *  -  ______________________________________________         -                                                     *
     *  - 3_3__4_4________________________________________4 4 3 3 -                                                     *
     *  0----2----1-------------------------------------1----2----0                                                     *
     *------------------------------------------------------------------------------------------------------------------*/

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
            var currentObjects = [{}];
            currentObjects[0] = JSON.parse(JSON.stringify(trains[input1]));
            if (trains[input1].cars.length == 0 && trains[input1].standardDirection) {
                currentObjects[0].facs = [
                    {x: -0.5, weight: trainParams.innerCollisionFac / 4},
                    {x: 0, weight: trainParams.innerCollisionFac / 3},
                    {x: 0.5, weight: trainParams.innerCollisionFac / 2},
                    {x: 1, weight: 1}
                ];
            } else if (trains[input1].cars.length == 0) {
                currentObjects[0].facs = [
                    {x: -1, weight: 1},
                    {x: -0.5, weight: trainParams.innerCollisionFac / 2},
                    {x: 0, weight: trainParams.innerCollisionFac / 3},
                    {x: 0.5, weight: trainParams.innerCollisionFac / 4}
                ];
            } else if (trains[input1].standardDirection) {
                currentObjects[0].facs = [
                    {x: -1, weight: trainParams.innerCollisionFac},
                    {x: -0.5, weight: trainParams.innerCollisionFac},
                    {x: 0, weight: trainParams.innerCollisionFac},
                    {x: 0.5, weight: trainParams.innerCollisionFac},
                    {x: 1, weight: 1}
                ];
            } else {
                currentObjects[0].facs = [
                    {x: -1, weight: trainParams.innerCollisionFac},
                    {x: -0.5, weight: trainParams.innerCollisionFac / 2},
                    {x: 0, weight: trainParams.innerCollisionFac / 3},
                    {x: 0.5, weight: trainParams.innerCollisionFac / 4}
                ];
            }
            for (var i = 0; i < trains[input1].cars.length; i++) {
                currentObjects[i + 1] = JSON.parse(JSON.stringify(trains[input1].cars[i]));
                if (i == trains[input1].cars.length - 1 && !trains[input1].standardDirection) {
                    currentObjects[i + 1].facs = [
                        {x: -1, weight: 1},
                        {x: -0.5, weight: trainParams.innerCollisionFac},
                        {x: 0, weight: trainParams.innerCollisionFac},
                        {x: 0.5, weight: trainParams.innerCollisionFac},
                        {x: 1, weight: trainParams.innerCollisionFac}
                    ];
                } else if (i == trains[input1].cars.length - 1) {
                    currentObjects[i + 1].facs = [
                        {x: -0.5, weight: trainParams.innerCollisionFac / 4},
                        {x: 0, weight: trainParams.innerCollisionFac / 3},
                        {x: 0.5, weight: trainParams.innerCollisionFac / 2},
                        {x: 1, weight: trainParams.innerCollisionFac}
                    ];
                } else {
                    currentObjects[i + 1].facs = [
                        {x: -1, weight: trainParams.innerCollisionFac},
                        {x: -0.5, weight: trainParams.innerCollisionFac},
                        {x: 0, weight: trainParams.innerCollisionFac},
                        {x: 0.5, weight: trainParams.innerCollisionFac},
                        {x: 1, weight: trainParams.innerCollisionFac}
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

                if (i == -1) {
                    //Calc acceleration
                    if (trains[input1].accelerationSpeed === 0) {
                        trains[input1].accelerationSpeed = trains[input1].accelerationSpeedStartFac;
                    }
                    if (trains[input1].accelerationSpeed > 0 && trains[input1].accelerationSpeed < 1) {
                        trains[input1].accelerationSpeed *= trains[input1].accelerationSpeedFac;
                        if (trains[input1].accelerationSpeed >= 1) {
                            trains[input1].accelerationSpeed = 1;
                        }
                    } else if (trains[input1].accelerationSpeed < 0 && trains[input1].accelerationSpeed >= -1) {
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
                    } else {
                        trains[input1].accelerationSpeedCustom /= trains[input1].accelerationSpeedFac;
                        if (trains[input1].accelerationSpeedCustom <= 1) {
                            trains[input1].accelerationSpeedCustom = 1;
                        }
                    }
                    trains[input1].currentSpeedInPercent = trains[input1].accelerationSpeedCustom * trains[input1].speedInPercent;
                }
                var speed = Math.abs(trains[input1].speed * trains[input1].accelerationSpeed);
                var customSpeed = trains[input1].currentSpeedInPercent / 100;

                changeCOSection(currentObject.front, true, input1, i);
                changeCOSection(currentObject.back, false, input1, i);
                setCOPos(currentObject.front, true, input1, currentObject, i, speed, customSpeed);
                setCOPos(currentObject.back, false, input1, currentObject, i, speed, customSpeed);

                if (i == -1) {
                    setCOPosCorr(currentObject.back, false, input1, currentObject, i);
                } else {
                    setCOPosCorr(currentObject.front, true, input1, currentObject, i);
                    setCOPosCorr(currentObject.back, false, input1, currentObject, i);
                }

                currentObject.x = (currentObject.front.x + currentObject.back.x) / 2;
                currentObject.y = (currentObject.front.y + currentObject.back.y) / 2;
                setCurrentObjectDisplayAngle(input1, currentObject);
            } else {
                trains[input1].accelerationSpeed = 0;
                trains[input1].accelerationSpeedCustom = 1;
            }
        }

        for (var i = -1; i < trains[input1].cars.length; i++) {
            animateTrain(i);
        }
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
                if (trainCollisions[i][j] >= trainParams.innerCollisionFac || trainCollisions[i][j] > trainCollisions[j][i] || (trains[i].endOfTrack && trains[i].endOfTrackStandardDirection == trains[i].standardDirection)) {
                    trains[i].crash = true;
                    if (trains[i].move) {
                        trains[i].move = false;
                        trains[i].accelerationSpeed = 0;
                        trains[i].accelerationSpeedCustom = 1;
                        newCrash.push({i: i, j: j});
                    }
                }
            }
        }
    }

    /////RECALC/////
    if (animateTimeout !== undefined && animateTimeout !== null) {
        clearTimeout(animateTimeout);
    }
    if (firstRun) {
        firstRun = false;
        postMessage({k: "ready", trains: trains, animateInterval: animateInterval});
    }
    postMessage({k: "setTrains", trains: trains});
    for (var i = 0; i < newCrash.length; i++) {
        postMessage({k: "trainCrash", i: newCrash[i].i, j: newCrash[i].j});
    }
    if (debug) {
        postMessage({k: "debugDrawPoints", p: debugDrawPoints, pC: debugDrawPointsCrash, tC: trainCollisions});
    }
    if (online) {
        if (syncing) {
            postMessage({k: "sync-ready", trains: trains, rotationPoints: rotationPoints});
            syncing = false;
        } else if (!pause) {
            var teamplayResttime = Math.max(animateInterval - (Date.now() - starttime), 0);
            animateTimeout = setTimeout(animateObjects, teamplayResttime);
        }
    } else {
        var resttime = Math.max(animateInterval - (Date.now() - starttime), 0);
        animateTimeout = setTimeout(animateObjects, resttime);
    }
}
var animateTimeout;
var animateInterval = 22;

var rotationPoints = {inner: {narrow: {x: [], y: []}, wide: {x: [], y: []}, sidings: {first: {x: [], y: []}, firstS1: {x: [], y: []}, firstS2: {x: [], y: []}, second: {x: [], y: []}, secondS1: {x: [], y: []}, secondS2: {x: [], y: []}, third: {x: [], y: []}, thirdS1: {x: [], y: []}, thirdS2: {x: [], y: []}}}, outer: {narrow: {x: [], y: []}, altState3: {x: [], y: []}}, inner2outer: {left: {x: [], y: []}, right: {x: [], y: []}}};
var trains = [
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
        cars: [
            {src: 2, fac: 0.06, bogieDistance: 0.15},
            {src: 2, fac: 0.06, bogieDistance: 0.15},
            {src: 2, fac: 0.06, bogieDistance: 0.15},
            {src: 3, fac: 0.044, bogieDistance: 0.15}
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
        cars: [
            {src: 5, fac: 0.11, bogieDistance: 0.15},
            {src: 5, fac: 0.11, bogieDistance: 0.15, assetFlip: true},
            {src: 4, fac: 0.093, bogieDistance: 0.15, assetFlip: true, konamiUseTrainIcon: true}
        ]
    },
    {src: 8, fac: 0.068, speedFac: 1 / 375, accelerationSpeedStartFac: 0.04, accelerationSpeedFac: 1.01, circle: rotationPoints.inner.wide, circleFamily: rotationPoints.inner, circleStartPosDiv: 0.8, standardDirectionStartValue: true, bogieDistance: 0.15, state: 121, flickerFacFront: 2.4, flickerFacBack: 2.3, flickerFacFrontOffset: 2.82, flickerFacBackOffset: 2.75, trainSwitchSrc: 27, cars: []},
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
        cars: [
            {src: 6, fac: 0.1, bogieDistance: 0.15},
            {src: 6, fac: 0.1, bogieDistance: 0.15, assetFlip: true},
            {src: 7, fac: 0.1, bogieDistance: 0.15, assetFlip: true, konamiUseTrainIcon: true}
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
        cars: [
            {src: 21, fac: 0.043, bogieDistance: 0.15},
            {src: 22, fac: 0.055, bogieDistance: 0.15}
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
        cars: [
            {src: 19, fac: 0.08, bogieDistance: 0.15},
            {src: 18, fac: 0.093, bogieDistance: 0.19, assetFlip: true, konamiUseTrainIcon: true}
        ]
    }
];
var trainParams = {selected: Math.floor(Math.random() * trains.length), margin: 25, innerCollisionFac: 0.5};
var trainPics;

var switches;
var switchesBeforeFac = 1.3;
var switchesBeforeAddSidings;
var background;

var online;
var pause = false;
var syncing = false;

var saveTheGameSendTimeout;

var firstRun = true;

var debug = false;

onmessage = function (message) {
    function resizeTrains(oldbackground) {
        for (var i = 0; i < trains.length; i++) {
            trains[i].front.x = background.x + ((trains[i].front.x - oldbackground.x) * background.width) / oldbackground.width;
            trains[i].back.x = background.x + ((trains[i].back.x - oldbackground.x) * background.width) / oldbackground.width;
            trains[i].x = background.x + ((trains[i].x - oldbackground.x) * background.width) / oldbackground.width;
            trains[i].front.y = background.y + ((trains[i].front.y - oldbackground.y) * background.height) / oldbackground.height;
            trains[i].back.y = background.y + ((trains[i].back.y - oldbackground.y) * background.height) / oldbackground.height;
            trains[i].y = background.y + ((trains[i].y - oldbackground.y) * background.height) / oldbackground.height;
            trains[i].width = (trains[i].width * background.width) / oldbackground.width;
            trains[i].height = (trains[i].height * background.height) / oldbackground.height;
            for (var j = 0; j < trains[i].cars.length; j++) {
                trains[i].cars[j].front.x = background.x + ((trains[i].cars[j].front.x - oldbackground.x) * background.width) / oldbackground.width;
                trains[i].cars[j].back.x = background.x + ((trains[i].cars[j].back.x - oldbackground.x) * background.width) / oldbackground.width;
                trains[i].cars[j].x = background.x + ((trains[i].cars[j].x - oldbackground.x) * background.width) / oldbackground.width;
                trains[i].cars[j].front.y = background.y + ((trains[i].cars[j].front.y - oldbackground.y) * background.height) / oldbackground.height;
                trains[i].cars[j].back.y = background.y + ((trains[i].cars[j].back.y - oldbackground.y) * background.height) / oldbackground.height;
                trains[i].cars[j].y = background.y + ((trains[i].cars[j].y - oldbackground.y) * background.height) / oldbackground.height;
                trains[i].cars[j].width = (trains[i].cars[j].width * background.width) / oldbackground.width;
                trains[i].cars[j].height = (trains[i].cars[j].height * background.height) / oldbackground.height;
            }
        }
    }
    function performance() {
        var startTime = Date.now();
        for (var i = 0; i < 3; i++) {
            var startNo = 12500000;
            var newNo = 1;
            var res;
            while (newNo < startNo) {
                res *= startNo - newNo;
                newNo++;
            }
        }
        return Date.now() - startTime;
    }
    if (message.data.k == "start") {
        online = message.data.online;
        animateInterval = online ? message.data.onlineInterval : Math.min(Math.max((performance() / 90) * animateInterval, animateInterval), 3 * animateInterval);
        background = message.data.background;
        switchesBeforeAddSidings = [0.008 * background.width, 0.012 * background.width];
        switches = message.data.switches;
        postMessage({k: "getTrainPics", trains: trains});
        postMessage({k: "setTrainParams", trainParams: trainParams});
    } else if (message.data.k == "setTrainPics") {
        trainPics = message.data.trainPics;
        defineTrainParams();
        if (typeof message.data.savedTrains == "object") {
            /* UPDATE: v7.4.0 */
            for (var t = 0; t < trains.length && t < message.data.savedTrains.length; t++) {
                if (message.data.savedTrains[t].trainSwitchSrc == undefined) {
                    message.data.savedTrains[t].trainSwitchSrc = trains[t].trainSwitchSrc;
                }
            }
            /* END UPDATE: v7.4.0 */
            trains = JSON.parse(JSON.stringify(message.data.savedTrains));
            for (var t = 0; t < trains.length; t++) {
                if (message.data.savedTrains[t].circleFamily != null) {
                    trains[t].circleFamily = rotationPoints[message.data.savedTrains[t].circleFamily];
                    trains[t].circle = rotationPoints[message.data.savedTrains[t].circleFamily][message.data.savedTrains[t].circle];
                }
            }
            resizeTrains(message.data.savedBg);
        } else {
            placeTrainsAtInitialPositions();
        }
        postMessage({k: "switches", switches: switches});
        animateObjects();
    } else if (message.data.k == "resize") {
        background = message.data.background;
        for (var i = 0; i < trains.length; i++) {
            for (var j = 0; j < trains[i].circle.x.length; j++) {
                trains[i].circle.x[j] *= background.width / message.data.oldbackground.width;
                trains[i].circle.y[j] *= background.height / message.data.oldbackground.height;
            }
        }
        resizeTrains(message.data.oldbackground);
        defineTrainParams();
        for (var i = 0; i < switchesBeforeAddSidings.length; i++) {
            switchesBeforeAddSidings[i] *= background.width / message.data.oldbackground.width;
        }
        postMessage({k: "switches", switches: switches});
        postMessage({k: "setTrains", trains: trains});
        postMessage({k: "resized"});
        if (saveTheGameSendTimeout !== undefined && saveTheGameSendTimeout !== null) {
            clearTimeout(saveTheGameSendTimeout);
        }
        saveTheGameSend();
    } else if (message.data.k == "train") {
        message.data.params.forEach(function (param) {
            trains[message.data.i][Object.keys(param)[0]] = Object.values(param)[0];
        });
    } else if (message.data.k == "switches") {
        switches = message.data.switches;
    } else if (message.data.k == "sync-request") {
        syncing = true;
    } else if (message.data.k == "sync-t") {
        Object.keys(message.data.d).forEach(function (key) {
            trains[message.data.i][key] = message.data.d[key];
        });
        trains[message.data.i].front.x = background.x + trains[message.data.i].front.x * background.width;
        trains[message.data.i].back.x = background.x + trains[message.data.i].back.x * background.width;
        trains[message.data.i].x = background.x + trains[message.data.i].x * background.width;
        trains[message.data.i].front.y = background.y + trains[message.data.i].front.y * background.height;
        trains[message.data.i].back.y = background.y + trains[message.data.i].back.y * background.height;
        trains[message.data.i].y = background.y + trains[message.data.i].y * background.height;
        if (trains[message.data.i].circleFamily != null) {
            trains[message.data.i].circle = rotationPoints[trains[message.data.i].circleFamily][trains[message.data.i].circle];
            trains[message.data.i].circleFamily = rotationPoints[trains[message.data.i].circleFamily];
        }
        defineTrainSpeed(trains[message.data.i]);
    } else if (message.data.k == "sync-tc") {
        Object.keys(message.data.d).forEach(function (key) {
            trains[message.data.i[0]].cars[message.data.i[1]][key] = message.data.d[key];
        });
        trains[message.data.i[0]].cars[message.data.i[1]].front.x = background.x + trains[message.data.i[0]].cars[message.data.i[1]].front.x * background.width;
        trains[message.data.i[0]].cars[message.data.i[1]].back.x = background.x + trains[message.data.i[0]].cars[message.data.i[1]].back.x * background.width;
        trains[message.data.i[0]].cars[message.data.i[1]].x = background.x + trains[message.data.i[0]].cars[message.data.i[1]].x * background.width;
        trains[message.data.i[0]].cars[message.data.i[1]].front.y = background.y + trains[message.data.i[0]].cars[message.data.i[1]].front.y * background.height;
        trains[message.data.i[0]].cars[message.data.i[1]].back.y = background.y + trains[message.data.i[0]].cars[message.data.i[1]].back.y * background.height;
        trains[message.data.i[0]].cars[message.data.i[1]].y = background.y + trains[message.data.i[0]].cars[message.data.i[1]].y * background.height;
    } else if (message.data.k == "pause") {
        pause = true;
    } else if (message.data.k == "resume") {
        pause = false;
        animateObjects();
    } else if (message.data.k == "game-saved") {
        if (saveTheGameSendTimeout !== undefined && saveTheGameSendTimeout !== null) {
            clearTimeout(saveTheGameSendTimeout);
        }
        saveTheGameSendTimeout = setTimeout(saveTheGameSend, 5000);
    } else if (message.data.k == "debug") {
        debug = true;
        postMessage({k: "debug", animateInterval: animateInterval, trains: trains, rotationPoints: rotationPoints, switchesBeforeFac: switchesBeforeFac, switchesBeforeAddSidings: switchesBeforeAddSidings});
    }
};

//Browser Compatibility
if (typeof Object.values == "undefined") {
    Object.values = function (obj) {
        return Object.keys(obj).map(function (key) {
            return obj[key];
        });
    };
}
