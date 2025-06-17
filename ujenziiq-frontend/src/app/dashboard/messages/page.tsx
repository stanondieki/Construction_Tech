'use client';

import React, { useState } from 'react';
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isOwn: boolean;
  avatar?: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  avatar?: string;
  isOnline: boolean;
  role: string;
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived' | 'starred'>('all');

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'John Kimani',
      lastMessage: 'The foundation work is progressing well. We should complete it by Friday.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      unreadCount: 2,
      isOnline: true,
      role: 'Site Engineer',
      avatar: 'JK'
    },
    {
      id: '2',
      name: 'Mary Wanjiku',
      lastMessage: 'Safety inspection completed. All equipment checks out.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unreadCount: 0,
      isOnline: false,
      role: 'Safety Officer',
      avatar: 'MW'
    },
    {
      id: '3',
      name: 'Project Team',
      lastMessage: 'Weekly meeting scheduled for tomorrow at 10 AM.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      unreadCount: 1,
      isOnline: true,
      role: 'Group Chat',
      avatar: 'PT'
    },
    {
      id: '4',
      name: 'David Ochieng',
      lastMessage: 'Material delivery confirmed for Monday morning.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      unreadCount: 0,
      isOnline: true,
      role: 'Procurement Manager',
      avatar: 'DO'
    },
    {
      id: '5',
      name: 'Grace Mutua',
      lastMessage: 'Budget review documents are ready for your approval.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      unreadCount: 3,
      isOnline: false,
      role: 'Finance Manager',
      avatar: 'GM'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'John Kimani',
      content: 'Good morning! I wanted to update you on the foundation work progress.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: true,
      isOwn: false
    },
    {
      id: '2',
      sender: 'You',
      content: 'Thanks for the update. How are we tracking against the timeline?',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      isRead: true,
      isOwn: true
    },
    {
      id: '3',
      sender: 'John Kimani',
      content: 'We\'re actually ahead of schedule by about 2 days. The weather has been favorable.',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      isRead: true,
      isOwn: false
    },
    {
      id: '4',
      sender: 'John Kimani',
      content: 'The foundation work is progressing well. We should complete it by Friday.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isRead: false,
      isOwn: false
    }
  ]);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filter) {
      case 'unread':
        return matchesSearch && conv.unreadCount > 0;
      case 'starred':
        return matchesSearch; // You could add a starred property
      case 'archived':
        return matchesSearch; // You could add an archived property
      default:
        return matchesSearch;
    }
  });

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'You',
        content: newMessage.trim(),
        timestamp: new Date(),
        isRead: true,
        isOwn: true
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Update the conversation's last message
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, lastMessage: newMessage.trim(), timestamp: new Date() }
          : conv
      ));
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-[calc(100vh-2rem)] bg-white rounded-lg shadow-sm border border-gray-200 flex">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            {['all', 'unread', 'starred', 'archived'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as 'all' | 'unread' | 'archived' | 'starred')}
                className={`px-3 py-1 text-xs rounded-full capitalize ${
                  filter === filterType
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {conversation.avatar}
                  </div>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-1">{conversation.role}</p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {selectedConv?.avatar}
                    </div>
                    {selectedConv?.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900">{selectedConv?.name}</h2>
                    <p className="text-sm text-gray-500">{selectedConv?.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Video className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.isOwn ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Smile className="w-5 h-5 text-gray-500" />
                </button>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}