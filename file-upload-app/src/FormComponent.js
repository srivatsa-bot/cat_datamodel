import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FormComponent = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');  // For handling validation errors
    const navigate = useNavigate();

    // Function to handle file change and validation
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedExtensions = /(\.csv|\.xlsx|\.xls)$/i;

        if (selectedFile && allowedExtensions.exec(selectedFile.name)) {
            setFile(selectedFile);
            setError('');  // Clear any previous error
        } else {
            setFile(null);
            setError('Please upload a valid CSV or Excel file.');
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Please upload a valid CSV or Excel file.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Success:', response.data);
            navigate('/success', { state: { results: response.data.results } });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>File Upload:</label>
                <input type="file" onChange={handleFileChange} required />
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default FormComponent;
