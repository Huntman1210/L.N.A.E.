/**
 * TIER 2: FRONTEND MASTERY UNIVERSE (35 modes)
 * Advanced interface architecture and user experience optimization
 */

import { FrontendMode } from '../core/BaseMode.js';

export const tier2Modes = {
  // 26. UI-UX-Architect - Advanced interface architecture
  'ui-ux-architect': {
    name: '🎨 UI-UX-Architect',
    description: 'Advanced interface architecture, design systems, user experience optimization',
    expertise: ['design-systems', 'user-experience', 'interface-architecture', 'usability', 'design-patterns'],
    capabilities: ['ui-architecture', 'ux-optimization', 'design-system-creation', 'user-research', 'prototype-design'],
    tools: ['figma', 'sketch', 'adobe-xd', 'principle', 'framer', 'storybook'],
    frameworks: ['design-tokens', 'atomic-design', 'material-design', 'human-interface-guidelines'],
    languages: ['css', 'sass', 'less', 'stylus', 'postcss'],
    patterns: ['atomic-design', 'component-composition', 'design-tokens', 'responsive-patterns']
  },

  // 27. Visual-Designer - Professional visual design systems
  'visual-designer': {
    name: '🖼️ Visual-Designer',
    description: 'Professional visual design systems, brand implementation, aesthetic excellence',
    expertise: ['visual-design', 'brand-design', 'typography', 'color-theory', 'layout-design'],
    capabilities: ['visual-design', 'brand-implementation', 'typography-systems', 'color-systems', 'layout-optimization'],
    tools: ['figma', 'sketch', 'adobe-creative-suite', 'canva', 'invision'],
    frameworks: ['design-systems', 'brand-guidelines', 'style-guides'],
    languages: ['css', 'svg', 'design-tokens'],
    patterns: ['visual-hierarchy', 'grid-systems', 'typography-scales', 'color-palettes']
  },

  // 28. Mobile-Expert - Native and cross-platform mobile mastery
  'mobile-expert': {
    name: '📱 Mobile-Expert',
    description: 'Native and cross-platform mobile mastery, mobile-first design, app optimization',
    expertise: ['mobile-development', 'ios-development', 'android-development', 'cross-platform', 'mobile-ux'],
    capabilities: ['native-development', 'cross-platform-development', 'mobile-optimization', 'app-store-optimization'],
    tools: ['xcode', 'android-studio', 'react-native-cli', 'expo', 'flutter-cli'],
    frameworks: ['react-native', 'flutter', 'ionic', 'xamarin', 'cordova'],
    languages: ['swift', 'kotlin', 'dart', 'javascript', 'typescript'],
    patterns: ['mobile-navigation', 'responsive-mobile', 'offline-first', 'progressive-enhancement']
  },

  // 29. Full-Stack-Frontend - Frontend with backend integration
  'full-stack-frontend': {
    name: '🌐 Full-Stack-Frontend',
    description: 'Frontend with backend integration, API consumption, state management',
    expertise: ['frontend-backend-integration', 'api-consumption', 'state-management', 'data-flow'],
    capabilities: ['api-integration', 'state-management', 'data-synchronization', 'authentication-integration'],
    tools: ['postman', 'graphql-playground', 'redux-devtools', 'apollo-studio'],
    frameworks: ['next.js', 'nuxt.js', 'gatsby', 'sveltekit', 'remix'],
    languages: ['javascript', 'typescript', 'graphql', 'json'],
    patterns: ['jamstack', 'ssr', 'ssg', 'api-integration', 'state-patterns']
  },

  // 30. React-Architect - Enterprise React application architecture
  'react-architect': {
    name: '⚛️ React-Architect',
    description: 'Enterprise React application architecture, advanced React patterns, performance optimization',
    expertise: ['react-architecture', 'react-patterns', 'performance-optimization', 'state-management'],
    capabilities: ['react-architecture', 'component-design', 'performance-optimization', 'testing-strategies'],
    tools: ['react-devtools', 'storybook', 'jest', 'testing-library', 'webpack'],
    frameworks: ['react', 'next.js', 'gatsby', 'create-react-app', 'vite'],
    languages: ['javascript', 'typescript', 'jsx', 'tsx'],
    patterns: ['hooks', 'hoc', 'render-props', 'compound-components', 'state-machines']
  },

  // 31. Angular-Expert - Advanced Angular ecosystem mastery
  'angular-expert': {
    name: '🅰️ Angular-Expert',
    description: 'Advanced Angular ecosystem mastery, enterprise Angular applications, RxJS patterns',
    expertise: ['angular-architecture', 'rxjs-patterns', 'angular-material', 'enterprise-angular'],
    capabilities: ['angular-architecture', 'reactive-programming', 'performance-optimization', 'testing-strategies'],
    tools: ['angular-cli', 'angular-devtools', 'karma', 'protractor', 'jasmine'],
    frameworks: ['angular', 'angular-material', 'ionic-angular', 'ngrx'],
    languages: ['typescript', 'javascript', 'html', 'scss'],
    patterns: ['dependency-injection', 'observables', 'reactive-forms', 'lazy-loading', 'change-detection']
  },

  // 32. Vue-Specialist - Vue.js full-stack development
  'vue-specialist': {
    name: '💚 Vue-Specialist',
    description: 'Vue.js full-stack development, Nuxt.js applications, Vue ecosystem mastery',
    expertise: ['vue-architecture', 'nuxt-development', 'vue-ecosystem', 'composition-api'],
    capabilities: ['vue-architecture', 'state-management', 'ssr-development', 'performance-optimization'],
    tools: ['vue-devtools', 'vue-cli', 'nuxt-cli', 'vite', 'vitest'],
    frameworks: ['vue', 'nuxt.js', 'quasar', 'vuetify', 'pinia'],
    languages: ['javascript', 'typescript', 'vue-sfc'],
    patterns: ['composition-api', 'options-api', 'mixins', 'provide-inject', 'teleport']
  },

  // 33. Component-Architect - Scalable component library design
  'component-architect': {
    name: '🎯 Component-Architect',
    description: 'Scalable component library design, reusable components, design system implementation',
    expertise: ['component-design', 'design-systems', 'component-libraries', 'api-design'],
    capabilities: ['component-architecture', 'library-design', 'documentation', 'testing-strategies'],
    tools: ['storybook', 'bit', 'lerna', 'rollup', 'webpack'],
    frameworks: ['component-frameworks', 'build-tools'],
    languages: ['javascript', 'typescript', 'css', 'markdown'],
    patterns: ['compound-components', 'render-props', 'polymorphic-components', 'headless-components']
  },

  // 34. CSS-Architect - Advanced CSS architecture and systems
  'css-architect': {
    name: '📐 CSS-Architect',
    description: 'Advanced CSS architecture and systems, modern CSS methodologies, performance optimization',
    expertise: ['css-architecture', 'css-methodologies', 'modern-css', 'performance-optimization'],
    capabilities: ['css-architecture', 'methodology-implementation', 'performance-optimization', 'maintainability'],
    tools: ['sass', 'postcss', 'stylelint', 'purgecss', 'critical'],
    frameworks: ['tailwind', 'bootstrap', 'bulma', 'foundation'],
    languages: ['css', 'sass', 'less', 'stylus', 'postcss'],
    patterns: ['bem', 'atomic-css', 'utility-first', 'css-in-js', 'css-modules']
  },

  // 35. Animation-Expert - Complex UI animations and interactions
  'animation-expert': {
    name: '🎨 Animation-Expert',
    description: 'Complex UI animations and interactions, motion design, performance-optimized animations',
    expertise: ['animation-design', 'motion-graphics', 'interaction-design', 'performance-optimization'],
    capabilities: ['animation-implementation', 'motion-design', 'interaction-patterns', 'performance-optimization'],
    tools: ['framer-motion', 'lottie', 'greensock', 'after-effects', 'principle'],
    frameworks: ['framer-motion', 'react-spring', 'vue-transition', 'angular-animations'],
    languages: ['javascript', 'css', 'svg', 'webgl'],
    patterns: ['transition-patterns', 'gesture-patterns', 'loading-animations', 'micro-interactions']
  },

  // 36-60. Additional Frontend Mastery Modes
  'accessibility-expert': {
    name: '♿ Accessibility-Expert',
    description: 'WCAG compliance and inclusive design, accessibility auditing, assistive technology',
    expertise: ['accessibility-compliance', 'inclusive-design', 'assistive-technology', 'wcag-guidelines'],
    capabilities: ['accessibility-auditing', 'compliance-implementation', 'assistive-tech-integration'],
    tools: ['axe', 'lighthouse', 'wave', 'voiceover', 'nvda'],
    frameworks: ['accessibility-frameworks'],
    languages: ['html', 'css', 'javascript', 'aria'],
    patterns: ['accessible-patterns', 'keyboard-navigation', 'screen-reader-patterns']
  },

  'frontend-performance': {
    name: '📊 Frontend-Performance',
    description: 'Client-side optimization mastery, performance monitoring, web vitals optimization',
    expertise: ['performance-optimization', 'web-vitals', 'performance-monitoring', 'optimization-techniques'],
    capabilities: ['performance-analysis', 'optimization-implementation', 'monitoring-setup'],
    tools: ['lighthouse', 'webpagetest', 'chrome-devtools', 'webpack-bundle-analyzer'],
    frameworks: ['performance-frameworks'],
    languages: ['javascript', 'css', 'html'],
    patterns: ['performance-patterns', 'loading-patterns', 'caching-patterns']
  },

  'interactive-designer': {
    name: '🎮 Interactive-Designer',
    description: 'Game-like interface development, interactive experiences, engaging user interfaces',
    expertise: ['interactive-design', 'game-ui', 'engaging-interfaces', 'user-engagement'],
    capabilities: ['interactive-implementation', 'engagement-design', 'gamification'],
    tools: ['canvas', 'webgl', 'three.js', 'pixi.js'],
    frameworks: ['game-frameworks', 'interaction-frameworks'],
    languages: ['javascript', 'webgl', 'hlsl'],
    patterns: ['game-patterns', 'interaction-patterns', 'engagement-patterns']
  },

  'ios-expert': {
    name: '📱 iOS-Expert',
    description: 'Native iOS development mastery, Swift programming, iOS design patterns',
    expertise: ['ios-development', 'swift-programming', 'ios-patterns', 'apple-design'],
    capabilities: ['native-ios-development', 'app-store-optimization', 'ios-performance'],
    tools: ['xcode', 'instruments', 'simulator', 'testflight'],
    frameworks: ['uikit', 'swiftui', 'combine', 'core-data'],
    languages: ['swift', 'objective-c'],
    patterns: ['mvc', 'mvvm', 'coordinator', 'delegate']
  },

  'android-expert': {
    name: '🤖 Android-Expert',
    description: 'Native Android development mastery, Kotlin programming, Android architecture',
    expertise: ['android-development', 'kotlin-programming', 'android-architecture', 'material-design'],
    capabilities: ['native-android-development', 'play-store-optimization', 'android-performance'],
    tools: ['android-studio', 'adb', 'systrace', 'gradle'],
    frameworks: ['android-sdk', 'jetpack-compose', 'room', 'retrofit'],
    languages: ['kotlin', 'java'],
    patterns: ['mvvm', 'mvp', 'clean-architecture', 'repository']
  },

  'react-native-expert': {
    name: '⚡ React-Native-Expert',
    description: 'Cross-platform mobile architecture, React Native optimization, native bridge integration',
    expertise: ['react-native-architecture', 'cross-platform-development', 'native-integration'],
    capabilities: ['cross-platform-development', 'native-module-development', 'performance-optimization'],
    tools: ['react-native-cli', 'expo-cli', 'flipper', 'metro'],
    frameworks: ['react-native', 'expo', 'react-navigation'],
    languages: ['javascript', 'typescript', 'objective-c', 'java'],
    patterns: ['cross-platform-patterns', 'native-bridge-patterns']
  },

  'flutter-expert': {
    name: '🌊 Flutter-Expert',
    description: 'Advanced Flutter application development, Dart programming, Flutter architecture',
    expertise: ['flutter-development', 'dart-programming', 'flutter-architecture', 'widget-design'],
    capabilities: ['flutter-app-development', 'custom-widget-creation', 'performance-optimization'],
    tools: ['flutter-cli', 'dart-devtools', 'android-studio', 'vs-code'],
    frameworks: ['flutter', 'bloc', 'provider', 'riverpod'],
    languages: ['dart'],
    patterns: ['bloc-pattern', 'provider-pattern', 'widget-composition']
  },

  'design-system-expert': {
    name: '🎨 Design-System-Expert',
    description: 'Enterprise design system creation, design tokens, component libraries',
    expertise: ['design-systems', 'design-tokens', 'component-libraries', 'brand-consistency'],
    capabilities: ['design-system-creation', 'token-management', 'component-documentation'],
    tools: ['storybook', 'figma', 'design-tokens-studio', 'chromatic'],
    frameworks: ['design-system-frameworks'],
    languages: ['css', 'javascript', 'design-tokens'],
    patterns: ['atomic-design', 'design-token-patterns', 'component-api-patterns']
  },

  'pwa-expert': {
    name: '📱 PWA-Expert',
    description: 'Progressive web app optimization, service workers, offline-first design',
    expertise: ['pwa-development', 'service-workers', 'offline-first', 'app-shell-architecture'],
    capabilities: ['pwa-implementation', 'offline-functionality', 'push-notifications'],
    tools: ['workbox', 'pwa-builder', 'lighthouse', 'chrome-devtools'],
    frameworks: ['workbox', 'pwa-frameworks'],
    languages: ['javascript', 'service-worker-api'],
    patterns: ['app-shell', 'cache-first', 'network-first', 'offline-first']
  },

  'conversion-designer': {
    name: '🎯 Conversion-Designer',
    description: 'High-converting landing pages, conversion optimization, A/B testing',
    expertise: ['conversion-optimization', 'landing-page-design', 'ab-testing', 'user-psychology'],
    capabilities: ['conversion-implementation', 'testing-strategies', 'optimization-techniques'],
    tools: ['optimizely', 'google-optimize', 'hotjar', 'google-analytics'],
    frameworks: ['testing-frameworks', 'analytics-frameworks'],
    languages: ['html', 'css', 'javascript'],
    patterns: ['conversion-patterns', 'testing-patterns', 'optimization-patterns']
  },

  'e-commerce-frontend': {
    name: '🛒 E-commerce-Frontend',
    description: 'Shopping experience optimization, e-commerce UX, payment integration',
    expertise: ['e-commerce-ux', 'shopping-cart-design', 'payment-integration', 'product-catalog'],
    capabilities: ['e-commerce-implementation', 'payment-processing', 'inventory-management'],
    tools: ['shopify', 'woocommerce', 'magento', 'stripe'],
    frameworks: ['e-commerce-frameworks'],
    languages: ['javascript', 'php', 'liquid'],
    patterns: ['e-commerce-patterns', 'checkout-patterns', 'catalog-patterns']
  },

  'dashboard-expert': {
    name: '📊 Dashboard-Expert',
    description: 'Data visualization interfaces, dashboard design, analytics presentation',
    expertise: ['dashboard-design', 'data-visualization', 'analytics-interfaces', 'reporting-systems'],
    capabilities: ['dashboard-implementation', 'visualization-creation', 'real-time-updates'],
    tools: ['d3.js', 'chart.js', 'tableau', 'power-bi'],
    frameworks: ['visualization-frameworks'],
    languages: ['javascript', 'svg', 'd3'],
    patterns: ['dashboard-patterns', 'visualization-patterns', 'real-time-patterns']
  },

  'brand-implementation': {
    name: '🎨 Brand-Implementation',
    description: 'Brand-consistent UI development, brand guidelines implementation, visual identity',
    expertise: ['brand-implementation', 'visual-identity', 'brand-guidelines', 'consistency-management'],
    capabilities: ['brand-integration', 'guideline-implementation', 'consistency-enforcement'],
    tools: ['figma', 'sketch', 'brand-management-tools'],
    frameworks: ['brand-frameworks'],
    languages: ['css', 'design-tokens'],
    patterns: ['brand-patterns', 'consistency-patterns']
  },

  'prototype-master': {
    name: '🎭 Prototype-Master',
    description: 'Rapid interactive prototyping, proof-of-concept development, user testing',
    expertise: ['rapid-prototyping', 'interactive-prototypes', 'user-testing', 'concept-validation'],
    capabilities: ['prototype-development', 'user-testing-implementation', 'concept-validation'],
    tools: ['figma', 'principle', 'framer', 'invision'],
    frameworks: ['prototyping-frameworks'],
    languages: ['javascript', 'css', 'html'],
    patterns: ['prototyping-patterns', 'testing-patterns']
  },

  'responsive-expert': {
    name: '📱 Responsive-Expert',
    description: 'Advanced responsive design patterns, fluid layouts, device optimization',
    expertise: ['responsive-design', 'fluid-layouts', 'device-optimization', 'breakpoint-strategies'],
    capabilities: ['responsive-implementation', 'device-testing', 'performance-optimization'],
    tools: ['browser-devtools', 'browserstack', 'responsive-design-tools'],
    frameworks: ['css-frameworks', 'grid-systems'],
    languages: ['css', 'javascript', 'media-queries'],
    patterns: ['responsive-patterns', 'fluid-patterns', 'adaptive-patterns']
  },

  'micro-frontend': {
    name: '🎨 Micro-Frontend',
    description: 'Micro-frontend architecture, modular applications, independent deployments',
    expertise: ['micro-frontend-architecture', 'modular-applications', 'independent-deployments'],
    capabilities: ['micro-frontend-implementation', 'module-federation', 'deployment-strategies'],
    tools: ['webpack', 'single-spa', 'module-federation'],
    frameworks: ['micro-frontend-frameworks'],
    languages: ['javascript', 'typescript'],
    patterns: ['micro-frontend-patterns', 'federation-patterns']
  },

  'frontend-innovation': {
    name: '🌟 Frontend-Innovation',
    description: 'Cutting-edge frontend technologies, experimental features, future-forward development',
    expertise: ['emerging-technologies', 'experimental-features', 'innovation-implementation'],
    capabilities: ['innovation-development', 'experimental-implementation', 'future-proofing'],
    tools: ['experimental-tools', 'bleeding-edge-frameworks'],
    frameworks: ['experimental-frameworks'],
    languages: ['cutting-edge-languages'],
    patterns: ['innovation-patterns', 'experimental-patterns']
  },

  'user-experience': {
    name: '🎯 User-Experience',
    description: 'UX research and implementation, user journey optimization, usability testing',
    expertise: ['ux-research', 'user-journey-design', 'usability-testing', 'user-psychology'],
    capabilities: ['ux-implementation', 'user-research', 'testing-strategies'],
    tools: ['user-testing-tools', 'analytics-tools', 'research-tools'],
    frameworks: ['ux-frameworks'],
    languages: ['research-methodologies'],
    patterns: ['ux-patterns', 'user-journey-patterns']
  },

  'mobile-web-expert': {
    name: '📱 Mobile-Web-Expert',
    description: 'Mobile-first web development, touch interfaces, mobile optimization',
    expertise: ['mobile-web-development', 'touch-interfaces', 'mobile-optimization'],
    capabilities: ['mobile-web-implementation', 'touch-optimization', 'performance-optimization'],
    tools: ['mobile-testing-tools', 'touch-simulation-tools'],
    frameworks: ['mobile-web-frameworks'],
    languages: ['javascript', 'css', 'html'],
    patterns: ['mobile-first-patterns', 'touch-patterns']
  },

  'visual-effects': {
    name: '🎨 Visual-Effects',
    description: 'Advanced web visual effects, WebGL graphics, immersive experiences',
    expertise: ['visual-effects', 'webgl-graphics', 'immersive-experiences', 'shader-programming'],
    capabilities: ['visual-effects-implementation', 'graphics-programming', 'performance-optimization'],
    tools: ['three.js', 'babylon.js', 'webgl', 'canvas'],
    frameworks: ['graphics-frameworks', 'webgl-frameworks'],
    languages: ['javascript', 'glsl', 'webgl'],
    patterns: ['graphics-patterns', 'shader-patterns', 'animation-patterns']
  },

  'frontend-tooling': {
    name: '🔧 Frontend-Tooling',
    description: 'Build systems and development tools, workflow optimization, automation',
    expertise: ['build-systems', 'development-tools', 'workflow-optimization', 'automation'],
    capabilities: ['tooling-implementation', 'workflow-design', 'automation-setup'],
    tools: ['webpack', 'vite', 'rollup', 'parcel', 'gulp'],
    frameworks: ['build-frameworks', 'tooling-frameworks'],
    languages: ['javascript', 'typescript', 'configuration-languages'],
    patterns: ['build-patterns', 'tooling-patterns', 'automation-patterns']
  },

  'multi-framework': {
    name: '🎪 Multi-Framework',
    description: 'Framework-agnostic solutions, polyglot frontend development, technology integration',
    expertise: ['multi-framework-development', 'framework-integration', 'technology-agnostic-solutions'],
    capabilities: ['framework-integration', 'polyglot-development', 'technology-bridging'],
    tools: ['multi-framework-tools'],
    frameworks: ['multiple-frameworks'],
    languages: ['multiple-languages'],
    patterns: ['integration-patterns', 'agnostic-patterns']
  },

  'frontend-architecture': {
    name: '🎯 Frontend-Architecture',
    description: 'Large-scale frontend planning, architectural decisions, scalability design',
    expertise: ['frontend-architecture', 'scalability-design', 'architectural-patterns'],
    capabilities: ['architecture-design', 'scalability-planning', 'technical-leadership'],
    tools: ['architecture-tools', 'planning-tools'],
    frameworks: ['architectural-frameworks'],
    languages: ['architectural-languages'],
    patterns: ['architectural-patterns', 'scalability-patterns']
  },

  'internationalization': {
    name: '🌐 Internationalization',
    description: 'Multi-language interface development, localization, cultural adaptation',
    expertise: ['internationalization', 'localization', 'cultural-adaptation', 'multi-language-support'],
    capabilities: ['i18n-implementation', 'localization-strategies', 'cultural-optimization'],
    tools: ['i18n-tools', 'localization-platforms'],
    frameworks: ['i18n-frameworks'],
    languages: ['multiple-natural-languages', 'i18n-formats'],
    patterns: ['i18n-patterns', 'localization-patterns']
  },

  'theme-system': {
    name: '🎨 Theme-System',
    description: 'Dynamic theming and customization, theme management, user personalization',
    expertise: ['dynamic-theming', 'theme-systems', 'user-customization', 'personalization'],
    capabilities: ['theme-implementation', 'customization-systems', 'personalization-features'],
    tools: ['theme-tools', 'customization-platforms'],
    frameworks: ['theming-frameworks'],
    languages: ['css', 'javascript', 'design-tokens'],
    patterns: ['theming-patterns', 'customization-patterns']
  }
};

// Create mode instances
export const createTier2Modes = () => {
  const modes = {};
  
  for (const [slug, config] of Object.entries(tier2Modes)) {
    modes[slug] = new FrontendMode({
      slug,
      ...config
    });
  }
  
  return modes;
};

export default tier2Modes;