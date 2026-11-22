"""
Recalcula todas las cifras derivadas de la tesis a partir de sus insumos y las compara
con los valores publicados en el texto. Si alguna no coincide (tolerancia de redondeo),
el script termina con error.

Uso:  python calculos/verificar_cifras_tesis.py
Salida: calculos/verificacion_cifras.csv
"""
import csv, os, sys

C2CO2 = 44 / 12          # carbono -> CO2
CF = 0.47                # fracción de carbono de la biomasa (IPCC, 2006)
P_BASE, P_MIN, P_MAX = 25, 20, 30   # USD/tCO2 (World Bank, 2024)
A_SINU, A_MDD = 14_580, 57_141       # ha de pérdida Hansen 2020-2024

def expo(area_ha, dens_tco2, precio, lam=1.0):
    """Exposición bruta del stock de carbono, millones de USD (epígrafe 4.3.6.7)."""
    return area_ha * dens_tco2 * precio * lam / 1e6

filas = []
def chk(id_, descripcion, calculado, publicado, tol, ubicacion):
    ok = abs(calculado - publicado) <= tol
    filas.append(dict(id=id_, descripcion=descripcion, calculado=round(calculado, 3),
                      publicado=publicado, tolerancia=tol, coincide=ok, ubicacion_tesis=ubicacion))

# --- Sinú (Tabla 8) ---
chk('S1', 'Sinú, escenario conservador (110 tCO2/ha, 20 USD)', expo(A_SINU, 110, P_MIN), 32.1, 0.05, 'Tabla 8')
chk('S2', 'Sinú, escenario base (130 tCO2/ha, 25 USD)', expo(A_SINU, 130, P_BASE), 47.4, 0.05, 'Tabla 8')
chk('S3', 'Sinú, escenario alto (150 tCO2/ha, 30 USD)', expo(A_SINU, 150, P_MAX), 65.6, 0.05, 'Tabla 8')
chk('S4', 'Sinú, base con lambda_R = 0,30', expo(A_SINU, 130, P_BASE, 0.30), 14.2, 0.1, 'Resumen; 5.2.4')
chk('S5', 'Sinú, stock expuesto (MtCO2)', A_SINU * 130 / 1e6, 1.90, 0.01, 'results/VALIDATION_RESULTS.md; 5.2.4')
# --- Alto Madre de Dios (Tabla A.2) ---
chk('M1', 'AMdD, escenario conservador (390, 20 USD)', expo(A_MDD, 390, P_MIN), 445.7, 0.05, 'Tabla A.2')
chk('M2', 'AMdD, escenario base (410, 25 USD)', expo(A_MDD, 410, P_BASE), 585.7, 0.05, 'Tabla A.2; 5.2.4.3')
chk('M3', 'AMdD, escenario alto (430, 30 USD)', expo(A_MDD, 430, P_MAX), 737.1, 0.05, 'Tabla A.2')
chk('M4', 'AMdD, base con lambda_R = 0,30', expo(A_MDD, 410, P_BASE, 0.30), 175.7, 0.05, 'Anexo I')
chk('M5', 'AMdD, base con lambda_R = 0,60', expo(A_MDD, 410, P_BASE, 0.60), 351.4, 0.05, 'Anexo I')
chk('M6', 'AMdD, stock expuesto (MtCO2)', A_MDD * 410 / 1e6, 23.4, 0.05, 'Anexo I')
# --- Contraste con IDEAM (epígrafe 5.2.4.5) ---
ideam_c, ideam_se = 38.74, 4.58        # MgC/ha, bosque región Caribe (IFN)
ideam = ideam_c * C2CO2
chk('I1', 'IDEAM: densidad oficial (tCO2/ha)', ideam, 142.0, 0.05, '5.2.4.5')
chk('I2', 'IDEAM: límite inferior IC95 (tCO2/ha)', (ideam_c - 1.96 * ideam_se) * C2CO2, 109.1, 0.1, '5.2.4.5')
chk('I3', 'IDEAM: límite superior IC95 (tCO2/ha)', (ideam_c + 1.96 * ideam_se) * C2CO2, 175.0, 0.1, '5.2.4.5')
chk('I4', 'Desviación RF (132) frente a IDEAM (%)', (132 / ideam - 1) * 100, -7.1, 0.05, '5.2.4.5')
chk('I5', 'Exposición con densidad IDEAM (M USD)', expo(A_SINU, ideam, P_BASE), 51.8, 0.05, '5.2.4.5')
chk('I6', 'Exposición IDEAM, IC inferior', expo(A_SINU, (ideam_c - 1.96 * ideam_se) * C2CO2, P_BASE), 39.8, 0.1, '5.2.4.5')
chk('I7', 'Exposición IDEAM, IC superior', expo(A_SINU, (ideam_c + 1.96 * ideam_se) * C2CO2, P_BASE), 63.8, 0.1, '5.2.4.5')
# --- Contraste con Asner et al. (2010) ---
asner_c = 395e6 / 4.3e6                # 395 Tg C / 4,3 Mha
chk('A1', 'Asner: densidad media (MgC/ha)', asner_c, 91.9, 0.05, '5.2.4.5')
chk('A2', 'Asner: densidad media (tCO2/ha)', asner_c * C2CO2, 336.8, 0.05, '5.2.4.5')
chk('A3', 'Desviación RF (111,8 MgC/ha) frente a Asner (%)', (111.8 / asner_c - 1) * 100, 21.7, 0.05, '5.2.4.5')
chk('A4', 'Exposición con densidad Asner (M USD)', expo(A_MDD, asner_c * C2CO2, P_BASE), 481.2, 0.05, '5.2.4.5')
# --- Densidad en píxeles perdidos (epígrafe 5.2.4.6) ---
for id_, a, d, pub in [('P1', A_SINU, 177.120, 64.6), ('P2', A_SINU, 306.080, 111.6), ('P3', A_SINU, 238.041, 86.8),
                        ('P4', A_MDD, 350.326, 500.4), ('P5', A_MDD, 425.774, 608.2), ('P6', A_MDD, 379.700, 542.4)]:
    chk(id_, f'Exposición con densidad de píxeles perdidos {d} tCO2/ha', expo(a, d, P_BASE), pub, 0.05, '5.2.4.6')
