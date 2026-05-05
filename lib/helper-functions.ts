export const filterArrayBySearchTerm = (options: string[], searchTerm: string, limit?: number): string[] => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) {
        return options;
    }
    const results = options
        .filter((option) => option.toLowerCase().includes(normalized))
        .sort((a, b) => {
            const aStarts = a.toLowerCase().startsWith(normalized);
            const bStarts = b.toLowerCase().startsWith(normalized);
            const aIncludesWord = a.toLowerCase().includes(` ${normalized}`);
            const bIncludesWord = b.toLowerCase().includes(` ${normalized}`);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            if (aIncludesWord && !bIncludesWord) return -1;
            if (!aIncludesWord && bIncludesWord) return 1;
            return a.localeCompare(b);
        });
    if (limit) {
        return results.slice(0, limit);
    } else {
        return results;
    }
}
