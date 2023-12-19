const apiKey = '4a3dab27ec9b91e69546e314a14c0a24';
//--------------------------Funciones para peliculas--------------------------------------
const moviesContainer = document.getElementById('moviesContainer');
let currentPageMovies = 1;
const moviesPerPage = 5;

// Función para obtener las películas populares
function getPopularMovies(page) {
      const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=${page}`;
      fetch(url)
            .then(response => response.json())
            .then(data => {
                  displayMovies(data.results);
                  displayPaginationMovies(data.total_pages);
            })
            .catch(error => {
                  console.error('Error al obtener datos:', error);
            });
}
function displayMovies(movies) {
      moviesContainer.innerHTML = ''; // Limpiar contenido anterior
      if (!movies || movies.length === 0) {
            // Manejo del caso en el que movies es undefined o está vacío
            console.error('No se encontraron películas o la respuesta es inválida.');
            return;
      }  
      
      // Mostrar solo las primeras 5 películas
      const moviesToDisplay = movies.slice(0, moviesPerPage);

      for (let i = 0; i < moviesToDisplay.length; i++) {
            const movie = moviesToDisplay[i];
            const movieElement = document.createElement('div');
            movieElement.classList.add('col-md-2,5');
      
            const movieTitle = document.createElement('h5');
            movieTitle.textContent = movie.title;
      
            const movieImage = document.createElement('img');
            movieImage.src = `https://image.tmdb.org/t/p/w92/${movie.poster_path}`;
            movieImage.alt = movie.title;
      
            movieImage.addEventListener('click', () => {
                  showMovieDetailsModal(movie);
            });
      
            movieElement.appendChild(movieImage);
            movieElement.appendChild(movieTitle);
      
            moviesContainer.appendChild(movieElement);
      }
}

function displayPaginationMovies(totalPages) {
      const moviesPaginationContainer = document.getElementById('moviesPaginationContainer');
      moviesPaginationContainer.innerHTML = '';
  
      const totalPagesDisplayed = 5; // Número de páginas a mostrar en cada bloque
      const totalPagesBlocks = Math.ceil(totalPages / totalPagesDisplayed);
      const currentPageBlock = Math.ceil(currentPageMovies / totalPagesDisplayed);
      const startPage = (currentPageBlock - 1) * totalPagesDisplayed + 1;
      const endPage = Math.min(startPage + totalPagesDisplayed - 1, totalPages);
  
      const previousButton = createPaginationItem('Previous', currentPageMovies - 1, currentPageMovies === 1, totalPages, true);
      moviesPaginationContainer.appendChild(previousButton);

      for (let i = startPage; i <= endPage; i++) {
      const pageItem = createPaginationItem(i, i, currentPageMovies === i, totalPages, true);
      moviesPaginationContainer.appendChild(pageItem);
      }

      const nextButton = createPaginationItem('Next', currentPageMovies + 1, currentPageMovies === totalPages, totalPages, true);
      moviesPaginationContainer.appendChild(nextButton);
  }
  function createPaginationItem(text, page, isActive, totalPages, isMoviesPagination) {
      const pageItem = document.createElement('li');
      pageItem.classList.add('page-item');
      const pageLink = document.createElement('a');
      pageLink.classList.add('page-link');
      pageLink.href = '#';
      pageLink.textContent = text;
      pageLink.addEventListener('click', (event) => {
            event.preventDefault();
            if (page > 0 && page <= totalPages) {
                  if (isMoviesPagination) {
                        currentPageMovies = page;
                        getPopularMovies(currentPageMovies);
                  } else {
                        currentPageSeries = page;
                        getPopularTVSeries(currentPageSeries);
                  }
            }
      });
      if (isActive) {
            pageItem.classList.add('active');
      }
      pageItem.appendChild(pageLink);
      return pageItem;
}
  
// Función para mostrar detalles de la película en el modal
function showMovieDetailsModal(movieDetails) {
      const modalTitle = document.getElementById('modalTitle');
      const movieDetailsContainer = document.getElementById('movieDetails');
      const movieOverview = document.getElementById('movieOverview');

      // Asignar los detalles de la película al modal
      modalTitle.textContent = movieDetails.title;
      movieOverview.textContent = movieDetails.overview;

      // Obtener información adicional de la película usando la ID de la película
      const movieId = movieDetails.id;
      const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es-ES`;
      const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=es-ES`;

      // Promesa para obtener los detalles adicionales y los créditos de la película
      const detailsPromise = fetch(detailsUrl).then(response => response.json());
      const creditsPromise = fetch(creditsUrl).then(response => response.json());

    // Ejecutar ambas promesas simultáneamente usando Promise.all()
      Promise.all([detailsPromise, creditsPromise])
            .then(([detailsData, creditsData]) => {
                  const releaseDate = detailsData.release_date;
                  const runtime = detailsData.runtime;
                  const genres = detailsData.genres.map(genre => genre.name).join(', ');
                  const voteAverage = detailsData.vote_average;
                  const directors = creditsData.crew.filter(person => person.job === 'Director').map(director => director.name).join(', ');
                  const posterPath = `https://image.tmdb.org/t/p/w500/${detailsData.poster_path}`;
                  

                  // Construir el contenido HTML con los detalles de la película
                  const movieDetailsHTML = `
                  <img src="${posterPath}" alt="${movieDetails.title}" style="max-width: 100%; height: auto;">
                  <p>Fecha de lanzamiento: ${releaseDate}</p>
                  <p>Género(s): ${genres}</p>
                  <p>Duración: ${runtime} minutos</p>
                  <p>Puntuación de usuario: ${voteAverage}</p>
                  <p>Director(es): ${directors}</p>
                  `;

                  // Actualizar el contenido del contenedor de detalles de la película en el modal
                  movieDetailsContainer.innerHTML = movieDetailsHTML;
            })
            .catch(error => {
                  console.error('Error al obtener datos de la película:', error);
            });

      // Mostrar el modal
      const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));
      movieModal.show();
}

