// =====================================================================
// TESIS DOCTORAL · SEEA-AI · Ivan Vilar Ramírez
// Script: validation_blocks_label2020.js
// Qué hace: Validación cruzada de cinco pliegues (aleatoria y por bloques espaciales) y sensibilidad a la etiqueta ESA CCI 2020.
// Dónde se usa en la tesis: Epígrafe 5.2.4.7; Tabla 12; datos/resultados_gee/validacion_cruzada_bloques.csv y sensibilidad_etiqueta_2020.csv
// Ejecución: Google Earth Engine Code Editor (code.earthengine.google.com).
// Activo requerido: projects/seea-ai/assets/mdb_boundary (véase docs/limite_murray_darling.md).
// Los comentarios internos del código pueden estar en inglés (versión de trabajo original).
// =====================================================================
// =====================================================================
// Nota: si el trabajo MDD_etiqueta_CCI2020 supera el tiempo interactivo, ejecútelo solo (deje únicamente esa entrada en jobs).
// SEEA-AI | VALIDACIÓN ESPACIAL POR BLOQUES Y SENSIBILIDAD A LA ETIQUETA
// (1) Murray–Darling: CV 5 pliegues aleatoria vs por bloques de 1°.
// (2) Sinú y Alto Madre de Dios: CV 5 pliegues (aleatoria vs bloques de 0,2°)
//     de la configuración de la tesis (MDB + muestras tropicales), evaluada
//     frente a la etiqueta NASA/ORNL y frente a ESA CCI 2020 y GEDI L4B v2.
// (3) Sensibilidad: etiqueta ESA CCI 2020 en lugar de NASA/ORNL 2010.
// Unidades de salida: tCO2/ha (biomasa ×0,47 ×44/12; carbono ×44/12).
// =====================================================================
var CF = 0.47, TCO2 = 44 / 12, K = 5;
var mdb = ee.FeatureCollection('projects/seea-ai/assets/mdb_boundary');
var hb7 = ee.FeatureCollection('WWF/HydroSHEDS/v1/Basins/hybas_7');
var sSeed = ee.Feature(hb7.filterBounds(ee.Geometry.Point([-75.88, 8.75])).first());
var sinu = hb7.filter(ee.Filter.eq('MAIN_BAS', sSeed.get('MAIN_BAS')));
var hb8 = ee.FeatureCollection('WWF/HydroSHEDS/v1/Basins/hybas_8')
  .map(function (f) { return f.set('PFAF_STR', ee.Number(f.get('PFAF_ID')).format()); });
var mSeed = ee.Feature(hb8.filterBounds(ee.Geometry.Point([-71.0, -12.8])).first());
var mdd = hb8.filter(ee.Filter.stringStartsWith('PFAF_STR', ee.String(mSeed.get('PFAF_STR')).slice(0, 7)));
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
  var pr = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY').filterDate(ps, pe).select('precipitation').sum().rename('precip');
  return c.addBands(c.normalizedDifference(['B8','B4']).rename('NDVI'))
    .addBands(c.normalizedDifference(['B3','B11']).rename('NDWI'))
    .addBands(c.normalizedDifference(['B8','B12']).rename('NBR'))
    .addBands(DEM.rename('elev')).addBands(ee.Terrain.slope(DEM).rename('slope')).addBands(pr);
}
var PRED = ['B2','B3','B4','B8','B11','B12','NDVI','NDWI','NBR','elev','slope','precip'];
var lab10 = ee.ImageCollection('NASA/ORNL/biomass_carbon_density/v1').first().select('agb');      // tC/ha
var cciRaw = ee.ImageCollection('ESA/CCI/Above_Ground_Biomass/V6_0').filterDate('2020-01-01','2021-01-01').first().select('agb');
var cciC = cciRaw.multiply(CF).rename('cci');                 // tC/ha, enmascarado fuera de bosque
var lab20 = cciRaw.unmask(0).multiply(CF).rename('agb');      // etiqueta 2020 (sin biomasa arbórea = 0)
var gediC = ee.Image('LARSE/GEDI/GEDI04_B_002').select('MU').multiply(CF).rename('gedi');
var LL = ee.Image.pixelLonLat();
var gfc = ee.Image('UMD/hansen/global_forest_change_2024_v1_12');
var loss2124 = gfc.select('lossyear').gte(21).and(gfc.select('lossyear').lte(24));

