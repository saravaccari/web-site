import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock GoogleGenAI since we don't want to make real API calls in tests
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(function() {
      return {
        chats: {
          create: vi.fn().mockReturnValue({
            sendMessage: vi.fn().mockResolvedValue({ text: 'Mock response' }),
          }),
        },
      };
    }),
  };
});
