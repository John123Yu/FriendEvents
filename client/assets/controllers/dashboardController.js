myApp.controller('dashboardController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', 'toaster',  function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, toaster ){

//----------- Makes sure the user is logged in--------//
if(!$cookies.get('loginId')) {
  $location.url('/login')
}
var loginId = $cookies.get('loginId')
$scope.loginId = $cookies.get('loginId')

//-- The code here handles the max distance between user and events for event searches. Default 50 miles----//
if(!$cookies.get('distanceSetting')){
  $cookies.put('distanceSetting', 50)
}
$scope.distanceSetting = {}
$scope.distanceSetting.distance = $cookies.get('distanceSetting')

//------This keeps track of the last event that the user has seen. Not perfect, needs to be optimized----//
if(!$cookies.get('lastSeen')) {
  var i = -1;
} else {
  var i = $cookies.get('lastSeen');  
}

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
});

//-------API to google for the current coordinates of the user----------//
navigator.geolocation.getCurrentPosition(function (position) {
  $cookies.put('lat', position.coords.latitude)
  $cookies.put('lng', position.coords.longitude)
});

var yourLocation = new Loc($cookies.get('lat'), $cookies.get('lng'))
$scope.location = {};
$scope.location.location = yourLocation;
$scope.location.userId = loginId;


//-----Code below searches for and gets events within desired distance----//
if($cookies.get('loginId')) {
    $scope.distanceSetting.latDif = ($cookies.get('distanceSetting') / 69)
    $scope.distanceSetting.lonDif = $cookies.get('distanceSetting')  / (69 * Math.cos(toRad($cookies.get('lat')))) 
    $scope.distanceSetting.lat = $cookies.get('lat')
    $scope.distanceSetting.lng = $cookies.get('lng')
    eventFriendsFactory.getEvents($scope.distanceSetting, function(data) {
      $scope.allEvents = data.data
      console.log(data.data)
      //------incrementI is how the user browses through events ------//
       incrementI = function() {
        $cookies.put('lastSeen', i)
        i++;
        if(i >= $scope.allEvents.length) {
          toaster.pop('info', "", 'You have seen all the events. Did not find anything you like? Create your own event.');
          i = 0;
          $cookies.put('lastSeen', i)
        }
        $scope.event = $scope.allEvents[i]
        $scope.lat = $scope.event.lati
        $scope.lng = $scope.event.longi
        var yourLocation = new Loc($cookies.get('lat'), $cookies.get('lng'))
        var eventLocation = new Loc($scope.lat, $scope.lng)
        $scope.distance = dist(yourLocation, eventLocation)
        if(Math.floor($scope.distance) > Math.floor($cookies.get('distanceSetting'))) {
          incrementI();
        }
        if(!$scope.event.fullAddress) {
          $scope.event.fullAddress = $scope.event.streetAddress + ", " + $scope.event.city + " " +  $scope.event.state + ". " +  $scope.event.zipcode
        }
        //------The code here is a bit verbose, but basically sets default images based on the category of the event. Since I'm pulling events from an API, many events do not have specific images. Not ideal, but saves time-----//
        if(!$scope.event.event1Url && $scope.event.category == "Concert") {
          $scope.event.event1Url = "/mrxd-j9-4ps-daniel-robert.jpg"
          $scope.event.event2Url = "/cushbgbdxc0-desi-mendoza.jpg"
        }
        if(!$scope.event.event1Url && $scope.event.category == "Sports") {
          $scope.event.event2Url = "/basketball-hoop.jpg"
          $scope.event.event1Url = "/old-soccer-ball.jpg"
        }
        if(!$scope.event.event1Url && $scope.event.category == "Performing-arts") {
          $scope.event.event1Url = "/xxa8ptuld1y-neal-kharawala.jpg"
          $scope.event.event2Url = "/theatre-seats.jpg"
        }
        if(!$scope.event.event1Url && $scope.event.category == "Community Event") {
          $scope.event.event1Url = "/poxhu0uedcg-aranxa-esteve.jpg"
          $scope.event.event2Url = "/ds0zia5gzc4-nina-strehl.jpg"
        }
        if(!$scope.event.event1Url && $scope.event.category == "Festival") {
          $scope.event.event1Url = "/festival6.jpg"
          $scope.event.event2Url = "/festival2.jpg"
        }
       }
       incrementI();
    })

}

//-----allows user to change desired distance between events and user-----///
$scope.setDistance = function() {
  $cookies.put('distanceSetting', $scope.setting.distance)
  $scope.distanceSetting.distance = $scope.setting.distance
  $scope.distanceSetting.latDif = ($scope.setting.distance / 69)
  $scope.distanceSetting.lonDif = ($scope.setting.distance / (69 * Math.cos($cookies.get('lat')))) 
  // Longitude: 1 deg = 111.320*cos(latitude) km
  $scope.distanceSetting.userId = loginId
     eventFriendsFactory.getEvents($scope.distanceSetting, function(data) {
      $scope.allEvents = data.data
    })
}

$scope.joinEvent = function() {
  toaster.pop('success', "", 'You have joined this event. Check "Your Events" for a list of all your events');
  $scope.event.joinerId = loginId
  eventFriendsFactory.joinEvent($scope.event, function(data) {
  }); 
  incrementI();
}
$scope.passEvent = function () {
  incrementI();
}

}])