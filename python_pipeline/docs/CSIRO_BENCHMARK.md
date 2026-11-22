# Correspondencia estructural con las cuentas del CSIRO para la cuenca Murray–Darling

**Fuente.** CSIRO, *Experimental ecosystem accounts for the Murray–Darling Basin* (actualizado el 7 de febrero de 2025), financiado por el DCCEEW del Gobierno de Australia dentro de *Environmental Economic Accounting: A common national approach*: <https://www.csiro.au/en/research/natural-environment/natural-resources/Natural-capital-accounting/Murray-Darling-Basin>

El benchmark se usa como **referencia estructural** (arquitectura de cuentas, convención de condición y conjunto de servicios), no para trasladar valores monetarios. Es el mismo criterio que sigue la tesis (epígrafe 5.2.6).

| Dimensión | Cuentas del CSIRO (MDB) | SEEA-AI | Correspondencia |
|---|---|---|---|
| Métrica de condición | índice 0–1 (1 = integridad alta) | C∈[0,1] por normalización del NDVI | misma convención |
| Cuentas elaboradas | extensión, condición, biodiversidad, servicios | extensión, condición, flujos físicos y monetarios, activos | ✔ |
| Servicios | stock y secuestro de carbono, retención de agua y sedimentos, biomasa, recreación | carbono, retención de sedimentos (ampliable) | subconjunto |
| Unidad espacial | cuenca / tipo de ecosistema | rejilla agregada a territorio | ✔ |
| Temporalidad | cuentas anuales por año fiscal | épocas anuales (2020, 2024) | ✔ |
| Tendencia de biodiversidad (MDB) | persistencia vegetal 86,8 % → 87,1 % (2010–15) | no se modeliza (fuera de alcance) | n/a |

**Lógica de la comparación.** SEEA-AI debe:
- reproducir la relación *funcional* condición → flujo de servicio → valor;
- mantener los valores estimados en el orden de magnitud esperable para paisajes de extensión y condición comparables;
- respetar las identidades contables del SEEA-EA (activo = valor presente de los flujos; ΔK como pérdida de valor del activo (degradación) o acumulación).

En esta demostración sintética, Murrumbidgee actúa como ancla de calibración. En la tesis, las aplicaciones tropicales **sí** incorporan recalibración contextual con muestras de cada cuenca. La prueba con cuencas retenidas (epígrafe 5.2.4.6) muestra que el modelo no se transfiere sin esa recalibración.
