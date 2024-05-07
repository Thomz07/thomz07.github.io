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
        submit();
        // Ajoute ici la logique pour traiter le formulaire, envoyer les données au serveur, etc.
    }

    // Ici, vous pourriez ajouter du code pour envoyer les informations au serveur
});

function submit(){
    var nom = document.getElementById('nom').value;
    var date = document.getElementById('date').value;
    alert('Merci, ' + nom + '! Votre réservation pour le ' + date + ' a bien été enregistrée.');
}

function applyRandomColors() {
    // Palette de couleurs prédéfinies
    var colors = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2"];

    // Fonction pour obtenir une couleur aléatoire
    function getRandomColor() {
        var randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    var couleurGlobale = getRandomColor();

    // Appliquer une couleur aléatoire au texte "SHAMPOUINEUSE"
    var shampouineuseElement = document.getElementById("SHAMPOUINEUSE");
    if (shampouineuseElement) {
        shampouineuseElement.style.color = couleurGlobale;
    }

    // Sélectionner tous les éléments boutons
    var btnElements = document.querySelectorAll('.btn, .animatedButton');

    // Appliquer des couleurs aléatoires aux boutons
    btnElements.forEach(function(btn) {
    
        btn.style.borderColor = couleurGlobale;
        btn.style.backgroundColor = couleurGlobale;
    
    });
}

// Appelle la fonction une fois le contenu chargé
document.addEventListener("DOMContentLoaded", applyRandomColors);


