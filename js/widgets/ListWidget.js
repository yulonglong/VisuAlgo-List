// @author  Ivan Reinaldo
// Defines a BST object; keeps implementation of BST internally and interact with GraphWidget to display BST visualizations
// Also includes AVL tree
var BACK_EDGE_CONST = 5000;

var BST = function(){
  var self = this;
  var graphWidget = new GraphWidget();
  var activeStatus = "list";
  var maxSize = 10;
  var maxStackSize = 5;

  var valueRange = [1, 100]; // Range of valid values of BST vertexes allowed
  var maxHeightAllowed = 10;

  var initialArray = [15, 6, 23, 4, 7, 71, 5, 50];
  var initialStackArray = [15, 6, 50, 4];

  /*
   * internalBst: Internal representation of BST in this object
   * The keys are the text of the nodes, and the value is the attributes of the corresponding node encapsulated in a JS object, which are:
   * - "parent": text of the parent node. If the node is root node, the value is null.
   * - "leftChild": text of the left child. No child -> null
   * - "rightChild": text of the right child. No child -> null
   * - "cx": X-coordinate of center of the node
   * - "cy": Y-coordinate of center of the node
   * - "height": height of the node. Height of root is 0
   * - "vertexClassNumber": Vertex class number of the corresponding node
   *
   * In addition, there is a key called "root" in internalBst, containing the text of the root node.
   * If BST is empty, root is null.
   */

  var internalBst = {};
  var amountVertex = 0;
  var vertexClassNumberCounter = 9;
  internalBst["root"] = null;

  if(activeStatus=="stack") init(initialStackArray);
  else init(initialArray);


  this.getIsAVL = function(){
    return isAVL;
  }
  
  this.setActiveStatus = function(newActiveStatus){
    if(activeStatus != newActiveStatus){
      clearScreen();
      activeStatus = newActiveStatus;
      if(activeStatus=="stack") init(initialStackArray);
      else init(initialArray);
    }
  }

  this.getActiveStatus = function(){
    return activeStatus;
  }

  this.widgetRecalculatePosition = function(){
    recalculatePosition();
  }

  this.getGraphWidget = function(){
    return graphWidget;
  }

  this.generateRandom = function(){
      var vertexAmt = Math.floor((Math.random()*3 + 3));
      var initArr = new Array();
      while(initArr.length < vertexAmt){
        var random = Math.floor(1+Math.random()*98);
        if($.inArray(random, initArr) < 0) initArr.push(random);
      }
      
      init(initArr);
      return true;
  }


  this.generateRandomSorted = function() {
      var vertexAmt = Math.floor((Math.random()*3 + 3));
      var initArr = new Array();
      while(initArr.length < vertexAmt){
        var random = Math.floor(1+Math.random()*98);
        if($.inArray(random, initArr) < 0) initArr.push(random);
      }
     //skew right
     initArr.sort( function(a,b){return a-b} );
      
      init(initArr);
      return true;
  }

  this.generateRandomFixedSize = function(vertexText) {
      if(activeStatus=="stack"){
        if(vertexText>maxStackSize){
           $('#create-err').html("maximum allowed number of vertex is " + maxStackSize);
           return false;
        }
      }
      else{
        if(vertexText>maxSize){
           $('#create-err').html("maximum allowed number of vertex is " + maxSize);
           return false;
        }
      }

      var vertexAmt = vertexText;
      var initArr = new Array();
      while(initArr.length < vertexAmt){
        var random = Math.floor(1+Math.random()*98);
        if($.inArray(random, initArr) < 0) initArr.push(random);
      }
      
      init(initArr);
      return true;
  }

  this.generateUserDefined = function(vertexTextArr){
      var vertexAmt = vertexTextArr.length;
      if(activeStatus=="stack"){
        if(vertexAmt>maxStackSize){
           $('#create-err').html("maximum allowed number of vertex is " + maxStackSize);
           return false;
        }
      }
      else{
        if(vertexAmt>maxSize){
           $('#create-err').html("maximum allowed number of vertex is " + maxSize);
           return false;
        }
      }
      var initArr = new Array();
      for(i = 0; i < vertexTextArr.length; i++){
       var vt = parseInt(vertexTextArr[i]);
        if($.inArray(vt, initArr) < 0) initArr.push(vt);
      }
     
      init(initArr);
      return true;
  }

   this.peek = function(){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var index = 0;

    //temp = head , index = 0
    currentState = createState(internalBst, vertexTraversed, edgeTraversed);
    currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
    currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
    currentState["status"] = "return " + currentVertex;
    currentState["lineNo"] = 1;
    stateList.push(currentState);

    currentState = createState(internalBst);
    currentState["status"] = "Peek is complete";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    populatePseudocode(3);
    return true;
  }

  this.peekBack = function(){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var index = 0;

    while(true){
      if(internalBst[currentVertex]["rightChild"]!=null) {
        currentVertex = internalBst[currentVertex]["rightChild"];
      }
      else break;
    }

    currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

    //temp = head , index = 0
    currentState = createState(internalBst, vertexTraversed, edgeTraversed);
    currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
    currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
    currentState["status"] = "return " + currentVertex;
    currentState["lineNo"] = 1;
    stateList.push(currentState);

    currentState = createState(internalBst);
    currentState["status"] = "Peek is complete";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    populatePseudocode(9);
    return true;
  }

  this.search = function(vertexText){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var index = 0;

    //temp = head , index = 0
    currentState = createState(internalBst, vertexTraversed, edgeTraversed);
    currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
    currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
    currentState["status"] = "The current Linked List";
    currentState["lineNo"] = 1;
    stateList.push(currentState);
    //end

    while( currentVertex != null){
      //while (temp.data != input)
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      vertexTraversed[currentVertex] = true;
      currentState["status"] = "Comparing "+currentVertex+ " with "+vertexText + " (index = " + index + ")";
      currentState["lineNo"] = 2;
      stateList.push(currentState);
      //end

      if(parseInt(vertexText) != parseInt(currentVertex)) {
        //while (temp.data != input)
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["status"] = currentVertex+" is not equal to "+vertexText;
        currentState["lineNo"] = 2;
        stateList.push(currentState);
        //end
        
        //case when vertex is not found
        currentVertex = internalBst[currentVertex]["rightChild"];
        if(currentVertex == null) {

          //temp = temp.next ,index++
          currentState = createState(internalBst, vertexTraversed, edgeTraversed);
          currentState["status"] = "So temp points to the next vertex";
          currentState["lineNo"] = 3;
          stateList.push(currentState);
          //end

          //if temp == null
          currentState = createState(internalBst, vertexTraversed, edgeTraversed);
          currentState["status"] = "temp is null";
          currentState["lineNo"] = 4;
          stateList.push(currentState);
          //end

          //return -1
          currentState = createState(internalBst, vertexTraversed, edgeTraversed);
          currentState["status"] = "Vertex "+vertexText+" is not in the Linked List";
          currentState["lineNo"] = 5;
          stateList.push(currentState);
          //end

          break;
        }

        //temp = temp.next ,index++
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        parentVertex = internalBst[currentVertex]["parent"];
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        var edgeHighlighted = internalBst[parentVertex]["vertexClassNumber"];
        edgeTraversed[edgeHighlighted] = true;
        currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
        currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;
        currentState["status"] = "So temp points to the next vertex";
        currentState["lineNo"] = 3;
        stateList.push(currentState);
        //end

        //if temp==null
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["status"] = "temp is not null, continue searching";
        currentState["lineNo"] = 4;
        stateList.push(currentState);
        //end
      
      }
      else{
        break;
      } 
      index++;
    }

    //case when vertex is found
    if(currentVertex != null){
      //return index
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      currentState["status"] = "Found vertex " + vertexText + " return" + " (index = " + index + ")";
      currentState["lineNo"] = 6;
      stateList.push(currentState);
      //end
    }

    currentState = createState(internalBst);
    currentState["status"] = "Search is complete";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    populatePseudocode(4);
    return true;
  }

this.insertArrKth= function(vertexTextArr,index){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var i;

     //check if it is insert at index 0 / insert head
    if(index==0){
      return this.insertArrHead(vertexTextArr);
    }
    if(index==amountVertex){
      return this.insertArrTail(vertexTextArr);
    }

    currentState["status"] = "The current Linked List";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    // Check whether input is array
    // if(Object.prototype.toString.call(vertexTextArr) != '[object Array]'){
    //   $('#insert-err').html("Please fill in a number or comma-separated array of numbers!");
    //   return false;
    // }

    // Loop through all array values and...

    var tempInternalBst = deepCopy(internalBst); // Use this to simulate internal insertion


    //index checking start
    if(isNaN(index)){
      $('#insert-err').html("Please fill in a number");
      return false;
    }
    if(index>amountVertex){
       $('#insert-err').html("Please enter a valid index!");
       return false;
    }
    if(index<0){
       $('#insert-err').html("Please enter a valid index!");
       return false;
    }
    //end of index checking
     
    
    //for(i = 0; i < vertexTextArr.length; i++){
      var vt = parseInt(vertexTextArr);

      // 1. Check whether value is number
      if(isNaN(vt)){
        $('#insert-err').html("Please fill in a number or comma-separated array of numbers!");
        return false;
      }

      // 2. No duplicates allowed. Also works if more than one similar value are inserted
      if(tempInternalBst[vt] != null){
        $('#insert-err').html("No duplicate vertex allowed!");
        return false;
      }

      // 3. Check range
      if(parseInt(vt) < valueRange[0] || parseInt(vt) > valueRange[1]){
        $('#insert-err').html("Sorry, only values between " + valueRange[0] + " and " + valueRange[1] + " can be inserted.");
        return false;
      }

      // 4. check size
      if(amountVertex>=maxSize){
        $('#insert-err').html("Sorry, maximum size is " + maxSize);
        return false;
      }

    //}


      var vertexText = parseInt(vertexTextArr);

      // Re-initialization
      vertexTraversed = {};
      edgeTraversed = {};
      currentVertex = internalBst["root"];
      currentState = createState(internalBst);
      if (index==0){
        currentVertex = null;
      }

      //Vertex prev = head
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      vertexTraversed[currentVertex] = true;
      currentState["status"] = "set temp1 to head";
      currentState["lineNo"] = 1;
      stateList.push(currentState);
      //end

      // Find parent
      // while(currentVertex != vertexText && currentVertex != null){
      for(j=0;j<index-1;j++){
        //while (--k!=0)
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        vertexTraversed[currentVertex] = true;
        currentState["status"] = "decrement k, index specified has not been reached, " + "(k = "+ (index-1-j) +")";
        currentState["lineNo"] = 2;
        stateList.push(currentState);
        //end

        var nextVertex;
         nextVertex = internalBst[currentVertex]["rightChild"];

        if(nextVertex == null) break;
        else currentVertex = nextVertex;

        //prev = prev.next
        parentVertex = internalBst[currentVertex]["parent"];
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        var edgeHighlighted = internalBst[parentVertex]["vertexClassNumber"];
        edgeTraversed[edgeHighlighted] = true;
        currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
        currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;
        currentState["status"] = "points to next vertex";
        currentState["lineNo"] = 3;
        stateList.push(currentState);
        //end
      }


      if(currentVertex!=null){
        //additional animation for the last vertex visited
        //while(--k!=0)
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        vertexTraversed[currentVertex] = true;
        currentState["status"] = "decrement k, k is 0, continue insertion";
        currentState["lineNo"] = 2;
        stateList.push(currentState);
        //end
        //end of additional animation
       }

      // Begin insertion

      // First, update internal representation

     

      //var newNodeVertexClass = internalBst[tempChild]["vertexClassNumber"];

      //Vertex temp = prev.next
      tempVertex = internalBst[currentVertex]["rightChild"];
      tempVertexClass = internalBst[tempVertex]["vertexClassNumber"];
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][tempVertexClass]["state"] =  VERTEX_GREEN_FILL;
      currentState["vl"][currentVertexClass]["state"] =  VERTEX_HIGHLIGHTED;
      currentState["el"][currentVertexClass]["state"] = EDGE_TRAVERSED;
      currentState["el"][currentVertexClass]["animateHighlighted"] = true;
      edgeTraversed[currentVertexClass] = true;
      currentState["status"] = "index specified is found, keep track of the next vertex";
      currentState["lineNo"] = 4;
      stateList.push(currentState);
      //end




      internalBst[parseInt(vertexText)] = {
        "leftChild": null,
        "rightChild": null,
        "vertexClassNumber": vertexClassNumberCounter++
      };
      amountVertex++;
      //modified this part for linked list insertion
      var newNode = parseInt(vertexText);
      newNodeVertexClass = internalBst[parseInt(vertexText)]["vertexClassNumber"];
      var tempChild;

      internalBst[newNode]["cx"] = internalBst[tempVertex]["cx"];
      internalBst[newNode]["cy"] = internalBst[tempVertex]["cy"] + 70;

      
   
      //vertex newVertex =  new Vertex(input)
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][currentVertexClass]["state"] =  VERTEX_HIGHLIGHTED;
      currentState["vl"][newNodeVertexClass]["state"] =  VERTEX_RED_FILL;
      currentState["vl"][tempVertexClass]["state"] =  VERTEX_GREEN_FILL;
      currentState["status"] = "create new vertex";
      currentState["lineNo"] = 5;
      stateList.push(currentState);
      edgeTraversed[newNodeVertexClass] = true;
      //end
    
      //RELINK THE POINTERs
      internalBst[currentVertex]["rightChild"] = newNode;
      internalBst[newNode]["parent"] = currentVertex;
      internalBst[newNode]["rightChild"] = tempVertex;
      internalBst[tempVertex]["parent"] = newNode;
      //END RELINKING
      

      //prev.next  = newVertex
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      currentState["vl"][currentVertexClass]["state"] =  VERTEX_HIGHLIGHTED;
      currentState["vl"][newNodeVertexClass]["state"] =  VERTEX_RED_FILL;
      currentState["vl"][tempVertexClass]["state"] =  VERTEX_GREEN_FILL;
      currentState["el"][currentVertexClass]["state"] = EDGE_TRAVERSED;
      currentState["el"][currentVertexClass]["animateHighlighted"] = true;
      currentState["el"][newNodeVertexClass]["state"] = OBJ_HIDDEN;
      currentState["status"] = "temp1.next points to newVertex";
      currentState["lineNo"] = 6;
      stateList.push(currentState);
      //end

      //newVertex.next = temp
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      currentState["vl"][currentVertexClass]["state"] =  VERTEX_HIGHLIGHTED;
      currentState["vl"][newNodeVertexClass]["state"] =  VERTEX_RED_FILL;
      currentState["vl"][tempVertexClass]["state"] =  VERTEX_GREEN_FILL;
      currentState["el"][currentVertexClass]["state"] = EDGE_TRAVERSED;
      currentState["el"][newNodeVertexClass]["state"] = EDGE_RED;
      currentState["el"][newNodeVertexClass]["animateHighlighted"] = true;
      currentState["status"] = "newVertex.next points to temp2";
      currentState["lineNo"] = 7;
      stateList.push(currentState);
      //end


      recalculatePosition();
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][currentVertexClass]["state"] =  VERTEX_HIGHLIGHTED;
      currentState["vl"][newNodeVertexClass]["state"] =  VERTEX_RED_FILL;
      currentState["el"][newNodeVertexClass]["state"] = EDGE_RED;
      currentState["vl"][tempVertexClass]["state"] =  VERTEX_GREEN_FILL;
      currentState["status"] = "Re-layout the linked list. " + vertexText + " has been inserted!"
      currentState["lineNo"] = 0;

      stateList.push(currentState);

      // End State
      currentState = createState(internalBst);
      currentState["status"] = "Insert " + vertexText + " has been completed."
      currentState["lineNo"] = 0;
      stateList.push(currentState);

    

    graphWidget.startAnimation(stateList);
 
    populatePseudocode(0);
  
    return true;
  }


