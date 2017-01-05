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


  $scope.uploadPic = function(image) {
    $scope.upload = Upload.upload({
    url: '/uploadPic',
    method: 'POST',
    data: {
      file: image,
      id: loginId
    },
    file: image
  }).success(function(data, status, headers, config) {
    console.log('user photo uploaded')
    $scope.check = data
  }).error(function(err) {
    console.log('user photo upload failure')
  });
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
      $location.url('/user/' + data.config.data._id)
    })
  }

}])