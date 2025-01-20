import React, { useState, useEffect } from 'react';

interface LoveCounterProps {
  startDate: string;
  className?: string;
}

export function LoveCounter({ startDate, className = '' }: LoveCounterProps) {
  const [timeLeft, setTimeLeft] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCounter = () => {
      if (!startDate) {
        setTimeLeft({
          years: 0,
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const start = new Date(startDate);
      const now = new Date();
      const diff = now.getTime() - start.getTime();

      if (isNaN(diff)) {
        setTimeLeft({
          years: 0,
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      // Cálculos de tempo
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30.44); // Média de dias por mês
      const years = Math.floor(months / 12);

      setTimeLeft({
        years,
        months: months % 12,
        days: Math.floor(days % 30.44),
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60,
      });
    };

    // Atualiza imediatamente
    updateCounter();

    // Atualiza a cada segundo
    const interval = setInterval(updateCounter, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div
      className={`grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 ${className}`}
    >
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-light">{timeLeft.years}</div>
        <div className="text-xs md:text-sm opacity-60">anos</div>
      </div>
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-light">{timeLeft.months}</div>
        <div className="text-xs md:text-sm opacity-60">meses</div>
      </div>
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-light">{timeLeft.days}</div>
        <div className="text-xs md:text-sm opacity-60">dias</div>
      </div>
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-light">{timeLeft.hours}</div>
        <div className="text-xs md:text-sm opacity-60">horas</div>
      </div>
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-light">
          {timeLeft.minutes}
        </div>
        <div className="text-xs md:text-sm opacity-60">min</div>
      </div>
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-light">
          {timeLeft.seconds}
        </div>
        <div className="text-xs md:text-sm opacity-60">seg</div>
      </div>
    </div>
  );
}
