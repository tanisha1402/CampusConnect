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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<AppLayout />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/profile/:id" element={<PublicProfile />} />
  <Route path="/communities/create" element={<CreateCommunity />} />
  <Route path="/communities/:id" element={<CommunityPage />} />
  <Route path="/messages" element={<Inbox />} />
  <Route path="/messages/:id" element={<Chat />} />

  <Route path="/search" element={<Search />} />
</Route>
        {/* You can add more later */}
        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/posts" element={<Posts />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

















// // client/src/App.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [mode, setMode] = useState('login');

//   // login form
//   const [loginEmail, setLoginEmail] = useState('');
//   const [loginPassword, setLoginPassword] = useState('');

//   // register form
//   const [regName, setRegName] = useState('');
//   const [regEmail, setRegEmail] = useState('');
//   const [regPassword, setRegPassword] = useState('');
//   const [regRole, setRegRole] = useState('student');

//   // messages
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState(''); // 'success' | 'error'

//   // auth state
//   const [token, setToken] = useState('');
//   const [user, setUser] = useState(null);

//   // posts
//   const [newPostContent, setNewPostContent] = useState('');
//   const [posts, setPosts] = useState([]);
//   const [isLoadingPosts, setIsLoadingPosts] = useState(false);

//   // load token & user on first load
//   useEffect(() => {
//   const savedToken = localStorage.getItem('token');
//   if (!savedToken) return;

//   setToken(savedToken);

//   const api = axios.create({
//     baseURL: 'http://localhost:5000',
//     headers: {
//       Authorization: `Bearer ${savedToken}`,
//     },
//   });

//   // get /me
//   api
//     .get('/api/users/me')
//     .then((res) => {
//       setUser(res.data);
//     })
//     .catch((err) => {
//       console.error('Error fetching /me on load:', err);
//     });

//   // get /posts
//   setIsLoadingPosts(true);
//   api
//     .get('/api/posts')
//     .then((res) => {
//       setPosts(res.data);
//     })
//     .catch((err) => {
//       console.error('Error fetching posts on load:', err);
//     })
//     .finally(() => {
//       setIsLoadingPosts(false);
//     });
// }, []);


//   // axios instance with auth
//   const axiosAuth = (currentToken) => {
//     return axios.create({
//       baseURL: 'http://localhost:5000',
//       headers: {
//         Authorization: `Bearer ${currentToken}`,
//       },
//     });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setMessageType('');

//     try {
//       const res = await axios.post('http://localhost:5000/api/users/login', {
//         email: loginEmail,
//         password: loginPassword,
//       });

//       const receivedToken = res.data.token;
//       const receivedUser = res.data.user;

//       setToken(receivedToken);
//       setUser(receivedUser);
//       localStorage.setItem('token', receivedToken);

//       setMessage('Login successful!');
//       setMessageType('success');

//       // load posts after login
//      // fetchPosts(receivedToken);
  
//     } catch (err) {
//       console.error(err);
//       setMessageType('error');
//       if (err.response && err.response.data && err.response.data.message) {
//         setMessage('Error: ' + err.response.data.message);
//       } else {
//         setMessage('Error: Something went wrong');
//       }
//     }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setMessageType('');

//     try {
//       const res = await axios.post('http://localhost:5000/api/users/register', {
//         name: regName,
//         email: regEmail,
//         password: regPassword,
//         role: regRole,
//       });

//       console.log('Register response:', res.data);
//       setMessage('Registration successful! You can now log in.');
//       setMessageType('success');

//       setMode('login');
//       setLoginEmail(regEmail);
//       setLoginPassword('');

//       setRegName('');
//       setRegEmail('');
//       setRegPassword('');
//       setRegRole('student');
//     } catch (err) {
//       console.error(err);
//       setMessageType('error');
//       if (err.response && err.response.data && err.response.data.message) {
//         setMessage('Error: ' + err.response.data.message);
//       } else {
//         setMessage('Error: Something went wrong during registration');
//       }
//     }
//   };

