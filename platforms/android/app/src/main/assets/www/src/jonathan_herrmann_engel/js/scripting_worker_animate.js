/******************************************
* Animation functions for load and resize *
******************************************/
    
function placeTrainsAtInitialPositions() {

	trains.forEach(function(train, i){
		train.standardDirection = train.standardDirectionStartValue;
		delete train.standardDirectionStartValue;

		train.width = train.fac * background.width;
		train.height = train.fac *(trainPics[i].height * (background.width / trainPics[i].width)); 
		train.move = train.switchCircles = false;
		train.front = {};
		train.back = {};
		train.front.state = train.back.state = train.state;

		var currentTrainMargin = train.width/trainParams.margin;
		var currentTrainWidth = train.width;

		train.cars.forEach(function(car, j){
			car.width = car.fac * background.width;
			car.height = car.fac *(trainPics[i].cars[j].height * (background.width / trainPics[i].cars[j].width));
			currentTrainWidth += car.width + currentTrainMargin;
			car.front = {};
			car.back = {};
			car.front.state = car.back.state = train.state;
		});
		if(train.state == 1){
			train.front.angle = train.back.angle = train.displayAngle = Math.asin((train.circle.y[1]-train.circle.y[0])/(train.circle.x[1]-train.circle.x[0]));
			var hypotenuse = Math.sqrt(Math.pow(train.circle.x[1] - train.circle.x[0],2)+Math.pow((train.circle.y[1]) - train.circle.y[0],2),2);
			train.front.x = background.x + train.circle.x[0] + (hypotenuse/2)*Math.cos(train.displayAngle) + (currentTrainWidth/2-train.width*train.bogieDistance)*Math.cos(train.displayAngle);
			train.front.y = background.y + train.circle.y[0] + (hypotenuse/2)*Math.sin(train.displayAngle) + (currentTrainWidth/2-train.width*train.bogieDistance)*Math.sin(train.displayAngle);
			train.back.x = background.x + train.circle.x[0] + (hypotenuse/2)*Math.cos(train.displayAngle) + (currentTrainWidth/2-train.width+train.width*train.bogieDistance)*Math.cos(train.displayAngle);
			train.back.y = background.y + train.circle.y[0] + (hypotenuse/2)*Math.sin(train.displayAngle) + (currentTrainWidth/2-train.width+train.width*train.bogieDistance)*Math.sin(train.displayAngle);
			train.x = background.x + train.circle.x[0] + (hypotenuse/2)*Math.cos(train.displayAngle) + (currentTrainWidth/2-train.width/2)*Math.cos(train.displayAngle);
			train.y = background.y + train.circle.y[0] + (hypotenuse/2)*Math.sin(train.displayAngle) + (currentTrainWidth/2-train.width/2)*Math.sin(train.displayAngle);
			for(var j = 0; j < train.cars.length; j++){
				train.cars[j].displayAngle = train.displayAngle;
				train.cars[j].front.angle = train.front.angle;
				train.cars[j].back.angle = train.back.angle; 
				if(j >= 1){
					train.cars[j].front.x = train.cars[j-1].x - Math.cos(train.cars[j].displayAngle)*(train.cars[j].width*train.bogieDistance +currentTrainMargin+train.cars[j-1].width/2);
					train.cars[j].front.y = train.cars[j-1].y - Math.sin(train.cars[j].displayAngle)*(train.cars[j].width*train.bogieDistance +currentTrainMargin+train.cars[j-1].width/2);
					train.cars[j].back.x = train.cars[j-1].x - Math.cos(train.cars[j].displayAngle)*(train.cars[j].width*(1-train.bogieDistance)+currentTrainMargin+train.cars[j-1].width/2);
					train.cars[j].back.y = train.cars[j-1].y - Math.sin(train.cars[j].displayAngle)*(train.cars[j].width*(1-train.bogieDistance)+currentTrainMargin+train.cars[j-1].width/2);
					train.cars[j].x = train.cars[j-1].x - Math.cos(train.cars[j].displayAngle)*(train.cars[j].width/2+currentTrainMargin+train.cars[j-1].width/2);
					train.cars[j].y = train.cars[j-1].y - Math.sin(train.cars[j].displayAngle)*(train.cars[j].width/2+currentTrainMargin+train.cars[j-1].width/2);
				} else {
					train.cars[j].front.x = train.x - Math.cos(train.cars[j].displayAngle)*(train.cars[j].width*train.bogieDistance +currentTrainMargin+train.width/2);
					train.cars[j].front.y = train.y - Math.sin(train.cars[j].displayAngle)*(train.cars[j].width*train.bogieDistance +currentTrainMargin+train.width/2);
					train.cars[j].back.x = train.x - Math.cos(train.cars[j].displayAngle)*(train.cars[j].width*(1-train.bogieDistance)+currentTrainMargin+train.width/2);
					train.cars[j].back.y = train.y - Math.sin(train.cars[j].displayAngle)*(train.cars[j].width*(1-train.bogieDistance)+currentTrainMargin+train.width/2);
					train.cars[j].x = train.x - Math.cos(train.cars[j].displayAngle)*(train.cars[j].width/2+currentTrainMargin+train.width/2);
					train.cars[j].y = train.y - Math.sin(train.cars[j].displayAngle)*(train.cars[j].width/2+currentTrainMargin+train.width/2);
				}
			}
		} else if(train.state == 3){
			train.front.angle = train.back.angle = train.displayAngle = Math.PI+Math.asin((train.circle.y[2]-train.circle.y[3])/(train.circle.x[2]-train.circle.x[3]));
			var hypotenuse = Math.sqrt((Math.pow(((train.circle.x[2]) - train.circle.x[3]),2)+(Math.pow(((train.circle.y[2]) - train.circle.y[3]),2))),2);
			train.front.x = background.x + train.circle.x[2] - (hypotenuse/2)*Math.cos(train.displayAngle-Math.PI) - (currentTrainWidth/2-train.width*train.bogieDistance)*Math.cos(train.displayAngle-Math.PI);
			train.front.y = background.y + train.circle.y[2] - (hypotenuse/2)*Math.sin(train.displayAngle-Math.PI) - (currentTrainWidth/2-train.width*train.bogieDistance)*Math.sin(train.displayAngle-Math.PI);
			train.back.x = background.x + train.circle.x[2] - (hypotenuse/2)*Math.cos(train.displayAngle-Math.PI) - (currentTrainWidth/2-train.width*(1-train.bogieDistance))*Math.cos(train.displayAngle-Math.PI);
			train.back.y = background.y + train.circle.y[2] - (hypotenuse/2)*Math.sin(train.displayAngle-Math.PI) - (currentTrainWidth/2-train.width*(1-train.bogieDistance))*Math.sin(train.displayAngle-Math.PI);
			train.x = background.x + train.circle.x[2] - (hypotenuse/2)*Math.cos(train.displayAngle-Math.PI) - (currentTrainWidth/2-train.width/2)*Math.cos(train.displayAngle-Math.PI);
			train.y = background.y + train.circle.y[2] - (hypotenuse/2)*Math.sin(train.displayAngle-Math.PI) - (currentTrainWidth/2-train.width/2)*Math.sin(train.displayAngle-Math.PI);
			for(var j = 0; j < train.cars.length; j++){
				train.cars[j].displayAngle = train.displayAngle;
				train.cars[j].front.angle = train.front.angle;
				train.cars[j].back.angle = train.back.angle; 
				if(j >= 1){
					train.cars[j].front.x = train.cars[j-1].x + Math.cos(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width*train.bogieDistance+currentTrainMargin+train.cars[j-1].width/2);
					train.cars[j].front.y = train.cars[j-1].y + Math.sin(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width*train.bogieDistance+currentTrainMargin+train.cars[j-1].width/2);
					train.cars[j].back.x = train.cars[j-1].x + Math.cos(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width*(1-train.bogieDistance)+currentTrainMargin+train.cars[j-1].width/2);
					train.cars[j].back.y = train.cars[j-1].y + Math.sin(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width*(1-train.bogieDistance)+currentTrainMargin+train.cars[j-1].width/2);
					train.cars[j].x = train.cars[j-1].x + Math.cos(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width/2+currentTrainMargin+train.cars[j-1].width/2);
					train.cars[j].y = train.cars[j-1].y + Math.sin(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width/2+currentTrainMargin+train.cars[j-1].width/2);
				} else {
					train.cars[j].front.x = train.x + Math.cos(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width*train.bogieDistance+currentTrainMargin+train.width/2);
					train.cars[j].front.y = train.y + Math.sin(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width*train.bogieDistance+currentTrainMargin+train.width/2);
					train.cars[j].back.x = train.x + Math.cos(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width*(1-train.bogieDistance)+currentTrainMargin+train.width/2);
					train.cars[j].back.y = train.y + Math.sin(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width*(1-train.bogieDistance)+currentTrainMargin+train.width/2);
					train.cars[j].x = train.x + Math.cos(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width/2+currentTrainMargin+train.width/2);
					train.cars[j].y = train.y + Math.sin(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width/2+currentTrainMargin+train.width/2);
				}
			}
		}
		delete train.state;
	});
}

