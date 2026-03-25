"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type TargetAndTransition } from "framer-motion";
import { Send, X } from "lucide-react";

type BotState = "idle" | "wave" | "thinking" | "responding";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
}

const BOT_IMAGES: Record<BotState, string> = {
  idle: "/images/bot/idle-2.png",
  wave: "/images/bot/wave-2.png",
  thinking: "/images/bot/thinking-2.png",
  responding: "/images/bot/responding-2.png",
};

/* Framer Motion animation variants per bot state */
const botAnimations: Record<BotState, TargetAndTransition> = {
  idle: {
    y: [0, -4, 0],
    transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
  },
  wave: {
    y: [0, -6, 0],
    transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" },
  },
  thinking: {
    scale: [1, 1.06, 1],
    transition: { repeat: Infinity, duration: 1, ease: "easeInOut" },
  },
  responding: {
    y: [0, -3, 0],
    transition: { repeat: Infinity, duration: 0.6, ease: "easeInOut" },
  },
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [botState, setBotState] = useState<BotState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(0);

  /* Scroll to bottom on new message */
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Wave on first open */
  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) {
      setBotState("wave");
      setTimeout(() => setBotState("idle"), 1500);
      const welcomeId = ++idCounter.current;
      setMessages([
        {
          id: welcomeId,
          role: "bot",
          text: "Hi there! 👋 I'm FireBot. Ask me anything about FireKiller & PanSafe products, fire safety, or your orders!",
        },
      ]);
    }
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: Message = { id: ++idCounter.current, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);
    setBotState("thinking");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setBotState("responding");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: ++idCounter.current, role: "bot", text: data.reply },
        ]);
        setTimeout(() => setBotState("idle"), 1500);
      }, 300);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: ++idCounter.current,
          role: "bot",
          text: "Oops, something went wrong. Please try again!",
        },
      ]);
      setBotState("idle");
    } finally {
      setSending(false);
    }
  }, [input, sending]);

  return (
    <>
      {/* Chat bubble panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-85 sm:w-95 max-h-125 bg-card rounded-2xl border border-border shadow-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-white rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 relative">
                  <Image
                    src={BOT_IMAGES[botState]}
                    alt="FireBot"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold">FireBot</p>
                  <p className="text-[10px] text-white/70">
                    {botState === "thinking"
                      ? "Thinking..."
                      : botState === "responding"
                      ? "Typing..."
                      : "Online"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-95 max-h-125">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-muted text-secondary rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Thinking indicator */}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={messagesEnd} />
            </div>

            {/* Input */}
            <div className="px-3 py-2.5 border-t border-border bg-card">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask about fire safety..."
                  className="flex-1 px-3 py-2 text-sm bg-muted rounded-xl border border-border focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                  disabled={sending}
                  maxLength={500}
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !input.trim()}
                  className="p-2 bg-primary text-white rounded-xl hover:bg-primary-dark disabled:opacity-40 transition-colors"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating bot button */}
      <motion.button
        onClick={open ? () => setOpen(false) : handleOpen}
        className="fixed bottom-5 right-4 sm:right-6 z-50 w-20 h-20 flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <motion.div
          className="w-20 h-20 relative"
          animate={botAnimations[botState]}
        >
          <Image
            src={BOT_IMAGES[botState]}
            alt="FireBot"
            fill
            className="object-contain"
          />
        </motion.div>
      </motion.button>
    </>
  );
}
