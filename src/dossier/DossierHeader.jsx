import Tooltip from "./Tooltip.jsx";

export default function DossierHeader({ entry, num }) {
  return (
    <header className="hunt-header">
      <div className="hunt-header-main">
        <p className="dossier-kicker">Kaiju Bestiary No.{num}</p>
        <h1 className="dossier-name">{entry.name}</h1>
        {entry.japaneseName && (
          <p className="dossier-jp" lang="ja">
            {entry.japaneseName}
          </p>
        )}
        {entry.epithet && <p className="dossier-class">{entry.epithet}</p>}
        {entry.japaneseEpithet && (
          <p className="dossier-jp-epithet" lang="ja">
            {entry.japaneseEpithet}
          </p>
        )}
      </div>
      {entry.sealKanji && (
        <div className="hunt-seal-kanji" lang="ja" aria-hidden="true">
          {entry.sealKanji}
        </div>
      )}
      {entry.threat && (
        <div className="dossier-stamp" aria-label={`Threat: ${entry.threat}`}>
          <span className="dossier-stamp-label">Classification</span>
          <span className="dossier-stamp-value">{entry.threat}</span>
        </div>
      )}
    </header>
  );
}
