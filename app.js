const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const opn = require("opn")
const Blog = require("./models/blog");


app.get("/", (req, res) => {
    res.redirect("/add-blog")
})
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({ extended: true }));
const port = 3000;
app.get("/show-blogs",async (req, res) => {
    const allBlogs = await Blog.find({});
    console.log(allBlogs)
    res.render('Show_blogs',{allBlogs})
})
app.get('/add-blog', (req, res) => {
    res.render("add_item");
})
app.post('/add-blog', async(req, res) => {
    console.log(req.body);
    const { fname, lname, email, title, image1,image2,image3,image4, content } = req.body;

    const isdatastored=await Blog.create({ name: fname + " " + lname, email: email, photo: [image1,image2,image3,image4], text: content, title: title });
    if (!isdatastored) {
        console.log('Err');
    }
    console.log('Data stored Success');
    res.redirect("/show-blogs")
})
app.get("/read-blog/:id",async(req, res) => {
    const { id } = req.params;
    const item = await Blog.findById(id);
    console.log(item);
    res.render('read_blogs',{item})
})
app.post("/delete-blog/:id",async (req, res) => {
    const { id } = req.params;
    const deleteitem=await Blog.findByIdAndDelete(id);
    if (!deleteitem) {
        console.log('Item not deleted');
    }
    console.log('Item deleted');
    res.redirect("/show-blogs")
})

const connectAndStartServer = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://vighneshvejandla_2003:Vighnesh2003@Blog.hb3novf.mongodb.net/Blog?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("Connected to MongoDB.");

        let serverStarted = false;

        app.listen(port, () => {
            if (!serverStarted) {
                console.log(`Server is running on port ${port}`);
                opn(`http://localhost:${port}`);
                serverStarted = true; 
              }
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};
connectAndStartServer();