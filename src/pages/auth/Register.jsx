
import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import HelpDeskImage from "../../assets/call-center-design.png";
import Logo1 from "../../assets/JH-Logo.png";
import Logo2 from "../../assets/HFP-Logo.png";
const Register = () => {

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/auth/register", { email, password, name, phone });
            if (data) {
                alert("Registration successful! Please login.");
                navigate("/login");
            }

        } catch (err) {
            console.error(
                "Register failed:",
                err.response?.data?.message || err.message
            );
            alert("Register failed: " + (err.response?.data?.message || err.message));
        }
    };

    useEffect(() => {
        const isDisabled = !name || !email || !password;
        setIsDisabled(isDisabled);
    }, [name, email, password]);

    return (
        <div className="flex flex-1 h-full w-full bg-gray-100">
            <div className="flex h-full w-[60%] bg-white flex-col gap-4 justify-center items-center">
                <div className="w-full flex items-center justify-start p-2 gap-4">
                    <img src={Logo1} alt="Logo 1" className="w-1/6" />
                    <img src={Logo2} alt="Logo 2" className="w-1/6" />
                </div>
                <div className="flex flex-1 flex-col items-center h-full w-full">
                    <h2 className="text-2xl font-bold text-center">
                        Register Now
                    </h2>

                    <form
                        onSubmit={handleRegister}
                        className="w-full max-w-sm bg-white flex flex-col gap-4 p-6"
                    >
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter your Fullname"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
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
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Phone
                            </label>
                            <input
                                type="text"
                                id="phone"
                                placeholder="Enter your phone number"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isDisabled}
                            className={`w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Register
                        </button>
                    </form>

                    <div className="flex items-center justify-between w-full max-w-sm mt-4">
                        <hr className="w-full border-gray-300" />
                        <span className="text-gray-500 text-sm mx-2">OR</span>
                        <hr className="w-full border-gray-300" />
                    </div>
                    <div className="flex flex-col items-center mt-4">
                        <p className="text-sm text-gray-600">
                            Already have an account?
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-4"
                        >
                            Login Now!
                        </button>
                    </div>

                </div>
            </div>
            <div className="flex h-full w-[40%]">
                <img
                    src={HelpDeskImage}
                    alt="Help Desk"
                    className="object-fit w-full h-full"
                />
            </div>

        </div>
    );
};

export default Register;
