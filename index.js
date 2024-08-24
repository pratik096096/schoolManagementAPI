const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');  // Import the promise-based DB connection pool
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Function to calculate the distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => degree * (Math.PI / 180);
    const R = 6371; // Radius of the earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// API to add a new school
app.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';

    try {
        const [result] = await db.query(query, [name, address, latitude, longitude]);
        res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// API to list all schools within a specified distance
app.get('/listSchools', async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    const query = 'SELECT * FROM schools';

    try {
        const [results] = await db.query(query);

        const userLatitude = parseFloat(latitude);
        const userLongitude = parseFloat(longitude);

        const schools = results.map(school => {
            const distance = calculateDistance(userLatitude, userLongitude, school.latitude, school.longitude);
            return { ...school, distance };
        });

        schools.sort((a, b) => a.distance - b.distance);

        res.status(200).json(schools);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
