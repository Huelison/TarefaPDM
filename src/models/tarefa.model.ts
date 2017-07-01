export class Tarefa {

    public $key: string;

    constructor(
        public lastMessage: string,
        public timestamp: any,
        public title: string,
        public photo: string
    ) {}
	
    setTitle(title){
        this.title = title;
    }
	
	getTitle(){
		return this.title;
	}
}