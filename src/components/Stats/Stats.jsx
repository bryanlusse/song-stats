import React, {useState, useContext, useEffect, createRef} from 'react';
import {keepTheme, setTheme} from '../../utils/themes';
import {RadarChart} from "./Chart";
import {Container} from 'react-bootstrap';
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
  const [options, setOptions] = useState("")
  const [searchKey, setSearchKey] = useState("");
  const [gridlinecolors, setGridlinecolors] = useState(localStorage.getItem('theme') === 'theme-light' ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)");
  const [themecolors, setThemecolors] = useState(localStorage.getItem('theme') === 'theme-light' ? "black" : "white");
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
      ],
    }
  ]);

  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  window.onload = function() {
    const checkbox = document.getElementById("switch");
    const check = localStorage.getItem('theme') === 'theme-light' ? "false" : "true";
    if (check == "true") {
      checkbox.checked = 'true'
    }
  }

  const doSomething = async (e) => {
    e.preventDefault()
    var loader = document.getElementById("loader-bubbles");
    var chart = document.getElementById("chart-container");

    if (chart.style.display === "inline-block") {
      chart.style.display = "none";
    }
    if (loader.style.display === "inline-block") {
      loader.style.display = "none";
    }
    loader.style.display = "inline-block";

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
                size: 16
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
                size: 15
              }
            }     
          },
        }
      }
    )
    chart.style.display = "inline-block";
    document.getElementById("stats").style.minHeight = "62.5 em";
    loader.style.display = "none";
  }

  const darkMode = async (e) => {
    console.log(localStorage.getItem('theme'))
    console.log(themecolors)
    if (localStorage.getItem('theme') === 'theme-light') {
      console.log('light->dark')
      setTheme('theme-dark');
      setGridlinecolors("rgba(255, 255, 255, 0.2)");
      setThemecolors("white");
    } else {
      console.log('dark->light')
      setTheme('theme-light');
      setGridlinecolors("rgba(0, 0, 0, 0.2)");
      setThemecolors("black")
    }
    console.log(themecolors)
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
                size: 16
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
                size: 15
              }
            }     
          },
        }
      }
    )
  }, [themecolors]);

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
    <section id="stats" className="jumbotron jumbotron-fluid" style={{width: "100%", padding: 0, minHeight: "1000px"}}>
      <Container style={{width: "100%", justifyContent: "center"}}>
        <label className="switch" >
          <input id="switch" type="checkbox" onClick={darkMode}/>
          <span className="slider round"></span>
        </label>
        <div id='text-container' style={{textAlign: "center", display: "block"}}>
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
                <button className="cta-btn cta-btn--stats" onClick={doSomething}>
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
        <div id="chart-container" className="stats-container" style={{height: "600px", width: "600px", display: "none", margin: "0 auto"}}>
          <RadarChart chartData={stats[0]} chartOptions={options}/>
          <div id="chartjs-tooltip" className="tooltiptext"></div>
        </div>
      </Container>
    </section>
  );
};


export default Header;