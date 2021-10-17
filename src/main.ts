import { PdfBuilder } from './pdf-builder';
import { LabelledText } from './elements/labelled-text';
import { Row } from './elements/row';
import { Image } from './elements/image';
import { Box } from './elements/box';
import { Util } from './util';
import { LABEL_SIZE, MARGINS, TEXT_SIZE } from './constants';
import { ItemData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';
import { LabelledValues } from './elements/labelled-values';
import { Text } from './elements/text';
import { Texts } from './elements/texts';
import { Column } from './elements/column';
import { Separator } from './elements/separator';

Hooks.on(
  'renderActorSheetWfrp4eCharacter',
  async (app: ActorSheet, html: JQuery) => {
    console.dir(app);
    const actor: Actor & any = app.actor;
    const actorData = actor.data;
    // @ts-ignore
    const actorDetails = actorData.data.details;
    const actorStatus = actorData.data.status;
    const actorCharacs = actor.characteristics;
    const actorImage = actor.img;
    let actorImageData: string | null = null;
    if (actorImage != null) {
      const texture = await loadTexture(actorImage);
      actorImageData = ImageHelper.textureToImage(texture);
    }
    const currentCareer: Item & any = actor.currentCareer;
    const careerData: ItemData = currentCareer?.data;
    const careerDetail: any = careerData?.data;
    addActorSheetActionButton(html, 'print', () => {
      const docBuilder = new PdfBuilder({
        orientation: 'p',
        unit: 'mm',
      });

      const labelledRowHeight =
        Util.getHeightFromPx(docBuilder.doc, TEXT_SIZE + LABEL_SIZE) + 1;

      const skills = new LabelledValues(
        0,
        0,
        actor.itemCategories.skill
          .map((item) => {
            return {
              label: item.name,
              value: item.data.data.total.value,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label))
      );

      const talents = new LabelledValues(
        0,
        0,
        actor.itemCategories.talent
          .map((item) => {
            return {
              label:
                item.data.data.tests.value.length > 0
                  ? `${item.name} : ${item.data.data.tests.value}`
                  : item.name,
              value: item.data.data.advances.value,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label)),
        1
      );

      const traits = new Texts(
        0,
        0,
        actor.itemCategories.trait
          .map((item) => {
            return item.name;
          })
          .sort((a, b) => a.localeCompare(b)),
        4
      );

      const weaponsMelee = new Texts(
        0,
        0,
        actor.itemCategories.weapon
          .filter((w) => w.isMelee)
          .map((item) => {
            return `${item.name} : ${item.data.data.damage.meleeValue} (${
              item.mountDamage
            }), ${item.OriginalQualities.concat(item.OriginalFlaws).join(
              ', '
            )}`;
          })
          .sort((a, b) => a.localeCompare(b)),
        1
      );

      const weaponsRanged = new Texts(
        0,
        0,
        actor.itemCategories.weapon
          .filter((w) => w.isRanged)
          .map((item) => {
            return `${item.name} : ${item.data.data.damage.rangedValue}, ${
              item.data.data.range.value
            }, ${item.OriginalQualities.concat(item.OriginalFlaws).join(', ')}`;
          })
          .sort((a, b) => a.localeCompare(b)),
        1
      );

      const ammunitions = new Texts(
        0,
        0,
        actor.itemCategories.ammunition
          .map((item) => {
            return `${item.data.data.quantity.value} ${item.name} : ${
              item.data.data.damage.value.length > 0
                ? item.data.data.damage.value
                : '+0'
            }, (${item.data.data.range.value}), ${item.OriginalQualities.concat(
              item.OriginalFlaws
            ).join(', ')}`;
          })
          .sort((a, b) => a.localeCompare(b)),
        2
      );

      const imageWidth = 25;
      const imageY = labelledRowHeight + MARGINS.top + 2;
      const actorImageElement =
        actorImageData != null
          ? new Image(0, imageY, imageWidth, imageWidth, actorImageData)
          : new Box(0, imageY, imageWidth, imageWidth);

      docBuilder.build([
        actorImageElement,
        new Column(0, 0, [
          new Row(0, 0, [
            new LabelledText(0, 0, 'Name', `${actor.name}`),
            new LabelledText(
              0,
              0,
              'Species',
              `${actorDetails?.species?.value}`
            ),
            new LabelledText(0, 0, 'Gender', `${actorDetails?.gender?.value}`),
          ]),
          new Row(imageWidth + MARGINS.left + 1, 0, [
            new LabelledText(0, 0, 'Class', `${careerDetail?.class?.value}`),
            new LabelledText(
              0,
              0,
              'Career Group',
              `${careerDetail?.careergroup?.value}`
            ),
            new LabelledText(0, 0, 'Career', `${currentCareer?.name}`),
          ]),
          new Row(imageWidth + MARGINS.left + 1, 0, [
            new LabelledText(0, 0, 'Status', `${actorDetails?.status?.value}`),
            new LabelledText(0, 0, 'Age', `${actorDetails?.age?.value}`),
            new LabelledText(0, 0, 'Height', `${actorDetails?.height?.value}`),
            new LabelledText(0, 0, 'Weight', `${actorDetails?.weight?.value}`),
            new LabelledText(
              0,
              0,
              'Hair Colour',
              `${actorDetails?.haircolour?.value}`
            ),
          ]),
          new Row(imageWidth + MARGINS.left + 1, 0, [
            new LabelledText(
              0,
              0,
              'Eye Colour',
              `${actorDetails?.eyecolour?.value}`
            ),
            new LabelledText(
              0,
              0,
              'Distinguishing Mark',
              `${actorDetails?.distinguishingmark?.value}`
            ),
            new LabelledText(
              0,
              0,
              'Star Sign',
              `${actorDetails?.starsign?.value}`
            ),
          ]),
          new Row(0, 0, [
            new LabelledText(
              0,
              0,
              'CHARAbbrev.WS',
              `${actorCharacs?.ws?.value}`
            ),
            new LabelledText(
              0,
              0,
              'CHARAbbrev.BS',
              `${actorCharacs?.bs?.value}`
            ),
            new LabelledText(0, 0, 'CHARAbbrev.S', `${actorCharacs?.s?.value}`),
            new LabelledText(0, 0, 'CHARAbbrev.T', `${actorCharacs?.t?.value}`),
            new LabelledText(0, 0, 'CHARAbbrev.I', `${actorCharacs?.i?.value}`),
            new LabelledText(
              0,
              0,
              'CHARAbbrev.Ag',
              `${actorCharacs?.ag?.value}`
            ),
            new LabelledText(
              0,
              0,
              'CHARAbbrev.Dex',
              `${actorCharacs?.dex?.value}`
            ),
            new LabelledText(
              0,
              0,
              'CHARAbbrev.Int',
              `${actorCharacs?.int?.value}`
            ),
            new LabelledText(
              0,
              0,
              'CHARAbbrev.WP',
              `${actorCharacs?.wp?.value}`
            ),
            new LabelledText(
              0,
              0,
              'CHARAbbrev.Fel',
              `${actorCharacs?.fel?.value}`
            ),
          ]),
          new Row(0, 0, [
            new LabelledText(0, 0, 'Move', `${actorDetails?.move?.value}`),
            new LabelledText(0, 0, 'Walk', `${actorDetails?.move?.walk}`),
            new LabelledText(0, 0, 'Run', `${actorDetails?.move?.run}`),
            new LabelledText(0, 0, 'Fortune', `${actorStatus?.fortune?.value}`),
            new LabelledText(0, 0, 'Fate', `${actorStatus?.fate?.value}`),
            new LabelledText(0, 0, 'Resolve', `${actorStatus?.resolve?.value}`),
            new LabelledText(
              0,
              0,
              'Resilience',
              `${actorStatus?.resilience?.value}`
            ),
            new LabelledText(
              0,
              0,
              'Wounds',
              `${actorStatus?.wounds?.value}/${actorStatus?.wounds?.max}`
            ),
          ]),
          new Separator(0, 0),
          new Text(0, 0, 'Skills'),
          skills,
          new Separator(0, 0),
          new Text(0, 0, 'Talents'),
          talents,
          new Separator(0, 0),
          new Text(0, 0, 'Traits'),
          traits,
          new Separator(0, 0),
          new Text(0, 0, 'SHEET.MeleeWeaponHeader'),
          weaponsMelee,
          new Separator(0, 0),
          new Text(0, 0, 'SHEET.RangedWeaponHeader'),
          weaponsRanged,
          new Separator(0, 0),
          new Text(0, 0, 'Ammunition'),
          ammunitions,
        ]),
      ]);
      docBuilder.doc.save(`${app.actor.name}.pdf`);
    });
  }
);

function addActorSheetActionButton(
  html: JQuery,
  icon: string,
  onClick: () => void
) {
  const button = document.createElement('a');
  button.classList.add('print');
  button.innerHTML = `<i class="fas fa-${icon}"> </i>`;
  button.addEventListener('click', () => {
    onClick();
  });
  const header = html.find('.window-header');
  const title = header.find('.window-title');
  title.after(button);
}
