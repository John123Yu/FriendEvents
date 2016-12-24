myApp.controller('userController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', 'Upload', function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, Upload){

  if(!$cookies.get('loginId')) {
    $location.url('/login')
  }

  $scope.check = 0;
  $scope.user;
  var loginId = $cookies.get('loginId')
  $scope.loginId = loginId
  $scope.photo1 = true;
  var date = new Date();
  $scope.T1;
  $scope.T2;
  $scope.T3;


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
      var birthdayDate = new Date(data.data.birthday)
      var ageMilli = (date - birthdayDate)
      var ageYear = Math.floor(ageMilli/(1000 * 60 * 60 * 24 * 365))
      $scope.user.age = ageYear      
      var rand = Math.random()
      if(rand > 0 && rand <= .15) {
        $scope.T1 = $scope.user.truth1;
        $scope.T2 = $scope.user.truth2;
        $scope.T3 = $scope.user.lie;
      } else if (rand > .15 && rand <= .3) {
        $scope.T1 = $scope.user.truth1;
        $scope.T2 = $scope.user.lie;
        $scope.T3 = $scope.user.truth2;
      } else if (rand > .3 && rand <= .45) {
        $scope.T1 = $scope.user.truth2;
        $scope.T2 = $scope.user.truth1;
        $scope.T3 = $scope.user.lie;
      } else if (rand > .45 && rand <= .6) {
        $scope.T1 = $scope.user.truth2;
        $scope.T2 = $scope.user.lie;
        $scope.T3 = $scope.user.truth1;
      } else if (rand > .6 && rand <= .75) {
        $scope.T1 = $scope.user.lie;
        $scope.T2 = $scope.user.truth1;
        $scope.T3 = $scope.user.truth2;
      } else {
        $scope.T1 = $scope.user.lie;
        $scope.T2 = $scope.user.truth2;
        $scope.T3 = $scope.user.truth1;
      }
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
