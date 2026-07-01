import { Bot, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentTimeline } from "@/components/agent-timeline";

export type ChatMessage = {
  id: string;
  sender: "user" | "ai";
  content: string;
  timeline?: string[];
  isTyping?: boolean;
  timelineStatus?: "loading" | "done";
};

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === "user";
  return (
    <div className={cn("flex gap-3", isUser && "justify-end")}>
      {!isUser ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-200">
          <Bot className="h-5 w-5" />
        </div>
      ) : null}
      <div
        className={cn(
          "max-w-[86%] rounded-3xl px-4 py-3 text-sm shadow-sm md:max-w-[78%]",
          isUser
            ? "rounded-br-lg bg-slate-950 text-white shadow-slate-200"
            : "rounded-bl-lg border border-slate-200 bg-white text-slate-700 shadow-slate-100",
        )}
      >
        {message.isTyping ? (
          <div className="flex items-center gap-2 text-slate-500">
            <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.2s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.1s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" />
            <span className="ml-1 text-xs font-semibold">HIRA sedang mengetik</span>
          </div>
        ) : (
          <p className="whitespace-pre-line leading-6">{message.content}</p>
        )}
        {message.timeline ? <AgentTimeline steps={message.timeline} status={message.timelineStatus} /> : null}
      </div>
      {isUser ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-200 text-slate-700">
          <UserRound className="h-5 w-5" />
        </div>
      ) : null}
    </div>
  );
}
