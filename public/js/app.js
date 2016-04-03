var app=angular.module("mainApp",["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/university', {
            templateUrl : './partials/university.html',
            controller: 'universtiyController'
        })
        .when('/prof/:id', {
            templateUrl : './partials/professor_detail.html',
            controller: 'professor_detail_controller'
        })
        .when('/detail/:rank', {
            templateUrl : './partials/details.html',
            controller: 'detailController'
        })
        .when('/university/:uname',{
            templateUrl : './partials/university_detail.html',
            controller: 'detailController'
        })
        .when('/home',{
            templateUrl : './partials/home.html'
        })
        .when('/',{
            templateUrl : './partials/home.html'
        })

});