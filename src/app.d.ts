/// <reference types="@sveltejs/kit" />

declare global {
    namespace App {
        interface PageState {
            editMode?: boolean;
        }
    }
}

export {};
