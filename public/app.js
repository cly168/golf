var app = angular.module('golf', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {

    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'views/home/index.html',
            controller: 'HomeController'
        })

    $locationProvider.html5Mode(true);

});