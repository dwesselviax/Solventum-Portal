import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCommentsStore = create(
  persist(
    (set, get) => ({
      comments: [],
      _initialized: false,

      initialize: (seedComments) => {
        if (get()._initialized) return;
        set({ comments: seedComments, _initialized: true });
      },

      addComment: ({ quoteId, author, text, visibility, attachments = [] }) => {
        const id = 'CMT-' + Date.now();
        const comment = {
          id,
          quoteId,
          author,
          text,
          visibility,
          attachments,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ comments: [...state.comments, comment] }));
        return comment;
      },

      getComments: (quoteId) => {
        return get().comments.filter((c) => c.quoteId === quoteId);
      },

      reset: () => set({ comments: [], _initialized: false }),
    }),
    {
      name: 'solventum-comments',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
);
