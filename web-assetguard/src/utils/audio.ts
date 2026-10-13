import successSound from '../assets/sounds/success.mp3';
import errorSound from '../assets/sounds/error.mp3';

export const playSuccess = () => {
  const audio = new Audio(successSound);
  audio.play().catch((e) => console.warn('Bloqueio do navegador para autoplay de audio', e));
};

export const playError = () => {
  const audio = new Audio(errorSound);
  audio.play().catch((e) => console.warn('Bloqueio do navegador para autoplay de audio', e));
};