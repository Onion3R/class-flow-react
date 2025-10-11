import { lazy, Suspense } from "react";
import { Routes, Route , useParams} from "react-router-dom";
import { useAuth } from "@/app/context/authContext";
// import LoginFormComponent from "../../components/LoginForm/loginFormComponent";

// Pages
import Dashboard from "../../features/admin/pages/dashboard/Dashboard";                       
// import Teachers from "../../features/admin/pages/teachers/pages/TeachersPage/Teachers";
const Teachers = lazy(() => import("../../features/admin/pages/teachers/pages/TeachersPage/Teachers"));

const TeachersDetail = lazy(() => import("../../features/admin/pages/teachers/pages/TeachersDetailPage/TeachersDetailsPage"));
const Assignment = lazy(() => import("@/features/admin/pages/assignment/pages/Assignment/Assignment"));
const Subject = lazy(() => import("@/features/admin/pages/subject/config/Subject"));
const AssignmentDetail = lazy(() => import("../../features/admin/pages/assignment/pages/AssignmentDetail/AssignmentDetailPage"));
const Programs = lazy(() => import("../../features/admin/pages/programs/Programs"));
const SchedulesPage = lazy(() => import("../../features/admin/pages/schedules/pages/SchedulePage/SchedulesPage"));
const CreatedScheduleDetails  = lazy(() => import("@/features/admin/pages/schedules/pages/CreateSchedulePage/pages/CreatedScheduleDetails"));
const CreateSchedule = lazy(() => import("../../features/admin/pages/schedules/pages/CreateSchedulePage/CreateSchedule"));
const GenerateSchedule = lazy(() => import("../../features/admin/pages/schedules/pages/GenerateSchedulePage/GenerateSchedule"));

const JuniorSchedPage = lazy(() => import("../../features/admin/pages/schedules/pages/SchedulePage/JuniorSchedPage"));
const SeniorSchedPage = lazy(() => import("../../features/admin/pages/schedules/pages/SchedulePage/SeniorSchedPage"));




import TeacherView from "../../features/teacher/HomePage";



// import LoginPage from "./Pages/loginPage";
import Test from "../../Testing/test";
// import RegisterFormComponent from "../../components/RegisterForm/registerFormComponent";

// Layouts
import Layout from "../../features/admin/layout/Layout";         // For /admin routes
import UserLayout from "../../UserLayout"; // For /dashboard
import AuthenticationLayout from "../../features/authentication/layout/AuthenticationLayout"; // For login register

// Schedule Pages


import Register from "../../features/authentication/pages/RegisterPage/RegisterPage";
import GetStarted from "../../features/authentication/pages/GetStarted";
import RequiredAuth from "./RequiredAuth";
import FinishSignIn from "./FinishSignIn";
import FirstTimeOnlyRoute from "./FirstTimeOnlyRoute";



const AppRoutes = () => {
  const { isAdmin, isTeacher, isLoading } = useAuth();
  const { id } = useParams();
  console.log(isAdmin, isTeacher)

  if (isLoading) return null; // Optional spinner here
  
  return (
   <Routes>

      <Route path="/user" element={<AuthenticationLayout/>}>
        <Route index  element={<Register />} />
      </Route> 
      <Route path="/finish-sign-in/:id" element={<FinishSignIn />} />
      <Route path="/test" element={<Test />} />

    <Route path="/" element={<RequiredAuth />}>
      <Route path="/complete-sign-up" element={<FirstTimeOnlyRoute />}>
      <Route index element={<GetStarted />} />
    </Route>


  {isAdmin && (
    <Route path="/admin" element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path="assignments" element={<Assignment />} />
      <Route path="assignment/detail/:id" element={<AssignmentDetail />} />
      <Route path="subjects" element={<Subject/>} />
      <Route path="teachers" element={<Teachers />} />
      <Route path="programs" element={<Programs />} />
      <Route path="teachers/details/:id" element={<TeachersDetail />} />
      <Route path="create-schedule" element={<CreateSchedule />} />
      <Route path="create-schedule/details/:id" element={<CreatedScheduleDetails />} />
      <Route path="generate-schedule" element={<GenerateSchedule />} />
      <Route path="schedules">
        <Route index element={<SchedulesPage />} />
        <Route path="junior" element={<JuniorSchedPage />} />
        <Route path="senior" element={<SeniorSchedPage />} />
      </Route>
    </Route>
  )}

  {(isTeacher || isAdmin) && (
    <Route path="/dashboard" element={<UserLayout />}>
      <Route index element={<TeacherView />} />
    </Route>
  )}
</Route>

      <Route path="*" element={<Test/>}/>
    </Routes>

  );
};

export default AppRoutes;
