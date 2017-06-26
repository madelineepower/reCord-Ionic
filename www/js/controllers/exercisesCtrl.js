"use strict";

app.controller('ExercisesCtrl', function($scope, DataFactory, $q, $route, AuthFactory, $window, $ionicPopup, $location) {

var user = AuthFactory.getUser();
$scope.name = "";
$scope.exercises = [];

$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
	console.log("State changed: ", toState);
	if (toState.name == "tab.exercises") {
		$scope.doRefresh();
    }
});

$scope.getExerciseList = function() {
    DataFactory.getUserExerciseList(user)
    .then(function(data){
      $scope.exercises = data;
    });
  };
$scope.getExerciseList(user);

$scope.doRefresh = function() {
    DataFactory.getUserExerciseList(user)
    .then(function(data) {
       $scope.exercises = data;
       $scope.$broadcast('scroll.refreshComplete');
     });
}

$scope.getCurrentUser = function() {
  user = AuthFactory.getUser();
  DataFactory.getUser(user)
  .then(function(name){
    $scope.name = name;
  });
};

$scope.getCurrentUser();

$scope.deleteExercise = function (exerciseID) {
    DataFactory.deleteExercise(exerciseID)
    .then( () => {
      $scope.getExerciseList();
    });
  };

$scope.deleteAll = function () {
    var exerciseList = $scope.exercises;
    exerciseList.forEach(function(currVal){
          console.log(currVal);
          DataFactory.deleteExercise(currVal.id)
          .then(function(){
            $scope.getExerciseList();
          });
    });
};

// get id of the button

$scope.deleteModal = function(id) {
 var confirmPopup = $ionicPopup.confirm({
   title: 'Delete?',
   template: `Are you sure you want to delete this exercise?`
 });

 confirmPopup.then(function(res) {
   console.log("event target", id);
   if(res) {
     $scope.deleteExercise(id);
   } else {
     console.log('You are not sure');
   }
 });
};

$scope.deleteAllModal = function() {
 var confirmPopup = $ionicPopup.confirm({
   title: 'Delete?',
   template: `Are you sure you want to delete your exercise list?`
 });

 confirmPopup.then(function(res) {
   if(res) {
     $scope.deleteAll();
   } else {
     console.log('You are not sure');
   }
 });
};


// $scope.makePDF = function() {
//      pdf.htmlToPDF({
//             data: "<html> <h1>  Hello World  </h1> </html>",
//             documentSize: "A4",
//             landscape: "portrait",
//             type: "share" //use share to open the open-with-menu.
//         }, this.success, this.failure);
//
//  };

});
