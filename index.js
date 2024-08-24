
// const express = require('express');
// const bodyParser = require('body-parser');
// const db = require('./db');  

// const app = express();
// app.use(bodyParser.json());  


// function calculateDistance(lat1, lon1, lat2, lon2) {
//     const toRadians = (degree) => degree * (Math.PI / 180);
//     const R = 6371; // Radius of the earth in km
//     const dLat = toRadians(lat2 - lat1);
//     const dLon = toRadians(lon2 - lon1);
//     const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in km
// }

// // Adding School API
// app.post('/api/addSchool', (req, res) => {
//     const { name, address, latitude, longitude } = req.body;

//     // Validate input data
//     if (!name || !address || !latitude || !longitude) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
//     db.query(query, [name, address, latitude, longitude], (err, result) => {
//         if (err) {
//             console.error('Error inserting data:', err);
//             return res.status(500).json({ error: 'Database error' });
//         }
//         res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
//     });
// });

// // Listing Schools API
// app.get('/api/listSchools', (req, res) => {
//     const { latitude, longitude } = req.query;

//     if (!latitude || !longitude) {
//         return res.status(400).json({ error: 'Latitude and Longitude are required' });
//     }

//     const query = 'SELECT * FROM schools';
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error fetching data:', err);
//             return res.status(500).json({ error: 'Database error' });
//         }

//         const userLatitude = parseFloat(latitude);
//         const userLongitude = parseFloat(longitude);

//         const schools = results.map(school => {
//             const distance = calculateDistance(userLatitude, userLongitude, school.latitude, school.longitude);
//             return { ...school, distance };
//         });

//         // Sort schools by distance
//         schools.sort((a, b) => a.distance - b.distance);

//         res.status(200).json(schools);
//     });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db');
const cors = require('cors');

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Add School API
app.post('/api/addSchool', (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).send('Invalid input');
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, latitude, longitude], (err, results) => {
        if (err) {
            console.error('Error adding school:', err);
            return res.status(500).send('Server error');
        }
        res.status(201).json({ message: 'School added successfully', schoolId: results.insertId });
    });
});

// List Schools API
app.get('/api/listSchools', (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).send('Latitude and Longitude are required');
    }

    const query = 'SELECT * FROM schools';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching schools:', err);
            return res.status(500).send('Server error');
        }

        const userLatitude = parseFloat(latitude);
        const userLongitude = parseFloat(longitude);

        const schools = results.map(school => {
            const distance = calculateDistance(userLatitude, userLongitude, school.latitude, school.longitude);
            return { ...school, distance };
        });

        schools.sort((a, b) => a.distance - b.distance);

        res.status(200).json(schools);
    });
});

// Function to calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degree) => degree * (Math.PI / 180);

    const R = 6371; // Radius of the earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
