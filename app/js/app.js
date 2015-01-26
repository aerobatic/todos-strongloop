/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ngRoute', 'lbServices', 'Aerobatic', 'templates'])
	.config(function ($routeProvider, $locationProvider, $httpProvider, LoopBackResourceProvider, LoopBackAuthProvider, aerobaticProvider) {
		'use strict';

		$locationProvider.html5Mode(true);
		LoopBackResourceProvider.setUrlBase('https://loopback-todos-api.herokuapp.com/api');
		// LoopBackAuthProvider.rememberMe = true;

    $httpProvider.interceptors.push(function($q, $location) {
      return {
        responseError: function(rejection) {
          if (rejection.status == 401) {
            $location.nextAfterLogin = $location.path();
            $location.path('/login');
          }
          return $q.reject(rejection);
        }
      };
    });

  	$routeProvider
			.when('/todos', {
        controller: 'TodoCtrl',
        templateUrl: aerobaticProvider.templateUrl('views/todos-index.html'),
        secure: true
      }).when('/login', {
      	controller: 'AuthLoginController',
      	templateUrl: aerobaticProvider.templateUrl('views/login.html')
      }).when('/log-out', {
      	controller: 'AuthLogoutController',
        templateUrl: 'logout.html'
      }).when('/sign-up', {
      	controller: 'SignUpController',
      	templateUrl: aerobaticProvider.templateUrl('views/sign-up.html')
      }).when('/sign-up-success', {
	      templateUrl: aerobaticProvider.templateUrl('views/sign-up-success.html')
      }).otherwise('/login');
	})
	.run(function($rootScope, $location, $log, $timeout, AuthService) {
		AuthService.init();

		// $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
		// 	// if (redirectingToLogin === true) return;

  //     // redirect to login page if not logged in
  //     if (!$rootScope.currentUser) {
  //     	if (newUrl && /login/.test(newUrl) === false) {
  //     		// redirectingToLogin = true;
	 //      	$log.info("No current user, redirecting to login");
	 //      	$timeout(function() {
	 //      		$location.path('/login');	
	 //      	})
	      	
	 //      	event.preventDefault();
	 //      	return;
	 //        // event.preventDefault(); //prevent current page from loading
	 //        // $rootScope.$evalAsync(function() {
	 //        	// redirectingToLogin = false;
	 //        	// $location.path('/login');
	 //        // });
	        
	 //        // event.preventDefault();
	 //       //  $rootScope.$evalAsync(function() {
		//       //   $location.path('/login');
		//       // });
	 //      }
  //     }
  //   });
	});