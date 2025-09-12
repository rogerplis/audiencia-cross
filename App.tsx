
import React, { useState } from 'react';
import EventDetails from './components/EventDetails';
import RegistrationForm from './components/RegistrationForm';
import ShareScreen from './components/ShareScreen';
import CompleteRegistrationForm from './components/CompleteRegistrationForm'; // Importando o novo componente

// Definindo os estados da aplicação para um controle mais claro
type AppState = 'REGISTRATION' | 'COMPLETE_REGISTRATION' | 'SHARE';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('REGISTRATION');
  const [registeredUser, setRegisteredUser] = useState({ name: '', email: '' });
  const pageUrl = window.location.href;

  // Atualizado para receber 'confirmed' do formulário inicial
  const handleRegistrationSuccess = (userData: { name: string; email: string; confirmed: boolean }) => {
    setRegisteredUser({ name: userData.name, email: userData.email });
    if (userData.confirmed) {
      setAppState('COMPLETE_REGISTRATION'); // Se confirmou, vai para o cadastro completo
    } else {
      setAppState('SHARE'); // Se não, vai direto para o compartilhamento
    }
  };

  // Função para avançar para a tela de compartilhamento após o cadastro completo
  const handleCompleteRegistrationSuccess = () => {
    setAppState('SHARE');
  };

  const handleReturn = () => {
    setAppState('REGISTRATION');
    setRegisteredUser({ name: '', email: '' });
  };

  const renderContent = () => {
    switch (appState) {
      case 'REGISTRATION':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <EventDetails />
            </div>
            <div className="bg-gray-50 p-8 md:p-12">
              <RegistrationForm onRegisterSuccess={handleRegistrationSuccess} />
            </div>
          </div>
        );
      case 'COMPLETE_REGISTRATION':
        return (
          <div className="p-8 md:p-12">
            <CompleteRegistrationForm 
              user={registeredUser} 
              onSuccess={handleCompleteRegistrationSuccess} 
            />
          </div>
        );
      case 'SHARE':
        return (
          <ShareScreen 
            name={registeredUser.name} 
            email={registeredUser.email} 
            onReturn={handleReturn}
            pageUrl={pageUrl}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
            Audiência Pública: Sistema Cross
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Regional, transparente e MAIS EFICIENTE
          </p>
        </header>

        <main className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500">
          {renderContent()}
        </main>

        <footer className="text-center mt-10 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Organização da Audiência Pública. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;