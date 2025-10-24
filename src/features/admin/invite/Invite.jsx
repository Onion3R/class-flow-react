import React, { useEffect, useState } from "react";
import { validateToken } from "./inviteService";
import { useParams, useNavigate } from "react-router-dom";
import { Link2Off } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  EmptyMedia,
} from "@/components/ui/empty";
import ParticleBackground from "@/features/authentication/components/ParticleBackground/particleBackground";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";

function Invite() {
  const { id } = useParams();
  const navigate = useNavigate();

  // null = not yet validated, true = valid, false = invalid
  const [isValid, setIsValid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsValid(false);
      setIsLoading(false);
      return;
    }

    const validate = async () => {
      try {
        const result = await validateToken(id);
        console.log("Valid invite:", result);

        // Save role to sessionStorage for the next page
        sessionStorage.setItem("inviteRole", result.data.role);
        setIsValid(true);

        // Optional small delay for smooth UX
        setTimeout(() => {
          navigate("/user");
        }, 1500);
      } catch (error) {
        console.error("Invite validation failed:", error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };
    setTimeout(() => {
         validate();
        }, 1500);
    
  }, [id, navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <ParticleBackground />
      <div className="z-10">
        {isLoading || isValid === null ? (
          <TextShimmer duration={1.5} className="text-2xl font-medium">
            Your invitation is being validated...
          </TextShimmer>
        ) : isValid ? (
          <TextShimmer duration={1.5} className="text-2xl font-medium">
            Redirecting to the login page. Please wait...
          </TextShimmer>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Link2Off />
              </EmptyMedia>
              <EmptyTitle className="text-2xl">Invalid Token</EmptyTitle>
              <EmptyDescription className="text-sm">
                The token associated with this link has expired or is invalid.
                For assistance or to request a new link, please contact support.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <EmptyDescription className="text-sm">
                Need help?{" "}
                <a
                  href="mailto:admin@gmail.com?subject=Support%20Request&body=Hi%20team,%0AI%20need%20help%20with..."
                  className="underline text-blue-600"
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

export default Invite;
