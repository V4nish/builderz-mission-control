/**
 * Vanish Labs Configuration
 * Customizations for Vanish Labs infrastructure and services
 */

export const vanishLabsConfig = {
  // Organization info
  organization: {
    name: 'Vanish Labs',
    tagline: 'AI-powered solutions for education and wellness',
    website: 'https://vanishlabs.uk',
    location: 'South Wales, UK',
  },

  // Infrastructure
  infrastructure: {
    primary: {
      name: 'OpenClaw Host',
      type: 'local',
      description: 'Primary OpenClaw Gateway + Agent Runtime',
    },
    remote: {
      name: 'vanish-pub1',
      type: 'vps',
      host: '89.167.101.65',
      user: 'vlabs',
      description: 'Hetzner CX32 - Production Apps Server',
      location: 'Helsinki, Finland',
    }
  },

  // Our services/applications
  services: [
    {
      name: 'GroundedMe',
      description: 'Bipolar mood tracking iOS app',
      url: 'https://groundedme.app',
      status: 'development',
      priority: 'high',
      category: 'mobile',
    },
    {
      name: 'Cefnogi',
      description: 'AI coaching + wellness platform for Elevate Community',
      url: 'https://portal.vanishlabs.uk',
      port: 3022,
      pm2Name: 'cefnogi',
      status: 'live',
      priority: 'high',
      category: 'webapp',
    },
    {
      name: 'cf6.co.uk',
      description: 'Vale of Glamorgan local data dashboard',
      url: 'https://cf6.co.uk',
      port: 3010,
      pm2Name: 'cf6',
      status: 'live',
      priority: 'medium',
      category: 'webapp',
    },
    {
      name: 'Umami Analytics',
      description: 'Self-hosted analytics for all sites',
      url: 'https://analytics.vanishlabs.uk',
      port: 3025,
      pm2Name: 'umami',
      status: 'live',
      priority: 'low',
      category: 'internal',
    },
    {
      name: 'Pain Diary App',
      description: 'Chronic pain tracker (sister app to GroundedMe)',
      status: 'research',
      priority: 'medium',
      category: 'mobile',
    },
  ],

  // Monitoring targets
  monitoring: {
    urls: [
      'https://cf6.co.uk',
      'https://portal.vanishlabs.uk',
      'https://vanishlabs.uk',
      'https://groundedme.app',
    ],
    pm2Services: ['cefnogi', 'cf6', 'umami', 'mission-control'],
    healthcheckInterval: 300, // 5 minutes
  },

  // Business metrics we care about
  businessMetrics: [
    {
      name: 'GroundedMe Downloads',
      description: 'iOS App Store downloads',
      source: 'manual', // TODO: App Store Connect API
    },
    {
      name: 'Cefnogi Signups',
      description: 'New user registrations',
      source: 'database',
    },
    {
      name: 'cf6 Monthly Users',
      description: 'Unique visitors per month',
      source: 'umami',
    },
  ],

  // Team
  team: [
    {
      name: 'Lyndon Watkins',
      role: 'Founder & CTO',
      responsibilities: ['Product Development', 'Infrastructure', 'Teaching'],
    },
    {
      name: 'Kantz',
      role: 'Project Director (Elevate)',
      responsibilities: ['Business Development', 'Partnerships', 'Strategy'],
    },
  ],
}

export type VanishService = typeof vanishLabsConfig.services[0]
export type VanishInfrastructure = typeof vanishLabsConfig.infrastructure[keyof typeof vanishLabsConfig.infrastructure]