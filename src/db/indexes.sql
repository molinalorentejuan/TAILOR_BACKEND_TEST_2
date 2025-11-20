-- Índices para mejorar rendimiento en consultas

-- USERS
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- RESTAURANTS
CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(rating);
CREATE INDEX IF NOT EXISTS idx_restaurants_name ON restaurants(name);

-- REVIEWS
CREATE INDEX IF NOT EXISTS idx_reviews_restaurantId ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_userId ON reviews(user_id);

-- FAVORITES
CREATE INDEX IF NOT EXISTS idx_favorites_userId ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_restaurantId ON favorites(restaurant_id);