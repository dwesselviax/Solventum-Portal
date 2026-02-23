import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useTeamStore = create(
  persist(
    (set, get) => ({
      members: [],
      _initialized: false,

      initialize: (seedMembers) => {
        if (get()._initialized) return;
        set({ members: seedMembers, _initialized: true });
      },

      getMembers: (organizationId) => {
        return get().members.filter((m) => m.organizationId === organizationId);
      },

      getMember: (id) => {
        return get().members.find((m) => m.id === id);
      },

      addMember: (member) => {
        const id = 'MBR-' + Date.now();
        const newMember = {
          ...member,
          id,
          status: 'pending',
          invitedAt: new Date().toISOString(),
          joinedAt: null,
          notifications: {
            orderUpdates: { inApp: true, email: true, sms: false },
            shipments: { inApp: true, email: true, sms: false },
            invoices: { inApp: true, email: true, sms: true },
            promotions: { inApp: true, email: false, sms: false },
            contractAlerts: { inApp: true, email: true, sms: false },
          },
        };
        set((state) => ({ members: [...state.members, newMember] }));
        return newMember;
      },

      updateMember: (id, updates) => {
        set((state) => ({
          members: state.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }));
      },

      updateNotification: (memberId, notificationType, channel, value) => {
        set((state) => ({
          members: state.members.map((m) => {
            if (m.id !== memberId) return m;
            return {
              ...m,
              notifications: {
                ...m.notifications,
                [notificationType]: {
                  ...m.notifications[notificationType],
                  [channel]: value,
                },
              },
            };
          }),
        }));
      },

      deactivateMember: (id) => {
        set((state) => ({
          members: state.members.map((m) => (m.id === id ? { ...m, status: 'deactivated' } : m)),
        }));
      },

      reset: () => set({ members: [], _initialized: false }),
    }),
    {
      name: 'solventum-team',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
);
