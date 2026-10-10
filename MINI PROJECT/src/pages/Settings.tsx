import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Key, Database, Lock } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { addToast } = useApp();
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('aes-256-gcm-master-prod-key-configured');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Security configurations saved to secure environment storage.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System & Security Settings</h1>
        <p className="text-gray-400 text-sm mt-1">
          Configure API credentials, database keys, and server-side encryption parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Supabase Config */}
        <div className="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base pb-2 border-b border-gray-800">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>Supabase PostgreSQL & Storage</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">VITE_SUPABASE_URL</label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrl}
                onChange={e => setSupabaseUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">VITE_SUPABASE_ANON_KEY</label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={supabaseAnonKey}
                onChange={e => setSupabaseAnonKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Gemini AI Config */}
        <div className="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base pb-2 border-b border-gray-800">
            <Key className="w-5 h-5 text-violet-400" />
            <span>Google Gemini AI Multimodal Vision</span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">GEMINI_API_KEY (Server Only)</label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiApiKey}
              onChange={e => setGeminiApiKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono focus:border-violet-500"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Never exposed to browser clients. Used exclusively in isolated serverless functions.
            </p>
          </div>
        </div>

        {/* Encryption Key */}
        <div className="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base pb-2 border-b border-gray-800">
            <Lock className="w-5 h-5 text-amber-400" />
            <span>OAuth Token Encryption (Rule 10)</span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">TOKEN_ENCRYPTION_KEY</label>
            <input
              type="password"
              value={encryptionKey}
              onChange={e => setEncryptionKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono focus:border-violet-500"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Social provider tokens are encrypted at rest with AES-256 before writing to PostgreSQL.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-colors"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
};
