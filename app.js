const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan')
const app = express();
const Blog = require('./models/blog');
const { render } = require('ejs');
const dburl = 'mongodb+srv://ahmed-ninja:aosma9949@cluster0.prskrgf.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err))
//
app.set('view engine', 'ejs');


//middle ware and static files 

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.redirect('/blogs');

});
app.get('/about', (req, res) => {
    res.render('about', { title: 'about' });

});

//blog-route
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'all blogs', blogs: result })
        })
        .catch((err) => {
            console.log(err);
        })

})
app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'create' });
});

app.post('/blogs', (req, res) => {

    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect('/blogs')
        })
        .catch((err) => {
            console.log(err)
        })
})

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findById(id)
        .then(result => {
            res.render('details', { blog: result, title: 'blog details' })
        })
        .catch((err) => {
            console.log(err)
        })
})

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then(result => {res.json({redirect:'/blogs'});})
        .catch((err) => {
            console.log(err)
        })
})



app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});



///



app.get('/about-us', (req, res) => {
    res.redirect('/about');
});
app.listen(9000);
