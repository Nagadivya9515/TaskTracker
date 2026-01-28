import React from 'react';
import axios from 'axios';
import { useLoading } from '../context/LoadingContext';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

export default function ResendOtp() {

    const [email, setEmail] = React.useState("");
    const [otp, setOtp] = React.useState("");

    async function handleResendOtp(e) {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:4000/resend-otp", { email });

            console.log(response.data);
        }
        catch(error) {
            console.error("Resend OTP failed:", error);
        }
    }


    const {loading, setLoading} = useLoading();

    const navigate = useNavigate();

    async function handleVerifyOtp(event) {
        event.preventDefault();

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:4000/verify-otp", { email, otp });

            console.log(response.data);

            localStorage.setItem("verified", response.data.verified);

            navigate("/login");
        }
        catch(error) {
            console.error("OTP verification failed:", error);

            navigate("/resend-otp");
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <>
        {loading && <Loader /> }
         <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Resend OTP</h2>
            <form onSubmit={handleResendOtp}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    onChange={e => setEmail(e.target.value)}
                    className='w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 my-2'
                />
                <button type="submit" className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300'>Resend OTP</button>
            </form>

            <form onSubmit={handleVerifyOtp}>
                <input 
                    type="text"
                    placeholder="Enter OTP"
                    className='w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 my-2'
                    onChange={e => setOtp(e.target.value)}
                />
                <button type="submit" className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300'>Verify OTP</button>
            </form>
        </div>
        </div>

        </>
    )
}
