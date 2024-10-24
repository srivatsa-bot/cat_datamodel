import React from 'react';
import { useLocation } from 'react-router-dom';
import './App.css'

const SuccessPage = () => {
    const location = useLocation();
    const { results } = location.state || {};

    const formatOutput = (data) => {
        if (!data) return null;

        const categories = Object.keys(data);
        return categories.map((category, index) => (
            <div key={index}>
                <h3>{category.replace(/([A-Z])/g, ' $1')}</h3>
                {data[category].map((item, idx) => (
                    <p key={idx}>{`${idx + 1}) ${item.Machine} ${item.Component} ${item.Parameter} ${item.Failure_Risk}`}</p>
                ))}
            </div>
        ));
    };

    return (
        <div className="output-container">
            <h1>Success</h1>
            <p>Your file has been successfully submitted and processed!</p>
            <h2>Model Output :</h2>
            {formatOutput(results)}
        </div>
    );
};

export default SuccessPage;
