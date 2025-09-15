import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus, Calendar, IndianRupee, Clock, X, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';

interface Reminder {
  _id: string;
  title: string;
  amount: number;
  dueDate: string;
  frequency: 'once' | 'weekly' | 'monthly' | 'yearly';
  createdAt: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    dueDate: '',
    frequency: 'once' as const,
  });

  const fetchReminders = async () => {
    try {
      const response = await axios.get('/api/reminders');
      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      amount: reminder.amount.toString(),
      dueDate: new Date(reminder.dueDate).toISOString().split('T')[0],
      frequency: reminder.frequency,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/reminders/${id}`);
      fetchReminders();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const reminderData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (editingReminder) {
        await axios.put(`/api/reminders/${editingReminder._id}`, reminderData);
      } else {
        await axios.post('/api/reminders', reminderData);
      }

      setFormData({ title: '', amount: '', dueDate: '', frequency: 'once' });
      setShowForm(false);
      setEditingReminder(null);
      fetchReminders();
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingReminder(null);
    setFormData({ title: '', amount: '', dueDate: '', frequency: 'once' });
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <IndianRupee className="h-8 w-8 text-primary-600" />
              <h1 className="text-xl font-semibold text-gray-900">Payment Reminders</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Reminders</h2>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Reminder</span>
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingReminder ? 'Edit Payment Reminder' : 'New Payment Reminder'}
                </h3>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Rent Payment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="input-field"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    className="input-field"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                  >
                    <option value="once">One-time</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    {editingReminder ? 'Update Reminder' : 'Add Reminder'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card max-w-sm w-full">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-red-100 rounded-full p-3">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Reminder</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this reminder? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {reminders.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first payment reminder.</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Add Your First Reminder
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reminders.map((reminder) => {
              const daysUntil = getDaysUntilDue(reminder.dueDate);
              const isOverdue = daysUntil < 0;
              const isDueSoon = daysUntil >= 0 && daysUntil <= 7;

              return (
                <div
                  key={reminder._id}
                  className={`card border-l-4 ${
                    isOverdue
                      ? 'border-l-red-500 bg-red-50'
                      : isDueSoon
                      ? 'border-l-yellow-500 bg-yellow-50'
                      : 'border-l-primary-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 truncate">{reminder.title}</h3>
                    <span className="text-lg font-bold text-primary-600">
                      {formatAmount(reminder.amount)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {formatDate(reminder.dueDate)}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className="capitalize">{reminder.frequency}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {isOverdue ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {Math.abs(daysUntil)} days overdue
                        </span>
                      ) : daysUntil === 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Due today
                        </span>
                      ) : isDueSoon ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Due in {daysUntil} days
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Due in {daysUntil} days
                        </span>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleEdit(reminder)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors duration-200"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(reminder._id)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;