const close = document.querySelector('.close');

window.addEventListener('load', () => {
      getPopularMovies(currentPageMovies);
});

//--------------------------Funciones para series--------------------------------------
const seriesPaginationContainer = document.getElementById('seriesPaginationContainer');
const seriesContainer = document.getElementById('seriesContainer');
let currentPageSeries = 1;
const seriesPerPage = 5;

// Función para obtener las series de TV
function getPopularTVSeries(page) {
      const url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=es&page=${page}`;
      fetch(url)
            .then(response => response.json())
            .then(data => {
                  displayTVSeries(data.results);
                  displayPaginationSeries(data.total_pages);
            })
            .catch(error => {
                  console.error('Error al obtener datos:', error);
            });
}
// Función para mostrar las series de TV en el contenedor
function displayTVSeries(series) {
      seriesContainer.innerHTML = ''; // Limpiar contenido anterior
      const seriesPerPage = 5; // Número de series por página  
      if (!series || series.length === 0) {
            console.error('No se encontraron series de TV o la respuesta es inválida.');
            return;
      }
      for (let i = 0; i < series.length; i++) {
            if (i >= seriesPerPage) {
                  break; // Detener el ciclo después de mostrar la cantidad deseada de series
            }      
            const tvShow = series[i];
            const tvShowElement = document.createElement('div');
            tvShowElement.classList.add('col-md-2,5');

            const tvShowTitle = document.createElement('h5');
            tvShowTitle.textContent = tvShow.name;

            const tvShowPoster = document.createElement('img');
            tvShowPoster.src = `https://image.tmdb.org/t/p/w300/${tvShow.poster_path}`;
            tvShowPoster.alt = tvShow.name;
            tvShowPoster.style.cursor = 'pointer';
      
            tvShowPoster.addEventListener('click', () => {
                  showSeriesDetailsModal(tvShow);
            });
      
            tvShowElement.appendChild(tvShowPoster);
            tvShowElement.appendChild(tvShowTitle);
      
            seriesContainer.appendChild(tvShowElement);
      }
}
function showSeriesDetailsModal(seriesDetails) {
      const modalTitle = document.getElementById('seriesModalTitle');
      const seriesDetailsContainer = document.getElementById('seriesDetails');

      // Asignar los detalles de la serie al modal
      modalTitle.textContent = seriesDetails.name;
      // ... Asignar otros detalles al contenido del modal

      // Obtener información adicional de la serie de TV usando el ID de la serie
      const seriesId = seriesDetails.id;
      const detailsUrl = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&language=es`;

      fetch(detailsUrl)
            .then(response => response.json())
            .then(seriesData => {
                  const seriesOverview = document.getElementById('seriesOverview');
                  seriesOverview.textContent = seriesData.overview;
                  const firstAirDate = seriesData.first_air_date;
                  const runtime = seriesData.episode_run_time;
                  const genres = seriesData.genres.map(genre => genre.name).join(', ');
                  const voteAverage = seriesData.vote_average;
                  const posterPath = `https://image.tmdb.org/t/p/w500/${seriesData.poster_path}`;
                  // Construir el contenido HTML con los detalles de la serie de TV
                  const seriesDetailsHTML = `
                        <img src="${posterPath}" alt="${seriesDetails.name}" style="max-width: 100%; height: auto;">
                        <p>Fecha de estreno: ${firstAirDate}</p>
                        <p>Género(s): ${genres}</p>
                        <p>Duración de episodio: ${runtime} minutos</p>
                        <p>Puntuación de usuario: ${voteAverage}</p>
                        <!-- Otros detalles de la serie -->
                  `;
      
                  // Actualizar el contenido del contenedor de detalles de la serie en el modal
                  seriesDetailsContainer.innerHTML = seriesDetailsHTML;
            })
            .catch(error => {
                  console.error('Error al obtener datos de la serie de TV:', error);
            });  
      // Mostrar el modal de la serie de TV
      const seriesModal = new bootstrap.Modal(document.getElementById('seriesModal'));
      seriesModal.show();
}

function displayPaginationSeries(totalPages) {
      const seriesPaginationContainer = document.getElementById('seriesPaginationContainer');
      seriesPaginationContainer.innerHTML = '';

      const totalPagesDisplayed = 5; // Número de páginas a mostrar en cada bloque
      const totalPagesBlocks = Math.ceil(totalPages / totalPagesDisplayed);
      const currentPageSeriesBlock = Math.ceil(currentPageSeries / totalPagesDisplayed);
      const startPage = (currentPageSeriesBlock - 1) * totalPagesDisplayed + 1;
      const endPage = Math.min(startPage + totalPagesDisplayed - 1, totalPages);

      const previousButton = createPaginationItem('Previous', currentPageSeries - 1, currentPageSeries === 1, totalPages, false);
      seriesPaginationContainer.appendChild(previousButton);

      for (let i = startPage; i <= endPage; i++) {
            const pageItem = createPaginationItem(i, i, currentPageSeries === i, totalPages, false);
            seriesPaginationContainer.appendChild(pageItem);
      }
      const nextButton = createPaginationItem('Next', currentPageSeries + 1, currentPageSeries === totalPages, totalPages, false);
      seriesPaginationContainer.appendChild(nextButton);
}  
window.addEventListener('load', () => {
      getPopularTVSeries(currentPageSeries);
});