export function isVisible(elt: Element): boolean {
    const style = window.getComputedStyle(elt);
    return (style.width !== null && +style.width !== 0)
        && (style.height !== null && +style.height !== 0)
        && (style.opacity !== null && +style.opacity !== 0)
        && style.display !== "none"
        && style.visibility !== "hidden";
}

export function adjust<T>(
    x: T,
    ...applyAdjustmentList: Array<((x: T) => void)>,
): T {
    for (const applyAdjustment of applyAdjustmentList) {
        applyAdjustment(x);
    }
    return x;
}

export function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export function* floodFill<TCell>(
    base: IterableIterator<TCell>,
    getNeighbours: (element: TCell) => IterableIterator<TCell>,
    neighbourFilter: (element: TCell) => boolean,
): IterableIterator<{ element: TCell, wave: number }> {

    const queue = new Array<{ element: TCell, wave: number }>();
    const visited = new Set<TCell>();

    function enqueueUnique(element: TCell, wave: number) {
        if (!visited.has(element)) {
            queue.push({element, wave});
            visited.add(element);
        }
    }

    for (const element of base) {
        enqueueUnique(element, 0);
    }

    for (let entry = queue.shift(); entry; entry = queue.shift()) {
        yield entry;

        const {element, wave} = entry;
        for (const t of getNeighbours(element)) {
            if (neighbourFilter(t)) {
                enqueueUnique(t, wave + 1);
            }
        }
    }
}
