myApp.controller('privateChatController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', '$interval',  function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, $interval ){

  if(!$cookies.get('loginId')) {
    $location.url('/login')
  }
  var loginId = $cookies.get('loginId')
  $scope.loginId = loginId
  $scope.check = 0;
  $scope.eventInfo;
  $scope.privateChat;
  var elem = document.getElementById('chat');
  var socket = io.connect();


  $routeParams.userId = loginId
  eventFriendsFactory.getPrivatePosts($routeParams, function(data){
    if(data.data.block) {
      alert(data.data.block)
      $location.url('/chatLists')
    }
    $scope.privateChats = data.data;
    if(data.data.nothing) {
      $location.url("/chatLists")
    }
    socket.emit('create', $scope.privateChats._id);
    // elem.scrollTop = (elem.scrollHeight);
  })
  
  socket.on('new_message', function (data) {
    setTimeout(function(){  
      eventFriendsFactory.getPrivatePosts($routeParams, function(data){
        $scope.privateChats = data.data;
        elem.scrollTop = (elem.scrollHeight);
        // console.log(elem.scrollTop)
        // console.log(elem.scrollHeight)
      })
    }, 300);
  })


  document.onkeydown = function(a) {
    if(a.keyCode == 13) {
      socket.emit('create', $scope.privateChats._id);
      $scope.privateChat.userId = loginId
      $scope.privateChat._id = $scope.privateChats._id
      eventFriendsFactory.privatePost($scope.privateChat, function(data) {
      $scope.check = data
      if(data.data.noChat) {
        alert('Chat has been deleted')
        $location.url('/chatLists')
      }
      $scope.privateChat.post = ""
     })
    }
  }

  $('.newform').submit(function (e){
    e.preventDefault()
    socket.emit('create', $scope.privateChats._id);
    $scope.privateChat.userId = loginId
    $scope.privateChat._id = $scope.privateChats._id
     eventFriendsFactory.privatePost($scope.privateChat, function(data) {
      $scope.check = data
      console.log(data)
      if(data.data.noChat) {
        alert('Chat has been deleted')
        $location.url('/chatLists')
      }
      $scope.privateChat.post = ""
     })
  });



  $scope.blockUser = function() {
    var block = confirm('Are you sure you want to block this chat? Blocks are permanent.')
    if(block == true) {
      eventFriendsFactory.blockUser($routeParams, function(data) {

      })
    }
  }
  $scope.deleteChat = function() {
    var deleteChat = confirm("Are you sure you want to delete chat?")
    if(deleteChat == true) {
      eventFriendsFactory.deleteChat($routeParams)
      $location.url('/chatLists')
    }
  }

  $scope.$on("$destroy", function(){
      console.log('left chat')
      socket.emit('unsubscribe', $scope.privateChats._id);
  });

}])