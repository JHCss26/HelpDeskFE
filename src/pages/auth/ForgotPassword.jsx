import React, { useState } from "react";
import axios from '../../api/axiosInstance';
import { Link, useNavigate } from "react-router-dom";
import HelpDeskImage from "../../assets/call-center-design.png";
import Logo1 from "../../assets/JH-Logo.png";
import Logo2 from "../../assets/HFP-Logo.png";
export default function ForgotPassword() {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!email) {
            setError('Email is required.');
            return;
        }

        setLoading(true);
        try {
            await axios.post('api/users/forgot-password', { email });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to send reset link.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-1 h-full w-full bg-gray-50">
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
                        Forgot Password
                    </h2>
                    <p className="text-sm text-gray-600">
                        Enter your email to reset your password
                    </p>
                    {error && (
                        <div className="mb-4 text-red-700 bg-red-100 p-2 rounded">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 text-green-700 bg-green-100 p-2 rounded">
                            A reset link has been sent to your email.
                        </div>
                    )}
                    <form
                        onSubmit={handleSubmit}
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
                                value={email}
                                onChange={handleChange}
                                className="w-full border rounded p-2 focus:outline-none focus:ring"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-blue-600 text-white py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Remembered your password?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>

        </div>
    );
}