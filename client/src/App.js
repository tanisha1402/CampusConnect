// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import CreateCommunity from "./pages/CreateCommunity";
import CommunityPage from "./pages/CommunityPage";
import Search from "./pages/Search";
import AppLayout from "./layouts/AppLayout";
import Inbox from "./pages/Inbox";
import Chat from "./pages/Chat";
import SavedPosts from "./pages/SavedPosts";
import ResourceHub from "./pages/ResourceHub";
import EventFeed from "./pages/EventFeed";
import FollowingFeed from "./pages/FollowingFeed";
import CommunitiesFeed from "./pages/CommunitiesFeed";
import GetStarted from "./pages/GetStarted";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<AppLayout />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/resources" element={<ResourceHub />} />
  <Route path="/events" element={<EventFeed />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/profile/:id" element={<PublicProfile />} />
  <Route path="/communities/create" element={<CreateCommunity />} />
  <Route path="/communities/:id" element={<CommunityPage />} />
  <Route path="/messages" element={<Inbox />} />
  <Route path="/messages/:id" element={<Chat />} />
<Route path="/following" element={<FollowingFeed />} />
<Route path="/communities-feed" element={<CommunitiesFeed />} />


  <Route path="/search" element={<Search />} />
  <Route path="/saved" element={<SavedPosts />} />

</Route>
        {/* You can add more later */}
        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/posts" element={<Posts />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

