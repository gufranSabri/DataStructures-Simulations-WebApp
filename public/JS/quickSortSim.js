var changingElements=false,partitionFound=false,partitionFoundPre=false, newSub=false, stack=[];
function quickSortPlayDirector(){
    info.innerHTML+="To keep things simple we will choose the first element in the subarray as the partition element.<br> We now want "+
    "to put all the elements smaller than the partition element behind it and the greater elements in front of it.<br><b>i</b> which "+
    "starts at the first element in the subarray, will be incremented until we find an element greater than the partition element. "+
    "&nbsp&nbsp<b>j</b>, which starts at the last element in the sub array will be decremented until we find an element smaller than partition element. "+
    "We then swap the elements at <b>i</b> and <b>j</b>. This process continues while <b>i</b> < <b>j</b>.<br> Once <b>j</b> becomes "+
    "smaller than <b>i</b>, we swap the element at <b>j</b> and the partition element. The partition element is now in its proper place and "+
    " all the elements greater and smaller than the partition element are on the correct side of partition element.<br>"+ 
    "We then repeat this process recursively on either side of the parition element.<br>"
    // updatePointer([],[]);
    updatePointer([array.length,0,0], ["j","i","pe"]);
    stack.push({"low":0,"high":array.length});
    quickSort();
}
function quickSort(){
    varsRecord= [];
    partitionFoundPre=partitionFound=false;
    if(!stack.length==0){
        highlightCodeRow(cvIndex=1);
        var popped= stack.pop();
        updateArray();
        if(popped.low<popped.high){
            newSub=true;
            partition(popped.low,popped.high,array[popped.low],popped.low,popped.high);
            for (let or = 8; or >-1 ; or--) if(or>popped.high||or<popped.low)outRecursed.push(or);
            updateArray(true);
            info.innerHTML+="<br><b>Low</b> of current subarray is at "+popped.low+ "<br>";
            info.innerHTML+="<b>High</b> of current subarray is at "+popped.high+ "<br>";
            info.innerHTML+="<b>Everything that is outside our current subarray has been faded.</b><br>"
            messageBoard.scrollTo(0,1000000);
            if(!changingElements)highlightCodeRow(cvIndex=1);
        }
        else {
            clearInterval(updateInterval);
            quickSort();
        }
    }
    else{
        highlightCodeRow(cvIndex=0);
        partitionFound=playStarted=paused=false;
        document.getElementById("play").innerHTML="Play";
        document.getElementById("step").removeEventListener("click",pauseHelperQuickSort);
        info.innerHTML+="<br>The Array is sorted!<br>"
        info.innerHTML+="<br><button onclick='resetInfo()';}'>Reset</button>";
        updateArray(true);
        messageBoard.scrollTo(0,100000);
        updateArray(false);
    }
}
function partition(i,j,pivot,low,high){
    if(!changingElements)highlightCodeRow(cvIndex=2);
    else highlightCodeRow(cvIndex=3);
    varsRecord = [i,j,pivot,low,high];
    if(!partitionFound){
        if(!paused){
            updateInterval=setTimeout(function(){partitionUpdate([i,j,pivot,low,high])},simulationSpeed);
            document.getElementById("step").removeEventListener("click",pauseHelperQuickSort);
        }
    }
    else {
        clearInterval(updateInterval);
        quickSort();
    }
}
function partitionUpdate(vars){
    if(newSub){
        newSub=false;
        highlightCodeRow(cvIndex=2)
        info.innerHTML+="<br>First step when we have a new subarray is to find the rightful position of the partition element.<br>";
        info.innerHTML+="<br>The parition element value is <b>"+vars[2]+ "</b> which is at index <b>"+ vars[0]+"</b><br>"
        // partition(vars[0],vars[1],vars[2],vars[3],vars[4]);
    }
    else if(changingElements){
        updateArray(false);
        changingElements=false;
        if(partitionFoundPre)partitionFound=true;
    }
    else{
        highlightCodeRow(cvIndex=1);
        info.innerHTML+="<br><u><b>Step "+ step++ +":</b></u><br>";
        if(vars[0]<vars[1]){
            do{vars[0]++;}while(vars[0]<vars[1]&&  array[vars[0]]<=vars[2])
            do{vars[1]--;}while(array[vars[1]]>vars[2])
            if(vars[0]<vars[1]&&array[vars[0]]>=vars[2])info.innerHTML+="<br>Element larger than partition element found at index <b>i</b>.";
            else info.innerHTML+="<br>No element larger than partition element found by <b>i</b>.";
            if(vars[0]<vars[1]&&array[vars[1]]<vars[2])info.innerHTML+="<br>Element smaller than partition element found at index <b>j</b>.<br>";
            else info.innerHTML+="<br>No element smaller than partition element found by <b>j</b>.<br>";
            if(vars[0]<vars[1]){
                info.innerHTML+="<br>Swapping elements at <b>i</b> and <b>j</b>.<br>"
                swap(vars[0],vars[1]);
            }
            info.innerHTML+="<b>i</b> is pointing to "+ vars[0] +"<br>";
            info.innerHTML+="<b>j</b> is pointing to "+ vars[1] +"<br>";
        }
        else {
            if(vars[1]!=vars[3])info.innerHTML+="<br>Putting partition element in its proper place by swapping elements at index <b>j</b> and index <b>"+vars[3] +"</b>.<br>";
            else info.innerHTML+="<br>Partition element already in its correct place.<br>";
            partitionFoundPre=true;
            swap(vars[1],vars[3]);
            stack.push({"low":vars[1]+1,"high":vars[4]})
            stack.push({"low":vars[3],"high":vars[1]});
        }
    }
    updatePointer([vars[0]<vars[1]?vars[1]:vars[0],vars[0]<vars[1]?vars[0]:vars[1],vars[3]] , [vars[0]<vars[1]?"j":"i",vars[0]<vars[1]?"i":"j","pe"]);
    messageBoard.scrollTo(0,1000000);
    partition(vars[0],vars[1],vars[2],vars[3],vars[4]);
}
function pauseHelperQuickSort(){if(playStarted)partitionUpdate(varsRecord);}
function swap(i,j){
    var temp = array[i];
    array[i]=array[j];
    array[j]=temp;
    changingElements=true;
}