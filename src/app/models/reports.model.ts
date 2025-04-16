export interface ReportSummaryList {
  page: number;
  maxPage: number;
  reports: ReportSummary[];
}

export interface ReportSummary {
  title: string;
  pageLink: string;
  date: Date;
  temporary: boolean;
  orders: string[];
}

export enum SpeakerRole {
  president = 'president',
  none = 'none'
}

export interface Speaker {
  name: string;
  role: SpeakerRole;
  title?: string;
}

export interface Speech {
  speaker: Speaker;
  text: string;
}

export interface DebateNode {
  id: string;           // Identifiant unique du nœud
  name: string;         // Nom/titre du débat
  level: number;        // Niveau dans la hiérarchie
  order: string;        // Numéro d'ordre
  metadata?: {          // Métadonnées optionnelles
    type?: string;      // Type de débat (ex: "vote", "discussion", etc.)
    structureType?: string; // Structure XML d'origine
    tags?: string[];    // Tags éventuels
  };
}

export interface Debate {
  node: DebateNode;     // Métadonnées du débat
  speeches: Speech[];   // Discours dans ce débat
  children: Debate[];   // Sous-débats
  parent?: Debate;      // Référence au débat parent (facilite la navigation)
}

export class DebateTree {
  private rootDebates: Map<string, Debate> = new Map();
  private debateIndex: Map<string, Debate> = new Map(); // Index pour accès rapide par ID

  constructor(debates?: Map<string, Debate>) {
    if (debates) {
      this.rootDebates = debates;
      this.indexAllDebates();
    }
  }

  /**
   * Ajoute un débat racine à l'arbre
   */
  public addRootDebate(debate: Debate): void {
    this.rootDebates.set(debate.node.order, debate);
    this.indexDebate(debate);
  }

  /**
   * Récupère un débat racine par son ordre
   */
  public getRootDebate(order: string): Debate | undefined {
    return this.rootDebates.get(order);
  }

  /**
   * Récupère tous les débats racines
   */
  public getRootDebates(): Map<string, Debate> {
    return this.rootDebates;
  }

  /**
   * Récupère un débat par son ID
   */
  public getDebateById(id: string): Debate | undefined {
    return this.debateIndex.get(id);
  }

  /**
   * Parcourt l'arbre et crée un index de tous les débats
   */
  private indexAllDebates(): void {
    this.debateIndex.clear();
    this.rootDebates.forEach(debate => {
      this.indexDebateRecursive(debate);
    });
  }

  /**
   * Indexe un débat et ses enfants récursivement
   */
  private indexDebateRecursive(debate: Debate): void {
    this.indexDebate(debate);
    debate.children.forEach(child => {
      this.indexDebateRecursive(child);
    });
  }

  /**
   * Indexe un seul débat
   */
  private indexDebate(debate: Debate): void {
    this.debateIndex.set(debate.node.id, debate);
  }

  /**
   * Recherche le premier parent correspondant au niveau donné
   */
  public findParentAtLevel(debate: Debate, targetLevel: number): Debate | undefined {
    let current = debate;

    // Si le niveau cible est supérieur au niveau actuel, impossible de trouver
    if (targetLevel > current.node.level) {
      return undefined;
    }

    // Remonter dans l'arbre jusqu'à trouver le niveau cible
    while (current.node.level > targetLevel && current.parent) {
      current = current.parent;
    }

    return current.node.level === targetLevel ? current : undefined;
  }

  /**
   * Convertit l'arbre au format ancien pour compatibilité
   */
  public toLegacyFormat(): Map<string, any> {
    const result = new Map<string, any>();

    this.rootDebates.forEach((debate, key) => {
      result.set(key, this.convertToLegacyDebate(debate));
    });

    return result;
  }

  private convertToLegacyDebate(debate: Debate): any {
    return {
      name: debate.node.name,
      speeches: debate.speeches,
      subDebates: debate.children.map(child => this.convertToLegacyDebate(child)),
      level: debate.node.level,
      order: debate.node.order
    };
  }
}
