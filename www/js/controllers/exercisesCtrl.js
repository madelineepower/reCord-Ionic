"use strict";

app.controller('ExercisesCtrl', function($scope, DataFactory, $q, $route, AuthFactory, $window, $ionicPopup, $location) {

var user = AuthFactory.getUser();
$scope.name = "";
$scope.exercises = [];

//refesh the data everytime the state changes to the execises tab
$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
	console.log("State changed: ", toState);
	if (toState.name == "tab.exercises") {
		$scope.doRefresh();
    }
});

//get a user's exercise list
$scope.getExerciseList = function() {
    DataFactory.getUserExerciseList(user)
    .then(function(data){
      $scope.exercises = data;
    });
  };
$scope.getExerciseList(user);

//refresh the data when user pulls the screen down
$scope.doRefresh = function() {
    DataFactory.getUserExerciseList(user)
    .then(function(data) {
       $scope.exercises = data;
       $scope.$broadcast('scroll.refreshComplete');
     });
}

//get user's name for the pdf
$scope.getCurrentUser = function() {
  user = AuthFactory.getUser();
  DataFactory.getUser(user)
  .then(function(name){
    $scope.name = name;
  });
};
// $scope.getCurrentUser();

//delete's one exercise from the list
$scope.deleteExercise = function (exerciseID) {
    DataFactory.deleteExercise(exerciseID)
    .then( () => {
      $scope.getExerciseList();
    });
  };

//delete the ENTIRE list
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

//confirm the delete
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

//confirm delete all
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


$scope.makePDF = function() {
  var exerciseData = [];
  for (let item in $scope.exercises) {
          let currentItem = {};
          var time = moment($scope.exercises[item].dateOfExercise);
          currentItem.Date = time.format("MMMM Do YYYY, h:mm a");
          currentItem.Seconds = Math.floor(($scope.exercises[item].milliseconds)/1000);
          currentItem.Pitch = $scope.exercises[item].note;
          currentItem.Vowel = $scope.exercises[item].vowel;
          exerciseData.push(currentItem);
        }
  console.log("NEW DATA", exerciseData);

  function buildTableBody(data, columns) {
      var body = [];
      body.push(columns);
      data.forEach(function(row) {
          var dataRow = [];
          columns.forEach(function(column) {
              dataRow.push(row[column].toString());
          });
          body.push(dataRow);
      });
      return body;
  }

  function table(data, columns) {
      return {
          table: {
              headerRows: 1,
              body: buildTableBody(data, columns)
          }
      };
  }

  var dd = {
    content: [
      { text: `${$scope.name}`, style: 'header' }, {text: 'Exercise List', style: 'subheader'},
      table(exerciseData, ['Date', 'Seconds', 'Pitch', 'Vowel'])
    ],
    styles: {
        header: {
          fontSize: 18,
          bold: true
        },
        subheader: {
          fontSize: 15,
          bold: true
        },
        quote: {
          italics: true
        },
        small: {
          fontSize: 8
        },
        tableExample: {
			     margin: [0, 5, 0, 15]
		    },
		    tableHeader: {
      			bold: true,
      			fontSize: 13,
      			color: 'black'
		     }
      }
};
pdfMake.createPdf(dd).download("Exercise_List.pdf");

window.plugin.email.open({
    	to:'',
      cc: '',
      bcc:'',
      subject: '',
      body: '',
			attachments: 'file://Exercise_List.pdf'
      });
};

});
