export default function DossierFooter({ entry }) {
  if (!entry.ecologyNote && !entry.calligraphy && !entry.huntRank) return null;

  return (
    <footer className="hunt-footer">
      {entry.ecologyNote && (
        <p className="hunt-footer-ecology">
          <span className="hunt-footer-label">Ecology notes</span>
          {entry.ecologyNote}
        </p>
      )}
      {entry.calligraphy && (
        <p className="hunt-footer-calligraphy" lang="ja" aria-hidden="true">
          {entry.calligraphy}
        </p>
      )}
      {entry.huntRank && (
        <div className="hunt-rank" aria-label={`Hunt reward rank ${entry.huntRank}`}>
          <span className="hunt-rank-wreath" aria-hidden="true" />
          <span className="hunt-rank-letter">{entry.huntRank}</span>
          <span className="hunt-rank-label">Hunt reward rank</span>
        </div>
      )}
    </footer>
  );
}
