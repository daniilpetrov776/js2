/* eslint-disable camelcase */
import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class MoviesApiService extends ApiService {
  get movies() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments(movie) {
    return this._load({url: `comments/${movie.id}`})
      .then(ApiService.parseResponse)
      .catch(() => null);
  }

  updateMovie = async (movie) => {
    const response = await this._load({
      url: `/movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (movie) => {
    const release = {
      ...movie.filmInfo,
      'date': movie.filmInfo.year,
      'release_country': movie.filmInfo.country,
    };

    const film_info = {
      ...movie.filmInfo,
      'alternative_title': movie.filmInfo.altTitle,
      'total_rating': movie.filmInfo.rating,
      'age_rating': movie.filmInfo.ageRating,
      release,
      'runtime': movie.filmInfo.duration,
    };

    delete film_info['altTitle'];
    delete film_info['rating'];
    delete film_info['ageRating'];
    delete film_info['year'];
    delete film_info['country'];
    delete film_info['duration'];

    const user_details = {
      ...movie.userDetails,
      'already_watched': movie.userDetails.alreadyWatched,
      'watching_date': movie.userDetails.watchingDate,
    };

    delete user_details['alreadyWatched'];
    delete user_details['watchingDate'];

    const adaptedMovie = {...movie,
      film_info,
      user_details,
    };

    delete adaptedMovie['filmInfo'];
    delete adaptedMovie['userDetails'];

    return adaptedMovie;
  };
}
