import React, { createContext, useContext, useState, useEffect } from "react";

const GuestContext = createContext();

export function GuestProvider({ children }) {
  const [guestInfo, setGuestInfo] = useState({
    title: "",
    firstName: "",
    lastName: "",
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("guestInfo");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Handle migration from old format (title/name) to new format (title/firstName/lastName)
        if (parsed.name && !parsed.firstName && !parsed.lastName) {
          const nameParts = parsed.name.trim().split(/\s+/);
          parsed.firstName = nameParts[0] || "";
          parsed.lastName = nameParts.slice(1).join(" ") || "";
          delete parsed.name;
        }
        setGuestInfo(parsed);
      } catch (e) {
        console.error("Error loading guest info from localStorage:", e);
      }
    }
  }, []);

  // Save to localStorage whenever guestInfo changes
  useEffect(() => {
    if (guestInfo.title || guestInfo.firstName || guestInfo.lastName) {
      localStorage.setItem("guestInfo", JSON.stringify(guestInfo));
    }
  }, [guestInfo]);

  const updateGuestInfo = (title, firstName, lastName) => {
    setGuestInfo({ 
      title: title || "", 
      firstName: firstName || "", 
      lastName: lastName || "" 
    });
  };

  const clearGuestInfo = () => {
    setGuestInfo({ title: "", firstName: "", lastName: "" });
    localStorage.removeItem("guestInfo");
  };

  return (
    <GuestContext.Provider
      value={{
        guestInfo,
        updateGuestInfo,
        clearGuestInfo,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error("useGuest must be used within a GuestProvider");
  }
  return context;
}

