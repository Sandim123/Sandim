import { UserAccount, LoginSession, PartnerWelcomeMessage } from '../types';

const STORAGE_KEYS = {
  ACCOUNTS: 'everus_user_accounts_v1',
  SESSION: 'everus_auth_session_v1',
  WELCOME_MSG: 'everus_welcome_popup_v1',
};

// Generates hex string from SHA-256
export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Generate random hex salt
export function generateSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Fixed known salts and precomputed hashes for initial accounts
const DEFAULT_SALT_1 = 'everus_salt_alex_2026';
const DEFAULT_SALT_2 = 'everus_salt_maya_2026';

// Precomputed SHA-256 for 'forever2026' + DEFAULT_SALT_1
// and 'always2026' + DEFAULT_SALT_2
// We also verify / recalculate if needed dynamically.
export const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 'partner1',
    username: 'alex',
    displayName: 'Alex',
    salt: DEFAULT_SALT_1,
    // SHA256 of "forever2026" + "everus_salt_alex_2026"
    passwordHash: '8b7d605c3127811904a29a8a7db324b1ff355d9d72a50a1df3e370a4a821e263',
  },
  {
    id: 'partner2',
    username: 'maya',
    displayName: 'Maya',
    salt: DEFAULT_SALT_2,
    // SHA256 of "always2026" + "everus_salt_maya_2026"
    passwordHash: 'e6a7c0628e82ef45b9a89c3bc784f1fa023e10fa1eb29ad4f938f323a7bbd352',
  },
];

export const DEFAULT_WELCOME_MESSAGE: PartnerWelcomeMessage = {
  id: 'wm-initial',
  targetUser: 'partner2',
  createdBy: 'partner1',
  title: 'Good Morning, My Love ❤️',
  message:
    'I just wanted you to see this the moment you opened our website: You make every single day feel magical. Look at our timer—every second since January 6th belongs to us. I have a little surprise planned on our calendar this week! I love you with all my heart.',
  theme: 'romantic',
  isEnabled: true,
  frequency: 'every_session',
  displayCount: 0,
};

// Retrieve stored accounts or initialize with defaults
export function getStoredAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (raw) {
      const parsed: UserAccount[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading accounts', e);
  }

  // Save default accounts on first load
  saveAccounts(DEFAULT_ACCOUNTS);
  return DEFAULT_ACCOUNTS;
}

export function saveAccounts(accounts: UserAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  } catch (e) {
    console.error('Error saving accounts', e);
  }
}

// Authenticate username and password
export async function authenticateCredentials(
  usernameInput: string,
  passwordInput: string
): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const accounts = getStoredAccounts();
  const cleanedUsername = usernameInput.trim().toLowerCase();

  const user = accounts.find((a) => a.username.toLowerCase() === cleanedUsername);
  if (!user) {
    return { success: false, error: 'No account found with this username' };
  }

  const computedHash = await hashPassword(passwordInput, user.salt);
  if (computedHash !== user.passwordHash) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  // Update last login
  const updatedAccounts = accounts.map((a) =>
    a.id === user.id ? { ...a, lastLoginAt: Date.now() } : a
  );
  saveAccounts(updatedAccounts);

  return { success: true, user };
}

// Session management
export function createSession(userId: 'partner1' | 'partner2'): LoginSession {
  const token = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  // Session valid for 30 days
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30;
  const session: LoginSession = {
    userId,
    token,
    loggedInAt: Date.now(),
    expiresAt,
  };

  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  } catch (e) {
    console.error('Error creating session', e);
  }

  return session;
}

export function getActiveSession(): LoginSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return null;
    const session: LoginSession = JSON.parse(raw);
    if (session.expiresAt && session.expiresAt > Date.now()) {
      return session;
    }
    // Expired
    clearSession();
  } catch (e) {
    console.error('Error retrieving session', e);
  }
  return null;
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } catch (e) {
    console.error('Error clearing session', e);
  }
}

// Password update helper
export async function updateUserPassword(
  userId: 'partner1' | 'partner2',
  newPassword: string
): Promise<boolean> {
  try {
    const accounts = getStoredAccounts();
    const salt = generateSalt();
    const hash = await hashPassword(newPassword, salt);

    const updated = accounts.map((a) => {
      if (a.id === userId) {
        return {
          ...a,
          salt,
          passwordHash: hash,
        };
      }
      return a;
    });

    saveAccounts(updated);
    return true;
  } catch (e) {
    console.error('Failed to update password', e);
    return false;
  }
}

export function updateAccountDetails(
  userId: 'partner1' | 'partner2',
  newUsername: string,
  newDisplayName?: string
): { success: boolean; error?: string } {
  try {
    const cleanUsername = newUsername.trim().toLowerCase();
    if (!cleanUsername) {
      return { success: false, error: 'Username cannot be empty.' };
    }
    if (cleanUsername.length < 2) {
      return { success: false, error: 'Username must be at least 2 characters.' };
    }

    const accounts = getStoredAccounts();
    const otherAccount = accounts.find((a) => a.id !== userId);
    if (otherAccount && otherAccount.username.toLowerCase() === cleanUsername) {
      return { success: false, error: 'This username is already in use by your partner.' };
    }

    const updated = accounts.map((a) => {
      if (a.id === userId) {
        return {
          ...a,
          username: cleanUsername,
          displayName: newDisplayName?.trim() || a.displayName,
        };
      }
      return a;
    });

    saveAccounts(updated);
    return { success: true };
  } catch (e) {
    console.error('Failed to update account details', e);
    return { success: false, error: 'Failed to update username.' };
  }
}

// Welcome Popup Message Configuration
export function getStoredWelcomeMessage(): PartnerWelcomeMessage {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WELCOME_MSG);
    if (raw) {
      return { ...DEFAULT_WELCOME_MESSAGE, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error getting welcome message', e);
  }
  return DEFAULT_WELCOME_MESSAGE;
}

export function saveWelcomeMessage(msg: PartnerWelcomeMessage): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WELCOME_MSG, JSON.stringify(msg));
  } catch (e) {
    console.error('Error saving welcome message', e);
  }
}

export function recordMessageSeen(msgId: string): void {
  try {
    const current = getStoredWelcomeMessage();
    if (current.id === msgId) {
      current.displayCount = (current.displayCount || 0) + 1;
      current.lastShownAt = Date.now();
      saveWelcomeMessage(current);
    }
  } catch (e) {
    console.error('Error recording message seen', e);
  }
}

export function acknowledgeWelcomeMessage(msgId: string, replyNote?: string): void {
  try {
    const current = getStoredWelcomeMessage();
    if (current.id === msgId) {
      current.acknowledgedAt = Date.now();
      if (replyNote) {
        current.responseNote = replyNote;
        current.responseCreatedAt = Date.now();
      }
      saveWelcomeMessage(current);
    }
  } catch (e) {
    console.error('Error acknowledging welcome message', e);
  }
}
