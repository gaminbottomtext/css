const query = `
query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
  Page(page: $page, perPage: $perPage) {
    media(season: $season, seasonYear: $seasonYear, sort: SCORE_DESC, type: ANIME) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      averageScore
      season
      format
      status
      genres
      description
      meanScore
      episodes
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      seasonYear
      nextAiringEpisode {
        episode
        airingAt
      }
      bannerImage
      studios {
        nodes {
          name
        }
      }
      isAdult
    }
  }
}`;

function getCurrentSeason() {
    const month = new Date().getMonth() + 1; // Months are 0-indexed
    const year = new Date().getFullYear();

    let season;
    if (month >= 1 && month <= 3) {
        season = 'WINTER';
    } else if (month >= 4 && month <= 6) {
        season = 'SPRING';
    } else if (month >= 7 && month <= 9) {
        season = 'SUMMER';
    } else {
        season = 'FALL';
    }
    
    return { season, year };
}

async function fetchTopAnime() {
    const url = 'https://graphql.anilist.co';
    const { season, year } = getCurrentSeason(); // Get current season and year

    const variables = {
        page: 1,
        perPage: 10,
        season: season,
        seasonYear: year
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data)
        displayAnimes(data.data.Page.media);
    } catch (error) {
        console.error('Error fetching data from AniList:', error);
    }
}

function displayAnimes(animes) {
    const animeList = document.getElementById('anime-list');
    animeList.innerHTML = ''; // Clear previous content

    animes.forEach(anime => {
        const animeCard = document.createElement('div');
        animeCard.classList.add('anime-card');

        animeCard.innerHTML = `
            <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
            <div class="anime-title">${anime.title.romaji}</div>
            <div>Score: ${anime.averageScore || 'N/A'}</div>
            <div>Season: ${anime.season}</div>
        `;

        animeList.appendChild(animeCard);
    });
}

// Fetch and display top animes when the page loads
document.addEventListener('DOMContentLoaded', fetchTopAnime);
