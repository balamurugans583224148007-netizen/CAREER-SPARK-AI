import { describe, it, expect } from 'vitest';
import { providers, ManualPublishingProvider } from '../lib/publishing';
import type { PostVersion } from '../types';

describe('Social Publishing Architecture (Rule 9)', () => {
  const mockVersion: PostVersion = {
    id: 'v1',
    post_id: 'post_1',
    version_number: 1,
    image_url: 'https://example.com/image.png',
    context_input: {
      skills_demonstrated: ['React'],
      tone: 'professional',
      language: 'en'
    },
    selected_caption: 'Excited to ship CareerSpark AI!',
    caption_options: ['Excited to ship CareerSpark AI!'],
    hashtags: ['#AI', '#FullStack'],
    platform_variations: {
      linkedin: { text: 'Excited to ship CareerSpark AI! #AI', hashtags: ['#AI'] },
      instagram: { text: 'Excited to ship CareerSpark AI!\n.\n#AI', hashtags: ['#AI'] },
      facebook: { text: 'Excited to ship CareerSpark AI! #AI', hashtags: ['#AI'] }
    },
    created_at: new Date().toISOString()
  };

  it('LinkedInProvider requires setup if token is missing', async () => {
    const provider = providers.linkedin;
    const result = await provider.publish(mockVersion);
    expect(result.success).toBe(false);
    expect(result.requiresSetup).toBe(true);
    expect(result.error).toContain('LinkedIn Account not connected');
  });

  it('LinkedInProvider executes with idempotency key when token is supplied', async () => {
    const provider = providers.linkedin;
    const result = await provider.publish(mockVersion, 'valid_token_sample', 'idemp_key_123');
    expect(result.success).toBe(true);
    expect(result.providerPostId).toBeDefined();
  });

  it('ManualPublishingProvider generates accurate external share links', () => {
    const liUrl = ManualPublishingProvider.getShareUrl('linkedin', 'My Post');
    expect(liUrl).toContain('linkedin.com/sharing/share-offsite');
  });
});
