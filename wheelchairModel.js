/**
 * Import the needed libraries of jscad
 */
const jscad = require('@jscad/modeling')

/**
 * Create various 3D primitives and color utilities from jscad
 */
const { cuboid, roundedCuboid, torus, cylinder, roundedCylinder } = jscad.primitives
const { colorize, colorNameToRgb } = require('@jscad/modeling').colors
const { rotate, rotateX, translate, rotateY } = require('@jscad/modeling').transforms
const { degToRad } = require('@jscad/modeling').utils
const { union } = require('@jscad/modeling').booleans

/**
 * Establish the constants for the measurements.
 */
const inToMm = 25.4; // conversion as measures are given in inches but mm are needed.
const smallWheelThick = 1.8/2; // radius for the thickness of the small wheel.
const smallWheelRad = 8/2; //radius for the small wheel.
const tubeRad = 1.2/2; // radius for the metal tubes.
const tubeAngleRad = 2; // radius of the torus for the angle tube curves.
const handleHeight = 4; // Length of the push handle
const restThickness = 0.1; // thickness for the back and seatrests.
const wheelHandleThick = 1.3/2; // thickness for the diameter of the wheel handle.
const wheelHandleRad = 23/2; // Radius for the wheel Handle.
const armrestCushionHeight = 1.5; // armrest cushion height
const frontWheelGrabThick = 0.25; // thickness of the front wheels holding structure
const segments = 32; // number of segments to generate per extrusion

function getParameterDefinitions() {
/**
 * Function to get the parameters to show.
 * @returns {Array} An array of parameter definitions.
 */
 
  let units = [
    {name: 'units', type: 'radio', caption: 'Units:', values: [0, 1], captions: ['in', 'mm'], initial: 0},
  ];
  
  const paramInit = units[0].initial == 0 ? [16, 20, 25, 21, 4, 4, 12, 1.5] : [16 * inToMm, 20 * inToMm, 25 * inToMm, 21 * inToMm, 4 * inToMm, 4 * inToMm, 12 * inToMm, 1.5 * inToMm]; // Initial values for parameters

 
  let parameters = [
    {name: 'coreParameters', type: 'group', initial: 'open', caption: 'Core Parameters' },
    {name: 'seatWidth', caption: 'Seat Width:', type: 'float', initial: paramInit[0]},
    {name: 'seatHeight', caption: 'Seat Height:', type: 'float', initial: paramInit[1]},
    {name: 'wheelDiameter', caption: 'Wheel Diameter:', type: 'float', initial: paramInit[2]},
    {name: 'seatToFloorHeight', caption: 'Seat-to-Floor Height:', type: 'float', initial: paramInit[3]},
    {name: 'camberAngle', caption: 'Camber Angle:', type: 'float', initial: 0, min: 0, max: 12},
    {name: 'showPushHandle', caption: 'Show Push Handle:', type: 'checkbox', checked: true},
    {name: 'showArmrest', caption: 'Show Armrest:', type: 'checkbox', checked: true},
    
    {name: 'independentParameters', type: 'group', initial: 'closed', caption: 'Independent Parameters' },
    {name: 'seatCushThick', caption:'Seat Cushion Thickness:', type: 'float', initial: paramInit[4]},
    {name: 'legrestLength', caption: 'Legrest Length:', type: 'float', initial: paramInit[5]},
    {name: 'legrestAngle', caption: 'Legrest Angle:', type: 'float', initial: 75},
    {name: 'seatToBackrestAngle', caption: 'Seat-to-Backrest Angle:', type: 'float', min: 90, initial: 90},
    {name: 'castorForkAngle', caption: 'Castor Folk Angle:', type: 'float', initial: 90, max:90},
    {name: 'footrestLinkLength', caption: 'Footrest Link Length:', type: 'float', initial: paramInit[6]},
    {name: 'wheelThickness', caption: 'Back Wheel Width', type: 'float', initial: paramInit[7]},
  ];
  
  let allParameters = units.concat(parameters);
  
  return allParameters;
}

