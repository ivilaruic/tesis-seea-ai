// =====================================================================
// TESIS DOCTORAL · Contabilizar lo invisible (SEEA-AI) · Ivan Vilar Ramírez
// Script: validation_tropical_ind.js
// Qué hace: Comparación de la densidad de carbono del Random Forest con ESA CCI Biomass v6.0 (2020) y GEDI L4B v2; configuraciones A, B y C (cuenca retenida); densidad en píxeles de pérdida 2021-2024.
// Dónde se usa en la tesis: Epígrafe 5.2.4.6; Tabla 11; datos/resultados_gee/comparacion_productos_referencia.csv y densidad_pixeles_perdidos.csv
// Ejecución: Google Earth Engine Code Editor (code.earthengine.google.com).
// Activo requerido: projects/seea-ai/assets/mdb_boundary (véase docs/limite_murray_darling.md).
// Los comentarios internos del código pueden estar en inglés (versión de trabajo original).
// =====================================================================
// =====================================================================
// SEEA-AI | COMPARACIÓN TROPICAL con productos de referencia de la densidad de carbono RF
// Productos de referencia (no usados en el entrenamiento):
//   (1) ESA CCI Biomass v6.0, año 2020 (Santoro & Cartus, 2025), 100 m, Mg/ha
//   (2) GEDI L4B v2 gridded AGBD (Dubayah et al., 2022b), 1 km, Mg/ha (abr. 2019 - ago. 2021)
// Comparación: RF (receta idéntica a rf_biomass_mdb_to_*.js) en dos
// configuraciones: A = transferencia pura MDB ; B = MDB + muestras tropicales
// (etiqueta NASA/ORNL). Biomasa -> carbono: CF = 0,47 (IPCC 2006); C -> CO2: 44/12.
// Salidas en tCO2/ha: medias de cuenca, medias sobre píxeles de pérdida
// Hansen 2021-2024 (base de la exposición), y métricas píxel a píxel a 1 km.
// =====================================================================
var CF = 0.47, TCO2 = 44 / 12;

// ---------- AOIs (idénticas a los scripts del repositorio) ----------
var mdb = ee.FeatureCollection('projects/seea-ai/assets/mdb_boundary');
var hb7 = ee.FeatureCollection('WWF/HydroSHEDS/v1/Basins/hybas_7');
var sSeed = ee.Feature(hb7.filterBounds(ee.Geometry.Point([-75.88, 8.75])).first());
var sinu = hb7.filter(ee.Filter.eq('MAIN_BAS', sSeed.get('MAIN_BAS')));
var hb8 = ee.FeatureCollection('WWF/HydroSHEDS/v1/Basins/hybas_8')
  .map(function (f) { return f.set('PFAF_STR', ee.Number(f.get('PFAF_ID')).format()); });
var mSeed = ee.Feature(hb8.filterBounds(ee.Geometry.Point([-71.0, -12.8])).first());
var mdd = hb8.filter(ee.Filter.stringStartsWith('PFAF_STR',
  ee.String(mSeed.get('PFAF_STR')).slice(0, 7)));

// ---------- Predictores (receta idéntica) ----------
var CSPLUS = ee.ImageCollection('GOOGLE/CLOUD_SCORE_PLUS/V1/S2_HARMONIZED');
function s2mean(aoi, s, e) {
  return ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED').filterBounds(aoi)
    .filterDate(s, e).filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 60))
    .linkCollection(CSPLUS, ['cs_cdf'])
    .map(function (i) { return i.updateMask(i.select('cs_cdf').gte(0.6))
      .select(['B2','B3','B4','B8','B11','B12']).divide(10000); }).mean();
}
var DEM = ee.Image('USGS/SRTMGL1_003');
function predictors(aoi, s, e, ps, pe) {
  var c = s2mean(aoi, s, e);
  var pr = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY').filterDate(ps, pe)
    .select('precipitation').sum().rename('precip');
  return c.addBands(c.normalizedDifference(['B8','B4']).rename('NDVI'))
    .addBands(c.normalizedDifference(['B3','B11']).rename('NDWI'))
    .addBands(c.normalizedDifference(['B8','B12']).rename('NBR'))
    .addBands(DEM.rename('elev')).addBands(ee.Terrain.slope(DEM).rename('slope'))
    .addBands(pr);
}
var PRED = ['B2','B3','B4','B8','B11','B12','NDVI','NDWI','NBR','elev','slope','precip'];
var agbLab = ee.ImageCollection('NASA/ORNL/biomass_carbon_density/v1').first()
  .select('agb').rename('agb');

var sampMDB = predictors(mdb.geometry(), '2018-12-01', '2019-02-28', '2018-07-01', '2019-06-30')
  .addBands(agbLab).clip(mdb).sample({region: mdb.geometry(), scale: 1000,
  numPixels: 3000, seed: 42, tileScale: 16, dropNulls: true}).randomColumn('rnd', 42);
var trainMDB = sampMDB.filter(ee.Filter.lt('rnd', 0.7));
function rfTrain(fc) {
  return ee.Classifier.smileRandomForest(200).setOutputMode('REGRESSION')
    .train({features: fc, classProperty: 'agb', inputProperties: PRED});
}

