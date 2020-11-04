import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { ChatI } from './interfaces/ChatI';
import { MessageI } from './interfaces/MessageI';
import {MatDialog} from '@angular/material/dialog';
import { AgregarContactoComponent } from '../modales/agregar-contacto/agregar-contacto.component';
import { UsuariosService } from '../../../shared/services/usuarios.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  subscriptionList: {
    connection: Subscription,
    msgs: Subscription
  } = {
      connection: undefined,
      msgs: undefined
  };

  chats: Array<ChatI> = [
    {
      title: "Santi",
      icon: "/assets/img/ppRightBar.png",
      isRead: true,
      msgPreview: "entonces ando usando fotos reales hahaha",
      lastMsg: "11:13",
      msgs: [
        {content: "Lorem ipsum dolor amet",chatUid:'XXX', isRead:true, isMe:true, time:"7:24"},
        {content: "Qué?",chatUid:'XXX', isRead:true, isMe:false, time:"7:25"},
      ]
    },
    {
      title: "Pablo Bejarano",
      icon: "/assets/img/ppInbox.png",
      isRead: true,
      msgPreview: "Estrenando componente",
      lastMsg: "18:30",
      msgs: []
    },
    {
      title: "Pablo Bejarano 2",
      icon: "/assets/img/ppInbox.png",
      isRead: true,
      msgPreview: "Nice front 😎",
      lastMsg: "23:30",
      msgs: []
    },
  ];

  currentChat = {
    title: "",
    icon: "",
    msgs: []
  };

  constructor(
    public authService: AuthService,
     public chatService: ChatService,
     public dialog: MatDialog,
     public _users:UsuariosService
     ) {}

  ngOnInit(): void {
    this.initChat();
    this._users.getChatsList(this.authService.currentUid);
  }

  ngOnDestroy(): void {
    this.destroySubscriptionList();
    this.chatService.disconnect();
  }

  initChat() {
    if (this.chats.length > 0) {
      this.currentChat.title = this.chats[0].title;
      this.currentChat.icon = this.chats[0].icon;
      this.currentChat.msgs = this.chats[0].msgs;
    }
    this.currentChat.msgs = this._users.getChatsListEstrucutured();
    this.subscriptionList.connection = this.chatService.connect().subscribe(_ => {
      console.log("Nos conectamos");
      this.subscriptionList.msgs = this.chatService.getNewMsgs().subscribe((msg: MessageI) => {
        msg.isMe = this.currentChat.title === msg.owner ? true : false;
        console.log("Mensaje a array");
        this.currentChat.msgs.push(msg);
         console.log( this.currentChat.msgs);
      });
    });
  }

  onSelectInbox(chatUid) {
    console.log(chatUid);
    this._users.chatUid = chatUid;
    console.log(this._users.chats);
    // this.currentChat.title = this.chats[index].title;
    //   this.currentChat.icon = this.chats[index].icon;
    //   this.currentChat.msgs = this.chats[index].msgs;
  }

  doLogout() {
    this.authService.logout();
  }

  destroySubscriptionList(exceptList: string[] = []): void {
    for (const key of Object.keys(this.subscriptionList)) {
      if (this.subscriptionList[key] && exceptList.indexOf(key) === -1) {
        this.subscriptionList[key].unsubscribe();
      }
    }
  }

  dropdown_inventado(){
    console.log("El bichoo")    
  }

  openModal(modalId){
    document.getElementById(modalId).classList.toggle("is-active");
  }

  openDropDown(DropDownId){
    document.getElementById(DropDownId).classList.toggle("is-active");
    // document.getElementById(DropDownId).classList.toggle("animate__zoomIn");
  }

  openDialog() {
    this.dialog.open(AgregarContactoComponent);
  }

}
