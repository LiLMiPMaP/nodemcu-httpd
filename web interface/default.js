$(document).ready(function(){

var beats = $("#beats");
var noOfBeatsInSequence = 8;

console.log(beats.children(function(e)).each());
$("#beats li").each(function(){console.log(this)})
//updateBeats()

})

// SETUP BEATS
function updateBeats(beatsNo)
{


}

/*$(document).ready(function() {
		
		// ARRAY CONTAINING ACTIVE TILES
		var activeTiles      = [0,0,0,0,0,0,0,0];
		var activeTile = 0;
		// BPM
		var interval = 1000; 
		// TIMER
		var timeout;
		// TILE POINTER
		var pointer = 0;
		var previousPointer = 7;
		// FIELD IP
		var tickerIP = "";

		// STORE ELEMENTS IN ARRAY TO PREVENT DELAYS
		var tiles        = [];
		var tilesNo      = $(".row > .tick-box").length;
		var bpmDisplay   = $("#bpm-display");
		var bpmFill      = $("#bpm-indicator-fill")
		var bpmIndicator = $("#bpm-indicator");

		// MOUSE STATE
		var mouseDown = false;
		var mouseIn   = false;
		
		for( var n = 0; n < tilesNo; n++ ){

			tiles[n] = $( ".row .tick-box:nth-child("+(n+1)+")" )[0];

		}
		
		$('.tick-box').on("click",function(){
			//console.log($(this).attr("data-index"));
			activateDeactivate($(this));

		
		$("#ticker").on("click",function(){
			
		}) 
	})

bpmIndicator.on("mousedown",function(e){
mouseDown = true;
console.log("mouseDown");
});

$("#ip-field input").on('keyup',function(e){
	var fieldVal = e.target.value;
	console.log(fieldVal);
	if(ValidateIPaddress(fieldVal))
	{
	tickerIP = e.target.value;
	}
})

bpmIndicator.on("mousemove",function(e){
   if(mouseDown){
    var x = e.pageX - this.offsetLeft;
    var y = Math.max(e.pageY - this.offsetTop,0);
    var indicatorHeight = bpmIndicator.height();
   
  var fillHeight = indicatorHeight-y;
   interval = Math.floor(((1000*y)/indicatorHeight)+((100*(indicatorHeight-y))/indicatorHeight)); 
   bpmFill.height(Math.min(indicatorHeight,indicatorHeight-y));
   			// UPDATE TIMER
   			var bpmValue = (1000/interval)*60;
   			bpmDisplay.text(bpmValue.toFixed(0));
//console.log("mouseMOVE");
}
});

$("html").on('mouseup',function(){
if(mouseDown)mouseDown=false;
//console.log("mouseUP");
})

$("#bpm").on("change",function(){

	//console.log($(this).val())
	//updateTimer();
	interval = Number($(this).val());
})

	function activateDeactivate(target){

		var index    = target.attr("data-index");
		var child    = target.children();
		var active   = child.hasClass("active");
		//console.log(child);
		
		if(active){
			child.removeClass("active");
			activeTiles[index] = 0;
		}
		else
		{
			child.addClass("active");
			activeTiles[index] = 1;
		}
		//console.log(activeTiles);
	}

	function updateTiles()
	{


	}

	function clearTimer()
	{
	}

	function updateTimer()
	{
		

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
   			//console.log("tick");
   			//console.log(pointer);

   			// HIGHLIGHT TILE
   			tiles[pointer].className = "tick-box pointer"
   			// DEACTIVATE PREVIOUS TILE
   			tiles[previousPointer].className = "tick-box"
   			//console.log(pointer+" _ "+previousPointer);
   			
   			// SEND TICK SIGNAL IF ACTIVE
   			//`console.log(activeTiles[pointer]==1);
   			if(activeTiles[pointer]==1 && tickerIP!="") {
   				console.log("HIT 1\n"); console.log("Send");$.get("http://"+tickerIP+"/",{tick:""})
   				//console.log("HIT 2\n"); console.log("Send");$.get("http://192.168.43.96/",{tick:""})

//   				console.log("HIT 2\n"); console.log("Send");$.get("http://192.168.43.100/",{tick:""})
   			}

   			// UPDATE POINTER
   			pointer         = (pointer+1)%8;
   			previousPointer = (previousPointer+1)%8;


   			// CALCULATE DELAY IF ANY
    		expected += interval;
    		timeout = setTimeout(step, Math.max(0, interval - dt)); // take into account drift
		}
	}

	initTimer(1000);

	})

	Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function ValidateIPaddress(inputValue) {
  var re = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
  return re.test(inputValue);
}*/

