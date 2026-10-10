import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from './components/Toast';
import { DashboardLayout } from './layouts/DashboardLayout';

import { Dashboard } from './pages/Dashboard';
import { CreatePost } from './pages/CreatePost';
import { MyPosts } from './pages/MyPosts';
import { ApprovalCentre } from './pages/ApprovalCentre';
import { ConnectedAccounts } from './pages/ConnectedAccounts';
import { PublishingHistory } from './pages/PublishingHistory';
import { SettingsPage } from './pages/Settings';
import { UserProfilePage } from './pages/UserProfile';
import { AuthPages } from './pages/AuthPages';
import { LiveSocialFeeds } from './pages/LiveSocialFeeds';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPages />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="create" element={<CreatePost />} />
            <Route path="social-feed" element={<LiveSocialFeeds />} />
            <Route path="posts" element={<MyPosts />} />
            <Route path="approvals" element={<ApprovalCentre />} />
            <Route path="accounts" element={<ConnectedAccounts />} />
            <Route path="history" element={<PublishingHistory />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
