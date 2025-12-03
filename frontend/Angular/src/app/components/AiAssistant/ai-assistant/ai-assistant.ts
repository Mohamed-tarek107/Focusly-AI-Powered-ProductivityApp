import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { AiService } from '../../../services/Ai/ai-service';

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
export class AiAssistant {
  currentUser = 'User';
  userInput = '';
  messages: Message[] = [];
  isTyping = false;

  constructor(private ai: AiService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    const messageText = this.userInput;
    
    this.messages.push({ 
      role: 'user',
      text: messageText
    });

    this.userInput = '';
    this.AiResponse(messageText);
  }

  AiResponse(messageText: string) {
    this.isTyping = true;

    const historytosend = this.messages.slice(0,-1)
    this.ai.chat(messageText, historytosend).subscribe({
      next: (res: any) => {
        setTimeout(() => {
          this.messages.push({
            role: 'model',
            text: res.message
          });
          this.isTyping = false;
        }, 1000);
      },
      error: (err: any) => {
        console.error('AI Error:', err);
        this.messages.push({
          role: 'model',
          text: 'Sorry, I encountered an error. Please try again.'
        });
        this.isTyping = false;
      }
    });
  }

  clearChat() {
    if (confirm('Clear all messages?')) {
      this.messages = [];
    }
  }

  handleEnter(event: KeyboardEvent) {
    // KeyboardEvent has `key` and `shiftKey`, so this is safe when typed as KeyboardEvent
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}


