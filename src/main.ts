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
      const textRowHeight = Util.getHeightFromPx(docBuilder.doc, TEXT_SIZE);
      const row2Y = labelledRowHeight + MARGINS.top + 2;
      const row3Y = row2Y + labelledRowHeight + 2;
      const row4Y = row3Y + labelledRowHeight + 2;
      const row5Y = row4Y + labelledRowHeight + 2;
      const row6Y = row5Y + labelledRowHeight + 2;
      const row7Y = row6Y + labelledRowHeight + 2;
      const row8Y = row7Y + textRowHeight + 2;

      const skills = new LabelledValues(
        0,
        row8Y,
        actor.itemCategories.skill
          .map((item) => {
            return {
              label: item.name,
              value: item.data.data.total.value,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label))
      );

      const row9Y = row8Y + skills.getHeight(docBuilder.doc) + 2;
      const row10Y = row9Y + textRowHeight + 2;

      const talents = new LabelledValues(
        0,
        row10Y,
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

      const row11Y = row10Y + talents.getHeight(docBuilder.doc) + 2;
      const row12Y = row11Y + textRowHeight + 2;

      const traits = new Texts(
        0,
        row12Y,
        actor.itemCategories.trait
          .map((item) => {
            return item.name;
          })
          .sort((a, b) => a.localeCompare(b)),
        4
      );

      const imageWidth = 25;
      const actorImageElement =
        actorImageData != null
          ? new Image(0, row2Y, imageWidth, imageWidth, actorImageData)
          : new Box(0, row2Y, imageWidth, imageWidth);

      docBuilder.build([
        new Row(0, 0, [
          new LabelledText(0, 0, 'Name', `${actor.name}`),
          new LabelledText(0, 0, 'Species', `${actorDetails?.species?.value}`),
          new LabelledText(0, 0, 'Gender', `${actorDetails?.gender?.value}`),
        ]),
        actorImageElement,
        new Row(imageWidth + MARGINS.left + 1, row2Y, [
          new LabelledText(0, 0, 'Class', `${careerDetail?.class?.value}`),
          new LabelledText(
            0,
            0,
            'Career Group',
            `${careerDetail?.careergroup?.value}`
          ),
          new LabelledText(0, 0, 'Career', `${currentCareer?.name}`),
        ]),
        new Row(imageWidth + MARGINS.left + 1, row3Y, [
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
        new Row(imageWidth + MARGINS.left + 1, row4Y, [
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
        new Row(0, row5Y, [
          new LabelledText(0, 0, 'CHARAbbrev.WS', `${actorCharacs?.ws?.value}`),
          new LabelledText(0, 0, 'CHARAbbrev.BS', `${actorCharacs?.bs?.value}`),
          new LabelledText(0, 0, 'CHARAbbrev.S', `${actorCharacs?.s?.value}`),
          new LabelledText(0, 0, 'CHARAbbrev.T', `${actorCharacs?.t?.value}`),
          new LabelledText(0, 0, 'CHARAbbrev.I', `${actorCharacs?.i?.value}`),
          new LabelledText(0, 0, 'CHARAbbrev.Ag', `${actorCharacs?.ag?.value}`),
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
          new LabelledText(0, 0, 'CHARAbbrev.WP', `${actorCharacs?.wp?.value}`),
          new LabelledText(
            0,
            0,
            'CHARAbbrev.Fel',
            `${actorCharacs?.fel?.value}`
          ),
        ]),
        new Row(0, row6Y, [
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
        new Text(0, row7Y, 'Skills'),
        skills,
        new Text(0, row9Y, 'Talents'),
        talents,
        new Text(0, row11Y, 'Traits'),
        traits,
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
