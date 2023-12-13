import React  from 'react';
import Login from './Pages/Login.jsx';
import { Route,Routes} from 'react-router-dom';
import ForgetPassword from "./Pages/ForgetPassword.jsx";
import ChangePassword from "./Pages/ChangePassword.jsx";
import Register from './Pages/Register.jsx';
import FoodPage from "./Pages/FoodPage.jsx";
import History from "./Pages/History.jsx";
import AdminAddItem from "./Pages/AdminAddItems.jsx";
import AdminModifyDetails from './Pages/AdminModifyDetails.jsx';
import Profile from "./Pages/Profile.jsx";
import AdminManageItem from './Pages/AdminManageItem.jsx';
import Admin from './Pages/Admin.jsx';
function App() {
  return (
   <Routes>
    <Route path='/' element={<Login/>}/>
    <Route path='/ForgetPassword' element={<ForgetPassword/>}/>
    <Route path='/ChangePassword' element={<ChangePassword/>}/>
    <Route path='/Register' element={<Register/>}/>
    <Route path='/Admin' element={<Admin/>}/>
    <Route path='/FoodPage' element={<FoodPage/>}/>
    <Route path='/History' element={<History/>}/>
    <Route path='/AdminAddItem' element={<AdminAddItem/>}/>
    <Route path="/AdminModify" element={<AdminModifyDetails/>}/>
    <Route path='/Profile' element={<Profile/>}/>
    <Route path='/AdminManageItem' element={<AdminManageItem/>}/>
   </Routes>
  
  );
}
export default App;
