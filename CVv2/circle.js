const circleRadius = 100;
const rotationSpeed = 0.005;
const squares = document.querySelectorAll(".square");
let angle = 0;

const affinity = "<strong>Affinity Photo</strong><br><br>Réalisation de montages photos simples et création de visuels pour divers projets";
const python = "<strong>Python</strong><br><br>Développement de scripts pour automatiser des processus lors d'un stage<br><br>Extraction de données à partir de plus de 50 000 PDFs";
const uipath = "<strong>UIPath</strong><br><br>Élaboration de workflows pour préparer le développement de robots pour les clients<br><br>Développement de robots pour des clients dans le secteur immobilier<br><br>Automatisation de la saisie de milliers de données dans un ERP<br><br>Gestion des erreurs et création de rapports";
const objc = "<strong>Objective-C + Logos</strong><br><br>Conception et développement de tweaks pour iPhone jailbreakés (voir précédemment)<br><br>Utilisation de <a href='https://theos.dev' target='_blank' rel='noopener noreferrer' style='text-decoration:none'>Theos</a> pour compiler les tweaks avec le langage <a href='https://theos.dev/docs/logos' target='_blank' rel='noopener noreferrer' style='text-decoration:none'>Logos</a>";
const robocorp = "<strong>Robocorp</strong><br><br>Obtention des 4 certifications disponibles sur le site Robocorp et développement de divers petits robots pour m'entraîner";
const html = "<strong>HTML/CSS/JS</strong><br><br>Création de sites web variés depuis 5 ans, incluant des portfolios comme celui-ci, ainsi que des sites pour des interfaces ou projets scolaires";

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
        case 'robocorp':
            text = robocorp;
            selectedSquare = document.querySelector('[src="img/robocorp.png"]');
            break;
        case 'html':
            text = html;
            selectedSquare = document.querySelector('[id="html-css-js-img"]');
            break;
        default:
            text = "";
    }

    if (selectedSquare && selectedSquare.classList.contains("selected")) {
        selectedSquare.classList.remove("selected");
        document.getElementById(div_name).innerHTML = "<strong>Cliquez sur une icône !</strong>";


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
