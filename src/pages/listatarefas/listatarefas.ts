import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,MenuController} from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the Listatarefas page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-listatarefas',
  templateUrl: 'listatarefas.html',
})
export class Listatarefas {
  tarefas: FirebaseListObservable<any[]>;
  key: string;
  objeto: FirebaseObjectObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public db: AngularFireDatabase) {
    this.tarefas = db.list('/tarefas');
    console.log(this.tarefas);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Listatarefas');
  }

  adicionarTarefa() {
    let prompt = this.alertCtrl.create({
      title: 'Tarefa',
      message: "Adicione os dados da sua tarefa",

      inputs: [
        {
          name: 'title',
          placeholder: 'Título'
        },
        {
          name: 'descricao',
          placeholder: 'Descrição'
        },
        {
          name: 'date',
          placeholder: 'data',
          type: 'date'
        },
        {
          name: 'hora',
          placeholder: 'hora',
          type: 'time'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Salvar',
          handler: data => {
            let acao = this.tarefas.push({
              title: data.title,
              descricao: data.descricao,
              datet: data.date,
              horat: data.hora,
              status: 'pendente'
            });

            acao.then(_ => this.exibirMensagem('Tarefa gravada com sucesso'))
              .catch(err => this.exibirMensagem(err));
          }
        }
      ]
    });
    prompt.present();
  }

  exibirMensagem(MSG) {
		/*let alert =*/ this.alertCtrl.create({
      message: MSG,
      buttons: ['OK']
    }).present();
  }

  excluirTarefa(keyTarefa) {
    let confirm = this.alertCtrl.create({
      title: 'Confirmação?',
      message: 'Confirma a exclusão da Tarefa?',
      buttons: [
        {
          text: 'Confirmar',
          handler: () => {
            let acao = this.tarefas.remove(keyTarefa);
            acao.then(_ => this.exibirMensagem('Tarefa excluida com sucesso'))
              .catch(err => this.exibirMensagem(err));
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }

  editarTarefa(keyTarefa: string) {
    console.log(keyTarefa);
    this.objeto = this.db.object('/tarefas/' + keyTarefa);
    this.objeto.subscribe(snapshot => {
      let prompt = this.alertCtrl.create({
        title: 'Tarefa',
        message: "Adicione os dados da sua tarefa",
        inputs: [
          {
            name: 'title',
            placeholder: 'Título',
            value: snapshot.title
          },
          {
            name: 'descricao',
            placeholder: 'Descrição',
            value: snapshot.descricao
          },
          {
            name: 'date',
            placeholder: 'data',
            type: 'date',
            value: snapshot.datet
          },
          {
            name: 'hora',
            placeholder: 'hora',
            type: 'time',
            value: snapshot.horat
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Salvar',
            handler: data => {
              //this.objeto.unsubscribe();
              let acao = this.tarefas.update(snapshot.$key, {
                title: data.title,
                descricao: data.descricao,
                datet: data.date,
                horat: data.hora,
                status: 'pendente'
              });

              acao.then(_ => this.exibirMensagem('Tarefa gravada com sucesso'))
                .catch(err => this.exibirMensagem(err));
            }
          }
        ]
      });
      prompt.present();
    }).unsubscribe();
  }

  finalizarTarefa(keyTarefa) {
    this.tarefas.update(keyTarefa, { status: "finalizado" });
  }

  filtrarTarefas() {
    let prompt = this.alertCtrl.create({
      title: 'Filtrar',
      message: "Escolha o filtro para suas tarefa",

      inputs: [
        {
          type: 'radio',
          label: 'Todos',
          value: 't',
          checked: true
        },
        {
          type: 'radio',
          label: 'Pendentes',
          value: 'p',
          checked: false
        },
        {
          type: 'radio',
          label: 'Finalizados',
          value: 'f',
          checked: false
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            switch (data) {
              case 't':
                this.tarefas = this.db.list('/tarefas');
                break;
              case 'f':
                this.tarefas = this.db.list('/tarefas', { query: { orderByChild: 'status', equalTo: 'finalizado', key: 'status' } });
                break;
              case 'p':
                this.tarefas = this.db.list('/tarefas', { query: { orderByChild: 'status', equalTo: 'pendente', key: 'status' } });
                break;
            }
          }
        }
      ]
    });
    prompt.present();
  }
}