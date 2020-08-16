export default class Observer{
    constructor(data){
        this.observe(data);
    }
    observe(data){
        /*
        {
            name:'',
            person:'',
            info:{

            }
        }
        */
        if(data&&typeof data=='object'){
            console.log(object.keys(data))
        }
    }
}