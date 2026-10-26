export const swap = <T>(list: T[], from: number, to: number) => {
    if (from < 0 || to < 0 || from >= list.length || to >= list.length) return;
    [list[from], list[to]] = [list[to], list[from]];
};
