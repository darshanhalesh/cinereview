export const mockMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    year: 1994,
    genre: "Drama",
    rating: 4.9,
    poster: "https://picsum.photos/400/600?random=1",
    duration: "2h 22m",
    director: "Frank Darabont",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
  },
  {
    id: 2,
    title: "Pulp Fiction",
    year: 1994,
    genre: "Crime, Drama",
    rating: 4.8,
    poster: "https://picsum.photos/400/600?random=2",
    duration: "2h 34m",
    director: "Quentin Tarantino",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption."
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    genre: "Action, Crime",
    rating: 4.7,
    poster: "https://picsum.photos/400/600?random=3",
    duration: "2h 32m",
    director: "Christopher Nolan",
    description: "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological tests."
  },
  {
    id: 4,
    title: "Forrest Gump",
    year: 1994,
    genre: "Drama, Romance",
    rating: 4.6,
    poster: "https://picsum.photos/400/600?random=4",
    duration: "2h 22m",
    director: "Robert Zemeckis",
    description: "The presidencies of Kennedy and Johnson through the eyes of an Alabama man with an IQ of 75."
  },
  {
    id: 5,
    title: "Inception",
    year: 2010,
    genre: "Sci-Fi, Thriller",
    rating: 4.8,
    poster: "https://picsum.photos/400/600?random=5",
    duration: "2h 28m",
    director: "Christopher Nolan",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea."
  },
  {
    id: 6,
    title: "The Godfather",
    year: 1972,
    genre: "Crime, Drama",
    rating: 4.9,
    poster: "https://picsum.photos/400/600?random=6",
    duration: "2h 55m",
    director: "Francis Ford Coppola",
    description: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son."
  },
  {
    id: 7,
    title: "Interstellar",
    year: 2014,
    genre: "Sci-Fi, Drama",
    rating: 4.7,
    poster: "https://picsum.photos/400/600?random=7",
    duration: "2h 49m",
    director: "Christopher Nolan",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
  },
  {
    id: 8,
    title: "Parasite",
    year: 2019,
    genre: "Thriller, Drama",
    rating: 4.8,
    poster: "https://picsum.photos/400/600?random=8",
    duration: "2h 12m",
    director: "Bong Joon-ho",
    description: "A poor family schemes to become employed by a wealthy family by infiltrating their household."
  }
];

export const featuredMovies = mockMovies.slice(0, 4);
export const trendingMovies = mockMovies.slice(4, 8);