"use strict";

app.controller("AuthCtrl", function($scope, $window, $location, $ionicModal, AuthFactory, $ionicHistory, DataFactory, $state){
  $scope.loggedIn = false;

  $scope.auth = {
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  };

  $scope.email = "";
  $scope.name = "";

//get username
    $scope.getCurrentUser = function(user) {
      DataFactory.getUser(user)
      .then(function(name){
        $scope.name = name;
      });
    };

//logout the user
    $scope.logout = () => {
        console.log("NO ONE IS LOGGED IN");
        AuthFactory.logout()
          .then(function (data) {
            $scope.auth.email = "";
            $scope.auth.password = "";
            $ionicHistory.clearCache();
            // $state.go('tab.login');
          }, function (error) {
            console.log("error occured on logout");
          });
      };

// register a new user
  $scope.registerUser = function(){
      AuthFactory.registerWithEmail({
        email: $scope.auth.email,
        password: $scope.auth.password,
      })
      .then(function(user){
        DataFactory.addUser({
          uid: user.uid,
          firstName: $scope.auth.firstName,
          lastName: $scope.auth.lastName
        })
        .then((userData) => {
          $scope.login();
          $scope.closeModal();
        }, (error) => {
          console.log("Error creating user:", error);
        });
    });
  };

//login existing user and new user
  $scope.login = function(){
    AuthFactory.login($scope.auth)
  .then((user) => {
    console.log(user);
    $scope.loggedIn = true;
    $scope.email = user.email;
    $scope.closeModal();
    $scope.getCurrentUser(user.uid);
  });
};

// MODAL CONTROLLERS
    $ionicModal.fromTemplateUrl('templates/login-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modalLogin = modal;
      });
      $scope.openLoginModal = function() {
        $scope.modalLogin.show();
      };
      $scope.closeModal = function() {
        $scope.modalLogin.hide();
      };

      $ionicModal.fromTemplateUrl('templates/register-modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modalRegister = modal;
        });
        $scope.openRegisterModal = function() {
          $scope.modalRegister.show();
        };
        $scope.closeRegisterModal = function() {
          $scope.modalRegister.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.modalRegister.remove();
        });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {

      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });

      // when first loaded, make sure no one is logged in
      var checkForUser = function() {
        AuthFactory.isAuthenticated()
        .then((loggedIn) => {
          if (loggedIn){
            console.log("someone is logged in");
            $scope.loggedIn = true;
          } else {
            console.log("no one there");
            $scope.loggedIn = false;
          }
        });
      }
      checkForUser();

  });
