var canvas, context, interval, canvasHeight=550, frameRate=5, nodes=[], radius=25, nodeNames=[], selected=[];
var letterIndex=0, letterRound=0, nodeSelected=false, selectedNode, directed=true, weighted=true, edgeOffset=5, algoInterval;
const IDLE="#b3ffb3",TRAVERSING="#ffc34d",HIGHLIGHT="#ff6666",CANVAS_COLOR="#f2f2ff"
const letters=["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

function canvasSetup(){
    canvas= document.getElementById("cvs");
    context= canvas.getContext("2d");
    interval=setInterval(updateViewPort,frameRate);
}
function updateViewPort(){
    canvas.height=canvasHeight;
    canvas.width=parseInt($(".mainDiv").css("width"));
    context.clearRect(0, 0, canvas. width, canvas. height);
    context.fillStyle=CANVAS_COLOR;
    context.fillRect(0,0,canvas.width,canvas.height);

    if(selectedNode&&!nodeSelected){
        context.moveTo(selectedNode.x,selectedNode.y);
        context.lineTo(mouseX- $('.mainDiv').offset().left, mouseY- $('.mainDiv').offset().top);
        context.stroke();
        context.beginPath();
    }
    for (let i = 0; i < nodes.length; i++) nodes[i].makeConnections();
    for (let i = 0; i < nodes.length; i++) nodes[i].update();
    context.fillStyle="#cce6ff";
    // context.fillRect(canvas.width-400,30,370,canvas.height-50);
}
function node(x,y,n){
    this.x=x;
    this.y=y;
    this.name=n;
    this.connections=[];
    this.connectionNames=[];
    this.visited=false;
    this.highlight=IDLE;

    this.update =function(){
        context.beginPath();
        context.strokeStyle="black";
        context.fillStyle=this.highlight;
        context.arc(this.x,this.y,radius,0,2*Math.PI);
        context.fill();
        context.stroke();
        context.beginPath();

        context.fillStyle="black";
        context.textAlign="center"; 
        context.textBaseline="middle"
        context.font="17px Arial";
        context.fillText(this.name,this.x,this.y);
        context.stroke();
    }
    this.makeConnections=function(){
        for (let i = 0; i < this.connections.length; i++) {
            context.save();
            context.beginPath();

            var xDiff= -(this.x-this.connections[i].node.x), yDiff=this.y-this.connections[i].node.y;
            var hyp= Math.sqrt((xDiff*xDiff)+(yDiff*yDiff));
            var angle= Math.atan2(yDiff,xDiff), dir=this.connections[i].dir;;
            
            if(xDiff>=0&&yDiff<0)angle+=6.28319;

            if(dir==-1&&!directed)continue;
            context.fillStyle=context.strokeStyle=this.connections[i].color;
            context.translate(this.x+dir*edgeOffset,this.y+dir*edgeOffset);
            context.moveTo(0,0);
            context.rotate(-angle);
            context.lineTo(hyp,0);
            context.stroke();

            if(directed){
                context.beginPath();
                context.moveTo(hyp-radius-5,0);
                context.lineTo(hyp-radius-15,5);
                context.lineTo(hyp-radius-15,-5);
                context.lineTo(hyp-radius-5,0);
                context.fill();
            }
            if(weighted){
                context.translate(hyp/2,0)
                context.fillStyle="black";
                context.textAlign="center"; 
                context.textBaseline="middle"
                context.font="13px Arial";
                if(this.x>this.connections[i].node.x)context.scale(-1, dir=-1)
                else dir=1;
                context.fillText(this.connections[i].w,0,dir*20);
                context.stroke();
            }
            context.restore();
        }
    }
}
function selectNode(mouseNo){
    var x=mouseClickPosX- $('.mainDiv').offset().left;
    var y=mouseClickPosY- $('.mainDiv').offset().top;
    var flag=false, j, flag2=false;
    for (let i = 0; i < nodes.length; i++) {
        if(!flag&&(x<nodes[i].x+radius&&x>nodes[i].x-radius)&&(y<nodes[i].y+radius&&y>nodes[i].y-radius)){
            if(mouseNo==2){
                deleteNode(i);
                break;
            }
            
            if(selectedNode&&i!=nodes.length-1&&!selectedNode.connectionNames.includes(nodes[i].name)){
                var weight= 0,num=1;
                for (let k = 0; k < nodes[i].connections.length; k++) {
                    if(nodes[i].connections[k].node.name==selectedNode.name){
                        num=nodes[i].connections[k].dir*-1;
                        break;
                    }
                }
                if(weighted){
                    settingWeight=true;
                    do{weight=parseInt(prompt("Enter edge weight:"))}
                    while(!Number.isInteger(weight));
                    setTimeout(function(){settingWeight=false},1000);
                }
                selectedNode.connections.push({node:nodes[i],dir:num, w:weight, color:"black"});
                selectedNode.connectionNames.push(nodes[i].name);
                flag2=true;
            }
            
            nodes[j=i].highlight=HIGHLIGHT;
            if(!flag2)selectedNode=nodes[i];
            else selectedNode=undefined;
            flag=true;
        }
        else nodes[i].highlight=IDLE;
    }
    if(flag&&!flag2){
        var temp= nodes[j];
        nodes[j]=nodes[nodes.length-1];
        nodes[nodes.length-1]=temp;
        nodeSelected=true;
    }
    else if(!flag2){
        if(mouseNo==0)addNode()
        selectedNode=undefined
    }
}
function addNode(){
    var x=mouseClickPosX- $('.mainDiv').offset().left;
    var y=mouseClickPosY- $('.mainDiv').offset().top;

    nodeNames.push(letters[letterIndex]+(letterRound==0?"":letterRound))
    nodes.push(new node(x, y, letters[letterIndex++]+(letterRound==0?"":letterRound)))
    letterIndex=letterIndex%26;
    letterRound=letterIndex==0?letterRound+1:letterRound;

    updateSelect()
}
function deleteNode(dI){
    var delName=nodes[dI].name;
    nodes= nodes.filter(function(x){return x.name!=delName});

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].connections= nodes[i].connections.filter(function(x){return x.node.name!=delName})
        nodes[i].connectionNames=nodes[i].connectionNames.filter(function(x){return x!=delName})
    }
    nodeNames=nodeNames.filter(function(x){return x!=delName})
    updateSelect()
}
function editEdge(del){
    var val1=$("#EE1").val(),val2=$("#EE2").val();
    if(val1!="def"&&val2!="def"&&val1!=val2){
        for (let i = 0; i < nodes.length; i++) {
            if(nodes[i].name==val1&&nodes[i].connectionNames.includes(val2)){
                if(del){
                    nodes[i].connections= nodes[i].connections.filter(function(x){return x.node.name!=val2})
                    nodes[i].connectionNames=nodes[i].connectionNames.filter(function(x){return x!=val2})
                }
                else if(weighted){
                    
                }
                break;
            }
        }
    }
}
function updateSelect(){
    nodeNames.sort();
    var selectVals= "<option value='def'>Select vertex</option>";
    for (let i = 0; i < nodeNames.length; i++) selectVals+="<option value="+nodeNames[i]+">"+nodeNames[i]+"</option>"
    $("#EE1").html(selectVals)
    $("#EE2").html(selectVals);
}

