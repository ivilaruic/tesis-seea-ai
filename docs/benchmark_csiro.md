# Benchmark estructural: cuentas SEEA-EA de la cuenca Murray–Darling (CSIRO)

Las cuentas de referencia son las de Smith, G.S., Stewart, S.B., Scheufele, G., Evans, D., Liu, N., Pascoe, S., Roxburgh, S.H., Schmidt, R.K. y Vardon, M. (2025), *Accounting for ecosystem services using extended supply and use tables: A case study of the Murray-Darling Basin, Australia*, Ecosystem Services 74, 101741, https://doi.org/10.1016/j.ecoser.2025.101741 (acceso abierto, CC BY).

El año contable es 2018-19 y la superficie de la cuenca, ≈1,06 millones de km².

## Valores de referencia publicados

| Servicio (2018-19) | Físico | Monetario |
|---|---|---|
| Biomasa pastada | 3.320.371 t | 907 M AUD |
| Retención de sedimentos | 49.725 kt/año | — |
| Secuestro de carbono | 1.054 Mt CO₂e/año | — |
| Stock de carbono (incluye suelo) | 36.708 Mt CO₂e (30/06/2019) | — |

Por hectárea, dividiendo entre ≈1,06·10⁸ ha:
- secuestro: 9,9 tCO₂/ha·año;
- stock: 346 tCO₂/ha, dominado por el suelo;
- retención de sedimentos: 0,47 t/ha·año.

## Uso en la tesis
El benchmark se usa como **referencia estructural** (arquitectura de cuentas, convención de condición y conjunto de servicios) y como contraste de orden de magnitud. No se usa para trasladar valores monetarios. La comparación por hectárea está en `datos/resultados_gee/benchmark_murray_darling.csv`, y la discusión, en el epígrafe 5.2.6 y la Tabla 9 de la tesis.

El carbono del suelo, que es la mayor parte de los 346 tCO₂/ha, no puede obtenerse con Sentinel-2. Por eso la comparación de stock se limita a la biomasa aérea.

## Datos del CSIRO (data.csiro.au, CC BY)
- Página del proyecto: https://www.csiro.au/en/research/natural-environment/natural-resources/Natural-capital-accounting/Murray-Darling-Basin
- Todas las cuentas experimentales y sus métodos: https://data.csiro.au/collection/csiro:57033
- Extensión: https://data.csiro.au/collection/csiro:56546
- Condición: https://data.csiro.au/collection/csiro:56564
- Biodiversidad: https://data.csiro.au/collection/csiro:56614
- Servicios ecosistémicos: https://data.csiro.au/collection/csiro:58493
- Síntesis: https://doi.org/10.25919/dbjj-ya71
- Resumen de fuentes de datos: https://doi.org/10.25919/cp78-1p52
