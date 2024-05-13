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
        document.getElementById("boutonRéservation").style.opacity = 0.3;
        submitForm();
    }
});

function submitForm(){
    var nom = document.getElementById('nom').value;
    var date = document.getElementById('date').value;
    var phone = document.getElementById('number').value;

    var googleScriptURL = "https://script.google.com/macros/s/AKfycbxF9v-wX1vLj3LD0hheCQpXjnmMvSfWW5IAxxFftIVKm7LGhh1wEE97i8NeaUYs3OhJlw/exec";

    fetch(googleScriptURL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({date: date, name: nom, phone: phone}).toString(),
    }).then(response => response.text())
      .then((responseText) => {
        alert(responseText); // fix car c'est vide
          if (responseText === "DateAlreadyBooked") {
              alert('Cette date est déjà réservée. Veuillez choisir une autre date.');
          } else {
              alert('Merci, ' + nom + '! Votre réservation pour le ' + date + ' a bien été enregistrée.');
              document.location.href = "remerciements.html";
          }
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

    var phoneNumber = document.getElementById("phoneNumber");
    if (phoneNumber) {
        phoneNumber.style.color = couleurGlobale;
        phoneNumber.style.textDecoration = "none";
    }

    var howtouse = document.getElementById("howtouse");
    if (howtouse) {
        howtouse.style.color = couleurGlobale;
        howtouse.style.textDecoration = "none";
    }

    var btnElements = document.querySelectorAll('.btn, .animatedButton');

    btnElements.forEach(function(btn) {
    
        btn.style.borderColor = couleurGlobale;
        btn.style.backgroundColor = couleurGlobale;
    
    });
}

document.addEventListener("DOMContentLoaded", applyRandomColors);


