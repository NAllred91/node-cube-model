'use strict';

var _ = require('underscore'),
	TOP = 0,
	LEFT = 1,
	FRONT = 2,
	RIGHT = 3,
	BACK = 4,
	BOTTOM = 5,
	FACEARRAY = [0,1,2,3,4,5,6,7,8],
	FACEARRAYCW = [6,3,0,7,4,1,8,5,2],
	FACEARRAYCCW = [2,5,8,1,4,7,0,3,6],
	FACEARRAY180 = [8,7,6,5,4,3,2,1,0],
	NOROTATE = "NOROTATE",
	CW = "CW",
	CCW = "CCW",
	FLIP = "FLIP",
	ROTATECUBEFORWARD = "ROTATECUBEFORWARD",
	ROTATECUBEBACK = "ROTATECUBEBACK",
	ROTATECUBECW = "ROTATECUBECW",
	ROTATECUBECCW = "ROTATECUBECCW",
	ROTATECUBELEFT = "ROTATECUBELEFT",
	ROTATECUBERIGHT = "ROTATECUBERIGHT";

exports.TOP = TOP;
exports.LEFT = LEFT;
exports.FRONT = FRONT;
exports.RIGHT = RIGHT;
exports.BACK = BACK;
exports.BOTTOM = BOTTOM;

// Clone the arrays so that they can't be changed.
exports.FACEARRAY = _.clone(FACEARRAY);
exports.FACEARRAYCW = _.clone(FACEARRAYCW);
exports.FACEARRAYCCW = _.clone(FACEARRAYCCW);
exports.FACEARRAY180 = _.clone(FACEARRAY180);
exports.NOROTATE = NOROTATE;
exports.CW = CW;
exports.CCW = CCW;
exports.FLIP = FLIP;

exports.ROTATECUBEFORWARD = ROTATECUBEFORWARD;
exports.ROTATECUBEBACK = ROTATECUBEBACK;
exports.ROTATECUBECW = ROTATECUBECW;
exports.ROTATECUBECCW = ROTATECUBECCW;
exports.ROTATECUBELEFT = ROTATECUBELEFT;
exports.ROTATECUBERIGHT = ROTATECUBERIGHT;

// An array of all the pieces that make up the cube.
exports.PIECELOCATIONS = [
	[[TOP,0],[LEFT,0],[BACK,2]],
	[[TOP,2],[BACK,0],[RIGHT,2]],
	[[TOP,6],[LEFT,2],[FRONT,0]],
	[[TOP,8],[FRONT,2],[RIGHT,0]],
	[[BOTTOM,0],[LEFT,8],[FRONT,6]],
	[[BOTTOM,2],[FRONT,8],[RIGHT,6]],
	[[BOTTOM,6],[LEFT,6],[BACK,8]],
	[[BOTTOM,8],[BACK,6],[RIGHT,8]],
	[[TOP,1],[BACK,1]],
	[[TOP,3],[LEFT,1]],
	[[TOP,5],[RIGHT,1]],
	[[TOP,7],[FRONT,1]],
	[[BOTTOM,1],[FRONT,7]],
	[[BOTTOM,3],[LEFT,7]],
	[[BOTTOM,5],[RIGHT,7]],
	[[BOTTOM,7],[BACK,7]],
	[[LEFT,5],[FRONT,3]],
	[[FRONT,5],[RIGHT,3]],
	[[RIGHT,5],[BACK,3]],
	[[BACK,5],[LEFT,3]]
];

// Keys are the faces, the array of pairs
// indicate what faces are adjacent and the squares on
// that face that boarder the key face.  Both arrays
// ascend in a clockwise order.
exports.RELATIONS = {
	0: [
		[BACK, [2,1,0]],
		[RIGHT, [2,1,0]],
		[FRONT, [2,1,0]],
		[LEFT, [2,1,0]]
	],
	1: [
		[TOP, [0,3,6]],
		[FRONT, [0,3,6]],
		[BOTTOM, [0,3,6]],
		[BACK, [8,5,2]]
	],
	2: [
		[TOP, [6,7,8]], 
		[RIGHT, [0,3,6]], 
		[BOTTOM, [2,1,0]],
		[LEFT, [8,5,2]]
	],
	3: [
		[TOP, [8,5,2]], 
		[BACK, [0,3,6]], 
		[BOTTOM, [8,5,2]],
		[FRONT, [8,5,2]]
	],
	4: [
		[RIGHT, [8,5,2]],
		[TOP, [2,1,0]],
		[LEFT, [0,3,6]],
		[BOTTOM, [6,7,8]]
	],
	5: [
		[FRONT, [6,7,8]],
		[RIGHT, [6,7,8]],
		[BACK, [6,7,8]],
		[LEFT, [6,7,8]] 
	]
};

