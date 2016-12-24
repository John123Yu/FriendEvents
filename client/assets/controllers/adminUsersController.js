myApp.controller('adminUsersController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', '$interval',  function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, $interval ){

  if(!$cookies.get('loginId')) {
    $location.url('/login')
  }

  var loginId = $cookies.get('loginId')
  $scope.loginId = loginId
  $scope.check = 0;
  $scope.pass = {}
  $scope.notification = false;

  eventFriendsFactory.getOneUser(loginId, function(data){
          console.log(data.data)
          if(data.data.admin != "true") {
            $location.url('/')
          }
  })

  $scope.$watch('check', function(newValue, oldValue) {
    eventFriendsFactory.getAllUsers(function(data){
      $scope.allUsers = data.data;
    })
    eventFriendsFactory.getAllEvents(function(data){
      $scope.allEvents = data.data;
    })
  })

  $scope.deleteEvent = function(id) {
    var deleteEvent= confirm("Are you sure you want to delete event?")
    if(deleteEvent) {
      eventFriendsFactory.removeEvent(id, function(data) {
      $scope.check = Math.random();
    })
    }
  }

  $scope.deleteUser = function(id) {
    var deleteFriend = confirm("Are you sure you want to delete user?")
    if (deleteFriend) {
      eventFriendsFactory.removeUser(id, function(data) {
      $scope.check = Math.random();
    })
  }
  }

  $scope.deletePast = function() {
    var deletePast = confirm("Are you sure you want to delete past events?")
    if(deletePast) {
      eventFriendsFactory.deletePast(function(data) {
        $scope.check = data;
      })
    }
  }

}])