import { useState } from "react";
import axios from "axios";
import { useLoading } from '../context/LoadingContext';
import Loader from "./Loader";
import { useNavigate } from "react-router";

export default function Verifyotp() {
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const { loading, setLoading } = useLoading();
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const navigate = useNavigate();

    function validate() {
        const newErrors = {};

        if (!email.trim()) newErrors.email = "Email is required";
        if (!otp.trim()) newErrors.otp = "OTP is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitted(true);

        if (!validate()) return;
        try {
            setLoading(true);
            const response = await axios.post("http://localhost:4000/verify-otp", { email, otp });

            console.log(response.data);

            localStorage.setItem("verified", response.data.verified);

            setTimeout(() => {
                setLoading(false);
                navigate("/login");
            }, 5000);
        }
        catch (error) {
            setErrors({ otp: "Invalid OTP or Email" });
            console.error("OTP verification failed:", error);

            setTimeout(() => {
        setLoading(false);
        navigate("/resend-otp");
      }, 5000);
        }

    }
    return (
        <>
            {loading && <Loader />}
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            id="email"
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter email"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                        {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
                        <input
                            type="text"
                            id="otp"
                            placeholder="Enter OTP"
                            onChange={e => { setOtp(e.target.value); setErrors({ ...errors, otp: "" }); }}
                            className="my-4 w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                        { errors.otp && <p className="text-red-500 text-sm mb-4">{errors.otp}</p>}
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300">Verify OTP</button>
                    </form>
                </div>
            </div>
        </>
    )
}