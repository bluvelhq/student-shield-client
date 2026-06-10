/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  role: 'student' | 'admin' | 'support_agent';
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  university: string;
  student_id: string;
  phone: string;
  avatar_url?: string;
  created_at: string;
}

export interface Device {
  id: string;
  user_id: string;
  name: string; // e.g. "MacBook Pro 14\""
  type: 'laptop' | 'desktop' | 'tablet' | 'phone' | 'other';
  brand: string;
  model: string;
  serial_number: string;
  operating_system: string;
  image_url?: string;
  status: 'active' | 'under_repair' | 'diagnosing' | 'resolved' | 'unprotected';
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number; // e.g. 10 or 30 (in GH₵)
  billing_cycle: 'semester';
  features: string[];
  description: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  currency: string; // 'GHS'
  status: 'successful' | 'failed' | 'pending';
  payment_method: string; // 'Mobile Money' | 'Card'
  transaction_ref: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  device_id?: string;
  title: string;
  description: string;
  category: 'software' | 'hardware' | 'virus' | 'network' | 'diagnostic' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_on_user' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_role: 'student' | 'admin' | 'support_agent';
  content: string;
  attachment_url?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'support' | 'security' | 'news' | 'tips' | 'dev';
  author: string;
  read_time: string;
  image_url: string;
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  details: string;
  ip_address?: string;
  created_at: string;
}