# --- Sensibilidad a la etiqueta 2020 (epígrafe 5.2.4.7) ---
chk('E1', 'Sinú, exposición con etiqueta CCI 2020 (160,94 tCO2/ha)', expo(A_SINU, 160.94, P_BASE), 58.7, 0.05, '5.2.4.7')
chk('E2', 'AMdD, exposición con etiqueta CCI 2020 (467,435 tCO2/ha)', expo(A_MDD, 467.435, P_BASE), 667.7, 0.05, '5.2.4.7')
chk('E3', 'Sinú, cambio de densidad con etiqueta 2020 (%)', (160.94 / 128.2 - 1) * 100, 25.5, 0.1, '5.2.4.7')
chk('E4', 'AMdD, cambio de densidad con etiqueta 2020 (%)', (467.435 / 410.6 - 1) * 100, 13.8, 0.1, '5.2.4.7')
# --- Conversiones del módulo RF ---
chk('R1', 'RMSE 13,2 tC/ha en tCO2/ha', 13.2 * C2CO2, 48.4, 0.05, '5.2.3.1')
chk('R2', 'RMSE 13,3 tC/ha en tCO2/ha', 13.3 * C2CO2, 48.8, 0.05, 'Anexo I')
chk('R3', 'Densidad AMdD 409,8 tCO2/ha en MgC/ha', 409.8 / C2CO2, 111.8, 0.05, '5.2.4.5')
chk('R4', 'Cociente de áreas AMdD/Sinú', A_MDD / A_SINU, 3.9, 0.05, 'Anexo I')
chk('R5', 'Cociente de densidades AMdD/Sinú', 410 / 130, 3.2, 0.05, 'Anexo I')
# --- Benchmark Murray–Darling (Smith et al., 2025) ---
ha_mdb = 1.06e8
chk('B1', 'Secuestro CSIRO por ha (tCO2/ha·año)', 1054e6 / ha_mdb, 9.9, 0.05, '5.2.6; benchmark')
chk('B2', 'Stock CSIRO por ha (tCO2/ha)', 36708e6 / ha_mdb, 346, 0.5, '5.2.6; benchmark')
chk('B3', 'Retención de sedimentos CSIRO por ha (t/ha·año)', 49725e3 / ha_mdb, 0.47, 0.005, '5.2.6; benchmark')
chk('B4', 'NPP SEEA-AI frente a CSIRO (%)', (12.6 / (1054e6 / ha_mdb) - 1) * 100, 27, 0.5, 'results/BENCHMARK')

