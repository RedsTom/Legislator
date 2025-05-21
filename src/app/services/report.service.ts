import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {filter, map, Observable, of} from 'rxjs';
import {Debate, DebateNode, DebateTree, Speaker, SpeakerRole, Speech} from '../models/reports.model';
import {parseText} from "../utils/xml.utils";

const parser = new DOMParser();

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private reportCache: Map<string, DebateTree> = new Map();

  constructor(
    private http: HttpClient
  ) {
  }

  public getReport(seanceId: string, order: string): Observable<Debate | undefined> {
    if (this.reportCache.has(seanceId) && this.reportCache.get(seanceId)?.getRootDebate(order)) {
      return of(this.reportCache.get(seanceId)?.getRootDebate(order));
    }

    const report = this.http.get(`@/dyn/opendata/${seanceId}.xml`, {
        responseType: "text"
      }).pipe(
        map((xml) => this.processReport(xml)),
      );

    report.subscribe((debateTree) => {
      this.reportCache.set(seanceId, debateTree);
    });

    return report.pipe(
      map((debateTree) => {
        // Rechercher le débat avec un ordre correspondant
        for (const [key, debate] of debateTree.getRootDebates().entries()) {
          if (key.includes(order) || order.includes(key)) {
            return debate;
          }
        }
        return undefined;
      }),
      filter(debate => debate !== undefined),
    );
  }

  /**
   * Traite le XML d'un rapport et le convertit en un arbre de débats.
   */
  private processReport(xml: string): DebateTree {
    const document = parser.parseFromString(xml, "text/xml");
    const debateTree = new DebateTree();

    // Parcourir les entrées du sommaire
    const sommaireNodes = document.querySelectorAll("sommaire > sommaire1");
    sommaireNodes.forEach((sommaire) => {
      const valeurPtsOdj = sommaire.getAttribute("valeur_pts_odj") || "0";
      const name = sommaire.querySelector("titreStruct > intitule")?.textContent?.trim() ?? "Inconnu";

      // Créer le nœud de débat principal
      const rootNode: DebateNode = {
        id: `root_${valeurPtsOdj}`,
        name: name,
        level: 0,
        order: valeurPtsOdj,
        metadata: {
          type: "main",
          tags: ["sommaire"]
        }
      };

      // Créer le débat racine
      const rootDebate: Debate = {
        node: rootNode,
        speeches: [],
        children: []
      };

      // Ajouter le débat racine à l'arbre
      debateTree.addRootDebate(rootDebate);

      // Trouver les points correspondants dans le contenu
      const points = document.querySelectorAll(`contenu > point[valeur_ptsodj="${valeurPtsOdj}"]`);

      // Traiter chaque point racine
      points.forEach(point => {
        this.processPointElement(point, rootDebate, debateTree);
      });
    });

    return debateTree;
  }

  /**
   * Traite un élément point et le convertit en débat.
   */
  private processPointElement(pointElement: Element, parentDebate: Debate, debateTree: DebateTree): void {
    const nivPoint = Number(pointElement.getAttribute("nivpoint") || "0");
    const valeurPtsOdj = pointElement.getAttribute("valeur_ptsodj") || "0";

    // Déterminer le nom du débat
    let name: string = pointElement.querySelector(":scope > texte")?.textContent?.trim() ?? "";

    // Déterminer le bon parent pour ce point
    let actualParent = parentDebate;

    // Si le niveau est supérieur de plus de 1 par rapport au parent actuel,
    // nous devons trouver un parent de niveau approprié
    if (nivPoint > parentDebate.node.level + 1) {
      const idealParentLevel = nivPoint - 1;

      // Chercher parmi les derniers enfants du parent actuel
      let candidateParent: Debate | undefined = undefined;

      if (parentDebate.children.length > 0) {
        // Parcourir les enfants du plus récent au plus ancien
        for (let i = parentDebate.children.length - 1; i >= 0; i--) {
          const child = parentDebate.children[i];
          if (child.node.level <= idealParentLevel) {
            // Si le niveau de l'enfant est inférieur à ce que nous cherchons,
            // nous devons explorer ses enfants
            if (child.node.level < idealParentLevel) {
              candidateParent = this.findDeepestChild(child, idealParentLevel);
            } else {
              candidateParent = child;
            }
            break;
          }
        }
      }

      if (candidateParent) {
        actualParent = candidateParent;
      }
      // Si aucun parent approprié n'est trouvé, nous créons implicitement des niveaux manquants
      else {
        actualParent = this.createMissingLevels(parentDebate, idealParentLevel);
      }
    }

    // Créer l'ID unique pour ce débat
    const debateId = `debate_${valeurPtsOdj}_${nivPoint}_${Date.now().toString(36)}`;

    // Créer le nœud de débat
    const debateNode: DebateNode = {
      id: debateId,
      name,
      level: nivPoint,
      order: valeurPtsOdj,
    };

    // Créer le débat
    const debate: Debate = {
      node: debateNode,
      speeches: this.extractSpeeches(pointElement),
      children: [],
      parent: actualParent
    };

    // Ajouter le débat à son parent
    actualParent.children.push(debate);

    // Indexer le débat pour un accès rapide
    debateTree.getDebateById(debateId);

    // Traiter récursivement les sous-points
    const subPoints = pointElement.querySelectorAll(":scope > point");
    subPoints.forEach(subPoint => {
      this.processPointElement(subPoint, debate, debateTree);
    });
  }

  /**
   * Trouve l'enfant le plus profond ne dépassant pas le niveau maximum spécifié.
   */
  private findDeepestChild(debate: Debate, maxLevel: number): Debate {
    if (debate.node.level === maxLevel || debate.children.length === 0) {
      return debate;
    }

    // Prendre l'enfant le plus récent qui pourrait convenir
    for (let i = debate.children.length - 1; i >= 0; i--) {
      const child = debate.children[i];
      if (child.node.level <= maxLevel) {
        return this.findDeepestChild(child, maxLevel);
      }
    }

    return debate;
  }

  /**
   * Crée les niveaux manquants dans la hiérarchie.
   */
  private createMissingLevels(parent: Debate, targetLevel: number): Debate {
    let currentParent = parent;
    let currentLevel = parent.node.level;
    //
    // while (currentLevel < targetLevel) {
    //   currentLevel++;
    //
    //   const debateNode: DebateNode = {
    //     id: `implicit_${parent.node.order}_${currentLevel}_${Date.now().toString(36)}`,
    //     name: `Section implicite ${currentLevel}`,
    //     level: currentLevel,
    //     order: parent.node.order,
    //     metadata: {
    //       type: "implicit"
    //     }
    //   };
    //
    //   const implicitDebate: Debate = {
    //     node: debateNode,
    //     speeches: [],
    //     children: [],
    //     parent: currentParent
    //   };
    //
    //   currentParent.children.push(implicitDebate);
    //   currentParent = implicitDebate;
    // }

    return currentParent;
  }
  /**
   * Extrait les discours d'un élément.
   */
  private extractSpeeches(element: Element): Speech[] {
    const speeches: Speech[] = [];
    const paragraphs = element.querySelectorAll(":scope paragraphe");
    this.extractSpeechesFromParagraphs(paragraphs, speeches);
    return speeches;
  }

  /**
   * Extrait les discours d'une collection de paragraphes.
   */
  private extractSpeechesFromParagraphs(paragraphs: NodeListOf<Element>, speeches: Speech[]): void {
    paragraphs.forEach(para => {
      const orateur = para.querySelector("orateurs > orateur");
      if (!orateur) return;

      // Créer l'orateur
      const speaker = this.createSpeakerFromElement(para, orateur);

      // Extraire le texte du discours
      const texte = para.querySelector("texte")?.getHTML() || "";
      if (texte.trim()) {
        speeches.push({
          speaker,
          text: parseText(texte.replace(/\s+/g, ' ').trim())
        });
      }
    });
  }

  /**
   * Crée un objet Speaker à partir d'un élément orateur.
   */
  private createSpeakerFromElement(paragraph: Element, orateur: Element): Speaker {
    const speakerName = orateur.querySelector("nom")?.textContent || "Inconnu";
    const qualite = orateur.querySelector("qualite")?.textContent || "";

    let role = SpeakerRole.none;
    if (paragraph.getAttribute("roledebat") === "president") {
      role = SpeakerRole.president;
    }

    return {
      name: speakerName,
      role: role,
      title: qualite || undefined
    };
  }
}

