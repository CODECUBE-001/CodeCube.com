window.onload = function() {
    let canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    let cw = canvas.width;
    let ch = canvas.height;
    let fontsize = 12;
    let fontface = 'verdana';
    let lineHeight = parseInt(fontsize * 1.286);
    let text = 'I love codin2g so much😁 that I want to work with Google ,I am a Programmer my name is Trust Akalonu, I am in Jss 3 currently. My senior brother Raymond started teaching me this year around May😄 ,So this my second canvas code I just created it';
    let words = text.split(' ');
    let wordsWidths = [];
    ctx.font = fontsize + 'px' + fontface;

    for (let word of words) wordsWidths.push(ctx.measureText(word).width);

    let spaceWidth = ctx.measureText(' ');
    let wordIndex = 0;
    let data = [];
    //Draw heart

    ctx.scale(3, 3);
    ctx.beginPath();
    ctx.moveTo(75, 40);
    ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
    ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
    ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
    ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
    ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
    ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    //put text

    ctx.fillStyle = 'white';
    let imgDataData = ctx.getImageData(0, 0, cw, ch).data;

    for (let i = 0; i < imgDataData.length; i += 4)
        data.push(imgDataData[i + 3]);


    ! function() {
        drawStar(75, 75, 5, 50, 25, 'mediumseagreen', 'gray', 9);
        drawStar(150, 200, 8, 50, 25, 'skyblue', 'gray', 3);
        drawStar(225, 75, 16, 50, 20, 'coral', 'transparent', 0);
        drawStar(300, 200, 16, 50, 40, 'gold', 'gray', 3);


        function drawStar(centerX, centerY, points, outer, inner, fill, stroke, line) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY + outer);

            for (let i = 0; i < 2 * points + 1; i++) {
                let r = (!i % 2) ? outer : inner;
                let a = Math.PI * i / points;
                ctx.lineTo(centerX + r * Math.sin(a), centerY + r * Math.cos(a));
            }

            ctx.closePath();
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = line;
            ctx.stroke();
        }
    }();

};