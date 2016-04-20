app.controller('mainController', ['$scope', '$http', '$location', 'Pagination', function ($scope, $http, $location, Pagination) {
    $scope.errorData = "Yes I AM";
    $scope.login = false;
    $scope.search_info = "Artificial Intelligence";
    $scope.username = "";
    $scope.password = "";
    $scope.interest = "";


    $scope.submit_search = function () {
        var request = {
            method: 'GET',
            url: '/search/' + $scope.search_info
        };

        $http(request).then(function (response) {
            $scope.suggest = response["data"];
            //console.log($scope.suggest);
            $location.path('/professors');
            $scope.pagination = Pagination.getNew(10);
            $scope.pagination.numPages = Math.ceil($scope.suggest.length / $scope.pagination.perPage);

        });
    };

    $scope.assOption = [{
        "name": "Asscending", "Asscend": false
    }, {
        "name": "Descending", "Asscend": true
    }];
    $scope.asscending = $scope.assOption[0];
    $scope.order = "rank";
    $scope.input_title = "";


    $scope.log_in = function () {
        $http.post('/user/create', {
            username: $scope.username,
            password: $scope.password,
            interest: $scope.interest
        });
        $scope.login = true;
    };

    $scope.log_out = function () {
        $scope.login = false;
    };

    $scope.add_fav = function (prof) {
        $http.put('/user/addFavorProf', {
            'userid': $scope.username,
            'profid': prof.id
        })
    };

    $scope.link_me = function () {
        $http.get('/user/calRec/' + $scope.username, function (data) {
            console.log(data.data);
            $scope.suggest = data.data;
        })
    }

}]);

app.controller('listController', ['$scope', '$http', function ($scope, $http) {
    $scope.errorData = "YesYes";
}]);


app.controller('universityController', ['$scope', '$http', 'Pagination', function ($scope, $http, Pagination) {

    var request = {
        method: 'GET',
        url: '/univ'
    };

    $http(request).then(function (response) {
        $scope.universities = response["data"];
        $scope.pagination = Pagination.getNew(10);
        $scope.pagination.numPages = Math.ceil($scope.universities.length / $scope.pagination.perPage);
    });
}]);

app.controller('detailController', ['$scope', '$http', '$routeParams', 'Pagination', function ($scope, $http, $routeParams, Pagination) {

    var request = {
        method: 'GET',
        url: '/univ/' + $routeParams.uname
    };

    $http(request).then(function (response) {
        $scope.profs = response["data"];
        $scope.pagination = Pagination.getNew(10);
        $scope.pagination.numPages = Math.ceil($scope.profs.length / $scope.pagination.perPage);
    });

    $http({
        method: "GET",
        url: '/uinfo/' + $routeParams.uname
    }).then(function (res) {
        $scope.current_u = res["data"][0];
    })


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
