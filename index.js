'use strict';

const   constants = require('./constants'),
        TOP = constants.TOP,
        LEFT = constants.LEFT,
        FRONT = constants.FRONT,
        RIGHT = constants.RIGHT,
        BACK = constants.BACK,
        BOTTOM = constants.BOTTOM,
        ORIENTATIONS = constants.ORIENTATIONS,
        CW = constants.CW,
        CCW = constants.CCW,
        NOROTATE = constants.NOROTATE,
        FLIP = constants.FLIP,
        CUBEROTATIONMAPS = constants.CUBEROTATIONMAPS;

var utility = require('./utility'),
    _ = require('underscore'),
    CubeModel = require('./CubeModels/Cube'),
    PieceModel = require('./CubeModels/Piece');

class Cube {
    constructor(faces) {
        this._cubeModel = new CubeModel(faces);
        this._currentOrientation = 0;
        this._moves = [];
    }

    getFacesArray() {
        var faces = this._cubeModel.getFacesArray();
        var modifiedFaces = [];
        var orientationObject = ORIENTATIONS[this._currentOrientation];
        _.each(orientationObject, function(newPositionPair, faceNumber) {
            modifiedFaces[faceNumber] = faces[newPositionPair[0]];

            switch(newPositionPair[1]) {
                case NOROTATE:
                    // Nothing to do!
                    break;
                case CW:
                    modifiedFaces[faceNumber] = utility.rotateFaceCW(modifiedFaces[faceNumber]);
                    break;
                case CCW:
                    modifiedFaces[faceNumber] = utility.rotateFaceCCW(modifiedFaces[faceNumber]);
                    break;
                case FLIP:
                    modifiedFaces[faceNumber] = utility.rotateFace180(modifiedFaces[faceNumber]);
                    break;
            }
        });

        return modifiedFaces;
    }

    getTotalMoves() {
        return _.clone(this._moves);
    }

    getTotalMovesSimplified() {
        return this._cubeModel.getMoves();
    }

    getPieceByDestinationLocation(faces) {
        var self = this;
        // Get the colors of the destination.
        var colors = _.map(faces, function(face) {
            return self.getFaceColor(face);
        }).sort();

        var facesArray = self.getFacesArray();

        // Find a pieceLocation that matches the colors.
        var pieceLocation = _.find(constants.PIECELOCATIONS, function(possibleLocation) {
            var thisLocationsColors = _.map(possibleLocation, function(facePositionPair) {
                var face = facePositionPair[0];
                var position = facePositionPair[1];
                return facesArray[face][position];
            }).sort();

            return _.isEqual(colors, thisLocationsColors);
        });

        if(pieceLocation) {
            return new PieceModel(this, pieceLocation);
        }
    }

    getPieceByCurrentLocation(faces) {
        faces = faces.sort();

        // Get a pieceLocation for these faces.
        var pieceLocation = _.find(constants.PIECELOCATIONS, function(possibleLocation) {
            var thisLocationsFaces = _.pluck(possibleLocation, 0);

            return _.isEqual(faces, thisLocationsFaces);
        });

        if(pieceLocation) {
            return new PieceModel(this, pieceLocation);
        }
    }

    getFaceColor(face) {
        // The center piece on a face
        // is the color of the face.
        return this.getFacesArray()[face][4];
    }

    getFaceOfColor(color) {
        var self = this,
            facesArray = self.getFacesArray(),
            face;
        _.find(facesArray, function(faceArray, faceNumber) {
            if(faceArray[4] === color) {
                face = faceNumber;
                return true;
            }
        });

        return face;
    }

    rotateCube(direction) {
        this._currentOrientation = CUBEROTATIONMAPS[direction][this._currentOrientation];
    }

    rotateFace(face, direction) {
        var orientationPairs = ORIENTATIONS[this._currentOrientation];
        var faceToRotate = orientationPairs[face][0];
        this._cubeModel.rotateFace(faceToRotate, direction);
    }
}

module.exports = {
    create: function(input) {
        return new Cube(input);
    },
    constants: {
        FACES: {
            TOP: TOP,
            LEFT: LEFT,
            FRONT: FRONT,
            RIGHT: RIGHT,
            BACK: BACK,
            BOTTOM: BOTTOM
        },
        FACEROTATIONS: {
            CW: CW,
            CCW: CCW
        },
        CUBEROTATIONS: {
            FORWARD: constants.ROTATECUBEFORWARD,
            BACK: constants.ROTATECUBEBACK,
            LEFT: constants.ROTATECUBELEFT,
            RIGHT: constants.ROTATECUBERIGHT,
            CW: constants.ROTATECUBECW,
            CCW: constants.ROTATECUBECCW
        }
    }
};
