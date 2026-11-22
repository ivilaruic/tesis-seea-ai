# Benchmark: cuentas SEEA-EA de la cuenca Murray–Darling (CSIRO; Smith et al., 2025)

SEEA-AI se contrasta con las cuentas SEEA-EA de la cuenca Murray–Darling publicadas con revisión por pares:

> Smith, G.S., Stewart, S.B., Scheufele, G., Evans, D., Liu, N., Pascoe, S., Roxburgh, S.H., Schmidt, R.K., Vardon, M. (2025). *Accounting for ecosystem services using extended supply and use tables: A case study of the Murray-Darling Basin, Australia.* Ecosystem Services 74, 101741. https://doi.org/10.1016/j.ecoser.2025.101741 (acceso abierto, CC BY).

El año contable es **2018–19**. La cuenca ocupa unos **1,06 millones de km²** según el límite oficial de la MDBA (Water Act 2007).

## Valores de referencia publicados (Smith et al., 2025)

| Servicio (2018-19) | Físico | Monetario |
|---|---|---|
| Cultivos | 12.537.745 t | — |
| Biomasa pastada | 3.320.371 t | **907 M AUD** |
| Suministro de agua (agrícola) | 8.894.954 ML | — |
| Retención de sedimentos | **49.725 kt/año** | — |
| Carbono: secuestro | **1.054 Mt CO₂e/año** | — |
| Carbono: stock (incluye suelo) | **36.708 Mt CO₂e** (30/06/2019) | — |

Por hectárea (÷ ≈1,06·10⁸ ha):
- secuestro: **9,9 tCO₂/ha·año**;
- stock: **346 tCO₂/ha**, dominado por el suelo;
- retención de sedimentos: **0,47 t/ha·año**.

## Comparación SEEA-AI frente al benchmark (epígrafe 5.2.6 y Tabla 9 de la tesis)

| Variable (por ha) | SEEA-AI (observación de la Tierra) | Smith et al. (2025) | Lectura |
|---|---|---|---|
| Superficie | 1.059.394 km² | ~1,06 M km² | mismo límite oficial |
| Secuestro de carbono | 12,6 tCO₂/ha·año (NPP de MODIS) | 9,9 | mismo orden (+27 %; la NPP no equivale al balance neto de carbono) |
| Stock de carbono | 48,0 tCO₂/ha (biomasa aérea) | 346 (incluye suelo) | componentes distintos (sin carbono del suelo) |
| Sedimentos (proxy RUSLE) | 0,63 t/ha·año | 0,47 | mismo orden (la pérdida bruta no equivale a la retención) |
| Random Forest de biomasa | R² = 0,77 (aleatoria); 0,76 por bloques de 1°; RMSE = 13,2 tC/ha | etiquetas NASA/ORNL | ajuste a la etiqueta, no precisión externa |
| Contraste entre sensores S2 y Landsat | diferencia = −0,048 | — | dentro del desfase conocido |
| Pérdida forestal Hansen 2018-19 | 524.266 ha | — | verificación con un producto distinto |
| Área quemada MODIS 2018-19 | 193.105 ha | — | verificación con un producto distinto |

El benchmark se usa como **referencia estructural y de orden de magnitud**, no como validación empírica directa de las cuencas tropicales.

El carbono del suelo, que es la mayor parte de los 346 tCO₂/ha de Smith et al., **no** puede obtenerse con Sentinel. Para incluirlo haría falta un producto de suelos, como SoilGrids/ISRIC o SLGA-TERN.

## Etiquetas y desfase temporal del Random Forest
Las etiquetas de biomasa proceden de **NASA/ORNL Harmonized biomass carbon density** (Spawn et al., 2020), una **línea base global de 2010 a unos 300 m**. Los predictores son de Sentinel-2 (2018–2024). Por eso las salidas del modelo son una **aproximación relativa o un contraste espacial**, no un inventario anual absoluto. La tesis cuantifica la sensibilidad a la etiqueta **ESA CCI Biomass 2020** en el epígrafe 5.2.4.7.
