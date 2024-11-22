const axios = require('axios');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// URL для GitHub API
const GITHUB_API_BASE = 'https://api.github.com';

// Получение списка репозиториев
router.get('/repos/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const response = await axios.get(`${GITHUB_API_BASE}/users/${username}/repos`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Получение коммитов
router.get('/repos/:username/:repoName/commits', async (req, res) => {
    const { username, repoName } = req.params;
    try {
        const response = await axios.get(`${GITHUB_API_BASE}/repos/${username}/${repoName}/commits`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Скачивание архива репозитория
router.get('/repos/:username/:repoName/download', async (req, res) => {
    const { username, repoName } = req.params;
    const repoUrl = `https://github.com/${username}/${repoName}/archive/refs/heads/main.zip`;

    try {
        const response = await axios.get(repoUrl, { responseType: 'arraybuffer' });
        const tempPath = path.join(__dirname, `${repoName}.zip`);
        fs.writeFileSync(tempPath, response.data);

        res.download(tempPath, `${repoName}.zip`, (err) => {
            if (err) console.error(err);
            fs.unlinkSync(tempPath);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
