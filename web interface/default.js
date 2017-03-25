var mode;
var circleDiameter;
var noOfBeatsInSequence = 8;
var tileWidth;
var lastFillHeight;
var fillMaxHeight;
var windowWidth;
var windowHeight;

// BPM
var interval = 500; 
// TIMER
var timeout;
var pointer = 0;
var previousPointer = 0;
// ELEMENTS
var bpm,bmpFill,beats,tile,circle,controls,icons,w,buttonContainer,button,sequenceMini;


// SEQUENCER
var activeSequence = [0,0,0,0,0,0,0,0];

$(document).ready(function(){

mode = ($('#sequence-mode')[0]!=undefined)? true:false;

// ELEMENTS
w = $(window);
bpm = $("#bpm-container");
bpmFill = $("#bpm-fill");
beats = $("#beats");
tile = $("#beats li");
circle = $(".circle");
controls = $("#controls-container");
icons = $(".icon");
buttonContainer = $("#button-container");
button = $("#button");
sequenceMini = $(".sequence");

function launchIntoFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

// Launch fullscreen for browsers that support it!
launchIntoFullscreen(document.documentElement); // the whole page

$('#switch-UI').hammer().bind('tap',function(){window.location.href = (mode)? "/button":"/";});

function toggleFullScreen() {
  if (!document.fullscreenElement) {
      elem.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen(); 
    }
  }
}
 
/*
//
// RESIZE 
//
*/

resizeHandler();

if(mode){
	console.log("sequence");



// SEND REQUEST
// var xhr = new XMLHttpRequest();                        
// xhr.open('POST','http://192.168.43.147/ss.lua?bpm=120&p=1',true);                        
// xhr.send('');

/*
//
// EVENT LISTENERS 
//
*/


tile.hammer().bind('tap',function(){
$(this).toggleClass("selected");
var clickedId = $(this).index();
activeSequence[clickedId] = (activeSequence[clickedId]==1)? 0:1;
console.log(activeSequence);
})
bpm.hammer({time:0,threshold:0}).bind('tap',function(e){console.log("tPPED")});


initTimer(1000);

}
else
{

console.log("button mode");

 
/*
//
// LISTEN FOR TAPPING IN BUTTON MODE 
//
*/

button.hammer({}).bind('tap',function(e){
	console.log("button pressed");
	buttonContainer.toggleClass("active");
	setTimeout(function(){buttonContainer.toggleClass("active");},50);

});
}

 
/*
//
// LISTEN FOR RESIZE CHANGES 
//
*/

window.addEventListener("resize", function() {
 resizeHandler();

}, false);

})



// SETUP BEATS
function updateBeats(previousPointer,currentPointer)
{

   			//console.log($( "#beats li:eq( "+(beatsNo+1)+" )" ));
$( "#beats li:eq( "+previousPointer+" )" ).toggleClass("active");
$( "#beats li:eq( "+currentPointer+" )" ).toggleClass("active");

}

function resizeHandler()
{
	windowWidth  = w.outerWidth();
	windowHeight = w.outerHeight();

if(mode){
// BPM
lastFillHeight = bpmFill.height();
fillMaxHeight = windowHeight*0.85;
// BEAT 
tileWidth = (100/noOfBeatsInSequence);
tile.each(function(){$(this).css('width',tileWidth+"%")});
// BALLS
circleDiameter = tile.width()*0.33;
circle.each(function(){$(this).css({'height':circleDiameter,'width':circleDiameter,'top':circleDiameter,'left':circleDiameter})});
}
else{
	var size= (windowWidth>windowHeight)? windowHeight*0.6:windowWidth*0.6;
	circleDiameter = size*0.33;
// BUTTON
	button.css({"width":size,"height":size,"top":(windowHeight-size)*0.5,"left":(windowWidth-size)*0.5});

	// BALL
circle.each(function(){$(this).css({'height':circleDiameter,'width':circleDiameter,'top':circleDiameter,'left':circleDiameter})});


	console.log(size+" - "+windowWidth+" - "+windowHeight);
}
// ICONS
var controlsSize = windowHeight*0.15*0.8;
icons.css({"width":controlsSize,"height":controlsSize,"top":controlsSize/10});

// MULTIPLE SEQUENCES


}

function initTimer()
	{
		
		var expected = Date.now() + interval;
		setTimeout(step, interval);

		function step() {
   			 var dt = Date.now() - expected; // the drift (positive for overshooting)
   			 if (dt > interval) {
       		 // something really bad happened. Maybe the .rower (tab) was inactive?
       		 // possibly special handling to avoid futile "catch up" run
  			  }


updateBeats(previousPointer,pointer);
previousPointer = pointer;
pointer = (pointer+1)%8;
    			
  			  //pointer = (pointer+1)%8;
  			 // console.log(pointer);
   			// UPDATE POINTER
   			console.log("tick");

   			// CALCULATE DELAY IF ANY
    		expected += interval;
    		timeout = setTimeout(step, Math.max(0, interval - dt)); // take into account drift
		}
	}


/*

	function updateTiles()
	{


	}

	function clearTimer()
	{
	}

	function updateTimer()
	{
		

	}

	Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
