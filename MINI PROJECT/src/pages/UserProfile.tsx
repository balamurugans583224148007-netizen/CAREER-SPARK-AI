import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Sparkles, Globe, MessageSquare, Save } from 'lucide-react';
import type { Language, Tone } from '../types';

export const UserProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useApp();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [defaultLang, setDefaultLang] = useState<Language>(user?.default_language || 'en');
  const [defaultTone, setDefaultTone] = useState<Tone>(user?.default_tone || 'professional');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      full_name: fullName,
      headline,
      bio,
      default_language: defaultLang,
      default_tone: defaultTone
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">User Profile & Tone Defaults</h1>
        <p className="text-gray-400 text-sm mt-1">
          Personalize your professional identity and default AI generation parameters.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-gray-900/80 border border-gray-800 shadow-xl space-y-6">
        <div className="flex items-center gap-5 pb-6 border-b border-gray-800">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="Avatar"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-violet-500/60 shadow-lg"
          />
          <div>
            <h3 className="text-lg font-bold text-white">{user?.full_name || 'Alex Rivera'}</h3>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email}</span>
            </p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-2 rounded bg-violet-950/80 border border-violet-800 text-violet-300 text-[10px] font-semibold">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span>AI Verified Creator</span>
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Professional Headline</label>
            <input
              type="text"
              value={headline}
              onChange={e => setHeadline(e.target.value)}
              placeholder="e.g. Lead Systems Architect | AI & Cloud"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Short Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:border-violet-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-violet-400" />
                <span>Default Language</span>
              </label>
              <select
                value={defaultLang}
                onChange={e => setDefaultLang(e.target.value as Language)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:border-violet-500"
              >
                <option value="en">English (Global)</option>
                <option value="ta">Tamil (தமிழ்)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
                <span>Default Tone</span>
              </label>
              <select
                value={defaultTone}
                onChange={e => setDefaultTone(e.target.value as Tone)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:border-violet-500"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="concise">Concise</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
