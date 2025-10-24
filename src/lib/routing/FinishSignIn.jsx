import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailLink, isSignInWithEmailLink } from "firebase/auth";
import { Link2Off } from "lucide-react";
import { auth } from "@/app/firebase/firebase";
import { addTeacher } from "@/app/services/teacherService";
import { useAuth } from "@/app/context/authContext";
import ParticleBackground from "@/features/authentication/components/ParticleBackground/particleBackground";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { verifyToken } from "@/app/services/authService";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  EmptyMedia
} from "@/components/ui/empty";

function FinishSignIn() {
  const navigate = useNavigate();
  const { teacherRefresh } = useAuth();

  const [id, setId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load invite role from localStorage
  useEffect(() => {
    const inviteId = localStorage.getItem("inviteId");
    console.log("Loaded inviteId:", inviteId);
    if (inviteId) {
      setId(inviteId);
    } else {
      setAlertMessage({
        type: "error",
        message: "Account creation is restricted to invited users. Please contact the administrator for access.",
      });
    }
  }, []);

  // Complete sign-in once invite ID is loaded
  useEffect(() => {
    if (id === null) return;

    async function completeSignIn() {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        setAlertMessage({
          type: "error",
          message: "Invalid or expired sign-in link.",
        });
        return;
      }

      setIsLoading(true);
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please confirm your email for sign-in");
      }

      try {
        const result = await signInWithEmailLink(auth, email, window.location.href);
        const user = result.user;
        const idToken = await user.getIdToken();
        const response = await verifyToken(idToken);

        if (!response.success) {
          throw new Error("Token verification failed.");
        }

        const { creationTime, lastSignInTime } = user.metadata;
        const isFirstTime = creationTime === lastSignInTime;
        const firebase_uid = user.uid;

        if (isFirstTime && !id) {
          setAlertMessage({
            type: "error",
            message: "You must be invited to create an account.",
          });
          await user.delete();
          window.localStorage.removeItem("emailForSignIn");
          return;
        }

        window.localStorage.removeItem("emailForSignIn");

        if (isFirstTime) {
          const data = {
            first_name: "",
            last_name: "",
            is_active: true,
            firebase_uid,
            role: id,
            firstTime: true,
            base_max_minutes_per_week: 240,
          };
          await addTeacher(data);
          await teacherRefresh();
        }

        navigate("/", { replace: true });
        localStorage.removeItem("inviteId");
      } catch (err) {
        console.error("Error completing sign in", err);
        window.localStorage.removeItem("emailForSignIn");
        setAlertMessage({
          type: "error",
          message: err?.message || JSON.stringify(err) || "Failed to complete sign-in.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    completeSignIn();
  }, [id, navigate, teacherRefresh]);


  console.log(alertMessage)
  return (
    <div className="w-full h-screen flex items-center justify-center relative">
      <ParticleBackground />
      <div className="z-10">
        {isLoading && (
          <TextShimmer duration={1.5} className="text-2xl font-medium">
            Please wait, signing in...
          </TextShimmer>
        )}

        {!isLoading && alertMessage && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Link2Off />
              </EmptyMedia>
              <EmptyTitle className="text-2xl">Sign-In Error</EmptyTitle>
              <EmptyDescription className="text-sm">
                {alertMessage.message}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <EmptyDescription className="text-sm">
                Need help?{" "}
                <a
                  href="mailto:admin@gmail.com?subject=Support%20Request&body=Hi%20team,%0AI%20need%20help%20with..."
                >
                  Contact support
                </a>
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </div>
  );
}

export default FinishSignIn;
