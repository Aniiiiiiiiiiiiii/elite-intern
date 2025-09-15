import React, { useState, useEffect } from 'react';
import { Plus, Calendar, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';

interface Reminder {
  _id: string;
  title: string;
  dueDate: string;
  notes: string;
  createdAt: string;
}

export default function PaymentReminderPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    notes: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchReminders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchReminders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/reminders');
      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingReminder) {
        await axios.put(`http://localhost:3000/api/reminders/${editingReminder._id}`, formData);
      } else {
        await axios.post('http://localhost:3000/api/reminders', formData);
      }
      
      fetchReminders();
      closeModal();
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      try {
        await axios.delete(`http://localhost:3000/api/reminders/${id}`);
        fetchReminders();
      } catch (error) {
        console.error('Error deleting reminder:', error);
      }
    }
  };

  const openModal = (reminder?: Reminder) => {
    if (reminder) {
      setEditingReminder(reminder);
      setFormData({
        title: reminder.title,
        dueDate: new Date(reminder.dueDate).toISOString().split('T')[0],
        notes: reminder.notes,
      });
    } else {
      setEditingReminder(null);
      setFormData({
        title: '',
        dueDate: '',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReminder(null);
    setFormData({
      title: '',
      dueDate: '',
      notes: '',
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Reminders</h2>
        <p className="text-gray-600 mb-8">
          Please log in to view and manage your payment reminders
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Reminders</h1>
          <p className="text-lg text-gray-600">
            Keep track of your important payment deadlines
          </p>
        </div>
        <Button onClick={() => openModal()} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Reminder</span>
        </Button>
      </div>

      {reminders.length === 0 ? (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders yet</h3>
          <p className="text-gray-600 mb-8">
            Create your first payment reminder to stay organized
          </p>
          <Button onClick={() => openModal()}>
            Add Your First Reminder
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reminders.map((reminder) => (
            <Card key={reminder._id} className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{reminder.title}</h3>
                {isOverdue(reminder.dueDate) && (
                  <AlertCircle size={20} className="text-red-500" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span className={`text-sm ${isOverdue(reminder.dueDate) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                    Due: {formatDate(reminder.dueDate)}
                  </span>
                </div>
                
                {reminder.notes && (
                  <p className="text-sm text-gray-700">{reminder.notes}</p>
                )}
              </div>

              <div className="flex space-x-2 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModal(reminder)}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(reminder._id)}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
        className="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="e.g., Credit Card Payment"
          />

          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Additional notes or details..."
            />
          </div>

          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingReminder ? 'Update' : 'Create'} Reminder
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}