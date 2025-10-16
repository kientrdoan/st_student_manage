import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import HomeTemplate from "./my_templates/HomeTemplate";
import { TOKEN } from "../utils/Config";
import Profile from "./pages/Profile";
import Subject from "./pages/Subject";
import CourseEnrollment from "./pages/CourseEnrollment";
function App() {
  const ProtectedRoute = () => {
    const token = localStorage.getItem(TOKEN);
    return token ? <Outlet /> : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeTemplate />}>
            <Route index element={<Home />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="/courses/enrollments" element={<CourseEnrollment />} />
            <Route path="subjects" element={<Subject />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
