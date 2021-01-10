export default class Method{
    addnewMachine(Ms,qnum,counter){
        var index=Ms[qnum].length;
        var newM={num:counter,color:'#32CD32',connectsTo:[]}
        Ms[qnum][index]=newM;
        return Ms;
    
    }
}
