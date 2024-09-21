const log = m => console.log(m);
const $ = q => document.querySelector(q);
const $$ = q => document.querySelectorAll(q);
const notEmpty = x => !!x;

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');

class Game {
  constructor(helvetica, arial) {
    this.helvetica = helvetica;
    this.arial = arial;
    this.score = 0;
    this.score_display = $('#points');
    this.compare = $('#compare');
    this.check = $('#check');

    this.left = $('#left');
    this.right = $('#right');
    this.single = $('#single');

    this.is_left = false;
    this.check_is_helvetica = false;

    this.left.addEventListener('click', () => this.on_compare(true));
    this.right.addEventListener('click', () => this.on_compare(false));
    $('#yes').addEventListener('click', () => this.on_check(true));
    $('#no').addEventListener('click', () => this.on_check(false));
  }

  do_compare() {
    this.compare.classList.remove('reveal');
    [this.left, this.right].forEach(n => {
      n.classList.remove('wrong')
      n.classList.remove('correct');
    });
    this.check.style.display = 'none';
    this.compare.style.display = 'block';
    let index = Math.floor(Math.random() * CHARS.length);
    this.is_left = Math.random() < 0.5;
    if (this.is_left) {
      this.left.innerHTML = this.helvetica[index];
      this.right.innerHTML = this.arial[index];
      this.left.classList.add('correct');
      this.right.classList.add('wrong');
    } else {
      this.right.innerHTML = this.helvetica[index];
      this.left.innerHTML = this.arial[index];
      this.right.classList.add('correct');
      this.left.classList.add('wrong');
    }
  }

  on_compare(chose_left) {
    if (this.is_left == chose_left) {
      this.update_score(2);
    } else {
      this.update_score(-1);
    }
    this.compare.classList.add('reveal');
    setTimeout(() => this.next_char(), 600);
  }

  do_check() {
    let index = Math.floor(Math.random() * CHARS.length);
    this.check_is_helvetica = Math.random() < 0.5;
    this.check.classList.remove('reveal');
    this.single.classList.remove('correct');
    this.single.classList.remove('wrong');
    if (this.check_is_helvetica) {
      this.single.innerHTML = this.helvetica[index];
    } else {
      this.single.innerHTML = this.arial[index];
    }
    this.check.style.display = 'block';
    this.compare.style.display = 'none';
  }

  on_check(chose_helvetica) {
    if (this.check_is_helvetica == chose_helvetica) {
      this.single.classList.add('correct');
      this.update_score(3);
    } else {
      this.single.classList.add('wrong');
      this.update_score(-1);
    }
    this.check.classList.add('reveal');
    setTimeout(() => this.next_char(), 600);
  }

  next_char() {
    if (Math.random() < 0.3) {
      this.do_check();
    } else {
      this.do_compare();
    }
  }

  update_score(increase) {
    this.score += increase;
    this.score_display.innerText = this.score;
  }
}

addEventListener('load', () => {
  Promise.all([
    fetch('helvetica.svg'),
    fetch('arial.svg')
  ].map(p => p.then(r => r.text()))).then(([helvetica_data, arial_data]) => {
    let helvetica = helvetica_data.split("\n").reverse().filter(notEmpty);
    let arial = arial_data.split("\n").reverse().filter(notEmpty);

    let game = new Game(helvetica, arial);
    game.next_char();
  });
});
