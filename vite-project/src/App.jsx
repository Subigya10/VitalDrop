import PublicRoutes from "./routes/PublicRoutes.jsx";
import PrivateRoutes from "./routes/PrivateRoutes.jsx";
import { useAuth } from "./context/AuthContext"; // ← ADD THIS

function App() {
  const { user } = useAuth(); // ← USE THIS instead of localStorage
  
  return <>{user ? <PrivateRoutes /> : <PublicRoutes />}</>;
}

export default App;