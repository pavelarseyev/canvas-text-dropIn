let textContainer = document.querySelectorAll(".canvas-text");

//resize
window.addEventListener("resize", function() {
    createCanvasText(textContainer);
});

//load
window.addEventListener("load", function() {
    createCanvasText(textContainer);
    setTimeout(function() {
        showText(textContainer);
    }, 100);
});

//scroll
window.addEventListener("scroll", function() {
    showText(textContainer);
});

function createCanvasText(items) {
    [...items].forEach( (item, i) => {
        wrapText(item);
    });
}

function wrapText(item) {
    Array.from(item.querySelectorAll(".canvas-wrapper")).forEach(i => i.remove());
    let itemStyles = window.getComputedStyle(item);
    let color = getItemsColor(item, itemStyles);        
    let text = item.textContent.trim();
    let fontsize = itemStyles.fontSize;
    let fontfamily = itemStyles.fontFamily;
    let fontweight = itemStyles.fontWeight;
    let lineheight = parseInt(itemStyles.lineHeight);
    let textalign = itemStyles.textAlign;

    let canvasWrapper = document.createElement("div");
    canvasWrapper.classList.add("canvas-wrapper");


    let canvas = document.createElement("canvas");
    
    let ctx = canvas.getContext("2d");

    let spacingWidth = ctx.measureText(" ").width + 2;
    let maxWidth = item.offsetWidth + spacingWidth;

    let counter = 0;
    let yForCanvas = 0;
    let yForText = parseInt(fontsize);
    let xForText = textalign === "center" ? maxWidth / 2 : 0;
    
    let words = text.replace(/(\s{2,})+/g, " ").split(' ');    
    let line = '';

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + " ";
        let testWidth = ctx.measureText(testLine).width;
        
        if (testWidth >= maxWidth && n > 0) {
            canvasWrapper = document.createElement("div");
            canvasWrapper.classList.add("canvas-wrapper");

            canvas = document.createElement("canvas");
            ctx = canvas.getContext("2d");
            line = words[n] + " ";
            yForCanvas += lineheight;
            counter++;
        } else {
            line = testLine;
            canvas.height = lineheight;
            canvas.width = maxWidth;

            ctx.font = fontweight + " " + fontsize + " " + fontfamily;
            ctx.textAlign = textalign === "center" ? textalign : "start";
            ctx.fillStyle = color;
            canvasWrapper.style.top = `${yForCanvas}px`;
            canvas.style.cssText = `transition-delay: ${counter/10 * 3}s`;
            
            ctx.fillText(line, xForText, yForText);
            canvasWrapper.appendChild(canvas);
            item.appendChild(canvasWrapper);
        }
    }
}

function showText(itemsList) {
    [...itemsList].forEach(item => {
        let top = item.getBoundingClientRect().top;  

        if(top < window.innerHeight * 0.66) {
            item.classList.add("loaded");
        }
    });
}

function getItemsColor(item, itemStyles) {
    let color;
    
    if(!item.getAttribute("data-color")){
        color = itemStyles.color;
        item.style.color = "transparent";
        item.setAttribute("data-color", color);
    } else {
        color = item.getAttribute("data-color");
    }
    
    return color || false;
} 
