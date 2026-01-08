


// import bcrypt from "bcryptjs";
// import User from "../models/User";

// // Define TypeScript interfaces
// interface UserData {
//   id: number;
//   username: string;
//   email: string;
//   password: string;
//   role: string;
// }

// // 🔹 O(1) rate limiting store with IP tracking
// const loginAttempts = new Map<string, { 
//   count: number, 
//   lastAttempt: number, 
//   lockUntil?: number 
// }>();

// // 🔹 Cache for frequently accessed users (O(1) lookup)
// const userCache = new Map<string, UserData>();

// // 🔹 Email validation cache (O(1) duplicate check)
// const emailCache = new Set<string>();

// export const registerService = async (data: any): Promise<UserData> => {
//   try {
//     const { username, email, password, role = "user" } = data;

//     // Check password length
//     if (!password || password.length < 6) {
//       throw new Error("Password must be at least 6 characters");
//     }

//     // Check existing user
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       throw new Error("User already exists with this email");
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//       role: role.toLowerCase()
//     });

//     return user.get({ plain: true }) as UserData;
//   } catch (error: any) {
//     console.error("REGISTER SERVICE ERROR 👉", error.message);
//     throw error;
//   }
// };

// // 🔹 Special admin creation function
// export const createAdminService = async () => {
//   try {
//     const adminEmail = "kiransoundarrajan@gmail.com";
    
//     // 🔹 O(1) cache check first
//     if (userCache.has(adminEmail)) {
//       const cachedAdmin = userCache.get(adminEmail)!;
//       return { 
//         message: "Admin already exists (cached)",
//         admin: cachedAdmin
//       };
//     }

//     // Check database
//     const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    
//     if (existingAdmin) {
//       const adminData = existingAdmin.get({ plain: true }) as UserData;
//       userCache.set(adminEmail, adminData); // Cache it
      
//       return { 
//         message: "Admin already exists",
//         admin: adminData
//       };
//     }
    
//     const hashedPassword = await bcrypt.hash("1234567890", 10);
    
//     const admin = await User.create({
//       username: "Nakkeeran S",
//       email: adminEmail,
//       password: hashedPassword,
//       role: "admin"
//     });

//     const adminData = admin.get({ plain: true }) as UserData;
    
//     // 🔹 Cache the admin (O(1) future access)
//     userCache.set(adminEmail, adminData);
//     emailCache.add(adminEmail);

//     return { 
//       message: "Admin created successfully",
//       admin: adminData
//     };
//   } catch (error: any) {
//     throw new Error(`Failed to create admin: ${error.message}`);
//   }
// };

// export const loginService = async (email: string, password: string): Promise<UserData | null> => {
//   // 🔹 O(1) rate limiting check
//   const now = Date.now();
//   const attempts = loginAttempts.get(email);
  
//   if (attempts && attempts.lockUntil && now < attempts.lockUntil) {
//     const remainingMinutes = Math.ceil((attempts.lockUntil - now) / (1000 * 60));
//     throw new Error(`Too many login attempts. Try again in ${remainingMinutes} minutes`);
//   }
  
//   // 🔹 Reset if lock time has passed
//   if (attempts && attempts.lockUntil && now >= attempts.lockUntil) {
//     loginAttempts.delete(email);
//   }

//   // 🔹 O(1) cache check for user
//   if (userCache.has(email)) {
//     const cachedUser = userCache.get(email)!;
    
//     // Verify password
//     const isMatch = await bcrypt.compare(password, cachedUser.password);
    
//     if (isMatch) {
//       // Reset login attempts on success
//       loginAttempts.delete(email);
//       return cachedUser;
//     } else {
//       // Track failed attempt
//       trackFailedAttempt(email, now);
//       return null;
//     }
//   }

//   // 🔹 Database lookup if not in cache
//   const user = await User.findOne({ where: { email } });
  
//   if (!user) {
//     trackFailedAttempt(email, now);
//     return null;
//   }

//   // Get user as plain object
//   const userData = user.get({ plain: true }) as any;
  
//   // 🔹 IMPORTANT: Check if ID exists
//   if (!userData.id) {
//     console.error("❌ User record has no ID:", userData);
//     // Try to get ID using getDataValue as fallback
//     userData.id = user.getDataValue('id');
    
//     if (!userData.id) {
//       throw new Error("User record is missing ID field");
//     }
//   }

//   const isMatch = await bcrypt.compare(password, userData.password);
  
//   if (!isMatch) {
//     trackFailedAttempt(email, now);
//     return null;
//   }
  
//   // 🔹 Cache the user for future logins (O(1) access)
//   userCache.set(email, userData as UserData);
  
//   // Reset login attempts on success
//   loginAttempts.delete(email);
  
//   return userData as UserData;
// };

// // 🔹 Helper function for tracking failed attempts (O(1))
// const trackFailedAttempt = (email: string, timestamp: number) => {
//   const attempts = loginAttempts.get(email) || { 
//     count: 0, 
//     lastAttempt: timestamp 
//   };
  
//   attempts.count += 1;
//   attempts.lastAttempt = timestamp;
  
//   // Lock account after 5 failed attempts for 15 minutes
//   if (attempts.count >= 5) {
//     attempts.lockUntil = timestamp + (15 * 60 * 1000); // 15 minutes
//   }
  
//   loginAttempts.set(email, attempts);
  
