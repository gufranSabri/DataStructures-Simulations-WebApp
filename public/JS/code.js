// var codeSegmentsJ=[],codeSegmentsPy=[],codeSegmentsCp=[],codeSegmentsCs=[];
var codedJ,codedPy,codedCp,codedCs,cvIndex=0;
var linesJ=[],linesPy=[],linesCp=[],linesCs=[];

function highlighter(ele,lang,tagClass){  //colors the text of the code to imitate IDE code
    var javaKeywords=["abstract","boolean","break","byte","case","catch","char","class","continue","default",
    "do","double","else","enum","extends","final","true","false","finally","float","for","if","implements","import","instanceof",
    "int","interface","long","native","new","null","package","private","protected","public","return","short",
    "static","super","switch","synchronized","this","throw","throws","transient","try","void","volatile","while",";"];

    var cppKeywords=["#define","typedef","auto","asm","bool","break","const","const_cast","case","catch","char","class","continue","default","delete",
    "do","double","else","enum","extern","float","for","if","#include","goto","register","signed","sizeof","unsigned","using","explicit",
    "int","long","new","private","protected","public","return","short","true","false","inline","mutable","typeid","virtual","namespace",
    "static","struct","switch","this","try","throw","void","volatile","while",";","operator","typename","wchar_t","this","template","using"];

    var pyKeywords=[";","False","None","True","and","as","assert","break","class","continue","def","del","elif","else","try",
    "except","finally","for","from","global","if","import","in","is","lambda","nonlocal","not","or","pass","raise"];

    var csKeywords = ["abstract","as","base","bool","break","byte","case","catch","char","checked","class","const","continue","decimal","default","delegate","do","double",
    "else","enum","event","explicit","extern","false","finally","fixed","float","for","foreach","goto","if","implicit","in","int","interface","internal","is","lock","long",
    "namespace","new","null","object","operator","out","override","params","private","protected","public","readonly","ref","return","sbyte","sealed","short","sizeof","stackalloc",
    "static","string","struct","switch","this","throw","true","try","typeof","unit","ulong","unchecked","unsafe","ushort","using","using static","virtual","void","volatile","while"]

    var pyBuiltInFunctions=["abs","all","any","ascii","bin","bool","bytearray","bytes","callable","chr","classmethod","compile","complex","delattr","dict","dir","divmod",
    "enumerate","eval","exec","filter","float","format","frozenset","getattr","globals","hasattr","hash","help","hex","id","input","int","isinstance","issubclass","iter",
    "len","list","locals","map"	,"max","memoryview","min","next","object","oct","open","ord","pow","print","property","range","repr","reversed","round",
    "set","setattr","slice","sorted","str","sum","super","tuple","type","vars","zip",];

    var pyBuiltInErrors= ["Exception","AssertionError","AttributeError","EOFError","FloatingPointError","GeneratorExit","ImportError","IndexError","KeyError",
    "KeyboardInterrupt","MemoryError","NameError","NotImplementedError","OSError","OverflowError","ReferenceError","RuntimeError","StopIteration",
    "SyntaxError","IndentationError","TabError","SystemError","SystemExit",'TypeError',"UnboundLocalError","UnicodeError",'UnicodeEncodeError',"UnicodeDecodeError",
    "UnicodeTranslateError","ValueError","ZeroDivisionError"];

    if(ele.charAt(0)=="~")return;
    else if((lang=="Python"&&ele.charAt(0)=="#")||(lang!="Python"&&ele.charAt(0)=="/"&&ele.charAt(1)=="/"))$(tagClass).append("<span style='color: #99ddff'>"+ele+"</span>"); //coloring comments
    else if(ele.charAt(0)=='"'&&ele.charAt(ele.length-1)=='"')$(tagClass).append("<span style='color:#59b300'>"+ele+"</span>"); //coloring text in quotes 
    else if(ele.charAt(0)=="'"&&ele.charAt(ele.length-1)=="'")$(tagClass).append("<span style='color:#59b300'>"+ele+"</span>"); //coloring text in quotes
    else if(ele.match(/\t/))$(tagClass).append("<span>&nbsp&nbsp&nbsp&nbsp</span>"); //handling tab spaces in text
    else if(ele.match(/\s+/))$(tagClass).append("<span>&nbsp</span>"); //handling spaces in text
    else if((lang=="Java"&&javaKeywords.includes(ele))||(lang=="Cpp"&&cppKeywords.includes(ele))||
        (lang=="Cs"&&csKeywords.includes(ele))||(lang=="Python"&&pyKeywords.includes(ele)))$(tagClass).append("<span style='color:#cc6600'>"+ele+"</span>"); //coloring keyowrds
    else if(lang=="Python"&&(pyBuiltInFunctions.includes(ele)||pyBuiltInErrors.includes(ele)))$(tagClass).append("<span style='color:#9999ff'>"+ele+"</span>"); //coloring errors keywords
    else if((!ele.match(/[a-zA-Z]/))&&ele.match(/[0-9]/))$(tagClass).append("<span style='color:#00ace6'>"+ele+"</span>"); //coloring numbers
    else $(tagClass).append(ele); // no color
}
function tokenizer(s,lang){ // tokenizes a line of code to differentiate b/w keywords, comments, strings and numbers
    var sArr=[],spaceOn=false,wordOn=false,dQuotesOn=false,quotesOn=false;
    for(var i=0;i<s.length;i++){
        var char=s.substring(i,i+1);
        if((char=="/"&&s.substring(i+1,i+2)=="/"&&lang!="Python")||(char=="#"&&lang=="Python")){ //handling comments
            sArr.push(s.substring(i));
            break;
        }
        if(quotesOn&&char!="'"){ //appending to single quote string
            sArr[sArr.length-1]=sArr[sArr.length-1]+char;
            continue;
        }
        if(char=="'"){ //handling single quote strings
            if(quotesOn) {
                quotesOn=false
                sArr[sArr.length-1]=sArr[sArr.length-1]+char;
                continue;
            }
            else if(!dQuotesOn) {
                quotesOn=true;
                sArr.push(char);
                continue;
            }
        }
        if(dQuotesOn&&char!='"'){//appending to double quote string
            sArr[sArr.length-1]=sArr[sArr.length-1]+char;
            continue;
        }
        if(char=='"'){//handling double quote string
            if(dQuotesOn) {
                dQuotesOn=false
                sArr[sArr.length-1]=sArr[sArr.length-1]+char;
                continue;
            }
            else if(!quotesOn) {
                dQuotesOn=true;
                sArr.push(char);
                continue;
            }
        }
        if(char.match(/\s+/)){//handling spaces
            spaceOn=true;
            wordOn=false;
        }
        if(char.match(/[A-Za-z]+/)){//handling words
            wordOn=true;
            spaceOn=false;
        }
        else{
            if(char.match(/\d/)&&wordOn){
                sArr[sArr.length-1]=sArr[sArr.length-1]+char;
                continue;
            }
            spaceOn=false;
            wordOn=false;
            sArr.push(char);
            continue;
        }
        if(sArr.length==0)sArr.push(char);
        else if(spaceOn){
            if(sArr[sArr.length-1].match(/\s+/))sArr[sArr.length-1]=sArr[sArr.length-1]+char;
            else sArr.push(char);
        }
        else if(wordOn){
            if(sArr[sArr.length-1].match(/[A-Za-z]+/))sArr[sArr.length-1]=sArr[sArr.length-1]+char;
            else sArr.push(char);
        }
        else {
            sArr.push(char);
            spaceOn=false;
            wordOn=false;
        }         
    }
    return sArr;
}
function makeCodeTable(lines){
    $(".codeDiv").html("");
    var tbl= document.createElement("TABLE");
    tbl.id="codeTable";
    for (var i = 0; i < lines; i++) {
        var row= tbl.insertRow(i);
        var cell = row.insertCell(0);
        cell.id="c"+(i+1);
        row.id="r"+(i+1);
    }
    document.getElementById("cdv").appendChild(tbl);
    if(document.getElementById("J").checked)dynamicCode(codedJ,"Java")
    if(document.getElementById("P").checked)dynamicCode(codedPy,"Python")
    if(document.getElementById("CP").checked)dynamicCode(codedCp,"Cpp")
    if(document.getElementById("CS").checked)dynamicCode(codedCs,"Cs")
    highlightCodeRow();
}
function txtCodeParser(j,p,c,cp){
    codedJ= j.split("|-|-|")[0];
    codedPy= p.split("|-|-|")[0];
    codedCs= c.split("|-|-|")[0];
    codedCp= cp.split("|-|-|")[0];;
    var lJ=j.split("|-|-|")[1].split(" ");
    var lP=p.split("|-|-|")[1].split(" ");
    var lCs=c.split("|-|-|")[1].split(" ");
    var lCp=cp.split("|-|-|")[1].split(" ");

    for(var i=0;i<lJ.length;i++){
        var lineDesc= lJ[i].split("-");
        linesJ.push({start:parseInt(lineDesc[0])-1,end:parseInt(lineDesc[lineDesc.length-1])-1})
        lineDesc= lP[i].split("-");
        linesPy.push({start:parseInt(lineDesc[0])-1,end:parseInt(lineDesc[lineDesc.length-1])-1})
        lineDesc= lCs[i].split("-");
        linesCs.push({start:parseInt(lineDesc[0])-1,end:parseInt(lineDesc[lineDesc.length-1])-1})
        lineDesc= lCp[i].split("-");
        linesCp.push({start:parseInt(lineDesc[0])-1,end:parseInt(lineDesc[lineDesc.length-1])-1})
    }
}
function dynamicCode(langedCode,lang){
    var y= langedCode.replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/&amp;/gi,"&").split("\n");
    for(var i=1;i<y.length; i++){
        var tempArr= tokenizer(y[i],lang);
        for(var j=0;j<tempArr.length; j++)highlighter(tempArr[j],lang,"#c"+i);
        $("#c"+i).append("<span><br></span>");
    }
}
function highlightCodeRow(x){
    var lineObject,lines;
    if(document.getElementById("J").checked) {
        lines=codedJ.split('\n').length;
        lineObject= linesJ[cvIndex];
    }
    if(document.getElementById("P").checked) {
        lines=codedPy.split('\n').length;
        lineObject= linesPy[cvIndex];
    }
    if(document.getElementById("CP").checked){
        lines=codedCp.split('\n').length;
        lineObject= linesCp[cvIndex];
    }
    if(document.getElementById("CS").checked){
        lines=codedCs.split('\n').length;
        lineObject= linesCs[cvIndex];
    }
    for (var i = 0; i < lines; i++) {
        if(i>=lineObject.start&&lineObject.end>=i)$("#c"+i).css("background-color","#3b5359")
        else $("#c"+i).css("background-color","#002b36")
    }
    try{document.getElementById("cdv").scrollTo(0,parseInt($("#c"+lineObject.start).css("height"))*lineObject.start)}
    catch(TypeError){console.log("lmao")}
    $('.codeDiv').animate({scrollTop: "-=20px"}, 0);
}