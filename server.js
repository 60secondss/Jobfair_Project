const express = require('express');
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');




// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Routes files
const companies = require('./routes/companies');
const interviews= require('./routes/interviews');
const auth = require('./routes/auth');
const jobpostings = require('./routes/jobpostings');


const app = express();



// Body Parser
app.use(express.json());

//sanitize data
app.use(mongoSanitize());

// set security headers
app.use(helmet());

//Rate limiting
const limiter=rateLimit({
    windowsMs:10*60*1000,
    max: 50
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

//enable cors
app.use(cors());

//prevent xss attacks
app.use(xss());

//cookie  parser
app.use(cookieParser());

// Mount Router
app.use('/api/v1/companies', companies);
app.use('/api/v1/interviews', interviews);
app.use('/api/v1/auth',auth);
app.use('/api/v1/jobpostings',jobpostings);



const PORT = process.env.PORT || 5005;
const server = app.listen(PORT, console.log("Server running in " + process.env.NODE_ENV + " mode on port " + PORT));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});


