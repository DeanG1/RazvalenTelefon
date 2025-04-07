import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import defaultCaseImage from "../../assets/shocked-face-shocked-meme.gif";
import sigmaBoySong from "../../assets/sigma-boy.mp3";

const placeholderImages = [
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
  const [result, setResult] = useState(null);
  const [memeImages, setMemeImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const audioRef = useRef(new Audio(sigmaBoySong));
  const rouletteWindowRef = useRef(null);

  useEffect(() => {
    if (selectedImage !== null) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [selectedImage]);

  const fetchMemes = async () => {
    try {
      const response = await fetch("https://meme-api.com/gimme/9");
      const data = await response.json();
      const urls = data.memes.map((meme) => meme.url);
      setMemeImages(urls);
    } catch (error) {
      console.error("Error fetching memes:", error);
      setMemeImages(placeholderImages);
    }
  };

  const handleOpen = async () => {
    setOpened(true);
    audioRef.current.play();
    await fetchMemes();
    setTimeout(() => {
      spinRoulette();
    }, 1000);
  };

  const spinRoulette = () => {
    setSpinning(true);
    const startTime = performance.now();
    const imagesToUse = memeImages.length > 0 ? memeImages : placeholderImages;
    const winIndex = Math.floor(Math.random() * imagesToUse.length);
    const markerOffset = 150 - IMAGE_WIDTH / 2; 
    const targetPos = winIndex * IMAGE_WIDTH;
    const extraDistance = EXTRA_CYCLES * imagesToUse.length * IMAGE_WIDTH;
    const totalDistance = extraDistance + targetPos - markerOffset;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      if (elapsed < TOTAL_SPIN_DURATION) {
        const t = easeOutQuad(elapsed / TOTAL_SPIN_DURATION);
        const newScrollLeft = t * totalDistance;
        if (rouletteWindowRef.current) {
          rouletteWindowRef.current.scrollLeft = newScrollLeft;
        }
        requestAnimationFrame(animate);
      } else {
        if (rouletteWindowRef.current) {
          rouletteWindowRef.current.scrollLeft = totalDistance;
        }
        setSpinning(false);
        setResult(winIndex);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleImageClick = (img) => {
    if (!spinning) {
      setSelectedImage(img);
    }
  };

  const resetRoulette = () => {
    setOpened(false);
    setSpinning(false);
    setResult(null);
    setSelectedImage(null);
    setMemeImages([]);
    if (rouletteWindowRef.current) {
      rouletteWindowRef.current.scrollLeft = 0;
    }
  };

  const imagesToRender = memeImages.length > 0 ? memeImages : placeholderImages;

  return (
    <div style={styles.container}>
      {!opened ? (
        <div style={styles.caseContainer}>
          <img
            src={defaultCaseImage} 
            alt="Case"
            style={styles.caseImage}
          />
          <button onClick={handleOpen} style={styles.openButton}>
            Open
          </button>
        </div>
      ) : (
        <div>
          <div style={styles.rouletteContainer}>
            <div style={styles.marker}>▼</div>
            <div ref={rouletteWindowRef} style={styles.rouletteWindow}>
              <div style={styles.rouletteTrack}>
                {[...imagesToRender, ...imagesToRender, ...imagesToRender].map(
                  (img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Item ${index}`}
                      style={styles.rouletteImage}
                      onClick={() => handleImageClick(img)}
                    />
                  )
                )}
              </div>
            </div>
          </div>
          {!spinning && (
            <div style={styles.controls}>
              <button onClick={resetRoulette} style={styles.openButton}>
                Spin Again
              </button>
            </div>
          )}
          {selectedImage && (
            <div style={styles.resultSection}>
              <div style={styles.winningContainer}>
                <img
                  src={selectedImage}
                  alt="Selected Meme"
                  style={styles.winningImage}
                />
              </div>
              <div style={styles.resultMessage}>
                You selected: {selectedImage}
              </div>
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
    marginTop: 10,
  },
  rouletteContainer: {
    position: "relative",
    display: "inline-block",
    marginTop: 20,
  },
  rouletteWindow: {
    overflowX: "auto",
    width: 300,
    border: "2px solid #333",
    margin: "0 auto",
    position: "relative",
    whiteSpace: "nowrap",
  },
  rouletteTrack: {
    display: "flex",
  },
  rouletteImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    flexShrink: 0,
    cursor: "pointer",
  },
  marker: {
    position: "absolute",
    top: -25,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 24,
    color: "red",
    pointerEvents: "none",
  },
  controls: {
    marginTop: 20,
  },
  resultSection: {
    marginTop: 30,
  },
  winningContainer: {
    margin: "0 auto",
    width: 300,
    height: 300,
    overflow: "hidden",
    border: "3px solid #4CAF50",
    borderRadius: "10px",
    marginBottom: 20,
  },
  winningImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    animation: "zoomIn 0.5s ease-out",
  },
  resultMessage: {
    marginTop: 10,
    fontSize: 18,
    marginBottom: 20,
  },
};

export default CaseOpener;
