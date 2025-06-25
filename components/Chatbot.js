import { useEffect } from "react";

export default function Chatbot() {
  useEffect(() => {
    // Load Dialogflow script if it doesn't already exist
    const scriptId = "df-script";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
      script.async = true;
      document.body.appendChild(script);
    }

    // Add df-messenger widget
    const existingWidget = document.querySelector("df-messenger");
    if (!existingWidget) {
      const df = document.createElement("df-messenger");
      df.setAttribute("intent", "WELCOME");
      df.setAttribute("chat-title", "Vintara-Agent");
      df.setAttribute("agent-id", "02c048b0-e043-4ec4-93a0-c08b8aff0b66");
      df.setAttribute("language-code", "en");
      document.body.appendChild(df);
    }

    // Cleanup on unmount
    return () => {
      const df = document.querySelector("df-messenger");
      if (df) df.remove(); // Remove the widget
    };
  }, []);

  return null;
}