this.insertArrKthDoublyList= function(vertexTextArr,index){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var i;

     //check if it is insert at index 0 / insert head
    if(index==0){
      return this.insertArrHeadDoublyList(vertexTextArr);
    }
    if(index==amountVertex){
      return this.insertArrTailDoublyList(vertexTextArr);
    }

    currentState["status"] = "The current Linked List";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    // Check whether input is array
    // if(Object.prototype.toString.call(vertexTextArr) != '[object Array]'){
    //   $('#insert-err').html("Please fill in a number or comma-separated array of numbers!");
    //   return false;
    // }

    // Loop through all array values and...

    var tempInternalBst = deepCopy(internalBst); // Use this to simulate internal insertion


    //index checking start
    if(isNaN(index)){
      $('#insert-err').html("Please fill in a number");
      return false;
    }
    if(index>amountVertex){
       $('#insert-err').html("Please enter a valid index!");
       return false;
    }
    if(index<0){
       $('#insert-err').html("Please enter a valid index!");
       return false;
    }
    //end of index checking
     
    
    //for(i = 0; i < vertexTextArr.length; i++){
      var vt = parseInt(vertexTextArr);

      // 1. Check whether value is number
      if(isNaN(vt)){
        $('#insert-err').html("Please fill in a number or comma-separated array of numbers!");
        return false;
      }

      // 2. No duplicates allowed. Also works if more than one similar value are inserted
      if(tempInternalBst[vt] != null){
        $('#insert-err').html("No duplicate vertex allowed!");
        return false;
      }

      // 3. Check range
      if(parseInt(vt) < valueRange[0] || parseInt(vt) > valueRange[1]){
        $('#insert-err').html("Sorry, only values between " + valueRange[0] + " and " + valueRange[1] + " can be inserted.");
        return false;
      }

      // 4. check size
      if(amountVertex>=maxSize){
        $('#insert-err').html("Sorry, maximum size is " + maxSize);
        return false;
      }

    //}


      var vertexText = parseInt(vertexTextArr);

      // Re-initialization
      vertexTraversed = {};
      edgeTraversed = {};
      currentVertex = internalBst["root"];
      currentState = createState(internalBst);
      if (index==0){
        currentVertex = null;
      }

      //Vertex prev = head
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      vertexTraversed[currentVertex] = true;
      currentState["status"] = "set temp1 to head";
      currentState["lineNo"] = 1;
      stateList.push(currentState);
      //end

      // Find parent
      // while(currentVertex != vertexText && currentVertex != null){
      for(j=0;j<index-1;j++){
        //while (--k!=0)
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        vertexTraversed[currentVertex] = true;
        currentState["status"] = "decrement k, index specified has not been reached, " + "(k = "+ (index-1-j) +")";
        currentState["lineNo"] = 2;
        stateList.push(currentState);
        //end

        var nextVertex;
         nextVertex = internalBst[currentVertex]["rightChild"];

        if(nextVertex == null) break;
        else currentVertex = nextVertex;

        //prev = prev.next
        parentVertex = internalBst[currentVertex]["parent"];
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        var edgeHighlighted = internalBst[parentVertex]["vertexClassNumber"];
        edgeTraversed[edgeHighlighted] = true;
        currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
        currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;
        currentState["status"] = "points to next vertex";
        currentState["lineNo"] = 3;
        stateList.push(currentState);
        //end
      }


      if(currentVertex!=null){
        //additional animation for the last vertex visited
        //while(--k!=0)
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        vertexTraversed[currentVertex] = true;
        currentState["status"] = "decrement k, k is 0, continue insertion";
        currentState["lineNo"] = 2;
        stateList.push(currentState);
        //end
        //end of additional animation
       }

      // Begin insertion

      // First, update internal representation

     

      //var newNodeVertexClass = internalBst[tempChild]["vertexClassNumber"];

      //Vertex temp = prev.next
      tempVertex = internalBst[currentVertex]["rightChild"];
      tempVertexClass = internalBst[tempVertex]["vertexClassNumber"];
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][tempVertexClass]["state"] =  VERTEX_GREEN_FILL;
      currentState["vl"][currentVertexClass]["state"] =  VERTEX_HIGHLIGHTED;
      currentState["el"][currentVertexClass]["state"] = EDGE_TRAVERSED;
      currentState["el"][currentVertexClass]["animateHighlighted"] = true;
      edgeTraversed[currentVertexClass] = true;
      currentState["status"] = "index specified is found, keep track of the next vertex";
      currentState["lineNo"] = 4;
      stateList.push(currentState);
      //end




      internalBst[parseInt(vertexText)] = {
        "leftChild": null,
        "rightChild": null,
        "vertexClassNumber": vertexClassNumberCounter++
      };
      amountVertex++;
      //modified this part for linked list insertion
      var newNode = parseInt(vertexText);
      newNodeVertexClass = internalBst[parseInt(vertexText)]["vertexClassNumber"];
      var tempChild;

      internalBst[newNode]["cx"] = internalBst[tempVertex]["cx"];
      internalBst[newNode]["cy"] = internalBst[tempVertex]["cy"] + 70;

      
   
      //vertex newVertex =  new Vertex(input)
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][currentVertexClass]["state"] =  VERTEX_HIGHLIGHTED;
      currentState["vl"][newNodeVertexClass]["state"] =  VERTEX_RED_FILL;
      currentState["vl"][tempVertexClass]["state"] =  VERTEX_GREEN_FILL;
      currentState["status"] = "create new vertex";
      currentState["lineNo"] = 5;
      stateList.push(currentState);
      edgeTraversed[newNodeVertexClass] = true;
      //end
    
      //RELINK THE POINTERs
      internalBst[newNode]["rightChild"] = tempVertex;
      internalBst[tempVertex]["parent"] = newNode;
      //END RELINKING
      

      //newVertex.next = temp
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      currentState["vl"][currentVertexClass]["state"] =  VERTEX_HIGHLIGHTED;
      currentState["vl"][newNodeVertexClass]["state"] =  VERTEX_RED_FILL;
      currentState["vl"][tempVertexClass]["state"] =  VERTEX_GREEN_FILL;
      currentState["el"][currentVertexClass]["state"] = EDGE_TRAVERSED;
      currentState["el"][newNodeVertexClass]["state"] = EDGE_RED;
      currentState["el"][newNodeVertexClass+BACK_EDGE_CONST]["state"] = OBJ_HIDDEN;
      currentState["status"] = "newVertex.next points to temp2";
      currentState["lineNo"] = 6;
      stateList.push(currentState);
      //end

      //temp2.prev = newVertex
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      currentState["vl"][currentVertexClass]["state"] =  VERTEX_HIGHLIGHTED;
      currentState["vl"][newNodeVertexClass]["state"] =  VERTEX_RED_FILL;
      currentState["vl"][tempVertexClass]["state"] =  VERTEX_GREEN_FILL;
      currentState["el"][currentVertexClass]["state"] = EDGE_TRAVERSED;
      currentState["el"][newNodeVertexClass]["state"] = EDGE_RED;
      currentState["el"][newNodeVertexClass+BACK_EDGE_CONST]["state"] = EDGE_GREEN;
      currentState["el"][currentVertexClass+BACK_EDGE_CONST]["state"] = OBJ_HIDDEN;
      currentState["status"] = "temp2 prev points to newVertex";
      currentState["lineNo"] = 6;
      stateList.push(currentState);
      //end

      internalBst[currentVertex]["rightChild"] = newNode;
      internalBst[newNode]["parent"] = currentVertex;

      //temp1.next  = newVertex
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      currentState["vl"][currentVertexClass]["state"] =  VERTEX_HIGHLIGHTED;
      currentState["vl"][newNodeVertexClass]["state"] =  VERTEX_RED_FILL;
      currentState["vl"][tempVertexClass]["state"] =  VERTEX_GREEN_FILL;
      currentState["el"][currentVertexClass]["state"] = EDGE_TRAVERSED;
      currentState["el"][currentVertexClass+BACK_EDGE_CONST]["state"] = OBJ_HIDDEN;
      currentState["status"] = "temp1.next points to newVertex";
      currentState["lineNo"] = 7;
      stateList.push(currentState);
      //end

      //prev.next  = newVertex
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      currentState["vl"][currentVertexClass]["state"] =  VERTEX_HIGHLIGHTED;
      currentState["vl"][newNodeVertexClass]["state"] =  VERTEX_RED_FILL;
      currentState["vl"][tempVertexClass]["state"] =  VERTEX_GREEN_FILL;
      currentState["el"][currentVertexClass]["state"] = EDGE_TRAVERSED;
      currentState["el"][currentVertexClass+BACK_EDGE_CONST]["state"] = EDGE_RED;
      currentState["status"] = "newVertex.prev points to temp1";
      currentState["lineNo"] = 7;
      stateList.push(currentState);
      //end


      recalculatePosition();
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][currentVertexClass]["state"] =  VERTEX_HIGHLIGHTED;
      currentState["vl"][newNodeVertexClass]["state"] =  VERTEX_RED_FILL;
      currentState["el"][newNodeVertexClass]["state"] = EDGE_RED;
      currentState["vl"][tempVertexClass]["state"] =  VERTEX_GREEN_FILL;
      currentState["status"] = "Re-layout the linked list. " + vertexText + " has been inserted!"
      currentState["lineNo"] = 0;

      stateList.push(currentState);

      // End State
      currentState = createState(internalBst);
      currentState["status"] = "Insert " + vertexText + " has been completed."
      currentState["lineNo"] = 0;
      stateList.push(currentState);

    

    graphWidget.startAnimation(stateList);
 
    populatePseudocode(0);
  
    return true;
  }

