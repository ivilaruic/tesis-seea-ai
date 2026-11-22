# Correspondencia entre la tesis, los scripts y los datos

Para cada resultado cuantitativo de la tesis se indica:
- el epígrafe o la tabla donde aparece;
- el script de `gee/` que lo genera;
- el archivo de datos donde queda registrado.

| Tesis (epígrafe / tabla) | Resultado | Script | Archivo de datos |
|---|---|---|---|
| 4.3.4.1, 5.2.3.1 | Diseño, entrenamiento y métricas del Random Forest (R² = 0,77; RMSE = 13,2 tC/ha) | `rf_biomass_mdb_to_sinu.js`, `rf_biomass_mdb_to_madrededios.js` | `datos/resultados_gee/random_forest_metricas.csv` |
| Tabla 4 | Notación, unidades y estatus empírico de las variables | — | `datos/tablas_tesis/tabla_4.csv` |
| Tabla 6 | Correspondencia entre observación de la Tierra, variables biofísicas y conceptos SEEA-EA | — | `datos/tablas_tesis/tabla_6.csv` |
| 5.2.4, Tabla 7 | Indicadores de vegetación y perturbación del Sinú 2020–2024 | `validation_sinu.js`, `sinu_change_2020_2024.js` | `datos/resultados_gee/sinu_indicadores.csv`, `datos/tablas_tesis/tabla_7.csv` |
| 5.2.4, Tabla 8 | Escenarios de exposición del stock de carbono del Sinú | `rf_biomass_mdb_to_sinu.js` (densidad) | `datos/tablas_tesis/tabla_8.csv` |
| 5.2.6, Tabla 9 | Comparación con cuentas oficiales y benchmark de Murray–Darling | `validation_murray.js` | `datos/resultados_gee/murray_darling_indicadores.csv`, `benchmark_murray_darling.csv`, `datos/tablas_tesis/tabla_9.csv` |
| 5.2.4.3, Tabla 10 | Indicadores del Alto Madre de Dios | `validation_madre_de_dios.js` | `datos/resultados_gee/madre_de_dios_indicadores.csv`, `datos/tablas_tesis/tabla_10.csv` |
| 5.2.4.5 | Contraste con el IFN del IDEAM (142,0 tCO₂/ha) y con Asner et al. (2010) (336,8 tCO₂/ha) | — (fuentes externas) | `datos/fuentes_datos.csv` |
| 5.2.4.6, Tabla 11 | Comparación con ESA CCI y GEDI L4B; configuraciones A, B y C; densidad en píxeles perdidos | `validation_tropical_ind.js` | `datos/resultados_gee/comparacion_productos_referencia.csv`, `densidad_pixeles_perdidos.csv`, `datos/tablas_tesis/tabla_11.csv` |
| 5.2.4.7, Tabla 12 | Validación cruzada aleatoria y por bloques; sensibilidad a la etiqueta ESA CCI 2020 | `validation_blocks_label2020.js` | `datos/resultados_gee/validacion_cruzada_bloques.csv`, `sensibilidad_etiqueta_2020.csv`, `datos/tablas_tesis/tabla_12.csv` |
| 5.2.6.3, Tabla 13 | Comparación descriptiva con implementaciones nacionales | — | `datos/tablas_tesis/tabla_13.csv` |
| Anexo IV, Tabla A.4 | Cuentas SEEA-AI paralelas del Sinú y del Alto Madre de Dios | `validation_sinu.js`, `validation_madre_de_dios.js`, scripts RF | `datos/tablas_tesis/tabla_A_4.csv` |
| Anexo IV, Tabla A.5 | Sensibilidad de la exposición en el Alto Madre de Dios (446–737 M USD) | `rf_biomass_mdb_to_madrededios.js` | `datos/tablas_tesis/tabla_A_5.csv` |
| Figuras de los capítulos 5 y del Anexo IV | Paneles de condición, perturbación y biomasa | scripts de cada cuenca | `results/` (paneles .jpg) |

| Todas las cifras derivadas (Tablas 8 y A.5, 5.2.4.5, 5.2.4.6, 5.2.4.7, conversiones) | Recalculadas y comprobadas: 41/41 | `calculos/verificar_cifras_tesis.py` | `calculos/verificacion_cifras.csv` |

## Configuraciones del módulo de biomasa
- **A (transferencia pura):** entrenado solo con muestras de Murray–Darling.
- **B (la de la tesis):** muestras de Murray–Darling y muestras de la propia cuenca tropical. Corresponde a `ADD_SINU_TRAINING = true` y `ADD_MDD_TRAINING = true`.
- **C (cuenca retenida):** muestras de Murray–Darling y de la *otra* cuenca tropical, de modo que la cuenca evaluada no se ve en el entrenamiento.

## Lo que no está en este repositorio
- **Datos de parcelas de campo.** Se solicitaron al IDEAM (Inventario Forestal Nacional, coordenadas reales) y a la red RAINFOR sin obtener acceso. La validación de campo queda como línea futura (epígrafes 5.2.4.7 y 8.2).
- **Imágenes de satélite de origen.** Se leen directamente de los catálogos de Earth Engine (`datos/fuentes_datos.csv`).