function createSeatCushion(params,seatDepth,wheelBase) {
/**
 * Creates the seat cushion 3D model.
 * @param {Object} params - The parameters for creating the seat cushion.
 * @returns {Object} The seat cushion 3D model.
 */

  const size = [seatDepth * inToMm, params.seatWidth * inToMm, params.seatCushThick * inToMm];
  const center = [(seatDepth/2 + tubeRad) * inToMm, (wheelBase/2) * inToMm, (params.seatHeight + params.seatCushThick/2) * inToMm];
  
  return roundedCuboid({ size, center, roundRadius: 1 * inToMm, segments: segments});
}

function createBackrest(params,backrestHeight,backrestWidth,wheelBase) {
/**
 * Creates the backrest 3D model.
 * @param {Object} params - The parameters for creating the backrest.
 * @returns {Object} The backrest 3D model.
 */

  const size = [restThickness * inToMm, backrestWidth * inToMm, backrestHeight * inToMm];
  const center = [0 * inToMm, (wheelBase/2) * inToMm, (params.seatToFloorHeight + backrestHeight/2) * inToMm];
  
  return union(translate([0,(wheelBase/2 + backrestWidth/2 + tubeRad) * inToMm,(params.seatToFloorHeight + backrestHeight/2) * inToMm],cylinder({height: backrestHeight * inToMm, radius: (tubeRad + restThickness) * inToMm, segments: segments})),union(translate([0,(wheelBase/2 - backrestWidth/2 - tubeRad) * inToMm,(params.seatToFloorHeight + backrestHeight/2) * inToMm],cylinder({height: backrestHeight * inToMm, radius: (tubeRad + restThickness) * inToMm, segments: segments})),cuboid({ size, center, segments: segments})));
}

function createBackrestStructure(params,backrestHeight) {
/**
 * Creates the structure of the backrest.
 * @param {Object} params - The parameters for creating the backrest structure.
 * @returns {Object} The backrest structure 3D model.
 */

  let structureBar = cylinder({height: (params.seatToFloorHeight + backrestHeight - params.wheelDiameter/2) * inToMm, radius: tubeRad * inToMm, segments: segments});
  let handleCurve = translate([-tubeAngleRad * inToMm,0 * inToMm,((params.seatToFloorHeight + backrestHeight - params.wheelDiameter/2)/2) * inToMm],rotateX(degToRad(90),torus({innerRadius: tubeRad * inToMm, outerRadius: tubeAngleRad * inToMm, outerSegments: 128, outerRotation: degToRad(90)})));
  let pushHandle = translate([(0-handleHeight/2-tubeAngleRad) * inToMm,0 * inToMm,((params.seatToFloorHeight + backrestHeight - params.wheelDiameter/2)/2 + tubeAngleRad) * inToMm],rotateY(degToRad(90),roundedCylinder({height: (handleHeight) * inToMm, radius: (tubeRad + 0.15) * inToMm, segments: segments, roundRadius:0.15 * inToMm})));
  
  if(params.showPushHandle == true){ return union(structureBar,handleCurve,pushHandle);} else {return structureBar;}
  
}

function createSeatrest(params, seatDepth, backrestWidth, wheelBase) {
/**
 * Creates the seatrest 3D model.
 * @param {Object} params - The parameters for creating the seatrest.
 * @returns {Object} The seatrest 3D model.
 */

  const size = [seatDepth * inToMm, params.seatWidth * inToMm, 0.1 * inToMm];
  const center = [(seatDepth/2 + tubeRad) * inToMm,(wheelBase/2) * inToMm,(params.seatHeight) * inToMm];
  let createCylinder = rotateY(degToRad(90),cylinder({height: params.seatWidth * inToMm, radius: (tubeRad + 0.1) * inToMm, segments: segments}));
  
  return union(translate([(seatDepth/2 + tubeRad) * inToMm,(wheelBase/2 + backrestWidth/2 + tubeRad) * inToMm,(params.seatHeight) * inToMm],createCylinder),union(translate([(seatDepth/2 + tubeRad) * inToMm,(wheelBase/2 - backrestWidth/2 - tubeRad) * inToMm,(params.seatHeight) * inToMm],createCylinder),cuboid({ size, center, segments: segments})));
}

