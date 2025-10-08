import React, { useState } from 'react';
import { RocketLaunchIcon, UserPlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const LandingPage = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'colonist'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await onLogin(formData.email, formData.password);
      } else {
        await onSignup(formData.email, formData.password, formData.name, formData.role);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Authentication failed. Check credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-cover bg-center flex items-center justify-center px-4" style={{backgroundImage: `url('https://images.unsplash.com/photo-1570176182316-723a85fe1839?q=80&w=2070&auto=format&fit=crop')`}}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative max-w-md w-full mx-auto z-10">
            <div className="text-center mb-8">
                <RocketLaunchIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
                <h1 className="text-4xl font-bold text-white mb-2">MarsFood Protocol</h1>
                <p className="text-xl text-gray-300">Sustaining Life on the Red Planet.</p>
            </div>

            <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg shadow-2xl p-8">
                <div className="flex mb-6 bg-gray-700 rounded-lg p-1">
                    <button onClick={() => setIsLogin(true)} className={`w-1/2 py-2 rounded-md transition-all font-semibold ${isLogin ? 'bg-red-600 text-white' : 'text-gray-300'}`}>Login</button>
                    <button onClick={() => setIsLogin(false)} className={`w-1/2 py-2 rounded-md transition-all font-semibold ${!isLogin ? 'bg-red-600 text-white' : 'text-gray-300'}`}>Sign Up</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-red-500 focus:border-red-500" placeholder="Elon Musk" required={!isLogin} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                                <select value={formData.role} onChange={(e) => handleInputChange('role', e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-red-500 focus:border-red-500">
                                    <option value="colonist">Colonist</option>
                                    <option value="scientist">Scientist</option>
                                </select>
                            </div>
                        </>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-red-500 focus:border-red-500" placeholder="you@mars.gov" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-red-500 focus:border-red-500" placeholder="••••••••" required />
                    </div>

                    {error && <div className="bg-red-900 border border-red-700 text-red-200 rounded-md p-3 text-sm"><p>{error}</p></div>}

                    <button type="submit" disabled={loading} className="w-full flex justify-center items-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800 disabled:opacity-50 transition-colors">
                        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : (isLogin ? <><ArrowRightOnRectangleIcon className="h-5 w-5 mr-2"/><span>Login</span></> : <><UserPlusIcon className="h-5 w-5 mr-2"/><span>Create Account</span></>)}
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default LandingPage;
