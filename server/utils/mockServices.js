// Mock AI and image generation services for demo mode
export const mockAIResponse = async (prompt, characterType = 'fantasy') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const characterTemplates = {
    fantasy: [
      {
        name: 'Thalia Moonwhisper',
        description: 'A mysterious elven sorceress with silver hair and glowing blue eyes',
        background: 'Born in the ancient Silverleaf Forest, Thalia discovered her magical abilities at a young age. She spent decades studying under the elder druids before venturing into the world to protect nature from dark forces.',
        personality: 'Wise, intuitive, fiercely protective of nature, somewhat aloof with strangers',
        abilities: ['Lunar magic', 'Nature communication', 'Healing spells', 'Illusion mastery'],
        stats: { strength: 12, dexterity: 16, constitution: 14, intelligence: 18, wisdom: 17, charisma: 15 }
      },
      {
        name: 'Gareth Ironforge',
        description: 'A sturdy dwarven warrior with a braided red beard and battle scars',
        background: 'Hailing from the mountain kingdom of Khaz Modan, Gareth is a veteran of countless battles. His family forged weapons for kings, and he carries their ancestral hammer into every fight.',
        personality: 'Loyal, brave, hot-tempered, values honor above all else',
        abilities: ['Weapon mastery', 'Smithing expertise', 'Battle rage', 'Mountain endurance'],
        stats: { strength: 18, dexterity: 12, constitution: 17, intelligence: 13, wisdom: 14, charisma: 11 }
      }
    ],
    'sci-fi': [
      {
        name: 'Captain Zara Nova',
        description: 'A cybernetically enhanced space marine with glowing neural implants',
        background: 'Former rebel turned galactic peacekeeper, Zara survived the Titan Wars and now commands a starship on the frontier. Her cybernetic enhancements were necessary after a near-fatal encounter with alien technology.',
        personality: 'Disciplined, tactical, haunted by past losses, fiercely protective of her crew',
        abilities: ['Enhanced reflexes', 'Tactical analysis', 'Starship piloting', 'Energy weapons expertise'],
        stats: { strength: 15, dexterity: 17, constitution: 16, intelligence: 16, wisdom: 15, charisma: 14 }
      },
      {
        name: 'Dr. Marcus Vex',
        description: 'A brilliant scientist with robotic arms and glowing artificial eyes',
        background: 'After losing his limbs in a laboratory accident, Marcus replaced them with his own designs. Now he pushes the boundaries of human augmentation while searching for the perfect fusion of man and machine.',
        personality: 'Brilliant, obsessive, ethically flexible, genuinely caring despite cold exterior',
        abilities: ['Cybernetic enhancement', 'Advanced hacking', 'Medical expertise', 'Technology integration'],
        stats: { strength: 10, dexterity: 14, constitution: 12, intelligence: 19, wisdom: 13, charisma: 12 }
      }
    ],
    historical: [
      {
        name: 'Lady Catherine Blackwood',
        description: 'An elegant Victorian lady with keen intellect and hidden daggers',
        background: 'Born into nobility but trained in secret by her father\'s spy network, Catherine uses her social position to gather intelligence for the Crown. She navigates London\'s high society while hunting traitors and foreign agents.',
        personality: 'Charming, intelligent, ruthlessly practical, maintains perfect facade',
        abilities: ['Social manipulation', 'Espionage', 'Hidden weapons', 'Linguistic skills'],
        stats: { strength: 11, dexterity: 15, constitution: 13, intelligence: 17, wisdom: 16, charisma: 18 }
      }
    ],
    modern: [
      {
        name: 'Detective Sarah Chen',
        description: 'A sharp-eyed detective with years of street experience',
        background: 'Rising through the ranks of the metropolitan police, Sarah has seen it all. She specializes in cybercrime and has an uncanny ability to read people. Her dedication to justice has cost her relationships but saved countless lives.',
        personality: 'Observant, determined, cynical but hopeful, struggles with work-life balance',
        abilities: ['Criminal investigation', 'Digital forensics', 'Combat training', 'Psychological profiling'],
        stats: { strength: 13, dexterity: 15, constitution: 14, intelligence: 17, wisdom: 18, charisma: 13 }
      }
    ]
  };

  const templates = characterTemplates[characterType] || characterTemplates.fantasy;
  const baseCharacter = templates[Math.floor(Math.random() * templates.length)];

  // Add some variation based on the prompt
  const variations = [
    'mysterious', 'brave', 'cunning', 'noble', 'dark', 'ancient', 'young', 'experienced',
    'magical', 'technological', 'wise', 'powerful', 'swift', 'strong', 'intelligent'
  ];
  
  const promptWords = prompt.toLowerCase().split(' ');
  const relevantVariations = variations.filter(v => 
    promptWords.some(word => word.includes(v) || v.includes(word))
  );

  return {
    ...baseCharacter,
    prompt: prompt,
    characterType: characterType,
    generatedVariations: relevantVariations,
    uniqueId: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };
};

