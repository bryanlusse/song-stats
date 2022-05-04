import React, {useState, useContext, useEffect} from 'react';
import { RadarChart } from "./Chart";
import { Container } from 'react-bootstrap';
import axios from 'axios';

const songLabels = [
  "acousticness",
  "danceability",
  "energy",
  "instrumentalness",
  "liveness",
  "speechiness",
  "valence"
];

const songLabelsCap = [
  "Acousticness",
  "Danceability",
  "Energy",
  "Instrumentalness",
  "Liveness",
  "Speechiness",
  "Valence"
]

const Header = () => {
  const [searchKey, setSearchKey] = useState("");
  const [stats, setStats] = useState([
    {
      labels: songLabelsCap,
      datasets: [
        {
          label: 'init',
          data: [0.5,0.5,0.5,0.5,0.5,0.5,0.5],
          backgroundColor: "#0cf0dd",
          borderColor: "#0abdae",
        }
      ]
    }
  ]);

  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const doSomething = async (e) => {
    e.preventDefault()
    const auth = await axios.get("https://react-spotify--app.herokuapp.com/token", {
    });
    const token = auth.data.accessToken;
    var data = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: searchKey,
            type: "track"
        }
    });
    const id = data.data.tracks.items[0].id;

    var stat_data = await axios.get("https://api.spotify.com/v1/audio-features/" + id, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    setStats({0: {
      labels: songLabelsCap,
      datasets: [
        {
          label: data.data.tracks.items[0].name + ' - ' + data.data.tracks.items[0].artists[0].name,
          data: songLabels.map((label) => stat_data.data[label]),
          backgroundColor: "#0cf0dd",
          borderColor: "#0abdae"
        }
      ]
    }});
    var x = document.getElementById("chart-container");
    if (x.style.display === "none") {
      x.style.display = "inline-block";
    }
  }
  
  useEffect(() => {
    if (window.innerWidth > 769) {
      setIsDesktop(true);
      setIsMobile(false);
    } else {
      setIsMobile(true);
      setIsDesktop(false);
    }
  }, []);

  return (
    <section id="stats" className="jumbotron" style={{width: "100%"}}>
      <Container style={{width: "100%"}}>
        <div id='text-container' style={{textAlign: "center"}}>
          <div style={{display: "inline-block", margin: "0 auto"}}>
            <h1 className="stats-title">
              {"Hi, search for a "}
              <span className="text-color-main">{"song"}</span>
              <br />
              {" and we'll show you the stats"}
            </h1>
          </div>
          <div style={{display: "inline-block", margin: "0 auto"}}>
          <h2 className="stats-title">
            <input type="text" onChange={e => setSearchKey(e.target.value)}/>
            <button className="cta-btn cta-btn--stats" onClick={doSomething}>
              Search
            </button>
          </h2>
        </div>
        </div>
          <div id="chart-container" className="stats-container" style={{height: "600px", width: "600px", display: "none", margin: "0 auto"}}>
            <RadarChart chartData={stats[0]} />
          </div>
      </Container>
    </section>
  );
};


export default Header;