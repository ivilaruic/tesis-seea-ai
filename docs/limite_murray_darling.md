# Límite oficial de la cuenca Murray–Darling

Los scripts usan el perímetro oficial de la Murray–Darling Basin Authority (MDBA), definido en la *Water Act 2007* y publicado con licencia CC BY 4.0. Es el mismo perímetro que emplean las cuentas SEEA-EA del CSIRO (Smith et al., 2025).

En los scripts se carga como un activo de Earth Engine:

    var mdb = ee.FeatureCollection('projects/seea-ai/assets/mdb_boundary');

Ese activo pertenece al proyecto del autor. Para reproducir los cálculos con otra cuenta hay que cargarlo en un proyecto propio.

## Descarga
- Ficha del conjunto de datos (data.gov.au / MDBA): https://data.gov.au/data/dataset/murray-darling-basin-boundary
- Shapefile (.zip, 189 KB): https://data.gov.au/data/dataset/4ede9aed-5620-47db-a72b-0b3aa0a3ced0/resource/8a6d889d-723b-492d-8c12-b8b0d1ba4b5a/download/mdb_boundary.zip

## Carga en Earth Engine
1. En Earth Engine, abrir *Assets → New → Table upload (Shapefile)* y subir el archivo `.zip`.
2. Llamar al activo `mdb_boundary` dentro de un proyecto en la nube propio.
3. Sustituir en los scripts la ruta `projects/seea-ai/assets/mdb_boundary` por la del nuevo activo.

Para comprobar que la carga es correcta, ejecutar `print(mdb.geometry().area(1).divide(1e6))`. Debe devolver ≈1.059.394 km².
