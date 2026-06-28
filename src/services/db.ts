/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  User, 
  Profile, 
  Device, 
  Plan, 
  Subscription, 
  Payment, 
  SupportTicket, 
  Message, 
  Notification, 
  BlogPost, 
  FAQ, 
  ActivityLog,
  Institution
} from '../types';

const DEFAULT_PLANS: Plan[] = [
  {
    id: 'basic-plan',
    name: 'Basic Cover',
    price: 20,
    billing_cycle: 'semester',
    description: 'Essential software support and fault diagnosis for one academic device.',
    max_devices: 1,
    status: 'active',
    features: [
      'Software installation for the semester (1 registered device)',
      'Free diagnosis for hardware faults',
      'Repair coordination'
    ]
  },
  {
    id: 'premium-plan',
    name: 'Premium Shield',
    price: 50,
    billing_cycle: 'semester',
    description: 'Priority hardware labor coverage and personal web building package.',
    max_devices: 1,
    status: 'active',
    features: [
      'All Basic Cover features included',
      'Free technician repair labor always',
      'Free portfolio or personal website per semester'
    ]
  },
  {
    id: 'bonanza-plan',
    name: 'Bonanza Plan',
    price: 120,
    billing_cycle: 'semester',
    description: 'All-inclusive organizational protection with multiple devices and custom business web setups.',
    max_devices: 3,
    status: 'active',
    features: [
      'All Basic & Premium features included',
      'Business website setup (up to 5 pages)',
      'Free tech consultations for the semester',
      'Domain and hosting support',
      'Monthly maintenance and health checks',
      'Up to three registered devices covered'
    ]
  }
];

const DEFAULT_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'How does StudentShield work?',
    answer: 'StudentShield is a tech support subscription. University students subscribe to either our Basic or Premium semester plan. Once covered, you can open digital tickets for any device issues (slow laptop, virus, software install errors), bring your device to our campus support hub, and get diagnostic/repair assistance free of charge.'
  },
  {
    id: 'faq-2',
    category: 'Pricing',
    question: 'Is the billing automatic or semester-based?',
    answer: 'It is semester-based! We understand student budgets. You pay a single payment of GH₵20 (Basic) or GH₵50 (Premium) for the entire semester. No automatic recurring surprises.'
  },
  {
    id: 'faq-3',
    category: 'Hardware',
    question: 'Does the GH₵50 tier pay for broken spare parts?',
    answer: 'The Premium plan covers complete diagnostic evaluation, device cleaning, operating system setups, and labor fees for replacing components. If you need physical hardware replacement parts (like a new laptop screen or battery), you only pay the direct parts cost from our certified supplier; our technician labor charge is completely covered under your Premium Shield plan.'
  },
  {
    id: 'faq-4',
    category: 'Campus Support',
    question: 'Where can I find StudentShield technicians on campus?',
    answer: 'We operate support boots at central campus locations (typically near the Main Library and Science Complex). Our technicians are available Monday to Saturday from 8:00 AM to 5:00 PM.'
  },
  {
    id: 'faq-5',
    category: 'Devices Coverage',
    question: 'How many devices can I register under my plan?',
    answer: 'Each semester plan covers one primary academic device (laptop or desktop). You can register additional secondary devices (like a tablet or smartphone) for an extra GH₵5 per semester.'
  }
];

const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: '5 Crucial Steps to Protect Your Academic Laptop from Viruses',
    slug: 'protect-academic-laptop-viruses',
    excerpt: 'Losing your class essays or thesis file is a nightmare. Read these quick security guidelines to keep your system clean and protected on open university network hotspots.',
    category: 'security',
    author: 'Daniel Amegashie, Senior CyberSec Lead',
    read_time: '4 min read',
    image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    created_at: '2026-05-18T10:00:00Z',
    content: `University networks are highly target-rich environments for malware and adware vectors. Because thousands of students share access points, malware can propagate horizontally inside subnetworks.

Here are the critical measures to ensure safety:
1. **Disable Public Sharing**: Always ensure that "network sharing" is disabled in your system adapter settings.
2. **Setup a Standard Account**: Avoid running your notebook continuously on the "Administrator account". Creating a normal user profile prevents software from silently writing to system directories.
3. **Equip Managed Antivirus**: Standard Windows Defender works beautifully when updated daily.
4. **Backup, Backup, Backup**: Sync your "Documents" and "Desktop" folders to trusted cloud storage or a secondary flash disk.
5. **Beware of Crack Software**: Downloading unauthorized activations for software packages like MS Office is the primary delivery channel for malicious infostealers.`
  },
  {
    id: 'blog-2',
    title: 'Boost Windows 11 Load Performance on Older Student Laptops',
    slug: 'boost-windows-11-load-performance',
    excerpt: 'Is your laptop taking ages to start during a lecture? Try these simple, safe optimizations designed to clean background workloads and speed up responsiveness.',
    category: 'tips',
    author: 'Kofi Boateng, System Diagnostic Architect',
    read_time: '5 min read',
    image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
    created_at: '2026-05-20T14:30:00Z',
    content: `We frequently see laptops at our hub that are perfectly fine hardwarewise but severely choked by startup items. 

Simple, step-by-step optimizations to execute today:
- **Triage Task Manager Startup Apps**: Press Ctrl + Shift + Esc, head to Startup Apps, and disable unnecessary services like Spotify, Steam, or helper update engines.
- **Perform Storage Sense Cleanups**: Activate Windows Storage Sense to automatically erase temporary files and old cached browser structures.
- **Defragment and Optimize Drive**: If you are still running a traditional spinning hard drive (HDD), search "Defragment and Optimize Drives" to index files properly. If on SSD, optimization triggers standard TRIM controls to maintain top write speeds.`
  },
  {
    id: 'blog-3',
    title: 'The Student Hardware Guide: Upgrading RAM vs. Buying New Laptop',
    slug: 'upgrading-ram-vs-buying-new-laptop',
    excerpt: 'Do you really need to dump GH₵5,000 on a brand new notebook, or will a GH₵250 solid state drive upgrade rejuvenate it? Let us calculate the value math.',
    category: 'support',
    author: 'Amina Osei, Electronics Hardware Desk',
    read_time: '6 min read',
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
    created_at: '2026-05-22T09:15:00Z',
    content: `Academic workloads are increasing, with demanding web apps running alongside complex spreadsheets and PDF viewers. Many students believe a slow notebook requires a total hardware replacement. 

However, we find that 85% of underperforming legacy notebooks have two massive bottlenecks: a traditional mechanical HDD and insufficient RAM (4GB or 8GB).

**Why SSD is a Game Changer**: Traditional HDDs read data at ~100 MB/s. Modern SATA SSDs read at ~500 MB/s, and NVMe SSDs read up to ~3000 MB/s. Boot time drops from 3 minutes to under 15 seconds!

**The RAM Sweet Spot**: Upgrading from 8GB to 16GB ensures you can run Chrome tabs, Zoom sessions, and Word files concurrently without the OS engaging slow disk pagefile swap techniques.`
  }
];

