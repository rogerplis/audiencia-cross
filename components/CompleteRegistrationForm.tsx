import React, { useState, useEffect } from 'react';
import './CompleteRegistrationForm.css';
import Modal from './Modal'; // Importa o Modal

// Funções de máscara (portadas do JS original)
const onlyDigits = (s: string) => (s || '').replace(/\D/g, '');
const maskCPF = (v: string) => {
  v = onlyDigits(v).slice(0, 11);
  return v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, a, b, c, d) =>
    d ? `${a}.${b}.${c}-${d}` : c ? `${a}.${b}.${c}` : b ? `${a}.${b}` : a
  );
};
const maskPhone = (v: string) => {
  v = onlyDigits(v).slice(0, 11);
  return v.length <= 10
    ? v.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (_, a, b, c) =>
        (a ? '(' + a + (a.length === 2 ? ') ' : '') : '') + (b ? b + (c ? '-' : '') : '') + (c || '')
      )
    : v.replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, (_, a, b, c) =>
        (a ? '(' + a + (a.length === 2 ? ') ' : '') : '') + (b ? b + (c ? '-' : '') : '') + (c || '')
      );
};

interface CompleteRegistrationFormProps {
  user: { name: string; email: string };
  onSuccess: () => void;
}

const LgpdTerms = () => (
  <div className="space-y-4 text-sm text-gray-600">
    <p><strong>Última atualização: 11 de setembro de 2025</strong></p>
    <p>A sua privacidade é importante para nós. É política da Organização da Audiência Pública respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site e outros sistemas que possuímos e operamos.</p>
    <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>
    <h4 className="font-semibold">1. Coleta de Dados</h4>
    <p>Coletamos informações que você nos fornece diretamente, como nome, e-mail, CPF, telefone, e outros dados relevantes para a sua participação na audiência pública. Estes dados são essenciais para a organização, credenciamento e comunicação sobre o evento.</p>
    <h4 className="font-semibold">2. Uso dos Dados</h4>
    <p>Os dados coletados serão utilizados exclusivamente para os seguintes propósitos:</p>
    <ul className="list-disc list-inside space-y-1 pl-4">
      <li>Registro e credenciamento dos participantes no evento.</li>
      <li>Comunicação de informações importantes sobre a audiência pública (horários, locais, programação).</li>
      <li>Envio de materiais e certificados de participação.</li>
      <li>Análise estatística do perfil dos participantes, de forma anonimizada.</li>
    </ul>
    <h4 className="font-semibold">3. Consentimento para Comunicações</h4>
    <p>Ao optar por receber comunicações, você concorda em receber e-mails e mensagens de WhatsApp contendo informações pertinentes ao evento. Você pode revogar este consentimento a qualquer momento.</p>
    <h4 className="font-semibold">4. Armazenamento e Segurança</h4>
    <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>
    <h4 className="font-semibold">5. Compartilhamento de Dados</h4>
    <p>Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.</p>
    <h4 className="font-semibold">6. Seus Direitos</h4>
    <p>Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados. Como titular dos dados, você tem o direito de acessar, corrigir, anonimizar, bloquear ou eliminar seus dados pessoais de nosso banco de dados.</p>
    <p>O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco.</p>
  </div>
);

