const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

let connection;

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Function to connect to the database
function handleDisconnect() {
  connection = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'db', // Change to your database service name
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DATABASE || 'formdb',
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      setTimeout(handleDisconnect, 2000); // Retry connection after 2 seconds
    } else {
      console.log('Connected to MySQL database.');
    }
  });

  connection.on('error', (err) => {
    console.error('MySQL error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Reconnect if connection was lost
    } else {
      throw err; // Throw the error if it's not a connection issue
    }
  });
}

handleDisconnect();

// Serve index.html on the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body;

    const sql = 'INSERT INTO form_data (name, email, message) VALUES (?, ?, ?)';
    connection.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error inserting data: ', err);
            return res.send('Error saving data');
        }
        console.log('Data inserted: ', result);
        res.send('Form data saved successfully!');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

