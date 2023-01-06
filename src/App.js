import { Routes, Route, useNavigation } from "react-router-dom";
import Login from "./components/Login";
import Home from "./container/Home";

const App = () => {
  return (
    <Routes>
      <Route exact path="login" element={<Login />} />
      <Route exact path="/*" element={<Home />} />
    </Routes>
  );
};

export default App;
