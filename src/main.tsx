import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App'; iriamos fazer assim caso usasemos o export default App
import {App} from './App';

// createRoot busca um arquivo que tenha o id root e se ele encontrar esse elemento ele renderiza um  componente dentro da pagina no caso o App
createRoot(document.getElementById('root')!).render(
  // StrictMode boa pratica
  <StrictMode>
    <App/>
  </StrictMode>,
)
