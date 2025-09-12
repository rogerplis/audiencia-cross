
import React from 'react';
import { CalendarIcon, ClockIcon, LocationIcon } from './icons/Icons';

const EventDetails: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Como será o evento</h2>
      <p className="text-gray-600 mb-8 leading-relaxed">
        A Assembleia Legislativa do Estado de São Paulo (ALESP) realizará a Audiência Pública do Sistema CROSS (Central de Regulação de Ofertas de Serviços de Saúde) com o objetivo de discutir e construir, junto a municípios, gestores, profissionais da saúde, segmentos da sociedade organizada e a população em geral, propostas de melhorias que tornem o sistema CROSS: regional, transparente e mais eficiente.
      </p>
      <div className="space-y-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
            <CalendarIcon />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">Data</h3>
            <p className="text-gray-600">19 de Setembro de 2025</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
            <ClockIcon />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">Horário</h3>
            <p className="text-gray-600">09:00h - 12:00h</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
            <LocationIcon />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">Local</h3>
            <p className="text-gray-600">Plenário da Câmara Municipal de Araçatuba
</p>
            <p className="text-sm text-gray-500">Praça Nove de Julho, nº 26 – Centro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
