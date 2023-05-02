const circleRadius = 100;
const rotationSpeed = 0.005;
const squares = document.querySelectorAll(".square");
let angle = 0;

const affinity = "<strong>Affinity Photo</strong><br><br>Montages photos simples, créations de visuels pour divers projets";
const python = "<strong>Python</strong><br><br>Réalisation de script dans le cadre d'un stage dans l'automatisation de processus<br><br>Scripts d'extraction de données de PDF (+50k PDFs)";
const uipath = "<strong>UIPath</strong><br><br>Conception de workflows pour préparer le développement du robot auprès du client<br><br>Développement de plusieurs robots pour des clients dans le domaine de l'immobilier<br><br>Robot saisissant des milliers de données dans un ERP<br><br>Gestion des erreurs et rapports"
const objc = "<strong>Objective-C + Logos</strong><br><br>Conception et création de tweaks pour iPhone jailbreakés (cf précedemment)<br><br>Utilisation de <a href='https://theos.dev' target='_blank' rel='noopener noreferrer' style='text-decoration:none'>Theos</a> pour compiler les tweaks qui reprend du langage <a href='https://theos.dev/docs/logos' target='_blank' rel='noopener noreferrer' style='text-decoration:none'>Logos</a>"

let isRotating = true;
const transitionDuration = 500; 

function rotateSquares() {
    if (isRotating) {
        for (let i = 0; i < squares.length; i++) {
            let currentAngle = angle + (i * (2 * Math.PI / squares.length));
            let x = circleRadius * Math.cos(currentAngle) - (squares[i].offsetWidth / 2);
            let y = circleRadius * Math.sin(currentAngle) - (squares[i].offsetHeight / 2);

            squares[i].style.transform = `translate(${x}px, ${y}px)`;
        }
        angle += rotationSpeed;
    }

    requestAnimationFrame(rotateSquares);
}

function showText(outil, div_name) {
    let text;
    let selectedSquare;

    switch (outil) {
        case 'affinity':
            text = affinity;
            selectedSquare = document.querySelector('[src="img/affinity.png"]');
            break;
        case 'python':
            text = python;
            selectedSquare = document.querySelector('[src="img/python.png"]');
            break;
        case 'uipath':
            text = uipath;
            selectedSquare = document.querySelector('[src="img/uipath.png"]');
            break;
        case 'objc':
            text = objc;
            selectedSquare = document.querySelector('[src="img/objc.png"]');
            break;
        default:
            text = "";
    }

    if (selectedSquare && selectedSquare.classList.contains("selected")) {
        selectedSquare.classList.remove("selected");
        document.getElementById(div_name).innerHTML = "Cliquez sur une icône !";


            isRotating = true;

    } else {
        for (let square of squares) {
            square.classList.remove("selected");
        }

        if (selectedSquare) {
            isRotating = false;
            selectedSquare.classList.add("selected");
            document.getElementById(div_name).innerHTML = text;

                isRotating = true;
        }
    }
}

rotateSquares();
