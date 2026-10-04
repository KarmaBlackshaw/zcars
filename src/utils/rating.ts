const MIN_RATINGS_FOR_AVERAGE = 3;

export const getAverageRating = (ratings: number[]) => {
  if (ratings.length < MIN_RATINGS_FOR_AVERAGE) {
    return undefined;
  }

  return (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1);
};
