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

export const threatActors: ThreatActor[] = [
  {
    id: 'lockbit',
    name: 'LockBit',
    category: 'Ransomware',
    status: 'Active',
    description: 'LockBit is a notorious ransomware-as-a-service (RaaS) operation that has been active since late 2019.',
    profileImage: 'https://app.foresiet.com/img/24.97c9986c.png',
    targetedCountries: ['USA', 'UK', 'Germany', 'France', 'Canada'],
    associatedMalware: ['LockBit 3.0', 'StealBit'],
    lastUpdated: '2026-02-20',
  },
  {
    id: 'lazarus-group',
    name: 'Lazarus Group',
    category: 'APT',
    status: 'Active',
    description: 'A North Korean state-sponsored cyberespionage group active since at least 2009.',
    profileImage: 'https://app.foresiet.com/img/19.dfb70c36.png',
    targetedCountries: ['South Korea', 'USA', 'Japan', 'Vietnam'],
    associatedMalware: ['AppleJeus', 'Manuscrypt'],
    lastUpdated: '2026-02-15',
  },
  {
    id: 'fancy-bear',
    name: 'Fancy Bear',
    category: 'APT',
    status: 'Active',
    description: 'A Russian cyberespionage group associated with the GRU, active since the mid-2000s.',
    profileImage: 'https://app.foresiet.com/img/35.4ab0d7de.png',
    targetedCountries: ['USA', 'Germany', 'Ukraine', 'Georgia'],
    associatedMalware: ['X-Agent', 'Sednit'],
    lastUpdated: '2026-02-10',
  },
  {
    id: 'wizard-spider',
    name: 'Wizard Spider',
    category: 'Ransomware',
    status: 'Active',
    description: 'A Russia-based cybercriminal group behind Ryuk, Conti, and TrickBot.',
    profileImage: 'https://app.foresiet.com/img/21.f53b6bbd.png',
    targetedCountries: ['Global'],
    associatedMalware: ['Ryuk', 'Conti', 'TrickBot'],
    lastUpdated: '2026-02-25',
  },
  {
    id: 'muddydwater',
    name: 'MuddyWater',
    category: 'APT',
    status: 'Emerging',
    description: 'An Iranian threat actor group primarily targeting Middle Eastern nations.',
    profileImage: 'https://app.foresiet.com/img/23.3e2ac0a2.png',
    targetedCountries: ['Saudi Arabia', 'UAE', 'Israel', 'Turkey'],
    associatedMalware: ['POWERSTATS', 'Small Sieve'],
    lastUpdated: '2026-02-22',
  },
  {
    id: 'cl0p',
    name: 'CL0P',
    category: 'Ransomware',
    status: 'Active',
    description: 'A financially motivated threat actor group known for large-scale data theft and extortion.',
    profileImage: 'https://app.foresiet.com/img/16.8933de94.png',
    targetedCountries: ['USA', 'UK', 'Australia', 'Japan'],
    associatedMalware: ['CL0P Ransomware', 'TrueBot'],
    lastUpdated: '2026-02-24',
  },
  {
    id: 'black-cat',
    name: 'BlackCat',
    category: 'Ransomware',
    status: 'Active',
    description: 'Also known as ALPHV, a sophisticated RaaS group utilizing Rust-based malware.',
    profileImage: 'https://app.foresiet.com/img/13.aaec0135.png',
    targetedCountries: ['Global'],
    associatedMalware: ['ALPHV', 'Exmatter'],
    lastUpdated: '2026-02-18',
  },
  {
    id: 'red-echo',
    name: 'RedEcho',
    category: 'APT',
    status: 'Inactive',
    description: 'A Chinese state-sponsored group targeting critical infrastructure in India.',
    profileImage: 'https://app.foresiet.com/img/17.6a68f36f.png',
    targetedCountries: ['India'],
    associatedMalware: ['ShadowPad'],
    lastUpdated: '2025-12-01',
  }
];

export const malwareFamilies: MalwareFamily[] = [
  { id: 'm1', name: 'Emotet', type: 'Botnet', description: 'Advanced modular banking trojan and botnet.' },
  { id: 'm2', name: 'RedLine Stealer', type: 'Stealer', description: 'Popular information stealer sold on underground forums.' },
  { id: 'm3', name: 'Agent Tesla', type: 'Stealer', description: 'A remote access trojan (RAT) and spyware.' },
  { id: 'm4', name: 'Qakbot', type: 'Botnet', description: 'Banking trojan turned multi-purpose delivery platform.' }
];

export const cves: CVE[] = [
  { id: 'CVE-2024-21413', title: 'Microsoft Outlook Remote Code Execution Vulnerability', severity: 'Critical' },
  { id: 'CVE-2023-46604', title: 'Apache ActiveMQ Remote Code Execution', severity: 'Critical' },
  { id: 'CVE-2024-38063', title: 'Windows TCP/IP Remote Code Execution Vulnerability', severity: 'Critical' }
];

export const iocs: IOC[] = [
  { id: 'i1', value: '185.244.25.187', type: 'IP', firstSeen: '2026-01-10', lastSeen: '2026-02-20' },
  { id: 'i2', value: 'update.microsoft-security.com', type: 'Domain', firstSeen: '2026-01-15', lastSeen: '2026-02-22' },
  { id: 'i3', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', type: 'Hash', firstSeen: '2026-02-01', lastSeen: '2026-02-25' }
];
