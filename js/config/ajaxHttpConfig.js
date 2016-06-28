/**
 * Created by lichao on 2016/6/28.
 * HTTP 拦截器
 */
var app = angular.module("ajaxHttp", []);
app.factory("httpInterceptor", ["$q", function ($q) {
    return {
        request: function (config) {
            // do something on request success
            // console.log(config);
            return config || $q.when(config);
        },
        requestError: function (rejection) {
            // do something on request error
            return $q.reject(rejection)
        },
        response: function (response) {
            // do something on response success
            // console.log('response',response);
            return response || $q.when(response);
        },
        responseError: function (rejection) {
            // do something on response error
            return $q.reject(rejection);
        }
    };
}]);
app.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push("httpInterceptor");
}]);