const CompleteRegistrationForm: React.FC<CompleteRegistrationFormProps> = ({ user, onSuccess }) => {
  const [formData, setFormData] = useState({
    registration_email: user.email,
    nome: user.name,
    cpf: '',
    sexo: '',
    whats: '',
    email: user.email,
    participacao: 'publico',
    instituicao_nome: '',
    cidade: '',
    cidade_outra: '',
    area_atuacao: '',
    nova_area: '',
    setor: '',
    novo_setor: '',
    cargo: '',
    instit_tel: '',
    instit_email: '',
    confirmacao_detalhada: '',
    aceite_lgpd: false,
    aceite_comunicados: false,
  });

  const [areas, setAreas] = useState<string[]>([]);
  const [setores, setSetores] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isLgpdModalOpen, setIsLgpdModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areasRes, setoresRes] = await Promise.all([
          fetch('/api/areas'),
          fetch('/api/setores'),
        ]);
        const [areasData, setoresData] = await Promise.all([areasRes.json(), setoresRes.json()]);
        if (areasRes.ok) setAreas(areasData);
        if (setoresRes.ok) setSetores(setoresData);
      } catch (error) {
        console.error('Falha ao buscar dados de seleção', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const finalValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    let maskedValue: string | boolean = finalValue;
    if (typeof finalValue === 'string') {
      if (name === 'cpf') maskedValue = maskCPF(finalValue);
      if (name === 'whats' || name === 'instit_tel') maskedValue = maskPhone(finalValue);
    }

    setFormData(prev => ({ ...prev, [name]: maskedValue }));
  };

  const handleChoiceClick = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!formData.cpf || !formData.sexo || !formData.confirmacao_detalhada) {
      setServerError('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }
    if (!formData.aceite_lgpd) {
      setServerError('Você deve aceitar os termos de uso e privacidade (LGPD).');
      return;
    }

    setIsLoading(true);

    const dataToSend = {
      ...formData,
      cpf: onlyDigits(formData.cpf),
      whats: onlyDigits(formData.whats),
      instit_tel: onlyDigits(formData.instit_tel),
      cidade: formData.cidade === '_outra' ? formData.cidade_outra : formData.cidade,
      area_atuacao: formData.area_atuacao.toLowerCase() === 'outra' ? formData.nova_area : formData.area_atuacao,
      setor: formData.setor.toLowerCase() === 'outra' ? formData.novo_setor : formData.setor,
    };

    try {
      const response = await fetch('/api/complete-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Cadastro completo salvo com sucesso!');
        onSuccess();
      } else {
        setServerError(result.error || 'Falha ao salvar o cadastro.');
      }
    } catch (error) {
      setServerError('Não foi possível conectar ao servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="ng-main muni-wrap">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Cadastro Complementar</h1>
      <p className="text-gray-600 mb-6">Obrigado por confirmar sua presença! Por favor, complete seu cadastro.</p>

      <form id="frmIS" className="muni-card" onSubmit={handleSubmit} noValidate>
        <div className="hd">
          <div className="title-wrap">
            <strong id="tituloCard">Olá, {user.name}</strong>
            <div className="muni-help">Campos marcados com * são obrigatórios.</div>
          </div>
        </div>

        <div className="bd">
          {serverError && <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-md">{serverError}</div>}

          <section className="muni-inner">
            <h4 className="blk-title">Dados do Participante</h4>
            <div className="muni-grid-autofit">
              <div className="muni-field">
                <label htmlFor="nome">Nome completo *</label>
                <input id="nome" name="nome" value={formData.nome} onChange={handleChange} required disabled />
              </div>
              <div className="muni-field">
                <label htmlFor="cpf">CPF *</label>
                <input id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required placeholder="000.000.000-00" />
              </div>
              <div className="muni-field">
                <label>Gênero *</label>
                <div className="radio-row">
                  <label><input type="radio" name="sexo" value="Masculino" checked={formData.sexo === 'Masculino'} onChange={handleChange} required /> Masculino</label>
                  <label><input type="radio" name="sexo" value="Feminino" checked={formData.sexo === 'Feminino'} onChange={handleChange} /> Feminino</label>
                  <label><input type="radio" name="sexo" value="Outro" checked={formData.sexo === 'Outro'} onChange={handleChange} /> Outro</label>
                </div>
              </div>
            </div>
            <div className="muni-grid-autofit">
              <div className="muni-field">
                <label htmlFor="whats">Tel/WhatsApp</label>
                <input id="whats" name="whats" value={formData.whats} onChange={handleChange} placeholder="(xx) xxxxx-xxxx" />
              </div>
              <div className="muni-field">
                <label htmlFor="email">E-mail pessoal</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@exemplo.com" disabled />
              </div>
            </div>
            <hr className="sep" />
          </section>

          <section className="muni-inner">
            <h4 className="blk-title">Participação</h4>
            <div className="muni-field">
              <label>Vou participar como *</label>
              <div className="radio-row">
                <label><input type="radio" name="participacao" value="publico" checked={formData.participacao === 'publico'} onChange={handleChange} required /> Público</label>
                <label><input type="radio" name="participacao" value="autoridade" checked={formData.participacao === 'autoridade'} onChange={handleChange} /> Mesa de autoridades</label>
              </div>
            </div>
            <hr className="sep" />
          </section>

          <section className="muni-inner">
            <h4 className="blk-title">Dados do Local de trabalho</h4>
            <div className="muni-grid-2">
              <div className="muni-field">
                <label htmlFor="instituicao_nome">Nome da Instituição</label>
                <input id="instituicao_nome" name="instituicao_nome" value={formData.instituicao_nome} onChange={handleChange} placeholder="Ex.: Prefeitura de Araçatuba" />
              </div>
              <div className="muni-field">
                <label htmlFor="cidade">Cidade</label>
                <div className="combo">
                  <select id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} className="select">
                    <option value="">-- selecione --</option>
                    <option>Araçatuba</option><option>Auriflama</option><option>Bento de Abreu</option><option>Bilac</option><option>Guararapes</option><option>Guzolândia</option><option>Nova Castilho</option><option>Nova Luzitânia</option><option>Rubiácea</option><option>Santo Antônio do Aracanguá</option><option>Valparaíso</option>
                    <option>Alto Alegre</option><option>Avanhandava</option><option>Barbosa</option><option>Birigui</option><option>Braúna</option><option>Brejo Alegre</option><option>Buritama</option><option>Clementina</option><option>Coroados</option><option>Gabriel Monteiro</option><option>Glicério</option><option>Lourdes</option><option>Luiziânia</option><option>Penápolis</option><option>Piacatu</option><option>Santópolis do Aguapeí</option><option>Turiúba</option>
                    <option>Andradina</option><option>Castilho</option><option>Guaraçaí</option><option>Ilha Solteira</option><option>Itapura</option><option>Lavínia</option><option>Mirandópolis</option><option>Murutinga do Sul</option><option>Nova Independência</option><option>Pereira Barreto</option><option>Sud Mennucci</option><option>Suzanápolis</option>
                    <option value="_outra">Outra</option>
                  </select>
                  {formData.cidade === '_outra' && <input id="cidade_outra" name="cidade_outra" value={formData.cidade_outra} onChange={handleChange} placeholder="Informe a cidade" className="stacked" />}
                </div>
              </div>
            </div>
            <div className="muni-grid-autofit">
              <div className="muni-field">
                <label htmlFor="area_atuacao">Área de Atuação</label>
                <select id="area_atuacao" name="area_atuacao" value={formData.area_atuacao} onChange={handleChange} className="select">
                  <option value="">-- selecione --</option>
                  {areas.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
                {formData.area_atuacao.toLowerCase() === 'outra' && <input id="nova_area" name="nova_area" value={formData.nova_area} onChange={handleChange} placeholder="Nova área de atuação" className="stacked" />}
              </div>
              <div className="muni-field">
                <label htmlFor="setor">Setor que trabalha</label>
                <select id="setor" name="setor" value={formData.setor} onChange={handleChange} className="select">
                  <option value="">-- selecione --</option>
                  {setores.map(setor => <option key={setor} value={setor}>{setor}</option>)}
                </select>
                {formData.setor.toLowerCase() === 'outra' && <input id="novo_setor" name="novo_setor" value={formData.novo_setor} onChange={handleChange} placeholder="Novo setor" className="stacked" />}
              </div>
              <div className="muni-field">
                <label htmlFor="cargo">Cargo que ocupa</label>
                <input id="cargo" name="cargo" value={formData.cargo} onChange={handleChange} placeholder="Ex.: Secretário de Saúde" />
              </div>
            </div>
            <hr className="sep" />
          </section>

          <section className="muni-inner">
            <h4 className="blk-title">Confirmação de presença *</h4>
            <div className="muni-field">
              <div className="choice-group">
                <button type="button" className={`choice ${formData.confirmacao_detalhada === 'confirmo' ? 'selected' : ''}`} onClick={() => handleChoiceClick('confirmacao_detalhada', 'confirmo')}>Já confirmo a minha participação</button>
                <button type="button" className={`choice ${formData.confirmacao_detalhada === 'aguardando' ? 'selected' : ''}`} onClick={() => handleChoiceClick('confirmacao_detalhada', 'aguardando')}>Confirmarei depois</button>
              </div>
            </div>
            <hr className="sep" />
          </section>

          <section className="muni-inner">
            <h4 className="blk-title">Termos e Comunicações</h4>
            <div className="muni-field">
              <div className="flex items-start mb-4">
                <input id="aceite_lgpd" name="aceite_lgpd" type="checkbox" checked={formData.aceite_lgpd} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1" />
                <div className="ml-3 text-sm text-gray-700">
                  <label htmlFor="aceite_lgpd">
                    Li e aceito os <button type="button" onClick={() => setIsLgpdModalOpen(true)} className="font-medium text-blue-600 hover:underline">termos de uso e privacidade de dados (LGPD)</button>. *
                  </label>
                </div>
              </div>
              <div className="flex items-start">
                <input id="aceite_comunicados" name="aceite_comunicados" type="checkbox" checked={formData.aceite_comunicados} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1" />
                <label htmlFor="aceite_comunicados" className="ml-3 text-sm text-gray-700">
                  Aceito receber mensagens por e-mail ou WhatsApp sobre este evento.
                </label>
              </div>
            </div>
          </section>
        </div>

        <div className="muni-sticky">
          <div className="sticky-row">
            <button type="submit" className="muni-btn primary" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Cadastro Completo'}
            </button>
          </div>
        </div>
      </form>

      <Modal isOpen={isLgpdModalOpen} onClose={() => setIsLgpdModalOpen(false)} title="Termos de Uso e Privacidade de Dados (LGPD)">
        <LgpdTerms />
      </Modal>
    </main>
  );
};

export default CompleteRegistrationForm;