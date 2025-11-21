export interface CreateReviewServiceInput {
  user_id: number;
  restaurant_id: number;
  rating: number;
  comment?: string;
}