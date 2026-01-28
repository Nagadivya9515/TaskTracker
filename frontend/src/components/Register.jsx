import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import { NavLink } from "react-router-dom";

export default function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const { setLoading } = useLoading();
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        const newErrors = {};
        if(!username.trim()) newErrors.username = "Username is required";

        if(!email.trim()) newErrors.email = "Email is required";
        else if(!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

        if(!password) newErrors.password = "Password is required";
        else if(password.length < 6) newErrors.password = "Password must be at least 6 characters";

        if (!passwordConfirm) {
      newErrors.passwordConfirm = "Please confirm your password";
    } else if(password !== passwordConfirm) newErrors.passwordConfirm = "Passwords do not match";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        setSubmitted(true);
        if (!validate()) return;

        try {
            setLoading(true);
            const det = await axios.post("http://localhost:4000/register", { username, email, password });
            console.log(det.data);
            navigate("/verify-otp", { state: { email } });
        }
        catch (error) {
            console.log("Registration failed:", error);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register an Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            onChange = {e => {setUsername(e.target.value); setErrors(prev => ({...prev, username: ""}))}}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter your username"
                        />
                        {submitted && errors.username && (
                            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            onChange = {e => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ""}))}}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter your email"
                        />
                        {submitted && errors.email && (
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
                        {submitted && errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            onChange={e => { setPasswordConfirm(e.target.value); setErrors(prev => ({...prev, passwordConfirm: ""}))}}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Confirm your password"
                        />
                        {submitted && errors.passwordConfirm && (
                            <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Register
                    </button>
                    <p className="block text-center my-3 text-sm">Already Registered? <NavLink to="/resend-otp" className="text-blue-600 hover:underline">Verify here</NavLink></p>
                </form>
            </div>
        </div>
    );
}

