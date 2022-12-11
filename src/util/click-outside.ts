import { get, writable } from "svelte/store";

export const activeModals = writable<HTMLElement[]>([]);

export const clickOutside = (node) => {
    const handleClick = (event) => {
        if (!node.contains(event.target)) {
            let active = get(activeModals);
            node.dispatchEvent(new CustomEvent("outclick", { detail: active.at(-1) }));
        }
    };

    document.addEventListener("click", handleClick, true);
    activeModals.set([...get(activeModals), node]);

    return {
        destroy() {
            document.removeEventListener("click", handleClick, true);
            activeModals.set([...get(activeModals).filter((n) => n !== node)]);
        },
    };
};
