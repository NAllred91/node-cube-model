'use strict';

var _ = require('underscore'),
    StickerModel = require('./Sticker');

class Piece {
    constructor(cube, pieceLocation) {
        var facesArray = cube.getFacesArray();
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
