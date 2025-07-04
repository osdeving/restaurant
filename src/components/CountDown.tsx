'use client';

import Countdown from 'react-countdown';
import React, { useEffect, useState } from 'react';

const CountDown = () => {
  const [endingDate, setEndingDate] = useState<Date | null>(null);

  useEffect(() => {
    // Executa só no client
    setEndingDate(new Date(Date.now() + 1000 * 60 * 60 * 24));
  }, []);

  if (!endingDate) return null; // ou um loader temporário

  return (
    <Countdown className="text-3xl font-bold text-yellow-300" date={endingDate} />
  );
};

export default CountDown;
