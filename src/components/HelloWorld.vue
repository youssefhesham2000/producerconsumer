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
             depressed
              elevation="8"
              large
              outlined  
            >
              initiate process
            </v-btn>
            <v-btn
             depressed
              elevation="8"
              large
              outlined
              @click="addNewQ()"
            >
              Add Q
            </v-btn>
            <v-btn
             depressed
              elevation="8"
              large
              outlined
              color=" secondary"
            >
              Done
            </v-btn>
            <v-btn
             depressed
              elevation="8"
              large
              outlined
                color=" primary"
            >
              Start simulation
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
      v-if="object.type=='q'"
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
            M{{ exisitmachine }}
          </v-btn>
          </v-list-item>
        </v-list>
        </v-menu>
       </v-btn-toggle>
      <p>
        n={{object.current}}
      </p>
       <v-btn 
        v-for="machine in Ms[object.num]" :key="machine.num"
       elevation="8"
        large
        :color= machine.color 
      >
        M{{machine.num}}
      </v-btn>
      
    </v-container>
  </v-app>
</div>
</template>

<script>
import Method from"./utils.js"
  export default {
    name: 'HelloWorld',
    QS:[],
    
    
    data: () => ({
  MCounter:0,
  lastQ:0,
   selectedQ:'',
   validMachines:[],
    validQs:[],
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
                  this.validMachines.push(this.Ms[l][f].num);
              }
            }

          
        }
       

      },
      addNewM(qNum,Qto){
        console.log(qNum);
        var newM={num:this.MCounter,color:'#32CD32',comeFrom:[qNum],connectsTo:Qto}
        this.Ms[qNum].push(newM);
        this.MCounter=this.MCounter+1;
         console.log(this.Ms);

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
            var IN=this.validMachines[i].comeFrom;
            IN.push(Qnum);
            var newM={num:Mnum,color:this.validMachines[i].color,comeFrom:IN,connectsTo:this.validMachines.connectsTo};
          this.Ms[Qnum].push(newM);
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
      }    
    

      
    }),
  }
</script>