function createSeatrestStructure(params, seatDepth) {
/**
 * Creates the structure of the seatrest.
 * @param {Object} params - The parameters for creating the seatrest structure.
 * @returns {Object} The seatrest structure 3D model.
 */
  
  let seatStructure = rotateY(degToRad(90),cylinder({height: (seatDepth + tubeRad + params.wheelDiameter*Math.sin(degToRad(params.seatToBackrestAngle-90))/4) * inToMm, radius: tubeRad * inToMm, segments: segments}));
  let seatrestCurve = translate([((seatDepth + tubeRad)/2) * inToMm,0,- tubeAngleRad * inToMm],rotateX(degToRad(90),torus({innerRadius: tubeRad * inToMm, outerRadius: tubeAngleRad * inToMm, innerSegments: segments, outerSegments: segments, outerRotation: degToRad(90)})));

  return union(seatStructure, seatrestCurve);
}

function createArmrest(params, seatDepth, armrestLength) {
/**
 * Creates the armrest 3D model.
 * @param {Object} params - The parameters for creating the armrest.
 * @returns {Object} The armrest 3D model.
 */
  
  let armStructure = rotateY(degToRad(90),cylinder({height: (seatDepth - tubeAngleRad + params.wheelDiameter*Math.sin(degToRad(params.seatToBackrestAngle-90))) * inToMm, radius: tubeRad * inToMm, segments: segments}));
  let cushionPad = roundedCuboid({size:[armrestLength * inToMm,2 * inToMm, armrestCushionHeight * inToMm],center:[tubeAngleRad/2 * inToMm,0, tubeRad * inToMm],roundRadius:(tubeRad/2 * inToMm),segments:segments});
  
  if(params.showArmrest == true){ return [armStructure,cushionPad]} else {return 0;}
}

function createBackWheel(params) {
/**
 * Creates the structure of the armrest.
 * @param {Object} params - The parameters for creating the armrest structure.
 * @returns {Object} The armrest structure 3D model.
 */
  
  let bigWheel = rotateX(degToRad(90),torus({ innerRadius: params.wheelThickness/2 * inToMm, outerRadius: (params.wheelDiameter/2 - params.wheelThickness/2) * inToMm, outerSegments: segments }));
  const wB = [];
  let wBf = 0;

  for(let i = 0; i<24; i++){
    wB[i] = rotateY(degToRad(360/24*(i)),translate([0,0,(params.wheelDiameter/4) * inToMm],cylinder({height: (params.wheelDiameter/2-params.wheelThickness/2) * inToMm, radius: 0.15 * inToMm, segments: segments})));    
    if(i==1){ wBf = union(wB[i],wB[i-1]);}else if(i>1){wBf = union(wBf,wB[i]);}
  }
  
  return [bigWheel, colorize(colorNameToRgb('silver'),union(wBf))]
}

function createBackWheelStructure(params, wheelBase) {
/**
 * Creates the structure of the back wheel holder.
 * @param {Object} params - The parameters for creating the back wheel holder structure.
 * @returns {Object} The back wheel holder structure 3D model.
 */
  
  let wheelStructure = translate([0,(wheelBase/2) * inToMm,(params.wheelDiameter/2) * inToMm],rotateX(degToRad(90),cylinder({height: (wheelBase+2) * inToMm, radius: 0.5 * inToMm, segments: segments})));
  return wheelStructure;
}

function createWheelHandle(params) {
/**
 * Creates the structure of the back wheel handle.
 * @param {Object} params - The parameters for creating the back wheel handle.
 * @returns {Object} The back wheel handle structure 3D model.
 */

  let wheelHandle = rotateX(degToRad(90),torus({ innerRadius: wheelHandleThick * inToMm, outerRadius: (wheelHandleRad - wheelHandleThick) * inToMm, outerSegments: segments }));
  return wheelHandle;
}

