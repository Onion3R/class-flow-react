import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./Components/theme-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/authContext"
import AppRoutes from "./AppRoutes";

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
