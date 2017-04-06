var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('ejs-mate');
var validator = require('express-validator');

/*
* Database connectivity with mongoose -- START
*/

// express-session - Module
var session = require('express-session'); 

var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);

mongoose.connect("mongodb://localhost:27017/cloneNetwork");

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection open");
});

/*
* Database connectivity with mongoose -- END
*/

var app = express();

app.set('port', process.env.PORT || 3000 );
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('ejs',engine);
app.set('view engine', 'ejs');

/*
* Session storage in DB -- START
*/

app.use(session({
  secret: '6sd65d6f45e95',
  resave: true,   // force session to resave itself even if it is mnot modified
  saveUninitialized: false, // should be false for login session (used for new unmodified session)
  store : new mongoStore({mongooseConnection:db})
}));

/*
* Session storage in DB -- END
*/


/*
* Express Validator - Error Formatter Middleware - START
*(the formParam value is going to get morphed into form body format useful for printing.)
*/

app.use(validator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  },
  customValidators: {
    isExist : function(username){
      User.findOne({username:username},(err,user)=>{
          if(err) throw err;
          if(user){
            return true;
          }else{
            return false;
          }
    
      });
    }  
 }
}));


/*
* Express Validator - Error Formatter Middleware - END
*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// route Path
var index = require('./routes/index');
var users = require('./routes/users');
var search = require('./routes/search');


app.use('/', index);
app.use('/', users);
app.use('/search',search);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{title:'Page404',header:false});
});

app.listen(app.get('port'),function(){
	console.log("Server is running on port "+app.get('port'));
})

module.exports = app;