function createFrontWheel(params) {
/**
 * Creates the front wheel 3D model.
 * @param {Object} params - The parameters for creating the front wheel.
 * @returns {Object} The front wheel 3D model.
 */

  const height = (params.seatHeight - tubeAngleRad - (smallWheelRad*2 + smallWheelThick*2));
  const castorFolkMov = (smallWheelRad + smallWheelThick*2) * Math.cos(degToRad(params.castorForkAngle))/2
  let frontWheel = translate([- castorFolkMov * inToMm, 0,0],union(rotateX(degToRad(90),cylinder({height:0.1, radius: smallWheelRad * inToMm, segment: 64})),rotateX(degToRad(90),torus({ innerRadius: smallWheelThick * inToMm, outerRadius: (smallWheelRad - smallWheelThick) * inToMm, outerSegments: segments }))));
  let fwLowCirc = translate([-castorFolkMov * inToMm, 0,0],union(translate([0,(smallWheelThick*3/2) * inToMm,0],rotateX(degToRad(90),cylinder({height: frontWheelGrabThick * inToMm, radius: 1 * inToMm}))),translate([0,(smallWheelThick*3/2) * inToMm,0],rotateX(degToRad(90),cylinder({height: frontWheelGrabThick * inToMm, radius: 1 * inToMm}))),translate([0,(-smallWheelThick*3/2) * inToMm,0],rotateX(degToRad(90),cylinder({height: frontWheelGrabThick * inToMm, radius: 1 * inToMm})))));
  let fwUpCirc = union(translate([0,(smallWheelThick*3/2) * inToMm,(smallWheelRad/2 + smallWheelThick - 1*Math.cos(degToRad(params.castorForkAngle))/2)  * inToMm],rotateX(degToRad(90),cylinder({height: frontWheelGrabThick * inToMm, radius: 1 * inToMm}))),translate([0,(-smallWheelThick*3/2) * inToMm,(smallWheelRad/2 + smallWheelThick - 1*Math.cos(degToRad(params.castorForkAngle))/2) * inToMm],rotateX(degToRad(90),cylinder({height: frontWheelGrabThick * inToMm, radius: 1 * inToMm}))));
  let fwUpCube = union(cuboid({size:[smallWheelRad/2 * inToMm , (smallWheelThick*3) * inToMm, frontWheelGrabThick * inToMm], center:[0,0, (smallWheelRad + smallWheelThick*2 - frontWheelGrabThick/2) * inToMm]}),cuboid({size:[smallWheelRad/2 * inToMm , frontWheelGrabThick * inToMm, (smallWheelRad + smallWheelThick*2 + 1*Math.cos(degToRad(params.castorForkAngle)))/2 * inToMm], center:[0,(smallWheelThick*3/2) * inToMm,((smallWheelRad/2 + smallWheelThick) * 3/2 - 1*Math.cos(degToRad(params.castorForkAngle))/3) * inToMm]}),cuboid({size:[2 * inToMm , frontWheelGrabThick * inToMm, (smallWheelRad + smallWheelThick*2 + 1*Math.cos(degToRad(params.castorForkAngle)))/2 * inToMm], center:[0,(-smallWheelThick*3/2) * inToMm,((smallWheelRad/2 + smallWheelThick) * 3/2 - 1*Math.cos(degToRad(params.castorForkAngle))/3) * inToMm]}));
  let fwLowCube = translate([-castorFolkMov * inToMm, 0,0],rotateY(degToRad(90 - params.castorForkAngle),union(cuboid({size:[smallWheelRad/2 * inToMm , frontWheelGrabThick * inToMm, (smallWheelRad + smallWheelThick*2)/2 * inToMm], center:[0,(smallWheelThick*3/2) * inToMm,(smallWheelRad/2 + smallWheelThick)/2 * inToMm]}),cuboid({size:[2 * inToMm , frontWheelGrabThick * inToMm, (smallWheelRad + smallWheelThick*2)/2 * inToMm], center:[0,(-smallWheelThick*3/2) * inToMm,(smallWheelRad/2 + smallWheelThick)/2 * inToMm]}))));
  let fwCil = translate([-castorFolkMov * inToMm, 0,0],rotateX(degToRad(90),cylinder({height: smallWheelThick*3 * inToMm, radius: frontWheelGrabThick * inToMm})));
  let fwBar = cylinder({height: height * inToMm, radius: tubeRad * inToMm, center:[0,0,(smallWheelRad + smallWheelThick*2 + height/2) * inToMm], segments: segments});
  let fwGrab = union(fwLowCirc,fwUpCirc,fwUpCube,fwCil,fwLowCube);
  return [frontWheel,fwGrab,fwBar]
}