function rfTrain(fc) { return ee.Classifier.smileRandomForest(200).setOutputMode('REGRESSION')
  .train({features: fc, classProperty: 'agb', inputProperties: PRED}); }
function folds(fc, deg) {
  return fc.randomColumn('rr', 3).map(function (f) {
    var bx = ee.Number(f.get('longitude')).divide(deg).floor();
    var by = ee.Number(f.get('latitude')).divide(deg).floor();
    var fb = bx.multiply(7919).add(by.multiply(104729)).abs().mod(K).toInt();
    return f.set('fold_b', fb).set('fold_r', ee.Number(f.get('rr')).multiply(K).floor().toInt());
  });
}
function metrics(fc, ref) {
  var p = fc.filter(ee.Filter.notNull(['pred', ref]));
  var n = p.size(), mo = ee.Number(p.aggregate_mean(ref)), mp = ee.Number(p.aggregate_mean('pred'));
  var q = p.map(function (f) { var o = ee.Number(f.get(ref)), r = ee.Number(f.get('pred'));
    return f.set('e2', r.subtract(o).pow(2)).set('t2', o.subtract(mo).pow(2)); });
  var r = ee.Dictionary(p.reduceColumns(ee.Reducer.pearsonsCorrelation(), ['pred', ref])).get('correlation');
  return ee.Dictionary({n: n, mean_ref_tCO2: mo.multiply(TCO2), mean_pred_tCO2: mp.multiply(TCO2),
    bias_pct: mp.subtract(mo).divide(mo).multiply(100),
    rmse_tCO2: ee.Number(q.aggregate_sum('e2')).divide(n).sqrt().multiply(TCO2),
    r2_1to1: ee.Number(1).subtract(ee.Number(q.aggregate_sum('e2')).divide(q.aggregate_sum('t2'))), r: r});
}
// CV: 'base' siempre en entrenamiento; 'target' se reparte en K pliegues
function cv(base, target, fprop) {
  var out = ee.FeatureCollection(ee.List.sequence(0, K - 1).map(function (k) { k = ee.Number(k).toInt();
    var rf = rfTrain(base.merge(target.filter(ee.Filter.neq(fprop, k))));
    return target.filter(ee.Filter.eq(fprop, k)).classify(rf, 'pred');
  })).flatten();
  return out;
}

// ---------- muestras ----------
var predMDB = predictors(mdb.geometry(), '2018-12-01', '2019-02-28', '2018-07-01', '2019-06-30');
var sMDB = folds(predMDB.addBands(lab10.rename('agb')).addBands(LL).clip(mdb).sample({
  region: mdb.geometry(), scale: 1000, numPixels: 3000, seed: 42, tileScale: 16, dropNulls: true}), 1.0);
var predS20 = predictors(sinu.geometry(), '2019-12-01', '2020-03-31', '2019-07-01', '2020-06-30');
var predM20 = predictors(mdd.geometry(), '2020-06-01', '2020-09-30', '2019-10-01', '2020-09-30');
function tropSamples(pred, fc, seed) {
  return folds(pred.addBands(lab10.rename('agb')).addBands(cciC).addBands(gediC).addBands(LL).clip(fc)
    .sample({region: fc.geometry(), scale: 1000, numPixels: 3000, seed: seed, tileScale: 16, dropNulls: false})
    .filter(ee.Filter.notNull(PRED.concat(['agb']))), 0.2);
}
var sS = tropSamples(predS20, sinu, 7), sM = tropSamples(predM20, mdd, 11);
var empty = ee.FeatureCollection([]);

