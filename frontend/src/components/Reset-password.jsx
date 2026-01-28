import {useState, React, use} from "react";
import axios from "axios";
import {useNavigate} from "react-router";
import {useLoading} from "../context/LoadingContext";
import Loader from "./Loader";

export default function ResetPassword() {

    const[email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const[newPassword, setNewPassword] = useState("");
    const[confirmPassword, setNPasswordConfirm] = useState("");
    const {loading, setLoading} = useLoading();

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setLoading(true);
            if( newPassword !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }

            const response = await axios.post("http://localhost:4000/reset-password", {email, otp, newPassword, confirmPassword});

            console.log(response.data);
        }
        catch(error) {
            console.error("Password reset failed:", error);
        }
        finally {
            setLoading(false); 
        }
        navigate("/login");
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="otp">OTP</label>
                        <input
                            type="text"
                            id="otp"
                            onChange={e => setOtp(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter OTP"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="nPasswordConfirm">Confirm New Password</label>
                        <input
                            type="password"
                            id="nPasswordConfirm"
                            onChange={e => setNPasswordConfirm(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Confirm new password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    )
}