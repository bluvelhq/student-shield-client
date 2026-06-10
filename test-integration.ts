import { spawn } from "child_process";
import path from "path";

const PORT = 3003;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Beautiful display utility functions
const log = {
  info: (msg: string) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg: string) => console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`),
  error: (msg: string) => console.error(`\x1b[31m[FAIL]\x1b[0m ${msg}`),
  header: (msg: string) => console.log(`\n\x1b[34m=== ${msg} ===\x1b[0m`),
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  log.header("STUDENTSHIELD SUITE: SPINNING UP LOCAL SERVERS");
  
  // Start the server compiler process under tsx or directly running the bundle
  // Let's spawn server.ts
  const serverPath = path.join(process.cwd(), "server.ts");
  log.info(`Spawning server file under node environment from: ${serverPath}`);
  
  const serverProcess = spawn("npx", ["tsx", "server.ts"], {
    env: {
      ...process.env,
      PORT: String(PORT),
      NODE_ENV: "development",
    },
    detached: true,
  });

  serverProcess.stdout?.on("data", (data) => {
    const rawStr = data.toString();
    if (rawStr.includes("[STUDENTSHIELD BACKEND RUNNING]")) {
      log.info(`Server message: ${rawStr.trim()}`);
    }
  });

  serverProcess.stderr?.on("data", (data) => {
    const rawError = data.toString();
    log.error(`Server error stream: ${rawError.trim()}`);
  });

  // Wait for server initialization
  log.info("Awaiting server boot sequences (3 seconds delay)...");
  await sleep(3000);

  let successCount = 0;
  let totalCount = 0;

  const testCase = async (name: string, fn: () => Promise<void>) => {
    totalCount++;
    log.header(`TEST CASE ${totalCount}: ${name}`);
    try {
      await fn();
      successCount++;
      log.success(name);
    } catch (err: any) {
      log.error(`${name}: ${err.message || err}`);
    }
  };

  let testUserId = "";
  let testDeviceId = "";

  try {
    // TestCase 1: Register a new student shielding plan
    await testCase("Student Shield Plan Registration", async () => {
      const payload = {
        fullName: "Test Scholar Ghana",
        email: `test-ghana-${Math.random().toString(36).substring(2, 7)}@university.edu`,
        phone: "+233501112233",
        university: "University of Ghana",
        studentId: "UG-1199228",
        password: "UniversitySecure99!",
        planId: "premium-plan",
      };

      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP network error returned status: ${res.status}`);
      }

      const data = await res.json() as any;
      if (!data.success || !data.user || !data.user.id) {
        throw new Error(`Invalid response structure: ${JSON.stringify(data)}`);
      }

      testUserId = data.user.id;
      log.info(`Registered user successfully: ${data.user.email} (ID: ${testUserId})`);
      if (data.subscription.plan_id !== "premium-plan") {
        throw new Error("Plan ID is mismatched in response subscription entry.");
      }
    });

    // TestCase 2: Authenticate Registered Account Logins
    await testCase("User Account Login Flow", async () => {
      // Find the user registered in the previous test from the simulated database
      const payload = {
        email: "test-scholar@university.edu", // test login falling back to stored users, or check our created one
        password: "SomePassword!",
      };

      // Let's first register the standard test user to query cleanly if missing
      await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Demo Student",
          email: "test-scholar@university.edu",
          phone: "+233544555666",
          university: "KNUST",
          studentId: "KN-990011",
          password: "SomePassword!",
          planId: "basic-plan",
        }),
      });

      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP failure returned status code: ${res.status}`);
      }

      const data = await res.json() as any;
      if (!data.success || !data.user) {
        throw new Error(`Login verified failure: ${JSON.stringify(data)}`);
      }

      log.info(`Authenticated student profile successfully. Role verified as: ${data.user.role}`);
    });

    // TestCase 3: Laptop Device Safe Shield Registration
    await testCase("Device Registration & Verification", async () => {
      if (!testUserId) {
        throw new Error("Cannot run test, register student step failed to extract standard user ID.");
      }

      const payload = {
        userId: testUserId,
        brand: "Dell",
        model: "Latitude 5440 LTE",
        serialNumber: "SN-DELL-9008271",
        purchaseYear: "2025",
        imageUrl: "",
      };

      const res = await fetch(`${BASE_URL}/api/devices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP bad response status returned: ${res.status}`);
      }

      const data = await res.json() as any;
      if (!data.success || !data.device || !data.device.id) {
        throw new Error(`Device registry failure: ${JSON.stringify(data)}`);
      }

      testDeviceId = data.device.id;
      log.info(`Enregistered device successfully: ${data.device.name} (Ref: ${testDeviceId})`);

      // Test GET retriever
      const getRes = await fetch(`${BASE_URL}/api/devices?userId=${testUserId}`);
      const getData = await getRes.json() as any;
      if (!getData.success || getData.devices.length === 0) {
        throw new Error("Device was registered but not found in the list query.");
      }
      log.info(`Device listing matched target quantity for student: ${getData.devices.length} laptop(s) listed.`);
    });

    // TestCase 4: Support Ticket Generation
    await testCase("Support Ticket Incident Open Loop", async () => {
      if (!testUserId || !testDeviceId) {
        throw new Error("Pre-requisite user/device references cannot be verified.");
      }

      const payload = {
        userId: testUserId,
        deviceId: testDeviceId,
        title: "Liquid Spill on keyboard area",
        description: "Accidently spilled water during homework submission.",
        category: "hardware",
        priority: "high",
      };

      const res = await fetch(`${BASE_URL}/api/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Bad response status returned: ${res.status}`);
      }

      const data = await res.json() as any;
      if (!data.success || !data.ticket || !data.ticket.id) {
        throw new Error(`Support log receipt failed: ${JSON.stringify(data)}`);
      }

      log.info(`Opened incident ticket successfully: Ticket ref ${data.ticket.id}`);

      // Test GET retriever
      const getRes = await fetch(`${BASE_URL}/api/tickets?userId=${testUserId}`);
      const getData = await getRes.json() as any;
      if (!getData.success || getData.tickets.length === 0) {
        throw new Error("Ticket was not discovered in the opened records.");
      }
      log.info(`Active tickets in queue for student logged: ${getData.tickets.length} total.`);
    });

    // TestCase 5: Administrative Core Dashboard Metrics Reporting
    await testCase("Admin Service Metrics Calculation", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/stats`);
      if (!res.ok) {
        throw new Error(`Stats endpoint responded with status: ${res.status}`);
      }

      const data = await res.json() as any;
      log.info(`Found administrative stats payload metrics: ${JSON.stringify(data)}`);
      if (typeof data.totalStudents !== "number" || typeof data.openTickets !== "number" || typeof data.deviceRegistrations !== "number") {
        throw new Error("Calculated dashboard properties contain undefined schemas or values.");
      }
    });

  } finally {
    log.header("TEARDOWN CAPABILITIES: KILLING LOCAL BACKGROUND DAEMONS");
    try {
      // Gracefully kill the background process tree
      process.kill(-serverProcess.pid!);
    } catch (e) {
      serverProcess.kill("SIGINT");
    }
    log.info("Server terminated successfully.");
  }

  log.header("INTEGRATION METRICS ANALYSIS REPORT CARD");
  console.log(`PASSING RUNS: ${successCount} / ${totalCount} (${Math.round((successCount / totalCount) * 100)}%)`);
  
  if (successCount === totalCount) {
    console.log("\x1b[32m✔ CONGRATULATIONS: STUDENTSHIELD DEV PIPELINE FULLY HEALTHY!\x1b[0m\n");
    process.exit(0);
  } else {
    console.error("\x1b[31m✖ PIPELINE TEST FAILURES DETECTED. RETRY DEBUG DEEP ANALYSIS.\x1b[0m\n");
    process.exit(1);
  }
}

runTests().catch((err) => {
  log.error(`Global script pipeline uncaught exception: ${err}`);
  process.exit(1);
});
