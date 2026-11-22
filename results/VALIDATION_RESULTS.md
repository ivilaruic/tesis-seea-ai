# Resultados de las ejecuciones de Earth Engine (registro verificable)

Este archivo recoge las salidas de consola de los scripts de `gee/` que sustentan las cifras empíricas de la tesis. Las mismas cifras están en formato CSV en `datos/resultados_gee/`, y su correspondencia con cada epígrafe y tabla de la tesis se detalla en `docs/correspondencia_tesis.md`.

**Metadatos de reproducibilidad.** Las ejecuciones se hicieron en el Code Editor de Google Earth Engine (consola interactiva). Las ejecuciones originales de los indicadores y del Random Forest no conservan la fecha ni el commit que las produjo (epígrafe 4.5 de la tesis). Las validaciones de los epígrafes 5.2.4.6 y 5.2.4.7 se ejecutaron el 21/11/2026 (`docs/reproducibilidad.md`). Para reejecutar, conviene anotar la fecha y el hash del commit (`git rev-parse --short HEAD`).

## Murray–Darling — `validation_murray.js` (área: `projects/seea-ai/assets/mdb_boundary`)
| Variable | Valor | Unidad | Escala | Ventana temporal | Fuente |
|---|---|---|---|---|---|
| Superficie de la cuenca | 1.059.394 | km² | — | — | MDBA, Water Act 2007 |
| Escenas Sentinel-2 | 3.354 | número | — | 2018-12-01 / 2019-02-28 | S2_SR_HARMONIZED |
| NDVI medio | 0,229 | – | 500 m | verano 2018-19 | Sentinel-2 |
| Índice de condición C | 0,274 | 0–1 | 500 m | verano 2018-19 | Sentinel-2 (referencia H = 0,70) |
| NDVI Landsat | 0,277 | – | 500 m | verano 2018-19 | Landsat 8 (diferencia S2 − Landsat = −0,048) |
| Carbono de la biomasa aérea | 48,0 | tCO₂/ha | 300 m | línea base 2010 | NASA/ORNL |
| Producción primaria neta | 12,6 | tCO₂/ha·año | 500 m | 2018 | MODIS MOD17A3HGF |
| Proxy de pérdida de suelo (RUSLE) | 0,63 | t/ha·año | 1000 m | año fiscal 2018-19 | CHIRPS + SRTM + NDVI |
| Pérdida forestal Hansen | 524.266 | ha | 30 m | 2018-19 | UMD Hansen GFC v1.12 |
| Área quemada MODIS | 193.105 | ha | 500 m | año fiscal 2018-19 | MCD64A1 |

## Random Forest — `rf_biomass_mdb_to_sinu.js` (etiqueta: NASA/ORNL `agb`, 2010, 300 m)
| Variable | Valor | Unidad | Notas |
|---|---|---|---|
| n de entrenamiento / prueba | 5.035 / 829 | número | partición aleatoria 70/30 por píxel en Murray–Darling |
| Predictores | 12 | – | B2–B12, NDVI, NDWI, NBR, elevación, pendiente, precipitación |
| R² (prueba, Murray–Darling) | 0,77 | – | conjunto de prueba reservado; por bloques de 1°, R² = 0,76 (epígrafe 5.2.4.7) |
| RMSE | 13,2 | tC/ha | ≈ 48,4 tCO₂/ha |
| Media en Murray–Darling (RF) | 14,6 | tC/ha | = 53,5 tCO₂/ha (etiqueta NASA/ORNL: 13,1 tC/ha) |
| Sinú 2020 / 2024 (configuración B) | 132,3 / 139,7 | tCO₂/ha | `ADD_SINU_TRAINING = true` |
| ΔAGB Sinú | +8,9 | tCO₂/ha | cambio relativo, calculado con valores sin redondear |

