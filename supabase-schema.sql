-- StudentShield Production Supabase Database Schema
-- Stay Connected. Stay Protected.
-- Suitable for immediate execution in Supabase Query Editor

-- -------------------------------------------------------------
-- 1. Enable Required Extensions
-- -------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- -------------------------------------------------------------
-- 2. Create Roles and Access Enums
-- -------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE device_type AS ENUM ('laptop', 'desktop', 'tablet', 'phone', 'other');
CREATE TYPE device_status AS ENUM ('active', 'under_repair', 'diagnosing', 'resolved', 'unprotected');
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled', 'pending');
CREATE TYPE payment_status AS ENUM ('successful', 'failed', 'pending');
CREATE TYPE ticket_category AS ENUM ('software', 'hardware', 'virus', 'network', 'diagnostic', 'other');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'waiting_on_user', 'resolved', 'closed');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');
CREATE TYPE blog_category AS ENUM ('support', 'security', 'news', 'tips', 'dev');

-- -------------------------------------------------------------
-- 3. Profiles Table
-- -------------------------------------------------------------
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    university TEXT NOT NULL,
    student_id TEXT NOT NULL,
    phone TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- Enable Row Level Security (RLS) on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 4. Plans Table
-- -------------------------------------------------------------
CREATE TABLE public.plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    billing_cycle TEXT NOT NULL DEFAULT 'semester',
    description TEXT,
    features TEXT[] DEFAULT '{}'::TEXT[] NOT NULL
);

-- Access is Public (Read-Only)
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 5. Subscriptions Table
-- -------------------------------------------------------------
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES public.plans(id),
    status subscription_status DEFAULT 'pending'::subscription_status NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 6. Devices Table
-- -------------------------------------------------------------
CREATE TABLE public.devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type device_type NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    serial_number TEXT NOT NULL,
    operating_system TEXT NOT NULL,
    image_url TEXT,
    status device_status DEFAULT 'unprotected'::device_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 7. Payments Table
-- -------------------------------------------------------------
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'GHS' NOT NULL,
    status payment_status DEFAULT 'pending'::payment_status NOT NULL,
    payment_method TEXT NOT NULL, -- MTN Mobile Money, Vodafone Cash, Credit Card
    transaction_ref TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 8. Support Tickets Table
-- -------------------------------------------------------------
CREATE TABLE public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category ticket_category NOT NULL,
    priority ticket_priority DEFAULT 'medium'::ticket_priority NOT NULL,
    status ticket_status DEFAULT 'open'::ticket_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 9. Messages Table (Ticket Chat)
-- -------------------------------------------------------------
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_role user_role DEFAULT 'student'::user_role NOT NULL,
    content TEXT NOT NULL,
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 10. Notifications Table
-- -------------------------------------------------------------
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type notification_type DEFAULT 'info'::notification_type NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 11. Blog Posts Table
-- -------------------------------------------------------------
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category blog_category NOT NULL,
    author TEXT NOT NULL,
    read_time TEXT DEFAULT '5 min' NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 12. FAQs Table
-- -------------------------------------------------------------
CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 13. Activity Logs (Security Auditing)
-- -------------------------------------------------------------
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;


-- =============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND student_id LIKE 'SS-TECH-%'
        )
    );

-- Plans Policies
CREATE POLICY "Anyone can view active plans" ON public.plans
    FOR SELECT USING (true);

-- Subscriptions Policies
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Devices Policies
CREATE POLICY "Students can access their own devices" ON public.devices
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all student devices" ON public.devices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND student_id LIKE 'SS-TECH-%'
        )
    );

-- Support Tickets Policies
CREATE POLICY "Students can access their own tickets" ON public.support_tickets
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and updates all tickets" ON public.support_tickets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND student_id LIKE 'SS-TECH-%'
        )
    );

-- Messages Policies
CREATE POLICY "Users can access messages for their tickets" ON public.messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.support_tickets 
            WHERE id = ticket_id AND (user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE user_id = auth.uid() AND student_id LIKE 'SS-TECH-%'
            ))
        )
    );

-- Notifications Policies
CREATE POLICY "Users can read/update their notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- Blogs & FAQs
CREATE POLICY "Anyone can view blogs" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Anyone can view FAQs" ON public.faqs FOR SELECT USING (true);


-- =============================================================
-- PERFORMANCE INDEXES
-- =============================================================
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_devices_user_id ON public.devices(user_id);
CREATE INDEX idx_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_messages_ticket_id ON public.messages(ticket_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_subs_user_id ON public.subscriptions(user_id);
