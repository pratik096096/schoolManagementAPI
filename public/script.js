document.getElementById('addSchoolForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);

    try {
        const response = await fetch('http://localhost:3000/api/addSchool', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, address, latitude, longitude })
        });

        const result = await response.json();
        alert(result.message);

        
        document.getElementById('addSchoolForm').reset();
    } catch (error) {
        console.error('Error adding school:', error);
    }
});

document.getElementById('fetchSchools').addEventListener('click', async () => {
    const latitude = parseFloat(document.getElementById('userLatitude').value);
    const longitude = parseFloat(document.getElementById('userLongitude').value);

    try {
        const response = await fetch(`http://localhost:3000/api/listSchools?latitude=${latitude}&longitude=${longitude}`);
        const schools = await response.json();

        const list = document.getElementById('schoolsList');
        list.innerHTML = '';
        schools.forEach(school => {
            const li = document.createElement('li');
            li.textContent = `${school.name} - ${school.address} (${school.distance.toFixed(2)} km away)`;
            list.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching schools:', error);
    }
});
