import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Loader2, Brain, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AIQuestionnaire() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm Lakshmi's AI assistant. I have comprehensive knowledge of her resume, work experience, and technical expertise. Ask me anything about her background, projects, skills, or career achievements!",
      timestamp: new Date()
    }
  ]);
  const [currentQuestion, setCurrentQuestion] = useState("");

  const askQuestion = useMutation({
    mutationFn: async (question: string) => {
      const response = await fetch('/api/quick-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      // Add AI response
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-ai',
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      }]);
    },
    onError: (error) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-error',
        type: 'ai',
        content: "I apologize, but I'm having trouble processing your question right now. Please try again in a moment.",
        timestamp: new Date()
      }]);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentQuestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    askQuestion.mutate(currentQuestion);
    setCurrentQuestion("");
  };

  const suggestedQuestions = [
    "What are Lakshmi's key technical skills?",
    "Tell me about her work experience",
    "What major achievements has she accomplished?",
    "Describe her data science projects",
    "What AI tools does she work with?",
    "How much experience does she have in machine learning?"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setCurrentQuestion(question);
  };

  return (
    <section id="ai-questionnaire" className="py-20 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 relative overflow-hidden">
      <div className="absolute inset-0 pattern-waves opacity-30"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-12 h-12 text-pink-600 mr-4 animate-wiggle" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              🤖 Sravya AI Assistant
            </h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto font-medium">
            Ask me anything! 💬 I'm powered by local AI and ready to share all about Lakshmi's amazing journey! ✨
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="bg-white border-2 border-pink-200 shadow-2xl rounded-3xl overflow-hidden">
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-yellow-50 to-pink-50">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start space-x-3 ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
                        : 'bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow-lg'
                    }`}>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      <div className={`inline-block px-4 py-3 rounded-2xl shadow-md ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : 'bg-gradient-to-r from-yellow-100 to-pink-100 text-gray-800 border border-pink-200'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {askQuestion.isPending && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                      <p className="text-sm text-gray-600">Thinking...</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Form */}
            <div className="border-t border-gray-200 p-6 bg-white">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4">
                  <Textarea
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    placeholder="Ask me anything about Lakshmi's background, skills, or experience..."
                    className="flex-1 min-h-[50px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    data-testid="input-question"
                  />
                  <Button 
                    type="submit" 
                    disabled={!currentQuestion.trim() || askQuestion.isPending}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200"
                    data-testid="button-ask-question"
                  >
                    {askQuestion.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Suggested Questions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Suggested Questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestedQuestion(question)}
                        className="text-xs px-3 py-1 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
                        data-testid={`button-suggested-${index}`}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
            <Brain className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm text-gray-600">
              Powered by local AI processing - No API keys required
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}