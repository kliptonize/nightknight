//Initiate all config settings!
var baseUrl = "app/components/";

nkApp.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('!');
  	$urlRouterProvider.otherwise( function($injector, $location) {
        var $state = $injector.get("$state");
        $state.go("fe.index");
    });

	// Now set up the states
	$stateProvider
	.state('fe', {
		url: "",
		views: {
			"footer": {
				templateUrl: baseUrl + "core/footer/views/footer.template.html",
				controller: "FooterController"
			}
		}
	})
	.state('fe.index', {
		url: "/",
		views: {
			"body@": {
				templateUrl: baseUrl + "landing/views/landing.template.html",
				controller: "LandingController"
			}
		}
	});
}]);