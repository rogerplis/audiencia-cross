
import React, { useState } from 'react';
import { EmailIcon, WhatsappIcon } from './icons/Icons';

interface ShareScreenProps {
  name: string;
  email: string;
  onReturn: () => void;
  pageUrl: string;
}

const ShareScreen: React.FC<ShareScreenProps> = ({ name, email, onReturn, pageUrl }) => {
  const eventTitle = "Audiência Pública: Sistema CROSS – Central de Regulação de Ofertas de Serviços de Saúde - Regional, transparente e mais eficiente!";
  const eventDetails = "Data: 19/09/2025, 09:00h - 12:00h. Local: Plenário da Câmara Municipal de Araçatuba.";
  
  const defaultShareText = `*CONVITE ESPECIAL*
Olá, tudo bem?
Você é nosso(a) convidado(a) para participar da:

*AUDIÊNCIA PÚBLICA – SISTEMA CROSS*
Discutir e construir propostas para tornar o sistema regional, transparente e mais eficiente.

🗓️ 19/09/2025 – 9h
📍 Plenário da Câmara Municipal de Araçatuba
(Praça Nove de Julho, nº 26 – Centro)

*Participação com direito a certificado de AACC – Atividades Acadêmicas, Científicas e Culturais.*

Vagas Limitadas.  Sua presença é muito importante!
clique no link e faça sua inscrição: ${pageUrl}`;

  const [emailBody, setEmailBody] = useState(
    `CONVITE ESPECIAL
Olá, tudo bem?
Você é nosso(a) convidado(a) para participar da:

AUDIÊNCIA PÚBLICA – SISTEMA CROSS
Discutir e construir propostas para tornar o sistema regional, transparente e mais eficiente.

🗓️ 19/09/2025 – 9h
📍Plenário da Câmara Municipal de Araçatuba
(Praça Nove de Julho, nº 26 – Centro)

Participação com direito a certificado de AACC – Atividades Acadêmicas, Científicas e Culturais.

Vagas Limitadas.  Sua presença é muito importante!
clique no link e faça sua inscrição: ${pageUrl}`
  );

  const handleEmailShare = () => {
    const subject = `Convite: ${eventTitle}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };
  
  const handleWhatsappShare = () => {
    const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(defaultShareText)}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="p-8 md:p-16 text-center">
      <div className="max-w-2xl mx-auto">
        <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">Inscrição Confirmada!</h2>
        <p className="mt-2 text-lg text-gray-600">
          Obrigado, <span className="font-semibold">{name}</span>! Um email de confirmação foi enviado para <span className="font-semibold">{email}</span>.
        </p>

        <div className="mt-10 bg-gray-50 p-6 rounded-lg text-left">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Compartilhe com seus amigos</h3>
          <p className="text-gray-600 mb-6">Ajude a divulgar o evento. Quanto mais pessoas participarem, mais forte será nossa comunidade.</p>
          
          <div className="mb-6">
            <label htmlFor="email-body" className="block text-sm font-medium text-gray-700 mb-2">
              Personalize a mensagem do email:
            </label>
            <textarea
              id="email-body"
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleEmailShare}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <EmailIcon />
              <span className="ml-3">Enviar por Email</span>
            </button>
            <button
              onClick={handleWhatsappShare}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <WhatsappIcon />
              <span className="ml-3">Compartilhar no WhatsApp</span>
            </button>
          </div>
        </div>

        <button onClick={onReturn} className="mt-10 text-sm font-medium text-blue-600 hover:text-blue-500">
          &larr; Voltar para a página inicial
        </button>
      </div>
    </div>
  );
};

export default ShareScreen;