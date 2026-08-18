import { describe, expect, it } from "vitest";

import {
  getCameraHeaderPaddingTop,
  getCameraSheetPaddingBottom,
  getTabContentBottomPadding,
} from "../shared/layout";

describe("espacement des zones sûres", () => {
  it("garde le contenu des onglets au-dessus de la barre système", () => {
    expect(getTabContentBottomPadding(0)).toBe(124);
    expect(getTabContentBottomPadding(34)).toBe(138);
  });

  it("préserve une marge minimale autour de la caméra", () => {
    expect(getCameraHeaderPaddingTop(0)).toBe(24);
    expect(getCameraHeaderPaddingTop(47)).toBe(59);
    expect(getCameraSheetPaddingBottom(0)).toBe(34);
    expect(getCameraSheetPaddingBottom(34)).toBe(52);
  });
});
