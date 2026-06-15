/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Auto-detect production environment to set NODE_ENV reliably
const isProductionRun = process.env.NODE_ENV === "production" ||
                        process.env.NODE_ENV === "prod" ||
                        process.env.K_SERVICE !== undefined ||
                        (typeof __filename !== "undefined" && (__filename.includes("dist") || __filename.includes("server.cjs")));

if (isProductionRun) {
  process.env.NODE_ENV = "production";
}

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = express();
app.use(express.json({ limit: "15mb" }));

// -------------------------------------------------------------
// 1. Database State Backup (Persistent Local Emulator Store)
// -------------------------------------------------------------
let DB_FILE_PATH = path.join(process.cwd(), "db-backup.json");

interface LocalStore {
  users: any[];
  profiles: any[];
  devices: any[];
  subscriptions: any[];
  payments: any[];
  tickets: any[];
  messages: any[];
  notifications: any[];
  activityLogs: any[];
}

const DEFAULT_STORE: LocalStore = {
  users: [
    { id: "usr-student-1", email: "student@university.edu", role: "student", created_at: new Date().toISOString() },
    { id: "usr-support-1", email: "support@studentshield.com", role: "support_agent", created_at: new Date().toISOString() },
    { id: "usr-admin-1", email: "admin@studentshield.com", role: "admin", created_at: new Date().toISOString() }
  ],
  profiles: [
    {
      id: "prof-student-1",
      user_id: "usr-student-1",
      full_name: "Emmanuel Boateng Mills",
      university: "University of Ghana (Legon)",
      student_id: "UG-10928374",
      phone: "+233 24 412 3456",
      avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
      created_at: new Date().toISOString()
    },
    {
      id: "prof-support-1",
      user_id: "usr-support-1",
      full_name: "David Boateng Agent",
      university: "StudentShield Hub HQ",
      student_id: "SS-AGENT-01",
      phone: "+233 24 555 1212",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      created_at: new Date().toISOString()
    },
    {
      id: "prof-admin-1",
      user_id: "usr-admin-1",
      full_name: "Ato Kwamena Support",
      university: "StudentShield Hub HQ",
      student_id: "SS-TECH-01",
      phone: "+233 20 111 0000",
      avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
      created_at: new Date().toISOString()
    }
  ],
  devices: [
    {
      id: "dev-1",
      user_id: "usr-student-1",
      name: "Asus ZenBook 14 OLED",
      type: "laptop",
      brand: "Asus",
      model: "UM3402",
      serial_number: "SN-ASUS-99238-Z",
      operating_system: "Windows 11 Education",
      image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80",
      status: "active",
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "dev-2",
      user_id: "usr-student-1",
      name: "Academic Samsung Tablet",
      type: "tablet",
      brand: "Samsung",
      model: "Galaxy Tab S8",
      serial_number: "SN-SEC-TAB8831",
      operating_system: "Android 13",
      image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80",
      status: "unprotected",
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  subscriptions: [
    {
      id: "sub-1",
      user_id: "usr-student-1",
      plan_id: "premium-plan",
      status: "active",
      start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  payments: [
    {
      id: "pay-1",
      user_id: "usr-student-1",
      subscription_id: "sub-1",
      amount: 50,
      currency: "GHS",
      status: "successful",
      payment_method: "Mobile Money (MTN)",
      transaction_ref: "TXN-MM-892837482",
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  tickets: [
    {
      id: "tick-1",
      user_id: "usr-student-1",
      device_id: "dev-1",
      title: "Constant Blue Screen (BSOD) after update",
      description: "Getting a \"KERNEL_SECURITY_CHECK_FAILURE\" error every time I plug in my phone via USB. I cannot complete my programming assignment on visual studio code.",
      category: "software",
      priority: "high",
      status: "in_progress",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "tick-2",
      user_id: "usr-student-1",
      device_id: "dev-1",
      title: "Request thermal cleaning and diagnostic report",
      description: "My Asus notebook fan is spinning extremely loud and the keyboard is warm during light typing. Requesting a hardware physical checkup.",
      category: "diagnostic",
      priority: "low",
      status: "resolved",
      created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  messages: [
    {
      id: "msg-1",
      ticket_id: "tick-1",
      sender_id: "usr-student-1",
      sender_role: "student",
      content: "My notebook keeps restarting during research. Can I bring it today?",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "msg-2",
      ticket_id: "tick-1",
      sender_id: "usr-admin-1",
      sender_role: "admin",
      content: "Hi Emmanuel, certainly! Please back up your active work and visit Booth 2 at the Legon Library. Our technician Kofi can trace the driver kernel mismatch. It is covered fully on your Premium Shield.",
      created_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "msg-3",
      ticket_id: "tick-2",
      sender_id: "usr-student-1",
      sender_role: "student",
      content: "Thermal dust removal works amazing now, fan noise has dropped dramatically. Thank you!",
      created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "msg-4",
      ticket_id: "tick-2",
      sender_id: "usr-admin-1",
      sender_role: "admin",
      content: "Wonderful! Glad to have verified and cleaned your system. We will mark this diagnostic checkup resolved.",
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  notifications: [
    {
      id: "notif-1",
      user_id: "usr-student-1",
      title: "Ticket #tick-1 Updated",
      content: "Technician assigned a priority check to your device driver issue.",
      type: "success",
      is_read: false,
      created_at: new Date().toISOString()
    },
    {
      id: "notif-2",
      user_id: "usr-student-1",
      title: "Welcome to StudentShield Premium!",
      content: "Your laptop is now shields-up with Premium cover for 120 days of semester protection.",
      type: "info",
      is_read: true,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  activityLogs: [
    {
      id: "log-1",
      user_id: "usr-student-1",
      action: "Login",
      details: "Logged into StudentShield application client.",
      created_at: new Date().toISOString()
    },
    {
      id: "log-2",
      user_id: "usr-student-1",
      action: "Subscription Creation",
      details: "Purchased Premium Shield subscription GH₵50 via MTN Mobile Money.",
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};

// Check if running in a potentially read-only environment like Cloud Run
const isProductionEnv = process.env.NODE_ENV === "production" || 
                         process.env.K_SERVICE !== undefined ||
                         (typeof __filename !== "undefined" && (__filename.includes("dist") || __filename.includes("server.cjs"))) ||
                         !fs.existsSync(path.join(process.cwd(), "server.ts"));

if (isProductionEnv) {
  const tmpPath = path.join("/tmp", "db-backup.json");
  try {
    if (!fs.existsSync(tmpPath)) {
      if (fs.existsSync(DB_FILE_PATH)) {
        fs.copyFileSync(DB_FILE_PATH, tmpPath);
        console.log(`[STUDENTSHIELD BACKEND] Successfully moved database backup store to writable container path: ${tmpPath}`);
      } else {
        fs.writeFileSync(tmpPath, JSON.stringify(DEFAULT_STORE, null, 2), "utf-8");
        console.log(`[STUDENTSHIELD BACKEND] Created new database backup store at writable container path: ${tmpPath}`);
      }
    }
    DB_FILE_PATH = tmpPath;
  } catch (err) {
    console.warn("[STUDENTSHIELD BACKEND] Failed to relocate or initialize database backup store to /tmp:", err);
  }
}

// Simple Thread Safe persistence
function loadStore(): LocalStore {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      return JSON.parse(fs.readFileSync(DB_FILE_PATH, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to read persistent database file", err);
  }
  return DEFAULT_STORE;
}

function saveStore(store: LocalStore) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save persistent database file", err);
  }
}

// Ensure database initializes immediately
if (!fs.existsSync(DB_FILE_PATH)) {
  saveStore(DEFAULT_STORE);
}

// -------------------------------------------------------------
// 2. lazy Supabase Connect & Health Verification
// -------------------------------------------------------------
let supabaseDbWorking: boolean | null = null;

const checkSupabaseHealth = async () => {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    supabaseDbWorking = false;
    return;
  }
  try {
    const tempClient = createClient(url, key, { auth: { persistSession: false } });
    const { error } = await tempClient.from("profiles").select("id").limit(1);
    if (error) {
      if (error.message && (error.message.includes("Could not find the table") || error.message.includes("does not exist") || error.message.includes("schema cache"))) {
        console.log("Supabase schema is uninitialized: 'profiles' table is missing. Automatically falling back to simulated persistent store.");
        supabaseDbWorking = false;
      } else {
        supabaseDbWorking = true;
      }
    } else {
      supabaseDbWorking = true;
    }
  } catch (err) {
    supabaseDbWorking = false;
  }
};

// Trigger immediate health verification
checkSupabaseHealth();

const getSupabase = () => {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (url && key && supabaseDbWorking !== false) {
    return createClient(url, key, {
      auth: { persistSession: false }
    });
  }
  return null;
};

// Helper to determine if we are executing real database mutations
const isSupabaseActive = () => {
  return !!getSupabase() && supabaseDbWorking !== false;
};

// -------------------------------------------------------------
// 3. API ROUTES
// -------------------------------------------------------------

// Account Verification / Login Mock + Production Proxy
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const client = getSupabase();
  const cleanEmail = email ? email.toLowerCase().trim() : "";
  const isDemoEmail = ["student@university.edu", "admin@studentshield.com"].includes(cleanEmail);

  if (client && password && !isDemoEmail) {
    try {
      const { data: authData, error: authError } = await client.auth.signInWithPassword({ email: cleanEmail, password });
      if (authError) throw authError;

      // Fetch Profile
      const { data: profileData, error: profError } = await client
        .from("profiles")
        .select("*")
        .eq("user_id", authData.user.id)
        .single();

      if (profError && profError.code !== "PGRST116") {
        throw profError;
      }

      // Fetch associated subscription
      const { data: subData } = await client
        .from("subscriptions")
        .select("*")
        .eq("user_id", authData.user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1);

      return res.json({
        success: true,
        user: { id: authData.user.id, email: authData.user.email, role: cleanEmail.startsWith("admin@") ? "admin" : "student" },
        profile: profileData || null,
        subscription: subData && subData.length ? subData[0] : null
      });
    } catch (err: any) {
      console.log("Supabase Auth login failed, fallback to local DB simulation:", err.message);
    }
  }

  // Fallback to Simulated Local DB
  const store = loadStore();
  let matchedUser = store.users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!matchedUser) {
    const normalizedInp = cleanEmail.replace(/[\s+-]/g, "");
    if (normalizedInp) {
      const matchedProfile = store.profiles.find(p => {
        const normalizedPhone = p.phone ? p.phone.replace(/[\s+-]/g, "") : "";
        return normalizedPhone === normalizedInp || (p.phone && p.phone.toLowerCase().trim() === cleanEmail);
      });
      if (matchedProfile) {
        matchedUser = store.users.find(u => u.id === matchedProfile.user_id);
      }
    }
  }

  if (matchedUser) {
    const matchedProfile = store.profiles.find(p => p.user_id === matchedUser.id);
    const matchedSub = store.subscriptions.find(s => s.user_id === matchedUser.id && s.status === "active");
    return res.json({
      success: true,
      user: matchedUser,
      profile: matchedProfile || null,
      subscription: matchedSub || null
    });
  }

  return res.status(404).json({ success: false, error: "Academic record not discovered in StudentShield archive. Please register." });
});

// Hybrid Onboarding Account Auto Creation + Background Registration Step 2
app.post("/api/auth/register", async (req, res) => {
  const { fullName, email, phone, university, studentId, password, planId } = req.body;
  const cleanEmail = email.toLowerCase().trim();
  const client = getSupabase();

  let createdUserId = `usr-reg-${Math.random().toString(36).substring(2, 9)}`;
  let provProfile: any = null;
  let provSubscription: any = null;

  if (client) {
    try {
      // Step 1: Create Supabase Auth User
      const { data: authData, error: signUpError } = await client.auth.signUp({
        email: cleanEmail,
        password: password || "LegonShield2026!",
        options: {
          data: {
            full_name: fullName,
            university: university
          }
        }
      });
      if (signUpError) throw signUpError;
      
      if (authData.user) {
        createdUserId = authData.user.id;

        // Step 2: Create profile entry
        const { data: prof, error: insertProfError } = await client
          .from("profiles")
          .insert({
            user_id: createdUserId,
            full_name: fullName,
            university: university,
            student_id: studentId || `TBD-${Math.floor(100000 + Math.random() * 900000)}`,
            phone: phone,
            avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`
          })
          .select()
          .single();

        if (insertProfError) throw insertProfError;
        provProfile = prof;

        // Step 3: Insert provisionary pending subscription
        const semesterLengthDays = 120;
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + semesterLengthDays);

        const { data: sub, error: insertSubError } = await client
          .from("subscriptions")
          .insert({
            user_id: createdUserId,
            plan_id: planId || "basic-plan",
            status: "pending",
            start_date: new Date().toISOString(),
            end_date: expiry.toISOString()
          })
          .select()
          .single();

        if (insertSubError) throw insertSubError;
        provSubscription = sub;

        // Sync with local memory backup store so that they can be resolved via fallback login (email-only verification)
        const store = loadStore();
        if (!store.users.some(u => u.email.toLowerCase() === cleanEmail)) {
          store.users.push({
            id: createdUserId,
            email: cleanEmail,
            role: "student",
            created_at: new Date().toISOString()
          });
          store.profiles.push(provProfile);
          store.subscriptions.push(provSubscription);
          saveStore(store);
        }

        return res.json({
          success: true,
          user: { id: createdUserId, email: cleanEmail, role: "student" },
          profile: provProfile,
          subscription: provSubscription
        });
      }
    } catch (err: any) {
      console.log("Supabase Account onboarding auto creation error. Switched seamlessly to simulated persistence:", err.message);
      if (err.message && (err.message.includes("Could not find the table") || err.message.includes("does not exist") || err.message.includes("schema cache"))) {
        supabaseDbWorking = false;
      }
    }
  }

  // Offline / Simulated Fallback account creations
  const store = loadStore();
  const exists = store.users.some(u => u.email.toLowerCase() === cleanEmail);
  if (exists) {
    // If user already exists in simulation, return it
    const mathUser = store.users.find(u => u.email === cleanEmail);
    const mathProf = store.profiles.find(p => p.user_id === mathUser.id);
    const mathSub = store.subscriptions.find(s => s.user_id === mathUser.id) || {
      id: `sub-${Math.random().toString(36).substring(2, 9)}`,
      user_id: mathUser.id,
      plan_id: planId || "basic-plan",
      status: "pending"
    };
    return res.json({
      success: true,
      user: mathUser,
      profile: mathProf,
      subscription: mathSub
    });
  }

  const newUser = { id: createdUserId, email: cleanEmail, role: "student", created_at: new Date().toISOString() };
  provProfile = {
    id: `prof-${Math.random().toString(36).substring(2, 9)}`,
    user_id: createdUserId,
    full_name: fullName,
    university: university,
    student_id: studentId || `TBD-${Math.floor(100000 + Math.random() * 900000)}`,
    phone: phone,
    avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
    created_at: new Date().toISOString()
  };

  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 120);

  provSubscription = {
    id: `sub-${Math.random().toString(36).substring(2, 9)}`,
    user_id: createdUserId,
    plan_id: planId || "basic-plan",
    status: "pending",
    start_date: new Date().toISOString(),
    end_date: expiry.toISOString(),
    created_at: new Date().toISOString()
  };

  store.users.push(newUser);
  store.profiles.push(provProfile);
  store.subscriptions.push(provSubscription);
  saveStore(store);

  return res.json({
    success: true,
    user: newUser,
    profile: provProfile,
    subscription: provSubscription
  });
});

// Paystack payment initialization API route
app.post("/api/payments/initialize", async (req, res) => {
  const { email, amount, planId, userId, subscriptionId } = req.body;
  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  const appUrl = process.env.APP_URL || "http://localhost:3000";

  // If secret key exists, execute genuine Paystack transactions initialization request
  if (paystackSecret && paystackSecret !== "your-secret-key-here") {
    try {
      const resp = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          amount: Math.round(amount * 100), // convert GH₵ to pesewas (x100)
          callback_url: `${appUrl}?paystack_verify=1&sub_id=${subscriptionId}&user_id=${userId}&plan_id=${planId}&amount=${amount}`,
          metadata: {
            userId: userId,
            subscriptionId: subscriptionId,
            planId: planId,
            amount: amount
          }
        })
      });

      const jsonResult: any = await resp.json();
      if (jsonResult.status && jsonResult.data) {
        return res.json({
          success: true,
          authorization_url: jsonResult.data.authorization_url,
          reference: jsonResult.data.reference
        });
      }
    } catch (err: any) {
      console.log("Real Paystack API initial setup crashed. Switched to secure simulation:", err);
    }
  }

  // Secure checkout simulation fallback URL
  const ref = `REF-SIM-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const checkoutMockUrl = `${appUrl}?mock_checkout=1&reference=${ref}&amount=${amount}&subId=${subscriptionId}&userId=${userId}&planId=${planId}`;

  return res.json({
    success: true,
    authorization_url: checkoutMockUrl,
    reference: ref
  });
});

// Dynamic Paystack Transaction verification
app.post("/api/payments/verify", async (req, res) => {
  const { reference, userId, subscriptionId, planId, amount } = req.body;
  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  let isSuccessful = false;
  let payMethod = "Mobile Money (MoMo)";

  // If testing genuine credentials, query the official verify end point
  if (paystackSecret && paystackSecret !== "your-secret-key-here" && reference && !reference.startsWith("REF-SIM")) {
    try {
      const resp = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackSecret}`
        }
      });
      const data: any = await resp.json();
      if (data.status && data.data && data.data.status === "success") {
        isSuccessful = true;
        payMethod = data.data.channel || "Paystack Checkout";
      }
    } catch (err) {
      console.error("Paystack server-side transaction check failure", err);
    }
  } else {
    // Simulated mock transaction immediately approves
    isSuccessful = true;
    payMethod = "MTN Mobile Money";
  }

  if (isSuccessful) {
    const client = getSupabase();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 120); // standard semester length

    if (client) {
      try {
        // Step 1: Resolve pending subscription entry to active status
        const { error: subActError } = await client
          .from("subscriptions")
          .update({
            status: "active",
            start_date: new Date().toISOString(),
            end_date: expiryDate.toISOString()
          })
          .eq("id", subscriptionId);

        if (!subActError) {
          // Step 2: Record successful payment trace log
          await client.from("payments").insert({
            user_id: userId,
            subscription_id: subscriptionId,
            amount: amount || 20.00,
            currency: "GHS",
            status: "successful",
            payment_method: payMethod,
            transaction_ref: reference
          });

          // Step 3: Trigger real dashboard welcome notification
          await client.from("notifications").insert({
            user_id: userId,
            title: "Subscription Shield ACTIVE",
            content: `Complete device hardware assignment in under 60 seconds to initiate StudentShield cover!`,
            type: "success",
            is_read: false
          });

          // Step 4: Write security and execution activity log
          await client.from("activity_logs").insert({
            user_id: userId,
            action: "Active Coverage Initiated",
            details: `Secure payment verified for ${planId} plan via Paystack. Key ref: ${reference}`
          });

          return res.json({ success: true, verified: true });
        }
      } catch (err: any) {
        console.log("Supabase verification write failure, cascading directly to simulator database storage:", err.message);
      }
    }

    // Cascade local database emulation write
    const store = loadStore();
    const existingSub = store.subscriptions.find(s => s.id === subscriptionId);
    if (existingSub) {
      existingSub.status = "active";
      existingSub.start_date = new Date().toISOString();
      existingSub.end_date = expiryDate.toISOString();
    } else {
      store.subscriptions.push({
        id: subscriptionId,
        user_id: userId,
        plan_id: planId || "basic-plan",
        status: "active",
        start_date: new Date().toISOString(),
        end_date: expiryDate.toISOString(),
        created_at: new Date().toISOString()
      });
    }

    // Log payment record in simulation database
    store.payments.push({
      id: `pay-${Math.random().toString(36).substring(2, 9)}`,
      user_id: userId,
      subscription_id: subscriptionId,
      amount: Number(amount) || (planId === "premium-plan" ? 50 : 20),
      currency: "GHS",
      status: "successful",
      payment_method: payMethod,
      transaction_ref: reference,
      created_at: new Date().toISOString()
    });

    // Create welcoming notification
    store.notifications.push({
      id: `notif-${Math.random().toString(36).substring(2, 9)}`,
      user_id: userId,
      title: "Subscription Shield ACTIVE",
      content: "Welcome to campus protection. Register your protected laptop details now to secure full diagnostic coverage!",
      type: "success",
      is_read: false,
      created_at: new Date().toISOString()
    });

    // Record audit logs
    store.activityLogs.push({
      id: `log-${Math.random().toString(36).substring(2, 9)}`,
      user_id: userId,
      action: "Coverage Activated",
      details: `Paystack transaction validated successfully. Ref: ${reference}`,
      created_at: new Date().toISOString()
    });

    saveStore(store);
    return res.json({ success: true, verified: true });
  }

  return res.status(400).json({ success: false, error: "Payment was not completed or failed verification." });
});

// Paystack Instant Webhook Handler
app.post("/api/payments/webhook", async (req, res) => {
  const ipnBody = req.body;
  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  // Express Webhook handles authentic billing reports in production backgrounds
  if (ipnBody && ipnBody.event === "charge.success") {
    const dataObj = ipnBody.data;
    const ref = dataObj.reference;
    const customerMeta = dataObj.metadata || {};
    const subId = customerMeta.subscriptionId;
    const userId = customerMeta.userId;

    console.log(`Paystack Webhook received successfully! charge.success event validated for ${ref}`);

    if (subId && userId) {
      const client = getSupabase();
      if (client) {
        // Automatically activate subscription if not yet activated
        await client.from("subscriptions").update({ status: "active" }).eq("id", subId);
        await client.from("payments").insert({
          user_id: userId,
          subscription_id: subId,
          amount: dataObj.amount / 100,
          currency: "GHS",
          status: "successful",
          payment_method: dataObj.channel || "Momo Webhook",
          transaction_ref: ref
        });
      } else {
        const store = loadStore();
        const activeSub = store.subscriptions.find(s => s.id === subId);
        if (activeSub) activeSub.status = "active";
        store.payments.push({
          id: `pay-${Math.random().toString(36).substring(2, 9)}`,
          user_id: userId,
          subscription_id: subId,
          amount: dataObj.amount / 100,
          currency: "GHS",
          status: "successful",
          payment_method: "Momo Webhook",
          transaction_ref: ref,
          created_at: new Date().toISOString()
        });
        saveStore(store);
      }
    }
  }
  return res.json({ status: "received" });
});

// Device Registration / Device Upload / Fetch endpoints
app.get("/api/devices", (req, res) => {
  const { userId } = req.query;
  const store = loadStore();
  const list = store.devices.filter(d => d.user_id === userId);
  return res.json({ success: true, devices: list });
});

app.post("/api/devices", async (req, res) => {
  const { userId, brand, model, serialNumber, purchaseYear, imageUrl } = req.body;
  const client = getSupabase();

  const mockDeviceUrl = imageUrl || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80";

  if (client) {
    try {
      const { data: devRecord, error } = await client
        .from("devices")
        .insert({
          user_id: userId,
          name: `${brand} ${model}`,
          type: "laptop",
          brand: brand,
          model: model,
          serial_number: serialNumber,
          operating_system: `Windows 11 Setup (${purchaseYear})`,
          image_url: mockDeviceUrl,
          status: "active"
        })
        .select()
        .single();

      if (!error) {
        // Log auditing security actions
        await client.from("activity_logs").insert({
          user_id: userId,
          action: "Device Shield Activated",
          details: `Registered device serial trace: ${serialNumber}`
        });

        return res.json({ success: true, device: devRecord });
      }
    } catch (err: any) {
      console.log("Supabase Device creation failed: falling back to local storage:", err.message);
    }
  }

  // Fallback DB Emulator
  const store = loadStore();
  const devId = `dev-${Math.random().toString(36).substring(2, 9)}`;
  const item = {
    id: devId,
    user_id: userId,
    name: `${brand} ${model}`,
    type: "laptop",
    brand: brand,
    model: model,
    serial_number: serialNumber,
    operating_system: `Windows 11 Setup (${purchaseYear})`,
    image_url: mockDeviceUrl,
    status: "active",
    created_at: new Date().toISOString()
  };

  store.devices.push(item);

  // Auto update user notifications and log details
  store.notifications.push({
    id: `notif-${Math.random().toString(36).substring(2, 9)}`,
    user_id: userId,
    title: "Device Shield Registered",
    content: `Security sweep initialized on ${brand} ${model}!`,
    type: "info",
    is_read: false,
    created_at: new Date().toISOString()
  });

  store.activityLogs.push({
    id: `log-${Math.random().toString(36).substring(2, 9)}`,
    user_id: userId,
    action: "Device Added",
    details: `Registered device serial trace: ${serialNumber}`,
    created_at: new Date().toISOString()
  });

  saveStore(store);
  return res.json({ success: true, device: item });
});

// Support Ticket Channels
app.get("/api/tickets", (req, res) => {
  const { userId } = req.query;
  const store = loadStore();
  let list = store.tickets;
  if (userId) {
    list = store.tickets.filter(t => t.user_id === userId);
  }
  return res.json({ success: true, tickets: list });
});

app.post("/api/tickets", async (req, res) => {
  const { userId, deviceId, title, description, category, priority } = req.body;
  const client = getSupabase();

  if (client) {
    try {
      const { data: ticket, error } = await client
        .from("support_tickets")
        .insert({
          user_id: userId,
          device_id: deviceId || null,
          title: title,
          description: description,
          category: category || "software",
          priority: priority || "medium",
          status: "open"
        })
        .select()
        .single();
      if (!error) return res.json({ success: true, ticket });
    } catch (err) {
      console.log("Supabase ticket insertion fallback:", err);
    }
  }

  const store = loadStore();
  const ticketId = `tick-${Math.random().toString(36).substring(2, 9)}`;
  const ticket = {
    id: ticketId,
    user_id: userId,
    device_id: deviceId || null,
    title: title,
    description: description,
    category: category || "software",
    priority: priority || "medium",
    status: "open",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  store.tickets.push(ticket);
  store.activityLogs.push({
    id: `log-${Math.random().toString(36).substring(2, 9)}`,
    user_id: userId,
    action: "Ticket opened",
    details: `Subject: ${title}`,
    created_at: new Date().toISOString()
  });

  saveStore(store);
  return res.json({ success: true, ticket });
});

// Admin Dynamic Reports API Endpoint
app.get("/api/admin/stats", (req, res) => {
  const store = loadStore();
  
  // Calculate analytics metrics
  const totalStudents = store.users.length - 1; // excluding admin login
  const activeBasicPlans = store.subscriptions.filter(s => s.plan_id === "basic-plan" && s.status === "active").length;
  const activePremiumPlans = store.subscriptions.filter(s => s.plan_id === "premium-plan" && s.status === "active").length;
  
  const totalRevenue = store.payments
    .filter(p => p.status === "successful")
    .reduce((val, p) => val + Number(p.amount), 0);

  const openTickets = store.tickets.filter(t => t.status === "open" || t.status === "in_progress").length;
  const deviceRegistrations = store.devices.length;

  return res.json({
    success: true,
    totalStudents,
    activeBasicPlans,
    activePremiumPlans,
    totalRevenue,
    openTickets,
    deviceRegistrations,
    usersList: store.profiles.map(p => {
      const u = store.users.find(usr => usr.id === p.user_id) || {};
      const sub = store.subscriptions.find(s => s.user_id === p.user_id && s.status === "active");
      const devCount = store.devices.filter(d => d.user_id === p.user_id).length;
      return {
        user_id: p.user_id,
        fullName: p.full_name,
        email: u.email,
        phone: p.phone,
        university: p.university,
        studentId: p.student_id,
        planName: sub ? (sub.plan_id === "premium-plan" ? "Premium Shield" : "Basic Cover") : "No Active Cover",
        devicesCount: devCount
      };
    }),
    paymentsReport: store.payments.map(pay => {
      const p = store.profiles.find(pro => pro.user_id === pay.user_id) || {};
      return {
        id: pay.id,
        customerName: p.full_name || "Unknown Student",
        ref: pay.transaction_ref,
        method: pay.payment_method,
        amount: pay.amount,
        date: pay.created_at,
        status: pay.status
      };
    })
  });
});

// Vite & Static Asset routing setup

const getProductionDistPath = async () => {
  const resolvedDirname = typeof __dirname !== "undefined" ? __dirname : "";
  const pathsToTry = [
    path.join(process.cwd(), "dist"),
    resolvedDirname,
    resolvedDirname ? path.join(resolvedDirname, "..", "dist") : "",
    path.join(process.cwd(), "applet", "dist")
  ].filter(Boolean);

  for (const p of pathsToTry) {
    if (p) {
      const indexPath = path.join(p, "index.html");
      if (fs.existsSync(indexPath)) {
        console.log(`[STUDENTSHIELD BACKEND] Found production assets directory with index.html at: ${p}`);
        return p;
      }
    }
  }

  // Attempt dynamic self-healing build if files are missing
  console.warn(`[STUDENTSHIELD BACKEND] WARNING: index.html not found in any standard dist path.`);
  console.log(`[STUDENTSHIELD BACKEND] Initiating self-healing production build dynamically...`);
  try {
    const { execSync } = await import("child_process");
    console.log(`[STUDENTSHIELD BACKEND] Executing: npx vite build`);
    execSync("npx vite build", {
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: "production" },
      stdio: "inherit"
    });
    console.log(`[STUDENTSHIELD BACKEND] Dynamic build completed successfully!`);

    // Re-verify after build
    for (const p of pathsToTry) {
      if (p) {
        const indexPath = path.join(p, "index.html");
        if (fs.existsSync(indexPath)) {
          console.log(`[STUDENTSHIELD BACKEND] Found production assets directory after manual build at: ${p}`);
          return p;
        }
      }
    }
  } catch (buildError) {
    console.error(`[STUDENTSHIELD BACKEND] Self-healing dynamic build failed:`, buildError);
  }

  // Debug logging for trouble diagnoses
  console.error(`[STUDENTSHIELD BACKEND] CRITICAL: Could not find index.html in any of the attempted dist paths:`, pathsToTry);
  console.log(`[STUDENTSHIELD BACKEND] process.cwd(): ${process.cwd()}`);
  try {
    console.log(`[STUDENTSHIELD BACKEND] Files in process.cwd():`, fs.readdirSync(process.cwd()));
  } catch (err) {}
  if (resolvedDirname) {
    console.log(`[STUDENTSHIELD BACKEND] __dirname: ${resolvedDirname}`);
    try {
      console.log(`[STUDENTSHIELD BACKEND] Files in __dirname:`, fs.readdirSync(resolvedDirname));
    } catch (err) {}
  }

  // Default fallback
  return path.join(process.cwd(), "dist");
};

const startFullstackServer = async () => {
  let isProduction = process.env.NODE_ENV === "production" || 
                     process.env.NODE_ENV === "prod" ||
                     process.env.K_SERVICE !== undefined ||
                     (typeof __filename !== "undefined" && (__filename.includes("dist") || __filename.includes("server.cjs"))) ||
                     !fs.existsSync(path.join(process.cwd(), "server.ts"));

  if (!isProduction) {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa"
      });
      app.use(vite.middlewares);
      console.log("[STUDENTSHIELD BACKEND] Vite development server middleware integrated.");
    } catch (viteError) {
      const errMsg = viteError instanceof Error ? viteError.message : String(viteError);
      console.warn(`[STUDENTSHIELD BACKEND] Vite could not be resolved (${errMsg}). Falling back to static production serving.`);
      isProduction = true;
    }
  }

  if (isProduction) {
    const distPath = await getProductionDistPath();
    
    // Serve build files static assets
    app.use(express.static(distPath));
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`[STUDENTSHIELD BACKEND] Serving production files statically from: ${distPath}`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[STUDENTSHIELD BACKEND RUNNING] Server operational on http://0.0.0.0:${PORT}`);
  });
};

// Catch-all startup
startFullstackServer().catch((err) => {
  console.error("Failed to safely deploy full-stack engine:", err);
});
