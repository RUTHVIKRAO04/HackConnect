import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Auth } from './pages/Auth';
import { FindTeammates } from './pages/FindTeammates';
import { Groups } from './pages/Groups';
import { MyHackathons } from './pages/MyHackathons';
import { Layout } from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/find-teammates" element={<FindTeammates />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/my-hackathons" element={<MyHackathons />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;