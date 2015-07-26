var tileData;
var map = [[]];
var imgArray = [];

function loadMapInit(){
  var imageURL = foo.level.mapFile;
  loadMapImage(imageURL);
}


function processMap(){
  var imagex = tileData.width;
  var imagey = tileData.height;
  map = [];
  var iceCreamObject = foo.level.objects['0,255,0'];
  for(rowIndex = 0; rowIndex < imagey; rowIndex++){
    var row = [];
    for(columnIndex = 0; columnIndex < imagex; columnIndex++){
      var rgb = getTile(columnIndex,rowIndex);
      var symbol = rgb[0] +","+ rgb[1] +","+ rgb[2]
      row.push(symbol);
      if(symbol in foo.level.objects){
        var obj = foo.level.objects[symbol];
        addObject(obj, columnIndex, rowIndex, foo.level.tileSize);
        row[columnIndex] = obj.floorTile;
      } else if (symbol in foo.level.tiles && foo.level.tiles[symbol].collidable == false) {
        if (Math.random() < iceCreamSpawnChance) {
          addObject(iceCreamObject, columnIndex, rowIndex, foo.level.tileSize);
        }
      }
    }
    map.push(row);
  }
  for(imgIndex in foo.level.tiles){
    var image = new Image();
    image.src = fullImagePath(foo.level.tiles[imgIndex].image);
    foo.level.tiles[imgIndex].image = image;
  }
}

function tileEngine(ctx,x,y){
  var xDrawDistance = Math.floor((canvas.width/2)/foo.level.tileSize) + 4;
  var yDrawDistance = Math.floor((canvas.height/2)/foo.level.tileSize) +4;

  var rowStart = ceilToZero(x/foo.level.tileSize-xDrawDistance);
  var rowEnd = ceilToZero(x/foo.level.tileSize+xDrawDistance);
  var colStart = ceilToZero(y/foo.level.tileSize-yDrawDistance);
  var colEnd = ceilToZero(y/foo.level.tileSize+yDrawDistance);

  for(rowIndex = colStart; rowIndex < colEnd; rowIndex++){
    var row = map[rowIndex];
      // console.log(rowIndex + "," );
    for(colIndex = rowStart; colIndex < rowEnd; colIndex++){
      var symbol = row[colIndex];
      if(typeof foo.level.tiles[symbol] != 'undefined'){
        ctx.drawImage(foo.level.tiles[symbol].image, foo.level.tileSize*colIndex, foo.level.tileSize*rowIndex);
      }
    }
  }

  // for(rowIndex in map){
  //   var row = map[rowIndex];
  //   for(columnIndex in row){
  //     var symbol = row[columnIndex];
  //     if(typeof foo.level.tiles[symbol] != 'undefined'){
  //       ctx.drawImage(foo.level.tiles[symbol].image, foo.level.tileSize*columnIndex, foo.level.tileSize*rowIndex);
  //     }
  //   }
  // }
}

function ceilToZero(number){
  if(number < 0){
    return 0;
  } else{
    return Math.floor(number);
  }
}

function isCollidable(x, y){
  var tileX = Math.floor(x/foo.level.tileSize);
  var tileY = Math.floor(y/foo.level.tileSize);
  var tileSymbol = map[tileY][tileX];
  var tile = foo.level.tiles[tileSymbol];
  if (!tile) {
    return true;
  }
  return tile.collidable;
}


function loadMapImage(file) {
  var tempCanvas = document.createElement('canvas');
  var context = tempCanvas.getContext('2d');
  var img = new Image();
  img.src = file;
  img.onload = function() {
    context.drawImage(img, 0, 0 );
    tileData = context.getImageData(0, 0, img.width, img.height);
    processMap();
  }
}


function getTile(x, y) {
  var width = tileData.width;
  var startIndex = 4 * (x + (y * width));
  // console.log(startIndex);
  return [tileData.data[startIndex], tileData.data[startIndex + 1], tileData.data[startIndex + 2]];
}
