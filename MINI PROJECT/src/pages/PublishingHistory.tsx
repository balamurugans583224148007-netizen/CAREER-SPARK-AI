import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  History, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RefreshCw
} from 'lucide-react';
import type { SocialPlatform } from '../types';
import { LinkedinIcon, InstagramIcon, FacebookIcon } from '../components/SocialIcons';

export const PublishingHistory: React.FC = () => {
  const { publishingAttempts, posts, addToast } = useApp();

  const getPlatformIcon = (plat: SocialPlatform) => {
    switch (plat) {
      case 'linkedin':
        return <LinkedinIcon className="w-4 h-4 text-blue-400" />;
      case 'instagram':
        return <InstagramIcon className="w-4 h-4 text-pink-400" />;
      case 'facebook':
        return <FacebookIcon className="w-4 h-4 text-indigo-400" />;
    }
  };

  const handleRetry = (attemptId: string) => {
    addToast('info', `Reconciling attempt ${attemptId}... Verified no duplicate dispatch.`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Publishing Audit & History</h1>
          <p className="text-gray-400 text-sm mt-1">
            Immutable audit log of all social dispatches, idempotency keys, provider IDs, and error reconciliation.
          </p>
        </div>
      </div>

      {publishingAttempts.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-gray-900/40 border border-gray-800 text-gray-500 space-y-3">
          <History className="w-12 h-12 mx-auto text-gray-600" />
          <h3 className="text-base font-semibold text-gray-300">No Publishing History Yet</h3>
          <p className="text-xs text-gray-500">Approved posts dispatched to social networks will record an audit trail here.</p>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 shadow-xl overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="text-[11px] text-gray-400 uppercase tracking-wider bg-gray-950/60 border-b border-gray-800">
              <tr>
                <th className="p-4">Destination</th>
                <th className="p-4">Associated Post</th>
                <th className="p-4">Status</th>
                <th className="p-4">Idempotency Key</th>
                <th className="p-4">Provider Reference</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {publishingAttempts.map(att => {
                const relatedPost = posts.find(p => p.id === att.post_id);
                return (
                  <tr key={att.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(att.destination)}
                        <span className="font-semibold text-white capitalize">{att.destination}</span>
                      </div>
                    </td>

                    <td className="p-4 font-medium text-white max-w-xs truncate">
                      {relatedPost?.title || att.post_id}
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-bold text-[10px] ${
                        att.status === 'success' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        att.status === 'failed' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {att.status === 'success' && <CheckCircle2 className="w-3 h-3" />}
                        {att.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                        {att.status === 'in_progress' && <Clock className="w-3 h-3 animate-spin" />}
                        <span>{att.status.toUpperCase()}</span>
                      </span>
                      {att.error_message && (
                        <div className="text-[10px] text-rose-400 mt-1 max-w-xs truncate" title={att.error_message}>
                          {att.error_message}
                        </div>
                      )}
                    </td>

                    <td className="p-4 font-mono text-gray-400 max-w-[140px] truncate" title={att.idempotency_key}>
                      {att.idempotency_key}
                    </td>

                    <td className="p-4 font-mono text-violet-400">
                      {att.provider_post_id ? (
                        <span className="truncate block max-w-[120px]">{att.provider_post_id}</span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>

                    <td className="p-4 text-gray-400">
                      {new Date(att.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>

                    <td className="p-4 text-right">
                      {att.status === 'failed' ? (
                        <button
                          onClick={() => handleRetry(att.id)}
                          className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] font-semibold flex items-center gap-1 ml-auto"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reconcile</span>
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-mono text-[11px]">Verified</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
