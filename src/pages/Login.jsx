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
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('password', formData.password);

            await dispatch(loginUser(formDataToSend)); // Await the dispatch
        } catch (err) {
            console.error("Login failed:", err); // Log any errors during dispatch
            toast.error("Login failed. Please try again.");
        }
    };

    return (
        <React.Fragment>
            <div className="flex justify-center items-center h-screen bg-gray-200">
                <div className="bg-white p-8 rounded shadow-2xl w-1/3">
                    <h2 className="text-2xl font-bold mb-8 text-gray-800">Login</h2>
                    <form onSubmit={submitHandler}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-800 font-bold">Username</label>
                            <input
                                type="text"
                                name="username" // Make sure this matches the backend
                                id="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange} // Use the centralized handler
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-800 font-bold">Password</label>
                            <input
                                type="password"
                                name="password" // Make sure this matches the backend
                                id="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange} // Use the centralized handler
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold p-3 rounded"
                            disabled={loading} // Disable the button while loading
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Login;