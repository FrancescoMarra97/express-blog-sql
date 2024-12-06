const { title } = require('process')
const posts = require('../db/db.js')
const fs = require('fs')
const { post } = require('../routes/posts.js')
const connection = require('../db/connection.js')



const index = (req, res) => {
    const sql = 'SELECT * FROM posts';
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });
    res.json({
        data: posts,
        counter: posts.length
    })
}
const show = (req, res) => {
    const slug = req.params.slug

    const post = posts.find((post) => post.slug === slug)

    if (!post) {
        return res.status(404).json({
            message: '404! not found'
        })
    }

    res.status(200).json(post)
}
const store = (req, res) => {
    console.log(req.body);
    const post = {
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    }
    posts.push(post)
    fs.writeFileSync('./db/db.js', `module.exports = ${JSON.stringify(posts, null, 4)}`)
    return res.status(201).json({
        status: 201,
        data: posts,
        count: posts.length
    })
}

const update = (req, res) => {
    //find the post by slug
    const post = posts.find((post) => post.slug === req.params.slug);
    //check if the user is updating the correct post
    if (!post) {
        return res.status(404).json({ error: "no post found with that slug" })
    }
    //update the post's object
    post.title = req.body.title;
    post.slug = req.body.slug;
    post.content = req.body.content;
    post.image = req.body.image;
    post.tags = req.body.tags;
    //update the file js
    fs.writeFileSync("./db/db.js", `module.exports = ${JSON.stringify(posts, null, 4)}`)
    //return the updated posts item
    res.status(200).json({
        status: 200,
        data: posts
    })
}

const destroy = (req, res) => {
    //find the post by slug
    const post = posts.find((post) => post.slug === req.params.slug);
    //check if the user is deleting the correct post
    if (!post) {
        return res.status(404).json({ error: "no post found with that slug" })
    }
    //remove the post from the posts
    const newPosts = posts.filter((post) => post.slug !== req.params.slug);
    //update the file js
    fs.writeFileSync("./db/db.js", `module.exports = ${JSON.stringify(newPosts, null, 4)}`)
    //return the updated posts item
    res.status(200).json({
        status: 200,
        data: newPosts,
        counter: newPosts.length
    })
}
module.exports = { show, index, store, update, destroy }