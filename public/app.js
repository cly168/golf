var app = angular.module('golf', ['ngRoute','ui.bootstrap']);

app.config(function($routeProvider, $locationProvider) {

    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'views/home/index.html',
            controller: 'HomeController'
        })
        .when('/events', {
        	templateUrl: 'views/events/index.html'
        })
        .when('/servicefee', {
        	templateUrl: 'views/servicefee/index.html'
        })
        .when('/staff', {
        	templateUrl: 'views/staff/index.html'
        })
        .when('/gallery', {
        	templateUrl: 'views/gallery/index.html'
        })

    $locationProvider.html5Mode(false).hashPrefix('');

});