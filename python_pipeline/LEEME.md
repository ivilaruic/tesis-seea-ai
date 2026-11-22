# Demostración sintética (Python)

> **Aviso:** esta carpeta contiene una implementación de demostración que funciona con **datos sintéticos deterministas** (`source = offline_sample`). Sus cifras **no son resultados empíricos de la tesis** y no deben citarse como tales. Los resultados empíricos proceden de los scripts de `gee/` (raíz del repositorio) y están en `datos/resultados_gee/`. Los textos en inglés de esta carpeta (README.md) pertenecen al repositorio de trabajo original.

## Para qué sirve
- Ilustra la cadena contable de la tesis (capítulo 4): extensión → condición → flujos físicos → flujos monetarios → activo.
- Permite ejecutarla de principio a fin sin acceso a Earth Engine.
- Las cajas de las tres zonas (`config/sites.yaml`) son aproximaciones rectangulares. No coinciden con las cuencas hidrográficas usadas en la tesis.

## Ejecución
```
pip install -r requirements.txt
cd src && python -m seea_ai.run --config ../config/sites.yaml --out ../results/
```

## Contenido
- `src/seea_ai/`: módulos de índices, del modelo de condición, de contabilidad y de lectura de datos.
- `results/`: salidas de la ejecución sintética (`*_account.json`, `accounts_summary.csv` y `ai_metrics.csv`). Los R² de `ai_metrics.csv` (≈0,80) se refieren al modelo de condición sintético, **no** al Random Forest de biomasa de la tesis (R² = 0,77).
- `notebooks/demo.ipynb`: recorrido interactivo.
