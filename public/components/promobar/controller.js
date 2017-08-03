app.controller('promobarController', ['$scope', '$rootScope','factory', '$uibModal', 'authentication','$interval', '$sce', '$filter','$location', function($scope, $rootScope,factory, $uibModal, auth, $interval, $sce, $filter, $location){
	$scope.links = [];
	var favorites = [];
	$scope.carouselLinks = [];
	$scope.carousel = true;
	$scope.title='';
	$scope.search=true;
	$scope.accountVids = '';
	$scope.page = 1;
	var pageSize = 15;
	var terms = [];
	var categoryFilter = false;
	var category = '';


	// console.log($scope);
	// if($scope.$ctrl.data.type == 'new'){
		// console.log('Data type is new');
	// }
	$scope.myInterval = 0;
  	$scope.noWrap = true;
  	$scope.noTransition = true;
  	$scope.active = 0;
  	var slides = $scope.slides = [];
  	var currIndex = 0;

	//---MODAL--------------------------------------------
	var animationsEnabled = true;

	var init = function(){
		$scope.setPage(1);
		reload();
	}

	if($scope.$ctrl.data.demo){
		console.log('retrieve data')
		factory.getLink($scope.$ctrl.data.demo, (link)=>{
			$scope.openComponentModal(link);
		}, (err)=>{
			console.log(err);
		})
	}
	
	$scope.openComponentModal = function (link) {
	    var modalInstance = $uibModal.open({
	    	animation: animationsEnabled,
	    	component: 'modalComponent',
	    	resolve: {
	        	id: function() {
	        		return link;
	        	}
	    	}
	    });

	    modalInstance.closed.then(function () {
	    	$scope.update();
		});
	};
	//-------------------------------------------------------

	var trusted = {};
	$scope.popoverLink = function(link){
		// console.log($scope.links[j]);
		function sort(a,b){
			if(a.name > b.name){
				return 1;
			}else if(a.name < b.name){
				return -1;
			}
			return 0;
		}
		link.tag = link.tag.sort(sort)
		var html = '';
		for(var i =0; i< link.tag.length; i++){
			html+="<a href='#/tag/"+link.tag[i].name+"' class='popover-content' style='display: inline-block'>" + link.tag[i].name + "</a>";
		}
		html+=''
		return trusted[html] || (trusted[html] = $sce.trustAsHtml(html));
		// console.log($scope.popover_content);
	}

// Initialize the data for carousel and and all page
	function getLinks(links){
		if($scope.search_tag){
			// links = $filter('filter')(links, $scope.search_tag);
			links = $filter('searchFilter')(links, $scope.search_tag);
		}
		if(categoryFilter){
			links = $filter('category')(links, category);
		}
		$scope.links = links;
		if($scope.carousel && $scope.links.length > 0){
			// $scope.currIndex = links.length;
			var index = -1;
			$scope.carouselLinks = [];
			for(var i = 0; i < links.length; i++){
				if(i%3 == 0){
					$scope.carouselLinks.push([]);
					index++;
				}
				links[i].valid = true;
				$scope.carouselLinks[index].push(links[i]);
				if(i == 10){
					break;
				}
			}
			if($scope.carouselLinks[index].length == 3){
				$scope.carouselLinks.push([]);
				index++;
			}
			var seeAll = {
				'url' : 'img/see_more.jpg',
				'dest': $scope.$ctrl.data.type,
				'valid':false
			}
			$scope.carouselLinks[index].push(seeAll);
		}
		// console.log($scope.carouselLinks)
		$scope.setPage($scope.page);
		pageSetup();
	}

	$scope.getLogo = function(categoryName){
		return factory.getLogo(categoryName);
	}

	function error(error){
		console.log(error);
	}

	$scope.favorite = function(id){
		// console.log(id);
		if(auth.isLoggedIn()){
			var object = {
				'link': id,
				'user': auth.currentUser().email
			}
			factory.submitFavorite(object, reload, error);
		}
	}

	$scope.isFavorite = function(product){
		if($scope.isLoggedIn){
			for( var i = 0; i < favorites.length; i++){
				var favorite = favorites[i];
				// console.log(favorite.link, product)
				// console.log(favorite.link._id, product._id);
				if(favorite._id == product._id){
					// console.log('Match', product._id)
					return true;
				}
			}
		}
		return false;
	}

	function getFavorites(links){
		// console.log(links)
		favorites = links;
	}

	function pageSetup(){
		var page = $scope.page-1;
		var temp = [];
		var start = page * pageSize;
		for(var i = 0; i < pageSize; i++){
			var index = i + start;
			if(index >= $scope.links.length){
				break;
			}else{
				temp.push($scope.links[index]);
			}
		}
		$scope.linkList = temp;
		$scope.linkList = $scope.links
	}

	$scope.setPage = function(page){
		var currentList = $filter('filter')($scope.links, $scope.accountVids);
		$scope.pageCount = Math.ceil(currentList.length / pageSize);
		if(page > $scope.pageCount){
			page = $scope.pageCount;
		}else if(page <= 0){
			page = 1;
		}
		$scope.page = page;
		$scope.radioModel = page;
		pageSetup();
	}

	$scope.updatePage = function(term){
		$scope.accountVids = term;
		$scope.setPage($scope.page);
	}

	$scope.getPageCount = function(){
		return new Array($scope.pageCount);
	}

	$scope.currentPage = function(i){
		return $scope.page-1 == i;
	}

	function reload(data, emit){
		$scope.carousel = $scope.$ctrl.data.carousel;
		if($scope.$ctrl.data.type == 'account' && auth.isLoggedIn()){
			//load favorites
			$scope.getAccount();
		}else if($scope.$ctrl.data.type == 'new'){
			//load new videos
			$scope.getNew();
		}else if($scope.$ctrl.data.type == 'featured'){
			//load new videos
			$scope.getFeatured();
			
		}else if($scope.$ctrl.data.type == 'popular'){
			//load new videos
			$scope.getPopular();
		}else if($scope.$ctrl.data.type == 'tag'){
			//load new videos
			$scope.getTag();
		}else if($scope.$ctrl.data.type == 'category'){
			//load new videos
			$scope.getByCategory();
		}else{
			$scope.search = false;
			terms = $scope.$ctrl.data.type.split('&');
			factory.getLinks(getLinks, error);
		}
		
		$scope.isLoggedIn = auth.isLoggedIn();
		if($scope.isLoggedIn){
			$scope.currentUser = auth.currentUser();
			var user = auth.currentUser();
			factory.getFavorites(user, getFavorites, error);
		}else{
			$scope.currentUser = {};
			$scope.currentUser.email = '';
		}
		if(emit && emit==true){
			$scope.update();
		}
	}

	$scope.getAccount = function(){
		var user = auth.currentUser();
		$scope.title='Search My Cookbook'
		factory.getFavorites(user, getLinks, error);
	}

	$scope.getNew = function(){
		$scope.title='Search New Recipes'
		factory.getNew(getLinks, error);
	}

	$scope.getFeatured = function(){
		$scope.title='Search Featured Recipes'
		factory.getFeatured(getLinks, error);
	}

	$scope.getPopular = function(){
		$scope.title='Search Popular Recipes'
		factory.getPopular(getLinks, error);
	}

	$scope.getTag = function(){
		$scope.search = false;
		$scope.search_tag = $scope.$ctrl.data.tag;
		if(typeof($scope.search_tag) == 'undefined'){
			var argList = $location.url().split('#')
			if(argList.length > 1){
				$scope.search_tag = argList[1];
			}else{
				$location.path('/all/popular');
			}
		}
		factory.getLinks(getLinks, error);
	}
	$scope.getByCategory = function(){
		category = $scope.$ctrl.data.category;
		if(category == 'undefined'){
			console.log('undefined')
			$location.path('/all/popular');
		}
		categoryFilter = true;
		factory.getLinks(getLinks, error);
	}

	$scope.login = function(){
		$location.path('/login');
	}

	$scope.update = function(){
		// console.log('broadcasting');
		$rootScope.$broadcast('favorite');
		// $rootScope.$emit('favorite');
	};

	$scope.$on('favorite', function(event, args){
		// console.log('update');
		reload();
	});

	init();
}]);


// Component
app.component('promoBar', {
	bindings: {
		data: '='
	},
	templateUrl: 'components/promobar/index.html',
	controller: 'promobarController'
})
