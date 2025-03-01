import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