// Predictores 2020 (época comparable con CCI 2020) y muestras tropicales
var predS20 = predictors(sinu.geometry(), '2019-12-01', '2020-03-31', '2019-07-01', '2020-06-30');
var predS24 = predictors(sinu.geometry(), '2023-12-01', '2024-03-31', '2023-07-01', '2024-06-30');
var predM20 = predictors(mdd.geometry(), '2020-06-01', '2020-09-30', '2019-10-01', '2020-09-30');
var predM24 = predictors(mdd.geometry(), '2023-06-01', '2023-09-30', '2022-10-01', '2023-09-30');
var sampS = predS24.addBands(agbLab).clip(sinu).sample({region: sinu.geometry(),
  scale: 1000, numPixels: 3000, seed: 7, tileScale: 16, dropNulls: true});
var sampM = predM24.addBands(agbLab).clip(mdd).sample({region: mdd.geometry(),
  scale: 1000, numPixels: 3000, seed: 11, tileScale: 16, dropNulls: true});

var rfA = rfTrain(trainMDB);                       // transferencia pura
var rfBS = rfTrain(trainMDB.merge(sampS));         // + trópico (Sinú)
var rfBM = rfTrain(trainMDB.merge(sampM));         // + trópico (MdD)

// ---------- Referencias independientes (tCO2/ha) ----------
var cci20 = ee.ImageCollection('ESA/CCI/Above_Ground_Biomass/V6_0')
  .filterDate('2020-01-01', '2021-01-01').first().select('agb')
  .multiply(CF * TCO2).rename('cci');
var gedi = ee.Image('LARSE/GEDI/GEDI04_B_002').select('MU')
  .multiply(CF * TCO2).rename('gedi');
var lab = agbLab.multiply(TCO2).rename('lab');     // etiqueta NASA/ORNL (2010)

var gfc = ee.Image('UMD/hansen/global_forest_change_2024_v1_12');
var loss2124 = gfc.select('lossyear').gte(21).and(gfc.select('lossyear').lte(24));

// ---------- Métricas ----------
function stats(rfImg, fc, tag) {
  var geom = fc.geometry();
  var st = rfImg.rename('rf').addBands(cci20).addBands(gedi).addBands(lab);
  var meanB = st.reduceRegion({reducer: ee.Reducer.mean(), geometry: geom,
    scale: 1000, maxPixels: 1e13, bestEffort: true, tileScale: 16});
  var meanL = st.select(['rf','cci','lab']).updateMask(loss2124).reduceRegion({
    reducer: ee.Reducer.mean(), geometry: geom, scale: 100, maxPixels: 1e13,
    bestEffort: true, tileScale: 16});
  var meanLg = gedi.updateMask(loss2124.reduceResolution({reducer: ee.Reducer.max(),
    maxPixels: 4096}).reproject(gedi.projection())).reduceRegion({
    reducer: ee.Reducer.mean(), geometry: geom, scale: 1000, maxPixels: 1e13,
    bestEffort: true, tileScale: 16});
  var pts = st.sample({region: geom, scale: 1000, numPixels: 4000, seed: 99,
    tileScale: 16, dropNulls: false});
  function pair(ref) {
    var p = pts.filter(ee.Filter.notNull(['rf', ref]));
    var n = p.size();
    var mo = ee.Number(p.aggregate_mean(ref)), mp = ee.Number(p.aggregate_mean('rf'));
    var q = p.map(function (f) {
      var o = ee.Number(f.get(ref)), r = ee.Number(f.get('rf'));
      return f.set('e2', r.subtract(o).pow(2)).set('t2', o.subtract(mo).pow(2));
    });
    var r = ee.Number(ee.Dictionary(p.reduceColumns(ee.Reducer.pearsonsCorrelation(),
      ['rf', ref])).get('correlation'));
    return ee.Dictionary({n: n, mean_ref: mo, mean_rf: mp,
      bias_pct: mp.subtract(mo).divide(mo).multiply(100),
      rmse: ee.Number(q.aggregate_sum('e2')).divide(n).sqrt(),
      r2_1to1: ee.Number(1).subtract(ee.Number(q.aggregate_sum('e2'))
        .divide(q.aggregate_sum('t2'))),
      pearson_r: r});
  }
  return ee.Dictionary({tag: tag, basin_mean_tCO2ha: meanB,
    loss2124_mean_tCO2ha: meanL.set('gedi', meanLg.get('gedi')),
    vs_CCI2020: pair('cci'), vs_GEDI_L4B: pair('gedi')});
}

// Configuraciones evaluadas (época 2020, previa a la pérdida 2021-2024):
//  A = transferencia pura (solo Murray–Darling)                -> cuenca no vista
//  B = Murray–Darling + muestras de la propia cuenca (tesis)
//  C = Murray–Darling + muestras de la OTRA cuenca tropical    -> cuenca tropical retenida
var jobs = [
  [predS20.classify(rfA),  sinu, 'SINU_A_transfer_puro_2020'],
  [predS20.classify(rfBS), sinu, 'SINU_B_con_tropico_2020'],
  [predS20.classify(rfBM), sinu, 'SINU_C_retenida_2020'],
  [predM20.classify(rfA),  mdd,  'MDD_A_transfer_puro_2020'],
  [predM20.classify(rfBM), mdd,  'MDD_B_con_tropico_2020'],
  [predM20.classify(rfBS), mdd,  'MDD_C_retenida_2020'],
  [predS24.classify(rfBS), sinu, 'SINU_B_con_tropico_2024'],
  [predM24.classify(rfBM), mdd,  'MDD_B_con_tropico_2024']
];
jobs.forEach(function (j) {
  stats(j[0].multiply(TCO2).clip(j[1]), j[1], j[2]).evaluate(function (v, err) {
    if (err) { print('ERR_' + j[2] + ': ' + err); return; }
    print('VJSON' + JSON.stringify(v) + 'ENDV');
  });
});
