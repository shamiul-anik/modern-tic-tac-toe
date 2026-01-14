// PWA Installation and Service Worker Handler
// Manages install prompt and service worker registration

class PWAHandler {
  constructor() {
    this.deferredPrompt = null;
    this.installButton = null;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Register service worker
    this.registerServiceWorker();

    // Setup install button
    this.setupInstallButton();

    // Listen for install prompt
    this.listenForInstallPrompt();

    // Check if already installed
    this.checkIfInstalled();
  }

  registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[PWA] Service Worker registered:", registration.scope);

            // Check for updates
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              console.log("[PWA] New Service Worker found");

              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  console.log("[PWA] New version available");
                  // Optionally show update notification
                  this.showUpdateNotification();
                }
              });
            });
          })
          .catch((error) => {
            console.error("[PWA] Service Worker registration failed:", error);
          });
      });
    } else {
      console.warn("[PWA] Service Workers not supported");
    }
  }

  setupInstallButton() {
    this.installButton = document.getElementById("installBtn");

    if (!this.installButton) {
      console.warn("[PWA] Install button not found in DOM");
      return;
    }

    // Add click event listener
    this.installButton.addEventListener("click", () => {
      this.handleInstallClick();
    });
  }

  listenForInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("[PWA] Install prompt available");

      // Prevent the default install prompt
      e.preventDefault();

      // Store the event for later use
      this.deferredPrompt = e;

      // Show the install button
      this.showInstallButton();
    });

    // Listen for successful installation
    window.addEventListener("appinstalled", () => {
      console.log("[PWA] App installed successfully");
      this.hideInstallButton();
      this.deferredPrompt = null;

      // Show success message
      this.showInstallSuccess();
    });
  }

  handleInstallClick() {
    if (!this.deferredPrompt) {
      console.warn("[PWA] No install prompt available");
      return;
    }

    // Hide the install button
    this.hideInstallButton();

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for the user's response
    this.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("[PWA] User accepted the install prompt");
      } else {
        console.log("[PWA] User dismissed the install prompt");
        // Show button again if user dismissed
        this.showInstallButton();
      }
      this.deferredPrompt = null;
    });
  }

  showInstallButton() {
    if (this.installButton) {
      this.installButton.style.display = "inline-block";
      console.log("[PWA] Install button shown");
    }
  }

  hideInstallButton() {
    if (this.installButton) {
      this.installButton.style.display = "none";
      console.log("[PWA] Install button hidden");
    }
  }

  checkIfInstalled() {
    // Check if running in standalone mode (already installed)
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    ) {
      console.log("[PWA] App is running in standalone mode");
      this.hideInstallButton();
    }
  }

  showUpdateNotification() {
    // Optional: Show a subtle notification that an update is available
    const statusBar = document.getElementById("status");
    if (statusBar) {
      const originalText = statusBar.textContent;
      statusBar.textContent =
        "Update available! Refresh to get the latest version.";
      statusBar.style.backgroundColor = "rgba(0, 242, 255, 0.2)";

      setTimeout(() => {
        statusBar.textContent = originalText;
        statusBar.style.backgroundColor = "";
      }, 5000);
    }
  }

  showInstallSuccess() {
    // Show success message in status bar
    const statusBar = document.getElementById("status");
    if (statusBar) {
      const originalText = statusBar.textContent;
      statusBar.textContent =
        "✓ App installed successfully! Find it on your home screen.";
      statusBar.style.backgroundColor = "rgba(0, 255, 136, 0.2)";

      setTimeout(() => {
        statusBar.textContent = originalText;
        statusBar.style.backgroundColor = "";
      }, 5000);
    }
  }
}

// Initialize PWA handler
const pwaHandler = new PWAHandler();

// Export for potential external use
if (typeof module !== "undefined" && module.exports) {
  module.exports = PWAHandler;
}
