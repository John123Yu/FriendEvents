var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var path = require('path')
var EarthRadius = 3961
var distanceCalc = require('./distanceCalc.js');

var mongoose = require('mongoose');
var filePluginLib = require('mongoose-file');
var filePlugin = filePluginLib.filePlugin;
// var make_upload_to_model = filePluginLib.make_upload_to_model;

var thumbnailPluginLib = require('mongoose-thumbnail');
var thumbnailPlugin = thumbnailPluginLib.thumbnailPlugin;
var make_upload_to_model = thumbnailPluginLib.make_upload_to_model;
var uploads_base = path.join(__dirname, "uploads");
var uploads = path.join(uploads_base, "u");

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
  	type: Date
  	// required: [true, 'Birthday is required']
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
  userEvents: [{type: Schema.Types.ObjectId, ref: 'UserEvent'}],
  // Photo: { data: },
  posts: [{type: Schema.Types.ObjectId, ref: 'Posts'}],
  privateChats: [{type: Schema.Types.ObjectId, ref: 'Private'}],
  lastLocation: Object,
  likes: [],
  likeCount: {type: Number, default: 0},
  admin: String,
  passcode:{type: String, default: "9382730"}
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

userSchema.methods.calcDistanceDif = function(newLocation) {
  var distanceChange = distanceCalc.dist(newLocation, this.lastLocation)
  if (distanceChange > 1) {
    this.lastLocation = newLocation;
    console.log(this.lastLocation)
    this.save();
    return true
  } else { return false}
}

userSchema.plugin(thumbnailPlugin, {
    name: "Photo",
    format: "png",
    size: 80,
    inline: false,
    save: true,
    upload_to: make_upload_to_model(uploads, 'photos'),
    relative_to: uploads_base
})

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
    maxlength: [800, 'Description must be less than 800 characters'],
    trim: true
  },
  date : {
    type: Date,
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
  participants: {
    type: Number,
    required: [true, 'Number of participants is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  lati: Number,
  longi: Number,
  userEvents: [{type: Schema.Types.ObjectId, ref: 'UserEvent'}],
  posts: [{type: Schema.Types.ObjectId, ref: 'Posts'}],
  news: [],
  creater: [{type: Schema.Types.ObjectId, ref: 'User'}],
  hostName: String,
  distance: Number
 });

eventSchema.plugin(thumbnailPlugin, {
    name: "Photo1",
    format: "png",
    size: 80,
    inline: false,
    save: true,
    upload_to: make_upload_to_model(uploads, 'photos'),
    relative_to: uploads_base
})

eventSchema.plugin(thumbnailPlugin, {
    name: "Photo2",
    format: "png",
    size: 80,
    inline: false,
    save: true,
    upload_to: make_upload_to_model(uploads, 'photos'),
    relative_to: uploads_base
})

eventSchema.methods.calcDistance = function(location) {
  var eventLocation = new distanceCalc.Loc(this.lati, this.longi)
  this.distance = distanceCalc.dist(location, eventLocation)
  this.save()
}
eventSchema.methods.pushId = function(id) {
  if (this.news.indexOf(id) > -1) {
  } else {
    this.news.push(id)
    this.save()
  }
  console.log('insert')
  console.log(this.news)
}
eventSchema.methods.popId = function(id) {
  console.log(id)
  for(var i = 0; i < this.news.length; i++) {
    if(this.news[i] != id) {
      this.news.splice(i, 1)
      this.save()
    }
  }
  console.log('pop')
  console.log(this.news)
}
mongoose.model('Event', eventSchema);

var userEventSchema = new mongoose.Schema({
  _event: {type: Schema.Types.ObjectId, ref: 'Event'},
  _user: {type: Schema.Types.ObjectId, ref: 'User'},
 });

mongoose.model('UserEvent', userEventSchema);

var postSchema = new mongoose.Schema({
  post: {
    type: String,
    required: true
  },
  created_at: { type : Date, default: Date.now },
  _user: {type: Schema.Types.ObjectId, ref: 'User'},
  _event: {type: Schema.Types.ObjectId, ref: 'Event'},
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

var lastUserSchema = new mongoose.Schema({
    id : String
 });
lastUserSchema.methods.updateLast = function(id) {
  this.id = id;
  this.save()
}
mongoose.model('LastUser', lastUserSchema);

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
