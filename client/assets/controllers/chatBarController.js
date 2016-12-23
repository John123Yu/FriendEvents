myApp.controller('chatBarController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', '$interval',  function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, $interval ){

  if(!$cookies.get('loginId')) {
    $location.url('/login')
  }
  var loginId = ($cookies.get('loginId'))
  $scope.loginId = loginId
  $scope.chatId = {};
  var elem = document.getElementById('footerChatBox');
  var socket = io.connect();

  $scope.toggle = false;
  $scope.toggleChat = function() {
    if($scope.toggle === true) {
      socket.emit('unsubscribe', $scope.chatId.id);
      $scope.toggle = false;
    } else if($scope.toggle === false){
      $scope.toggle = true;  
      $scope.check = Math.random(); 
    }
  }

  $scope.pass = {}
  $scope.chatList = {};
  $scope.chatList2 = {};
  $scope.user = {};
  $scope.$watch('check', function(newValue, oldValue) {
    $scope.pass.id = loginId
    eventFriendsFactory.getChatList($scope.pass, function(data){
      $scope.chatList = data.data;
    })
    eventFriendsFactory.getChatList2($scope.pass, function(data){
      $scope.chatList2 = data.data;
    })
    eventFriendsFactory.getUserEvents(loginId, function(data) {
      $scope.user = data.data
    })
  })

  socket.on('new_message', function (data) {
    setTimeout(function(){  
      $scope.privateChats.id = $scope.privateChats._id
      eventFriendsFactory.getPrivatePosts($scope.privateChats, function(data){
        $scope.privateChats = data.data;
        elem.scrollTop = (elem.scrollHeight);
        console.log(elem.scrollTop)
      })
    }, 300);
  })

  $scope.clickId = function(id) {
    socket.emit('unsubscribe', $scope.chatId.id);
    $scope.chatId.id = id
    $scope.chatId.userId = loginId
    elem.scrollTop = elem.scrollHeight;
    eventFriendsFactory.getPrivatePosts($scope.chatId, function(data){
      $scope.privateChats = data.data;
      socket.emit('create', $scope.chatId.id);
      console.log(elem.scrollHeight)
    })
  }

   document.onkeydown = function(a) {
    if(a.keyCode == 13) {
      socket.emit('create', $scope.privateChats._id);
      $scope.chatId.userId = loginId
      $scope.chatId._id = $scope.privateChats._id
      eventFriendsFactory.privatePost($scope.chatId, function(data) {
      $scope.chatId.post = ""
     })
    }
  }

}])