//   const handleLogout = () => {
//     setToken('');
//     setUser(null);
//     setPosts([]);
//     setNewPostContent('');
//     localStorage.removeItem('token');
//     setMessage('Logged out');
//     setMessageType('success');
//   };

//   const handleCreatePost = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setMessageType('');

//     if (!newPostContent.trim()) {
//       setMessage('Please enter something before posting.');
//       setMessageType('error');
//       return;
//     }

//     try {
//       const api = axiosAuth(token);
//       const res = await api.post('/api/posts', {
//         content: newPostContent,
//       });

//       // add new post on top
//       setPosts((prev) => [res.data, ...prev]);
//       setNewPostContent('');
//       setMessage('Post created!');
//       setMessageType('success');
//     } catch (err) {
//       console.error('Error creating post:', err);
//       setMessageType('error');
//       if (err.response && err.response.data && err.response.data.message) {
//         setMessage('Error: ' + err.response.data.message);
//       } else {
//         setMessage('Error: Could not create post');
//       }
//     }
//   };

//   // Logged-in view
//   if (token && user) {
//     return (
//       <div className="App">
//         <div className="dashboard">
//           <h1 className="app-title">CampusConnect</h1>
//           <p className="app-subtitle">You are now logged in ✅</p>

//           <h2 className="dashboard-title">Welcome, {user.name} 🎓</h2>
//           <p className="dashboard-subtitle">
//             This is your simple dashboard. Below is a shared notice board where
//             logged-in users can post campus updates.
//           </p>

//           <p className="dashboard-item">
//             <strong>Email:</strong> {user.email}
//           </p>
//           <p className="dashboard-item">
//             <strong>Role:</strong> {user.role}
//           </p>

//           <button className="logout-btn" onClick={handleLogout}>
//             Logout
//           </button>

//           {/* Notice board */}
//           <div style={{ marginTop: '24px' }}>
//             <h3 className="dashboard-title" style={{ fontSize: '18px' }}>
//               Campus Notice Board
//             </h3>
//             <p className="dashboard-subtitle" style={{ marginBottom: '10px' }}>
//               Share an update, announcement, or message with the campus
//               community.
//             </p>

//             <form onSubmit={handleCreatePost}>
//               <textarea
//                 style={{
//                   width: '100%',
//                   minHeight: '70px',
//                   padding: '8px 10px',
//                   borderRadius: '8px',
//                   border: '1px solid #d1d5db',
//                   fontSize: '14px',
//                   resize: 'vertical',
//                   outline: 'none',
//                 }}
//                 value={newPostContent}
//                 onChange={(e) => setNewPostContent(e.target.value)}
//                 placeholder="Type your post here..."
//               />
//               <button
//                 type="submit"
//                 className="primary-btn"
//                 style={{ marginTop: '8px' }}
//               >
//                 Post
//               </button>
//             </form>
//           </div>

//           {/* Posts list */}
//           <div style={{ marginTop: '16px' }}>
//             <h4
//               style={{
//                 fontSize: '16px',
//                 marginBottom: '8px',
//                 color: '#111827',
//               }}
//             >
//               Recent posts
//             </h4>

//             {isLoadingPosts && (
//               <p className="helper-text">Loading posts...</p>
//             )}

//             {!isLoadingPosts && posts.length === 0 && (
//               <p className="helper-text">
//                 No posts yet. Be the first to post something!
//               </p>
//             )}

