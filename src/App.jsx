import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Project from "./pages/Project";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import "./App.css";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost";

function App() {
   const [count, setCount] = useState(0);

   return (
      <BrowserRouter>
         <Header />
         <Routes>
            <Route path='/' element={<Home />} />
            <Route path='about' element={<About />} />
            <Route path='projects' element={<Project />} />
            <Route path='signUp' element={<SignUp />} />
            <Route path='signIn' element={<SignIn />} />
            <Route element={<PrivateRoute />}>
               <Route path='dashboard' element={<Dashboard />} />
            </Route>
            <Route element={<OnlyAdminPrivateRoute />}>
               <Route path='create-post' element={<CreatePost />} />
            </Route>
         </Routes>
         <Footer />
      </BrowserRouter>
   );
}

export default App;
