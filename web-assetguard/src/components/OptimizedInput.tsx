import { useEffect, useRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface OptimizedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onEnter: (value: string) => void;
  isCpf?: boolean;
}

export function OptimizedInput({ onEnter, isCpf, ...props }: OptimizedInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Mantém o foco cravado no input para o leitor USB não falhar
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    focusInput();
    // Se o usuário clicar fora (perder o foco), o sistema puxa de volta após 100ms
    window.addEventListener('click', focusInput);
    return () => window.removeEventListener('click', focusInput);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      let value = e.currentTarget.value;
      
      // Se for CPF, já fazemos uma pré-sanitização visual aqui (remove pontos e traços)
      if (isCpf) {
        value = value.replace(/\D/g, '');
      }
      
      onEnter(value);
    }
  };

  return (
    <input
      ref={inputRef}
      onKeyDown={handleKeyDown}
      autoComplete="off"
      style={{
        padding: '1.5rem',
        fontSize: '2rem',
        textAlign: 'center',
        borderRadius: '8px',
        border: '3px solid var(--sc-blue-dark)',
        width: '100%',
        maxWidth: '500px',
        outline: 'none',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      }}
      {...props}
    />
  );
}