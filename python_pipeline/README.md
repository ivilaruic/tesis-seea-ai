# Pipeline Python de SEEA-AI: demostración de la cadena contable

> **Aviso:** con `--backend offline`, las salidas son **demostraciones deterministas a partir de datos sintéticos**, marcadas con `source = offline_sample` en cada registro. **No son resultados empíricos de la tesis.** Los resultados empíricos proceden de los scripts de Google Earth Engine (`gee/`, en la raíz del repositorio) y están en `datos/resultados_gee/`.

Esta implementación ilustra la cadena stock–flujo–valor formalizada en el capítulo 4 de la tesis: observación de la Tierra → condición → flujos físicos → flujos monetarios → activo. Sigue la estructura de cuentas del SEEA-EA (extensión, condición, flujos físicos, flujos monetarios y activos).

## Zonas de la demostración (`config/sites.yaml`)

| Zona | País | Papel | Caja `[O,S,E,N]` |
|---|---|---|---|
| Murrumbidgee | Australia | referencia (cuencas MDB del CSIRO) | `144.0, -35.5, 146.5, -34.0` |
| Rio_Sinu | Colombia | caso de uso principal | `-76.5, 8.0, -75.0, 9.5` |
| Alto_Madre_de_Dios | Perú | segunda aplicación | `-72.2, -14.0, -69.8, -11.6` |

Épocas: **2020 → 2024**. Las cajas son aproximaciones rectangulares. Las cuencas hidrográficas de la tesis se delimitan en los scripts de `gee/`: HydroSHEDS `MAIN_BAS` para el Sinú y prefijo Pfafstetter `hybas_8` (≈35.183 km²) para el Alto Madre de Dios.

## Instalación

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

## Ejecución

```bash
cd src
# Sentinel-2 real (compuesto mediano sin nubes) mediante STAC público; no requiere cuenta
python -m seea_ai.run --config ../config/sites.yaml --backend stac --ai sklearn --out ../results_stac

# Demostración reproducible offline (datos sintéticos deterministas, sin red)
python -m seea_ai.run --config ../config/sites.yaml --backend offline --ai numpy --out ../results
```

La ejecución offline es **determinista**: dos ejecuciones sucesivas producen archivos idénticos, y los de `results/` se han generado con ese mismo comando (comprobado el 22/11/2026). La semilla de cada zona se obtiene con un hash SHA-256 estable del nombre y de las coordenadas.

Para cada zona se generan:
- `results/<zona>_account.json`;
- `results/accounts_summary.csv`;
- `results/ai_metrics.csv`;
- las figuras `results/figures/<zona>_<año>_raw.png` (color verdadero) y `_processed.png` (condición C).

Las figuras se crean al ejecutar el pipeline y no se guardan en el repositorio.

Los R² de `ai_metrics.csv` (≈0,80) son del modelo de condición **sintético**, **no** del Random Forest de biomasa de la tesis (R² = 0,77; véase `datos/resultados_gee/random_forest_metricas.csv`).

## Módulos

```
src/seea_ai/
  fetch.py            adquisición de datos (STAC / GEE) + muestra offline determinista
  indices.py          NDVI, NDWI e indicador de condición C∈[0,1] (proxy de verdor)
  condition_model.py  Random Forest (sklearn) con alternativa en numpy; R²/RMSE
  accounting.py       extensión, condición, flujos de carbono y sedimentos, valoración, ΔK
  run.py              ejecución de principio a fin + exportación de figuras
config/sites.yaml     zonas, épocas y parámetros económicos
notebooks/demo.ipynb  recorrido guiado
data/DATA_DICTIONARY.md  diccionario de campos
docs/CSIRO_BENCHMARK.md  correspondencia estructural con las cuentas del CSIRO
```

## Licencia

MIT: véase [LICENSE](LICENSE).
