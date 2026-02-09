import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Mic, Bot, User as UserIcon, Loader2, Sparkles, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  action?: string;
}

export default function Chat() {
  const { processAIMessage, user } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: `Hi ${user?.name.split(' ')[0]}! I'm MedAgent, your personal AI pharmacist. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsProcessing(true);

    try {
      const response = await processAIMessage(userMsg.text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response.text,
        timestamp: new Date(),
        action: response.action
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      
      recognition.start();
    } else {
      alert("Voice recognition not supported in this browser.");
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" /> AI Pharmacist
          </h1>
          <p className="text-muted-foreground">Chat with MedAgent powered by Llama 3</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden shadow-xl border-primary/10">
        <ScrollArea className="flex-1 p-4 bg-muted/10">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-3",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div 
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                    msg.role === 'assistant' 
                      ? "bg-gradient-to-br from-primary to-accent text-white" 
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                  )}
                >
                  {msg.role === 'assistant' ? <Bot className="h-5 w-5" /> : <UserIcon className="h-5 w-5" />}
                </div>
                
                <div 
                  className={cn(
                    "p-3 rounded-2xl max-w-[80%] text-sm shadow-sm",
                    msg.role === 'assistant' 
                      ? "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-none" 
                      : "bg-primary text-primary-foreground rounded-tr-none"
                  )}
                >
                  <p>{msg.text}</p>
                  {msg.action && (
                    <div className="mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 text-xs opacity-70 flex items-center gap-1 font-mono">
                      <Sparkles className="h-3 w-3" /> Agent Action Triggered: {msg.action}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex gap-1 items-center bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-4 bg-white dark:bg-slate-900 border-t">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input 
              placeholder="Type your message or use voice..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-muted/20 focus-visible:ring-primary/50"
            />
            <Button 
              variant={isListening ? "destructive" : "outline"} 
              size="icon"
              onClick={startListening}
              className={cn("transition-colors", isListening && "animate-pulse")}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isProcessing}
              className="bg-primary hover:bg-primary/90"
            >
              {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
