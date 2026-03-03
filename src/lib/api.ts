// Mock API for UI demonstration
const mockUser = {
  id: 1,
  name: "Admin User",
  email: "admin@inframanager.com",
  role: "Administrator"
};

const mockServers = [
  { id: 1, name: "Production Server", ip_address: "192.168.1.10", provider: "AWS", os_type: "Ubuntu 22.04", project_count: 5 },
  { id: 2, name: "Development Server", ip_address: "192.168.1.11", provider: "DigitalOcean", os_type: "Ubuntu 20.04", project_count: 3 },
  { id: 3, name: "Staging Server", ip_address: "192.168.1.12", provider: "Google Cloud", os_type: "Debian 11", project_count: 2 },
];

const mockProjects = [
  { id: 1, name: "E-Commerce Platform", domain: "shop.example.com", server_name: "Production Server", technology: "Next.js", runtime_version: "Node 18", environment: "Production", status: "Running" },
  { id: 2, name: "Mobile App Backend", domain: "api.mobile.com", server_name: "Production Server", technology: "Node.js", runtime_version: "Node 20", environment: "Production", status: "Running" },
  { id: 3, name: "Analytics Dashboard", domain: "analytics.example.com", server_name: "Development Server", technology: "Python", runtime_version: "Python 3.11", environment: "Development", status: "Maintenance" },
];

const mockLogs = [
  { id: 1, action: "Deploy completed", details: "Server deployment", user_name: "Admin", timestamp: new Date().toISOString() },
  { id: 2, action: "Backup completed", details: "Database backup", user_name: "System", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, action: "Certificate updated", details: "SSL renewal", user_name: "Admin", timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 4, action: "Server restart", details: "Scheduled maintenance", user_name: "System", timestamp: new Date(Date.now() - 10800000).toISOString() },
  { id: 5, action: "User created", details: "New admin user added", user_name: "Admin", timestamp: new Date(Date.now() - 14400000).toISOString() }
];

const mockStats = {
  totalServers: 12,
  activeServers: 10,
  totalProjects: 8,
  activeProjects: 6,
  cpuUsage: 45,
  memoryUsage: 62,
  networkTraffic: 1250,
  storageUsed: 450,
  techStats: [
    { technology: "Node.js", count: 3 },
    { technology: "Python", count: 2 },
    { technology: "Java", count: 2 },
    { technology: "Go", count: 1 }
  ],
  serverDistribution: [
    { server_name: "Prod-01", project_count: 5 },
    { server_name: "Prod-02", project_count: 3 },
    { server_name: "Dev-01", project_count: 4 },
    { server_name: "Stage-01", project_count: 2 }
  ],
  recentLogs: [
    { id: 1, details: "Server deployment", action: "Deploy completed", user_name: "Admin", timestamp: new Date().toISOString() },
    { id: 2, details: "Database backup", action: "Backup completed", user_name: "System", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, details: "SSL renewal", action: "Certificate updated", user_name: "Admin", timestamp: new Date(Date.now() - 7200000).toISOString() }
  ]
};

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { user: mockUser, token: "mock-token-123" };
    },
    me: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockUser;
    }
  },
  servers: {
    list: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockServers;
    },
    create: async (data: any) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id: Date.now(), ...data };
    },
    delete: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
  },
  projects: {
    list: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockProjects;
    },
    create: async (data: any) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id: Date.now(), ...data };
    }
  },
  logs: {
    list: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockLogs;
    }
  },
  stats: {
    get: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockStats;
    }
  }
};
