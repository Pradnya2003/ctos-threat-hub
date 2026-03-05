export interface TelegramDetection {
  id: string;
  title: string;
  threatActor: string;
  category: 'Defacement' | 'DDoS' | 'Data Breach' | 'Malware' | 'Alert';
  date: string;
  victimCountry: string;
  victimIndustry: string;
  contentPreview: string;
  fullContent: string;
  telegramUrl: string;
}

export const telegramDetections: TelegramDetection[] = [
  {
    id: 'td-1',
    title: 'Website Defacement Campaign Targeting Government Entities',
    threatActor: 'Anonymous Sudan',
    category: 'Defacement',
    date: '2026-02-25',
    victimCountry: 'Sweden',
    victimIndustry: 'Government',
    contentPreview: 'Multiple government portals reported being inaccessible or showing unauthorized content...',
    fullContent: 'Multiple government portals reported being inaccessible or showing unauthorized content. The group claimed responsibility on their Telegram channel, citing political motives.',
    telegramUrl: 't.me/anon_sudan_official/1234'
  },
  {
    id: 'td-2',
    title: 'Massive DDoS Attack on Financial Infrastructure',
    threatActor: 'KillNet',
    category: 'DDoS',
    date: '2026-02-24',
    victimCountry: 'USA',
    victimIndustry: 'Finance',
    contentPreview: 'Significant disruption detected across major banking applications following a call to action...',
    fullContent: 'Significant disruption detected across major banking applications following a call to action. Layer 7 DDoS attacks were observed peaking at 2M RPS.',
    telegramUrl: 't.me/killnet_reserv/567'
  },
  {
    id: 'td-3',
    title: 'Large Scale Data Breach Leak: Healthcare Records',
    threatActor: 'SiegedSec',
    category: 'Data Breach',
    date: '2026-02-23',
    victimCountry: 'UK',
    victimIndustry: 'Healthcare',
    contentPreview: 'A archive containing over 50,000 patient records was posted for download...',
    fullContent: 'A archive containing over 50,000 patient records was posted for download. The data includes PII, medical history, and contact information.',
    telegramUrl: 't.me/siegedsec_news/890'
  },
  {
    id: 'td-4',
    title: 'New Malware Strain Distribution via Automated Bot',
    threatActor: 'Lazarus Group',
    category: 'Malware',
    date: '2026-02-22',
    victimCountry: 'South Korea',
    victimIndustry: 'Technology',
    contentPreview: 'Detection of a new modular trojan being distributed through fake software update links...',
    fullContent: 'Detection of a new modular trojan being distributed through fake software update links. The malware uses advanced obfuscation to bypass EDR.',
    telegramUrl: 't.me/laz_sec_bot/12'
  },
  {
    id: 'td-5',
    title: 'Critical Vulnerability Alert: 0-day in Popular VPN',
    threatActor: 'IntelBroker',
    category: 'Alert',
    date: '2026-02-21',
    victimCountry: 'Global',
    victimIndustry: 'Multiple',
    contentPreview: 'Early warning regarding an unpatched remote code execution vulnerability being traded...',
    fullContent: 'Early warning regarding an unpatched remote code execution vulnerability being traded. Active exploitation has been observed in the wild.',
    telegramUrl: 't.me/intel_broker_chat/44'
  },
  {
    id: 'td-6',
    title: 'Defacement of Energy Sector Infrastructure',
    threatActor: 'OilRig',
    category: 'Defacement',
    date: '2026-02-20',
    victimCountry: 'Israel',
    victimIndustry: 'Energy',
    contentPreview: 'Industrial control system interfaces reportedly showing political messages...',
    fullContent: 'Industrial control system interfaces reportedly showing political messages. No disruption to physical operations reported yet.',
    telegramUrl: 't.me/oilrig_ops/88'
  },
  {
    id: 'td-7',
    title: 'Customer Data Leak: E-commerce Platform',
    threatActor: 'ShinyHunters',
    category: 'Data Breach',
    date: '2026-02-19',
    victimCountry: 'Brazil',
    victimIndustry: 'Retail',
    contentPreview: 'Over 1 million customer profiles including hashed passwords and addresses...',
    fullContent: 'Over 1 million customer profiles including hashed passwords and addresses were leaked after the platform failed to secure a S3 bucket.',
    telegramUrl: 't.me/shiny_hunters_leaks/332'
  }
];
