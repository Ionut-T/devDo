import { AbstractControl } from '@angular/forms';

/**
 * Helper function for displaying the form controls errors.
 */
export const displayFormErrors = (
  control: AbstractControl,
  placeholder: string,
  minLength?: number,
  maxLength?: number
): string => {
  let errorMessage = '';

  switch (control.invalid) {
    case control.hasError('required'):
      errorMessage = `${placeholder} is required`;
      break;

    case control.hasError('email'):
      errorMessage = `${placeholder} needs to be a valid email`;
      break;

    case control.hasError('minlength'):
      errorMessage = `${placeholder} needs to have at least ${minLength} characters`;
      break;

    case control.hasError('maxlength'):
      errorMessage = `${placeholder} needs to have maximum ${maxLength} characters`;
      break;

    case control.hasError('mustMatch'):
      errorMessage = `Passwords must match`;
      break;

    default:
      break;
  }

  return errorMessage;
};
