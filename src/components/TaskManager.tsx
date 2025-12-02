import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Plus, ChevronDown, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
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
    if (newExpanded.has(taskId)) newExpanded.delete(taskId);
    else newExpanded.add(taskId);
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
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#4B2E23]">Task Manager</h2>
          <p className="text-amber-800">Organize and track your assignments</p>
        </div>

        {/* Add Task Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#4B2E23] hover:bg-[#3A241B] text-white">
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>

          <DialogContent>
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
                  <Label>Priority</Label>
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
                  onChange={(e) => setNewTask({
                    ...newTask,
                    estimatedHours: parseInt(e.target.value) || 1
                  })}
                />
              </div>

              <Button
                onClick={handleAddTask}
                className="w-full bg-[#4B2E23] hover:bg-[#3A241B] text-white"
              >
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={filter === 'all'
            ? 'bg-[#4B2E23] text-white'
            : 'border-amber-300 text-[#4B2E23]'
          }
        >
          All Tasks
        </Button>

        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          onClick={() => setFilter('active')}
          className={filter === 'active'
            ? 'bg-[#4B2E23] text-white'
            : 'border-amber-300 text-[#4B2E23]'
          }
        >
          Active
        </Button>

        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
          className={filter === 'completed'
            ? 'bg-[#4B2E23] text-white'
            : 'border-amber-300 text-[#4B2E23]'
          }
        >
          Completed
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="pb-4 text-center pt-4">
              <p className="text-amber-800">
                No tasks found. Create your first task to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map(task => {
            const isExpanded = expandedTasks.has(task.id);
            const completedSubtasks = task.subtasks.filter(st => st.completed).length;
            const totalSubtasks = task.subtasks.length;

            return (
              <Card key={task.id} className="border-amber-200">
                <CardContent className="pt-4">
                  <div className="space-y-3">

                    {/* Task Row */}
                    <div className="flex items-start gap-3">

                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <Circle className="w-6 h-6 text-[#4B2E23] opacity-50" />
                        )}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className={`text-[#4B2E23] ${task.completed ? 'line-through opacity-70' : ''}`}>
                              {task.title}
                            </h3>

                            {task.description && (
                              <p className="text-sm text-amber-800 mt-1">{task.description}</p>
                            )}
                          </div>

                          {task.subtasks.length > 0 && (
                            <button
                              onClick={() => toggleExpanded(task.id)}
                              className="flex-shrink-0 p-1 hover:bg-amber-100 rounded"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-[#4B2E23]" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-[#4B2E23]" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {task.subject && (
                            <Badge variant="outline" className="text-xs border-amber-300 text-[#4B2E23]">
                              {task.subject}
                            </Badge>
                          )}

                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>

                          <span className="text-xs text-amber-800">
                            Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>

                          {task.subtasks.length > 0 && (
                            <span className="text-xs text-amber-800">
                              {completedSubtasks}/{totalSubtasks} subtasks
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Subtasks */}
                    {isExpanded && task.subtasks.length > 0 && (
                      <div className="ml-9 space-y-2 pt-2 border-l-2 border-amber-200 pl-4">
                        {task.subtasks.map(subtask => (
                          <div key={subtask.id} className="flex items-center gap-2">
                            <button
                              onClick={() => toggleSubtask(task.id, subtask.id)}
                              className="flex-shrink-0"
                            >
                              {subtask.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-[#4B2E23] opacity-50" />
                              )}
                            </button>

                            <span
                              className={`text-sm ${
                                subtask.completed
                                  ? 'line-through text-amber-700 opacity-70'
                                  : 'text-[#4B2E23]'
                              }`}
                            >
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
