import React, { useState, useRef, KeyboardEvent } from 'react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}


const ChatWindow: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage: Message = {
            id: messages.length + 1,
            text: input.trim(),
            sender: 'user',
        };
        setMessages([...messages, userMessage]);
        setInput('');
        setLoading(true);


        try {
            const response = await fetch('http://127.0.0.1:5000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.text }),
            });
            const data = await response.json();
            const aiMessage: Message = {
                id: messages.length + 2,
                text: data.reply,
                sender: 'ai',
            };
            setMessages(msgs => [...msgs, aiMessage]);
        } catch (error) {
            setMessages(msgs => [
                ...msgs,
                {
                    id: messages.length + 2,
                    text: 'Sorry, there was an error contacting the AI.',
                    sender: 'ai',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages" ref={messagesContainerRef}>
                {messages.map((msg) => (
                    <div className="message-row" key={msg.id}>
                        <div className={msg.sender === 'user' ? 'message-user' : 'message-ai'}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message-row">
                        <div className="message-ai">AI is typing...</div>
                    </div>
                )}
            </div>
            <div className="chat-input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    disabled={loading}
                />
                <button onClick={handleSend} disabled={loading}>Enter</button>
            </div>
        </div>
    );

};

export default ChatWindow;
