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
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const focusDuration = 25 * 60; // 25 minutes
  const breakDuration = 5 * 60; // 5 minutes

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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === 'focus') {
      addFocusSession(25);
      // Auto-switch to break
      setMode('break');
      setTimeLeft(breakDuration);
    } else {
      // Auto-switch back to focus
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
        <h2 className="text-gray-900">Focus Timer</h2>
        <p className="text-gray-600">Stay focused with the Pomodoro technique</p>
      </div>

      {/* Main Timer Card */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2">
        <CardContent className="pt-4">
          <div className="space-y-6">
            {/* Mode Selector */}
            <div className="flex justify-center gap-4">
              <Button
                variant={mode === 'focus' ? 'default' : 'outline'}
                onClick={() => switchMode('focus')}
                className={mode === 'focus' ? 'bg-indigo-600' : ''}
              >
                <Brain className="w-4 h-4 mr-2" />
                Focus (25min)
              </Button>
              <Button
                variant={mode === 'break' ? 'default' : 'outline'}
                onClick={() => switchMode('break')}
                className={mode === 'break' ? 'bg-green-600' : ''}
              >
                <Coffee className="w-4 h-4 mr-2" />
                Break (5min)
              </Button>
            </div>

            {/* Timer Display */}
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="text-7xl text-gray-900 tabular-nums">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-gray-600 mt-2">
                  {mode === 'focus' ? 'Focus Time' : 'Break Time'}
                </p>
              </div>

              <Progress value={progress} className="h-2" />
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={toggleTimer}
                className={mode === 'focus' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-600 hover:bg-green-700'}
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
              <Button size="lg" variant="outline" onClick={resetTimer}>
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>

            {/* Session Count */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Total Focus Sessions: <span className="text-indigo-600">{totalFocusSessions}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wellness Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Wind className="w-5 h-5" />
            Wellness Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="breathing">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="breathing">Breathing</TabsTrigger>
              <TabsTrigger value="tips">Focus Tips</TabsTrigger>
            </TabsList>
            <TabsContent value="breathing" className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-gray-900 mb-2">4-7-8 Breathing Technique</h4>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li>1. Breathe in through your nose for 4 seconds</li>
                  <li>2. Hold your breath for 7 seconds</li>
                  <li>3. Exhale slowly through your mouth for 8 seconds</li>
                  <li>4. Repeat 3-4 times</li>
                </ol>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="text-gray-900 mb-2">Box Breathing</h4>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li>1. Inhale for 4 counts</li>
                  <li>2. Hold for 4 counts</li>
                  <li>3. Exhale for 4 counts</li>
                  <li>4. Hold for 4 counts</li>
                </ol>
              </div>
            </TabsContent>
            <TabsContent value="tips" className="space-y-3">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="text-gray-900 mb-2">🎯 Maximize Your Focus</h4>
                <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                  <li>Eliminate distractions before starting</li>
                  <li>Keep water nearby to stay hydrated</li>
                  <li>Use noise-canceling headphones or white noise</li>
                  <li>Take breaks seriously - they're essential</li>
                  <li>Stretch during breaks to improve circulation</li>
                </ul>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="text-gray-900 mb-2">⚡ Energy Management</h4>
                <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                  <li>Schedule difficult tasks during peak energy hours</li>
                  <li>Avoid heavy meals before focus sessions</li>
                  <li>Natural light improves alertness</li>
                  <li>Stand up and move during breaks</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
