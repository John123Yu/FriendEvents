myApp.controller('loginController', ['$scope', 'eventFriendsFactory', '$location', '$cookies', '$rootScope', 'dateFilter', 'toaster', function ($scope, eventFriendsFactory, $location, $cookies, $rootScope, dateFilter, toaster ){

  $cookies.remove('loginId')
  // $cookies.put('distanceSetting', 25)
  $scope.IPError = true;

 // $('.birthdayDate').datepicker({
 //      startDate: "01/01/1900",
 //      endDate: "today",
 //      startView: 2,
 //      defaultViewDate: { year: 1985, month: 04, day: 25 },
 //      format: "yyyy-MM-dd"
 //    })

  navigator.geolocation.getCurrentPosition(function (position) {
    $cookies.put('lat', position.coords.latitude)
    $cookies.put('lng', position.coords.longitude)
  });
  
  $scope.addUser = function() {
          $scope.FNError = true
          $scope.LNError = true
          $scope.EError = true
          $scope.BError = true
          $scope.PError = true
          $scope.CPError = true
          $scope.user.birthday = dateFilter($scope.user.birthday, "yyyy-MM-dd");
          $scope.user.birthday = new Date($scope.user.birthday);
          eventFriendsFactory.addUser($scope.user, function(data) {
            console.log(data)
            if(data.data.firstName) {
              $cookies.put('loginId', data.data._id)
              toaster.pop('info', "", 'Check your email for a passcode');
              $location.url('/confirmEmail')
            }
            if(data.data.error) {
              $scope.CPError = false
              $scope.confirmPasswordError = data.data.error
            }
            if(data.data.errmsg) {
              $scope.EError = false
              $scope.emailError = "Email already registered"
            }
            if(data.data.errors.firstName) {
              $scope.FNError = false
              $scope.firstNameError = data.data.errors.firstName.message  
            }
            if(data.data.errors.lastName) {
              $scope.LNError = false
              $scope.lastNameError = data.data.errors.lastName.message  
            }
            if(data.data.errors.birthday) {
              $scope.BError = false
              $scope.birthdayError = data.data.errors.birthday.message  
            }
            if(data.data.errors.email) {
              $scope.EError = false
              $scope.emailError = data.data.errors.email.message  
            }
            if(data.data.errors.password) {
              $scope.PError = false
              $scope.passwordError = data.data.errors.password.message  
            }
          }); 
          $location.url('/login');
        }

  $scope.users;
  $scope.user = {}
  $scope.user.passwordLogin = "";
  $scope.login = function() {
    eventFriendsFactory.login($scope.user, function(data) {
      $scope.noEmailError = true;
      $scope.IPError = true;
      if(data.data.notConfirmed) {
        toaster.pop('info', "", 'Check your email for a passcode');
        $location.url('/confirmEmail')
      }
      if(data.data.noEmail) {
        $scope.noEmailError = false;
        $scope.noEmail = data.data.noEmail;
      }
      else if(data.data.IncorrectPassword) {
        $scope.IPError = false;
        $scope.incorrectPassword = data.data.IncorrectPassword;
      }
      else if(data.data._id) {
        console.log('login sent back')
        $cookies.put('loginId', data.data._id)
        $rootScope.$emit("loggedIn", {});
        $location.url('/')
      }
    })
    $location.url('/login');
  }


}]).directive("compareTo", function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});
