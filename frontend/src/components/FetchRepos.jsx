import React, { useState } from 'react';
import './FetchRepos.css';

function FetchRepos() {
    const [username, setUsername] = useState('');
    const [repos, setRepos] = useState([]);
    const [commits, setCommits] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchRepos = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/repos/${username}`);
            const data = await response.json();
            setRepos(data);
        } catch (error) {
            console.error('Error fetching repos:', error);
        }
    };

    const fetchCommits = async (repoName) => {
        try {
            const response = await fetch(`http://localhost:5000/api/repos/${username}/${repoName}/commits`);
            const data = await response.json();
            setSelectedRepo(repoName);
            setCommits(data);
            setIsModalOpen(true); // Открытие модального окна
        } catch (error) {
            console.error('Error fetching commits:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRepo(null);
        setCommits([]);
    };

    const downloadRepo = async (repoName) => {
        const url = `http://localhost:5000/api/repos/${username}/${repoName}/download`;
        window.open(url, '_blank');
    };

    return (
        <div className="container">
            <h1 className="title">GitHub Repository Viewer</h1>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Введите GitHub username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input"
                />
                <button onClick={fetchRepos} className="button">
                    Найти репозитории
                </button>
            </div>

            {repos.length > 0 && (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Репозитории</th>
                            <th>Коммиты</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {repos.map((repo) => (
                            <tr key={repo.id}>
                                <td>
                                    <a
                                        href={`https://github.com/${username}/${repo.name}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="repo-link"
                                    >
                                        {repo.name}
                                    </a>
                                </td>
                                <td>
                                    <button onClick={() => fetchCommits(repo.name)} className="small-button">
                                        Показать коммиты
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => downloadRepo(repo.name)} className="small-button">
                                        Скачать
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={closeModal}>
                            &times;
                        </span>
                        <h2>Репозиторий: {selectedRepo}</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Автор</th>
                                    <th>Сообщение</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commits.map((commit, index) => (
                                    <tr key={index}>
                                        <td>{commit.commit.author.name}</td>
                                        <td>{commit.commit.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FetchRepos;
