'use client';

import Countdown from 'react-countdown';
import React from 'react';

const endingDate = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day from now

const CountDown = () => {
    return (
        <Countdown className="text-3xl font-bold text-yellow-300" date={endingDate} />
    );
};
export default CountDown;
