import React, { useState } from "react";

function RegisterPage() {
    const [step, setStep] = useState(1); // Step 1: register, Step 2: verify OTP
    const [form, setForm] = useState({
        username: "",
        password: "",
        phone: "",
        dob: "",
    });
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");

    // Step 1: Register user with phone (auto-assign role = "Customer")
    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch("http://localhost:8082/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
                        mutation RegisterWithDob(
                          $username: String!, 
                          $password: String!, 
                          $phone: String!, 
                          $role: String!,
                          $dob: String!
                        ) {
                          registerWithDob(
                            username: $username, 
                            password: $password, 
                            phone: $phone,
                            role: $role,
                            dob: $dob
                          )
                        }
                    `,
                    variables: {
                        username: form.username,
                        password: form.password,
                        phone: form.phone,
                        role: "Customer", // hardcoded role
                        dob: form.dob, // 🆕 pass DOB
                    },
                }),
            });

            const result = await response.json();

            if (result.data?.registerWithDob) {
                setMessage("✅ Registration successful! Check OTP (mocked in console).");
                setStep(2); // Move to OTP verification
            } else {
                setMessage("❌ Registration failed. Try a different username or phone.");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setMessage("❌ Server error during registration.");
        }
    };

    // Step 2: Verify OTP
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

            if (result.data?.verifyPhone?.token) {
                localStorage.setItem("token", result.data.verifyPhone.token);
                localStorage.setItem("username", form.username);
                localStorage.setItem("role", result.data.verifyPhone.role);

                // Notify Navbar to update immediately
                window.dispatchEvent(new Event("authChange"));
                setMessage("✅ Phone verified! You are now logged in.");
                setStep(3);
            } else {
                setMessage("❌ OTP verification failed. Try again.");
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
                    <h2>🧾 Register</h2>
                    <form onSubmit={handleRegister}>
                        <input
                            placeholder="Username"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Phone"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            required
                        />
                        <input //This will allow users to pick their birth date (in ISO YYYY-MM-DD format).
                            type="date"
                            value={form.dob}
                            onChange={(e) => setForm({ ...form, dob: e.target.value })}
                            required
                        />

                        <button type="submit" style={{ marginTop: "10px" }}>
                            Register
                        </button>
                    </form>
                </>
            )}

            {step === 2 && (
                <>
                    <h2>📲 Verify OTP</h2>
                    <form onSubmit={handleVerifyOtp}>
                        <input
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <button type="submit" style={{ marginTop: "10px" }}>
                            Verify
                        </button>
                    </form>
                </>
            )}

            {step === 3 && (
                <>
                    <h2>{message}</h2>
                    <button onClick={() => (window.location.href = "/")}>🏠 Go to Home</button>
                </>
            )}

            {message && step !== 3 && <p>{message}</p>}
        </div>
    );
}

export default RegisterPage;
