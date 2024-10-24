import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormComponent from './FormComponent';
import SuccessPage from './SuccessPage';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<FormComponent />} />
                <Route path="/success" element={<SuccessPage />} />
            </Routes>
        </Router>
    );
}

export default App;
