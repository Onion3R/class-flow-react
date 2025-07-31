import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import LoginFormComponent from "./Components/LoginForm/loginFormComponent";

// Pages
import Home from "./Pages/home";                       
import Page1 from "./Pages/Page1/page1";
import Subject from "./Pages/Subject/subject";
import InstructorDetail from "./Pages/InstructorDetail/instructorDetail";
import RegularView from "./Pages/RegularView/regularView";
import GenerateSchedule from "./Pages/GenerateSchedule/generateSchedule";
import Rooms from "./Pages/Rooms/roomPage";
import Programs from "./Pages/Programs/programs";

// import LoginPage from "./Pages/loginPage";
import Test from "./Pages/test";
import RegisterFormComponent from "./Components/RegisterForm/registerFormComponent";

// Layouts
import Layout from "./Layout";         // For /admin routes
import UserLayout from "./UserLayout"; // For /dashboard
import AuthenticationLayout from "./AuthenticationLayout"; // For login register

// Schedule Pages
import Schedules from "./Pages/Schedules/schedules";
// import FreshmenSchedPage from "./Pages/Schedules/freshmenSchedPage";
// import SophomoreSchedPage from "./Pages/Schedules/sophomoreSchedPage";
import JuniorSchedPage from "./Pages/Schedules/juniorSchedPage";
import SeniorSchedPage from "./Pages/Schedules/seniorSchedPage";


const AppRoutes = () => {
  const { isAdmin, isInstructor, isLoading } = useAuth();

  if (isLoading) return null; // Optional spinner here

  return (
   <Routes>

      <Route path="/" element={<AuthenticationLayout/>}>
        <Route index  element={<LoginFormComponent />} />
        <Route  path="/login" element={<LoginFormComponent />} />
        <Route path="/register" element={<RegisterFormComponent />} />
        <Route path="/invite" element={<RegisterFormComponent />} />
      </Route> 

      <Route path="/test" element={<Test />} />

      {/*  Admin Dashboard @ /admin */}
      {isAdmin && (
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Home />} />                   
          <Route path="subject" element={<Subject />} />
          <Route path="team" element={<Page1 />} />
          <Route path="programs" element={<Programs />} />
          <Route path="room" element={<Rooms />} />
          <Route path="team/instructor-detail/:id" element={<InstructorDetail />} />
          <Route path="generate-schedule" element={<GenerateSchedule />} />

            {/* Schedule per Level */}
         <Route path="schedules" >
            <Route index element={<Schedules />}></Route>
            {/* <Route path="freshmen" element={<FreshmenSchedPage />} />
            <Route path="sophomore" element={<SophomoreSchedPage />} /> */}
            <Route path="junior" element={<JuniorSchedPage />} />
            <Route path="senior" element={<SeniorSchedPage />} />
          </Route>

        </Route>
      )}

      {/* 📋 Instructor Dashboard @ /dashboard */}
      {isInstructor && (
        <Route path="/dashboard" element={<UserLayout />}>
          <Route index element={<RegularView />} />     
        </Route>
      )}
    </Routes>

  );
};

export default AppRoutes;
