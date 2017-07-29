app.config(function($routeProvider, $locationProvider) {

    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'views/home/index.html',
            controller: 'MainController'
        })

    $locationProvider.html5Mode(true);

});