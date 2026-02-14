import { BrowserRouter } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <HeroUIProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </HeroUIProvider>
    </BrowserRouter>
  );
}

export default App;
