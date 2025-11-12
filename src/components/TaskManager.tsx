import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Plus, ChevronDown, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

export function TaskManager() {
  const { tasks, addTask, toggleTask, toggleSubtask } = useTaskStore();
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimatedHours: 1,
  });

  const toggleExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.dueDate) {
      addTask(newTask);
      setNewTask({
        title: '',
        description: '',
        subject: '',
        dueDate: '',
        priority: 'medium',
        estimatedHours: 1,
      });
      setIsAddDialogOpen(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Task Manager</h2>
          <p className="text-gray-600">Organize and track your assignments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g., Complete Math Assignment"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newTask.subject}
                  onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Add details about the task..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high') =>
                      setNewTask({ ...newTask, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours">Estimated Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  min="1"
                  value={newTask.estimatedHours}
                  onChange={(e) => setNewTask({ ...newTask, estimatedHours: parseInt(e.target.value) || 1 })}
                />
              </div>

              <Button onClick={handleAddTask} className="w-full bg-indigo-600 hover:bg-indigo-700">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-indigo-600' : ''}
        >
          All Tasks
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'bg-indigo-600' : ''}
        >
          Active
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'bg-indigo-600' : ''}
        >
          Completed
        </Button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No tasks found. Create your first task to get started!</p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map(task => {
            const isExpanded = expandedTasks.has(task.id);
            const completedSubtasks = task.subtasks.filter(st => st.completed).length;
            const totalSubtasks = task.subtasks.length;

            return (
              <Card key={task.id} className={task.completed ? 'opacity-75' : ''}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Main Task */}
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400 hover:text-indigo-600" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className={`text-gray-900 ${task.completed ? 'line-through' : ''}`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            )}
                          </div>
                          {task.subtasks.length > 0 && (
                            <button
                              onClick={() => toggleExpanded(task.id)}
                              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                              )}
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {task.subject && (
                            <Badge variant="outline" className="text-xs">
                              {task.subject}
                            </Badge>
                          )}
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          {task.subtasks.length > 0 && (
                            <span className="text-xs text-gray-500">
                              {completedSubtasks}/{totalSubtasks} subtasks
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Subtasks */}
                    {isExpanded && task.subtasks.length > 0 && (
                      <div className="ml-9 space-y-2 pt-2 border-l-2 border-gray-200 pl-4">
                        {task.subtasks.map(subtask => (
                          <div key={subtask.id} className="flex items-center gap-2">
                            <button
                              onClick={() => toggleSubtask(task.id, subtask.id)}
                              className="flex-shrink-0"
                            >
                              {subtask.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400 hover:text-indigo-600" />
                              )}
                            </button>
                            <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                              {subtask.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
