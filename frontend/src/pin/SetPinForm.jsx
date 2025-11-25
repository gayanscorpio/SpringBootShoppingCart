import React, { useState } from "react";
import { useMutation } from '@apollo/client/react';
import { SET_USER_PIN } from "../graphql/pinQueries";

function SetPinForm({ userId, onSuccess, onClose }) {
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [error, setError] = useState(null);

    const [setUserPin, { loading }] = useMutation(SET_USER_PIN);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (pin.length !== 4 || confirmPin.length !== 4) {
            setError("PIN must be 4 digits.");
            return;
        }

        if (pin !== confirmPin) {
            setError("PINs do not match.");
            return;
        }

        console.log('pin : ', pin);
        console.log('userId : ', userId);

        try {
            const { data } = await setUserPin({
                variables: { input: { pin, userId } }
            });

            if (data.setUserPin.success) {
                onSuccess();
                if (onClose) onClose();
            } else {
                setError(data.setUserPin.message || "Failed to set PIN");
            }
        } catch (err) {
            console.error(err);
            setError("Error setting PIN");
        }
    };

    return (
        <div className="pin-modal">
            <h3>Create Your Security PIN</h3>

            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-digit PIN"
                    maxLength={4}
                />

                <input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="Confirm PIN"
                    maxLength={4}
                />

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Set PIN"}
                </button>
            </form>
        </div>
    );
}

export default SetPinForm;
