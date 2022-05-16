import React, {useState, useEffect} from 'react';
import {keepTheme, setTheme} from '../../utils/themes';
import {RadarChart} from "./Chart";
import {Container} from 'react-bootstrap';
import axios from 'axios';
import Image from "../imgs/SONGSTATS-logos_transparent.png"
import { ReactComponent as MoonIcon } from "../imgs/moon.svg";
import { ReactComponent as SunIcon } from "../imgs/sun.svg";

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
];

const colors = [
  "#394648",
  "#CFC0BD",
  "#CBAC88",
  "#EDB6A3",
  "#F8E9E9"
];

const borderColors = [
  "#242C2E",
  "#BAA5A0",
  "#B48855",
  "#E49277",
  "#EBC1C1"
];

function addAlpha(color, opacity) {
  // coerce values so ti is between 0 and 1.
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}

const Header = () => {
  const [searchKey, setSearchKey] = useState("");
  const [gridlinecolors, setGridlinecolors] = useState(localStorage.getItem('theme') === 'theme-light' ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)");
  const [themecolors, setThemecolors] = useState(localStorage.getItem('theme') === 'theme-light' ? "black" : "white");
  const [stats, setStats] = useState([
    {
      labels: songLabelsCap,
      datasets: [{}],
    }
  ]);
  const [options, setOptions] = useState("")
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const loader = document.getElementById("loader-bubbles");
  const chart = document.getElementById("chart-container");
  const button = document.getElementById("compare");
  const checkbox = document.getElementById("switch");
  const [artistId, setArtistId] = useState("");
  const [artistName, setArtistName] = useState("");
  const [tokenGlob, setTokenGlob] = useState("");
  const [origSong, setOrigSong] = useState("");

  window.onload = function() {
    const check = localStorage.getItem('theme') === 'theme-light' ? "false" : "true";
    if (check === "true") {
      checkbox.checked = 'true'
    };
  }

  const getStats = async (e) => {
    e.preventDefault()
    if (chart.style.display === "inline-block") {
      chart.style.display = "none";
    }

    if (button.style.display === "inline-block") {
      button.style.display = "none";
    }

    loader.style.display = "inline-block";

    const auth = await axios.get("https://react-spotify--app.herokuapp.com/token", {
    });
    const token = auth.data.accessToken;
    setTokenGlob(token);
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
    setArtistId(data.data.tracks.items[0].artists[0].id);
    setArtistName(data.data.tracks.items[0].artists[0].name);
  
    var stat_data = await axios.get("https://api.spotify.com/v1/audio-features/" + id, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });

    setOrigSong({
      label: data.data.tracks.items[0].name + ' - ' + data.data.tracks.items[0].artists[0].name,
      data: songLabels.map((label) => stat_data.data[label]),
      backgroundColor: addAlpha("#0cf0dd", 0.3),
      borderColor: addAlpha("#0abdae",0.3)
    });


    setStats({0: {
      labels: songLabelsCap,
      datasets: [
        {
          label: data.data.tracks.items[0].name + ' - ' + data.data.tracks.items[0].artists[0].name,
          data: songLabels.map((label) => stat_data.data[label]),
          backgroundColor: addAlpha("#0cf0dd", 0.3),
          borderColor: addAlpha("#0abdae",0.3)
        }
      ]
    }});
    setOptions(
      {
        scales: {
          r: {
            grid: {
              color: gridlinecolors
            },
            ticks: {
              min: 0,
              max: 1,
              stepSize: 0.2,
              color: themecolors,
              showLabelBackdrop: false
            },
            font: {
              weight: "bold",
              color: themecolors
            },
            pointLabels: {
              color: themecolors,
              font: {
                size: function () {
                  if (window.innerWidth < 450) {
                    return 13
                  }
                  else {
                    return 16
                  }
                }
              }
            },
            angleLines: {
              color: gridlinecolors 
            }
          }
        },
        elements: {
          line: {
            borderWidth: 3
          }
        },
        plugins: {
          title: {
            display: true,
            text: "Song Stats",
            color: themecolors,
            font: {
              size: 17
            }
          },
          legend: {
            title: {
              color: themecolors,
            },
            labels: {
              color: themecolors,
              font: {
                size: function () {
                  if (window.innerWidth < 450) {
                    return 10
                  }
                  else {
                    return 15
                  }
                }
              }
            }     
          },
        }
      }
    )
    chart.style.display = "inline-block";
    button.style.display = "inline-block";
    loader.style.display = "none";
  }

  const darkMode = async (e) => {
    if (localStorage.getItem('theme') === 'theme-light') {
      setTheme('theme-dark');
      setGridlinecolors("rgba(255, 255, 255, 0.2)");
      setThemecolors("white");
    } else {
      setTheme('theme-light');
      setGridlinecolors("rgba(0, 0, 0, 0.2)");
      setThemecolors("black")
    }
  }

  useEffect(() => {
    setOptions(
      {
        scales: {
          r: {
            grid: {
              color: gridlinecolors
            },
            ticks: {
              min: 0,
              max: 1,
              stepSize: 0.2,
              color: themecolors,
              showLabelBackdrop: false
            },
            font: {
              weight: "bold",
              color: themecolors
            },
            pointLabels: {
              color: themecolors,
              font: {
                size: function () {
                  if (window.innerWidth < 450) {
                    return 13
                  }
                  else {
                    return 16
                  }
                }
              }
            },
            angleLines: {
              color: gridlinecolors 
            }
          }
        },
        elements: {
          line: {
            borderWidth: 3
          }
        },
        plugins: {
          title: {
            display: true,
            text: "Song Stats",
            color: themecolors,
            font: {
              size: 17
            }
          },
          legend: {
            title: {
              color: themecolors
            },
            labels: {
              color: themecolors,
              font: {
                size: function () {
                  if (window.innerWidth < 450) {
                    return 10
                  }
                  else {
                    return 15
                  }
                }
              }
            }     
          },
        }
      }
    )
  }, [themecolors, gridlinecolors]);

  const compareSongs = async (e) => {
    if (chart.style.display === "inline-block") {
      chart.style.display = "none";
    }

    if (button.style.display === "inline-block") {
      button.style.display = "none";
    }

    loader.style.display = "inline-block";

    var data = await axios.get("https://api.spotify.com/v1/artists/" + artistId + "/top-tracks", {
        headers: {
            Authorization: `Bearer ${tokenGlob}`
        },
        params: {
            market: "US"
        }
    });
    const top5 = data.data.tracks.slice(0,5);
    const comparisonDataset = [];
    comparisonDataset.push(origSong); // Add original searched song first
    var i = 0; // counter
    for (const song of top5) {
      var stat_data_top = await axios.get("https://api.spotify.com/v1/audio-features/" + song.id, {
        headers: {
            Authorization: `Bearer ${tokenGlob}`
        },
      });
      var processedStats = {
        label: song.name + ' - ' + artistName,
        data: songLabels.map((label) => stat_data_top.data[label]),
        backgroundColor: addAlpha(colors[i],0.3),
        borderColor: addAlpha(borderColors[i],0.3)
      };
      comparisonDataset.push(processedStats);
      i+=1;
    };
    setStats({0: {
      labels: songLabelsCap,
      datasets: comparisonDataset
    }});
    chart.style.display = "inline-block";
    // button.style.display = "inline-block";
    loader.style.display = "none";
  }

  useEffect(() => {
    keepTheme();
  })

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
    <section id="stats" style={{width: "100%", padding: 0, height: "200%"}}>
      <Container style={{width: "100%", justifyContent: "center", paddingTop: "-10 em"}}>
        <div className="navbar">
          <div className="nav-child" style={{width: "80%"}}>
            <a href="./">
              <img className="logo" src={Image} alt="Song Stats"/>
            </a>
          </div>
          <div className="nav-child" style={{width: "20%", height: "100%", marginBottom: "1%"}}>
            <label className="switch" >
              <input id="switch" type="checkbox" onClick={darkMode}/>
              <span className="slider round"></span>
              <div className="icons">
                <SunIcon />
                <MoonIcon />
              </div>
            </label>
          </div>
        </div>
        <div id='text-container' style={{textAlign: "center", display: "block", marginTop: "40px", marginBottom: "40px"}}>
          <div style={{display: "inline-block", margin: "0 auto"}}>
            <h1 className="stats-title">
              {"Hi, search for a "}
              <span className="text-color-main">{"song"}</span>
              <br />
              {" and we'll show you the stats"}
            </h1>
          </div>
          <div style={{display: "block", margin: "0 auto"}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
              <h2 className="stats-title">
                <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                <button id="search-button" className="cta-btn cta-btn--stats" onClick={getStats}>
                  Search
                </button>
              </h2>
            </div>
          </div>
          <div id="loader-bubbles" className="loader" style={{display: "none"}}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div id="chart-container" className="stats-container">
          <RadarChart chartData={stats[0]} chartOptions={options}/>
          <div id="chartjs-tooltip" className="tooltiptext"></div>
        </div>
        <div>
          <button id="compare" className="cta-btn cta-btn--stats" style={{display: "none"}} onClick={compareSongs}>
            Compare with other songs
          </button>
        </div>
      </Container>
    </section>
  );
};


export default Header;