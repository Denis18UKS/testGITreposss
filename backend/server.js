// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/repos/:username', async (req, res) => {
    const username = req.params.username;
    try {
        // Отправка запроса к GitHub API через ваш сервер
        const response = await axios.get(`https://api.github.com/users/${username}/repos`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching repos:', error);
        res.status(500).json({ error: 'Error fetching repos' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
