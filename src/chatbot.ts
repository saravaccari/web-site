import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `Sei l'assistente virtuale di Moto Travel Trentino. 
Il tuo compito è rispondere alle domande degli utenti in modo professionale, cordiale e utile.

Moto Travel Trentino offre:
1. Formazione d'eccellenza per presidenti di motoclub: Corsi di governance, gestione eventi e leadership.
2. Itinerari strutturati: Percorsi testati chilometro per chilometro nelle Dolomiti e in Trentino, pensati per il mototurismo europeo alto-spendente.
3. Web App Gestionali:
   - Adminiu: Per la gestione amministrativa del motoclub.
   - Eventium: Per l'organizzazione e la promozione di eventi.
   - Registra: Per la registrazione semplificata dei partecipanti.

Dettagli chiave:
- Focus sulla qualità, sicurezza e replicabilità degli itinerari.
- Target: Presidenti di motoclub e motociclisti che cercano esperienze premium.
- Sede: Trentino Alto Adige, Italia.

Rispondi sempre in italiano. Se non conosci una risposta specifica, invita l'utente a contattare il team tramite la pagina contatti.`;

export class Chatbot {
  private ai: GoogleGenAI;
  private chat: any;
  private isOpen: boolean = false;
  private messagesContainer: HTMLElement | null = null;
  private inputElement: HTMLInputElement | null = null;
  private windowElement: HTMLElement | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: (process.env.GEMINI_API_KEY as string) });
    this.chat = this.ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    this.init();
  }

  private init() {
    this.injectHTML();
    this.setupEventListeners();
  }

  private injectHTML() {
    const chatbotHTML = `
      <div class="chatbot-trigger" id="chatbot-trigger">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </div>
      <div class="chatbot-window" id="chatbot-window">
        <div class="chatbot-header">
          <h3>Supporto Moto Travel</h3>
          <button class="chatbot-close" id="chatbot-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="chatbot-messages" id="chatbot-messages">
          <div class="message bot">Ciao! Come posso aiutarti oggi con i nostri itinerari, la formazione o le web app?</div>
        </div>
        <div class="chatbot-input-area">
          <input type="text" class="chatbot-input" id="chatbot-input" placeholder="Scrivi un messaggio...">
          <button class="chatbot-send" id="chatbot-send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = chatbotHTML;
    document.body.appendChild(div);

    this.messagesContainer = document.getElementById('chatbot-messages');
    this.inputElement = document.getElementById('chatbot-input') as HTMLInputElement;
    this.windowElement = document.getElementById('chatbot-window');
  }

  private setupEventListeners() {
    const trigger = document.getElementById('chatbot-trigger');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chatbot-send');

    trigger?.addEventListener('click', () => this.toggleChat());
    closeBtn?.addEventListener('click', () => this.toggleChat());
    sendBtn?.addEventListener('click', () => this.handleSendMessage());
    this.inputElement?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSendMessage();
    });
  }

  private toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.windowElement?.classList.add('active');
    } else {
      this.windowElement?.classList.remove('active');
    }
  }

  private async handleSendMessage() {
    const text = this.inputElement?.value.trim();
    if (!text) return;

    this.addMessage(text, 'user');
    this.inputElement!.value = '';
    
    const typingIndicator = this.showTypingIndicator();
    
    try {
      const response = await this.chat.sendMessage({ message: text });
      typingIndicator.remove();
      this.addMessage(response.text, 'bot');
    } catch (error) {
      console.error('Chatbot error:', error);
      typingIndicator.remove();
      this.addMessage('Scusa, si è verificato un errore. Riprova più tardi o contattaci direttamente.', 'bot');
    }
  }

  private addMessage(text: string, sender: 'user' | 'bot') {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.textContent = text;
    this.messagesContainer?.appendChild(msgDiv);
    this.scrollToBottom();
  }

  private showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message bot typing-indicator';
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    this.messagesContainer?.appendChild(indicator);
    this.scrollToBottom();
    return indicator;
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Chatbot();
});
