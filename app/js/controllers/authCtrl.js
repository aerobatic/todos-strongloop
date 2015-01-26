angular.module('todomvc').controller('AuthLoginController', function($scope, AuthService, $location) {
  $scope.user = {
    email: '',
    password: ''
  };

  $scope.login = function() {
    AuthService.login($scope.user.email, $scope.user.password)
      .then(function() {
        var next = $location.nextAfterLogin || '/todos';
        $location.nextAfterLogin = null;
        $location.path(next);
      });
  };

  $scope.signup = function() {
    $location.path('/sign-up');
  };
})
.controller('AuthLogoutController', function($scope, AuthService, $location, $log) {
  $log.info("Logging out");
  AuthService.logout()
    .then(function() {
      $log.info("Logged out");
      $location.path('/login');
    }, function(err) {
      
    });
})
.controller('SignUpController', function($scope, AuthService, $location) {
  $scope.user = {
    email: '',
    password: ''
  };

  $scope.register = function() {
    AuthService.register($scope.user.email, $scope.user.password)
      .then(function() {
        $location.path('/sign-up-success');
      });
  };

  $scope.cancel = function() {
    $location.path('/login');
  }
});