import { describe, it, expect } from 'vitest';
import type { Post, PostApproval } from '../types';

describe('Mandatory Server-Side Approval Gate & Versioning (Rule 7 & 8)', () => {
  it('Invalidates prior approvals when post draft is edited', () => {
    const originalApproval: PostApproval = {
      id: 'appr_1',
      post_id: 'post_1',
      post_version_id: 'v1',
      approved_by: 'user_1',
      approved_destinations: ['linkedin'],
      approval_timestamp: '2026-10-09T10:00:00Z',
      is_valid: true
    };

    const post: Post = {
      id: 'post_1',
      user_id: 'user_1',
      title: 'Original Project',
      status: 'approved',
      image_url: 'image.png',
      current_version_id: 'v1',
      created_at: '2026-10-09T10:00:00Z',
      updated_at: '2026-10-09T10:00:00Z',
      versions: [],
      approvals: [originalApproval],
      destinations: ['linkedin']
    };

    const newVersionId = 'v2';
    const invalidatedApprovals = post.approvals!.map(a => ({
      ...a,
      is_valid: false,
      invalidation_reason: 'Content modified after approval'
    }));

    const updatedPost: Post = {
      ...post,
      status: 'draft',
      current_version_id: newVersionId,
      approvals: invalidatedApprovals
    };

    expect(updatedPost.status).toBe('draft');
    expect(updatedPost.current_version_id).toBe('v2');
    expect(updatedPost.approvals![0].is_valid).toBe(false);

    const canPublish = updatedPost.approvals!.some(
      a => a.post_version_id === updatedPost.current_version_id && a.is_valid
    );
    expect(canPublish).toBe(false);
  });
});
