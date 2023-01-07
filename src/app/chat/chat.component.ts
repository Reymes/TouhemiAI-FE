import { Component, OnInit } from '@angular/core';
import { FlaskRequestService } from '../services/flask_request.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  CHATGPTIMAGE = 'https://openai.com/content/images/2022/05/openai-avatar.png';
  userInput: string = '';
  messages = [
    {
      type: 'incoming',
      image: this.CHATGPTIMAGE,
      message: 'Hey there! I am TouhemiAI. Ask me anything!',
      time: this.generateDate(),
    },
  ];
  constructor(private requestService: FlaskRequestService) {}
  ngOnInit(): void {}

  sendUserInput() {
    if (!this.userInput) {
      return;
    }
    this.messages.push({
      type: 'outgoing',
      image: '',
      message: this.userInput,
      time: this.generateDate(),
    });
    this.sendMessage(this.userInput);
    this.userInput = '';
    this.scrollToBottom();
  }

  sendMessage(message: string) {
    this.requestService
      .post('chatgpt', { message })
      .subscribe((response: any) => {
        this.messages.push({
          type: 'incoming',
          image: this.CHATGPTIMAGE,
          message: response.response,
          time: this.generateDate(),
        });
        this.scrollToBottom();
      });
  }

  generateDate() {
    let date = new Date();
    let hours = date.getHours();
    let minutes: any = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime + ' | Today';
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatContainer: any = document.getElementById('chat-container');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
  }
}
