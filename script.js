// Constants
const API_URL = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/";
const MAX_STAT = 255;

// DOM Elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const pokemonName = document.getElementById("pokemon-name");
const pokemonId = document.getElementById("pokemon-id");
const weightElement = document.getElementById("weight");
const heightElement = document.getElementById("height");
const typesElement = document.getElementById("types");
const hpElement = document.getElementById("hp");
const attackElement = document.getElementById("attack");
const defenseElement = document.getElementById("defense");
const specialAttackElement = document.getElementById("special-attack");
const specialDefenseElement = document.getElementById("special-defense");
const speedElement = document.getElementById("speed");
const spriteContainer = document.querySelector(".sprite-container");

searchButton.addEventListener("click", searchPokemon);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchPokemon();
  }
});

// Functions
async function searchPokemon() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  if (!searchTerm) {
    return;
  }

  try {
    addLoadingAnimation();

    const response = await fetch(`${API_URL}${searchTerm}`);

    if (!response.ok) {
      throw new Error("Pokémon not found");
    }

    const data = await response.json();
    displayPokemonData(data);
  } catch (error) {
    console.error("Error:", error);
    alert("Pokémon not found");
    resetDisplay();
  } finally {
    removeLoadingAnimation();
  }
}

function addLoadingAnimation() {
  document.body.classList.add("loading");

  const spinner = document.createElement("div");
  spinner.className = "loading-spinner";
  spriteContainer.innerHTML = "";
  spriteContainer.appendChild(spinner);

  document.querySelectorAll(".stat-bar").forEach((bar) => {
    bar.style.width = "0%";
  });
}

function removeLoadingAnimation() {
  document.body.classList.remove("loading");
}

function displayPokemonData(pokemon) {
  pokemonName.textContent = pokemon.name.toUpperCase();
  pokemonId.textContent = `#${pokemon.id}`;
  weightElement.textContent = `Weight: ${pokemon.weight}`;
  heightElement.textContent = `Height: ${pokemon.height}`;

  typesElement.innerHTML = "";
  pokemon.types.forEach((typeInfo) => {
    const typeElement = document.createElement("span");
    typeElement.textContent = typeInfo.type.name.toUpperCase();
    typeElement.className = `type-badge type-${typeInfo.type.name.toLowerCase()}`;
    typesElement.appendChild(typeElement);
  });

  spriteContainer.innerHTML = "";
  const spriteImg = document.createElement("img");
  spriteImg.id = "sprite";
  spriteImg.src = pokemon.sprites.front_default;
  spriteImg.alt = pokemon.name;
  spriteContainer.appendChild(spriteImg);

  const stats = pokemon.stats;

  const hpStat = stats.find((stat) => stat.stat.name === "hp");
  hpElement.textContent = hpStat.base_stat;
  animateStatBar(".hp-bar", hpStat.base_stat);

  const attackStat = stats.find((stat) => stat.stat.name === "attack");
  attackElement.textContent = attackStat.base_stat;
  animateStatBar(".attack-bar", attackStat.base_stat);

  const defenseStat = stats.find((stat) => stat.stat.name === "defense");
  defenseElement.textContent = defenseStat.base_stat;
  animateStatBar(".defense-bar", defenseStat.base_stat);

  const specialAttackStat = stats.find(
    (stat) => stat.stat.name === "special-attack"
  );
  specialAttackElement.textContent = specialAttackStat.base_stat;
  animateStatBar(".special-attack-bar", specialAttackStat.base_stat);

  const specialDefenseStat = stats.find(
    (stat) => stat.stat.name === "special-defense"
  );
  specialDefenseElement.textContent = specialDefenseStat.base_stat;
  animateStatBar(".special-defense-bar", specialDefenseStat.base_stat);

  const speedStat = stats.find((stat) => stat.stat.name === "speed");
  speedElement.textContent = speedStat.base_stat;
  animateStatBar(".speed-bar", speedStat.base_stat);

  addDataRevealAnimation();
}

function animateStatBar(selector, value) {
  const bar = document.querySelector(selector);
  const percentage = (value / MAX_STAT) * 100;

  const cappedPercentage = Math.min(percentage, 100);

  setTimeout(() => {
    bar.style.width = `${cappedPercentage}%`;
  }, 50);
}

function addDataRevealAnimation() {
  const elements = document.querySelectorAll(
    ".pokemon-identity, .data-item, .stat-item"
  );

  elements.forEach((element, index) => {
    element.classList.remove("data-reveal");

    void element.offsetWidth;

    element.style.animationDelay = `${index * 0.05}s`;
    element.classList.add("data-reveal");
  });
}

function resetDisplay() {
  pokemonName.textContent = "––––––";
  pokemonId.textContent = "#–––";
  weightElement.textContent = "–––";
  heightElement.textContent = "–––";
  typesElement.innerHTML = "";
  hpElement.textContent = "–––";
  attackElement.textContent = "–––";
  defenseElement.textContent = "–––";
  specialAttackElement.textContent = "–––";
  specialDefenseElement.textContent = "–––";
  speedElement.textContent = "–––";

  spriteContainer.innerHTML = "";

  document.querySelectorAll(".stat-bar").forEach((bar) => {
    bar.style.width = "0%";
  });
}

const style = document.createElement("style");
style.textContent = `
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(5, 217, 232, 0.3);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s infinite linear;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .data-reveal {
    animation: revealData 0.5s forwards;
    opacity: 0;
    transform: translateY(10px);
  }
  
  @keyframes revealData {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

function init() {
  searchInput.focus();

  document.addEventListener("DOMContentLoaded", addSoundEffects);
}

function addSoundEffects() {
  searchButton.addEventListener("mousedown", () => {
    playSound(220, 0.05);
  });

  searchInput.addEventListener("focus", () => {
    playSound(440, 0.05);
  });
}

function playSound(frequency, duration) {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.1;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + duration
    );

    setTimeout(() => {
      oscillator.stop();
    }, duration * 1000);
  } catch (e) {
    console.log("Audio context not supported");
  }
}

init();
