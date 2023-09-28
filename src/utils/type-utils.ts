/** Errors if the second type is missing keys from the first. */
export type EnforceKeys<Universe, Subset extends Record<keyof Universe, NonNullable<unknown>>> = Subset;
