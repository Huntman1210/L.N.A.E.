import { AgentOrchestrator } from '../agents/orchestrator.js';
import { MultiModelOrchestrator } from '../models/orchestrator.js';
import fs from 'fs/promises';

export class AutomationWorkflows {
  constructor() {
    this.agentOrchestrator = new AgentOrchestrator();
    this.modelOrchestrator = new MultiModelOrchestrator();
    this.outputDir = './generated';
    this.templatesDir = './automation/templates';
    this.initializeOutputDirectories();
  }

  async initializeOutputDirectories() {
    const dirs = [
      this.outputDir,
      `${this.outputDir}/websites`,
      `${this.outputDir}/apps`,
      `${this.outputDir}/games`,
      `${this.outputDir}/social`,
      `${this.outputDir}/characters`,
      this.templatesDir,
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        console.log(`Directory ${dir} already exists or couldn't be created:`, error.message);
      }
    }
  }

  async generateWebsite(prompt, options = {}) {
    console.log('🌐 Starting website generation workflow...');
    
    const websiteResult = await this.agentOrchestrator.generateWebsiteWithTeam(prompt);
    
    // Create project structure
    const projectName = options.name || `website_${Date.now()}`;
    const projectPath = `${this.outputDir}/websites/${projectName}`;
    
    await fs.mkdir(projectPath, { recursive: true });
    await fs.mkdir(`${projectPath}/src`, { recursive: true });
    await fs.mkdir(`${projectPath}/public`, { recursive: true });
    await fs.mkdir(`${projectPath}/src/components`, { recursive: true });
    await fs.mkdir(`${projectPath}/src/styles`, { recursive: true });

    // Extract and save code from the implementation
    const implementation = websiteResult.implementation;
    
    // Generate package.json
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      description: `Generated website: ${prompt}`,
      main: 'src/index.js',
      scripts: {
        start: 'react-scripts start',
        build: 'react-scripts build',
        test: 'react-scripts test',
        eject: 'react-scripts eject',
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-scripts': '5.0.1',
        'styled-components': '^6.1.0',
        'framer-motion': '^11.2.0',
      },
      browserslist: {
        production: ['>0.2%', 'not dead', 'not op_mini all'],
        development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'],
      },
    };

    await fs.writeFile(`${projectPath}/package.json`, JSON.stringify(packageJson, null, 2));

    // Generate HTML template
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Generated website: ${prompt}" />
    <title>${projectName}</title>
</head>
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
</body>
</html>`;

    await fs.writeFile(`${projectPath}/public/index.html`, htmlTemplate);

    // Generate main React component
    const mainComponent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

    await fs.writeFile(`${projectPath}/src/index.js`, mainComponent);

    // Generate App component with AI implementation
    const appComponent = `import React from 'react';
import './styles/App.css';

// AI Generated Implementation
${implementation}

