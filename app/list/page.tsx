'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Check, X, Heart } from 'lucide-react';

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
}

export default function ListPage() {
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: '1',
      title: '一起去看樱花',
      completed: false,
      priority: 'high',
      createdBy: 'Mao'
    },
    {
      id: '2',
      title: '学会做她最爱吃的菜',
      completed: true,
      priority: 'medium',
      createdBy: 'Yi'
    },
    {
      id: '3',
      title: '每天说晚安',
      completed: true,
      priority: 'high',
      createdBy: 'Mao'
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    createdBy: 'Mao'
  });

  const handleAdd = () => {
    if (newTodo.title.trim()) {
      setTodos([
        {
          id: Date.now().toString(),
          ...newTodo,
          completed: false
        },
        ...todos
      ]);
      setNewTodo({
        title: '',
        priority: 'medium',
        createdBy: 'Ki'
      });
      setShowAddForm(false);
    }
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '重要';
      case 'medium': return '一般';
      case 'low': return '不急';
      default: return '';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回首页
          </Link>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            添加新约定
          </button>
        </div>

        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 rounded-full mb-4">
            <Heart className="w-10 h-10 text-pink-600 fill-pink-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Love List
          </h1>
          <p className="text-xl text-gray-600">恋爱列表 - 你我之间的约定</p>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 text-center shadow-md">
            <p className="text-3xl font-bold text-gray-800">{todos.length}</p>
            <p className="text-sm text-gray-500">总计</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center shadow-md">
            <p className="text-3xl font-bold text-green-600">{todos.filter(t => t.completed).length}</p>
            <p className="text-sm text-gray-600">已完成</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 text-center shadow-md">
            <p className="text-3xl font-bold text-pink-600">{todos.filter(t => !t.completed).length}</p>
            <p className="text-sm text-gray-600">进行中</p>
          </div>
        </div>

        {/* 待办列表 */}
        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 ${
                todo.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* 完成按钮 */}
                <button
                  onClick={() => toggleComplete(todo.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    todo.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-pink-500'
                  }`}
                >
                  {todo.completed && <Check className="w-4 h-4 text-white" />}
                </button>

                {/* 内容 */}
                <div className="flex-1">
                  <p className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {todo.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(todo.priority)}`}>
                      {getPriorityLabel(todo.priority)}
                    </span>
                    <span className="text-xs text-gray-400">by {todo.createdBy}</span>
                  </div>
                </div>

                {/* 删除按钮 */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 添加表单模态框 */}
        {showAddForm && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddForm(false)}
          >
            <div 
              className="bg-white rounded-3xl max-w-lg w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">添加新约定</h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="我们约定..."
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newTodo.priority}
                    onChange={(e) => setNewTodo({...newTodo, priority: e.target.value as any})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="low">不急</option>
                    <option value="medium">一般</option>
                    <option value="high">重要</option>
                  </select>
                  <select
                    value={newTodo.createdBy}
                    onChange={(e) => setNewTodo({...newTodo, createdBy: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="Mao">Mao</option>
                    <option value="Yi">Yi</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