function createLegrestStructure(params,side) {
 /**
 * Creates the legrest structure 3D model.
 * @param {Object} params - The parameters for creating the legrest structure.
 * @returns {Object} The legrest structure 3D model.
 */
 
  let legrestPosY = side == 0 ? (params.legrestLength/2 + tubeRad) : -(params.legrestLength/2 + tubeRad);
  
  let legStructure = union(translate([-tubeAngleRad * inToMm,0,params.footrestLinkLength/2 * inToMm],rotateX(degToRad(90),torus({innerRadius: tubeRad * inToMm, outerRadius: tubeAngleRad * inToMm, innerSegments: segments, outerSegments: segments, outerRotation: degToRad(params.legrestAngle)}))),cylinder({height: params.footrestLinkLength * inToMm, radius: tubeRad * inToMm, segments: segments}));
  let legLowStructure = translate([(params.footrestLinkLength/4) * inToMm,0,-(params.footrestLinkLength/2)* inToMm],rotateY(degToRad(90),cylinder({height: (params.footrestLinkLength/2) * inToMm, radius: tubeRad * inToMm, segments: segments})));
  let legRestBase = union(roundedCuboid({size: [(params.footrestLinkLength/2) * inToMm, (params.legrestLength + tubeRad) * inToMm, 0.1 * inToMm],center:[(params.footrestLinkLength/2 - tubeAngleRad/2) * inToMm,legrestPosY * inToMm,-(params.footrestLinkLength/2)* inToMm], roundRadius: 0.01*inToMm, segments: segments}),translate([(params.footrestLinkLength/2 - tubeAngleRad/2) * inToMm,0,-(params.footrestLinkLength/2)* inToMm],rotateY(degToRad(90),cylinder({height: (params.footrestLinkLength/2) * inToMm, radius: (tubeRad + 0.1) * inToMm, segments: segments}))));
  let legrest = union(translate([-(tubeAngleRad+1+(params.footrestLinkLength*Math.cos(degToRad(params.legrestAngle)))/2) * inToMm,0,(params.footrestLinkLength/2 + tubeAngleRad - ((params.footrestLinkLength - tubeAngleRad*2 - tubeRad*2)*Math.sin(degToRad(90-params.legrestAngle)))/2)* inToMm],rotateY(degToRad(90),cylinder({height: (2+1*Math.cos(degToRad(params.legrestAngle)))* inToMm, radius: tubeRad * inToMm, segments: segments}))),rotateY(degToRad(-(90-params.legrestAngle)),union(legStructure,legLowStructure,legRestBase)));
  
  return legrest;
}

