import vitallrem from "../assets/vitallrem.png";
import {Link} from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center bg-white shadow px-5 h-16">
      <img src={vitallrem} alt="myapplogo" className="h-18 w-40 object-contain mt-2" />
      {/* Class	Effect
object-contain	Entire image visible, keeps proportions, may leave empty space */}

      <div className="flex gap-10"> 
        <Link to="/" className="text-sm font-medium text-black hover:text-red-600">Home</Link>
        <Link to="/" className="text-sm font-medium text-black hover:text-red-600">About</Link>
        <Link to="/" className="text-sm font-medium text-black hover:text-red-600">Signup</Link>
        <Link to="/" className="text-sm font-medium text-black hover:text-red-600">Login</Link>
      </div>

    </nav>
  );
};

export default Navbar;