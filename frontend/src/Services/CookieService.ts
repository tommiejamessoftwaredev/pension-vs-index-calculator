export class CookieService {
  private static readonly CONSENT_KEY = "cookieConsent";

  static hasConsent(): boolean {
    return localStorage.getItem(this.CONSENT_KEY) === "accepted";
  }

  static setConsent(accepted: boolean): void {
    localStorage.setItem(this.CONSENT_KEY, accepted ? "accepted" : "declined");
  }

  static clearConsent(): void {
    localStorage.removeItem(this.CONSENT_KEY);
  }
}
