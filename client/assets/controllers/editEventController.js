myApp.controller('editEventController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', '$http', 'NgMap', 'Upload', 'reverseGeocode', function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, $http, NgMap, Upload, reverseGeocode ){

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

  $scope.getAddress = function() {
    console.log('here')
    reverseGeocode.geocodePosition(vm.lat, vm.lng, function(address){
       vm.formatted_address = address;
       $routeParams.address = vm.formatted_address
       eventFriendsFactory.saveAddress($routeParams, function(data) {
        scope.check = data.data
      })       
    });
  }

  $scope.editEvent = function() {
    $scope.ETError = true
    $scope.EDError = true
    $scope.EDError = true
    $scope.SArror = true
    $scope.CError = true
    $scope.NPError = true
    $scope.ECError = true
    $scope.SError = true
    $scope.ZError = true
    // $scope.event.date = new Date($scope.event.date)
    eventFriendsFactory.editEvent($routeParams.id, $scope.event, function(data){
      $scope.check = data
      if(data.data.n) {
        address= data.config.data.streetAddress + " " + data.config.data.city + " " + data.config.data.state + " " + data.config.data.zipcode 
          $http.get('https://maps.google.com/maps/api/geocode/json?address=' + address + '&sensor=false').then(function(mapData) {
            $scope.latLon.lat = mapData.data.results[0].geometry.location.lat
            $scope.latLon.lon = mapData.data.results[0].geometry.location.lng
            $scope.latLon.id = $routeParams.id
            eventFriendsFactory.latLon($scope.latLon)
            $location.url('/showEvent/' + $routeParams.id)
            }).catch( function(response) {
              alert("Address failed! Add a valid address while editing event. Otherwise your event will not show up in searches.")
              $location.url('/event/' + $routeParams.id)
          })  
      }
      if(data.data.kind == "number") {
        $scope.NPError = false
        $scope.numberParticipantsError = "Field inputs required" 
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
      if(data.data.errors.category) {
        $scope.ECError = false
        $scope.eventCategoryError = data.data.errors.category.message  
      }
    })
  }
  $scope.removeEvent = function() {
    var remove = confirm("are you sure you want to remove event?") 
    if (remove == true) {
      eventFriendsFactory.removeEvent($routeParams.id, function(data) {
        scope.check = data.data
      })
    }
    $location.url('/allEvents')
  }

  // $scope.getAddress = function() {
  //     eventFriendsFactory.getAddress($routeParams.id, function(data) {
  //       scope.check = data.data
  //     })
  // }

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