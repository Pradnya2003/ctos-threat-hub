const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Get the stored auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('access_token');
  const expiration = localStorage.getItem('token_expiration');
  
  if (!token || !expiration) return null;
  
  // Check if token is expired
  if (new Date().getTime() > parseInt(expiration)) {
    // Clear expired token
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('token_expiration');
    return null;
  }
  
  return token;
};

export interface ThreatActor {
  id: string;
  name: string;
  category: 'Ransomware' | 'Stealer' | 'Initial Access Broker' | 'APT' | 'Botnet' | 'Cryptominer';
  status: 'Active' | 'Inactive' | 'Emerging';
  description: string;
  profileImage: string;
  targetedCountries: string[];
  associatedMalware: string[];
  lastUpdated: string;
}

export interface MalwareFamily {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface CVE {
  id: string;
  cveId: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface IOC {
  id: string;
  value: string;
  type: 'IP' | 'Domain' | 'Hash' | 'URL';
  firstSeen: string;
  lastSeen: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = getAuthToken();
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, clear it and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('token_type');
          localStorage.removeItem('token_expiration');
          window.location.href = '/login';
        }
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Threat Actors
  async getThreatActors(): Promise<ThreatActor[]> {
    return this.fetch<ThreatActor[]>('/api/threat-actors/');
  }

  async getThreatActor(id: string): Promise<ThreatActor> {
    return this.fetch<ThreatActor>(`/api/threat-actors/${id}`);
  }

  async getThreatActorsByCategory(category: string): Promise<ThreatActor[]> {
    return this.fetch<ThreatActor[]>(`/api/threat-actors/category/${category}`);
  }

  async getThreatActorsByStatus(status: string): Promise<ThreatActor[]> {
    return this.fetch<ThreatActor[]>(`/api/threat-actors/status/${status}`);
  }

  // IOCs
  async getIOCs(): Promise<IOC[]> {
    return this.fetch<IOC[]>('/api/iocs/');
  }

  async searchIOCs(query: string): Promise<IOC[]> {
    return this.fetch<IOC[]>(`/api/iocs/search?q=${encodeURIComponent(query)}`);
  }

  async getIOC(id: string): Promise<IOC> {
    return this.fetch<IOC>(`/api/iocs/${id}`);
  }

  async getIOCsByType(type: string): Promise<IOC[]> {
    return this.fetch<IOC[]>(`/api/iocs/type/${type}`);
  }

  // Malware Families
  async getMalwareFamilies(): Promise<MalwareFamily[]> {
    return this.fetch<MalwareFamily[]>('/api/malware-families/');
  }

  async getMalwareFamily(id: string): Promise<MalwareFamily> {
    return this.fetch<MalwareFamily>(`/api/malware-families/${id}`);
  }

  async getMalwareFamiliesByType(type: string): Promise<MalwareFamily[]> {
    return this.fetch<MalwareFamily[]>(`/api/malware-families/type/${type}`);
  }

  // CVEs
  async getCVEs(): Promise<CVE[]> {
    return this.fetch<CVE[]>('/api/cves/');
  }

  async getCVE(id: string): Promise<CVE> {
    return this.fetch<CVE>(`/api/cves/${id}`);
  }

  async getCVEsBySeverity(severity: string): Promise<CVE[]> {
    return this.fetch<CVE[]>(`/api/cves/severity/${severity}`);
  }
}

export const apiClient = new ApiClient();

// Authentication API functions (these don't require auth token)
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    
    return response.json();
  },

  register: (userData: any) => 
    fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(res => res.json()),

  verifyEmail: (token: string) => 
    fetch(`${API_BASE_URL}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).then(res => res.json()),

  getCurrentUser: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get user: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  logout: () => {
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }).then(res => res.json());
  },
};
