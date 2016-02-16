# node-cube-model

node-cube-model is used for modeling a Rubiks Cube.

## Usage

### Constants
node-cube-model provides constants to use for interacting with the cube model.

FACES has TOP, LEFT, FRONT, RIGHT, BACK, and BOTTOM properties used to identify faces of the cube.

FACEROTATIONS has CW and CCW properties used to indicate if you want to rotate a face clockwise or counter clockwise.

CUBEROTATIONS has FORWARD, BACK, LEFT, RIGHT, CW, and CCW properties used to indicate directions to rotate the entire cube.
```javascript
const   constants = require('node-cube-model').constants;
        FACES = constants.FACES,
        FACEROTATIONS = constants.FACEROTATIONS,
        CUBEROTATIONS = constants.CUBEROTATIONS;
        
```

### Creation

To create an instance of a cube it must be provided an array indicating the colors on each face.  The following diagram can be used to understand how the array of faces is structured.  Each face is an array, and the colors on that face are the values of the array.
``` 
          top(0)
        ---------
        | 0 1 2 |
        | 3 4 5 |
 left(1)| 6 7 8 | right(3) back(4)
---------------------------------
| 0 1 2 | 0 1 2 | 0 1 2 | 0 1 2 |
| 3 4 5 | 3 4 5 | 3 4 5 | 3 4 5 |
| 6 7 8 | 6 7 8 | 6 7 8 | 6 7 8 |
---------------------------------
        | 0 1 2 |
        | 3 4 5 |
        | 6 7 8 |
        ---------
        bottom(5)

 *front(2)
 ```
``` javascript
var CubeModel = require('node-cube-model');

// Currently, numbers must be used to specify the color of a sticker.
var faces = [
              [0,0,0,0,0,0,0,0,0],
              [1,1,1,1,1,1,1,1,1],
              [2,2,2,2,2,2,2,2,2],
              [3,3,3,3,3,3,3,3,3],
              [4,4,4,4,4,4,4,4,4],
              [5,5,5,5,5,5,5,5,5]
            ];
            
  var cubeModel = cubeModel.create(faces);
```

### Manipulation
The cube can be manipulated by rotating a face or by rotating the entire cube.
``` javascript
// This will rotate the cube towards you so that the TOP face becomes the FRONT
cubeModel.rotateCube(CUBEROTATIONS.FORWARD);

// This will rotate the cube left so that the TOP face becomes the LEFT
cubeModel.rotateCube(CUBEROTATIONS.LEFT);

// This will rotate the cube clockwise so that the FRONT face becomes the LEFT
cubeModel.rotateCube(CUBEROTATIONS.CW);

// This will rotate the TOP face counter clockwise
cubeModel.rotateFace(FACES.TOP, FACEROTATIONS.CW);
```

### Observing
The cube can be observed by getting an array representing the cube that is structured the same was as the array provided in the constructor.
``` javascript
var facesArray = cubeModel.getFacesArray();
```

The color of a specific face can also be retrieved from the cube model.
``` javascript
var topFaceColor = cubeModel.getFaceColor(FACES.TOP);
```

#### Pieces
The cube can also be observed by getting a Piece object representing a corner or an edge piece.  A piece object is requested by providing an array of FACES constants that represent where the piece should be.
``` javascript
// This will get the corner piece that is made up from the TOP, BACK, and LEFT faces.
var topBackLeftCorner = cubeModel.getPiece([FACES.TOP, FACES.BACK, FACES.LEFT]);

// This will get the edge piece that is made up from the LEFT and FRONT faces.
var leftFrontEdge = cubeModel.getPiece([FACES.LEFT, FACES.FRONT]);
```
Piece objects contain Sticker objects.  You can call .stickers to get an array of all the stickers that make up a piece.  You can call .getStickerOfColor() with a color to get the sticker that is a specific color.  Or, you can call .getStickerOnFace() with a constant FACE value to get the sticker that is currently on the specified face.
``` javascript
// This will get an array of all stickers making up a Piece.
var stickers = pieceObject.stickers;

// This will get the sticker that is the 0 color.
var sticker = pieceObject.getStickerOfColor(0);

// This will get the sticker that is currently on the TOP face.
var sticker = pieceObject.getStickerOnFace(FACES.TOP);
```
#### Stickers
Stickers have three attributes.  The .face attribute indicates what face the sticker is on.  The .position attribute indicates the position of that sticker on the face.  The .color attribute indicates the color of the sticker.

### Retrieving Moves
At any time you can retrieve an array of all moves performed on the cube since it was created.
``` javascript
// This will return an array of all moves performed on the cube, including cube rotations.
var totalMoves = cubeModel.getTotalMoves();

// This will return an array of all moves performed on the cube with cube rotations factored out.
var getTotalMovesSimplified = cubeModel.getTotalMovesSimplified();
```
