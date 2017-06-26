"use strict";

app.controller('TimerViewCtrl', function($scope, $route, $interval, $timeout, $window, SelectedNoteData, $ionicPopup, DataFactory, AuthFactory, $state) {
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

  $scope.getElapsedTime = function() {
      $scope.totalElapsedTime = $scope.elapsedSeconds;
      $scope.newExerciseObject.milliseconds = $scope.totalElapsedTime;
      $scope.newExerciseObject.dateOfExercise = $scope.startTime;
      $scope.newExerciseObject.note = $scope.selected.note.note;
      $scope.newExerciseObject.vowel = $scope.UserVowel.vowel;
      console.log("newOBj", $scope.newExerciseObject);
      return $scope.newExerciseObject;
  };

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

  $scope.makeNewObj = function() {
      var newObj = $scope.getElapsedTime();
      DataFactory.addExercise(newObj)
      .then(function(newObj){
        $scope.reset();
      });
  };


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
