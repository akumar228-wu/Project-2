
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image_url: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  likes: {
    type: Number,
  }
}, { strict: false });


mongoose.model('Blog', blogSchema, 'blog');


require('../models/Registration');


const app = require('../app');
const Registration = mongoose.model('Registration');
const Blog = mongoose.model('Blog');

describe('Routes Testing', () => {
  let mongoServer;
  let testBlog;
  let testUser;

  
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
  });

  
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  
  beforeEach(async () => {
    await Registration.deleteMany({});
    await Blog.deleteMany({});

    
    testUser = {
      username: 'testuser',
      email: 'test@example.com',
      phone: '1234567890',
      password: 'TestPass123!'
    };

    
    testBlog = {
      title: 'Test Blog Title',
      description: 'Test Blog Description',
      image_url: 'test-image.jpg',
      date: new Date().toISOString(),
      content: 'Test Blog Content',
      author: testUser.username,
      likes: 0
    };
  });


  describe('Authentication Tests', () => {
    describe('Registration', () => {
      test('GET /register should render registration page', async () => {
        const response = await request(app)
          .get('/register')
          .expect(200);
        
        expect(response.text).toContain('Register to subscribe');
      });

      test('POST /register should create new user successfully', async () => {
        const response = await request(app)
          .post('/register')
          .send(testUser)
          .expect(302); 

        const user = await Registration.findOne({ username: testUser.username });
        expect(user).toBeTruthy();
        expect(user.email).toBe(testUser.email);
      });

      test('POST /register should fail with invalid data', async () => {
        const invalidUser = { ...testUser, email: 'invalid-email' };
        const response = await request(app)
          .post('/register')
          .send(invalidUser)
          .expect(200); 

        expect(response.text).toContain('error');
      });
    });

    describe('Login/Logout', () => {
      beforeEach(async () => {
        
        await Registration.register(
          new Registration({
            username: testUser.username,
            email: testUser.email,
            phone: testUser.phone
          }),
          testUser.password
        );
      });

      test('GET /login should render login page', async () => {
        const response = await request(app)
          .get('/login')
          .expect(200);
        
        expect(response.text).toContain('Log in to see blogs');
      });

      test('POST /login should authenticate valid user', async () => {
        await request(app)
          .post('/login')
          .send({
            username: testUser.username,
            password: testUser.password
          })
          .expect(302) 
          .expect('Location', '/blog');
      });

      test('POST /login should reject invalid credentials', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            username: testUser.username,
            password: 'wrongpassword'
          })
          .expect(200);

        
        expect(response.text).toContain('Password or username is incorrect');
      });

      test('GET /logout should log out user', async () => {
        const agent = request.agent(app);
        
        
        await agent
          .post('/login')
          .send({
            username: testUser.username,
            password: testUser.password
          });

        
        await agent
          .get('/logout')
          .expect(302)
          .expect('Location', '/home');
      });
    });
  });




  



  







  










  









  







  




  




  


  




  





  





  



  





  




  



  



      


      







  
  
  describe('Authentication Behavior', () => {
    test('Protected routes should redirect to login when not authenticated', async () => {
      const agent = request(app);
  
      
      await agent
        .get('/blog')
        .expect(302)
        .expect('Location', '/login');
  
      
      await agent
        .post('/toggle-like')
        .send({ blogCardId: 'some-id' })
        .expect(302)
        .expect('Location', '/login');
    });
  });
});