// ---------- (1) Murray–Darling ----------
var mdbR = cv(empty, sMDB, 'fold_r'), mdbB = cv(empty, sMDB, 'fold_b');
// ---------- (2) trópico, configuración de la tesis ----------
var sR = cv(sMDB, sS, 'fold_r'), sB = cv(sMDB, sS, 'fold_b');
var mR = cv(sMDB, sM, 'fold_r'), mB = cv(sMDB, sM, 'fold_b');

// ---------- (3) etiqueta ESA CCI 2020 ----------
function lab20Run(pred, fc, seed, tag) {
  var tr = predMDB.addBands(lab20).clip(mdb).sample({region: mdb.geometry(), scale: 1000,
      numPixels: 3000, seed: 42, tileScale: 16, dropNulls: true})
    .merge(pred.addBands(lab20).clip(fc).sample({region: fc.geometry(), scale: 1000,
      numPixels: 3000, seed: seed, tileScale: 16, dropNulls: true}));
  var img = pred.classify(rfTrain(tr)).rename('pred').clip(fc);
  var basin = img.reduceRegion({reducer: ee.Reducer.mean(), geometry: fc.geometry(), scale: 1000,
    maxPixels: 1e13, bestEffort: true, tileScale: 16}).getNumber('pred').multiply(TCO2);
  var loss = img.updateMask(loss2124).reduceRegion({reducer: ee.Reducer.mean(), geometry: fc.geometry(),
    scale: 100, maxPixels: 1e13, bestEffort: true, tileScale: 16}).getNumber('pred').multiply(TCO2);
  var pts = img.addBands(gediC).sample({region: fc.geometry(), scale: 1000, numPixels: 4000, seed: 99,
    tileScale: 16, dropNulls: false});
  return ee.Dictionary({tag: tag, basin_mean_tCO2: basin, loss2124_mean_tCO2: loss, vs_GEDI: metrics(pts, 'gedi')});
}

var jobs = [
  ['MDB_CV_aleatoria', function () { return ee.Dictionary({vs_label: metrics(mdbR, 'agb')}); }],
  ['MDB_CV_bloques_1grado', function () { return ee.Dictionary({vs_label: metrics(mdbB, 'agb')}); }],
  ['SINU_CV_aleatoria', function () { return ee.Dictionary({vs_label: metrics(sR, 'agb'), vs_CCI: metrics(sR, 'cci'), vs_GEDI: metrics(sR, 'gedi')}); }],
  ['SINU_CV_bloques_0.2grado', function () { return ee.Dictionary({vs_label: metrics(sB, 'agb'), vs_CCI: metrics(sB, 'cci'), vs_GEDI: metrics(sB, 'gedi')}); }],
  ['MDD_CV_aleatoria', function () { return ee.Dictionary({vs_label: metrics(mR, 'agb'), vs_CCI: metrics(mR, 'cci'), vs_GEDI: metrics(mR, 'gedi')}); }],
  ['MDD_CV_bloques_0.2grado', function () { return ee.Dictionary({vs_label: metrics(mB, 'agb'), vs_CCI: metrics(mB, 'cci'), vs_GEDI: metrics(mB, 'gedi')}); }],
  ['SINU_etiqueta_CCI2020', function () { return lab20Run(predS20, sinu, 7, 'SINU_etiqueta_CCI2020'); }],
  ['MDD_etiqueta_CCI2020', function () { return lab20Run(predM20, mdd, 11, 'MDD_etiqueta_CCI2020'); }]
];
jobs.forEach(function (j) {
  ee.Dictionary(j[1]()).set('tag', j[0]).evaluate(function (v, err) {
    if (err) { print('ERR_' + j[0] + ': ' + err); return; }
    print('VJSON' + JSON.stringify(v) + 'ENDV');
  });
});
