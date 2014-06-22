//actions panel stuff
var actionsWidth = 150;
var statusCodetraceWidth = 420;

var isCreateOpen = false;
var isSearchOpen = false;
var isInsertOpen = false;
var isRemoveOpen = false;
var isSuccOpen = false;
var isPredOpen = false;
var isInorderOpen = false;

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
function openSucc() {
	if(!isSuccOpen) {
		$('.successor').fadeIn('fast');
		isSuccOpen = true;
	}
}
function closeSucc() {
	if(isSuccOpen) {
		$('.successor').fadeOut('fast');
		$('#succ-err').html("");
		isSuccOpen = false;
	}
}
function openPred() {
	if(!isPredOpen) {
		$('.predecessor').fadeIn('fast');
		isPredOpen = true;
	}
}
function closePred() {
	if(isPredOpen) {
		$('.predecessor').fadeOut('fast');
		$('#pred-err').html("");
		isPredOpen = false;
	}
}
function openInorder() {
	if(!isInorderOpen) {
		$('.inorder').fadeIn('fast');
		isInorderOpen = true;
	}
}
function closeInorder() {
	if(isInorderOpen) {
		$('.inorder').fadeOut('fast');
		$('#inorder-err').html("");
		isInorderOpen = false;
	}
}

//
function hideEntireActionsPanel() {
	closeCreate();
	closeSearch();
	closeInsert();
	closeRemove();
	closeSucc();
	closePred();
	closeInorder();
	hideActionsPanel();
}

$( document ).ready(function() {
	
	//action pullouts
	$('#create').click(function() {
		closeSearch();
		closeInsert();
		closeRemove();
		closeSucc();
		closePred();
		closeInorder();
		openCreate();
	});
	$('#search').click(function() {
		closeCreate();
		closeInsert();
		closeRemove();
		closeSucc();
		closePred();
		closeInorder();
		openSearch();
	});
	$('#insert').click(function() {
		closeCreate();
		closeSearch();
		closeRemove();
		closeSucc();
		closePred();
		closeInorder();
		openInsert();
	});
	$('#remove').click(function() {
		closeCreate();
		closeSearch();
		closeInsert();
		closeSucc();
		closePred();
		closeInorder();
		openRemove();
	});
	$('#inorder').click(function() {
		closeCreate();
		closeSearch();
		closeInsert();
		closeRemove();
		closeSucc();
		closePred();
		openInorder();
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