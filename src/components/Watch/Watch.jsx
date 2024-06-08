import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="text-center p-10">
      <p className="stat-value">{time.toLocaleTimeString()}</p>
    </div>
  );
};

export default Clock;