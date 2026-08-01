const HUMAN_HEIGHT = 1.8;

export default function ScalePanel({ scale, lengthMeters }) {
  if (!scale && !lengthMeters) return null;

  const maxHeight = lengthMeters ? Math.ceil(lengthMeters / 10) * 10 : 100;
  const creaturePct = lengthMeters ? Math.min(100, (lengthMeters / maxHeight) * 100) : 50;
  const humanPct = Math.min(100, (HUMAN_HEIGHT / maxHeight) * 100);

  return (
    <section className="hud-panel hud-scale" aria-label="Scale comparison">
      <h2 className="hud-panel-title">Scale</h2>
      {scale && (
        <dl className="scale-stats">
          {scale["estimated length"] && (
            <div>
              <dt>Length</dt>
              <dd>{scale["estimated length"]}</dd>
            </div>
          )}
          {scale["estimated mass"] && (
            <div>
              <dt>Mass</dt>
              <dd>{scale["estimated mass"]}</dd>
            </div>
          )}
          {scale["locomotion"] && (
            <div>
              <dt>Locomotion</dt>
              <dd>{scale["locomotion"]}</dd>
            </div>
          )}
        </dl>
      )}
      {lengthMeters && (
        <div className="scale-chart">
          <div className="scale-ruler" aria-hidden="true">
            {[0, 0.25, 0.5, 0.75, 1].map((t) => (
              <span key={t} style={{ bottom: `${t * 100}%` }}>
                {Math.round(maxHeight * t)}m
              </span>
            ))}
          </div>
          <div className="scale-silhouettes">
            <figure className="scale-figure scale-figure--creature" style={{ height: `${creaturePct}%` }}>
              <div className="scale-silhouette scale-silhouette--creature" />
              <figcaption>{lengthMeters >= 10 ? `~${Math.round(lengthMeters)}m` : `${lengthMeters}m`}</figcaption>
            </figure>
            <figure className="scale-figure scale-figure--human" style={{ height: `${Math.max(humanPct, 4)}%` }}>
              <div className="scale-silhouette scale-silhouette--human" />
              <figcaption>1.8m</figcaption>
            </figure>
          </div>
        </div>
      )}
    </section>
  );
}
