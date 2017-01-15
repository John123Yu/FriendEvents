myApp.controller('eventController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', '$http', 'NgMap', 'Upload',  function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, $http, NgMap, Upload ){

  if(!$cookies.get('loginId')) {
    $location.url('/login')
  }
  var loginId = $cookies.get('loginId')
  $scope.loginId = loginId
  $scope.check = 0;
  $scope.events;
  $scope.eventInfo = {};
  $scope.latLon = {}
  var address;
  var EarthRadius = 3961
  $scope.photo1 = true;
  $scope.photo2 = true;

  $scope.$watch('check', function(newValue, oldValue) {
    eventFriendsFactory.getUserEvents(loginId, function(data) {
      console.log(data.data.userEvents)
      $scope.user = data.data
      if(!data.data.Photo1) {
        $scope.photo1 = false;
                }
      if(!data.data.Photo2) {
        $scope.photo2 = false;
      }
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
        alert('Event Created! Make sure to upload pictures!')

        address= data.data.streetAddress + " " + data.data.city + " " + data.data.state + " " + data.data.zipcode 
        $http.get('https://maps.google.com/maps/api/geocode/json?address=' + address + '&sensor=false').then(function(mapData) {
          $scope.latLon.lat = mapData.data.results[0].geometry.location.lat
          $scope.latLon.lon = mapData.data.results[0].geometry.location.lng
          $scope.latLon.id = data.data._id
          eventFriendsFactory.latLon($scope.latLon)
          }).catch( function(response) {
            alert("Address failed! Add a valid address while editing event. Otherwise your event will not show up in searches.")
          })  
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