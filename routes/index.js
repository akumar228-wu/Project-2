require('../models/Blog');
require('../models/Registration');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Registration = mongoose.model('Registration');
const Blog = mongoose.model('Blog');

router.get('/home', isLoggedIn, (req, res) => {
  console.log('Homepage - User:', req.user); 
  console.log('Homepage - Session:', req.session);
  res.render('index', { 
    title: 'Registration form',
    user: req.user,  
    username: req.user ? req.user.username : null, 
    isAuthenticated: req.isAuthenticated()  
  });
});
router.get('/register', (req, res) => {
  //res.send('It works!');
  res.render('register', { title: 'Registration Page' });
});

router.get('/thankyou', (req, res) => {
  res.render('thankyou', { title: 'Thank You' });
});


router.get('/blog', isLoggedIn, async (req, res) => {
  try {
    const blogPosts = await Blog.find().lean();
    let user = await Registration.findOne({ username: req.user.username }).lean();

    
    if (!user) {
      user = { like_list: [] };
      console.warn(`User ${req.user.username} not found in the database`);
    }

    const formattedPosts = blogPosts.map(({ _id, title, description, image_url, date, content, author, likes }) => ({
      _id: _id.toString(),
      title,
      description,
      image_url,
      date,
      content,
      author,
      likes: likes || 0,
      isLiked: user.like_list ? user.like_list.includes(_id.toString()) : false
    }));

    res.render('blog', { 
      title: 'Blog Posts',
      lis: formattedPosts,
      username: req.user.username
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).send('Error fetching blog posts');
  }
});

router.get('/blog/:id', isLoggedIn, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id).lean();
    const user = await Registration.findOne({ username: req.user.username }).lean();

    if (!post) {
      return res.status(404).send('Blog post not found');
    }

    const formattedPost = {
      ...post,
      _id: post._id.toString(),
      likes: post.likes || 0,
      isLiked: user.like_list ? user.like_list.includes(post._id.toString()) : false
    };

    res.render('blogPost', { 
      title: post.title,
      post: formattedPost,
      username: req.user.username
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).send('Error fetching blog post');
  }
});
router.post('/toggle-like', isLoggedIn, async (req, res) => {
  try {
    const { blogCardId } = req.body;
    const username = req.user.username;

    const user = await Registration.findOne({ username });
    const blogC = await Blog.findById(blogCardId);

    const isLiked = user.like_list.includes(blogCardId);

    if (isLiked) {
      
      await Registration.updateOne(
        { username },
        { $pull: { like_list: blogCardId } }
      );
      blogC.likes = (blogC.likes || 1) - 1;
    } else {
      
      await Registration.updateOne(
        { username },
        { $addToSet: { like_list: blogCardId } }
      );
      blogC.likes = (blogC.likes || 0) + 1;
    }

    await blogC.save();

    res.json({ likes: blogC.likes, isLiked: !isLiked });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Error toggling like' });
  }
});

router.get('/registrations', isLoggedIn, (req, res) => {//basic.check((req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('registrants', { title: 'Listing registrations', registrations });
    })
    .catch(() => { 
      res.send('Sorry! Something went wrong.'); 
    });
});











const registerValidationRules = [
  body('username')
    .isLength({ min: 5 }).withMessage('Username must be at least 5 characters long')
    .isAlphanumeric().withMessage('Username must contain only letters and numbers'),
  body('email')
    .isEmail().withMessage('Please enter a valid email'),
  body('phone')
    .isMobilePhone().withMessage('Please enter a valid phone number'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character')
];

router.post('/register', 
    (req, res, next) => {
        const registerLimiter = req.app.get('registerLimiter');
        registerLimiter(req, res, next);
    },
    registerValidationRules, 
    (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
          Registration.register(new Registration({ username: req.body.username, email: req.body.email, phone: req.body.phone }), req.body.password, (err, user) => {
            if (err) {
              console.log(err);
              return res.render('register', { title: 'Registration Page', errors: [{ msg: err.message }], data: req.body });
            }
            passport.authenticate('local')(req, res, () => {
              res.redirect('/thankyou');
            });
          });
        } else {
          res.render('register', { 
            title: 'Registration Page',
            errors: errors.array(),
            data: req.body,
          });
        }
    }
);

router.get('/login', (req, res, next) => {
  const loginLimiter = req.app.get('loginLimiter');
  loginLimiter(req, res, (err) => {
    if (err) {
      
      return res.render('login', { 
        title: 'Login',
        errors: [{ msg: "Too many login attempts. Please try again later." }],
        data: {}
      });
    }
    
    next();
  });
}, (req, res) => {
  
  res.render('login', { 
    title: 'Login',
    errors: [],
    data: {}
  });
});


router.post('/login', (req, res, next) => {
  const loginLimiter = req.app.get('loginLimiter');
  loginLimiter(req, res, (err) => {
    if (req.rateLimit && req.rateLimit.isLimited) {
      
      return res.render('login', { 
        title: 'Login',
        errors: [{ msg: req.rateLimit.message }],
        data: req.body
      });
    }
    
    next();
  });
}, (req, res, next) => {
  passport.authenticate('local', (authErr, user, info) => {
    if (authErr) {
      return next(authErr);
    }
    if (!user) {
      
      return res.render('login', { 
        title: 'Login',
        errors: [{ msg: info.message || 'Invalid username or password' }],
        data: req.body
      });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.redirect('/blog'); 
    });
  })(req, res, next);
});
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/home');
  });
});


function isLoggedIn(req, res, next) {
  console.log('========= Auth Check =========');
  console.log('Session ID:', req.sessionID);
  console.log('Session:', req.session);
  console.log('Is authenticated:', req.isAuthenticated());
  console.log('User:', req.user);
  console.log('Cookies:', req.cookies);
  console.log('============================');
  
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
module.exports = router;