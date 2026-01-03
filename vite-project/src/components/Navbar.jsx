import vitallrem from "../assets/vitallrem.png";
import {Link} from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center bg-white shadow px-5 h-16 z-50">
      <img src={vitallrem} alt="myapplogo" className="h-18 w-40 object-contain mt-2" />
      {/* Class	Effect
object-contain	Entire image visible, keeps proportions, may leave empty space */}

      <div className="flex gap-10"> 
        <Link to="/" className="text-sm font-medium text-black hover:text-red-600">Home</Link>
        <Link to="/" className="text-sm font-medium text-black hover:text-red-600">About</Link>
        <Link to="/signup" className="text-sm font-medium text-black hover:text-red-600">Signup</Link>
        <Link to="/login" className="text-sm font-medium text-black hover:text-red-600">Login</Link>
      </div>

    </nav>
  );
};

export default Navbar;




// import Navbar from "../components/Navbar";
// import dactor from "../assets/dactor.png";

// function Welcomepage(){
//     return(
//         <div className="min-h-screen">
//             <Navbar/>
//         <div className ="pt-16 h-[500px] w-full
//          bg-gradient-to-b from-[#FFE5E5] to-[#FF6B6B]
//           flex  ">

//               <div className="absolute top-20 left-10 w-20 h-20 bg-red-300 rounded-full opacity-30"></div>
//               <div className="absolute bottom-10 right-20 w-32 h-32 bg-pink-400 rounded-full opacity-20"></div>
      
//               <div className="absolute bottom-32 left-32 w-24 h-24 bg-pink-300 rounded-full opacity-15"></div>


//               <div className="w-2/3 " >
//               <h1 className="text-7xl font-bold text-black mt-12 ml-10">
//               Your blood can be someone's <span className ="text-red-600">life </span>
//               </h1>
//               <h1 className ="text-3xl text-black font-bold ml-12 mt-6 ">
//                 Helping Nepal in Emergencies
//               </h1>


//                <div className="flex mt-16 ml-48 gap-4">
//                <button className="bg-red-600 text-white px-6 py-3 border-2 border-red-600 rounded-full font-bold hover:bg-white hover:text-black transition ">
//             Donate Blood
//            </button>

//           <button className="bg-red-600 text-white border-2 border-red-600 px-8 py-4 rounded-full font-bold hover:bg-white hover:text-black transition">
//       Learn More
//     </button>
//     </div>
//               </div> 
//             <div className="w-1/2 flex justify-end mr-12 items-center">
//             <img 
//             src ={dactor}
//             alt="img"
//             className="h-96 object-contain border-2 border-red-600"></img>
//             </div>

          
            
//         </div>

//         <div className="text-red-600 flex justify-center  font-bold text-4xl mt-8 ">
//             Our Mission</div>
//         </div>

//     );

   
// }
//  export default Welcomepage;