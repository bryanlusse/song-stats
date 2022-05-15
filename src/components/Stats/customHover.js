const customHover = {
    id: 'customHover',
    afterEvent: (chart, event, opts) => {
        let tooltip = null;
        
        const evt = event.event;

        if (evt.type !== 'mousemove') {
        return;
        }
        const [found, label, x1, x2, y1, i] = findLabel(getLabelHitboxes(chart.scales), evt);

        if (found) {
            tooltip = document.getElementById('chartjs-tooltip');
            tooltip.innerHTML = "<h2>"+label + "</h2>"+ "<span>" + dataexpl[label] + "</span>"
            tooltip.style.visibility = "visible";
            tooltip.style.opacity = 1;
            tooltip.style.left = Math.round(((x1+x2)/2)-110).toString() + 'px';
            tooltip.style.top = Math.round(y1+tooltip.style.height).toString() + 'px';            
        }
        else {
            tooltip = document.getElementById('chartjs-tooltip');    
            tooltip.style.visibility = "hidden";
            tooltip.style.opacity = 0;
        }
    }
}

const findLabel = (labels, evt) => {
    let found = false;
    let res = null;
    let x1 = null;
    let x2 = null;
    let y1 = null;
    let i = null;
  
    labels.forEach(l => {
      l.labels.forEach(label => {
        if (evt.x > label.x && evt.x < label.x2 && evt.y > label.y && evt.y < label.y2) {
            res = label.label;
            found = true;
            x1 = label.x;
            x2 = label.x2;
            y1 = label.y;
            i = label.index
        }
      });
    });
  
    return [found, res, x1, x2, y1, i];
  };
  
  const getLabelHitboxes = (scales) => (Object.values(scales).map((s) => ({
    scaleId: s.id,
    labels: s._pointLabelItems.map((e, i) => ({
      x: e.left,
      x2: e.right,
      y: e.top,
      y2: e.bottom,
      label: s._pointLabels[i],
      index: i
    }))
  })));

const dataexpl = {
    "Acousticness": "A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.",
    "Danceability": "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.",
    "Energy": "Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.",
    "Instrumentalness": "Predicts whether a track contains no vocals. 'Ooh' and 'aah' sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly 'vocal'. The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.",
    "Liveness": "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.",
    "Speechiness": "Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.",
    "Valence": "A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry)."
}


exports.customHover = customHover
