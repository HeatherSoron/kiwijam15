function tileEngine(ctx){
  var imgArray = [];
  for(imgIndex in foo.level.tiles){
    var image = new Image();
    image.src = foo.level.tiles[imgIndex].image
    imgArray.push(image);
  }

  for(rowIndex in foo.level.map){
    var row = foo.level.map[rowIndex].split('');
    for(columnIndex in row){
      for(tileResource in foo.level.tiles){
        if(foo.level.tiles[tileResource].symbol == row[columnIndex]){
          ctx.drawImage(imgArray[tileResource], 32*columnIndex, 32*rowIndex);
        }
      }
    }
  }

}
