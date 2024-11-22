import React, { useState } from 'react';
import './styles.css';

const users = [
    { name: 'Наташа', username: 'Natalua9', skills: ['Laravel', 'React'], avatar: 'Natalya.jpg' },
    { name: 'Денис', username: 'Denis18UKS', skills: ['React', 'Node.js'], avatar: 'Denis.jpg' },
    { name: 'Марат', username: 'Molin1987', skills: ['Laravel', 'PHP'], avatar: 'Marat.jpg' },
    { name: 'Влад', username: 'AikenOZ', skills: ['Python', 'ИИ'], avatar: 'Alekssei.jpg' },
];

function Users() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [repos, setRepos] = useState([]);
    const [commits, setCommits] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingRepos, setLoadingRepos] = useState(false);
    const [loadingCommits, setLoadingCommits] = useState(false);
    const [loadingBranches, setLoadingBranches] = useState(false);

    const fetchRepos = async (user) => {
        setSelectedUser(user);
        setLoadingRepos(true);
        setRepos([]);
        try {
            const response = await fetch(`https://api.github.com/users/${user.username}/repos`);
            const data = await response.json();
            if (response.ok) {
                setRepos(data);
            } else {
                console.error('Ошибка при получении репозиториев:', data.message);
            }
        } catch (error) {
            console.error('Ошибка при подключении к GitHub API:', error);
        } finally {
            setLoadingRepos(false);
        }
    };

    const fetchCommits = async (repoName) => {
        setLoadingCommits(true);
        setCommits([]);
        try {
            const response = await fetch(`https://api.github.com/repos/${selectedUser.username}/${repoName}/commits`);
            const data = await response.json();
            setSelectedRepo(repoName);
            setCommits(Array.isArray(data) ? data : []);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Ошибка при получении коммитов:', error);
            setCommits([]);
            setIsModalOpen(true);
        } finally {
            setLoadingCommits(false);
        }
    };

    const fetchBranches = async (repoName) => {
        setLoadingBranches(true);
        setBranches([]);
        try {
            const response = await fetch(`https://api.github.com/repos/${selectedUser.username}/${repoName}/branches`);
            const data = await response.json();
            if (response.ok) {
                setBranches(data);
            } else {
                console.error('Ошибка при получении веток:', data.message);
            }
        } catch (error) {
            console.error('Ошибка при подключении к GitHub API:', error);
        } finally {
            setLoadingBranches(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRepo(null);
        setCommits([]);
    };

    return (
        <div className="users">
            <h1>Список пользователей</h1>
            <ul className="users-list">
                {users.map((user, index) => (
                    <li key={index} onClick={() => fetchRepos(user)}>
                        <img src={`./images/users-avatars/${user.avatar}`} alt={`${user.name} avatar`} />
                        <div>
                            <p>{user.name}</p>
                            <hr />
                            <h6>
                                <i>{user.skills.join(', ')}</i>
                            </h6>
                        </div>
                    </li>
                ))}
            </ul>

            {selectedUser && (
                <div className="user-repos">
                    <h2>Репозитории пользователя: {selectedUser.name}</h2>
                    {loadingRepos ? (
                        <p>Загрузка репозиториев...</p>
                    ) : repos.length > 0 ? (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Репозиторий</th>
                                    <th>Коммиты</th>
                                    <th>Ветки</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {repos.map((repo) => (
                                    <tr key={repo.id}>
                                        <td>
                                            <a
                                                href={repo.html_url}
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
                                            <button onClick={() => fetchBranches(repo.name)} className="small-button">
                                                Показать ветки
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => window.open(`${repo.html_url}/archive/refs/heads/${repo.default_branch}.zip`)}
                                                className="small-button"
                                            >
                                                Скачать
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>У пользователя нет репозиториев или превышен лимит запросов</p>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={closeModal}>
                            &times;
                        </span>
                        <h2>Репозиторий: {selectedRepo}</h2>
                        {loadingCommits ? (
                            <p>Загрузка коммитов...</p>
                        ) : commits.length > 0 ? (
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
                        ) : (
                            <p>Коммитов не найдено или произошла ошибка.</p>
                        )}
                    </div>
                </div>
            )}

            {branches.length > 0 && (
                <div className="branches">
                    <h3>Ветки репозитория: {selectedRepo}</h3>
                    <ul>
                        {branches.map((branch) => (
                            <li key={branch.name}>{branch.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Users;
