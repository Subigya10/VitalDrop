import { useState } from 'react';
import PublicRoutes from "./routes/PublicRoutes.jsx";
import PrivateRoutes from "./routes/PrivateRoutes.jsx";
import { useAuth } from "./context/AuthContext";
import SplashScreen from "./components/SplashScreen.jsx";
import Onboarding from "./components/Onboarding.jsx";

function App() {
  const { user } = useAuth();
  const [phase, setPhase] = useState('splash');

  if (phase === 'splash') return <SplashScreen onDone={() => setPhase('onboarding')} />;
  if (phase === 'onboarding') return <Onboarding onDone={() => setPhase('app')} />;

  return <>{user ? <PrivateRoutes /> : <PublicRoutes />}</>;
}

export default App;