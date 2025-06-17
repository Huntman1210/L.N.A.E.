/**
 * TIER 3: BACKEND DEVELOPMENT MASTERY (35 modes)
 * Advanced backend development with APIs, databases, and cloud services
 */

export const tier3Modes = {
  // 1. API-Architect - Advanced API design and development
  'api-architect': {
    name: '🔌 API-Architect',
    description: 'Advanced API design and development with REST, GraphQL, and microservices',
    expertise: ['api-design', 'rest', 'graphql', 'microservices', 'api-security'],
    capabilities: ['api-design', 'documentation', 'versioning', 'security', 'testing'],
    tools: ['swagger', 'postman', 'insomnia', 'apollo-server', 'fastify'],
    frameworks: ['express', 'koa', 'fastify', 'apollo', 'nest'],
    languages: ['javascript', 'typescript', 'python', 'go', 'java'],
    patterns: ['rest-patterns', 'graphql-patterns', 'microservice-patterns']
  },

  // 2. Database-Expert - Database design and optimization
  'database-expert': {
    name: '🗄️ Database-Expert',
    description: 'Database design and optimization with SQL, NoSQL, and data modeling',
    expertise: ['database-design', 'sql', 'nosql', 'data-modeling', 'query-optimization'],
    capabilities: ['database-design', 'optimization', 'migrations', 'backup-recovery'],
    tools: ['postgresql', 'mongodb', 'redis', 'elasticsearch', 'prisma'],
    frameworks: ['orm-frameworks', 'database-frameworks'],
    languages: ['sql', 'javascript', 'python'],
    patterns: ['database-patterns', 'orm-patterns', 'migration-patterns']
  },

  // 3. Cloud-Engineer - Cloud services and infrastructure
  'cloud-engineer': {
    name: '☁️ Cloud-Engineer',
    description: 'Cloud services and infrastructure with AWS, Azure, and Google Cloud',
    expertise: ['cloud-architecture', 'aws', 'azure', 'gcp', 'serverless'],
    capabilities: ['cloud-deployment', 'infrastructure-as-code', 'monitoring', 'scaling'],
    tools: ['terraform', 'aws-cli', 'azure-cli', 'gcloud', 'kubernetes'],
    frameworks: ['cloud-frameworks', 'serverless-frameworks'],
    languages: ['yaml', 'json', 'hcl', 'bash'],
    patterns: ['cloud-patterns', 'serverless-patterns', 'infrastructure-patterns']
  },

  // 4. Security-Specialist - Application security and authentication
  'security-specialist': {
    name: '🔒 Security-Specialist',
    description: 'Application security and authentication with OAuth, JWT, and best practices',
    expertise: ['application-security', 'oauth', 'jwt', 'encryption', 'penetration-testing'],
    capabilities: ['security-assessment', 'authentication', 'authorization', 'encryption'],
    tools: ['oauth-providers', 'security-scanners', 'penetration-tools'],
    frameworks: ['security-frameworks', 'auth-frameworks'],
    languages: ['javascript', 'python', 'go'],
    patterns: ['security-patterns', 'auth-patterns', 'encryption-patterns']
  },

  // 5. Microservices-Architect - Distributed systems design
  'microservices-architect': {
    name: '🏗️ Microservices-Architect',
    description: 'Distributed systems design with microservices, messaging, and orchestration',
    expertise: ['microservices', 'distributed-systems', 'message-queues', 'service-mesh'],
    capabilities: ['service-design', 'inter-service-communication', 'fault-tolerance'],
    tools: ['docker', 'kubernetes', 'istio', 'rabbitmq', 'kafka'],
    frameworks: ['microservice-frameworks'],
    languages: ['javascript', 'go', 'java', 'python'],
    patterns: ['microservice-patterns', 'messaging-patterns', 'resilience-patterns']
  },

  // 6. DevOps-Specialist - CI/CD and automation
  'devops-specialist': {
    name: '🚀 DevOps-Specialist',
    description: 'CI/CD and automation with containerization, orchestration, and monitoring',
    expertise: ['ci-cd', 'containerization', 'orchestration', 'monitoring', 'automation'],
    capabilities: ['pipeline-design', 'containerization', 'monitoring', 'automation'],
    tools: ['jenkins', 'github-actions', 'docker', 'kubernetes', 'prometheus'],
    frameworks: ['ci-cd-frameworks', 'monitoring-frameworks'],
    languages: ['yaml', 'bash', 'groovy', 'python'],
    patterns: ['ci-cd-patterns', 'deployment-patterns', 'monitoring-patterns']
  },

  // 7. Node-Expert - Node.js backend development
  'node-expert': {
    name: '💚 Node-Expert',
    description: 'Node.js backend development with Express, performance optimization, and scaling',
    expertise: ['nodejs', 'express', 'performance', 'async-programming', 'npm'],
    capabilities: ['server-development', 'performance-optimization', 'package-management'],
    tools: ['express', 'koa', 'fastify', 'pm2', 'nodemon'],
    frameworks: ['express', 'koa', 'fastify', 'nest'],
    languages: ['javascript', 'typescript'],
    patterns: ['nodejs-patterns', 'express-patterns', 'async-patterns']
  },

  // 8. Python-Backend-Dev - Python backend development
  'python-backend-dev': {
    name: '🐍 Python-Backend-Dev',
    description: 'Python backend development with Django, Flask, and FastAPI',
    expertise: ['python', 'django', 'flask', 'fastapi', 'sqlalchemy'],
    capabilities: ['web-development', 'orm', 'api-development', 'testing'],
    tools: ['django', 'flask', 'fastapi', 'celery', 'gunicorn'],
    frameworks: ['django', 'flask', 'fastapi', 'tornado'],
    languages: ['python'],
    patterns: ['mvc-patterns', 'orm-patterns', 'api-patterns']
  },

  // 9. Go-Developer - Go backend development
  'go-developer': {
    name: '🐹 Go-Developer',
    description: 'Go backend development with high performance, concurrency, and microservices',
    expertise: ['go', 'concurrency', 'performance', 'microservices', 'grpc'],
    capabilities: ['concurrent-programming', 'performance-optimization', 'microservices'],
    tools: ['go-tools', 'gorilla', 'gin', 'grpc', 'docker'],
    frameworks: ['gin', 'echo', 'fiber', 'gorilla'],
    languages: ['go'],
    patterns: ['go-patterns', 'concurrency-patterns', 'microservice-patterns']
  },

  // 10. Java-Backend-Expert - Java enterprise development
  'java-backend-expert': {
    name: '☕ Java-Backend-Expert',
    description: 'Java enterprise development with Spring, Maven, and enterprise patterns',
    expertise: ['java', 'spring', 'maven', 'enterprise-patterns', 'jvm'],
    capabilities: ['enterprise-development', 'dependency-injection', 'orm', 'testing'],
    tools: ['spring', 'maven', 'gradle', 'intellij', 'junit'],
    frameworks: ['spring', 'spring-boot', 'hibernate', 'struts'],
    languages: ['java', 'kotlin'],
    patterns: ['spring-patterns', 'enterprise-patterns', 'mvc-patterns']
  },

  // Additional Backend Modes (11-35)
  'message-queue-specialist': {
    name: '📨 Message-Queue-Specialist',
    description: 'Message queue systems with RabbitMQ, Kafka, and event-driven architectures',
    expertise: ['message-queues', 'event-driven', 'kafka', 'rabbitmq', 'redis'],
    capabilities: ['message-design', 'event-sourcing', 'pub-sub', 'stream-processing'],
    tools: ['kafka', 'rabbitmq', 'redis', 'aws-sqs', 'azure-service-bus'],
    frameworks: ['messaging-frameworks'],
    languages: ['javascript', 'python', 'go', 'java'],
    patterns: ['messaging-patterns', 'event-sourcing-patterns']
  },

  'caching-expert': {
    name: '⚡ Caching-Expert',
    description: 'Caching strategies with Redis, Memcached, and distributed caching',
    expertise: ['caching', 'redis', 'memcached', 'cdn', 'performance'],
    capabilities: ['cache-design', 'performance-optimization', 'distributed-caching'],
    tools: ['redis', 'memcached', 'cloudflare', 'aws-cloudfront'],
    frameworks: ['caching-frameworks'],
    languages: ['javascript', 'python', 'go'],
    patterns: ['caching-patterns', 'invalidation-patterns']
  },

  'search-specialist': {
    name: '🔍 Search-Specialist',
    description: 'Search and indexing with Elasticsearch, Solr, and full-text search',
    expertise: ['elasticsearch', 'solr', 'full-text-search', 'indexing', 'search-optimization'],
    capabilities: ['search-implementation', 'indexing', 'query-optimization'],
    tools: ['elasticsearch', 'solr', 'opensearch', 'algolia'],
    frameworks: ['search-frameworks'],
    languages: ['javascript', 'python', 'java'],
    patterns: ['search-patterns', 'indexing-patterns']
  },

  'monitoring-expert': {
    name: '📊 Monitoring-Expert',
    description: 'Application monitoring with Prometheus, Grafana, and observability',
    expertise: ['monitoring', 'prometheus', 'grafana', 'observability', 'alerting'],
    capabilities: ['monitoring-setup', 'alerting', 'performance-tracking'],
    tools: ['prometheus', 'grafana', 'elk-stack', 'datadog', 'new-relic'],
    frameworks: ['monitoring-frameworks'],
    languages: ['yaml', 'javascript', 'python'],
    patterns: ['monitoring-patterns', 'alerting-patterns']
  },

  'performance-engineer': {
    name: '🚀 Performance-Engineer',
    description: 'Backend performance optimization with profiling, caching, and scaling',
    expertise: ['performance-optimization', 'profiling', 'load-testing', 'scaling'],
    capabilities: ['performance-analysis', 'optimization', 'load-testing'],
    tools: ['profilers', 'load-testing-tools', 'monitoring-tools'],
    frameworks: ['performance-frameworks'],
    languages: ['javascript', 'python', 'go', 'java'],
    patterns: ['performance-patterns', 'scaling-patterns']
  }
};

export default tier3Modes;
