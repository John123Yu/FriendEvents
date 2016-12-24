var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');
var UserEvent = mongoose.model('UserEvent');
var Posts = mongoose.model('Posts');
var Private = mongoose.model('Private');
var LastUser = mongoose.model('LastUser');
var multiparty = require('multiparty');
var fs = require('fs');
var lastUser;
var app = require('express')();
var mailer = require('express-mailer');
var jade = require('jade');
var dateNow = new Date();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'John123Yu@gmail.com',
    pass: 'P82ke57y'
  }
});

// var mailOptions = {
//   to: 'bar@blurdybloop.com',
//   subject: 'Hello ✔',
//   locals: {
//     title: 'Hello',
//     message: 'Welcome to my website'
//   }
// }

module.exports = {
	create: function(req, res){
      var user = new User(req.body);
      user.save(function(err, context) {
	    if(err) {
	      console.log('Error with registering new user');
        console.log(err)
        return res.json(err)
	    } else {
	      console.log('successfully registered a new user!');
        return res.json(context)
	    }
  	})
  },
  login: function(req, res) {
    User.find({ email: req.body.emailLogin}, function(err, context) {
      if(context[0]) {
        if(context[0].email == "John123Yu@gmail.com") {
          context[0].addAdmin();
        }
        console.log('success finding email')
        if(context[0].validPassword(req.body.passwordLogin)) {
          return res.json({_id:context[0]._id})
        } else {
          console.log("wrong password")
          return res.json({IncorrectPassword: 'Incorrect Password'})
        }
      }
      else {
        console.log("no email found")
        return res.json({noEmail: "No such email in database"})
      }
    })
  },
  editUser: function(req, res){
    User.update({_id: req.params.id}, {truth1: req.body.truth1, truth2: req.body.truth2, lie: req.body.lie, work: req.body.work, school: req.body.school, gender: req.body.gender}, function(err, user) {
        if(err) {
          console.log('something went wrong updating user');
        } else {
          console.log('successfully edited a user!');
          return res.json(user)
        }
    })
  },
  getOneUser: function (req, res) {
    User.findOne({_id: req.params.id}, null, {sort: 'created_at'}).exec( function(err, context) {
      if(context) {
        console.log('success getting one user')
        return res.json(context)
      }
      else {
        console.log('no user yet')
        return res.json(context)
      }
    })
  },
  likeUser: function (req, res) {
    User.findOne({_id: req.body.id}).exec( function(err, context) {
      if(context) {
        context.addLikes(req.body.userId);
        console.log('success liking one user')
        return res.json(context)
      }
      else {
        console.log('user liked error')
        return res.json(context)
      }
    })
  },
  addEvent: function(req, res){
      User.findOne({_id: req.body.creater}, function(err, user) { var event = new Event(req.body);
      event.save(function(err, event) {
      if(err) {
        console.log('Error with registering new event');
        return res.json(err)
      } else {
        console.log('successfully registered a new event!');
        // return res.json(context)
        var userEvent = new UserEvent();
        userEvent._user = user._id;
        userEvent._event = event._id;
        userEvent.save(function(err){
          if(err) {
            console.log("userEvent not saved")
          } else {
            console.log("userEvent saved")
            user.userEvents.push(userEvent);
            event.userEvents.push(userEvent)
            user.save(function(err){
                 if(err) {
                      console.log('Error with saving user with userevents');
                 } else {
                      console.log("User Saved with userEvent")
                 }
            })
            event.save(function(err){
                 if(err) {
                      console.log('Error with saving event with userevents');
                 } else {
                      console.log("Event Saved with userEvent")
                    return res.json(event)
                 }
            })
          }
        })
      }
    })
    })
  },
 getOneEvent: function (req, res) {
    Event.findOne({_id: req.params.id}, null, {sort: 'created_at'}).populate('creater').populate({path: 'userEvents', populate: {path: '_user'}}).exec( function(err, context) {
      if(context) {
        console.log('success getting one event')
        return res.json(context)
      }
      else {
        console.log('no event yet')
        return res.json(context)
      }
    })
  },
  getEvents: function (req, res) {
    Event.find({distance: {$lte: req.body.distance}, date: {$gte: dateNow}}, null, {sort: 'created_at'}).exec( function(err, context) {
      if(context[0]) {
        console.log('success getting events')
        return res.json(context)
      }
      else {
        console.log('no events yet')
        return res.json(context)
      }
    })
  },
  editEvent: function(req, res){
    Event.update({_id: req.params.id}, {title: req.body.title, description: req.body.description, date: req.body.date, participants: req.body.participants, category: req.body.category, streetAddress: req.body.streetAddress, city: req.body.city, state: req.body.state, zipcode: req.body.zipcode}, { runValidators: true }, function(err, event) {
        if(err) {
          console.log(err)
          console.log('something went wrong updating event');
          return res.json(err)
        } else {
          console.log('successfully edited an event!');
          return res.json(event)
        }
    })
  },
  removeEvent: function(req, res){
    Event.remove({_id: req.params.id}, function(err, event) {
        if(err) {
          console.log(err)
          console.log('something went wrong removing event');
        } else {
          console.log('successfully removed an event!');
          return res.json(event)
        }
    })
  },
  removeUser: function(req, res){
    User.remove({_id: req.params.id}, function(err, user) {
        if(err) {
          console.log(err)
          console.log('something went wrong removing user');
        } else {
          console.log('successfully removed an user!');
          return res.json(user)
        }
    })
  },
  leaveEvent: function(req, res){
    UserEvent.remove({_id: req.body.id}, function(err, event) {
        if(err) {
          console.log(err)
          console.log('something went wrong leaving event');
        } else {
          console.log('successfully left an event!');
          return res.json(event)
        }
    })
  },
  latLon: function(req, res) {
    Event.update({_id: req.body.id}, {lati: req.body.lat, longi: req.body.lon}, function(err, event) {
        if(err) {
          console.log(err)
          console.log('something went wrong updating latlon');
          return res.json(err)
        } else {
          console.log('successfully edited latlon!');
          return res.json(event)
        }
    })
  },
  getUserEvents: function (req, res) {
    User.findOne({_id : req.params.id}, null, {sort: 'created_at'}).populate({path: 'userEvents', populate: {path: '_event'}}).exec( function(err, context) {
      if(context) {
        console.log('success getting user"s events')
        return res.json(context)
      }
      else {
        console.log('no user"s events yet')
        return res.json(context)
      }
    })
  },
  joinEvent: function(req, res) {
    User.findOne({_id: req.body.joinerId}, function(err, user) {
      Event.findOne({_id: req.body._id}, function(err, event) {
        UserEvent.find({_event: event._id, _user: user._id}, function(err, context) {
            if(context[0]) {
              console.log('UserEvent already exists')
              return res.json({already: 'already'})
            } else {
              var userEvent = new UserEvent();
              userEvent._user = user._id;
              userEvent._event = event._id;
              userEvent.save(function(err){
                if(err) {
                  console.log(err)
                  console.log("userEvent not saved")
                } else {
                  console.log("userEvent saved")
                  user.userEvents.push(userEvent);
                  user.save(function(err){
                     if(err) {
                          console.log('Error with saving user with userEvent');
                     } else {
                          console.log("User Saved with userEvent")
                     }
                  })
                  event.userEvents.push(userEvent);
                  event.save(function(err){
                     if(err) {
                          console.log('Error with saving event with userEvent');
                     } else {
                          console.log("event saved with userEvent")
                         return res.json(userEvent)
                     }
                  })
                }
              })
            }
        })
      })
    })
  },
  uploadPic: function(req, res) {
    console.log(req.files)
    User.findOne({_id :req.body.id}, function(err, context) {
      if(err) {
        console.log(err)
      } else {
        console.log('got user for photo upload')
        context.Photo = req.files
        context.save(function(err, save) {
          if(err) {
            console.log(err)
          } else {
            console.log('saved image with uploads')
            return res.json(context)
          }
        })
      }
    })
  },
  uploadEventPic1: function(req, res) {
    Event.findOne({_id :req.body.id}, function(err, context) {
      if(err) {
        console.log(err)
      } else {
        console.log('got event for photo1 upload')
        context.Photo1 = req.files
        context.save(function(err, save) {
          if(err) {
            console.log(err)
          } else {
            console.log('saved photo 1 with uploads')
            return res.json(context)
          }
        })
      }
    })
  },
  uploadEventPic2: function(req, res) {
    Event.findOne({_id :req.body.id}, function(err, context) {
      if(err) {
        console.log(err)
      } else {
        console.log('got event for photo2 upload')
        context.Photo2 = req.files
        context.save(function(err, save) {
          if(err) {
            console.log(err)
          } else {
            console.log('saved photo 2 with uploads')
            return res.json(context)
          }
        })
      }
    })
  },
  getEventPosts: function (req, res) {
    Event.findOne({_id: req.params.id}, null, {sort: 'created_at'}).populate({path: 'posts', populate: {path: '_user'}}).exec( function(err, context) {
      if(context) {
        console.log('success getting event posts')
        return res.json(context)
      }
      else {
        console.log('no event yet')
        return res.json(context)
      }
    })
  },
  gChatPosts: function (req, res) {
    Event.findOne({_id: req.body.eventId}, null, {sort: 'created_at'}).exec( function(err, context) {
      if(context) {
        context.pushId(req.body.userId)
        console.log('success updating group notifications')
        return res.json(context)
      }
      else {
        console.log('unsuccessful update of group notifications')
        return res.json(context)
      }
    })
  },
  newPost: function (req, res) {
    User.findOne({_id : req.body.userId}, function(err, user) {    
      Event.findOne({_id : req.body.eventId}, function(err, event) {
      if(event == null) {
        return res.json({gone: "event has been deleted"})
      }
      var post = new Posts({post: req.body.post})
      post._user = req.body.userId;
      post._event= req.body.eventId;
      post.save(function(err) {
        if(err) {
          console.log(err)
          console.log('post not saved')
        } else {
          console.log('post saved')
          event.posts.push(post)
          event.save(function(err) {
            if(err) {
              console.log(err)
              console.log('Error with saving event after saving post')
            } else {
              console.log('event saved after saving post')
              event.popId(user._id)
              return res.json({he:"hi"})
            }
          })
        }
      })
    })
    })
  },
  privateChat: function(req, res){
    User.findOne({_id: req.body.initId}, function(err, user1) { 
      User.findOne({_id: req.body.recId}, function(err, user2) { 
        var privateChat = new Private();
        privateChat._user = user1._id;
        privateChat._friend = user2._id;
        privateChat.save(function(err){
            if(err) {
              console.log(err)
              console.log("privateChat not saved")
            } else {
              console.log("privateChat saved")
              user1.privateChats.push(privateChat);
              user2.privateChats.push(privateChat);
              user1.save(function(err){
                   if(err) {
                        console.log('Error with saving user1 with privateChat');
                   } else {
                        console.log("user1 Saved with privateChat")
                   }
              })
              user2.save(function(err){
                   if(err) {
                        console.log('Error with saving user2 with privateChat');
                   } else {
                        console.log("user2 saved with privateChat")
                       return res.json(privateChat)
                   }
              })
          }
      })
    
    })
  })
  },
  getPrivatePosts: function (req, res) {
    Private.findOne({_id: req.body.id}, null, {sort: 'created_at'}).populate({path: 'posts', populate: {path: '_user'}}).exec( function(err, context) {
      if(context == null) {
        return res.json({nothing: 'nothingdata'})
      }
      if(context.block == "true"){
        console.log('this chat is blocked')
        return res.json({block: "This chat has been blocked"})
      }
      if(context) {
        context.pushId(req.body.userId)
        console.log('success getting private chat')
        return res.json(context)
      }
      else {
        console.log('no private chat yet')
        return res.json(context)
      }
    })
  },
  privatePost: function (req, res) {
    Private.findOne({_id : req.body._id}, function(err, privateChat) {
      if(privateChat == null) {
        return res.json({noChat: 'noChat'})
      }
      User.findOne({_id : req.body.userId}, function(err, user) { 
      var post = new Posts({post: req.body.post})
      post._private = privateChat._id;
      post._user = user._id;
      post.save(function(err) {
        if(err) {
          console.log(err)
          console.log('post not saved after private chat')
        } else {
          console.log('post saved after private chat')
          privateChat.posts.push(post)
          privateChat.save(function(err) {
            if(err) {
              console.log(err)
              console.log('Error with saving privatechat after saving post')
            } else {
              console.log('privatechat saved after saving post')
              return res.json({he:"hi"})
            }
          })
        }
      })
    })
    })
  },
  blockUser: function (req, res) {
    Private.update({_id: req.body.id}, {block: "true"}).exec( function(err, context) {
      if(context) {
        console.log('success blocking private chat')
        return res.json(context)
      }
      else {
        console.log('no block of private chat')
        return res.json(context)
      }
    })
  },
  deleteChat: function (req, res) {
    Private.remove({_id: req.body.id}).exec( function(err, context) {
      if(context) {
        console.log('success deleting private chat')
        return res.json(context)
      }
      else {
        console.log('unsuccessful delete of private chat')
        return res.json(context)
      }
    })
  },
  getChatLists: function (req, res) {
    Private.find({_user : req.body.id}, null, {sort: 'created_at'}).populate('_user').populate('_friend').exec( function(err, context) {
      if(context) {
        console.log('success getting user"s chatlist')
        return res.json(context)
      }
      else {
        console.log('no user"s events yet')
        return res.json(context)
      }
    })
  },
  getChatLists2: function (req, res) {
    Private.find({_friend : req.body.id}, null, {sort: 'created_at'}).populate('_user').populate('_friend').exec( function(err, context) {
      if(context) {
        console.log('success getting user"s chatlist2')
        return res.json(context)
      }
      else {
        console.log('no user"s events yet')
        return res.json(context)
      }
    })
  },
  privateExist: function (req, res) {
    Private.findOne({_friend : req.body.initId, _user: req.body.recId}).exec( function(err, context1) {
      if(context1) {
        console.log('chat already exists! first check')
        return res.json(context1)
        }
      else {
        console.log('first exist check was ok')
         Private.findOne({_friend : req.body.recId, _user: req.body.initId}).exec( function(err, context) {
          if(context) {
            console.log('chat already exists! second check')
            return res.json(context)
          }
          else {
            console.log('second exist check was ok')
            return res.json({hi: "hi"})
          }p
        })
      }
    })
  },
  updateDistance: function(req,res) {
    Event.find({}, null, {sort: 'created_at'}).exec( function(err, context) {
      if(context[0]) {
        for(item in context) {
          context[item].calcDistance(req.body.location)
        }
        console.log('success updating event distances')
        return res.json(context)
      }
      else {
        console.log('no events yet')
        return res.json(context)
      }
    })
  },
  setUserLoc: function(req, res) {
    LastUser.find({}, function(err, last) {
    User.findOne({_id :req.body.userId}, function(err, user) {
      if(user == null) {
        user = {};
        user.lastLocation = 1;
        return res.json({hi: 'hi'})
      }
      if(!user.lastLocation) {
        user.lastLocation = req.body.location
        user.save()
        console.log("user location updated")
        return res.json({data: "true"})
      } 
      if(last[0].id != user._id) {
        last[0].updateLast(user._id)
        console.log("not the last user!")
        return res.json({data: "true"})
      }
      else if(user.calcDistanceDif(req.body.location)) {
        console.log("user location updated")
        user.lastLocation = req.body.location
        return res.json({data: "true"})
      } else {
        console.log("user location not changed")
        return res.json({data: "false"})
      }
    })
  })
  },
  getAllUsers: function(req, res) {
    User.find({}, function(err, users) { 
      if(err) {
        console.log(err)
        console.log('something went wrong find all users')
      } else {
        console.log('found all users')
        return res.json(users)
      }
    })
  },
  getAllEvents: function(req, res) {
    Event.find({}, function(err, events) { 
      if(err) {
        console.log(err)
        console.log('something went wrong find all events')
      } else {
        console.log('found all events')
        return res.json(events)
      }
    })
  },
  resetPassword: function(req, res) {
    var passcode = ("a" + Math.floor(Math.random() * 10))+ (Math.floor(Math.random() * 10)) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10)
    console.log(passcode)
    User.findOne({email: req.body.email}, function(err, user) { 
      if(user == null) {
        console.log('not a stored email')
        return res.json(err)
      } else {
        user.passcode = passcode;
        user.save( function(err) {
          if(err) {
            console.log("user not saved with passcode")
          } else {
          app.mailer.send( 'email', {
            to: req.body.email, 
            subject: 'Friend Events Password Reset',
            text: passcode
          }, function (err) {
            if (err) {
              console.log(err);
              return res.json({error: 'There was an error sending the email'});
            } else {
              console.log("reset email sent") 
              return res.json({passcode: 'passcode sent to email'})
            }
          })
          }
        });
      }
    })
  },
  finalReset: function(req, res) {
    var passcode = ("a" + Math.floor(Math.random() * 10))+ (Math.floor(Math.random() * 10)) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10)
    User.findOne({passcode: req.body.passcode}, function(err, user) { 
      if(user == null) {
        console.log('incorrect passcode')
        return res.json({null: "Invalid passcode"})
      } else {
        if(req.body.password != req.body.confirmPassword) {
          console.log('Password does not match confirm password')
          return res.json({notmatch: 'Password does not match confirm password'})
        } else {
          console.log('passcode matched')
          user.password = req.body.password;
          user.save(function(err, context) {
            if(err) {
              console.log('Error with saving new password');
              console.log(err)
              return res.json(err)
            } else {
              console.log('successfully saved new user with new password!');
              user.passcode = passcode;
              user.save(function(err, context1) {
                return res.json(context1)
              })
            }
        })
      }
    }
    })
  },
  deletePast: function(req, res){
    Event.remove({date: {$lte: dateNow}}, function(err, event) {
        if(err) {
          console.log(err)
          console.log('something went wrong removing past events');
        } else {
          console.log('successfully removed past events!');
          return res.json(event)
        }
    })
  },
};