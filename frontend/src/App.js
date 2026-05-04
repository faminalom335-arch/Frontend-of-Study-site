import "@/App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import StudyAssistant from "@/components/StudyAssistant";
import LoginPage from "@/components/LoginPage";

const LoginRoute = () => {
  const navigate = useNavigate();
  return <LoginPage onAuthSuccess={() => navigate("/")} />;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StudyAssistant />} />
          <Route path="/login" element={<LoginRoute />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
