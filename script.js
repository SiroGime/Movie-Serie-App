const DISCOVERMOVIE = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=";
const DISCOVERTV = "https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=";
const DISCOVERGENRE = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=2&with_genres=16";
const IMGPATHMOVIE = "https://image.tmdb.org/t/p/w1280";
const GENRESMOVIE = "https://api.themoviedb.org/3/genre/movie/list?api_key=04c35731a5ee918f014970082a0088b1";
const GENRESTV = "https://api.themoviedb.org/3/genre/tv/list?api_key=04c35731a5ee918f014970082a0088b1";
const SEARCHMOVIE = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";
const SEARCHTV = "https://api.themoviedb.org/3/search/tv?&api_key=04c35731a5ee918f014970082a0088b1&query=";
const containerEl = document.querySelector('main');
const movieSelect = document.getElementById('movies');
const serieSelect = document.getElementById('series');
const inputEl = document.getElementById('input');
const pageContainerEl = document.getElementById('page-container');
const previousBtn = document.getElementById('previous');
const numPage = document.getElementById('num-page');
const nextBtn = document.getElementById('next');
const genreBtn = document.getElementById('genre');
const rightEl = document.getElementById('right');
const containerGenresEl = document.getElementById('container-genres');
const genresLeftEl = document.getElementById('left-genres');
const genresCenterEl = document.getElementById('center-genres');
const genresRightEl = document.getElementById('right-genres');
const selectEl = document.getElementById('selected');
const nameGenreEl = document.getElementById('name-genre');
const containerInfo = document.getElementById('container-info');
let movieActive = true;
let serieActive = false;
let genreActive = false;

const getMovies = async(url) => {
    const res = await fetch(url);
    const data = await res.json()    
    return data.results;
};

const getGenres = async(url) => {
    const res = await fetch(url);
    const data = await res.json()
    return data.genres;
};

