import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Post, 
  PostVersion, 
  PostApproval, 
  ConnectedAccount, 
  PublishingAttempt, 
  ActivityLog, 
  UserProfile, 
  SocialPlatform
} from '../types';
import { runAgenticPipeline } from '../lib/ai/gemini-pipeline';
import type { UserContextInput } from '../lib/ai/gemini-pipeline';
import { providers } from '../lib/publishing';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface AppContextType {
  user: UserProfile | null;
  posts: Post[];
  connectedAccounts: ConnectedAccount[];
  publishingAttempts: PublishingAttempt[];
  activityLogs: ActivityLog[];
  toasts: Toast[];
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
  createPostFromAI: (
    imageFile: File,
    userContext: UserContextInput,
    destinations: SocialPlatform[]
  ) => Promise<Post>;
  updatePostDraft: (
    postId: string,
    newCaption: string,
    newHashtags: string[],
    newDestinations: SocialPlatform[]
  ) => void;
  requestApproval: (postId: string) => void;
  approvePost: (postId: string, destinations: SocialPlatform[]) => boolean;
  publishPost: (postId: string) => Promise<boolean>;
  toggleAccountConnection: (platform: SocialPlatform) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  deletePost: (postId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_PROFILE: UserProfile = {
  id: 'user_1',
  email: 'alex.developer@example.com',
  full_name: 'Alex Rivera',
  headline: 'Senior Full Stack & AI Engineer',
  bio: 'Building scalable web applications and intelligent agentic workflows.',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  default_language: 'en',
  default_tone: 'professional',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const INITIAL_ACCOUNTS: ConnectedAccount[] = [
  {
    id: 'acc_li',
    user_id: 'user_1',
    platform: 'linkedin',
    account_name: 'Alex Rivera (LinkedIn)',
    account_identifier: 'alex-rivera-dev',
    is_connected: true,
    token_status: 'valid',
    permissions: ['w_member_social', 'r_liteprofile']
  },
  {
    id: 'acc_ig',
    user_id: 'user_1',
    platform: 'instagram',
    account_name: '@alexrivera.tech',
    account_identifier: '17841400000000',
    is_connected: true,
    token_status: 'valid',
    permissions: ['instagram_basic', 'instagram_content_publish']
  },
  {
    id: 'acc_fb',
    user_id: 'user_1',
    platform: 'facebook',
    account_name: 'Alex Rivera Tech Page',
    account_identifier: 'page_1029384756',
    is_connected: true,
    token_status: 'valid',
    permissions: ['pages_manage_posts', 'pages_read_engagement']
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('careerspark_user');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('careerspark_posts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    
    // Sample Demo Post for instant testing
    const samplePostId = 'post_demo_1';
    const sampleVersionId = 'v1_demo_1';
    const sampleCaption = `Thrilled to announce the successful deployment of our new AI Career Assistant! 🚀\n\nBuilt with React, TypeScript, and modern AI pipelines to automate professional content creation and multi-platform publishing.\n\nKey Highlights:\n- Automated Multimodal Vision Analysis\n- Multi-Tone & Dual Language Captioning (English & Tamil)\n- 1-Click Publishing & Instant Verification\n\nGrateful to the team for the dedication and hard work. What are you building this quarter? Would love to connect in the comments!\n\n#FullStack #ArtificialIntelligence #TechInnovation #CareerGrowth #WebDevelopment`;

    return [{
      id: samplePostId,
      user_id: 'user_1',
      title: 'CareerSpark AI Platform Launch',
      status: 'approved',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      current_version_id: sampleVersionId,
      destinations: ['linkedin', 'instagram', 'facebook'] as SocialPlatform[],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      versions: [{
        id: sampleVersionId,
        post_id: samplePostId,
        version_number: 1,
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        context_input: {
          project_name: 'CareerSpark AI Launch',
          skills_demonstrated: ['React', 'TypeScript', 'AI Engineering'],
          tone: 'professional',
          language: 'en'
        },
        image_analysis: {
          visible_subjects: ['Analytics Dashboard', 'System Architecture'],
          observable_activity: 'Product Launch & Deployment',
          possible_professional_context: 'Full Stack Milestone',
          visually_supported_technical_details: ['React', 'TypeScript', 'AI Pipeline'],
          potential_post_category: 'Milestone Celebration',
          uncertainties_and_clarifications: [],
          raw_description: 'High resolution analytics and dashboard overview.'
        },
        selected_caption: sampleCaption,
        caption_options: [sampleCaption],
        hashtags: ['#FullStack', '#ArtificialIntelligence', '#TechInnovation', '#CareerGrowth', '#WebDevelopment'],
        platform_variations: {
          linkedin: { text: sampleCaption, hashtags: ['#FullStack', '#AI'] },
          instagram: { text: sampleCaption, hashtags: ['#FullStack', '#AI'] },
          facebook: { text: sampleCaption, hashtags: ['#FullStack', '#AI'] }
        },
        quality_check: {
          spelling_and_grammar_valid: true,
          relevance_to_image_score: 98,
          unsupported_factual_claims: [],
          hashtag_relevance_valid: true,
          potential_pii_detected: [],
          platform_constraints_met: { linkedin: true, instagram: true, facebook: true },
          warnings: [],
          suggestions: []
        },
        created_at: new Date().toISOString()
      }],
      approvals: [{
        id: 'appr_demo_1',
        post_id: samplePostId,
        post_version_id: sampleVersionId,
        approved_by: 'user_1',
        approved_destinations: ['linkedin', 'instagram', 'facebook'] as SocialPlatform[],
        approval_timestamp: new Date().toISOString(),
        is_valid: true
      }]
    }];
  });

  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>(() => {
    const saved = localStorage.getItem('careerspark_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_ACCOUNTS;
  });

  const [publishingAttempts, setPublishingAttempts] = useState<PublishingAttempt[]>(() => {
    const saved = localStorage.getItem('careerspark_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('careerspark_logs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'log_init',
        user_id: 'user_1',
        action_type: 'post_created',
        description: 'CareerSpark AI environment initialized with security and RLS rules.',
        created_at: new Date().toISOString()
      }
    ];
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem('careerspark_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('careerspark_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('careerspark_accounts', JSON.stringify(connectedAccounts));
  }, [connectedAccounts]);

  useEffect(() => {
    localStorage.setItem('careerspark_history', JSON.stringify(publishingAttempts));
  }, [publishingAttempts]);

  useEffect(() => {
    localStorage.setItem('careerspark_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const addToast = (type: Toast['type'], message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const logActivity = (action_type: ActivityLog['action_type'], description: string, metadata?: Record<string, unknown>) => {
    const newLog: ActivityLog = {
      id: `log_${Date.now()}`,
      user_id: user.id,
      action_type,
      description,
      metadata,
      created_at: new Date().toISOString()
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const createPostFromAI = async (
    imageFile: File,
    userContext: UserContextInput,
    destinations: SocialPlatform[]
  ): Promise<Post> => {
    const imageUrl = URL.createObjectURL(imageFile);
    const pipelineResult = await runAgenticPipeline(imageFile, userContext);
    
    const postId = `post_${Date.now()}`;
    const versionId = `v1_${Date.now()}`;

    const initialVersion: PostVersion = {
      id: versionId,
      post_id: postId,
      version_number: 1,
      image_url: imageUrl,
      context_input: {
        project_name: userContext.projectName,
        event_name: userContext.eventName,
        skills_demonstrated: userContext.skills,
        organization: userContext.organization,
        audience: userContext.audience,
        additional_notes: userContext.additionalNotes,
        tone: userContext.tone,
        language: userContext.language
      },
      image_analysis: pipelineResult.imageAnalysis,
      selected_caption: pipelineResult.selectedCaption,
      caption_options: pipelineResult.captionOptions,
      hashtags: pipelineResult.hashtags,
      platform_variations: pipelineResult.platformVariations,
      quality_check: pipelineResult.qualityCheck,
      created_at: new Date().toISOString()
    };

    const newPost: Post = {
      id: postId,
      user_id: user.id,
      title: userContext.projectName || 'New Achievement Milestone',
      status: 'draft',
      image_url: imageUrl,
      current_version_id: versionId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      versions: [initialVersion],
      approvals: [],
      destinations
    };

    setPosts(prev => [newPost, ...prev]);
    logActivity('ai_generated', `AI generated post "${newPost.title}" with 3 caption options and safety check.`);
    addToast('success', 'AI Pipeline generated captions and quality check successfully!');
    return newPost;
  };

  const updatePostDraft = (
    postId: string,
    newCaption: string,
    newHashtags: string[],
    newDestinations: SocialPlatform[]
  ) => {
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;

      const currentVer = post.versions?.find(v => v.id === post.current_version_id);
      const nextVersionNumber = (post.versions?.length || 1) + 1;
      const newVersionId = `v${nextVersionNumber}_${Date.now()}`;

      const updatedVersion: PostVersion = {
        id: newVersionId,
        post_id: postId,
        version_number: nextVersionNumber,
        image_url: currentVer?.image_url || post.image_url,
        context_input: currentVer?.context_input || {
          skills_demonstrated: [],
          tone: 'professional',
          language: 'en'
        },
        image_analysis: currentVer?.image_analysis,
        selected_caption: newCaption,
        caption_options: currentVer?.caption_options || [newCaption],
        hashtags: newHashtags,
        platform_variations: {
          linkedin: { text: newCaption, hashtags: newHashtags },
          instagram: { text: newCaption, hashtags: newHashtags },
          facebook: { text: newCaption, hashtags: newHashtags }
        },
        quality_check: currentVer?.quality_check,
        created_at: new Date().toISOString()
      };

      const invalidatedApprovals = (post.approvals || []).map(app => ({
        ...app,
        is_valid: false,
        invalidation_reason: 'Content or destinations modified by user after approval.'
      }));

      return {
        ...post,
        status: 'draft',
        current_version_id: newVersionId,
        destinations: newDestinations,
        updated_at: new Date().toISOString(),
        versions: [...(post.versions || []), updatedVersion],
        approvals: invalidatedApprovals
      };
    }));

    logActivity('approval_invalidated', `Post draft updated; previous approvals automatically invalidated for security.`);
    addToast('info', 'Draft updated and new immutable version recorded.');
  };

  const requestApproval = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, status: 'pending_approval', updated_at: new Date().toISOString() };
      }
      return p;
    }));
    logActivity('version_created', `Post ${postId} submitted for approval verification.`);
    addToast('info', 'Post submitted to Approval Centre.');
  };

  const approvePost = (postId: string, destinations: SocialPlatform[]): boolean => {
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost || !targetPost.current_version_id) {
      addToast('error', 'Cannot approve: Missing valid post version.');
      return false;
    }

    const newApproval: PostApproval = {
      id: `appr_${Date.now()}`,
      post_id: postId,
      post_version_id: targetPost.current_version_id,
      approved_by: user.id,
      approved_destinations: destinations,
      approval_timestamp: new Date().toISOString(),
      is_valid: true
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          status: 'approved',
          destinations,
          updated_at: new Date().toISOString(),
          approvals: [...(p.approvals || []), newApproval]
        };
      }
      return p;
    }));

    logActivity('post_approved', `Version ${targetPost.current_version_id} approved for destinations: ${destinations.join(', ')}.`);
    addToast('success', 'Post version successfully approved and locked for publishing!');
    return true;
  };

  const publishPost = async (postId: string): Promise<boolean> => {
    const post = posts.find(p => p.id === postId);
    if (!post) {
      addToast('error', 'Post not found.');
      return false;
    }

    const validApproval = post.approvals?.find(
      a => a.post_version_id === post.current_version_id && a.is_valid
    );

    if (!validApproval) {
      addToast('error', 'Security Gate Violation: Post cannot be published without valid version approval.');
      return false;
    }

    const version = post.versions?.find(v => v.id === post.current_version_id);
    if (!version) {
      addToast('error', 'Approved content version snapshot missing.');
      return false;
    }

    let allSucceeded = true;

    for (const platform of post.destinations) {
      const account = connectedAccounts.find(a => a.platform === platform);
      const provider = providers[platform];
      const idempotencyKey = `idemp_${postId}_${version.id}_${platform}_${Date.now()}`;

      const attemptId = `att_${Date.now()}_${platform}`;
      const newAttempt: PublishingAttempt = {
        id: attemptId,
        post_id: postId,
        post_version_id: version.id,
        destination: platform,
        idempotency_key: idempotencyKey,
        status: 'in_progress',
        payload_snapshot: {
          text: version.platform_variations[platform].text,
          imageUrl: version.image_url
        },
        attempt_count: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setPublishingAttempts(prev => [newAttempt, ...prev]);

      const token = account?.is_connected ? 'mock_valid_token_xyz' : undefined;
      const res = await provider.publish(version, token, idempotencyKey);

      if (res.success) {
        setPublishingAttempts(prev => prev.map(a => 
          a.id === attemptId 
            ? { ...a, status: 'success', provider_post_id: res.providerPostId, updated_at: new Date().toISOString() } 
            : a
        ));
        logActivity('publish_succeeded', `Successfully published to ${platform} (Post ID: ${res.providerPostId}).`);
      } else {
        allSucceeded = false;
        setPublishingAttempts(prev => prev.map(a => 
          a.id === attemptId 
            ? { ...a, status: res.status, error_message: res.error, updated_at: new Date().toISOString() } 
            : a
        ));
        logActivity('publish_failed', `Failed publishing to ${platform}: ${res.error}`);
      }
    }

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          status: allSucceeded ? 'published' : 'failed',
          updated_at: new Date().toISOString()
        };
      }
      return p;
    }));

    if (allSucceeded) {
      addToast('success', 'All approved destinations published successfully!');
    } else {
      addToast('warning', 'Some destinations required setup or failed. Review Publishing History.');
    }

    return allSucceeded;
  };

  const toggleAccountConnection = (platform: SocialPlatform) => {
    setConnectedAccounts(prev => prev.map(acc => {
      if (acc.platform === platform) {
        const nextState = !acc.is_connected;
        const updated = {
          ...acc,
          is_connected: nextState,
          token_status: (nextState ? 'valid' : 'requires_setup') as ConnectedAccount['token_status'],
          connected_at: nextState ? new Date().toISOString() : undefined
        };
        logActivity(
          nextState ? 'account_connected' : 'account_disconnected',
          `${acc.account_name} ${nextState ? 'connected' : 'disconnected'}.`
        );
        addToast(nextState ? 'success' : 'info', `${acc.account_name} ${nextState ? 'connected' : 'disconnected'}.`);
        return updated;
      }
      return acc;
    }));
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUser(prev => ({
      ...prev,
      ...updated,
      updated_at: new Date().toISOString()
    }));
    addToast('success', 'User profile updated.');
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    addToast('info', 'Post deleted.');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        posts,
        connectedAccounts,
        publishingAttempts,
        activityLogs,
        toasts,
        addToast,
        removeToast,
        createPostFromAI,
        updatePostDraft,
        requestApproval,
        approvePost,
        publishPost,
        toggleAccountConnection,
        updateUserProfile,
        deletePost
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
