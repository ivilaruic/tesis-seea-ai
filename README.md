# SEEA-AI — repositorio de la tesis doctoral

**Tesis doctoral:** *SEEA-AI: una arquitectura económica para medir y valorar el capital natural con observación de la Tierra e inteligencia artificial.*
**Autor:** Ivan Vilar Ramírez
**Programa:** Doctorado en Economía y Derecho, Universitat Internacional de Catalunya (UIC Barcelona)
**Dirección:** Dr. Miquel Bastons Prat (director) y Dra. María Fernanda González Gutiérrez (codirectora)

Este repositorio reúne todo lo que sustenta las cifras empíricas de la tesis:
- el código;
- los resultados de cada cálculo;
- las imágenes;
- las tablas;
- las fuentes de datos.

Parte del repositorio de trabajo del proyecto, con todo su historial de cambios, e incorpora las validaciones y la documentación elaboradas para el depósito. Cada tabla y cada epígrafe con resultados cuantitativos se puede rastrear hasta un script de Google Earth Engine y un archivo de datos (véase `docs/correspondencia_tesis.md`).

> **Versión de depósito:** la versión que corresponde exactamente al texto depositado es la *release* etiquetada `v1.0-deposito`.

---

## Estructura

```
gee/                         Scripts de Google Earth Engine (JavaScript) que generan todos los resultados
  validation_murray.js         Murray–Darling 2018-19 frente al benchmark del CSIRO
  validation_sinu.js           Río Sinú 2020-2024: cuenta completa
  sinu_change_2020_2024.js     Río Sinú: análisis de cambio
  validation_madre_de_dios.js  Alto Madre de Dios 2020-2024: cuenta completa
  rf_biomass_mdb_to_sinu.js    Random Forest de biomasa: Murray–Darling → Sinú
  rf_biomass_mdb_to_madrededios.js  Random Forest de biomasa: Murray–Darling → Alto Madre de Dios
  validation_tropical_ind.js   Comparación con ESA CCI y GEDI; cuencas retenidas (epígrafe 5.2.4.6)
  validation_blocks_label2020.js  Validación por bloques y etiqueta de 2020 (epígrafe 5.2.4.7)
calculos/
  verificar_cifras_tesis.py  Recalcula las 53 cifras derivadas de la tesis (escenarios, contrastes, conversiones) y las compara con el texto
  verificacion_cifras.csv    Resultado de la verificación (53 de 53 coinciden)
  figuras_tesis.py           Genera las Figuras 8 y 9 de la tesis a partir de los CSV
datos/
  fuentes_datos.csv          Las 21 fuentes de datos: identificador, versión, resolución, periodo, uso y DOI
  resultados_gee/            Resultados numéricos de todas las ejecuciones (CSV)
  tablas_tesis/              Tablas de datos de la tesis en CSV (Tablas 4, 6-13, A.1 y A.2)
results/
  VALIDATION_RESULTS.md      Registro de las salidas de consola de Earth Engine, por cuenca
  panel_*.jpg                Paneles cartográficos de Murray–Darling, el Sinú y el Alto Madre de Dios (Figuras 2–7 y A.1–A.3)
  fig8_*.png, fig9_*.png     Gráficos de validación y de exposiciones (Figuras 8 y 9)
benchmark/                   Valores de referencia del CSIRO (Smith et al., 2025) y enlaces a sus datos
data/mdb_boundary/           Límite oficial de Murray–Darling (instrucciones de carga en Earth Engine)
docs/
  correspondencia_tesis.md   Epígrafe o tabla de la tesis → script → archivo de datos
  diccionario_datos.md       Descripción de cada archivo y de cada campo
  reproducibilidad.md        Parámetros, semillas, registro de ejecuciones y limitaciones
  limite_murray_darling.md   Descarga y carga del límite oficial de Murray–Darling
  benchmark_csiro.md         Benchmark estructural del CSIRO (en español)
python_pipeline/             Implementación en Python con datos SINTÉTICOS (véase python_pipeline/LEEME.md)
```

Toda la documentación está en español. Algunos comentarios internos del código de los scripts conservan el inglés de la versión de trabajo. El texto de la licencia MIT se mantiene en su versión original en inglés.

