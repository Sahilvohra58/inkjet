import { Routes, Route } from 'react-router-dom';
import { Authenticated, Unauthenticated } from 'convex/react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <>
          <Unauthenticated>
            <LandingPage />
          </Unauthenticated>
          <Authenticated>
            <DashboardPage />
          </Authenticated>
        </>
      } />
      <Route path="/auth" element={
        <>
          <Unauthenticated>
            <AuthPage />
          </Unauthenticated>
          <Authenticated>
            <DashboardPage />
          </Authenticated>
        </>
      } />
      <Route path="/dashboard" element={
        <>
          <Unauthenticated>
            <LandingPage />
          </Unauthenticated>
          <Authenticated>
            <DashboardPage />
          </Authenticated>
        </>
      } />
      <Route path="/document/:id" element={
        <>
          <Unauthenticated>
            <LandingPage />
          </Unauthenticated>
          <Authenticated>
            <EditorPage />
          </Authenticated>
        </>
      } />
    </Routes>
  );
}

export default App;
