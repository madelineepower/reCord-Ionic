"use strict";

app.factory("AuthFactory", function($q, $http, $rootScope, FBCreds, $state) {
  let currentUser = null;

  let isAuthenticated = () => {
    return new Promise ( (resolve, reject) => {
      firebase.auth().onAuthStateChanged( (user) => {
        if (user){
          currentUser = user.uid;
          resolve(true);
        }else {
          resolve(false);
        }
      });
    });
  };

  //Firebase: Register a new user with email and password
  let registerWithEmail = (user) => {
    return firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .catch( function(error){
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log("error:", errorCode, errorMessage);
    });
  };

  let login = (credentials) => {
    return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
    .catch( function(error){
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log("error:", errorCode, errorMessage);
    });
  };

//Firebase: Return email, UID for user that is currently logged in.
  let getUser = () => {
    console.log("current user", currentUser);
    return currentUser;
  };

// Kills browser cookie with firebase credentials
  let logout = () => {
    return firebase.auth().signOut();
  };

  return {isAuthenticated, getUser, logout, registerWithEmail, login};
});
