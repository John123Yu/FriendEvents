myApp.controller('oneEventController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', '$http', 'NgMap', 'Upload', function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, $http, NgMap, Upload ){

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
    $scope.eventInfo = data.data
    $scope.lat = data.data.lati
    $scope.lng = data.data.longi
    var yourLocation = new Loc($cookies.get('lat'), $cookies.get('lng'))
    var eventLocation = new Loc(data.data.lati, data.data.longi)
    $scope.distance = dist(yourLocation, eventLocation)
  })

  $scope.$watch('check', function(newValue, oldValue) {
    eventFriendsFactory.getOneEvent($routeParams.id, function(data){
      $scope.eventInfo = data.data 
      console.log(data.data)
      if(!data.data.Photo1.file.name) {
        $scope.photo1 = false;
                }
      if(!data.data.Photo2.file.name) {
        $scope.photo2 = false;
      }
    })
  })

  $scope.joinEvent = function() {
    $scope.eventInfo.joinerId = loginId
    eventFriendsFactory.joinEvent($scope.eventInfo, function(data) {
      if(data.data.already){
      } else {
        alert("You've joined! Chat with other users!")
      }
    }); 
  }

}])
// .directive('ngPlaceholder', function($document) {
//   return {
//     restrict: 'A',
//     scope: {
//       placeholder: '=ngPlaceholder'
//     },
//     link: function(scope, elem, attr) {
//       scope.$watch('placeholder',function() {
//         elem[0].placeholder = scope.placeholder;
//       });
//     }
//   }
// });