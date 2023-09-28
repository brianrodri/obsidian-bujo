import { ICollection } from "collections/collection";

/** The values needed for views to do their job. */
export type ViewContext = {
    /** The note the view is being rendered upon. */
    note: string;
    /** The collection the corresponding note belongs to. */
    collection: ICollection;
};
