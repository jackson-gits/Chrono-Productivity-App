import { useState, useEffect, useRef } from 'react';
import { useFocusStore } from '../store/focusStore';
import { Play, Pause, RotateCcw, Coffee, Brain, Wind } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function FocusTimer() {
  const { totalFocusSessions, addFocusSession } = useFocusStore();
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const focusDuration = 25 * 60;
  const breakDuration = 5 * 60;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);

    if (mode === 'focus') {
      addFocusSession(25);
      setMode('break');
      setTimeLeft(breakDuration);
    } else {
      setMode('focus');
      setTimeLeft(focusDuration);
    }
  };

  const toggleTimer = () => {
    if (!isRunning && sessionStartTime === null) {
      setSessionStartTime(Date.now());
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSessionStartTime(null);
    setTimeLeft(mode === 'focus' ? focusDuration : breakDuration);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsRunning(false);
    setSessionStartTime(null);
    setTimeLeft(newMode === 'focus' ? focusDuration : breakDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = mode === 'focus' ? focusDuration : breakDuration;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-[#4B2E23]">Focus Timer</h2>
        <p className="text-amber-800">Stay focused with the Pomodoro technique</p>
      </div>

      {/* Timer Card */}
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 shadow-md">
        <CardContent className="pt-4">
          <div className="space-y-6">

            {/* Mode Selector */}
            <div className="flex justify-center gap-4">
              <Button
                variant={mode === 'focus' ? 'default' : 'outline'}
                onClick={() => switchMode('focus')}
                className={
                  mode === 'focus'
                    ? 'bg-[#4B2E23] hover:bg-[#3A241B] text-white'
                    : 'border-amber-300 text-[#4B2E23]'
                }
              >
                <Brain className="w-4 h-4 mr-2" />
                Focus (25min)
              </Button>

              <Button
                variant={mode === 'break' ? 'default' : 'outline'}
                onClick={() => switchMode('break')}
                className={
                  mode === 'break'
                    ? 'bg-[#4B2E23] hover:bg-[#3A241B] text-white'
                    : 'border-amber-300 text-[#4B2E23]'
                }
              >
                <Coffee className="w-4 h-4 mr-2" />
                Break (5min)
              </Button>
            </div>

            {/* Timer Display */}
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="text-7xl text-[#4B2E23] tabular-nums">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-amber-800 mt-2">
                  {mode === 'focus' ? 'Focus Time' : 'Break Time'}
                </p>
              </div>

              <Progress
                value={progress}
                className="h-2 bg-amber-200"
              />
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={toggleTimer}
                className="bg-[#4B2E23] hover:bg-[#3A241B] text-white"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={resetTimer}
                className="border-amber-300 text-[#4B2E23]"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>

            {/* Sessions Counter */}
            <div className="text-center pt-4 border-t border-amber-200">
              <p className="text-sm text-amber-800">
                Total Focus Sessions:{' '}
                <span className="text-[#4B2E23] font-semibold">
                  {totalFocusSessions}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wellness Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#4B2E23]">
            <Wind className="w-5 h-5" />
            Wellness Tools
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="breathing">
            <TabsList className="grid w-full grid-cols-2 bg-amber-100">
              <TabsTrigger value="breathing">Breathing</TabsTrigger>
              <TabsTrigger value="tips">Focus Tips</TabsTrigger>
            </TabsList>

            {/* Breathing Exercises */}
            <TabsContent value="breathing" className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="text-[#4B2E23] mb-2">4-7-8 Breathing Technique</h4>
                <ol className="space-y-2 text-sm text-amber-800">
                  <li>1. Breathe in for 4 seconds</li>
                  <li>2. Hold for 7 seconds</li>
                  <li>3. Exhale slowly for 8 seconds</li>
                  <li>4. Repeat 3-4 times</li>
                </ol>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="text-[#4B2E23] mb-2">Box Breathing</h4>
                <ol className="space-y-2 text-sm text-amber-800">
                  <li>1. Inhale for 4 counts</li>
                  <li>2. Hold for 4 counts</li>
                  <li>3. Exhale for 4 counts</li>
                  <li>4. Hold for 4 counts</li>
                </ol>
              </div>
            </TabsContent>

            {/* Tips */}
            <TabsContent value="tips" className="space-y-3">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="text-[#4B2E23] mb-2">🎯 Maximize Your Focus</h4>
                <ul className="space-y-2 text-sm text-amber-800 list-disc list-inside">
                  <li>Eliminate distractions</li>
                  <li>Keep water nearby</li>
                  <li>Use white noise if needed</li>
                  <li>Respect your breaks</li>
                  <li>Stretch between sessions</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="text-[#4B2E23] mb-2">⚡ Energy Management</h4>
                <ul className="space-y-2 text-sm text-amber-800 list-disc list-inside">
                  <li>Work during peak energy hours</li>
                  <li>Avoid heavy meals mid-session</li>
                  <li>Natural light improves alertness</li>
                  <li>Move during breaks</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
