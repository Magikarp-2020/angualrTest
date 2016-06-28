/**
 * Created by lichao on 2016/6/28.
 */
var directive = angular.module('directive', []);

directive.directive('demo', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            template: '<h3>this is Demo</h3>'
        };
    })
    .directive('scopeDemo', function () {
        return {
            restrict: "AE",        // 指令是一个元素 (并非属性)
            scope: {              // 设置指令对于的scope
                name: "@",          // name 值传递 （字符串，单向绑定）
                amount: "=",        // amount 引用传递（双向绑定）
                save: "&"           // 保存操作
            },
            template:             // 替换HTML (使用scope中的变量)
            "<div ng-transclude></div>" + // 内部的属性
            "<div>" +
            "  {{name}}: <input ng-model='amount' />" +
            "  <button ng-click='save()'>Save</button>" +
            "</div>",
            transclude: true,
            controller: ["$scope", function ($scope) {
                console.log($scope.name);
                /**
                 name: "@" （值传递，单向绑定）：
                 "@"符号表示变量是值传递。指令会检索从父级scope中传递而来字符串中的值。指令可以使用该值但无法修改，是最常用的变量。
                 amount: "=" （引用,双向绑定）
                 "="符号表示变量是引用传递。指令检索主Scope中的引用取值。值可以是任意类型的，包括复合对象和数组。指令可以更改父级Scope中的值，所以当指令需要修改父级Scope中的值时我们就需要使用这种类型。
                 save: "&" (表达式)
                 “&”符号表示变量是在父级Scope中启作用的表达式。它允许指令实现比修改值更高级的操作。
                 通过$scope获取
                 */
            }],
            link: function (scope, element, attrs, controller) {

            }

        };
    })
    .directive('chooseGoodsType', function () {
        return {
            restrict: "A",
            scope: {
                skin: "@",
                val: "=",
                getValue: "&"
            },
            transclude: true,
            template: '<div ng-click="showBox($event)" ng-transclude></div>' +
            '<div class="show_box " ng-class="className">' +
            '    <ul class="show_box_title clearfix">' +
            '        <li ng-class="{active:loadStatus == 1}" ng-click="changeNav(1,$event)">大类</li>' +
            '        <li ng-class="{active:loadStatus == 2}" ng-click="changeNav(2,$event)">中类</li>' +
            '        <li ng-class="{active:loadStatus == 3}" ng-click="changeNav(3,$event)">小类</li>' +
            '    </ul>' +
            '    <ul class="show_box_content clearfix">' +
            '        <li ng-class="{active:loadStatus == 1}">' +
            '            <a href="javascript:;" ng-repeat="class in bigClasses" ng-click="getMiddleClasses(class,$event)">{{class.bigclass}}</a>' +
            '        </li>' +
            '        <li ng-class="{active:loadStatus == 2}">' +
            '            <a href="javascript:;" ng-repeat="class in middleClasses" ng-click="getSmallClasses(class,$event)">{{class.middleclass}}</a>' +
            '        </li>' +
            '        <li ng-class="{active:loadStatus == 3}">' +
            '            <a href="javascript:;" ng-repeat="class in smallClasses" ng-click="chooseOver(class,$event)">{{class.smallclass}}</a>' +
            '        </li>' +
            '    </ul>' +
            '</div>',
            controller: ["$scope", "$http", function ($scope, $http) {
                $scope.className = {};
                $scope.className[$scope.skin] = true;
                $scope.loadStatus = 1;

                var buf = {
                    bigClass: {},
                    middleClass: {},
                    smallClass: {}
                };
                $scope.changeNav = function (status, $event) {
                    $event.stopPropagation();
                    $scope.loadStatus = status;
                };

                $scope.showBox = function ($event) {
                    $event.stopPropagation();
                    $scope.className['active'] = true;
                };

                function getData(data) {
                    return $http({
                        url: "http://localhost:8888/speed/baseInstallPrice/queryBaseInstallPrice",
                        method: "POST",
                        params: data
                    })
                }

                getData().then(function (res) {
                    console.log(res);
                    var data = res.data;
                    $scope.bigClasses = data.data;
                });

                $scope.getMiddleClasses = function (data, $event) {
                    $event.stopPropagation();
                    buf.bigClass = data;
                    buf.middleClass = {};
                    buf.smallClass = {};

                    $scope.loadStatus = 2;
                    console.log(data);
                    getData({
                        bigclassno: data.bigclassno
                    }).then(function (res) {
                        console.log(res);
                        var data = res.data;
                        $scope.middleClasses = data.data;
                    });
                };

                $scope.getSmallClasses = function (data, $event) {
                    $event.stopPropagation();
                    buf.middleClass = data;
                    buf.smallClass = {};
                    $scope.loadStatus = 3;

                    getData({
                        middleclassno: data.middleclassno
                    }).then(function (res) {
                        console.log(res);
                        var data = res.data;
                        $scope.smallClasses = data.data;
                    });
                };

                $scope.chooseOver = function (data, $event) {
                    $event.stopPropagation();
                    buf.smallClass = data;
                    var type = angular.extend({}, buf);
                    $scope.className['active'] = false;
                    $scope.val = type;
                };

                var $document = $(document);
                $document.click(function () {
                    console.log('1111');
                    $scope.className['active'] = false;
                    $scope.$apply();
                });
            }]
        }
    });