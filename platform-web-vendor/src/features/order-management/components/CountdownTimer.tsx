import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/shared/lib/utils'; // Assuming a shared utility for class names

interface CountdownTimerProps {
  expiryTimestamp: string;
  onExpire: () => void;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  expiryTimestamp,
  onExpire,
  className,
}) => {
  const expiryTime = useMemo(() => new Date(expiryTimestamp).getTime(), [expiryTimestamp]);

  const calculateRemainingTime = () => {
    const now = new Date().getTime();
    const difference = expiryTime - now;
    return difference > 0 ? difference : 0;
  };

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime);

  useEffect(() => {
    if (remainingTime <= 0) {
      onExpire();
      return;
    }

    const intervalId = setInterval(() => {
      const newRemainingTime = calculateRemainingTime();
      if (newRemainingTime <= 0) {
        clearInterval(intervalId);
        onExpire();
      }
      setRemainingTime(newRemainingTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expiryTimestamp, onExpire, remainingTime, expiryTime]);

  const formatTime = (time: number) => {
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const isUrgent = remainingTime <= 60 * 1000; // Urgent if 1 minute or less remains

  return (
    <div
      className={cn(
        'font-mono text-lg font-bold',
        {
          'text-red-500 animate-pulse': isUrgent,
          'text-gray-700': !isUrgent,
        },
        className
      )}
    >
      {formatTime(remainingTime)}
    </div>
  );
};

export default React.memo(CountdownTimer);