/**
 All possible orientations of the cube.
 Orientations are described with an orde2 pair
 indicating what face is at the top and what face
 is to the left.
**/
exports.ORIENTATIONS = {
	// [Top,Left]
	0: [
		// Key is the face, the pair is what face will be put on that face and how you'll have to rotate the original face to make it fit.
		[0, NOROTATE],
		[1, NOROTATE],
		[2, NOROTATE],
		[3, NOROTATE],
		[4, NOROTATE],
		[5, NOROTATE]
	],
	// [Top,Front]
	1: [
		[0, CW],
		[2, NOROTATE],
		[3, NOROTATE],
		[4, NOROTATE],
		[1, NOROTATE], 
		[5, CCW]
	],
	// [Top,Right]
	2: [
		 [0, FLIP],
		 [3, NOROTATE],
		 [4, NOROTATE],
		 [1, NOROTATE],
		 [2, NOROTATE],
		 [5, FLIP]
	],
	// [Top,Back]
	3: [
		 [0, CCW],
		 [4, NOROTATE],
		 [1, NOROTATE],
		 [2, NOROTATE],
		 [3, NOROTATE],
		 [5, CW]
	],
	// [Front,Left]
	4: [
		 [2, NOROTATE],
		 [1, CCW],
		 [5, NOROTATE],
		 [3, CW],
		 [0, FLIP],
		 [4, FLIP]
	],
	// [Front,Bottom]
	5: [
		 [2, CW],
		 [5, NOROTATE],
		 [3, CW],
		 [0, FLIP],
		 [1, CCW],
		 [4, CW]
	],
	// [Front,Right]
	6: [
		 [2, FLIP],
		 [3, CW],
		 [0, FLIP],
		 [1, CCW],
		 [5, NOROTATE],
		 [4, NOROTATE]
	],
	// [Front,Top]
	7: [
		 [2, CCW],
		 [0, FLIP],
		 [1, CCW],
		 [5, NOROTATE],
		 [3, CW],
		 [4, CCW]
	],
	// [Bottom,Left]
	8: [
		 [5, NOROTATE],
		 [1, FLIP],
		 [4, FLIP],
		 [3, FLIP],
		 [2, FLIP],
		 [0, NOROTATE]
	],
	// [Bottom,Back]
	9: [
		 [5, CW],
		 [4, FLIP],
		 [3, FLIP],
		 [2, FLIP],
		 [1, FLIP],
		 [0, CCW]
	],
	// [Bottom,Right]
	10: [
		 [5, FLIP],
		 [3, FLIP],
		 [2, FLIP],
		 [1, FLIP],
		 [4, FLIP],
		 [0, FLIP]
	],
	// [Bottom,Front]
	11: [
		 [5, CCW],
		 [2, FLIP],
		 [1, FLIP],
		 [4, FLIP],
		 [3, FLIP],
		 [0, CW]
	],
	// [Back,Left]
	12: [
		 [4, FLIP],
		 [1, CW],
		 [0, NOROTATE],
		 [3, CCW],
		 [5, FLIP],
		 [2, NOROTATE]
	],
	// [Back,Top]
	13: [
		 [4, CCW],
		 [0, NOROTATE],
		 [3, CCW],
		 [5, FLIP],
		 [1, CW],
		 [2, CCW]
	],
	// [Back,Right]
	14: [
		 [4, NOROTATE],
		 [3, CCW],
		 [5, FLIP],
		 [1, CW],
		 [0, NOROTATE],
		 [2, FLIP]
	],
	// [Back,Bottom]
	15: [
		 [4, CW],
		 [5, FLIP],
		 [1, CW],
		 [0, NOROTATE],
		 [3, CCW],
		 [2, CW]
	],
	// [Right,Front]
	16: [
		 [3, NOROTATE],
		 [2, CCW],
		 [5, CCW],
		 [4, CW],
		 [0, CCW],
		 [1, FLIP]
	],
	// [Right,Bottom]
	17: [
		 [3, CW],
		 [5, CCW],
		 [4, CW],
		 [0, CCW],
		 [2, CCW],
		 [1, CW]
	],
	// [Right,Back]
	18: [
		 [3, FLIP],
		 [4, CW],
		 [0, CCW],
		 [2, CCW],
		 [5, CCW],
		 [1, NOROTATE]
	],
	// [Right,Top]
	19: [
		 [3, CCW],
		 [0, CCW],
		 [2, CCW],
		 [5, CCW],
		 [4, CW],
		 [1, CCW]
	],
	// [Left,Front]
	20: [
		 [1, FLIP],
		 [2, CW],
		 [0, CW],
		 [4, CCW],
		 [5, CW],
		 [3, NOROTATE]
	],
	// [Left,Top]
	21: [
		 [1, CCW],
		 [0, CW],
		 [4, CCW],
		 [5, CW],
		 [2, CW],
		 [3, CCW]
	],
	// [Left,Back]
	22: [
		 [1, NOROTATE],
		 [4, CCW],
		 [5, CW],
		 [2, CW],
		 [0, CW],
		 [3, FLIP]
	],
	// [Left,Bottom]
	23: [
		 [1, CW],
		 [5, CW],
		 [2, CW],
		 [0, CW],
		 [4, CCW],
		 [3, CW]
	]
};

