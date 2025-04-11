const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const { render } = require("ejs");
// ------------------
const PORT = process.env.PORT || 7002;
const app = express();
//--------------------
//#region MiddleWare
app.use(bodyParser.urlencoded({ extends: true })); //from body html
app.use(bodyParser.json()); //from postman use json to send data put and update
app.use(express.static(path.join(__dirname, "public"))); //acess all file istead of load use readFile
app.set("views", path.join(__dirname, "views"));
//#endregion

//#region Connect With Mongoose
//1)connect with DB
mongoose.connect("mongodb://localhost:27017/databaseTask4");
//2) Create Schema
let PorductsSchema = new mongoose.Schema({
  productId: String,
  productName: String,
  price: Number,
  stockState: String,
  comingSoon: Boolean,
  colorName: String,
  isOnline: Boolean,
  colors: String,
  colorShades: String,
  newArrival: Boolean,
  mainCatCode: String,
  details: String,
  materials: String,
});

// 3-Connect With Collection MODEL

const ProductsModle = mongoose.model("products", PorductsSchema);

//4- Connection listening
let db = mongoose.connection;

//5-Listen on Connection --> [error - open] db-event
db.on("error", () => console.log("connection with db error"));

db.once("open", () => {
  console.log("connect open to DB");
  //Code [All Requestes]
  app.get("/", async (req, res) => {
    let Allproducts = await ProductsModle.find({});

    // console.log(Allproducts);
    res.render("home.ejs", { Allproducts });

    // res.render('home.ejs',{Allproducts, async: true}, )
  });
  app.get("/addProduct", (req, res) => {
    // console.log(req.body);
    res.render("addProduct.ejs");
  });
  app.post("/addProduct", (req, res) => {
    console.log(req.body);
    let newProduct = new ProductsModle(req.body);
    newProduct.save().then(() => {
      res.redirect("/");
    });
  });
  app.get("/seeMore/:id", async (req, res) => {
    var productI = req.params.id;
    const product = await ProductsModle.findById(productI);
    res.render("seeMore.ejs", { product });
  });
  app.get("/delete/:id", async (req, res) => {
    var productI = req.params.id;
    const product = await ProductsModle.findByIdAndDelete(productI);
    res.redirect("/");
  });
});

app.listen(PORT, () => console.log("listening to http://localhost:" + PORT));
