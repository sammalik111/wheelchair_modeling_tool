# Safety and Independence of Passengers in Wheelchairs Using Automated Vehicles and Aircraft

We have multiple projects to ensure that people who travel while seated in their wheelchairs can safely and independently do so in automated vehicles where there may not be a driver to assist in securing the wheelchair, or in aircraft where personal wheelchair use is not currently allowed. Student researchers could help with measuring the posture and shape of volunteers using wheelchairs, help with dynamic test fixture design and laboratory testing, assist with data analysis, or help create computational models of wheelchair geometry.

The idea of the project is to develop a tool with the usage of JSCAD that helps the user change the different measured parameters for a manual wheelchair and lets the program update accordingly, this way the auto manufacturers can create safer and more accessible vehicles for people in wheelchairs. An example of this implementation can be seen on the following page http://humanshape.org/index.html#home.

JSCAD (formally known as OpenJSCAD) provides a programmer’s approach when designing 3D models. JSCAD is an open-source set of modular, browser, and command-line tools for creating parametric 2D and 3D designs with JavaScript code. It provides a quick, precise, and reproducible method for generating 3D models, and is especially useful for 3D printing applications.

## Setup
The JSCAD website can be used immediately by visiting the project website at https://openjscad.xyz. Most features can be accessed through this website which is really good for beginners to start familiarizing themselves with it. This is a great way to learn about JSCAD, view 3D and 2D designs, and create something new.

If you want to learn more about other implementations to run the model, you can check on the following page:
https://github.com/jscad/OpenJSCAD.org

## Model

The generated JSCAD model renders a 3D CAD Manual Wheelchair, allowing the user to toggle between the following parameters, for dimension setting and personalization:
- Units, either millimeters or inches (function pending, the only parameter is displayed).
#### CORE PARAMETERS
- Seat Width
- Seat Height
- Wheel Diameter
- Seat-To-Floor Height
- Chamber Angle
- Option to show Push Handle
- Option to show Armests

#### INDEPENDENT PARAMETERS
- Seat Cushion Thickness
- Legrest Length
- Legrest Angle
- Seat-to-Backrest Angle
- Castor Folk Angle
- Footrest Link Length
- Back Wheel Width

## Visual Examples
#### Full Wheelchair Model
<img width="1680" alt="image" src="https://github.com/juliomtz00/sure-wheelchair-model/assets/71898558/f56eb0bf-c8b1-4845-b74d-c408b968ddb2">

#### Wheelchair Model without Push Handles and Armrests
<img width="1680" alt="image" src="https://github.com/juliomtz00/sure-wheelchair-model/assets/71898558/728f02b0-3fb2-47b7-a95f-f18e89ce80af">

#### Wheelchair Model with angular adjustments
<img width="1680" alt="image" src="https://github.com/juliomtz00/sure-wheelchair-model/assets/71898558/a484dc76-c73d-4192-b6d2-5685f80f65e5">
<img width="1680" alt="image" src="https://github.com/juliomtz00/sure-wheelchair-model/assets/71898558/3db281b5-abe4-4b29-a343-a3548cf019c6">

## Documentation
All the information about how to develop modeling software to work with JSCAD is available in the following documentation links:

https://openjscad.xyz/docs/tutorial-01_gettingStarted.html

https://openjscad.xyz/dokuwiki/doku.php?id=en:jscad_quick_reference

If you need to learn more about JavaScript, the language in which the modeling tool is based, the following page can offer a lot of information for beginners:

https://www.w3schools.com/js/default.asp

https://learn.coderslang.com/0028-html-colors-with-names-hex-and-rgb-codes/

## Future Development

The final idea for the project is to implement a web application through the JSCAD tool, that allows the user to import parameters from a JSON file and export them in any 3D model developing extension that is needed by the user. This development could not be done in time, but the following links show some implementation examples, that can help do it in the future.

https://openjscad.nodebb.com/topic/88/a-little-web-app-using-openjscad/4

https://github.com/danmarshall/jscad-gallery

https://gitlab.com/johnwebbcole/vesa-shelf

https://github.com/platypii/ParaDrone/tree/480c5677809e86faf422783921f55a2a380f9fef/website

http://3d.hrg.hr/jscad/three/threejscad2.html?uri=#model.screw.js

Also, the following links explain how to insert the developing tool inside a web page or application for the developer to understand:

https://github.com/jscad/OpenJSCAD.org/blob/master/CONTRIBUTING.md

https://openjscad.nodebb.com/topic/235/threejs-integration

https://gen.haxit.org/organizer/

https://joostn.github.io/OpenJsCad/

## Help

This GitHub repository was created by Julio Enrique Martinez Robledo (@julio.mtz00) for the 2023 Summer Undergraduate Research in Engineering Program at the University of Michigan in Collaboration with the Transportation Research Institute (UMTRI).

Any questions that may arise can be added to the issues section or sent through email at julio.martinezr@udem.edu and juliomar@umich.edu
