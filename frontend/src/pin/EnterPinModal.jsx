import React, { useState } from "react";
import { useMutation } from '@apollo/client/react';
import { VERIFY_USER_PIN } from "../graphql/pinQueries";

function EnterPinModal({ userId, onSuccess, onClose }) {
    const [pin, setPin] = useState("");
    const [error, setError] = useState(null);

    const [verifyUserPin, { loading }] = useMutation(VERIFY_USER_PIN);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const { data } = await verifyUserPin({ variables: { input: { pin, userId } } });
            if (data.verifyUserPin.success) {
                onSuccess();
                onClose();
            } else {
                setError(data.verifyUserPin.message || "Incorrect PIN");
            }
        } catch (err) {
            console.error(err);
            setError("Error verifying PIN");
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>Enter your PIN 🔒</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Enter your PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        maxLength={4}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Verifying..." : "Verify PIN"}
                    </button>
                </form>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default EnterPinModal;
