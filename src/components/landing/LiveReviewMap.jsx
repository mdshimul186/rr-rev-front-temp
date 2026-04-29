import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// US cities with approximate percentage positions on the globe element
const US_CITIES = [
  { name: 'New York',      baseTop: 28, baseLeft: 78 },
  { name: 'Los Angeles',   baseTop: 55, baseLeft: 12 },
  { name: 'Chicago',       baseTop: 30, baseLeft: 60 },
  { name: 'Houston',       baseTop: 65, baseLeft: 50 },
  { name: 'Phoenix',       baseTop: 58, baseLeft: 22 },
  { name: 'Philadelphia',  baseTop: 30, baseLeft: 80 },
  { name: 'San Antonio',   baseTop: 70, baseLeft: 44 },
  { name: 'San Diego',     baseTop: 60, baseLeft: 10 },
  { name: 'Dallas',        baseTop: 62, baseLeft: 50 },
  { name: 'San Jose',      baseTop: 45, baseLeft: 8  },
  { name: 'Austin',        baseTop: 68, baseLeft: 47 },
  { name: 'Seattle',       baseTop: 12, baseLeft: 8  },
  { name: 'Denver',        baseTop: 42, baseLeft: 33 },
  { name: 'Nashville',     baseTop: 45, baseLeft: 65 },
  { name: 'Miami',         baseTop: 80, baseLeft: 72 },
  { name: 'Atlanta',       baseTop: 58, baseLeft: 68 },
  { name: 'Minneapolis',   baseTop: 20, baseLeft: 52 },
  { name: 'Las Vegas',     baseTop: 52, baseLeft: 18 },
  { name: 'Boston',        baseTop: 22, baseLeft: 84 },
  { name: 'Portland',      baseTop: 15, baseLeft: 8  },
];

function getRandomRating() {
  return (3.5 + Math.random() * 1.4).toFixed(1);
}
function getRandomChange() {
  const val = (Math.random() * 1.8 + 0.2).toFixed(1);
  return Math.random() > 0.3 ? `+${val}` : `-${val}`;
}

function createCard(city) {
  const change = getRandomChange();
  return {
    id: `${city.name}-${Date.now()}-${Math.random()}`,
    city: city.name,
    rating: getRandomRating(),
    change,
    isPositive: change.startsWith('+'),
    top: city.baseTop + (Math.random() * 4 - 2),
    left: city.baseLeft + (Math.random() * 4 - 2),
  };
}

function ReviewCard({ card }) {
  return (
    <motion.div
      key={card.id}
      className="review-float-card"
      style={{ top: `${card.top}%`, left: `${card.left}%` }}
      initial={{ opacity: 0, scale: 0.6, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.6, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Dot + city name */}
      <div className="review-card-header">
        <span className="review-card-dot" />
        <span className="review-card-city">{card.city}</span>
      </div>
      {/* Big rating + change */}
      <div className="review-card-body">
        <span className="review-card-rating">{card.rating}%</span>
        <span
          className="review-card-change"
          style={{ color: card.isPositive ? '#06d6a0' : '#ff6b6b' }}
        >
          {card.change}%
        </span>
      </div>
    </motion.div>
  );
}

export const LiveReviewMap = () => {
  const [cards, setCards] = useState([]);
  const usedCities = useRef(new Set());

  useEffect(() => {
    // Pick 4 random cities to start
    const initialCities = [...US_CITIES]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    const initialCards = initialCities.map((city) => {
      usedCities.current.add(city.name);
      return createCard(city);
    });
    setCards(initialCards);

    // Rotate cards every 3 seconds
    const interval = setInterval(() => {
      setCards((prev) => {
        const newCards = [...prev];

        // Remove oldest card
        if (newCards.length >= 5) {
          const removed = newCards.shift();
          usedCities.current.delete(removed.city);
        }

        // Pick a city not currently shown
        const available = US_CITIES.filter(
          (c) => !usedCities.current.has(c.name)
        );
        if (available.length > 0) {
          const city = available[Math.floor(Math.random() * available.length)];
          usedCities.current.add(city.name);
          newCards.push(createCard(city));
        }

        return newCards;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="review-map-overlay" aria-label="Live review activity across US cities">
      <AnimatePresence mode="popLayout">
        {cards.map((card) => (
          <ReviewCard key={card.id} card={card} />
        ))}
      </AnimatePresence>
    </div>
  );
};
