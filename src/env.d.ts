// Augmentazione ImportMetaEnv per variabili d'ambiente custom
// Vite carica automaticamente i tipi da vite/client (già in tsconfig)

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Aggiungi qui altre VITE_* variabili
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
