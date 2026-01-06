import PublicRoutes from "./routes/PublicRoutes.jsx";
import PrivateRoutes from "./routes/PrivateRoutes.jsx";

function App() {
  const token = localStorage.getItem("access_token");
  return <>{token ? <PrivateRoutes /> : <PublicRoutes />}</>;
}

export default App;