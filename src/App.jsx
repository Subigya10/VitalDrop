import {BrowserRouter as Router ,Routes ,Route} from "react-router-dom"
import Welcomepage  from "./pages/Welcomepage.jsx";
import Navbar from "./components/Navbar.jsx";
import Signuppage from "./pages/Signuppage.jsx";
import Loginpage from "./pages/Loginpage.jsx";









function App(){
  return(
  <>
     

      <Routes>
      <Route path ="/" element ={<Welcomepage/>}/>
      <Route path ="/signup" element ={<Signuppage/>}/>
      <Route path ="/login" element ={<Loginpage/>}/>
      </Routes>
    </>
  )
}

export default App;