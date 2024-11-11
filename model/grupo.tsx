export class grupo{

    
        public idgrupo!:     string;
        public nome!:       string;
        public id!:         string;


        constructor(objGrupo?:Partial<grupo>){
            if(objGrupo){
                this.idgrupo    = objGrupo.idgrupo!;
                this.nome       = objGrupo.nome!;
                this.id         = objGrupo.id!;
            }
        }

}