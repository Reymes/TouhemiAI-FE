import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  SpeechSynthesisUtteranceOptions,
  SPEECH_SYNTHESIS_VOICES,
} from '@ng-web-apis/speech';
import { FlaskRequestService } from '../services/flask-request.service';
import { VoiceRecognitionService } from '../services/voice-recognition.service';
import { TuiContextWithImplicit, tuiPure } from '@taiga-ui/cdk';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  CHATGPTIMAGE = 'https://openai.com/content/images/2022/05/openai-avatar.png';
  paused = true;
  voice: any = null;
  userInput: string = '';
  text = 'Hit play/pause to speak this text';
  messages = [
    {
      type: 'incoming',
      image: this.CHATGPTIMAGE,
      message: 'Hey there! Walcome to your lesson. How can I help you?',
      time: this.generateDate(),
    },
  ];

  readonly nameExtractor = ({
    $implicit,
  }: TuiContextWithImplicit<SpeechSynthesisVoice>) => $implicit.name;
  public searchForm!: FormGroup;
  public isUserSpeaking: boolean = false;
  constructor(
    private requestService: FlaskRequestService,
    private voiceRecognition: VoiceRecognitionService,
    private fb: FormBuilder,
    @Inject(SPEECH_SYNTHESIS_VOICES)
    readonly voices$: Observable<ReadonlyArray<SpeechSynthesisVoice>>
  ) {}
  ngOnInit(): void {
    this.initVoiceInput();
    this.searchForm = this.fb.group({
      searchText: ['', Validators.required],
    });
  }

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
    this.sendMessage();
    this.userInput = '';
    this.scrollToBottom();
  }

  sendMessage() {
    const message = this.convertToString(this.messages);

    this.requestService
      .post('chatgpt', { message })
      .subscribe((response: any) => {
        console.log(this.voice);

        this.text = response.response;
        this.paused = true;
        this.onClick();
        this.messages.push({
          type: 'incoming',
          image: this.CHATGPTIMAGE,
          message: response.response,
          time: this.generateDate(),
        });
        this.scrollToBottom();
      });
  }

  convertToString(conversation: any[]): string {
    let output =
      'Pretend you are a voicebot that helps people to learn new languages and you should correct their grammar \n';
    for (let i = 0; i < conversation.length; i++) {
      let message = conversation[i];
      if (message.type === 'incoming') {
        output += 'Bot: ' + message.message + '\n';
      } else if (message.type === 'outgoing') {
        output += 'User: ' + message.message + '\n';
      }
    }
    output += 'Bot: ';
    return output;
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

  /**
   * @description Function to stop recording.
   */
  stopRecording() {
    this.voiceRecognition.stop();
    this.sendUserInput();
    this.isUserSpeaking = false;
  }

  /**
   * @description Function for initializing voice input so user can chat with machine.
   */
  initVoiceInput() {
    // Subscription for initializing and this will call when user stopped speaking.
    this.voiceRecognition.init().subscribe(() => {
      // User has stopped recording
      // Do whatever when mic finished listening
    });

    // Subscription to detect user input from voice to text.
    this.voiceRecognition.speechInput().subscribe((input) => {
      // Set voice text output to
      if (this.isUserSpeaking) this.userInput = input;
    });
  }

  /**
   * @description Function to enable voice input.
   */
  startRecording() {
    this.isUserSpeaking = true;
    this.voiceRecognition.start();
    this.userInput = '';
  }

  onEnd() {
    console.log('Speech synthesis ended');
  }

  get options(): SpeechSynthesisUtteranceOptions {
    return this.getOptions(this.voice);
  }

  @tuiPure
  private getOptions(
    voice: SpeechSynthesisVoice | null
  ): SpeechSynthesisUtteranceOptions {
    return {
      lang: 'en-US',
      voice,
    };
  }

  onClick() {
    this.paused = !this.paused;
    // Re-trigger utterance pipe:
    this.text = this.paused ? this.text + ' ' : this.text;
  }

  voiceByName(_: number, { name }: SpeechSynthesisVoice): string {
    return name;
  }
}
