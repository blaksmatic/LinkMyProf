app.controller('mainController', ['$scope', '$http', '$location', 'Pagination', 'CommonData', function ($scope, $http, $location, Pagination, CommonData) {
    $scope.errorData = "Yes I AM";
    $scope.login = false;
    $scope.search_info = "Artificial Intelligence";
    $scope.username = "";
    $scope.password = "";
    $scope.interest = "";
    $scope.location = "";
    $scope.likes = [];


    $scope.submit_search = function () {
        var request = {
            method: 'GET',
            url: '/search/' + $scope.search_info
        };

        $http(request).then(function (response) {
            $scope.suggest = response["data"];
            console.log($scope.suggest);
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
            interest: $scope.interest,
            location: $scope.location
        });
        $scope.login = true;
        CommonData.setData({username: $scope.username});
    };

    $scope.log_out = function () {
        $scope.login = false;
    };

    $scope.add_fav = function (prof) {
        $http.put('/user/addFavorProf', {
            'userid': $scope.username,
            'profid': prof.id
        });
        $scope.likes.push(prof.id);
    };

    $scope.link_me = function () {


        $http({
            method: 'GET',
            url: '/user/getRec/' + CommonData.getData().username
        }).then(function (data) {
            //console.log(data.data);
            $scope.suggest = data.data.slice(0, 99);
            $scope.pagination = Pagination.getNew(10);
            $scope.pagination.numPages = Math.ceil($scope.suggest.length / $scope.pagination.perPage);
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

app.controller('professor_detail_controller', ['$scope', '$http', '$routeParams', 'CommonData', function ($scope, $http, $routeParams, CommonData) {

    $http({
        method: 'GET',
        url: '/prof/' + $routeParams.id
    }).then(function (response) {
        $scope.profs = response["data"];

        if (CommonData.getData().username) {
            $http({
                method: 'GET',
                url: '/user/getOneRec/' + CommonData.getData().username + '/' + $scope.profs.id
            }).then(function (response) {

                $scope.stat = response["data"];
                console.log($scope.stat);
                $scope.inteInd2 = Math.round($scope.stat.inteInd * 100);
                $scope.areaInd2 = Math.round($scope.stat.areaInd * 100);
                $scope.simiInd2 = Math.round($scope.stat.simiInd * 100);
                $scope.totalInd2 = Math.round($scope.stat.totalInd * 100);
                var chart = new Chartist.Pie('.chart1', {
                    series: [$scope.inteInd2, $scope.areaInd2, $scope.simiInd2],
                    labels: ["Interests", "Area", "Similarity"]
                }, {
                    donutWidth: 60,
                    startAngle: 270,
                    total: 100,
                    donut: true,
                    showLabel: true
                });


                chart.on('draw', function (data) {
                    if (data.type === 'slice') {
                        // Get the total path length in order to use for dash array animation
                        var pathLength = data.element._node.getTotalLength();

                        // Set a dasharray that matches the path length as prerequisite to animate dashoffset
                        data.element.attr({
                            'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
                        });

                        // Create animation definition while also assigning an ID to the animation for later sync usage
                        var animationDefinition = {
                            'stroke-dashoffset': {
                                id: 'anim' + data.index,
                                dur: 1000,
                                from: -pathLength + 'px',
                                to: '0px',
                                easing: Chartist.Svg.Easing.easeOutQuint,
                                // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
                                fill: 'freeze'
                            }
                        };

                        // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
                        if (data.index !== 0) {
                            animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
                        }

                        // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
                        data.element.attr({
                            'stroke-dashoffset': -pathLength + 'px'
                        });

                        // We can't use guided mode as the animations need to rely on setting begin manually
                        // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
                        data.element.animate(animationDefinition, false);
                    }
                });


            });
        }
    });
}]);


app.controller('visualController', ['$scope', '$http', '$routeParams', 'CommonData', function ($scope, $http, $routeParams, CommonData) {

    var request = {
        method: 'GET',
        url: '/user/visual/' + CommonData.getData().username
    };
    if (CommonData.getData().username) {
        $http(request).then(function (response) {
            $scope.visual = response.data;
            console.log(response.data);
            make_visual($scope.visual);

        });
    }

    function make_visual(json) {

        var newJson = {
            "name": json.name,
            "children": json.children
        };

        treeData = newJson;
        // Calculate total nodes, max label length


        var width = 1400;
        var height = 1550;
        var maxLabel = 150;
        var duration = 500;
        var radius = 5;

        var i = 0;
        var root = newJson;
        console.log(root);

        var tree = d3.layout.tree()
            .size([height, width]);

        var diagonal = d3.svg.diagonal()
            .projection(function (d) {
                return [d.y, d.x];
            });

        var svg = d3.select("#tree-container").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + maxLabel + ",0)");

        root.x0 = height;
        root.y0 = 0;

        root.children.forEach(collapse);

        function update(source) {
            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse();
            var links = tree.links(nodes);

            // Normalize for fixed-depth.
            nodes.forEach(function (d) {
                d.y = d.depth * maxLabel;
            });

            // Update the nodes…
            var node = svg.selectAll("g.node")
                .data(nodes, function (d) {
                    return d.id || (d.id = ++i);
                });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on("click", click);

            nodeEnter.append("circle")
                .attr("r", 0)
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "white";
                });

            nodeEnter.append("text")
                .attr("x", function (d) {
                    var spacing = computeRadius(d) + 12;
                    return d.children || d._children ? -spacing : spacing;
                })
                .attr("dy", "3")
                .attr("text-anchor", function (d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function (d) {
                    return d.name;
                })
                .style("fill-opacity", 0);

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            nodeUpdate.select("circle")
                .attr("r", function (d) {
                    return computeRadius(d);
                })
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            nodeUpdate.select("text").style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

            nodeExit.select("circle").attr("r", 0);
            nodeExit.select("text").style("fill-opacity", 0);

            // Update the links…
            var link = svg.selectAll("path.link")
                .data(links, function (d) {
                    return d.target.id;
                });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function (d) {
                    var o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                });

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function (d) {
                    var o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        function computeRadius(nodes) {
            if (nodes.children || nodes._children) return 10;
            else return 5;
        }


        function click(click) {
            if (click.children) {
                click._children = click.children;
                click.children = null;
            }
            else {
                click.children = click._children;
                click._children = null;
            }
            update(click);
        }

        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }

        update(root);


    }

}]);

