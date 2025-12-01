import { useTaskStore } from '../store/taskStore';
import { useFocusStore } from '../store/focusStore';
import { BarChart3, TrendingUp, Award, Target, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function Analytics() {
  const { tasks, streak, totalPoints, badges } = useTaskStore();
  const { totalFocusSessions, totalFocusMinutes } = useFocusStore();

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const tasksBySubject = tasks.reduce((acc, task) => {
    const subject = task.subject || 'Other';
    if (!acc[subject]) {
      acc[subject] = { total: 0, completed: 0 };
    }
    acc[subject].total++;
    if (task.completed) {
      acc[subject].completed++;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  const subjectData = Object.entries(tasksBySubject).map(([subject, data]) => ({
    subject,
    completed: data.completed,
    pending: data.total - data.completed,
  }));

  const tasksByPriority = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Mock weekly data for productivity trends
  const weeklyData = [
    { day: 'Mon', tasks: 5, focus: 120 },
    { day: 'Tue', tasks: 7, focus: 150 },
    { day: 'Wed', tasks: 6, focus: 100 },
    { day: 'Thu', tasks: 8, focus: 180 },
    { day: 'Fri', tasks: 4, focus: 90 },
    { day: 'Sat', tasks: 3, focus: 60 },
    { day: 'Sun', tasks: 2, focus: 45 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900">Analytics & Progress</h2>
        <p className="text-gray-600">Track your productivity and achievements</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl text-gray-900">{Math.round(completionRate)}%</p>
              <Progress value={completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl text-gray-900">{streak} days</p>
              <p className="text-xs text-green-600">Keep it up! 🔥</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2 ">
              <p className="text-sm text-gray-600">Focus Sessions</p>
              <p className="text-2xl text-gray-900">{totalFocusSessions}</p>
              <p className="text-xs text-gray-600">{totalFocusMinutes} minutes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-2xl text-gray-900">{totalPoints}</p>
              <p className="text-xs text-purple-600">Well done! ⭐</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Productivity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <TrendingUp className="w-5 h-5" />
            Weekly Productivity Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tasks" stroke="#6366f1" strokeWidth={2} name="Tasks Completed" />
              <Line type="monotone" dataKey="focus" stroke="#8b5cf6" strokeWidth={2} name="Focus Minutes" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
              <span className="text-gray-600">Tasks Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              <span className="text-gray-600">Focus Minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks by Subject */}
      {subjectData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BarChart3 className="w-5 h-5" />
              Tasks by Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Priority Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Target className="w-5 h-5" />
            Task Priority Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['high', 'medium', 'low'].map(priority => {
              const count = tasksByPriority[priority] || 0;
              const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
              const colors = {
                high: { bg: 'bg-red-500', text: 'text-red-700' },
                medium: { bg: 'bg-yellow-500', text: 'text-yellow-700' },
                low: { bg: 'bg-green-500', text: 'text-green-700' },
              };

              return (
                <div key={priority} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`capitalize ${colors[priority as keyof typeof colors].text}`}>
                      {priority} Priority
                    </span>
                    <span className="text-sm text-gray-600">
                      {count} tasks ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${colors[priority as keyof typeof colors].bg} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Award className="w-5 h-5" />
            Achievements & Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 text-center"
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <p className="text-sm text-gray-900">{badge.name}</p>
                <p className="text-xs text-gray-600">{badge.description}</p>
              </div>
            ))}
            {badges.length === 0 && (
              <div className="col-span-2 md:col-span-4 text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Complete tasks to earn badges!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Calendar className="w-5 h-5" />
            Productivity Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm">
                💡 <span className="text-gray-900">Best performing day:</span> Thursday - Most tasks completed
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm">
                🎯 <span className="text-gray-900">Completion trend:</span> You're {completionRate >= 70 ? 'performing excellently' : 'making good progress'}
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm">
                ⏰ <span className="text-gray-900">Focus consistency:</span> {totalFocusSessions >= 10 ? 'Outstanding dedication!' : 'Keep building the habit'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
