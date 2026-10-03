export const getAverageRating = (ratings: number[]) => (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1);
