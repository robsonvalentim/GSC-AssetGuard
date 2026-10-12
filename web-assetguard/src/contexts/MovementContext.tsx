/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

interface MovementContextData {
  cpfColaborador: string;
  setCpfColaborador: (cpf: string) => void;
  limparContexto: () => void;
}

const MovementContext = createContext<MovementContextData>({} as MovementContextData);

export function MovementProvider({ children }: { children: ReactNode }) {
  const [cpfColaborador, setCpfColaborador] = useState('');

  function limparContexto() {
    setCpfColaborador('');
  }

  return (
    <MovementContext.Provider value={{ cpfColaborador, setCpfColaborador, limparContexto }}>
      {children}
    </MovementContext.Provider>
  );
}

export function useMovement() {
  const context = useContext(MovementContext);
  
  if (!context) {
    throw new Error('useMovement deve ser usado dentro de um MovementProvider');
  }
  
  return context;
}