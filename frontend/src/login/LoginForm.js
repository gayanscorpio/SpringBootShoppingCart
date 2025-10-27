import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                        }
                      }
                    `,
                    variables: form,
                }),
            });

            const result = await response.json();
            console.log("Login response:", result);

            const token = result.data?.login?.token;
            const userId = result.data?.login?.userId;

            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("username", form.username);
                localStorage.setItem("userId", userId);
                navigate("/");
            } else {
                setError("❌ Invalid username or password.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("❌ Server error during login.");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
            <h2>🔐 Login</h2>
            <form onSubmit={handleSubmit}>
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
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default LoginPage;
