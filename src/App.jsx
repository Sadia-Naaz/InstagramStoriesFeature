import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    fetch('/data/stories.json')
      .then(res => res.json())
      .then(data => setStories(data));
  }, []);

  useEffect(() => {
    if (currentIndex !== null) {
      setLoading(true);
      const timeout = setTimeout(() => setLoading(false), 300);
      const autoAdvance = setTimeout(() => goToNext(), 5000);
      setTimer(autoAdvance);
      return () => {
        clearTimeout(timeout);
        clearTimeout(autoAdvance);
      };
    }
  }, [currentIndex]);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      clearTimeout(timer);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      clearTimeout(timer);
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(null);
    }
  };

  const openStory = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="app">
      {currentIndex === null ? (
        <div className="story-list">
          {stories.map((story, index) => (
            <img
              key={story.id}
              src={story.imageUrl}
              alt={`story-${index}`}
              className="story-thumbnail"
              onClick={() => openStory(index)}
            />
          ))}
        </div>
      ) : (
        <div className="story-viewer">
          {loading ? <div className="loader">Loading...</div> : (
            <>
              <div className="click-zone left" onClick={goToPrevious}></div>
              <img src={stories[currentIndex].imageUrl} alt="story" className="story-full" />
              <div className="click-zone right" onClick={goToNext}></div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;


