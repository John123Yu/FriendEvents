myApp.controller('userController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', 'Upload', function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, Upload){

  if(!$cookies.get('loginId')) {
    $location.url('/login')
  }

  $scope.check = 0;
  $scope.user;
  var loginId = $cookies.get('loginId')
  $scope.loginId = loginId
  $scope.photo1 = true;


  $scope.uploadPic = function(file) {
    file.upload = Upload.upload({
      url: "/uploadPic/",
      data: {id: loginId, file: file},
    });

    file.upload.then(function (response) {
      console.log(response)
      $scope.check = response.data;
    })
  } 

  $scope.$watch('check', function(newValue, oldValue) {
    eventFriendsFactory.getOneUser($routeParams.id, function(data){
      $scope.user = data.data
      if(!data.data.Photo.file.name) {
        $scope.photo1 = false;
      }
    })
  })

  $scope.privateChat = {}
  $scope.createPrivate = function() {
    $scope.privateChat.initId = loginId;
    $scope.privateChat.recId = $scope.user._id;
    if(loginId != $scope.user._id) {
      eventFriendsFactory.privateExist($scope.privateChat , function(data) {
        if(data.data._id) {
          $location.url('/privateChat/' + data.data._id)
        } else {
          eventFriendsFactory.createPrivate($scope.privateChat, function(data) {
            $location.url('/privateChat/' + data.data._id)
          })
        }
      })
    }
    else {
      alert('Can"t chat yourself!')
    }
  }

  $scope.likeUser = function() {
    $routeParams.userId = loginId
    eventFriendsFactory.likeUser($routeParams, function(data) {
      $scope.check = data;
    })
  }


}])
