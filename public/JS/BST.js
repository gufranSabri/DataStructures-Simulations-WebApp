var radius=17, yOffset=50, trialX=100,trialY=50,socialDistancingX=30,levels=0,space=40; 
var tempNode,prevNodeIndex=0,nodeIndex=0,nodePosX,nodePosY,dir=1,testI=0,delInterval;;
// var testArr=[1024,512,1536,256,768,1280,1792,128,384,640,896,1152,1408,1664,1920,64,192,320,448,576,704,832,960,1088,1216,1344,1472,1600,1728,1856,1984];
var testArr=[61, 96, 86, 63, 94, 36, 33, 98, 78, 90, 1, 12, 22, 37, 76, 6, 69, 15, 14, 84, 11, 10, 17, 57, 39, 16, 60, 42, 3, 34, 30, 59, 88, 91, 53, 50, 52, 65, 75, 73, 43, 46, 66, 55, 7, 77, 9, 48, 5, 70, 8, 68, 19, 31, 32, 87, 100, 45, 95, 18, 72, 21, 64, 49, 35, 25, 74, 82, 85, 93, 40, 13, 20, 54, 58, 89, 38, 81, 71, 2, 97, 47, 26, 79, 28, 27, 83, 29, 51, 56, 80, 62, 44, 41, 24, 4, 67, 23, 99, 92]
// var testArr=[642, 266, 474, 624, 942, 832, 863, 801, 656, 312, 7, 80, 901, 934, 205, 411, 445, 706, 703, 446, 110, 183, 565, 907, 566, 541, 658, 2, 767, 382, 81, 238, 262, 178, 78, 978, 551, 298, 890, 359, 292, 787, 997, 435, 141, 630, 891, 616, 776, 834, 813, 135, 334, 557, 681, 219, 113, 555, 216, 615, 900, 933, 426, 794]

