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
    eventFriendsFactory.setUserLoc($scope.location, function(data) {
      if(data.data.data == "true") {
        eventFriendsFactory.updateDistance($scope.location, function(data) {

          eventFriendsFactory.getEvents($scope.distanceSetting, function(data) {
            $scope.allEvents = data.data
             incrementI = function() {
              i++;
              if(i >= $scope.allEvents.length) {
                // alert('You have seen all the events!')
                i = 0;
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
        console.log("no distance update")
         eventFriendsFactory.getEvents($scope.distanceSetting, function(data) {
            $scope.allEvents = data.data
             incrementI = function() {
              i++;
              if(i >= $scope.allEvents.length) {
                // alert('You have seen all the events!')
                i = 0;
              }
              $scope.distance = $scope.allEvents[i].distance
              $scope.event = $scope.allEvents[i]
              console.log($scope.event.Photo1.file.path)
               if(!$scope.event.Photo1.file.path == true) {
                  $scope.photo1 = false;
                }
                if(!$scope.event.Photo2.file.path == true) {
                  $scope.photo2 = false;
                }
                // $scope.eventAll = data.data
                // checkCreater();
             }
             incrementI();
          })
      }
    });

  var i = -1;
  if(!$cookies.get('distanceSetting')){
    $cookies.put('distanceSetting', 25)
  }
  $scope.distanceSetting = {};
  $scope.distanceSetting.distance = $cookies.get('distanceSetting')
  $scope.event;
  $scope.allEvents;

  $scope.setDistance = function() {
    $cookies.put('distanceSetting', $scope.setting.distance)
    $scope.distanceSetting.distance = $scope.setting.distance
     eventFriendsFactory.getEvents($scope.setting, function(data) {
      $scope.allEvents = data.data
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
    $scope.event.joinerId = loginId
    eventFriendsFactory.joinEvent($scope.event, function(data) {
    }); 
    incrementI();
  }
  $scope.passEvent = function () {
    incrementI();
  }

}])