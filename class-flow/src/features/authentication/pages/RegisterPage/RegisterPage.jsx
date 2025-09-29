import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarLoader } from 'react-spinners';
import GoogleIcon from '@/assets/googleIcon';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { auth } from '@/app/firebase/firebase';
import { Label } from '@/components/ui/label';
import Verify from './Verify';
import { useAuth } from "@/app/context/authContext";
import { verifyToken } from '@/app/services/authService';
import {
  getAuth,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink,
  getAdditionalUserInfo
} from 'firebase/auth';
import { doSignInWithGoogle } from '@/app/firebase/auth';
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from 'lucide-react';
// import { addTeacher } from '@/app/services/apiService';
import { addTeacher } from '@/app/services/teacherService';

const USER_STATUS = 'teacher';

function Register() {
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verify, setVerify] = useState(false);
  const navigate = useNavigate();
  const { teacherRefresh } = useAuth();
  const uniqueId = crypto.randomUUID(); // or use uuid library



   const actionCodeSettings = {
    url: `http://localhost:5173/finish-sign-in/${uniqueId}`,
    handleCodeInApp: true,
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setVerify(true);
    } catch (error) {
      setAlertMessage({ type: "error", message: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await doSignInWithGoogle();
      const user = result.user;
      const email = result.email;
      const idToken = await user.getIdToken();
      const info = getAdditionalUserInfo(result);
      const firebase_uid = user.uid;

      if (idToken) {
        const response = await verifyToken(idToken); // ✅ pass the token here
        if (response?.success) {
          if (info?.isNewUser) {
            const data = createData(firebase_uid, email);
            await addTeacher(data);
            await teacherRefresh();
          }
          navigate("/", { replace: true });
        }
      }
    } catch (err) {
      setAlertMessage({ type: "error", message: err.message });
    } finally {
      setIsLoading(false);
      window.localStorage.removeItem("emailForSignIn");
    }
  };


  function createData(firebase_uid, email) {
    return {
      first_name: "",
      last_name: "",
      email: email,
      is_active: false,
      firebase_uid,
      status: USER_STATUS,
      firstTime: true,
      base_max_minutes_per_week: 240,
      role: 2,
    };
  }

  return (
    <div >
      {alertMessage && (
        <Alert variant="destructive" className="border-red-500 mb-4 bg-red-100 dark:bg-red-900/30">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle className="!truncate-none !whitespace-normal !break-words">
            Error:
            <span className="!text-sm font-normal ml-1">
              {alertMessage.message}
            </span>
          </AlertTitle>
        </Alert>
      )}

      <Card className="w-full relative overflow-hidden backdrop-blur-md bg-white/1 border border-black/20 text-black dark:bg-black/10 dark:border-white/10 dark:text-white flex items-center justify-center p-4">
        <BarLoader loading={isLoading} color='#D3D3D3' className='!absolute !w-full top-0 p-0 m-0' />
        <CardContent className='p-6'>
          {verify ? (
            <Verify />
          ) : (
            <form onSubmit={handleLogin} className=" w-full">
              <div>
                <h1 className="mb-1 mt-4 text-xl font-semibold">Login to your account</h1>
                <p className="text-muted-foreground">Welcome back! Sign in to continue</p>

                <div className="mt-6">
                  <Button type="button" variant="outline" className="w-full" onClick={onGoogleSignIn}>
                    <GoogleIcon />
                    <span>Google</span>
                  </Button>
                </div>

                <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <hr className="border-dashed" />
                  <span className="text-muted-foreground text-xs">Or continue With</span>
                  <hr className="border-dashed" />
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="block text-sm">Email</Label>
                    <Input
                      type="email"
                      required
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                    />
                  </div>

                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Continue'}
                  </Button>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-4">
                By signing up, you agree to our{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </Link>.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
