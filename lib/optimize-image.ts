export const optimizeImage = (
    imagePath: string,
    width?: number | null,
    height?: number | null,
    quality?: number | null,
    square?: boolean | null,
    rounded?: boolean | null
) => {
    const transformations = [];
    if (square) transformations.push('ar_1.0,c_fill');
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (quality) transformations.push(`q_${quality}`);
    if (rounded) transformations.push('r_max');
    return imagePath.split('upload/').join(`upload/${transformations.join(',')}/`);
}
