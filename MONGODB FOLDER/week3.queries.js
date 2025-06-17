const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// .env file
// This file should not be committed to version control
// It contains sensitive information like API keys, database URIs, etc. 
// Make sure to add .env to your .gitignore file
// Example content of .env file
// MONGODB_URI=mongodb://localhost:27017/