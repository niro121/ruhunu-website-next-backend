// testimonial.types.ts

export type Testimonial = {
    id?: string;
    name: string;
    designation: string;
    testimonial: string;
    rating: number;
    visibility: boolean;
    createdBy?: string | null;  
    updatedBy?: string | null;  
    createdAt?: Date;
    updatedAt?: Date;
};

// When updating (partial, not including id)
export type UpdateTestimonialDTO = Partial<Omit<Testimonial, 'id'>>;

// Query parameters for getting testimonials (from request query string)
export type GetTestimonialParams = {
    page?: string;
    limit?: string;
    keyword?: string;
};

// Parsed/validated query used internally
export type GetTestimonialQuery = {
    page: number;
    limit: number;
    keyword: string;
};

// Return type for paginated testimonial list
export type GetTestimonialReturn = {
    data: Testimonial[];
    totalRecords: number;
};
