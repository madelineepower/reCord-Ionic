"use strict";

app.controller('SoundCtrl', function($scope, $route, SelectedNoteData) {

var audioContext;


//make sure window is supported
var isAudioContextSupported = function () {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	if(window.AudioContext){
    console.log("this window is supported");
		return true;
	}
	else {
    console.log("NOT SUPPORTED");
		return false;
	}
};

  //create the audioContext

var createAudioContext = function() {
  if(isAudioContextSupported()) {
    audioContext = new window.AudioContext();
    console.log("created audio context");
  }
};
createAudioContext();

  //create the oscillator
  var oscillator = audioContext.createOscillator();
  var gainNode = audioContext.createGain();
  //give the oscialltor note a destination(device speaker)
  gainNode.connect(audioContext.destination);
  oscillator.type = 'triangle';

//get the frequencies
let getNotes = function(){
  $scope.notesArray = [];
  $.getJSON('data/notes.json', function(data) {
    $scope.notesArray = data.notes;
    console.log($scope.notesArray);
  });
};
getNotes();

$scope.selected = SelectedNoteData;
$scope.frequency = {};

let setFrequency = function(){
  var newNote = $scope.selected.note;
  $scope.frequency = newNote.frequency;
  console.log($scope.frequency);
  //give the oscillator a frequency value
  oscillator.frequency.value = $scope.frequency; // value in hertz
};

//play the tone
oscillator.start();
$scope.playTone = function(event) {
    setFrequency();
    oscillator.connect(gainNode);
    $scope.tonePlaying = true;
};

//stop the tone
$scope.stopTone = function(event) {
  if ( $scope.tonePlaying) {
    oscillator.frequency.value = null;
    oscillator.disconnect(gainNode);
    $scope.tonePlaying = false;
  }
};

$scope.$on('$routeChangeStart', function(next, current) {
  audioContext.close();
  console.log('THE CONTEXT WAS CLOSED');
 });

});
