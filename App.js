
import React from "react";
import { Route, Routes } from "react-router-dom";
import {Users} from "./pages/users";
import {Home } from "./pages/home";


function App() {
  return (
   
     <Routes>
     <Route path="/users" element={<Users />} />
     <Route path="/" element={<Home />}/>     
     </Routes>
  );
}

export default App;
