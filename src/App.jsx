import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import HomeTemplate from "./my_templates/HomeTemplate";
import { TOKEN } from "../utils/Config";
import Profile from "./pages/Profile";
import Subject from "./pages/Subject";
import TimeTable from "./pages/TimeTable";
import Course from "./pages/Course";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { jwtDecode } from "jwt-decode";
import { LOGIN_ACTION } from "./redux/types/UserType";
import Enrollment from "./pages/Enrollment";
import Attend from "./pages/Attend";
import Score from "./pages/Score";
import TimeTableSemester from "./pages/TimeTableSemester";

function App() {
  const dispatch = useDispatch();

  // 🔹 Decode token và restore user ngay khi App mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN);
    if (token) {
      try {
        const payload = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (payload.exp > currentTime) {
          dispatch({
            type: LOGIN_ACTION,
            access_token: token,
            user: {
              user_id: payload.user_id,
              name: payload.name,
              role: payload.role,
              class_id: payload.class_student
            },
          });
        } else {
          localStorage.removeItem(TOKEN);
        }
      } catch (error) {
        console.error("Decode token lỗi:", error);
        localStorage.removeItem(TOKEN);
      }
    }
  }, [dispatch]);

  // 🔹 Route bảo vệ
  const ProtectedRoute = () => {
    const token = localStorage.getItem(TOKEN);
    return token ? <Outlet /> : <Navigate to='/login' replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<HomeTemplate />}>
            <Route index element={<Profile />} />
            <Route index path='profile' element={<Profile />} />
            <Route path='enrollments' element={<Enrollment />} />
            <Route path='subjects' element={<Subject />} />
            <Route path='time-tables' element={<TimeTable />} />
            <Route path='time-tables-semeters' element={<TimeTableSemester />} />
            <Route path='courses' element={<Course />} />
            <Route path='attend/:id' element={<Attend />} />
            <Route path='scores' element={<Score />} />
          </Route>
        </Route>

        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
