app.config(function($routeProvider, $locationProvider) {

    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'views/home/index.html',
            controller: 'MainController'
        })
        .when('/events', {
        	templateUrl: 'views/events/index.html',
        	controller: ''
        })

    $locationProvider.html5Mode(true);

});