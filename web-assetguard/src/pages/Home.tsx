import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>AssetGuard - Quiosque</h1>
      <p>Selecione a operacao desejada:</p>
      
      <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        <button onClick={() => navigate('/checkout')}>RETIRAR EQUIPAMENTO</button>
        <button onClick={() => navigate('/checkin')}>DEVOLVER EQUIPAMENTO</button>
      </div>
    </div>
  );
}