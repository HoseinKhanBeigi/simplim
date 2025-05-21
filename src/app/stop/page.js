"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const lapIdRef = useRef(0);

  // Memoized time formatting function
  const formatTime = useCallback((timeInMilliseconds) => {
    const minutes = Math.floor(timeInMilliseconds / 60000);
    const seconds = Math.floor((timeInMilliseconds % 60000) / 1000);
    const milliseconds = Math.floor((timeInMilliseconds % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  }, []);

  // Memoized formatted time
  const formattedTime = useMemo(() => formatTime(time), [time, formatTime]);

  // Start the stopwatch
  const handleStart = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    }
  }, [isRunning, time]);

  // Stop the stopwatch
  const handleStop = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
    }
  }, [isRunning]);

  // Reset the stopwatch
  const handleReset = useCallback(() => {
    setTime(0);
    setLaps([]);
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  }, [isRunning]);

  // Record a lap
  const handleLap = useCallback(() => {
    if (isRunning) {
      setLaps((prevLaps) => [...prevLaps, { id: lapIdRef.current++, time }]);
    }
  }, [isRunning, time]);

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Memoized lap items
  const lapItems = useMemo(() => {
    return laps.map((lap) => (
      <div
        key={lap.id}
        className="flex justify-between items-center py-1 border-b"
      >
        <span>Lap {laps.indexOf(lap) + 1}</span>
        <span className="font-mono">{formatTime(lap.time)}</span>
      </div>
    ));
  }, [laps, formatTime]);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Stopwatch</h2>
        <div className="text-4xl font-mono mb-4">{formattedTime}</div>
        
        <div className="space-x-2 mb-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Stop
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Reset
          </button>
          
          <button
            onClick={handleLap}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={!isRunning}
          >
            Lap
          </button>
        </div>

        {laps.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Laps</h3>
            <div className="max-h-40 overflow-y-auto">
              {lapItems}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stopwatch; 