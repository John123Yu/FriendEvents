
myApp.controller('confirmEmailController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$rootScope',  function ($scope, eventFriendsFactory, $location, $cookies, $rootScope ){

  $scope.confirmEmail = function() {
    $scope.passcodeError = true;
    eventFriendsFactory.confirmEmail($scope.user, function(data) {
      console.log(data)
      if(data.data.firstName) {
        $cookies.put('loginId', data.data._id)
        $rootScope.$emit("loggedIn", {});
        $location.url('/')
      }
      if(data.data.null){
        $scope.passcodeError = false;
        $scope.passcode = "Entered passcode is not valid"
      }
    })
  }

}])