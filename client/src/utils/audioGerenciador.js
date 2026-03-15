import { Howl } from "howler";

const fonteAudios = "/assets/audios/";

const sons = {
  click: new Audio(fonteAudios + "click.mp3"),

  on: new Howl({
    src: [fonteAudios + "/ambiente/on.wav"],
    loop: false,
    volume: 0.3,
    html5: false
  }),

  loop: new Howl({
    src: [fonteAudios + "/ambiente/loop.wav"],
    loop: true,
    volume: 0,
    html5: false
  }),

  off: new Howl({
    src: [fonteAudios + "/ambiente/off.wav"],
    loop: false,
    volume: 0.3,
    html5: false
  })
};

const audioGerenciador = {

  tocarSom(nome) {
    const som = sons[nome];
    if (!som) return;

    if (som instanceof Howl) {
      som.play();
    } else {
      som.currentTime = 0;
      som.play();
    }
  },

  ligarSistema() {
    sons.on.play();

    sons.on.once("end", () => {
      if (!sons.loop.playing()) {
        sons.loop.play();
        sons.loop.fade(0, 0.3, 2000);
      }
    });
  },

  desligarSistema() {
    sons.off.play();
    sons.loop.fade(sons.loop.volume(), 0, 1000);

    sons.loop.once("fade", () => {
      if (sons.loop.volume() === 0) {
        sons.loop.stop();
      }
    });
  }

};

export default audioGerenciador;