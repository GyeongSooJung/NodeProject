const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const path = require('path');
const nunjucks = require('nunjucks');
const connect = require('./schemas');
const cookieParser = require('cookie-parser');
// Middle Ware
//const { isLoggedIn, isNotLoggedIn } = require('./routes/middleware');

//login with AuthRouter
const authRouter = require('./routes/auth');
const ProfileRouter = require('./routes/profile')
const CompanyRouter = require('./routes/company');
const pageRouter = require('./routes/page');
const deviceRouter = require('./routes/device');
const carRouter = require('./routes/car');
const historyRouter = require('./routes/history');
const workerRouter = require('./routes/worker');

const app = express();

app.set('port', process.env.PORT || 80);
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

app.use('/device', deviceRouter);
app.use('/car', carRouter);
app.use('/history', historyRouter);
app.use('/worker', workerRouter);



app.use(function(req, res, next) {
    const error = new Error(`${req.method}${req.url} NO Router`);
    error.status = 404;
    next(error);
});



app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), function() {
    console.log(app.get('port'), 'Port is Waiting~');
})
