myApp.controller('dashboardController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams',  function ($scope, eventFriendsFactory, $location, $cookies, $routeParams ){

if(!$cookies.get('loginId')) {
    $location.url('/login')
  }
  var loginId = $cookies.get('loginId')
  $scope.loginId = $cookies.get('loginId')
  $scope.check = 0;
  $scope.distance = [];
  var EarthRadius = 3961
  $scope.photo1 = true;
  $scope.photo2 = true;

  navigator.geolocation.getCurrentPosition(function (position) {
    $cookies.put('lat', position.coords.latitude)
    $cookies.put('lng', position.coords.longitude)

  });


  var yourLocation = new Loc($cookies.get('lat'), $cookies.get('lng'))
    $scope.location = {};
    $scope.location.location = yourLocation;
    $scope.location.userId = loginId;

    eventFriendsFactory.lastUpdate($scope.location, function(data) {
      console.log(data.data.data)
      if(data.data.data == "true") {
          eventFriendsFactory.updateDistance2($scope.location, function(data) {
            $scope.distanceSetting.userId = loginId
            eventFriendsFactory.getEvents($scope.distanceSetting, function(data) {
              $scope.allEvents = data.data
               incrementI = function() {
                $cookies.put('lastSeen', i)
                i++;
                if(i >= $scope.allEvents.length) {
                  alert('You have seen all the events! Did not find anything you like? Create your own event!')
                  i = 0;
                  $cookies.put('lastSeen', i)
                }
                $scope.distance = $scope.allEvents[i].distance
                $scope.event = $scope.allEvents[i]
                 if(!$scope.event.Photo1.file.path) {
                    $scope.photo1 = false;
                  }
                  if(!$scope.event.Photo2.file.path) {
                    $scope.photo2 = false;
                  }
                  // $scope.eventAll = data.data
                  // checkCreater();
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
                  alert('You have seen all the events! Did not find anything you like? Create your own event!')
                  i = 0;
                  $cookies.put('lastSeen', i-1)
                }
                $scope.distance = $scope.allEvents[i].distance
                $scope.event = $scope.allEvents[i]
                 if(!$scope.event.Photo1.file.path) {
                    $scope.photo1 = false;
                  }
                  if(!$scope.event.Photo2.file.path) {
                    $scope.photo2 = false;
                  }
                  // $scope.eventAll = data.data
                  // checkCreater();
               }
               incrementI();
            })

      }
    })

  if(!$cookies.get('lastSeen')) {
    var i = -1;
  } else {
    var i = $cookies.get('lastSeen');  
  }
  if(!$cookies.get('distanceSetting')){
    $cookies.put('distanceSetting', 35)
  }
  $scope.distanceSetting = {};
  $scope.distanceSetting.distance = $cookies.get('distanceSetting')
  $scope.event;
  $scope.allEvents;

  $scope.setDistance = function() {
    $cookies.put('distanceSetting', $scope.setting.distance)
    $scope.distanceSetting.distance = $scope.setting.distance
        eventFriendsFactory.updateDistance($scope.location, function(data) {
           eventFriendsFactory.getEvents($scope.setting, function(data) {
            $scope.allEvents = data.data
          })
        })
  } 


  checkCreater = function() {
    if($scope.eventAll[i].creater[0] == loginId) {
        console.log('here')
        i++
      } else {
        return true
      }
    if(i >= $scope.eventAll.length) {
        // alert('You have seen all the events!')
        i = 0;
      }
    checkCreater()
  }

  $scope.joinEvent = function() {
    alert('Event Joined!')
    $scope.event.joinerId = loginId
    eventFriendsFactory.joinEvent($scope.event, function(data) {
    }); 
    incrementI();
  }
  $scope.passEvent = function () {
    incrementI();
  }

}])