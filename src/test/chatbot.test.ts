import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Chatbot } from '../chatbot';

describe('Chatbot', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // Mock process.env
    vi.stubGlobal('process', { env: { GEMINI_API_KEY: 'test-key' } });
  });

  it('should inject HTML into the body on initialization', () => {
    new Chatbot();
    expect(document.getElementById('chatbot-trigger')).not.toBeNull();
    expect(document.getElementById('chatbot-window')).not.toBeNull();
  });

  it('should toggle chat window when trigger is clicked', () => {
    const chatbot = new Chatbot();
    const trigger = document.getElementById('chatbot-trigger');
    const window = document.getElementById('chatbot-window');

    expect(window?.classList.contains('active')).toBe(false);

    trigger?.click();
    expect(window?.classList.contains('active')).toBe(true);

    trigger?.click();
    expect(window?.classList.contains('active')).toBe(false);
  });

  it('should add user message to the container', async () => {
    new Chatbot();
    const input = document.getElementById('chatbot-input') as HTMLInputElement;
    const sendBtn = document.getElementById('chatbot-send');
    const messages = document.getElementById('chatbot-messages');

    input.value = 'Hello';
    sendBtn?.click();

    const userMessage = Array.from(messages?.querySelectorAll('.message.user') || [])
      .find(el => el.textContent === 'Hello');
    
    expect(userMessage).toBeDefined();
  });
});
