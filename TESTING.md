# Suite di Test Moto Travel Trentino

Questa suite di test garantisce la stabilità e la qualità del codice attraverso tre livelli di test:

## 1. Unit & Integration Tests (Vitest)
Utilizzati per testare la logica dei componenti e delle classi (come il Chatbot) in un ambiente simulato (JSDOM).

- **Esegui i test:** `npx vitest run`
- **Modalità Watch:** `npx vitest`
- **Interfaccia UI:** `npx vitest --ui`

I test si trovano in `src/test/`.

## 2. End-to-End Tests (Playwright)
Utilizzati per testare i flussi utente reali nel browser, navigando tra le pagine e interagendo con gli elementi.

- **Esegui i test:** `npx playwright test`
- **Mostra report:** `npx playwright show-report`

I test si trovano in `e2e/`.

## Configurazione
- `vitest.config.ts`: Configurazione per Vitest.
- `playwright.config.ts`: Configurazione per Playwright.
- `src/test/setup.ts`: Setup globale per i test (mock delle API, etc).
