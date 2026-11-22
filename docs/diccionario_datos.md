# Diccionario de datos

Todos los CSV están codificados en UTF-8 y usan la coma como separador.
- **`datos/resultados_gee/`:** el separador decimal es el punto.
- **`datos/tablas_tesis/`:** se conserva el formato de la tesis (coma decimal y punto de miles).

## `datos/fuentes_datos.csv`
| Campo | Descripción |
|---|---|
| `producto` | Nombre del conjunto de datos |
| `identificador_earth_engine` | Identificador en el catálogo de Earth Engine (o «no aplica» si la fuente es externa) |
| `version` | Versión o colección empleada |
| `resolucion` | Resolución nativa (y de agregación, si procede) |
| `periodo_usado` | Periodo temporal utilizado |
| `uso_en_la_tesis` | Para qué se emplea |
| `referencia` | Referencia bibliográfica abreviada (completa en la bibliografía de la tesis) |
| `doi_o_enlace` | DOI o ficha del catálogo |

## `datos/resultados_gee/`
| Archivo | Contenido | Campos principales |
|---|---|---|
| `murray_darling_indicadores.csv` | Indicadores de Murray–Darling 2018-19 | `variable`, `valor`, `unidad`, `escala`, `ventana_temporal`, `fuente`, `script` |
| `sinu_indicadores.csv` | Indicadores del Sinú en 2020 y 2024 | `variable`, `valor_2020`, `valor_2024`, `unidad`, `escala`, `fuente`, `script` |
| `madre_de_dios_indicadores.csv` | Indicadores del Alto Madre de Dios en 2020 y 2024 | igual que el anterior |
| `random_forest_metricas.csv` | Muestras, partición y métricas del Random Forest de biomasa | `n_entrenamiento`, `n_prueba`, `r2_prueba`, `rmse_tC_ha`, `rmse_tCO2_ha` |
| `comparacion_productos_referencia.csv` | Comparación celda a celda con ESA CCI 2020 y GEDI L4B (configuraciones A, B y C; Tabla 11) | `configuracion`, `referencia`, `n`, `media_referencia_tCO2_ha`, `media_rf_tCO2_ha`, `sesgo_pct`, `rmse_tCO2_ha`, `r2_1a1`, `r_pearson` |
| `densidad_pixeles_perdidos.csv` | Densidad en los píxeles de pérdida Hansen 2021–2024 y exposición implícita | `densidad_media_cuenca_2020_tCO2_ha`, `densidad_pixeles_perdidos_2021_2024_tCO2_ha`, `exposicion_con_densidad_pixeles_perdidos_MUSD` |
| `validacion_cruzada_bloques.csv` | Validación cruzada de cinco pliegues, aleatoria y por bloques (Tabla 12) | `particion`, `referencia`, `n`, `sesgo_pct`, `rmse_tCO2_ha`, `r2_1a1`, `r_pearson` |
| `sensibilidad_etiqueta_2020.csv` | Resultados con la etiqueta ESA CCI 2020 frente a la principal | `densidad_media_cuenca_tCO2_ha`, `densidad_pixeles_perdidos_tCO2_ha`, `sesgo_frente_GEDI_pct`, `exposicion_densidad_cuenca_MUSD` |
| `benchmark_murray_darling.csv` | Comparación por hectárea con Smith et al. (2025) | `seea_ai`, `smith_et_al_2025`, `unidad`, `lectura` |

### Definiciones
- **`sesgo_pct`**: (media RF − media de referencia) / media de referencia × 100.
- **`r2_1a1`**: 1 − Σ(predicción − referencia)² / Σ(referencia − media de referencia)². Es el R² respecto de la recta 1:1, así que puede ser negativo.
- **`rmse_tCO2_ha`**: raíz del error cuadrático medio en tCO₂/ha.
- **Exposición (M USD)**: superficie de pérdida (ha) × densidad (tCO₂/ha) × precio (USD/tCO₂) / 10⁶. Supone liberación completa (λ_R = 1).

## `datos/tablas_tesis/`
Cada archivo `tabla_N.csv` reproduce la tabla N de la tesis. La primera fila contiene los encabezados de columna; las celdas vacías corresponden a celdas combinadas o en blanco en la tesis.
- **Tablas 4 y 6:** notación y correspondencia operativa.
- **Tablas 7–13:** resultados y comparaciones.
- **Tablas A.4 y A.5 (Anexo IV):** cuentas paralelas y sensibilidad del Alto Madre de Dios.