var ROTATECUBEBACKMAP = {
	0:4,
	1:16,
	2:14,
	3:22,
	4:8,
	5:17,
	6:2,
	7:23,
	8:12,
	9:18,
	10:6,
	11:20,
	12:0,
	13:19,
	14:10,
	15:21,
	16:11,
	17:15,
	18:3,
	19:7,
	20:1,
	21:13,
	22:9,
	23:5
};

var ROTATECUBEFORWARDMAP = _.invert(ROTATECUBEBACKMAP);

var ROTATECUBECWMAP = {
	0:1,
	1:2,
	2:3,
	3:0,
	4:5,
	5:6,
	6:7,
	7:4,
	8:9,
	9:10,
	10:11,
	11:8,
	12:13,
	13:14,
	14:15,
	15:12,
	16:17,
	17:18,
	18:19,
	19:16,
	20:21,
	21:22,
	22:23,
	23:20
};

var ROTATECUBECCWMAP = _.invert(ROTATECUBECWMAP);

var ROTATECUBELEFTMAP = {
	0:19,
	1:15,
	2:21,
	3:7,
	4:16,
	5:1,
	6:20,
	7:11,
	8:17,
	9:5,
	10:23,
	11:13,
	12:18,
	13:3,
	14:22,
	15:9,
	16:14,
	17:2,
	18:6,
	19:10,
	20:12,
	21:8,
	22:4,
	23:0
};

var ROTATECUBERIGHTMAP = _.invert(ROTATECUBELEFTMAP);

var CUBEROTATIONMAPS = {};

CUBEROTATIONMAPS[ROTATECUBEFORWARD] = _.clone(ROTATECUBEFORWARDMAP);
CUBEROTATIONMAPS[ROTATECUBEBACK] = _.clone(ROTATECUBEBACKMAP);
CUBEROTATIONMAPS[ROTATECUBELEFT] = _.clone(ROTATECUBELEFTMAP);
CUBEROTATIONMAPS[ROTATECUBERIGHT] = _.clone(ROTATECUBERIGHTMAP);
CUBEROTATIONMAPS[ROTATECUBECW] = _.clone(ROTATECUBECWMAP);
CUBEROTATIONMAPS[ROTATECUBECCW] = _.clone(ROTATECUBECCWMAP);

exports.CUBEROTATIONMAPS = CUBEROTATIONMAPS;

