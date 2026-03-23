export interface ToastMessage {
    id: number;
    type: "error" | "warning" | "success" | "info";
    message: string;
    duration: number;
}

let toasts = $state<ToastMessage[]>([]);
let idCounter = 0;

export function showToast(
    message: string,
    type: ToastMessage["type"] = "info",
    duration: number = 3000,
) {
    const id = idCounter++;
    toasts.push({ id, type, message, duration });
    return id;
}

export function dismissToast(id: number) {
    toasts = toasts.filter((t) => t.id !== id);
}

export function clearToasts() {
    toasts = [];
}

export function getToasts(): ToastMessage[] {
    return toasts;
}
