import { AfterContentChecked, AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../navbar/navbar';
import { CommonModule } from '@angular/common';

interface Message {
  role: 'user' | 'model';
  text: string;
}

@Component({
  selector: 'app-ai-assistant',
  imports: [CommonModule, Navbar,FormsModule],
  templateUrl: './ai-assistant.html',
  styleUrl: './ai-assistant.css'
})
export class AiAssistant{
  currentUser = 'User';
  userInput = '';
  messages: Message[] = [];
  isTyping = false;

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user message
    this.messages.push({
      role: 'user',
      text: this.userInput
    });

    this.userInput = '';
    
    // TODO: Call your AI service here
    // For now, just simulate response
    this.mockAiResponse();
  }

  mockAiResponse() {
    this.isTyping = true;
    
    setTimeout(() => {
      this.messages.push({
        role: 'model',
        text: 'Hello! I am your AI assistant Tarek Tarek Tarek Tarek v Tarek v Tarek v vTarekvvTarek v TarekTarekTarekTarekTarekTarek v Tarek v v v Tarek Tarek v v v v Tarek v Tarek v Tarek Tarek v v v v v v v v TarekvTarek v Tarek TarekTarek. Connect me to the backend to start chatting!'
      });
      this.isTyping = false;
    }, 1000);
  }

  clearChat() {
    if (confirm('Clear all messages?')) {
      this.messages = [];
    }
  }

  handleEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}

