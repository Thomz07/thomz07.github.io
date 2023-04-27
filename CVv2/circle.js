const circleRadius = 100;
const rotationSpeed = 0.005;
const squares = document.querySelectorAll(".square");
let angle = 0;

function rotateSquares() {
    for (let i = 0; i < squares.length; i++) {
        let currentAngle = angle + (i * (2 * Math.PI / squares.length));
        let x = circleRadius * Math.cos(currentAngle) - (squares[i].offsetWidth / 2);
        let y = circleRadius * Math.sin(currentAngle) - (squares[i].offsetHeight / 2);

        squares[i].style.transform = `translate(${x}px, ${y}px)`;
    }
    angle += rotationSpeed;

    requestAnimationFrame(rotateSquares);
}

function showText(outil, div_name) {
    document.getElementById(div_name).innerHTML = outil
}

rotateSquares();
