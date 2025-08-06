// Environment Configuration Service
// Handles both server and client-side environment variable loading

interface EnvironmentConfig {
  // AA API Configuration
  aaApiUsername?: string;
  aaApiPassword?: string;
  aaApiBaseUrl: string;
  
  // Gemini API Configuration
  geminiApiKey?: string;
  
  // Firebase Configuration
  firebaseApiKey?: string;
  firebaseProjectId: string;
  
  // Application Configuration
  nodeEnv: string;
  siteUrl: string;
  isDevMode: boolean;
}

class EnvironmentConfigService {
  private config: EnvironmentConfig;
  private isServer = typeof window === 'undefined';
  
  constructor() {
    this.config = this.loadConfig();
  }
  
  private loadConfig(): EnvironmentConfig {
    if (this.isServer) {
      // Server-side: Use process.env directly
      return {
        aaApiUsername: process.env.AA_API_USERNAME || process.env.AA_USERNAME,
        aaApiPassword: process.env.AA_API_PASSWORD || process.env.AA_PASSWORD,
        aaApiBaseUrl: process.env.AA_API_BASE_URL || 'https://api.aa.com.tr/abone',
        geminiApiKey: process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'haber-a62cf',
        nodeEnv: process.env.NODE_ENV || 'development',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        isDevMode: process.env.NODE_ENV === 'development'
      };
    } else {
      // Client-side: Use hardcoded values (for development only)
      return {
        aaApiUsername: '3010263',
        aaApiPassword: '4WUbxVw9',
        aaApiBaseUrl: 'https://api.aa.com.tr/abone',
        geminiApiKey: 'AIzaSyDLgOamVt9EjmPd-W8YJN8DOxquebT_WI0',
        firebaseApiKey: 'AIzaSyBKwVLWLTgLLfs8V0ptEvwywGoIwxm430A',
        firebaseProjectId: 'haber-a62cf',
        nodeEnv: 'development',
        siteUrl: 'http://localhost:3000',
        isDevMode: true
      };
    }
  }
  
  get aaApiCredentials() {
    return {
      username: this.config.aaApiUsername,
      password: this.config.aaApiPassword,
      baseUrl: this.config.aaApiBaseUrl
    };
  }
  
  get geminiApiKey() {
    return this.config.geminiApiKey;
  }
  
  get firebaseConfig() {
    return {
      apiKey: this.config.firebaseApiKey,
      projectId: this.config.firebaseProjectId
    };
  }
  
  get appConfig() {
    return {
      nodeEnv: this.config.nodeEnv,
      siteUrl: this.config.siteUrl,
      isDevMode: this.config.isDevMode,
      isServer: this.isServer
    };
  }
  
  isConfigured(): boolean {
    const { username, password } = this.aaApiCredentials;
    return !!(username && password && this.config.geminiApiKey);
  }
  
  getConfigStatus() {
    const { username, password, baseUrl } = this.aaApiCredentials;
    
    return {
      aaApi: {
        configured: !!(username && password),
        username: username ? '✅ Loaded' : '❌ Missing',
        password: password ? '✅ Loaded' : '❌ Missing',
        baseUrl: baseUrl ? '✅ Loaded' : '❌ Missing'
      },
      gemini: {
        configured: !!this.config.geminiApiKey,
        apiKey: this.config.geminiApiKey ? '✅ Loaded' : '❌ Missing'
      },
      firebase: {
        configured: !!this.config.firebaseApiKey,
        apiKey: this.config.firebaseApiKey ? '✅ Loaded' : '❌ Missing',
        projectId: this.config.firebaseProjectId ? '✅ Loaded' : '❌ Missing'
      },
      environment: {
        isServer: this.isServer,
        nodeEnv: this.config.nodeEnv,
        isDevMode: this.config.isDevMode
      }
    };
  }
}

export const environmentConfig = new EnvironmentConfigService();
export type { EnvironmentConfig };
