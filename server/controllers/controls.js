var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');
var UserEvents = mongoose.model('UserEvents');
var EventUsers = mongoose.model('EventUsers');
var Posts = mongoose.model('Posts');
var Private = mongoose.model('Private');
var EventPosts = mongoose.model('EventPosts');
var AllEvents = mongoose.model('AllEvents');
var multiparty = require('multiparty');
var uuid = require('uuid');
var s3 = require('s3fs');
var fs = require('fs');
var app = require('express')();
var mailer = require('express-mailer');
var jade = require('jade');
var dateNow = new Date();
var aws = require('aws-sdk');
global.fetch = require('node-fetch')
var Client = require('predicthq')
var phq = new Client.Client({access_token: ""})

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

aws.config.loadFromPath(require('path').join(__dirname, './halo-doc.json'));

var s9 = new aws.S3();

mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: '@gmail.com',
    pass: ''
  }
});

var s3Impl = new s3('friendevents', {
    accessKeyId: '',
    secretAccessKey: ''
});

module.exports = {
	create: function(req, res){
      var user = new User(req.body);
      if(user.email) {
        user.email = user.email.toLowerCase();
      }
      user.confirm = "true";
      user.save(function(err, context) {
	    if(err) {
	      console.log('Error with registering new user');
        return res.json(err)
	    } else {
	      console.log('successfully registered a new user!');
      }
  	})
  },
  confirmEmail: function(req, res) {
    User.findOne({confirmPasscode: req.body.passcode}, function(err, user) {if(!req.body.passcode) {
      return res.json({null: "Invalid Passcode"})
     }
      if(user == null) {
        console.log('not a stored passcode')
        return res.json({null: "Invalid Passcode"})
      } else {
        console.log('confirm Passcode went through!')
        user.confirm = "true";
        user.save();
        return res.json(user)
      }
    })
  },
  login: function(req, res) {
    User.find({ email: req.body.emailLogin.toLowerCase()}, function(err, context) {
      if(context[0] == null){
        console.log("no email found")
        return res.json({noEmail: "No such email in database"})
      }
      if(context[0]) {
        console.log('success finding email')
        if(context[0].validPassword(req.body.passwordLogin)) {
          return res.json({_id:context[0]._id})
        } else {
          console.log("wrong password")
          return res.json({IncorrectPassword: 'Incorrect Password'})
        }
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
    User.findOne({_id: req.body.creater}, function(err, user) { 
      var event = new Event(req.body);
      event.date = new Date(req.body.date)
      event.creater = user._id
      event.save(function(err, event) {
        if(err) {
          console.log('Error with registering new event');
          return res.json(err)
        } else {
          console.log('successfully registered a new event!');
          var eventPost = new EventPosts();
          eventPost._event = event._id
          eventPost.date = new Date(req.body.date)
          eventPost.save()
          event._eventPost = eventPost._id
          event.save();
          var eventUsers = new EventUsers()
          eventUsers._event = event._id
          eventUsers.users.push(user._id)
          eventUsers.date = event.date;
          // WHEN DATE IS EDITED, THIS DATE ALSO NEEDS TO BE EDITED
          eventUsers.save()
          UserEvents.findOne({_user: user._id}, function(err, userEvents) {
            if(userEvents) {
              var index = userEvents.events.indexOf(req.body._id);
              if(index == -1) {
                userEvents.events.push(event._id)
                userEvents.save();
              }
            } else {
              var newUserEvents = new UserEvents();
              newUserEvents._user = user._id;
              newUserEvents.events.push(event._id)
              newUserEvents.save();
            }
            return res.json(event)
          })
        }
      })
    })
  },
 getOneEvent: function (req, res) {
    Event.findOne({_id: req.params.id}, null, {sort: 'created_at'}).populate('creater').exec( function(err, context) {
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
  getOneEventUsers: function(req, res) {
    EventUsers.findOne({_event: req.params.id}).populate('users').exec(function(err, eventUsers) {
        if(eventUsers) {
          console.log('Also got the users')
          return res.json(eventUsers)
        } else {
          console.log("no friends for event yet")
          return res.json(eventUsers)
        }
      })
  },
  editEvent: function(req, res){
    Event.update({_id: req.params.id}, {title: req.body.title, description: req.body.description, date: new Date(req.body.date), participants: req.body.participants, category: req.body.category, streetAddress: req.body.streetAddress, city: req.body.city, state: req.body.state, zipcode: req.body.zipcode}, { runValidators: true }, function(err, event) {
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
          EventUsers.remove({_event: req.params.id}, function(err, eventUsers) {
            if(!err) {
              console.log("And removed the associations")
              return res.json(event)
            }
          })
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
          UserEvents.remove({_user: req.params.id}, function(err, userEvents) {
            if(!err) {
              console.log('And removed the associations')
              return res.json(user)
            }
          })
        }
    })
  },
  leaveEvent: function(req, res){
    UserEvents.findOne({_user: req.body.userId}, function(err, userEvents) {
        if(err) {
          console.log(err)
          console.log('something went wrong leaving event');
        } else {
          console.log('successfully left an event!');
          var index = userEvents.events.indexOf(req.body.eventId);
          userEvents.events.splice(index, 1);
          userEvents.save();
          return res.json(userEvents)
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
    UserEvents.findOne({_user : req.params.id}, null, {sort: 'created_at'}).populate({path: 'events', populate : {path: '_eventPost'}}).exec( function(err, context) {
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
    Event.findOne({_id: req.body._id}, function(err, event) {
      UserEvents.findOne({_user: req.body.joinerId}, function(err, userEvents) {
        if(userEvents) {
          var index = userEvents.events.indexOf(req.body._id);
          if(index == -1) {
            userEvents.events.push(req.body._id)
            userEvents.save();
          }
        } else {
          var newUserEvents = new UserEvents();
          newUserEvents._user = req.body.joinerId;
          newUserEvents.events.push(req.body._id)
          newUserEvents.save();
        }
        EventUsers.findOne({_event: req.body._id}, function(err, eventUsers) {
            if(eventUsers) {
              var index = eventUsers.users.indexOf(req.body.joinerId)
              if(index == -1) {
                eventUsers.users.push(req.body.joinerId)
                eventUsers.save();
              }
            } else {
              var newEventUsers = new EventUsers();
              newEventUsers._event = req.body._id;
              newEventUsers.users.push(req.body.joinerId)
              newEventUsers.date = event.date;
              newEventUsers.save(function(err, finalsave) {
                if(err) {
                  return res.json(err)
                } else { return res.json(finalsave)}
              })
            }
          })
      })
    })
  },
  uploadPic: function(req, res) {
    User.findOne({_id :req.body.id}, function(err, context) {
      if(err) {
        console.log(err)
      } else {
        var params = {
          Bucket: 'friendevents', 
          Delete: { 
            Objects: [ 
              {
                Key: context.userdestPath 
              }
            ],
          },
        };
        console.log('got user for photo upload')
        var file = req.files.file;
        var stream = fs.createReadStream(file.path);
        var extension = file.path.substring(file.path.lastIndexOf('.'));
        var temp = uuid.v4()
        var destPath = temp + extension;
        context.userdestPath = destPath
        var base = "https://s3.amazonaws.com/friendevents/";
        context.userPicUrl = ('https://s3.amazonaws.com/friendevents/' + temp + extension)
        context.save()
        s9.deleteObjects(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
          } else {
            console.log(data); 
          }         
        }); 
        return s3Impl.writeFile(destPath, stream, {ContentType: file.type}).then(function(one){
            fs.unlink(file.path);
            res.send(base + destPath); 
        });
      }
    })
  },
  uploadEventPic1: function(req, res) {
    Event.findOne({_id :req.body.id}, function(err, context) {
      if(err) {
        console.log(err)
      } else {
        var params = {
          Bucket: 'friendevents', 
          Delete: { 
            Objects: [ 
              {
                Key: context.event1destPath 
              }
            ],
          },
        };
        var file = req.files.file;
        var stream = fs.createReadStream(file.path);
        var extension = file.path.substring(file.path.lastIndexOf('.'));
        var temp = uuid.v4()
        var destPath = temp + extension;
        context.event1destPath = destPath;
        var base = "https://s3.amazonaws.com/friendevents/";
        context.event1Url = ('https://s3.amazonaws.com/friendevents/' + temp + extension)
        context.save()
        s9.deleteObjects(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
          } else {
            console.log(data); 
          }         
        }); 
        return s3Impl.writeFile(destPath, stream, {ContentType: file.type}).then(function(one){
            fs.unlink(file.path);
            res.send(base + destPath); 
        });
      }
    })
  },
  uploadEventPic2: function(req, res) {
    Event.findOne({_id :req.body.id}, function(err, context) {
      if(err) {
        console.log(err)
      } else {
        var params = {
          Bucket: 'friendevents', 
          Delete: { 
            Objects: [ 
              {
                Key: context.event2destPath 
              }
            ],
          },
        };
        s9.deleteObjects(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
          } else {
            console.log(data); 
          }         
        }); 
        var file = req.files.file;
        var stream = fs.createReadStream(file.path);
        var extension = file.path.substring(file.path.lastIndexOf('.'));
        var temp = uuid.v4()
        var destPath = temp + extension;
        context.event2destPath = destPath;
        var base = "https://s3.amazonaws.com/friendevents/";
        context.event2Url = ('https://s3.amazonaws.com/friendevents/' + temp + extension)
        context.save()
        return s3Impl.writeFile(destPath, stream, {ContentType: file.type}).then(function(one){
            fs.unlink(file.path);
            res.send(base + destPath); 
        });
      }
    })
  },
  getEventPosts: function (req, res) {
    EventPosts.findOne({_event: req.params.id}, null, {sort: 'created_at'}).populate({path: 'posts'}).exec( function(err, context) {
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
    EventPosts.findOne({_event: req.body.eventId}, null, {sort: 'created_at'}).exec( function(err, context) {
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
  postGroupChat: function (req, res) {
    User.findOne({_id : req.body.userId}, function(err, user) {    
      EventPosts.findOne({_id : req.body.eventId}, function(err, event) {
        console.log("hree")
        console.log(event)
      if(event == null) {
        return res.json({gone: "event has been deleted"})
      }
      var post = new Posts({post: req.body.post})
      post._user = req.body.userId;
      post.userFullName = user.firstName + " " + user.lastName
      post._eventPost = event._id;
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
          }
      })
    })
  })
  },
  getPrivatePosts: function (req, res) {
    Private.findOne({_id: req.body.id}, null, {sort: 'created_at'}).populate({path: 'posts'}).exec( function(err, context) {
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
      post.userFullName = user.firstName + " " + user.lastName
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
              privateChat.popId(user._id)
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
  // do i need to populate user and friend?
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
  getEvents: function (req, res) {
    var minLat = parseFloat(req.body.lat) - req.body.latDif
    var minLon = parseFloat(req.body.lng) - req.body.lonDif
    var maxLon = parseFloat(req.body.lng) + req.body.lonDif
    var maxLat = parseFloat(req.body.lat)+ req.body.latDif
    Event.find({ $and: [{ lati: {$gte: minLat, $lte: maxLat}, longi: {$gte: minLon, $lte: maxLon} }]}).exec( function(err, events) {
      if(err) {
        console.log(err)
      } else {
        return res.json(events)
      }
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
    Event.find({}, null, {sort: 'date'}).exec(function(err, events) { 
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
    User.findOne({email: req.body.email.toLowerCase()}, function(err, user) { 
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
      if(!req.body.passcode) {
        console.log('incorrect passcode')
        return res.json({null: "Invalid passcode"})
      }
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
    dateNow = new Date()
    AllEvents.find({}, function(err, allEvents) {
      allEvents[0].allEvents = []
      allEvents[0].save();
    })
    Event.remove({ date : { $lt: dateNow } }, function(err, event) {
        if(err) {
          console.log(err)
          console.log('something went wrong removing past events');
        } else {
          console.log(event)
          console.log('successfully removed past events!');
          EventUsers.remove({ date: { $lt: dateNow } })
          EventPosts.remove({ date: { $lt: dateNow } })
          return res.json(event)
        }
    })
  },
            // User.findOne({email:"friendevents1@gmail.com"}, function(err, user) {
            //   user.userEvents = [];
            //   console.log(user)
            //   user.save();
            // })
  getEventsAPI: function(req, res){
  var count = 0;
  dateNow = new Date()
  var EventNames = []
  if(dateNow.getMonth() < 9){
    var dateMonth = "0" + (dateNow.getMonth() + 1)
    // console.log(dateMonth)
  } else {
    var dateMonth = String(dateNow.getMonth() + 1)
  }
  if(dateNow.getDate() < 10) {
    var newDayDate = "0" + dateNow.getDate()
  }
  var newDate = dateNow.getFullYear() + "-" + dateMonth + "-" + newDayDate
  console.log(newDate)
// var newAllEvents = new AllEvents();
// newAllEvents.save();
AllEvents.find({}, function(err, allEvents) {
  // console.log(allEvents[0])
  User.findOne({email:"friendevents1@gmail.com"}, function(err, user) {
    phq.events.search({ limit: 10, sort:'rank', within: '100km@38.9072,-77.0369',  'start.gte':newDate, rank_level:'3,4,5', category: ['expos', 'festivals', 'community', 'performing-arts']  })
      .then(function(results){
        console.log(results.result.count)
          var events = results.toArray()
          for(var i=0; i < events.length; i++) {
            if(!allEvents[0].allEvents.includes(events[i].title + events[i].start)) {
              allEvents[0].allEvents.push(events[i].title + events[i].start)
              // allEvents[0].save();
              // console.info(events[i].rank, events[i].category, events[i].title, events[i].start, events[i].location[0])
              if(!events[i].description) {
                events[i].description = "There is currently no description for this event."
              }
              if(events[i].category == 'observances') {
                events[i].category = 'Observance'
              }
              if(events[i].category == 'expos') {
                events[i].category = 'Expos'
              }
              if(events[i].category == 'festivals') {
                events[i].category = 'Festival'
              }
              if(events[i].category == 'community') {
                events[i].category = 'Community Event'
              }
              if(events[i].category == 'performing-arts') {
                events[i].category = 'Performing-arts'
              }
              var newEvent = new Event({title:events[i].title, description:events[i].description, date: events[i].start, streetAddress:" ", city: " ", state: " ", zipcode: " ", category:events[i].category, lati:events[i].location[1], longi:events[i].location[0], participants:100, creater: user._id});
              var eventPost = new EventPosts();
              eventPost._event = newEvent._id
              eventPost.date = events[i].start
              newEvent._eventPost = eventPost._id
              eventPost.save()
              newEvent.save(function(err, event){
                console.log(err)
              })
            }
          }
      allEvents[0].save();
      }).catch(function (err) {
        console.log(err)
        console.log("Promise Rejected");
      })

    phq.events.search({ limit: 10, sort:'rank', within: '100km@38.9072,-77.0369', 'start.gte':newDate, rank_level:'4,5', category: ['sports', 'concerts']  })
      .then(function(results){
        console.log(results.result.count)
          var events = results.toArray()
          for(var i=0; i < events.length; i++) {
              if(!allEvents[0].allEvents.includes(events[i].title + events[i].start)) {
              allEvents[0].allEvents.push(events[i].title + events[i].start)
              // allEvents[0].save();
              console.info(events[i].rank, events[i].category, events[i].title, events[i].start, events[i].location)
              if(!events[i].description) {
                events[i].description = "There is currently no description for this event."
              }
              if(events[i].category == 'sports') {
                events[i].category = 'Sports'
              }
              if(events[i].category == 'concerts') {
                events[i].category = 'Concert'
              }
              var newEvent = new Event({title:events[i].title, description:events[i].description, date: events[i].start, streetAddress:" ", city: " ", state: " ", zipcode: " ", category:events[i].category, lati:events[i].location[1], longi:events[i].location[0], participants:100, creater: user._id});
              var eventPost = new EventPosts();
              eventPost._event = newEvent._id
              eventPost.date = events[i].start
              newEvent._eventPost = eventPost._id
              eventPost.save()
              newEvent.save(function(err, event){
                console.log(err)
              })
            }
          }
      allEvents[0].save();
      console.log(allEvents[0])
      return res.json({data:"data"})
      }).catch(function (err) {
        console.log(err)
        console.log("Promise Rejected");
      })
  // allEvents[0].save(function(err, allEventsSave) {
  //   return res.json({data:"data"})
  // });
  })
})
  },
    saveAddress: function (req, res) {
      console.log(req.body)
    Event.update({_id: req.body._id}, { $set: { fullAddress: req.body.address }}).exec( function(err, context) {
      if(context) {
        console.log('success find event for saving address')
        console.log(context)
        return res.json(context)
      }
      else {
        console.log('could not find event for saving address')
        return res.json(context)
      }
    })
  },
};