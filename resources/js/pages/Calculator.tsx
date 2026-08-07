import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Calculator: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/paket', { replace: true });
    }, [navigate]);

    return null;
};

export default Calculator;