var mode="exploration";
var codetraceColor = 'white';

//codetrace highlight
function highlightLine(lineNumbers) {  /* lineNumbers can be an array or a single number. Yay overloading! */
	$('#codetrace p').css('background-color', colourTheThird).css('color',codetraceColor);
	if (lineNumbers instanceof Array) {
		for(var i=0; i<lineNumbers.length; i++) {
			if(lineNumbers[i] != 0) {
				$('#code'+lineNumbers[i]).css('background-color', 'black').css('color','white');
			}
		}
	} else {
		$('#code'+lineNumbers).css('background-color', 'black').css('color','white');
	}
}

var isPlaying = false;
//Opening and closing panels
var isActionsOpen = true;
var isStatusOpen = false;
var isCodetraceOpen = false;

//vars actionsWidth and statusCodetraceWidth must be defined in the specific vizname_actions.js file
function showActionsPanel() {
	if(!isActionsOpen) {
		$('#actions-hide img').removeClass('rotateLeft').addClass('rotateRight');
		$('#actions').animate({
			width: "+="+actionsWidth,
		});
		isActionsOpen = true;
	}
}
function hideActionsPanel() {
	if(isActionsOpen) {
		$('#actions-hide img').removeClass('rotateRight').addClass('rotateLeft');
		$('#actions').animate({
			width: "-="+actionsWidth,
		});
		isActionsOpen = false;
	}
}
function showStatusPanel() {
	if(!isStatusOpen) {
		$('#status-hide img').removeClass('rotateLeft').addClass('rotateRight');
		$('#current-action').show();
		$('#status').animate({
			width: "+="+statusCodetraceWidth,
		});
		isStatusOpen = true;
	}
}
function hideStatusPanel() {
	if(isStatusOpen) {
		$('#status-hide img').removeClass('rotateRight').addClass('rotateLeft');
		$('#current-action').hide();
		$('#status').animate({
			width: "-="+statusCodetraceWidth,
		});
		isStatusOpen = false;
	}
}
function showCodetracePanel() {
	if(!isCodetraceOpen) {
		$('#codetrace-hide img').removeClass('rotateLeft').addClass('rotateRight');
		$('#codetrace').animate({
			width: "+="+statusCodetraceWidth,
		});
		isCodetraceOpen = true;
	}
}
function hideCodetracePanel() {
	if(isCodetraceOpen) {
		$('#codetrace-hide img').removeClass('rotateRight').addClass('rotateLeft');
		$('#codetrace').animate({
			width: "-="+statusCodetraceWidth,
		});
		isCodetraceOpen = false;
	}
}
function triggerRightPanels() {
	hideEntireActionsPanel();
	showStatusPanel();
	showCodetracePanel();
}

function extractQnGraph(graph) {
	var vList = graph.internalAdjList;
	var eList = graph.internalEdgeList;
	for(var key in vList) {
		var temp;
		var v = vList[key];
		temp = v.cxPercentage;
		v.cxPercentage = v.cx;
		v.cx = (temp/100)*MAIN_SVG_WIDTH;
		temp = v.cyPercentage;
		v.cyPercentage = v.cy;
		v.cy = (temp/100)*MAIN_SVG_HEIGHT;
	}
	return graph;
}

