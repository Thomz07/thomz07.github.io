const circleRadius = 100;
const rotationSpeed = 0.005;
const squares = document.querySelectorAll(".square");
let angle = 0;

const affinity = "<strong>Affinity Photo</strong><br><br>Creation of simple photo montages and design of visuals for various projects.";
const python = "<strong>Python</strong><br><br>Development of scripts to automate processes during an internship<br><br>Data extraction from over 50,000 PDFs";
const uipath = "<strong>UIPath</strong><br><br>Designing workflows to prepare for the development of robots for clients<br><br>Development of robots for clients in the real estate sector<br><br>Automation of the entry of thousands of data points into an ERP<br><br>Error management and report creation";
const objc = "<strong>Objective-C + Logos</strong><br><br>Design and development of tweaks for jailbroken iPhones in Objective C and C++<br><br>Use of <a href='https://theos.dev' target='_blank' rel='noopener noreferrer' style='text-decoration:none'>Theos</a> to compile tweaks with the <a href='https://theos.dev/docs/logos' target='_blank' rel='noopener noreferrer' style='text-decoration:none'>Logos</a> language.<br><br>(More information in the following window)";
const robocorp = "<strong>Robocorp</strong><br><br>Achieving the 4 certifications available on the Robocorp website and developing various small robots for practice.";
const html = "<strong>HTML/CSS/JS</strong><br><br>Creation of various websites for 5 years, including portfolios like this one, as well as sites for interfaces or school projects.";
const gsuite = "<strong>G suite / Suite Office</strong><br><br>Proficiency in G Suite and Microsoft Office suites: Google Docs, Sheets, Slides, Forms, as well as Word, Excel, and PowerPoint."

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
        case 'gsuite':
            text = gsuite;
            selectedSquare = document.querySelector('[id="gsuite-img"]');
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
