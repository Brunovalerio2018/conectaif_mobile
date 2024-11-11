export class estudante{

        public idestudante!:    string;
        public nome!:           string;
        public email!:          string;
        public senha!:          string;
        public nascimento!:     string;

        constructor(obj?: Partial<estudante>){
            if(obj){
                this.idestudante = obj.idestudante!;
                this.nome        = obj.nome!;
                this.email       = obj.email!;
                this.senha       = obj.senha!;
                this.nascimento  = obj.nascimento!;

            }
        }
        toString(){
            const objeto = `{
                "idestudante": "${this.idestudante}",
                "nome": "${this.nome}",
                "email": "${this.email}",
                "senha": "${this.senha}",
                "datanasc": "${this.nascimento}"
            }`;
            return objeto;
        }

};    