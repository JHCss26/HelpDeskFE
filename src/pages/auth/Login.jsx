import { useDispatch } from "react-redux";
import { useState } from "react";
import axios from "../../api/axiosInstance";
import { loginSuccess } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import HelpDeskImage from "../../assets/call-center-design.png";
import Logo1 from "../../assets/JH-Logo.png";
import Logo2 from "../../assets/HFP-Logo.png";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      dispatch(loginSuccess({ user: data, token: data.token }));
      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.role === "agent") {
        navigate("/agent/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.error(
        "Login failed:",
        err.response?.data?.message || err.message
      );
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex flex-1 h-full w-full bg-gray-100">
      <div className="flex h-full w-[40%]">
        <img
          src={HelpDeskImage}
          alt="Help Desk"
          className="object-fit w-full h-full"
        />
      </div>
      <div className="flex h-full w-[60%] bg-white flex-col gap-4 justify-center items-center">
        <div className="w-full flex items-center justify-end p-2 gap-4">
          <img src={Logo1} alt="Logo 1" className="w-1/6" />
          <img src={Logo2} alt="Logo 2" className="w-1/6" />
        </div>
        <div className="flex flex-1 flex-col items-center h-full w-full">
          <h2 className="text-2xl font-bold text-center">
            Welcome Back to Helers HelpDesk!
          </h2>
          <p className="text-sm text-gray-600">
            Please login to your account
          </p>
          <form
            onSubmit={handleLogin}
            className="w-full max-w-sm bg-white flex flex-col gap-4 p-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
          </form>

          <div className="flex items-center justify-between w-full max-w-sm mt-4">
            <hr className="w-full border-gray-300" />
            <span className="text-gray-500 text-sm mx-2">OR</span>
            <hr className="w-full border-gray-300" />
          </div>
          <div className="flex flex-col items-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?
            </p>
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-4"
            >
              Create an Account
            </button>
          </div>
          <div className="flex justify-center items-center mt-4">


            <p className="text-sm text-gray-600 ml-4">
              Don't remember your password?{" "}
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-blue-600 hover:underline"
              >
                Forgot Password
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
