const express = require("express");
const app = express(); //Initiating express app
const port = 80;
const path = require("path");
const env = require("./config/environment");
const db = require("./config/mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const localPassport = require("./config/passport-local-strategy");
const jwtPassport = require("./config/passport-jwt-strategy");
const GooglePassport = require("./config/passport-google-strategy");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const expressEjsLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const customMiddlware = require("./middleware/setFlash");
const logger = require("morgan");

//Using cors
const cors = require("cors");
app.use(cors());

//setup the chat server to be used with socket.io
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log(`Chat Server started listening on port 5000`);

//Using ejs-layouts
app.use(expressEjsLayouts);

//middleware for using static files
app.use(express.static(path.join(__dirname, "./assets")));

//middleware to include directory for storing files
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//cookie parser for storing cookie during local passport auth
app.use(cookieParser());

//body-parser to read form body
app.use(bodyParser.urlencoded({ extended: true }));

//setting up view engine
app.set("view engine", "ejs");

//extracting style and script from views to layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//Setting up express session user session to fetch session object using session stored in cookie
app.use(
  session({
    name: env.session_name,
    secret: env.session_cookie_key,

    //when user is not logged in, identity is not made, session is not created , should we store extra info in it : false
    saveUninitialized: false,

    //when session has user data like id & other info, should we resave of even there is no change.
    resave: false,
    cookie: { maxAge: 100 * 360 * 100 },
    store: MongoStore.create(
      {
        mongoUrl: `${env.db}`,

        //Disable expired sessions cleaning
        autoRemove: "disabled",
      },
      (error) => console.log(error || "Connect mongodb for mongostore")
    ),
  })
);

//telling the app to use initialize passport
app.use(passport.initialize());

//telling the app to use passport session which is used to desrialize user object,
//when user first auth, user object is serialized and stored in cookie which is sent to server
//for further req eexcept auth req.
app.use(passport.session());

//when any req is made, this middleware will be called, locals will be set to user
//now when passport is initailized only then this fn will be initialized
app.use(passport.setAuthenticatedUser);

//since flash msgs are stored in session, so we have to use after session
app.use(flash());
app.use(customMiddlware.setFlash);

//Using morgan logger
app.use(logger(env.morgan.mode, { stream: env.morgan.accessLogStream }));

//using express router , for that we define a middleware using app.use
app.use("/", require("./routes/index"));

//when user requests for undefiend routes
app.get("*", async (req, res) => {
  // console.log(req.query);
  return res.render("error");
});

app.listen(port, (err) => {
  if (err) console.log(`Error in running server :${err}`);
  console.log(`Server is running on port ${port}`);
});
