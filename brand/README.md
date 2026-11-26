# KDNA Brand & Visual Identity Guidelines · KDNA 品牌与视觉标识规范

Official optical vector marks, square avatar, and trademark usage boundaries for **KDNA** and **AIKDNA**.  
**KDNA** 与 **AIKDNA** 官方光学分级矢量标志、方形头像及商标使用边界说明。

[Website (`aikdna.com`)](https://aikdna.com) · [中文官网 (`aikdna.cn`)](https://aikdna.cn) · [GitHub (`github.com/aikdna`)](https://github.com/aikdna)

---

## 1. Trademark & License Boundary · 商标与许可边界

**All Rights Reserved (Trademark Reserved).**  
While KDNA specifications and reference toolchains are licensed under `Apache-2.0` and the *KDNA Whitepaper* is licensed under `CC BY 4.0`, the **KDNA** and **AIKDNA** names, wordmarks, and all visual marks in `brand/` are **Trademark Reserved (All Rights Reserved)** — they are **NOT** licensed under `Apache-2.0`, `MIT`, or `CC BY`.

**商标权保留（保留所有权利）。**  
尽管 KDNA 规范与参考工具链采用 `Apache-2.0` 许可、《KDNA 白皮书》采用 `CC BY 4.0` 许可，但 **KDNA** 与 **AIKDNA** 名称及 `brand/` 目录下的全部视觉标识均属于**商标权保留资产（All Rights Reserved）**，**不**在 `Apache-2.0`、`MIT` 或 `CC BY` 许可授权范围内。

### Permitted Uses · 允许的使用方式

- **Editorial, press, and academic coverage** accurately referring to KDNA or AIKDNA (新闻报道、媒体评测与学术引用).
- **Tutorials, documentation, and technical talks** explaining the `.kdna` format or toolchain (教程、文档与技术分享).
- **Compatibility references** (e.g., *"Compatible with `.kdna`"* / *"Supports KDNA"*) that clearly identify your own product as independent and link back to [`aikdna.com`](https://aikdna.com) or [`github.com/aikdna`](https://github.com/aikdna) (明确区分自身品牌并链接至官网或 GitHub 主页的兼容性标识).

### Prohibited Uses · 禁止的使用方式

- **Altering proportions, geometry, stroke weights, or colors** of the mark, or separating the orange core from the three rods (篡改比例、几何坐标、线宽或配色，或拆分橙色核心圆环与三支杆件).
- **Using the KDNA mark as a third-party app icon, product logo, or organization avatar** (将 KDNA 标志用作第三方应用图标、产品 Logo 或组织头像).
- **Implying official endorsement, sponsorship, or partnership** without prior written permission from AIKDNA (未经书面授权暗示官方背书、赞助或合作关系).

---

## 2. Canonical Brand Files · 官方标识文件清单

<table>
  <thead>
    <tr>
      <th align="center">Master Mark (≥ 48px)</th>
      <th align="center">Micro / Optical Mark (16–32px)</th>
      <th align="center">Square Avatar (1024 × 1024)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="./kdna-mark-master-dark.svg">
          <source media="(prefers-color-scheme: light)" srcset="./kdna-mark-master.svg">
          <img alt="KDNA Master Mark" src="./kdna-mark-master.svg" width="96" height="96">
        </picture>
      </td>
      <td align="center">
        <img alt="KDNA Micro Optical Mark" src="./kdna-mark-micro.svg" width="32" height="32">
      </td>
      <td align="center">
        <img alt="KDNA Square Avatar 1024x1024" src="./kdna-avatar-1024.png" width="96" height="96">
      </td>
    </tr>
  </tbody>
</table>

| File | Optical Grade | Intended Sizes | Background / Theme |
| :--- | :--- | :--- | :--- |
| [`kdna-mark-master.svg`](./kdna-mark-master.svg) | **Master Mark** | `≥ 48px` (headers, hero, docs, slides, print) | Light surfaces (`#ffffff` / light neutral) |
| [`kdna-mark-master-dark.svg`](./kdna-mark-master-dark.svg) | **Master Mark** | `≥ 48px` (dark UI, dark slides, dark hero) | Dark surfaces (`#17191c` / dark neutral) |
| [`kdna-mark-micro.svg`](./kdna-mark-micro.svg) | **Micro / Optical Mark** | `16px–32px` (browser favicons, small UI badges) | Adaptive (`prefers-color-scheme: light / dark`) |
| [`kdna-avatar-1024.png`](./kdna-avatar-1024.png) | **Master Mark Avatar** | `1024 × 1024` full-bleed `#ffffff` square (GitHub, social, circular crops) | Solid `#ffffff` with circular-safe padding |

---

## 3. Optical Sizing Specification · 光学分级几何规范

The KDNA mark uses two optically tuned geometry grades on a shared `viewBox="170 165 665 665"` coordinate frame so that the three rods and the orange core circle remain crisp and balanced from `16px` browser favicons up to large-format print.

KDNA 标志在统一的 `viewBox="170 165 665 665"` 坐标系下提供两套光学调校几何规格：在 `16px–32px` 极小尺寸下，Micro Mark 通过增粗线宽并将内侧杆端回退 `4–5` 单位，避免核心圆环与三支杆件在低像素密度下发生视觉粘连。

| Parameter | Master Mark (`≥ 48px`) | Micro / Optical Mark (`16px–32px`) |
| :--- | :--- | :--- |
| **`viewBox`** | `170 165 665 665` | `170 165 665 665` |
| **Rod 0 (top-left)** | `M280.31332 362.65886 L240 235` | `M278.80767 357.89095 L240 235` *(pulled back ~5.0 units)* |
| **Rod 1 (top-right)** | `M473.78780 427.44694 L765 240` | `M477.15125 425.28195 L765 240` *(pulled back ~4.0 units)* |
| **Rod 2 (bottom-right)** | `M477.57547 606.38564 L740 760` | `M481.02753 608.40636 L740 760` *(pulled back ~4.0 units)* |
| **Rod `stroke-width` & cap** | `70` · `stroke-linecap="round"` | `78` · `stroke-linecap="round"` |
| **Core circle (`cx`, `cy`, `r`)** | `cx="330" cy="520" r="62"` | `cx="330" cy="520" r="61.5"` |
| **Core `stroke-width`** | `26` | `37` |

---

## 4. Color Tokens & Clear Space · 色彩规范与安全留白

### Color Tokens · 色彩令牌

| Token | Hex | Role |
| :--- | :--- | :--- |
| **Ink Primary (Light)** | `#17191c` | Three rods on light surfaces |
| **Ink Primary (Dark)** | `#f1f2f4` | Three rods on dark surfaces |
| **Core Accent (Light)** | `#dc6628` | Signature orange core circle on light surfaces |
| **Core Accent (Dark)** | `#ff9a61` | Signature orange core circle on dark surfaces |
| **Canvas Light** | `#ffffff` | Full-bleed square avatar background & standard light canvas |

### Minimum Clear Space · 最小安全留白

- **Standalone mark (`≥ 48px`):** Maintain a minimum clear-space margin of **`0.25 ×` the mark height** on all four sides, free of text, borders, or competing graphics.  
  **独立标志（`≥ 48px`）**：标志四边均须保留至少 **`0.25 ×` 标志高度**的安全留白，不得侵入文字、边框或其他图形元素。
- **Circular / squircle avatars:** Center the Master Mark inside a full-bleed `#ffffff` square at **`~65.6%` viewBox scale** (`~20.6%` ink-to-edge padding on all four sides, as rendered in [`kdna-avatar-1024.png`](./kdna-avatar-1024.png)) so circular platform masks never clip the outer rod tips.  
  **圆形 / 圆角头像**：将 Master Mark 以约 **`65.6%` viewBox 比例**居中置于满版 `#ffffff` 正方形画布内（四边图形到画布边缘约保留 `20.6%` 留白，见 [`kdna-avatar-1024.png`](./kdna-avatar-1024.png)），确保平台圆形裁切不会切到外侧杆端。
