myApp.controller('editUserController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$routeParams', 'Upload', function ($scope, eventFriendsFactory, $location, $cookies, $routeParams, Upload){

  if(!$cookies.get('loginId')) {
    $location.url('/login')
  }
  if($cookies.get('loginId') != $routeParams.id) {
    $location.url('/')
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

  $scope.editUser = function() {
    eventFriendsFactory.editUser(loginId, $scope.user, function(data) {
      $scope.check = data
      console.log(data)
      $location.url('/user/' + data.config.data._id)
    })
  }

}])