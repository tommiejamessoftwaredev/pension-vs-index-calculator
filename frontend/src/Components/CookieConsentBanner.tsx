import React from 'react';
import CookieConsent from 'react-cookie-consent';

interface CookieConsentBannerProps {
  onAccept: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onAccept }) => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All Cookies"
      declineButtonText="Decline"
      enableDeclineButton
      onAccept={onAccept}
      style={{
        background: "#2B373B",
        fontSize: "14px",
        padding: "20px"
      }}
      buttonStyle={{
        color: "#4e503b",
        fontSize: "13px",
        background: "#f1f1f1",
        borderRadius: "5px",
        padding: "10px 20px"
      }}
      declineButtonStyle={{
        fontSize: "13px",
        background: "transparent",
        borderRadius: "5px",
        border: "1px solid #f1f1f1",
        color: "#f1f1f1",
        padding: "10px 20px",
        marginRight: "10px"
      }}
    >
      This website uses cookies to enhance user experience and collect anonymous analytics data 
      including browser information, country, and usage patterns to improve our pension comparison tool. 
      By accepting, you consent to data collection as described in our privacy policy.
      <span style={{ fontSize: "12px", marginLeft: "10px" }}>
        <a href="/privacy-policy" style={{ color: "#f1f1f1" }}>
          Privacy Policy
        </a>
      </span>
    </CookieConsent>
  );
};