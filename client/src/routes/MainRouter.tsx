import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Index from '../primary_comps/Index';
import Login from '../primary_comps/Auth/Login';
import Register from '../primary_comps/Auth/Register';
import Forum from '../primary_comps/Forum/Forum';
import PostCreate from '../primary_comps/Forum/Postcreate';
import UserProfile from '../components/Profile/Profile';
import EditPost from '../primary_comps/Forum/EditPost';

function MainRouter() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Forum" element={<Forum />} />
          <Route path="/Create-post" element={<PostCreate />} />
          <Route path="/Edit-post/:id" element={<EditPost />} />
          <Route path="/Profile" element={<UserProfile />} />
        </Routes>
    </Router>
  );
}

export default MainRouter;