const allMovies = async(page, id, search) => {
    if(id && page){
        const movies = await getMovies(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=${String(page)}&with_genres=${String(id)}`);
        return movies;
    }else if(page){
        const movies = await getMovies(DISCOVERMOVIE + String(page));
        return movies;
    }else {
        return search;
    }
};

const allSeries = async(page, id, search) => {
    if(id && page){
        const movies = await getMovies(`https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=${String(page)}&with_genres=${String(id)}`);
        return movies;
    }else if(page){
        const movies = await getMovies(DISCOVERTV + String(page));
        return movies;
    }else {
        return search;
    }
};

const showMovies = async(page, id, search) => {    
    const movies = await allMovies(page, id, search);
    containerEl.innerHTML = ``;    
    movies.forEach(movie => {
        const { title, poster_path, vote_average, 
        release_date, overview, backdrop_path, genre_ids} = movie;        
        const movieSerieEl = document.createElement('div');
        movieSerieEl.classList.add('movie');
        movieSerieEl.setAttribute('id', 'movie');        
        movieSerieEl.innerHTML = `
        <div class="${poster_path ? 'img-movie' : 'no-image'}">
        <img
        src="${poster_path ? IMGPATHMOVIE + poster_path : ''}"
        alt="${title}"
        >
        </div>
        <div class="movie-info">
        <h3 class="title">${title}</h3>
        <span class="rating ${colorRating(vote_average)}">
        ${vote_average}
        </span>
        </div>
        `;        
        containerEl.appendChild(movieSerieEl);
        movieSerieEl.addEventListener('click', () => {
            containerGenresEl.classList.remove('active');
            showInfo(title, vote_average, release_date, overview, backdrop_path, genre_ids); 
        });
    });  
};

const showSeries = async(page, id, search) => {    
    const series = await allSeries(page, id, search);
    containerEl.innerHTML = ``;    
    series.forEach(serie => {
        const { name, poster_path, vote_average,
        first_air_date, overview, backdrop_path, genre_ids } = serie;        
        const movieSerieEl = document.createElement('div');
        movieSerieEl.classList.add('movie');
        movieSerieEl.setAttribute('id', 'movie');
        movieSerieEl.innerHTML = `
        <div class="${poster_path ? 'img-movie' : 'no-image'}">
        <img
        src="${poster_path ? IMGPATHMOVIE + poster_path : ''}"
        alt="${name}"
        >
        </div>
        <div class="movie-info">
        <h3 class="title">${name}</h3>
                <span class="rating ${colorRating(vote_average)}">
                    ${vote_average}
                </span>
            </div>
        `;        
        containerEl.appendChild(movieSerieEl);
        movieSerieEl.addEventListener('click', () => {
            showInfo(name, vote_average, first_air_date, overview, backdrop_path, genre_ids); 
            containerGenresEl.classList.remove('active');
        });
    });
};

const showInfo = async(title, vote_average, release_date, overview, backdrop_path, genre_ids) => {
    containerInfo.innerHTML = ``;
    const allInfoMovieEl = document.createElement('div');
    allInfoMovieEl.classList.add('all-info-movie');
    let genresName = [];
    if(movieActive){
        const genres = await getGenres(GENRESMOVIE);
        genres.forEach(genre => {
            for(let i=0;i<genre_ids.length;i++){
                if(genre.id === genre_ids[i]){
                    genresName.push(genre.name);
                };
            };
        });
    }else{
        const genres = await getGenres(GENRESTV);
        genres.forEach(genre => {
            for(let i=0;i<genre_ids.length;i++){
                if(genre.id === genre_ids[i]){
                    genresName.push(genre.name);
                };
            };
        });
    }
    allInfoMovieEl.innerHTML = `
        <div class="info-container">
            <i class="fas fa-times" id="close"></i>
            <div class="img-container">
                <img 
                    src="${backdrop_path ? IMGPATHMOVIE + backdrop_path : ''}" 
                    alt="" />
            </div>
            <div class="info">
                <div class="title-rating">
                    <h3 class="title">${title}</h3>
                    <span class="rating ${colorRating(vote_average)}">${vote_average}</span>
                </div>
                <div class="date-genres">
                    <span class="date">${release_date.substring(0,4)}</span>
                    <span class="genres">${genresName.join(' ')}</span>                    
                </div>
                <p class="overview">${overview}</p>
            </div>
        </div>
    `;
    containerInfo.appendChild(allInfoMovieEl);
    containerInfo.classList.add('active');
    const closeEl = document.getElementById('close');
    closeEl.addEventListener('click', () => {
        containerInfo.classList.remove('active');
        containerInfo.innerHTML = ``;
    });
};

let page = 1;
let genreId = '';
showMovies(page);
nextBtn.addEventListener('click', () => {
    if(page <= 500 && movieActive && genreActive){
        page++
        numPage.innerText = String(page);
        showMovies(page, genreId);
    }else if(page <= 500 && serieActive && genreActive){
        page++
        numPage.innerText = String(page);
        showSeries(page, genreId);
    }else if(page <= 500 && movieActive){
        page++;
        numPage.innerText = String(page);
        showMovies(page);
    }else if(page <= 500 && serieActive){
        page++
        numPage.innerText = String(page);
        showSeries(page);
    }
    window.scrollTo(0,0);
});
previousBtn.addEventListener('click', () => {
    if(page > 1 && movieActive && genreActive){
        page--;
        numPage.innerText = String(page);
        showMovies(page, genreId);
    }else if(page > 1 && serieActive && genreActive){
        page--;
        numPage.innerText = String(page);
        showSeries(page, genreId);
    }else if(page > 1 && movieActive){
        page--;
        numPage.innerText = String(page);
        showMovies(page);
    }else if(page > 1 && serieActive){
        page--;
        numPage.innerText = String(page);
        showSeries(page);
    }    
    window.scrollTo(0,0);
});


function colorRating(rating){
    if(rating >= 8){
        return 'green';
    }else if(rating >= 5) {
        return 'orange';
    }else{
        return 'red';
    }
};

movieSelect.addEventListener('click', () => {
    movieSelect.classList.add('active');
    serieSelect.classList.remove('active');
    if(movieSelect.classList.contains('active')){
        inputEl.classList.add('movie-input');
        inputEl.classList.remove('serie-input');
        inputEl.setAttribute('placeholder', 'Search Movie')
    };
    pageContainerEl.style = "display: normal";
    nameGenreEl.classList.remove('active');
    containerGenresEl.classList.remove('active');
    movieActive = true;
    serieActive = false;
    genreActive = false;
    containerEl.innerHTML = ``;
    page = 1;
    numPage.innerText = String(page)
    selectEl.textContent = `Movies`;
    showMovies(page);
});

serieSelect.addEventListener('click', () => {
    movieSelect.classList.remove('active');
    serieSelect.classList.add('active');
    if(serieSelect.classList.contains('active')){
        inputEl.classList.remove('movie-input');
        inputEl.classList.add('serie-input');
        inputEl.setAttribute('placeholder', 'Search Serie')
    };
    pageContainerEl.style = "display: normal";
    nameGenreEl.classList.remove('active');
    containerGenresEl.classList.remove('active');
    movieActive = false;
    serieActive = true;
    genreActive = false;
    containerEl.innerHTML = ``;
    page = 1;
    numPage.innerText = String(page)
    selectEl.textContent = `Series`;
    showSeries(page);
});

genreBtn.addEventListener('click', async() => {
    containerGenresEl.classList.toggle('active');
    genresLeftEl.innerHTML = ``;
    genresCenterEl.innerHTML = ``;
    genresRightEl.innerHTML = ``;    
    if(containerGenresEl.classList.contains('active') && movieActive){
        const genres = await getGenres(GENRESMOVIE);          
        let n = 0;        
        genres.forEach(genre => {
            const { name } = genre;
            if(n <= 6){
                const genreEl = document.createElement('span');
                genreEl.setAttribute('id', 'text-genre');                
                genreEl.textContent = `${name}`;
                genresLeftEl.appendChild(genreEl);
                n++;
            }else if(n <= 12){
                const genreEl = document.createElement('span');
                genreEl.setAttribute('id', 'text-genre');                
                genreEl.textContent = `${name}`;
                genresCenterEl.appendChild(genreEl);
                n++;
            }else {
                const genreEl = document.createElement('span');
                genreEl.setAttribute('id', 'text-genre');                
                genreEl.textContent = `${name}`;
                genresRightEl.appendChild(genreEl);
                n++;
            }
        });      

        const textGenre = document.querySelectorAll('#text-genre');
        for(let i = 0; i<20; i++){
            if(textGenre[i]){
                textGenre[i].addEventListener('click', () => {      
                    genres.forEach(genre => {
                        if(textGenre[i].textContent === genre.name) {
                            nameGenreEl.textContent = genre.name;
                            nameGenreEl.classList.add('active');
                            genreId = genre.id;
                            genreActive = true;
                            page = 1;
                            numPage.innerText = String(page);
                            showMovies(page, genre.id);
                            containerGenresEl.classList.remove('active');
                            inputEl.value = '';
                        }
                    })
                });
            };
        };
        
    }else if(containerGenresEl.classList.contains('active') && serieActive){
        const genres = await getGenres(GENRESTV);  
        let n = 0;
        genres.forEach(genre => {
            const { name } = genre;
            if(n <= 5){
                const genreEl = document.createElement('span');
                genreEl.setAttribute('id', 'text-genre');
                genreEl.textContent = `${name}`;
                genresLeftEl.appendChild(genreEl);
                n++;
            }else if(n <= 10){
                const genreEl = document.createElement('span');
                genreEl.setAttribute('id', 'text-genre');
                genreEl.textContent = `${name}`;
                genresCenterEl.appendChild(genreEl);
                n++;
            }else {
                const genreEl = document.createElement('span');
                genreEl.setAttribute('id', 'text-genre');
                genreEl.textContent = `${name}`;
                genresRightEl.appendChild(genreEl);
                n++;
            };
        });      
        
        const textGenre = document.querySelectorAll('#text-genre');
        for(let i = 0; i<16; i++){
            if(textGenre[i]){
                textGenre[i].addEventListener('click', () => {      
                    genres.forEach(genre => {
                        if(textGenre[i].textContent === genre.name) {
                            nameGenreEl.textContent = genre.name;
                            nameGenreEl.classList.add('active');
                            genreActive = true;
                            genreId = genre.id;
                            page = 1;
                            numPage.innerText = String(page);
                            showSeries(page, genre.id);
                            containerGenresEl.classList.remove('active');
                            inputEl.value = '';
                        };
                    });
                });
            };
        };
    };   
});

inputEl.addEventListener('click', () => {
    containerGenresEl.classList.remove('active');
});
inputEl.addEventListener('input', async() => {
    if(movieActive){
        if(inputEl.value){
            const search = await getMovies(SEARCHMOVIE + inputEl.value);
            showMovies('', '', search);
            pageContainerEl.style = "display: none";
            nameGenreEl.classList.remove('active');
        }else {
            showMovies(1, '', '');
            numPage.innerText = '1';
            pageContainerEl.style = "display: flex";
        }
    }else{
        if(inputEl.value){
            const search = await getMovies(SEARCHTV + inputEl.value);
            showSeries('', '', search);
            pageContainerEl.style = "display: none";
            nameGenreEl.classList.remove('active');
        }else {
            showSeries(1, '', '');
            numPage.innerText = '1';
            pageContainerEl.style = "display: flex";
        }
    }
});