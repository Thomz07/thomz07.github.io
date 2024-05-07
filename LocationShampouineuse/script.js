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
