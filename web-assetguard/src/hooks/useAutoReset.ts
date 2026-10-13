import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovement } from '../contexts/MovementContext';

export function useAutoReset(timeoutMs: number = 45000) { // 45 segundos padrão
  const navigate = useNavigate();
  const { limparContexto } = useMovement();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        limparContexto(); // Limpa o CPF que estava na memória
        navigate('/'); // Joga o usuário de volta para a Home
      }, timeoutMs);
    };

    // Qualquer digitação ou movimento do mouse zera o cronômetro
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    
    resetTimer(); // Inicia na primeira montagem

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [navigate, limparContexto, timeoutMs]);
}