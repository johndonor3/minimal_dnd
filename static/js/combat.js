// borrowing ready-made code
// https://riptutorial.com/html5-canvas/example/18918/dragging-circles---rectangles-around-the-canvas
// cheers riptutorial!

// canvas related vars
var canvas=document.getElementById("myCanvas");
var ctx=canvas.getContext("2d");
var cw=canvas.width;
var ch=canvas.height;
// document.body.appendChild(canvas);
canvas.style.border='1px solid red';

var gridSize = 40;

function resizeGrid(delta) {
    // let intDelta = parseInt(event.target.value);
    gridSize += delta;
    drawInit();
    drawAll();
}

// used to calc canvas position relative to window
function reOffset(){
    var BB=canvas.getBoundingClientRect();
    offsetX=BB.left;
    offsetY=BB.top;        
}
var offsetX,offsetY;
reOffset();
window.onscroll=function(e){ reOffset(); }
window.onresize=function(e){ reOffset(); }
canvas.onresize=function(e){ reOffset(); }


function convertSize(size) {
    // relative to 5ft gridsize

    // damn right. either query api or add to db
    // looks like it may be easier in db :/
    if (size == "Tiny") {
        return 0.5
    }
    else if (size == "Large") {
        return 2
    }
    else if (size == "Huge") {
        return 3
    }
    else if (size == "Gargantuan") {
        return 4
    }
    // either small or medium
    else {
        return 1
    }
}

// save relevant information about shapes drawn on the canvas
var shapes=[];
var texts=[];

function drawInit(){
    shapes=[];
    texts=[];
    for(var i=0; i < enc_chars.length; i++){
        let char = enc_chars[i];
        var size = Math.floor(gridSize*0.5)
        shapes.push( {x:i*size+gridSize/2, y:gridSize/2, radius:size, color:'blue'} );
        let assigned = false;
        let tried = 1;
        while (!assigned) {
            let useName = char.name.slice(0, tried);
            if (texts.includes(useName)) {
                tried += 1;
            }
            else {
                texts.push({x:i*size+gridSize/3, y:gridSize/2, text: useName});
                assigned = true;
            }
            if (tried > char.name.length) {
                texts.push({x:i*size+gridSize/3, y:gridSize/2, text: useName});
                assigned = true;
            }
        }
    }

    for(var i=0; i < enc_monsters.length; i++){
        let monster = enc_monsters[i];
        var size = Math.floor(gridSize*convertSize(monster.size))
        shapes.push( {x:2*i*size+gridSize, y:2*gridSize, width:size, height:size, color:'red'} );
        texts.push( {x:2*i*size+gridSize*1.1, y:2.3*gridSize, text: monster.name[0] + " " + monster.id%100})
    }
}

drawInit()
// drag related vars
var isDragging=false;
var startX,startY;

// hold the index of the shape being dragged (if any)
var selectedShapeIndex;

// draw the shapes on the canvas
drawAll();

// listen for mouse events
canvas.onmousedown=handleMouseDown;
canvas.onmousemove=handleMouseMove;
canvas.onmouseup=handleMouseUp;
canvas.onmouseout=handleMouseOut;

// given mouse X & Y (mx & my) and shape object
// return true/false whether mouse is inside the shape
function isMouseInShape(mx,my,shape){
    if(shape.radius){
        // this is a circle
        var dx=mx-shape.x;
        var dy=my-shape.y;
        // math test to see if mouse is inside circle
        if(dx*dx+dy*dy<shape.radius*shape.radius){
            // yes, mouse is inside this circle
            return(true);
        }
    }else if(shape.width){
        // this is a rectangle
        var rLeft=shape.x;
        var rRight=shape.x+shape.width;
        var rTop=shape.y;
        var rBott=shape.y+shape.height;
        // math test to see if mouse is inside rectangle
        if( mx>rLeft && mx<rRight && my>rTop && my<rBott){
            return(true);
        }
    }
    // the mouse isn't in any of the shapes
    return(false);
}

function handleMouseDown(e){
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position
    startX=parseInt(e.clientX-offsetX);
    startY=parseInt(e.clientY-offsetY);
    // test mouse position against all shapes
    // post result if mouse is in a shape
    for(var i=0;i<shapes.length;i++){
        if(isMouseInShape(startX,startY,shapes[i])){
            // the mouse is inside this shape
            // select this shape
            selectedShapeIndex=i;
            // set the isDragging flag
            isDragging=true;
            // and return (==stop looking for 
            //     further shapes under the mouse)
            return;
        }
    }
}

function handleMouseUp(e){
    // return if we're not dragging
    if(!isDragging){return;}
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging=false;
}

function handleMouseOut(e){
    // return if we're not dragging
    if(!isDragging){return;}
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging=false;
}

function handleMouseMove(e){
    // return if we're not dragging
    if(!isDragging){return;}
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position         
    mouseX=parseInt(e.clientX-offsetX);
    mouseY=parseInt(e.clientY-offsetY);
    // how far has the mouse dragged from its previous mousemove position?
    var dx=mouseX-startX;
    var dy=mouseY-startY;
    // move the selected shape by the drag distance
    var selectedShape=shapes[selectedShapeIndex];
    selectedShape.x+=dx;
    selectedShape.y+=dy;

    var selectedText=texts[selectedShapeIndex];
    selectedText.x+=dx;
    selectedText.y+=dy;
    // clear the canvas and redraw all shapes
    drawAll();
    // update the starting drag position (== the current mouse position)
    startX=mouseX;
    startY=mouseY;
}

function drawGrid(ctx, cw, ch){
    var hrule = 0;
    var lrule = 0;
    while (hrule < ch){
        ctx.setLineDash([5, 2]);
        ctx.lineWidth = 0.5;
        ctx.moveTo(0, hrule);
        ctx.lineTo(cw, hrule);
        ctx.stroke();
        hrule += gridSize;
    }

    while (lrule < cw){
        ctx.setLineDash([5, 2]);
        ctx.lineWidth = 0.5;
        ctx.moveTo(lrule, 0);
        ctx.lineTo(lrule, ch);
        ctx.stroke();
        lrule += gridSize;
    }
}

// clear the canvas and 
// redraw all shapes in their current positions
function drawAll(){
    var image = new Image();
    image.src = "../static/images/forest_map.jpg";
    
    image.onload = function () {
        ctx.drawImage(image,
             cw/ 2 - image.width / 2,
             ch/ 2 - image.height / 2
        );
        drawGrid(ctx, cw, ch)
        for(var i=0;i<shapes.length;i++){
            var shape=shapes[i];
            if(shape.radius){
                // it's a circle
                ctx.beginPath();
                ctx.arc(shape.x,shape.y,shape.radius,0,Math.PI*2);
                ctx.closePath();
                ctx.fillStyle=shape.color;
                ctx.fill();
            }else if(shape.width){
                // it's a rectangle
                ctx.fillStyle=shape.color;
                ctx.fillRect(shape.x,shape.y,shape.width,shape.height);
            }
            var txt = texts[i];
            console.log(txt)
            ctx.font = "20px serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText(txt.text, txt.x, txt.y);
        }
    }
}