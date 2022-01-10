function toggleDropDown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function toggleMonDropDown() {
  document.getElementById("monsterDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.mondropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content-monster");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }

  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


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


// save relevant information about shapes drawn on the canvas
var shapes=[];
var texts=[];
var lastMoved = -1;

function updateDbLoc(){
    if (lastMoved == -1) {
        return
    }
    else{
        let moved = shapes[lastMoved];
        locUpdate(moved.id, eid, moved.x, moved.y, moved.monster);
    }
}

function snapToGrid(){
    let circleOffset = 0;
    shapes.forEach((shape, index) =>{
        if (shape.radius) {
            circleOffset = gridSize/2;
        }
        else {
            circleOffset = 0;
        }
        shape.x = gridSize*Math.floor(shape.x/gridSize) + circleOffset;
        shape.y = gridSize*Math.floor(shape.y/gridSize) + circleOffset;
        let fixT = texts[index];
        fixT.x = shape.x;
        fixT.y = shape.y;
    })
    updateDbLoc();
    drawAll();
}

function drawInit(){
    shapes=[];
    texts=[];
    for(var i=0; i < enc_chars.length; i++){
        let char = enc_chars[i];
        var size = Math.floor(gridSize*0.5);

        // let cachedShape = window.localStorage.getItem(char.name + '.thumb') || null;

        // if (cachedShape) {
        //     let shape = JSON.parse(cachedShape);
        //     shape.radius = size;
        //     shapes.push(shape);
        // }
        // else {
        //     shapes.push( {x:i*size+gridSize/2, y:gridSize/2, radius:size, color:'blue',
        //               name: char.name} );
        // }
        shapes.push( {x:char.x, y:char.y, radius:size, color:'blue', name: char.name,
                      id:char.id, monster:false,} );

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
                texts.push({x:char.x, y:char.y, text: useName});
                assigned = true;
            }
        }
    }

    for(var i=0; i < enc_monsters.length; i++){
        let monster = enc_monsters[i];
        // let rPlace = Math.random() - 0.1; // -0.1 for character row
        // let yPos = 2*gridSize + Math.floor(rPlace*ch);
        // rPlace = Math.random() - 0.1; // -0.1 for character row
        // let xPos = 2*gridSize + Math.floor(rPlace*cw);

        // if (xPos > cw) {
        //     xPos = cw - 2*gridSize - monster.size;
        // }

        // if (yPos > ch) {
        //     yPos = ch - 2*gridSize - monster.size;
        // }

        // let cachedShape = window.localStorage.getItem(monster.name + '.thumb') || null;
        // if (cachedShape) {
        //     let shape = JSON.parse(cachedShape);
        //     shape.width = monster.size*gridSize;
        //     shape.height = monster.size*gridSize;
        //     shapes.push(shape);
        // }
        // else {
        //     shapes.push( {x:xPos, y:yPos, 
        //               width:monster.size*gridSize, height:monster.size*gridSize, 
        //               color:'red', name: monster.name} );
        // }

        // texts.push( {x:xPos, y:yPos,  
                     // text: monster.name[0] + " " + monster.id%100})

        shapes.push( {x:monster.x, y:monster.y, id:monster.id, monster:true,
                      width:monster.size*gridSize, height:monster.size*gridSize, 
                      color:'red', name: monster.name} );
        texts.push( {x:monster.x, y:monster.y,  
                     text: monster.name[0] + " " + monster.id%100})
    }
}

drawInit();
// drag related vars
var isDragging=false;
var startX,startY;

// hold the index of the shape being dragged (if any)
var selectedShapeIndex;

const monThumb = {size: 300, x: 0, y:0};