class StudentShieldDB {
  private initLocalStorage() {
    if (!localStorage.getItem('ss_institutions')) {
      const defaultInstitutions: Institution[] = [
        { id: 'inst-ug', name: 'University of Ghana (Legon)', short_name: 'UG', location: 'Accra', created_at: new Date().toISOString() },
        { id: 'inst-knust', name: 'KNUST', short_name: 'KNUST', location: 'Kumasi', created_at: new Date().toISOString() },
        { id: 'inst-ashesi', name: 'Ashesi University', short_name: 'Ashesi', location: 'Berekuso', created_at: new Date().toISOString() }
      ];
      localStorage.setItem('ss_institutions', JSON.stringify(defaultInstitutions));
    }

    const plansStr = localStorage.getItem('ss_plans');
    const hasBonanza = plansStr && plansStr.includes('bonanza-plan');

    if (!localStorage.getItem('ss_initialized') || !hasBonanza) {
      const users: User[] = [
        { id: 'usr-student-1', email: 'student@university.edu', role: 'student', created_at: new Date().toISOString() },
        { id: 'usr-student-2', email: 'knust@university.edu', role: 'student', created_at: new Date().toISOString() },
        { id: 'usr-student-3', email: 'ashesi@university.edu', role: 'student', created_at: new Date().toISOString() },
        { id: 'usr-support-1', email: 'support@studentshield.com', role: 'support_agent', created_at: new Date().toISOString() },
        { id: 'usr-admin-1', email: 'admin@studentshield.com', role: 'admin', created_at: new Date().toISOString() }
      ];

      const profiles: Profile[] = [
        {
          id: 'prof-student-1',
          user_id: 'usr-student-1',
          full_name: 'Emmanuel Boateng Mills',
          university: 'University of Ghana (Legon)',
          student_id: 'UG-10928374',
          phone: '+233 24 412 3456',
          avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
          created_at: new Date().toISOString()
        },
        {
          id: 'prof-student-2',
          user_id: 'usr-student-2',
          full_name: 'Kofi Boateng Mensah',
          university: 'KNUST',
          student_id: 'KN-9923812',
          phone: '+233 27 555 8899',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          created_at: new Date().toISOString()
        },
        {
          id: 'prof-student-3',
          user_id: 'usr-student-3',
          full_name: 'Abena Serwaa Osei',
          university: 'Ashesi University',
          student_id: 'AS-881237',
          phone: '+233 20 888 7766',
          avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
          created_at: new Date().toISOString()
        },
        {
          id: 'prof-support-1',
          user_id: 'usr-support-1',
          full_name: 'David Boateng Agent',
          university: 'StudentShield Hub HQ',
          student_id: 'SS-AGENT-01',
          phone: '+233 24 555 1212',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          created_at: new Date().toISOString()
        },
        {
          id: 'prof-admin-1',
          user_id: 'usr-admin-1',
          full_name: 'Ato Kwamena Support',
          university: 'StudentShield Hub HQ',
          student_id: 'SS-TECH-01',
          phone: '+233 20 111 0000',
          avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
          created_at: new Date().toISOString()
        }
      ];

      const devices: Device[] = [
        {
          id: 'dev-1',
          user_id: 'usr-student-1',
          name: 'Asus ZenBook 14 OLED',
          type: 'laptop',
          brand: 'Asus',
          model: 'UM3402',
          serial_number: 'SN-ASUS-99238-Z',
          operating_system: 'Windows 11 Education',
          image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80',
          status: 'active',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'dev-2',
          user_id: 'usr-student-1',
          name: 'Academic Samsung Tablet',
          type: 'tablet',
          brand: 'Samsung',
          model: 'Galaxy Tab S8',
          serial_number: 'SN-SEC-TAB8831',
          operating_system: 'Android 13',
          image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80',
          status: 'unprotected',
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'dev-3',
          user_id: 'usr-student-2',
          name: 'HP Pavilion 15',
          type: 'laptop',
          brand: 'HP',
          model: '15-eg2000',
          serial_number: 'SN-HP-883921-X',
          operating_system: 'Windows 11 Home',
          image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80',
          status: 'active',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'dev-4',
          user_id: 'usr-student-3',
          name: 'MacBook Air M2',
          type: 'laptop',
          brand: 'Apple',
          model: 'A2681',
          serial_number: 'SN-APPLE-M2-8812',
          operating_system: 'macOS Sonoma',
          image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80',
          status: 'active',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const subscriptions: Subscription[] = [
        {
          id: 'sub-1',
          user_id: 'usr-student-1',
          plan_id: 'premium-plan',
          status: 'active',
          start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'sub-2',
          user_id: 'usr-student-2',
          plan_id: 'basic-plan',
          status: 'active',
          start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 110 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'sub-3',
          user_id: 'usr-student-3',
          plan_id: 'bonanza-plan',
          status: 'active',
          start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 115 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const payments: Payment[] = [
        {
          id: 'pay-1',
          user_id: 'usr-student-1',
          subscription_id: 'sub-1',
          amount: 50,
          currency: 'GHS',
          status: 'successful',
          payment_method: 'Mobile Money (MTN)',
          transaction_ref: 'TXN-MM-892837482',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'pay-2',
          user_id: 'usr-student-2',
          subscription_id: 'sub-2',
          amount: 20,
          currency: 'GHS',
          status: 'successful',
          payment_method: 'Mobile Money (Telecel)',
          transaction_ref: 'TXN-MM-123456789',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'pay-3',
          user_id: 'usr-student-3',
          subscription_id: 'sub-3',
          amount: 120,
          currency: 'GHS',
          status: 'successful',
          payment_method: 'Mobile Money (AT)',
          transaction_ref: 'TXN-MM-987654321',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const tickets: SupportTicket[] = [
        {
          id: 'tick-1',
          user_id: 'usr-student-1',
          device_id: 'dev-1',
          title: 'Constant Blue Screen (BSOD) after update',
          description: 'Getting a "KERNEL_SECURITY_CHECK_FAILURE" error every time I plug in my phone via USB. I cannot complete my programming assignment on visual studio code.',
          category: 'software',
          priority: 'high',
          status: 'in_progress',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'tick-2',
          user_id: 'usr-student-1',
          device_id: 'dev-1',
          title: 'Request thermal cleaning and diagnostic report',
          description: 'My Asus notebook fan is spinning extremely loud and the keyboard is warm during light typing. Requesting a hardware physical checkup.',
          category: 'diagnostic',
          priority: 'low',
          status: 'resolved',
          created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const messages: Message[] = [
        {
          id: 'msg-1',
          ticket_id: 'tick-1',
          sender_id: 'usr-student-1',
          sender_role: 'student',
          content: 'My notebook keeps restarting during research. Can I bring it today?',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-2',
          ticket_id: 'tick-1',
          sender_id: 'usr-admin-1',
          sender_role: 'admin',
          content: 'Hi Emmanuel, certainly! Please back up your active work and visit Booth 2 at the Legon Library. Our technician Kofi can trace the driver kernel mismatch. It is covered fully on your Premium Shield.',
          created_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-3',
          ticket_id: 'tick-2',
          sender_id: 'usr-student-1',
          sender_role: 'student',
          content: 'Thermal dust removal works amazing now, fan noise has dropped dramatically. Thank you!',
          created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-4',
          ticket_id: 'tick-2',
          sender_id: 'usr-admin-1',
          sender_role: 'admin',
          content: 'Wonderful! Glad to have verified and cleaned your system. We will mark this diagnostic checkup resolved.',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const notifications: Notification[] = [
        {
          id: 'notif-1',
          user_id: 'usr-student-1',
          title: 'Ticket #tick-1 Updated',
          content: 'Technician assigned a priority check to your device driver issue.',
          type: 'success',
          is_read: false,
          created_at: new Date().toISOString()
        },
        {
          id: 'notif-2',
          user_id: 'usr-student-1',
          title: 'Welcome to StudentShield Premium!',
          content: 'Your laptop is now shields-up with Premium cover for 120 days of semester protection.',
          type: 'info',
          is_read: true,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const logs: ActivityLog[] = [
        {
          id: 'log-1',
          user_id: 'usr-student-1',
          action: 'Login',
          details: 'Logged into StudentShield application client.',
          created_at: new Date().toISOString()
        },
        {
          id: 'log-2',
          user_id: 'usr-student-1',
          action: 'Subscription Creation',
          details: 'Purchased Premium Shield subscription GH₵50 via MTN Mobile Money.',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      localStorage.setItem('ss_users', JSON.stringify(users));
      localStorage.setItem('ss_profiles', JSON.stringify(profiles));
      localStorage.setItem('ss_devices', JSON.stringify(devices));
      localStorage.setItem('ss_subscriptions', JSON.stringify(subscriptions));
      localStorage.setItem('ss_payments', JSON.stringify(payments));
      localStorage.setItem('ss_tickets', JSON.stringify(tickets));
      localStorage.setItem('ss_messages', JSON.stringify(messages));
      localStorage.setItem('ss_notifications', JSON.stringify(notifications));
      localStorage.setItem('ss_logs', JSON.stringify(logs));
      localStorage.setItem('ss_plans', JSON.stringify(DEFAULT_PLANS));
      localStorage.setItem('ss_faqs', JSON.stringify(DEFAULT_FAQS));
      localStorage.setItem('ss_blogs', JSON.stringify(DEFAULT_BLOGS));

      // active session
      localStorage.setItem('ss_current_user_id', 'usr-student-1');
      localStorage.setItem('ss_initialized', 'true');
    }
  }

  constructor() {
    this.initLocalStorage();
  }

  // Generic Getter/Setter helpers
  public getTable<T>(key: string): T[] {
    this.initLocalStorage();
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  public setTable<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Helper to query backend or fall back to local mocks
  private async apiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn(`Fetch to ${endpoint} failed, continuing in offline mock mode.`);
    }
    return null;
  }

  // AUTH API
  public getCurrentUser(): { user: User; profile: Profile } | null {
    const currentUserId = localStorage.getItem('ss_current_user_id');
    if (!currentUserId) return null;

    const users = this.getTable<User>('ss_users');
    const profiles = this.getTable<Profile>('ss_profiles');

    const user = users.find(u => u.id === currentUserId);
    const profile = profiles.find(p => p.user_id === currentUserId);

    if (user && profile) {
      return { user, profile };
    }
    return null;
  }

  public login(emailOrPhone: string): { user: User; profile: Profile } | null {
    const users = this.getTable<User>('ss_users');
    const profiles = this.getTable<Profile>('ss_profiles');
    const searchVal = emailOrPhone.toLowerCase().trim();

    let matched = users.find(u => u.email.toLowerCase() === searchVal);
    if (!matched) {
      const normalizedInp = searchVal.replace(/[\s+-]/g, "");
      if (normalizedInp) {
        const matchedProfile = profiles.find(p => {
          const normalizedPhone = p.phone ? p.phone.replace(/[\s+-]/g, "") : "";
          return normalizedPhone === normalizedInp || (p.phone && p.phone.toLowerCase().trim() === searchVal);
        });
        if (matchedProfile) {
          matched = users.find(u => u.id === matchedProfile.user_id);
        }
      }
    }

    if (!matched) return null;

    localStorage.setItem('ss_current_user_id', matched.id);
    this.createActivityLog(matched.id, 'Authentication', `Logged in as ${matched.email}`);

    const profile = profiles.find(p => p.user_id === matched.id) || {
      id: `prof-${matched.id}`,
      user_id: matched.id,
      full_name: matched.email.split('@')[0],
      university: 'University of Ghana (Legon)',
      student_id: 'N/A',
      phone: 'N/A',
      created_at: new Date().toISOString()
    };

    return { user: matched, profile };
  }

  public signUp(data: {
    email: string;
    fullName: string;
    university: string;
    studentId: string;
    phone: string;
    gender?: string;
    role?: 'student' | 'admin';
  }): { user: User; profile: Profile } {
    const users = this.getTable<User>('ss_users');
    const profiles = this.getTable<Profile>('ss_profiles');

    const newUserId = `usr-${Math.random().toString(36).substring(2, 9)}`;
    const newUser: User = {
      id: newUserId,
      email: data.email.toLowerCase().trim(),
      role: data.role || 'student',
      created_at: new Date().toISOString()
    };

    const newProfile: Profile = {
      id: `prof-${Math.random().toString(36).substring(2, 9)}`,
      user_id: newUserId,
      full_name: data.fullName,
      university: data.university,
      student_id: data.studentId || `TBD-${Math.floor(100000 + Math.random() * 900000)}`,
      phone: data.phone,
      gender: data.gender || 'Not specified',
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.fullName)}`,
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    profiles.push(newProfile);

    this.setTable('ss_users', users);
    this.setTable('ss_profiles', profiles);

    localStorage.setItem('ss_current_user_id', newUserId);
    this.createActivityLog(newUserId, 'Registration', `Registered user with email ${newUser.email}`);
    this.createNotification(newUserId, 'Account Created', `Welcome to StudentShield ${data.fullName}! Complete your setup securely.`, 'info');

    return { user: newUser, profile: newProfile };
  }

  public loginSession(user: User, profile: Profile) {
    const users = this.getTable<User>('ss_users');
    if (!users.some(u => u.id === user.id)) {
      users.push(user);
      this.setTable('ss_users', users);
    }

    const profiles = this.getTable<Profile>('ss_profiles');
    if (!profiles.some(p => p.id === profile.id)) {
      profiles.push(profile);
      this.setTable('ss_profiles', profiles);
    }

    localStorage.setItem('ss_current_user_id', user.id);
  }

  public logout() {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.createActivityLog(currentUser.user.id, 'Authentication', 'Logged out safely.');
    }
    localStorage.removeItem('ss_current_user_id');
  }

  public updateProfile(fullName: string, phone: string, university: string): Profile | null {
    const session = this.getCurrentUser();
    if (!session) return null;

    const profiles = this.getTable<Profile>('ss_profiles');
    const idx = profiles.findIndex(p => p.user_id === session.user.id);

    if (idx !== -1) {
      profiles[idx].full_name = fullName;
      profiles[idx].phone = phone;
      profiles[idx].university = university;
      this.setTable('ss_profiles', profiles);
      this.createActivityLog(session.user.id, 'Profile Update', 'Updated contact parameters.');
      return profiles[idx];
    }
    return null;
  }

  // DEVICES API
  public getDevices(): Device[] {
    const session = this.getCurrentUser();
    if (!session) return [];

    const all = this.getTable<Device>('ss_devices');
    if (session.user.role === 'admin' || session.user.role === 'support_agent') {
      return all;
    }
    return all.filter(d => d.user_id === session.user.id);
  }

  public registerDevice(data: {
    name: string;
    type: string;
    brand: string;
    model: string;
    serialNumber: string;
    operatingSystem: string;
    image_url?: string;
    video_url?: string;
    device_images?: string[];
    custom_fields?: { label: string; value: string }[];
  }): Device | null {
    const session = this.getCurrentUser();
    if (!session) return null;

    const devices = this.getTable<Device>('ss_devices');
    const newDevice: Device = {
      id: `dev-${Math.random().toString(36).substring(2, 9)}`,
      user_id: session.user.id,
      name: data.name,
      type: data.type,
      brand: data.brand,
      model: data.model,
      serial_number: data.serialNumber,
      operating_system: data.operatingSystem,
      status: 'active',
      image_url: data.image_url || this.getDeviceFallbackImage(data.type),
      video_url: data.video_url,
      device_images: data.device_images,
      custom_fields: data.custom_fields,
      created_at: new Date().toISOString()
    };

    devices.push(newDevice);
    this.setTable('ss_devices', devices);

    this.createActivityLog(session.user.id, 'Device Registration', `Added ${data.name} to diagnostics dashboard.`);
    this.createNotification(session.user.id, 'Device Registered', `${data.name} is now registered in our system repository.`, 'success');



    return newDevice;
  }

  public updateDevice(deviceId: string, data: Partial<Device>): boolean {
    const devices = this.getTable<Device>('ss_devices');
    const idx = devices.findIndex(d => d.id === deviceId);
    if (idx !== -1) {
      devices[idx] = { ...devices[idx], ...data };
      this.setTable('ss_devices', devices);
      
      this.createActivityLog(devices[idx].user_id, 'Device Update', `Updated specs for device ${devices[idx].name}`);
      this.createNotification(devices[idx].user_id, 'Device Details Updated', `Your device specifications for ${devices[idx].name} were successfully adjusted.`, 'info');
      return true;
    }
    return false;
  }

  public deleteDevice(deviceId: string): boolean {
    const devices = this.getTable<Device>('ss_devices');
    const initialLen = devices.length;
    const targetDevice = devices.find(d => d.id === deviceId);
    const filtered = devices.filter(d => d.id !== deviceId);
    if (filtered.length < initialLen) {
      this.setTable('ss_devices', filtered);
      if (targetDevice) {
        this.createActivityLog(targetDevice.user_id, 'Device Removal', `Removed device ${targetDevice.name} from logs.`);
        this.createNotification(targetDevice.user_id, 'Device De-registered', `Your device ${targetDevice.name} has been removed from coverage logs.`, 'warning');
      }
      return true;
    }
    return false;
  }

  private getDeviceFallbackImage(type: string): string {
    switch (type) {
      case 'laptop':
        return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80';
      case 'tablet':
        return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80';
      case 'phone':
        return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80';
      default:
        return 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=300&q=80';
    }
  }

  public updateDeviceStatus(deviceId: string, status: Device['status']): void {
    const devices = this.getTable<Device>('ss_devices');
    const idx = devices.findIndex(d => d.id === deviceId);
    if (idx !== -1) {
      devices[idx].status = status;
      this.setTable('ss_devices', devices);
      
      this.createNotification(
        devices[idx].user_id,
        'Device Status Update',
        `Your device "${devices[idx].name}" diagnostics status changed to: ${status.toUpperCase().replace('_', ' ')}`,
        'info'
      );
    }
  }

  // SUBSCRIPTIONS
  public getSubscription(): Subscription | null {
    const session = this.getCurrentUser();
    if (!session) return null;

    const subs = this.getTable<Subscription>('ss_subscriptions');
    return subs.find(s => s.user_id === session.user.id && (s.status === 'active' || s.status === 'suspended')) || null;
  }

  public purchasePlan(planId: string, paymentMethod: string): { subscription: Subscription; payment: Payment } | null {
    const session = this.getCurrentUser();
    if (!session) return null;

    const plans = this.getPlans();
    const plan = plans.find(p => p.id === planId);
    if (!plan) return null;

    const subs = this.getTable<Subscription>('ss_subscriptions');
    const filteredSubs = subs.map(s => {
      if (s.user_id === session.user.id) {
        return { ...s, status: 'cancelled' as const };
      }
      return s;
    });

    const newSubId = `sub-${Math.random().toString(36).substring(2, 9)}`;
    const newSub: Subscription = {
      id: newSubId,
      user_id: session.user.id,
      plan_id: planId,
      status: 'active',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    };

    filteredSubs.push(newSub);
    this.setTable('ss_subscriptions', filteredSubs);

    const payments = this.getTable<Payment>('ss_payments');
    const newPayment: Payment = {
      id: `pay-${Math.random().toString(36).substring(2, 9)}`,
      user_id: session.user.id,
      subscription_id: newSubId,
      amount: plan.price,
      currency: 'GHS',
      status: 'successful',
      payment_method: paymentMethod,
      transaction_ref: `TXN-MM-${Math.floor(100000000 + Math.random() * 900000000)}`,
      created_at: new Date().toISOString()
    };

    payments.push(newPayment);
    this.setTable('ss_payments', payments);

    this.createActivityLog(session.user.id, 'Subscription Purchase', `Created coverage for ${plan.name} plan via ${paymentMethod}.`);
    this.createNotification(session.user.id, 'Cover Active!', `Subscription initiated under plan level: ${plan.name}.`, 'success');

    return { subscription: newSub, payment: newPayment };
  }

  public activateSubscription(
    subscriptionId: string,
    userId: string,
    planId: string,
    amount: number,
    reference: string,
    paymentMethod: string
  ): void {
    const subs = this.getTable<Subscription>('ss_subscriptions');
    const idx = subs.findIndex(s => s.id === subscriptionId);
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 120); // standard semester length

    if (idx !== -1) {
      subs[idx].status = 'active';
      subs[idx].start_date = new Date().toISOString();
      subs[idx].end_date = expiryDate.toISOString();
      this.setTable('ss_subscriptions', subs);
    } else {
      subs.push({
        id: subscriptionId,
        user_id: userId,
        plan_id: planId,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: expiryDate.toISOString(),
        created_at: new Date().toISOString()
      });
      this.setTable('ss_subscriptions', subs);
    }

    // Record payment
    const payments = this.getTable<Payment>('ss_payments');
    if (!payments.some(p => p.transaction_ref === reference)) {
      payments.push({
        id: `pay-${Math.random().toString(36).substring(2, 9)}`,
        user_id: userId,
        subscription_id: subscriptionId,
        amount,
        currency: 'GHS',
        status: 'successful',
        payment_method: paymentMethod,
        transaction_ref: reference,
        created_at: new Date().toISOString()
      });
      this.setTable('ss_payments', payments);
    }

    // Create welcoming notification
    this.createNotification(
      userId,
      'Subscription Shield ACTIVE',
      'Welcome to campus protection. Register your protected laptop details now to secure full diagnostic coverage!',
      'success'
    );

    // Record audit logs
    this.createActivityLog(
      userId,
      'Coverage Activated',
      `Paystack transaction validated successfully. Ref: ${reference}`
    );
  }

  // TICKETS API
  public getTickets(): SupportTicket[] {
    const session = this.getCurrentUser();
    if (!session) return [];

    const tickets = this.getTable<SupportTicket>('ss_tickets');
    if (session.user.role === 'admin' || session.user.role === 'support_agent') {
      return tickets.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return tickets
      .filter(t => t.user_id === session.user.id)
      .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public createTicket(data: {
    deviceId?: string;
    title: string;
    description: string;
    category: SupportTicket['category'];
    priority: SupportTicket['priority'];
  }): SupportTicket | null {
    const session = this.getCurrentUser();
    if (!session) return null;

    const tickets = this.getTable<SupportTicket>('ss_tickets');
    const newTicket: SupportTicket = {
      id: `tick-${Math.random().toString(36).substring(2, 9)}`,
      user_id: session.user.id,
      device_id: data.deviceId,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    tickets.push(newTicket);
    this.setTable('ss_tickets', tickets);

    // Initial message
    const messages = this.getTable<Message>('ss_messages');
    messages.push({
      id: `msg-${Math.random().toString(36).substring(2, 9)}`,
      ticket_id: newTicket.id,
      sender_id: session.user.id,
      sender_role: 'student',
      content: `Hello support, I have filed an issue about: "${data.title}".\n\nFull Diagnostic Summary: ${data.description}`,
      created_at: new Date().toISOString()
    });
    this.setTable('ss_messages', messages);

    this.createActivityLog(session.user.id, 'Support Ticket', `Created Support Ticket #${newTicket.id}`);
    this.createNotification(session.user.id, 'Ticket Submitted', `Ticket #${newTicket.id} created successfully and placed in engineering triage queue.`, 'success');

    // Sync to backend
    this.apiFetch('/api/tickets', {
      method: 'POST',
      body: JSON.stringify({
        userId: session.user.id,
        deviceId: data.deviceId,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority
      })
    });

    return newTicket;
  }

  public updateTicketStatus(ticketId: string, status: SupportTicket['status']): void {
    const tickets = this.getTable<SupportTicket>('ss_tickets');
    const idx = tickets.findIndex(t => t.id === ticketId);
    if (idx !== -1) {
      tickets[idx].status = status;
      tickets[idx].updated_at = new Date().toISOString();
      this.setTable('ss_tickets', tickets);

      this.createNotification(
        tickets[idx].user_id,
        'Support Ticket Updated',
        `Ticket #${tickets[idx].id} status changed to: ${status.replace('_', ' ').toUpperCase()}`,
        'info'
      );

      if (status === 'resolved' && tickets[idx].device_id) {
        this.updateDeviceStatus(tickets[idx].device_id!, 'active');
      } else if (status === 'in_progress' && tickets[idx].device_id) {
        this.updateDeviceStatus(tickets[idx].device_id!, 'under_repair');
      }
    }
  }

  public getTicketMessages(ticketId: string): { message: Message; senderName: string; senderAvatar?: string }[] {
    const messages = this.getTable<Message>('ss_messages');
    const profiles = this.getTable<Profile>('ss_profiles');

    return messages
      .filter(m => m.ticket_id === ticketId)
      .map(m => {
        const prof = profiles.find(p => p.user_id === m.sender_id);
        
        let senderName = 'Student';
        if (m.sender_role === 'student') {
          senderName = prof ? prof.full_name : 'Student';
        } else if (m.sender_role === 'support_agent') {
          senderName = prof ? prof.full_name : 'David Agent (StudentShield)';
        } else if (m.sender_role === 'admin') {
          senderName = prof ? prof.full_name : 'Ato (StudentShield HQ)';
        }

        return {
          message: m,
          senderName,
          senderAvatar: prof?.avatar_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'
        };
      })
      .sort((a,b) => new Date(a.message.created_at).getTime() - new Date(b.message.created_at).getTime());
  }

  public sendTicketMessage(ticketId: string, content: string): Message | null {
    const session = this.getCurrentUser();
    if (!session) return null;

    const messages = this.getTable<Message>('ss_messages');
    const newMessage: Message = {
      id: `msg-${Math.random().toString(36).substring(2, 9)}`,
      ticket_id: ticketId,
      sender_id: session.user.id,
      sender_role: session.user.role,
      content,
      created_at: new Date().toISOString()
    };

    messages.push(newMessage);
    this.setTable('ss_messages', messages);

    const tickets = this.getTable<SupportTicket>('ss_tickets');
    const tIdx = tickets.findIndex(t => t.id === ticketId);
    if (tIdx !== -1) {
      tickets[tIdx].updated_at = new Date().toISOString();
      if (session.user.role === 'student' && tickets[tIdx].status === 'waiting_on_user') {
        tickets[tIdx].status = 'open';
      } else if (session.user.role === 'admin' || session.user.role === 'support_agent') {
        tickets[tIdx].status = 'waiting_on_user';
      }
      this.setTable('ss_tickets', tickets);

      const recipientId = (session.user.role === 'admin' || session.user.role === 'support_agent') ? tickets[tIdx].user_id : 'usr-admin-1';
      this.createNotification(
        recipientId,
        'New Ticket Message',
        `New reply received on Ticket #${tickets[tIdx].id}`,
        'info'
      );
    }

    return newMessage;
  }

  // NOTIFICATIONS
  public getNotifications(): Notification[] {
    const session = this.getCurrentUser();
    if (!session) return [];

    const all = this.getTable<Notification>('ss_notifications');
    return all
      .filter(n => n.user_id === session.user.id)
      .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public markNotificationRead(id: string): void {
    const all = this.getTable<Notification>('ss_notifications');
    const updated = all.map(n => n.id === id ? { ...n, is_read: true } : n);
    this.setTable('ss_notifications', updated);
  }

  public markAllNotificationsRead(): void {
    const session = this.getCurrentUser();
    if (!session) return;

    const all = this.getTable<Notification>('ss_notifications');
    const updated = all.map(n => n.user_id === session.user.id ? { ...n, is_read: true } : n);
    this.setTable('ss_notifications', updated);
  }

  // OTHER DATA
  public getBlogPosts(): BlogPost[] {
    return this.getTable<BlogPost>('ss_blogs');
  }

  public getFAQs(): FAQ[] {
    return this.getTable<FAQ>('ss_faqs');
  }

  // AUDIT LOGS
  public getActivityLogs(): ActivityLog[] {
    const session = this.getCurrentUser();
    if (!session) return [];

    const logs = this.getTable<ActivityLog>('ss_logs');
    if (session.user.role === 'admin') {
      return logs.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    if (session.user.role === 'support_agent') {
      return []; // Secure lockout for support agents
    }
    return logs
      .filter(l => l.user_id === session.user.id)
      .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // PRIVATE HELPERS
  public createNotification(userId: string, title: string, content: string, type: Notification['type']) {
    const all = this.getTable<Notification>('ss_notifications');
    all.push({
      id: `notif-${Math.random().toString(36).substring(2, 9)}`,
      user_id: userId,
      title,
      content,
      type,
      is_read: false,
      created_at: new Date().toISOString()
    });
    this.setTable('ss_notifications', all);
  }

  public createActivityLog(userId: string, action: string, details: string) {
    const all = this.getTable<ActivityLog>('ss_logs');
    all.push({
      id: `log-${Math.random().toString(36).substring(2, 9)}`,
      user_id: userId,
      action,
      details,
      ip_address: '127.0.0.1 (Local Preview)',
      created_at: new Date().toISOString()
    });
    this.setTable('ss_logs', all);
  }

  // ADMIN ANALYTICS
  public getAdminStats(): {
    totalUsers: number;
    activePlans: number;
    openTickets: number;
    totalRevenue: number;
    activeDevicesCount: number;
    monthlySubRate: number;
  } {
    const users = this.getTable<User>('ss_users').filter(u => u.role === 'student');
    const subs = this.getTable<Subscription>('ss_subscriptions').filter(s => s.status === 'active');
    const tickets = this.getTable<SupportTicket>('ss_tickets').filter(t => t.status !== 'closed' && t.status !== 'resolved');
    const payments = this.getTable<Payment>('ss_payments');
    const devices = this.getTable<Device>('ss_devices');

    const totalRevenue = payments
      .filter(p => p.status === 'successful')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      totalUsers: users.length,
      activePlans: subs.length,
      openTickets: tickets.length,
      totalRevenue,
      activeDevicesCount: devices.length,
      monthlySubRate: users.length > 0 ? Math.round((subs.length / users.length) * 100) : 0
    };
  }

  public getAdminAllProfiles(): { user: User; profile: Profile; subscription?: Subscription; activeDeviceCount: number }[] {
    const users = this.getTable<User>('ss_users').filter(u => u.role === 'student');
    const profiles = this.getTable<Profile>('ss_profiles');
    const subs = this.getTable<Subscription>('ss_subscriptions').filter(s => s.status === 'active');
    const devices = this.getTable<Device>('ss_devices');

    return users.map(u => {
      const profile = profiles.find(p => p.user_id === u.id) || {
        id: `prof-${u.id}`,
        user_id: u.id,
        full_name: u.email.split('@')[0],
        university: 'Unknown School',
        student_id: 'N/A',
        phone: 'N/A',
        created_at: u.created_at
      };
      const sub = subs.find(s => s.user_id === u.id);
      const activeDeviceCount = devices.filter(d => d.user_id === u.id).length;

      return {
        user: u,
        profile,
        subscription: sub,
        activeDeviceCount
      };
    });
  }

  public getAdminAllPayments(): { payment: Payment; profile: Profile }[] {
    const session = this.getCurrentUser();
    if (!session || session.user.role === 'support_agent') {
      return []; // Secure finance segregation block
    }
    const payments = this.getTable<Payment>('ss_payments');
    const profiles = this.getTable<Profile>('ss_profiles');

    return payments.map(pay => {
      const prof = profiles.find(p => p.user_id === pay.user_id) || {
        id: `prof-${pay.user_id}`,
        user_id: pay.user_id,
        full_name: 'Student User',
        university: 'N/A',
        student_id: 'N/A',
        phone: 'N/A',
        created_at: pay.created_at
      };
      return { payment: pay, profile: prof };
    }).sort((a,b) => new Date(b.payment.created_at).getTime() - new Date(a.payment.created_at).getTime());
  }

  // Dynamic Plans Management
  public getPlans(): Plan[] {
    return this.getTable<Plan>('ss_plans');
  }

  public addPlan(plan: Plan): void {
    const plans = this.getTable<Plan>('ss_plans');
    plans.push({
      ...plan,
      billing_cycle: 'semester',
      status: 'active'
    });
    this.setTable('ss_plans', plans);
  }

  public updateSubscriptionStatus(subId: string, status: Subscription['status']): void {
    const subs = this.getTable<Subscription>('ss_subscriptions');
    const idx = subs.findIndex(s => s.id === subId);
    if (idx !== -1) {
      subs[idx].status = status;
      this.setTable('ss_subscriptions', subs);
      
      this.createNotification(
        subs[idx].user_id,
        'Coverage Status Update',
        `Your StudentShield protection subscription has been set to: ${status.toUpperCase()}`,
        status === 'active' ? 'success' : 'warning'
      );
      this.createActivityLog(subs[idx].user_id, 'Plan Status Change', `Subscription status updated to ${status}`);
    }
  }

  public deactivateInstitutionSubscribers(universityName: string): number {
    const profiles = this.getTable<Profile>('ss_profiles');
    const subs = this.getTable<Subscription>('ss_subscriptions');
    
    // Find all profiles matching this university
    const targetProfiles = profiles.filter(p => p.university.toLowerCase() === universityName.toLowerCase());
    const targetUserIds = new Set(targetProfiles.map(p => p.user_id));
    
    let count = 0;
    const updatedSubs = subs.map(s => {
      if (targetUserIds.has(s.user_id) && s.status === 'active') {
        count++;
        return { ...s, status: 'suspended' as const };
      }
      return s;
    });
    
    this.setTable('ss_subscriptions', updatedSubs);
    
    // Notify all affected users
    targetProfiles.forEach(p => {
      this.createNotification(
        p.user_id,
        'Institution Coverage Suspended',
        `Due to institutional administrative action, all subscriptions for ${universityName} have been suspended.`,
        'error'
      );
      this.createActivityLog(p.user_id, 'Institutional Suspension', `Plan suspended due to bulk deactivation for ${universityName}`);
    });
    
    return count;
  }

  public expireInstitutionSubscribers(universityName: string): number {
    const profiles = this.getTable<Profile>('ss_profiles');
    const subs = this.getTable<Subscription>('ss_subscriptions');
    
    const targetProfiles = profiles.filter(p => p.university.toLowerCase() === universityName.toLowerCase());
    const targetUserIds = new Set(targetProfiles.map(p => p.user_id));
    
    let count = 0;
    const updatedSubs = subs.map(s => {
      if (targetUserIds.has(s.user_id) && s.status === 'active') {
        count++;
        return { ...s, status: 'expired' as const };
      }
      return s;
    });
    
    this.setTable('ss_subscriptions', updatedSubs);
    
    targetProfiles.forEach(p => {
      this.createNotification(
        p.user_id,
        'Institution Coverage Expired',
        `Due to the end of the academic semester, all StudentShield subscriptions for ${universityName} have expired.`,
        'warning'
      );
      this.createActivityLog(p.user_id, 'Institutional Expiry', `Plan expired due to bulk semester deactivation for ${universityName}`);
    });
    
    return count;
  }

  public createServiceRequest(data: {
    deviceId?: string;
    title: string;
    description: string;
    category: SupportTicket['category'];
    priority: SupportTicket['priority'];
    websiteDetails?: SupportTicket['website_details'];
  }): SupportTicket | null {
    const session = this.getCurrentUser();
    if (!session) return null;

    const tickets = this.getTable<SupportTicket>('ss_tickets');
    const newId = `req-${Math.random().toString(36).substring(2, 9)}`;
    const trackingQr = `SS-TRACK-${newId.toUpperCase()}`;
    
    const activeSub = this.getSubscription();
    const plans = this.getPlans();
    const plan = plans.find(p => p.id === activeSub?.plan_id);
    const planName = plan ? plan.name : 'Basic Cover';
    const amountPaid = plan ? plan.price : 20;

    const receiptContent = `
=============================================
         STUDENTSHIELD RECEIPT & COVERAGE
=============================================
Request ID: ${newId}
Date: ${new Date().toLocaleString()}
Subscriber Name: ${session.profile.full_name}
Student ID: ${session.profile.student_id}
Institution: ${session.profile.university}
Plan Level: ${planName}
Billing Fee: GH₵ ${amountPaid}.00 (PAID)
Service Type: ${data.category.toUpperCase().replace('_', ' ')}
Device Selection ID: ${data.deviceId || 'N/A'}
Description: ${data.description}
---------------------------------------------
QR TRACKING CODE: ${trackingQr}
=============================================
Thank you for shielding your device with us!
    `.trim();

    const newRequest: SupportTicket = {
      id: newId,
      user_id: session.user.id,
      device_id: data.deviceId,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      website_details: data.websiteDetails,
      receipt_pdf: receiptContent,
      tracking_qr: trackingQr
    };

    tickets.push(newRequest);
    this.setTable('ss_tickets', tickets);

    // Initial message
    const messages = this.getTable<Message>('ss_messages');
    messages.push({
      id: `msg-${Math.random().toString(36).substring(2, 9)}`,
      ticket_id: newRequest.id,
      sender_id: session.user.id,
      sender_role: 'student',
      content: `Hello support, I have filed an issue about: "${data.title}".\n\nFull Diagnostic Summary: ${data.description}${data.websiteDetails ? `\n\nWebsite Details:\nBusiness Name: ${data.websiteDetails.business_name || 'N/A'}\nDesired Subdomain: ${data.websiteDetails.subdomain || 'N/A'}\nPages: ${data.websiteDetails.pages_count || 'N/A'}` : ''}`,
      created_at: new Date().toISOString()
    });
    this.setTable('ss_messages', messages);

    this.createActivityLog(session.user.id, 'Service Request', `Created Request #${newRequest.id}`);
    this.createNotification(session.user.id, 'Request Submitted', `Request #${newRequest.id} created successfully and placed in triage queue. PDF receipt has been generated.`, 'success');

    return newRequest;
  }

  // Institution CRUD helpers
  public getInstitutions(): Institution[] {
    return this.getTable<Institution>('ss_institutions') || [];
  }

  public addInstitution(inst: Omit<Institution, 'id' | 'created_at'>): void {
    const list = this.getInstitutions();
    const newInst: Institution = {
      ...inst,
      id: `inst-${Math.random().toString(36).substring(2, 9)}`,
      created_at: new Date().toISOString()
    };
    list.push(newInst);
    this.setTable('ss_institutions', list);
  }

  public updateInstitution(id: string, name: string, short_name: string, location: string): void {
    const list = this.getInstitutions();
    const idx = list.findIndex(i => i.id === id);
    if (idx !== -1) {
      list[idx].name = name;
      list[idx].short_name = short_name;
      list[idx].location = location;
      this.setTable('ss_institutions', list);
    }
  }

  public deleteInstitution(id: string): void {
    const list = this.getInstitutions();
    const updated = list.filter(i => i.id !== id);
    this.setTable('ss_institutions', updated);
  }
}

export const dbService = new StudentShieldDB();
