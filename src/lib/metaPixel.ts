// Dispara um evento do Meta Pixel (ver o script no <head> de index.html).
// Não faz nada se o Pixel ainda não carregou (ex: bloqueado por
// ad-blocker ou script ainda em trânsito).
export function trackMetaPixelEvent(eventName: string): void {
  if (window.fbq) {
    window.fbq("track", eventName);
  }
}
