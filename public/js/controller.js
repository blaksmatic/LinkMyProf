app.controller('mainController', ['$scope', function ($scope) {
    $scope.errorData = "Yes I AM"
}]);

app.controller('listController', ['$scope', '$http', function ($scope, $http) {
    $scope.errorData = "YesYes";
}]);


app.controller('universtiyController', ['$scope', '$http', function ($scope, $http) {

    var request = {
        method: 'GET',
        url: '/univ'
    };

    $http(request).then(function (response) {
        $scope.universities = response["data"];
    });
}]);


app.controller('detailController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {

    var request = {
        method: 'GET',
        url: '/univ/' + $routeParams.uname
    };

    $http(request).then(function (response) {
        $scope.profs = response["data"];
    });
}]);

app.controller('professor_detail_controller', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {

    var request = {
        method: 'GET',
        url: '/prof/' + $routeParams.id
    };

    $http(request).then(function (response) {
        $scope.profs = response["data"];
    });
}]);
