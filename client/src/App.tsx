import { CookiesProvider } from "react-cookie";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { Admin } from "./components/admin/Admin";
import { Bookings } from "./components/bookings/Bookings";
import { CheckInHandler } from "./components/bookings/teacherView/qrcode/CheckInHandler";
import { ClassCheckInHandler } from "./components/bookings/teacherView/qrcode/ClassCheckInHandler";
import { EventCheckInHandler } from "./components/bookings/teacherView/qrcode/EventCheckInHandler";
import { CatchAll } from "./components/CatchAll";
import ClassDashboard, {
  OverallClassDashboard,
} from "./components/dashboard/classDashboard/ClassDashboard";
import ClassInfoDashboard from "./components/dashboard/classInfoDashboard/ClassInfoDashboard";
import { Dashboard, DashboardHome } from "./components/dashboard/Dashboard";
import EventInfoDashboard from "./components/dashboard/eventInfoDashboard/EventInfoDashboard";
import SettingsDashboard from "./components/dashboard/settingsDashboard/SettingsDashboard";
import { StudentDashboard } from "./components/dashboard/studentDashboard/StudentDashboard";
import { StudentInfoDashboard } from "./components/dashboard/studentInfoDashboard/StudentInfoDashboard";
import { TeacherDashboard } from "./components/dashboard/teacherDashboard/TeacherDashboard";
import { TeacherInfoDashboard } from "./components/dashboard/teacherInfoDashboard/TeacherInfoDashboard";
import { Discovery } from "./components/discovery/Discovery";
import { CreateEvent } from "./components/forms/createEvent";
import { Login } from "./components/login/Login";
import { L } from "./components/logout/Logout";
import { Playground } from "./components/playground/Playground";
import { Profile } from "./components/profile/Profile";
import { Settings } from "./components/profile/Settings";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Resources } from "./components/resources/Resources";
import { Reviews } from "./components/reviews/Reviews";
import { Landing } from "./components/signup/Landing";
import { Signup } from "./components/signup/Signup";
import Request from "./components/teacher-signup/requests/Request";
import { TeacherSignup } from "./components/teacher-signup/TeacherSignup";
import { AuthProvider } from "./contexts/AuthContext";
import { BackendProvider } from "./contexts/BackendContext";
import { RoleProvider } from "./contexts/RoleContext";
import { ForgotPassword } from "./utils/auth/ForgotPassword";
import { ForgotPasswordConfirmation } from "./utils/auth/ForgotPasswordConfirmation";

const App = () => {
  return (
    <CookiesProvider>
      <BackendProvider>
        <AuthProvider>
          <RoleProvider>
            <Router>
              <Routes>
                <Route
                  path="/login"
                  element={<Login />}
                />
                <Route
                  path="/create-event"
                  element={<CreateEvent />}
                />
                <Route
                  path="/forgotPassword"
                  element={<ForgotPassword />}
                />
                <Route
                  path="/forgotPasswordConfirmation"
                  element={<ForgotPasswordConfirmation />}
                />
                <Route
                  path="/signup"
                  element={<Signup />}
                />
                <Route
                  path="/landing"
                  element={<Landing />}
                />
                <Route
                  path="/teacher-signup"
                  element={<TeacherSignup />}
                />
                <Route
                  path="/settings"
                  element={<Settings />}
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute
                      element={<Dashboard />}
                      allowedRoles={"admin"}
                    />
                  }
                >
                  <Route
                    index
                    element={<DashboardHome />}
                  />
                  <Route
                    path="settings"
                    element={<SettingsDashboard />}
                  />
                  <Route
                    path="classes"
                    element={<ClassDashboard />}
                  >
                    <Route
                      index
                      element={<OverallClassDashboard />}
                    />
                    <Route
                      path=":classId/:classDate"
                      element={<ClassInfoDashboard />}
                    />
                    <Route
                      path="event/:eventId"
                      element={<EventInfoDashboard />}
                    />
                  </Route>
                  <Route
                    path="/dashboard/students"
                    element={<ProtectedRoute element={<StudentDashboard />} />}
                  />
                  <Route
                    path="/dashboard/students/:id"
                    element={
                      <ProtectedRoute element={<StudentInfoDashboard />} />
                    }
                  />
                  <Route
                    path="/dashboard/teachers/"
                    element={<ProtectedRoute element={<TeacherDashboard />} />}
                  />
                  <Route
                    path="/dashboard/teachers/:teacherId"
                    element={
                      <ProtectedRoute element={<TeacherInfoDashboard />} />
                    }
                  />
                </Route>
                <Route
                  path="/bookings"
                  element={<ProtectedRoute element={<Bookings />} />}
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute
                      element={<Admin />}
                      allowedRoles={["admin"]}
                    />
                  }
                />
                <Route
                  path="/resources"
                  element={<ProtectedRoute element={<Resources />} />}
                />
                <Route
                  path="/profile"
                  element={<ProtectedRoute element={<Profile />} />}
                />
                <Route
                  path="/playground"
                  element={<Playground />} // <ProtectedRoute element={<Playground />}
                />

                <Route
                  path="/reviews"
                  element={<ProtectedRoute element={<Reviews />} />}
                />

                <Route
                  path="/discovery"
                  element={<ProtectedRoute element={<Discovery />} />}
                />

                <Route
                  path="/check-in/class/:id/:date"
                  element={<ClassCheckInHandler />}
                />
                <Route
                  path="/check-in/event/:id"
                  element={<EventCheckInHandler />}
                />

                <Route
                  path="/"
                  element={
                    <Navigate
                      to="/landing"
                      replace
                    />
                  }
                />
                <Route
                  path="*"
                  element={<ProtectedRoute element={<CatchAll />} />}
                />
                <Route
                  path="/teacher-signup/request"
                  element={<ProtectedRoute element={<Request />} />}
                />
                <Route
                  path="/teacher-signup/pending"
                  element={<ProtectedRoute element={<Request />} />}
                />
                <Route
                  path="/logout"
                  element={<L />}
                ></Route>
              </Routes>
            </Router>
          </RoleProvider>
        </AuthProvider>
      </BackendProvider>
    </CookiesProvider>
  );
};

export default App;
