import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'chat-dev-23012',
        appId: '1:64494564931:web:9490eac40fe3d37e1b06f6',
        storageBucket: 'chat-dev-23012.firebasestorage.app',
        apiKey: 'AIzaSyAj6Y64G4uMODiQr9TBp_IgZkguB9ushHI',
        authDomain: 'chat-dev-23012.firebaseapp.com',
        messagingSenderId: '64494564931',
        measurementId: 'G-0XSGWXPCGY',
        // projectNumber: '64494564931',
        // version: '2',
      }),
    ),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
  ],
};