export const mockImageGeneration = async (characterName, description) => {
  // Simulate image generation delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

  // Return a placeholder image URL (in a real demo, you might use a service like Picsum or generated avatars)
  const imageStyles = [
    'fantasy-portrait',
    'sci-fi-character',
    'medieval-noble',
    'cyberpunk-hero',
    'anime-style',
    'realistic-portrait'
  ];

  const style = imageStyles[Math.floor(Math.random() * imageStyles.length)];
  const seed = Math.floor(Math.random() * 1000000);

  // Using a placeholder service that generates character-like images
  return `https://robohash.org/${encodeURIComponent(characterName)}?set=set4&size=400x400&seed=${seed}`;
};

export const mockModelStatus = () => {
  return {
    'demo-gpt-4': {
      available: true,
      responseTime: Math.floor(Math.random() * 2000) + 500,
      successRate: 0.95 + Math.random() * 0.05,
      queueLength: Math.floor(Math.random() * 10)
    },
    'demo-claude-3': {
      available: Math.random() > 0.1,
      responseTime: Math.floor(Math.random() * 1500) + 800,
      successRate: 0.92 + Math.random() * 0.08,
      queueLength: Math.floor(Math.random() * 5)
    },
    'demo-gemini-pro': {
      available: Math.random() > 0.05,
      responseTime: Math.floor(Math.random() * 1800) + 600,
      successRate: 0.90 + Math.random() * 0.10,
      queueLength: Math.floor(Math.random() * 8)
    },
    'demo-dall-e-3': {
      available: Math.random() > 0.15,
      responseTime: Math.floor(Math.random() * 5000) + 3000,
      successRate: 0.88 + Math.random() * 0.12,
      queueLength: Math.floor(Math.random() * 15)
    }
  };
};

export const mockUsageStats = (userId) => {
  const now = new Date();
  const stats = {
    today: {
      charactersGenerated: Math.floor(Math.random() * 10) + 1,
      apiCalls: Math.floor(Math.random() * 50) + 10,
      imagesGenerated: Math.floor(Math.random() * 5) + 1,
      tokensUsed: Math.floor(Math.random() * 5000) + 1000
    },
    thisMonth: {
      charactersGenerated: Math.floor(Math.random() * 100) + 20,
      apiCalls: Math.floor(Math.random() * 500) + 100,
      imagesGenerated: Math.floor(Math.random() * 50) + 10,
      tokensUsed: Math.floor(Math.random() * 50000) + 10000
    },
    trends: {
      characterGrowth: Math.random() * 0.3 + 0.1, // 10-40% growth
      popularCharacterType: ['fantasy', 'sci-fi', 'modern', 'historical'][Math.floor(Math.random() * 4)],
      averageResponseTime: Math.floor(Math.random() * 1000) + 1500,
      successRate: 0.92 + Math.random() * 0.08
    }
  };

  return stats;
};
