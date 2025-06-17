/**
 * TIER 1: CORE DEVELOPMENT MASTERY (25 modes)
 * Advanced implementation with architectural patterns
 */

import { CoreDevelopmentMode } from '../core/BaseMode.js';

export const tier1Modes = {
  // 1. Code-Architect - Advanced implementation with architectural patterns
  'code-architect': {
    name: '💻 Code-Architect',
    description: 'Advanced implementation with architectural patterns, enterprise-grade code design',
    expertise: ['design-patterns', 'clean-architecture', 'solid-principles', 'microservices', 'enterprise-patterns'],
    capabilities: ['architecture-design', 'pattern-implementation', 'code-review', 'refactoring', 'technical-debt-management'],
    tools: ['design-tools', 'modeling-tools', 'static-analysis', 'architecture-validators'],
    frameworks: ['spring', 'dotnet', 'django', 'express', 'nestjs'],
    languages: ['java', 'csharp', 'python', 'typescript', 'go'],
    patterns: ['mvc', 'mvvm', 'clean-architecture', 'hexagonal', 'onion', 'cqrs', 'event-sourcing']
  },

  // 2. Debug-Master - Deep-dive debugging with root cause analysis
  'debug-master': {
    name: '🪲 Debug-Master',
    description: 'Deep-dive debugging with root cause analysis, advanced troubleshooting techniques',
    expertise: ['debugging-techniques', 'performance-profiling', 'memory-analysis', 'concurrent-debugging', 'distributed-tracing'],
    capabilities: ['root-cause-analysis', 'performance-debugging', 'memory-debugging', 'concurrency-debugging', 'distributed-debugging'],
    tools: ['debuggers', 'profilers', 'memory-analyzers', 'tracing-tools', 'log-analyzers'],
    frameworks: ['gdb', 'lldb', 'chrome-devtools', 'intellij-debugger', 'visual-studio-debugger'],
    languages: ['c', 'cpp', 'java', 'python', 'javascript', 'go', 'rust'],
    patterns: ['debugging-patterns', 'logging-patterns', 'monitoring-patterns']
  },

  // 3. System-Architect - Enterprise-grade system design
  'system-architect': {
    name: '🏗️ System-Architect',
    description: 'Enterprise-grade system design, scalable infrastructure planning',
    expertise: ['system-design', 'scalability', 'reliability', 'performance', 'security-architecture'],
    capabilities: ['system-design', 'capacity-planning', 'disaster-recovery', 'security-design', 'integration-architecture'],
    tools: ['architecture-tools', 'modeling-tools', 'simulation-tools', 'monitoring-tools'],
    frameworks: ['aws', 'azure', 'gcp', 'kubernetes', 'terraform'],
    languages: ['yaml', 'json', 'hcl', 'python', 'go'],
    patterns: ['microservices', 'event-driven', 'layered', 'service-mesh', 'serverless']
  },

  // 4. DevOps-Engineer - Full-stack infrastructure automation
  'devops-engineer': {
    name: '🚀 DevOps-Engineer',
    description: 'Full-stack infrastructure automation, CI/CD pipelines, cloud orchestration',
    expertise: ['infrastructure-as-code', 'ci-cd', 'containerization', 'orchestration', 'monitoring'],
    capabilities: ['automation', 'deployment', 'monitoring', 'scaling', 'security-automation'],
    tools: ['docker', 'kubernetes', 'ansible', 'terraform', 'jenkins', 'gitlab-ci'],
    frameworks: ['aws', 'azure', 'gcp', 'openshift', 'rancher'],
    languages: ['bash', 'python', 'yaml', 'groovy', 'powershell'],
    patterns: ['gitops', 'infrastructure-as-code', 'immutable-infrastructure', 'blue-green-deployment']
  },

  // 5. Senior-Engineer - Complex technical problem solving
  'senior-engineer': {
    name: '🔧 Senior-Engineer',
    description: 'Complex technical problem solving, technical leadership, advanced engineering practices',
    expertise: ['technical-leadership', 'complex-problem-solving', 'system-optimization', 'mentoring', 'code-quality'],
    capabilities: ['technical-leadership', 'problem-solving', 'optimization', 'mentoring', 'code-review'],
    tools: ['advanced-ides', 'profiling-tools', 'analysis-tools', 'collaboration-tools'],
    frameworks: ['multiple-frameworks', 'polyglot-development'],
    languages: ['multiple-languages', 'polyglot-programming'],
    patterns: ['enterprise-patterns', 'optimization-patterns', 'leadership-patterns']
  },

  // 6. Domain-Expert - Industry-specific technical expertise
  'domain-expert': {
    name: '🎯 Domain-Expert',
    description: 'Industry-specific technical expertise, specialized domain knowledge',
    expertise: ['domain-specific-knowledge', 'industry-standards', 'compliance', 'specialized-algorithms'],
    capabilities: ['domain-analysis', 'requirements-gathering', 'compliance-validation', 'specialized-implementation'],
    tools: ['domain-specific-tools', 'compliance-tools', 'industry-software'],
    frameworks: ['industry-specific-frameworks'],
    languages: ['domain-specific-languages'],
    patterns: ['domain-driven-design', 'domain-patterns']
  },

  // 7. Performance-Engineer - System optimization and tuning
  'performance-engineer': {
    name: '⚡ Performance-Engineer',
    description: 'System optimization and tuning, performance analysis, bottleneck identification',
    expertise: ['performance-optimization', 'profiling', 'benchmarking', 'scalability-testing'],
    capabilities: ['performance-analysis', 'optimization', 'profiling', 'load-testing', 'capacity-planning'],
    tools: ['profilers', 'load-testing-tools', 'monitoring-tools', 'benchmark-tools'],
    frameworks: ['jmeter', 'gatling', 'k6', 'locust'],
    languages: ['java', 'cpp', 'go', 'rust', 'python'],
    patterns: ['performance-patterns', 'caching-patterns', 'optimization-patterns']
  },

  // 8. Tech-Researcher - Emerging technology investigation
  'tech-researcher': {
    name: '🔬 Tech-Researcher',
    description: 'Emerging technology investigation, research methodologies, innovation exploration',
    expertise: ['technology-research', 'innovation', 'emerging-technologies', 'research-methodologies'],
    capabilities: ['research', 'analysis', 'experimentation', 'documentation', 'presentation'],
    tools: ['research-tools', 'analysis-tools', 'documentation-tools', 'presentation-tools'],
    frameworks: ['research-frameworks', 'experimental-frameworks'],
    languages: ['research-languages', 'scripting-languages'],
    patterns: ['research-patterns', 'experimental-patterns']
  },

  // 9. Technical-PM - Engineering project leadership
  'technical-pm': {
    name: '📋 Technical-PM',
    description: 'Engineering project leadership, technical program management, stakeholder coordination',
    expertise: ['project-management', 'technical-leadership', 'stakeholder-management', 'agile-methodologies'],
    capabilities: ['project-planning', 'resource-management', 'risk-management', 'stakeholder-communication'],
    tools: ['project-management-tools', 'collaboration-tools', 'tracking-tools'],
    frameworks: ['agile', 'scrum', 'kanban', 'safe'],
    languages: ['documentation-languages'],
    patterns: ['project-patterns', 'management-patterns']
  },

  // 10. Solution-Creator - Innovative technical solutions
  'solution-creator': {
    name: '🎨 Solution-Creator',
    description: 'Innovative technical solutions, creative problem solving, solution architecture',
    expertise: ['solution-design', 'innovation', 'creative-problem-solving', 'rapid-prototyping'],
    capabilities: ['solution-design', 'prototyping', 'innovation', 'creative-thinking'],
    tools: ['design-tools', 'prototyping-tools', 'modeling-tools'],
    frameworks: ['rapid-development-frameworks'],
    languages: ['multiple-languages'],
    patterns: ['solution-patterns', 'innovation-patterns']
  },

  // 11-25. Additional Core Development Modes
  'code-analyzer': {
    name: '🔍 Code-Analyzer',
    description: 'Static and dynamic code analysis, code quality assessment, security scanning',
    expertise: ['static-analysis', 'dynamic-analysis', 'code-quality', 'security-analysis'],
    capabilities: ['code-analysis', 'quality-assessment', 'security-scanning', 'technical-debt-analysis'],
    tools: ['sonarqube', 'eslint', 'checkmarx', 'veracode'],
    frameworks: ['analysis-frameworks'],
    languages: ['multiple-languages'],
    patterns: ['analysis-patterns']
  },

  'platform-builder': {
    name: '🛠️ Platform-Builder',
    description: 'Scalable platform development, platform architecture, multi-tenant systems',
    expertise: ['platform-architecture', 'multi-tenancy', 'scalability', 'extensibility'],
    capabilities: ['platform-design', 'multi-tenant-architecture', 'api-design', 'plugin-architecture'],
    tools: ['platform-tools', 'development-frameworks'],
    frameworks: ['platform-frameworks'],
    languages: ['platform-languages'],
    patterns: ['platform-patterns', 'multi-tenant-patterns']
  },

  'multi-system-orchestrator': {
    name: '🎪 Multi-System-Orchestrator',
    description: 'Complex system coordination, workflow orchestration, integration management',
    expertise: ['system-orchestration', 'workflow-management', 'integration-patterns'],
    capabilities: ['orchestration', 'workflow-design', 'integration-management'],
    tools: ['orchestration-tools', 'workflow-engines'],
    frameworks: ['orchestration-frameworks'],
    languages: ['orchestration-languages'],
    patterns: ['orchestration-patterns']
  },

  'product-launcher': {
    name: '🚀 Product-Launcher',
    description: 'Technical product deployment, launch strategies, production readiness',
    expertise: ['product-deployment', 'launch-strategies', 'production-readiness'],
    capabilities: ['deployment-planning', 'launch-execution', 'monitoring-setup'],
    tools: ['deployment-tools', 'monitoring-tools'],
    frameworks: ['deployment-frameworks'],
    languages: ['deployment-languages'],
    patterns: ['deployment-patterns']
  },

  'enterprise-integrator': {
    name: '🔄 Enterprise-Integrator',
    description: 'Large-scale system integration, enterprise service bus, data synchronization',
    expertise: ['enterprise-integration', 'esb', 'data-synchronization'],
    capabilities: ['integration-design', 'data-mapping', 'transformation'],
    tools: ['integration-tools', 'esb-platforms'],
    frameworks: ['integration-frameworks'],
    languages: ['integration-languages'],
    patterns: ['integration-patterns']
  },

  'technical-strategist': {
    name: '📊 Technical-Strategist',
    description: 'Technology roadmap planning, strategic technical decisions, innovation strategy',
    expertise: ['technology-strategy', 'roadmap-planning', 'innovation-strategy'],
    capabilities: ['strategic-planning', 'technology-assessment', 'roadmap-development'],
    tools: ['strategy-tools', 'planning-tools'],
    frameworks: ['strategy-frameworks'],
    languages: ['documentation-languages'],
    patterns: ['strategy-patterns']
  },

  'implementation-expert': {
    name: '🎯 Implementation-Expert',
    description: 'Complex feature execution, implementation strategies, delivery excellence',
    expertise: ['implementation-strategies', 'feature-development', 'delivery-excellence'],
    capabilities: ['implementation-planning', 'feature-delivery', 'quality-assurance'],
    tools: ['implementation-tools', 'development-tools'],
    frameworks: ['implementation-frameworks'],
    languages: ['implementation-languages'],
    patterns: ['implementation-patterns']
  },

  'innovation-lead': {
    name: '🌟 Innovation-Lead',
    description: 'Bleeding-edge solution development, innovation leadership, emerging technologies',
    expertise: ['innovation-leadership', 'emerging-technologies', 'research-development'],
    capabilities: ['innovation-management', 'technology-scouting', 'prototype-development'],
    tools: ['innovation-tools', 'prototyping-tools'],
    frameworks: ['innovation-frameworks'],
    languages: ['experimental-languages'],
    patterns: ['innovation-patterns']
  },

  'tech-futurist': {
    name: '🔮 Tech-Futurist',
    description: 'Technology trend forecasting, future-proofing strategies, emerging paradigms',
    expertise: ['trend-analysis', 'future-prediction', 'technology-evolution'],
    capabilities: ['trend-analysis', 'forecasting', 'strategic-planning'],
    tools: ['analysis-tools', 'forecasting-tools'],
    frameworks: ['analysis-frameworks'],
    languages: ['analysis-languages'],
    patterns: ['forecasting-patterns']
  },

  'senior-consultant': {
    name: '🎭 Senior-Consultant',
    description: 'Strategic technical advisory, expert consultation, solution guidance',
    expertise: ['technical-consulting', 'strategic-advisory', 'solution-guidance'],
    capabilities: ['consulting', 'strategic-advice', 'solution-design'],
    tools: ['consulting-tools', 'analysis-tools'],
    frameworks: ['consulting-frameworks'],
    languages: ['documentation-languages'],
    patterns: ['consulting-patterns']
  },

  'systems-analyst': {
    name: '⚙️ Systems-Analyst',
    description: 'Business-technical requirement analysis, system analysis, process optimization',
    expertise: ['systems-analysis', 'requirements-analysis', 'process-optimization'],
    capabilities: ['system-analysis', 'requirements-gathering', 'process-improvement'],
    tools: ['analysis-tools', 'modeling-tools'],
    frameworks: ['analysis-frameworks'],
    languages: ['modeling-languages'],
    patterns: ['analysis-patterns']
  },

  'solution-validator': {
    name: '🎯 Solution-Validator',
    description: 'Technical solution verification, validation methodologies, quality assurance',
    expertise: ['solution-validation', 'verification-methods', 'quality-assurance'],
    capabilities: ['validation', 'verification', 'quality-assessment'],
    tools: ['validation-tools', 'testing-tools'],
    frameworks: ['validation-frameworks'],
    languages: ['testing-languages'],
    patterns: ['validation-patterns']
  },

  'legacy-modernizer': {
    name: '🔄 Legacy-Modernizer',
    description: 'Legacy system transformation, modernization strategies, migration planning',
    expertise: ['legacy-modernization', 'system-migration', 'transformation-strategies'],
    capabilities: ['modernization-planning', 'migration-execution', 'legacy-analysis'],
    tools: ['modernization-tools', 'migration-tools'],
    frameworks: ['modernization-frameworks'],
    languages: ['legacy-languages', 'modern-languages'],
    patterns: ['modernization-patterns']
  },

  'technical-evangelist': {
    name: '🌟 Technical-Evangelist',
    description: 'Technology adoption leadership, technical evangelism, community building',
    expertise: ['technology-evangelism', 'community-building', 'adoption-strategies'],
    capabilities: ['evangelism', 'community-engagement', 'adoption-promotion'],
    tools: ['evangelism-tools', 'community-tools'],
    frameworks: ['evangelism-frameworks'],
    languages: ['presentation-languages'],
    patterns: ['evangelism-patterns']
  },

  'cross-platform-expert': {
    name: '🎪 Cross-Platform-Expert',
    description: 'Multi-platform solution design, cross-platform development, universal architectures',
    expertise: ['cross-platform-development', 'multi-platform-architecture', 'universal-design'],
    capabilities: ['cross-platform-design', 'multi-platform-development', 'universal-solutions'],
    tools: ['cross-platform-tools', 'universal-frameworks'],
    frameworks: ['cross-platform-frameworks'],
    languages: ['cross-platform-languages'],
    patterns: ['cross-platform-patterns']
  }
};

// Create mode instances
export const createTier1Modes = () => {
  const modes = {};
  
  for (const [slug, config] of Object.entries(tier1Modes)) {
    modes[slug] = new CoreDevelopmentMode({
      slug,
      ...config
    });
  }
  
  return modes;
};

export default tier1Modes;