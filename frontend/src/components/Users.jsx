import React, { useState } from 'react';
import './styles.css';

const users = [
    { name: 'Максим', username: 'maksim-github', skills: ['JavaScript', 'React'], avatar: 'Maksim.jpg' },
    { name: 'Вика', username: 'vika-github', skills: ['HTML', 'CSS'], avatar: 'Vika.jpg' },
    { name: 'Никита', username: 'nikita-github', skills: ['Python', 'Django'], avatar: 'Nikita.jpg' },
    { name: 'Алексей', username: 'aleksei-github', skills: ['Java', 'Spring'], avatar: 'Alekssei.jpg' },
];

function Users() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleClick = async (user) => {
        setSelectedUser(user);
        setLoading(true);
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
            setLoading(false);
        }
    };

    return (
        <div className="users">
            <h1>Список пользователей</h1>
            <ul className="users-list">
                {users.map((user, index) => (
                    <li key={index} onClick={() => handleClick(user)}>
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
                    {loading ? (
                        <p>Загрузка...</p>
                    ) : repos.length > 0 ? (
                        <ul>
                            {repos.map((repo) => (
                                <li key={repo.id}>
                                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                        {repo.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>У пользователя нет репозиториев или произошла ошибка.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Users;
