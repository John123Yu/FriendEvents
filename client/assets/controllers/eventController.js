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
      $scope.user = data.data
    })
  })

  $scope.addEvent = function() {
    $scope.ETError = true
    $scope.EDError = true
    $scope.EDError = true
    $scope.SArror = true
    $scope.CError = true
    $scope.NPError = true
    $scope.ECError = true
    $scope.SError = true
    $scope.ZError = true
    $scope.event.creater = loginId
    eventFriendsFactory.addEvent($scope.event, function(data) {
      $scope.check = data
      if(!data.data.errors) {
        //----The code here combines address components to make a full address. The full address is then sent to google geolocator API to obtain the coordinates of the address. This allows the distance between users and events to be later calculated and displayed in miles---------//
        address= data.data.streetAddress + " " + data.data.city + " " + data.data.state + " " + data.data.zipcode 
        $http.get('https://maps.google.com/maps/api/geocode/json?address=' + address + '&sensor=false').then(function(mapData) {
          $scope.latLon.lat = mapData.data.results[0].geometry.location.lat
          $scope.latLon.lon = mapData.data.results[0].geometry.location.lng
          $scope.latLon.id = data.data._id
          eventFriendsFactory.latLon($scope.latLon)
          }).catch( function(response) {
            //------If the address did not successfully get coordinates from the API, a toast message will be displayed-------//
            toaster.pop('error', "", 'The address you entered was not valid. Edit your address, otherwise your event will not show up in searches.');
          }) 
          toaster.pop('success', "", 'Your event has been created. Make sure to upload pictures next.');
          $location.url('/event/' + data.data._id)
      }
      if(data.data.errors.title) {
        $scope.ETError = false
        $scope.eventTitleError = data.data.errors.title.message  
      }
      if(data.data.errors.description) {
        $scope.EDError = false
        $scope.eventDescriptionError = data.data.errors.description.message  
      }
      if(data.data.errors.date) {
        $scope.EDError = false
        $scope.eventDateError = data.data.errors.date.message  
      }
      if(data.data.errors.streetAddress) {
        $scope.SAError = false
        $scope.streetAddressError = data.data.errors.streetAddress.message  
      }
      if(data.data.errors.city) {
        $scope.CError = false
        $scope.cityError = data.data.errors.city.message  
      }
      if(data.data.errors.state) {
        $scope.SError = false
        $scope.stateError = data.data.errors.state.message  
      }
      if(data.data.errors.zipcode) {
        $scope.ZError = false
        $scope.zipcodeError = data.data.errors.zipcode.message  
      }
      if(data.data.errors.participants) {
        $scope.NPError = false
        $scope.numberParticipantsError = data.data.errors.participants.message  
      }
      if(data.data.errors.category) {
        $scope.ECError = false
        $scope.eventCategoryError = data.data.errors.category.message  
      }
    }); 
  }
  $scope.leaveEvent = function(eventId) {
    $scope.leave = {}
    $scope.leave.id = eventId
    eventFriendsFactory.leaveEvent($scope.leave, function(data) {
      $scope.check = data;
    })
  }



}])