function canvasSetupBST(){
    canvas= document.getElementById("cvs");
    context= canvas.getContext("2d");
    if(topic.endsWith("tree"))interval=setInterval(updateViewPort,frameRate);
    else interval=setInterval(updateViewPortHeap,frameRate);

    $("#left").click(function(){moveMap(1)});
    $("#up").click(function(){moveMap(2)});
    $("#right").click(function(){moveMap(3)});
    $("#down").click(function(){moveMap(4)});
    $("#center").click(function(){centerNodes()});

    //TEST ARR
    // $("#t1").val(testArr[testI]);
    // testI++;
    // $("#add").click();
    //TEST ARR
}
function updateViewPort(){
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
        context.fillText("Tree is empty!!! Add to tree using the control panel.",canvas.width/2,canvas.height/2);
        context.stroke();
    }
    if(addNode){
        addNode=false;
        if(!nodes.includes(null)){
            for (let i = 0; i < 2**levels; i++)nodes.push(null);
            levels++;
        }
        tempNode= new node(trialX,trialY,nodeValue,0)
        interval= setInterval(addThatNodeBaby,trialRate)
    }
    if(delNode){
        delNode=false;
        var theI=-1;
        for(var i=0;i<nodes.length;i++){
            if(nodes[i]==null)continue;
            if(nodes[i].value==nodeValue){
                nodes[i].highlight=HIGHLIGHT;
                theI=i;
                break;
            }
        }
        if(theI!=-1)setTimeout(function(){deleteThatNodeBaby(theI)},trialRate)
        else toggleAccess(false)
    }
    if(findNode){
        findNode=false;
        findThatNodeBaby();
    }
    for(var i=0;i<nodes.length;i++){if(nodes[i]!=null)nodes[i].update(i);}
    if(tempNode!=null)tempNode.update(-1);
}
function node(x,y,v,l){
    this.x=x;
    this.y=y;
    this.value=v;
    this.left=null;
    this.right=null;
    this.parent=null;
    this.index=-1;
    this.move=true;
    this.level=l;
    this.highlight=IDLE;

    this.update =function(i){
        context.strokeStyle="black";
        context.fillStyle=this.highlight;
        context.arc(this.x,this.y,radius,0,2*Math.PI);
        context.fill();

        context.fillStyle="black";
        context.textAlign="center"; 
        context.textBaseline="middle"
        context.font="13px Arial";
        context.fillText(this.value,this.x,this.y);
        context.stroke();

        if(i>0){
            var pDir;
            context.beginPath()
            var parentIndex= parseInt((i-1)/2);

            if(!topic.endsWith("heap"))pDir = parseInt(nodes[parentIndex].value)>parseInt(this.value)?-1:1
            else pDir= (parentIndex*2)+1==i?-1:1;

            context.moveTo(this.x,this.y-radius);
            context.lineTo(nodes[parentIndex].x+(15*pDir),nodes[parentIndex].y+10);

            context.stroke()
            context.beginPath()
        }
        if(this.move&&i!=-1){
            if(this.x>nodePosX)this.x-=5;
            else if(this.x<nodePosX)this.x+=5;

            if(this.y>nodePosY)this.y-=5;
            else if(this.y<nodePosY)this.y+=5;

            if(Math.abs(this.x-nodePosX)<5&&Math.abs(this.y-nodePosY)<5){
                if(this.x!=nodePosX)this.x+=(nodePosX-this.x);
                if(this.y!=nodePosY)this.y+=(nodePosY-this.y);
                if(!topic.endsWith("heap"))toggleAccess(false);
                else heapInterval= setInterval(addHeapify,heapAnimSpeed)
                this.move=false
                fixSpacings(true);
                //TEST ARR
                // if(testI<testArr.length){
                //     $("#t1").val(testArr[testI]);
                //     testI++;
                //     $("#add").click();
                // }
                //TEST ARR
            }
        }
        context.beginPath()
    }
}
function addThatNodeBaby(){
    if(nodes[nodeIndex]==null){
        var parentIndex= nodeIndex==0?-1:parseInt((nodeIndex-1)/2);
        tempNode.level++;
        
        if(parentIndex>=0)nodePosY=nodes[parentIndex].y+ yOffset;
        else nodePosY=yOffset;
        if(parentIndex>=0)nodePosX=nodes[parentIndex].x+ dir*socialDistancingX;
        else nodePosX=canvas.width/2;

        nodes[nodeIndex]=tempNode;
        nodeIndex=prevNodeIndex=0;

        tempNode=null;
        assignRoles();
        clearInterval(interval);
    }
    else{
        tempNode.level++;
        nodes[prevNodeIndex].highlight=IDLE;
        nodes[prevNodeIndex=nodeIndex].highlight=TRAVERSING;
        if(parseInt(nodes[nodeIndex].value)>nodeValue){
            dir=-1;
            nodeIndex= 2*nodeIndex +1;
        }
        else{
            dir=1;
            nodeIndex= 2*nodeIndex +2;
        }
        if(nodeIndex>nodes.length){
            for (let i = 0; i < 2**levels; i++)nodes.push(null);
            levels++;
        }
    }
}
function fixSpacings(added){
    for (let i = 0; i < nodes.length; i++) {
        if(nodes[i]==null)continue;
        for (let j = 0; j < nodes.length; j++) {
            if(nodes[j]==null||nodes[i].index==nodes[j].index||nodes[i].level!=nodes[j].level)continue;            
            if(nodes[i].x-radius<=nodes[j].x+radius&&nodes[i].index>nodes[j].index){
                move(-1,i,j);
                if(!added)break;
                else fixSpacings(true);
            }
        }
    }
    for (let i = 0; i < nodes.length; i++)if(nodes[i]!=null)nodes[i].highlight=IDLE;
}
function move(dd,i,j){
    var commonJuncture=0,a1,a2;
    while(a1==undefined&&a2==undefined){
        if(!topic.endsWith("heap")){
            var iVal=parseInt(nodes[i].value),jVal=parseInt(nodes[j].value),cVal=parseInt(nodes[commonJuncture].value)
            if((iVal<cVal&&jVal>=cVal)||(jVal<cVal&&iVal>=cVal)){
                a1=2*commonJuncture+1;
                a2=2*commonJuncture+2;
            }
            else if(iVal<cVal)commonJuncture=2*commonJuncture+1;
            else commonJuncture=2*commonJuncture+2;
        }
        else{
            while(i!=j){
                i=parseInt((i-1)/2);
                j=parseInt((j-1)/2);
            }
            a1=(2*i)+1;
            a2=(2*i)+2;
        }
    }
    for (let lmao = 0; lmao < 2; lmao++) {
        var queue=[dd==-1?a1:a2];
        while(queue.length!=0) {
            var idx= queue.pop();
            if(idx>nodes.length-1||nodes[idx]==null)continue;
            nodes[idx].x+=space*dd;
            queue.push((2*idx)+1);
            queue.push((2*idx)+2);
        }
        dd=1;
    }
}
function deleteThatNodeBaby(i){
    if((2*i+1>nodes.length-1)||(nodes[2*i+1]==null&&nodes[2*i+2]==null)){
        nodes[i]=null;
        toggleAccess(false);
        assignRoles();
    }
    else if(nodes[2*i+1]!=null&&nodes[2*i+2]!=null){
        nodeIndex=prevNodeIndex=2*i+2;
        delInterval = setInterval(function(){
            if(nodeIndex<nodes.length&&nodes[nodeIndex]!=null){
                nodes[prevNodeIndex].highlight=IDLE;
                nodes[nodeIndex].highlight=TRAVERSING;
                prevNodeIndex=nodeIndex;
                nodeIndex=2*nodeIndex+1;
            }
            else{
                clearInterval(delInterval);
                nodes[i].value=nodes[parseInt((nodeIndex-1)/2)].value;
                deleteThatNodeBaby(parseInt((nodeIndex-1)/2));
                for (let i = 0; i < nodes.length; i++)if(nodes[i]!=null)nodes[i].highlight=IDLE
                prevNodeIndex=nodeIndex=0;
            }
        },trialRate)
    }
    else if((nodes[2*i+1]!=null)||(nodes[2*i+2]!=null)){
        var childNum=nodes[2*i+1]!=null?1:2;
        var xDiff= Math.abs(nodes[i].x-nodes[2*i+childNum].x);
        var yDiff= Math.abs(nodes[i].y-nodes[2*i+childNum].y)
        nodes[i]=nodes[2*i+childNum];
        nodes[2*i+childNum]=null;
        moveUpLevelly(i)
        moveUpCoordinately(i,childNum,xDiff,yDiff);
        toggleAccess(false);
    }
}
function moveUpLevelly(delIdx){
    var qu= [delIdx];
    while(qu.length!=0){
        var popped=qu.splice(0,1)[0];
        nodes[popped].level--;
        nodes[2*popped+1]=nodes[popped].left;
        if(nodes[popped].left!=null)nodes[nodes[popped].left.index]=null;
        nodes[2*popped+2]=nodes[popped].right;
        if(nodes[popped].right!=null)nodes[nodes[popped].right.index]=null;

        if(nodes[2*popped+1]!=null)qu.push(2*popped+1);
        if(nodes[2*popped+2]!=null)qu.push(2*popped+2)
    }
    if(qu.length==0)assignRoles();
}
function moveUpCoordinately(delIdx,childNum,xDiff,yDiff){
    var qu= [delIdx];
    while(qu.length!=0){
        var popped=qu.pop();
        nodes[popped].y-=yDiff;
        nodes[popped].x+= childNum==1?xDiff:-xDiff;
        if(nodes[2*popped+1]!=null&&2*popped+1<=nodes.length-1)qu.push(2*popped+1);
        if(nodes[2*popped+2]!=null&&2*popped+2<=nodes.length-1)qu.push(2*popped+2)
    }
    if(qu.length==0)fixSpacings(false);
}
function findThatNodeBaby(){
    var finInterval,done=false;
    finInterval= setInterval(function(){
        if(!done){
            if(nodes[prevNodeIndex]!=null)nodes[prevNodeIndex].highlight=IDLE;
            if(nodes[nodeIndex]!=null)nodes[nodeIndex].highlight=TRAVERSING;
            prevNodeIndex=nodeIndex;
            if(nodeIndex>=nodes.length||nodes[nodeIndex]==null||nodes[nodeIndex].value==nodeValue)done=true;
            else if(parseInt(nodes[nodeIndex].value)>parseInt(nodeValue))nodeIndex=2*nodeIndex+1;
            else if(parseInt(nodes[nodeIndex].value)<parseInt(nodeValue))nodeIndex=2*nodeIndex+2;
        }
        else {
            clearInterval(finInterval);
            toggleAccess(false);
            if(nodes[nodeIndex]!=null&&nodeIndex<nodes.length)nodes[nodeIndex].highlight=HIGHLIGHT
            setTimeout(function(){for (let i = 0; i < nodes.length; i++)if(nodes[i]!=null)nodes[i].highlight=IDLE},5000)
            prevNodeIndex=nodeIndex=0;
        }
    },trialRate)
}
function assignRoles(){
    for (let i = 0; i < nodes.length; i++) {
        if(nodes[i]==null)continue;
        nodes[i].index=i;
        if(2*i+1>nodes.length-1)continue;
        nodes[i].left=nodes[2*i+1];
        nodes[i].right=nodes[2*i+2];
        if(nodes[2*i+1]!=null)nodes[2*i+1].parent=nodes[i];
        if(nodes[2*i+2]!=null)nodes[2*i+2].parent=nodes[i];
    }
}
function moveMap(num){
    if(num==1&&!document.getElementById("up").disabled)for(var i=0;i<nodes.length;i++){if(nodes[i]!=null)nodes[i].x-=10;}
    if(num==2&&!document.getElementById("up").disabled)for(var i=0;i<nodes.length;i++){if(nodes[i]!=null)nodes[i].y-=10;}
    if(num==3&&!document.getElementById("up").disabled)for(var i=0;i<nodes.length;i++){if(nodes[i]!=null)nodes[i].x+=10;}
    if(num==4&&!document.getElementById("up").disabled)for(var i=0;i<nodes.length;i++){if(nodes[i]!=null)nodes[i].y+=10;}
}
function centerNodes(){
    if(nodes.length!=0&&nodes[0]!=null){
        var xDiff = nodes[0].x-canvas.width/2;
        var yDiff = nodes[0].y-50;
        for (let i = 0; i < nodes.length; i++) {
            if(nodes[i]!=null){
                nodes[i].x-=xDiff;
                nodes[i].y-=yDiff;
            }
        }
    }
}