import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [step, setStep] = useState(1); // Step 1: login, Step 2: verify OTP
    const [form, setForm] = useState({ username: "", password: "" });
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Step 1: Login with username + password
    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch("http://localhost:8082/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
            mutation LoginUser($username: String!, $password: String!) {
              login(username: $username, password: $password) {
                token
                userId
                role
              }
            }
          `,
                    variables: form,
                }),
            });

            const result = await response.json();
            console.log("Login response:", result);

            const loginData = result.data?.login;

            if (!loginData) {
                setMessage("❌ Invalid username or password.");
                return;
            }
            // 🚀 Step 2: always verify OTP after login (to match your design)
            // (In a real app, backend could tell you if phone is already verified)
            setMessage("📲 Please verify your phone number via OTP.");
            setStep(2);

            // Save token and login
            localStorage.setItem("token", loginData.token);
            localStorage.setItem("username", form.username);
            localStorage.setItem("userId", loginData.userId);

            // Notify Navbar to update immediately
            window.dispatchEvent(new Event("authChange"));
            navigate("/");
        } catch (err) {
            console.error("Login error:", err);
            setMessage("❌ Server error during login.");
        }
    };

    // Step 2: Verify OTP (similar to register)
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch("http://localhost:8082/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
            mutation VerifyPhone($username: String!, $code: String!) {
              verifyPhone(username: $username, code: $code) {
                token
                userId
                role
              }
            }
          `,
                    variables: { username: form.username, code: otp },
                }),
            });

            const result = await response.json();
            console.log("OTP verify response:", result);

            const data = result.data?.verifyPhone;

            if (data?.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", form.username);
                localStorage.setItem("userId", data.userId);
                setMessage("✅ Phone verified! You are now logged in.");
                setStep(3);
            } else {
                setMessage("❌ Invalid OTP. Try again.");
            }
        } catch (err) {
            console.error("OTP verification error:", err);
            setMessage("❌ Server error during OTP verification.");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
            {step === 1 && (
                <>
                    <h2>🔐 Login</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            placeholder="Username"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            required
                        />
                        <br />
                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <br />
                        <button type="submit">Login</button>
                    </form>
                </>
            )}

            {step === 2 && (
                <>
                    <h2>📲 Verify Phone</h2>
                    <form onSubmit={handleVerifyOtp}>
                        <input
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <br />
                        <button type="submit">Verify OTP</button>
                    </form>
                </>
            )}

            {step === 3 && (
                <>
                    <h2>{message}</h2>
                    <button onClick={() => navigate("/")}>🏠 Go to Home</button>
                </>
            )}

            {message && step !== 3 && <p>{message}</p>}
        </div>
    );
}

export default LoginPage;
