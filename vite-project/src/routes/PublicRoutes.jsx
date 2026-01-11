import {Routes ,Route,Navigate} from "react-router-dom"

// import Navbar from "./components/Navbar.jsx";
// import Signuppage from "./pages/public/Signuppage.jsx";
// import Loginpage from "./pages/public/Loginpage.jsx";
import React,{Suspense} from "react";
// import Welcomepage from "../pages/public/Welcomepage.jsx";



const UserLogin =React.lazy(()=>import("../pages/public/Loginpage.jsx"));
const UserRegister =React.lazy(()=>import("../pages/public/Signuppage.jsx"));
const Welcomepagee = React.lazy(() => import("../pages/public/Welcomepage.jsx"));
const ForgotPassword = React.lazy(() => import("../pages/public/Forgotpassword.jsx"));  










const PublicRoutes=()=>{

 return (
    <>
     
<Suspense fallback={<div>.........loading</div>}>
      <Routes>
        
      <Route path ="/welcome" element ={<Welcomepagee/>}/>
      <Route path ="/signup" element ={<UserRegister/>}/>
      <Route path ="/login" element ={<UserLogin/>}/>
      <Route path ="/forgotpass" element ={<ForgotPassword/>}/>
              <Route path="*" element={<Navigate to="/welcome" />} />

    
       
      </Routes>
      </Suspense>
    </>
  );
};

export default PublicRoutes;
