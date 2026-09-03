export type UserRole = 'admin' | 'user' | 'staff';

export interface UserSession {
  username: string;
  role: UserRole;
  name: string;
  email: string;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: UserSession;
  error?: string;
}

// Temporary demo accounts as required by SmartPark specifications
// In production, this service can easily be swapped with backend API calls
const DEMO_ACCOUNTS: Array<{
  username: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
}> = [
  {
    username: 'admin',
    email: 'admin@smartpark.com',
    password: 'admin123',
    role: 'admin',
    name: 'Alex Rivera (Administrator)',
  },
  {
    username: 'user',
    email: 'user@smartpark.com',
    password: 'user123',
    role: 'user',
    name: 'Sarah Connor (Driver)',
  },
  {
    username: 'staff',
    email: 'staff@smartpark.com',
    password: 'staff123',
    role: 'staff',
    name: 'Marcus Vance (Facility Staff)',
  },
];

const STORAGE_KEY = 'loggedInUser';

export const authService = {
  /**
   * Authenticates user against demo credentials
   */
  login: async (credentials: LoginCredentials): Promise<AuthResult> => {
    // Simulating brief realistic network delay (modular for future API swap)
    await new Promise((resolve) => setTimeout(resolve, 350));

    const identifier = credentials.usernameOrEmail.trim().toLowerCase();
    const password = credentials.password;

    const matchedAccount = DEMO_ACCOUNTS.find(
      (acc) =>
        (acc.username.toLowerCase() === identifier || acc.email.toLowerCase() === identifier) &&
        acc.password === password
    );

    if (matchedAccount) {
      const sessionUser: UserSession = {
        username: matchedAccount.username,
        role: matchedAccount.role,
        name: matchedAccount.name,
        email: matchedAccount.email,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
      return { success: true, user: sessionUser };
    }

    return {
      success: false,
      error: 'Invalid username or password.',
    };
  },

  /**
   * Logs out the current user session
   */
  logout: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Retrieves active logged-in user from localStorage
   */
  getCurrentUser: (): UserSession | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as UserSession;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  },

  /**
   * Checks if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return authService.getCurrentUser() !== null;
  },

  /**
   * Returns dashboard route depending on user role
   */
  getDashboardRoute: (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'staff':
        return '/staff/dashboard';
      case 'user':
      default:
        return '/user/dashboard';
    }
  },

  /**
   * Returns demo accounts for testing helpers (non-intrusive)
   */
  getDemoCredentials: () => [
    { role: 'admin' as UserRole, username: 'admin', label: 'Admin (admin / admin123)' },
    { role: 'user' as UserRole, username: 'user', label: 'User (user / user123)' },
    { role: 'staff' as UserRole, username: 'staff', label: 'Staff (staff / staff123)' },
  ],
};
