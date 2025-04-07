import React, { useState, useEffect } from "react";

const images = [
  "https://via.placeholder.com/100?text=Item1",
  "https://via.placeholder.com/100?text=Item2",
  "https://via.placeholder.com/100?text=Item3",
  "https://via.placeholder.com/100?text=Item4",
  "https://via.placeholder.com/100?text=Item5",
];

const TOTAL_SPIN_DURATION = 10000; 
const IMAGE_WIDTH = 100; 
const EXTRA_CYCLES = 3; 

const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

const CaseOpener = () => {
  const [opened, setOpened] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [position, setPosition] = useState(0);
  const [result, setResult] = useState(null);

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => {
      spinRoulette();
    }, 1000);
  };

  const spinRoulette = () => {
    setSpinning(true);
    const startTime = performance.now();
    const winIndex = Math.floor(Math.random() * images.length);
    const targetPos = winIndex * IMAGE_WIDTH;
    const extraDistance = EXTRA_CYCLES * images.length * IMAGE_WIDTH;
    const totalDistance = extraDistance + targetPos;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      if (elapsed < TOTAL_SPIN_DURATION) {
        const t = easeOutQuad(elapsed / TOTAL_SPIN_DURATION);
        setPosition(t * totalDistance);
        requestAnimationFrame(animate);
      } else {
        setPosition(totalDistance);
        setSpinning(false);
        setResult(winIndex);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div style={styles.container}>
      {!opened ? (
        <div style={styles.caseContainer}>
          <img
            src="https://via.placeholder.com/200x150?text=Closed+Case"
            alt="Case"
            style={styles.caseImage}
          />
          <button onClick={handleOpen} style={styles.openButton}>
            Open
          </button>
        </div>
      ) : (
        <div style={styles.rouletteContainer}>
          <div style={styles.marker}>▼</div>
          <div style={styles.rouletteWindow}>
            <div
              style={{
                ...styles.rouletteTrack,
                transform: `translateX(-${position}px)`,
                transition: spinning ? "none" : "transform 0.5s ease-out",
              }}
            >
              {[...images, ...images, ...images].map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Item ${index}`}
                  style={styles.rouletteImage}
                />
              ))}
            </div>
          </div>
          {result !== null && (
            <div style={styles.resultMessage}>
              You won item: {images[result]}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "sans-serif",
    padding: 20,
  },
  caseContainer: {
    display: "inline-block",
    marginBottom: 20,
  },
  caseImage: {
    width: 200,
    height: 150,
    marginBottom: 10,
  },
  openButton: {
    padding: "10px 20px",
    fontSize: 16,
    cursor: "pointer",
  },
  rouletteContainer: {
    position: "relative",
    display: "inline-block",
    marginTop: 20,
  },
  rouletteWindow: {
    overflow: "hidden",
    width: 300,
    border: "2px solid #333",
    margin: "0 auto",
    position: "relative",
  },
  rouletteTrack: {
    display: "flex",
  },
  rouletteImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    flexShrink: 0,
  },
  marker: {
    position: "absolute",
    top: -25,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 24,
    color: "red",
  },
  resultMessage: {
    marginTop: 20,
    fontSize: 18,
  },
};

export default CaseOpener;
