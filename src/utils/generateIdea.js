/**
 * Local concept generation logic for Ideate.
 * Synthesizes participant responses from Stages 1, 2, and 3 into a structured product concept.
 * Frontend-only logic without external API dependencies.
 */

// Helper to clean and capitalize text
function capitalize(str = '') {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Clean stop words and punctuation for keyword extraction
function extractKeywords(text = '') {
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
    'with', 'by', 'from', 'up', 'about', 'into', 'over', 'after', 'is', 'are',
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
    'did', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might',
    'must', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them', 'their', 'our',
    'my', 'your', 'people', 'person', 'finding', 'managing', 'accessing', 'trying',
    'help', 'helps', 'helping', 'want', 'make', 'makes', 'good', 'way', 'app', 'tool',
    'need', 'needs', 'needed', 'daily', 'everyday', 'regular', 'better', 'best'
  ]);

  const rawWords = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  // Prioritize meaningful nouns over action gerunds ending in 'ing' if both exist
  const nonIngWords = rawWords.filter((w) => !w.endsWith('ing'));
  return nonIngWords.length > 0 ? nonIngWords : rawWords;
}

// Generates an evocative, brandable product name
export function generateProductName(problemText, solutionDescription, solutionType, customSolutionType) {
  const pKeywords = extractKeywords(problemText);
  const sKeywords = extractKeywords(solutionDescription);

  // High-value keyword seeds
  const primaryWord = pKeywords[0] || 'Idea';
  const secondaryWord = sKeywords[0] || (pKeywords[1] || 'Flow');

  const rootA = capitalize(primaryWord);
  const rootB = capitalize(secondaryWord);

  // Predefined contextual prefixes & suffixes
  const techSuffixMap = {
    'website': ['Hub', 'Portal', 'Base', 'Net', 'Central', 'Spot'],
    'mobile-app': ['Go', 'Pocket', 'Mate', 'Nest', 'Pulse', 'Sync'],
    'ai-tool': ['IQ', 'Genius', 'Mind', 'Synth', 'Copilot', 'Sense'],
    'automated-service': ['Flow', 'Bot', 'Engine', 'Link', 'Route', 'Pilot'],
    'something-else': ['Forge', 'Craft', 'Lab', 'Grid', 'Sphere', 'Works']
  };

  const suffixes = techSuffixMap[solutionType] || ['Sync', 'Flow', 'Craft', 'Hub'];
  const chosenSuffix = suffixes[Math.abs((primaryWord.length + secondaryWord.length)) % suffixes.length];

  // Specific domain mappings for predefined suggested problem categories
  const lowerProblem = problemText.toLowerCase();
  if (lowerProblem.includes('internship') || lowerProblem.includes('career') || lowerProblem.includes('job')) {
    const names = ['InternPath', 'SkillBridge', 'LaunchPad', 'CareerPulse', 'NextStep'];
    return names[Math.abs(sKeywords.length) % names.length];
  }
  if (lowerProblem.includes('assignment') || lowerProblem.includes('homework') || lowerProblem.includes('school')) {
    const names = ['StudySync', 'TaskCraft', 'Academiq', 'HomeworkHQ', 'PacePlan'];
    return names[Math.abs(sKeywords.length) % names.length];
  }
  if (lowerProblem.includes('accommodation') || lowerProblem.includes('housing') || lowerProblem.includes('dorm')) {
    const names = ['NestFind', 'SafeStay', 'Havenly', 'RoomRoute', 'DormHive'];
    return names[Math.abs(sKeywords.length) % names.length];
  }
  if (lowerProblem.includes('learning materials') || lowerProblem.includes('study materials')) {
    const names = ['LearnSphere', 'KnowledgeVault', 'CurateEd', 'StudyForge', 'Intellecta'];
    return names[Math.abs(sKeywords.length) % names.length];
  }
  if (lowerProblem.includes('reliable service providers') || lowerProblem.includes('service providers')) {
    const names = ['TrustLink', 'ProMatch', 'HandySync', 'LocalVetted', 'ServicePilot'];
    return names[Math.abs(sKeywords.length) % names.length];
  }

  // Dynamic composition for custom inputs
  if (rootA.length > 2 && rootB.length > 2 && rootA !== rootB) {
    return `${rootA}${rootB}`;
  }
  return `${rootA}${chosenSuffix}`;
}

