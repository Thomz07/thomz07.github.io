document.getElementById('reservation-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    var nom = document.getElementById('nom').value;
    var date = document.getElementById('date').value;

    alert('Merci, ' + nom + '! Votre réservation pour le ' + date+ ' a bien été enregistrée.');

    // Ici, vous pourriez ajouter du code pour envoyer les informations au serveur
});
