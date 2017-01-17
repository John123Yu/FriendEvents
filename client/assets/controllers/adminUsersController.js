myApp.controller('adminUsersController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', '$interval', 'reverseGeocode','toaster', function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, $interval, reverseGeocode, toaster ){

  if(!$cookies.get('loginId')) {
    $location.url('/login')
  }



  var loginId = $cookies.get('loginId')
  $scope.loginId = loginId
  $scope.check = 0;
  $scope.pass = {}
  $scope.notification = false;
  var vm = this;
  vm.formatted_address = "";

  $scope.$watch('check', function(newValue, oldValue) {
    eventFriendsFactory.getAllUsers(function(data){
      $scope.allUsers = data.data;
    })
    eventFriendsFactory.getAllEvents(function(data){
      $scope.allEvents = data.data;
    })
  })

  eventFriendsFactory.getOneUser(loginId, function(data){
          if(data.data.admin != "true") {
            $location.url('/')
          }
  })

  $scope.updateAddress = function(event) {
    if( event.city == " " && event.state == " " && !event.fullAddress) {
      vm.lat = event.lati;
      vm.lng = event.longi;
      reverseGeocode.geocodePosition(vm.lat, vm.lng, function(address){
         vm.formatted_address = address;
         event.address = vm.formatted_address
         eventFriendsFactory.saveAddress(event, function(data) {
          scope.check = data.data
        })       
      })
    }
  }

  $scope.getEventsAPI = function() {
    eventFriendsFactory.getEventsAPI(function(data){
        console.log(data.data)
        $scope.check = Math.random()
    })
  }

  $scope.deleteEvent = function(id) {
    console.log("here")
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