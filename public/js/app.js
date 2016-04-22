var app = angular.module("mainApp", ['ngRoute', 'simplePagination', 'MainServices']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/university', {
            templateUrl: './partials/university.html',
            controller: 'universityController'
        })
        .when('/prof/:id', {
            templateUrl: './partials/professor_detail.html',
            controller: 'professor_detail_controller'
        })
        .when('/detail/:rank', {
            templateUrl: './partials/details.html',
            controller: 'detailController'
        })
        .when('/university/:uname', {
            templateUrl: './partials/university_detail.html',
            controller: 'detailController'
        })
        .when('/professors', {
            templateUrl: './partials/professors.html',
            controller: 'mainController'
        })
        .when('/home', {
            templateUrl: './partials/home.html'
        })


});