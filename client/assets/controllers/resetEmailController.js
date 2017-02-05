
myApp.controller('resetEmailController', ['$scope', 'eventFriendsFactory', '$location', '$cookies',  function ($scope, eventFriendsFactory, $location, $cookies ){

  $scope.resetPassword = function() {
    $scope.noEmailError = true;
    $scope.passcodeMessage = true;
    eventFriendsFactory.resetPassword($scope.user, function(data) {
      if(data.data == null){
        $scope.noEmailError = false;
        $scope.noEmail = "Entered email is not registered"
      }
      if(data.data.passcode) {
        $scope.passcodeMessage = false;
        $scope.passcodeMessageMessage = "Check your email. Do not leave this page. Enter your passcode below."
      }
      console.log(data)
    })
  }
  $scope.finalReset = function() {
    $scope.passcodeError = true;
    $scope.CPError = true;
    $scope.PError = true;
    eventFriendsFactory.finalReset($scope.user, function(data) {
      console.log(data.data)
      if(data.data.firstName) {
        $cookies.put('loginId', data.data._id)
        $location.url('/')
      }
      if(data.data.null){
        $scope.passcodeError = false;
        $scope.passcode = "Entered passcode is not valid"
      }
      if(data.data.notmatch){
        $scope.CPError = false;
        $scope.confirmPasswordError = data.data.notmatch
      }
      if(data.data.errors.password) {
        $scope.PError = false
        $scope.passwordError = data.data.errors.password.message  
      }
    })
  }

}])