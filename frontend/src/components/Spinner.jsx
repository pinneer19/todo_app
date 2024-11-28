import React from 'react';

const Spinner = () => {
    const styles = {
        spinner: {
            margin: "10px auto",
            width: "40px",
            height: "40px",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            borderTopColor: "#6b73ff",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
        },
        keyFrames: `@keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }`
    };
    return (
        <>
            <style>{styles.keyFrames}</style>
            <div style={styles.spinner}></div>
        </>
    );
};

export default Spinner;