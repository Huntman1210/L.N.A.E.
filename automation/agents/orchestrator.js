import { MultiModelOrchestrator } from '../models/orchestrator.js';
import { EventEmitter } from 'events';

export class AgentOrchestrator extends EventEmitter {
  constructor() {
    super();
    this.modelOrchestrator = new MultiModelOrchestrator();
    this.agents = {};
    this.conversations = new Map();
    this.initializeAgents();
  }

  initializeAgents() {
    // Character Designer Agent
    this.agents.characterDesigner = {
      name: 'Character Designer',
      role: 'character_designer',
      specialty: 'Creating detailed character profiles, backstories, and visual descriptions',
      model: 'gpt-4',
      prompt: `You are a master character designer with expertise in creating compelling, 
               well-rounded characters for games, stories, and interactive media. 
               Focus on psychological depth, visual appeal, and narrative potential.`,
    };

    // Code Generator Agent
    this.agents.codeGenerator = {
      name: 'Code Generator',
      role: 'code_generator',
      specialty: 'Writing clean, efficient, and well-documented code',
      model: 'codellama',
      prompt: `You are an expert full-stack developer specializing in React, Node.js, 
               and modern web technologies. Write production-ready code with best practices.`,
    };

    // UI/UX Designer Agent
    this.agents.uiDesigner = {
      name: 'UI/UX Designer',
      role: 'ui_designer',
      specialty: 'Creating beautiful, intuitive user interfaces and experiences',
      model: 'claude-3-sonnet',
      prompt: `You are a senior UI/UX designer with expertise in modern design principles, 
               accessibility, and user-centered design. Create stunning, functional interfaces.`,
    };

    // Game Designer Agent
    this.agents.gameDesigner = {
      name: 'Game Designer',
      role: 'game_designer',
      specialty: 'Designing engaging game mechanics, systems, and experiences',
      model: 'gemini-pro',
      prompt: `You are a creative game designer with deep knowledge of game mechanics, 
               player psychology, and interactive entertainment. Design engaging experiences.`,
    };

    // Social Media Manager Agent
    this.agents.socialManager = {
      name: 'Social Media Manager',
      role: 'social_manager',
      specialty: 'Creating viral content and managing social media presence',
      model: 'mistral-large',
      prompt: `You are a social media expert who understands trends, audience engagement, 
               and platform-specific content strategies. Create content that resonates.`,
    };

    // Project Manager Agent
    this.agents.projectManager = {
      name: 'Project Manager',
      role: 'project_manager',
      specialty: 'Coordinating tasks, managing workflows, and ensuring project success',
      model: 'gpt-4',
      prompt: `You are an experienced project manager who excels at breaking down complex 
               projects, coordinating team efforts, and delivering results on time.`,
    };

    // Quality Assurance Agent
    this.agents.qaAgent = {
      name: 'QA Specialist',
      role: 'qa_specialist',
      specialty: 'Testing, debugging, and ensuring high-quality deliverables',
      model: 'claude-3-haiku',
      prompt: `You are a meticulous QA specialist who identifies issues, suggests improvements, 
               and ensures all deliverables meet the highest quality standards.`,
    };

    console.log(`Initialized ${Object.keys(this.agents).length} AI agents`);
  }

  async invokeAgent(agentRole, task, context = {}) {
    const agent = this.agents[agentRole];
    if (!agent) {
      throw new Error(`Agent with role '${agentRole}' not found`);
    }

    console.log(`🤖 Invoking ${agent.name} for: ${task}`);

    const fullPrompt = `${agent.prompt}

Current Task: ${task}

Context: ${JSON.stringify(context, null, 2)}

Please provide a detailed response based on your expertise in ${agent.specialty}.`;

    try {
      const response = await this.modelOrchestrator.generateResponse(
        fullPrompt,
        agent.model,
        {
          context: `Agent: ${agent.name}`,
          task: task,
          instructions: agent.prompt,
        }
      );

      this.emit('agentResponse', {
        agent: agent.name,
        role: agentRole,
        task,
        response: response.response,
        model: response.model,
        timestamp: response.timestamp,
      });

      return response;
    } catch (error) {
      console.error(`Error invoking ${agent.name}:`, error);
      throw error;
    }
  }

  async startConversation(conversationId, participants, initialTask) {
    console.log(`🗣️ Starting multi-agent conversation: ${conversationId}`);
    
    const conversation = {
      id: conversationId,
      participants,
      messages: [],
      status: 'active',
      startTime: new Date(),
    };

    this.conversations.set(conversationId, conversation);

    // Start with project manager breaking down the task
    const pmResponse = await this.invokeAgent('projectManager', 
      `Break down this task into manageable components and assign them to the appropriate agents: ${initialTask}`,
      { conversationId, participants }
    );

    conversation.messages.push({
      agent: 'projectManager',
      message: pmResponse.response,
      timestamp: new Date(),
      type: 'task_breakdown',
    });

    return conversation;
  }

