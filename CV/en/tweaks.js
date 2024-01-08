const allTweaks = document.querySelectorAll(".tweak-icons");

function showTweakText(outil, tweakname_div, tweak_description) {
    const multipla = "<strong><a href='https://chariz.com/buy/multipla' target='_blank' rel='noopener noreferrer' style='text-decoration:none'>Multipla</a></strong> - power to your dock"
    const cenamo = "<strong><a href='https://chariz.com/get/cenamo' target='_blank' rel='noopener noreferrer' style='text-decoration:none'>Cenamo</a></strong> - battery right on your dock"
    const folded = "<strong><a href='https://repo.packix.com/package/xyz.burritoz.thomz.folded' target='_blank' rel='noopener noreferrer' style='text-decoration:none'>Folded</a></strong> - folders, your way"

    const multipla_description = "Multipla is a tweak for jailbroken iPhones that enhances the dock by adding widgets to it.<br>Among the features, we find various widgets (music, weather, battery, etc.), dock customization, floating dock activation and an API to integrate your own widgets."
    const cenamo_description = "Cenamo is a tweak that allows you to display the battery directly on the dock of your iOS device. It offers two modes: battery level and battery status. Cenamo is compatible with most dock tweaks. Among the customization options, it includes adjusting transparency and customizing colors."
    const folded_description = "Folded is a tweak that allows you to customize your folders on iOS with a multitude of options and features. You can customize the layout of folders, the size and position of frames, folder icons, color and appearance, etc. Folded also offers options to share and import/export folder configurations via a unique string containing your settings."

    let text;
    let selectedSquare;

    switch (outil) {
        case 'multipla':
            text = multipla;
            description = multipla_description;
            selectedSquare = document.querySelector('[id="multipla"]');
            document.querySelector('[id="screenshot1"]').src = "img/multipla-2.0-1.jpg";
            document.querySelector('[id="screenshot2"]').src = "img/multipla-2.0-2.jpg";
            document.querySelector('[id="screenshot3"]').src = "img/multipla-2.0-3.jpg";
            document.querySelector('[id="screenshot4"]').src = "img/multipla-2.0-4.jpg";
            document.querySelector('[id="screenshot5"]').style.display = "inline-block";
            document.querySelector('[id="screenshot6"]').style.display = "inline-block";
            document.querySelector('[id="screenshot5"]').src = "img/multipla-2.0-5.jpg";
            document.querySelector('[id="screenshot6"]').src = "img/multipla-2.0-6.jpg";
            document.querySelector('[id="prev-button"]').style.display = "inline-block";
            document.querySelector('[id="next-button"]').style.display = "inline-block";
            break;
        case 'cenamo':
            text = cenamo;
            description = cenamo_description;
            selectedSquare = document.querySelector('[id="cenamo"]');
            document.querySelector('[id="screenshot1"]').src = "img/cenamo-1.jpg";
            document.querySelector('[id="screenshot2"]').src = "img/cenamo-2.jpg";
            document.querySelector('[id="screenshot3"]').src = "img/cenamo-3.jpg";
            document.querySelector('[id="screenshot4"]').src = "img/cenamo-4.jpg";
            document.querySelector('[id="screenshot5"]').style.display = "none";
            document.querySelector('[id="screenshot6"]').style.display = "none";
            document.querySelector('[id="prev-button"]').style.display = "none";
            document.querySelector('[id="next-button"]').style.display = "none";
            break;
        case 'folded':
            text = folded;
            description = folded_description;
            selectedSquare = document.querySelector('[id="folded"]');
            document.querySelector('[id="screenshot1"]').src = "img/folded-0.png";
            document.querySelector('[id="screenshot2"]').src = "img/folded-1.png";
            document.querySelector('[id="screenshot3"]').src = "img/folded-2.png";
            document.querySelector('[id="screenshot4"]').src = "img/folded-3.png";
            document.querySelector('[id="screenshot5"]').style.display = "none";
            document.querySelector('[id="screenshot6"]').style.display = "none";
            document.querySelector('[id="prev-button"]').style.display = "none";
            document.querySelector('[id="next-button"]').style.display = "none";
            break;
        default:
            text = "";
    }

    if (selectedSquare && selectedSquare.classList.contains("tweaks-selected")) {
        selectedSquare.classList.remove("tweaks-selected");
        selectedSquare.classList.add("tweak-icons-hover-not-selected");
        selectedSquare.classList.remove("tweak-icons-hover-selected");
        document.getElementById(tweakname_div).innerHTML = "<strong>Click on a tweak icon !</strong>";
        document.getElementById(tweak_description).innerHTML = "...";
        document.querySelector('[id="screenshot1"]').style.display = "none";
        document.querySelector('[id="screenshot2"]').style.display = "none";
        document.querySelector('[id="screenshot3"]').style.display = "none";
        document.querySelector('[id="screenshot4"]').style.display = "none";
        document.querySelector('[id="screenshot5"]').style.display = "none";
        document.querySelector('[id="screenshot6"]').style.display = "none";
        document.querySelector('[id="prev-button"]').style.display = "none";
        document.querySelector('[id="next-button"]').style.display = "none";

    } else {

        for (let square of allTweaks) {
            square.classList.remove("tweaks-selected");
            square.classList.add("tweak-icons-hover-not-selected");
            square.classList.remove("tweak-icons-hover-selected");
        }

        if (selectedSquare) {
            selectedSquare.classList.add("tweaks-selected");
            selectedSquare.classList.add("tweak-icons-hover-selected");
            selectedSquare.classList.remove("tweak-icons-hover-not-selected");
            document.getElementById(tweakname_div).innerHTML = text;
            document.getElementById(tweak_description).innerHTML = description;
            document.querySelector('[id="screenshot1"]').style.display = "inline-block";
            document.querySelector('[id="screenshot2"]').style.display = "inline-block";
            document.querySelector('[id="screenshot3"]').style.display = "inline-block";
            document.querySelector('[id="screenshot4"]').style.display = "inline-block";

        }
    }
}