import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import About from './pages/About';
import Artist from './pages/Artist';
import PlaylistDetail from './pages/PlaylistDetail';

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/SONIVIO-Music-Player">
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="library" element={<Library />} />
          <Route path="favorites" element={<Library />} />
          <Route path="recent" element={<Library />} />
          <Route path="history" element={<Library />} />
          <Route path="artist/:channelId" element={<Artist />} />
          <Route path="playlist/:id" element={<PlaylistDetail />} />
          <Route path="my-playlist/:id" element={<PlaylistDetail />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
