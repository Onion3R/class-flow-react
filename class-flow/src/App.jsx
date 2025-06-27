import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/home";
import Page1 from "./Pages/Page1/page1";
import Subject from "./Pages/Subject/subject";
import Layout from "./Layout";
import { Toaster } from "sonner";

const App = () => {
  return (
    <div>
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/page1" element={<Page1 />} />
          <Route path="/subject" element={<Subject />} />
        </Route>
      </Routes>
    </Router>
      <Toaster position="top-right" richColors closeButton />
    </div>
    
  );
};

export default App;
