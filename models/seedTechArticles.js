const mongoose = require('mongoose');
require('dotenv').config();
const TechArticle = require('./TechArticle'); // Import TechArticle model

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected for seeding"))
  .catch(err => console.error("MongoDB connection error:", err));

// Sample Tech Articles Data
const articles = [
  {
    title: "How AI is Changing Software Development",
    description: "The rise of AI in coding and automation.",
    image_url: "https://example.com/ai-dev.jpg",
    category: "AI",
    content: "AI tools like ChatGPT are transforming software engineering...",
    author: "techguru42"
  },
  {
    title: "Latest Cybersecurity Threats in 2024",
    description: "How to protect your online data.",
    image_url: "https://example.com/cybersecurity.jpg",
    category: "Cybersecurity",
    content: "Hackers are using advanced techniques to exploit vulnerabilities...",
    author: "securityexpert99"
  },
  {
    title: "Top 5 Gadgets to Look Out for in 2024",
    description: "The most exciting tech gadgets releasing this year.",
    image_url: "https://example.com/gadgets.jpg",
    category: "Gadgets",
    content: "Smartphones, wearables, and AI-driven devices are dominating the market...",
    author: "gadgetlover123"
  }
];

// Function to Seed Data
async function seedDB() {
  try {
    await TechArticle.deleteMany({}); // Clear previous data
    await TechArticle.insertMany(articles); // Insert sample data
    console.log("Tech articles seeded successfully!");
    mongoose.connection.close(); // Close connection after seeding
  } catch (err) {
    console.error("Error seeding articles:", err);
    mongoose.connection.close();
  }
}

// Run the Seeding Function
seedDB();
