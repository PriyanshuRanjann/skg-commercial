"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: Array<{ label: string; url: string }>;
};

const API_BASE = "https://sellers.trythat.ai";

const QUICK_QUESTIONS = [
  "Book a ride to Pune Airport",
  "What areas do you cover?",
  "What are your rates?",
];

function CarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M5 17h14M3 17V11l2-5h14l2 5v6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetch("/api/chat/token")
      .then((r) => r.json())
      .then((d) => { if (d.token) setToken(d.token as string); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let vid = localStorage.getItem("mm_chat_vid") ?? "";
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem("mm_chat_vid", vid);
    }
    setVisitorId(vid);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => textareaRef.current?.focus(), 320);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !token || !visitorId) return;

      setInputValue("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";

      abortRef.current?.abort();
      setError(null);

      const userMsgId = crypto.randomUUID();
      const assistantMsgId = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content: trimmed },
        { id: assistantMsgId, role: "assistant", content: "" },
      ]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const payload = sessionId
          ? { message: trimmed, session_id: sessionId }
          : { message: trimmed, visitor_id: visitorId };

        const resp = await fetch(`${API_BASE}/api/v1/chat/stream`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        if (!resp.ok || !resp.body) throw new Error(`HTTP ${resp.status}`);

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (!raw) continue;

            let evt: Record<string, unknown>;
            try {
              evt = JSON.parse(raw) as Record<string, unknown>;
            } catch {
              continue;
            }

            if (typeof evt.token === "string") {
              const tok = evt.token;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, content: m.content + tok }
                    : m
                )
              );
            }

            if (evt.images && Array.isArray(evt.images)) {
              const imgs = evt.images as Array<{ label: string; url: string }>;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId ? { ...m, images: imgs } : m
                )
              );
            }

            if (evt.done) {
              if (typeof evt.session_id === "string") {
                setSessionId(evt.session_id);
                localStorage.setItem("mm_chat_sid", evt.session_id);
              }
              setIsStreaming(false);
            }

            if (evt.rejected) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        content:
                          "I'm unable to process that request. Please try a different question.",
                      }
                    : m
                )
              );
              setIsStreaming(false);
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setIsStreaming(false);
        setError("Connection error — please try again.");
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.id === assistantMsgId && !last.content) return prev.slice(0, -1);
          return prev;
        });
      }
    },
    [token, sessionId, visitorId]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  };

  const streamingMsgId = isStreaming
    ? messages[messages.length - 1]?.id
    : null;

  return (
    <>
      <style>{`
        .mm-chat-input::placeholder { color: var(--text-dim); }
      `}</style>

      {/* Trigger bubble */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close chat" : "Chat with Metro Miles AI"}
        style={{ boxShadow: "0 8px 32px -8px rgba(201,168,124,0.6)" }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full btn-gold flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
      >
        {isOpen ? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <CarIcon className="w-6 h-6" />
        )}
      </button>

      {/* Chat panel */}
      <div
        style={{
          boxShadow:
            "0 32px 80px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,124,0.28)",
          transition:
            "opacity 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1)",
          opacity: isOpen ? 1 : 0,
          transform: isOpen
            ? "translateY(0) scale(1)"
            : "translateY(16px) scale(0.97)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
        className="fixed z-40 flex flex-col overflow-hidden rounded-2xl bg-[var(--bg-card)]
          inset-x-3 bottom-24 top-4
          sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[400px] sm:top-auto sm:h-[600px]"
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-card) 100%)",
            borderBottom: "1px solid rgba(201,168,124,0.22)",
          }}
        >
          <div
            className="w-9 h-9 rounded-full btn-gold flex items-center justify-center flex-shrink-0"
            style={{ boxShadow: "0 4px 12px -4px rgba(201,168,124,0.5)" }}
          >
            <CarIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-[var(--text-strong)] leading-tight">
              Metro Miles
            </p>
            <p className="text-xs flex items-center gap-1.5 mt-0.5" style={{ color: "var(--text-muted)" }}>
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: "var(--success)" }}
              />
              AI Assistant · Online
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--text-dim)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "var(--text)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)")
            }
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-4 py-6">
              <div
                className="w-20 h-20 rounded-full btn-gold flex items-center justify-center"
                style={{ boxShadow: "0 8px 32px -8px rgba(201,168,124,0.5)" }}
              >
                <CarIcon className="w-10 h-10" />
              </div>
              <div>
                <p
                  className="font-bold text-lg leading-tight"
                  style={{ color: "var(--text-strong)" }}
                >
                  Metro Miles AI
                </p>
                <p
                  className="text-sm mt-1 leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  Ask me about rides, routes,
                  <br />
                  pricing, or anything else!
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    disabled={!token || !visitorId}
                    className="text-xs text-left px-3 py-2.5 rounded-xl transition-colors disabled:opacity-40"
                    style={{
                      border: "1px solid rgba(201,168,124,0.3)",
                      color: "var(--accent)",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "rgba(201,168,124,0.08)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "transparent")
                    }
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div
                    className="w-6 h-6 rounded-full btn-gold flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    <CarIcon className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`flex flex-col gap-2 ${
                    msg.role === "user" ? "items-end max-w-[78%]" : "items-start max-w-[78%]"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      msg.role === "user"
                        ? "btn-gold rounded-br-none"
                        : "rounded-bl-none"
                    }`}
                    style={
                      msg.role === "user"
                        ? { color: "var(--bg-deep)" }
                        : {
                            background: "var(--bg-elevated)",
                            color: "var(--text)",
                            border: "1px solid var(--hairline)",
                          }
                    }
                  >
                    {msg.content ? (
                      <>
                        {msg.content}
                        {msg.id === streamingMsgId && (
                          <span
                            className="inline-block w-0.5 h-3.5 rounded-full ml-0.5 align-middle animate-pulse"
                            style={{ backgroundColor: "var(--accent)" }}
                          />
                        )}
                      </>
                    ) : msg.id === streamingMsgId ? (
                      <span className="flex items-center gap-1 py-0.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{
                            backgroundColor: "var(--accent)",
                            animationDelay: "0ms",
                          }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{
                            backgroundColor: "var(--accent)",
                            animationDelay: "150ms",
                          }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{
                            backgroundColor: "var(--accent)",
                            animationDelay: "300ms",
                          }}
                        />
                      </span>
                    ) : null}
                  </div>

                  {msg.images && msg.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {msg.images.map((img) => (
                        <a
                          key={img.url}
                          href={img.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={img.label}
                            className="w-full rounded-xl object-cover aspect-video"
                            style={{ border: "1px solid var(--hairline)" }}
                          />
                          <p
                            className="text-xs mt-1 truncate"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {img.label}
                          </p>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {error && (
            <div
              className="text-xs text-center rounded-xl px-3 py-2.5 mx-2"
              style={{
                background: "rgba(196,90,90,0.12)",
                color: "var(--danger)",
              }}
            >
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          className="flex-shrink-0 px-3 pt-3 pb-4"
          style={{ borderTop: "1px solid var(--hairline)", background: "var(--bg-deep)" }}
        >
          {isStreaming && (
            <p
              className="text-xs mb-2 pl-1"
              style={{ color: "var(--text-dim)" }}
            >
              AI is responding…
            </p>
          )}
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              rows={1}
              className="mm-chat-input flex-1 px-4 py-2.5 rounded-xl text-sm transition-all outline-none"
              style={{
                resize: "none",
                maxHeight: "120px",
                overflowY: "auto",
                lineHeight: "1.5",
                background: "rgba(255,255,255,0.02)",
                color: "var(--text)",
                border: "1px solid var(--hairline-strong)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid var(--accent)";
                e.currentTarget.style.background = "rgba(201,168,124,0.05)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 4px rgba(201,168,124,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid var(--hairline-strong)";
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={!token || !visitorId}
              aria-label="Send message"
              className="w-10 h-10 flex-shrink-0 rounded-xl btn-gold flex items-center justify-center transition-transform active:scale-95 disabled:opacity-40"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19V5m0 0l-7 7m7-7l7 7"
                />
              </svg>
            </button>
          </div>
          <p
            className="text-xs mt-2 pl-1"
            style={{ color: "var(--text-dim)" }}
          >
            Enter ↵ to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </>
  );
}
