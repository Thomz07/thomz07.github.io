document.getElementById('reservation-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    var dateInput = document.getElementById('date');
    var numberInput = document.getElementById('number');
    var errorMessage = document.getElementById('error-message');

    var datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    var numberPattern = /^\d{2}([ .-]?)\d{2}\1\d{2}\1\d{2}\1\d{2}$/;

    if (!numberPattern.test(numberInput.value)) {
        errorMessage.innerText = numberInput.dataset.errorMessage;
        errorMessage.style.display = 'block';
    } else if (!datePattern.test(dateInput.value)) {
        errorMessage.innerText = dateInput.dataset.errorMessage;
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';
        submitForm();
        // Ajoute ici la logique pour traiter le formulaire, envoyer les données au serveur, etc.
    }
});

function submitForm(){
    var nom = document.getElementById('nom').value;
    var date = document.getElementById('date').value;
    var phone = document.getElementById('number').value;

    var googleScriptURL = "https://script.google.com/macros/s/AKfycbzj3IbMDjOIKBpFgLQcu1j77X8VwTaWKmVN-1QAw8Gd42yj5NIfql0RxWdLopuLGVt6xw/exec";

    fetch(googleScriptURL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({date: date, name: nom, phone: phone}).toString(),
    }).then(() => {
        alert('Merci, ' + nom + '! Votre réservation pour le ' + date + ' a bien été enregistrée.');
        document.location.href = "remerciements.html"
    }).catch(() => {
        alert('Erreur lors de l\'enregistrement des données');
    });
}

function applyRandomColors() {

    var colors = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2"];

    function getRandomColor() {
        var randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    var couleurGlobale = getRandomColor();

    var shampouineuseElement = document.getElementById("SHAMPOUINEUSE");
    if (shampouineuseElement) {
        shampouineuseElement.style.color = couleurGlobale;
    }

    var btnElements = document.querySelectorAll('.btn, .animatedButton');

    btnElements.forEach(function(btn) {
    
        btn.style.borderColor = couleurGlobale;
        btn.style.backgroundColor = couleurGlobale;
    
    });
}

document.addEventListener("DOMContentLoaded", applyRandomColors);


