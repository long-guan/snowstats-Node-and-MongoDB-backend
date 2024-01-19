# Stevens Pass iMap

### Project Description

Single page application to transform a noninteractive PDF of a ski map of Stevens Pass Ski Resort to an interactive ski map. Users are able to view, like, and post videos for individual ski trail. Users are also able to add reviews of the snow condition for individual ski trails.

- Frontend: React + Tailwind CSS (deployed on GitHub pages)
- Backend: Django + PostgreSQL (deployed on AWS)
- [View live app](https://long-guan.github.io/snowstats/)
  ![Stevens Pass iMap](/readme/stevens_pass_imap.png "Stevens Pass iMap")

---

### Installation

To run this application locally using Docker:

1. Fork this repo and clone to local computer.
2. Build the volume with the name postgres-snowstat-data using the command $docker volume create postgres-snowstat-data
3. Build container with the command $docker-compose build
4. Run the container with $docker-compose up

- Access the frontend through http://localhost:3000/snowstats/
- Access the backend through http://localhost:8000/

---

### Features

- Users are able to create an account
- Users can view, post, and like videos
- Users can post reviews of the ski trails
- Search bar for ski runs
- Filtering of options for search bar as the user
- Backend error handling for every API endpoint
- Frontend error handling and error messages for account creation form, video posting form, and review posting form
- Utilizes JWT access token to authenticate and authorize users
- Utilizes JWT refresh token to enable users to be logged in for longer periods of times
- Backend scripts to load data from saved JSON data for when the database needs to be wiped and reset
- Authorization where only signed in users can post videos or reviews
- REST API design
- SSL certificate for backend and frontend domain

---

### Endpoints

| Action                                      | Method | URL                                                                 |
| ------------------------------------------- | ------ | ------------------------------------------------------------------- |
| Get conditions for a specific run (trail)   | GET    | https://longproductionbackend.net/api/conditions/<int:run_id>/      |
| Get all conditions                          | GET    | https://longproductionbackend.net/api/conditions/                   |
| Add a condition                             | POST   | https://longproductionbackend.net/api/conditions/                   |
| Create a new user                           | POST   | https://longproductionbackend.net/api/user/                         |
| Check if a username already exist           | GET    | https://longproductionbackend.net/api/user/<slug:username>          |
| Get a list of all the runs (trails)         | GET    | https://longproductionbackend.net/api/runs/                         |
| Get a list of all the videos from every run | GET    | https://longproductionbackend.net/api/videos/                       |
| Get list of videos from a specific run      | GET    | https://longproductionbackend.net/api/videos/<int:run_id>/          |
| Add a video to a specific run               | POST   | https://longproductionbackend.net/api/videos/                       |
| Like a specific video                       | POST   | https://longproductionbackend.net/api/videos/like/<int:video_id>    |
| Disike a specific video                     | POST   | https://longproductionbackend.net/api/videos/dislike/<int:video_id> |
| Login and obtain token                      | POST   | https://longproductionbackend.net/api/login/                        |

---

### Data Tables

![Data Tables](/readme/data_tables.png "Data Tables")

---

### Libraries Used

- react-img-mapper: used to create image maps for clicking on each trail
- Reactjs-popup: used to show popups for each trail when hovering or clicking
- djangorestframework-simplejwt: used for authentication and authorization
- djangorestframework: used for authentication and authorization

---

### Challenges

- To toggle on and off the tooltip (popup) to display each runs name, a booleans has to be set. Instead of creating a bunch of useState boolean variables for each area, I'm going to store all the boolean variables in an array of boolean and associate it corresponding to the index of the array to the area.name

---

### Future Additions

- ~~Make the app responsive and usable on a mobile device~~ (Added responsiveness on 12/30/23, accommodating for screen sizes as small as 320px)
- Add a location to add reviews on the road conditions
- Add a location to add reviews on the general snow conditions
- Allow users without accounts to comment on road conditions or general snow conditions
- Add lazy loading
- Implement caching
- Add redux
- Add typescript
- Deploy react frontend to another hosting site that allows changing of the Cache-Control header for static files to score 100/100 in Lighthouse Report (currently 99 because GitHub pages does not allow Cache-Control header to change)
- Add tests for backend and frontend
