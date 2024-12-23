import { Routes, Route } from "react-router-dom";
import LoginPanel from "./components/Login/Login"
import RegisterPanel from "./components/Register/Register";
import Dealers from './components/Dealers/Dealers';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<RegisterPanel />} />
      <Route path="/dealers" element={<Dealers/>} />
    </Routes>
  );
}


export default App;
