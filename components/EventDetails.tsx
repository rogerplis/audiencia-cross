
import React from 'react';
import { CalendarIcon, ClockIcon, LocationIcon } from './icons/Icons';

const EventDetails: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Como será o evento</h2>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Esta audiência pública é uma oportunidade para todos os cidadãos expressarem suas opiniões e contribuírem para as decisões sobre os próximos projetos de desenvolvimento urbano. Teremos apresentações de especialistas, sessões de perguntas e respostas, e painéis de discussão abertos. Sua participação é crucial.
      </p>
      <div className="space-y-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
            <CalendarIcon />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">Data</h3>
            <p className="text-gray-600">30 de Agosto de 2024</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
            <ClockIcon />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">Horário</h3>
            <p className="text-gray-600">19:00h - 22:00h</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
            <LocationIcon />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">Local</h3>
            <p className="text-gray-600">Auditório Principal da Prefeitura</p>
            <p className="text-sm text-gray-500">Av. Principal, 123, Centro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