// Generate the complete structured concept
export function generateConcept({ selectedProblem, problemUnderstanding, solutionExploration }) {
  const problemText = selectedProblem?.text || 'the selected problem';
  const targetAudience = problemUnderstanding?.targetAudience || 'everyday users and professionals';
  const difficulties = problemUnderstanding?.difficulties || 'lack of clear information, manual friction, and lost time';
  const currentSolutions = problemUnderstanding?.currentSolutions || 'informal word of mouth, scattered spreadsheets, and ad-hoc searches';
  const solutionType = solutionExploration?.solutionType || 'website';
  const solutionTypeName = solutionExploration?.solutionTypeName || 'technology solution';
  const solutionDescription = solutionExploration?.solutionDescription || 'help users accomplish their goals easily';
  const customSolutionType = solutionExploration?.customSolutionType || '';

  const productName = generateProductName(problemText, solutionDescription, solutionType, customSolutionType);

  // Format a friendly headline tagline
  const tagline = `The ${solutionTypeName.toLowerCase()} designed to empower ${targetAudience} by streamlining how they ${solutionDescription.toLowerCase().replace(/^(to|that|helps?)\s+/i, '')}.`;

  // Product Overview
  const productOverview = {
    summary: `${productName} is an intuitive ${solutionTypeName.toLowerCase()} built specifically for ${targetAudience}. It directly addresses the challenge of ${problemText.toLowerCase()} by giving users a unified, purpose-built platform to ${solutionDescription.toLowerCase().replace(/^(to|that|helps?)\s+/i, '')}.`,
    problemAddressed: `Today, ${targetAudience} struggle because of ${difficulties.toLowerCase()}. Existing workarounds, such as ${currentSolutions.toLowerCase()}, are fragmented, time-consuming, and prone to error.`,
    solutionValue: `By shifting from disjointed manual efforts to a modern ${solutionTypeName.toLowerCase()}, ${productName} provides clarity, removes bottlenecks, and delivers consistent results directly when they are needed most.`
  };

  // How it works (User Journey steps)
  const howItWorks = [
    {
      step: 1,
      title: 'Contextual Onboarding',
      description: `${capitalize(targetAudience)} create their profile and specify their immediate goals, requirements, and constraints regarding ${problemText.toLowerCase()}.`
    },
    {
      step: 2,
      title: 'Intelligent Matching & Organization',
      description: `The ${solutionTypeName.toLowerCase()} automatically analyzes incoming data to neutralize the frustration of ${difficulties.toLowerCase()}, filtering out irrelevant noise.`
    },
    {
      step: 3,
      title: 'Direct Action & Collaboration',
      description: `Users interact with intuitive tools to ${solutionDescription.toLowerCase().replace(/^(to|that|helps?)\s+/i, '')}, bypassing the slow friction of ${currentSolutions.toLowerCase()}.`
    },
    {
      step: 4,
      title: 'Tracked Outcomes & Growth',
      description: `Continuous updates and milestone feedback give users complete visibility and peace of mind over their progress.`
    }
  ];

  // Key Features (3 to 5 tailored features)
  const keyFeatures = [
    {
      title: 'Smart Outcome Navigator',
      badge: 'Core Feature',
      explanation: `Directly built to ${solutionDescription.toLowerCase().replace(/^(to|that|helps?)\s+/i, '')}, guiding users step-by-step with zero guesswork.`
    },
    {
      title: 'Friction Reducer Engine',
      badge: 'Problem Solver',
      explanation: `Systematically eliminates ${difficulties.toLowerCase()} through automated validation, pre-vetted options, and smart filtering.`
    },
    {
      title: 'Unified Resource Hub',
      badge: 'Consolidation',
      explanation: `Replaces outdated workarounds like ${currentSolutions.toLowerCase()} with a single, dependable destination.`
    },
    {
      title: `${solutionTypeName} Architecture Advantage`,
      badge: 'Technology',
      explanation: getTechFeatureExplanation(solutionType, customSolutionType, targetAudience)
    }
  ];

  // Who it helps
  const whoItHelps = {
    primaryUsers: targetAudience,
    coreFrustration: difficulties,
    previousHabit: currentSolutions,
    impactSummary: `Enables ${targetAudience} to save time, reduce stress, and achieve reliable outcomes without having to rely on makeshift methods.`
  };

  // Technology behind the idea
  const technologyExplanation = getTechnologyExplanation(solutionType, customSolutionType, solutionTypeName, targetAudience);

  return {
    productName,
    tagline,
    productOverview,
    howItWorks,
    keyFeatures,
    whoItHelps,
    technologyExplanation,
    generatedAt: new Date().toISOString()
  };
}

