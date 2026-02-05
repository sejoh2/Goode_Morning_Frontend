// // ProtectedRoute.jsx
// import React from "react";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("token"); // check if user has token
//   if (!token) {
//     // Not logged in → redirect to SignIn
//     return <Navigate to="/" replace />;
//   }
//   return children;
// }
