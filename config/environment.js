const fs = require("fs");
const path = require("path");
const rfs = require("rotating-file-stream");

const logDirectory = path.join(__dirname, "../production_logs");

//Check if production log directory already exist or create it
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", //one day rotating interval
  path: logDirectory,
});
const development = {
  name: "development",
  assets: "/assets",
  session_name: "codial",
  session_cookie_key: "blahbalhblah",
  db: "mongodb://127.0.0.1/codial_development",
  ip: "localhost",
  smtp: {
    //smtp object of nodemailer createTransport
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "ansh1996ansh@gmail.com",
      pass: "qincsjwanqrylhcd",
    },
  },
  jwtSecret: "codial",
  morgan: {
    mode: "dev",
    accessLogStream,
  },
};

const production = {
  name: process.env.CODIAL_ENVIRONMENT,
  assets: process.env.CODIAL_ASSETS_PATH,
  session_name: process.env.CODIAL_SESSION_NAME,
  session_cookie_key: process.env.CODIAL_SESSION_COOKIE_KEY,
  db: process.env.CODIAL_DB,
  ip: process.env.CODIAL_URL,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.CODIAL_GMAIL_USER,
      pass: process.env.CODIAL_GMAIL_PASSWORD,
    },
  },
  jwtSecret: process.env.CODIAL_JWT_SECRET,
  morgan: {
    mode: "combined",
    accessLogStream,
  },
};

module.exports =
  eval(process.env.NODE_ENV) == undefined
    ? development
    : eval(process.env.CODIAL_ENVIRONMENT);
