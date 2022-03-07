const removeFistLevelNulls = (o) => {
    return Object.entries(o).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});
};

export { removeFistLevelNulls };
