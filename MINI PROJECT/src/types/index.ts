export type PostStatus = 'draft' | 'pending_approval' | 'approved' | 'published' | 'failed';

export type SocialPlatform = 'linkedin' | 'instagram' | 'facebook';

export type Language = 'en' | 'ta'; // English, Tamil
export type Tone = 'professional' | 'friendly' | 'concise';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  headline?: string;
  bio?: string;
  avatar_url?: string;
  default_language: Language;
  default_tone: Tone;
  created_at: string;
  updated_at: string;
}

export interface ImageAnalysisResult {
  visible_subjects: string[];
  observable_activity: string;
  possible_professional_context: string;
  visually_supported_technical_details: string[];
  potential_post_category: string;
  uncertainties_and_clarifications: string[];
  raw_description: string;
}

export interface QualityCheckResult {
  spelling_and_grammar_valid: boolean;
  relevance_to_image_score: number; // 0-100
  unsupported_factual_claims: string[];
  hashtag_relevance_valid: boolean;
  potential_pii_detected: string[];
  platform_constraints_met: {
    linkedin: boolean;
    instagram: boolean;
    facebook: boolean;
  };
  warnings: string[];
  suggestions: string[];
}

export interface PlatformVariations {
  linkedin: {
    text: string;
    hashtags: string[];
    headline?: string;
  };
  instagram: {
    text: string;
    hashtags: string[];
  };
  facebook: {
    text: string;
    hashtags: string[];
  };
}

export interface PostVersion {
  id: string;
  post_id: string;
  version_number: number;
  image_url: string;
  context_input: {
    project_name?: string;
    event_name?: string;
    skills_demonstrated: string[];
    organization?: string;
    audience?: string;
    additional_notes?: string;
    tone: Tone;
    language: Language;
  };
  image_analysis?: ImageAnalysisResult;
  selected_caption: string;
  caption_options: string[];
  hashtags: string[];
  platform_variations: PlatformVariations;
  quality_check?: QualityCheckResult;
  created_at: string;
}

export interface PostApproval {
  id: string;
  post_id: string;
  post_version_id: string;
  approved_by: string;
  approved_destinations: SocialPlatform[];
  approval_timestamp: string;
  is_valid: boolean;
  invalidation_reason?: string;
}

export interface Post {
  id: string;
  user_id: string;
  status: PostStatus;
  current_version_id?: string;
  title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  versions?: PostVersion[];
  approvals?: PostApproval[];
  destinations: SocialPlatform[];
}

export interface ConnectedAccount {
  id: string;
  user_id: string;
  platform: SocialPlatform;
  account_name: string;
  account_identifier: string;
  is_connected: boolean;
  token_status: 'valid' | 'expired' | 'missing' | 'requires_setup';
  permissions: string[];
  connected_at?: string;
  last_used_at?: string;
}

export interface PublishingAttempt {
  id: string;
  post_id: string;
  post_version_id: string;
  destination: SocialPlatform;
  idempotency_key: string;
  provider_post_id?: string;
  status: 'success' | 'failed' | 'uncertain' | 'in_progress';
  payload_snapshot: Record<string, unknown>;
  response_data?: Record<string, unknown>;
  error_message?: string;
  attempt_count: number;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action_type: 
    | 'post_created' 
    | 'ai_generated' 
    | 'version_created' 
    | 'post_approved' 
    | 'approval_invalidated' 
    | 'publish_attempted' 
    | 'publish_succeeded' 
    | 'publish_failed'
    | 'account_connected'
    | 'account_disconnected';
  description: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
