import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { AiService } from '../../../services/Ai/ai-service';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface Message {
  role: 'user' | 'model';
  text: string;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, Navbar, FormsModule],
  templateUrl: './ai-assistant.html',
  styleUrls: ['./ai-assistant.css']
})
export class AiAssistant implements OnInit {
  currentUser = 'User';
  userInput = '';
  messages: Message[] = [];
  isTyping = false;

  constructor(private ai: AiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(){
    const saved = sessionStorage.getItem('chatHistory');
  if (saved) {
    this.messages = JSON.parse(saved);
  }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const messageText = this.userInput;
    
    this.messages.push({ 
      role: 'user',
      text: messageText
    });

    this.userInput = '';
    this.saveToSession();
    this.AiResponse(messageText);
    this.cdr.detectChanges();
  }

  AiResponse(messageText: string) {
    this.isTyping = true;

    const historytosend = this.messages.slice(0,-1)
    this.ai.chat(messageText, historytosend).subscribe({
      next: (res: any) => {
        this.messages.push({
            role: 'model',
            text: res.message
          });
          this.isTyping = false;
          this.saveToSession()
          this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('AI Error:', err);
        this.messages.push({
          role: 'model',
          text: 'Sorry, I encountered an error. Please try again.'
        });
        this.isTyping = false;
        this.saveToSession()
      }
    });
  }

  clearChat() {
    if (confirm('Clear all messages?')) {
      this.messages = [];
      sessionStorage.removeItem('chatHistory')
    }
  }

  handleEnter(event: KeyboardEvent) {
    // KeyboardEvent has `key` and `shiftKey`, so this is safe when typed as KeyboardEvent
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }


  formatMarkdown(md: string): string | Promise<string> {
  const dirty = marked.parse(md, { breaks: true });
  if (typeof dirty === 'string') {
    return DOMPurify.sanitize(dirty);
  } else {
    return dirty.then((d: string) => DOMPurify.sanitize(d));
  }
}

saveToSession() {
  sessionStorage.setItem('chatHistory', JSON.stringify(this.messages));
  }
}


