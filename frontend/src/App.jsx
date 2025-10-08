import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import config from './constants.js';
import './index.css';

const HealthStatusIndicator = ({ isHealthy }) => (
  <div className="fixed top-4 right-4 flex items-center space-x-2 bg-white p-2 rounded-full shadow-md z-50">
    <span className={`h-3 w-3 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></span>
    <span className="text-sm text-gray-700 font-medium">{isHealthy ? 'Backend Connected' : 'Connecting...'}</span>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [loading, setLoading] = useState(true);
  const [isBackendHealthy, setIsBackendHealthy] = useState(false);
  const manifest = new Manifest(config.BACKEND_URL);

  useEffect(() => {
    const checkHealth = () => {
      fetch('/api/health')
        .then(res => res.ok ? setIsBackendHealthy(true) : setIsBackendHealthy(false))
        .catch(() => setIsBackendHealthy(false));
    };

    checkHealth();
    const healthInterval = setInterval(checkHealth, 15000);

    manifest.from('User').me()
      .then(currentUser => {
        if (currentUser) {
          setUser(currentUser);
          setCurrentScreen('dashboard');
        }
      })
      .catch(() => {
        setUser(null);
        setCurrentScreen('landing');
      })
      .finally(() => setLoading(false));

    return () => clearInterval(healthInterval);
  }, []);

  const login = async (email, password) => {
    try {
      await manifest.auth('User').login(email, password);
    } catch (error) {
      console.warn('manifest.auth(\'User\').login failed, trying manifest.from(\'User\').login');
      await manifest.from('User').login(email, password);
    }
    const currentUser = await manifest.from('User').me();
    setUser(currentUser);
    setCurrentScreen('dashboard');
  };

  const signup = async (email, password, name, role) => {
    await manifest.from('User').signup({ email, password, name, role });
    // Auto-login after successful signup
    try {
      await manifest.auth('User').login(email, password);
    } catch (error) {
      console.warn('manifest.auth(\'User\').login failed, trying manifest.from(\'User\').login');
      await manifest.from('User').login(email, password);
    }
    const currentUser = await manifest.from('User').me();
    setUser(currentUser);
    setCurrentScreen('dashboard');
  };

  const logout = async () => {
    await manifest.logout();
    setUser(null);
    setCurrentScreen('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading Martian Atmosphere...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <HealthStatusIndicator isHealthy={isBackendHealthy} />
      {currentScreen === 'landing' ? (
        <LandingPage onLogin={login} onSignup={signup} />
      ) : (
        <DashboardPage user={user} onLogout={logout} manifest={manifest} />
      )}
    </div>
  );
}

export default App;
