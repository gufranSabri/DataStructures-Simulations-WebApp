var heapInterval,swap=false,heapifyingValue=-Infinity, heapAnimSpeed=1000,leftSwap=false;

function updateViewPortHeap(){
    canvas.height=canvasHeight;
    canvas.width=parseInt($("#cDiv").css("width"));
    context.fillStyle=CANVAS_COLOR;
    context.fillRect(0,0,canvas.width,canvas.height);

    if(parseInt($("#cDiv").css("width"))<600){
        clearInterval(interval);
        alert("Screen width too small!!")
        location.href='/algorithms'
    }
    if(nodes.length==0){
        context.fillStyle="black";
        context.textAlign="center"; 
        context.textBaseline="middle"
        context.font="25px Arial";
        context.fillText("Heap is empty!!! Add to tree using the control panel.",canvas.width/2,canvas.height/2);
        context.stroke();
    }
    if(addNode){
        addNode=false;
        tempNode= new node(trialX,trialY,nodeValue,0)
        nodes.push(null);
        if(nodes.length==1)tempNode.level=1;
        else tempNode.level= nodes[parseInt((nodes.length-2)/2)].level+1;
        nodeIndex=nodes.length-1;
        addHeap();
    }
    if(delNode){
        if(nodes.length<=1)nodes=[];
        else {
            toggleAccess(true,"del");
            nodes[0].highlight=HIGHLIGHT;
            nodes[nodes.length-1].highlight=HIGHLIGHT;
            setTimeout(function(){
                var delledNode= nodes.pop();
                nodes[0].value=delledNode.value;
                nodes[0].highlight=IDLE;
                nodeIndex=0;
                heapInterval= setInterval(deleteHeapify,1000);
            },heapAnimSpeed)
        }
        delNode=false;
        
    }
    for(var i=0;i<nodes.length;i++)if(nodes[i]!=null)nodes[i].update(i);
    if(tempNode!=null)tempNode.update(-1);
}
function addHeap(){
    var parentIndex= nodeIndex==0?-1:parseInt((nodeIndex-1)/2);
    
    dir= (parentIndex*2)+1==nodeIndex?-1:1;
    if(parentIndex>=0)nodePosY=nodes[parentIndex].y+ yOffset;
    else nodePosY=yOffset;
    if(parentIndex>=0)nodePosX=nodes[parentIndex].x+ dir*socialDistancingX;
    else nodePosX=canvas.width/2;

    nodes[nodeIndex]=tempNode;
    tempNode=null;

    assignRoles();
    heapifyingValue=nodes[nodeIndex].value;
}
function addHeapify(){
    var parentIndex= parseInt((nodeIndex-1)/2);
    if(swap){
        swap=false;
        nodes[nodeIndex].highlight=IDLE;
        nodes[parentIndex].highlight=IDLE;

        var thv= nodes[parentIndex].value;
        nodes[parentIndex].value=nodes[nodeIndex].value;
        nodes[nodeIndex].value=thv;

        nodeIndex=parseInt((nodeIndex-1)/2);
    }
    else if(nodeIndex!=0&&((parseInt(nodes[parentIndex].value)<parseInt(heapifyingValue)&&topic.startsWith("max"))||(parseInt(nodes[parentIndex].value)>parseInt(heapifyingValue)&&topic.startsWith("min"))) ){
        swap=true;
        nodes[nodeIndex].highlight=TRAVERSING;
        nodes[parentIndex].highlight=HIGHLIGHT;
    }
    else {
        toggleAccess(false);
        clearInterval(heapInterval);

        //TEST ARR
        // if(testI<testArr.length){
        //     $("#t1").val(testArr[testI]);
        //     testI++;
        //     $("#add").click();
        // }
        //TEST ARR
    }
}
function deleteHeapify(){
    console.log(1);
    var heapifyingValue= parseInt(nodes[nodeIndex].value)
    var childIndex1= (2*nodeIndex)+1, childIndex1Val= childIndex1>=nodes.length?(topic.startsWith("max")?-Infinity:Infinity):parseInt(nodes[childIndex1].value);
    var childIndex2= (2*nodeIndex)+2, childIndex2Val= childIndex2>=nodes.length?(topic.startsWith("max")?-Infinity:Infinity):parseInt(nodes[childIndex2].value);

    if(swap){
        swap=false;
        nodes[nodeIndex].highlight=IDLE;
        nodes[leftSwap?childIndex1:childIndex2].highlight=IDLE;

        var thv= nodes[leftSwap?childIndex1:childIndex2].value;
        nodes[leftSwap?childIndex1:childIndex2].value=nodes[nodeIndex].value;
        nodes[nodeIndex].value=thv;

        nodeIndex=leftSwap?childIndex1:childIndex2
    }
    else if((topic.startsWith("max")&&(heapifyingValue<childIndex1Val||heapifyingValue<childIndex2Val))||(topic.startsWith("min")&&(heapifyingValue>childIndex1Val||heapifyingValue>childIndex2Val))){
        swap=true;
        if(topic.startsWith("min")){
            if(childIndex1Val>childIndex2Val)leftSwap=false;
            else leftSwap=true;
        }
        if(topic.startsWith("max")){
            if(childIndex1Val<childIndex2Val)leftSwap=false;
            else leftSwap=true;
        }
        nodes[nodeIndex].highlight=HIGHLIGHT;
        nodes[leftSwap?childIndex1:childIndex2].highlight=TRAVERSING;
    }
    else {
        toggleAccess(false);
        clearInterval(heapInterval);
    }
}