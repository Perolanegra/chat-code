# Note Sizing Heuristics

Guidelines for determining when to split or combine documentation notes.

## The Dual Audience Principle

Our documentation serves both human developers and AI tools. For details on this approach, see [[documentation-dual-audience-dilemma|Documentation Dual Audience Dilemma]]

The tension between these audiences affects note sizing:
- **Humans**: Need context and narrative flow
- **AI tools**: Work better with focused content within context windows

## Core Heuristics

### 1. Single Responsibility Test
**Question**: "Does this note explain one primary concept?"

Split if you find yourself using "and" in the title or explaining multiple distinct concepts.

### 2. Context Window Test
**Question**: "Is this content understandable in isolation?"

Notes should be self-contained enough to be useful when viewed alone.

If extensive background is needed:
- Add brief context at the beginning
- Split into linked notes
- Create a higher-level overview

### 3. Navigation Value Test
**Question**: "Does splitting create valuable navigation paths?"

Split when resulting notes would be independently valuable destinations.

### 4. Information Density Test
**Question**: "Can this be read in 3-5 minutes?"

If not, consider extracting specialized topics.

## When to Reference vs. Include

- **Reference**: For supplementary or widely relevant information
- **Include**: When essential to understanding the current concept

Prefer linking to duplicating, while ensuring each note remains independently coherent.

## Application

1. Start with your concept as a single note
2. If it exceeds a 5-minute read, find natural divisions
3. Use [[linking-notes-via-wikilinks|Linking Notes via Wikilinks]] to maintain connections
4. Evaluate if splitting improves both human readability and machine processability 