## Río Sinú — `validation_sinu.js` (área: HydroBASINS `MAIN_BAS`, cuenca completa)
| Variable | Valor | Unidad | Escala | Ventana temporal | Fuente |
|---|---|---|---|---|---|
| Superficie de la cuenca | 14.065 | km² | — | — | HydroSHEDS `hybas_7`, `MAIN_BAS` |
| NDVI 2020 / 2024 | 0,563 / 0,622 | – | 300 m | estación seca 2019-20 / 2023-24 | Sentinel-2 |
| Índice de condición C 2020 / 2024 | 0,642 / 0,714 | 0–1 | 300 m | estación seca | Sentinel-2 (referencia H = 0,85) |
| NDVI Landsat 2024 | 0,655 | – | 500 m | estación seca 2023-24 | Landsat 8 (diferencia = −0,033) |
| Producción primaria neta 2020 / 2023 | 23,2 / 20,8 | tCO₂/ha·año | 500 m | anual | MODIS MOD17A3HGF |
| Proxy de pérdida de suelo | 0,45 | t/ha·año | 1000 m | 2023-24 | CHIRPS + SRTM + NDVI |
| Pérdida forestal Hansen | 14.580 | ha | 30 m | 2020-2024 | UMD Hansen GFC v1.12 |
| Alertas RADD | 5.605 | ha | 30 m | 2020-2024 | WUR RADD (Sentinel-1) |
| Área quemada MODIS | 3.246 | ha | 500 m | 2020-2024 | MCD64A1 |

## Lectura económica (Sinú) — epígrafe 5.2.4 y Tabla 8 de la tesis
En la cuenca hay un reverdecimiento neto (ΔNDVI +0,058, calculado con valores sin redondear; ΔC +0,072, es decir, +11,2 %; ΔAGB +8,9 tCO₂/ha) que convive con pérdidas forestales localizadas. La exposición bruta del stock de carbono en las zonas deforestadas es **puntual**:

14.580 ha × ≈130 tCO₂/ha ≈ 1,90 MtCO₂ → a 25 USD/tCO₂, ≈ **47,4 millones de USD**.

- Sensibilidad a la densidad y al precio: de 32,1 a 65,6 millones.
- Con fracción de liberación λ_R entre 0,30 y 1,00: de 14 a 47 millones.

Al no ser un flujo anual, la cifra no se capitaliza. Con la densidad de los píxeles efectivamente perdidos, la exposición sería de 64,6 a 111,6 millones (epígrafe 5.2.4.6), por lo que el escenario base es conservador.

---

## Alto Madre de Dios — `validation_madre_de_dios.js` (área: HydroBASINS `hybas_8`, prefijo Pfafstetter)
| Variable | Valor | Unidad | Escala | Ventana temporal | Fuente |
|---|---|---|---|---|---|
| Superficie de la cuenca | 35.183,22 | km² | — | — | HydroSHEDS `hybas_8`, prefijo de `PFAF_ID` (PREFIX_LEN = 7) |
| Pérdida forestal Hansen | 57.141 | ha | 30–100 m | 2020-2024 | UMD Hansen GFC v1.12 |
| Alertas RADD | 148.930,05 | ha | 100 m | 2020-2024 | WUR RADD (Sentinel-1) |
| NDVI 2020 / 2024 | 0,773 / 0,792 | – | 300 m | estación seca jun.-sep. 2020 / 2023 | Sentinel-2 |
| Índice de condición C 2020 / 2024 | 0,904 / 0,926 | 0–1 | 300 m | estación seca | Sentinel-2 (referencia H = 0,85) |
| NDVI Landsat 2024 | 0,813 | – | 500 m | estación seca 2023-24 | Landsat 8 (diferencia S2 − Landsat = −0,021) |
| Producción primaria neta 2020 / 2023 | 48,8 / 49,6 | tCO₂/ha·año | 500 m | anual | MODIS MOD17A3HGF |
| Proxy de pérdida de suelo | 0,32 | t/ha·año | 1000 m | 2022-23 | CHIRPS + SRTM + NDVI |
| Área quemada MODIS | 2.757 | ha | 500 m | 2020-2024 | MCD64A1 |
| Pérdida con firma minera (máscara SWIR/NDVI) | 1.371 | ha | 100 m | 2020-2024 | Hansen ∩ SWIR alto / NDVI bajo |

