import React, { useEffect, useState } from 'react';
import './Dashboard.css';

interface Registration {
    id: number;
    name: string;
    email: string;
    phone: string;
    confirmed: boolean;
    timestamp: string;
}

const Dashboard: React.FC = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [count, setCount] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const response = await fetch('/api/registrations');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRegistrations(data.registrations);
                setCount(data.count);
            } catch (error) {
                setError('Erro ao buscar inscrições.');
                console.error('Fetch error:', error);
            }
        };

        fetchRegistrations();
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Dashboard de Inscrições</h1>
            {error && <p className="error-message">{error}</p>}
            
            <div className="summary-card">
                <h2>Total de Inscritos</h2>
                <p className="count">{count}</p>
            </div>

            <div className="table-container">
                <h2>Lista de Inscritos</h2>
                <table className="registrations-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Confirmado</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map((reg) => (
                            <tr key={reg.id}>
                                <td>{reg.id}</td>
                                <td>{reg.name}</td>
                                <td>{reg.email}</td>
                                <td>{reg.phone}</td>
                                <td>{reg.confirmed ? 'Sim' : 'Não'}</td>
                                <td>{new Date(reg.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
