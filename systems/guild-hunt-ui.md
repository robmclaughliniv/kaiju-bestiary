# Guild Hunt UI Layer

The hunt dossier is an **additional presentation layer** on top of the six-axis threat system. It does not replace operational class or threat assessment tables.

## Header meta keys

| Key | Example | UI |
|---|---|---|
| `Attribute` | `Toxic / Plant` | Profile row; accent derivation |
| `Guild type` | `Floating Plant Colossus` | Type row |
| `Rarity` | `4` | Star meter (1–5) |
| `Accent` | `toxic` | Explicit theme token |
| `Japanese display name` | `ブルームレイス` | Subtitle |
| `Japanese epithet` | `幽蘭怪獣` | Subtitle under epithet |
| `Seal kanji` | `幽蘭` | Header calligraphy mark |
| `Calligraphy` | `幻香致死` | Footer seal phrase |
| `Hazard` / `Toxicity` | `MAX` or `4` | Hazard meter |
| `Hunt rank` | `A` | Laurel badge |
| `Documented hunts` | `1` | Hunt count |
| `Expedition value` | `15000` | EXP-style readout |
| `Bounty` | `11500` | Reward readout |

Established spreads may omit these keys; the UI derives attribute and type from the Classification block when possible.

## Sections

### Resistances

```md
## Resistances

| Type | Modifier |
|---|---|
| Slash | Resist |
| Poison | Absorb |
```

Modifiers: `Weak`, `Neutral`, `Resist`, `Strong`, `Absorb`.

### Combat profile

Optional Guild telemetry. **Not** a substitute for threat assessment.

```md
## Combat profile

**Level:** 45
**HP:** 56000
**MP:** 280
**Attack:** 420
```

### Recoverable materials

```md
## Recoverable materials

| Material | Chance | Note |
|---|---:|---|
| Ghost Orchid Core | 30% | |
| Orchid Sigil | 2% | Rare |
```

### Recorded abilities (extended)

Optional inline keys inside each `###` block:

- `**MP:** 18`
- `**Japanese:** 幻香`
- `**Ultimate:** true`

## Accent tokens

| Token | Typical use |
|---|---|
| `toxic` | Poison, venom, corrosive organisms |
| `mineral` | Stone, earth, crystal |
| `aquatic` | Ocean, abyssal |
| `floral` | Plant, vine, botanical |
| `primordial` | Geological, seismic |
| `aerial` | Atmospheric, astral, echo |
| `default` | Fallback phosphor blue |

Set `**Accent:**` explicitly to override derivation from Attribute or Origin.
