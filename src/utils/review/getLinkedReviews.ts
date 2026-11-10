import type { TReview } from "@/types";

export const getLinkedReviews = (reviews: TReview[]) => reviews.filter((review): review is TReview & { source_url: string } => review.source_url != null);
