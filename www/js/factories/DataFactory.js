"use strict";

app.factory("DataFactory", function($q, $http, FBCreds, $window) {

var currentFirstName = "";
var currentLastName = "";
var currentUserName = "";
    //addExercise
    const addExercise = (newObj) => {
      return $q(function(resolve, reject){
        $http.post(`${FBCreds.databaseURL}/exercises.json`, newObj)
        .then((itemObj) => {
          resolve(itemObj);
        })
        .catch((error) => {
          reject(error);
        });
      });
    };

    //getUserExerciseList
    const getUserExerciseList = (userId) => {
        let exercises = [];
        return $q((resolve,reject) => {
          $http.get(`${FBCreds.databaseURL}/exercises.json?orderBy="uid"&equalTo="${userId}"`)
        .then((itemObject) => {
          let itemCollection = itemObject.data;
          console.log("itemCollection", itemCollection);
          Object.keys(itemCollection).forEach((key) => {
            itemCollection[key].id = key;
            exercises.push(itemCollection[key]);
          });
          resolve(exercises);
        })
        .catch((error) => {
          reject(error);
        });
      });
    };

    const deleteExercise = (exerciseId) => {
      return $q((resolve, reject) => {
        $http.delete(`${FBCreds.databaseURL}/exercises/${exerciseId}.json`)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
      });
    };

    const deleteAllExercises = (userId) => {
      return $q((resolve, reject) => {
        $http.delete(`${FBCreds.databaseURL}/exercises.json?orderBy="uid"&equalTo="${userId}"`)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
      });
    };

const addUser = function(newUser){
   return $q((resolve, reject)=>{
     console.log("adding new user to database");
       $http.post(`${FBCreds.databaseURL}/users.json`, newUser)
       .then((response)=>{
           resolve(response);
       })
       .catch((error)=>{
           reject(error);
       });
   });
};

const getUser = function(userUID){
  return $q((resolve, reject) => {
    $http.get(`${FBCreds.databaseURL}/users.json?orderBy="uid"&equalTo="${userUID}"`)
    .then((userName)=> {
      for (let names in userName.data) {
                currentFirstName = userName.data[names].firstName;
                currentLastName = userName.data[names].lastName;
                currentUserName = currentFirstName + " " + currentLastName;
      }
      resolve(currentUserName);
    })
    .catch((error)=>{
      reject(error);
    });
  });
};

    return {
    addExercise,
    getUserExerciseList,
    addUser,
    deleteExercise,
    deleteAllExercises,
    getUser
  };


});
