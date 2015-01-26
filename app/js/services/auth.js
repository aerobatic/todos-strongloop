angular.module('todomvc').factory('AuthService', function(User, LoopBackAuth, $q, $rootScope) {  
  function login(email, password) {
    return User
      .login({rememberMe: true}, {email: email, password: password})
      .$promise
      .then(function(response) {
        // Store the user in localStorage
        localStorage['email'] = email;
        $rootScope.currentUser = {
          id: response.user.id,
          tokenId: response.id,
          email: email
        };
      });
  }

  function logout() {
    return User
     .logout()
     .$promise
     .then(function() {
       $rootScope.currentUser = null;
       LoopBackAuth.clearUser();
       LoopBackAuth.clearStorage();
     });
  }

  function register(email, password) {
    return User
      .create({
       email: email,
       password: password
     })
     .$promise;
  }

  function init() {
    var email = localStorage.email;
    var accessTokenId = LoopBackAuth.accessTokenId;
    var userId = LoopBackAuth.currentUserId;

    // If we have an email, accessToken, and userId restore the 
    // user to avoid having to login again.
    if (email && accessTokenId && userId) {
      $rootScope.currentUser = {
        id: userId,
        tokenId: accessTokenId,
        email: email
      };
    }
  }

  return {
    login: login,
    logout: logout,
    register: register,
    init: init
  };
});