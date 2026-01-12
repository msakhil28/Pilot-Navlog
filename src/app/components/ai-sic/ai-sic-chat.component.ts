import { Component, signal, effect, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AiSicService } from '../../services/ai-sic.service';
import { ChatMessage } from '../../models/chat-message.model';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

@Component({
    selector: 'app-ai-sic-chat',
    imports: [CommonModule, FormsModule],
    templateUrl: './ai-sic-chat.component.html',
    styleUrls: ['./ai-sic-chat.component.scss']
})
export class AiSicChatComponent {
    @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

    messages = signal<ChatMessage[]>([
        {
            id: '1',
            content: 'Roger that! I\'m AI SIC, your Second In Command. I\'m here to help with any aviation questions, regulations, procedures, or flight planning needs. What can I assist you with today?',
            role: 'assistant',
            timestamp: new Date()
        }
    ]);

    userInput = signal<string>('');
    isLoading = signal<boolean>(false);
    copiedMessageId = signal<string | null>(null);

    constructor(
        private aiSicService: AiSicService,
        private sanitizer: DomSanitizer
    ) {
        // Configure marked with syntax highlighting
        marked.use(markedHighlight({
            langPrefix: 'hljs language-',
            highlight(code, lang) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            }
        }));

        // Configure marked options
        marked.setOptions({
            gfm: true, // GitHub Flavored Markdown
            breaks: true, // Convert \n to <br>
        });

        // Auto-scroll effect
        effect(() => {
            if (this.messages().length > 0) {
                setTimeout(() => this.scrollToBottom(), 100);
            }
        });
    }

    async sendMessage(): Promise<void> {
        const message = this.userInput().trim();

        if (!message || this.isLoading()) {
            return;
        }

        // Add user message
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            content: message,
            role: 'user',
            timestamp: new Date()
        };

        this.messages.update(msgs => [...msgs, userMessage]);
        this.userInput.set('');
        this.isLoading.set(true);

        try {
            // Get AI response
            const response = await this.aiSicService.sendMessage(message);

            // Add AI message
            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: response,
                role: 'assistant',
                timestamp: new Date()
            };

            this.messages.update(msgs => [...msgs, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);

            // Add error message
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: 'Sorry, I encountered an error. Please try again.',
                role: 'assistant',
                timestamp: new Date()
            };

            this.messages.update(msgs => [...msgs, errorMessage]);
        } finally {
            this.isLoading.set(false);
        }
    }

    clearChat(): void {
        this.aiSicService.clearHistory();
        this.messages.set([
            {
                id: '1',
                content: 'Roger that! I\'m AI SIC, your Second In Command. I\'m here to help with any aviation questions, regulations, procedures, or flight planning needs. What can I assist you with today?',
                role: 'assistant',
                timestamp: new Date()
            }
        ]);
    }

    handleKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    parseMarkdown(content: string): SafeHtml {
        const html = marked.parse(content) as string;
        return this.sanitizer.sanitize(1, html) || '';
    }

    async copyToClipboard(message: ChatMessage): Promise<void> {
        try {
            await navigator.clipboard.writeText(message.content);
            this.copiedMessageId.set(message.id);

            // Reset copied state after 2 seconds
            setTimeout(() => {
                this.copiedMessageId.set(null);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    }

    isCopied(messageId: string): boolean {
        return this.copiedMessageId() === messageId;
    }

    private scrollToBottom(): void {
        try {
            if (this.messagesContainer) {
                this.messagesContainer.nativeElement.scrollTop =
                    this.messagesContainer.nativeElement.scrollHeight;
            }
        } catch (err) {
            console.error('Error scrolling to bottom:', err);
        }
    }
}
