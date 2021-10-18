import { PdfBuilder } from './pdf-builder';
import { LabelledText } from './elements/labelled-text';
import { Row } from './elements/row';
import { Image } from './elements/image';
import { Box } from './elements/box';
import { Util } from './util';
import { i18nLocalize, LABEL_SIZE, MARGINS, TEXT_SIZE } from './constants';
import { ItemData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';
import { LabelledValues } from './elements/labelled-values';
import { Text } from './elements/text';
import { Texts } from './elements/texts';
import { Column } from './elements/column';
import { Separator } from './elements/separator';
import { Blank } from './elements/blank';

Hooks.on(
  'renderActorSheetWfrp4eCharacter',
  async (app: ActorSheet, html: JQuery) => {
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
              label: `${item.name} (${i18nLocalize(
                item.characteristic.abrev
              )})`,
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
        1,
        true
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
        Util.getActorItems(actor, 'weapon')
          .filter((w) => w.isMelee)
          .map((item) => {
            return `${item.name} : ${item.WeaponGroup}, ${item.Reach}, ${
              item.data.data.damage.meleeValue
            } (${item.mountDamage}), ${item.OriginalQualities.concat(
              item.OriginalFlaws
            ).join(', ')}`;
          })
          .sort((a, b) => a.localeCompare(b)),
        1,
        true
      );

      const weaponsRanged = new Texts(
        0,
        0,
        Util.getActorItems(actor, 'weapon')
          .filter((w) => w.isRanged)
          .map((item) => {
            return `${item.name} : ${item.WeaponGroup}, ${
              item.data.data.range.value
            } (${item.Range}), ${item.data.data.damage.rangedValue} (${
              item.Damage
            }), ${item.OriginalQualities.concat(item.OriginalFlaws).join(
              ', '
            )}`;
          })
          .sort((a, b) => a.localeCompare(b)),
        1,
        true
      );

      const ammunitions = new Texts(
        0,
        0,
        Util.getActorItems(actor, 'ammunition')
          .map((item) => {
            return `${item.data.data.quantity.value} ${item.name} : ${
              item.data.data.range.value.length > 0
                ? item.data.data.range.value
                : 'As Weapon'
            }, ${
              item.data.data.damage.value.length > 0
                ? item.data.data.damage.value
                : '+0'
            }, ${item.OriginalQualities.concat(item.OriginalFlaws).join(', ')}`;
          })
          .sort((a, b) => a.localeCompare(b)),
        2,
        true
      );

      const armourLocation: string[] = [];
      const armourLabels: { [key: string]: string[] } = {};
      for (const armour of Util.getActorItems(actor, 'armour')) {
        const maxAp = armour.data.data.maxAP;
        for (const key of Object.keys(maxAp)) {
          if (maxAp[key] > 0) {
            if (!armourLocation.includes(key)) {
              armourLocation.push(key);
            }
            if (armourLabels[key] == null) {
              armourLabels[key] = [];
            }
            armourLabels[key].push(
              `${armour.name} ${maxAp[key]} ${armour.OriginalQualities.concat(
                armour.OriginalFlaws
              ).join(' ')}`
            );
          }
        }
      }

      const armours = new Texts(
        0,
        0,
        armourLocation.map((al) => {
          return `${actorStatus?.armour[al]?.label} : ${armourLabels[al]?.join(
            ', '
          )}`;
        }),
        1,
        true
      );

      const petty = new Texts(
        0,
        0,
        actor.itemCategories.spell
          .filter((s) => s.lore.value === 'petty')
          .map((s) => {
            return `${s.name} : ${s.cn.value}, ${s.Range}, ${s.Target}, ${s.Duration}`;
          }),
        2,
        true
      );

      const spell = new Texts(
        0,
        0,
        actor.itemCategories.spell
          .filter((s) => s.lore.value !== 'petty')
          .map((s) => {
            return `${s.name} : ${s.cn.value}, ${s.Range}, ${s.Target}, ${s.Duration}, ${s.ingredientList.length}`;
          }),
        2,
        true
      );

      const blessing = new Texts(
        0,
        0,
        actor.itemCategories.prayer
          .filter((s) => s.prayerType.value === 'blessing')
          .map((s) => {
            return `${s.name} : ${s.Range}, ${s.Target}, ${s.Duration}`;
          }),
        2,
        true
      );

      const miracle = new Texts(
        0,
        0,
        actor.itemCategories.prayer
          .filter((s) => s.prayerType.value !== 'blessing')
          .map((s) => {
            return `${s.name} : ${s.Range}, ${s.Target}, ${s.Duration}`;
          }),
        2,
        true
      );

      const allMoney = Util.getActorItems(actor, 'money');
      const moneyNames: string[] = [];
      const moneyByName: { [name: string]: number } = {};
      for (const money of allMoney) {
        if (!moneyNames.includes(money.name)) {
          moneyNames.push(money.name);
        }
        if (moneyByName[money.name] == null) {
          moneyByName[money.name] = 0;
        }
        moneyByName[money.name] =
          moneyByName[money.name] + money.quantity.value;
      }

      const trappingsHeader = new Texts(
        0,
        0,
        [
          `${i18nLocalize('Trappings')} : ${i18nLocalize(
            'Money'
          )} : ${moneyNames
            .map((m) => {
              return `${m} : ${moneyByName[m]}`;
            })
            .join(', ')}`,
        ],
        1,
        true
      );

      const trappings = new Texts(
        0,
        0,
        Util.getAllActorItems(actor, ['container', 'trapping'])
          .map((t) => {
            const location = t.location.value;
            let prefix = '';
            if (location != null && location !== 0) {
              prefix = `${actor.getEmbeddedDocument('Item', location).name} : `;
            }
            const qteLabel = t.quantity.value > 1 ? `${t.quantity.value} ` : '';
            return `${prefix}${qteLabel}${t.name}`;
          })
          .sort((a, b) => a.localeCompare(b)),
        4,
        true
      );

      const critical = new Texts(
        0,
        0,
        actor.itemCategories.critical.map((i) => {
          return i.name;
        }),
        3
      );

      const disease = new Texts(
        0,
        0,
        actor.itemCategories.disease.map((i) => {
          return i.name;
        }),
        3
      );

      const injury = new Texts(
        0,
        0,
        actor.itemCategories.injury.map((i) => {
          return i.name;
        }),
        3
      );

      const mutationP = new Texts(
        0,
        0,
        actor.itemCategories.mutation
          .filter((i) => i.mutationType.value === 'physical')
          .map((i) => {
            return i.name;
          }),
        3
      );

      const mutationM = new Texts(
        0,
        0,
        actor.itemCategories.mutation
          .filter((i) => i.mutationType.value === 'mental')
          .map((i) => {
            return i.name;
          }),
        3
      );

      const psychology = new Texts(
        0,
        0,
        actor.itemCategories.psychology.map((i) => {
          return i.name;
        }),
        3
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
          Blank.heightBlank(2),
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
          new Text(
            0,
            0,
            `${i18nLocalize('Talents')} : ${i18nLocalize('Tests')}`
          ),
          talents,
          traits.elements.length > 0
            ? new Separator(0, 0)
            : Blank.heightBlank(0),
          traits.elements.length > 0
            ? new Text(0, 0, 'Traits')
            : Blank.heightBlank(0),
          traits,
          weaponsMelee.elements.length > 0
            ? new Separator(0, 0)
            : Blank.heightBlank(0),
          weaponsMelee.elements.length > 0
            ? new Text(
                0,
                0,
                `${i18nLocalize('SHEET.MeleeWeaponHeader')} : ${i18nLocalize(
                  'Weapon Group'
                )}, ${i18nLocalize('Reach')}, ${i18nLocalize(
                  'Damage'
                )}, ${i18nLocalize('Qualities')}, ${i18nLocalize('Flaws')}`
              )
            : Blank.heightBlank(0),
          weaponsMelee,
          weaponsRanged.elements.length > 0
            ? new Separator(0, 0)
            : Blank.heightBlank(0),
          weaponsRanged.elements.length > 0
            ? new Text(
                0,
                0,
                `${i18nLocalize('SHEET.RangedWeaponHeader')} : ${i18nLocalize(
                  'Weapon Group'
                )}, ${i18nLocalize('Range')}, ${i18nLocalize(
                  'Damage'
                )}, ${i18nLocalize('Qualities')}, ${i18nLocalize('Flaws')}`
              )
            : Blank.heightBlank(0),
          weaponsRanged,
          ammunitions.elements.length > 0
            ? new Separator(0, 0)
            : Blank.heightBlank(0),
          ammunitions.elements.length > 0
            ? new Text(
                0,
                0,
                `${i18nLocalize('Ammunition')} : ${i18nLocalize(
                  'Range'
                )}, ${i18nLocalize('Damage')}, ${i18nLocalize(
                  'Qualities'
                )}, ${i18nLocalize('Flaws')}`
              )
            : Blank.heightBlank(0),
          ammunitions,
          armours.elements.length > 0
            ? new Separator(0, 0)
            : Blank.heightBlank(0),
          armours.elements.length > 0
            ? new Text(0, 0, 'Armour')
            : Blank.heightBlank(0),
          armours,
          petty.elements.length > 0
            ? new Separator(0, 0)
            : Blank.heightBlank(0),
          petty.elements.length > 0
            ? new Text(
                0,
                0,
                `${i18nLocalize('SHEET.PettySpell')} : ${i18nLocalize(
                  'Casting Number'
                )}, ${i18nLocalize('Range')}, ${i18nLocalize(
                  'Target'
                )}, ${i18nLocalize('Duration')}`
              )
            : Blank.heightBlank(0),
          petty,
          spell.elements.length > 0
            ? new Separator(0, 0)
            : Blank.heightBlank(0),
          spell.elements.length > 0
            ? new Text(
                0,
                0,
                `${i18nLocalize('SHEET.LoreSpell')} : ${i18nLocalize(
                  'Casting Number'
                )}, ${i18nLocalize('Range')}, ${i18nLocalize(
                  'Target'
                )}, ${i18nLocalize('Duration')}, ${i18nLocalize(
                  'WFRP4E.TrappingType.Ingredients'
                )}`
              )
            : Blank.heightBlank(0),
          spell,
          blessing.elements.length > 0
            ? new Separator(0, 0)
            : Blank.heightBlank(0),
          blessing.elements.length > 0
            ? new Text(
                0,
                0,
                `${i18nLocalize('Blessing')} : ${i18nLocalize(
                  'Range'
                )}, ${i18nLocalize('Target')}, ${i18nLocalize('Duration')}`
              )
            : Blank.heightBlank(0),
          blessing,
          miracle.elements.length > 0
            ? new Separator(0, 0)
            : Blank.heightBlank(0),
          miracle.elements.length > 0
            ? new Text(
                0,
                0,
                `${i18nLocalize('Miracle')} : ${i18nLocalize(
                  'Range'
                )}, ${i18nLocalize('Target')}, ${i18nLocalize('Duration')}`
              )
            : Blank.heightBlank(0),
          miracle,
          new Separator(0, 0),
          trappingsHeader,
          trappings,
          psychology.elements.length > 0
            ? new Separator(0, 0)
            : Blank.heightBlank(0),
          psychology.elements.length > 0
            ? new Text(0, 0, 'Psychology')
            : Blank.heightBlank(0),
          psychology,
          critical.elements.length > 0
            ? new Separator(0, 0)
            : Blank.heightBlank(0),
          critical.elements.length > 0
            ? new Text(0, 0, 'Criticals')
            : Blank.heightBlank(0),
          critical,
          disease.elements.length > 0
            ? new Separator(0, 0)
            : Blank.heightBlank(0),
          disease.elements.length > 0
            ? new Text(0, 0, 'Diseases')
            : Blank.heightBlank(0),
          disease,
          injury.elements.length > 0
            ? new Separator(0, 0)
            : Blank.heightBlank(0),
          injury.elements.length > 0
            ? new Text(0, 0, 'Injuries')
            : Blank.heightBlank(0),
          injury,
          mutationP.elements.length > 0
            ? new Separator(0, 0)
            : Blank.heightBlank(0),
          mutationP.elements.length > 0
            ? new Text(
                0,
                0,
                `${i18nLocalize('Mutations')} (${i18nLocalize('Physical')})`
              )
            : Blank.heightBlank(0),
          mutationP,
          mutationM.elements.length > 0
            ? new Separator(0, 0)
            : Blank.heightBlank(0),
          mutationM.elements.length > 0
            ? new Text(
                0,
                0,
                `${i18nLocalize('Mutations')} (${i18nLocalize('Mental')})`
              )
            : Blank.heightBlank(0),
          mutationM,
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
