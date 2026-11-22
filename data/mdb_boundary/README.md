# Límite de la cuenca Murray–Darling (activo de Earth Engine)

Es el límite oficial de la MDBA según la *Water Act 2007* (licencia CC BY 4.0), el mismo perímetro que usan Smith et al. (2025). Los scripts de `gee/` esperan esta área de estudio.

## Activo de Earth Engine (proyecto del autor)
    projects/seea-ai/assets/mdb_boundary

En los scripts se carga así:

    var mdb = ee.FeatureCollection('projects/seea-ai/assets/mdb_boundary');

## Descarga de la fuente (para cargarlo en un proyecto propio)
- Conjunto de datos (data.gov.au / MDBA): https://data.gov.au/data/dataset/murray-darling-basin-boundary
- Shapefile (.zip, 189 KB): https://data.gov.au/data/dataset/4ede9aed-5620-47db-a72b-0b3aa0a3ced0/resource/8a6d889d-723b-492d-8c12-b8b0d1ba4b5a/download/mdb_boundary.zip
- GeoJSON (WFS): https://data.gov.au/geoserver/murray-darling-basin-boundary/wfs?request=GetFeature&typeName=ckan_4ede9aed-5620-47db-a72b-0b3aa0a3ced0&outputFormat=json

## Carga en Earth Engine
1. Ir a *Assets → New → Table upload (Shapefile)* y subir el `.zip`.
2. Llamarlo `mdb_boundary` dentro de un proyecto propio.
3. Sustituir la ruta en los scripts.

Para comprobar la carga: `print('Superficie MDB km2', mdb.geometry().area(1).divide(1e6))` debe devolver ≈ 1,06·10⁶.

Instrucciones ampliadas: `docs/limite_murray_darling.md`.
