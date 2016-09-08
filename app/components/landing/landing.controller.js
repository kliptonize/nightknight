nkControllers.controller('LandingController',["$scope", "$interval", function($scope, $interval) {
	$scope.fakeSessionVariables = {
		session: "#",
		userid: "#",
		duration: "00:00:00",
	};

	$scope.search = {
		isActive: false,
		results: []
	};

	/* SCOPE FUNCTIONS */
	$scope.switchSearchResult = function(way){
		var keyCheck = -1;
		angular.forEach($scope.search.results, function(result, key) {
		  if(result.active){
		  	keyCheck = key;
		  }
		});
		switch(way){
			case "next":
				if(keyCheck < ($scope.search.results.length-1)){
					$scope.search.results[keyCheck].active = false;
					$scope.search.results[keyCheck+1].active = true;
				}
				break;
			case "prev":
				if(keyCheck > 0){
					$scope.search.results[keyCheck].active = false;
					$scope.search.results[keyCheck-1].active = true;
				}
				break;
			default:
				break;
		}
	}

	/* LISTENERS */

	$scope.$on("search.startSearch", function(event, data){
		console.log(data.query);
		$scope.search.isActive = true;
	});


	$scope.$on("search.gotResults", function(event, data){
		$scope.search.results = data.results;
		angular.forEach($scope.search.results, function(result, key) {
		  result.active = false;
		});
		$scope.search.results[0].active = true;
	});

	var initiateNumbers = function(){
		fillElement("session", Math.floor(Math.random() * 100000000)+536135, "right");
		fillElement("userid", Math.floor(Math.random() * 100000000)+765637, "right");
		var duration = 0;
		var durationInterval = $interval(function(){
			if(!$scope.search.isActive){
				duration++;
				$scope.fakeSessionVariables.duration = readTime(duration);
			}else{
				$interval.cancel(durationInterval);
			}
		}, 1000);
	}

	var readTime = function(duration){
		var h=0,m=0,s=0;
		s = duration % 60;
		m = Math.floor(duration/60) % 60;
		h = Math.floor(duration/(60*60)) % 24;
		if(s < 10){
			s = "0" + s;
		}
		if(m < 10){
			m = "0" + m;
		}
		if(h < 10){
			h = "0" + h;
		}
		return h + ":" + m + ":" + s;
	}

	var fillElement = function(element, value, from){
		var count = 0;
		value = value.toString();
		var fillInterval = $interval(function(){
			if(count > value.length){
				$interval.cancel(fillInterval);
				return true;
			}else{
				switch(from){
					case "left":
					default:
						$scope.fakeSessionVariables[element] = value.substring(0, count);
						break;
					case "right":
						$scope.fakeSessionVariables[element] = value.substring(value.length-count);
						break;
				}
				count++;
			}
		}, 50);
	}

	if($(window).width() >= "768"){
		//Initiate counter
		initiateNumbers();
	}
}]);