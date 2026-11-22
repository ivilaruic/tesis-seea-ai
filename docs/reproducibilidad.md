# Reproducibilidad

## Requisitos
- **Earth Engine:** cuenta de Google Earth Engine con un proyecto en la nube.
- **Límite de Murray–Darling:** debe cargarse como activo. Las instrucciones están en `limite_murray_darling.md`.
- **Cuencas del Sinú y del Alto Madre de Dios:** se delimitan dentro de los scripts a partir de HydroSHEDS y no requieren ningún activo.
- **Demostración sintética** (opcional): Python 3.10 o superior, con `pip install -r python_pipeline/requirements.txt`.

## Parámetros fijos
| Parámetro | Valor |
|---|---|
| Random Forest | `ee.Classifier.smileRandomForest(200)`, modo regresión, sin búsqueda de hiperparámetros |
| Predictores (12) | B2, B3, B4, B8, B11, B12, NDVI, NDWI, NBR, elevación, pendiente, precipitación |
| Máscara de nubes | Cloud Score+ `cs_cdf ≥ 0,6`; escenas filtradas por CLOUDY_PIXEL_PERCENTAGE según el script: 40 % (validation_murray.js), 60 % (rf_biomass_*, validation_blocks_label2020.js, validation_tropical_ind.js), 70 % (validation_sinu.js, validation_madre_de_dios.js) y 80 % (sinu_change_2020_2024.js) |
| Etiqueta principal | NASA/ORNL `agb` (tC/ha, año 2010) |
| Muestreo de entrenamiento | 3.000 píxeles a 1 km por cuenca; semillas 42 (Murray–Darling), 7 (Sinú) y 11 (Alto Madre de Dios) |
| Partición de prueba en Murray–Darling | 70/30 aleatoria (`randomColumn`, semilla 42) |
| Ventanas de los predictores | Murray–Darling: dic. 2018–feb. 2019. Sinú: dic.–mar. (2019-20 y 2023-24). Alto Madre de Dios: jun.–sep. (2020 y 2023) |
| Comparación con referencias (5.2.4.6) | 4.000 puntos aleatorios a 1 km, semilla 99 |
| Validación cruzada (5.2.4.7) | 5 pliegues; bloques de 1° (Murray–Darling) y de 0,2° (trópico), asignados por hash; sin zona de exclusión |
| Conversiones | biomasa → carbono ×0,47 (IPCC, 2006); carbono → CO₂ ×44/12 |
| Precio de referencia | 25 USD/tCO₂ (rango 20–30) |

## Diferencias esperables al reejecutar
- **Escala de agregación.** Las medias de cuenca de la tesis se calcularon a 500 m y algunas validaciones a 1 km. Por ejemplo, el Sinú da ≈132 tCO₂/ha a 500 m y 128,2 a 1 km.
- **Variación entre ejecuciones.** El Random Forest de Earth Engine (`smileRandomForest`) usa semillas fijas, de modo que, con los mismos datos, el modelo es determinista. Las diferencias observadas entre ejecuciones —del orden de unidades de tCO₂/ha en las medias de cuenca, y de unos cientos de píxeles válidos en las muestras (por ejemplo, n = 2.997 frente a 2.764 en Murray–Darling)— proceden de la actualización de las colecciones de origen (Sentinel-2 y Cloud Score+) y del muestreo aproximado de `sample`. Para una reproducción exacta haría falta archivar las tablas de muestras y los ráster de predicción con fecha y commit.
- **Tiempo de cálculo.** Las tareas pesadas (por ejemplo, la sensibilidad a la etiqueta en el Alto Madre de Dios) pueden superar el tiempo interactivo. Si ocurre, deben ejecutarse por separado; hay una nota al principio de `validation_blocks_label2020.js`.

## Registro de ejecuciones de la validación
| Prueba | Script | Fecha de ejecución | Plataforma |
|---|---|---|---|
| Comparación con ESA CCI y GEDI; configuraciones A, B y C | `validation_tropical_ind.js` | 21/11/2026 | GEE Code Editor |
| Validación cruzada aleatoria y por bloques; etiqueta ESA CCI 2020 | `validation_blocks_label2020.js` | 21/11/2026 | GEE Code Editor |

## Limitaciones conocidas
- **Etiqueta de entrenamiento.** La etiqueta NASA/ORNL describe el año 2010 y los predictores son de 2018–2024. La sensibilidad a una etiqueta de 2020 se cuantifica en el epígrafe 5.2.4.7.
- **Independencia de las referencias.** ESA CCI y GEDI no son plenamente independientes de la etiqueta ni entre sí: la etiqueta integra mapas derivados de radar, y CCI v6 usa alometrías basadas en GEDI e ICESat-2.
- **Validación de campo.** No se ha hecho: se solicitaron los datos al IDEAM y a RAINFOR sin obtener acceso.
- **Demostración sintética.** La carpeta `python_pipeline/` usa datos sintéticos (`offline_sample`) y **no** reproduce resultados empíricos de la tesis.
