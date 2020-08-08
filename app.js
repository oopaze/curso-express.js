const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

const app = express()
// Session Config
  app.use(session({
    secret: 'cursodenode',
    resave: true,
    saveUninitialized: true
  }));
  app.use(flash());

// Middlewares Config
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
  });

// Body Parser Config
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())

// Handlebars Config
  app.engine('handlebars', handlebars({defaultLayout: 'main'}))
  app.set('view engine', 'handlebars')

// Mongoose
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost/blogapp', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("DataBase Connected!");
  }).catch((err) => {
    console.log("Error: "+err);
  });

// Public Config
  app.use(express.static(path.join(__dirname, "public")))

// Routes
  app.get('/', (req, res) => {
    res.send('Home')
  })

  app.use('/admin', admin)

// Outros
const PORT = 8081
app.listen(PORT, () => {
  console.log('Server is on!')
})
