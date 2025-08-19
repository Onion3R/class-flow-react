import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { PulseLoader } from 'react-spinners';

function LoadingCard({ message, variant }) {
  const [cardContent, setCardContent] = useState(null);

  useEffect(() => {
    let content; // use `let` to define a temporary variable

    switch (variant) {
      case 'default':
        content = (
          <div className="flex flex-col sm:flex-row items-center justify-center w-full text-sm text-muted-foreground text-center sm:text-left">
            {message}
          </div>
        );
        break;

      case 'database':
        content = (
          <div className="flex flex-col sm:flex-row items-center justify-center w-full text-sm text-muted-foreground text-center sm:text-left">
            <span className="text-sm mr-2">
              Checking data from database
            </span>
            <PulseLoader size={5} loading={true} color={'#808080'}  />
          </div>
        );
        break;

      default:
        content = (
          <div className="text-sm text-muted-foreground text-center">
            Unknown variant
          </div>
        );
        break;
    }

    setCardContent(content);
  }, [variant, message]);

  return (
    <Card>
      <CardContent>{cardContent}</CardContent>
    </Card>
  );
}

export default LoadingCard;
