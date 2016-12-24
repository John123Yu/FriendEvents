 myApp.factory('eventFriendsFactory', ['$filter', '$http', '$location', function ( $filter, $http, $location){

    var factory = {};

    factory.addUser = function(newUser, callback) {
      $http.post('/user', newUser).then(function(data){
        console.log("data sent back")
        if(data.data.errors || data.data.errmsg || data.data.firstName) {
          console.log(data)
          callback(data);
        }
      })
    }
    factory.login = function(user, callback) {
      $http.post('/login', user).then(function(data){
        console.log("login data back")
        if(data.data.noEmail || data.data.IncorrectPassword) {
          callback(data);
        }
        else if (data.data._id) {
          callback(data)
        }
      })
    }
    factory.editUser = function(id, userInfo, callback){
      $http.put('/editUser/' + id, userInfo).then(function(data){
        console.log("success editing new user");
        callback(data);
      })
    }
    factory.getOneUser = function(userId, callback) {
      $http.get('/getOneUser/' + userId).then(function(data) {
        console.log('got one user')
        callback(data);
      })
    }
    factory.likeUser = function(userId, callback) {
      $http.post('/likeUser', userId).then(function(data) {
        console.log('liked user')
        callback(data);
      })
    }
    factory.addEvent = function(newEvent, callback) {
      $http.post('/event', newEvent).then(function(data){
        console.log("event added")
        callback(data);
      })
    }
    factory.getOneEvent = function(eventId, callback) {
      $http.get('/getOneEvent/' + eventId).then(function(data) {
        console.log('got one event')
        callback(data);
      })
    }
    factory.getEvents = function(distance, callback) {
      $http.post('/getEvents', distance).then(function(data) {
        console.log('got events')
        callback(data);
      })
    }
    factory.editEvent = function(id, userInfo, callback){
      $http.put('/editEvent/' + id, userInfo).then(function(data){
        console.log("success editing new event");
        callback(data);
      })
    }
    factory.removeEvent = function(id, callback){
      $http.delete('/removeEvent/' + id).then(function(data){
        console.log("success removing event");
        callback(data);
      })
    }
    factory.removeUser = function(id, callback){
      $http.delete('/removeUser/' + id).then(function(data){
        console.log("success removing user");
        callback(data);
      })
    }
    factory.latLon = function(newEvent) {
      $http.post('/latLon', newEvent).then(function(data){
        console.log("latLon added")
      })
    }
    factory.getUserEvents = function(userId, callback) {
      $http.get('/getUserEvents/' + userId).then(function(data) {
        console.log('got user"s events')
        callback(data);
      })
    }
    factory.joinEvent = function(event, callback) {
      $http.post('/joinEvent', event).then(function(data){
        console.log("event joined")
        if(data.data.already) {
          alert('You"ve already joined the event')
        }
        callback(data);
      })
    }
    factory.leaveEvent = function(eventId, callback) {
      $http.post('/leaveEvent', eventId).then(function(data){
        console.log("event left")
        callback(data);
      })
    }
    factory.post = function(newpost, callback) {
      $http.post('/newPost', newpost).then(function(data) {
        console.log('post successful')
        callback(data)
      })
    }
    factory.getEventPosts = function(eventId, callback) {
      $http.get('/getEventPosts/' + eventId).then(function(data) {
        console.log('got event"s posts')
        callback(data);
      })
    }
    factory.gChatPosts = function(id) {
      $http.post('/gChatPosts', id).then(function(data) {
        console.log('group notification update successful')
      })
    }
    factory.createPrivate = function(ids, callback) {
      $http.post('/privateChat', ids).then(function(data) {
        console.log('create private chat successful')
        callback(data)
      })
    }
    factory.privateExist = function(ids, callback) {
      $http.post('/privateExist', ids).then(function(data) {
        console.log('private chat already exists!')
        callback(data)
      })
    }
    factory.getPrivatePosts = function(ids, callback) {
      $http.post('/getPrivatePosts/', ids).then(function(data) {
        console.log('got private posts')
        callback(data);
      })
    }
    factory.privatePost = function(postData, callback) {
      $http.post('/privatePost', postData).then(function(data) {
        console.log('private post successful')
        callback(data)
      })
    }

    factory.blockUser = function(chatId, callback) {
      $http.post('/blockUser', chatId).then(function(data) {
        console.log('block successful')
        callback(data)
      })
    }
    factory.deleteChat = function(chatId, callback) {
      $http.post('/deleteChat', chatId).then(function(data) {
        console.log('delete chat successful')
        callback(data)
      })
    }
    factory.getChatList = function(userId, callback) {
      $http.post('/getChatLists', userId).then(function(data) {
        console.log('got Chat Lists')
        callback(data);
      })
    }

    factory.getChatList2 = function(userId, callback) {
      $http.post('/getChatLists2', userId).then(function(data) {
        console.log('got Chat Lists2')
        callback(data);
      })
    }
    factory.updateDistance = function(location, callback) {
      $http.post('/updateDistance', location).then(function(data) {
        console.log('distances updated')
        callback(data)
      })
    }
    factory.setUserLoc = function(location, callback) {
      $http.post('/setUserLoc', location).then(function(data) {
        console.log('user loc updated')
        callback(data)
      })
    }
    factory.getAllUsers = function(callback) {
      $http.get('/getAllUsers/').then(function(data) {
        console.log('got all users')
        callback(data);
      })
    }
    factory.getAllEvents = function(callback) {
      $http.get('/getAllEvents/').then(function(data) {
        console.log('got all events')
        callback(data);
      })
    }
    factory.resetPassword = function(email, callback) {
      $http.post('/resetPassword', email).then(function(data) {
        console.log('email sent for password reset')
        callback(data)
      })
    }
    factory.finalReset = function(password, callback) {
      $http.post('/finalReset', password).then(function(data) {
        console.log('password reset')
        callback(data)
      })
    }
    factory.deletePast = function( callback) {
      $http.post('/deletePast').then(function(data) {
        console.log('deleted past events')
        callback(data)
      })
    }

    return factory;
    }]);