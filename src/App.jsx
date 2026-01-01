import {BrowserRouter as Router ,Routes ,Route} from "react-router-dom"
import Welcomepage  from "./pages/Welcomepage.jsx";
import Navbar from "./components/Navbar.jsx";










function App(){
  return(
  <>
      <Navbar/>

      <Routes>
      <Route path ="/" element ={<Welcomepage/>}/>
      </Routes>
    </>
  )
}

export default App;