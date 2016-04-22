/**
 * Created by admin on 4/21/16.
 */
var MainServices = angular.module('MainServices', []);

MainServices.factory('CommonData', function () {
    var data = "http://www.uiucwp.com:4000/api";
    var userInfo = {};
    return {
        getData: function () {
            return userInfo;
        },
        setData: function (newData) {
            userInfo = newData;
        }
    }
});
