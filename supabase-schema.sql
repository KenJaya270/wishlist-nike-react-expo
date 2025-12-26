-- ============================================
-- Supabase Database Schema for Wishlist Nike
-- ============================================

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development/testing)
-- Note: In production, you should create more restrictive policies based on user authentication
CREATE POLICY "Allow all operations on wishlists" 
ON wishlists 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS wishlists_created_at_idx ON wishlists(created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_wishlists_updated_at 
BEFORE UPDATE ON wishlists 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Sample Data (Optional)
-- ============================================

-- Insert sample wishlist items
INSERT INTO wishlists (title, price, image) VALUES
  ('Nike Air Max 270', '2199000', 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/custom-nike-air-max-270-by-you.png'),
  ('Nike Air Force 1', '1549000', 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png'),
  ('Nike Dunk Low', '1729000', 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/af53d53d-561f-450a-a483-70a7ceee380f/dunk-low-shoes-t9dFwD.png')
ON CONFLICT DO NOTHING;

-- ============================================
-- Useful Queries
-- ============================================

-- Get all wishlists ordered by newest first
-- SELECT * FROM wishlists ORDER BY created_at DESC;

-- Get wishlist by ID
-- SELECT * FROM wishlists WHERE id = 'your-uuid-here';

-- Count total wishlists
-- SELECT COUNT(*) FROM wishlists;

-- Delete all wishlists (use with caution!)
-- DELETE FROM wishlists;
