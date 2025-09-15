const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const savedJobRoutes = require('./routes/savedJobs');
const reminderRoutes = require('./routes/reminders');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  // Initialize dummy data
  initializeDummyData();
})
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/saved-jobs', savedJobRoutes);
app.use('/api/reminders', reminderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Initialize dummy data
async function initializeDummyData() {
  const Job = require("./models/Job");

  try {
    const existingJobs = await Job.countDocuments();

    if (existingJobs === 0) {
      console.log("Initializing dummy job data (India)...");

      const dummyJobs = [
        {
          title: "Software Engineer",
          company: "TCS",
          location: "Bengaluru, Karnataka",
          description:
            "We are hiring Software Engineers to work on enterprise-grade applications using Java, Spring Boot, and cloud platforms.",
          salary: "₹8,00,000 - ₹12,00,000",
          type: "Full-time",
        },
        {
          title: "Frontend Developer",
          company: "Infosys",
          location: "Hyderabad, Telangana",
          description:
            "Looking for a skilled Frontend Developer with React.js and Next.js experience. Strong knowledge of CSS frameworks required.",
          salary: "₹6,00,000 - ₹10,00,000",
          type: "Full-time",
        },
        {
          title: "Backend Developer",
          company: "Wipro Technologies",
          location: "Pune, Maharashtra",
          description:
            "Backend developer role focusing on Node.js, Express.js, and MongoDB. Knowledge of microservices is preferred.",
          salary: "₹7,50,000 - ₹11,00,000",
          type: "Full-time",
        },
        {
          title: "Full Stack Developer",
          company: "Zoho Corporation",
          location: "Chennai, Tamil Nadu",
          description:
            "Join Zoho’s product development team as a Full Stack Developer. Work on cutting-edge SaaS applications.",
          salary: "₹9,00,000 - ₹13,00,000",
          type: "Full-time",
        },
        {
          title: "Data Analyst",
          company: "Paytm",
          location: "Noida, Uttar Pradesh",
          description:
            "Looking for Data Analysts with strong SQL, Python, and data visualization experience.",
          salary: "₹5,00,000 - ₹8,00,000",
          type: "Full-time",
        },
        {
          title: "DevOps Engineer",
          company: "Reliance Jio",
          location: "Mumbai, Maharashtra",
          description:
            "We need a DevOps Engineer with strong knowledge of CI/CD pipelines, Docker, Kubernetes, and AWS.",
          salary: "₹10,00,000 - ₹15,00,000",
          type: "Full-time",
        },
        {
          title: "UI/UX Designer",
          company: "Flipkart",
          location: "Bengaluru, Karnataka",
          description:
            "Creative UI/UX Designer needed with experience in Figma, Adobe XD, and user research.",
          salary: "₹6,00,000 - ₹9,00,000",
          type: "Full-time",
        },
        {
          title: "Machine Learning Engineer",
          company: "Freshworks",
          location: "Chennai, Tamil Nadu",
          description:
            "Looking for ML Engineers skilled in Python, TensorFlow, and NLP for building smart customer engagement solutions.",
          salary: "₹12,00,000 - ₹18,00,000",
          type: "Full-time",
        },
        {
          title: "Android Developer",
          company: "Ola Cabs",
          location: "Bengaluru, Karnataka",
          description:
            "We are hiring Android Developers with experience in Kotlin and Jetpack Compose.",
          salary: "₹7,00,000 - ₹11,00,000",
          type: "Full-time",
        },
        {
          title: "iOS Developer",
          company: "Zomato",
          location: "Gurgaon, Haryana",
          description:
            "iOS developer role requiring Swift and SwiftUI expertise to build scalable food delivery applications.",
          salary: "₹8,00,000 - ₹12,00,000",
          type: "Full-time",
        },
        {
          title: "Cloud Architect",
          company: "HCL Technologies",
          location: "Noida, Uttar Pradesh",
          description:
            "We need a Cloud Architect with expertise in AWS/Azure cloud architecture, security, and scalability.",
          salary: "₹18,00,000 - ₹25,00,000",
          type: "Full-time",
        },
        {
          title: "Business Analyst",
          company: "ICICI Bank",
          location: "Mumbai, Maharashtra",
          description:
            "Business Analyst role with experience in financial products, requirement gathering, and stakeholder management.",
          salary: "₹6,50,000 - ₹9,50,000",
          type: "Full-time",
        },
        {
          title: "Cybersecurity Specialist",
          company: "Cognizant",
          location: "Chennai, Tamil Nadu",
          description:
            "Cybersecurity role requiring knowledge of penetration testing, firewalls, and incident response.",
          salary: "₹11,00,000 - ₹16,00,000",
          type: "Full-time",
        },
        {
          title: "Intern - Web Development",
          company: "BYJU’S",
          location: "Bengaluru, Karnataka",
          description:
            "Internship opportunity for students in web development with hands-on React.js and Node.js training.",
          salary: "₹15,000 - ₹25,000/month",
          type: "Internship",
        },
        {
          title: "QA Engineer",
          company: "Mindtree",
          location: "Hyderabad, Telangana",
          description:
            "QA Engineer role focusing on automation testing, Selenium, and API testing.",
          salary: "₹5,50,000 - ₹8,50,000",
          type: "Full-time",
        },
      ];

      await Job.insertMany(dummyJobs);
      console.log("✅ Dummy Indian job data initialized successfully!");
    }
  } catch (error) {
    console.error("Error initializing dummy data:", error);
  }
}
