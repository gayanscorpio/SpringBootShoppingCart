import React, { useState } from "react";

function RegisterPage() {
    const [form, setForm] = useState({
        username: "",
        password: "",
        role: "customer", // default role
    });
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8082/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
            mutation RegisterUser($username: String!, $password: String!, $role: String!) {
              register(username: $username, password: $password, role: $role)
            }
          `,
                    variables: {
                        username: form.username,
                        password: form.password,
                        role: form.role,
                    },
                }),
            });

            const result = await response.json();

            if (result.data?.register) {
                setMessage("✅ Registered successfully! You can now log in.");
                setForm({ username: "", password: "", role: "Student" });
            } else {
                setMessage("❌ Registration failed. Try a different username.");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setMessage("❌ Server error during registration.");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
            <h2>🧾 Register</h2>
            <form onSubmit={handleSubmit}>
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
                <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                    <option value="Student">Student</option>
                    <option value="Customer">Customer</option>
                    <option value="Admin">Admin</option>
                </select>
                <button type="submit" style={{ marginTop: "10px" }}>
                    Register
                </button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default RegisterPage;
