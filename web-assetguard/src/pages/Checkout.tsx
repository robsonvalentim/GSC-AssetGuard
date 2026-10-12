import { useNavigate } from 'react-router-dom';

export function Checkout() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Fluxo de Retirada (Check-out)</h2>
      <p>Em breve: Digite seu CPF e bipe a etiqueta térmica.</p>
      <button onClick={() => navigate('/')}>VOLTAR</button>
    </div>
  );
}