## Las tres cuencas

| Cuenca | País | Papel en la tesis | Periodo | Delimitación |
|---|---|---|---|---|
| Murray–Darling | Australia | Banco de pruebas y benchmark estructural (cuentas SEEA-EA del CSIRO) | 2018-19 | Límite oficial de la MDBA (Water Act 2007) |
| Río Sinú | Colombia | Caso de uso principal | 2020–2024 | HydroSHEDS `hybas_7`, `MAIN_BAS` |
| Alto Madre de Dios | Perú | Segunda aplicación tropical | 2020–2024 | HydroSHEDS `hybas_8`, prefijo Pfafstetter de 7 dígitos |

## Resultados principales

| Resultado | Valor | Archivo |
|---|---|---|
| Ajuste del Random Forest en Murray–Darling | R² = 0,77; RMSE = 13,2 tC/ha | `datos/resultados_gee/random_forest_metricas.csv` |
| Validación cruzada por bloques de 1° | R² = 0,76 | `datos/resultados_gee/validacion_cruzada_bloques.csv` |
| Pérdida forestal 2020–2024 | Sinú: 14.580 ha. Alto Madre de Dios: 57.141 ha | `sinu_indicadores.csv`, `madre_de_dios_indicadores.csv` |
| Exposición bruta del stock de carbono (escenario base) | Sinú: 47,4 M USD (32,1–65,6). Alto Madre de Dios: 585,7 M USD (446–737) | `datos/tablas_tesis/tabla_8.csv`, `tabla_A_2.csv` |
| Comparación con ESA CCI y GEDI (configuración de la tesis) | densidades entre un 3 % y un 21 % por debajo de ambos productos | `comparacion_productos_referencia.csv` |
| Prueba con cuenca retenida | el modelo no se transfiere sin recalibración | `comparacion_productos_referencia.csv` (configuración C) |
| Sensibilidad a la etiqueta de 2020 | densidades entre un 14 % y un 26 % más altas; las exposiciones siguen dentro de los rangos | `sensibilidad_etiqueta_2020.csv` |

Las magnitudes monetarias son **escenarios de exposición bruta del stock de carbono**. Dependen de la densidad de carbono, del precio de referencia (20–30 USD/tCO₂) y de la fracción de liberación. No son cuentas oficiales ni valores de activo.

## Cómo reproducir

**Cálculos derivados (sin Earth Engine):** `python calculos/verificar_cifras_tesis.py` recalcula todas las exposiciones monetarias, los contrastes con el IDEAM y con Asner et al. (2010), la sensibilidad a la etiqueta y las conversiones de unidades, y comprueba que coinciden con la tesis.

**Resultados de teledetección:**

1. Abra el [Code Editor de Google Earth Engine](https://code.earthengine.google.com) con una cuenta y un proyecto en la nube.
2. Cargue el límite de Murray–Darling como activo (`docs/limite_murray_darling.md`). Si la ruta resultante es distinta, cambie `projects/seea-ai/assets/mdb_boundary` en los scripts.
3. Ejecute el script de `gee/` que corresponda y compare la salida de la consola con los CSV de `datos/resultados_gee/`.

Los parámetros, las semillas, las ventanas temporales y las diferencias esperables al reejecutar están en `docs/reproducibilidad.md`.

## Licencias

- **Código** (`gee/` y `python_pipeline/`): MIT (`LICENSE`).
- **Datos de resultados, tablas y paneles** elaborados en la tesis: CC BY 4.0 (`LICENCIA_DATOS.md`).
- **Productos de origen** (Sentinel-2, Landsat, ESA CCI, GEDI, Hansen GFC, etc.): conservan sus propias licencias. Véase `datos/fuentes_datos.csv`.

## Cómo citar

Vilar Ramírez, I. (2026). *SEEA-AI: una arquitectura económica para medir y valorar el capital natural con observación de la Tierra e inteligencia artificial* [Tesis doctoral]. Universitat Internacional de Catalunya. Código y datos: https://github.com/ivilaruic/tesis-seea-ai (véase `CITATION.cff`).
