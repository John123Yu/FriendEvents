var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var path = require('path')
var EarthRadius = 3961
var distanceCalc = require('./distanceCalc.js');

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  firstName : {
  	type: String,
  	required: [true, 'First name is required'],
  	minlength: [2, 'First name must be at least 2 characters'],
  	trim: true
  },
  lastName : {
  	type: String,
  	required: [true, 'Last name is required'],
  	minlength: [2, 'Last name must be at least 2 characters'],
  	trim: true
  },
  email : {
  	type: String,
  	validate: {
  		validator: function(email) {
  		var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  		return emailRegex.test(email)
  		},
  		message: 'Not a valid email'
  	},
	required: [true, "Email is required"],
	unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    validate: {
      validator: function( value ) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}/.test( value );
      },
      message: "Password failed validation, you must have at least 1 number, uppercase and special character"
    }
  },
  birthday: {
  	type: Date,
  	required: [true, 'Birthday is required']
  },
  created_at: { type : Date, default: Date.now },
  truth1: {
    type: String
    // required: [true, 'Truth is required']
  },
  truth2: {
    type: String
    // required: [true, 'Truth is required']
  },
  lie: {
    type: String
    // required: [true, 'Lie is required']
  },
  work: {
    type: String
  },
  school: {
    type: String
  },
  gender: {
    type: String
  },
  // privateChats: [{type: Schema.Types.ObjectId, ref: 'Private'}],
  likes: [],
  likeCount: {type: Number, default: 0},
  admin: String,
  passcode:{type: String, default: "9382730"},
  confirm: String,
  confirmPasscode: String,
  userPicUrl: String,
  userdestPath: String,
 });
userSchema.methods.addLikes = function(id) {
  var likeExist = false;
  for(var item in this.likes) {
    if(id == this.likes[item]){
      likeExist = true;
    }
  }
  if(likeExist == false) {
    this.likes.push(id);
  }
  this.likeCount = this.likes.length;
  console.log(this.likes.length)
  this.save()
} 
userSchema.methods.generateHash = function(password) {
	if(password.length > 32) {
		return password
	} else {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
	}
}
userSchema.pre('save', function(done) {
	this.password = this.generateHash(this.password);
	done();
})
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}

userSchema.methods.addAdmin = function() {
  this.admin = "true";
  this.save()
  console.log('admin updated')
}

mongoose.model('User', userSchema);

var eventSchema = new mongoose.Schema({
  title : {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description : {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description must be less than 2000 characters'],
    trim: true
  },
  date : {
    type: Date,
    required: [true, 'Date is required'],
  },
  created_at: { type : Date, default: Date.now },
  streetAddress : {
    type: String,
    required: [true, 'Street address is required'],
  },
  city : {
    type: String,
    required: [true, 'City is required']
  },
  state : {
    type: String,
    required: [true, 'State is required']
  },
  zipcode : {
    type: String,
    required: [true, 'Zipcode is required']
  },
  fullAddress: {
    type: String,
  },
  participants: {
    type: Number,
    required: [true, 'Participants is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  lati: Number,
  longi: Number,
  // userEvents: [{type: Schema.Types.ObjectId, ref: 'UserEvent'}],
  _eventPost: {type: Schema.Types.ObjectId, ref: 'EventPosts'},
  news: [],
  confirm: { type: String, default: "true" },
  creater: {type: Schema.Types.ObjectId, ref: 'User'},
  hostName: String,
  event1Url: String,
  event1destPath: String,
  event2Url: String,
  event2destPath: String
   });

mongoose.model('Event', eventSchema);

var userEventsSchema = new mongoose.Schema({
  date: Date,
  events: [{type: Schema.Types.ObjectId, ref: 'Event'}],
  _user: {type: Schema.Types.ObjectId, ref: 'User'},
 });
mongoose.model('UserEvents', userEventsSchema);

var eventUsersSchema = new mongoose.Schema({
  date: Date,
  _event: {type: Schema.Types.ObjectId, ref: 'Event'},
  users: [{type: Schema.Types.ObjectId, ref: 'User'}],
 });
mongoose.model('EventUsers', eventUsersSchema);

var postSchema = new mongoose.Schema({
  post: {
    type: String,
    required: true
  },
  created_at: { type : Date, default: Date.now },
  userFullName: String,
  _user: {type: Schema.Types.ObjectId, ref: 'User'},
  _eventPost: {type: Schema.Types.ObjectId, ref: 'EventPosts'},
  _private: {type: Schema.Types.ObjectId, ref: 'Private'}
 });
mongoose.model('Posts', postSchema);

var privateSchema = new mongoose.Schema({
  created_at: { type : Date, default: Date.now },
  _user: {type: Schema.Types.ObjectId, ref: 'User'},
  _friend: {type: Schema.Types.ObjectId, ref: 'User'},
  posts: [{type: Schema.Types.ObjectId, ref: 'Posts'}],
  news: [], 
  block: String
 });
privateSchema.methods.pushId = function(id) {
  if (this.news.indexOf(id) > -1) {
  } else {
    this.news.push(id)
    this.save()
  }
  console.log('inserted')
  console.log(this.news)
}
privateSchema.methods.popId = function(id) {
  for(var i = 0; i < this.news.length; i++) {
    if(this.news[i] != id) {
      this.news.splice(i, 1)
      this.save()
    }
  }
  console.log('popped')
  console.log(this.news)
}
mongoose.model('Private', privateSchema);

var eventPostsSchema = new mongoose.Schema({
  date: Date,
  created_at: { type : Date, default: Date.now },
  _event: {type: Schema.Types.ObjectId, ref: 'Event'},
  posts: [{type: Schema.Types.ObjectId, ref: 'Posts'}],
  news: []
});
eventPostsSchema.methods.pushId = function(id) {
  if (this.news.indexOf(id) > -1) {
  } else {
    this.news.push(id)
    this.save()
  }
  console.log('inserted')
  console.log(this.news)
}
eventPostsSchema.methods.popId = function(id) {
  for(var i = 0; i < this.news.length; i++) {
    if(this.news[i] != id) {
      this.news.splice(i, 1)
      this.save()
    }
  }
  console.log('popped')
  console.log(this.news)
}
mongoose.model('EventPosts', eventPostsSchema);

var allEventsSchema = new mongoose.Schema({
    allEvents : []
 });

mongoose.model('AllEvents', allEventsSchema);

