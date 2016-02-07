'use strict';

var constants = require('./constants'),
	TOP = constants.TOP,
	LEFT = constants.LEFT,
	FRONT = constants.FRONT,
	RIGHT = constants.RIGHT,
	BACK = constants.BACK,
	BOTTOM = constants.BOTTOM,
	ORIENTATIONS = constants.ORIENTATIONS,
	utility = require('./utility'),
	_ = require('underscore'),
	CubeModel = require('./CubeModel');

var Cube = function(faces)
{
	this._cubeModel = new CubeModel(faces);
	this._currentOrientation = 0;
	this._moves = [];
};

Cube.prototype.getFacesArray = function()
{
	var faces = this._cubeModel.getFacesArray();
	var modifiedFaces = [];
	var orientationObject = ORIENTATIONS[this._currentOrientation];
	_.each(orientationObject, function(newPositionPair, faceNumber)
	{
		modifiedFaces[faceNumber] = faces[newPositionPair[0]];

		switch(newPositionPair[1])
		{
			case constants.NOROTATE:
				// Nothing to do!
				break;
			case constants.CW:
				modifiedFaces[faceNumber] = utility.rotateFaceCW(modifiedFaces[faceNumber]);
				break;
			case constants.CCW:
				modifiedFaces[faceNumber] = utility.rotateFaceCCW(modifiedFaces[faceNumber]);
				break;
			case constants.FLIP:
				modifiedFaces[faceNumber] = utility.rotateFace180(modifiedFaces[faceNumber]);
				break;
		}
	});

	return modifiedFaces;
};

Cube.prototype.getTotalMoves = function()
{
	return _.clone(this._moves);
};

Cube.prototype.getTotalMovesSimplified = function()
{
	return this._cubeModel.getMoves();
};

Cube.prototype[constants.ROTATECUBEBACK] = function()
{
	this._currentOrientation = constants.ROTATECUBEBACKMAP[this._currentOrientation];
};

Cube.prototype[constants.ROTATECUBEFORWARD] = function()
{
	this._currentOrientation = constants.ROTATECUBEFORWARDMAP[this._currentOrientation];
};

Cube.prototype[constants.ROTATECUBECW] = function()
{
	this._currentOrientation = constants.ROTATECUBECWMAP[this._currentOrientation];
};

Cube.prototype[constants.ROTATECUBECCW] = function()
{
	this._currentOrientation = constants.ROTATECUBECCWMAP[this._currentOrientation];
};

Cube.prototype[constants.ROTATECUBELEFT] = function()
{
	this._currentOrientation = constants.ROTATECUBELEFTMAP[this._currentOrientation];
};

Cube.prototype[constants.ROTATECUBERIGHT] = function()
{
	this._currentOrientation = constants.ROTATECUBERIGHTMAP[this._currentOrientation];
};

Cube.prototype.rotateFace = function(face, direction)
{
	var orientationPairs = ORIENTATIONS[this._currentOrientation];
	var faceToRotate = orientationPairs[face][0];
	this._cubeModel.rotateFace(faceToRotate, direction);
};

module.exports = {
	create: function(input)
	{
		return new Cube(input);
	},
	constants: {
		FACES: {
			TOP: constants.TOP,
			LEFT: constants.LEFT,
			FRONT: constants.FRONT,
			RIGHT: constants.RIGHT,
			BACK: constants.BACK,
			BOTTOM: constants.BOTTOM
		},
		FACEROTATIONS: {
			CW: constants.CW,
			CCW: constants.CCW
		},
		CUBEROTATIONS: {
			FORWARD: constants.ROTATECUBEFORWARD,
			BACK: constants.ROTATECUBEBACK,
			LEFT: constants.ROTATECUBELEFT,
			RIGHT: constants.ROTATECUBERIGHT,
			CW: constants.ROTATECUBECW,
			CCW: constants.ROTATECUBECCW
		},
		PIECELOCATIONS: constants.PIECELOCATIONS
	}
};
