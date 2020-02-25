let textContainer = document.querySelectorAll(".canvas-text");

//resize
window.addEventListener("resize", function() {
    createCanvasText(textContainer);
});

//load
window.addEventListener("load", function() {
    createCanvasText(textContainer);
    showText(textContainer);
});

window.addEventListener("scroll", function() {
    showText(textContainer);
});

function createCanvasText(items) {
    [...items].forEach( (item, i) => {
        Array.from(item.querySelectorAll(".canvas-wrapper")).forEach(i => i.remove());

        let maxWidth = item.offsetWidth;
        let text = item.textContent.trim();
        let itemStyles = window.getComputedStyle(item);
        let fontsize = itemStyles.fontSize;
        let fontfamily = itemStyles.fontFamily;
        let fontweight = itemStyles.fontWeight;
        let lineheight = itemStyles.lineHeight;
        let color = itemStyles.color;
    
        wrapText(item, text, maxWidth, fontfamily, fontsize, lineheight, fontweight, color);
    });
}

function wrapText( element, text, maxWidth, fontFamily, fontSize, lineHeight, fontWeight, color) {
    let canvasWrapper = document.createElement("div");
    canvasWrapper.classList.add("canvas-wrapper");


    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    let spacingWidth = ctx.measureText(" ").width + 2;

    let counter = 0;
    let yForCanvas = 0;
    let yForText = parseInt(fontSize);
    
    let words = text.replace(/(\s{2,})+/g, " ").split(' ');    
    let line = '';

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + " ";
        let testWidth = ctx.measureText(testLine).width;
        
        if (testWidth >= maxWidth+spacingWidth && n > 0) {
            canvasWrapper = document.createElement("div");
            canvasWrapper.classList.add("canvas-wrapper");

            canvas = document.createElement("canvas");
            ctx = canvas.getContext("2d");
            line = words[n] + " ";
            yForCanvas += parseInt(lineHeight);
            counter++;
        } else {
            line = testLine;
            canvas.height = parseInt(lineHeight);
            canvas.width = maxWidth;
            ctx.font = fontWeight + " " + fontSize + " " + fontFamily;
            
            // ctx.fillStyle = color;
            ctx.fillStyle = "black";
            canvasWrapper.style.top = `${yForCanvas}px`;
            canvas.style.cssText = `transition-delay: ${counter/10 * 3}s`;
            
            ctx.fillText(line, 0, yForText);
            canvasWrapper.appendChild(canvas);
            element.appendChild(canvasWrapper);
        }
    }
}

function showText(list) {
    [...list].forEach(item => {
        let top = item.getBoundingClientRect().top;  

        if(top < window.innerHeight * 0.66) {
            item.classList.add("loaded");
        }
    });
}