function defineTrainSpeed(train){
	train.speed = train.speedFac*background.width;
}	
	
function defineTrainParams(){
    
    function getBezierLength(bezierPoints,repNo){
        var x = [];
        var y = [];
        var dis = 0;
        for(var i = 0; i <= repNo; i++){
            x[i] = getBezierPoints(i/repNo,bezierPoints.x[0],bezierPoints.x[1],bezierPoints.x[2],bezierPoints.x[3]);
            y[i] = getBezierPoints(i/repNo,bezierPoints.y[0],bezierPoints.y[1],bezierPoints.y[2],bezierPoints.y[3]);
            if(i > 0) {
                dis += Math.sqrt(Math.pow(Math.abs(x[i-1]-x[i]),2)+Math.pow(Math.abs(Math.abs(y[i-1]-y[i]),2),2));
            }
        }
        return dis;
    }
   
    function getBezierPoints(fac, a,b,c,d) {
          return Math.pow((1-fac),3)*a+3*fac*Math.pow((1-fac),2)*b+3*Math.pow((fac),2)*(1-fac)*c+Math.pow(fac,3)*d;
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
    switches.innerWide.left.y =  0.34 * background.height;
    switches.innerWide.right.x = 0.9 * background.width;
    switches.innerWide.right.y =  0.356 * background.height;    
    
    //OUTER/NARROW
    rotationPoints.outer.narrow.x[0] = rotationPoints.outer.narrow.x[3] = 0.17 * background.width;
    rotationPoints.outer.narrow.x[1] = 0.77 * background.width;
    rotationPoints.outer.narrow.x[2] = 0.795 * background.width;
    rotationPoints.outer.narrow.x[4] = 0.98 * background.width;
    rotationPoints.outer.narrow.x[5] = 0.985 * background.width;
    rotationPoints.outer.narrow.y[0] = 0.013 * background.height;
    rotationPoints.outer.narrow.y[1] = 0.017 * background.height;
    rotationPoints.outer.narrow.y[2] = 0.893 * background.height;
    rotationPoints.outer.narrow.y[3] = 0.882 * background.height;
    rotationPoints.outer.narrow.y[4] = 0.001 * background.height;
    rotationPoints.outer.narrow.y[5] = 0.908 * background.height;
    circles[2] = rotationPoints.outer.narrow;
    
    var repNo = 1000;
    for (var i = 0; i < circles.length; i++) {
        circles[i].bezierLength = {};
        if(circles[i].x[4] !== undefined && circles[i].x[5] !== undefined) {
            bezierPoints = {x:[circles[i].x[1],circles[i].x[4],circles[i].x[5],circles[i].x[2]], y:[circles[i].y[1],circles[i].y[4],circles[i].y[5],circles[i].y[2]]};
            circles[i].bezierLength.right = getBezierLength(bezierPoints,repNo);
        }
        if(circles[i].x[6] !== undefined && circles[i].x[7] !== undefined) {
            bezierPoints = {x:[circles[i].x[3],circles[i].x[6],circles[i].x[7],circles[i].x[0]], y:[circles[i].y[3],circles[i].y[6],circles[i].y[7],circles[i].y[0]]};
            circles[i].bezierLength.left = getBezierLength(bezierPoints,repNo);
        }
    }
    
  /*------------------------------------------------------------------------------------------------------------------*
   *  0---------------------------------------------------------1                                                     *
   *  -      ___       ___                                      -                                                     *
   *  -     |   \      |   \   ________  _____   _______        -        0-3: required                                *
   *  7    |    \     |    \   | __   |  ||__|  | __   |        4        4-7: optional                                *
   *  -   |  / \ \   |  / \ \  | |__| |  ||\    | |__| |        -                                                     *
   *  6  |  /   \ \ |  /   \ \ |______|  ||\\   |______|        5        Ohne optionale Punkte gilt:                  *
   *  -  ______________________________________________         -                   x0 = x3 bzw. x1 = x2              *
   *  -  _______________________________________________        -                                                     *
   *  3---------------------------------------------------------2                                                     *
   *------------------------------------------------------------------------------------------------------------------*/ 
   
   
    //INNER2OUTER/LEFT

    rotationPoints.inner2outer.left.x[1] = -0.039 * background.width;
    rotationPoints.inner2outer.left.x[2] = -0.038 * background.width;
    rotationPoints.inner2outer.left.y[1] = 0.83 * background.height;
    rotationPoints.inner2outer.left.y[2] = 0.03 * background.height;
    bezierPoints = {x:[rotationPoints.inner.narrow.x[3],rotationPoints.inner2outer.left.x[1],rotationPoints.inner2outer.left.x[2],rotationPoints.outer.narrow.x[0]], y:[rotationPoints.inner.narrow.y[3],rotationPoints.inner2outer.left.y[1],rotationPoints.inner2outer.left.y[2],rotationPoints.outer.narrow.y[0]]};
    rotationPoints.inner2outer.left.bezierLength = getBezierLength(bezierPoints,repNo);
    switches.inner2outer.left.x = 0.087 * background.width;
    switches.inner2outer.left.y = 0.77 * background.height;
    switches.outer2inner.left.x = 0.011 * background.width;
    switches.outer2inner.left.y = 0.465 * background.height;
    
    //INNER2OUTER/RIGHT
    rotationPoints.inner2outer.right.x[1] = 0.98 * background.width;
    rotationPoints.inner2outer.right.x[2] = 0.986 * background.width;
    rotationPoints.inner2outer.right.y[1] = 0.015 * background.height;
    rotationPoints.inner2outer.right.y[2] = 0.858 * background.height;
    bezierPoints = {x:[rotationPoints.outer.narrow.x[1],rotationPoints.inner2outer.right.x[1],rotationPoints.inner2outer.right.x[2],rotationPoints.inner.narrow.x[2]], y:[rotationPoints.outer.narrow.y[1],rotationPoints.inner2outer.right.y[1],rotationPoints.inner2outer.right.y[2],rotationPoints.inner.narrow.y[2]]};
    rotationPoints.inner2outer.right.bezierLength = getBezierLength(bezierPoints,repNo);
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
   *  1  |  /   \ \ |  /   \ \ |______|  ||\\   |______|        2                                                     *
   *  -  ______________________________________________         -                                                     *
   *  -  _______________________________________________        -                                                     *
   *  -----------------------------------------------------------                                                     *
   *------------------------------------------------------------------------------------------------------------------*/
   
   
    //OUTER/ALTSTATE3
    switches.outerAltState3.left.x = 0.194 * background.width;
    switches.outerAltState3.left.y =  0.886 * background.height;
    switches.outerAltState3.right.x =  0.77 * background.width;
    switches.outerAltState3.right.y =  0.89 * background.height;
    
    rotationPoints.outer.altState3.right = {x: [], y: []};
    rotationPoints.outer.altState3.right.x[0] = rotationPoints.outer.narrow.x[2];
    rotationPoints.outer.altState3.right.x[1] = 0.64 * background.width;
    rotationPoints.outer.altState3.right.x[2] = rotationPoints.outer.altState3.right.x[0] - ( rotationPoints.outer.altState3.right.x[0] - rotationPoints.outer.altState3.right.x[1])/2;
    rotationPoints.outer.altState3.right.x[3] = rotationPoints.outer.altState3.right.x[0] - ( rotationPoints.outer.altState3.right.x[0] - rotationPoints.outer.altState3.right.x[1])/4;
    rotationPoints.outer.altState3.right.x[4] = rotationPoints.outer.altState3.right.x[1] + ( rotationPoints.outer.altState3.right.x[0] - rotationPoints.outer.altState3.right.x[1])/4;
    rotationPoints.outer.altState3.right.y[0] = rotationPoints.outer.narrow.y[2];
    rotationPoints.outer.altState3.right.y[1] = 0.957 * background.height;
    rotationPoints.outer.altState3.right.y[2] = rotationPoints.outer.altState3.right.y[0] + ( rotationPoints.outer.altState3.right.y[1] - rotationPoints.outer.altState3.right.y[0])/2;    
    rotationPoints.outer.altState3.right.y[3] = rotationPoints.outer.altState3.right.y[0] + ( rotationPoints.outer.altState3.right.y[1] - rotationPoints.outer.altState3.right.y[0])/8;
    rotationPoints.outer.altState3.right.y[4] = rotationPoints.outer.altState3.right.y[1] - ( rotationPoints.outer.altState3.right.y[1] - rotationPoints.outer.altState3.right.y[0])/8;
        
    rotationPoints.outer.altState3.left = {x: [], y: []};
    rotationPoints.outer.altState3.left.x[0] = rotationPoints.outer.narrow.x[3];
    rotationPoints.outer.altState3.left.x[1] = 0.289 * background.width;
    rotationPoints.outer.altState3.left.x[2] = rotationPoints.outer.altState3.left.x[0] + (  rotationPoints.outer.altState3.left.x[1] - rotationPoints.outer.altState3.left.x[0] )/2;
    rotationPoints.outer.altState3.left.x[3] = rotationPoints.outer.altState3.left.x[0] + ( rotationPoints.outer.altState3.left.x[1] -  rotationPoints.outer.altState3.left.x[0] )/4;
    rotationPoints.outer.altState3.left.x[4] = rotationPoints.outer.altState3.left.x[1] - ( rotationPoints.outer.altState3.left.x[1] -  rotationPoints.outer.altState3.left.x[0] )/4;
    rotationPoints.outer.altState3.left.y[0] = rotationPoints.outer.narrow.y[3];
    rotationPoints.outer.altState3.left.y[1] = 0.95 * background.height;
    rotationPoints.outer.altState3.left.y[2] = rotationPoints.outer.altState3.left.y[0] + ( rotationPoints.outer.altState3.left.y[1] - rotationPoints.outer.altState3.left.y[0] )/2;
    rotationPoints.outer.altState3.left.y[3] = rotationPoints.outer.altState3.left.y[0] + ( rotationPoints.outer.altState3.left.y[1] - rotationPoints.outer.altState3.left.y[0] )/8;
    rotationPoints.outer.altState3.left.y[4] = rotationPoints.outer.altState3.left.y[1] - ( rotationPoints.outer.altState3.left.y[1] - rotationPoints.outer.altState3.left.y[0] )/8;

    bezierPoints = {x:[rotationPoints.outer.altState3.right.x[0],rotationPoints.outer.altState3.right.x[3],rotationPoints.outer.altState3.right.x[3],rotationPoints.outer.altState3.right.x[2]], y:[rotationPoints.outer.altState3.right.y[0],rotationPoints.outer.altState3.right.y[3],rotationPoints.outer.altState3.right.y[3],rotationPoints.outer.altState3.right.y[2]]};
    var templenright = getBezierLength(bezierPoints,100);
    bezierPoints = {x:[rotationPoints.outer.altState3.right.x[2],rotationPoints.outer.altState3.right.x[4],rotationPoints.outer.altState3.right.x[4],rotationPoints.outer.altState3.right.x[1]], y:[rotationPoints.outer.altState3.right.y[2],rotationPoints.outer.altState3.right.y[4],rotationPoints.outer.altState3.right.y[4],rotationPoints.outer.altState3.right.y[1]]};
    rotationPoints.outer.altState3.right.bezierLength = templenright + getBezierLength(bezierPoints,100);    
    
    bezierPoints = {x:[rotationPoints.outer.altState3.left.x[0],rotationPoints.outer.altState3.left.x[3],rotationPoints.outer.altState3.left.x[3],rotationPoints.outer.altState3.left.x[2]], y:[rotationPoints.outer.altState3.left.y[0],rotationPoints.outer.altState3.left.y[3],rotationPoints.outer.altState3.left.y[3],rotationPoints.outer.altState3.left.y[2]]};
    var templenleft = getBezierLength(bezierPoints,100);
    bezierPoints = {x:[rotationPoints.outer.altState3.left.x[2],rotationPoints.outer.altState3.left.x[4],rotationPoints.outer.altState3.left.x[4],rotationPoints.outer.altState3.left.x[1]], y:[rotationPoints.outer.altState3.left.y[2],rotationPoints.outer.altState3.left.y[4],rotationPoints.outer.altState3.left.y[4],rotationPoints.outer.altState3.left.y[1]]};
    rotationPoints.outer.altState3.left.bezierLength = templenleft + getBezierLength(bezierPoints,100);

    
  /*------------------------------------------------------------------------------------------------------------------*
   *  -----------------------------------------------------------                                                     *
   *  -      ___       ___                                      -                                                     *
   *  -     |   \      |   \   ________  _____   _______        -                                                     *
   *  -    |    \     |    \   | __   |  ||__|  | __   |        -        0-1: required                                *
   *  -   |  / \ \   |  / \ \  | |__| |  ||\    | |__| |        -                                                     *
   *  -  |  /   \ \ |  /   \ \ |______|  ||\\   |______|        -                                                     *
   *  -  ______________________________________________         -                                                     *
   *  - 3_3__4_4________________________________________4 4 3 3 -                                                     *
   *  0----2----1-------------------------------------1----2----0                                                     *
   *------------------------------------------------------------------------------------------------------------------*/
   
      
 
    /////SPEED/////
	trains.forEach(function(train){
       defineTrainSpeed(train)
    });
    
}

/******************************************
             animate  functions
******************************************/

function animateObjects() {
    
    function animateTrains(input1){
      
        function animateTrain(i) {
            function changeCOSection(cO,isFront){
                if(trains[input1].standardDirection){ // Switch sections
                    if (cO.state == 1 && Math.round(cO.x - background.x) >= Math.round(trains[input1].circle.x[1])) {
                        if(isFront && i == -1 && trains[input1].circleFamily == rotationPoints.outer && switches.outer2inner.right.turned){
                            trains[input1].switchCircles = true;
                        }  
                        if(trains[input1].switchCircles){
                            cO.x = background.x + Math.round(rotationPoints.outer.narrow.x[1]);
                            cO.y = background.y + Math.round(rotationPoints.outer.narrow.y[1]);
                            cO.state = -2; 
                            cO.angle = 0;
                            cO.currentCurveFac = 0;
                            if(isFront && i == -1) {
                                trains[input1].circle = JSON.parse(JSON.stringify(trains[input1].circle));
                                trains[input1].circle.x[2] = rotationPoints.inner.narrow.x[2];
                                trains[input1].circle.y[2] = rotationPoints.inner.narrow.y[2];
                                trains[input1].circle.x[3] = rotationPoints.inner.narrow.x[3];
                                trains[input1].circle.y[3] = rotationPoints.inner.narrow.y[3];
                                trains[input1].circle.x[4] = rotationPoints.inner2outer.right.x[1];
                                trains[input1].circle.y[4] = rotationPoints.inner2outer.right.y[1];
                                trains[input1].circle.x[5] = rotationPoints.inner2outer.right.x[2];
                                trains[input1].circle.y[5] = rotationPoints.inner2outer.right.y[2];
                                trains[input1].circleFamily = null;
                            }
                          } else {
                                cO.x = background.x + Math.round(trains[input1].circle.x[1]);
                                cO.y = background.y + Math.round(trains[input1].circle.y[1]);
                                cO.state++;
                                cO.angle = 0; 
                                cO.currentCurveFac = 0;
                          }
                    } else if (Math.abs(cO.state) == 2 && Math.round(cO.x - background.x) <= Math.round(trains[input1].circle.x[2]) && cO.y - background.y > trains[input1].circle.y[1]+(trains[input1].circle.y[2]-trains[input1].circle.y[1])/2) {
                        if(cO.state == -2 && !isFront && i == trains[input1].cars.length-1) {
                            trains[input1].circle = rotationPoints.inner.narrow;
                            trains[input1].circleFamily = rotationPoints.inner;
                            trains[input1].switchCircles = false;
                        }
                        cO.x = background.x + Math.round(trains[input1].circle.x[2]);
                        cO.y = background.y + Math.round(trains[input1].circle.y[2]);
                        cO.currentCurveFac=0;
                        cO.state = ((trains[input1].circleFamily == rotationPoints.outer && switches.outerAltState3.right.turned && isFront && i == -1) || trains[input1].front.state == -3) ? -3 : 3;
                    } else if (Math.abs(cO.state) == 3 && Math.round(cO.x - background.x) <= Math.round(trains[input1].circle.x[3])) {
                        if(isFront && i == -1 && trains[input1].circleFamily == rotationPoints.inner && switches.inner2outer.left.turned){
                            trains[input1].switchCircles = true;
                        } else if (isFront && i == -1 && trains[input1].circleFamily == rotationPoints.inner && switches.innerWide.left.turned) {
                          trains[input1].circle = rotationPoints.inner.wide;
                        } else if (isFront && i == -1 && trains[input1].circleFamily == rotationPoints.inner) {
                          trains[input1].circle = rotationPoints.inner.narrow;  
                        }
                        if(trains[input1].switchCircles){
                            cO.x = background.x + Math.round(rotationPoints.inner.narrow.x[3]);
                            cO.y = background.y + Math.round(rotationPoints.inner.narrow.y[3]);
                            cO.state = -4; 
                            cO.angle = Math.PI;
                            cO.currentCurveFac = 0;
                            if(isFront && i == -1) {
                                trains[input1].circle = JSON.parse(JSON.stringify(trains[input1].circle));
                                trains[input1].circle.x[0] = rotationPoints.outer.narrow.x[0];
                                trains[input1].circle.y[0] = rotationPoints.outer.narrow.y[0];
                                trains[input1].circle.x[1] = rotationPoints.outer.narrow.x[1];
                                trains[input1].circle.y[1] = rotationPoints.outer.narrow.y[1];
                                trains[input1].circle.x[6] = rotationPoints.inner2outer.left.x[1];
                                trains[input1].circle.y[6] = rotationPoints.inner2outer.left.y[1];
                                trains[input1].circle.x[7] = rotationPoints.inner2outer.left.x[2];
                                trains[input1].circle.y[7] = rotationPoints.inner2outer.left.y[2];
                                trains[input1].circleFamily = null;
                            }
                        } else {
                            cO.x = background.x + Math.round(trains[input1].circle.x[3]);
                            cO.y = background.y + Math.round(trains[input1].circle.y[3]);
                            cO.state=4;
                            cO.angle = Math.PI;
                            cO.currentCurveFac = 0;
                        }
                    } else if (Math.abs(cO.state) == 4 && Math.round(cO.x - background.x) >= Math.round(trains[input1].circle.x[0]) && cO.y - background.y < trains[input1].circle.y[0]+(trains[input1].circle.y[3]-trains[input1].circle.y[0])/2) {
                        if(cO.state == -4 && !isFront && i == trains[input1].cars.length-1) {
                            trains[input1].circle = rotationPoints.outer.narrow;
                            trains[input1].circleFamily = rotationPoints.outer;
                            trains[input1].switchCircles = false;
                        }
                        cO.x = background.x + Math.round(trains[input1].circle.x[0]);
                        cO.y = background.y + Math.round(trains[input1].circle.y[0]);
                        cO.state = 1;            
                    }
                } else {
                    if (cO.state == 1 && Math.round(cO.x - background.x) <= Math.round(trains[input1].circle.x[0])) {
                        if(!isFront && i == trains[input1].cars.length-1 && trains[input1].circleFamily == rotationPoints.outer && switches.outer2inner.left.turned){
                            trains[input1].switchCircles = true;
                        }
                        if(trains[input1].switchCircles){
                            cO.x = background.x + Math.round(rotationPoints.outer.narrow.x[0]);
                            cO.y = background.y + Math.round(rotationPoints.outer.narrow.y[0]);
                            cO.state = -4; 
                            cO.angle = 2*Math.PI;
                            cO.currentCurveFac = 1;
                            if(!isFront && i == trains[input1].cars.length-1) {
                                trains[input1].circle = JSON.parse(JSON.stringify(trains[input1].circle));
                                trains[input1].circle.x[3] = rotationPoints.inner.narrow.x[3];
                                trains[input1].circle.y[3] = rotationPoints.inner.narrow.y[3];
                                trains[input1].circle.x[2] = rotationPoints.inner.narrow.x[2];
                                trains[input1].circle.y[2] = rotationPoints.inner.narrow.y[2];
                                trains[input1].circle.x[6] = rotationPoints.inner2outer.left.x[1];
                                trains[input1].circle.y[6] = rotationPoints.inner2outer.left.y[1];
                                trains[input1].circle.x[7] = rotationPoints.inner2outer.left.x[2];
                                trains[input1].circle.y[7] = rotationPoints.inner2outer.left.y[2];
                                trains[input1].circleFamily = null;
                            }
                        } else {
                                cO.x = background.x + Math.round(trains[input1].circle.x[0]);
                                cO.y = background.y + Math.round(trains[input1].circle.y[0]);
                                cO.state = 4;
                                cO.angle = 2*Math.PI; 
                                cO.currentCurveFac = 1;
                        }
                    } else if (Math.abs(cO.state) == 2 && Math.round(cO.x - background.x) <= Math.round(trains[input1].circle.x[1]) && cO.y - background.y < trains[input1].circle.y[1]+(trains[input1].circle.y[2]-trains[input1].circle.y[1])/2) {
                        if(cO.state == -2 && isFront && i == -1) {
                            trains[input1].circle = rotationPoints.outer.narrow;
                            trains[input1].circleFamily = rotationPoints.outer;
                            trains[input1].switchCircles = false;
                        }
                        cO.x = background.x + Math.round(trains[input1].circle.x[1]);
                        cO.y = background.y + Math.round(trains[input1].circle.y[1]);
                        cO.state=1;
                    } else if (Math.abs(cO.state) == 3 && Math.round(cO.x - background.x) >= Math.round(trains[input1].circle.x[2]) && Math.round(cO.y - background.y) >= background.height/2) {
                        if(!isFront && i == trains[input1].cars.length-1 && trains[input1].circleFamily == rotationPoints.inner && switches.inner2outer.right.turned){
                            trains[input1].switchCircles = true;
                        } else if(!isFront && i == trains[input1].cars.length-1 && trains[input1].circleFamily == rotationPoints.inner && switches.innerWide.right.turned){
                            trains[input1].circle = rotationPoints.inner.wide;
                        } else if(!isFront && i == trains[input1].cars.length-1 && trains[input1].circleFamily == rotationPoints.inner){
                            trains[input1].circle = rotationPoints.inner.narrow;
                        }
                        if(trains[input1].switchCircles){
                            cO.x = background.x + Math.round(rotationPoints.inner.narrow.x[2]);
                            cO.y = background.y + Math.round(rotationPoints.inner.narrow.y[2]);
                            cO.state = -2; 
                            cO.angle = Math.PI;
                            cO.currentCurveFac = 1;
                            if(!isFront && i == trains[input1].cars.length-1) {
                                trains[input1].circle = JSON.parse(JSON.stringify(trains[input1].circle));
                                trains[input1].circle.x[1] = rotationPoints.outer.narrow.x[1];
                                trains[input1].circle.y[1] = rotationPoints.outer.narrow.y[1];
                                trains[input1].circle.x[0] = rotationPoints.outer.narrow.x[0];
                                trains[input1].circle.y[0] = rotationPoints.outer.narrow.y[0];
                                trains[input1].circle.x[4] = rotationPoints.inner2outer.right.x[1];
                                trains[input1].circle.y[4] = rotationPoints.inner2outer.right.y[1];
                                trains[input1].circle.x[5] = rotationPoints.inner2outer.right.x[2];
                                trains[input1].circle.y[5] = rotationPoints.inner2outer.right.y[2];
                                trains[input1].circleFamily = null;
                            }
                        } else {
                            cO.x = background.x + Math.round(trains[input1].circle.x[2]);
                            cO.y = background.y + Math.round(trains[input1].circle.y[2]);
                            cO.state = 2;
                            cO.angle = Math.PI;
                            cO.currentCurveFac = 1;
                        }
                    } else if (Math.abs(cO.state) == 4 && Math.round(cO.x - background.x) >= Math.round(trains[input1].circle.x[3]) && cO.y - background.y > trains[input1].circle.y[0]+(trains[input1].circle.y[3]-trains[input1].circle.y[0])/2) {
                        if(cO.state == -4 && isFront && i == -1) {
                            trains[input1].circle = rotationPoints.inner.narrow;
                            trains[input1].circleFamily = rotationPoints.inner;
                            trains[input1].switchCircles = false;
                        }
                        cO.x = background.x + Math.round(trains[input1].circle.x[3]);
                        cO.y = background.y + Math.round(trains[input1].circle.y[3]);
                        cO.currentCurveFac=0;
                        cO.state = ((trains[input1].circleFamily == rotationPoints.outer && switches.outerAltState3.left.turned && ((trains[input1].cars.length === 0 && trains[input1].back.state == -3) || (trains[input1].cars.length === 0 && !isFront) || (trains[input1].cars.length > 0 && !isFront && i == trains[input1].cars.length-1))) || (trains[input1].cars.length > 0 && trains[input1].cars[trains[input1].cars.length-1].back.state == -3)) ? -3 : 3;

                    }
                }
            }
            
            function setCOPos(cO, isFront) {

                function setCOPosLinear(linearPoints, isBackwards, isRotated){
                    var angleCorr = isRotated? Math.PI:0;
                    var calcCorr = 1;
                    if((isRotated && !isBackwards) || (!isRotated && isBackwards)){
                      calcCorr = -1;
                    }
                    var x = cO.x;
                    var y = cO.y;
                    var angle = Math.asin((linearPoints.y[1]-linearPoints.y[0])/(linearPoints.x[1]-linearPoints.x[0]));
                    var hypotenuse = Math.sqrt(Math.pow((x) - linearPoints.x[0],2)+Math.pow((y) - linearPoints.y[0],2),2);
                    hypotenuse += speed*customSpeed;
                    x = linearPoints.x[0]+calcCorr * (Math.cos(angle)*hypotenuse);
                    y = linearPoints.y[0]+calcCorr * (Math.sin(angle)*hypotenuse);
                    angle += angleCorr;
                    cO.x = x;
                    cO.y = y;
                    cO.angle = angle;
                }
                
                function setCOPosCircle(circlePoints, isBackwards){ 
                    var backwardsCorr = isBackwards ? -1:1;
                    var radius = Math.abs(circlePoints.y[0]-circlePoints.y[1])/2;    
                    var arc = Math.abs(cO.angle)*radius;
                    arc += backwardsCorr*speed*customSpeed; 
                    cO.angle = (arc / radius);
                    var chord = 2* radius * Math.sin((cO.angle)/2);
                    var gamma = Math.PI/2-(Math.PI-(cO.angle))/2;
                    var x = Math.cos(gamma)*chord;
                    var y = Math.sin(gamma)*chord;
                    cO.x = x + circlePoints.x[0];
                    cO.y = y + circlePoints.y[0];
                }
      
                function setCOPosBezier(bezierPoints, isBackwards, length){    
                    function getBezierFac(fac, approxNO, maxDuration) {
                        var x = getBezierPoints((fac),bezierPoints.x[0],bezierPoints.x[1],bezierPoints.x[2],bezierPoints.x[3]);
                        var y = getBezierPoints((fac),bezierPoints.y[0],bezierPoints.y[1],bezierPoints.y[2],bezierPoints.y[3]);
                        var distance = (Math.sqrt(Math.pow((cO.x-x),2)+Math.pow((cO.y-y),2)));
                        var fac1 = fac * (1+1/approxNO);
                        var fac2 = fac * (1-1/approxNO);
                        var x1 = getBezierPoints((fac1),bezierPoints.x[0],bezierPoints.x[1],bezierPoints.x[2],bezierPoints.x[3]);
                        var x2 = getBezierPoints((fac2),bezierPoints.x[0],bezierPoints.x[1],bezierPoints.x[2],bezierPoints.x[3]);
                        var y1 = getBezierPoints((fac1),bezierPoints.y[0],bezierPoints.y[1],bezierPoints.y[2],bezierPoints.y[3]);
                        var y2 = getBezierPoints((fac2),bezierPoints.y[0],bezierPoints.y[1],bezierPoints.y[2],bezierPoints.y[3]);
                        var distance1 = (Math.sqrt(Math.pow((cO.x-x1),2)+Math.pow((cO.y-y1),2)));
                        var distance2 = (Math.sqrt(Math.pow((cO.x-x2),2)+Math.pow((cO.y-y2),2)));
                        var newFac = Math.abs(distance1) < Math.abs(distance2) ? fac1 : fac2;
                        var newDistance = Math.abs(distance1) < Math.abs(distance2) ? distance1 : distance2;
                        return Math.abs(distance) < Math.abs(newDistance) ? fac : (Math.abs(newDistance) < 0.1*Math.abs(bezierPoints.x[0]-bezierPoints.x[3]) || --maxDuration < 1) ? (newFac < 0 ? 0 : newFac > 1 ? 1 : newFac) : getBezierFac(newFac, approxNO, maxDuration);
                    }
                    function getBezierPoints(fac, a,b,c,d) {
                        return Math.pow((1-fac),3)*a+3*fac*Math.pow((1-fac),2)*b+3*Math.pow((fac),2)*(1-fac)*c+Math.pow(fac,3)*d;
                    }
                    function getBezierPointsDifferential(fac, a,b,c,d) {
                        return 3*Math.pow((1-fac),2)*(b-a)+6*fac*(1-fac)*(c-b)+3*Math.pow(fac,2)*(d-c);
                    }
                    function getBezierAngle(fac,a,b) { 
                        var dxdt = getBezierPointsDifferential(fac, a[0],a[1],a[2],a[3]);
                        var dydt = getBezierPointsDifferential(fac, b[0],b[1],b[2],b[3]);
                        return Math.atan2(dydt ,dxdt);
                    }
                    var backwardsCorr = isBackwards? -1 :1;
                    var fac = i < 0 && isFront ? cO.currentCurveFac : getBezierFac(cO.currentCurveFac, 100, 100); 
                    cO.currentCurveFac = fac + backwardsCorr*((speed*customSpeed)/length);                    
                    cO.x = getBezierPoints((cO.currentCurveFac),bezierPoints.x[0],bezierPoints.x[1],bezierPoints.x[2],bezierPoints.x[3]);
                    cO.y = getBezierPoints((cO.currentCurveFac),bezierPoints.y[0],bezierPoints.y[1],bezierPoints.y[2],bezierPoints.y[3]);        
                    cO.angle = getBezierAngle((cO.currentCurveFac),bezierPoints.x,bezierPoints.y);
                }
                var points;    
                if(cO.state == 1){ // Calc bogie position
                    points = {x:[trains[input1].circle.x[0] + background.x,trains[input1].circle.x[1] + background.x],y:[trains[input1].circle.y[0] + background.y,trains[input1].circle.y[1] + background.y]};
                    if(!trains[input1].standardDirection){points.x.reverse();points.y.reverse();}
                    setCOPosLinear(points, !trains[input1].standardDirection, false) ;
                } else if(Math.abs(cO.state) == 2)  { 
                    if(typeof trains[input1].circle.x[4] == "undefined" || typeof trains[input1].circle.x[5] == "undefined" || typeof trains[input1].circle.y[4] == "undefined" || typeof trains[input1].circle.y[5] == "undefined"){
                        points ={x:[trains[input1].circle.x[1]+background.x],y:[trains[input1].circle.y[1]+background.y,trains[input1].circle.y[2]+background.y]};
                        setCOPosCircle(points, !trains[input1].standardDirection);
                    } else { 
                        points ={x:[trains[input1].circle.x[1] + background.x,trains[input1].circle.x[4] + background.x,trains[input1].circle.x[5] + background.x,trains[input1].circle.x[2] + background.x],y:[trains[input1].circle.y[1] + background.y,trains[input1].circle.y[4] + background.y,trains[input1].circle.y[5] + background.y,trains[input1].circle.y[2] + background.y]};
                        setCOPosBezier(points, !trains[input1].standardDirection, cO.state == -2 ? rotationPoints.inner2outer.right.bezierLength : trains[input1].circle.bezierLength.right);
                    }
                } else if (cO.state == 3) {
                    points =  {x:[trains[input1].circle.x[2] + background.x,trains[input1].circle.x[3] + background.x],y:[trains[input1].circle.y[2] + background.y,trains[input1].circle.y[3] + background.y]};
                    if(!trains[input1].standardDirection){points.x.reverse();points.y.reverse();}
                    setCOPosLinear(points,!trains[input1].standardDirection, true, false);
                } else if (cO.state == -3) {
                    if(trains[input1].circleFamily == rotationPoints.outer) {
                        if(cO.x > rotationPoints.outer.altState3.right.x[1]+background.x) {
                            if(cO.x-background.x > rotationPoints.outer.altState3.right.x[2]){
                                points ={x:[background.x+rotationPoints.outer.altState3.right.x[0],background.x+rotationPoints.outer.altState3.right.x[3],background.x+rotationPoints.outer.altState3.right.x[3],background.x+rotationPoints.outer.altState3.right.x[2]],y:[background.y+rotationPoints.outer.altState3.right.y[0],background.y+rotationPoints.outer.altState3.right.y[3],background.y+rotationPoints.outer.altState3.right.y[3],background.y+rotationPoints.outer.altState3.right.y[2]]};
                                setCOPosBezier(points, !trains[input1].standardDirection, 0.5*rotationPoints.outer.altState3.right.bezierLength);
                            } else {
                                points ={x:[background.x+rotationPoints.outer.altState3.right.x[2],background.x+rotationPoints.outer.altState3.right.x[4],background.x+rotationPoints.outer.altState3.right.x[4],background.x+rotationPoints.outer.altState3.right.x[1]],y:[background.y+rotationPoints.outer.altState3.right.y[2],background.y+rotationPoints.outer.altState3.right.y[4],background.y+rotationPoints.outer.altState3.right.y[4],background.y+rotationPoints.outer.altState3.right.y[1]]};
                                points.x.reverse();
                                points.y.reverse();
                                setCOPosBezier(points, trains[input1].standardDirection, 0.5*rotationPoints.outer.altState3.right.bezierLength);
                                cO.angle += Math.PI;
                            }
                        } else if(cO.x > rotationPoints.outer.altState3.left.x[1]+background.x) {
                            points =  {x:[rotationPoints.outer.altState3.right.x[1] + background.x, rotationPoints.outer.altState3.left.x[1] + background.x],y:[rotationPoints.outer.altState3.right.y[1] + background.y,rotationPoints.outer.altState3.left.y[1] + background.y]};
                            if(!trains[input1].standardDirection){points.x.reverse();points.y.reverse();}
                            setCOPosLinear(points,!trains[input1].standardDirection, true);
                            cO.currentCurveFac = 0;
                        } else {
                            if(cO.x-background.x > rotationPoints.outer.altState3.left.x[2]){
                                var x1 = rotationPoints.outer.altState3.left.x[1] + background.x;
                                var x2 = rotationPoints.outer.altState3.left.x[2] + background.x;
                                var x3 = rotationPoints.outer.altState3.left.x[4] + background.x;
                                var y1 = rotationPoints.outer.altState3.left.y[1] + background.y;
                                var y2 = rotationPoints.outer.altState3.left.y[2] + background.y;
                                var y3 = rotationPoints.outer.altState3.left.y[4] + background.y;
                                points ={x:[x1,x3,x3,x2],y:[y1,y3,y3,y2]};
                                setCOPosBezier(points, !trains[input1].standardDirection,0.5*rotationPoints.outer.altState3.left.bezierLength);                    
                            } else {
                                var x1 = rotationPoints.outer.altState3.left.x[2] + background.x;
                                var x2 = rotationPoints.outer.altState3.left.x[0] + background.x;
                                var x3 = rotationPoints.outer.altState3.left.x[3] + background.x;
                                var y1 = rotationPoints.outer.altState3.left.y[2] + background.y;
                                var y2 = rotationPoints.outer.altState3.left.y[0] + background.y;
                                var y3 = rotationPoints.outer.altState3.left.y[3] + background.y;
                                points ={x:[x1,x3,x3,x2],y:[y1,y3,y3,y2]};
                                points.x.reverse();
                                points.y.reverse();
                                setCOPosBezier(points, trains[input1].standardDirection,0.5*rotationPoints.outer.altState3.left.bezierLength);
                                cO.angle += Math.PI;
                            }
                        }
                    }
                } else if(Math.abs(cO.state) == 4 ){
                    if(typeof trains[input1].circle.x[6] == "undefined" || typeof trains[input1].circle.x[7] == "undefined" || typeof trains[input1].circle.y[6] == "undefined" || typeof trains[input1].circle.y[7] == "undefined"){
                        points = {x:[trains[input1].circle.x[0]+background.x],y:[trains[input1].circle.y[0]+background.y,trains[input1].circle.y[3]+background.y]};
                        setCOPosCircle(points, !trains[input1].standardDirection);
                    } else {
                        points ={x:[trains[input1].circle.x[3] + background.x,trains[input1].circle.x[6] + background.x,trains[input1].circle.x[7] + background.x,trains[input1].circle.x[0] + background.x],y:[trains[input1].circle.y[3] + background.y,trains[input1].circle.y[6] + background.y,trains[input1].circle.y[7] + background.y,trains[input1].circle.y[0] + background.y]};
                        setCOPosBezier(points, !trains[input1].standardDirection, cO.state == -4 ? rotationPoints.inner2outer.left.bezierLength : trains[input1].circle.bezierLength.left);       
                    }
                }
            }
      
            function setCOPosCorr(cO,isFront) { // Fix car position and angle relative to locomotive
                function getPointsForPosCorr(x,y,angle,height) {
                    var xa = [];
                    var ya = [];
                    xa[0] = x;
                    xa[1] = x+Math.cos(-Math.PI/2-angle)*height/2;
                    xa[2] = x-Math.cos(-Math.PI/2-angle)*height/2;
                    ya[0] = y;
                    ya[1] = y-Math.sin(-Math.PI/2-angle)*height/2;
                    ya[2] = y+Math.sin(-Math.PI/2-angle)*height/2;
                    return {x:xa,y:ya};
                }
                var prevCurrentObject = isFront ? (i > 0 ? trains[input1].cars[i-1] : trains[input1]) : (currentObject);
                var prevCO = isFront ? (i > 0 ? trains[input1].cars[i-1].back : trains[input1].back) : (currentObject.front);
                var prevPoints = getPointsForPosCorr(prevCO.x, prevCO.y, prevCO.angle, prevCurrentObject.height);    
                var supposedDistance = isFront ? prevCurrentObject.width*prevCurrentObject.bogieDistance+trains[input1].width/trainParams.margin+currentObject.width*currentObject.bogieDistance : currentObject.width-2*currentObject.width*currentObject.bogieDistance;
                var maxRepeatNo = 100;
                var distance;
                do { 
                    var points = getPointsForPosCorr(cO.x, cO.y, cO.angle, currentObject.height);    
                    distance = Math.min(Math.abs(Math.sqrt(Math.pow(points.x[0] - prevPoints.x[0],2)+Math.pow(points.y[0] - prevPoints.y[0],2),2)), Math.abs(Math.sqrt(Math.pow(points.x[1] - prevPoints.x[1],2)+Math.pow(points.y[1] - prevPoints.y[1],2),2)),Math.abs(Math.sqrt(Math.pow(points.x[2] - prevPoints.x[2],2)+Math.pow(points.y[2] - prevPoints.y[2],2),2)));
                    cO.x -= (supposedDistance-distance)*Math.cos(cO.angle);
                    cO.y -= (supposedDistance-distance)*Math.sin(cO.angle);
                } while (Math.abs(supposedDistance-distance) > 0.001 && --maxRepeatNo > 0);
            } 

            function setCurrentObjectDisplayAngle(){
                if((currentObject.front.state) == 1) {
                    currentObject.displayAngle = Math.atan((currentObject.front.y-currentObject.back.y)/(currentObject.front.x-currentObject.back.x));
                } else if(Math.abs(currentObject.front.state) == 2)  { 
                    currentObject.displayAngle = Math.atan((currentObject.front.y-currentObject.back.y)/(currentObject.front.x-currentObject.back.x));
                    if(currentObject.y > background.y+trains[input1].circle.y[1]+(trains[input1].circle.y[2]-trains[input1].circle.y[1])/2 && currentObject.displayAngle < 0) {
                        currentObject.displayAngle = Math.PI+currentObject.displayAngle;
                    }
                    if(currentObject.displayAngle < 0 || currentObject.displayAngle > Math.PI  || (currentObject.y > background.y+trains[input1].circle.y[1]+(trains[input1].circle.y[2]-trains[input1].circle.y[1])*0.75 && currentObject.displayAngle < Math.PI/2) || (currentObject.y < background.y+trains[input1].circle.y[1]+(trains[input1].circle.y[2]-trains[input1].circle.y[1])*0.25 && currentObject.displayAngle > Math.PI/2)){
                      if(currentObject.y > background.y+trains[input1].circle.y[1]+(trains[input1].circle.y[2]-trains[input1].circle.y[1])*0.75){
                        currentObject.displayAngle = Math.PI;
                      } else if (currentObject.y < background.y+trains[input1].circle.y[1]+(trains[input1].circle.y[2]-trains[input1].circle.y[1])*0.25) {
                        currentObject.displayAngle = 0;
                      } else {
                        currentObject.displayAngle -= Math.PI;
                      }
                    }
                } else if (Math.abs(currentObject.front.state) == 3) {
                    currentObject.displayAngle = Math.PI+Math.atan((currentObject.front.y-currentObject.back.y)/(currentObject.front.x-currentObject.back.x));
                } else if(Math.abs(currentObject.front.state) == 4 ){
                    currentObject.displayAngle = Math.PI+Math.atan((currentObject.front.y-currentObject.back.y)/(currentObject.front.x-currentObject.back.x));
                    if(currentObject.y < background.y+trains[input1].circle.y[0]+(trains[input1].circle.y[3]-trains[input1].circle.y[0])/2 && currentObject.displayAngle < Math.PI) {
                        currentObject.displayAngle = 2*Math.PI-(Math.PI-currentObject.displayAngle);
                    }
                    if( currentObject.displayAngle < Math.PI || currentObject.displayAngle > 2*Math.PI || (currentObject.y > background.y+trains[input1].circle.y[0]+(trains[input1].circle.y[3]-trains[input1].circle.y[0])*0.75 && currentObject.displayAngle > 1.5*Math.PI) || (currentObject.y < background.y+trains[input1].circle.y[0]+(trains[input1].circle.y[3]-trains[input1].circle.y[0])*0.25 && currentObject.displayAngle < 1.5*Math.PI)){
                        if(currentObject.y < background.y+trains[input1].circle.y[0]+(trains[input1].circle.y[3]-trains[input1].circle.y[0])*0.25){
                            currentObject.displayAngle = 2*Math.PI;
                        } else if (currentObject.y > background.y+trains[input1].circle.y[0]+(trains[input1].circle.y[3]-trains[input1].circle.y[0])*0.75){
                            currentObject.displayAngle = Math.PI;
                        } else {
                            currentObject.displayAngle += Math.PI;
                        }
                    }
                }
                while(currentObject.displayAngle  < 0) {
                    currentObject.displayAngle  += Math.PI*2;
                }
                while (currentObject.displayAngle  > Math.PI*2){
                    currentObject.displayAngle -= Math.PI*2;
                }
            }
            
            var currentObject = (i < 0)?trains[input1]:trains[input1].cars[i];
            
            if (trains[input1].move) { //Calc train position
            
                if( i == -1 ) { //Calc acceleration
                    if(trains[input1].accelerationSpeed === 0) {
                        trains[input1].accelerationSpeed = trains[input1].accelerationSpeedStartFac;
                    }
                    if(trains[input1].accelerationSpeed > 0 && trains[input1].accelerationSpeed < 1) {
                        trains[input1].accelerationSpeed *= trains[input1].accelerationSpeedFac;
                        if(trains[input1].accelerationSpeed >= 1) {
                            trains[input1].accelerationSpeed = 1;
                        }
                    } else if (trains[input1].accelerationSpeed < 0 && trains[input1].accelerationSpeed >= -1) {
                        trains[input1].accelerationSpeed /= trains[input1].accelerationSpeedFac;
                        if(trains[input1].accelerationSpeed >= -trains[input1].accelerationSpeedStartFac) {
                            trains[input1].accelerationSpeed = 0;
                            trains[input1].move = false;
                        }
                    }
                    if(trains[input1].accelerationSpeedCustom < 1) {
                        trains[input1].accelerationSpeedCustom *= trains[input1].accelerationSpeedFac;
                        if(trains[input1].accelerationSpeedCustom >= 1) {
                            trains[input1].accelerationSpeedCustom = 1;
                        }
                    } else {
                        trains[input1].accelerationSpeedCustom /= trains[input1].accelerationSpeedFac;
                        if(trains[input1].accelerationSpeedCustom <= 1) {
                            trains[input1].accelerationSpeedCustom = 1;
                        }
                    }
                    trains[input1].currentSpeedInPercent = trains[input1].accelerationSpeedCustom*trains[input1].speedInPercent;
                }    
                var speed = Math.abs(trains[input1].speed*trains[input1].accelerationSpeed);
                var customSpeed = trains[input1].currentSpeedInPercent/100;
                    
                changeCOSection(currentObject.front, true);
                changeCOSection(currentObject.back, false);
                setCOPos(currentObject.front, true);
                setCOPos(currentObject.back, false);
            
                if(i == -1) {
                    setCOPosCorr(currentObject.back, false);
                } else {
                    setCOPosCorr(currentObject.front, true);
                    setCOPosCorr(currentObject.back, false);
                }
            
                currentObject.x = (currentObject.front.x+currentObject.back.x)/2;
                currentObject.y = (currentObject.front.y+currentObject.back.y)/2;        
                setCurrentObjectDisplayAngle();
                
            } else {
                trains[input1].accelerationSpeed = 0;
                trains[input1].accelerationSpeedCustom = 1;
            }
        }
         
        for(var i = -1; i < trains[input1].cars.length; i++){
            animateTrain(i);
        }
        
    }

	var starttime = Date.now();
	
    /////TRAINS/////
    for(var i = 0; i < trains.length; i++) {
        animateTrains(i);
    }
	
    /////RECALC/////
	if(animateTimeout !== undefined && animateTimeout !== null) {
		clearTimeout(animateTimeout);
	}
	if(firstRun) {
		firstRun = false;
		postMessage({k: "ready", trains: trains});
	}
	if(online){
		if(syncing){
			postMessage({k: "sync-ready", trains: trains, rotationPoints: rotationPoints});
			syncing = false;
		} else if(!pause){
			var teamplayResttime = Math.max(animateInterval-(Date.now()-starttime),0);
			animateTimeout = setTimeout(animateObjects, teamplayResttime);
		}
	} else {
			var resttime = Math.max(animateInterval-(Date.now()-starttime),0);
			animateTimeout = setTimeout(animateObjects, resttime);
	}
}
var animateTimeout;
var animateInterval = 22;

var rotationPoints = {inner:{narrow:{x:[0,0,0,0],y:[0,0,0,0]}, wide:{x:[0,0,0,0],y:[0,0,0,0]}},outer:{narrow:{x:[0,0,0,0],y:[0,0,0,0]}, altState3:{x:[0,0],y:[0,0]} },inner2outer:{left:{x:[0,0],y:[0,0]}, right:{x:[0,0],y:[0,0]}}};
var trains =  [{src: 1, fac: 0.051, speedFac: (1/500), accelerationSpeedStartFac: 0.02, accelerationSpeedFac: 1.008, circle: rotationPoints.inner.wide, circleFamily: rotationPoints.inner, standardDirectionStartValue: true, bogieDistance: 0.15, state: 1, cars:[{src: 2, fac: 0.060, bogieDistance: 0.15},{src: 2, fac: 0.060, bogieDistance: 0.15},{src: 2, fac: 0.060, bogieDistance: 0.15},{src: 3, fac: 0.044, bogieDistance: 0.15}]},{src: 4,fac: 0.093, speedFac: (1/250), accelerationSpeedStartFac: 0.035, accelerationSpeedFac: 1.013, circle: rotationPoints.outer.narrow, circleFamily: rotationPoints.outer, standardDirectionStartValue: true, bogieDistance: 0.15, state: 3, cars:[{src: 5, fac: 0.11, bogieDistance: 0.15},{src: 6, fac: 0.11, bogieDistance: 0.15}, {src: 7, fac: 0.093, bogieDistance: 0.15}]},{src: 8, fac: 0.068, speedFac: (1/375), accelerationSpeedStartFac: 0.04, accelerationSpeedFac: 1.01, circle: rotationPoints.inner.narrow, circleFamily: rotationPoints.inner, standardDirectionStartValue: false, bogieDistance: 0.15, state: 1, cars:[]}];
var trainParams = {selected: Math.floor(Math.random()*trains.length), margin: 25};
var trainPics;
              
var switches;
var background;

var online;
var pause = false;
var syncing = false;

var firstRun = true;

onmessage = function(message) {
	if(message.data.k == "start") {
		function performance() {
			var startTime=Date.now();
			for(var i = 0; i < 3; i++) {
				var startNo = 12500000;
				var newNo = 1;
				var res;
				while (newNo < startNo) {
					res*=(startNo-newNo);
					newNo++;
				}
			}
			return Date.now()-startTime;
		}
		online = message.data.online;
		animateInterval = online ? message.data.onlineInterval : (Math.min(Math.max(performance()/90*animateInterval, animateInterval), 3*animateInterval));
		background = message.data.background;
		switches = message.data.switches;
		postMessage({k: "getTrainPics", trains: trains});
		postMessage({k: "setTrainParams", trainParams: trainParams});
	} else if(message.data.k == "setTrainPics") {
		trainPics = message.data.trainPics;
        defineTrainParams();
        placeTrainsAtInitialPositions();
		postMessage({k: "switches", switches: switches});
		animateObjects();
	} else if(message.data.k == "resize") {
		background = message.data.background;
		var oldbackground = message.data.oldbackground;
        for(var i = 0; i < trains.length; i++){
          for(var j = 0; j < trains[i].circle.x.length; j++) {
            trains[i].circle.x[j] *= background.width/oldbackground.width;
            trains[i].circle.y[j] *= background.height/oldbackground.height;
          }
        }      
        for(var i = 0; i < trains.length; i++){  
            trains[i].front.x = background.x+((trains[i].front.x-oldbackground.x) * background.width/oldbackground.width);
            trains[i].back.x = background.x+((trains[i].back.x-oldbackground.x) * background.width/oldbackground.width);
            trains[i].x = background.x+((trains[i].x-oldbackground.x) * background.width/oldbackground.width);
            trains[i].front.y = background.y+((trains[i].front.y-oldbackground.y) * background.height/oldbackground.height);
            trains[i].back.y = background.y+((trains[i].back.y-oldbackground.y) * background.height/oldbackground.height);
            trains[i].y = background.y+((trains[i].y-oldbackground.y) * background.height/oldbackground.height);
            trains[i].width = trains[i].width * background.width/oldbackground.width;
            trains[i].height = trains[i].height * background.height/oldbackground.height;
            for(var j = 0; j < trains[i].cars.length; j++){
                trains[i].cars[j].front.x = background.x+((trains[i].cars[j].front.x-oldbackground.x) * background.width/oldbackground.width);
                trains[i].cars[j].back.x = background.x+((trains[i].cars[j].back.x-oldbackground.x) * background.width/oldbackground.width);
                trains[i].cars[j].x = background.x+((trains[i].cars[j].x-oldbackground.x) * background.width/oldbackground.width);
                trains[i].cars[j].front.y = background.y+((trains[i].cars[j].front.y-oldbackground.y) * background.height/oldbackground.height);
                trains[i].cars[j].back.y = background.y+((trains[i].cars[j].back.y-oldbackground.y) * background.height/oldbackground.height);
                trains[i].cars[j].y = background.y+((trains[i].cars[j].y-oldbackground.y) * background.height/oldbackground.height);
                trains[i].cars[j].width = trains[i].cars[j].width * background.width/oldbackground.width;
                trains[i].cars[j].height = trains[i].cars[j].height * background.height/oldbackground.height;
            }
        }   
		defineTrainParams();
		postMessage({k: "switches", switches: switches});
		postMessage({k: "resized"});
	} else if(message.data.k == "getTrains") {
		postMessage({k: "setTrains", trains: trains});
	} else if(message.data.k == "train") {
		message.data.params.forEach(function(param){
			trains[message.data.i][Object.keys(param)[0]] = Object.values(param)[0];
		});
	} else if(message.data.k == "switches") {
		switches = message.data.switches;
	} else if(message.data.k == "sync-request") {
		syncing = true;
	} else if(message.data.k == "sync-t") {
		Object.keys(message.data.d).forEach(function(key){
			trains[message.data.i][key] = message.data.d[key];
		});
		trains[message.data.i].front.x = background.x+(trains[message.data.i].front.x * background.width);
		trains[message.data.i].back.x = background.x+(trains[message.data.i].back.x * background.width);
		trains[message.data.i].x = background.x+(trains[message.data.i].x * background.width);
		trains[message.data.i].front.y = background.y+(trains[message.data.i].front.y * background.height);
		trains[message.data.i].back.y = background.y+(trains[message.data.i].back.y * background.height);
		trains[message.data.i].y = background.y+(trains[message.data.i].y * background.height);
		if(trains[message.data.i].circleFamily != null){
			trains[message.data.i].circle = rotationPoints[trains[message.data.i].circleFamily][trains[message.data.i].circle];
			trains[message.data.i].circleFamily = rotationPoints[trains[message.data.i].circleFamily];
		}
		defineTrainSpeed(trains[message.data.i]);
	} else if(message.data.k == "sync-tc") {
		Object.keys(message.data.d).forEach(function(key){
			trains[message.data.i[0]].cars[message.data.i[1]][key] = message.data.d[key];
		});
		trains[message.data.i[0]].cars[message.data.i[1]].front.x = background.x+(trains[message.data.i[0]].cars[message.data.i[1]].front.x * background.width);
		trains[message.data.i[0]].cars[message.data.i[1]].back.x = background.x+(trains[message.data.i[0]].cars[message.data.i[1]].back.x * background.width);
		trains[message.data.i[0]].cars[message.data.i[1]].x = background.x+(trains[message.data.i[0]].cars[message.data.i[1]].x * background.width);
		trains[message.data.i[0]].cars[message.data.i[1]].front.y = background.y+(trains[message.data.i[0]].cars[message.data.i[1]].front.y * background.height);
		trains[message.data.i[0]].cars[message.data.i[1]].back.y = background.y+(trains[message.data.i[0]].cars[message.data.i[1]].back.y * background.height);
		trains[message.data.i[0]].cars[message.data.i[1]].y = background.y+(trains[message.data.i[0]].cars[message.data.i[1]].y * background.height);
	} else if(message.data.k == "pause") {
		pause = true;
	} else if(message.data.k == "resume") {
		pause = false;
		animateObjects();
	} else if(message.data.k == "debug") {
		postMessage({k: "debug", animateInterval: animateInterval});	
	}
}