import React from 'react';
import { useTimer } from 'react-timer-hook';
import { Clock } from 'lucide-react';

interface TimerProps {
  remainingTime: number;
}

const Timer: React.FC<TimerProps> = ({ remainingTime }) => {

  const endDate = new Date();
  endDate.setSeconds(endDate.getMinutes() + remainingTime);

  const {
    seconds,
    minutes,
    hours,
  } = useTimer({
    expiryTimestamp: endDate,
    onExpire: () => console.warn('Timer expired'),
  });


  return (
    <div className="flex flex-col items-center justify-center p-2 text-text rounded-lg shadow-md">
      <div className="text-lg font-bold flex gap-2 items-center">
      <Clock size={20} />
      {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
      </div>
    </div>
  );
};

export default Timer;