> **Nota sobre la delimitación.** El Sinú es una cuenca costera independiente y se selecciona bien con `MAIN_BAS` de HydroBASINS. El Alto Madre de Dios, en cambio, es un afluente amazónico, y `MAIN_BAS` arrastra toda la red amazónica aguas arriba (unos 5,9 millones de km² en la primera ejecución). Por eso se delimita por coincidencia de prefijo del código Pfafstetter (`PFAF_ID`) en el nivel más fino `hybas_8`. El ajuste de `PREFIX_LEN` está documentado en los comentarios `FIX` de los scripts: con 6 dígitos salen 125.554 km² y con 7, 35.183 km², que es el valor adoptado.

> La pérdida con firma minera (1.371 ha) es una fracción pequeña de la pérdida Hansen total (57.141 ha). La mayor parte de la pérdida detectada corresponde, por tanto, a tala y a cambio de uso del suelo, y no es por sí sola evidencia de la extensión de la minería aurífera.

## Random Forest — `rf_biomass_mdb_to_madrededios.js` (etiqueta: NASA/ORNL `agb`, 2010, 300 m)
| Variable | Valor | Unidad | Notas |
|---|---|---|---|
| n de entrenamiento / prueba | 5.225 / 829 | número | partición 70/30 en Murray–Darling más muestras tropicales del Alto Madre de Dios en el entrenamiento (`ADD_MDD_TRAINING = true`) |
| Predictores | 12 | – | receta idéntica |
| R² (prueba, Murray–Darling) | 0,77 | – | sin cambios respecto de la configuración del Sinú |
| RMSE | 13,3 | tC/ha | ≈ 48,8 tCO₂/ha |
| Alto Madre de Dios 2020 / 2024 | 409,8 / 414,0 | tCO₂/ha | `ADD_MDD_TRAINING = true` |
| ΔAGB Alto Madre de Dios | +4,3 | tCO₂/ha | media de cuenca, calculada con valores sin redondear |

> **Contraste de la densidad (epígrafes 5.2.4.5 y 5.2.4.6).**
> - Frente a la media regional de Asner et al. (2010), de 336,8 tCO₂/ha, la densidad estimada queda un 21,7 % por encima.
> - Frente a ESA CCI 2020 y GEDI L4B queda entre un 3 % y un 12 % por debajo.
> - El escenario del Alto Madre de Dios se sitúa, por tanto, en la parte alta del rango plausible.

## Lectura económica (Alto Madre de Dios) — epígrafe 5.2.4.3 y Anexo IV (Tabla A.5) de la tesis
La exposición del stock de carbono por deforestación es localizada:

57.141 ha × ≈410 tCO₂/ha ≈ 23,4 MtCO₂ → a 25 USD/tCO₂, ≈ **585,7 millones de USD**.

- Sensibilidad a la densidad (390–430 tCO₂/ha) y al precio (20–30 USD/tCO₂): de 446 a 737 millones.
- Con λ_R = 0,30 y 0,60: 175,7 y 351,4 millones.

La cifra es un orden de magnitud superior a la del Sinú porque la superficie perdida es unas 3,9 veces mayor y la densidad de carbono, unas 3,2 veces más alta. Como en el Sinú, es una exposición puntual del stock y no un flujo anual, de modo que no se capitaliza.

> La producción primaria neta no equivale al secuestro neto. La densidad de biomasa es una aproximación relativa anclada en la línea base NASA/ORNL de 2010, no un inventario anual absoluto. La sensibilidad a una etiqueta de 2020 se cuantifica en el epígrafe 5.2.4.7 (`datos/resultados_gee/sensibilidad_etiqueta_2020.csv`).
