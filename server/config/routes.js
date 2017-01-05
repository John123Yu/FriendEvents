var mongoose = require('mongoose');
var user = require('../controllers/controls.js');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
// var multiparty = require('multiparty');

// { uploadDir: './imagesPath' }

module.exports = function(app) {

app.post('/user',function(req, res){
  user.create(req, res)
});

app.post('/login', function(req, res) {
  user.login(req, res)
});

app.put('/editUser/:id',function(req, res){
  user.editUser(req,res)
});

app.get('/getOneUser/:id', function(req, res) {
  user.getOneUser(req, res)
})

app.post('/likeUser', function(req, res) {
  user.likeUser(req, res)
})

app.post('/event',function(req, res){
  user.addEvent(req, res)
});

app.get('/getOneEvent/:id', function(req, res) {
  user.getOneEvent(req, res)
})

app.post('/getEvents/', function(req, res) {
  user.getEvents(req, res)
})

app.put('/editEvent/:id',function(req, res){
  user.editEvent(req,res)
});

app.post('/latLon/',function(req, res){
  user.latLon(req,res)
});

app.delete('/removeEvent/:id',function(req, res){
  user.removeEvent(req,res)
});

app.delete('/removeUser/:id',function(req, res){
  user.removeUser(req,res)
});

app.get('/getUserEvents/:id', function(req, res) {
  user.getUserEvents(req, res)
})

app.post('/joinEvent/', function(req, res) {
  user.joinEvent(req, res)
})

app.post('/leaveEvent/', function(req, res) {
  user.leaveEvent(req, res)
})

app.post('/uploadPic/', multipartMiddleware, function(req, res) {
  user.uploadPic(req, res)
})

app.post('/uploadEventPic1/', multipartMiddleware, function(req, res) {
  user.uploadEventPic1(req, res)
})

app.post('/uploadEventPic2/', multipartMiddleware, function(req, res) {
  user.uploadEventPic2(req, res)
})

app.get('/getEventPosts/:id', function(req, res) {
  user.getEventPosts(req, res)
})

app.post('/gChatPosts/', function(req, res) {
  user.gChatPosts(req, res)
})

app.post('/newPost/', function(req, res) {
  user.newPost(req, res)
})

app.post('/privateChat/', function(req, res) {
  user.privateChat(req, res)
})

app.post('/privateExist/', function(req, res) {
  user.privateExist(req, res)
})

app.post('/getPrivatePosts/', function(req, res) {
  user.getPrivatePosts(req, res)
})

app.post('/privatePost/', function(req, res) {
  user.privatePost(req, res)
})

app.post('/blockUser/', function(req, res) {
  user.blockUser(req, res)
})

app.post('/deleteChat/', function(req, res) {
  user.deleteChat(req, res)
})

app.post('/getChatLists/', function(req, res) {
  user.getChatLists(req, res)
})

app.post('/getChatLists2/', function(req, res) {
  user.getChatLists2(req, res)
})

app.post('/updateDistance2', function(req, res) {
  user.updateDistance2(req, res)
})


app.get('/getAllUsers', function(req, res) {
  user.getAllUsers(req, res)
})

app.get('/getAllEvents', function(req, res) {
  user.getAllEvents(req, res)
})

app.post('/resetPassword', function(req, res) {
  user.resetPassword(req, res)
})

app.post('/finalReset', function(req, res) {
  user.finalReset(req, res)
})

app.post('/deletePast/', function(req, res) {
  user.deletePast(req, res)
})

app.post('/confirmEmail/', function(req, res) {
  user.confirmEmail(req, res)
})

app.post('/lastUpdate/', function(req, res) {
  user.lastUpdate(req, res)
})
}