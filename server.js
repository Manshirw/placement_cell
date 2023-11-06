import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var adminIsAuthorised = false;
var userIsAuthorised = false;


function passwordCheck(req, res, next) {
  const password = req.body["password"];
  if (password === "measadmin") {
    adminIsAuthorised = true;
  }
  else if(password ==="measuser"){
    userIsAuthorised = true;
  }
 
  next();
  
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});


app.get("/drive", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    console.log(response);
    res.render(__dirname + "/new_drive.ejs", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});
app.get("/user_drive", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    console.log(response);
    res.render(__dirname + "/see_drive.ejs", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});


app.use(passwordCheck);

app.post("/check", (req, res) => {
  if (adminIsAuthorised) {
    res.sendFile(__dirname + "/admin.html");
  }else if (userIsAuthorised) {
    res.sendFile(__dirname + "/user.html");
  }else {
    res.sendFile(__dirname + "/login.html");
    console.log(req.body["password"]);
    
  }
});
app.get("/engineering",(req,res)=>{
  res.render(__dirname + "/engineering.ejs")
 
});
app.get("/management",(req,res)=>{
  res.render(__dirname + "/management.ejs")
 
});
app.get("/law",(req,res)=>{
  res.render(__dirname + "/law.ejs")
 
});
app.post("/submit",(req,res)=>{
  const namee= req.body["company"];
  const name2= req.body["Drive date"];
  const name3= req.body["About the company"];
  const name4= req.body["Location"];
  const name5= req.body["amount"];
  const name6= req.body["Roles and Responsibilities"];
  const name7= req.body["Document"];
  const name8= req.body["Last Date to apply"];
  const name9= req.body["link"];
  res.render(__dirname + "/drive.ejs",{cname:namee,dname:name2,aname:name3,lname:name4,amname:name5,rname:name6,doname:name7,ldname:name8,liname:name9});
  
});

// Route to render the edit page
app.get("/new", (req, res) => {
  res.render(__dirname + "/modify.ejs", { heading: "New Drive", submit: "Post Drive" });
});

app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    console.log(response.data);
    res.render(__dirname + "/modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, req.body);
    console.log(response.data);
    res.redirect("/drive");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// Partially update a post
app.post("/api/posts/:id", async (req, res) => {
  console.log("called");
  try {
    const response = await axios.patch(
      `${API_URL}/posts/${req.params.id}`,
      req.body
    );
    console.log(response.data);
    res.redirect("/drive");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect("/drive");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
