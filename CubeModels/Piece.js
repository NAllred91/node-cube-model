'use strict';

var constants = require('../constants'),
    _ = require('underscore'),
    StickerModel = require('./Sticker');

class Piece {
    constructor(cube, faces) {
        var colors = _.map(faces, function(face) {
            return cube.getFaceColor(face);
        }).sort();

        var facesArray = cube.getFacesArray();

        var pieceLocation = _.find(constants.PIECELOCATIONS, function(possibleLocation) {
            var thisLocationsColors = _.map(possibleLocation, function(facePositionPair) {
                var face = facePositionPair[0];
                var position = facePositionPair[1];
                return facesArray[face][position];
            }).sort();

            return _.isEqual(colors, thisLocationsColors);
        });

        if(!pieceLocation) {
            throw new Error("Invalid faces provided");
        }

        this._stickers = _.map(pieceLocation, function(facePositionPair) {
            var face = facePositionPair[0],
                position = facePositionPair[1],
                color = facesArray[face][position];

            return new StickerModel(face, position, color);
        });
    }

    get stickers() {
        return this._stickers;
    }

    getStickerOnFace(face) {
        var self = this;

        return _.find(self._stickers, function(sticker) {
            return sticker.face === face;
        });
    }

    getStickerOfColor(color) {
        var self = this;
        return _.find(self._stickers, function(sticker) {
            return sticker.color === color;
        });
    }
}

module.exports = Piece;
