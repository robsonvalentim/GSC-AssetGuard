import { useNavigate } from 'react-router-dom';

export function Checkin() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Fluxo de Devolucao (Check-in)</h2>
      <p>Em breve: Bipe o coletor e responda ao questionario de saude.</p>
      <button onClick={() => navigate('/')}>VOLTAR</button>
    </div>
  );
}