// Sidebar toggle functionality
const menuOpen = document.getElementById('menu-open');
const menuClose = document.getElementById('menu-close');
const sidebar = document.querySelector('.container .sidebar');

menuOpen.addEventListener('click', () => sidebar.style.left = '0');
menuClose.addEventListener('click', () => sidebar.style.left = '-100%');

// Mood Assistant Button Toggle
let mood_btn = document.getElementById('mood_suggestion_music');
let mood_opt = document.getElementsByClassName('mood_suggestion_opt')[0];

mood_btn.addEventListener('click', () => {
    console.log("Mood button clicked");
    mood_opt.classList.toggle('active');
});

// Manual Mood Selection
let manual_btn = document.getElementById('opt1');
let manual_opt = document.getElementsByClassName('manual')[0];
let music_list = document.getElementsByClassName('music_list')[0];

manual_btn.addEventListener('click', () => {
    manual_opt.classList.toggle('active1');
    music_list.innerHTML = ''; // Clear the list when switching mood
});

// Mood buttons
let happy = document.getElementById('happy');
let sad = document.getElementById('sad');
let neutral = document.getElementById('neutral');
let energetic = document.getElementById('energetic');

let url = "json.json";

// Fetch JSON Data
fetch(url)
    .then(response => response.json())
    .then(data => {
        const moodFilters = {
            "Happy": happy,
            "Sad": sad,
            "Neutral": neutral,
            "Energetic": energetic
        };

        Object.keys(moodFilters).forEach(moodType => {
            let button = moodFilters[moodType];
            let moodArray = data.filter(song => song.Type === moodType);

            button.addEventListener('click', () => {
                music_list.innerHTML = ''; // Clear previous list
                moodArray.forEach(song => createMusicCard(song));
            });
        });
    });

// Function to Create Music Card
function createMusicCard(song) {
    const { id, Name, AuthorName, Img, audioName } = song;

    let card = document.createElement('div');
    card.classList.add('music');

    card.innerHTML = `
        <div class="info">
            <p>${id}</p>
            <img src="${Img}" alt="${Name}">
            <div class="details">
                <h5>${Name}</h5>
                <p>${AuthorName}</p>
            </div>
        </div>
        <div class="actions">
            <p>04:35</p>
            <div class="icon">
                <i class='bx bxs-right-arrow'></i>
            </div>
            <i class='bx bxs-plus-square'></i>
        </div>`;

    music_list.appendChild(card);

    // Add click event to play the song
    card.addEventListener('click', () => {
        playSelectedSong(song);
    });
}

// Function to Play Selected Song
function playSelectedSong(song) {
    const { Name, AuthorName, Img, audioName } = song;
    let player_bx = document.getElementsByClassName('music-player')[0];

    player_bx.innerHTML = `
        <div class="top-section">
            <div class="header">
                <h5>Player</h5>
                <i class='bx bxs-playlist'></i>
            </div>
            <div class="song-info">
                <img src="${Img}">
                <div class="description">
                    <h3>${Name}</h3>
                    <h5>${AuthorName}</h5>
                    <p>Best of 2024</p>
                </div>
                <div class="audio">
                    <audio id="song">
                        <source src="${audioName}">
                    </audio>
                    <input type="range" value="0" id="progress">
                </div>
            </div>
        </div>
        <div class="player-actions">
            <div class="buttons">
                <i class='bx bx-repeat'></i>
                <i class='bx bx-first-page'></i>
                <div onclick="playPause()"><i class="fa-solid fa-play" id="ctrlIcon"></i></div>
                <i class='bx bx-last-page'></i>
                <i class='bx bx-transfer-alt'></i>
            </div>
        </div>`;

    // Get the updated audio element
    let songElement = document.getElementById("song");
    let progress = document.getElementById("progress");
    let ctrlIcon = document.getElementById("ctrlIcon");

    // Load & Play the new song
    songElement.load();
    songElement.play();
    ctrlIcon.classList.remove("fa-play");
    ctrlIcon.classList.add("fa-pause");

    // Update progress bar
    songElement.onloadedmetadata = () => {
        progress.max = songElement.duration;
        progress.value = songElement.currentTime;
    };

    // Sync progress bar with song time
    setInterval(() => {
        progress.value = songElement.currentTime;
    }, 500);

    progress.onchange = function () {
        songElement.currentTime = progress.value;
        songElement.play();
    };
}

// Play/Pause Function
function playPause() {
    let song = document.getElementById("song");
    let ctrlIcon = document.getElementById("ctrlIcon");

    if (song.paused) {
        song.play();
        ctrlIcon.classList.remove("fa-play");
        ctrlIcon.classList.add("fa-pause");
    } else {
        song.pause();
        ctrlIcon.classList.add("fa-play");
        ctrlIcon.classList.remove("fa-pause");
    }
}
