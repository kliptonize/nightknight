nkDirectives.directive('searchbox', ["$timeout", "$interval", "$rootScope", "$sce", function($timeout, $interval, $rootScope, $sce) {
  return {
  	link: function(scope, element, attr) {	
  			scope.placeholder = "Find your city and press enter";
  			scope.activeSearch = false;
  			scope.helpText = $sce.trustAsHtml("Find your nearest lookout spot<span class='hide-mobile'> online, and become the hero your city deserves:</span>");

			var placeholders = [
				"Find your city and press enter", 
				"Living in Antwerp? Try 'Antwerp' and hit enter ;)", 
				"Come on, have a look!", 
				"Try something like 'San Francisco', or 'Brussels'.."], 
			lastPlaceholderIndex = 0;

			if($(window).width() >= "768"){
				//Loop-play placeholders
				$timeout(function(){
					//Clear the placeholder
					clearPlaceholder();
				}, scope.animationDelay);
			}else{
				//Don't be crazy, show just a small text
				scope.placeholder = '"Antwerp"';
			}

			var clearPlaceholder = function(){
				var clearPlaceholderInterval = $interval(function(){
					if(scope.placeholder.length == 0){
						$interval.cancel(clearPlaceholderInterval);
						if(!scope.activeSearch){
							fillPlaceholder();
						}
					}else{
						//Remove a letter
						scope.placeholder = scope.placeholder.substring(0, scope.placeholder.length-1);
					}
				}, 50);
			}

			var fillPlaceholder = function(){
				var newPlaceholderIndex;
				do{
					newPlaceholderIndex = Math.floor(Math.random() * placeholders.length);
				}while(newPlaceholderIndex == lastPlaceholderIndex);
				lastPlaceholderIndex = newPlaceholderIndex;
				var count = 1;
				var fillPlaceholderInterval = $interval(function(){
					if(count > placeholders[newPlaceholderIndex].length){
						$interval.cancel(fillPlaceholderInterval);
						$timeout(function(){
							if(!scope.activeSearch){
								clearPlaceholder();
							}
						}, scope.animationDelay);
					}else{
						//Add a letter
						scope.placeholder = placeholders[newPlaceholderIndex].substring(0, count);
						count++;
					}
				}, 50);
			}

			scope.searchLocation = function(){
				//Update view
				$rootScope.$broadcast('search.startSearch', {query: scope.searchQuery});
				scope.activeSearch = true;
				scope.helpText = $sce.trustAsHtml("These results are still fake.. <i>I'm working on it!</i>");

				$timeout(function(){
					var results = [
						{
							title: "San Francisco bay",
							img: "../assets/images/results/J98HWXTPPV.jpg",
							claims: 254,
							date: "November 25th, 1991",
							place: "San Francisco"
						},
						{
							title: "New York City",
							img: "../assets/images/results/74Z0WS8M8G.jpg",
							claims: 254,
							date: "September 8th, 2016",
							place: "New York"
						}
					];
					$rootScope.$broadcast('search.gotResults', {results: results});
				}, 2000);

				//Start location search
			}
		},
		restrict: 'AEC',
		scope: {
			animationDelay: "="
		},
		templateUrl: 'app/directives/searchbox/searchbox.template.html'
  };
}]);
