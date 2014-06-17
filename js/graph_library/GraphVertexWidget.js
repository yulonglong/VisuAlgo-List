// Defines ONE vertex object
// Set styles in properties.js and the CSS files!!!

var GraphVertexWidget = function(cx, cy, vertexShape, vertexText, vertexClassNumber){
  var self = this;
  var defaultAnimationDuration = 250; // millisecond

  var innerVertex;
  var outerVertex;
  var text;

  var textYaxisOffset = graphVertexProperties["text"]["font-size"]/3;

  var attributeList = {
    "innerVertex": {
      "class": null,
      "cx": null,
      "cy": null,
      "x": null,
      "y": null,
      "fill": null,
      "r": null,
      "width": null,
      "height": null,
      "stroke": null,
      "stroke-width": null
    },

    "outerVertex":{
      "class": null,
      "cx": null,
      "cy": null,
      "x": null,
      "y": null,
      "fill": null,
      "r": null,
      "width": null,
      "height": null,
      "stroke": null,
      "stroke-width": null
    },

    "text":{
      "class": null,
      "x": null,
      "y": null,
      "fill": null,
      "font-family": null,
      "font-weight": null,
      "font-size": null,
      "text-anchor": null,
      "text": null
    }
  }

  // JS object with IDs of all edges connected to this vertex as the key and boolean as the value
  // Everytime an edge is added, the value is set to true
  // Everytime an edge is deleted, the value is set to null
  var edgeList = {};

  init();

  this.redraw = function(duration){
    draw(duration);
  }

  // Specifies the duration of the animation in milliseconds
  // If unspecified or illegal value, default duration applies. 
  this.showVertex = function(){
    attributeList["outerVertex"]["r"] = graphVertexProperties["outerVertex"]["r"];
    attributeList["outerVertex"]["width"] = graphVertexProperties["outerVertex"]["width"];
    attributeList["outerVertex"]["height"] = graphVertexProperties["outerVertex"]["height"];
    attributeList["outerVertex"]["stroke-width"] = graphVertexProperties["outerVertex"]["stroke-width"];

    attributeList["innerVertex"]["r"] = graphVertexProperties["innerVertex"]["r"];
    attributeList["innerVertex"]["width"] = graphVertexProperties["innerVertex"]["width"];
    attributeList["innerVertex"]["height"] = graphVertexProperties["innerVertex"]["height"];
    attributeList["innerVertex"]["stroke-width"] = graphVertexProperties["innerVertex"]["stroke-width"];

    attributeList["text"]["font-size"] = graphVertexProperties["text"]["font-size"];
    if (vertexShape == "rect_long") {
      attributeList["outerVertex"]["width"] = 200;  
      attributeList["innerVertex"]["width"] = 198;
    } else if (vertexShape == "rect") {
      attributeList["outerVertex"]["width"] = 80;  
      attributeList["innerVertex"]["width"] = 78;
    }

  }

  this.hideVertex = function(){
    attributeList["outerVertex"]["r"] = 0;
    attributeList["outerVertex"]["width"] = 0;
    attributeList["outerVertex"]["height"] = 0;
    attributeList["outerVertex"]["stroke-width"] = 0;

    attributeList["innerVertex"]["r"] = 0;
    attributeList["innerVertex"]["width"] = 0;
    attributeList["innerVertex"]["height"] = 0;
    attributeList["innerVertex"]["stroke-width"] = 0;

    attributeList["text"]["font-size"] = 0;
  }

  this.moveVertex = function(cx, cy){
    attributeList["outerVertex"]["cx"] = cx;
    attributeList["outerVertex"]["cy"] = cy;
    attributeList["outerVertex"]["x"] = cx-graphVertexProperties["outerVertex"]["width"]/2;
    attributeList["outerVertex"]["y"] = cy-graphVertexProperties["outerVertex"]["height"]/2;

    attributeList["innerVertex"]["cx"] = cx;
    attributeList["innerVertex"]["cy"] = cy;
    attributeList["innerVertex"]["x"] = cx-graphVertexProperties["innerVertex"]["width"]/2;
    attributeList["innerVertex"]["y"] = cy-graphVertexProperties["innerVertex"]["height"]/2;

    attributeList["text"]["x"] = cx;
    attributeList["text"]["y"] = cy + textYaxisOffset;

    var key;

    for(key in edgeList){
      edgeList[key].refreshPath();
    }
  }

  this.changeText = function(newVertexText){
    vertexText = newVertexText;
    attributeList["text"]["text"] = newVertexText;
  }

  this.changeTextFontSize = function(newFontSize){
    if(newTextSize == null || isNaN(newTextSize)) return;
    attributeList["text"]["font-size"] = newTextSize;
  }

  this.changeRadius = function(newRadiusInner, newRadiusOuter){
    if(newRadiusInner == null || isNaN(newRadiusInner)) return;
    attributeList["innerVertex"]["r"] = newRadiusInner;
    if(newRadiusOuter == null || isNaN(newRadiusOuter)) return;
    attributeList["outerVertex"]["r"] = newRadiusOuter;
  }

  this.changeWidth = function(newWidthInner, newWidthOuter){
    if(newWidthInner == null || isNaN(newWidthInner)) return;
    attributeList["innerVertex"]["width"] = newWidthInner;
    if(newWidthOuter == null || isNaN(newWidthOuter)) return;
    attributeList["outerVertex"]["width"] = newWidthOuter;
  }

  this.changeHeight = function(newHeightInner, newHeightOuter){
    if(newHeightInner == null || isNaN(newHeightInner)) return;
    attributeList["innerVertex"]["height"] = newHeightInner;
    if(newHeightOuter == null || isNaN(newHeightOuter)) return;
    attributeList["outerVertex"]["height"] = newHeightOuter;
  }

  this.changeStrokeWidth = function(newStrokeWidthInner, newStrokeWidthOuter){
    if(newStrokeWidthInner == null || isNaN(newStrokeWidthInner)) return;
    attributeList["innerVertex"]["stroke-width"] = newStrokeWidthInner;
    if(newStrokeWidthOuter == null || isNaN(newStrokeWidthOuter)) return;
    attributeList["outerVertex"]["stroke-width"] = newStrokeWidthOuter;
  }

  // Removes the vertex (no animation)
  // If you want animation, hide & redraw the vertex first, then call this function
  this.removeVertex = function(){
    outerVertex.remove();
    innerVertex.remove();
    text.remove();
  }

  // DEPRECATED
  /*
  this.highlightVertex = function(){
    var key;

    for(key in graphVertexProperties["innerVertex"]["highlighted"]){
      attributeList["innerVertex"][key] = graphVertexProperties["innerVertex"]["highlighted"][key];
    }

    for(key in graphVertexProperties["outerVertex"]["highlighted"]){
      attributeList["outerVertex"][key] = graphVertexProperties["outerVertex"]["highlighted"][key];
    }

    for(key in graphVertexProperties["text"]["highlighted"]){
      attributeList["text"][key] = graphVertexProperties["text"]["highlighted"][key];
    }
  }

  this.traversedVertex = function(){
    var key;

    for(key in graphVertexProperties["innerVertex"]["traversed"]){
      attributeList["innerVertex"][key] = graphVertexProperties["innerVertex"]["traversed"][key];
    }

    for(key in graphVertexProperties["outerVertex"]["traversed"]){
      attributeList["outerVertex"][key] = graphVertexProperties["outerVertex"]["traversed"][key];
    }

    for(key in graphVertexProperties["text"]["traversed"]){
      attributeList["text"][key] = graphVertexProperties["text"]["traversed"][key];
    }
  }

  this.resultVertex = function(){
    var key;

    for(key in graphVertexProperties["innerVertex"]["result"]){
      attributeList["innerVertex"][key] = graphVertexProperties["innerVertex"]["result"][key];
    }

    for(key in graphVertexProperties["outerVertex"]["result"]){
      attributeList["outerVertex"][key] = graphVertexProperties["outerVertex"]["result"][key];
    }

    for(key in graphVertexProperties["text"]["result"]){
      attributeList["text"][key] = graphVertexProperties["text"]["result"][key];
    }
  }

  this.defaultVertex = function(){
    var key;

    for(key in graphVertexProperties["innerVertex"]["default"]){
      attributeList["innerVertex"][key] = graphVertexProperties["innerVertex"]["default"][key];
    }

    for(key in graphVertexProperties["outerVertex"]["default"]){
      attributeList["outerVertex"][key] = graphVertexProperties["outerVertex"]["default"][key];
    }

    for(key in graphVertexProperties["text"]["default"]){
      attributeList["text"][key] = graphVertexProperties["text"]["default"][key];
    }
  }
  */

  this.stateVertex = function(stateName){
    var key;

    for(key in graphVertexProperties["innerVertex"][stateName]){
      attributeList["innerVertex"][key] = graphVertexProperties["innerVertex"][stateName][key];
    }

    for(key in graphVertexProperties["outerVertex"][stateName]){
      attributeList["outerVertex"][key] = graphVertexProperties["outerVertex"][stateName][key];
    }

    for(key in graphVertexProperties["text"][stateName]){
      attributeList["text"][key] = graphVertexProperties["text"][stateName][key];
    }
  }

  this.getAttributes = function(){
    return deepCopy(attributeList);
  }

  this.getClassNumber = function(){
    return vertexClassNumber;
  }

  this.addEdge = function(graphEdge){
    edgeList[graphEdge.getAttributes()["id"]] = graphEdge;
  }

  this.removeEdge = function(graphEdge){
    if(edgeList[graphEdge.getAttributes()["id"]] == null || edgeList[graphEdge.getAttributes()["id"]] == undefined) return;

    delete edgeList[graphEdge.getAttributes()["id"]];
  }

  this.getEdge = function(){
    var reply = [];
    var key;

    for(key in edgeList){
      reply.push(edgeList[key]);
    }

    return reply;
  }

  // this.connectVertex = function(secondVertex, directed, weight){
  //   self.addEdge(new GraphEdgeWidget(self,secondVertex,directed,weight));
  // }

  // Initialize vertex and draw them, but the object will not be visible due to the radius of the vertex circle set to 0
  function init(){
    var tmp_vertexShape = vertexShape;
    if (vertexShape == "rect_long") tmp_vertexShape = "rect";
    outerVertex = vertexSvg.append(tmp_vertexShape);
    innerVertex = vertexSvg.append(tmp_vertexShape);
    text = vertexTextSvg.append("text");

    attributeList["innerVertex"]["class"] = "v" + vertexClassNumber
    attributeList["innerVertex"]["cx"] = cx;
    attributeList["innerVertex"]["cy"] = cy;
    attributeList["innerVertex"]["x"] = cx-graphVertexProperties["innerVertex"]["width"]/2;
    attributeList["innerVertex"]["y"] = cy-graphVertexProperties["innerVertex"]["height"]/2;
    attributeList["innerVertex"]["fill"] = graphVertexProperties["innerVertex"]["default"]["fill"];
    attributeList["innerVertex"]["r"] = 0;
    attributeList["innerVertex"]["width"] = 0;
    attributeList["innerVertex"]["height"] = 0;
    attributeList["innerVertex"]["stroke"] = graphVertexProperties["innerVertex"]["default"]["stroke"];
    attributeList["innerVertex"]["stroke-width"] = 0;

    attributeList["outerVertex"]["class"] = "v" + vertexClassNumber
    attributeList["outerVertex"]["cx"] = cx;
    attributeList["outerVertex"]["cy"] = cy;
    attributeList["outerVertex"]["x"] = cx-graphVertexProperties["outerVertex"]["width"]/2;
    attributeList["outerVertex"]["y"] = cy-graphVertexProperties["outerVertex"]["height"]/2;
    attributeList["outerVertex"]["fill"] = graphVertexProperties["outerVertex"]["default"]["fill"];
    attributeList["outerVertex"]["r"] = 0;
    attributeList["innerVertex"]["width"] = 0;
    attributeList["innerVertex"]["height"] = 0;
    attributeList["outerVertex"]["stroke"] = graphVertexProperties["outerVertex"]["default"]["stroke"];
    attributeList["outerVertex"]["stroke-width"] = 0;

    attributeList["text"]["class"] = "v" + vertexClassNumber
    attributeList["text"]["x"] = cx;
    attributeList["text"]["y"] = cy + textYaxisOffset;
    attributeList["text"]["fill"] = graphVertexProperties["text"]["default"]["fill"];
    attributeList["text"]["font-family"] = graphVertexProperties["text"]["default"]["font-family"];
    attributeList["text"]["font-size"] = 0;
    attributeList["text"]["font-weight"] = graphVertexProperties["text"]["default"]["font-weight"];
    attributeList["text"]["text-anchor"] = graphVertexProperties["text"]["default"]["text-anchor"];
    if (vertexShape == "rect_long") {
      attributeList["text"]["text-anchor"] = "left";      
    }
    attributeList["text"]["text"] = vertexText;

    innerVertex.attr("class", attributeList["innerVertex"]["class"]);
    outerVertex.attr("class", attributeList["outerVertex"]["class"]);
    text.attr("class", attributeList["text"]["class"]);

    innerVertex.attr("cx", attributeList["innerVertex"]["cx"])
              .attr("cy", attributeList["innerVertex"]["cy"])
              .attr("x", attributeList["innerVertex"]["x"])
              .attr("y", attributeList["innerVertex"]["y"])
              .attr("fill", attributeList["innerVertex"]["fill"])
              .attr("r", attributeList["innerVertex"]["r"])
              .attr("width", attributeList["innerVertex"]["width"])
              .attr("height", attributeList["innerVertex"]["height"])
              .attr("stroke", attributeList["innerVertex"]["stroke"])
              .attr("stroke-width", attributeList["innerVertex"]["stroke-width"]);

    outerVertex.attr("cx", attributeList["outerVertex"]["cx"])
              .attr("cy", attributeList["outerVertex"]["cy"])
              .attr("x", attributeList["outerVertex"]["x"])
              .attr("y", attributeList["outerVertex"]["y"])
              .attr("fill", attributeList["outerVertex"]["fill"])
              .attr("r", attributeList["outerVertex"]["r"])
              .attr("width", attributeList["outerVertex"]["width"])
              .attr("height", attributeList["outerVertex"]["height"])
              .attr("stroke", attributeList["outerVertex"]["stroke"])
              .attr("stroke-width", attributeList["outerVertex"]["stroke-width"]);

    text.attr("x", attributeList["text"]["x"])
        .attr("y", attributeList["text"]["y"])
        .attr("fill", attributeList["text"]["fill"])
        .attr("font-family", attributeList["text"]["font-family"])
        .attr("font-size", attributeList["text"]["font-size"])
        .attr("font-weight", attributeList["text"]["font-weight"])
        .attr("text-anchor", attributeList["text"]["text-anchor"])
        .text(function(){
          return attributeList["text"]["text"];
        });
  }

  // Refreshes the vertex image
  // "dur" specifies the duration of the animation in milliseconds
  // If unspecified or illegal value, default duration applies. 
  function draw(dur){
    if(dur == null || isNaN(dur)) dur = defaultAnimationDuration;
    if(dur <= 0) dur = 1;

    innerVertex.transition()
              .duration(dur)
              .attr("cx", attributeList["innerVertex"]["cx"])
              .attr("cy", attributeList["innerVertex"]["cy"])
              .attr("x", attributeList["innerVertex"]["x"])
              .attr("y", attributeList["innerVertex"]["y"])
              .attr("fill", attributeList["innerVertex"]["fill"])
              .attr("r", attributeList["innerVertex"]["r"])
              .attr("width", attributeList["innerVertex"]["width"])
              .attr("height", attributeList["innerVertex"]["height"])
              .attr("stroke", attributeList["innerVertex"]["stroke"])
              .attr("stroke-width", attributeList["innerVertex"]["stroke-width"]);

    outerVertex.transition()
              .duration(dur)
              .attr("cx", attributeList["outerVertex"]["cx"])
              .attr("cy", attributeList["outerVertex"]["cy"])
              .attr("x", attributeList["outerVertex"]["x"])
              .attr("y", attributeList["outerVertex"]["y"])
              .attr("fill", attributeList["outerVertex"]["fill"])
              .attr("r", attributeList["outerVertex"]["r"])
              .attr("width", attributeList["outerVertex"]["width"])
              .attr("height", attributeList["outerVertex"]["height"])
              .attr("stroke", attributeList["outerVertex"]["stroke"])
              .attr("stroke-width", attributeList["outerVertex"]["stroke-width"]);

    text.transition()
        .duration(dur)
        .attr("x", attributeList["text"]["x"])
        .attr("y", attributeList["text"]["y"])
        .attr("fill", attributeList["text"]["fill"])
        .attr("font-family", attributeList["text"]["font-family"])
        .attr("font-size", attributeList["text"]["font-size"])
        .attr("font-weight", attributeList["text"]["font-weight"])
        .attr("text-anchor", attributeList["text"]["text-anchor"])
        .text(function(){
          return attributeList["text"]["text"];
      });
  }
}