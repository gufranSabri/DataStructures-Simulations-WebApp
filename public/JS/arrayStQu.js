var textBox,selectBox,spanEle, theTopic, stepsDone=0, thatValueLol;
var immakingthislongerfornoreasonlolwhyareyoulikethisman="immakingthislongerfornoreasonlolwhyareyoulikethisman";
var add=false,front=0, rear=0, playButton;

function structureSetup(topic){
    theTopic=topic;
    array=[];
    updatePointer(theTopic=="stack"?[0]:[rear,front],theTopic=="stack"?["top"]:["rear","front"])
    changeHTML();
}
function linearStructPlayDirector(){
    if(selectBox.value==immakingthislongerfornoreasonlolwhyareyoulikethisman){
        if($(".messageBoard").css("display")=="none")alert("Can't play simulation when message board is hidden. Please open the website on desktop!!")
        else alert("Please select an action!!!");
        endSimProcedures();
    }
    else if((front==rear||(array.length==0))&&!add){
        alert((theTopic=="stack"?"Stack":"Queue")+" is empty!!!");
        endSimProcedures(false);
    }
    else if((array.length==9)&&add){
        alert((theTopic=="stack"?"Stack":"Queue")+" is full!!!");
        endSimProcedures(false);
    }
    else{
        stepsDone=0;
        playStarted=true;
        info.innerHTML="Great! Lets start the simulation.<br><br>"+(add?"Adding":"Deleting")+" an element is super easy. "+
        (theTopic=="stack"?"Stacks follow LIFO, ie last in first out.":"Queues follow FIFO, ie first in first out")+"<br>";
        if(add)highlightCodeRow(cvIndex=1);
        else highlightCodeRow(cvIndex=2);
        selectBox.disabled=true;
        textBox.disabled=true;
        linearStructSim();
    }
}
function linearStructSim(){
    stepsDone++;
    if(stepsDone==1){
        if(theTopic=="stack"){
            if(add)info.innerHTML+="<br>We simply insert the element into the spot being pointed at by <b>top</b>."
            else info.innerHTML+="<br>We simply remove the element at the spot being pointed at by <b>top</b>."
        }
        else{
            if(add)info.innerHTML+="<br>We simply insert the element into the spot being pointed at by <b>rear</b>."
            else info.innerHTML+="<br>We simply remove the element at the spot being pointed at by <b>front</b>."
        }
    }
    else if(stepsDone==2){
        if(theTopic=="stack")info.innerHTML+="<br>We then "+ (add?"increment":"decrement") +" <b>top</b> to point at the next empty spot.<br>"
        else{
            if(add)info.innerHTML+="<br>We then increment <b>rear</b> to point at the next empty spot.<br>";
            else info.innerHTML+="<br>We then shift all the elements up. <b>rear</b> is also shifted up.<br>";
        }
    }
    if(stepsDone<3)setTimeout(linearStructSimUpdate,simulationSpeed)
    else endSimProcedures(true);
    messageBoard.scrollTo(0,1000000);
}
function linearStructSimUpdate(){
    if(stepsDone==1){
        if(add){
            array[rear]=parseInt(document.getElementById("target").value);
            rear++;
        }
        else {
            if(theTopic=="stack"){
                array.pop();
                rear--;
            }
            else array[front++]="";
        }
        updateArray(true);
    }
    else {
        if(array.length==9)info.innerHTML+="<br><b>" +(theTopic=="stack"?"Top":"Rear")+ " is now pointing to an index outside the " +theTopic+" because we're full!!!</b><br>";
        updatePointer(theTopic=="stack"?[array.length]:[rear,front],theTopic=="stack"?["top"]:["rear","front"])
    }
    linearStructSim();
}
function changeHTML(){
    document.getElementById("tip1").innerHTML="Choose an action to simulate";
    document.getElementById("tip2").innerHTML="Enter a target if you chose push";
    document.getElementById("tip3").innerHTML="Then press P to play";
    selectBox= document.createElement("SELECT");
    selectBox.classList.add("simAction");
    selectBox.id="sss"
    textBox= document.createElement("INPUT");
    textBox.type="Number";
    textBox.id="target";
    textBox.classList.add("textArea");
    spanEle= document.createElement("SPAN");

    selectBox.onchange=function(){
        info.innerHTML="";
        selectBox.blur();
        if(selectBox.value=="add"){
            messageBoard.insertBefore(textBox,document.getElementById("info"));
            messageBoard.insertBefore(spanEle,document.getElementById("info"));
            spanEle.innerHTML="&nbsp&nbsp&larr; Enter element to add";
            add= true;
        }
        else {
            add=false;
            try{
                messageBoard.removeChild(textBox);
                messageBoard.removeChild(spanEle);
            }
            catch(DOMException){console.log("lol")}
        }
    }
    var defaultOption= document.createElement("OPTION")
    defaultOption.value="immakingthislongerfornoreasonlolwhyareyoulikethisman";
    defaultOption.selected=true;
    defaultOption.appendChild(document.createTextNode("Select action to simulate"));
    
    var addEle= document.createElement("OPTION")
    addEle.value="add";
    addEle.appendChild(document.createTextNode("Push"));

    var deleteEle = document.createElement("OPTION")
    deleteEle.value="del";
    deleteEle.appendChild(document.createTextNode("Pop"));

    selectBox.appendChild(defaultOption);
    selectBox.appendChild(addEle);
    selectBox.appendChild(deleteEle);
    messageBoard.insertBefore(selectBox,document.getElementById("info"));
    messageBoard.insertBefore(document.createElement("br"),document.getElementById("info"));
    messageBoard.insertBefore(document.createElement("br"),document.getElementById("info"));
}
function endSimProcedures(success){
    highlightCodeRow(cvIndex=0)
    if(success)info.innerHTML+="<br>Done! It's as easy as that!<br>"
    playStarted=false;
    document.getElementById("play").innerHTML="Play";
    selectBox.disabled=false;
    textBox.disabled=  false;
    document.getElementById("target").value=""
}