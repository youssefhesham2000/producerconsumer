<template>
<div id="app">
  <v-app id="inspire">
    <v-card
      flat
      class="py-12"
    >
      <v-card-text>
        <v-row
          align="center"
          justify="center"
        >
          <v-col cols="12">
            <p class="text-center">
              producer/Consumer
            </p>
          </v-col>
          <v-btn-toggle
            v-model="toggle_exclusive"
            rounded
          >
            <v-btn
              v-show="!initiated"
             depressed
              elevation="8"
              large
              outlined  
              @click="initiateP()"
            >
              initiate process
            </v-btn>
            <v-btn
            v-show="initiated&&!finishQ"
             depressed
              elevation="8"
              large
              outlined
              @click="addNewQ()"
            >
              Add Q
            </v-btn>
             <v-btn
            v-if="initiated"
             depressed
              elevation="8"
              large
              outlined
              @click="finishNewQ()"
            >
              finish adding Qs
            </v-btn>
            <v-btn
            v-if="finishQ&&!resetReady&&!ready"
             depressed
              elevation="8"
              large
              outlined
              color=" secondary"
              @click="Done()"
            >
              Done
            </v-btn>
            <v-btn
            v-show="ready&&!resetReady"
             depressed
              elevation="8"
              large
              outlined
                color=" primary"
                @click="startSimulation(objects,lastQ,numOfProducts,Ms,indexI,indexJ ,resetReady)"
            >
              Start simulation
            </v-btn>
            <v-btn
            v-show="ready"
             depressed
              elevation="8"
              large
              outlined
                color=" primary"
                @click="startOperation()"
            >
              Start operation
            </v-btn>

             <v-btn
            v-show="resetReady&&!restartReady"
             depressed
              elevation="8"
              large
              outlined
                color=" primary"
                @click="resimulate()"
            >
              reset Data
            </v-btn>
             <v-btn
            v-show="showReSim"
             depressed
              elevation="8"
              large
              outlined
                color=" primary"
                @click="startSimulation(objects,lastQ,numOfProducts,Ms,indexI,indexJ ,resetReady)"
            >
               Resimulate
            </v-btn>
              <v-btn
            v-show="resetReady&&!restartReady"
             depressed
              elevation="8"
              large
              outlined
                color=" primary"
                @click="newSimulate()"
            >
              new Simulation
            </v-btn>
            
             <v-text-field
              v-model="numOfProducts"
              label="Enter number of products"
              clearable
            ></v-text-field>
              <v-btn
             depressed
              elevation="8"
              large
              outlined
                color=" primary"
                @click="getNumberOfProducts()"
            >
              Enter
            </v-btn>
          </v-btn-toggle>
        </v-row>
      </v-card-text>
    </v-card>
    <v-container v-for="object in objects" :key="object.type" >
       <v-btn-toggle
            v-model="toggle_exclusive"
          >
      <v-btn 
       elevation="8"
        outlined
        large
        color=#00008B
      >
        Q{{object.num}}
      </v-btn>
       <v-menu>
        <template v-slot:activator="{ on, attrs }">
         <v-btn 
            v-show="finishQ&&object.num!=lastQ-1&&!ready"
       elevation="8"
        outlined
        large
           v-bind="attrs"
            v-on="on"
        color=#00008B
        @click="ValidQ(object.num)"
      >
      Add new M
      </v-btn>
        </template>
       <v-list>
          <v-list-item v-for="(exisitQ,num) in validQs" :key="num">
           <v-btn
            depressed
            elevation="8"
            outlined
            large
            v-bind="attrs"
            v-on="on"
            @click="addNewM(object.num,exisitQ)"
          >
            Q{{ exisitQ }}
          </v-btn>
          </v-list-item>
        </v-list>
        </v-menu>
       
       <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
             v-show="finishQ&&object.num!=lastQ-1&&!ready"
            depressed
            elevation="10"
            outlined
            rounded
            small
            v-bind="attrs"
            v-on="on"
            v-model="selectedQ"
            @click="modifyValidMachine(object.num)"
          >
            Connect  to an exisit machine
          </v-btn>
        </template>
       <v-list>
          <v-list-item v-for="(exisitmachine,num) in validMachines" :key="num">
           <v-btn
            depressed
            elevation="8"
            outlined
            large
            v-bind="attrs"
            v-on="on"
            @click="addMachine(exisitmachine.num,object.num)"
          >
            M{{ exisitmachine.num }}
          </v-btn>
          </v-list-item>
        </v-list>
        </v-menu>
       </v-btn-toggle>
      <p>
        n={{object.current}}
      </p>
 <v-btn-toggle  v-for="machine in Ms[object.num]" :key="machine.num">
       <v-btn 
       
       elevation="8"
        large
        :color= machine.color
      >
        M{{machine.num}}
      </v-btn>
      <p>
        attached to Q{{machine.connectsTo}}
      </p>
       </v-btn-toggle>
      
    </v-container>
  </v-app>
