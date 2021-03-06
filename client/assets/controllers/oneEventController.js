myApp.controller('oneEventController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', '$http', 'NgMap', 'Upload', 'toaster', function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, $http, NgMap, Upload, toaster ){

  if(!$cookies.get('loginId')) {
    $location.url('/login')
  }
  var loginId = $cookies.get('loginId')
  $scope.loginId = loginId
  $scope.check = 0;
  $scope.events;
  $scope.eventInfo = {};
  $scope.latLon = {};
  var address;
  var EarthRadius = 3961
  $scope.photo1 = true;
  $scope.photo2 = true;

  $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyCm0JOLmIsxPEnstWSdXKz7bYkb4d1flRY"
  NgMap.getMap().then(function(map) {
  });

  eventFriendsFactory.getOneEvent($routeParams.id, function(data){
    console.log(data.data)
    $scope.eventInfo = data.data
    $scope.lat = data.data.lati
    $scope.lng = data.data.longi
    var yourLocation = new Loc($cookies.get('lat'), $cookies.get('lng'))
    var eventLocation = new Loc(data.data.lati, data.data.longi)
    $scope.distance = dist(yourLocation, eventLocation)
  })

  eventFriendsFactory.getOneEventUsers($routeParams.id, function(data){
    console.log(data.data)
    $scope.interestedFriends = data.data
  })

  $scope.$watch('check', function(newValue, oldValue) {
    eventFriendsFactory.getOneEvent($routeParams.id, function(data){
      $scope.eventInfo = data.data 
      if(!$scope.eventInfo.fullAddress) {
        $scope.eventInfo.fullAddress = $scope.eventInfo.streetAddress + ", " + $scope.eventInfo.city + " " +  $scope.eventInfo.state + ". " +  $scope.eventInfo.zipcode
      }
      if(!$scope.eventInfo.event1Url && $scope.eventInfo.category == "Concert") {
        $scope.eventInfo.event1Url = "/mrxd-j9-4ps-daniel-robert.jpg"
        $scope.eventInfo.event2Url = "/cushbgbdxc0-desi-mendoza.jpg"
      }
      if(!$scope.eventInfo.event1Url && $scope.eventInfo.category == "Sports") {
        $scope.eventInfo.event2Url = "/ae4kypxwhr8-joshua-peacock.jpg"
        $scope.eventInfo.event1Url = "/m6owr3op4do-rob-bye.jpg"
      }
      if(!$scope.eventInfo.event1Url && $scope.eventInfo.category == "Performing-arts") {
        $scope.eventInfo.event1Url = "/xxa8ptuld1y-neal-kharawala.jpg"
        $scope.eventInfo.event2Url = "/theatre-seats.jpg"
      }
      if(!$scope.eventInfo.event1Url && $scope.eventInfo.category == "Community Event") {
        $scope.eventInfo.event1Url = "/poxhu0uedcg-aranxa-esteve.jpg"
        $scope.eventInfo.event2Url = "/ds0zia5gzc4-nina-strehl.jpg"
      }
      if(!$scope.eventInfo.event1Url && $scope.eventInfo.category == "Festival") {
          $scope.eventInfo.event1Url = "/festival6.jpg"
          $scope.eventInfo.event2Url = "/festival2.jpg"
        }
    })
  })

  $scope.joinEvent = function() {
    $scope.eventInfo.joinerId = loginId
    eventFriendsFactory.joinEvent($scope.eventInfo, function(data) {
      if(data.data.already){
      } else {
        toaster.pop('success', "", "You've joined this event. Make sure to check out the group chat");
      }
    }); 
  }

}])