  async continueConversation(conversationId, agentRole, message) {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    const response = await this.invokeAgent(agentRole, message, {
      conversationId,
      previousMessages: conversation.messages.slice(-5), // Last 5 messages for context
    });

    conversation.messages.push({
      agent: agentRole,
      message: response.response,
      timestamp: new Date(),
      type: 'response',
    });

    return response;
  }

  async generateCharacterWithTeam(characterDescription) {
    const conversationId = `character_creation_${Date.now()}`;
    
    // Start with character designer
    const designResponse = await this.invokeAgent('characterDesigner', 
      `Create a comprehensive character based on: ${characterDescription}`,
      { task: 'character_creation' }
    );

    // Get UI designer input for visual representation
    const uiResponse = await this.invokeAgent('uiDesigner',
      `Based on this character description, create UI components and visual design specs: ${designResponse.response}`,
      { task: 'character_ui_design', characterData: designResponse.response }
    );

    // Get code generator to implement the character system
    const codeResponse = await this.invokeAgent('codeGenerator',
      `Implement React components for this character with the following design specs: ${uiResponse.response}`,
      { 
        task: 'character_implementation',
        characterData: designResponse.response,
        designSpecs: uiResponse.response 
      }
    );

    return {
      character: designResponse.response,
      design: uiResponse.response,
      implementation: codeResponse.response,
      conversationId,
    };
  }

  async generateWebsiteWithTeam(websiteDescription) {
    const conversationId = `website_creation_${Date.now()}`;
    
    // Project manager breaks down the task
    const pmResponse = await this.invokeAgent('projectManager',
      `Plan a complete website project: ${websiteDescription}`,
      { task: 'website_planning' }
    );

    // UI Designer creates the design
    const designResponse = await this.invokeAgent('uiDesigner',
      `Create comprehensive UI/UX design for: ${websiteDescription}. Follow this project plan: ${pmResponse.response}`,
      { task: 'website_design', projectPlan: pmResponse.response }
    );

    // Code generator implements the website
    const codeResponse = await this.invokeAgent('codeGenerator',
      `Implement a complete website with the following specifications: ${designResponse.response}`,
      { 
        task: 'website_implementation',
        projectPlan: pmResponse.response,
        designSpecs: designResponse.response 
      }
    );

    // QA reviews the implementation
    const qaResponse = await this.invokeAgent('qaAgent',
      `Review and provide feedback on this website implementation: ${codeResponse.response}`,
      { task: 'website_qa', implementation: codeResponse.response }
    );

    return {
      plan: pmResponse.response,
      design: designResponse.response,
      implementation: codeResponse.response,
      qaReview: qaResponse.response,
      conversationId,
    };
  }

  async generateGameWithTeam(gameDescription) {
    const conversationId = `game_creation_${Date.now()}`;
    
    // Game designer creates the concept
    const gameResponse = await this.invokeAgent('gameDesigner',
      `Design a complete game concept: ${gameDescription}`,
      { task: 'game_design' }
    );

    // Character designer creates game characters
    const characterResponse = await this.invokeAgent('characterDesigner',
      `Create characters for this game: ${gameResponse.response}`,
      { task: 'game_character_design', gameDesign: gameResponse.response }
    );

    // Code generator implements the game
    const codeResponse = await this.invokeAgent('codeGenerator',
      `Implement this game using modern web technologies: ${gameResponse.response}`,
      { 
        task: 'game_implementation',
        gameDesign: gameResponse.response,
        characters: characterResponse.response 
      }
    );

    return {
      gameDesign: gameResponse.response,
      characters: characterResponse.response,
      implementation: codeResponse.response,
      conversationId,
    };
  }

  async generateSocialContentWithTeam(contentDescription, platforms) {
    const conversationId = `social_content_${Date.now()}`;
    
    const contentPromises = platforms.map(platform =>
      this.invokeAgent('socialManager',
        `Create engaging ${platform} content: ${contentDescription}`,
        { task: 'social_content_creation', platform }
      )
    );

    const responses = await Promise.all(contentPromises);
    
    return {
      content: responses.reduce((acc, response, index) => {
        acc[platforms[index]] = response.response;
        return acc;
      }, {}),
      conversationId,
    };
  }

  getConversationHistory(conversationId) {
    return this.conversations.get(conversationId);
  }

  getAllAgents() {
    return Object.values(this.agents);
  }

  getAgentStatus() {
    return {
      totalAgents: Object.keys(this.agents).length,
      activeConversations: this.conversations.size,
      availableAgents: Object.keys(this.agents),
    };
  }
}

export default AgentOrchestrator;
