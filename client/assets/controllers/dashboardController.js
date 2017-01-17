myApp.controller('dashboardController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', 'toaster',  function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, toaster ){

if(!$cookies.get('loginId')) {
    $location.url('/login')
  }
  var loginId = $cookies.get('loginId')
  $scope.loginId = $cookies.get('loginId')
  $scope.check = 0;
  $scope.distance = [];
  var EarthRadius = 3961

  $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();   
  });

  navigator.geolocation.getCurrentPosition(function (position) {
    $cookies.put('lat', position.coords.latitude)
    $cookies.put('lng', position.coords.longitude)
  });


  var yourLocation = new Loc($cookies.get('lat'), $cookies.get('lng'))
    $scope.location = {};
    $scope.location.location = yourLocation;
    $scope.location.userId = loginId;

  if($cookies.get('loginId')) {
    eventFriendsFactory.lastUpdate($scope.location, function(data) {
      console.log(data.data.data)
      if(data.data.data == "true") {
        // the distance updates can be on the back end..
          eventFriendsFactory.updateDistance($scope.location, function(data) {
            $scope.distanceSetting.userId = loginId
            eventFriendsFactory.getEvents($scope.distanceSetting, function(data) {
              $scope.allEvents = data.data
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
                // $scope.url1 = $scope.event.event1Url
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
          });

      } else {
        $scope.distanceSetting.userId = loginId
        eventFriendsFactory.getEvents($scope.distanceSetting, function(data) {
              $scope.allEvents = data.data
               incrementI = function() {
                $cookies.put('lastSeen', i)
                i++;
                if(i >= $scope.allEvents.length) {
                  toaster.pop('info', "", 'You have seen all the events. Did not find anything you like? Create your own event.');
                  i = 0;
                  $cookies.put('lastSeen', i-1)
                }
                $scope.event = $scope.allEvents[i]
                if(!$scope.event.fullAddress) {
                  $scope.event.fullAddress = $scope.event.streetAddress + ", " + $scope.event.city + " " +  $scope.event.state + ". " +  $scope.event.zipcode
                }

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

                // console.log($scope.allEvents[i])
                $scope.lat = $scope.allEvents[i].lati
                $scope.lng = $scope.allEvents[i].longi
                // console.log($scope.lng)
                var yourLocation = new Loc($cookies.get('lat'), $cookies.get('lng'))
                var eventLocation = new Loc($scope.lat, $scope.lng)
                $scope.distance = dist(yourLocation, eventLocation)
                  // $scope.eventAll = data.data
                  // checkCreater();
               }
               incrementI();
            })

      }
    })
  }

  if(!$cookies.get('lastSeen')) {
    var i = -1;
  } else {
    var i = $cookies.get('lastSeen');  
  }
  if(!$cookies.get('distanceSetting')){
    $cookies.put('distanceSetting', 50)
  }

  $scope.distanceSetting = {}
  $scope.distanceSetting.distance = $cookies.get('distanceSetting')
  $scope.event;
  $scope.allEvents;

  $scope.setDistance = function() {
    $cookies.put('distanceSetting', $scope.setting.distance)
    $scope.distanceSetting.distance = $scope.setting.distance
    $scope.distanceSetting.userId = loginId
    eventFriendsFactory.lastUpdate($scope.location, function(data) {
      console.log(data.data.data)
      if(data.data.data == "true") {
        eventFriendsFactory.updateDistance($scope.location, function(data) {
           eventFriendsFactory.getEvents($scope.distanceSetting, function(data) {
            $scope.allEvents = data.data
          })
        }) 
      } else {
         eventFriendsFactory.getEvents($scope.distanceSetting, function(data) {
            $scope.allEvents = data.data
          })
      }
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