</div>
</template>

<script>
import Method from"./utils.js"
  export default {
    name: 'HelloWorld',
   
    data: () => ({
      nEntered:false,
       ready:false,
       finishQ:false,
      initiated:false,
      checkingAccuracy:[],
      numOfProducts:'',
      resetReady:false, 
     restartReady:false,         
  MCounter:0,
  lastQ:0,
   selectedQ:'',
   validMachines:[],
    validQs:[],
    indexI:[],
    indexJ:[],
    ReturnedToBack:[],
    showReSim:false,
   Ms:[
      
     /* [
        {
        num:0,
        color:'#32CD32',
        connectsTo:[1],
      },
       {
        num:1,
        color:'#32CD32',
        connectsTo:[1],
      },
      
      ],
        [
        {
        num:2,
        color:'#32CD32',
        connectsTo:[2],
      },
       {
        num:3,
        color:'#32CD32',
        connectsTo:[],
      },
      ]*/    
    []],
   objects:[

      /*{type:'q',
      num:0,
      current:5,
      },
      {type:'q',
      num:1,
      current:5
      }*/
    ],
    newSimulate(){
       this.Ms=[];
       this.objects=[];
        this.nEntered=false;
       this.ready=false;
       this.finishQ=false;
      this.initiated=false;
      this.checkingAccuracy=[];
      this.numOfProducts='';
      this.resetReady=false; 
     this.restartReady=false;         
  this.MCounter=0;
  this.lastQ=0;
   this.selectedQ='';
       this.validMachines=[];
        this.validQs=[];
        this.indexI=[];
        this.indexJ=[];
        this.ReturnedToBack=[];
        this.showReSim=false;
       return fetch("http://localhost:8080/newSimulation",
        {
           method:'post',
            headers: { "Content-Type": "application/json",
            'Accept': 'application/json'
            },
         }
       
        )
         

    },
    methods:new Method(),
    modifyValidMachine(num){
      this.validMachines=[];
      //validation
      console.log(num);
       
          var notValidM=[];
          var qs=[];
          qs.push(num);
          while(qs.length!=0){
          var returned=this.getConnectedMs(qs);
          qs=returned[1];
          for(var k=0;k<returned[0].length;k++){
            notValidM.push(returned[0][k]);
          }
          }
            for(var i=0;i<this.Ms[num].length;i++){
               notValidM.push(this.Ms[num][i].num);
          }
          for(var l=0;l<this.Ms.length;l++){
            for(var f=0;f<this.Ms[l].length;f++){
              if(!notValidM.includes(this.Ms[l][f].num)&&!this.validMachines.includes(this.Ms[l][f].num)){
                  this.validMachines.push(this.Ms[l][f]);
              }
            }

          
        }
      },
      addNewM(qNum,Qto){
        console.log(qNum);
        var CF=[];
        CF.push(qNum);
        var newM={num:this.MCounter,color:'#32CD32',comeFrom:CF,connectsTo:Qto}
        this.Ms[qNum].push(newM);
        this.MCounter=this.MCounter+1;
         console.log(this.Ms);
         if(this.checkingAccuracy.length==0){
           this.checkingAccuracy.push(qNum);
           this.checkingAccuracy.push(Qto);
         }
         else if(!this.checkingAccuracy.includes(qNum)){
            this.checkingAccuracy.push(qNum);
         }
         else if(!this.checkingAccuracy.includes(Qto)){
            this.checkingAccuracy.push(Qto);
         }

      },
      addNewQ(){
        var newq={type:'q',num:this.lastQ,current:0};
        this.objects.push(newq)
        var empty=[];
        this.Ms.push(empty);
        console.log(this.Ms);
        this.lastQ++;
        console.log(this.lastQ);
      },
      addMachine(Mnum,Qnum){
        for(var i=0;i<this.validMachines.length;i++){
          if(this.validMachines[i].num==Mnum){
            var IN=[];
            console.log(this.validMachines);
            for( var j=0;j<this.validMachines[i].comeFrom.length;j++){
              IN.push(this.validMachines[i].comeFrom[i]);
            }
            IN.push(Qnum);
            var newM={num:Mnum,color:this.validMachines[i].color,comeFrom:IN,connectsTo:this.validMachines.connectsTo};
          this.Ms[Qnum].push(newM);
           console.log(this.Ms);
          }
        }
      },
      ValidQ(Qnum){
        var notValid=[];
         notValid.push(Qnum);
         var qs=[];
         qs.push(Qnum);
         while(qs.length!=0){
         qs=this.getConnectedM(qs)
         for(var i=0;i<qs.length;i++){
            notValid.push(qs[i]);
         }
         console.log(qs);
         }
                  console.log(notValid);
       this.validQs=[];
       for(var j=0;j<this.objects.length;j++){
           if(!notValid.includes(this.objects[j].num)){
             this.validQs.push(this.objects[j].num);
           }
           console.log(this.validQs);
         }
        


        
        
      },
      getConnectedM(Qnums){
        var Q=[];
        for(var x=0;x<Qnums.length;x++){
          for(var i=0;i<this.Ms.length;i++){
            for(var j=0;j<this.Ms[i].length;j++){
          if(this.Ms[i][j].connectsTo==Qnums[x]){
              for(var f=0;f<this.Ms[i][j].comeFrom.length;f++){
                    Q.push(this.Ms[i][j].comeFrom[f]);
              }
            }
          }
        }
        }
        return Q;
      },
       getConnectedMs(Qnums){
        var M=[];
         var Q=[];
        for(var x=0;x<Qnums.length;x++){
          for(var i=0;i<this.Ms.length;i++){
            for(var j=0;j<this.Ms[i].length;j++){
          if(this.Ms[i][j].connectsTo==Qnums[x]){
            M.push(this.Ms[i][j].num);
              for(var f=0;f<this.Ms[i][j].comeFrom.length;f++){
                    Q.push(this.Ms[i][j].comeFrom[f]);
              }
            }
          }
        }
        }
        var returned=[M,Q];
        return returned;
      },
      machineFlash(Mnum){
        this.indexI=[];
        this.indexJ=[];
        for(var i=0;i<this.Ms.length;i++){
          for(var j=0;j<this.Ms[i].length;j++){
            if(this.Ms[i][j].num==Mnum){
              this.Ms[i][j].color='#FF0000';
              this.indexI.push(i);
              this.indexJ.push(j);
            }
          }
        }
        console.log(this.indexI);
        console.log(this.indexJ);
        
        for(var k=0;k<this.indexI.length;k++){
          setTimeout(() => { this.cahngeColor(this.Ms[this.indexI.pop()][this.indexJ.pop()],'#32CD32'); }, 500);
        }
      },
      cahngeColor(M,color){
        M.color=color;
      },
      initiateP(){
        this.addNewQ();
        this.addNewQ();
        this.initiated=true;
      },
      finishNewQ(){
        this.finishQ=true;
      },    
      Done(){
        if(this.checkingAccuracy.length!=this.lastQ){
          alert("invalid process");
          console.log(this.checkingAccuracy.length)
           console.log(this.lastQ)
        }
        else if(!this.nEntered){
          alert("enter n  ");
        }
        else{
 this.ready=true;
        //call fetch
        this.sendData();

        }
       
      },
      getNumberOfProducts(){
        var pattern = /^[1-9]\d*$/;
        if(this.numOfProducts.match(pattern)){
        console.log(  "worked"); 
        this.nEntered=true; 
        }
        console.log(  this.numOfProducts);
      },
      sendData(){
         this.getDataReady();
        /*const controller = new AbortController();
        const signal = controller.signal;
          setTimeout(() => controller.abort(), 5000);*/
         
        return fetch("http://localhost:8080/done",
        {
         
           method:'post',
            headers: { "Content-Type": "application/json",
            'Accept': 'application/json'
            },
           
             body: JSON.stringify({n_items:this.ReturnedToBack[0],n_machines:this.ReturnedToBack[1],n_queues:this.ReturnedToBack[2],queues_machines:this.ReturnedToBack[3],machines_queues:this.ReturnedToBack[4]}),
         }
       
        )
      },
       test(){
        this.getDataReady();
        return fetch("http://localhost:8080/test",
        {
           method:'post',
            headers: { "Content-Type": "application/json",
            'Accept': 'application/json'
            },
            body: JSON.stringify({n_items:this.ReturnedToBack[0],n_machines:this.ReturnedToBack[1],n_queues:this.ReturnedToBack[2],queues_machines:this.ReturnedToBack[3],machines_queues:this.ReturnedToBack[4]}),
         }
       
        ).then(response=> response.json())
        .then(body=>{
          console.log(body);
        })
      },
       startOperation(){
        return fetch("http://localhost:8080/operate",
        {
           method:'post',
            headers: { "Content-Type": "application/json",
            
            },
         }
       
        )
      },
      







      startSimulation(objects,lastQ,numOfProducts,Ms,indexI,indexJ,resetReady ){
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
         
          
          for(var i =0;i<body[0].length;i++){
           
            objects[i].current=body[0][i];
          }
          for(var j=0;j<body[1].length;j++){
            for(var l=0;l<Ms.length;l++){
              for(var k=0;k<Ms[l].length;k++){
                if(Ms[l][k].num==j){
                  console.log("the color is");
                   console.log(body[1][j]);
                  if(Ms[l][k].color!=body[1][j]&&Ms[l][k].color!='#32CD32'){
                    //machineFlash(j);
                          indexI=[];
                        indexJ=[];
                        for( var r=0;r<Ms.length;r++){
                          for( var z=0;z<Ms[r].length;z++){
                              if(Ms[r][z].num==j){
                                    Ms[r][z].color='#FF0000';
                                    indexI.push(r);
                                    indexJ.push(z);
                        }
                        }
                        }
                             console.log(indexI);
                       console.log(indexJ);
        
                            for( var m=0;m<indexI.length;m++){
                                       setTimeout(() => { Ms[indexI.pop()][indexJ.pop()].color='#32CD32'; }, 500,Ms,indexI,indexJ);
                                         console.log("the color is in the flash of item");
                            }
                  }
                  else if(Ms[l][k].color!=(body[1][j])){
                    Ms[l][k].color=body[1][j];
                    console.log("the color is in the enter of item");
                   console.log(Ms[l][k].color);
                  }
                }
              }
            }
          }
           if(objects[lastQ-1].current==numOfProducts){
             clearInterval(myvar);
           // flag=false;
            resetReady=true;
          }
          console.log(Ms);
               console.log(objects);
        })
    //this code runs every second 
},1000,objects,lastQ,numOfProducts,Ms,indexI,indexJ,resetReady );
   }
   this.resetReady=true;

          // setTimeout(() => { console.log("before fetch");this.getData(); }, 1);
     
      
      },
      getDataReady(){
        var returned=[];
        var n_items=this.numOfProducts;
        var n_machines=this.MCounter;
        var n_queues=this.lastQ;
        var queues_machines=[];
         var machines_queues=[];
        var mNum=0;
        for(var i=0;i<this.Ms.length;i++){
          for(var j=0;j<this.Ms[i].length;j++){
            if(this.Ms[i][j].num==mNum){
              queues_machines.push(this.Ms[i][j].comeFrom);
              machines_queues.push(this.Ms[i][j].connectsTo);
              mNum++;
            }
          }
        }
        returned.push(n_items);
         returned.push(n_machines);
          returned.push(n_queues);
           returned.push(queues_machines);
            returned.push(machines_queues);
            
            this.ReturnedToBack=returned;
        console.log(this.ReturnedToBack);
      },
      resimulate(){
        this.showReSim=true;
         return fetch("http://localhost:8080/reSimulate",
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
      },
      

    }),
  
     
  }  
</script>
