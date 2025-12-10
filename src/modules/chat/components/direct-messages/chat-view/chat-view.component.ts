import { NgForOf } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../../../../../services/core/firestore.service';
import { ChatMessage } from '../../../interfaces/chat-message/chat-message.interface';

@Component({
  selector: 'app-chat-view',
  imports: [NgForOf],
  styleUrls: ['./chat-view.component.scss'],
  template: `
    <!-- Botão para carregar histórico (você pode disparar via scroll topo) -->
    <button (click)="loadMore()" [disabled]="loadingMore">Carregar mais</button>

    <!-- Histórico (páginas antigas) -->
    <ng-container *ngFor="let msg of history; trackBy: trackById">
      <div class="message">{{ render(msg) }}</div>
    </ng-container>

    <!-- Timeline ao vivo (últimas N) -->
    <ng-container *ngFor="let msg of live; trackBy: trackById">
      <div class="message live">{{ render(msg) }}</div>
    </ng-container>
  `,
  standalone: true,
})
export class ChatViewComponent implements OnInit, OnDestroy {
  private readonly fs = inject(FirestoreService);

  roomId = 'general';          // defina via rota, input, etc.
  pageSize = 50;

  // Estado
  live: ChatMessage[] = [];    // mensagens ao vivo (N últimas)
  history: ChatMessage[] = []; // páginas antigas concatenadas
  lastDoc: any = null;         // referência do fim da última página antiga
  loadingMore = false;

  private sub?: Subscription;

  ngOnInit() {
    // 1) Timeline ao vivo (N últimas)
    this.sub = this.fs.listenLiveMessages(this.roomId, this.pageSize)
      .subscribe(msgs => {
        this.live = msgs; // substitui a janela ao vivo
      });

    // 2) Primeira página de histórico (opcional)
    this.fs.listMessages(this.roomId, { limit: this.pageSize })
      .subscribe(({ messages, lastDoc }) => {
        // Atenção: listMessages usa 'desc'. Você pode inverter se quiser mostrar "de baixo para cima".
        this.history = messages; // concatene acima da live
        this.lastDoc = lastDoc;
      });
  }

  async loadMore() {
    if (this.loadingMore || !this.lastDoc) return;
    this.loadingMore = true;
    try {
      const { messages: next, lastDoc } =
        await this.fs.loadNextPage(this.roomId, this.lastDoc, { limit: this.pageSize });

      if (next.length > 0) {
        this.history = [...this.history, ...next];
        this.lastDoc = lastDoc; // ✅ atualiza para próxima página
      }
    } finally {
      this.loadingMore = false;
    }
  }

  trackById(_: number, msg: ChatMessage) { return msg.id; }
  render(msg: ChatMessage) { return msg.type === 'text' ? msg.text : `[${msg.type}]`; }

  ngOnDestroy() { this.sub?.unsubscribe(); }
}
