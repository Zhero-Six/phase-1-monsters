// js/index.js

document.addEventListener('DOMContentLoaded', () => {
    const createMonsterDiv = document.getElementById('create-monster');
    const monsterContainer = document.getElementById('monster-container');
    const forwardBtn = document.getElementById('forward');
    const backBtn = document.getElementById('back');
    const baseUrl = 'http://localhost:3000/monsters';
    let currentPage = 1;
    const limit = 50;

    // Create and add monster form
    function createMonsterForm() {
        const form = document.createElement('form');
        form.innerHTML = `
            <input type="text" id="name" placeholder="Name..." required>
            <input type="number" id="age" placeholder="Age..." step="any" required>
            <input type="text" id="description" placeholder="Description..." required>
            <button type="submit">Create Monster</button>
        `;
        createMonsterDiv.appendChild(form);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            createMonster();
        });
    }

    // Fetch monsters
    function fetchMonsters(page = 1) {
        fetch(`${baseUrl}?_limit=${limit}&_page=${page}`)
            .then(response => response.json())
            .then(monsters => {
                monsterContainer.innerHTML = ''; // Clear existing monsters
                monsters.forEach(monster => renderMonster(monster));
                // Disable back button on first page
                backBtn.disabled = page === 1;
            })
            .catch(error => console.error('Error fetching monsters:', error));
    }

    // Render a single monster
    function renderMonster(monster) {
        const div = document.createElement('div');
        div.innerHTML = `
            <h2>${monster.name}</h2>
            <p>Age: ${monster.age}</p>
            <p>${monster.description}</p>
        `;
        monsterContainer.appendChild(div);
    }

    // Create new monster
    function createMonster() {
        const name = document.getElementById('name').value;
        const age = parseFloat(document.getElementById('age').value);
        const description = document.getElementById('description').value;

        const newMonster = { name, age, description };

        fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newMonster)
        })
        .then(response => response.json())
        .then(monster => {
            renderMonster(monster);
            document.querySelector('form').reset();
        })
        .catch(error => console.error('Error creating monster:', error));
    }

    // Event listeners for navigation
    forwardBtn.addEventListener('click', () => {
        currentPage++;
        fetchMonsters(currentPage);
    });

    backBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchMonsters(currentPage);
        }
    });

    // Initialize the application
    createMonsterForm();
    fetchMonsters(currentPage);
});