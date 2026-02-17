import { BrowserRouter } from "react-router-dom";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <HeroUIProvider>
        <ToastProvider placement="top-right" />
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </HeroUIProvider>
    </BrowserRouter>
  );
}

export default App;