this.insertArrHead= function(vertexTextArr){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState  = {};
    var key;
    var i;

    // currentState["status"] = "The Current Linked List";
    // currentState["lineNo"] = 0;
    // stateList.push(currentState);

    // Loop through all array values and...

    var tempInternalBst = deepCopy(internalBst); // Use this to simulate internal insertion
    
      var vt = parseInt(vertexTextArr);

      // 1. Check whether value is number
      if(isNaN(vt)){
        $('#insert-err').html("Please fill in a number or comma-separated array of numbers!");
        return false;
      }

      // 2. No duplicates allowed. Also works if more than one similar value are inserted
      if(tempInternalBst[vt] != null){
        $('#insert-err').html("No duplicate vertex allowed!");
        return false;
      }

      // 3. Check range
      if(parseInt(vt) < valueRange[0] || parseInt(vt) > valueRange[1]){
        $('#insert-err').html("Sorry, only values between " + valueRange[0] + " and " + valueRange[1] + " can be inserted.");
        return false;
      }

      // 4. check size
      if(activeStatus=="stack"){
        if(amountVertex>=maxStackSize){
          $('#insert-err').html("Sorry, maximum size is " + maxStackSize);
          return false;
        }
      }
      else{
        if(amountVertex>=maxSize){
          $('#insert-err').html("Sorry, maximum size is " + maxSize);
          return false;
        }
      }

      var vertexText = parseInt(vertexTextArr);

      // Re-initialization
      vertexTraversed = {};
      edgeTraversed = {};
      currentVertex = null;
      if(amountVertex>=1){
        currentState = createState(internalBst);
      }
      else{
        currentState = {};
      }

      // Begin insertion

      // First, update internal representation

      internalBst[parseInt(vertexText)] = {
        "leftChild": null,
        "rightChild": null,
        "vertexClassNumber": vertexClassNumberCounter++
      };

      //modified this part for linked list insertion
      var newNode = parseInt(vertexText);

      internalBst[newNode]["cx"] = 20;
      internalBst[newNode]["cy"] = 120;
      //if linked list is empty
      amountVertex++;
      if(amountVertex>1){
        var tempChild = internalBst["root"];
        internalBst[newNode]["rightChild"] = tempChild;
        internalBst[tempChild]["parent"] = newNode;
        internalBst["root"] = newNode;
      } 
      else {
        internalBst["root"] = newNode;
      }

      // Then, draw edge
      var newNodeVertexClass = internalBst[parseInt(vertexText)]["vertexClassNumber"];


      if(amountVertex>1){
          //Vertex temp = temp Vertex(input)
          currentState = createState(internalBst, vertexTraversed, edgeTraversed);
          currentState["vl"][newNodeVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          currentState["el"][newNodeVertexClass]["state"] = OBJ_HIDDEN;
          currentState["status"] = "create node";
          currentState["lineNo"] = 1;
          stateList.push(currentState);
          //end

         //temp.next = head
          currentState = createState(internalBst, vertexTraversed, edgeTraversed);
          var edgeHighlighted = internalBst[newNode]["vertexClassNumber"];
          currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
          currentState["el"][edgeHighlighted]["state"] = EDGE_HIGHLIGHTED;
          currentState["vl"][newNodeVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          currentState["status"] = "So temp.next points to head";
          currentState["lineNo"] = 2;
          stateList.push(currentState);
          //end
      }
      else{
           //Vertex temp = temp Vertex(input)
          currentState = createState(internalBst, vertexTraversed, edgeTraversed);
          currentState["vl"][newNodeVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          currentState["status"] = "create node";
          currentState["lineNo"] = 1;
          stateList.push(currentState);
          //end

          currentState = createState(internalBst, vertexTraversed, edgeTraversed);
          currentState["vl"][newNodeVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          currentState["status"] = "head is null, temp.next is null"
          currentState["lineNo"] = 2;
          stateList.push(currentState);
      }

      //hed = temp
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][newNodeVertexClass]["state"] = VERTEX_BLUE_FILL;
      currentState["status"] = "Head points to temp"
      currentState["lineNo"] = 3;
      stateList.push(currentState);
      //end

      if(amountVertex==1){
        //tail = head
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][newNodeVertexClass]["state"] = VERTEX_GREEN_FILL;
        currentState["status"] = "Tail points to head"
        currentState["lineNo"] = 4;
        stateList.push(currentState);
        //end
      }

      
      recalculatePosition();
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][newNodeVertexClass]["state"] = VERTEX_BLUE_FILL;
      currentState["status"] = "Re-layout the linked list";
      currentState["lineNo"] = 0;
      stateList.push(currentState);

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["status"] = vertexText + " has been inserted!"
      currentState["lineNo"] = 0;
      stateList.push(currentState);

    

    graphWidget.startAnimation(stateList);
 
    populatePseudocode(1);
  
    return true;
  }



this.insertArrHeadDoublyList= function(vertexTextArr){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState  = {};
    var key;
    var i;

    // currentState["status"] = "The Current Linked List";
    // currentState["lineNo"] = 0;
    // stateList.push(currentState);

    // Loop through all array values and...

    var tempInternalBst = deepCopy(internalBst); // Use this to simulate internal insertion
    
      var vt = parseInt(vertexTextArr);

      // 1. Check whether value is number
      if(isNaN(vt)){
        $('#insert-err').html("Please fill in a number or comma-separated array of numbers!");
        return false;
      }

      // 2. No duplicates allowed. Also works if more than one similar value are inserted
      if(tempInternalBst[vt] != null){
        $('#insert-err').html("No duplicate vertex allowed!");
        return false;
      }

      // 3. Check range
      if(parseInt(vt) < valueRange[0] || parseInt(vt) > valueRange[1]){
        $('#insert-err').html("Sorry, only values between " + valueRange[0] + " and " + valueRange[1] + " can be inserted.");
        return false;
      }

      // 4. check size
      if(activeStatus=="stack"){
        if(amountVertex>=maxStackSize){
          $('#insert-err').html("Sorry, maximum size is " + maxStackSize);
          return false;
        }
      }
      else{
        if(amountVertex>=maxSize){
          $('#insert-err').html("Sorry, maximum size is " + maxSize);
          return false;
        }
      }
    

   

      var vertexText = parseInt(vertexTextArr);

      // Re-initialization
      vertexTraversed = {};
      edgeTraversed = {};
      currentVertex = null;
      if(amountVertex>=1){
        currentState = createState(internalBst);
      }
      else{
        currentState = {};
      }

      // Begin insertion

      // First, update internal representation

      internalBst[parseInt(vertexText)] = {
        "leftChild": null,
        "rightChild": null,
        "vertexClassNumber": vertexClassNumberCounter++
      };

      //modified this part for linked list insertion
      var newNode = parseInt(vertexText);

      internalBst[newNode]["cx"] = 20;
      internalBst[newNode]["cy"] = 120;
      //if linked list is empty
      amountVertex++;
      if(amountVertex>1){
        var tempChild = internalBst["root"];
        internalBst[newNode]["rightChild"] = tempChild;
        internalBst[tempChild]["parent"] = newNode;
        internalBst["root"] = newNode;
      } 
      else {
        internalBst["root"] = newNode;
      }

      // Then, draw edge
      var newNodeVertexClass = internalBst[parseInt(vertexText)]["vertexClassNumber"];


      if(amountVertex>1){
          //Vertex temp = temp Vertex(input)
          currentState = createState(internalBst, vertexTraversed, edgeTraversed);
          currentState["vl"][newNodeVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          currentState["el"][newNodeVertexClass]["state"] = OBJ_HIDDEN;
          currentState["el"][newNodeVertexClass+BACK_EDGE_CONST]["state"] = OBJ_HIDDEN;
          
          currentState["status"] = "create node";
          currentState["lineNo"] = 1;
          stateList.push(currentState);
          //end

         //temp.next = head
          currentState = createState(internalBst, vertexTraversed, edgeTraversed);
          var edgeHighlighted = internalBst[newNode]["vertexClassNumber"];
          currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
          currentState["el"][edgeHighlighted]["state"] = EDGE_HIGHLIGHTED;
          currentState["vl"][newNodeVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          currentState["el"][newNodeVertexClass+BACK_EDGE_CONST]["state"] = OBJ_HIDDEN;
          currentState["status"] = "So temp.next points to head";
          currentState["lineNo"] = 2;
          stateList.push(currentState);
          //end
      }
      else{
           //Vertex temp = temp Vertex(input)
          currentState = createState(internalBst, vertexTraversed, edgeTraversed);
          currentState["vl"][newNodeVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          currentState["status"] = "create node";
          currentState["lineNo"] = 1;
          stateList.push(currentState);
          //end

          currentState = createState(internalBst, vertexTraversed, edgeTraversed);
          currentState["vl"][newNodeVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          currentState["status"] = "head is null, temp.next is null"
          currentState["lineNo"] = 2;
          stateList.push(currentState);
      }

      //temp.next.prev = temp
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][newNodeVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      currentState["el"][newNodeVertexClass+BACK_EDGE_CONST]["state"] = EDGE_HIGHLIGHTED;
      currentState["el"][newNodeVertexClass+BACK_EDGE_CONST]["animateHighlighted"] = true;
      currentState["status"] = "set prev pointer";
      currentState["lineNo"] = 3;
      stateList.push(currentState);
      //end

      //head = temp
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][newNodeVertexClass]["state"] = VERTEX_BLUE_FILL;
      currentState["status"] = "Head points to temp"
      currentState["lineNo"] = 4;
      stateList.push(currentState);
      //end
      
      recalculatePosition();
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][newNodeVertexClass]["state"] = VERTEX_BLUE_FILL;
      currentState["status"] = "Re-layout the linked list";
      currentState["lineNo"] = 0;
      stateList.push(currentState);

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["status"] = vertexText + " has been inserted!"
      currentState["lineNo"] = 0;
      stateList.push(currentState);

    

    graphWidget.startAnimation(stateList);
 
    populatePseudocode(1);
  
    return true;
  }


this.insertArrTail = function(vertexTextArr){
    if(amountVertex==0){
      return this.insertArrHead(vertexTextArr);
    }
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var i;

    currentState["status"] = "The current LinkedList";
    currentState["lineNo"] = 0;
    stateList.push(currentState);


    // Loop through all array values and...

    var tempInternalBst = deepCopy(internalBst); // Use this to simulate internal insertion
    
      var vt = parseInt(vertexTextArr);

      // 1. Check whether value is number
      if(isNaN(vt)){
        $('#insert-err').html("Please fill in a number or comma-separated array of numbers!");
        return false;
      }

      // 2. No duplicates allowed. Also works if more than one similar value are inserted
      if(tempInternalBst[vt] != null){
        $('#insert-err').html("No duplicate vertex allowed!");
        return false;
      }

      // 3. Check range
      if(parseInt(vt) < valueRange[0] || parseInt(vt) > valueRange[1]){
        $('#insert-err').html("Sorry, only values between " + valueRange[0] + " and " + valueRange[1] + " can be inserted.");
        return false;
      }
      // 4. check size
      if(amountVertex>=maxSize){
        $('#insert-err').html("Sorry, maximum size is " + maxSize);
        return false;
      }

      var vertexText = parseInt(vertexTextArr);

      // Re-initialization
      vertexTraversed = {};
      edgeTraversed = {};
      currentVertex = internalBst["root"];
      currentState = createState(internalBst);

      // Find parent
      while(currentVertex != vertexText && currentVertex != null){
        var nextVertex;
        nextVertex = internalBst[currentVertex]["rightChild"];

        if(nextVertex == null) break;
        else currentVertex = nextVertex;
      }

      // Begin insertion

      // First, update internal representation
      var newNode = parseInt(vertexText);
      internalBst[parseInt(vertexText)] = {
        "leftChild": null,
        "rightChild": null,
        "vertexClassNumber": vertexClassNumberCounter++
      };

      if(currentVertex != null){
        internalBst[parseInt(vertexText)]["parent"] = currentVertex;
        internalBst[currentVertex]["rightChild"] = parseInt(vertexText);
      }

      else{
        internalBst[parseInt(vertexText)]["parent"] = null;
        internalBst["root"] = parseInt(vertexText);
      }

      amountVertex++;

      recalculatePosition();

      // Then, draw edge
      //Vertex temp = new vertex(input)
      var newNodeVertexClass = internalBst[parseInt(vertexText)]["vertexClassNumber"];
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["el"][currentVertexClass]["state"] = OBJ_HIDDEN;
      currentState["vl"][newNodeVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      currentState["status"] = "create new vertex"
      currentState["lineNo"] = 1;
      stateList.push(currentState);
      //end

      
      //tail.next = temp
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      // currentState["vl"][newNodeVertexClass]["state"] = OBJ_HIDDEN;
      currentState["vl"][currentVertexClass]["state"] = VERTEX_BLUE_FILL;
      currentState["vl"][newNodeVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      currentState["el"][currentVertexClass]["state"] = EDGE_TRAVERSED;
      currentState["el"][currentVertexClass]["animateHighlighted"] = true;
      currentState["status"] = "tail.next points to new vertex. Inserting " + vertexText + " ...";
      currentState["lineNo"] = 2;
      stateList.push(currentState);
      //end

      // Lastly, draw vertex
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][newNodeVertexClass]["state"] = VERTEX_BLUE_FILL;
      currentState["status"] = "Update tail pointer. " + vertexText + " has been inserted!"
      currentState["lineNo"] = 3;
      stateList.push(currentState);
      // End State

      currentState = createState(internalBst);
      currentState["status"] = "Insert " + vertexText + " to tail has been completed."
      currentState["lineNo"] = 0;
      stateList.push(currentState);

    
    graphWidget.startAnimation(stateList);
 
    populatePseudocode(2);
  
    return true;
  }

  this.insertArrTailDoublyList = function(vertexTextArr){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var i;

    if(amountVertex==0){
      return this.insertArrHead(vertexTextArr);
    }

    currentState["status"] = "The current LinkedList";
    currentState["lineNo"] = 0;
    stateList.push(currentState);


    // Loop through all array values and...

    var tempInternalBst = deepCopy(internalBst); // Use this to simulate internal insertion
    
      var vt = parseInt(vertexTextArr);

      // 1. Check whether value is number
      if(isNaN(vt)){
        $('#insert-err').html("Please fill in a number or comma-separated array of numbers!");
        return false;
      }

      // 2. No duplicates allowed. Also works if more than one similar value are inserted
      if(tempInternalBst[vt] != null){
        $('#insert-err').html("No duplicate vertex allowed!");
        return false;
      }

      // 3. Check range
      if(parseInt(vt) < valueRange[0] || parseInt(vt) > valueRange[1]){
        $('#insert-err').html("Sorry, only values between " + valueRange[0] + " and " + valueRange[1] + " can be inserted.");
        return false;
      }
      // 4. check size
      if(amountVertex>=maxSize){
        $('#insert-err').html("Sorry, maximum size is " + maxSize);
        return false;
      }

      var vertexText = parseInt(vertexTextArr);

      // Re-initialization
      vertexTraversed = {};
      edgeTraversed = {};
      currentVertex = internalBst["root"];
      currentState = createState(internalBst);

      // Find parent
      while(currentVertex != vertexText && currentVertex != null){
        var nextVertex;
        nextVertex = internalBst[currentVertex]["rightChild"];

        if(nextVertex == null) break;
        else currentVertex = nextVertex;
      }

      // Begin insertion

      // First, update internal representation
      var newNode = parseInt(vertexText);
      internalBst[parseInt(vertexText)] = {
        "leftChild": null,
        "rightChild": null,
        "vertexClassNumber": vertexClassNumberCounter++
      };

      if(currentVertex != null){
        internalBst[parseInt(vertexText)]["parent"] = currentVertex;
        internalBst[currentVertex]["rightChild"] = parseInt(vertexText);
      }

      else{
        internalBst[parseInt(vertexText)]["parent"] = null;
        internalBst["root"] = parseInt(vertexText);
      }

      amountVertex++;

      recalculatePosition();

      // Then, draw edge
      //Vertex temp = new vertex(input)
      var newNodeVertexClass = internalBst[parseInt(vertexText)]["vertexClassNumber"];
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["el"][currentVertexClass]["state"] = OBJ_HIDDEN;
      currentState["el"][currentVertexClass+BACK_EDGE_CONST]["state"] = OBJ_HIDDEN;
      currentState["vl"][newNodeVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      currentState["status"] = "create new vertex"
      currentState["lineNo"] = 1;
      stateList.push(currentState);
      //end

      
      //tail.next = temp
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      // currentState["vl"][newNodeVertexClass]["state"] = OBJ_HIDDEN;
      currentState["vl"][currentVertexClass]["state"] = VERTEX_BLUE_FILL;
      currentState["vl"][newNodeVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      currentState["el"][currentVertexClass]["state"] = EDGE_TRAVERSED;
      currentState["el"][currentVertexClass]["animateHighlighted"] = true;
      currentState["el"][currentVertexClass+BACK_EDGE_CONST]["state"] = OBJ_HIDDEN;
      currentState["status"] = "tail.next points to new vertex. Inserting " + vertexText + " ...";
      currentState["lineNo"] = 2;
      stateList.push(currentState);
      //end

      // temp.prev = tail
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][newNodeVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      currentState["vl"][currentVertexClass]["state"] = VERTEX_BLUE_FILL;
      currentState["el"][currentVertexClass+BACK_EDGE_CONST]["state"] = EDGE_HIGHLIGHTED;
      currentState["el"][currentVertexClass+BACK_EDGE_CONST]["animateHighlighted"] = true;
      currentState["status"] = "Update prev pointer of new vertex"
      currentState["lineNo"] = 3;
      stateList.push(currentState);
      // End State

      // Lastly, draw vertex
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][newNodeVertexClass]["state"] = VERTEX_BLUE_FILL;
      currentState["status"] = "Update tail pointer. " + vertexText + " has been inserted!"
      currentState["lineNo"] = 4;
      stateList.push(currentState);
      // End State

      currentState = createState(internalBst);
      currentState["status"] = "Insert " + vertexText + " to tail has been completed."
      currentState["lineNo"] = 0;
      stateList.push(currentState);

    
    graphWidget.startAnimation(stateList);
 
    populatePseudocode(2);
  
    return true;
  }

  this.removeArrHead = function(){
    var index = 0;
    var vertexTextArr = [1];
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var i;

    currentState["status"] = "The current Linked List";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

      var vertexCheckBf;
     
      // Re-initialization
      vertexTraversed = {};
      edgeTraversed = {};
      currentVertex = internalBst["root"];
      currentState = createState(internalBst);

      // Case 1: no child
      if(internalBst[currentVertex]["rightChild"]==null){

        //temp = head
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["status"] = "Vertex has no children. It is the only vertex";
        currentState["lineNo"] = 1;
        stateList.push(currentState);
        //end


        //head = head next
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["status"] = "Head points to next (which is null)";
        currentState["lineNo"] = 2;
        stateList.push(currentState);
        //end
      
        // var parentVertex = internalBst[currentVertex]["parent"];

       
        // if(parentVertex !=null) internalBst[parentVertex]["rightChild"] = null;
        // else internalBst["root"] = "null";

        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

        //delete temp
        delete internalBst[currentVertex];
        delete vertexTraversed[currentVertex];
        delete edgeTraversed[currentVertexClass];

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["status"] = "Remove first vertex";
        currentState["lineNo"] = 3;
        stateList.push(currentState);
        
        //end
      }
      else{
        //has child
        // temp =  head
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["status"] = "Vertex has a child";
        currentState["lineNo"] = 1;
        stateList.push(currentState);
        //end
      
        var rightChildVertex = internalBst[currentVertex]["rightChild"];

      

        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        rightChildVertexClass = internalBst[rightChildVertex]["vertexClassNumber"];


        //head = head.next
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_BLUE_FILL;
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        //edgeTraversed[rightChildVertexClass] = true;
        currentState["el"][currentVertexClass]["state"] = EDGE_BLUE;
        currentState["el"][currentVertexClass]["animateHighlighted"] = true;
        currentState["status"] = "head points to next";
        currentState["lineNo"] = 2;
        stateList.push(currentState);
        //end

        internalBst["root"] = rightChildVertex;
        internalBst[rightChildVertex]["parent"] = null;


        //delete temp
        delete internalBst[currentVertex];
        delete vertexTraversed[currentVertex];
        delete edgeTraversed[currentVertexClass];
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_BLUE_FILL;
        currentState["status"] = "Delete vertex";
        currentState["lineNo"] = 3;
        stateList.push(currentState);
        //end

        //relayout
        recalculatePosition();
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_BLUE_FILL;
        currentState["status"] = "Re-layout the list";
        currentState["lineNo"] = 0;
        stateList.push(currentState);
        //end
    }

    currentState = createState(internalBst);
    currentState["status"] = "Removal of first vertex completed";
    currentState["lineNo"] = 0;
    stateList.push(currentState);
    

    graphWidget.startAnimation(stateList);
 
    populatePseudocode(5);
    amountVertex--;
    return true;
  }


  this.removeArrHeadDoublyList = function(){
    var index = 0;
    var vertexTextArr = [1];
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var i;

    currentState["status"] = "The current Linked List";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

      var vertexCheckBf;
     
      // Re-initialization
      vertexTraversed = {};
      edgeTraversed = {};
      currentVertex = internalBst["root"];
      currentState = createState(internalBst);

      // Case 1: no child
      if(internalBst[currentVertex]["rightChild"]==null){

        //temp = head
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["status"] = "Vertex has no children. It is the only vertex";
        currentState["lineNo"] = 1;
        stateList.push(currentState);
        //end


        //head = head next
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["status"] = "Head points to next (which is null)";
        currentState["lineNo"] = 2;
        stateList.push(currentState);
        //end
      
        // var parentVertex = internalBst[currentVertex]["parent"];

       
        // if(parentVertex !=null) internalBst[parentVertex]["rightChild"] = null;
        // else internalBst["root"] = "null";

        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

        //delete temp
        delete internalBst[currentVertex];
        delete vertexTraversed[currentVertex];
        delete edgeTraversed[currentVertexClass];

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["status"] = "Remove first vertex";
        currentState["lineNo"] = 3;
        stateList.push(currentState);
        
        //end
      }
      else{
        //has child
        // temp =  head
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["status"] = "Vertex has a child";
        currentState["lineNo"] = 1;
        stateList.push(currentState);
        //end
      
        var rightChildVertex = internalBst[currentVertex]["rightChild"];

      

        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        rightChildVertexClass = internalBst[rightChildVertex]["vertexClassNumber"];


        //head = head.next
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_BLUE_FILL;
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        //edgeTraversed[rightChildVertexClass] = true;
        currentState["el"][currentVertexClass]["state"] = EDGE_BLUE;
        currentState["el"][currentVertexClass]["animateHighlighted"] = true;
        currentState["status"] = "head points to next";
        currentState["lineNo"] = 2;
        stateList.push(currentState);
        //end

        internalBst["root"] = rightChildVertex;
        internalBst[rightChildVertex]["parent"] = null;


        //delete temp
        delete internalBst[currentVertex];
        delete vertexTraversed[currentVertex];
        delete edgeTraversed[currentVertexClass];
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_BLUE_FILL;
        currentState["status"] = "Delete vertex";
        currentState["lineNo"] = 3;
        stateList.push(currentState);
        //end

        //head.prev = null
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_BLUE_FILL;
        currentState["status"] = "set head.prev to null";
        currentState["lineNo"] = 4;
        stateList.push(currentState);
        //end

        //relayout
        recalculatePosition();
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_BLUE_FILL;
        currentState["status"] = "Re-layout the list";
        currentState["lineNo"] = 0;
        stateList.push(currentState);
        //end
    }

    currentState = createState(internalBst);
    currentState["status"] = "Removal of first vertex completed";
    currentState["lineNo"] = 0;
    stateList.push(currentState);
    

    graphWidget.startAnimation(stateList);
 
    populatePseudocode(5);
    amountVertex--;
    return true;
  }

  this.removeArrTail = function(){
    var vertexTextArr = [1];
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var nextVertex = internalBst[currentVertex]["rightChild"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var nextVertexClass;
    var key;
    var i;

    if(amountVertex==1){
      return this.removeArrHead();
    }

    //Vertex prev = head
    currentState = createState(internalBst, vertexTraversed, edgeTraversed);
    currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
    currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
    currentState["status"] = "The current Linked List";
    currentState["lineNo"] = 1;
    stateList.push(currentState);
    //end

    //temp = head.next
    currentState = createState(internalBst, vertexTraversed, edgeTraversed);
    //prev highlight
    currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
    currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
    //temp highlight
    nextVertexClass = internalBst[nextVertex]["vertexClassNumber"];
    currentState["vl"][nextVertexClass]["state"] = VERTEX_GREEN_FILL;
    //animate highlight
    currentState["el"][currentVertexClass]["animateHighlighted"] = true;
    currentState["el"][currentVertexClass]["state"] = EDGE_TRAVERSED;
    //status
    currentState["status"] = "The current Linked List";
    currentState["lineNo"] = 2;
    stateList.push(currentState);
    //end

      // Find vertex
      while(true){
        // while (temp.next!=null)
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        //prev highlight
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        //temp hightlight
        nextVertexClass = internalBst[nextVertex]["vertexClassNumber"];
        currentState["vl"][nextVertexClass]["state"] = VERTEX_GREEN_FILL;
        vertexTraversed[currentVertex] = true;
        //status
        currentState["status"] = "check if temp.next is null";
        currentState["lineNo"] = 3;
        stateList.push(currentState);
        //end

        if(internalBst[nextVertex]["rightChild"]!=null) {
          nextVertex = internalBst[nextVertex]["rightChild"];
          currentVertex = internalBst[currentVertex]["rightChild"];
        }
        else break;

        //temp = temp.next , prev = prev.next
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        //prev highlight
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        //temp hightlight
        nextVertexClass = internalBst[nextVertex]["vertexClassNumber"];
        currentState["vl"][nextVertexClass]["state"] = VERTEX_GREEN_FILL;
        vertexTraversed[currentVertex] = true;
        //prev highlight
        parentVertex = internalBst[currentVertex]["parent"];
        var edgeHighlighted = internalBst[parentVertex]["vertexClassNumber"];
        currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
        currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;
        edgeTraversed[edgeHighlighted] = true;
        //temp highlight
        var edgeHighlighted2 = internalBst[currentVertex]["vertexClassNumber"];
        currentState["el"][edgeHighlighted2]["animateHighlighted"] = true;
        currentState["el"][edgeHighlighted2]["state"] = EDGE_GREEN;
        //status
        currentState["status"] = "points to next";
        currentState["lineNo"] = 4;
        stateList.push(currentState);
        //end
      }

 

    
     
      //prev.next = null
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      //prev highlight
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
      nextVertexClass = internalBst[nextVertex]["vertexClassNumber"];
      currentState["el"][currentVertexClass]["state"] = OBJ_HIDDEN;
      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      //temp hightlight
      nextVertexClass = internalBst[nextVertex]["vertexClassNumber"];
      currentState["vl"][nextVertexClass]["state"] = VERTEX_GREEN_FILL;
      vertexTraversed[currentVertex] = true;
      
      //status
      currentState["status"] = "Set last vertex.next to null";
      currentState["lineNo"] = 5;
      stateList.push(currentState);
      //end

      var parentVertex = internalBst[nextVertex]["parent"];
      if(parentVertex !=null) internalBst[parentVertex]["rightChild"] = null;
      else internalBst["root"] = null;

      
      //delete temp
      delete internalBst[nextVertex];
      delete vertexTraversed[nextVertex];
      delete edgeTraversed[nextVertexClass];
       
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      currentState["status"] = "delete last vertex";
      currentState["lineNo"] = 6;
      stateList.push(currentState);
      //end

      //tail = prev
      delete internalBst[nextVertex];
      delete vertexTraversed[nextVertex];
      delete edgeTraversed[nextVertexClass];
       
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][currentVertexClass]["state"] = VERTEX_BLUE_FILL;
      currentState["status"] = "update tail pointer";
      currentState["lineNo"] = 7;
      stateList.push(currentState);
      //end

      currentState = createState(internalBst);
      currentState["status"] = "Removal of last vertex completed";
      currentState["lineNo"] = 0;
      stateList.push(currentState);
    

    graphWidget.startAnimation(stateList);
 
    populatePseudocode(6);
    amountVertex--;
    return true;
  }


this.removeArrTailDoublyList = function(){
    var vertexTextArr = [1];
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var nextVertex = internalBst[currentVertex]["rightChild"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var nextVertexClass;
    var key;
    var i;

    if(amountVertex==1){
      return this.removeArrHead();
    }


      // Find vertex
      while(true){
       

        if(internalBst[nextVertex]["rightChild"]!=null) {
          nextVertex = internalBst[nextVertex]["rightChild"];
          currentVertex = internalBst[currentVertex]["rightChild"];
        }
        else break;
      }

      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
      nextVertexClass = internalBst[nextVertex]["vertexClassNumber"];

      //Vertex temp = tail
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      
      currentState["vl"][nextVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      currentState["status"] = "set temp to tail";
      currentState["lineNo"] = 1;
      stateList.push(currentState);
      //end

      //Vertex temp = tail
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      
      currentState["vl"][nextVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      currentState["el"][currentVertexClass+BACK_EDGE_CONST]["state"] = EDGE_HIGHLIGHTED;
      currentState["vl"][currentVertexClass]["state"] = VERTEX_BLUE_FILL;
      currentState["status"] = "set tail to tail.prev";
      currentState["lineNo"] = 2;
      stateList.push(currentState);
      //end

    
     
      //tail.next = null
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      //prev highlight
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
      nextVertexClass = internalBst[nextVertex]["vertexClassNumber"];
      currentState["el"][currentVertexClass]["state"] = OBJ_HIDDEN;
      currentState["vl"][currentVertexClass]["state"] = VERTEX_BLUE_FILL;
      //temp hightlight
      nextVertexClass = internalBst[nextVertex]["vertexClassNumber"];
      currentState["vl"][nextVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      vertexTraversed[currentVertex] = true;
      
      //status
      currentState["status"] = "Set last vertex.next to null";
      currentState["lineNo"] = 3;
      stateList.push(currentState);
      //end

      var parentVertex = internalBst[nextVertex]["parent"];
      if(parentVertex !=null) internalBst[parentVertex]["rightChild"] = null;
      else internalBst["root"] = null;

      
      //delete temp
      delete internalBst[nextVertex];
      delete vertexTraversed[nextVertex];
      delete edgeTraversed[nextVertexClass];
       
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][currentVertexClass]["state"] = VERTEX_BLUE_FILL;
      currentState["status"] = "delete last vertex";
      currentState["lineNo"] = 4;
      stateList.push(currentState);
      //end

      currentState = createState(internalBst);
      currentState["status"] = "Removal of last vertex completed";
      currentState["lineNo"] = 0;
      stateList.push(currentState);
    

    graphWidget.startAnimation(stateList);
 
    populatePseudocode(8);
    amountVertex--;
    return true;
  }

  this.removeArrKth = function(vertexTextArr){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var i;



    // Loop through all array values and...
    
    var index;

      var vt = parseInt(vertexTextArr);
      
      // Check whether value is number
      if(isNaN(vt)){
        $('#remove-err').html("Please fill in a number or comma-separated array of numbers!");
        return false;
      }
      if(vt>=amountVertex){
         $('#remove-err').html("Please enter a valid index!");
         return false;
      }
      if(vt<0){
         $('#remove-err').html("Please enter a valid index!");
         return false;
      }
      index = vt;
    

    if(index==0){
      return this.removeArrHead();
    }
    if(index==amountVertex-1){
      return this.removeArrTail();
    }

    //Vertex prev = head
    currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
    currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
    currentState["status"] = "temp1 points to head";
    currentState["lineNo"] = 1;
    stateList.push(currentState);
    //end
  
      var vertexCheckBf;
     
      // Re-initialization
      vertexTraversed = {};
      edgeTraversed = {};
      currentVertex = internalBst["root"];
      currentState = createState(internalBst);

      // Find vertex
      for(i = 0; i < index-1; i++){
    
      // while(true){
        //while (--k!=0)
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        vertexTraversed[currentVertex] = true;
        currentState["status"] = "decrement k, index specified has not been reached, " + "(k = "+ (index-1-i) +")";
        currentState["lineNo"] = 2;
        stateList.push(currentState); 
        //end

        //important assignment
        parentVertex = currentVertex;
        currentVertex = internalBst[currentVertex]["rightChild"];


        //prev = prev.next
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        var edgeHighlighted = internalBst[parentVertex]["vertexClassNumber"];
        edgeTraversed[edgeHighlighted] = true;
        currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
        currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;
        currentState["status"] = "points to the next vertex";
        currentState["lineNo"] = 3;
        stateList.push(currentState);
        //end
      }

      //while (--k!=0)
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      vertexTraversed[currentVertex] = true;
      currentState["status"] = "k is 0, continue removal";
      currentState["lineNo"] = 2;
      stateList.push(currentState); 
      //end

      parentVertex = currentVertex;
      currentVertex = internalBst[currentVertex]["rightChild"];

      if(currentVertex != null){
        //Vertex temp = prev.next
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        
        parentVertex = internalBst[currentVertex]["parent"];
        parentVertexClass = internalBst[parentVertex]["vertexClassNumber"];
        currentState["vl"][parentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        var edgeHighlighted = internalBst[parentVertex]["vertexClassNumber"];
        edgeTraversed[edgeHighlighted] = true;
        currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
        currentState["el"][edgeHighlighted]["state"] = EDGE_GREEN;
        currentState["vl"][currentVertexClass]["state"] = VERTEX_GREEN_FILL;
        vertexTraversed[currentVertex] = true;
        currentState["status"] = "keep track of the vertex to be deleted";
        currentState["lineNo"] = 4;
        stateList.push(currentState);
        //end
      }

      // Case 1: no child
      if(internalBst[currentVertex]["rightChild"]==null){
        // currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        // currentState["status"] = "vertex is the last vertex, update tail pointer";
        // currentState["lineNo"] = 7;
        // stateList.push(currentState);
        // var parentVertex = internalBst[currentVertex]["parent"];

        // if(parentVertex !=null) internalBst[parentVertex]["rightChild"] = null;
        // else internalBst["root"] = null;

        // currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        // delete internalBst[currentVertex];
        // delete vertexTraversed[currentVertex];
        // delete edgeTraversed[currentVertexClass];

        // currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        // currentState["status"] = "Remove last vertex";
        // currentState["lineNo"] = 7;
        // stateList.push(currentState);
        // vertexCheckBf = parentVertex;
      }
      else{

        // has child
     
        // currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        //  currentState["status"] = "keep track of the vertex to be deleted";
        // currentState["lineNo"] = 4;
        // stateList.push(currentState);
        var parentVertex = internalBst[currentVertex]["parent"];
        var rightChildVertex = internalBst[currentVertex]["rightChild"];

        if(parentVertex != null){
          internalBst[parentVertex]["rightChild"] = rightChildVertex;
        }
        else internalBst["root"] = rightChildVertex;

        internalBst[rightChildVertex]["parent"] = parentVertex;
       


        //prev.next = prev.next.next
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        rightChildVertexClass = internalBst[rightChildVertex]["vertexClassNumber"];
        internalBst[currentVertex]["cy"] = 50 + internalBst[currentVertex]["cy"];
  

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        parentVertex = internalBst[currentVertex]["parent"];
        parentVertexClass = internalBst[parentVertex]["vertexClassNumber"];
        currentState["vl"][parentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        //currentState["el"][currentVertexClass]["state"] = OBJ_HIDDEN;
        currentState["vl"][currentVertexClass]["state"] = VERTEX_GREEN_FILL;
        if(parentVertex != null){
          currentState["el"][parentVertexClass]["state"] = EDGE_HIGHLIGHTED;
          currentState["el"][parentVertexClass]["animateHighlighted"] = true;
        }
        currentState["status"] = "Connect the previous vertex to the next vertex";
        currentState["lineNo"] = 5;
        stateList.push(currentState);
        //end


        //delete temp
        delete internalBst[currentVertex];
        delete vertexTraversed[currentVertex];
        delete edgeTraversed[currentVertexClass];
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][parentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        if(parentVertex != null){
          currentState["el"][parentVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }
        currentState["status"] = "Delete vertex";
        currentState["lineNo"] = 6;
        stateList.push(currentState);
        //end

        //relayout list
        recalculatePosition();

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][parentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        if(parentVertex != null){
          currentState["el"][parentVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }
        currentState["status"] = "Re-layout the list";
        currentState["lineNo"] = 0;
        stateList.push(currentState);
        //end relayout
    }
    currentState = createState(internalBst);
    currentState["status"] = "Removal completed";
    currentState["lineNo"] = 0;
  
    stateList.push(currentState);
  
    graphWidget.startAnimation(stateList);
 
    populatePseudocode(7);
    amountVertex--;
    return true;
  }

  this.removeArrKthDoublyList = function(vertexTextArr){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var i;
    // Loop through all array values and...
    var index;
    var vt = parseInt(vertexTextArr);
      
    // Check whether value is number
    if(isNaN(vt)){
      $('#remove-err').html("Please fill in a number or comma-separated array of numbers!");
      return false;
    }
    if(vt>=amountVertex){
       $('#remove-err').html("Please enter a valid index!");
       return false;
    }
    if(vt<0){
       $('#remove-err').html("Please enter a valid index!");
       return false;
    }
    index = vt;
    

    if(index==0){
      return this.removeArrHeadDoublyList();
    }
    if(index==amountVertex-1){
      return this.removeArrTailDoublyList();
    }

    //Vertex prev = head
    currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
    currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
    currentState["status"] = "temp1 points to head";
    currentState["lineNo"] = 1;
    stateList.push(currentState);
    //end
  
    var vertexCheckBf;
   
    // Re-initialization
    vertexTraversed = {};
    edgeTraversed = {};
    currentVertex = internalBst["root"];
    currentState = createState(internalBst);

    // Find vertex
      for(i = 0; i < index-1; i++){
    
      // while(true){
        //while (--k!=0)
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        vertexTraversed[currentVertex] = true;
        currentState["status"] = "decrement k, index specified has not been reached, " + "(k = "+ (index-1-i) +")";
        currentState["lineNo"] = 2;
        stateList.push(currentState); 
        //end

        //important assignment
        parentVertex = currentVertex;
        currentVertex = internalBst[currentVertex]["rightChild"];


        //prev = prev.next
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        var edgeHighlighted = internalBst[parentVertex]["vertexClassNumber"];
        edgeTraversed[edgeHighlighted] = true;
        currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
        currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;
        currentState["status"] = "points to the next vertex";
        currentState["lineNo"] = 3;
        stateList.push(currentState);
        //end
      }

      //while (--k!=0)
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      vertexTraversed[currentVertex] = true;
      currentState["status"] = "k is 0, continue removal";
      currentState["lineNo"] = 2;
      stateList.push(currentState); 
      //end

      parentVertex = currentVertex;
      currentVertex = internalBst[currentVertex]["rightChild"];

      if(currentVertex != null){
        //Vertex temp2 = temp1.next
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        
        parentVertex = internalBst[currentVertex]["parent"];
        parentVertexClass = internalBst[parentVertex]["vertexClassNumber"];
        currentState["vl"][parentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        var edgeHighlighted = internalBst[parentVertex]["vertexClassNumber"];
        edgeTraversed[edgeHighlighted] = true;
        currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
        currentState["el"][edgeHighlighted]["state"] = EDGE_GREEN;
        currentState["vl"][currentVertexClass]["state"] = VERTEX_GREEN_FILL;
        vertexTraversed[currentVertex] = true;
        currentState["status"] = "keep track of the vertex to be deleted";
        currentState["lineNo"] = 4;
        stateList.push(currentState);
        //end

        //Vertex temp3 = temp2.next
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        
        parentVertex = internalBst[currentVertex]["parent"];
        rightChildVertex = internalBst[currentVertex]["rightChild"];
        rightChildVertexClass = internalBst[rightChildVertex]["vertexClassNumber"];
        parentVertexClass = internalBst[parentVertex]["vertexClassNumber"];
        currentState["vl"][parentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        var edgeHighlighted = internalBst[currentVertex]["vertexClassNumber"];
        edgeTraversed[edgeHighlighted] = true;
        currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
        currentState["vl"][currentVertexClass]["state"] = VERTEX_GREEN_FILL;
        currentState["el"][edgeHighlighted]["state"] = EDGE_RED;
        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_RED_FILL;
        vertexTraversed[currentVertex] = true;
        currentState["status"] = "keep track of the vertex, next to the vertex to be deleted";
        currentState["lineNo"] = 5;
        stateList.push(currentState);
        //end
      }

      // Case 1: no child
      if(internalBst[currentVertex]["rightChild"]==null){
        // currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        // currentState["status"] = "vertex is the last vertex, update tail pointer";
        // currentState["lineNo"] = 7;
        // stateList.push(currentState);
        // var parentVertex = internalBst[currentVertex]["parent"];

        // if(parentVertex !=null) internalBst[parentVertex]["rightChild"] = null;
        // else internalBst["root"] = null;

        // currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        // delete internalBst[currentVertex];
        // delete vertexTraversed[currentVertex];
        // delete edgeTraversed[currentVertexClass];

        // currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        // currentState["status"] = "Remove last vertex";
        // currentState["lineNo"] = 7;
        // stateList.push(currentState);
        // vertexCheckBf = parentVertex;
      }
      else{

        // has child
     
        // currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        //  currentState["status"] = "keep track of the vertex to be deleted";
        // currentState["lineNo"] = 4;
        // stateList.push(currentState);
        var parentVertex = internalBst[currentVertex]["parent"];
        var rightChildVertex = internalBst[currentVertex]["rightChild"];

        if(parentVertex != null){
          internalBst[parentVertex]["rightChild"] = rightChildVertex;
        }
        else internalBst["root"] = rightChildVertex;

        internalBst[rightChildVertex]["parent"] = parentVertex;
       


        //temp2.next.prev = temp1
        parentVertexClass = internalBst[parentVertex]["vertexClassNumber"];
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        rightChildVertexClass = internalBst[rightChildVertex]["vertexClassNumber"];
        internalBst[currentVertex]["cy"] = 50 + internalBst[currentVertex]["cy"];
  

      

        


        //delete temp
        delete internalBst[currentVertex];
        delete vertexTraversed[currentVertex];
        delete edgeTraversed[currentVertexClass];
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][parentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        if(parentVertex != null){
          currentState["el"][parentVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }
        currentState["el"][parentVertexClass]["state"] = OBJ_HIDDEN;
        currentState["el"][parentVertexClass+BACK_EDGE_CONST]["state"] = OBJ_HIDDEN;
        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_RED_FILL;
        currentState["status"] = "Delete vertex";
        currentState["lineNo"] = 6;
        stateList.push(currentState);
        //end

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][parentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_RED_FILL;
        currentState["el"][parentVertexClass+BACK_EDGE_CONST]["state"] = OBJ_HIDDEN;
        currentState["status"] = "Connect the previous vertex to the next vertex";
        currentState["lineNo"] = 7;
        stateList.push(currentState);
        //end

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][parentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_RED_FILL;
         currentState["el"][parentVertexClass+BACK_EDGE_CONST]["state"] = EDGE_RED;
        currentState["status"] = "Connect the next vertex to the previous vertex";
        currentState["lineNo"] = 7;
        stateList.push(currentState);
        //end


        //relayout list
        recalculatePosition();

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][parentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        if(parentVertex != null){
          currentState["el"][parentVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }
        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_RED_FILL;
        currentState["status"] = "Re-layout the list";
        currentState["lineNo"] = 0;
        stateList.push(currentState);
        //end relayout
    }
    currentState = createState(internalBst);
    currentState["status"] = "Removal completed";
    currentState["lineNo"] = 0;
  
    stateList.push(currentState);
  
    graphWidget.startAnimation(stateList);
 
    populatePseudocode(7);
    amountVertex--;
    return true;
  }

  function init(initArr){
    var i;
    amountVertex=0;
    clearScreen();

    for(i = 0; i < initArr.length; i++){
      var parentVertex = internalBst["root"];
      var newVertex = parseInt(initArr[i]);

      if(parentVertex == null){
        internalBst["root"] = parseInt(newVertex);
        internalBst[newVertex] = {
          "parent": null,
          "leftChild": null,
          "rightChild": null,
          "vertexClassNumber": amountVertex
        };
      }

      else{
        while(true){
            if(internalBst[parentVertex]["rightChild"] == null) break;
            parentVertex = internalBst[parentVertex]["rightChild"];
        }
        internalBst[parentVertex]["rightChild"] = newVertex;
        internalBst[newVertex] = {
          "parent": parentVertex,
          "leftChild":null,
          "rightChild": null,
          "vertexClassNumber": amountVertex
        }
      }

      amountVertex++;
    }

    recalculatePosition();

    for(key in internalBst){
      if(key == "root") continue;
      graphWidget.addVertex(internalBst[key]["cx"], internalBst[key]["cy"], key, internalBst[key]["vertexClassNumber"], true);
    }

    for(key in internalBst){
      if(key == "root") continue;
      if(key == internalBst["root"]) continue;
      var parentVertex = internalBst[key]["parent"];
      
      graphWidget.addEdge(internalBst[parentVertex]["vertexClassNumber"], internalBst[key]["vertexClassNumber"], internalBst[parentVertex]["vertexClassNumber"], EDGE_TYPE_DE, 1, true);
      if((activeStatus == "doublylist")||(activeStatus == "deque")){
        graphWidget.addEdge(internalBst[key]["vertexClassNumber"], internalBst[parentVertex]["vertexClassNumber"], internalBst[parentVertex]["vertexClassNumber"]+BACK_EDGE_CONST, EDGE_TYPE_DE, 1, true);
      }
    }
  }



  function clearScreen(){
    var key;

    for(key in internalBst){
      if(key == "root") continue;
      graphWidget.removeEdge(internalBst[key]["vertexClassNumber"]+BACK_EDGE_CONST);
      graphWidget.removeEdge(internalBst[key]["vertexClassNumber"]);
       
    }

    for(key in internalBst){
      if(key == "root") continue;
      graphWidget.removeVertex(internalBst[key]["vertexClassNumber"]);
    }

    internalBst = {};
    internalBst["root"] = null;
    amountVertex = 0;
  }

  /*
   * internalBstObject: a JS object with the same structure of internalBst. This means the BST doen't have to be the BST stored in this class
   * vertexTraversed: JS object with the vertexes of the BST which are to be marked as traversed as the key
   * edgeTraversed: JS object with the edges of the BST which are to be marked as traversed as the key
   */

  function createState(internalBstObject, vertexTraversed, edgeTraversed){
    if(vertexTraversed == null || vertexTraversed == undefined || !(vertexTraversed instanceof Object))
      vertexTraversed = {};
    if(edgeTraversed == null || edgeTraversed == undefined || !(edgeTraversed instanceof Object))
      edgeTraversed = {};

    var state = {
      "vl":{},
      "el":{}
    };

    var key;
    var vertexClass;

    for(key in internalBstObject){
      if(key != "root") {

        vertexClass = internalBstObject[key]["vertexClassNumber"]

        state["vl"][vertexClass] = {};

        state["vl"][vertexClass]["cx"] = internalBstObject[key]["cx"];
        state["vl"][vertexClass]["cy"] = internalBstObject[key]["cy"];
        state["vl"][vertexClass]["text"] = key;
        state["vl"][vertexClass]["state"] = VERTEX_DEFAULT;
      }

      if(internalBstObject[key]["rightChild"] == null) continue;

      

      parentChildEdgeId = internalBstObject[key]["vertexClassNumber"];

      state["el"][parentChildEdgeId] = {};

      state["el"][parentChildEdgeId]["vertexA"] = internalBstObject[key]["vertexClassNumber"];
      state["el"][parentChildEdgeId]["vertexB"] = internalBstObject[internalBstObject[key]["rightChild"]]["vertexClassNumber"];
      state["el"][parentChildEdgeId]["type"] = EDGE_TYPE_DE;
      state["el"][parentChildEdgeId]["weight"] = 1;
      state["el"][parentChildEdgeId]["state"] = EDGE_DEFAULT;
      state["el"][parentChildEdgeId]["animateHighlighted"] = false;

      //add an edge for doubly linked list
      if((activeStatus == "doublylist")||(activeStatus == "deque")){
          parentChildEdgeId = internalBstObject[key]["vertexClassNumber"]+BACK_EDGE_CONST;
          state["el"][parentChildEdgeId] = {};

          state["el"][parentChildEdgeId]["vertexA"] = internalBstObject[internalBstObject[key]["rightChild"]]["vertexClassNumber"];
          state["el"][parentChildEdgeId]["vertexB"] = internalBstObject[key]["vertexClassNumber"];
          state["el"][parentChildEdgeId]["type"] = EDGE_TYPE_DE;
          state["el"][parentChildEdgeId]["weight"] = 1;
          state["el"][parentChildEdgeId]["state"] = EDGE_DEFAULT;
          state["el"][parentChildEdgeId]["animateHighlighted"] = false;
      }
      //end

    }

    for(key in vertexTraversed){
      vertexClass = internalBstObject[key]["vertexClassNumber"];
      state["vl"][vertexClass]["state"] = VERTEX_TRAVERSED;
    }

    for(key in edgeTraversed){
      state["el"][key]["state"] = EDGE_TRAVERSED;
    }

    return state;
  }


//modified recalculateposition
  function recalculatePosition(){
    updatePosition(internalBst["root"]);


    function updatePosition(currentVertex){
      if(currentVertex == null) return;
      //relayout vertical
      if(activeStatus=="stack"){
        if(currentVertex == internalBst["root"]) internalBst[currentVertex]["cy"] = 20;
        else{
          var parentVertex = internalBst[currentVertex]["parent"]
            internalBst[currentVertex]["cy"] = internalBst[parentVertex]["cy"] + 70;
        }
          internalBst[currentVertex]["cx"] = 350;
      }
      //relayout horizontal
      else{
        if(currentVertex == internalBst["root"]) internalBst[currentVertex]["cx"] = 20;
        else{
          var parentVertex = internalBst[currentVertex]["parent"];
            internalBst[currentVertex]["cx"] = internalBst[parentVertex]["cx"] + 70;
        }
          internalBst[currentVertex]["cy"] = 50;
      }

      updatePosition(internalBst[currentVertex]["rightChild"]);
    }
  }
  
  function populatePseudocode(act) {
    switch (act) {
      case 0: // Insert
        document.getElementById('code1').innerHTML = 'Vertex temp1 = head';
        document.getElementById('code2').innerHTML = 'while (--k!=0)';
        document.getElementById('code3').innerHTML = '&nbsp&nbsptemp1 = temp1.next';
        document.getElementById('code4').innerHTML = 'Vertex temp2 = temp1.next';
        document.getElementById('code5').innerHTML = 'Vertex newVertex = new Vertex(input)';
        if((activeStatus == "doublylist")||(activeStatus == "deque")){
           document.getElementById('code6').innerHTML = 'newVertex.next = temp2 , temp2.prev = newVertex';
           document.getElementById('code7').innerHTML = 'temp1.next = newVertex , newVertex.prev = temp1';
         }
         else{
          document.getElementById('code6').innerHTML = 'temp1.next = newVertex';
          document.getElementById('code7').innerHTML = 'newVertex.next = temp2';
         }
        
        break;
    case 1: // insertHead
        document.getElementById('code1').innerHTML = 'Vertex temp = new Vertex(input)';
        document.getElementById('code2').innerHTML = 'temp.next = head';
        if((activeStatus == "doublylist")||(activeStatus == "deque")){
           document.getElementById('code3').innerHTML = 'temp.next.prev = temp';
           document.getElementById('code4').innerHTML = 'head = temp';
           document.getElementById('code5').innerHTML = '';
         }
         else if(amountVertex==1){
          document.getElementById('code3').innerHTML = 'head = temp';
          document.getElementById('code4').innerHTML = 'tail = head';
          document.getElementById('code5').innerHTML = '';
         }
         else{
          document.getElementById('code3').innerHTML = 'head = temp';
          document.getElementById('code4').innerHTML = '';
          document.getElementById('code5').innerHTML = '';
         }
        
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
    case 2: // insertTail
        document.getElementById('code1').innerHTML = 'Vertex temp = new Vertex(input)';
        document.getElementById('code2').innerHTML = 'tail.next = temp';
        if((activeStatus == "doublylist")||(activeStatus == "deque")){
           document.getElementById('code3').innerHTML = 'temp.prev = tail';
           document.getElementById('code4').innerHTML = 'tail = temp';
         }
         else{
          document.getElementById('code3').innerHTML = 'tail = temp';
          document.getElementById('code4').innerHTML = '';
         }
        document.getElementById('code5').innerHTML = '';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
    case 3: // peek
        document.getElementById('code1').innerHTML = 'return head.data';
        document.getElementById('code2').innerHTML = '';
        document.getElementById('code3').innerHTML = '';
        document.getElementById('code4').innerHTML = '';
        document.getElementById('code5').innerHTML = '';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
    case 4: // search
        document.getElementById('code1').innerHTML = 'temp = head , index = 0';
        document.getElementById('code2').innerHTML = 'while (temp.data != input)';
        document.getElementById('code3').innerHTML = '&nbsp&nbsptemp = temp.next , index++';
        document.getElementById('code4').innerHTML = '&nbsp&nbspif temp == null';
        document.getElementById('code5').innerHTML = '&nbsp&nbsp&nbsp&nbspreturn -1';
        document.getElementById('code6').innerHTML = 'return index;';
        document.getElementById('code7').innerHTML = '';
        break;
    case 5: // remove HEAD
        document.getElementById('code1').innerHTML = 'temp = head';
        document.getElementById('code2').innerHTML = 'head = head.next';
        document.getElementById('code3').innerHTML = 'delete temp';
        if((activeStatus == "doublylist")||(activeStatus == "deque")){
           document.getElementById('code4').innerHTML = 'head.prev = null';
         }
         else{
            document.getElementById('code4').innerHTML = '';
          }
        document.getElementById('code5').innerHTML = '';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
    case 6: // remove TAIL
        document.getElementById('code1').innerHTML = 'Vertex prev = head';
        document.getElementById('code2').innerHTML = 'temp = head.next';
        document.getElementById('code3').innerHTML = 'while (temp.next!=null)';
        document.getElementById('code4').innerHTML = '&nbsp&nbsptemp = temp.next , prev = prev.next';
        document.getElementById('code5').innerHTML = 'prev.next = null';
        document.getElementById('code6').innerHTML = 'delete temp';
        document.getElementById('code7').innerHTML = 'tail = prev';   
        break;
    case 7: // remove kth
        document.getElementById('code1').innerHTML = 'Vertex temp1 = head';
        document.getElementById('code2').innerHTML = 'while (--k!=0)';
        document.getElementById('code3').innerHTML = '&nbsp&nbsptemp1 = temp1.next';
        document.getElementById('code4').innerHTML = 'Vertex temp2 = temp1.next';
        if((activeStatus == "doublylist")||(activeStatus == "deque")){
          document.getElementById('code5').innerHTML = 'Vertex temp3 = temp2.next';
          document.getElementById('code6').innerHTML = 'delete temp2';
          document.getElementById('code7').innerHTML = 'temp1.next = temp3 , temp3.prev = temp1';
        }
        else{
          document.getElementById('code5').innerHTML = 'temp1.next = temp1.next.next';
          document.getElementById('code6').innerHTML = 'delete temp';
          document.getElementById('code7').innerHTML = '';
        }
        break;
    case 8: //remove tail doubly list
        document.getElementById('code1').innerHTML = 'temp = tail';
        document.getElementById('code2').innerHTML = 'tail = tail.prev';
        document.getElementById('code3').innerHTML = 'tail.next = null';
        document.getElementById('code4').innerHTML = 'delete temp';
        document.getElementById('code5').innerHTML = '';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
    case 9: //peek back
        document.getElementById('code1').innerHTML = 'return tail.data';
        document.getElementById('code2').innerHTML = '';
        document.getElementById('code3').innerHTML = '';
        document.getElementById('code4').innerHTML = '';
        document.getElementById('code5').innerHTML = '';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
    }

  }
}