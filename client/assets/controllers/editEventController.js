myApp.controller('editEventController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', '$http', 'NgMap', 'Upload', 'reverseGeocode', 'toaster', function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, $http, NgMap, Upload, reverseGeocode, toaster ){

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
  var vm = this;
  vm.formatted_address = "";
  $scope.photo1 = true;
  $scope.photo2 = true;


  $scope.$watch('check', function(newValue, oldValue) {
    eventFriendsFactory.getOneEvent($routeParams.id, function(data){
      $scope.eventInfo = data.data
      $scope.event = data.data
      vm.lat = data.data.lati;
      vm.lng = data.data.longi;
      $scope.event.date = new Date($scope.event.date)
      if($cookies.get('loginId') != $scope.eventInfo.creater[0]._id && $scope.eventInfo.creater[0].admin != "true"){
        $location.url('/')
      }
    })
  })

  $scope.editEvent = function() {
    eventFriendsFactory.editEvent($routeParams.id, $scope.event, function(data){
      $scope.check = data
      if(data.data.n) {
        address= data.config.data.streetAddress + " " + data.config.data.city + " " + data.config.data.state + " " + data.config.data.zipcode 
        //------checks if address entered is valid, if so, updates coordinates of event----//
          $http.get('https://maps.google.com/maps/api/geocode/json?address=' + address + '&sensor=false').then(function(mapData) {
            $scope.latLon.lat = mapData.data.results[0].geometry.location.lat
            $scope.latLon.lon = mapData.data.results[0].geometry.location.lng
            $scope.latLon.id = $routeParams.id
            eventFriendsFactory.latLon($scope.latLon)
            $location.url('/showEvent/' + $routeParams.id)
            }).catch( function(response) {
              toaster.pop('warning', "", 'The address you entered was not valid. Edit your address, otherwise your event will not show up in searches.');
              $location.url('/event/' + $routeParams.id)
          })  
      }
    })
  }

  $scope.removeEvent = function(e) {
    e.preventDefault()
    var remove = confirm("are you sure you want to remove event?")
    if (remove == true) {
      eventFriendsFactory.removeEvent($routeParams.id, function(data) {
      $location.url('/allEvents')
      })
    }
  }

  //----This code here is for events gotten from API. API only gives coordinates. Coordinates are reverse geolocated to get event address ----//
  $scope.getAddress = function(e) {
    e.preventDefault()
    reverseGeocode.geocodePosition(vm.lat, vm.lng, function(address){
       vm.formatted_address = address;
       $routeParams.address = vm.formatted_address
       eventFriendsFactory.saveAddress($routeParams, function(data) {
        scope.check = data.data
      })       
    });
  }

  $scope.uploadEventPic1 = function(image) {
    $scope.upload = Upload.upload({
    url: '/uploadEventPic1',
    method: 'POST',
    data: {
      file: image,
      id: $routeParams.id
    },
    file: image
  }).success(function(data, status, headers, config) {
    console.log('event 1 photo uploaded')
    $scope.check = data
  }).error(function(err) {
    console.log('event 1 photo upload failure')
  });
  } 

  $scope.uploadEventPic2 = function(image) {
    $scope.upload = Upload.upload({
    url: '/uploadEventPic2',
    method: 'POST',
    data: {
      file: image,
      id: $routeParams.id
    },
    file: image
  }).success(function(data, status, headers, config) {
    console.log('event 2 photo uploaded')
    $scope.check = data
  }).error(function(err) {
    console.log('event 2 photo upload failure')
  });
  } 

}])