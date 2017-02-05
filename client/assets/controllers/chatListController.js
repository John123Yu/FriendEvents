myApp.controller('chatListController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', '$interval',  function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, $interval ){

  if(!$cookies.get('loginId')) {
    $location.url('/login')
  }
  var loginId = $cookies.get('loginId')
  $scope.loginId = loginId
  $scope.check = 0;
  $scope.pass = {}
  $scope.notification = false;

  $scope.$watch('check', function(newValue, oldValue) {
    $scope.pass.id = loginId
    eventFriendsFactory.getChatList($scope.pass, function(data){
      $scope.chatList = data.data;
      // console.log($scope.chatList)
      // for(var i = 0; i < $scope.chatList.length; i++) {
      //   if($scope.chatList[i].news[0] != loginId){
      //     $scope.notification = true;
      //   }
      // }
    })
    eventFriendsFactory.getChatList2($scope.pass, function(data){
      $scope.chatList2 = data.data;
    })
    eventFriendsFactory.getUserEvents(loginId, function(data) {
      $scope.userEvents = data.data
      console.log($scope.userEvents)
    })
  })


}])