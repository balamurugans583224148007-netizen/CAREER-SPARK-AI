import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Send, 
  Heart, 
  Bookmark, 
  MoreHorizontal, 
  CheckCircle2, 
  PlusSquare,
  Sparkles,
  Award,
  Briefcase,
  Users,
  Grid,
  BookmarkCheck,
  Search,
  Compass,
  Tv
} from 'lucide-react';
import { LinkedinIcon, InstagramIcon, FacebookIcon } from '../components/SocialIcons';
import type { SocialPlatform } from '../types';

export const LiveSocialFeeds: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPlatform = (searchParams.get('platform') as SocialPlatform) || 'linkedin';
  const [activePlatform, setActivePlatform] = useState<SocialPlatform>(initialPlatform);
  
  const { posts, user } = useApp();

  // Social interactions state
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, Array<{ author: string; text: string; time: string }>>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeIgTab, setActiveIgTab] = useState<'posts' | 'saved' | 'tagged'>('posts');

  const handlePlatformChange = (p: SocialPlatform) => {
    setActivePlatform(p);
    setSearchParams({ platform: p });
  };

  const toggleLike = (postId: string, defaultLikes: number = 42) => {
    const isLiked = userLiked[postId];
    const currentCount = likes[postId] ?? defaultLikes;

    setUserLiked(prev => ({ ...prev, [postId]: !isLiked }));
    setLikes(prev => ({ ...prev, [postId]: isLiked ? currentCount - 1 : currentCount + 1 }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment = {
      author: user?.full_name || 'Alex Rivera',
      text,
      time: 'Just now'
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Filter posts (show all created posts or sample post)
  const displayPosts = posts.length > 0 ? posts : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header & Platform Switcher Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border border-violet-500/40 text-violet-300 text-xs font-bold mb-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Interactive In-App Social Network Simulator</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Live Social Media Accounts</h1>
          <p className="text-gray-400 text-sm mt-1">
            CareerSpark AI மூலம் நீங்கள் publish செய்த பதிவுகள் கீழே உள்ள Dummy LinkedIn, Instagram மற்றும் Facebook Profiles-ல் நேரடியாக தோன்றும்!
          </p>
        </div>

        <Link
          to="/create"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all self-start md:self-auto"
        >
          <PlusSquare className="w-4 h-4" />
          <span>+ Create & Post Another</span>
        </Link>
      </div>

      {/* 3 Large Platform Switcher Buttons */}
      <div className="grid grid-cols-3 gap-3 p-1.5 rounded-2xl bg-gray-950 border border-gray-800">
        {/* LinkedIn Tab */}
        <button
          onClick={() => handlePlatformChange('linkedin')}
          className={`py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2.5 transition-all ${
            activePlatform === 'linkedin'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-102'
              : 'text-gray-400 hover:text-blue-300 hover:bg-gray-900/60'
          }`}
        >
          <LinkedinIcon className="w-4 h-4" />
          <span>LinkedIn Feed & Profile</span>
        </button>

        {/* Instagram Tab */}
        <button
          onClick={() => handlePlatformChange('instagram')}
          className={`py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2.5 transition-all ${
            activePlatform === 'instagram'
              ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white shadow-lg shadow-pink-600/30 scale-102'
              : 'text-gray-400 hover:text-pink-300 hover:bg-gray-900/60'
          }`}
        >
          <InstagramIcon className="w-4 h-4" />
          <span>Instagram Feed & Grid</span>
        </button>

        {/* Facebook Tab */}
        <button
          onClick={() => handlePlatformChange('facebook')}
          className={`py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2.5 transition-all ${
            activePlatform === 'facebook'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-102'
              : 'text-gray-400 hover:text-indigo-300 hover:bg-gray-900/60'
          }`}
        >
          <FacebookIcon className="w-4 h-4" />
          <span>Facebook Timeline</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 💼 1. MOCK LINKEDIN FEED & PROFILE UI                     */}
      {/* ======================================================== */}
      {activePlatform === 'linkedin' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Simulated LinkedIn Navbar */}
          <div className="p-3.5 px-6 rounded-2xl bg-[#1b1f23] border border-gray-800 flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#0a66c2] flex items-center justify-center text-white font-black text-sm">
                in
              </div>
              <div className="hidden sm:flex items-center space-x-2 bg-[#282d33] px-3 py-1.5 rounded-lg text-xs text-gray-300 border border-gray-700/60 w-64">
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <span>Search jobs, posts, people...</span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-[11px] text-gray-300">
              <span className="text-white font-bold flex flex-col items-center cursor-pointer border-b-2 border-white pb-0.5">
                <span>🏠 Home</span>
              </span>
              <span className="flex flex-col items-center cursor-pointer hover:text-white">
                <span>👥 My Network</span>
              </span>
              <span className="flex flex-col items-center cursor-pointer hover:text-white">
                <span>💼 Jobs</span>
              </span>
              <span className="flex flex-col items-center cursor-pointer hover:text-white">
                <span>💬 Messaging</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: User Profile Card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl bg-[#1b1f23] border border-gray-800 overflow-hidden shadow-xl">
                {/* Banner */}
                <div className="h-20 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 relative">
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-[10px] text-blue-300 font-bold">
                    Dummy Profile
                  </div>
                </div>

                {/* Avatar & Info */}
                <div className="px-5 pb-5 pt-0 -mt-10 space-y-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt="Alex Rivera"
                    className="w-20 h-20 rounded-full border-4 border-[#1b1f23] object-cover shadow-md"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <span>Alex Rivera</span>
                      <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                    </h3>
                    <p className="text-xs text-gray-300 mt-0.5 leading-snug">
                      Senior Full Stack & AI Engineer | Building Scalable Intelligent Systems 🚀
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">San Francisco Bay Area • 500+ Connections</p>
                  </div>

                  <div className="pt-3 border-t border-gray-800 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-400">
                      <span>Profile viewers</span>
                      <span className="text-blue-400 font-bold">2,492</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Post impressions</span>
                      <span className="text-blue-400 font-bold">18,940</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Certificate Badges Box */}
              <div className="rounded-2xl bg-[#1b1f23] border border-gray-800 p-4 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Verified Credentials & Licenses</span>
                </h4>
                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-900/60 border border-gray-800">
                    <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                    <span>AI Engineering & Cloud Architecture</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-900/60 border border-gray-800">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Full-Stack Milestone Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: LinkedIn Live Posts Feed */}
            <div className="lg:col-span-8 space-y-5">
              {displayPosts.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#1b1f23] border border-gray-800 text-gray-400 space-y-3">
                  <LinkedinIcon className="w-12 h-12 mx-auto text-blue-400" />
                  <p className="text-sm font-semibold text-white">No LinkedIn posts published yet.</p>
                  <Link to="/create" className="text-xs text-blue-400 hover:underline">
                    Click here to create & post your certificate!
                  </Link>
                </div>
              ) : (
                displayPosts.map(post => {
                  const currentVer = post.versions?.find(v => v.id === post.current_version_id) || post.versions?.[0];
                  const captionText = currentVer?.platform_variations?.linkedin?.text || currentVer?.selected_caption;
                  const defaultLikeCount = 248;
                  const currentLikes = likes[post.id] ?? defaultLikeCount;
                  const isPostLiked = userLiked[post.id] ?? false;
                  const postComments = comments[post.id] || [
                    { author: 'Sarah Jenkins (Tech Lead @ Stripe)', text: 'Massive milestone! The architecture and deliverables look top-tier! 🚀🔥', time: '2h ago' },
                    { author: 'David Chen (Founder)', text: 'Incredible execution! Congratulations Alex!', time: '1h ago' }
                  ];

                  return (
                    <div key={post.id} className="rounded-2xl bg-[#1b1f23] border border-gray-800 shadow-xl overflow-hidden space-y-3">
                      {/* Post Header */}
                      <div className="p-4 pb-0 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                            alt="Alex Rivera"
                            className="w-12 h-12 rounded-full border border-gray-700 object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-white">Alex Rivera</h4>
                              <span className="text-xs text-gray-400 font-normal">• 1st</span>
                            </div>
                            <p className="text-[11px] text-gray-400 leading-none mt-0.5">Senior Full Stack & AI Engineer</p>
                            <p className="text-[10px] text-gray-500 mt-1">Just now • 🌐 Public</p>
                          </div>
                        </div>

                        <button className="p-1 rounded-lg text-gray-400 hover:text-white">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Post Caption Text */}
                      <div className="px-4 text-xs text-gray-200 whitespace-pre-wrap leading-relaxed font-sans">
                        {captionText}
                      </div>

                      {/* Uploaded Certificate / Visual Proof Attached */}
                      {(post.image_url || currentVer?.image_url) && (
                        <div className="border-y border-gray-800/80 bg-black/40">
                          <img
                            src={currentVer?.image_url || post.image_url}
                            alt="Attached Certificate"
                            className="w-full max-h-96 object-contain bg-black/60"
                          />
                        </div>
                      )}

                      {/* Reaction Counters */}
                      <div className="px-4 py-1 flex items-center justify-between text-[11px] text-gray-400 border-b border-gray-800/80">
                        <div className="flex items-center gap-1.5">
                          <span className="flex -space-x-1 items-center">
                            <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white">👍</span>
                            <span className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[8px] text-white">👏</span>
                            <span className="w-4 h-4 rounded-full bg-rose-600 flex items-center justify-center text-[8px] text-white">❤️</span>
                          </span>
                          <span>{currentLikes} reactions</span>
                        </div>
                        <div className="flex gap-3">
                          <span>{postComments.length} comments</span>
                          <span>18 reposts</span>
                        </div>
                      </div>

                      {/* Interactive LinkedIn Action Buttons */}
                      <div className="px-3 pb-2 flex items-center justify-between text-xs">
                        <button
                          onClick={() => toggleLike(post.id, defaultLikeCount)}
                          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-colors ${
                            isPostLiked ? 'text-blue-400 bg-blue-950/40' : 'text-gray-400 hover:bg-gray-800/80 hover:text-white'
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${isPostLiked ? 'fill-blue-400' : ''}`} />
                          <span>Like</span>
                        </button>
                        <button
                          onClick={() => document.getElementById(`comment-input-${post.id}`)?.focus()}
                          className="flex-1 py-2 rounded-xl text-gray-400 hover:bg-gray-800/80 hover:text-white flex items-center justify-center gap-1.5 font-bold transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Comment</span>
                        </button>
                        <button
                          onClick={() => toggleLike(post.id, defaultLikeCount)}
                          className="flex-1 py-2 rounded-xl text-gray-400 hover:bg-gray-800/80 hover:text-white flex items-center justify-center gap-1.5 font-bold transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>Repost</span>
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(captionText || '');
                            alert('Post link & text copied!');
                          }}
                          className="flex-1 py-2 rounded-xl text-gray-400 hover:bg-gray-800/80 hover:text-white flex items-center justify-center gap-1.5 font-bold transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          <span>Send</span>
                        </button>
                      </div>

                      {/* Comments Section */}
                      <div className="px-4 pb-4 pt-2 border-t border-gray-800/80 space-y-3 bg-[#161a1d]">
                        {/* New Comment Input */}
                        <div className="flex items-center space-x-2">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                            alt="Alex Rivera"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div className="flex-1 flex items-center bg-[#24292f] border border-gray-700/60 rounded-full px-3 py-1">
                            <input
                              id={`comment-input-${post.id}`}
                              type="text"
                              placeholder="Add a congratulatory comment..."
                              value={commentInputs[post.id] || ''}
                              onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                              className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              className="text-blue-400 hover:text-blue-300 font-bold text-xs pl-2"
                            >
                              Post
                            </button>
                          </div>
                        </div>

                        {/* Existing Comments list */}
                        <div className="space-y-2">
                          {postComments.map((c, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-[#1e2327] border border-gray-800/80 text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-[11px]">{c.author}</span>
                                <span className="text-[10px] text-gray-500">{c.time}</span>
                              </div>
                              <p className="text-gray-300 text-xs leading-relaxed">{c.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 📸 2. MOCK INSTAGRAM FEED & PROFILE UI                    */}
      {/* ======================================================== */}
      {activePlatform === 'instagram' && (
        <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
          {/* Simulated Instagram Navbar */}
          <div className="p-3.5 px-6 rounded-2xl bg-gray-950 border border-gray-800 flex items-center justify-between shadow-lg">
            <h3 className="text-lg font-serif font-bold italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500">
              Instagram
            </h3>
            <div className="flex items-center space-x-5 text-gray-300 text-xs">
              <span className="font-bold cursor-pointer text-white">🏠 Feed</span>
              <span className="cursor-pointer hover:text-white"><Search className="w-4 h-4" /></span>
              <span className="cursor-pointer hover:text-white"><Compass className="w-4 h-4" /></span>
              <span className="cursor-pointer hover:text-white"><Tv className="w-4 h-4" /></span>
              <span className="cursor-pointer hover:text-white"><Heart className="w-4 h-4" /></span>
            </div>
          </div>

          {/* Instagram Profile Header */}
          <div className="p-6 rounded-3xl bg-gray-950 border border-gray-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              {/* Profile Avatar with Story Ring */}
              <div className="p-1 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 self-start sm:self-auto shrink-0 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                  alt="Alex Rivera"
                  className="w-24 h-24 rounded-full border-2 border-black object-cover"
                />
              </div>

              {/* Profile Bio & Counters */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-white">alexrivera.tech</h2>
                  <span className="px-2 py-0.5 rounded-full bg-pink-950/80 border border-pink-700 text-pink-300 text-[10px] font-bold">
                    ✓ Verified Creator
                  </span>
                </div>

                <div className="flex items-center space-x-6 text-xs text-gray-300">
                  <span><strong className="text-white font-bold">{displayPosts.length}</strong> posts</span>
                  <span><strong className="text-white font-bold">48.2k</strong> followers</span>
                  <span><strong className="text-white font-bold">312</strong> following</span>
                </div>

                <div className="text-xs text-gray-300 leading-relaxed">
                  <div className="font-bold text-white">Alex Rivera • AI Engineer</div>
                  <p>Building next-gen AI & Full-Stack Apps 💻✨</p>
                  <p className="text-pink-400 font-semibold">🔗 github.com/alexrivera</p>
                </div>
              </div>
            </div>

            {/* Grid vs Feed Tab switch */}
            <div className="flex items-center justify-center border-t border-gray-800 pt-3 gap-8 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setActiveIgTab('posts')}
                className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                  activeIgTab === 'posts' ? 'border-pink-500 text-pink-400' : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Posts</span>
              </button>
              <button
                onClick={() => setActiveIgTab('saved')}
                className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                  activeIgTab === 'saved' ? 'border-pink-500 text-pink-400' : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Saved</span>
              </button>
            </div>
          </div>

          {/* Instagram Post Feed List */}
          <div className="space-y-6 max-w-xl mx-auto">
            {displayPosts.map(post => {
              const currentVer = post.versions?.find(v => v.id === post.current_version_id) || post.versions?.[0];
              const captionText = currentVer?.platform_variations?.instagram?.text || currentVer?.selected_caption;
              const defaultLikeCount = 1420;
              const currentLikes = likes[post.id] ?? defaultLikeCount;
              const isPostLiked = userLiked[post.id] ?? false;

              return (
                <div key={post.id} className="rounded-3xl bg-gray-950 border border-gray-800 shadow-2xl overflow-hidden space-y-3">
                  {/* IG Post Header */}
                  <div className="p-3.5 px-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                          alt="Alex Rivera"
                          className="w-8 h-8 rounded-full border border-black object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">alexrivera.tech</h4>
                        <p className="text-[10px] text-gray-400">San Francisco, California</p>
                      </div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* IG Media Photo */}
                  <div className="bg-black/90 relative">
                    <img
                      src={currentVer?.image_url || post.image_url}
                      alt="Instagram Post"
                      className="w-full max-h-[480px] object-cover"
                    />
                  </div>

                  {/* IG Actions Bar */}
                  <div className="px-4 space-y-2 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button onClick={() => toggleLike(post.id, defaultLikeCount)}>
                          <Heart className={`w-5 h-5 transition-transform active:scale-125 ${isPostLiked ? 'text-rose-500 fill-rose-500' : 'text-gray-300 hover:text-white'}`} />
                        </button>
                        <button onClick={() => document.getElementById(`ig-comment-${post.id}`)?.focus()}>
                          <MessageCircle className="w-5 h-5 text-gray-300 hover:text-white" />
                        </button>
                        <Send className="w-5 h-5 text-gray-300 hover:text-white" />
                      </div>
                      <Bookmark className="w-5 h-5 text-gray-300 hover:text-white" />
                    </div>

                    <p className="text-xs font-bold text-white">{currentLikes.toLocaleString()} likes</p>

                    {/* IG Caption */}
                    <div className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                      <strong className="text-white font-bold mr-1.5">alexrivera.tech</strong>
                      {captionText}
                    </div>

                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Just now</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 👥 3. MOCK FACEBOOK TIMELINE UI                           */}
      {/* ======================================================== */}
      {activePlatform === 'facebook' && (
        <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
          {/* Simulated Facebook Header */}
          <div className="p-3.5 px-6 rounded-2xl bg-[#242526] border border-gray-800 flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-black text-lg">
                f
              </div>
              <span className="text-sm font-bold text-white">Alex Rivera Tech Community</span>
            </div>
            <div className="text-xs text-gray-300 font-semibold">
              <span>👥 Public Page</span>
            </div>
          </div>

          {/* Facebook Cover & Profile Header */}
          <div className="rounded-3xl bg-[#242526] border border-gray-800 overflow-hidden shadow-xl">
            <div className="h-44 bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 relative">
              <div className="absolute bottom-3 right-4 px-3 py-1 rounded-xl bg-black/60 text-white text-xs font-semibold">
                Cover Photo Verified
              </div>
            </div>

            <div className="p-6 pt-0 -mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                  alt="Alex Rivera"
                  className="w-24 h-24 rounded-full border-4 border-[#242526] object-cover shadow-lg"
                />
                <div className="pb-1">
                  <h2 className="text-xl font-bold text-white flex items-center gap-1.5">
                    <span>Alex Rivera</span>
                    <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                  </h2>
                  <p className="text-xs text-gray-400">4.8K followers • 1.2K following</p>
                </div>
              </div>
            </div>
          </div>

          {/* Facebook Post Feed List */}
          <div className="space-y-6">
            {displayPosts.map(post => {
              const currentVer = post.versions?.find(v => v.id === post.current_version_id) || post.versions?.[0];
              const captionText = currentVer?.platform_variations?.facebook?.text || currentVer?.selected_caption;
              const defaultLikeCount = 380;
              const currentLikes = likes[post.id] ?? defaultLikeCount;
              const isPostLiked = userLiked[post.id] ?? false;

              return (
                <div key={post.id} className="rounded-3xl bg-[#242526] border border-gray-800 shadow-xl space-y-3.5 overflow-hidden">
                  <div className="p-4 pb-0 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                        alt="Alex Rivera"
                        className="w-10 h-10 rounded-full border border-gray-700 object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">Alex Rivera</h4>
                        <p className="text-[10px] text-gray-400">Just now • 👥 Public</p>
                      </div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="px-4 text-xs text-gray-200 whitespace-pre-wrap leading-relaxed font-sans">
                    {captionText}
                  </div>

                  {(post.image_url || currentVer?.image_url) && (
                    <div className="border-y border-gray-800/80 bg-black/50">
                      <img
                        src={currentVer?.image_url || post.image_url}
                        alt="FB Media"
                        className="w-full max-h-96 object-contain"
                      />
                    </div>
                  )}

                  <div className="px-4 py-1 flex items-center justify-between text-[11px] text-gray-400 border-b border-gray-700/60">
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-[#1877f2] flex items-center justify-center text-[9px] text-white">👍</span>
                      <span>{currentLikes}</span>
                    </div>
                    <span>42 comments • 12 shares</span>
                  </div>

                  <div className="px-4 pb-3 flex items-center justify-between text-xs">
                    <button
                      onClick={() => toggleLike(post.id, defaultLikeCount)}
                      className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-colors ${
                        isPostLiked ? 'text-[#1877f2] bg-blue-950/30' : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${isPostLiked ? 'fill-[#1877f2]' : ''}`} />
                      <span>Like</span>
                    </button>
                    <button className="flex-1 py-2 rounded-xl text-gray-300 hover:bg-gray-800 flex items-center justify-center gap-1.5 font-bold transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>Comment</span>
                    </button>
                    <button className="flex-1 py-2 rounded-xl text-gray-300 hover:bg-gray-800 flex items-center justify-center gap-1.5 font-bold transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
