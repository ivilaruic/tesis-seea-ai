# Guía de reproducibilidad

La versión completa y actualizada está en `docs/reproducibilidad.md`. Este archivo resume los pasos esenciales.

## Entorno de software (pipeline Python, demostración sintética)
    conda env create -f environment.yml   # o bien: pip install -r requirements.txt
    conda activate seea-ai

## Cálculos derivados de la tesis (sin Earth Engine)
    python calculos/verificar_cifras_tesis.py

El script recalcula y comprueba las 59 cifras derivadas de la tesis: escenarios monetarios, contrastes con el IDEAM y con Asner et al. (2010), sensibilidad a la etiqueta, pérdida anual de valor del activo natural frente al PIB regional (epígrafe 5.2.5.5) y conversiones de unidades.

## Earth Engine (resultados empíricos)
1. Hace falta una cuenta de Earth Engine (code.earthengine.google.com). El proyecto en la nube del autor es `seea-ai`.
2. Hay que cargar el activo `projects/seea-ai/assets/mdb_boundary` (véase `data/mdb_boundary/`) o uno equivalente en un proyecto propio.
3. Los scripts de `gee/` se ejecutan en este orden:
   - `validation_murray.js`: Murray–Darling 2018-19 frente a Smith et al. (2025).
   - `rf_biomass_mdb_to_sinu.js`: poner `ADD_SINU_TRAINING = true` para obtener los valores del Sinú (configuración B de la tesis).
   - `validation_sinu.js`: compuestos de estación seca del río Sinú (2019-20 y 2023-24).
   - `sinu_change_2020_2024.js`: análisis de cambio del Sinú.
   - `rf_biomass_mdb_to_madrededios.js`: poner `ADD_MDD_TRAINING = true` para obtener los valores del Alto Madre de Dios.
   - `validation_madre_de_dios.js`: compuestos de estación seca del Alto Madre de Dios.
   - `validation_tropical_ind.js`: comparación con ESA CCI y GEDI y cuencas retenidas (epígrafe 5.2.4.6).
   - `validation_blocks_label2020.js`: validación por bloques y etiqueta de 2020 (epígrafe 5.2.4.7).
4. La salida de la consola se compara con `results/VALIDATION_RESULTS.md` y con los CSV de `datos/resultados_gee/`.

## Salvedades del análisis (conviene leerlas antes de citar cifras)
- **Periodos.** Son compuestos de estación seca, no años naturales.
- **NPP.** No equivale al secuestro neto: la NPP de MODIS es productividad primaria, no balance neto de carbono.
- **Biomasa (NASA/ORNL).** Es una línea base global de 2010 a 300 m, por tanto una aproximación *relativa* y no un inventario anual absoluto. La sensibilidad a ESA CCI 2020 se cuantifica en el epígrafe 5.2.4.7.
- **Random Forest.** R² = 0,77 con partición aleatoria y 0,76 por bloques espaciales de 1°, con un RMSE de 13,2 tC/ha (≈48,4 tCO₂/ha). Es sólido para contrastes relativos y espaciales y débil como inventario financiero absoluto.
- **Murray–Darling.** Es un benchmark de coherencia metodológica, no una validación empírica directa de las cuencas tropicales. Las densidades tropicales se contrastan con el IDEAM, con Asner et al. (2010), con ESA CCI y con GEDI (epígrafes 5.2.4.5 y 5.2.4.6).
- **Exposiciones.** Los 47,4 M USD del Sinú y los 585,7 M USD del Alto Madre de Dios son exposiciones **puntuales** del stock de carbono asociada a la pérdida de cubierta arbórea, NO flujos anuales, y por eso no se capitalizan. La sensibilidad del Sinú va de 32,1 a 65,6 M USD.
- **Carbono del suelo.** No puede obtenerse con Sentinel; haría falta SoilGrids o SLGA.
- **Validación de campo.** Está pendiente: los datos de parcela se solicitaron al IDEAM y a RAINFOR sin obtener acceso.