function algoSetup(algo){
    if(nodeNames.length==0)alert("Make a graph first!!!");
    else if(!document.getElementById("wtd").checked)alert("Graph must be weighted to make MST!!!");
    if(nodeNames.length==0||!document.getElementById("wtd").checked)return;

    var startNode="lol";
    while(!nodeNames.includes(startNode))startNode= prompt("Enter starting node:");
    selected=nodes.filter(function(x){return x.name==startNode});
    
    for (let i = 0; i < nodes.length; i++)nodes[i].visited=false;
    toggleAccess(selected[0].visited=true);
    algoInterval= setInterval(algo=="mst"?mst:dijkstra,algoSpeed);
}
function mst(){
    if(selected.length!=nodes.length){
        var weight=Infinity, edgeIndex=0, nodeIndex=0;
        for (let i = 0; i < selected.length; i++) {
            for (let j = 0; j < selected[i].connections.length; j++) {
                if(selected[i].connections[j].w<weight){
                    weight=selected[i].connections[j].w
                    nodeIndex=i;
                    edgeIndex=j;
                }
            }
        }
        selected[nodeIndex].fillStyle=HIGHLIGHT;
        selected[nodeIndex].connections[edgeIndex].color="red";
        selected.push(selected[nodeIndex].connections[edgeIndex].node);
    }
    else {
        clearInterval(algoInterval);
        toggleAccess(false);
    }
}
function dijkstra(){

}

function algoCleanUp(){
    for (let i = 0; i < nodes.length; i++)nodes[i].highlight=IDLE;
    clearInterval(algoInterval);
    toggleAccess(false);
}