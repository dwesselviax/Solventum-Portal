import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const MOCK_USERS = {
  'orthodontist@chenortho.com': {
    uid: 'user-001',
    name: 'Dr. Sarah Chen',
    email: 'orthodontist@chenortho.com',
    firstName: 'Sarah',
    lastName: 'Chen',
    role: 'orthodontist',
    organization: 'Chen Orthodontics',
    organizationId: 'ORG-001',
  },
  'admin@smiledso.com': {
    uid: 'user-002',
    name: 'Mark Reynolds',
    email: 'admin@smiledso.com',
    firstName: 'Mark',
    lastName: 'Reynolds',
    role: 'dso',
    organization: 'Smile DSO Group',
    organizationId: 'ORG-002',
  },
  'salesrep@solventum.com': {
    uid: 'user-003',
    name: 'Emily Rodriguez',
    email: 'salesrep@solventum.com',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    role: 'sales_rep',
    organization: 'Solventum Corporation',
    organizationId: 'ORG-SOL',
    territory: 'Northeast Region',
    territoryId: 'terr-001',
  },
  'ar@solventum.com': {
    uid: 'user-004',
    name: 'Lisa Park',
    email: 'ar@solventum.com',
    firstName: 'Lisa',
    lastName: 'Park',
    role: 'ar',
    organization: 'Solventum Corporation',
    organizationId: 'ORG-SOL',
  },
  'csr@solventum.com': {
    uid: 'user-005',
    name: 'David Kim',
    email: 'csr@solventum.com',
    firstName: 'David',
    lastName: 'Kim',
    role: 'csr',
    organization: 'Solventum Corporation',
    organizationId: 'ORG-SOL',
  },
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      refreshExpiresAt: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        const useMock = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

        if (useMock) {
          await new Promise((r) => setTimeout(r, 800));
          const user = MOCK_USERS[username] || MOCK_USERS['orthodontist@chenortho.com'];
          const now = Date.now();
          set({
            accessToken: 'mock-access-token-' + now,
            refreshToken: 'mock-refresh-token-' + now,
            expiresAt: now + 3600 * 1000,
            refreshExpiresAt: now + 86400 * 1000,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return;
        }

        try {
          const { default: axios } = await import('axios');
          const realm = process.env.NEXT_PUBLIC_VIAX_REALM;
          const authUrl = process.env.NEXT_PUBLIC_VIAX_AUTH_URL;
          const clientId = process.env.NEXT_PUBLIC_VIAX_CLIENT_ID;

          const params = new URLSearchParams({
            grant_type: 'password',
            client_id: clientId,
            username,
            password,
          });

          const { data } = await axios.post(
            authUrl + '/realms/' + realm + '/protocol/openid-connect/token',
            params,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
          );

          const now = Date.now();
          set({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresAt: now + data.expires_in * 1000,
            refreshExpiresAt: now + data.refresh_expires_in * 1000,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          set({
            isLoading: false,
            error: err.response?.data?.error_description || 'Authentication failed',
          });
        }
      },

      refreshTokens: async () => {
        const { refreshToken } = get();
        const useMock = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

        if (useMock) {
          const now = Date.now();
          set({
            accessToken: 'mock-access-token-refreshed-' + now,
            expiresAt: now + 3600 * 1000,
          });
          return;
        }

        try {
          const { default: axios } = await import('axios');
          const realm = process.env.NEXT_PUBLIC_VIAX_REALM;
          const authUrl = process.env.NEXT_PUBLIC_VIAX_AUTH_URL;
          const clientId = process.env.NEXT_PUBLIC_VIAX_CLIENT_ID;

          const params = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: clientId,
            refresh_token: refreshToken,
          });

          const { data } = await axios.post(
            authUrl + '/realms/' + realm + '/protocol/openid-connect/token',
            params,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
          );

          const now = Date.now();
          set({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresAt: now + data.expires_in * 1000,
            refreshExpiresAt: now + data.refresh_expires_in * 1000,
          });
        } catch {
          get().logout();
        }
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          refreshExpiresAt: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'solventum-auth',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? sessionStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
);
