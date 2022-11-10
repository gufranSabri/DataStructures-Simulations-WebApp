function searchSimPlayDirector(num,topic){
    updatePointer([],[]);
    if(topic=="linear-search"){
        info.innerHTML+="In linear search, we sequentially look at each element in the array until we find our element.<br>"+
        "So, we will use a for loop with variable <b>i</b>.  <b>i</b> will point to the element we are currently looking at.<br>" 
        playSearchSim(0,-1,-1,num);
    }
    else if(topic=="binary-search"){
        array.sort(function(a,b){return a-b;});
        updateArray();
        info.innerHTML+="<br><br>First we will sort the array.<br><br>We will use 3 variables &rarr; <b>Low</b>, <b>Mid</b>, <b>High</b>. At the beginning <b>Low</b> points to the index 0 and "+
        "<b>High</b> points to the last element in the array. <b>Mid</b> will point to the index (Low + High + 1)/2.<br>"+
        "We will then check if the element being at by <b>Mid</b> is equal to our target. If it is, then we can stop the search. "+
        "Otherwise, we will update our 3 variables in the following way. If the target is smaller than the element at <b>Mid</b>, then we will update our "+
        "<b>High</b> to <b>Mid</b> - 1. If the target is larger than the element at <b>Mid</b>, then we will update our <b>Low</b> to <b>Mid</b> + 1.<br>"+
        "We will then update our <b>Mid</b> to (Low + High + 1)/2<br>In this way, we will have removed the half of the array that will not have our target element.<br>"+
        "This will repeat until either we find our element or we are certain that it doesn't exist.<br>";
        messageBoard.scrollTo(0,100000);
        playSearchSim(-1,0,array.length-1,num);
    }
    highlightCodeRow(cvIndex=1);
}
function playSearchSim(i,low,high,num){
    varsRecord = i==-1?[low,parseInt(low+high+1)/2,high,num]:[i,num];
    if((i!=-1&&(i==array.length&&index==-1))||(low>high&&index==-1)){
        paused=playStarted=false;
        document.getElementById("target").value=""
        document.getElementById("play").innerHTML="Play";
        document.getElementById("step").removeEventListener("click",pauseHelperSearch);
        info.innerHTML+="<br>The target element was not found!<br>"
        info.innerHTML+="<br><button onclick='resetInfo()';}'>Reset</button>";
        highlightCodeRow(cvIndex=0);
        updateArray(true);
        messageBoard.scrollTo(0,100000);
    }
    else if(index==-1){
        if(!paused){
            updateInterval=  i==-1?setTimeout(function(){searchSimUpdate([low,parseInt(low+high+1)/2,high,num])},simulationSpeed):setTimeout(function(){searchSimUpdate([i,num])},simulationSpeed);
            document.getElementById("step").removeEventListener("click",pauseHelperSearch);
        }
    }
}
function searchSimUpdate(vars){
    var indices,pointers,checkIndex;
    info.innerHTML+="<br><u><b>Step "+ step++ +":</b></u><br>"
    for (let or = 8; or >-1 ; or--)if(or>vars[2]||or<vars[0])outRecursed.push(or);
    updateArray(true);
    if(vars.length==2){
        indices= [vars[0]]; 
        pointers=["i"];
        checkIndex=vars[0];
    }
    else{
        vars[1]= parseInt((vars[0]+vars[2]+1)/2);
        checkIndex= vars[1];
        indices= [vars[2],vars[1],vars[0]]; 
        pointers=["high","mid","low"];
    }
    if(vars[vars.length-1]==array[checkIndex]){
        index=checkIndex;
        info.style.color="green";
        updateArray(true);
        info.innerHTML+="We've found the target element the index "+checkIndex+"!!"+"<br>";
        info.innerHTML+="<br><button onclick='resetInfo()';}'>Reset</button>";
        document.getElementById("play").innerHTML="Play";
        document.getElementById("step").removeEventListener("click",pauseHelperSearch);
        playStarted=paused=false; 
    }
    else{
        info.style.color="red";
        info.innerHTML+="The element at index "+ checkIndex +" is not equal to our target. Let's keep moving!<br>";
        if(vars.length!=2){
            if(vars[3]>array[vars[1]])vars[0]=vars[1]+1;
            else vars[2]=vars[1]-1;
        }
    }
    updatePointer(indices,pointers);
    messageBoard.scrollTo(0,100000);
    if(vars.length==2)playSearchSim(++vars[0],-1,-1,vars[1]);
    else playSearchSim(-1,vars[0],vars[2],vars[3]);
}
function pauseHelperSearch(){if(playStarted)searchSimUpdate(varsRecord);}