const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const connect = require('./schemas');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// Middle Ware
//const {TurnBackErr} = require('./routes/middleware')
//const { isLoggedIn, isNotLoggedIn } = require('./routes/middleware');

//login with AuthRouter
const authRouter = require('./routes/auth');
const ProfileRouter = require('./routes/profile');
const CompanyRouter = require('./routes/company');
const pageRouter = require('./routes/page');
const deviceRouter = require('./routes/device');
const carRouter = require('./routes/car');
const historyRouter = require('./routes/history');
const workerRouter = require('./routes/worker');
const emailRouter = require('./routes/email');
const mobileRouter = require('./routes/mobile/');
const findRouter = require('./routes/find');

const path = require('path');
const ColorHash = require('color-hash');
const webSocket = require('./socket');

const app = express();

app.set('port', process.env.PORT || 8008);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});
connect();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/company', CompanyRouter);
app.use('/profile', ProfileRouter);
app.use('/find',findRouter);
app.use('/device', deviceRouter);
app.use('/car', carRouter);
app.use('/history', historyRouter);
app.use('/worker', workerRouter);
app.use('/email', emailRouter);
app.use('/mobile', mobileRouter);

app.use(function(req, res, next) {
    const error = new Error(`${req.method}${req.url} NO Router`);
    error.status = 404;
    next(error);
});

const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
});

app.use((req, res, next) => {
  if (!req.session.color) {
    const colorHash = new ColorHash();
    req.session.color = colorHash.hex(req.sessionID);
  }
  next();
});



app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

const server = app.listen(app.get('port'), function() {
    console.log(app.get('port'), 'Port is Waiting~');
})

webSocket(server, app, sessionMiddleware);