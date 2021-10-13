Hooks.on(
  'renderActorSheetWfrp4eCharacter',
  (_app: ActorSheet, html: JQuery) => {
    console.dir(_app);
    addActorSheetActionButton(html, 'print', () => {
      print(html);
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

function print(html: JQuery) {
  $('.wfrp4e-print').removeClass('wfrp4e-print');
  html.addClass('wfrp4e-print');
  window.print();
}
