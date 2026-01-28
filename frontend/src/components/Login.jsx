import React, { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router";
import {useLoading} from "../context/LoadingContext";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {loading, setLoading} = useLoading();
    const [submitted, setSubmitted] = useState(false);
    const[errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { login } = useAuth();

    const validate = () => {
        const newErrors ={};

        if(!email.trim()) newErrors.email = "Email is required";
        else if(!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

        if(!password) newErrors.password = "Password is required";
        setErrors(newErrors);
        
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSubmitted(true);

        if (!validate()) return;

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:4000/login", { email, password });

            console.log(response.data);

            // localStorage.setItem("token", response.data.token);
            const expiryTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour
            // localStorage.setItem("tokenExpiry", expiryTime);
            login(response.data.token, expiryTime);

            navigate("/");
        } catch (error) {
            if(error.response && error.response.status === 404) {
                setErrors(prev => ({...prev, email: "Email not registered"}));
            }

            if (error.response && error.response.status === 401) {
                setErrors(prev => ({...prev, password: "Incorrect password"}));
            }

            

            console.error("Login failed:", error);
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <>
            {loading && <Loader />}
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            onChange={e => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ""}))}}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter your email"
                        />
                        { submitted && errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            onChange={e => { setPassword(e.target.value); setErrors(prev => ({...prev, password: ""}))}}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter your password"
                        />
                        {errors.password && submitted && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Login
                    </button>

                    <p className="block text-center my-3 text-sm">Not Registered? <NavLink to="/register" className="text-blue-600 hover:underline">Register here</NavLink></p>
                    <p className="block text-center text-sm">Forgot Password? <NavLink to="/forgot-password" className="text-blue-600 hover:underline">Reset here</NavLink></p>
                </form>
            </div>
        </div>
        </>
    );
}