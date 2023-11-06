import express from "express";
import bodyParser from "body-parser";


const app = express();
const port = 4000;

// In-memory data store
let posts = [
  {
    id: 1,
    title: "UpRoar",
    date:"30-10-2023",
    content:
      "Up Roar Learning is one of the leading EdTech companies working with the top B-schools providing support and assistance to the students.It was started by the Edtech experts with a motive to bring revolution in the EdTech industry. The aim was to fill the gap for aspiring professionals to pursue higher education and level up their career paths.Online courses like MBA, Bachelor Programs, and various other Diploma and Certificate Programs offered by the associated Universities are helping many professionals in pursuing their goals. With our endeavor and initiative, we strive to build leaders and skillful resources for the growth of both, the professionals and the organization.",
    author: "UpRoar Department",
    
    
  },
  {
    id: 2,
    title: "Impledge Technology",
    date:"10-11-2023",
    content:
      "We are an experienced team who have pledged to develop innovative solutions using a healthy mix of technology and agile practices. We believe in delighting our customers by listening to our clients first. Impledge was conceived to bridge the gap between ideas that are great but never get implemented. The founder team members have more than 20 years of industry experience in web development, agile product design and development, cloud advisory and cloud design services.  Our clients include multinationals in Shipping & Logistics, eCommerce, EdTech, Retail, Finance and travel sector who have trusted us consistently for mobile or web application development, cloud advisory and migration services and product development to name a few. Our mission is to implement your ideas (big or small) and be your technology partner who can design, build and manage these products including user-friendly (mobile/web) applications for your customers..",
    author: "Impledge Technology",
    
  },
 
];

let lastId = 2;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET all posts
app.get("/posts", (req, res) => {
  console.log(posts);
  res.json(posts);
});

// GET a specific post by id
app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// POST a new post
app.post("/posts", (req, res) => {
  const newId = lastId += 1;
  const post = {
    id: newId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date(),
  };
  lastId = newId;
  posts.push(post);
  res.status(201).json(post);
});

// PATCH a post when you just want to update one parameter
app.patch("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (req.body.title) post.title = req.body.title;
  if (req.body.content) post.content = req.body.content;
  if (req.body.author) post.author = req.body.author;

  res.json(post);
});

// DELETE a specific post by providing the post id
app.delete("/posts/:id", (req, res) => {
  const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Post not found" });

  posts.splice(index, 1);
  res.json({ message: "Post deleted" });
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
