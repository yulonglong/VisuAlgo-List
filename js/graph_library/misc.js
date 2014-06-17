/*
 * Miscellaneous functions
 */

function deepCopy(obj){
  var newObj;

  if(obj instanceof Array){
    var i;

    newObj = [];

    for (i = 0; i < obj.length; i++) {
      newObj.push(deepCopy(obj[i]));
    }
  }

  else if(obj instanceof Object){
    newObj = {};

    for(keys in obj){
      newObj[keys] = deepCopy(obj[keys]);
    }
  }

  else{
    newObj = obj;
  }

  return newObj;
}