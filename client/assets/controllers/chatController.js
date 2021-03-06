myApp.controller('chatController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', '$interval',  function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, $interval ){

  if(!$cookies.get('loginId')) {
    $location.url('/login')
  }

  var loginId = $cookies.get('loginId')
  $scope.loginId = loginId
  $scope.check = 0;
  var firstClick = 0;
  $scope.eventInfo;
  $scope.post = {};
  var elem = document.getElementById('chat');

  $scope.notify = {};
  $scope.notify.userId = loginId;
  $scope.notify.eventId = $routeParams.id;
  eventFriendsFactory.getEventPosts($routeParams.id, function(data){
      $scope.eventInfo = data.data
      socket.emit('create', $scope.eventInfo._id);
    })

  var socket = io.connect();

  socket.on('new_message', function (data) {
    setTimeout(function(){  
      eventFriendsFactory.gChatPosts($scope.notify)
      eventFriendsFactory.getEventPosts($routeParams.id, function(data){
      console.log(data.data)
      if(data.data == null){
        $location.url('/chatLists')
      }
      $scope.eventInfo = data.data
      if(firstClick == 0 ) {
        elem.scrollTop = (elem.scrollHeight - 330);
        firstClick++;
      } else {
        elem.scrollTop = (elem.scrollHeight);
      }
    })
    }, 300);
  })


  document.onkeydown = function(a) {
    if(a.keyCode == 13) {
      socket.emit('create', $scope.eventInfo._id);
      $scope.post.userId = loginId
      $scope.post.eventId = $scope.eventInfo._id
      eventFriendsFactory.postGroupChat($scope.post, function(data) {
        $scope.post.post = ""
        $scope.check = data;
      })
    }
  }

  $('.newform').submit(function (e){
    e.preventDefault()
    socket.emit('create', $scope.eventInfo._id);
    $scope.post.userId = loginId
    $scope.post.eventId = $scope.eventInfo._id
    eventFriendsFactory.postGroupChat($scope.post, function(data) {
      $scope.post.post = ""
      $scope.check = data;
    })
  });

  $scope.$on("$destroy", function(){
      console.log('left chat')
      socket.emit('unsubscribe', $scope.eventInfo._id);
  });

}])