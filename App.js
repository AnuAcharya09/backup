//import logo from './logo.svg';
import './App.css';
import { Box } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import InsertForm from './Pages/InsertForm';
//import ProductTable from './Components/ProductTable';
//import ProductForm from './Components/ProductForm';
import UpdateForm from './Pages/UpdateForm';
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import AccountMenu from './Components/Account';
import { useEffect, useState } from 'react';
import axios from 'axios';
import About from './Pages/About';
import Products from './Pages/Products';
import MyProducts from './Pages/MyProducts';
import ProductDetails from './Pages/ProductDetails';
import Profile from './Pages/Profile';
import { ToastContainer, toast } from 'react-toastify';
import Loader from './Components/Loader';
import Footer from './Components/Footer';

//import ProductUpdate from './Components/ProductUpdateForm';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formInfo, setFormInfo] = useState({
    username: "",
    email: "",
    phone: "",
    profile: null,
    nPassword: "",
    cPassword: "",
  });
  const [state, setState] = useState(true);
  useEffect(() => {
    setFormInfo({
      ...formInfo,
      username: user?.username,
      email: user?.email,
      phone: user?.phone,
    });
  }, [user]);
  //console.log(formInfo);

  const getUserProfile = (auth) => {
    //console.log(auth);
    axios
      .get("http://localhost:7000/user/get-user-profile", {
        headers: { "auth-token": auth },
      })
      .then((res) => {
        // console.log(res.data);

        setUser(res.data.userProfile);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateProfile = (data) => {
    let auth = localStorage.getItem("authToken") || "";

    axios.put(`http://localhost:7000/user/update-profile`, data,
      {
        headers: { "auth-token": auth },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          setUser(res.data.profile);
          setTimeout(() => {
            setLoading(false);
            toast.success("Profile updated successfully");
          }, 4000);
          //toast.success(res.data.message);
        } else {
          toast.warning(res.data.message);
        }
        //alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      })
  };

  return (
    <div>
      <Box>
        <BrowserRouter>
          <Box >
            <AccountMenu
              state={state}
              user={user}
              setUser={setUser}
              getUserProfile={getUserProfile} />
          </Box>
          <Box sx={{minHeight:'100vh'}}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/products' element={<Products />} />
              <Route path='/user-products' element={<MyProducts />} />
              <Route path='/view-product/:id' element={<ProductDetails />} />
              <Route path='/profile' element={<Profile
                user={user}
                updateProfile={updateProfile}
                formInfo={formInfo}
                setFormInfo={setFormInfo}
                setLoading={setLoading}
              />} />


              <Route path='/insert' element={<InsertForm />} />
              {/*<Route path='/product-table' element={<ProductTable/>}/>
          <Route path='/product-form' element={<ProductForm/>}/>
          <Route path='/product-update' element={<ProductUpdate/>}/>*/}
              <Route path='/edit/:id' element={<UpdateForm />} />
              <Route path='/login' element={<SignIn state={state} setState={setState} />} />
              <Route path='/register' element={<SignUp />} />
            </Routes>
          </Box>
        </BrowserRouter>
        <Footer />
        <ToastContainer />
        <Loader setLoading={setLoading} loading={loading} />
      </Box>
    </div>
  );
}

export default App;
