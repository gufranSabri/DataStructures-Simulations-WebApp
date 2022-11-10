var numOfDisks=3,n=3, simulationSpeed=1000,moves=0,moveTheDisk=false, movingDisk, mouseX,mouseY;
var paused=false,startedPlaying=false, playerPlaying=false,nOnned=false,updateInterval,parentOfDisk;
var stack=[], varsRecord=[],disks=["d0","d1","d2","d3","d4","d5","d6"],onTA=false,onTB=false,onTC=false;

$(document).ready(function(){
    onmousemove=function(e){ // processing stuff we want to process when mouse moves
        mouseX= e.pageX;
        mouseY= e.pageY;
        if(moveTheDisk)floatDisk(); //moving disk
        onTA=onTB=onTC=false;
        if(mouseX>$('.mainDiv').offset().left && mouseX<($(document).width()-$('.mainDiv').offset().left)/3)onTA=true; //detecting which tower the disk is on
        if(mouseX>($(document).width() -  $('.mainDiv').offset().left)/3&&mouseX<(($(document).width() -  $('.mainDiv').offset().left)/3)*2)onTB=true; //detecting which tower the disk is on
        if(mouseX>(($(document).width() -  $('.mainDiv').offset().left)/3)*2&&mouseX<$(document).width() -  $('.mainDiv').offset().left)onTC=true; //detecting which tower the disk is on
    }
    $("#help").click(function(){$(".help").slideToggle("fast");})
    $("#up").click(function(){if(!startedPlaying)diskNumUpdates(true)}); //handling disk addition requests
    $("#down").click(function(){if(!startedPlaying)diskNumUpdates(false)}); //handling disk deletion requests
    $("#play").click(function(){ 
        if($(this).html()=="Reset")reset();
        else{
            $(this).html("Playing");
            if(!startedPlaying)start();
            if(paused){
                paused=false;
                towersOfHanoiUpdate(varsRecord);
            }
        }
    });
    $("#pause").click(function(){
        if(startedPlaying){
            paused=true;
            clearTimeout(updateInterval);
            $("#play").html("Resume");
        }
    });
    $("#step").click(function(){if(paused)pauseHelper()});
    $(".disks").mousedown(function(){ //for handling disk drag and drop
        if(!startedPlaying){
            parentOfDisk = $(this).parent()[0];
            movingDisk= document.getElementById($(this).attr("id"));
            if(parentOfDisk.childNodes[parentOfDisk.childNodes.length-1]==movingDisk){
                parentOfDisk.removeChild(movingDisk);
                $("#bod").append(movingDisk);
                movingDisk.style.position= "absolute";
                moveTheDisk=true;
                floatDisk();
            }
        }
    });
    $("#bod").mouseup(function(){ //handling disk dropping
        if(moveTheDisk){
            document.getElementById("bod").removeChild(movingDisk);
            moveTheDisk=false;
            dropDisk();
        }
    });
});
function start(){
    reset();
    $("#play").html("Playing");
    startedPlaying=true;
    stack.push({"n":n=numOfDisks,"A":"TA","C":"TC","B":"TB"});
    towersOfHanoi();
}
function towersOfHanoi(){
    if(stack.length!=0){
        var lastInStack= stack[stack.length-1];
        varsRecord=[lastInStack.n,lastInStack.A,lastInStack.C,lastInStack.B];
        if(!paused)updateInterval=setTimeout(function(){towersOfHanoiUpdate([lastInStack.n,lastInStack.A,lastInStack.C,lastInStack.B])},simulationSpeed);
    }
    else{
        startedPlaying=paused=false;
        $("#play").html("Reset");
    }
}
function towersOfHanoiUpdate(vars){
    if(simulationSpeed==100)simulationSpeed=1000;
    if(vars[0]==1){
        stack.pop();
        moveDisk(document.getElementById(vars[1]),document.getElementById(vars[2]),document.getElementById("d1"))
        nOnned=true;
    }
    else{
        if(!nOnned){
            var x=1;
            while(vars[0]-x!=0){
                if(x==1)stack.push({"n":vars[0]-x++,"A":vars[1],"C":vars[3],"B":vars[2]});
                else stack.push({"n":vars[0]-x++,"A":stack[stack.length-1].A,"C":stack[stack.length-1].B,"B":stack[stack.length-1].C});
                simulationSpeed=100;
            }
        }
        else {
            stack.pop()
            nOnned=false;
            moveDisk(document.getElementById(vars[1]),document.getElementById(vars[2]),document.getElementById("d"+vars[0]));
            stack.push({"n":vars[0]-1,"A":vars[3],"C":vars[2],"B":vars[1]});
        }
    }
    towersOfHanoi();
}
function diskNumUpdates(add){ //adding or subtracting to number of disks
    if(!startedPlaying)reset();
    if((add&&numOfDisks==6)||(!add&&numOfDisks==3))return;
    $("#tm").html("Min moves : "+((2**(add?++numOfDisks:--numOfDisks))-1));
    diskVisualize();
}
function diskVisualize(){ //adding or removing disk visually
    for (let i = 1; i <disks.length; i++) {
        if(i<=numOfDisks)document.getElementById(disks[i]).style.display="block";
        else document.getElementById(disks[i]).style.display="none";
    }
    $("#nd").html("Number of Disks : "+numOfDisks);
}
function moveDisk(from, to,disk){ //moving disk from tower to tower
    from.removeChild(disk);
    to.appendChild(disk);
    $("#m").html("Moves : "+ ++moves);
}
function floatDisk(){ // moving disk with mouse
    movingDisk.style.top=(mouseY-10)+"px";
    movingDisk.style.left=(mouseX-10)+"px";
}
function dropDisk(){ //dropping disk on a tower
    playerPlaying=true;
    $("#play").html("Reset");
    var ta = document.getElementById("TA"),tb=document.getElementById("TB"),tc=document.getElementById("TC");
    if(onTA){
        var topDisk= ta.childNodes[ta.childNodes.length-1];
        if(ta.childNodes.length==0||parseInt(topDisk.id.substring(1,2))>parseInt(movingDisk.id.substring(1,2))){
            ta.appendChild(movingDisk);
            if(parentOfDisk.id!=ta.id)moves++;
        }
        else parentOfDisk.appendChild(movingDisk);
    }
    else if(onTB){
        var topDisk= tb.childNodes[tb.childNodes.length-1];
        if(tb.childNodes.length==0||parseInt(topDisk.id.substring(1,2))>parseInt(movingDisk.id.substring(1,2))){
            tb.appendChild(movingDisk);
            if(parentOfDisk.id!=tb.id)moves++;
        }
        else parentOfDisk.appendChild(movingDisk);
    }
    else if(onTC){
        var topDisk= tc.childNodes[tc.childNodes.length-1];
        if(tc.childNodes.length==0||parseInt(topDisk.id.substring(1,2))>parseInt(movingDisk.id.substring(1,2))){
            tc.appendChild(movingDisk);
            if(parentOfDisk.id!=tc.id)moves++;
        }
        else parentOfDisk.appendChild(movingDisk);
    }
    else parentOfDisk.appendChild(movingDisk);
    $("#m").html("Moves : "+ (moves=moves));
    movingDisk.style.position= "relative";
    movingDisk.style.left=movingDisk.style.top= "0px";
    if(tc.childNodes.length==numOfDisks){
        playerPlaying=false;
        $("#m").html("You win!!!");
        $("#tohDiv").css("background","linear-gradient(#fff7e6,#ffdd99)")
        setTimeout(function(){$("#tohDiv").css("background","linear-gradient(#e6ffff,#99ffff)");},5000)
    }
}
function reset(){
    stack=[];
    clearTimeout(updateInterval);
    paused=startedPlaying=playerPlayinng=nOnned=false;
    $("#TA").append(document.getElementById("d6"));
    $("#TA").append(document.getElementById("d5"));
    $("#TA").append(document.getElementById("d4"));
    $("#TA").append(document.getElementById("d3"));
    $("#TA").append(document.getElementById("d2"));
    $("#TA").append(document.getElementById("d1"));
    $("#TB").html("");
    $("#TC").html("");
    $("#tohDiv").css("background","linear-gradient(#e6ffff,#99ffff)");
    $("#m").html("Moves : "+ (moves=0));
    $("#tm").html("Min moves : "+((2**numOfDisks)-1));
    $("#play").html("Solve");
    diskVisualize()
}
function pauseHelper(){if(startedPlaying)towersOfHanoiUpdate(varsRecord);} //called when we press next step button : advances the simulation