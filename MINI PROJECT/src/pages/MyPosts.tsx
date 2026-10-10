import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Layers, 
  Filter,
  AlertCircle,
  X
} from 'lucide-react';
import type { Post, SocialPlatform } from '../types';
import { LinkedinIcon, InstagramIcon, FacebookIcon } from '../components/SocialIcons';

export const MyPosts: React.FC = () => {
  const { posts, deletePost, updatePostDraft, requestApproval } = useApp();
  const [filter, setFilter] = useState<string>('all');
  
  // Edit modal state
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editHashtags, setEditHashtags] = useState<string[]>([]);
  const [editDestinations, setEditDestinations] = useState<SocialPlatform[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  const openEditModal = (post: Post) => {
    const curVer = post.versions?.find(v => v.id === post.current_version_id);
    setEditingPost(post);
    setEditCaption(curVer?.selected_caption || '');
    setEditHashtags(curVer?.hashtags || []);
    setEditDestinations(post.destinations || ['linkedin']);
  };

  const handleSaveEdit = () => {
    if (!editingPost) return;
    updatePostDraft(editingPost.id, editCaption, editHashtags, editDestinations);
    setEditingPost(null);
  };

  const addHashtag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      e.preventDefault();
      const tag = hashtagInput.startsWith('#') ? hashtagInput.trim() : `#${hashtagInput.trim()}`;
      if (!editHashtags.includes(tag)) {
        setEditHashtags(prev => [...prev, tag]);
      }
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    setEditHashtags(prev => prev.filter(t => t !== tag));
  };

  const toggleEditDestination = (platform: SocialPlatform) => {
    setEditDestinations(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Posts</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your immutable post versions, track publishing status, and request server approvals.
          </p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 transition-colors"
        >
          <span>+ Create New</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-gray-800">
        <Filter className="w-4 h-4 text-gray-500 mr-2" />
        {(['all', 'draft', 'pending_approval', 'approved', 'published', 'failed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
              filter === tab
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-gray-900/40 border border-gray-800 text-gray-500 space-y-3">
          <FileText className="w-12 h-12 mx-auto text-gray-600" />
          <h3 className="text-base font-semibold text-gray-300">No Posts Found</h3>
          <p className="text-xs text-gray-500">There are no posts matching the current filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => {
            const curVer = post.versions?.find(v => v.id === post.current_version_id);
            const totalVersions = post.versions?.length || 1;

            return (
              <div
                key={post.id}
                className="flex flex-col justify-between rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-gray-700/80 transition-all overflow-hidden shadow-lg"
              >
                <div>
                  {/* Thumbnail & Badges */}
                  <div className="relative h-48 bg-gray-950 overflow-hidden">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md backdrop-blur-md ${
                        post.status === 'published' ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700' :
                        post.status === 'pending_approval' ? 'bg-purple-950/90 text-purple-300 border border-purple-700' :
                        post.status === 'approved' ? 'bg-blue-950/90 text-blue-300 border border-blue-700' :
                        post.status === 'failed' ? 'bg-rose-950/90 text-rose-300 border border-rose-700' :
                        'bg-gray-900/90 text-gray-300 border border-gray-700'
                      }`}>
                        {post.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 bg-gray-900/90 border border-gray-700 px-2 py-1 rounded text-[11px] text-gray-300 font-mono flex items-center gap-1">
                      <Layers className="w-3 h-3 text-violet-400" />
                      <span>v{curVer?.version_number || 1} ({totalVersions} total)</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-base text-white truncate">{post.title}</h3>
                    <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                      {curVer?.selected_caption || 'No caption available'}
                    </p>

                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(curVer?.hashtags || []).slice(0, 4).map(tag => (
                        <span key={tag} className="text-[10px] text-violet-400 font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Destination Platform Icons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-800/80">
                      <span className="text-[11px] text-gray-400">Target:</span>
                      {post.destinations.includes('linkedin') && (
                        <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                      )}
                      {post.destinations.includes('instagram') && (
                        <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                      )}
                      {post.destinations.includes('facebook') && (
                        <FacebookIcon className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-gray-950/60 border-t border-gray-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(post)}
                      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                      title="Edit Draft & Create New Version"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-2 rounded-lg bg-gray-800 hover:bg-rose-900/60 text-gray-400 hover:text-rose-300 transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {post.status === 'draft' && (
                    <button
                      onClick={() => requestApproval(post.id)}
                      className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition-colors"
                    >
                      Request Approval
                    </button>
                  )}

                  {(post.status === 'pending_approval' || post.status === 'approved') && (
                    <Link
                      to="/approvals"
                      className="px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-500 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Review Gate</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Version Drawer / Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-violet-400" />
                <span>Edit Post & Create Version</span>
              </h3>
              <button
                onClick={() => setEditingPost(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                <strong>Approval Invalidation Notice:</strong> Modifying content or destinations creates an immutable new version and invalidates all prior approvals.
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Caption Content</label>
                <textarea
                  rows={5}
                  value={editCaption}
                  onChange={e => setEditCaption(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Hashtags (Press Enter)</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {editHashtags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-violet-950 border border-violet-800 text-violet-300 text-xs">
                      {t}
                      <button onClick={() => removeHashtag(t)} className="hover:text-white">×</button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add hashtag..."
                  value={hashtagInput}
                  onChange={e => setHashtagInput(e.target.value)}
                  onKeyDown={addHashtag}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Destinations</label>
                <div className="flex gap-2">
                  {(['linkedin', 'instagram', 'facebook'] as SocialPlatform[]).map(plat => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => toggleEditDestination(plat)}
                      className={`flex-1 py-1.5 px-2 rounded-lg border text-xs capitalize transition-colors ${
                        editDestinations.includes(plat)
                          ? 'bg-violet-600/30 border-violet-500 text-violet-200'
                          : 'bg-gray-950 border-gray-800 text-gray-500'
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30"
              >
                Save New Version & Invalidate Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
