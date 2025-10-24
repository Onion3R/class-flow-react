import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/app/context/authContext"
import AppRoutes from "./lib/routing/AppRoutes";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
          <Toaster position="top-right" richColors closeButton />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};


export default App;
