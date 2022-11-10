var changingElements=false, swapped=false, theTopic, key=array[1];
function simpleSortPlayDirector(topic){
    theTopic=topic
    updatePointer([],[]);
    key=array[1];
    if(topic=="selection-sort"){
        info.innerHTML+="In selection sort, we find the smallest element then put put it at its proper place.<br>"+
        "So, we will use 3 variables :<br><b>i</b> will point at the index at which the next smallest element should be.<br>"+
        "<b>j</b> will go through every element after <b>i</b> to find the next smallest element.<br>" +
        "<b>min</b> will keep record of where the smallest element thus far is as <b>j</b> goes through the array.<br>";
    }
    else if(topic=="insertion-sort"){
        info.innerHTML+="The main idea in insertion sort is to essentially make room for a value we'll call <b>key</b>."+
        " With the help of <b>i</b>, we loop through the entire array one by one to select a <b>key</b> and put it into it's proper place."+
        " The variable <b>j</b> does the work of shifting all elements greater than the <b>key</b> in the range 0 - (i-1) to the right.<br>";
    }
    else {
        info.innerHTML+="Bubble sort is the most straightforward sorting algorithm. We take any value and 'bubble' it to its right place by "+
        "swapping adjacent elements if they're not in the right order. We continue this process until all elements are 'bubbled' to their rightful place."+
        "The bubbling run happens n-1 times where n is the length of the array. The variable <b>i</b> will keep record of that. <b>j</b> will do that actual bubbling."+
        " We will know the array is sorted if <b>j</b> moves from index 0 to index n - i - 1 and no swapping occurs.<br>"
    }
    highlightCodeRow(cvIndex=1);
    playSimpleSortSim(topic=="insertion-sort"?1:0,topic=="selection-sort"?1:0,topic=="selection-sort"?0:(topic=="insertion-sort"?1:-1))
}
function playSimpleSortSim(i,j,miscIndex){
    varsRecord= theTopic!="bubble-sort"?[i,j,miscIndex]:[i,j];
    var limit= (theTopic=="selection-sort"||theTopic=="bubble-sort")?array.length-1:array.length;
    if(i>=limit){
        playStarted=paused=false;
        document.getElementById("play").innerHTML="Play";
        document.getElementById("step").removeEventListener("click",pauseHelperSimpleSort);
        updateArray();
        info.innerHTML+="<br>The Array is sorted!<br>"
        info.innerHTML+="<br><button onclick='resetInfo()';}'>Reset</button><br>";
        messageBoard.scrollTo(0,100000);
        if(cvIndex!=0)highlightCodeRow(cvIndex=0);
    }
    else {
        if(!paused){
            updateInterval=theTopic!="bubble-sort"?setTimeout(function(){simpleSortSimUpdate([i,j,miscIndex])},simulationSpeed):setTimeout(function(){simpleSortSimUpdate([i,j])},simulationSpeed);
            document.getElementById("step").removeEventListener("click",pauseHelperSimpleSort);
        }
    }
}
function simpleSortSimUpdate(vars){
    var indices,pointers;
    if(changingElements){
        updateArray();
        changingElements=false;
        playSimpleSortSim(vars[0],vars[1],vars[2]);
    }
    else{
        info.innerHTML+="<br><u><b>Step "+ step++ +":</b></u><br>"
        if(vars.length==3){
            info.innerHTML+=(vars.length==3?(theTopic=="selection-sort"?"<b>min</b> is pointing to index "+vars[2]:"The current <b>key</b> is "+key)+"<br>":"");
            indices= [vars[theTopic=="selection-sort"?1:0],vars[2],vars[theTopic=="selection-sort"?0:1]]; 
            pointers=[theTopic=="selection-sort"?"j":"i",theTopic=="selection-sort"?"min":"ki",theTopic=="selection-sort"?"i":"j"];
            if(theTopic=="insertion-sort")indices[1]=-1;
        }
        else{
            if(vars[0]>vars[1]){indices= [vars[0],vars[1]];pointers=["i","j"];}
            else{indices= [vars[1],vars[0]];pointers=["j","i"];}
        }
        if(theTopic=="selection-sort"){// selection sort
            if(cvIndex!=1)highlightCodeRow(cvIndex=1);
            if(array[vars[2]]>array[vars[1]]){
                info.innerHTML+="<br>New smallest element found at "+ vars[1]+"."+ " <b>min</b>"+" will now point at " + vars[1]+"<br>"
                indices[1]=vars[2] = vars[1];
            }
            if(vars[1]==array.length-1){
                if(cvIndex!=2)highlightCodeRow(cvIndex=2);
                info.innerHTML+="<br>Swapping element at <b>i</b> with element at <b>min</b><br>"
                var temp = array[vars[2]];
                array[vars[2]]=array[vars[0]];
                array[vars[0]]=temp;
                vars[1]=++vars[0]+1;
                vars[2]=vars[0];
                changingElements=true;
            }
            playSimpleSortSim(vars[0],changingElements?vars[1]:++vars[1],vars[2]);
        }
        if(theTopic=="insertion-sort"){ //insertion sort
            if(vars[1]>=0&&array[vars[1]]>key){
                array[vars[1]+1]=array[vars[1]--];
                info.innerHTML+="<br>Element at <b>j</b> is greater than the key so we shift it one place to the right to make room for key.<br>"
            }
            else{
                array[vars[1]+1]=key;
                vars[2]=vars[0]++;
                key=array[vars[0]];
                vars[1]=vars[0]-1;
                info.innerHTML+="<br>Putting <b>key</b> in its proper place, that is the index <b>j+1</b><br>"
            }
            changingElements=true;
            playSimpleSortSim(vars[0],vars[1],vars[2]);
        }
        if(theTopic=="bubble-sort"){ //bubble sort
            if(array[vars[1]]>array[vars[1]+1]){
                var temp= array[vars[1]];
                array[vars[1]]=array[vars[1]+1];
                array[vars[1]+1]=temp;
                changingElements=swapped=true;
            }
            if(vars[1]==array.length-vars[0]-1){
                if(!changingElements)playSimpleSortSim(swapped?++vars[0]:10,0,vars[2]);
                swapped=false;
            }
            else playSimpleSortSim(vars[0],++vars[1],vars[2]);
            info.innerHTML+= changingElements?"Swapping element at <b>j</b> with element at <b>j+1</b><br>":(vars[1]!=array.length-vars[0]-1?"No swapping.<br>":"");
        }
        if(changingElements&&theTopic!="insertion-sort")highlightCodeRow(cvIndex=2);
        else highlightCodeRow(cvIndex=1);
        updatePointer(indices,pointers);
        messageBoard.scrollTo(0,1000000);
    }   
}
function pauseHelperSimpleSort(){if(playStarted)simpleSortSimUpdate(varsRecord);}