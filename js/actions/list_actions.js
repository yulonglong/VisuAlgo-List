//@author Steven Kester Yuwono
//actions panel related files for List VisuAlgo
var actionsWidth = 150;
var statusCodetraceWidth = 420;

var isCreateOpen = false;
var isSearchOpen = false;
var isInsertOpen = false;
var isRemoveOpen = false;

function openCreate() {
	$(".create").css("bottom","146px");
	$('#createfixedsize-input').hide();
	$('#createuserdefined-input').hide();
	if(!isCreateOpen) {
		$('.create').fadeIn('fast');
		isCreateOpen = true;
	}
}
function closeCreate() {
	if(isCreateOpen) {
		$('.create').fadeOut('fast');
		$('#create-err').html("");
		isCreateOpen = false;
	}
}
function openSearch() {
	if(!isSearchOpen) {
		$('.search').fadeIn('fast');
		isSearchOpen = true;
	}
}
function closeSearch() {
	if(isSearchOpen) {
		$('.search').fadeOut('fast');
		$('#search-err').html("");
		isSearchOpen = false;
	}
}
function openInsert() {
	$(".insert").css("bottom","92px");
	$('#insertkth-input').hide();
	$('#inserthead-input').hide();
	$('#inserttail-input').hide();
	if(!isInsertOpen) {
		$('.insert').fadeIn('fast');
		isInsertOpen = true;
	}
}
function closeInsert() {
	if(isInsertOpen) {
		$('.insert').fadeOut('fast');
		$('#insert-err').html("");
		isInsertOpen = false;
	}
}
function openRemove() {
	$(".remove").css("bottom","65px");
	$('#removekth-input').hide();
	if(!isRemoveOpen) {
		$('.remove').fadeIn('fast');
		isRemoveOpen = true;
	}
}
function closeRemove() {
	if(isRemoveOpen) {
		$('.remove').fadeOut('fast');
		$('#remove-err').html("");
		isRemoveOpen = false;
	}
}

//
function hideEntireActionsPanel() {
	closeCreate();
	closeSearch();
	closeInsert();
	closeRemove();
	hideActionsPanel();
}

$( document ).ready(function() {
	
	//action pullouts
	$('#create').click(function() {
		closeSearch();
		closeInsert();
		closeRemove();
		openCreate();
	});
	$('#search').click(function() {
		closeCreate();
		closeInsert();
		closeRemove();
		openSearch();
	});
	$('#insert').click(function() {
		closeCreate();
		closeSearch();
		closeRemove();
		openInsert();
	});
	$('#remove').click(function() {
		closeCreate();
		closeSearch();
		closeInsert();
		openRemove();
	});
	
	
	//tutorial mode
	$('#list-tutorial-2 .tutorial-next').click(function() {
		showActionsPanel();
	});
	$('#list-tutorial-3 .tutorial-next').click(function() {
		hideEntireActionsPanel();
	});
	$('#list-tutorial-4 .tutorial-next').click(function() {
		showStatusPanel();
	});
	$('#list-tutorial-5 .tutorial-next').click(function() {
		hideStatusPanel();
		showCodetracePanel();
	});
	$('#list-tutorial-6 .tutorial-next').click(function() {
		hideCodetracePanel();
	});
});