export default App;`;

    await fs.writeFile(`${projectPath}/src/App.js`, appComponent);

    // Generate CSS files
    const cssContent = `/* AI Generated Styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}`;

    await fs.writeFile(`${projectPath}/src/styles/index.css`, cssContent);
    await fs.writeFile(`${projectPath}/src/styles/App.css`, '/* Component styles will be generated here */');

    // Generate README
    const readme = `# ${projectName}

## Generated Website

**Description:** ${prompt}

**Generated on:** ${new Date().toISOString()}

## Project Plan
${websiteResult.plan}

## Design Specifications
${websiteResult.design}

## QA Review
${websiteResult.qaReview}

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm start
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- \`npm start\` - Runs the app in development mode
- \`npm test\` - Launches the test runner
- \`npm run build\` - Builds the app for production
- \`npm run eject\` - Ejects from Create React App

## Generated by AI Character Creator
This website was automatically generated using AI agents and multi-model orchestration.
`;

    await fs.writeFile(`${projectPath}/README.md`, readme);

    return {
      projectPath,
      projectName,
      result: websiteResult,
      files: await this.getProjectFiles(projectPath),
    };
  }

  async generateApp(prompt, options = {}) {
    console.log('📱 Starting app generation workflow...');
    
    // Generate comprehensive app with multiple agents
    const appResult = await this.agentOrchestrator.generateWebsiteWithTeam(
      `Create a full-stack application: ${prompt}`
    );
    
    const projectName = options.name || `app_${Date.now()}`;
    const projectPath = `${this.outputDir}/apps/${projectName}`;
    
    // Create full-stack structure
    await fs.mkdir(projectPath, { recursive: true });
    await fs.mkdir(`${projectPath}/client`, { recursive: true });
    await fs.mkdir(`${projectPath}/server`, { recursive: true });
    await fs.mkdir(`${projectPath}/client/src`, { recursive: true });
    await fs.mkdir(`${projectPath}/client/public`, { recursive: true });
    await fs.mkdir(`${projectPath}/server/routes`, { recursive: true });
    await fs.mkdir(`${projectPath}/server/models`, { recursive: true });

    // Generate backend code
    const serverCode = await this.agentOrchestrator.invokeAgent('codeGenerator',
      `Create a Node.js/Express backend for: ${prompt}. Include API routes, database models, and middleware.`,
      { task: 'backend_implementation', appPlan: appResult.plan }
    );

    // Save backend files
    const packageJsonServer = {
      name: `${projectName}-server`,
      version: '1.0.0',
      description: `Generated app backend: ${prompt}`,
      main: 'server.js',
      scripts: {
        start: 'node server.js',
        dev: 'nodemon server.js',
        test: 'jest',
      },
      dependencies: {
        express: '^4.19.0',
        cors: '^2.8.5',
        dotenv: '^16.4.0',
        mongoose: '^8.4.0',
        'express-rate-limit': '^7.3.0',
        helmet: '^7.1.0',
        'express-validator': '^7.1.0',
      },
      devDependencies: {
        nodemon: '^3.1.0',
        jest: '^29.7.0',
      },
    };

    await fs.writeFile(`${projectPath}/server/package.json`, JSON.stringify(packageJsonServer, null, 2));
    await fs.writeFile(`${projectPath}/server/server.js`, serverCode.response);

    // Generate frontend (similar to website generation but with API integration)
    const frontendResult = await this.generateWebsite(
      `Create a React frontend that integrates with the backend API for: ${prompt}`,
      { name: `${projectName}-client` }
    );

    return {
      projectPath,
      projectName,
      backend: serverCode.response,
      frontend: frontendResult,
      result: appResult,
    };
  }

  async generateGame(prompt, options = {}) {
    console.log('🎮 Starting game generation workflow...');
    
    const gameResult = await this.agentOrchestrator.generateGameWithTeam(prompt);
    
    const projectName = options.name || `game_${Date.now()}`;
    const projectPath = `${this.outputDir}/games/${projectName}`;
    
    await fs.mkdir(projectPath, { recursive: true });
    await fs.mkdir(`${projectPath}/src`, { recursive: true });
    await fs.mkdir(`${projectPath}/assets`, { recursive: true });
    await fs.mkdir(`${projectPath}/src/components`, { recursive: true });
    await fs.mkdir(`${projectPath}/src/scenes`, { recursive: true });

    // Generate game-specific package.json
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      description: `Generated game: ${prompt}`,
      main: 'src/index.js',
      scripts: {
        start: 'react-scripts start',
        build: 'react-scripts build',
        test: 'react-scripts test',
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-scripts': '5.0.1',
        three: '^0.164.0',
        '@react-three/fiber': '^8.16.0',
        '@react-three/drei': '^9.105.0',
        'framer-motion': '^11.2.0',
        'use-sound': '^4.0.1',
      },
    };

    await fs.writeFile(`${projectPath}/package.json`, JSON.stringify(packageJson, null, 2));

    // Generate game implementation
    const gameCode = `import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// AI Generated Game Implementation
${gameResult.implementation}

function App() {
  return (
    <div className="App" style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Game />
      </Canvas>
    </div>
  );
}

export default App;`;

    await fs.writeFile(`${projectPath}/src/App.js`, gameCode);

    // Generate character files
    const characterData = JSON.stringify(JSON.parse(gameResult.characters || '{}'), null, 2);
    await fs.writeFile(`${projectPath}/src/characters.json`, characterData);

    // Generate README
    const readme = `# ${projectName}

## Generated Game

**Description:** ${prompt}

**Generated on:** ${new Date().toISOString()}

## Game Design
${gameResult.gameDesign}

## Characters
${gameResult.characters}

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the game:
   \`\`\`bash
   npm start
   \`\`\`

## Controls
- Mouse: Look around
- WASD: Move (if applicable)
- Space: Jump/Action

## Generated by AI Character Creator
This game was automatically generated using AI agents and multi-model orchestration.
`;

    await fs.writeFile(`${projectPath}/README.md`, readme);

    return {
      projectPath,
      projectName,
      result: gameResult,
      files: await this.getProjectFiles(projectPath),
    };
  }

  async generateSocialContent(prompt, platforms = ['twitter', 'instagram', 'facebook'], options = {}) {
    console.log('📱 Starting social media content generation...');
    
    const contentResult = await this.agentOrchestrator.generateSocialContentWithTeam(prompt, platforms);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const contentPath = `${this.outputDir}/social/content_${timestamp}`;
    
    await fs.mkdir(contentPath, { recursive: true });

    // Save content for each platform
    for (const platform of platforms) {
      const content = contentResult.content[platform];
      await fs.writeFile(`${contentPath}/${platform}_content.md`, content);
    }

    // Generate content calendar
    const calendar = `# Social Media Content Calendar

**Generated on:** ${new Date().toISOString()}
**Campaign:** ${prompt}

## Platforms: ${platforms.join(', ')}

## Content Overview
${Object.entries(contentResult.content).map(([platform, content]) => `
### ${platform.toUpperCase()}
${content}

---
`).join('')}

## Publishing Schedule
- **Optimal times:** Research suggests posting during peak engagement hours
- **Frequency:** Adjust based on platform best practices
- **Monitoring:** Track engagement metrics and adjust strategy accordingly

## Generated by AI Character Creator
This content was automatically generated using AI agents and multi-model orchestration.
`;

    await fs.writeFile(`${contentPath}/content_calendar.md`, calendar);

    return {
      contentPath,
      result: contentResult,
      platforms,
      files: await this.getProjectFiles(contentPath),
    };
  }

  async generateCharacter(prompt, options = {}) {
    console.log('👤 Starting character generation workflow...');
    
    const characterResult = await this.agentOrchestrator.generateCharacterWithTeam(prompt);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const characterPath = `${this.outputDir}/characters/character_${timestamp}`;
    
    await fs.mkdir(characterPath, { recursive: true });

    // Save character data
    await fs.writeFile(`${characterPath}/character.json`, JSON.stringify({
      prompt,
      character: characterResult.character,
      design: characterResult.design,
      implementation: characterResult.implementation,
      generated: new Date().toISOString(),
    }, null, 2));

    // Save character profile
    const profile = `# Character Profile

**Generated on:** ${new Date().toISOString()}
**Prompt:** ${prompt}

## Character Details
${characterResult.character}

## Design Specifications
${characterResult.design}

## Implementation
${characterResult.implementation}

## Generated by AI Character Creator
This character was automatically generated using AI agents and multi-model orchestration.
`;

    await fs.writeFile(`${characterPath}/character_profile.md`, profile);

    return {
      characterPath,
      result: characterResult,
      files: await this.getProjectFiles(characterPath),
    };
  }

  async getProjectFiles(projectPath) {
    try {
      const files = await fs.readdir(projectPath, { recursive: true });
      return files;
    } catch (error) {
      console.error(`Error reading project files from ${projectPath}:`, error.message);
      return [];
    }
  }

  async runAutomationPipeline(task, type, options = {}) {
    console.log(`🚀 Running automation pipeline for: ${type}`);
    
    switch (type) {
      case 'website':
        return await this.generateWebsite(task, options);
      case 'app':
        return await this.generateApp(task, options);
      case 'game':
        return await this.generateGame(task, options);
      case 'social':
        return await this.generateSocialContent(task, options.platforms, options);
      case 'character':
        return await this.generateCharacter(task, options);
      default:
        throw new Error(`Unknown automation type: ${type}`);
    }
  }

  getWorkflowStatus() {
    return {
      outputDirectory: this.outputDir,
      availableWorkflows: ['website', 'app', 'game', 'social', 'character'],
      agentStatus: this.agentOrchestrator.getAgentStatus(),
      modelStatus: this.modelOrchestrator.getModelStatus(),
    };
  }
}

export default AutomationWorkflows;