function populateLatest() {

    // populate latest selection div
    let thisIndex = selectedShapeIndex;
    let currentShape = shapes[selectedShapeIndex];
    let thisText = texts[selectedShapeIndex];

    let latestDiv = document.getElementById("lastMonster");
    latestDiv.innerHTML = "<h2>Details for " + thisText.text + "</h2>";

    let nameDiv = document.createElement("DIV");
    let nameForm = document.createElement("INPUT");
    nameForm.className="input-field";

    nameForm.setAttribute("type", "text");
    nameForm.setAttribute("size", 5);
    nameForm.setAttribute("value", thisText.text);

    let nameBtn = document.createElement("BUTTON"); // Create Button
    nameBtn.className="btn";
    

    nameBtn.textContent = "rename";
    nameBtn.className="btn";

    nameBtn.onclick = function() {
        thisText.text = nameForm.value;
        drawAll();
    };

    nameDiv.appendChild(nameForm);
    nameDiv.appendChild(nameBtn);
    latestDiv.appendChild(nameDiv);

    if (currentShape.radius) {
        let radiusDiv = document.createElement("DIV");
        let radiusForm = document.createElement("INPUT");
        radiusForm.className="input-field";

        radiusForm.setAttribute("type", "text");
        radiusForm.setAttribute("size", 5);
        radiusForm.setAttribute("value", currentShape.radius);

        let wBtn = document.createElement("BUTTON"); // Create Button
        wBtn.className="btn";

        wBtn.textContent = "Update radius";
        wBtn.className="btn";

        wBtn.onclick = function() {
            currentShape.radius = radiusForm.value;
            drawAll();
        };

        radiusDiv.appendChild(radiusForm);
        radiusDiv.appendChild(wBtn);
        latestDiv.appendChild(radiusDiv);
    }
    else {
        let widthDiv = document.createElement("DIV");
        let widthForm = document.createElement("INPUT");
        widthForm.className="input-field";

        widthForm.setAttribute("type", "text");
        widthForm.setAttribute("size", 5);
        widthForm.setAttribute("value", currentShape.width);

        let wBtn = document.createElement("BUTTON"); // Create Button
        wBtn.className="btn";

        wBtn.textContent = "Update width";
        wBtn.className="btn";

        wBtn.onclick = function() {
            currentShape.width = widthForm.value;
            drawAll();
        };

        widthDiv.appendChild(widthForm);
        widthDiv.appendChild(wBtn);
        latestDiv.appendChild(widthDiv);

        let heightDiv = document.createElement("DIV");
        let heightForm = document.createElement("INPUT");
        heightForm.className="input-field";

        heightForm.setAttribute("type", "text");
        heightForm.setAttribute("size", 5);
        heightForm.setAttribute("value", currentShape.height);

        let hBtn = document.createElement("BUTTON"); // Create Button
        hBtn.className="btn";

        hBtn.textContent = "Update height";

        hBtn.onclick = function() {
            currentShape.height = sizeForm.value;
            drawAll();
        };

        heightDiv.appendChild(heightForm);
        heightDiv.appendChild(hBtn);
        latestDiv.appendChild(heightDiv);
    }

    var smallCanvas = document.getElementById('smallCanvas');
    smallCanvas.width = latestDiv.clientWidth*0.8;
    smallCanvas.height = latestDiv.clientWidth*0.8;
    var sctx = smallCanvas.getContext('2d');
    if (currentShape.img){
        var image = new Image();
        image.src = "/uploads/"+currentShape.img;

        image.onload = function () {
            let w = image.width;
            let h = image.height;
            let ratio = w/h;
            if (w > smallCanvas.width) {
                w = smallCanvas.width;
                h = w/ratio;
            }
            if (h > smallCanvas.height) {
                h = smallCanvas.height;
                w = h/ratio;
            }

            sctx.clearRect(0, 0, smallCanvas.width, smallCanvas.height);
            sctx.drawImage(image, 0, 0, w, h);
        }
    }

    let dropDiv = document.createElement("DIV");
            
    var monImages = document.getElementsByClassName("monster-image");

    var select = document.createElement("select");
    select.name = "monImg";
    select.id = "monImg"

    for (i = 0; i < monImages.length; i++) {
        var openDropdown = monImages[i];
        var option = document.createElement("option");
        var fname = openDropdown.id;
        option.value = fname;
        option.text = fname;
        select.appendChild(option);
        if (fname == currentShape.img){
            select.selectedIndex = i;
        }
    }

    var label = document.createElement("label");
    label.innerHTML = "Choose monster img? "
    label.htmlFor = "monImg";

    dropDiv.appendChild(label).appendChild(select);

    let dropBtn = document.createElement("BUTTON");
    dropBtn.className="btn";

    let imgTools = document.createElement("DIV");
    let plus = document.createElement("BUTTON");
    plus.textContent = "-";
    plus.className="btn";
    plus.onclick = function() {
        monThumb.size = monThumb.size + gridSize/2;
        var image = new Image();
        image.src = "/uploads/"+select.value;
        
        image.onload = function () {
            handleThumnail(sctx, image, thisIndex)
        }
    }
    let minus = document.createElement("BUTTON");
    minus.textContent = "+";
    minus.className="btn";
    minus.onclick = function() {
        monThumb.size = monThumb.size - gridSize/2;
        var image = new Image();
        image.src = "/uploads/"+select.value;
        
        image.onload = function () {
            handleThumnail(sctx, image, thisIndex)
        }
    }

    let right = document.createElement("BUTTON");
    right.innerHTML = "&#8592;";
    right.className="btn";
    right.onclick = function() {
        monThumb.x = monThumb.x + gridSize/2;
        var image = new Image();
        image.src = "/uploads/"+select.value;
        
        image.onload = function () {
            handleThumnail(sctx, image, thisIndex)
        }
    }

    let left = document.createElement("BUTTON");
    left.innerHTML = "&#x2192;";
    left.className="btn";
    left.onclick = function() {
        monThumb.x = monThumb.x - gridSize/2;
        var image = new Image();
        image.src = "/uploads/"+select.value;
        
        image.onload = function () {
            handleThumnail(sctx, image, thisIndex)
        }
    }

    let up = document.createElement("BUTTON");
    up.innerHTML = "&#8595;";
    up.className="btn";
    up.onclick = function() {
        monThumb.y = monThumb.y - gridSize/2;
        var image = new Image();
        image.src = "/uploads/"+select.value;
        
        image.onload = function () {
            handleThumnail(sctx, image, thisIndex)
        }
    }

    let down = document.createElement("BUTTON");
    down.innerHTML = "&#x2191;";
    down.className="btn";
    down.onclick = function() {
        monThumb.y = monThumb.y + gridSize/2;
        var image = new Image();
        image.src = "/uploads/"+select.value;
        
        image.onload = function () {
            handleThumnail(sctx, image, thisIndex)
        }
    }

    let bind = document.createElement("BUTTON");
    bind.textContent = "useThumb";
    bind.className="btn";
    bind.onclick = function() {
        currentShape.sx = monThumb.x;
        currentShape.sy = monThumb.y;
        currentShape.sWidth = monThumb.size;
        currentShape.sHeight = monThumb.size;
        currentShape.img = select.value;
        drawAll();
        window.localStorage.setItem(currentShape.name + '.thumb', 
                                    JSON.stringify(currentShape));
    }

    imgTools.appendChild(plus)
    imgTools.appendChild(minus)
    imgTools.appendChild(up)
    imgTools.appendChild(down)
    imgTools.appendChild(left)
    imgTools.appendChild(right)
    latestDiv.appendChild(imgTools)

    dropBtn.textContent = "choose img";
    dropBtn.onclick = function() {
        imgTools.appendChild(bind)
        var image = new Image();
        image.src = "/uploads/"+select.value;
        
        image.onload = function () {
            handleThumnail(sctx, image, thisIndex)
        }
    };

    dropDiv.appendChild(dropBtn);
    latestDiv.appendChild(dropDiv);
}

