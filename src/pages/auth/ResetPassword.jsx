import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import HelpDeskImage from '../../assets/call-center-design.png';
import Logo1 from '../../assets/JH-Logo.png';
import Logo2 from '../../assets/HFP-Logo.png';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.password || form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `api/users/reset-password/${token}`,
        { newPassword: form.password }
      );
      // on success, redirect to login
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        'Failed to set password. The link may have expired.'
      );
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
          <h2 className="text-2xl font-bold text-center">Reset Password</h2>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-white flex flex-col gap-4 p-6"
          >
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm"
                id="confirm"
                value={form.confirm}
                onChange={handleChange}
                required
                minLength={8}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                placeholder="Confirm new password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`mt-4 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            >
              {loading ? 'Loading...' : 'Reset Password'}
            </button>
          </form>
          <p className="text-sm text-gray-600">
            Remembered your password?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
