"use strict";

app.controller('TimerViewCtrl', function($scope, $route, $interval, $timeout, $window, SelectedNoteData, $ionicPopup, DataFactory, AuthFactory, $state) {

  //// variables //////
    $scope.format = '';
    $scope.startTime = "";
    $scope.new = "";
    var timerPromise;
    var user = AuthFactory.getUser();
    $scope.elapsedSeconds = 0;
    $scope.totalElapsedTime = 0;
    $scope.newExerciseObject = {
      milliseconds: "",
      dateOfExercise: "",
      note: "",
      uid: user
    };
    $scope.timerSeconds = 0;
    $scope.selected = SelectedNoteData;
    $scope.timerStarted = false;
    $scope.UserVowel = {
      vowel: ""
    };

//start the timer///
  $scope.start = function() {
    if (!timerPromise) {
      $scope.startTime = new Date();
      console.log("startTime", $scope.startTime);
      timerPromise = $interval(function() {
        $scope.timerStarted = true;
        var now = new Date();
        $scope.elapsedSeconds = now.getTime() - $scope.startTime.getTime();
        $scope.timerSeconds = ($scope.elapsedSeconds/1000);
      }, 1);
    }
  };

  //stop the timer, get the elapsedTime and show the confirm popup///
  $scope.stop = function() {
    if (timerPromise) {
      $scope.timerStarted = false;
      $scope.getElapsedTime();
      $interval.cancel(timerPromise);
      timerPromise = undefined;
      $scope.showConfirm();
      // $scope.elapsedSeconds = 0;
    }
  };

//make new object to get elapsed time, user vowel, user note, and date///
  $scope.getElapsedTime = function() {
      $scope.totalElapsedTime = $scope.elapsedSeconds;
      $scope.newExerciseObject.milliseconds = $scope.totalElapsedTime;
      $scope.newExerciseObject.dateOfExercise = $scope.startTime;
      $scope.newExerciseObject.note = $scope.selected.note.note;
      $scope.newExerciseObject.vowel = $scope.UserVowel.vowel;
      console.log("newOBj", $scope.newExerciseObject);
      return $scope.newExerciseObject;
  };

//reset the timer
  $scope.reset = function() {
    if (timerPromise) {
      $scope.timerStarted = false;
      $interval.cancel(timerPromise);
      timerPromise = undefined;
      $scope.elapsedSeconds = 0;
      $scope.timerSeconds = 0;
    }
    $scope.elapsedSeconds = 0;
    $scope.timerSeconds = 0;
  };

//push the new Exercise object to firebase and reset the timer
  $scope.makeNewObj = function() {
      var newObj = $scope.getElapsedTime();
      DataFactory.addExercise(newObj)
      .then(function(newObj){
        $scope.reset();
      });
  };


//confirm popup to save the exercise
  $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Save?',
     template: `Do you want to save this exercise?`
   });

   confirmPopup.then(function(res) {
     if(res) {
       $scope.makeNewObj();
     } else {
       console.log('You are not sure');
     }
   });
 };

});
