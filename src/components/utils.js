export default class Method{
    
    startSimulation(){
        //   var flag=true;
         var myvar;
             if(this.objects[this.lastQ-1].current!=this.numOfProducts){
             myvar= setInterval(function(){
   
                 console.log("before fetch"); 
                  return fetch("http://localhost:8080/getFrame",
           {
              method:'post',
               headers: { "Content-Type": "application/json",
               'Accept': 'application/json'
               },
           }
           ).then(response=> response.json())
           .then(body=>{
             console.log("we are here");
             console.log(body);
             for(var i =0;i<body[0].length;i++){
               this.objects[i].current=body[0][i];
             }
             for(var j=0;j<body[1].length;j++){
               for(var l=0;l<this.Ms.length;l++){
                 for(var k=0;k<this.Ms[l].length;l++){
                   if(this.Ms[l][k].num==j){
                     if(this.Ms[l][k].color!=body[1][j]&&this.Ms[l][k].color!='#32CD32'){
                       this.machineFlash(j);
                     }
                     else if(this.Ms[l][k].color!=body[1][j]){
                       this.Ms[l][k].color=body[1][j];
                     }
                   }
                 }
               }
             }    
           })
       //this code runs every second 
   }, 1000);
      }
             // setTimeout(() => { console.log("before fetch");this.getData(); }, 1);
             if(this.objects[this.lastQ-1].current==this.numOfProducts){
                clearInterval(myvar);
              // flag=false;
               this.resetReady=true;
             }
         
         }
}
