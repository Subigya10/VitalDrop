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
const ResetPassword = React.lazy(() => import("../pages/public/ResetPassword.jsx"));
const About = React.lazy(() => import("../pages/public/About.jsx"));










const PublicRoutes=()=>{

 return (
    <>
     
<Suspense fallback={
  <div style={{
    position: "fixed", inset: 0,
    background: "#fff5f5",
    display: "flex", alignItems: "center", justifyContent: "center"
  }}>
    <div style={{
      width: "36px", height: "36px",
      border: "3px solid #fecaca",
      borderTop: "3px solid #ef4444",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite"
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
}>
      <Routes>
        
      <Route path ="/" element ={<Welcomepagee/>}/>
      <Route path ="/signup" element ={<UserRegister/>}/>
      <Route path ="/login" element ={<UserLogin/>}/>
      <Route path ="/forgotpass" element ={<ForgotPassword/>}/>
      <Route path ="/reset-password" element ={<ResetPassword/>}/>
      <Route path="/about" element={<About />} /> // ← ADD
      <Route path="*" element={<Navigate to="/" />} />


    
       
      </Routes>
      </Suspense>
    </>
  );
};

export default PublicRoutes;
