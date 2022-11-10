var stackTop,front,rear,nameNodeW=50,nameNodeH=50,topX=50,topYOffset=50,nodesAllowedInRow=5;
var animNodeX=200,animNodeY=5,normalNodeY=150,normalNodeX=50,normalNodeH=30, normalNodeW=100;

function canvasSetupNonB(){
    canvas= document.getElementById("cvs");
    context= canvas.getContext("2d");
    if(topic=="linked-stack")normalNodeY=50;

    if(topic=="linked-stack")stackTop=new linearNode(topX,canvas.height-topYOffset-nameNodeH,nameNodeW,nameNodeH,"top");
    if(topic=="queue"){
        front = new linearNode(topX,topYOffset,nameNodeW,nameNodeH,"front");
        rear = new linearNode(topX,canvas.height-topYOffset-nameNodeH,nameNodeW,nameNodeH,"rear");
    }
    $("#cDiv").css("width","58%");
    $(".rDiv").css("width","37%");
    canvas.width=parseInt($("#cDiv").css("width"));
    while(nodesAllowedInRow<6&&(normalNodeW*nodesAllowedInRow)+((nodesAllowedInRow-1)*50)<canvas.width)nodesAllowedInRow++;
    while((normalNodeW*nodesAllowedInRow)+((nodesAllowedInRow-1)*50)>canvas.width)nodesAllowedInRow--;
    nodesAllowedInRow--;
    interval=setInterval(updateViewPortNonB,frameRate);
}
function updateViewPortNonB(){
    canvas.height=canvasHeight;
    canvas.width=parseInt($("#cDiv").css("width"));
    if(nodes.length==0){
        normalNodeY=topic=="linked-stack"?50:150
        normalNodeX=50;
    }
    context.fillStyle=CANVAS_COLOR;
    context.fillRect(0,0,canvas.width,canvas.height);

    if(nodesAllowedInRow==0){
        clearInterval(interval);
        alert("Screen width too small!!")
        location.href='/algorithms'
    }

    if(addNode){
        addNode=false;
        highlightCodeRow(cvIndex=1)
        if(nodes.length!=0&&nodes.length%nodesAllowedInRow==0){
            normalNodeY+=60;
            normalNodeX=50;
            if(normalNodeY+normalNodeH>canvas.height-topYOffset-nameNodeH)canvasHeight+=60;
        }
        if(topic=="linked-stack")nodes.push(new linearNode(animNodeX,animNodeY,normalNodeW,normalNodeH,nodeValue));
        else nodes.push(new linearNode(animNodeX,animNodeY,normalNodeW,normalNodeH,nodeValue));
    }
    if(delNode){
        delNode=false;
        highlightCodeRow(cvIndex=2)
        nodes[topic=="linked-stack"?nodes.length-1:0].highlight=HIGHLIGHT;
        normalNodeY=nodes[nodes.length-1].y-((nodes.length-1)%nodesAllowedInRow==0?60:0);
        normalNodeX=nodes[nodes.length-1].x;
        delling=true;
        setTimeout(function(){
            toggleAccess(false);
            if(topic=="queue"){
                nodes.splice(0,1);
                for (let j = 0; j < nodes.length; j++) {
                    if((j+1)%nodesAllowedInRow==0){
                        nodes[j].x=nodes[j-1].x+150;
                        nodes[j].y=nodes[j-1].y;
                        if(canvasHeight!=550)canvasHeight-=60;
                        rear.y=nodes[nodes.length-1].y+60;
                    }
                    else nodes[j].x-=150;
                }
            }
            else {
                if((nodes.length%nodesAllowedInRow==0)&&canvasHeight!=550)canvasHeight-=60;
                nodes.pop();
            }
            highlightCodeRow(cvIndex=0)
            delling=false;
        },deleteSpeed)
    }
    if(topic=="queue"){
        if(nodes.length!=0&&(nodes.length-1)%nodesAllowedInRow==0)rear.y=nodes[nodes.length-1].y+60;
        else if(nodes.length==0) rear.y=front.y+60;
    }
    else {
        if(nodes.length!=0&&(nodes.length-1)%nodesAllowedInRow==0)stackTop.y=nodes[nodes.length-1].y+60;
        else if(nodes.length==0) stackTop.y=60;
    }

    for(var i=0;i<nodes.length;i++)nodes[i].update((i==nodes.length-1?true:false),i);
    if(topic=="linked-stack")stackTop.update(false,-1);
    else{
        front.update(false,-1);
        rear.update(false,-1);
    }
}
function linearNode(x,y,w,h,v){
    var textX,textY;
    this.x=x;
    this.y=y;
    this.width=w;
    this.height=h;
    this.value=v;
    this.dotY;
    this.dot1X;
    this.dot2X;
    this.move=true;
    this.highlight=IDLE;

    this.update =function(last,i){
        context.strokeStyle="black";

        context.rect(this.x,this.y,this.width,this.height)
        context.fillStyle= this.highlight
        context.fill()

        context.textAlign="center"; 
        context.textBaseline="middle"
        
        textX = (this.x+(this.width/2))
        textY = (this.value=="top"||this.value=="rear"||this.value=="front")?(this.y+(this.height/2)-5):(this.y+(this.height/2))

        context.fillStyle = "black";
        context.font="15px Arial";
        context.fillText(this.value,textX,textY);
        context.stroke();
        
        if(this.value=="top"||this.value=="rear"||this.value=="front"){
            this.highlight=TRAVERSING
            this.move=false;
            context.beginPath();
            this.dotY=this.y+(this.height/2)+10;
            this.dot2X=this.dot1X=this.x+(this.width/2);
            context.arc(this.dot1X,this.dotY,3.5,0,2*Math.PI);
            context.fill();

            if(this.value=="front"&&nodes.length!=0){
                try{context.lineTo(nodes[delling?1:0].dot1X,nodes[delling?1:0].dotY)}
                catch(TypeError){console.log("hehe")}
            }
            else if(this.value=="rear"&&nodes.length!=0){
                context.lineTo(this.dot1X,this.dotY-50)
                context.lineTo(nodes[nodes.length-1].dot1X,this.dotY-40)
                context.lineTo(nodes[nodes.length-1].dot1X,nodes[nodes.length-1].dotY)
            }
            else if(this.value=="top"&&nodes.length!=0){
                try{
                    context.lineTo(this.dot1X,this.dotY-50)
                    context.lineTo(nodes[nodes.length-(delling?2:1)].dot1X-20,this.dotY-40)
                    context.lineTo(nodes[nodes.length-(delling?2:1)].dot1X,nodes[nodes.length-(delling?2:1)].dotY)
                }catch(TypeError){console.log("hehe")}
            }
            context.stroke()
        }
        else{
            context.beginPath();

            this.dotY=this.y+(this.height/2);
            this.dot1X=this.x+10;
            this.dot2X=(this.x+this.width)-10;
            context.arc(this.dot1X,this.dotY,3.5,0,2*Math.PI);
            
            if(!last)context.arc(this.dot2X,this.dotY,3.5,0,2*Math.PI);
            context.fill();
            context.beginPath();
            context.moveTo(this.dot1X+15,this.y);
            context.lineTo(this.dot1X+15,this.y+this.height)
            context.moveTo(this.dot2X-15,this.y);
            context.lineTo(this.dot2X-15,this.y+this.height)
            if(last){
                context.moveTo(this.dot2X-15,this.y)
                context.lineTo(this.x+this.width,this.y+this.height)
            }
            context.stroke();
            
            context.moveTo(this.dot1X,this.dotY);
            if((topic=="queue"&&i!=0)||(topic=="linked-stack"&&i!=0)){
                if(i!=0&&i%nodesAllowedInRow==0){
                    context.lineTo(this.dot1X,this.dotY-30)
                    context.lineTo(nodes[i-1].dot2X,this.dotY-40)
                    context.lineTo(nodes[i-1].dot2X,nodes[i-1].dotY)
                    context.moveTo(this.dot1X,this.dotY);
                    context.lineTo(this.dot1X-10,this.dotY-20)
                    context.moveTo(this.dot1X,this.dotY);
                    context.lineTo(this.dot1X+10,this.dotY-20)
                }
                else {
                    context.lineTo(nodes[i-1].dot2X,nodes[i-1].dotY);
                    context.moveTo(this.dot1X-5,this.dotY);
                    context.lineTo(this.dot1X-20,this.dotY+10)
                    context.moveTo(this.dot1X-5,this.dotY);
                    context.lineTo(this.dot1X-20,this.dotY-10)
                }
            }
            context.stroke();
        }
        if(this.move){
            if(this.x>normalNodeX)this.x-=5;
            else if(this.x<normalNodeX)this.x+=5;

            if(this.y>normalNodeY)this.y-=5;
            else if(this.y<normalNodeY)this.y+=5;

            if(this.x==normalNodeX&&this.y==normalNodeY){
                this.move=false;
                normalNodeX+=150;
                toggleAccess(false)
                highlightCodeRow(cvIndex=0)
            }
        }
        context.beginPath()
    }
}