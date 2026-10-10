import { describe, it, expect } from 'vitest';
import { 
  agentImageAnalysis, 
  agentContextUnderstanding, 
  agentContentWriter, 
  agentPlatformOptimizer, 
  agentQualityChecker,
  runAgenticPipeline 
} from '../lib/ai/gemini-pipeline';

describe('5-Agent Agentic AI Pipeline', () => {
  it('Agent 1: extracts visible features without unsupported factual claims', async () => {
    const analysis = await agentImageAnalysis('sample-architecture.png');
    expect(analysis.visible_subjects.length).toBeGreaterThan(0);
    expect(analysis.uncertainties_and_clarifications.length).toBeGreaterThan(0);
  });

  it('Agent 2: merges context safely treating user input as data', () => {
    const analysis = {
      visible_subjects: ['Laptop'],
      observable_activity: 'Coding',
      possible_professional_context: 'Engineering',
      visually_supported_technical_details: ['React'],
      potential_post_category: 'Milestone',
      uncertainties_and_clarifications: [],
      raw_description: 'workspace image'
    };

    const context = agentContextUnderstanding(analysis, {
      projectName: 'Cloud Migration',
      skills: ['AWS', 'TypeScript'],
      tone: 'professional',
      language: 'en'
    });

    expect(context.verifiedFacts.hasSpecificEvent).toBe(false);
    expect(context.verifiedFacts.skillsProvided).toBe(true);
  });

  it('Agent 3: generates 3 distinct captions in English and Tamil', () => {
    const analysis = {
      visible_subjects: ['Laptop'],
      observable_activity: 'Coding',
      possible_professional_context: 'Engineering',
      visually_supported_technical_details: ['React'],
      potential_post_category: 'Milestone',
      uncertainties_and_clarifications: [],
      raw_description: 'workspace image'
    };

    // English
    const enResult = agentContentWriter(analysis, {
      projectName: 'CareerSpark AI',
      skills: ['AI', 'React'],
      tone: 'professional',
      language: 'en'
    });
    expect(enResult.captions).toHaveLength(3);
    expect(enResult.hashtags.length).toBeGreaterThanOrEqual(3);

    // Tamil
    const taResult = agentContentWriter(analysis, {
      projectName: 'CareerSpark AI',
      skills: ['AI', 'React'],
      tone: 'professional',
      language: 'ta'
    });
    expect(taResult.captions).toHaveLength(3);
    expect(taResult.captions[0]).toContain('மைல்கல்');
  });

  it('Agent 4: generates tailored platform variations for LinkedIn, Instagram, Facebook', () => {
    const variations = agentPlatformOptimizer(
      'Delivered our high-performance cache engine!',
      ['#Tech', '#Cloud'],
      {
        projectName: 'Cache Engine',
        skills: ['Rust'],
        tone: 'professional',
        language: 'en'
      }
    );

    expect(variations.linkedin.headline).toContain('Cache Engine');
    expect(variations.instagram.text).toContain('.');
    expect(variations.facebook.hashtags.length).toBeLessThanOrEqual(4);
  });

  it('Agent 5: enforces quality guardrails and flags PII or length violations', () => {
    const analysis = {
      visible_subjects: ['Diagram'],
      observable_activity: 'Sprint',
      possible_professional_context: 'Tech',
      visually_supported_technical_details: ['AWS'],
      potential_post_category: 'Launch',
      uncertainties_and_clarifications: [],
      raw_description: 'diagram'
    };

    const result = agentQualityChecker(
      'Contact me at alex@example.com for info!',
      ['#Dev'],
      analysis
    );

    expect(result.potential_pii_detected).toContain('Email address detected');
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('Full Pipeline Orchestrator executes end-to-end', async () => {
    const result = await runAgenticPipeline(
      'demo.png',
      {
        projectName: 'Autonomous Agent Platform',
        skills: ['LangChain', 'Next.js'],
        tone: 'friendly',
        language: 'en'
      }
    );

    expect(result.captionOptions).toHaveLength(3);
    expect(result.platformVariations.linkedin).toBeDefined();
    expect(result.qualityCheck.relevance_to_image_score).toBeGreaterThanOrEqual(90);
  });
});
