// Module access control and configuration
export const MODULES = {
  DASHBOARD: 'dashboard',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings',
  GOVCON_AI_PRO: 'govcon-ai-pro',
  FEMA: 'fema',
  GOV_OPS: 'gov-ops',
  PROCUREMENT_HUB: 'procurement-hub',
} as const;

export type Module = typeof MODULES[keyof typeof MODULES];

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  requiredProduct: string;
  color: string;
  features: string[];
}

export const MODULE_CONFIG: Record<string, ModuleConfig> = {
  [MODULES.GOVCON_AI_PRO]: {
    id: MODULES.GOVCON_AI_PRO,
    name: 'GovCon AI Pro',
    description: 'AI-powered SAM.gov opportunity tracking',
    icon: '🎯',
    path: '/govcon',
    requiredProduct: 'govcon-ai-pro',
    color: 'blue',
    features: [
      'AI-powered opportunity matching',
      'SAM.gov contract tracking',
      'Real-time alerts',
      'Bid management',
      'NAICS code intelligence',
    ],
  },
  [MODULES.FEMA]: {
    id: MODULES.FEMA,
    name: 'FEMA Command Center',
    description: 'Disaster declarations and emergency grants',
    icon: '🚨',
    path: '/fema',
    requiredProduct: 'fema',
    color: 'red',
    features: [
      'Active disaster tracking',
      'Grant opportunity monitoring',
      'State emergency declarations',
      'Assistance type filtering',
      'Real-time FEMA updates',
    ],
  },
  [MODULES.GOV_OPS]: {
    id: MODULES.GOV_OPS,
    name: 'Gov Ops Command Center',
    description: 'Mission tracking and vendor coordination',
    icon: '🏛️',
    path: '/gov-ops',
    requiredProduct: 'gov-ops',
    color: 'purple',
    features: [
      'Multi-state mission tracking',
      'Vendor coordination',
      'Agency intelligence',
      'Budget tracking',
      'Priority management',
    ],
  },
  [MODULES.PROCUREMENT_HUB]: {
    id: MODULES.PROCUREMENT_HUB,
    name: 'Emergency Procurement Hub',
    description: 'Two-sided emergency procurement marketplace',
    icon: '🔥',
    path: '/procurement',
    requiredProduct: 'procurement-hub',
    color: 'orange',
    features: [
      'Agency request posting',
      'Supplier bidding',
      'Real-time matching',
      'Urgent procurement',
      'Bid management',
    ],
  },
};

export function hasModuleAccess(
  userModules: string[],
  requiredModule: string
): boolean {
  const config = MODULE_CONFIG[requiredModule];
  if (!config) return false;
  return userModules.includes(config.requiredProduct);
}

export function getAccessibleModules(userModules: string[]): ModuleConfig[] {
  return Object.values(MODULE_CONFIG).filter((module) =>
    userModules.includes(module.requiredProduct)
  );
}