function main(params) {
/**
 * Creates the wheelchair 3D model.
 * @param {Object} params - The parameters for creating the wheelchair.
 * @returns {Object} The wheelchair 3D model.
 */

  // Parameters relations as previously defined.
  const wBClearance = 1;
  const seatDepth = params.seatWidth;
  const backrestHeight = params.seatWidth;
  const backrestWidth = params.seatWidth;
  const armrestHeight = 0.5 * params.seatWidth;
  const armrestLength = 0.6 * params.seatWidth;
  const wheelBase = params.seatWidth + tubeRad * 4 + params.wheelThickness/2 * 2 + wBClearance + params.wheelDiameter*Math.sin(degToRad(params.camberAngle));
  const overallWidth = wheelBase + 2 * wheelHandleThick + wBClearance;
  const seatToArmrestHeight = 0.5 * params.seatWidth;
  const overallLength = 0;
  const overallHeight = 34;
  const pushHandleHeight = overallHeight;

  // generate the parts of the 3d model
  let seatCushion = colorize(colorNameToRgb('black'),createSeatCushion(params,seatDepth,wheelBase));
  let seatrest = colorize(colorNameToRgb('silver'),union(translate([(seatDepth/2 + tubeRad/2) * inToMm,(wheelBase/2 - backrestWidth/2 - tubeRad) * inToMm,(params.seatHeight) * inToMm],createSeatrestStructure(params,seatDepth)),translate([(seatDepth/2 + tubeRad/2) * inToMm,(wheelBase/2 + backrestWidth/2 + tubeRad) * inToMm,(params.seatHeight) * inToMm],createSeatrestStructure(params,seatDepth)),createBackWheelStructure(params,wheelBase),createSeatrest(params,seatDepth,backrestWidth,wheelBase)));
  let armrests = colorize(colorNameToRgb('silver'),union(translate([((seatDepth - tubeAngleRad)/2) * inToMm, (wheelBase/2 - backrestWidth/2 - tubeRad*3 - 0.1) * inToMm,(armrestHeight + params.seatHeight) * inToMm],createArmrest(params,seatDepth,armrestLength)),translate([((seatDepth - tubeAngleRad)/2) * inToMm, (wheelBase/2 + backrestWidth/2 + tubeRad*3 + 0.1) * inToMm,(armrestHeight + params.seatHeight) * inToMm],createArmrest(params,seatDepth,armrestLength))));
  let backWheels = colorize(colorNameToRgb('silver'),union(translate([0,0,(params.wheelDiameter/2) * inToMm],rotateX(-degToRad(params.camberAngle),createBackWheel(params))),translate([0,(wheelBase) * inToMm,(params.wheelDiameter/2) * inToMm],rotateX(degToRad(params.camberAngle),createBackWheel(params)))));
  let wheelHandles = colorize(colorNameToRgb('dimgrey'),union(translate([0,(0 - (overallWidth - wheelBase)/2) * inToMm,(params.wheelDiameter/2) * inToMm],rotateX(-degToRad(params.camberAngle),createWheelHandle(params))),translate([0,((overallWidth - 0.25) - (overallWidth - wheelBase)/2) * inToMm,(params.wheelDiameter/2) * inToMm],rotateX(degToRad(params.camberAngle),createWheelHandle(params)))));
  let frontWheels = colorize(colorNameToRgb('silver'),union(translate([(seatDepth + tubeAngleRad + tubeRad) * inToMm, (wheelBase/2 - backrestWidth/2 - tubeRad) * inToMm, smallWheelRad * inToMm],createFrontWheel(params)),translate([(seatDepth + tubeAngleRad + tubeRad) * inToMm, (wheelBase/2 + backrestWidth/2 + tubeRad) * inToMm, smallWheelRad * inToMm],createFrontWheel(params))));
  let backrest = colorize(colorNameToRgb('silver'),translate([params.wheelDiameter*Math.sin(degToRad(params.seatToBackrestAngle-90))/2*inToMm,0,0],rotateY(degToRad(90-params.seatToBackrestAngle),union(createBackrest(params,backrestHeight,backrestWidth,wheelBase),translate([0,(wheelBase/2 - backrestWidth/2 - tubeRad) * inToMm,((params.seatToFloorHeight + backrestHeight - params.wheelDiameter/2)/2 + params.wheelDiameter/2) * inToMm],createBackrestStructure(params,backrestHeight,wheelBase)),translate([0,(wheelBase/2 + backrestWidth/2 + tubeRad) * inToMm,((params.seatToFloorHeight + backrestHeight - params.wheelDiameter/2)/2 + params.wheelDiameter/2) * inToMm],createBackrestStructure(params,backrestHeight,wheelBase))))));
  let legrests = colorize(colorNameToRgb('silver'),union(translate([(seatDepth + tubeAngleRad*3/2 + tubeRad + (tubeAngleRad+1+(params.footrestLinkLength*Math.cos(degToRad(params.legrestAngle)))/2)) * inToMm, (wheelBase/2 - backrestWidth/2 - tubeRad) * inToMm, (params.footrestLinkLength-tubeRad*2) * inToMm],createLegrestStructure(params,0)),translate([(seatDepth + tubeAngleRad*3/2 + tubeRad + (tubeAngleRad+1+(params.footrestLinkLength*Math.cos(degToRad(params.legrestAngle)))/2)) * inToMm, (wheelBase/2 + backrestWidth/2 + tubeRad) * inToMm, (params.footrestLinkLength-tubeRad*2) * inToMm],createLegrestStructure(params,1))));

  return [
    seatCushion, backrest, seatrest, backWheels, wheelHandles, armrests, frontWheels, legrests
  ]
}

// Export the model and parameters to display on the screen
module.exports = { main, getParameterDefinitions }
