document.addEventListener("DOMContentLoaded", function() {
    const stationList = document.getElementById('station-list');
    const favoritesList = document.getElementById('favorites-list');

    // Fonction pour récupérer les informations des stations et le statut des vélos
    function fetchData() {
        Promise.all([
            fetch('https://api.saint-etienne-metropole.fr/velivert/api/station_information.json').then(response => response.json()),
            fetch('https://api.saint-etienne-metropole.fr/velivert/api/free_bike_status.json').then(response => response.json())
        ])
        .then(([stationData, bikeData]) => {
            const stations = stationData.data.stations;
            const bikes = bikeData.data.bikes;

            // Créer un objet pour compter les vélos disponibles par station
            const bikeCountByStation = {};

            bikes.forEach(bike => {
                if (bike.station_id) {
                    if (!bikeCountByStation[bike.station_id]) {
                        bikeCountByStation[bike.station_id] = 0;
                    }
                    bikeCountByStation[bike.station_id]++;
                }
            });

            // Vider la liste avant de la remplir
            stationList.innerHTML = '';
            const favorites = getFavorites();

            stations.forEach(station => {
                const stationDiv = document.createElement('div');
                stationDiv.className = 'station';
                const bikeCount = bikeCountByStation[station.station_id] || 0;
                const isFavorite = favorites.includes(station.station_id);
                stationDiv.innerHTML = `
                    <h3>${station.name} <button class="favorite-btn out-favorite">${isFavorite ? '★' : '✰'}</button></h3>
                    <p>${bikeCount} vélos disponibles </p>
                `;
                stationDiv.style.display = isFavorite ? "none" : "block";

                // Ajouter un gestionnaire d'événement pour le bouton favori
                const favoriteBtn = stationDiv.querySelector('.favorite-btn');
                favoriteBtn.addEventListener('click', () => {
                    toggleFavorite(station.station_id);
                });

                stationList.appendChild(stationDiv);
            });

            // Mettre à jour la section favoris
            updateFavoritesList(stations, bikeCountByStation);
        })
        .catch(error => console.error('Erreur:', error));
    }

    // Fonction pour obtenir les favoris depuis le localStorage
    function getFavorites() {
        return JSON.parse(localStorage.getItem('favorites')) || [];
    }

    // Fonction pour sauvegarder les favoris dans le localStorage
    function saveFavorites(favorites) {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Fonction pour ajouter ou retirer une station des favoris
    function toggleFavorite(stationId) {
        let favorites = getFavorites();
        if (favorites.includes(stationId)) {
            favorites = favorites.filter(id => id !== stationId);
        } else {
            favorites.push(stationId);
        }
        saveFavorites(favorites);
        fetchData(); // Re-fetch data to update both sections
    }

    // Fonction pour mettre à jour la section des favoris
    function updateFavoritesList(stations, bikeCountByStation) {
        const favorites = getFavorites();
        favoritesList.innerHTML = '';

        favorites.forEach(favoriteId => {
            const station = stations.find(station => station.station_id === favoriteId);
            if (station) {
                const stationDiv = document.createElement('div');
                stationDiv.className = 'station';
                const bikeCount = bikeCountByStation[station.station_id] || 0;
                stationDiv.innerHTML = `
                    <h3>${station.name} <button class="favorite-btn in-favorite">★</button></h3>
                    <p>${bikeCount} vélos disponibles </p>
                    
                `;

                // Ajouter un gestionnaire d'événement pour le bouton favori
                const favoriteBtn = stationDiv.querySelector('.favorite-btn');
                favoriteBtn.addEventListener('click', () => {
                    toggleFavorite(station.station_id);
                });

                favoritesList.appendChild(stationDiv);
            }
        });
    }

    // Appeler la fonction fetchData une première fois
    fetchData();

    // Mettre à jour les données toutes les 30 secondes
    setInterval(fetchData, 30000); // 30000 millisecondes = 30 secondes
});
