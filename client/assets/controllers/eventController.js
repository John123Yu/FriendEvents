myApp.controller('eventController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', '$http', 'NgMap', 'Upload', 'toaster',  function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, $http, NgMap, Upload, toaster ){

  if(!$cookies.get('loginId')) {
    $location.url('/login')
  }
  var loginId = $cookies.get('loginId')
  $scope.loginId = loginId
  $scope.events;
  $scope.eventInfo = {};
  $scope.latLon = {}
  var address;

  $scope.$watch('check', function(newValue, oldValue) {
    eventFriendsFactory.getUserEvents(loginId, function(data) {
      $scope.userEvents = data.data
      console.log(data.data)
    })
  })

  $scope.addEvent = function() {
    $scope.event.creater = loginId
    eventFriendsFactory.addEvent($scope.event, function(data) {
      $scope.check = data
      console.log(data.data)
      if(!data.data.errors) {
        //----The code here combines address components to make a full address. The full address is then sent to google geolocator API to obtain the coordinates of the event address. ---------//
        address= data.data.streetAddress + " " + data.data.city + " " + data.data.state + " " + data.data.zipcode 
        $http.get('https://maps.google.com/maps/api/geocode/json?address=' + address + '&sensor=false').then(function(mapData) {
          $scope.latLon.lat = mapData.data.results[0].geometry.location.lat
          $scope.latLon.lon = mapData.data.results[0].geometry.location.lng
          $scope.latLon.id = data.data._id
          eventFriendsFactory.latLon($scope.latLon)
          }).catch( function(response) {
            //------If the address did not successfully get coordinates from the API, a toast message will be displayed-------//
            toaster.pop('warning', "", 'The address you entered was not valid. Edit your address, otherwise your event will not show up in searches.');
          }) 
          toaster.pop('success', "", 'Your event has been created. Make sure to upload pictures next.');
          $location.url('/event/' + data.data._id)
      }
    }); 
  }

  $scope.leaveEvent = function(eventId) {
    $scope.leave = {}
    $scope.leave.eventId = eventId
    $scope.leave.userId = loginId
    eventFriendsFactory.leaveEvent($scope.leave, function(data) {
      $scope.check = data;
    })
  }



}])