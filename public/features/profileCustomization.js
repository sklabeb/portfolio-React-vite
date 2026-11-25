/*
========================================
PORTFOLIOPRO 2.0
PROFILE PICTURE & THEME CUSTOMIZATION
========================================
*/

(function() {
  "use strict";

  const DEFAULT_THEME = "light";
  const DEFAULT_ACCENT = "blue";

  const ACCENT_COLORS = {
    blue: "#2563eb",
    purple: "#7c3aed",
    green: "#16a34a",
    orange: "#ea580c"
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // 1. Get user preferences

  function getPreferences(user) {
    return {
      profilePicture: user && user.profilePicture ?
        user.profilePicture : "",
      theme: user && user.theme === "dark" ?
        "dark" : DEFAULT_THEME,
      accentColor: user && ACCENT_COLORS[user.accentColor] ?
        user.accentColor : DEFAULT_ACCENT
    };
  }

  // 2. Validate uploaded image

  function validateImage(file) {
    if (!file) {
      return "Please select an image.";
    }

    if (!["image/jpeg", "image/png", "image/webp"]
      .includes(file.type)) {
      return "Only JPG, PNG and WebP images are allowed.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Image must be smaller than 5 MB.";
    }

    return "";
  }

  // 3. Resize and compress image

  function processProfileImage(file) {
    return new Promise(function(resolve, reject) {
      const error = validateImage(file);

      if (error) {
        reject(new Error(error));
        return;
      }

      const reader = new FileReader();

      reader.onerror = function() {
        reject(new Error("Unable to read image."));
      };

      reader.onload = function() {
        const image = new Image();

        image.onerror = function() {
          reject(new Error("Invalid image file."));
        };

        image.onload = function() {
          const canvas = document.createElement("canvas");
          const size = 256;

          canvas.width = size;
          canvas.height = size;

          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Canvas not supported."));
            return;
          }

          const cropSize = Math.min(
            image.width,
            image.height
          );

          const sourceX =
            (image.width - cropSize) / 2;

          const sourceY =
            (image.height - cropSize) / 2;

          ctx.drawImage(
            image,
            sourceX,
            sourceY,
            cropSize,
            cropSize,
            0,
            0,
            size,
            size
          );

          resolve(
            canvas.toDataURL("image/jpeg", 0.75)
          );
        };

        image.src = reader.result;
      };

      reader.readAsDataURL(file);
    });
  }

  // 4. Apply selected theme

  function applyTheme(theme) {
    const selectedTheme =
      theme === "dark" ? "dark" : "light";

    document.documentElement.setAttribute(
      "data-theme",
      selectedTheme
    );

    return selectedTheme;
  }

  // 5. Apply selected accent color

  function applyAccentColor(accent) {
    const selectedAccent =
      ACCENT_COLORS[accent] ?
      accent :
      DEFAULT_ACCENT;

    document.documentElement.style.setProperty(
      "--accent-color",
      ACCENT_COLORS[selectedAccent]
    );

    document.documentElement.setAttribute(
      "data-accent",
      selectedAccent
    );

    return selectedAccent;
  }

  // 6. Load preferences for current user

  function applyUserPreferences(user) {
    const preferences = getPreferences(user);

    applyTheme(preferences.theme);
    applyAccentColor(preferences.accentColor);

    return preferences;
  }

  // 7. Update preferences in user object

  function updateUserPreferences(user, changes) {
    if (!user) {
      throw new Error("User not found.");
    }

    const updatedUser = Object.assign({}, user);

    if (
      Object.prototype.hasOwnProperty.call(
        changes,
        "profilePicture"
      )
    ) {
      updatedUser.profilePicture =
        changes.profilePicture;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        changes,
        "theme"
      )
    ) {
      updatedUser.theme =
        changes.theme === "dark" ?
        "dark" :
        "light";
    }

    if (
      Object.prototype.hasOwnProperty.call(
        changes,
        "accentColor"
      )
    ) {
      updatedUser.accentColor =
        ACCENT_COLORS[changes.accentColor] ?
        changes.accentColor :
        DEFAULT_ACCENT;
    }

    return updatedUser;
  }

  // 8. Make functions available to user.js

  window.PortfolioCustomization = {
    getPreferences,
    validateImage,
    processProfileImage,
    applyTheme,
    applyAccentColor,
    applyUserPreferences,
    updateUserPreferences,
    ACCENT_COLORS
  };

  console.log(
    "PortfolioPro Profile Customization Module Loaded"
  );

})();