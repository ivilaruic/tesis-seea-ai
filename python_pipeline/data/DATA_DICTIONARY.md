# Diccionario de datos: cuentas de la demostración SEEA-AI

Cada `*_account.json` y cada fila de `accounts_summary.csv` contienen:

| Campo | Unidad | Cuenta SEEA-EA | Descripción |
|---|---|---|---|
| site | – | – | Nombre de la zona |
| year_open / year_close | año | – | Límites del periodo contable (2020 → 2024) |
| source | – | – | Fuente de observación de la Tierra: `stac:sentinel-2-l2a`, `gee` u `offline_sample` |
| extent_ha | ha | Extensión | Superficie total analizada |
| cond_open / cond_close | índice 0–1 | Condición | Condición media del territorio C̄ |
| dcond | índice | Condición | Variación de la condición en el periodo |
| deforestation_ha / degradation_ha / burned_ha | ha | Condición (atribución del cambio) | Hectáreas por tipo de perturbación |
| carbon_stock_open/close_tco2 | tCO₂e | Activo (carbono) | Stock de carbono de la biomasa escalado por la condición |
| dcarbon_tco2 | tCO₂e | Flujo físico | Variación neta del stock de carbono |
| sediment_flow_open/close_t | t/año | Flujo físico | Flujo del servicio de retención de sedimentos |
| carbon_value_loss_usd | USD | Flujo monetario | Valor del stock de carbono perdido |
| sediment_value_loss_usd | USD | Flujo monetario | Valor perdido de retención de sedimentos |
| flow_value_loss_usd | USD | Flujo monetario | Pérdida anual total de valor de los servicios |
| nca_open/close_usd | USD | Activo | Valor del activo de capital natural (valor presente de los flujos + stock de carbono) |
| dK_usd | USD | Activo | Variación del valor del activo de capital natural (riqueza) |

`ai_metrics.csv` recoge, para cada zona, el R² y el RMSE del modelo de condición frente a etiquetas de condición de referencia de la demostración.

> ⚠️ Cuando `source = offline_sample`, todas las cifras son **salidas de demostración reproducibles a partir de entradas sintéticas deterministas**, no observaciones medidas. Para obtener valores reales hay que ejecutar con `--backend stac` (Sentinel-2) o con el backend de GEE.
