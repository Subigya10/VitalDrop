import Navbar from "../components/Navbar";
import dactor from "../assets/dactor.png";
import bloody from "../assets/blooddy.png"
import union from "../assets/union.jpg"
import emergency from "../assets/emergency.jpg"

function Welcomepage(){
    return(
        <div className="min-h-screen overflow-y-auto">
            <Navbar/>
        <div className ="pt-16 pb-20   h-[500px]  w-full
         bg-gradient-to-b from-[#FFE5E5] to-[#FF6B6B]
          flex  relative ">

              <div className="absolute top-20 left-10 w-20 h-20 bg-red-300 rounded-full opacity-30"></div>
              <div className="absolute bottom-10 right-20 w-32 h-32 bg-pink-400 rounded-full opacity-20"></div>
      
              <div className="absolute bottom-32 left-32 w-24 h-24 bg-pink-300 rounded-full opacity-15"></div>


              <div className="w-2/3 " >
              <h1 className="text-7xl font-bold text-black mt-12 ml-10">
              Your blood can be someone's <span className ="text-red-600">life </span>
              </h1>
              <h1 className ="text-3xl text-black font-bold ml-12 mt-6 ">
                Helping Nepal in Emergencies
              </h1>


               <div className="flex mt-16 ml-48 gap-4">
               <button className="bg-red-600 text-white px-6 py-3 border-2 border-red-600 rounded-full font-bold hover:bg-white hover:text-black transition ">
            Donate Blood
           </button>

          <button className="bg-red-600 text-white border-2 border-red-600 px-8 py-4 rounded-full font-bold hover:bg-white hover:text-black transition">
      Learn More
    </button>
    </div>
              </div> 
            <div className="w-1/2 flex justify-end mr-12 mt-12 items-center ">
            <img 
            src ={dactor}
            alt="img"
            className="h-96 object-contain border-2 border-red-600"></img>
            </div>
             </div>

          
            
       

        <div className="text-red-600 flex justify-center  font-bold text-4xl mt-8 ">
            Our Mission</div>
      

        <div className="flex justify-center mt-4">
  <p className="text-gray-700 text-lg text-center max-w-xl">
    Saving lives through timely blood donations across Nepal.
  </p>
</div>

<div className="flex justify-around mt-8 px-10">
  <div className="flex flex-col items-center gap-2">
    <img src={bloody} alt="blood" className="h-16" />
    <p className="text-black font-medium text-center">Blood Donation Awareness</p>
  </div>

  <div className="flex flex-col items-center gap-2">
    <img src={union} alt="education" className="h-16" />
    <p className="text-black font-medium text-center">Community Education</p>
  </div>

  <div className="flex flex-col items-center gap-2">
    <img src={emergency} alt="emergency" className="h-16" />
    <p className="text-black font-medium text-center">Emergency Support</p>
  </div>
</div>


</div>



        

    );

   
}
 export default Welcomepage;