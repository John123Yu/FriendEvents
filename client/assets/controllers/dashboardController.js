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
//-----lastUpdate checks if the events in the database have been updated within a certain time (such as an hour), or if the postion of the user has changed by a mile. If either is true, the events are updated. The update resets how far the user is from each individual event. This way queries for events can be made by distance between user and events. More about lastUpdate can be seen in the back-end controller----------//
if($cookies.get('loginId')) {
  eventFriendsFactory.lastUpdate($scope.location, function(data) {
    $scope.distanceSetting.userId = loginId
    eventFriendsFactory.getEvents($scope.distanceSetting, function(data) {
      $scope.allEvents = data.data
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
        if(!$scope.event.fullAddress) {
          $scope.event.fullAddress = $scope.event.streetAddress + ", " + $scope.event.city + " " +  $scope.event.state + ". " +  $scope.event.zipcode
        }
        //------The code here is a bit verbose, but basically sets default images based on the category of the event. Since I'm pulling events from an API, many events do not have specific images. Not ideal, but saves time-----//
        if(!$scope.event.event1Url && $scope.event.category == "Concert") {
          $scope.event.event1Url = "https://s3.amazonaws.com/friendevents/eventImage/mrxd-j9-4ps-daniel-robert.jpg"
          $scope.event.event2Url = "https://s3.amazonaws.com/friendevents/eventImage/cushbgbdxc0-desi-mendoza.jpg"
        }
        if(!$scope.event.event1Url && $scope.event.category == "Sports") {
          $scope.event.event2Url = "https://s3.amazonaws.com/friendevents/eventImage/ae4kypxwhr8-joshua-peacock.jpg"
          $scope.event.event1Url = "https://s3.amazonaws.com/friendevents/eventImage/m6owr3op4do-rob-bye.jpg"
        }
        if(!$scope.event.event1Url && $scope.event.category == "Performing-arts") {
          $scope.event.event1Url = "https://s3.amazonaws.com/friendevents/eventImage/xxa8ptuld1y-neal-kharawala.jpg"
          $scope.event.event2Url = "https://s3.amazonaws.com/friendevents/eventImage/7o3swrbqhws-ron-sartini.jpg"
        }
        if(!$scope.event.event1Url && $scope.event.category == "Community Event") {
          $scope.event.event1Url = "https://s3.amazonaws.com/friendevents/eventImage/poxhu0uedcg-aranxa-esteve.jpg"
          $scope.event.event2Url = "https://s3.amazonaws.com/friendevents/eventImage/ds0zia5gzc4-nina-strehl.jpg"
        }
        $scope.lat = $scope.allEvents[i].lati
        $scope.lng = $scope.allEvents[i].longi
        var yourLocation = new Loc($cookies.get('lat'), $cookies.get('lng'))
        var eventLocation = new Loc($scope.lat, $scope.lng)
        $scope.distance = dist(yourLocation, eventLocation)
       }
       incrementI();
    })

  })
}

//-----allows user to change desired distance between events and user-----///
$scope.setDistance = function() {
  $cookies.put('distanceSetting', $scope.setting.distance)
  $scope.distanceSetting.distance = $scope.setting.distance
  $scope.distanceSetting.userId = loginId
  eventFriendsFactory.lastUpdate($scope.location, function(data) {
     eventFriendsFactory.getEvents($scope.distanceSetting, function(data) {
      $scope.allEvents = data.data
    })
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