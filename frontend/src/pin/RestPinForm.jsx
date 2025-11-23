import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { RESET_USER_PIN } from "../graphql/pinQueries";

function ResetPinForm({ username, onSuccess, onCancel }) {
    const [password, setPassword] = useState("");
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [error, setError] = useState("");

    const [resetPin, { loading }] = useMutation(RESET_USER_PIN);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPin !== confirmPin) {
            setError("PINs do not match");
            return;
        }

        try {
            const response = await resetPin({
                variables: { username, password, newPin }
            });

            if (!response.data.resetUserPin.success) {
                setError(response.data.resetUserPin.message);
                return;
            }
            console.log("Reset PIN response:", response.data);
            onSuccess(); // back to EnterPin or continue checkout
        } catch (err) {
            setError("Reset failed. Try again.");
        }
    }

    console.log("username :", username);
    return (
        <div className="modal">
            <h3>Reset PIN</h3>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Account Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label>New PIN</label>
                <input
                    type="password"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    required
                />

                <label>Confirm New PIN</label>
                <input
                    type="password"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Resetting..." : "Reset PIN"}
                </button>
            </form>

            {onCancel && (
                <button onClick={onCancel} style={{ marginTop: "10px" }}>
                    Cancel
                </button>
            )}
        </div>
    );
}

export default ResetPinForm;
