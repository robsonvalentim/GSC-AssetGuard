import { useNavigate } from 'react-router-dom';

// Importação das logomarcas corporativas
import logoGrupoSC from '../assets/logos/gruposc-logo.png'; // Antigo LOGO_FUNDO BRANCO_C SLOGAN.png
import logoSantaCruz from '../assets/logos/SantaCruz.png';
import logoPanpharma from '../assets/logos/Panpharma.png';
import logoOncoprod from '../assets/logos/Oncoprod.png';

export function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '100vh',
      padding: '3rem 2rem'
    }}>
      {/* Cabeçalho Corporativo */}
      <header style={{ textAlign: 'center' }}>
        <img 
          src={logoGrupoSC} 
          alt="GrupoSC - Mais saúde para mais pessoas" 
          style={{ height: '140px', objectFit: 'contain' }} 
        />
      </header>

      {/* Área Central da Operação (Botões Massivos) */}
      <main style={{
        display: 'flex',
        gap: '4rem',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
      }}>
        <button
          className="btn-quiosque btn-retirar"
          onClick={() => navigate('/checkout')}
          style={{ width: '450px', height: '220px', fontSize: '2.5rem' }}
        >
          Retirar<br/>Equipamento
        </button>
        
        <button
          className="btn-quiosque btn-devolver"
          onClick={() => navigate('/checkin')}
          style={{ width: '450px', height: '220px', fontSize: '2.5rem' }}
        >
          Devolver<br/>Equipamento
        </button>
      </main>

      {/* Rodapé Institucional (Marcas de Apoio) */}
      <footer style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '5rem',
        alignItems: 'center',
        opacity: 0.9
      }}>
        <img src={logoSantaCruz} alt="Santa Cruz" style={{ height: '45px' }} />
        <img src={logoPanpharma} alt="Panpharma" style={{ height: '45px' }} />
        <img src={logoOncoprod} alt="Oncoprod" style={{ height: '45px' }} />
      </footer>
    </div>
  );
}