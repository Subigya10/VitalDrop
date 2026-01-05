import {BrowserRouter as Router ,Routes ,Route,Navigate} from "react-router-dom"
import Welcomepage  from "./pages/public/Welcomepage.jsx";
// import Navbar from "./components/Navbar.jsx";
// import Signuppage from "./pages/public/Signuppage.jsx";
// import Loginpage from "./pages/public/Loginpage.jsx";
import React,{Suspense} from "react";



const UserLogin =React.lazy(()=>import("./pages/public/Loginpage.jsx"));
const UserRegister =React.lazy(()=>import("./pages/public/Signuppage.jsx"));
import PublicRoutes from "./routes/PublicRoutes.jsx"; // adjust path if needed
import PrivateRoutes from "./routes/PrivateRoutes.jsx";



function App() {
  const token = localStorage.getItem("access_token");
  return <>{token ? <PrivateRoutes /> : <PublicRoutes />}</>;
}








// function App(){
//   return(
//   <>
     
// <Suspense fallback={<div>.........loading</div>}>
//       <Routes>
        
//       <Route path ="/welcome" element ={<Welcomepage/>}/>
//       <Route path ="/signup" element ={<UserRegister/>}/>
//       <Route path ="/login" element ={<UserLogin/>}/>
//               <Route path="*" element={<Navigate to="/welcome" />} />

    
       
//       </Routes>
//       </Suspense>
//     </>
//   );
// };

export default App;