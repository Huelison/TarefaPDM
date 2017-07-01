import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {Push} from "@ionic-native/push";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Listatarefas } from '../pages/listatarefas/listatarefas';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

export const config = {
    apiKey: "AIzaSyBsumrwHbL61fB94bVI28iLSALbt75MbcY",
    authDomain: "agenda-virtual.firebaseapp.com",
    databaseURL: "https://agenda-virtual.firebaseio.com",
    projectId: "agenda-virtual",
    storageBucket: "",
    messagingSenderId: "771045720299"
  };
  
@NgModule({
  declarations: [
    MyApp,
    HomePage,
	Listatarefas
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
	AngularFireModule.initializeApp(config),
	AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
	Listatarefas
  ],
  providers: [
    StatusBar,
	Push,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
