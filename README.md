# School Management API

This project is a simple School Management API that allows users to add schools and list nearby schools based on their geographic coordinates (latitude and longitude). The API is built using Node.js, Express, and MySQL.


## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/school-management-api.git
   cd schoolManagement

   npm install

   node index.js


API Endpoints

Add a School

Endpoint: /addSchool

Method: POST

Description: Adds a new school to the database.

Request Body:

json

Copy code


  {
  
    "name": "School Name",
    "address": "School Address",
    "latitude": 12.9716,
    "longitude": 77.5946,
    
  }







List Nearby Schools
Endpoint: /listSchools

Method: GET

Description: Lists schools near the provided latitude and longitude.

Query Parameters:


latitude: The latitude of the user's location.

longitude: The longitude of the user's location.

Response:

json
Copy code
[

  {
  
    "id": 1,
    "name": "School Name",
    "address": "School Address",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "distance": 2.34
    
  }
]