# --- Lectura económica: depreciación anual frente al PIB (epígrafe 5.2.5.5) ---
# PIB de Córdoba 2024pr: 30.952 miles de millones COP (DANE, boletín PIBDEP 2024pr, 30/05/2025)
# TRM media 2024: 4.072,59 COP/USD (Banco de la República, serie histórica)
# PIB de Madre de Dios 2023: 3.381 millones S/ (BCRP, serie RD17039DA); tipo de cambio medio 2023: 3,74 S/ por USD (BCRP, PM05289PA)
ANIOS = 4                                   # periodo 2020-2024
PIB_COR = 30_952e3 / 4_072.59               # millones USD
PIB_MDD = 3_381 / 3.74                      # millones USD
chk('D1', 'PIB de Córdoba 2024 en millones USD', PIB_COR, 7600, 1, '5.2.5.5')
chk('D2', 'Sinú, depreciación anual, escenario base (M USD)', expo(A_SINU, 130, P_BASE) / ANIOS, 11.8, 0.05, '5.2.5.5')
chk('D3', 'Sinú, depreciación anual con lambda_R = 0,30 (M USD)', expo(A_SINU, 130, P_BASE, 0.30) / ANIOS, 3.6, 0.05, '5.2.5.5')
chk('D4', 'Sinú, depreciación anual con densidad de píxeles perdidos 306,08 (M USD)', expo(A_SINU, 306.080, P_BASE) / ANIOS, 27.9, 0.05, '5.2.5.5')
chk('D5', 'Sinú, depreciación base en % del PIB de Córdoba', expo(A_SINU, 130, P_BASE) / ANIOS / PIB_COR * 100, 0.16, 0.005, 'Resumen; 1.7; 5.2.5.5; 7.1')
chk('D6', 'Sinú, límite inferior en % del PIB de Córdoba', expo(A_SINU, 130, P_BASE, 0.30) / ANIOS / PIB_COR * 100, 0.05, 0.005, '5.2.5.5')
chk('D7', 'Sinú, límite superior en % del PIB de Córdoba', expo(A_SINU, 306.080, P_BASE) / ANIOS / PIB_COR * 100, 0.37, 0.005, '5.2.5.5')
chk('D8', 'PIB de Madre de Dios 2023 en millones USD', PIB_MDD, 904, 0.5, '5.2.5.5')
chk('D9', 'AMdD, depreciación anual, escenario base (M USD)', expo(A_MDD, 410, P_BASE) / ANIOS, 146, 0.5, 'Resumen; 5.2.5.5')
chk('D10', 'AMdD, depreciación anual con lambda_R = 0,30 (M USD)', expo(A_MDD, 410, P_BASE, 0.30) / ANIOS, 43.9, 0.05, '5.2.5.5')
chk('D11', 'AMdD, depreciación base en % del PIB de Madre de Dios', expo(A_MDD, 410, P_BASE) / ANIOS / PIB_MDD * 100, 16, 0.5, 'Resumen; 1.7; 5.2.5.5; 7.1')
chk('D12', 'AMdD, lambda_R = 0,30 en % del PIB de Madre de Dios', expo(A_MDD, 410, P_BASE, 0.30) / ANIOS / PIB_MDD * 100, 4.9, 0.05, '5.2.5.5')

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'verificacion_cifras.csv')
with open(out, 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=list(filas[0].keys())); w.writeheader(); w.writerows(filas)
malas = [r for r in filas if not r['coincide']]
print(f'{len(filas)} cifras verificadas; {len(filas) - len(malas)} coinciden con la tesis.')
for r in malas:
    print('NO COINCIDE:', r['id'], r['descripcion'], r['calculado'], 'vs', r['publicado'])
sys.exit(1 if malas else 0)
