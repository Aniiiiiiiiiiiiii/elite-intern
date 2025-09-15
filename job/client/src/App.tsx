import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import JobListingsPage from '@/pages/JobListingsPage';
import JobSearchPage from '@/pages/JobSearchPage';
import SavedJobsPage from '@/pages/SavedJobsPage';
import PaymentReminderPage from '@/pages/PaymentReminderPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<JobListingsPage />} />
          <Route path="/search" element={<JobSearchPage />} />
          <Route path="/saved" element={<SavedJobsPage />} />
          // <Route path="/reminders" element={<PaymentReminderPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;