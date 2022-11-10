var array=[3,-1,431,-9,41,22,5,8,500]; 
var paused=false, playStarted=false, broughtSettings=false,broughtHelp=false;
var heading,mainParent,arr,messageBoard,info;
var index = -1, step=0,simulationSpeed=1000, loadBarLength=0;
var varsRecord, updateInterval, outRecursed=[]; 
var structureTopics=["stack","queue","circular-queue"], lmaoOurTopic;

$(document).ready(function(){
    $("#AB,#DB,#COP,#CV,#AB,#IB,#J,#CS,#CP,#P").change(apply);
    $("#settings").click(function(){bs();})
    $("#helpBox").click(function(){bh();})
    $("#help").click(function(){bs();$("#settings").slideToggle(100);});
    onclick=function(){
        if(!broughtSettings)$("#settings").slideUp(100);
        if(!broughtHelp)$("#helpBox").slideUp(100);
    };
});
function setup(topic){
    heading= document.getElementById("head");
    mainParent= document.getElementById("body");
    arr= mainParent.children[0];
    messageBoard= mainParent.children[3].children[1];
    info= document.getElementById("info");
    lmaoOurTopic=topic;
    setInterval(function(){document.getElementById("settings").style.left = ($('#help').offset().left+75)+"px";},500)

    document.addEventListener("keyup",function(evt){
        if(!playStarted||paused){
            if(evt.keyCode==80){
                document.getElementById("play").click();
                document.getElementById("target").blur();
            }
        }
        else if(playStarted&&!paused){if(evt.keyCode==80)document.getElementById("pause").click();}
        if(evt.keyCode==78)document.getElementById("step").click();
    });
    if(topic!='linear-search'&&topic!='binary-search'){
        messageBoard.children[0].remove();
        messageBoard.insertBefore(document.createElement("br"),document.getElementById("tip1"));
    }
    document.getElementById("addEle").addEventListener("click",function(){addToArray(false)});
    document.getElementById("fill").addEventListener("click",fill);
    document.getElementById("dlt").addEventListener("click",function(){dlt(false);});
    document.getElementById("rAll").addEventListener("click",removeAll);
    document.getElementById("play").addEventListener("click",
    function(){
        if(!paused&&!playStarted){
            step=1;
            index=-1;
            var targetEle =document.getElementById("target");
            var num= targetEle==null?-1:parseInt(document.getElementById("target").value);
            if(array.length==0&&!structureTopics.includes(topic))alert((topic=="stack"?"Stack":(topic=="Queue"?"Queue":"Array"))+" is empty!!!")
            else if(!Number.isInteger(num)){
                if($(".messageBoard").css("display")=="none"){
                    document.getElementById("target").value = prompt("Please enter a target")
                    $("#play").click()
                }
                else alert("Please enter target!!!");
            }
            else{
                playStarted=true;
                document.getElementById("play").innerHTML="Playing";
                if(!structureTopics.includes(topic))info.innerHTML="Great! Lets start the simulation.<br>";
                if(topic=='linear-search'||topic=='binary-search')searchSimPlayDirector(num,topic);
                if(topic=='selection-sort'||topic=='insertion-sort'||topic=="bubble-sort")simpleSortPlayDirector(topic);
                if(topic=='quick-sort')quickSortPlayDirector();
                if(structureTopics.includes(topic))linearStructPlayDirector();
            }
        }
        else if(paused) {
            document.getElementById("play").innerHTML="Playing";
            paused=false;
            if(topic=='linear-search'||topic=='binary-search')searchSimUpdate(varsRecord)
            if(topic=='selection-sort'||topic=='insertion-sort'||topic=="bubble-sort")simpleSortSimUpdate(varsRecord)
            if(topic=='quick-sort')partitionUpdate(varsRecord)
        }
    });
    document.getElementById("pause").addEventListener("click",
    function(){
        if(!playStarted&&structureTopics.includes(lmaoOurTopic)){
            rear=front=0;
            array=[]
            if(topic!="stack")updatePointer(["rear","front"],[0,0]);
            else updatePointer(["top"],[0]);
            updateArray();
        }
        else if(playStarted&&!structureTopics.includes(lmaoOurTopic)){
            document.getElementById("play").innerHTML="Resume";
            if(updateInterval!=undefined)clearTimeout(updateInterval);
            if(!paused){
                if(topic=='linear-search'||topic=='binary-search')document.getElementById("step").addEventListener("click",pauseHelperSearch);
                if(topic=='selection-sort'||topic=='insertion-sort'||topic=="bubble-sort")document.getElementById("step").addEventListener("click",pauseHelperSimpleSort);
                if(topic=='quick-sort')document.getElementById("step").addEventListener("click",pauseHelperQuickSort);
            }
            paused=true;
        }
    });
    document.getElementById("sort").addEventListener("click",function(){if(!playStarted){array.sort(function(a,b){return a-b;});updateArray();}});
    document.getElementById("rev").addEventListener("click",function(){if(!playStarted){array.reverse();updateArray();}});
    document.getElementById("empty").addEventListener("click",function(){if(!playStarted){while(array.length!=0)array.pop();updateArray();}});
    if(structureTopics.includes(topic))structureSetup(topic);

    if(topic=="linear-search")heading.children[0].innerHTML="Simulation - Linear Search";
    if(topic=="binary-search")heading.children[0].innerHTML="Simulation - Binary Search";
    if(topic=="selection-sort")heading.children[0].innerHTML="Simulation - Selection Sort";
    if(topic=="insertion-sort")heading.children[0].innerHTML="Simulation - Insertion Sort";
    if(topic=="bubble-sort")heading.children[0].innerHTML="Simulation - Bubble Sort";
    if(topic=="quick-sort")heading.children[0].innerHTML="Simulation - Quick Sort";
    if(topic=="stack")heading.children[0].innerHTML="Simulation - Stack";
    if(topic=="queue")heading.children[0].innerHTML="Simulation - Queue";
    if(topic=="circular-queue")heading.children[0].innerHTML="Simulation - Circular Queue";
    if(structureTopics.includes(topic)){
        $("#step,#sort,#rev,#empty,#addEle,#fill,#dlt,#rAll,#AE,#DE").css("opacity","0.5");
        $("#step,#sort,#rev,#empty,#addEle,#fill,#dlt,#rAll,#AE,#DE").prop("disabled","true");
        $("#pause").html("Reset");
    }
    updateArray();
    if(!structureTopics.includes(topic))updatePointer([],[]);
}
function updateArray(oring){
    for(var i=0;i<9;i++){
        var module= arr.children[i];
        module.children[0].innerHTML=i;
        if(oring)arr.children[i].style.opacity="1";
        if(i>=array.length){
            module.children[1].children[0].innerHTML= "";
            module.children[1].style.backgroundColor = "#666666";
        }
        else {
            module.children[1].children[0].innerHTML= array[i];
            module.children[1].style.backgroundColor = "#85e085";
        }
        if(module.children[1].children[0].innerHTML=="")arr.children[i].style.opacity="0.5";
        if(oring&&outRecursed.length!=0){
            if(i==outRecursed[outRecursed.length-1]){
                outRecursed.pop();
                arr.children[i].style.opacity="0.5";
            }
        }
        if(lmaoOurTopic!="stack"&&structureTopics.includes(lmaoOurTopic)){
            if(module.children[1].children[0].innerHTML=="")module.children[1].style.backgroundColor = "#666666";
        }
    }
    if(lmaoOurTopic=="stack")updatePointer([array.length],["top"])
    else if(lmaoOurTopic=="queue")updatePointer([rear,front],["rear","front"])
}
function updatePointer(indices, pointers){
    var pointerManager=[];
    for(var i=0;i<arr.children.length;i++){
        var element= arr.children[i].children[2].children[0];
        element.innerHTML="";
        if(pointerManager[i]==undefined)pointerManager[i]=[];
        while(indices[indices.length-1]<0){
            indices.pop();
            pointers.pop();
        }
        while(indices.length!=0&&indices[indices.length-1]==i){
            if(pointerManager[i].length==0){
                pointerManager[i].push("&larr;");
                element.innerHTML+="&larr;";
            }
            if(!pointerManager[i].includes(pointers[pointers.length-1])){
                if(pointerManager[i].length==1){
                    pointerManager[i].push(" "+pointers[pointers.length-1]);
                    element.innerHTML+=" "+pointers[pointers.length-1];
                }
                else {
                    pointerManager[i].push(", "+pointers[pointers.length-1]);
                    element.innerHTML+=", "+pointers[pointers.length-1];
                }
            }
            indices.pop(); 
            pointers.pop();
        }
    }
}
function addToArray(target){
    if(!playStarted||add){
        var num=parseInt(document.getElementById("AE").value);
        if(num>9999999999)alert("Number too large!!");
        else if(num<-999999999)alert("Number too small!!");
        else if(array.length<9)array.push(num);
        else alert("Full!!!");
        updateArray(true);
    }
}
function fill(){
    if(!playStarted){
        var num= parseInt(document.getElementById("AE").value);
        for(var i=0;i<9;i++)array[i]=num;
        updateArray();
    }
}
function dlt(reAll){
    if(!playStarted||delLol){
        var num= parseInt(document.getElementById("DE").value);
        for(var i=0;i<array.length;i++){
            if(array[i]==num){
                array.splice(i,1);
                if(!reAll)break;
                i--;
            }
        }
        updateArray();
    }
}
function removeAll(){if(!playStarted)dlt(true);}
function resetInfo(){info.innerHTML="";updatePointer([],[]);}
function getWidth() {return Math.max(document.documentElement.offsetWidth,document.documentElement.clientWidth);}
function bringHelp(toggleSettings){
    bh();
    $("#helpBox").slideToggle(100);
    if(toggleSettings)$("#help").click()
}
function bs(){
    broughtSettings=true;
    setTimeout(function(){broughtSettings=false;},100);
}
function bh(){
    broughtHelp=true;
    setTimeout(function(){broughtHelp=false;},100);
}
function apply(){
    if(document.getElementById("AB").checked)$("#add").hide();
    else $("#add").show();
    if(document.getElementById("DB").checked)$("#remove").hide();
    else $("#remove").show();
    if(document.getElementById("DB").checked&&document.getElementById("AB").checked)$("#eb").hide();
    else $("#eb").show();

    if(document.getElementById("COP").checked)$("#contP").hide();
    else $("#contP").show();

    if(structureTopics.includes(lmaoOurTopic)){
        alert("Cannot hide Information Board in "+lmaoOurTopic+" simulation.")
        document.getElementById("IB").checked=false;
    }
    if(document.getElementById("CV").checked&&document.getElementById("IB").checked)$(".tabs").hide();
    else {
        $(".messageBoard").css("height","250px");
        $("#cdv").css("height","250px");
        $("#cdv").css("font-size","13px");
    }
    if(document.getElementById("CV").checked){
        $("#cdv").hide();
        if(!document.getElementById("IB").checked)$(".messageBoard").css("height","500px");
    }
    else{
        if(document.getElementById("IB").checked){
            $("#cdv").css("height","250px");
            $("#cdv").css("font-size","13px");
        }
        $(".tabs").show();
        $("#cdv").show();
    }
    if(document.getElementById("IB").checked){
        $(".messageBoard").hide();
        if(!document.getElementById("CV").checked){
            $("#cdv").css("height","500px");
            $("#cdv").css("font-size","15px");
        }
    }
    else {
        if(!document.getElementById("CV").checked)$(".messageBoard").css("height","250px");
        $(".tabs").show();
        $(".messageBoard").show();
    }
    if(document.getElementById("J").checked)makeCodeTable(codedJ.split("\n").length)
    if(document.getElementById("P").checked)makeCodeTable(codedPy.split("\n").length)
    if(document.getElementById("CP").checked)makeCodeTable(codedCp.split("\n").length)
    if(document.getElementById("CS").checked)makeCodeTable(codedCs.split("\n").length)
}