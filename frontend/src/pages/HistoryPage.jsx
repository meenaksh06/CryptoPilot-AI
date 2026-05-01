import { Navigate } from 'react-router-dom';

export default function HistoryPage() {
  return <Navigate to="/portfolio?tab=history" replace />;
}
