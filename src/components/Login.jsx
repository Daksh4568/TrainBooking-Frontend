import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginHandle = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        // "http://localhost:5000/api/auth/login",
        "https://trainbooking-fg34.onrender.com/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response);
      console.log("Login successful", response.data);
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      navigate("/seat-booking"); // Redirect to dashboard or homepage
    } catch (error) {
      console.error("Login failed", error.response?.data || error.message);
      alert("Invalid credentials, please try again");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-700">Login</h1>
        </div>
        <form onSubmit={loginHandle}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-600"
            >
              email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md shadow-md transition-all duration-300"
            >
              Login
            </button>
          </div>
          <Link
            to="/signup"
            className="underline flex items-center justify-center hover:text-blue-600 cursor-pointer mt-4"
          >
            Signup
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
