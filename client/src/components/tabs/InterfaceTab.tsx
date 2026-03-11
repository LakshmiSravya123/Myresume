import { motion } from 'framer-motion';
import { useState, useCallback, useRef, useEffect } from 'react';
import { TextGenerate } from '@/components/TextEffects';

const CYAN = '#00d4ff';
const GRAY = '#6b7280';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  id: number;
}

const quickQuestions = [
  "What's your AI experience?",
  'Tell me about your projects',
  'What technologies do you use?',
];

export default function InterfaceTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [latestResponseId, setLatestResponseId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(
    async (query: string) => {
      if (!query.trim() || isLoading) return;

      const userMsgId = ++messageIdRef.current;
      const userMessage: ChatMessage = {
        role: 'user',
        content: query.trim(),
        id: userMsgId,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        const res = await fetch('/api/quick-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query.trim() }),
        });

        const data = await res.json();
        const assistantMsgId = ++messageIdRef.current;
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content:
            data.response ??
            "I can help answer questions about Sravya's experience and skills.",
          id: assistantMsgId,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setLatestResponseId(assistantMsgId);
      } catch {
        const errorMsgId = ++messageIdRef.current;
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Connection interrupted. Please try again.',
            id: errorMsgId,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <motion.div
      key="interface"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="h-full flex flex-col font-mono select-none overflow-hidden"
    >
      {/* Command header */}
      <div className="flex items-center gap-2 text-sm mb-3 shrink-0">
        <span style={{ color: CYAN }}>$</span>
        <span className="text-white">neural_chat --interactive</span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2 flex flex-col gap-2">
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="flex flex-col gap-3">
            <div className="text-sm">
              <span style={{ color: CYAN }}>neural_os&gt;</span>{' '}
              <span className="text-white/70">How can I help? Try these:</span>
            </div>
            <div className="ml-4 flex flex-wrap gap-2">
              {quickQuestions.map((q) => (
                <motion.button
                  key={q}
                  onClick={() => sendMessage(q)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-xs px-3 py-1.5 rounded transition-all duration-200 hover:text-[#00d4ff] hover:bg-white/[0.03]"
                  style={{
                    color: '#94a3b8',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  [{q}]
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-sm"
          >
            {msg.role === 'user' ? (
              <div>
                <span style={{ color: '#4ade80' }}>sravya&gt;</span>{' '}
                <span className="text-white">{msg.content}</span>
              </div>
            ) : (
              <div>
                <span style={{ color: CYAN }}>neural_os&gt;</span>{' '}
                {msg.id === latestResponseId ? (
                  <TextGenerate
                    text={msg.content}
                    delay={0}
                    className="text-white/80"
                  />
                ) : (
                  <span className="text-white/80">{msg.content}</span>
                )}
              </div>
            )}
          </motion.div>
        ))}

        {/* Loading state */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm"
          >
            <span style={{ color: CYAN }}>neural_os&gt;</span>{' '}
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ color: GRAY }}
            >
              processing...
            </motion.span>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick actions when messages exist */}
      {messages.length > 0 && (
        <div className="flex gap-2 py-2 shrink-0 border-t border-white/5">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={isLoading}
              className="text-[10px] px-2 py-1 rounded transition-colors hover:text-[#00d4ff] disabled:opacity-30"
              style={{
                color: GRAY,
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              [{q}]
            </button>
          ))}
        </div>
      )}

      {/* Input prompt */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 pt-2 shrink-0 border-t border-white/5"
      >
        <span className="text-sm" style={{ color: '#4ade80' }}>
          sravya&gt;
        </span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="_"
          disabled={isLoading}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 font-mono outline-none disabled:opacity-50"
        />
        <motion.button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="text-xs px-2 py-1 transition-colors disabled:opacity-30"
          style={{ color: CYAN }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          [send]
        </motion.button>
      </form>
    </motion.div>
  );
}