//   // Auto-cleanup after lock expires
//   if (attempts.lockUntil) {
//     setTimeout(() => {
//       const current = loginAttempts.get(email);
//       if (current && current.lockUntil === attempts.lockUntil) {
//         loginAttempts.delete(email);
//       }
//     }, 15 * 60 * 1000); // 15 minutes
//   }
// };

// // 🔹 Optional: Function to clear all caches (for testing/reset)
// export const clearAuthCaches = () => {
//   loginAttempts.clear();
//   userCache.clear();
//   emailCache.clear();
// };


import bcrypt from "bcryptjs";
import User from "../models/User";

// Define TypeScript interfaces
interface UserData {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

interface SafeUserData {
  id: number;
  username: string;
  email: string;
  role: string;
}

// 🔹 Rate limiting store
const loginAttempts = new Map<string, { 
  count: number, 
  lastAttempt: number, 
  lockUntil?: number 
}>();

// 🔹 Cache for frequently accessed users
const userCache = new Map<string, SafeUserData>();

export const registerService = async (data: any): Promise<SafeUserData> => {
  try {
    const { username, email, password, role = "user" } = data;

    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role.toLowerCase()
    });

    // Get user as plain object
    const userPlain = user.get({ plain: true }) as UserData;
    
    // Return without password
    return {
      id: userPlain.id,
      username: userPlain.username,
      email: userPlain.email,
      role: userPlain.role
    };
  } catch (error: any) {
    console.error("REGISTER SERVICE ERROR 👉", error.message);
    throw error;
  }
};

export const createAdminService = async () => {
  try {
    const adminEmail = "kiransoundarrajan@gmail.com";
    
    if (userCache.has(adminEmail)) {
      const cachedAdmin = userCache.get(adminEmail)!;
      return { 
        message: "Admin already exists (cached)",
        admin: cachedAdmin
      };
    }

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    
    if (existingAdmin) {
      const adminPlain = existingAdmin.get({ plain: true }) as UserData;
      const adminData = {
        id: adminPlain.id,
        username: adminPlain.username,
        email: adminPlain.email,
        role: adminPlain.role
      };
      userCache.set(adminEmail, adminData);
      
      return { 
        message: "Admin already exists",
        admin: adminData
      };
    }
    
    const hashedPassword = await bcrypt.hash("1234567890", 10);
    
    const admin = await User.create({
      username: "Nakkeeran S",
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    });

    const adminPlain = admin.get({ plain: true }) as UserData;
    const adminData = {
      id: adminPlain.id,
      username: adminPlain.username,
      email: adminPlain.email,
      role: adminPlain.role
    };
    
    userCache.set(adminEmail, adminData);

    return { 
      message: "Admin created successfully",
      admin: adminData
    };
  } catch (error: any) {
    throw new Error(`Failed to create admin: ${error.message}`);
  }
};

export const loginService = async (email: string, password: string): Promise<SafeUserData | null> => {
  const now = Date.now();
  const attempts = loginAttempts.get(email);
  
  if (attempts && attempts.lockUntil && now < attempts.lockUntil) {
    const remainingMinutes = Math.ceil((attempts.lockUntil - now) / (1000 * 60));
    throw new Error(`Too many login attempts. Try again in ${remainingMinutes} minutes`);
  }
  
  if (attempts && attempts.lockUntil && now >= attempts.lockUntil) {
    loginAttempts.delete(email);
  }

  // 🔹 O(1) cache check for user
  if (userCache.has(email)) {
    const cachedUser = userCache.get(email)!;
    
    // Get user with password from DB for verification
    const user = await User.findOne({ where: { email } });
    if (!user) return null;
    
    const userPlain = user.get({ plain: true }) as UserData;
    const isMatch = await bcrypt.compare(password, userPlain.password);
    
    if (isMatch) {
      loginAttempts.delete(email);
      return cachedUser;
    } else {
      trackFailedAttempt(email, now);
      return null;
    }
  }

  const user = await User.findOne({ where: { email } });
  
  if (!user) {
    trackFailedAttempt(email, now);
    return null;
  }

  const userPlain = user.get({ plain: true }) as UserData;
  const isMatch = await bcrypt.compare(password, userPlain.password);
  
  if (!isMatch) {
    trackFailedAttempt(email, now);
    return null;
  }
  
  // Create safe user object without password
  const safeUserData: SafeUserData = {
    id: userPlain.id,
    username: userPlain.username,
    email: userPlain.email,
    role: userPlain.role
  };
  
  userCache.set(email, safeUserData);
  loginAttempts.delete(email);
  
  return safeUserData;
};

const trackFailedAttempt = (email: string, timestamp: number) => {
  const attempts = loginAttempts.get(email) || { 
    count: 0, 
    lastAttempt: timestamp 
  };
  
  attempts.count += 1;
  attempts.lastAttempt = timestamp;
  
  if (attempts.count >= 5) {
    attempts.lockUntil = timestamp + (15 * 60 * 1000);
  }
  
  loginAttempts.set(email, attempts);
  
  if (attempts.lockUntil) {
    setTimeout(() => {
      const current = loginAttempts.get(email);
      if (current && current.lockUntil === attempts.lockUntil) {
        loginAttempts.delete(email);
      }
    }, 15 * 60 * 1000);
  }
};

export const clearAuthCaches = () => {
  loginAttempts.clear();
  userCache.clear();
};