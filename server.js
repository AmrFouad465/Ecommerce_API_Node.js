require("dotenv").config({ path: "./config/.env" });
const port = process.env.PORT;
const express = require("express");
const app = express();
const session = require("express-session");



const authMiddleware = require("./middlewares/auth");
const authRouter = require("./routes/auth");
const publicProductRouter=require('./routes/publicProduct');
const authProductRouter=require('./routes/authProduct');
const publicReviewsRouter=require('./routes/publicReviews');
const authReviewRouter=require('./routes/authReviews')
const branchRouter=require('./routes/branches')
const cartRouter=require("./routes/cart")



app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);



app.use("/auth", authRouter);

app.use('/general',publicProductRouter,publicReviewsRouter);


app.use(authMiddleware);


app.use('/admin',authProductRouter,branchRouter);
app.use('/customer',authReviewRouter,cartRouter);



app.listen(port, () =>
  console.log(`The server is running at http://localhost:${port}`),
);
