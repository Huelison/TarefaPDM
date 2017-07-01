import { Component } from '@angular/core';
import { AlertController, Platform, NavController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Listatarefas } from '../listatarefas/listatarefas';
import { Push, PushObject, PushOptions } from "@ionic-native/push";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tarefas: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, db: AngularFireDatabase, public push: Push,
    public alertCtrl: AlertController) {
    this.tarefas = db.list('/tarefas');
    console.log(this.tarefas);
  }

  abrirTarefasLista() {
    this.navCtrl.push(Listatarefas);
    console.log("teste");
  }

  abrirTarefasLista2() {
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
    });

    pushObject.subscribe("todos1")
      .then(_ => console.log('Tarefa excluida com sucesso'))
      .catch(err => console.log(err));

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message', data.message);
      console.log('data', data);

      if (data.additionalData.foreground) {
        let confirmAlert = this.alertCtrl.create({
          title: data.title,
          message: '<b>' + data.message + '</b>' + data.additionalData.data_hora,
          buttons: [{
            text: 'Cancelar',
            role: 'cancel'
          }, {
            text: 'Ver',
            handler: () => {
              console.log(data.message)
              //this.nav.push(DetailsPage, {message: data.message});
            }
          }]
        });
        confirmAlert.present();
      } else {
        console.log(data.message);
        console.log("Push notification clicked");
      }
    });
    pushObject.on('error').subscribe(error => console.log(error));
  }
}
