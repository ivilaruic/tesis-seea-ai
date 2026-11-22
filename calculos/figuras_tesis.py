"""
Genera las Figuras 8 y 9 de la tesis a partir de los CSV de datos/resultados_gee/.
Uso:  python calculos/figuras_tesis.py
Salida: results/fig8_comparacion_referencias.png y results/fig9_exposicion_contrastes.png
"""
import os, csv
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt, numpy as np
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(R, 'datos', 'resultados_gee'); OUT = os.path.join(R, 'results')
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 10, 'axes.spines.top': False, 'axes.spines.right': False})
C1, C2 = '#2b6cb0', '#dd8a2c'
fmt = lambda v: str(v).replace('.', ',')
rows = list(csv.DictReader(open(os.path.join(D, 'comparacion_productos_referencia.csv'), encoding='utf-8')))
lab = {'A': 'A: solo\nMurray–Darling', 'B': 'B: + muestras de\nla cuenca (tesis)', 'C': 'C: cuenca\nretenida'}
fig, axs = plt.subplots(1, 2, figsize=(10, 4.2), sharey=True)
for ax, cu in zip(axs, ['Sinú', 'Alto Madre de Dios']):
    x = np.arange(3); w = 0.36
    for j, (ref, col) in enumerate([('ESA CCI 2020', C1), ('GEDI L4B', C2)]):
        sel = {r['configuracion']: r for r in rows if r['cuenca'] == cu and r['referencia'] == ref}
        vals = [float(sel[k]['sesgo_pct']) for k in 'ABC']; r2 = [float(sel[k]['r2_1a1']) for k in 'ABC']
        ax.bar(x + (j - 0.5) * w, vals, w, color=col, label=ref)
        for xi, v, r in zip(x + (j - 0.5) * w, vals, r2):
            ax.text(xi, v + (1.5 if v >= 0 else -1.5), 'R² ' + f'{r:.2f}'.replace('.', ',').replace('-', '−'),
                    ha='center', va='bottom' if v >= 0 else 'top', fontsize=7.5, color='#333')
    ax.axhline(0, color='#444', lw=0.8); ax.set_xticks(x); ax.set_xticklabels([lab[k] for k in 'ABC'], fontsize=8.5)
    ax.set_title(cu, fontsize=11, loc='left', fontweight='bold'); ax.set_ylim(-45, 48)
axs[0].set_ylabel('Sesgo de la densidad RF frente a la referencia (%)'); axs[0].legend(frameon=False, fontsize=8.5, loc='upper left')
fig.tight_layout(); fig.savefig(os.path.join(OUT, 'fig8_comparacion_referencias.png'), dpi=220); plt.close()

dens = {(r['cuenca'], r['fuente']): r for r in csv.DictReader(open(os.path.join(D, 'densidad_pixeles_perdidos.csv'), encoding='utf-8'))}
lab20 = {r['cuenca']: r for r in csv.DictReader(open(os.path.join(D, 'sensibilidad_etiqueta_2020.csv'), encoding='utf-8')) if '2020' in r['etiqueta']}
ex = lambda cu, f: float(dens[(cu, f)]['exposicion_con_densidad_pixeles_perdidos_MUSD'])
items = {'Sinú': dict(rng=(32.1, 65.6), base=47.4, ref=('IDEAM (densidad oficial)', 51.8)),
         'Alto Madre de Dios': dict(rng=(445.7, 737.1), base=585.7, ref=('Asner et al. (2010)', 481.2))}
fig, axs = plt.subplots(2, 1, figsize=(10, 5.6))
for ax, (cu, d) in zip(axs, items.items()):
    pts = [(d['ref'][0], d['ref'][1], 's', '#555'),
           ('GEDI L4B, píxeles perdidos', ex(cu, 'GEDI L4B'), 'o', C2),
           ('RF, píxeles perdidos', ex(cu, 'módulo Random Forest (B; 2020)'), '^', '#2f855a'),
           ('ESA CCI, píxeles perdidos', ex(cu, 'ESA CCI 2020'), 'o', C1),
           ('Etiqueta ESA CCI 2020 (media de cuenca)', float(lab20[cu]['exposicion_densidad_cuenca_MUSD']), 'D', '#805ad5')]
    ax.axvspan(*d['rng'], color='#e2e8f0', zorder=0); ax.axvline(d['base'], color='#1a202c', lw=1.6, zorder=1)
    ax.text(d['base'], 0.45, f" escenario base: {fmt(d['base'])}", ha='left', va='center', fontsize=8, fontweight='bold')
    for i, (n, v, m, c) in enumerate(pts):
        y = len(pts) - i + 0.6
        ax.scatter(v, y, marker=m, color=c, s=45, zorder=3); ax.text(v, y + 0.3, f'{n}: {fmt(v)}', fontsize=7.6, ha='center', va='bottom')
    ax.set_yticks([]); ax.set_ylim(0.1, len(pts) + 1.6)
    ax.set_title(f"{cu}: rango de escenarios de la tesis {fmt(d['rng'][0])}–{fmt(d['rng'][1])} M USD (sombreado)", fontsize=10, loc='left', fontweight='bold', pad=8)
    lo = min(d['rng'][0], min(p[1] for p in pts)); hi = max(d['rng'][1], max(p[1] for p in pts))
    ax.set_xlim(lo - (hi - lo) * 0.12, hi + (hi - lo) * 0.12)
axs[1].set_xlabel(r'Exposición bruta del stock de carbono (millones de USD; 25 USD/tCO₂; $\lambda_R$ = 1,00)')
fig.tight_layout(); fig.savefig(os.path.join(OUT, 'fig9_exposicion_contrastes.png'), dpi=220); plt.close()
print('Figuras 8 y 9 generadas en results/')
