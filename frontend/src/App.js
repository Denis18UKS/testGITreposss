import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FetchRepos from './components/FetchRepos';
import Users from './components/Users';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Навигационная панель */}
        <header>
          <nav>
            <ul className="navigation">
              <li>
                <Link to="/">Поиск репозиториев</Link>
              </li>
              <li>
                <Link to="/users">Пользователи</Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Роутинг */}
        <main>
          <Routes>
            <Route path="/" element={<FetchRepos />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
