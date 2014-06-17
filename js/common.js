//surprise colour!
//Referenced to in  home.js and viz.js also
var colourArray = ["#52bc69", "#ed5a7d", "#2ebbd1", "#d9513c", "#fec515", "#4b65ba", "#ff8a27", "#a7d41e"];
					//green, pink, blue, red, yellow, indigo, orange, lime
//var colourArray = ["#15a346", "#ed5a7d", "#23b1bf", "#ce5226", "#deb003", "#574882", "#ff8a27", "#a7d41e"];

function getColours() {
	var generatedColours = new Array();
	while(generatedColours.length < 4) {
		var n = (Math.floor(Math.random()*colourArray.length));
		if($.inArray(n, generatedColours) == -1) {
			generatedColours.push(n);
		}
	}
	return generatedColours;
}
var generatedColours = getColours();
var surpriseColour = colourArray[generatedColours[0]];
var colourTheSecond = colourArray[generatedColours[1]];
var colourTheThird = colourArray[generatedColours[2]];
var colourTheFourth = colourArray[generatedColours[3]];

$( document ).ready(function() {
	
	$('#about').html('<h4>About the project</h4><img class="close-overlay" src="img/cross_white.png" /><div class="content"><p><strong><span style="line-height: 200%;">Motivation</span></strong><br/>VisualGo was conceptualised in 2011 by Dr Steven Halim as a tool to help his students better understand data structures and algorithms, by allowing them to learn the basics on their own and at their own pace. Together with two of his students from the National University of Singapore, a series of visualisations were developed and consolidated, from simple sorting algorithms to complex graph data structures.</p><p>Though specifically designed for the use of NUS students taking various data structure and algorithm classes (CS1020, CS2010, CS2020, and CS3233), as advocators of online learning, we hope that curious minds around the world will find these visualisations useful as well.</p><p><strong><span style="line-height: 200%;">Ongoing developments</span></strong><br/>VisualGo is an ongoing project, and more complex visualisations are still being developed. Originally developed using HTML5 Canvas, we are currently redesigning the site to harness the power of Scalable Vector Graphics (SVG) instead. An automated testing system is also in the works.</p><p><strong><span style="line-height: 200%;">Publications</span></strong><br/>This work has been presented briefly at the CLI Workshop at the ACM ICPC World Finals 2012 (Poland, Warsaw) and at the <a href="http://www.mii.lt/olympiads_in_informatics/htm/INFOL099.htm" target="_blank">IOI Conference at IOI 2012</a> (Sirmione-Montichiari, Italy).</p></div>');
	
	$('#team').html('<h4>The team</h4><img class="close-overlay" src="img/cross_white.png" /><div class="content"><p><strong><span style="line-height: 200%;">Project leader</span></strong><br/><a href="http://www.comp.nus.edu.sg/~stevenha/" target="_blank">Dr Steven Halim</a>, Lecturer, SoC, NUS</p><p><strong><span style="line-height: 200%;">Initial Programmers</span></strong><br/><a href="http://zichun.i-xo.net/" target="_blank">Koh Zi Chun</a><br/><a href="http://roticv.rantx.com/" target="_blank">Victor Loh Bo Huai</a></p><p><strong><span style="line-height: 200%;">Past Final Year Project students</span></strong><br/>Phan Thi Quynh Trang<br/>Peter Phandi<br/>Albert Millardo Tjindradinata<br/><p><strong><span style="line-height: 200%;">Present Final Year Project students</span></strong><br/>Nguyen Hoang Duy<br/><a href="http://www.rosemarietan.com/" target="_blank">Rose Marie Tan Zhao Yun</a><br/>Ivan Reinaldo</p><p><strong><span style="line-height: 200%;">Advisor</span></strong><br/><a href="http://felix-halim.net/" target="_blank">Felix Halim</a></p></div>');
	
	$('#termsofuse').html('<h4>Terms of use</h4><img class="close-overlay" src="img/cross_white.png" /><div class="content"><p>If you are a data structure and algorithm teacher, you are allowed to use this website for your classes. You can take screen shots from this website and use the screen shots elsewhere as long as you cite this website as a reference.</p><!--I think we need a better copyright/terms of use statement--></div>');
	
	$('.colour').css("color", surpriseColour); //name
	$('h4').css("background-color", surpriseColour); //about, contact us etc. button background

	//title
	$('#title a').click(function() {
		$('#title a').removeClass('selected-viz');
		$(this).addClass('selected-viz');
	});
	
	//overlays stuff
	$('#trigger-about').click(function(){
		$('#dark-overlay').fadeIn(function(){
			$('#about').fadeIn();
		});
	});
	$('#trigger-team').click(function(){
		$('#dark-overlay').fadeIn(function(){
			$('#team').fadeIn();
		});
	});
	$('#trigger-terms').click(function(){
		$('#dark-overlay').fadeIn(function(){
			$('#termsofuse').fadeIn();
		});
	});
	
	$('.close-overlay').click(function() {
		$('.overlays').fadeOut(function(){
			$('#dark-overlay').fadeOut();
		});
	});
	
	//facebook login stuff
	/*
	$('#fb-login').hide();
	window.fbAsyncInit = function() {
		FB.init({
			appId      : '192228707604746', // App ID
			channelUrl : '//www.rosemarietan.com/fyp/channel.html', // Channel File
			status     : true, // check login status
			cookie     : true, // enable cookies to allow the server to access the session
			xfbml      : true  // parse XFBML
		});
	
		// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
		// for any authentication related change, such as login, logout or session refresh. This means that
		// whenever someone who was previously logged out tries to log in again, the correct case below 
		// will be handled. 
		FB.Event.subscribe('auth.authResponseChange', function(response) {
		// Here we specify what we do with the response anytime this event occurs. 
			if (response.status === 'connected') {
				FB.api('/me', function(resp) {
					$('#fb-login').show();
					$('#fb-login').html(resp.name);
					$('#fb-login').attr('href', resp.link);
					$('#trick').hide();
				});
			} else if (response.status === 'not_authorized') {
				FB.login();
			} else {
				FB.login();
			}
		});
	};*/
	
});