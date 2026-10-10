import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, 
  Send, 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  Layers,
  ExternalLink
} from 'lucide-react';
import type { SocialPlatform } from '../types';
import { ManualPublishingProvider } from '../lib/publishing';

export const ApprovalCentre: React.FC = () => {
  const { posts, approvePost, publishPost, addToast } = useApp();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<SocialPlatform>('linkedin');

  const pendingOrApprovedPosts = posts.filter(
    p => p.status === 'pending_approval' || p.status === 'approved' || p.status === 'draft'
  );

  const activePost = posts.find(p => p.id === selectedPostId) || pendingOrApprovedPosts[0];
  const activeVersion = activePost?.versions?.find(v => v.id === activePost.current_version_id);
  const validApproval = activePost?.approvals?.find(
    a => a.post_version_id === activePost.current_version_id && a.is_valid
  );

  const handleApprove = () => {
    if (!activePost) return;
    const ok = approvePost(activePost.id, activePost.destinations);
    if (ok) {
      addToast('success', 'Version approved. Publishing gate is now unlocked.');
    }
  };

  const handlePublish = async () => {
    if (!activePost) return;
    setIsPublishing(true);
    try {
      await publishPost(activePost.id);
    } finally {
      setIsPublishing(false);
    }
  };

  const copyContent = async (text: string, key: string) => {
    const success = await ManualPublishingProvider.copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      addToast('info', 'Copied to clipboard!');
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>Mandatory Server-Side Approval Gate (Rule 8)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Approval & Publishing Centre</h1>
          <p className="text-gray-400 text-sm mt-1">
            Publishing never occurs automatically. Inspect exact versions, lock approvals, and dispatch verified payloads.
          </p>
        </div>
      </div>

      {pendingOrApprovedPosts.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-gray-900/40 border border-gray-800 text-gray-500 space-y-3">
          <CheckSquare className="w-12 h-12 mx-auto text-gray-600" />
          <h3 className="text-base font-semibold text-gray-300">No Posts in Gate Queue</h3>
          <p className="text-xs text-gray-500">Create a post or request approval to review it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Post Queue Selector */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Queue ({pendingOrApprovedPosts.length})
            </h3>
            {pendingOrApprovedPosts.map(post => {
              const curVer = post.versions?.find(v => v.id === post.current_version_id);
              const isSelected = (activePost?.id === post.id);

              return (
                <div
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-violet-950/40 border-violet-500/80 shadow-lg shadow-violet-900/20'
                      : 'bg-gray-900/80 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-white truncate">{post.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          post.status === 'approved' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                          post.status === 'pending_approval' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                          'bg-gray-800 text-gray-400'
                        }`}>
                          {post.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          v{curVer?.version_number || 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Review & Publishing Gate */}
          {activePost && activeVersion && (
            <div className="lg:col-span-8 space-y-6">
              <div className="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
                  <div>
                    <h3 className="text-xl font-bold text-white">{activePost.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <Layers className="w-3.5 h-3.5 text-violet-400" />
                      <span>Version ID: <strong className="font-mono text-gray-300">{activeVersion.id}</strong></span>
                      <span>• Created: {new Date(activeVersion.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Gate State Badge */}
                  <div className="flex items-center gap-2">
                    {validApproval ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Approval Gate: UNLOCKED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 border border-amber-700 text-amber-300 text-xs font-bold">
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span>Approval Gate: LOCKED</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Platform Variation Tabs */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-800">
                    <div className="flex">
                      {activePost.destinations.map(plat => (
                        <button
                          key={plat}
                          onClick={() => setPreviewTab(plat)}
                          className={`py-2 px-4 text-xs font-semibold capitalize border-b-2 transition-colors ${
                            previewTab === plat
                              ? 'border-violet-500 text-violet-300'
                              : 'border-transparent text-gray-400 hover:text-gray-200'
                          }`}
                        >
                          {plat} Review
                        </button>
                      ))}
                    </div>

                    {/* Manual Fallback Tool */}
                    <div className="flex items-center gap-2 pb-2">
                      <button
                        onClick={() => copyContent(activeVersion.platform_variations[previewTab]?.text || activeVersion.selected_caption, 'caption')}
                        className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs flex items-center gap-1"
                      >
                        {copiedKey === 'caption' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Caption</span>
                      </button>
                      <button
                        onClick={() => copyContent((activeVersion.hashtags || []).join(' '), 'tags')}
                        className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs flex items-center gap-1"
                      >
                        {copiedKey === 'tags' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Tags</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5">
                      <img
                        src={activeVersion.image_url}
                        alt="Evidence"
                        className="w-full h-56 object-cover rounded-xl border border-gray-700"
                      />
                    </div>
                    <div className="md:col-span-7 p-4 rounded-xl bg-gray-950 border border-gray-800 text-sm text-gray-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                      {activeVersion.platform_variations[previewTab]?.text || activeVersion.selected_caption}
                    </div>
                  </div>
                </div>

                {/* Approval & Action Bar */}
                <div className="p-5 rounded-xl bg-gray-950 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-gray-400">
                    {validApproval ? (
                      <div>
                        Approved at: <span className="text-white font-mono">{new Date(validApproval.approval_timestamp).toLocaleString()}</span>
                        <div className="text-emerald-400 mt-0.5">Destinations: {validApproval.approved_destinations.join(', ')}</div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Review above content before locking approval for social networks.</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        const text = activeVersion.platform_variations[previewTab]?.text || activeVersion.selected_caption;
                        ManualPublishingProvider.copyToClipboard(text);
                        const url = previewTab === 'linkedin'
                          ? `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`
                          : previewTab === 'facebook'
                          ? `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`
                          : 'https://www.instagram.com/';
                        window.open(url, '_blank');
                        addToast('success', `Copied caption & opened ${previewTab}! You can paste and post directly.`);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-cyan-300 font-semibold text-xs border border-gray-700 transition-colors flex items-center gap-2"
                      title="Directly open social network with caption copied"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open & Post on {previewTab.toUpperCase()}</span>
                    </button>

                    {!validApproval ? (
                      <button
                        onClick={handleApprove}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-colors flex items-center gap-2"
                      >
                        <CheckSquare className="w-4 h-4" />
                        <span>Approve Exact Version</span>
                      </button>
                    ) : (
                      <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {isPublishing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Publishing via Adapters...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Publish to Approved Destinations</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
