app.controller('navbarController', ['$scope','$location', function($scope, $location){
	console.log('navbar')
	
}])

// Component
app.component('navbar', {
	templateUrl: 'components/navbar/index.html',
	controller: 'navbarController'
})