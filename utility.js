'use strict';

const 	constants = require('./constants'),
		cw = constants.FACEARRAYCW,
		ccw = constants.FACEARRAYCCW,
		flip = constants.FACEARRAY180;

var rotateFaceCW = function(face)
{
	return [face[cw[0]], face[cw[1]], face[cw[2]], face[cw[3]], face[cw[4]], face[cw[5]], face[cw[6]], face[cw[7]], face[cw[8]]];
};

var rotateFaceCCW = function(face)
{
	return [face[ccw[0]], face[ccw[1]], face[ccw[2]], face[ccw[3]], face[ccw[4]], face[ccw[5]], face[ccw[6]], face[ccw[7]], face[ccw[8]]];
};

var rotateFace180 = function(face)
{
	return [face[flip[0]], face[flip[1]], face[flip[2]], face[flip[3]], face[flip[4]], face[flip[5]], face[flip[6]], face[flip[7]], face[flip[8]]];
};

module.exports = {
	rotateFaceCW: rotateFaceCW,
	rotateFaceCCW: rotateFaceCCW,
	rotateFace180: rotateFace180
};