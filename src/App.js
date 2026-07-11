// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AquaMainPage from "./master/AquaMainPage";
// import ManagerMain from "./manager/ManagerMain";
// import PageNotFound from "./Private/PageNotFound";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/master/*" element={<AquaMainPage />} />
//         <Route path="/manager/*" element={<ManagerMain />} />
//         <Route path="*" element={<PageNotFound/>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AquaMainPage from "./master/AquaMainPage";
import ManagerMain from "./manager/ManagerMain";
import PageNotFound from "./Private/PageNotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function App() {

  return (

    <Router>
      <Routes>
        <Route path="/master/*" element={<AquaMainPage />} />
        <Route path="/manager/*" element={<ManagerMain />} />
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
        <ToastContainer position="top-center" autoClose={3000} />

    </Router>

  );

}



export default App;