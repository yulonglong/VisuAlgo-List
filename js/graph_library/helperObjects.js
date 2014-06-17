/*
 * Data structures to assist internal implementation of algorithmic visualizations
 */

// Make sure to check the type of the objects passed in to avoid bugs (especially if used for comparisons)
var ObjectPair = function(objectOne, objectTwo){
	this.getFirst = function(){
		return objectOne;
	}

	this.getSecond = function(){
		return objectTwo;
	}

	this.setFirst = function(newObjectOne){
		objectOne = newObjectOne;
	}

	this.setSecond = function(newObjectTwo){
		objectTwo = newObjectTwo;
	}
}

ObjectPair.compare = function(objPairOne, objPairTwo){
	if(objPairOne.getFirst() > objPairTwo.getFirst()) return 1;
	else if(objPairOne.getFirst() < objPairTwo.getFirst()) return -1;
	else{
		if(objPairOne.getSecond() > objPairTwo.getSecond()) return 1;
		if(objPairOne.getSecond() < objPairTwo.getSecond()) return -1;
		else return 0;
	}
}

// Make sure to check the type of the objects passed in to avoid bugs (especially if used for comparisons)
var ObjectTriple = function(objectOne, objectTwo, objectThree){
	this.getFirst = function(){
		return objectOne;
	}

	this.getSecond = function(){
		return objectTwo;
	}

	this.getThird = function(){
		return objectThree;
	}

	this.setFirst = function(newObjectOne){
		objectOne = newObjectOne;
	}

	this.setSecond = function(newObjectTwo){
		objectTwo = newObjectTwo;
	}

	this.setThird = function(newObjectThree){
		objectThree = newObjectThree;
	}
}

ObjectTriple.compare = function(objTripleOne, objTripleTwo){
	if(objTripleOne.getFirst() > objTripleTwo.getFirst()) return 1;
	else if(objTripleOne.getFirst() < objTripleTwo.getFirst()) return -1;
	else{
		if(objTripleOne.getSecond() > objTripleTwo.getSecond()) return 1;
		if(objTripleOne.getSecond() < objTripleTwo.getSecond()) return -1;
		else{
			if(objTripleOne.getThird() > objTripleTwo.getThird()) return 1;
			if(objTripleOne.getThird() < objTripleTwo.getThird()) return -1;
			else return 0;
		}
	}
}

var UfdsHelper = function(){
	/*
	 * Structure of internalUfds:
	 * - key: inserted key
	 * - value: JS object with:
	 *          - "parent"
	 *          - "rank"
	 */
	var self = this;
	var internalUfds = {};

	this.insert = function(insertedKey){
		if(internalUfds[insertedKey] != null) return false;

		var newElement = {};
		newElement["parent"] = insertedKey;
		newElement["rank"] = 0;

		internalUfds[insertedKey] = newElement;
	}

	this.findSet = function(key){
		if(internalUfds[key] == null) return false;

		var currentParent = internalUfds[key]["parent"];
		var currentElement = key;
		while(currentParent != currentElement){
			currentElement = currentParent;
			currentParent = internalUfds[currentElement]["parent"];
		}
		internalUfds[key]["parent"] = currentParent;

		return currentParent;
	}

	this.unionSet = function(firstKey, secondKey){
		if(internalUfds[firstKey] == null || internalUfds[secondKey] == null) return false;
		if(self.isSameSet(firstKey,secondKey)) return true;

		var firstSet = self.findSet(firstKey);
		var secondSet = self.findSet(secondKey);

		if(internalUfds[firstSet]["rank"] > internalUfds[secondSet]["rank"]){
			internalUfds[firstSet]["parent"] = secondSet;
			internalUfds[secondSet]["rank"]++;
		}

		else{
			internalUfds[secondSet]["parent"] = firstSet;
			internalUfds[firstSet]["rank"]++;
		}
	}

	this.isSameSet = function(firstKey, secondKey){
		if(internalUfds[firstKey] == null || internalUfds[secondKey] == null) return false;

		return self.findSet(firstKey) == self.findSet(secondKey);
	}
}