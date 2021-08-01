const router = require('express').Router();
const { Post, Comment, User } = require('../models');

router.get("/", (req, res) => {
    console.log(req.session);
    
    Post.findAll({
        attributes: ["id", "title", "created_at", "content"],
        include: [
            {
                model: Comment,
                attributes: ["id", "user_id", "created_at", "post_id", "comment_text"],
                include: {
                    model: User,
                    attributes: ["username"],
                },
            },
            {
                model: User,
                attributes: ["username"],
            }
        ]
    })
    .then((dbPostData) => {
        const posts = dbPostData.map((post) => post.get({ plain: true }));
        res.render("homepage", { posts, loggedIn: req.session.loggedIn, });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
        return;
    }
})

router.get("/post/:id", (req, res) => {

    Post.findOne({
        where: {
            id: req.params.id,
        },
        attributes: ["id", "title", "created_at", "content"],
        include: [
            {
                model: Comment,
                attributes: ["id", "user_id", "created_at", "post_id", "comment_text"],
                include: {
                    model: User,
                    attributes: ["username"],
                },
            },
            {
                model: User,
                attributes: ["username"],
            }
        ]
    })
    .then((dbPostData) => {
        if (!dbPostData) {
            res.status(404).json({ message: "No post with this ID exists." })
        }

        const post = dbPostData.get({ plain: ture });

        // post template data
        res.render("single-post", {
            post,
            loggedIn: req.session.loggedIn,
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;