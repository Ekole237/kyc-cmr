export function getTabContentBottomPadding(safeAreaBottom: number) {
  return Math.max(safeAreaBottom + 104, 124);
}

export function getCameraHeaderPaddingTop(safeAreaTop: number) {
  return Math.max(safeAreaTop + 12, 24);
}

export function getCameraSheetPaddingBottom(safeAreaBottom: number) {
  return Math.max(safeAreaBottom + 18, 34);
}
