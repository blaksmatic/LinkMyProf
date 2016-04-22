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
        .when('/visual', {
            templateUrl: './partials/visual.html',
            controller: 'visualController'
        })


});


app.filter('unique', function() {
    return function(collection, keyname) {
        var output = [],
            keys = [];

        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if(keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };
});