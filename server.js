import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import sequelize from "./src/config/connectDB.js";
import router from "./src/routers/router.js";
import ViewEngine from "./src/config/configViewEngine.js";
import session from "express-session";
import Relations from './src/models/index.js'
import htmlHelpers from "./src/helpers/htmlHelpers.js";
dotenv.config();
(async () => {
    await sequelize.sync();
  Relations
    console.log("Database synchronized");
})();
const app = express();

app.use(
    session({
    //   resave: true,
      saveUninitialized: true,
      secret: '123123',
      cookie: { maxAge: 86400000 },
    }),
  );

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

process.on('uncaughtException', (err) => {
    console.error('Unhandled exception caught:', err);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled promise rejection at:', promise, 'reason:', reason);
});

app.use((req, res, next) => {
  res.locals.helpers = htmlHelpers;
  next();
});

ViewEngine(app);
app.use("/", router);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
