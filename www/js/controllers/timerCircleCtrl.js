"use strict";

app.controller('TimeCircleCtrl', ['$scope', '$interval', '$timeout', '$window', 'roundProgressService', function($scope, $interval, $timeout, $window, roundProgressService){

    $scope.current =        0;
    $scope.max =            60;
    $scope.offset =         0;
    $scope.timerCurrent =   0;
    $scope.uploadCurrent =  0;
    $scope.stroke =         4;
    $scope.radius =         80;
    $scope.isSemi =         false;
    $scope.rounded =        true;
    $scope.responsive =     false;
    $scope.clockwise =      true;
    $scope.currentColor =   '#387ef5';
    $scope.bgColor =        '#e0e0e0';
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

    $scope.getStyle = function(){
        var transform = ($scope.isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';

        return {
            'top': $scope.isSemi ? 'auto' : '50%',
            'bottom': $scope.isSemi ? '5%' : 'auto',
            'left': '50%',
            'transform': transform,
            '-moz-transform': transform,
            '-webkit-transform': transform,
            'font-size': $scope.radius/3.5 + 'px'
        };
    };

}]);
