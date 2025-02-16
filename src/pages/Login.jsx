import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Correct import for React Router v6
import { loginUser } from '../actions/userAction';
import { toast } from 'react-toastify';  // Import toast for displaying errors

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, loading, error } = useSelector(state => state.auth); // Get loading and error states

    const [formData, setFormData] = useState({
        username: '',  // Make sure these match the backend's expectations *exactly*
        password: ''
    });

    const handleChange = (e) => {  // Centralized change handler
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/uploads');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);  // Display backend errors to the user
            // Optionally clear the error state in your Redux slice after displaying it
            // dispatch(clearAuthError()); // If you have a clear error action
        }
    }, [error, dispatch]);

    const submitHandler = async (e) => { // async function
        e.preventDefault();
        try {
            const newFormData = new FormData();
            newFormData.append('username', formData.username);
            newFormData.append('password', formData.password);

            // Log the FormData contents
            for (let [key, value] of newFormData.entries()) {
                console.log(key, value);
            }

            console.log(formData);

            await dispatch(loginUser(newFormData)); // Await the dispatch
        } catch (err) {
            console.error("Login failed:", err); // Log any errors during dispatch
            toast.error("Login failed. Please try again.");
        }
    };

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                    <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                    Grundfos    
                </a>
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Login to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={submitHandler}>
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                                <input 
                                    onChange={handleChange}
                                    value={formData.username}
                                    type="text" name="username" id="username" placeholder="unique username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                <input 
                                    onChange={handleChange}
                                    value={formData.password}
                                    type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                            </div>
                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Login</button>
                            <p className="text-sm font-light text-gray-500">
                                New Here? <a href="/register" className="font-medium text-primary-600 hover:underline">Signup here</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;