// Helpers for technology-specific explanations
function getTechFeatureExplanation(solutionType, customSolutionType, audience) {
  switch (solutionType) {
    case 'website':
      return `Universal responsive web access ensures ${audience} can collaborate and access their dashboard from any laptop, tablet, or smartphone without installing extra software.`;
    case 'mobile-app':
      return `Native mobile notifications, offline-ready caching, and quick action widgets make it effortless to take action on-the-go at any moment.`;
    case 'ai-tool':
      return `Contextual recommendation algorithms learn from user preferences, synthesizing data to provide personalized guidance tailored to individual needs.`;
    case 'automated-service':
      return `Background event triggers and proactive alerts run continuously behind the scenes, resolving tasks automatically without requiring manual user intervention.`;
    case 'something-else':
      return `Specialized interface designed specifically for ${customSolutionType || 'custom hardware/software integration'}, offering tailored capabilities beyond traditional platforms.`;
    default:
      return `Modern digital infrastructure engineered to deliver dependable speed, accessibility, and high data reliability.`;
  }
}

function getTechnologyExplanation(solutionType, customSolutionType, solutionTypeName, audience) {
  let techHighlights = [];

  switch (solutionType) {
    case 'website':
      techHighlights = [
        'Accessible via any modern browser with responsive layouts for mobile and desktop.',
        'Fast cloud data synchronization ensuring instant updates across all sessions.',
        'Accessible-first design compliant with modern web usability standards.'
      ];
      break;
    case 'mobile-app':
      techHighlights = [
        'Optimized for touch gestures, biometric login, and handheld ergonomics.',
        'Local data caching for reliable offline accessibility and minimal battery usage.',
        'Push notification framework for timely status updates and urgent reminders.'
      ];
      break;
    case 'ai-tool':
      techHighlights = [
        'Pattern recognition and natural language processing to extract user intent.',
        'Adaptive recommendation logic that personalizes suggestions over time.',
        'Privacy-focused data pipelines that safeguard sensitive user context.'
      ];
      break;
    case 'automated-service':
      techHighlights = [
        'Event-driven triggers and scheduled background workers for 24/7 reliability.',
        'Seamless integration bridges connecting to messaging, calendars, and external tools.',
        'Proactive alert dispatching so users are notified immediately when action is required.'
      ];
      break;
    case 'something-else':
      techHighlights = [
        `Tailored specifically for ${customSolutionType || 'custom technology solutions'}.`,
        'Modular architecture designed for rapid iteration and physical/digital connectivity.',
        'Custom interface protocols optimized for specialized use cases.'
      ];
      break;
    default:
      techHighlights = [
        'Secure, responsive technology foundation.',
        'Instant response times and user-friendly interface design.',
        'Scalable data management.'
      ];
  }

  return {
    solutionTypeName,
    customSolutionType,
    summary: `Leveraging a ${solutionTypeName.toLowerCase()} is ideal because it directly meets ${audience} where they already work and live, providing the exact balance of accessibility, speed, and reliability required.`,
    highlights: techHighlights
  };
}
