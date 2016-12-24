
myApp.controller('confirmEmailController', ['$scope', 'eventFriendsFactory', '$location', '$cookies',  function ($scope, eventFriendsFactory, $location, $cookies ){

  $scope.confirmEmail = function() {
    $scope.passcodeError = true;
    eventFriendsFactory.confirmEmail($scope.user, function(data) {
      console.log(data)
      if(data.data.firstName) {
        $cookies.put('loginId', data.data._id)
        $location.url('/')
      }
      if(data.data.null){
        $scope.passcodeError = false;
        $scope.passcode = "Entered passcode is not valid"
      }
    })
  }

}])