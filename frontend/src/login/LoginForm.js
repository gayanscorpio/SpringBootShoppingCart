import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [otpStep, setOtpStep] = useState(false); // Step to verify phone if not verified
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

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
                phoneVerified
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
                setError("❌ Invalid username or password.");
                return;
            }

            if (!loginData.phoneVerified) {
                // Phone not verified → move to OTP step
                setOtpStep(true);
                setError("📲 Your phone is not verified. Enter OTP to continue.");
                return;
            }

            // Save token and login
            localStorage.setItem("token", loginData.token);
            localStorage.setItem("username", form.username);
            localStorage.setItem("userId", loginData.userId);
            navigate("/");
        } catch (err) {
            console.error("Login error:", err);
            setError("❌ Server error during login.");
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");

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
                navigate("/");
            } else {
                setError("❌ OTP invalid. Try again.");
            }
        } catch (err) {
            console.error("OTP verification error:", err);
            setError("❌ Server error during OTP verification.");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
            <h2>🔐 Login</h2>

            {!otpStep ? (
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
            ) : (
                <form onSubmit={handleVerifyOtp}>
                    <input
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit">Verify Phone</button>
                </form>
            )}

            {error && <p style={{ color: otpStep ? "orange" : "red" }}>{error}</p>}
        </div>
    );
}

export default LoginPage;
