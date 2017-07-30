var app = angular.module('golf', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {

    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'views/home/index.html',
            controller: 'HomeController'
        })
        .when('/events', {
        	templateUrl: 'views/events/index.html',
        	controller: ''
        })

    $locationProvider.html5Mode(true);

});