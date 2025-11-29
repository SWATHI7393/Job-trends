'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import AppLayout from '@/components/AppLayout';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Loader, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chat, ChatInput } from '@/ai/flows/chatbot';
import { Role } from 'genkit/model';
import { remark } from 'remark';
import html from 'remark-html';

type ChatMessage = {
    role: Role;
    text: string;
};

const processMarkdown = async (markdown: string) => {
    const result = await remark().use(html).process(markdown);
    return result.toString();
};

const MessageContent = ({ content }: { content: string }) => {
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        processMarkdown(content).then(setHtmlContent);
    }, [content]);

    return <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

const ChatbotPage = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const chatInput: ChatInput = {
                history: newMessages.map(msg => ({ role: msg.role, text: msg.text })),
            };
            const response = await chat(chatInput);

            const botMessage: ChatMessage = {
                role: response.role,
                text: response.text ?? '',
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage: ChatMessage = {
                role: 'model',
                text: 'Sorry, I encountered an error. Please try again.',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="flex flex-col h-[calc(100vh-8rem)]">
                <header className="mb-6 text-center">
                    <h1 className="text-4xl font-bold tracking-tight">AI Chatbot</h1>
                    <p className="text-lg text-muted-foreground mt-2">Your personal career assistant.</p>
                </header>
                <Card className="flex-1 flex flex-col shadow-xl rounded-2xl">
                    <CardContent ref={scrollAreaRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                                <Sparkles className="w-12 h-12 mb-4 text-primary"/>
                                <p className="text-lg">Ask me anything about job trends or career advice!</p>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={cn(
                                    'flex items-start gap-4',
                                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                                )}
                            >
                                {msg.role === 'model' && (
                                    <Avatar className="h-8 w-8 border-2 border-primary/50">
                                       <div className="h-full w-full flex items-center justify-center bg-primary/80">
                                            <Briefcase className="h-4 w-4 text-primary-foreground" />
                                       </div>
                                    </Avatar>
                                )}
                                <div
                                    className={cn(
                                        'max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl',
                                        msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-secondary rounded-bl-none'
                                    )}
                                >
                                     <MessageContent content={msg.text} />
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-4 justify-start">
                                <Avatar className="h-8 w-8 border-2 border-primary/50">
                                    <div className="h-full w-full flex items-center justify-center bg-primary/80">
                                        <Briefcase className="h-4 w-4 text-primary-foreground" />
                                    </div>
                                </Avatar>
                                <div className="max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl bg-secondary rounded-bl-none flex items-center">
                                    <Loader className="w-5 h-5 animate-spin" />
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <div className="p-4 border-t">
                        <form onSubmit={handleSubmit} className="flex items-center gap-2">
                            <Input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask about the job market..."
                                className="flex-1 h-12 text-base rounded-xl"
                                disabled={isLoading}
                            />
                            <Button type="submit" size="icon" className="h-12 w-12 rounded-xl" disabled={isLoading}>
                                <Send className="h-5 w-5" />
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
};

export default ChatbotPage;
