import { NavLink } from "react-router-dom";
// 1. IMPORT useSelector ĐỂ LẤY DATA TỪ REDUX
import { useSelector } from "react-redux"; 
import { FiHome, FiUsers, FiBook, FiCalendar, FiGrid, FiLayers, FiBookOpen, FiUser, FiUserCheck } from "react-icons/fi";

const menuItems = [
  { name: "Subjects", path: "/subjects", icon: FiBook },
  // Đường dẫn Profile sẽ được xử lý động ở dưới
  { name: "Profile", path: "/profile", icon: FiLayers }, 
  { name: "Class", path: "/class", icon: FiUsers },
  { name: "Semesters", path: "/semesters", icon: FiCalendar },
  { name: "Rooms", path: "/rooms", icon: FiHome },
  { name: "Courses", path: "/courses", icon: FiBookOpen },
  { name: "Students", path: "/students", icon: FiUser },
  { name: "Teachers", path: "/teachers", icon: FiUserCheck },
];

export default function SlideBar() {
  // 2. LẤY THÔNG TIN USER TỪ REDUX STORE
  // Giả sử thông tin user được lưu trong `AuthReducer.user`
  // Hãy điều chỉnh `state.AuthReducer.user` cho đúng với cấu trúc Redux của bạn
  const user = useSelector(state => state.UserReducer.user); 

  return (
    <div className="bg-[#1e293b] text-white w-64 flex-shrink-0 flex flex-col shadow-xl">
      <div className="flex items-center justify-center p-6 border-b border-slate-700">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Student</h1>
          <p className="text-sm text-slate-400 mt-1">Management System</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            // 3. XỬ LÝ ĐƯỜNG DẪN ĐỘNG CHO PROFILE
            // Nếu item là "Profile" và có thông tin user, tạo đường dẫn với ID của user.
            // Nếu không, giữ nguyên đường dẫn gốc.
            

            // THÊM DÒNG NÀY ĐỂ KIỂM TRA
            console.log("User object from Redux in Sidebar:", user); 
            const path = (item.name === "Profile" && user) 
              ? `${item.path}/${user.id}` 
              : item.path;

            return (
              <li key={item.path}>
                <NavLink
                  // Sử dụng đường dẫn đã được xử lý
                  to={path} 
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-[#334155] text-white font-semibold shadow-md"
                        : "text-slate-300 hover:bg-[#334155] hover:text-white"
                    }`
                  }
                >
                  <Icon className="text-lg" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}