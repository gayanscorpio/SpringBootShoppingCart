import React, { useState } from "react";
import { useMutation } from '@apollo/client/react';
import { VERIFY_USER_PIN } from "../graphql/pinQueries";

function EnterPinModal({ userId, onSuccess, onClose, onForgotPin }) {
    const [pin, setPin] = useState("");
    const [error, setError] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [pinResult, setPinResult] = useState(null); // store mutation result

    const [verifyUserPin, { loading }] = useMutation(VERIFY_USER_PIN);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const { data } = await verifyUserPin({
                variables: {
                    input: {
                        pin,
                        userId
                    }
                }
            });
            const result = data.verifyUserPin;
            setPinResult(result); // save result for JSX

            // 🔐 If PIN is locked
            if (result.locked) {
                setIsLocked(true);
                setError(`PIN is locked. Try again at ${result.lockExpires}`);
                return; // DO NOT close modal
            }
            // ✅ Correct PIN
            if (result.success) {
                onSuccess();
                onClose();
                return;
            }

            // ❌ Incorrect PIN
            setError(result.message || "Incorrect PIN");
        } catch (err) {
            console.error(err);
            setError("Error verifying PIN");
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>Enter your PIN 🔒</h3>
                {!isLocked && (<form onSubmit={handleSubmit}>
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
                )}

                { //Display remaining attempts
                    pinResult?.remainingAttempts !== undefined && !isLocked && (
                        <p>Attempts left: {pinResult.remainingAttempts}</p>)
                }

                {/* When locked */}
                {isLocked && (
                    <p style={{ color: "red" }}>
                        Your PIN is locked until {pinResult.lockExpires}. You can reset it below.
                    </p>
                )}

                {/* Error */}
                {error && <p style={{ color: "red" }}>{error}</p>}


                {/* Forgot PIN is ALWAYS visible */}
                <button style={{ marginTop: "10px" }} onClick={onForgotPin}>
                    Forgot PIN?
                </button>

                <button onClick={onClose} style={{ marginTop: "10px" }}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default EnterPinModal;
