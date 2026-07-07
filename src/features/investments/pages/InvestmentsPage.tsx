import { useTheme } from '@/store';

export default function InvestmentsPage() {
  const { theme } = useTheme();

  return (
    <div style={{ padding: '24px' }}>
      <h1>Investimenti</h1>
      <p>Portafoglio investimenti in costruzione.</p>
      <p>
        <small>Tema attuale: {theme}</small>
      </p>
    </div>
  );
}
