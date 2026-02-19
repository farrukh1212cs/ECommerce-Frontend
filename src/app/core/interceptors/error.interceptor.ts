import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export interface ErrorResponse {
    statusCode: number;
    message: string;
    details?: any;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unexpected error occurred';
            let summary = 'Error';
            
            // Check if error is 0 (Network Error)
            if (error.status === 0) {
                errorMessage = 'Network error. Please check your connection.';
                summary = 'Network Error';
            }
            // Check if error body matches our backend ErrorResponse structure
            else if (error.error && typeof error.error === 'object' && 'message' in error.error) {
                const backendError = error.error as ErrorResponse;
                errorMessage = backendError.message || errorMessage;
                
                // If it's a validation error (400) and details exist, we might want to show them
                if (backendError.statusCode === 400 && backendError.details) {
                     console.error('Validation Details:', backendError.details);
                     // You could enhance this to show specific validation messages if needed
                }
            } 
            else if (error.status === 404) {
                errorMessage = 'Resource not found';
            } else if (error.status === 401) {
                errorMessage = 'Unauthorized access';
                summary = 'Unauthorized';
            } else if (error.status === 403) {
                errorMessage = 'Forbidden access';
                summary = 'Forbidden';
            } else if (error.status === 500) {
                errorMessage = 'Internal Server Error';
                summary = 'Server Error';
            }

            // Display error via PrimeNG Toast
            messageService.add({ 
                severity: 'error', 
                summary: summary, 
                detail: errorMessage,
                life: 5000 
            });

            return throwError(() => error);
        })
    );
};