$( document ).ready(function() {
	var actionsHeight = ($('#actions p').length)*27 + 10;
	$('#actions').css('height', actionsHeight);
	$('#actions').css('width', actionsWidth);
	var actionsHideTop = Math.floor((actionsHeight - 16)/2);
	var actionsHideBottom = (actionsHeight - 16) - actionsHideTop;
	$('#actions-hide').css('padding-top', actionsHideTop);
	$('#actions-hide').css('padding-bottom', actionsHideBottom);
	
	$('#current-action').hide();
	$('#actions-hide img').addClass('rotateRight');
	
	//surpriseColour stuff
	$('.tutorial-next').css("background-color", surpriseColour);
	if(surpriseColour == "#fec515" || surpriseColour == '#a7d41e') {
		$('.tutorial-next').css("color", "black");
		$('.tutorial-next img').attr("src", "img/arrow_black_right.png");
	}
	$('#progress-bar .ui-slider-range').css("background-color", surpriseColour);
	
	$('#actions').css("background-color", colourTheSecond);
	$('#actions-hide').css("background-color", colourTheSecond);
	$('.action-menu-pullout').css('left', actionsWidth+43+'px');
	$('.action-menu-pullout').children().css('float','left');
	$('.coloured-menu-option').css("background-color", colourTheSecond).css('color','white');
	if(colourTheSecond == '#fec515' || colourTheSecond == '#a7d41e') {
		$('#actions p').css('color', 'black');
		$('#actions p').hover(function() { $(this).css('color', 'white');}, function() {$(this).css('color', 'black');});
		$('.coloured-menu-option').css('color', 'black');
		$('.coloured-menu-option').hover(function() { $(this).css('color', 'white');}, function() {$(this).css('color', 'black');});
		$('#actions-hide img').attr('src', 'img/arrow_black_right.png');
	}
	
	$('#codetrace').css("background-color", colourTheThird);
	$('#codetrace-hide').css("background-color", colourTheThird);
	if(colourTheThird == '#fec515' || colourTheThird == '#a7d41e') {
		$('#codetrace').css('color', 'black');
		$('#codetrace-hide img').attr('src', 'img/arrow_black_right.png');
		codetraceColor = 'black';
	}
	
	$('#status').css("background-color", colourTheFourth);
	$('#status-hide').css("background-color", colourTheFourth);
	if(colourTheFourth == '#fec515' || colourTheFourth == '#a7d41e') {
		$('#status').css('color', 'black');
		$('#status-hide img').attr('src', 'img/arrow_black_right.png');
	}
	
	//mmode menu
	$('#mode-button').click(function() {
		$('#other-modes').toggle();
	});
	$('#mode-menu').hover(function() {
		$('#other-modes').toggle();
	});
	
	$('#mode-menu a').hover(function() {
		$(this).css("background", surpriseColour);
	}, function() {
		$(this).css("background", "black");
	});
	
	$('#mode-menu a').click(function() {
		var currentMode = $('#mode-button').html().split("<")[0];
		var newMode = $(this).html();
		
		$(this).html(currentMode);
		$('#mode-button').html(newMode + '<img src="img/arrow_white.png"/>');
		
		if(newMode=="Exploration Mode") {
			mode = "exploration";
			$('#status-hide').show();
			$('#codetrace-hide').show();
			$('#actions-hide').show();
			$('#status').show();
			$('#codetrace').show();
			$('#actions').show();
			$('.tutorial-dialog').hide();
			hideStatusPanel();
			hideCodetracePanel();
			showActionsPanel();
		/*} else if(newMode=="Training Mode") {
			mode = "training";
			$('#status').hide();
			$('#codetrace').hide();
			$('#actions').hide();
			$('#status-hide').hide();
			$('#codetrace-hide').hide();
			$('#actions-hide').hide();
			*/
		} else if (newMode=="Tutorial Mode") {
			mode = "tutorial";
			$('#status-hide').show();
			$('#codetrace-hide').show();
			$('#actions-hide').show();
			$('#current-action').html("");
			$('#status').show();
			$('#codetrace').show();
			$('#actions').show();
			if(isPlaying) {	stop(); }
			hideEntireActionsPanel();
			hideStatusPanel();
			hideCodetracePanel();
			$('.tutorial-dialog').first().fadeIn(500);
		}
	});
	
	//arrow buttons to show/hide panels	
	$('#status-hide').click(function() {
		if(isStatusOpen) {
			hideStatusPanel();
		} else {
			showStatusPanel();
		}
	});
	$('#codetrace-hide').click(function() {
		if(isCodetraceOpen) {
			hideCodetracePanel();
		} else {
			showCodetracePanel();
		}
	});
	$('#actions-hide').click(function() {
		if(isActionsOpen) {
			hideEntireActionsPanel(); //must define hideEntireActionsPanel() function in vizname_actions.js file
		} else {
			showActionsPanel();
		}
	});
	
	//tutorial mode
	$('.tutorial-dialog .tutorial-next').click(function() {
		var vizname = $(this).parent().attr('id').split('-')[0];
		var nextNo = parseInt($(this).parent().attr('id').slice(-1))+1;
		var nextId = vizname+'-tutorial-'+nextNo;
		$(this).parent().fadeOut(500, function() {
			$('#'+nextId).fadeIn(500);
		});
	});
	
});