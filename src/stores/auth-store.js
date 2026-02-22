import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const MOCK_USERS = {
  'dr.test@hospital.org': {
    uid: 'user-001',
    name: 'Dr. Sarah Chen',
    email: 'dr.test@hospital.org',
    firstName: 'Sarah',
    lastName: 'Chen',
    role: 'medical_professional',
    organization: 'Metro General Hospital',
    organizationId: 'org-001',
  },
  'distributor@medequip.com': {
    uid: 'user-002',
    name: 'James Mitchell',
    email: 'distributor@medequip.com',
    firstName: 'James',
    lastName: 'Mitchell',
    role: 'distributor',
    organization: 'MedEquip Distribution Inc.',
    organizationId: 'org-002',
    shipToLocations: [
      { id: 'loc-001', name: 'Warehouse East', address: '100 Industrial Pkwy, Newark, NJ 07101' },
      { id: 'loc-002', name: 'Warehouse West', address: '500 Commerce Dr, Los Angeles, CA 90015' },
    ],
  },
  'salesrep@solventum.com': {
    uid: 'user-003',
    name: 'Emily Rodriguez',
    email: 'salesrep@solventum.com',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    role: 'sales_rep',
    organization: 'Solventum Corporation',
    organizationId: 'org-solventum',
    territory: 'Northeast Region',
    territoryId: 'terr-001',
  },
  'purchaser@memorial.org': {
    uid: 'user-004',
    name: 'Michael Thompson',
    email: 'purchaser@memorial.org',
    firstName: 'Michael',
    lastName: 'Thompson',
    role: 'hospital_group',
    organization: 'Memorial Health System',
    organizationId: 'org-003',
    locations: [
      { id: 'loc-010', name: 'Memorial Main Campus', type: 'site' },
      { id: 'loc-011', name: 'Memorial North', type: 'site' },
      { id: 'loc-012', name: 'OR Suite A', type: 'department', parentId: 'loc-010' },
      { id: 'loc-013', name: 'ICU Wing B', type: 'ward', parentId: 'loc-010' },
    ],
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
          const user = MOCK_USERS[username] || MOCK_USERS['distributor@medequip.com'];
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
