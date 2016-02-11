'use strict'
/**
         top(0)
       ~~~~~~~~~
       | 0 1 2 |
       | 3 4 5 |
left(1)| 6 7 8 | right(3) back(4)
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 0 1 2 | 0 1 2 | 0 1 2 | 0 1 2 |
 3 4 5 | 3 4 5 | 3 4 5 | 3 4 5 | 
 6 7 8 | 6 7 8 | 6 7 8 | 6 7 8 |
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       | 0 1 2 |
       | 3 4 5 |
       | 6 7 8 |
       ~~~~~~~~~
        bottom(5)

*front(2)
**/
const 	constants = require('../constants'),
		TOP = constants.TOP,
		LEFT = constants.LEFT,
		FRONT = constants.FRONT,
		RIGHT = constants.RIGHT,
		BACK = constants.BACK,
		BOTTOM = constants.BOTTOM,
		RELATIONS = constants.RELATIONS,
		CW = constants.CW,
		CCW = constants.CCW;

var util = require('../utility'),
	_ = require('underscore');

/**
Faces will be an array of 6 arrays, with numbers 0-5. The constant
values TOP,LEFT,FRONT,RIGHT,BACK, and BOTTOM are used to get the
array representing the specified faces from the faces array.
**/
class CubeModel {
	constructor(faces) {
		this._faces = _.map(faces, function(face)
		{
			return _.clone(face)
		});
		this._moves = [];
	}
	getFacesArray() {
		return _.clone(this._faces);
	}
	_rotateClockWise(face) {
		var self = this;
		var thisFace = self._faces[face];
		var faceRelations = RELATIONS[face];
		this._faces[face] = util.rotateFaceCW(thisFace);
		var previousValues = self._getFaceAdjacentcyPairValue(faceRelations[3]);
		faceRelations.forEach(function(faceAdjacentcyPair)
		{
			var theseValues = self._getFaceAdjacentcyPairValue(faceAdjacentcyPair);
			self._faces[faceAdjacentcyPair[0]][faceAdjacentcyPair[1][0]] = previousValues[0];
			self._faces[faceAdjacentcyPair[0]][faceAdjacentcyPair[1][1]] = previousValues[1];
			self._faces[faceAdjacentcyPair[0]][faceAdjacentcyPair[1][2]] = previousValues[2];
			previousValues = theseValues;
		});

		this._moves.push(face + CW);
	}
	_rotateCounterClockWise(face) {
		var self = this;
		var thisFace = self._faces[face];
		// TODO need comments, beware of reverse() modifying the original!
		var faceRelations = _.clone(RELATIONS[face]).reverse();
		this._faces[face] = util.rotateFaceCCW(thisFace);
		var previousValues = self._getFaceAdjacentcyPairValue(faceRelations[3])//.reverse();
		faceRelations.forEach(function(faceAdjacentcyPair)
		{
			var theseValues = self._getFaceAdjacentcyPairValue(faceAdjacentcyPair)//.reverse();
			self._faces[faceAdjacentcyPair[0]][faceAdjacentcyPair[1][0]] = previousValues[0];
			self._faces[faceAdjacentcyPair[0]][faceAdjacentcyPair[1][1]] = previousValues[1];
			self._faces[faceAdjacentcyPair[0]][faceAdjacentcyPair[1][2]] = previousValues[2];
			previousValues = theseValues;
		});

		this._moves.push(face + CCW);
	}
	_getFaceAdjacentcyPairValue(faceAdjacentcyPair) {
		var face = faceAdjacentcyPair[0];
		var adjacentSquares = faceAdjacentcyPair[1];
		return [
			this._faces[face][adjacentSquares[0]],
			this._faces[face][adjacentSquares[1]],
			this._faces[face][adjacentSquares[2]]
		]
	}
	getMoves() {
		return _.clone(this._moves);
	}
	rotateFace(face, direction) {
		switch(direction)
		{
			case CW:
				this._rotateClockWise(face);
				break;
			case CCW:
				this._rotateCounterClockWise(face);
		}
	}
}

module.exports = CubeModel;