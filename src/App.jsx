import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/header';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import DealerInvoice from './pages/DealerInvoice';
import { ToastContainer } from 'react-toastify';
import theme from './theme/theme';

const HomePage = lazy(() => import('./pages/HomePage'));
const MultiLoanFormPage = lazy(() => import('./pages/MultiLoanFormPage'));
const DocumentVerification = lazy(() => import('./pages/DocumentVerification'));
const SanctionLetter = lazy(() => import('./pages/SanctionLetter'));
const ThankYou = lazy(() => import('./pages/ThankYou'));

export default function App() {
  return (
    <div className="app-root">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Header />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/apply/:loanType/:subtype/*" element={<MultiLoanFormPage />} />
              <Route path="/documentsVerification" element={<DocumentVerification />} />
              <Route path="/dealer-invoice" element={<DealerInvoice />} />
              <Route path="/apply/:loanType/:subtype/sanction" element={<SanctionLetter />} />
              <Route path="/thank-you" element={<ThankYou />} />
            </Routes>
          </Suspense>
          <ToastContainer autoClose={1000} />
          <Footer />
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  );
}
