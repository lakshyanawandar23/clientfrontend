import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginScreen from "./components/Login";
import HomeScreen from "./components/home";
import Transaction from "./components/transcation";
import AdminPanel from "./components/Admin";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

function App() {
  useEffect(() => {
    // Check if the user is on an Android device
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isAndroid) {
      // Event listener for beforeinstallprompt
      let deferredPrompt;

      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault(); // Prevent the mini info bar from appearing on mobile
        deferredPrompt = e; // Stash the event so it can be triggered later

        // Show toast notification
        toast(
          (t) => (
            <div>
              Download the Exchange App for Android!
              <button
                onClick={() => {
                  if (deferredPrompt) {
                    deferredPrompt.prompt(); // Show the prompt
                    deferredPrompt.userChoice.then((choiceResult) => {
                      if (choiceResult.outcome === "accepted") {
                        console.log("User accepted the A2HS prompt");
                        downloadAPK();
                      } else {
                        console.log("User dismissed the A2HS prompt");
                      }
                      deferredPrompt = null; // Clear the prompt
                      toast.dismiss(t.id); // Dismiss the toast
                    });
                  }
                }}
              >
                Install App
              </button>
            </div>
          ),
          {
            duration: 10000, // Duration in ms
            style: {
              background: "#fff",
              color: "#000",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
            },
          }
        );
      });
    }

    // Register service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((reg) => console.log("Service Worker registered", reg))
          .catch((err) =>
            console.error("Service Worker registration failed:", err)
          );
      });
    }
  }, []);

  const downloadAPK = () => {
    window.location.href =
      "https://expo.dev/artifacts/eas/rehawGaFEgb4Gfifza9ks.apk"; // Your APK link
  };

  return (
    <BrowserRouter>
      <Toaster position="bottom-center" />
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return <h2>404 Page Not Found</h2>;
}

export default App;
