document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("tweak-screenshots-container");
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");
    const images = document.querySelectorAll(".screenshots");
  
    let currentIndex = 0;
  
    function scrollToImage(index) {
      images[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      currentIndex = index;
      updateButtons();
    }
  
    prevButton.addEventListener("click", function() {
      if (currentIndex > 0) {
        scrollToImage(currentIndex - 1);
      }
    });
  
    nextButton.addEventListener("click", function() {
      if (currentIndex < images.length - 1) {
        scrollToImage(currentIndex + 1);
      }
    });
  
    updateButtons();
  });
  