import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const quickQuestions = [
    "Tell me about my work experience",
    "What are my key technical skills?",
    "Describe my most impactful projects",
    "What makes me stand out as a data scientist?",
    "How can I improve my resume?",
  ];

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/quick-action", { query: content });
      return response.json();
    },
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: Date.now() + "-ai",
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to get response",
        description: (error as any).message,
        variant: "destructive",
      });
      setIsTyping(false);
    },
  });

  const handleSendMessage = (content: string) => {
    if (!content.trim() || sendMessageMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now() + "-user",
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    sendMessageMutation.mutate(content.trim());
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm an AI assistant trained on Lakshmi's resume and experience. Ask me anything about her background, skills, or career journey!",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="text-white h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">AI Resume Assistant</h2>
                  <p className="text-sm text-gray-600">Ask me about Lakshmi's experience</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                data-testid="chat-modal-close"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user" 
                        ? "bg-blue-600" 
                        : "bg-gradient-to-r from-purple-500 to-blue-600"
                    }`}>
                      {message.role === "user" ? (
                        <User className="text-white h-4 w-4" />
                      ) : (
                        <Bot className="text-white h-4 w-4" />
                      )}
                    </div>
                    <div className={`p-4 rounded-2xl ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p className={`text-xs mt-2 ${
                        message.role === "user" ? "text-blue-200" : "text-gray-500"
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="text-white h-4 w-4" />
                    </div>
                    <div className="bg-gray-100 p-4 rounded-2xl">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 font-medium">Quick questions to get started:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-left justify-start h-auto p-3 text-sm hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => handleQuickQuestion(question)}
                        data-testid={`quick-question-${index}`}
                      >
                        <MessageCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about Lakshmi's experience, skills, or career..."
                    className="resize-none min-h-[60px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    disabled={sendMessageMutation.isPending}
                    data-testid="chat-input"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
                <Button
                  onClick={() => handleSendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  data-testid="chat-send-button"
                >
                  {sendMessageMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}