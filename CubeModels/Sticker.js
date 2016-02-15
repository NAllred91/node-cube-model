'use strict';

class Sticker {
    constructor(face, position, color) {
        this._face = face;
        this._position = position;
        this._color = color;
    }

    get face() {
        return this._face;
    }

    get position() {
        return this._position;
    }

    get color() {
        return this._color;
    }
}

module.exports = Sticker;