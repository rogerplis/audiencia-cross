import React, { useState } from 'react';
import type { FormData, FormErrors } from '../types';

interface RegistrationFormProps {
  onRegisterSuccess: (userData: { name: string; email: string; confirmed: boolean }) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    confirmed: false, // Valor inicial da confirmação
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = 'https://audienciacross.ngprojetos.com/api';

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'O nome é obrigatório.';
    }
    if (!formData.email) {
      newErrors.email = 'O email é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'O formato do email é inválido.';
    }
    if (!formData.phone) {
      newErrors.phone = 'O telefone é obrigatório.';
    } else if (!/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/.test(formData.phone)) {
        newErrors.phone = 'O formato do telefone é inválido (ex: (11) 98765-4321).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      // O backend deve estar rodando em http://127.0.0.1:5000
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // formData agora inclui 'confirmed'
      });

      const data = await response.json();
      console.log('Resposta do servidor:', data);

      if (response.ok) {
        onRegisterSuccess({ name: formData.name, email: formData.email, confirmed: formData.confirmed });
      } else {
        setServerError(data.error || 'Ocorreu um erro ao registrar. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro de rede ou servidor:', error);
      setServerError('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Inscreva-se Agora</h2>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {serverError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md" role="alert">
                {serverError}
            </div>
        )}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome Completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            required
            disabled={isLoading}
          />
          {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            required
            disabled={isLoading}
          />
          {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Telefone (com DDD)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(11) 91234-5678"
            className={`mt-1 block w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            required
            disabled={isLoading}
          />
          {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div className="flex items-center">
          <input
            id="confirmed"
            name="confirmed"
            type="checkbox"
            checked={formData.confirmed}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isLoading}
          />
          <label htmlFor="confirmed" className="ml-2 block text-sm text-gray-900">
            Confirmo minha presença no evento.
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Enviando...' : 'Finalizar Inscrição'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
