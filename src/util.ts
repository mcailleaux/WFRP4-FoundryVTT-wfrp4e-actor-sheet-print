import jsPDF from 'jspdf';

export class Util {
  public static getHeightFromPx(doc: jsPDF, size: number) {
    return size / doc.internal.scaleFactor;
  }

  public static getAllActorItems(
    actor: Actor & any,
    keys: string[]
  ): (Item & any)[] {
    const result: (Item & any)[] = [];
    for (const key of keys) {
      result.push(...this.getActorItems(actor, key));
    }
    return result;
  }

  public static getActorItems(actor: Actor & any, key: string): (Item & any)[] {
    if (actor.itemCategories[key] == null) {
      return [];
    }
    return actor.itemCategories[key].filter((it) => {
      const location = it.location.value;
      if (location != null && location !== 0) {
        return actor.getEmbeddedDocument('Item', location) != null;
      }
      return true;
    });
  }
}
