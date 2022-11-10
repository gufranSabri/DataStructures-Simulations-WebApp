var yOffset=50,xOffset=50,cellW=40,cellH=40, arrayLength=5, frontI, backJ;
var allArrays=[], subArrayIndex=0, partitionFound=false, iTurn=false, jTurn=false;
var swap=false, didI=false,didJ=false;
var simSpeed=1000, simInterval, startedTemp=false,playStarted=false;


function canvasSetupSort(){
    canvas= document.getElementById("cvs");
    context= canvas.getContext("2d");
    interval=setInterval(updateViewPortSort,frameRate);

    while(cellW*arrayLength>parseInt($("#cDiv").css("width"))-100)arrayLength--;

    allArrays.push({arr:nodes,pei:null,draw:true,parent:null})
    generateRandomArray()
}
function updateViewPortSort(){
    canvas.height=canvasHeight;
    canvas.width=parseInt($("#cDiv").css("width"));
    context.fillStyle=CANVAS_COLOR;
    context.fillRect(0,0,canvas.width,canvas.height);

    drawArray()
    if(playStarted&&!startedTemp)sort();
}

function sort(){
    startedTemp=true;
    if(topic=="quick-sort"){
        iTurn=true;
        partitionFound=didI=didJ=jTurn=swap=false;
        simInterval=setInterval(quickSort,simSpeed);
    }
}

function quickSort(){
    if(allArrays[subArrayIndex].pei==null){
        
        frontI=allArrays[subArrayIndex].pei= 0
        backJ=allArrays[subArrayIndex].arr.length
        iTurn=true;
        partitionFound=jTurn=didI=didJ=swap=false;
    }
    if(!partitionFound)partition()
}

function partition(){
    console.log("lmao")
    if(allArrays[subArrayIndex].arr.length==0){
        return;
    }

    console.log(allArrays[subArrayIndex])
    
    

    allArrays[subArrayIndex].arr[allArrays[subArrayIndex].pei].color=HIGHLIGHT
    pivot = allArrays[subArrayIndex].arr[allArrays[subArrayIndex].pei].val

    console.log(pivot)

    ret=false

    if(iTurn){
        if(!didI){
            frontI++;
            didI=true;
        }
        else if(frontI<backJ&&allArrays[subArrayIndex].arr[frontI].val<=pivot){
            frontI++;
        }
        else{
            iTurn=false;
            jTurn=true;
        }
        ret=true;
        if(allArrays.length!=1){
            // console.log(allArrays[1].arr);
        }
    }
    if(!ret&&jTurn){
        if(!didJ){
            backJ--;
            didJ=true;
        }
        else if(allArrays[subArrayIndex].arr[backJ].val>pivot){
            backJ--;
        }
        else {
            jTurn=false;
            if(frontI<backJ)swap=true;
        }
        ret=true;
    }

    if(frontI>=backJ)swap=true

    if(!ret){
        if(!swap)swap=true
        else {
            temp = allArrays[subArrayIndex].arr[frontI<backJ?frontI:0]
            allArrays[subArrayIndex].arr[frontI<backJ?frontI:0]=allArrays[subArrayIndex].arr[backJ]
            allArrays[subArrayIndex].arr[backJ]=temp
            swap=false

            if(frontI<backJ)iTurn=true;
            else{
                allArrays[subArrayIndex].pei=backJ;
                allArrays[subArrayIndex].arr[0].color=IDLE;
                qsPartitionFoundProcedure()
            }
        }
    }
    if(allArrays.length!=1){
        // console.log(allArrays[1].arr,"s");
    }
}

function qsPartitionFoundProcedure(){
    tempLen = allArrays.length

    partitionFound=true;



    allArrays.push({arr:[],pei:null,draw:false,parent:subArrayIndex,startInParent:0})
    for (let i = 0; i < backJ; i++) {
        allArrays[allArrays.length-1].arr.push({
            val:allArrays[subArrayIndex].arr[i].val,
            color: IDLE,
        })
    }
    if(allArrays[allArrays.length-1].arr.length<2)console.log("popping "+ allArrays.pop())

    allArrays.push({arr:[],pei:null,draw:false,parent:subArrayIndex,startInParent:backJ+1})
    for (let i = backJ+1; i < allArrays[subArrayIndex].arr.length; i++) {
        allArrays[allArrays.length-1].arr.push({
            val:allArrays[subArrayIndex].arr[i].val,
            color: IDLE
        })
    }
    if(allArrays[allArrays.length-1].arr.length<2)console.log("popping "+ allArrays.pop())

    
    if(tempLen!=allArrays.length)subArrayIndex = allArrays.length - (allArrays.length-tempLen<2?1:2)
    else{
        parentInd = allArrays[subArrayIndex].parent

        ///// STOPPED HERE
        // MERGE SUBARRAYS INTO MAIN ARRAY. DELETE THAT SUBARRAY
        while(allArrays[allArrays.length-1].parent == parentInd){
            startInd = allArrays[subArrayIndex].startInParent
            for (let i = 0; i < allArrays[subArrayIndex].arr.length; i++) allArrays[allArrays[subArrayIndex].parent].arr[startInd++] = allArrays[subArrayIndex].arr[i]
            allArrays = allArrays.slice(0,subArrayIndex).concat(allArrays.slice(subArrayIndex+1))
        }
        ///// STOPPED HERE
        
    }
    
    
    console.log(subArrayIndex)
    allArrays[subArrayIndex].draw = true
    
}



function drawArray(){
    tempYOffset=yOffset
    for (let i = 0; i < allArrays.length; i++) {
        if(!allArrays[i].draw)continue
        // tempXOffset = ((arrayLength - allArrays[i].arr.length)+1)*cellW
        context.rect(xOffset,tempYOffset,cellW*allArrays[i].arr.length,cellH)

        for (let j = 1; j <=allArrays[i].arr.length; j++) {
            context.fillStyle=allArrays[i].arr[j-1].color
            context.fillRect(xOffset+((j-1)*cellW),tempYOffset,cellW,cellH)
    
            context.moveTo(xOffset+cellW*j,tempYOffset);
            if(j!=arrayLength)context.lineTo(xOffset+cellW*j,tempYOffset+cellH);
    
            context.fillStyle = "black";
            context.font="15px Arial";
            context.textBaseline="middle";
            context.textAlign="center"; 
            context.fillText(allArrays[i].arr[j-1].val,(xOffset+cellW*j)-cellW/2,tempYOffset+cellH/2);
        }
        tempYOffset+=yOffset*2
    }
    context.stroke()
    if(!partitionFound&&playStarted){
        drawIndices("i",(xOffset+cellW*(frontI+1))-cellW/2,(subArrayIndex*yOffset*2)+110)
        drawIndices("j",(xOffset+cellW*(backJ+1))-cellW/2,(subArrayIndex*yOffset*2)+110)
    }
}


function generateRandomArray(){
    for (let i = 0; i < arrayLength; i++) {
        nodes[i]={
            val:Math.floor(Math.random() * 101),
            color: IDLE
        }
    }
}

function drawIndices(label,labelX,labelY){
    context.fillStyle = "black";
    context.font="17px Arial";
    context.textBaseline="middle";
    context.textAlign="center"; 
    context.fillText(label,labelX,labelY);
}
