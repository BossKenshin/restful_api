const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL Database Connection
const cloudgmci = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'gmci',
});

cloudgmci.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/gmci/users', (req, res) => {
    cloudgmci.query('SELECT * FROM user', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});

app.post('/gmci/users', (req, res) => {
    // const { name, email, contact, address } = req.body;
    const usersData = req.body;

    console.log(req.body);

    cloudgmci.query('INSERT IGNORE INTO user (id, name, email, contact, address) VALUES ?',
        [usersData.map(record => [record.id, record.name, record.email, record.contact, record.address])],
        (error, results) => {
            if (error) {
                console.error('Error inserting data into destination database: ' + error.stack);
            } else {
                res.json(results);
                console.log(`Data inserted into ${cloudgmci.database} database. Rows affected: ` + results.affectedRows);
            }
            // Close connections
        })


    // res.status(201).json({ message: 'Users created successfully', users: usersData });

});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
