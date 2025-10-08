import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRightOnRectangleIcon, PlusIcon, PhotoIcon, BeakerIcon, UserIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import config from '../constants.js';

// Feature-Aware Image Uploader Component Logic
const ImageUploader = ({ onFileSelect, previewUrl }) => {
    const [dragging, setDragging] = useState(false);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div 
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${dragging ? 'border-red-500' : 'border-gray-600'} border-dashed rounded-md`}
        >
            <div className="space-y-1 text-center">
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="mx-auto h-24 w-24 object-cover rounded-md"/>
                ) : (
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-500" />
                )}
                <div className="flex text-sm text-gray-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-red-400 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-red-500 p-1">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
        </div>
    );
};

// Feature-Aware Choice Selector Component Logic
const ChoiceSelector = ({ options, selected, onSelect, label }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <div className="flex space-x-2">
            {options.map(option => (
                <button 
                    key={option} 
                    type="button"
                    onClick={() => onSelect(option)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${selected === option ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                    {option}
                </button>
            ))}
        </div>
    </div>
);

// Main Dashboard Page
const DashboardPage = ({ user, onLogout, manifest }) => {
    const [meals, setMeals] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loadingMeals, setLoadingMeals] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newMeal, setNewMeal] = useState({ name: '', description: '', calories: 200, category: 'Lunch', photoFile: null });
    const [preview, setPreview] = useState(null);

    const loadMeals = useCallback(async () => {
        setLoadingMeals(true);
        try {
            const response = await manifest.from('Meal').with(['creator']).find({orderBy: 'createdAt', order: 'DESC'});
            setMeals(response.data || []);
        } catch (error) {
            console.error("Failed to load meals:", error);
        } finally {
            setLoadingMeals(false);
        }
    }, [manifest]);

    const loadConsumptionLogs = useCallback(async () => {
        if (user.role === 'colonist') {
            try {
                const response = await manifest.from('ConsumptionLog').with(['meal']).find({ filter: { colonistId: user.id }, orderBy: 'createdAt', order: 'DESC'});
                setLogs(response.data || []);
            } catch (error) {
                console.error("Failed to load consumption logs:", error);
            }
        }
    }, [manifest, user.id, user.role]);

    useEffect(() => {
        loadMeals();
        loadConsumptionLogs();
    }, [loadMeals, loadConsumptionLogs]);

    const handleFileSelect = (file) => {
        setNewMeal({ ...newMeal, photoFile: file });
        setPreview(URL.createObjectURL(file));
    };

    const handleCreateMeal = async (e) => {
        e.preventDefault();
        try {
            const { name, description, calories, category, photoFile } = newMeal;
            const mealData = { name, description, calories, category };
            if (photoFile) {
                const uploadedFile = await manifest.upload(photoFile);
                mealData.photoId = uploadedFile.id;
            }
            await manifest.from('Meal').create(mealData);
            setNewMeal({ name: '', description: '', calories: 200, category: 'Lunch', photoFile: null });
            setPreview(null);
            setShowForm(false);
            loadMeals();
        } catch (error) {
            console.error("Failed to create meal:", error);
        }
    };
    
    const handleLogMeal = async (mealId) => {
        try {
            await manifest.from('ConsumptionLog').create({ mealId });
            loadConsumptionLogs();
        } catch (error) {
            console.error("Failed to log meal:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <header className="bg-gray-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        {user.role === 'scientist' ? <BeakerIcon className="h-8 w-8 text-red-500"/> : <UserIcon className="h-8 w-8 text-red-500"/>}
                        <div className="ml-3">
                            <h1 className="text-xl font-bold text-white">Welcome, {user.name}</h1>
                            <p className="text-sm text-gray-400 capitalize">{user.role}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white">Admin Panel</a>
                        <button onClick={onLogout} className="flex items-center bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium">
                            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2"/>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {user.role === 'scientist' && (
                    <div className="mb-8">
                        {!showForm ? (
                            <button onClick={() => setShowForm(true)} className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-semibold">
                                <PlusIcon className="h-5 w-5 mr-2"/> Create New Meal
                            </button>
                        ) : (
                            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-bold mb-4 text-white">New Meal Formula</h2>
                                <form onSubmit={handleCreateMeal} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                        <input type="text" value={newMeal.name} onChange={(e) => setNewMeal({...newMeal, name: e.target.value})} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                        <textarea value={newMeal.description} onChange={(e) => setNewMeal({...newMeal, description: e.target.value})} rows={3} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Calories</label>
                                        <input type="number" value={newMeal.calories} onChange={(e) => setNewMeal({...newMeal, calories: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" required />
                                    </div>
                                    <ChoiceSelector label="Category" options={['Breakfast', 'Lunch', 'Dinner', 'Snack']} selected={newMeal.category} onSelect={(cat) => setNewMeal({...newMeal, category: cat})} />
                                    <div>
                                       <label className="block text-sm font-medium text-gray-300 mb-1">Photo</label>
                                       <ImageUploader onFileSelect={handleFileSelect} previewUrl={preview} />
                                    </div>
                                    <div className="flex space-x-4 pt-4">
                                        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Create Meal</button>
                                        <button type="button" onClick={() => setShowForm(false)} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}
                
                 {user.role === 'colonist' && logs.length > 0 && (
                    <div className="mb-8 bg-gray-800 p-6 rounded-lg">
                         <h2 className="text-2xl font-bold mb-4 text-white">My Consumption Log</h2>
                         <ul className="space-y-3">
                             {logs.slice(0, 5).map(log => (
                                 <li key={log.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                                     <div className='flex items-center'>
                                        <img src={log.meal?.photo?.url || 'https://via.placeholder.com/40'} alt={log.meal?.name} className="h-10 w-10 object-cover rounded-md mr-4"/>
                                        <div>
                                            <p className="font-semibold text-white">{log.meal?.name}</p>
                                            <p className='text-sm text-gray-400'>{new Date(log.createdAt).toLocaleString()}</p>
                                        </div>
                                     </div>
                                     <CheckCircleIcon className="h-6 w-6 text-green-500"/>
                                 </li>
                             ))}
                         </ul>
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-bold mb-4 text-white">Available Meals</h2>
                    {loadingMeals ? <p>Loading meals...</p> : meals.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {meals.map(meal => (
                                <div key={meal.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
                                    <img src={meal.photo?.url || `https://source.unsplash.com/random/400x300/?food,${meal.id}`} alt={meal.name} className="w-full h-48 object-cover"/>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start">
                                          <h3 className="text-xl font-bold text-white">{meal.name}</h3>
                                          <span className="bg-red-900 text-red-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">{meal.category}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 mt-1">{meal.calories} kcal</p>
                                        <p className="text-gray-300 mt-2 text-sm flex-grow">{meal.description}</p>
                                        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                                            <p className="text-xs text-gray-500">Creator: {meal.creator?.name || 'Genesis Lab'}</p>
                                            {user.role === 'colonist' && (
                                                <button onClick={() => handleLogMeal(meal.id)} className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700">Log Meal</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-400">No meals found. A scientist needs to create some!</p>}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
