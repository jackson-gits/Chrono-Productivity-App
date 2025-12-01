import { useTaskStore } from '../store/taskStore';
import { Target, TrendingUp, Flame, Award, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

export function Dashboard() {
  const { tasks, streak, totalPoints } = useTaskStore();

  const todaysTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  const completedToday = todaysTasks.filter(t => t.completed).length;
  const totalToday = todaysTasks.length;
  const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const upcomingTasks = tasks
    .filter(t => !t.completed && new Date(t.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const urgentTasks = tasks.filter(t => {
    if (t.completed) return false;
    const daysUntilDue = Math.ceil((new Date(t.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 3 && daysUntilDue >= 0;
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-white mb-2">Welcome back, Student! 👋</h2>
        <p className="text-indigo-100">Let's make today productive</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Streak</p>
                <p className="text-gray-900">{streak} days</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Points</p>
                <p className="text-gray-900">{totalPoints}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-gray-900">{completedToday}/{totalToday}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion</p>
                <p className="text-gray-900">{Math.round(progressPercentage)}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Calendar className="w-5 h-5" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Completed {completedToday} of {totalToday} tasks</span>
              <span className="text-indigo-600">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            {progressPercentage === 100 && totalToday > 0 && (
              <p className="text-sm text-green-600">🎉 All tasks completed! Great job!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Urgent Tasks */}
      {urgentTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Clock className="w-5 h-5 text-red-600" />
              Urgent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentTasks.map(task => {
                const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex-1">
                      <p className="text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.subject}</p>
                    </div>
                    <Badge variant="destructive">
                      {daysUntilDue === 0 ? 'Due Today' : `${daysUntilDue}d left`}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming tasks. You're all caught up! 🎉</p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600">{task.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
