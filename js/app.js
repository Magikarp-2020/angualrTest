/**
 * Created by lichao on 2016/6/28.
 */
var app = angular.module('app',['directive']);


app.controller('mainController',function ($scope){
    $scope.demo = 1;
    $scope.demo2 = 2;

    $scope.demoArr = [{},{},{},{}]
    
});

