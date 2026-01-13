import vitallrem from "../assets/vitallrem.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center bg-white shadow px-4 md:px-5 h-16 z-50">
      
      {/* Logo */}
      <img 
        src={vitallrem} 
        alt="myapplogo" 
        className="h-12 w-20 md:h-18 md:w-40 object-contain mt-2" 
      />

      {/* Links - ALWAYS VISIBLE on all screen sizes */}
      <div className="flex gap-3 sm:gap-4 md:gap-6 lg:gap-10">
        <Link to="/" className="text-xs sm:text-sm font-medium text-black hover:text-red-600">
          Home
        </Link>
        <Link to="/about" className="text-xs sm:text-sm font-medium text-black hover:text-red-600">
          About
        </Link>
        <Link to="/signup" className="text-xs sm:text-sm font-medium text-black hover:text-red-600">
          Signup
        </Link>
        <Link to="/login" className="text-xs sm:text-sm font-medium text-black hover:text-red-600">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;