function handleThumnail (sctx, image, indx) {
    let currentShape = shapes[indx];
    let scale = currentShape.radius*2 || currentShape.width;
    let sx = monThumb.x;
    let sy = monThumb.y;
    let sWidth = monThumb.size;
    let sHeight = monThumb.size;
    let dx = 0;
    let dy = 0;

    sctx.clearRect(0, 0, smallCanvas.width, smallCanvas.height);
    sctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, scale, scale);
}


// draw the shapes on the canvas
snapToGrid();
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
            populateLatest();
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
    snapToGrid();
}

function handleMouseOut(e){
    // return if we're not dragging
    if(!isDragging){return;}
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging=false;
    snapToGrid();
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

    lastMoved = selectedShapeIndex;
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
    image.src = "../static/images/"+current_map;
    
    image.onload = function () {
        ctx.drawImage(image,
             cw/ 2 - image.width / 2,
             ch/ 2 - image.height / 2
        );
        drawGrid(ctx, cw, ch)
        for(var i=0;i<shapes.length;i++){
            var shape=shapes[i];
            // window.localStorage.setItem(shape.name + '.thumb', JSON.stringify(shape));

            if(shape.img && !isDragging){
                let thumb = new Image();
                thumb.src = "/uploads/"+shape.img;
                let scale = shape.radius*2 || shape.width;
                let sx = shape.sx;
                let sy = shape.sy;
                let sWidth = shape.sWidth;
                let sHeight = shape.sHeight;
                let dx = shape.x;
                let dy = shape.y;
                if (shape.radius) {
                    dx = shape.x - gridSize/2;
                    dy = shape.y - gridSize/2;
                }

                thumb.addEventListener('load', function () {
                    ctx.drawImage(this, sx, sy, sWidth, sHeight, dx, dy, scale, scale);
                });
            }
            else if(shape.radius){
                // it's a circle
                ctx.beginPath();
                // ctx.lineWidth = 0;
                ctx.arc(shape.x,shape.y,shape.radius,0,Math.PI*2);
                // ctx.closePath();
                ctx.lineWidth = 0;
                ctx.fillStyle=shape.color;
                ctx.fill();
            }
            else if(shape.width){
                // it's a rectangle
                ctx.fillStyle=shape.color;
                ctx.fillRect(shape.x,shape.y,shape.width,shape.height);
            }
            var txt = texts[i];
            ctx.font = "20px serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText(txt.text, txt.x, txt.y);
        }
    }
}