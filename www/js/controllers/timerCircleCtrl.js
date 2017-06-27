"use strict";

app.controller('TimeCircleCtrl', ['$scope', '$interval', '$timeout', '$window', 'roundProgressService', function($scope, $interval, $timeout, $window, roundProgressService){

    $scope.current =        0;
    $scope.max =            60;
    $scope.offset =         0;
    $scope.timerCurrent =   0;
    $scope.uploadCurrent =  0;
    $scope.stroke =         3;
    $scope.radius =         95;
    $scope.isSemi =         false;
    $scope.rounded =        true;
    $scope.responsive =     false;
    $scope.clockwise =      true;
    $scope.currentColor =   '#1de9b6';
    $scope.bgColor =        '#bab5cd';
    $scope.duration =       800;
    $scope.currentAnimation = 'easeOutCubic';
    $scope.animationDelay = 0;

    $scope.increment = function(amount){
        $scope.current += (amount || 1);
    };

    $scope.decrement = function(amount){
        $scope.current -= (amount || 1);
    };

    $scope.animations = [];

    angular.forEach(roundProgressService.animations, function(value, key){
        $scope.animations.push(key);
    });

}]);
