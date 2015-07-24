var foo =
  {
    "level":{
    "levelName": "ice cream level",
    "map": [
      "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      "XXXXXXXXXOOOOOOOOXXXXXXXXXXXXXXXXXX",
      "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"],
    "tiles": [
      {"image": "resources/images/square1.png", "symbol": "X", "collidable": true},
      {"image": "resources/images/square2.png", "symbol": "O", "collidable": true}]
    }
  }

function tileEngine(ctx){
  for(rowIndex in foo.level.map){
    var row = foo.level.map[rowIndex].split('');
    for(columnIndex in row){
      var image = new Image()
      for(tileResource in foo.level.tiles){
        if(foo.level.tiles[tileResource].symbol == row[columnIndex]){
          image.src = foo.level.tiles[tileResource].image;
        }
      }
      ctx.drawImage(image, 32*columnIndex, 32*rowIndex);
    }
  }

}
