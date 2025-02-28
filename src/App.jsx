// import { useState } from "react";
// import { createBrowserRouter, ReactProvider } from "react-router-dom";
// import Login from "./components/Login";
// import Signup from "./components/Signup";

// function App() {
//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <Login />,
//     },
//     {
//       path: "/signup",
//       element: <Signup />,
//     },
//   ]);

//   return <ReactProvider router={router} />;
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import SeatBooking from "./components/SeatBooking";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/seat-booking" element={<SeatBooking />} />
      </Routes>
    </Router>
  );
}

export default App;