//             <div style={{ marginTop: '8px' }}>
//               {posts.map((post) => (
//                 <div
//                   key={post._id}
//                   style={{
//                     borderRadius: '12px',
//                     border: '1px solid #e5e7eb',
//                     padding: '10px 12px',
//                     marginBottom: '8px',
//                     backgroundColor: '#f9fafb',
//                   }}
//                 >
//                   <p
//                     style={{
//                       fontSize: '14px',
//                       color: '#111827',
//                       marginBottom: '6px',
//                     }}
//                   >
//                     {post.content}
//                   </p>
//                   <p
//                     style={{
//                       fontSize: '12px',
//                       color: '#6b7280',
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                     }}
//                   >
//                     <span>
//                       {post.user?.name || 'Unknown'} •{' '}
//                       {post.user?.role || 'user'}
//                     </span>
//                     <span>
//                       {post.createdAt
//                         ? new Date(post.createdAt).toLocaleString()
//                         : ''}
//                     </span>
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {message && (
//             <p
//               className={`message ${
//                 messageType === 'error' ? 'error' : 'success'
//               }`}
//             >
//               {message}
//             </p>
//           )}

//           <p className="helper-text">
//             In your report: “Posts are stored in MongoDB and only authenticated
//             users can create or view them via protected API routes.”
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Not logged in: auth card
//   return (
//     <div className="App">
//       <div className="auth-card">
//         <h1 className="app-title">CampusConnect</h1>
//         <p className="app-subtitle">
//           A simple campus portal with authentication. Login or create a new
//           account below.
//         </p>

//         <div className="tab-row">
//           <button
//             className={`tab-btn ${mode === 'login' ? 'active' : 'inactive'}`}
//             onClick={() => {
//               setMode('login');
//               setMessage('');
//               setMessageType('');
//             }}
//           >
//             Login
//           </button>
//           <button
//             className={`tab-btn ${mode === 'register' ? 'active' : 'inactive'}`}
//             onClick={() => {
//               setMode('register');
//               setMessage('');
//               setMessageType('');
//             }}
//           >
//             Register
//           </button>
//         </div>

//         {mode === 'login' ? (
//           <form className="form" onSubmit={handleLogin}>
//             <div className="form-group">
//               <label className="form-label">Email</label>
//               <input
//                 className="form-input"
//                 type="email"
//                 value={loginEmail}
//                 onChange={(e) => setLoginEmail(e.target.value)}
//                 placeholder="Enter your email"
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">Password</label>
//               <input
//                 className="form-input"
//                 type="password"
//                 value={loginPassword}
//                 onChange={(e) => setLoginPassword(e.target.value)}
//                 placeholder="Enter your password"
//               />
//             </div>

//             <button type="submit" className="primary-btn">
//               Login
//             </button>
//           </form>
//         ) : (
//           <form className="form" onSubmit={handleRegister}>
//             <div className="form-group">
//               <label className="form-label">Name</label>
//               <input
//                 className="form-input"
//                 type="text"
//                 value={regName}
//                 onChange={(e) => setRegName(e.target.value)}
//                 placeholder="Enter your full name"
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">Email</label>
//               <input
//                 className="form-input"
//                 type="email"
//                 value={regEmail}
//                 onChange={(e) => setRegEmail(e.target.value)}
//                 placeholder="Enter your email"
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">Password</label>
//               <input
//                 className="form-input"
//                 type="password"
//                 value={regPassword}
//                 onChange={(e) => setRegPassword(e.target.value)}
//                 placeholder="Choose a password"
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">Role</label>
//               <select
//                 className="form-select"
//                 value={regRole}
//                 onChange={(e) => setRegRole(e.target.value)}
//               >
//                 <option value="student">Student</option>
//                 <option value="faculty">Faculty</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>

//             <button type="submit" className="primary-btn">
//               Create account
//             </button>
//           </form>
//         )}

//         {message && (
//           <p
//             className={`message ${
//               messageType === 'error' ? 'error' : 'success'
//             }`}
//           >
//             {message}
//           </p>
//         )}

//         <p className="helper-text">
//           This is a demo UI. In your report you can mention that more features
//           will be added to the dashboard (like posts, events, messaging, etc.).
//         </p>
//       </div>
//     </div>
//   );
// }

// export default App;
