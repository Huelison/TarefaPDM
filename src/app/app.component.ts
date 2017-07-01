import { Component } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from "@ionic-native/push";

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public push: Push,
    public alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      if (!platform.is('cordova')) {
        console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      } else {
        this.initPushNotification();
      }
    });
  }
  
  initPushNotification() {

    const options: PushOptions = {
      android: {
        senderID: "771045720299",
        topics: ["todos"]
      },
      ios: {
        alert: "true",
        badge: false,
        sound: "true",
        topics: ["todos"]
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log("device token ->", data.registrationId);
      //TODO - send device token to server
      pushObject.subscribe("todos");
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message', data.message);
      console.log('data', data);
      //if user using app and push notification comes

      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: data.title,
          message: '<b>' + data.message + '</b>' + data.additionalData.data_hora,
          buttons: [{
            text: 'Cancelar',
            role: 'cancel'
          }, {
            text: 'Ver',
            handler: () => {
              //TODO: Your logic here
              console.log(data.message)
              //this.nav.push(DetailsPage, {message: data.message});
            }
          }]
        });
        confirmAlert.present();
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        //this.nav.push(DetailsPage, {message: data.message});
        console.log(data.message);
        console.log("Push notification clicked");
      }
    });

    pushObject.on('error').subscribe(error => console.log(error));
  }
}

