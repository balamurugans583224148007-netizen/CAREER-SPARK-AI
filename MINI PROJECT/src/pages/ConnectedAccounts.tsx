import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Key, 
  Info
} from 'lucide-react';
import type { SocialPlatform } from '../types';
import { LinkedinIcon, InstagramIcon, FacebookIcon } from '../components/SocialIcons';

export const ConnectedAccounts: React.FC = () => {
  const { connectedAccounts, toggleAccountConnection } = useApp();
  const [activeSetupModal, setActiveSetupModal] = useState<SocialPlatform | null>(null);

  const getPlatformIcon = (plat: SocialPlatform) => {
    switch (plat) {
      case 'linkedin':
        return <LinkedinIcon className="w-6 h-6 text-blue-400" />;
      case 'instagram':
        return <InstagramIcon className="w-6 h-6 text-pink-400" />;
      case 'facebook':
        return <FacebookIcon className="w-6 h-6 text-indigo-400" />;
    }
  };

  const getSetupDetails = (plat: SocialPlatform) => {
    switch (plat) {
      case 'linkedin':
        return {
          title: 'Official LinkedIn OAuth 2.0 Integration',
          docsUrl: 'https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin',
          requiredPermissions: ['w_member_social', 'r_liteprofile', 'openid', 'profile', 'email'],
          callbackUrl: `${window.location.origin}/api/auth/callback/linkedin`,
          description: 'Enables direct UGC posting with rich images to personal and company LinkedIn feeds without scraping.'
        };
      case 'instagram':
        return {
          title: 'Official Meta Instagram Content Publishing API',
          docsUrl: 'https://developers.facebook.com/docs/instagram-api/guides/content-publishing',
          requiredPermissions: ['instagram_basic', 'instagram_content_publish', 'pages_show_list'],
          callbackUrl: `${window.location.origin}/api/auth/callback/meta`,
          description: 'Requires an Instagram Professional (Creator/Business) account linked to a Meta Facebook Page.'
        };
      case 'facebook':
        return {
          title: 'Official Meta Graph API for Facebook Pages',
          docsUrl: 'https://developers.facebook.com/docs/pages-api/posts',
          requiredPermissions: ['pages_manage_posts', 'pages_read_engagement', 'public_profile'],
          callbackUrl: `${window.location.origin}/api/auth/callback/meta`,
          description: 'Allows publishing posts directly to verified Facebook Pages you manage with page access tokens.'
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Connected Social Accounts</h1>
          <p className="text-gray-400 text-sm mt-1">
            Official OAuth 2.0 integrations with server-side encrypted token storage. No passwords or scraping.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {connectedAccounts.map(account => {
          const details = getSetupDetails(account.platform);
          return (
            <div
              key={account.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-gray-900/80 border border-gray-800 shadow-xl space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gray-950 border border-gray-800">
                    {getPlatformIcon(account.platform)}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    account.is_connected
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-700'
                  }`}>
                    {account.is_connected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Setup Required</span>
                      </>
                    )}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white capitalize">{account.platform}</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{account.account_name}</p>
                <p className="text-xs text-gray-300 mt-3 leading-relaxed">{details.description}</p>

                {/* Scopes and Permissions */}
                <div className="mt-4 pt-3 border-t border-gray-800/80">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Required Scopes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {details.requiredPermissions.map(p => (
                      <span key={p} className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-950 text-gray-300 border border-gray-800">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => toggleAccountConnection(account.platform)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                    account.is_connected
                      ? 'bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200'
                      : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{account.is_connected ? 'Disconnect Account' : 'Connect via OAuth'}</span>
                </button>

                <button
                  onClick={() => setActiveSetupModal(account.platform)}
                  className="w-full py-2 rounded-xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>View Setup Guide</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Setup Guide Modal */}
      {activeSetupModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          {(() => {
            const details = getSetupDetails(activeSetupModal);
            return (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(activeSetupModal)}
                    <h3 className="text-lg font-bold text-white">{details.title}</h3>
                  </div>
                  <button
                    onClick={() => setActiveSetupModal(null)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-xs text-gray-300">
                  <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
                    <span className="font-semibold text-white block">Official Redirect / Callback URL:</span>
                    <code className="text-violet-400 font-mono select-all block break-all">
                      {details.callbackUrl}
                    </code>
                  </div>

                  <div>
                    <span className="font-semibold text-white block mb-1">Required OAuth Scopes:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {details.requiredPermissions.map(p => (
                        <span key={p} className="font-mono px-2.5 py-1 rounded bg-gray-950 text-emerald-400 border border-gray-800">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 leading-relaxed">
                    <p>1. Create your developer app on the official developer portal.</p>
                    <p>2. Add the callback URL above to your OAuth 2.0 client settings.</p>
                    <p>3. Set your Client ID & Secret in <code className="text-violet-300">.env</code> on your server.</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                  <a
                    href={details.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-violet-400 hover:text-violet-300 text-xs font-semibold flex items-center gap-1"
                  >
                    <span>Official Documentation</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setActiveSetupModal(null)}
                    className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
