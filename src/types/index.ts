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
  residence: string;
  student_id: string;
  phone: string;
  gender?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Device {
  id: string;
  user_id: string;
  name: string; // e.g. "MacBook Pro 14\""
  type: string; // supports laptop, desktop, tablet, phone, or custom inputs
  brand: string;
  model: string;
  serial_number: string;
  operating_system: string;
  image_url?: string;
  video_url?: string;
  device_images?: string[];
  custom_fields?: { label: string; value: string }[];
  status: 'active' | 'under_repair' | 'diagnosing' | 'resolved' | 'unprotected';
  created_at: string;
}

export interface Plan {
  id: string;
  name?: string;
  type?: string;
  price?: number; 
  fee?: number;
  billing_cycle?: 'semester';
  features?: string[];
  benefits?: string[];
  description?: string;
  summary?: string;
  max_devices?: number;
  status?: 'active' | 'inactive';
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending' | 'suspended';
  start_date: string;
  end_date: string;
  created_at: string;
  plan?: any;
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
  category: 'software' | 'hardware' | 'virus' | 'network' | 'diagnostic' | 'other' | 'website_portfolio' | 'website_business' | 'tech_consultation' | 'domain_hosting' | 'monthly_maintenance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_on_user' | 'resolved' | 'closed' | 'delivered';
  created_at: string;
  updated_at: string;
  website_details?: {
    business_name?: string;
    subdomain?: string;
    description?: string;
    pages_count?: number;
    hosting_required?: boolean;
  };
  receipt_pdf?: string;
  tracking_qr?: string;
  credentials?: {
    username?: string;
    password?: string;
    website_url?: string;
    dashboard_url?: string;
  };
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

export interface Institution {
  id: string;
  name: string;
  short_name: string;
  location: string;
  created_at: string;
}
