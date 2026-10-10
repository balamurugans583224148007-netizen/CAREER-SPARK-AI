import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  CheckSquare, 
  Send, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { posts, publishingAttempts, activityLogs, user } = useApp();

  const totalPosts = posts.length;
  const draftPosts = posts.filter(p => p.status === 'draft').length;
  const pendingApprovals = posts.filter(p => p.status === 'pending_approval').length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const failedAttempts = publishingAttempts.filter(a => a.status === 'failed').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-900/40 via-indigo-900/20 to-gray-900 border border-violet-800/40 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>CareerSpark AI v1.0 • Ready</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Turn Every Achievement Into Opportunity.
            </h1>
            <p className="mt-2 text-gray-300 max-w-2xl text-base leading-relaxed">
              Welcome back, <span className="font-semibold text-white">{user?.full_name || 'Innovator'}</span>! Transform your daily milestones and visual achievements into high-impact social presence with verified agentic pipelines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/create"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create New Post</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Real Database Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Posts"
          value={totalPosts}
          icon={<FileText className="w-5 h-5 text-indigo-400" />}
          description="In database storage"
          color="border-indigo-800/40 hover:border-indigo-700/60"
        />
        <StatCard
          title="Drafts"
          value={draftPosts}
          icon={<Clock className="w-5 h-5 text-amber-400" />}
          description="Work in progress"
          color="border-amber-800/40 hover:border-amber-700/60"
        />
        <StatCard
          title="Pending Approval"
          value={pendingApprovals}
          icon={<CheckSquare className="w-5 h-5 text-purple-400" />}
          description="Server gate awaiting"
          color="border-purple-800/40 hover:border-purple-700/60"
          highlight={pendingApprovals > 0}
        />
        <StatCard
          title="Published Posts"
          value={publishedPosts}
          icon={<Send className="w-5 h-5 text-emerald-400" />}
          description="Live on networks"
          color="border-emerald-800/40 hover:border-emerald-700/60"
        />
        <StatCard
          title="Failed Attempts"
          value={failedAttempts}
          icon={<AlertCircle className="w-5 h-5 text-rose-400" />}
          description="Requires inspection"
          color="border-rose-800/40 hover:border-rose-700/60"
        />
      </div>

      {/* Main Grid: Recent Posts + Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Posts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-400" />
              <span>Recent Posts</span>
            </h2>
            <Link to="/posts" className="text-sm font-medium text-violet-400 hover:text-violet-300 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-gray-900/60 border border-gray-800 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-800/80 flex items-center justify-center text-gray-500">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">No Posts Created Yet</h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">
                  Upload an image of a certificate, code sprint, or milestone to let the 5-Agent pipeline create your post.
                </p>
              </div>
              <Link
                to="/create"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Your First Post</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.slice(0, 4).map(post => {
                const curVer = post.versions?.find(v => v.id === post.current_version_id);
                return (
                  <div
                    key={post.id}
                    className="p-5 rounded-xl bg-gray-900/80 border border-gray-800/80 hover:border-gray-700 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-base font-semibold text-white truncate">{post.title}</h4>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {curVer?.selected_caption || 'No caption text'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                            post.status === 'published' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' :
                            post.status === 'pending_approval' ? 'bg-purple-950/80 text-purple-300 border border-purple-800' :
                            post.status === 'approved' ? 'bg-blue-950/80 text-blue-300 border border-blue-800' :
                            post.status === 'failed' ? 'bg-rose-950/80 text-rose-300 border border-rose-800' :
                            'bg-gray-800 text-gray-300 border border-gray-700'
                          }`}>
                            {post.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            v{curVer?.version_number || 1} • {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/posts"
                      className="shrink-0 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors text-xs font-medium"
                    >
                      Manage
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Real Security & Activity Audit Log */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Audit & Activity Stream</span>
          </h2>

          <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-4">
            <div className="space-y-3">
              {activityLogs.slice(0, 6).map(log => (
                <div key={log.id} className="text-xs space-y-1 pb-3 border-b border-gray-800/60 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="font-semibold text-violet-300 uppercase tracking-wider text-[10px]">
                      {log.action_type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px]">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-200">{log.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  color: string;
  highlight?: boolean;
}> = ({ title, value, icon, description, color, highlight }) => (
  <div className={`p-5 rounded-2xl bg-gray-900/70 border ${color} transition-all duration-300 ${highlight ? 'ring-1 ring-purple-500' : ''}`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</span>
      <div className="p-2 rounded-xl bg-gray-800/80">{icon}</div>
    </div>
    <div className="text-3xl font-extrabold text-white tracking-tight">{value}</div>
    <div className="text-xs text-gray-500 mt-1">{description}</div>
  </div>
);
