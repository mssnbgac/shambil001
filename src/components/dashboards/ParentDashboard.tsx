import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import {
  UserGroupIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  GlobeAltIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:4000',
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface Child {
  id: number;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  className: string;
  classLevel: string;
  house: string;
}

interface ParentData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  children: Child[];
}

const ParentDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'children' | 'messages'>('overview');
  const [messageView, setMessageView] = useState<'inbox' | 'send'>('inbox');
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [messageFilter, setMessageFilter] = useState<'all' | 'replied' | 'pending'>('all');
  const [complaintData, setComplaintData] = useState({
    subject: '',
    message: '',
    priority: 'normal' as 'low' | 'normal' | 'high',
    category: 'general' as 'general' | 'academic' | 'administrative' | 'disciplinary' | 'facilities' | 'transport'
  });

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('🌐 Connection restored!', { duration: 3000 });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('📡 Connection lost. Some features may not work.', { duration: 5000 });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch parent data
  const { data: parentData, isLoading: isLoadingParent } = useQuery<ParentData>(
    'parentData',
    async () => {
      const response = await api.get('/api/parents/current');
      console.log('Parent data received:', response.data);
      return response.data;
    }
  );

  // Fetch parent message statistics
  const { data: messageStats } = useQuery(
    'parentMessageStats',
    async () => {
      const response = await api.get('/api/comments/parent-stats');
      return response.data;
    },
    {
      refetchInterval: 60000, // Refresh every minute
      enabled: isOnline,
    }
  );

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast.success('🔔 Notifications enabled! You\'ll be notified of new replies.');
        }
      });
    }
  }, []);

  // Fetch parent messages with auto-refresh
  const { data: parentMessages, isLoading: messagesLoading, refetch: refetchMessages, error: messagesError } = useQuery(
    'parentMessages',
    async () => {
      try {
        const response = await api.get('/api/comments?role=parent');
        console.log('Parent messages received:', response.data);
        
        // Check for new replies
        if (response.data && response.data.length > 0) {
          const newReplies = response.data.filter((msg: any) => 
            msg.reply && msg.repliedAt && new Date(msg.repliedAt) > lastChecked
          );
          
          if (newReplies.length > 0) {
            toast.success(`🎉 You have ${newReplies.length} new reply${newReplies.length > 1 ? 'ies' : ''} from the school!`, {
              duration: 5000,
              icon: '📧',
            });
            setLastChecked(new Date());
            
            // Play notification sound (if supported)
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('New School Reply', {
                body: `You have ${newReplies.length} new reply${newReplies.length > 1 ? 'ies' : ''} from the school`,
                icon: '/favicon.ico'
              });
            }
          }
        }
        
        return response.data || [];
      } catch (error) {
        console.error('Error fetching messages:', error);
        if (!isOnline) {
          toast.error('📡 No internet connection. Messages will sync when online.');
        } else {
          toast.error('Failed to load messages. Please check your connection.');
        }
        return [];
      }
    },
    {
      refetchInterval: isOnline ? 30000 : false, // Only auto-refresh when online
      refetchOnWindowFocus: true,
      retry: 3,
      retryDelay: 1000,
      enabled: isOnline, // Only fetch when online
    }
  );

  // Filter messages based on current filter (after parentMessages is declared)
  const filteredMessages = parentMessages?.filter((msg: any) => {
    if (messageFilter === 'all') return true;
    if (messageFilter === 'replied') return msg.reply;
    if (messageFilter === 'pending') return !msg.reply;
    return true;
  }) || [];

  const sendComplaint = async () => {
    if (!complaintData.subject.trim() || !complaintData.message.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }

    if (!parentData?.firstName || !parentData?.lastName) {
      toast.error('Parent information not loaded. Please refresh the page.');
      return;
    }

    if (!isOnline) {
      toast.error('📡 No internet connection. Please check your connection and try again.');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Sending message...');

    try {
      const fromUserName = `${parentData.firstName} ${parentData.lastName}`;
      console.log('Sending message with fromUser:', fromUserName);
      
      await api.post('/api/comments', {
        fromUser: fromUserName,
        fromRole: 'parent',
        toUser: 'admin',
        toRole: 'admin',
        subject: complaintData.subject,
        message: complaintData.message,
        priority: complaintData.priority,
        category: complaintData.category
      });

      toast.dismiss(loadingToast);
      toast.success('✅ Message sent successfully! You will receive a reply within 24-48 hours.', {
        duration: 4000,
        icon: '📤',
      });
      
      setComplaintData({
        subject: '',
        message: '',
        priority: 'normal',
        category: 'general'
      });
      setMessageView('inbox');
      refetchMessages();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.dismiss(loadingToast);
      
      if (error.response?.status === 400) {
        toast.error(`❌ ${error.response.data.message || 'Invalid message format. Please check your input.'}`, {
          duration: 4000,
        });
      } else if (error.response?.status === 401) {
        toast.error('🔐 Session expired. Please log in again.', {
          duration: 4000,
        });
      } else {
        toast.error('❌ Failed to send message. Please try again or contact the school directly.', {
          duration: 4000,
        });
      }
    }
  };

  const markMessagesAsRead = () => {
    setLastChecked(new Date());
  };

  // Format message timestamp
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get priority color and icon
  const getPriorityDisplay = (priority: string) => {
    switch (priority) {
      case 'high':
        return { color: 'text-red-600', bg: 'bg-red-100', icon: '🔴', text: 'HIGH PRIORITY' };
      case 'normal':
        return { color: 'text-blue-600', bg: 'bg-blue-100', icon: '🔵', text: 'NORMAL PRIORITY' };
      case 'low':
        return { color: 'text-gray-600', bg: 'bg-gray-100', icon: '⚪', text: 'LOW PRIORITY' };
      default:
        return { color: 'text-blue-600', bg: 'bg-blue-100', icon: '🔵', text: 'NORMAL PRIORITY' };
    }
  };

  if (isLoadingParent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              👨‍👩‍👧‍👦 Welcome, {parentData?.firstName} {parentData?.lastName}
            </h1>
            <p className="text-gray-600">Monitor your children's academic progress and school activities</p>
            {parentData?.email && (
              <p className="text-gray-500 text-sm mt-1">
                {parentData.email} {parentData.phone && `• ${parentData.phone}`}
              </p>
            )}
          </div>
          
          {/* Connection Status */}
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isOnline 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveView('overview')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeView === 'overview' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveView('children')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeView === 'children' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            👶 Child Details
          </button>
          <button
            onClick={() => setActiveView('messages')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeView === 'messages' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💬 Messages
            {messageStats && messageStats.totalMessages > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {messageStats.totalMessages}
              </span>
            )}
            {parentMessages?.filter((msg: any) => msg.reply && msg.repliedAt && new Date(msg.repliedAt) > lastChecked).length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                NEW
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Children Overview */}
          {parentData?.children && parentData.children.length > 0 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Children</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parentData.children.map((child) => (
                  <div key={child.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-lg">
                        {child.firstName?.charAt(0)}{child.lastName?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{child.firstName} {child.lastName}</h3>
                        <p className="text-sm text-gray-600">{child.admissionNumber}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Class:</span> {child.className}</p>
                      <p><span className="font-medium">Level:</span> {child.classLevel}</p>
                      <p><span className="font-medium">House:</span> {child.house}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedChild(child);
                        setActiveView('children');
                      }}
                      className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Dashboard
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <ExclamationTriangleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Children Found</h3>
              <p className="text-gray-600">No children are currently linked to your parent account.</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setActiveView('messages')}
                className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <EnvelopeIcon className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Send Message</span>
              </button>
              <button
                onClick={() => window.open('/', '_blank')}
                className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <GlobeAltIcon className="h-8 w-8 text-orange-600 mb-2" />
                <span className="text-sm font-medium">School Homepage</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <CalendarDaysIcon className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium">Schedule Meeting</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <AcademicCapIcon className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium">Academic Reports</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Children Tab */}
      {activeView === 'children' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Child Details</h2>
          {selectedChild ? (
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {selectedChild.firstName?.charAt(0)}{selectedChild.lastName?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedChild.firstName} {selectedChild.lastName}
                  </h3>
                  <p className="text-gray-600">
                    {selectedChild.admissionNumber} • {selectedChild.className} • {selectedChild.house}
                  </p>
                </div>
              </div>
              <p className="text-gray-600">Child dashboard details will be loaded here.</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Child</h3>
              <p className="text-gray-600 mb-4">Choose a child from the overview to view their detailed information.</p>
              <button
                onClick={() => setActiveView('overview')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Overview
              </button>
            </div>
          )}
        </div>
      )}

      {/* Messages Tab */}
      {activeView === 'messages' && (
        <div className="space-y-6">
          {/* Messages Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Messages & Communication</h2>
            <p className="text-gray-600 mb-4">
              View replies from school administration and send new messages.
            </p>
            
            {/* Message Statistics */}
            {messageStats && messageStats.totalMessages > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{messageStats.totalMessages}</div>
                  <div className="text-xs text-gray-600">Total Messages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{messageStats.repliedMessages}</div>
                  <div className="text-xs text-gray-600">Replied</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{messageStats.pendingMessages}</div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{messageStats.responseRate}%</div>
                  <div className="text-xs text-gray-600">Response Rate</div>
                </div>
              </div>
            )}
            
            {/* Message Sub-tabs */}
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setMessageView('inbox');
                  markMessagesAsRead();
                }}
                className={`px-4 py-2 rounded-lg font-medium ${
                  messageView === 'inbox' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📥 Inbox ({parentMessages?.length || 0})
                {parentMessages?.filter((msg: any) => msg.reply).length > 0 && (
                  <span className="ml-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {parentMessages.filter((msg: any) => msg.reply).length} replies
                  </span>
                )}
              </button>
              <button
                onClick={() => setMessageView('send')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  messageView === 'send' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ✉️ Send Message
              </button>
            </div>
          </div>

          {/* Inbox View */}
          {messageView === 'inbox' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Your Messages & Replies</h3>
                <div className="flex items-center space-x-3">
                  <span className={`text-xs ${isOnline ? 'text-gray-500' : 'text-red-500'}`}>
                    {isOnline ? 'Auto-refreshes every 30s' : 'Offline - No auto-refresh'}
                  </span>
                  <button
                    onClick={() => {
                      refetchMessages();
                      markMessagesAsRead();
                      toast.success('Messages refreshed!', { duration: 2000 });
                    }}
                    disabled={!isOnline}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      isOnline 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    🔄 Refresh Now
                  </button>
                </div>
              </div>
              
              {/* Message Filters */}
              <div className="flex space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700 mr-2">Filter:</span>
                <button
                  onClick={() => setMessageFilter('all')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    messageFilter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All ({parentMessages?.length || 0})
                </button>
                <button
                  onClick={() => setMessageFilter('replied')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    messageFilter === 'replied' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <CheckCircleIcon className="h-3 w-3 inline mr-1" />
                  Replied ({parentMessages?.filter((msg: any) => msg.reply).length || 0})
                </button>
                <button
                  onClick={() => setMessageFilter('pending')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    messageFilter === 'pending' 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ClockIcon className="h-3 w-3 inline mr-1" />
                  Pending ({parentMessages?.filter((msg: any) => !msg.reply).length || 0})
                </button>
              </div>
              
              {messagesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading messages...</p>
                </div>
              ) : messagesError ? (
                <div className="text-center py-8">
                  <div className="text-red-500 mb-4">
                    <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-2" />
                    <h4 className="text-lg font-medium">Connection Error</h4>
                    <p className="text-sm text-gray-600">Unable to load messages. Please check your internet connection.</p>
                  </div>
                  <button
                    onClick={() => refetchMessages()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredMessages && filteredMessages.length > 0 ? (
                <div className="space-y-4">
                  {filteredMessages.map((message: any) => {
                    const hasNewReply = message.reply && message.repliedAt && new Date(message.repliedAt) > lastChecked;
                    
                    return (
                    <div key={message.id} className={`border rounded-lg p-4 transition-shadow ${
                      hasNewReply ? 'border-green-300 bg-green-50 shadow-lg' : 'border-gray-200 hover:shadow-md'
                    }`}>
                      {hasNewReply && (
                        <div className="mb-3 p-2 bg-green-100 border border-green-300 rounded text-sm text-green-800">
                          🎉 <strong>New Reply!</strong> The school has responded to your message.
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{message.subject}</h4>
                            {message.priority && (() => {
                              const priorityDisplay = getPriorityDisplay(message.priority);
                              return (
                                <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full ${priorityDisplay.bg} ${priorityDisplay.color}`}>
                                  <span className="mr-1">{priorityDisplay.icon}</span>
                                  {priorityDisplay.text}
                                </span>
                              );
                            })()}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>To: {message.to} ({message.toRole})</span>
                            <span>•</span>
                            <span>{formatMessageTime(message.timestamp)}</span>
                            {message.category && (
                              <>
                                <span>•</span>
                                <span className="capitalize">{message.category}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            message.reply ? 'bg-green-100 text-green-800' : 
                            message.status === 'read' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {message.reply ? '✅ REPLIED' : message.status === 'read' ? '👀 READ' : '📤 SENT'}
                          </span>
                          {message.reply && (
                            <span className="text-xs text-green-600 font-medium">
                              Reply: {formatMessageTime(message.repliedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 mb-2"><strong>Your Message:</strong></p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{message.message}</p>
                        {/* Debug info */}
                        <div className="text-xs text-gray-400 mt-1 flex justify-between">
                          <span>Message ID: {message.id} | Status: {message.status}</span>
                          <span>
                            {message.reply ? '✅ Replied' : '⏳ Pending'} | 
                            Sent: {new Date(message.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      {message.reply ? (
                        <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-800">
                              📧 Reply from {message.repliedBy || 'Admin'}:
                            </span>
                            <span className="text-xs text-blue-600">
                              {message.repliedAt && new Date(message.repliedAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-blue-700">{message.reply}</p>
                        </div>
                      ) : (
                        <div className="mt-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                          <div className="flex items-center space-x-2">
                            <div className="animate-pulse h-2 w-2 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm text-yellow-800">
                              Waiting for response... Expected reply within 24-48 hours.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Messages Yet</h4>
                  <p className="text-gray-600 mb-4">You haven't sent any messages to the school yet.</p>
                  <button
                    onClick={() => setMessageView('send')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Your First Message
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Send Message View */}
          {messageView === 'send' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Send Message to School</h2>
              <p className="text-gray-600 mb-6">
                Send messages, complaints, or inquiries to the school administration.
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={complaintData.category}
                      onChange={(e) => setComplaintData({...complaintData, category: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="academic">Academic Concern</option>
                      <option value="administrative">Administrative Issue</option>
                      <option value="disciplinary">Disciplinary Matter</option>
                      <option value="facilities">Facilities & Infrastructure</option>
                      <option value="transport">Transportation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={complaintData.priority}
                      onChange={(e) => setComplaintData({...complaintData, priority: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low Priority</option>
                      <option value="normal">Normal Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Subject *
                    </label>
                    <span className={`text-xs ${
                      complaintData.subject.length > 180 ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {complaintData.subject.length}/200
                    </span>
                  </div>
                  <input
                    type="text"
                    value={complaintData.subject}
                    onChange={(e) => setComplaintData({...complaintData, subject: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      complaintData.subject.length > 200 ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Brief subject of your message"
                    maxLength={200}
                    required
                  />
                  {complaintData.subject.length > 180 && (
                    <p className="text-xs text-red-500 mt-1">
                      Subject is getting long. Keep it concise for better readability.
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Message *
                    </label>
                    <span className={`text-xs ${
                      complaintData.message.length > 1800 ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {complaintData.message.length}/2000
                    </span>
                  </div>
                  <textarea
                    value={complaintData.message}
                    onChange={(e) => setComplaintData({...complaintData, message: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      complaintData.message.length > 2000 ? 'border-red-300' : 'border-gray-300'
                    }`}
                    rows={6}
                    placeholder="Detailed message or complaint..."
                    maxLength={2000}
                    required
                  />
                  {complaintData.message.length > 1800 && (
                    <p className="text-xs text-red-500 mt-1">
                      Message is getting long. Consider breaking it into multiple messages if needed.
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setComplaintData({
                      subject: '',
                      message: '',
                      priority: 'normal',
                      category: 'general'
                    })}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Clear
                  </button>
                  <button
                    onClick={sendComplaint}
                    disabled={!complaintData.subject.trim() || !complaintData.message.trim() || 
                             complaintData.subject.length > 200 || complaintData.message.length > 2000}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                      !complaintData.subject.trim() || !complaintData.message.trim() || 
                      complaintData.subject.length > 200 || complaintData.message.length > 2000
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <PaperAirplaneIcon className="h-4 w-4" />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;