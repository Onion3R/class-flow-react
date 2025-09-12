// FinishSignIn.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailLink, isSignInWithEmailLink } from "firebase/auth";
import { auth } from "@/app/firebase/firebase";
import { addTeacher } from "@/app/services/teacherService";
import { useAuth } from "@/app/context/authContext";
import ParticleBackground from "@/features/authentication/components/ParticleBackground/particleBackground";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { verifyToken } from "@/app/services/authService";

const USER_STATUS = "teacher"; // or whatever value you need

function FinishSignIn() {
  const navigate = useNavigate();
  const {teacherRefresh} = useAuth()

  useEffect(() => {
  async function completeSignIn() {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please confirm your email for sign-in");
      }

      try {
        const result = await signInWithEmailLink(auth, email, window.location.href);
        const user = result.user;
        const idToken = await user.getIdToken();
        const response = await verifyToken(idToken);

        if (response.success) {
          const { creationTime, lastSignInTime } = user.metadata;
          const isFirstTime = creationTime === lastSignInTime;
          const firebase_uid = user.uid;

          window.localStorage.removeItem("emailForSignIn");

          if (isFirstTime) {
            const data = createData(firebase_uid);
            await addTeacher(data);
            await teacherRefresh();
          }

          navigate("/", { replace: true });
        }
      } catch (err) {
        console.error("Error completing sign in", err);
        window.localStorage.removeItem("emailForSignIn");
      }
    }
  }

  completeSignIn();
}, [navigate]);


    function createData(firebase_uid) {
    return {
      first_name: "john",
      last_name: "example",
      is_active: false,
      firebase_uid,
      status: USER_STATUS,
      firstTime: true,
      base_max_minutes_per_week: 240,
    };
  }

  return <div className="w-full h-screen flex items-center justify-center ">
     <ParticleBackground/>
     <div className="">

      <TextShimmer duration={1.5} className="text-2xl font-medium ">
 Please wait, signing in...
</TextShimmer>
{/* <Separator /> */}

     </div>
    </div>;
}

export default FinishSignIn;
