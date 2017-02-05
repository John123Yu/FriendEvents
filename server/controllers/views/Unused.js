// creating Many to Many relationship between Admin and events
if(!err) {
    var userEvent = new UserEvent();
    userEvent._user = user._id;
    userEvent._event = event._id;
    userEvent.save(function(err){
      if(err) {
        console.log("userEvent not saved")
      } else {
        console.log("userEvent saved")
        console.log(!user.userEvents.includes(userEvent) && count < events.length)
        if(!user.userEvents.includes(userEvent)) {
          console.log(count)
          console.log(userEvent)
          count++;
          user.userEvents.push(userEvent)
          user.save(function(err, context){
            console.log(err)
            console.log(context.userEvents)
          });
        }
        event.userEvents.push(userEvent);
        event.save(function(err){
        });
      }
    })              
  }
//-----------------------------------//

// var userLikeSchema = new mongoose.Schema({
//     id : String,
//     _user: {type: Schema.Types.ObjectId, ref: 'User'},
//     likes: [],
//     likeCount: Number
//  });
// userLikeSchema.methods.likeCount = function(id) {
//   this.likeCount = this.likes.length;
//   this.save()
// }
// mongoose.model('UserLike', lastUserSchema);


  $scope.updateAddresses = function() {
    console.log('here')
    for(var item in $scope.allEvents) {
      $scope.allEvents[item]
      if( $scope.allEvents[item].city == " " && $scope.allEvents[item].state == " " && !$scope.allEvents[item].fullAddress) {
        vm.lat = $scope.allEvents[item].lati;
        vm.lng = $scope.allEvents[item].longi;
        reverseGeocode.geocodePosition(vm.lat, vm.lng, function(address){
           vm.formatted_address = address;
           $scope.allEvents[item].address = vm.formatted_address
           eventFriendsFactory.saveAddress($scope.allEvents[item], function(data) {
            scope.check = data.data
          })       
        })
      }
    }
  }

