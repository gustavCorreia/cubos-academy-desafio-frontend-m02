const filmes = document.querySelector('.movies'),
    info = document.querySelector('.movie__info'),
    anterior = document.querySelector('.btn-prev'),
    proximo = document.querySelector('.btn-next');

let paginas = 0,
    listaFilmes = [],
    paginaMinima = 0,
    paginaMaxima = 15;

const input = document.querySelector('.input'),
    video = document.querySelector('.highlight__video'),
    tituloVideo = document.querySelector('.highlight__title'),
    notaVideo = document.querySelector('.highlight__rating'),
    generos = document.querySelector('.highlight__genres'),
    data = document.querySelector('.highlight__launch'),
    sinopse = document.querySelector('.highlight__description'),
    link = document.querySelector('.highlight__video-link'),
    modal = document.querySelector('.modal'),
    tituloModal = document.querySelector('.modal__title'),
    imagemModal = document.querySelector('.modal__img'),
    sinopseModal = document.querySelector('.modal__description'),
    modalGeneros = document.querySelector('.modal__genres'),
    modalNota = document.querySelector('.modal__average'),
    fecharModal = document.querySelector('.modal__close'),
    botaoTema = document.querySelector('.btn-theme');

const atualizarFilmes = () => {
    filmes.innerHTML = '';
    for (let i = paginas; i < paginas + 5; i++) {
        let cadaFilme = listaFilmes[i];

        const info = document.createElement('div');
        info.classList.add('movie__info');

        const filme = document.createElement('div');
        filme.style.backgroundImage = `url(${cadaFilme.poster_path})`;
        filme.classList.add('movie');

        const titulo = document.createElement('span');
        titulo.textContent = cadaFilme.title;
        titulo.classList.add('movie__title');

        const nota = document.createElement('span');
        nota.textContent = cadaFilme.vote_average;
        nota.classList.add('movie__rating');

        const estrela = document.createElement('img');
        estrela.src = '/assets/estrela.svg';
        estrela.style.width = '13px';
        estrela.style.height = '13px';

        nota.append(estrela);
        info.append(titulo, nota);
        filme.append(info);
        filmes.append(filme);

        filme.addEventListener('click', () => abrirModal(cadaFilme.id));
    }
};

const listagemFilmes = async(resposta) => {
    const body = await resposta.json();
    listaFilmes = body.results;
    atualizarFilmes();
};

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false').then(listagemFilmes);


anterior.addEventListener('click', () => {
    if (paginas === 0) {
        paginas = paginaMaxima;
    } else {
        paginas -= 5;
    }
    atualizarFilmes();
});

proximo.addEventListener('click', () => {
    if (paginas == paginaMaxima) {
        paginas = 0;
    } else {
        paginas += 5;
    }
    atualizarFilmes();
});

const filtrarFilme = (filme) => {
    fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${filme}`).then(listagemFilmes);
};

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (input.value == '') {
            fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false').then(listagemFilmes);
            paginas = 0;
        } else {
            filtrarFilme(input.value);
        }
        input.value = '';
    }
});

const conteudoHighlight = async(resposta) => {
    const body = await resposta.json();

    video.style.background = `linear-gradient( rgba(0, 0, 0, 0.6) 100%,  rgba(0, 0, 0, 0.6) 100%), url(${body.backdrop_path}) no-repeat center / cover `;

    tituloVideo.textContent = body.title;
    notaVideo.textContent = body.vote_average;
    generos.textContent = body.genres.map(genero => genero.name).join(", ") + " /";
    data.textContent = body.release_date;
    sinopse.textContent = body.overview;
};

fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR"
).then(conteudoHighlight);

const linkVideo = async(resposta) => {
    const body = await resposta.json();
    link.href = `https://www.youtube.com/watch?v=${body.results[0].key}`;
};

fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR"
).then(linkVideo);

const conteudoModal = async(resposta) => {
    const body = await resposta.json();

    tituloModal.textContent = body.title;
    imagemModal.src = body.backdrop_path;
    sinopseModal.textContent = body.overview;
    modalNota.textContent = body.vote_average;
    modalGeneros.innerHTML = "";
    body.genres.forEach(genero => {
        const genreModal = document.createElement('span');
        genreModal.classList.add('modal__genre');
        genreModal.textContent = genero.name;
        modalGeneros.append(genreModal);
    });
};

const abrirModal = (id) => {
    modal.style.display = 'flex';
    fetch(
        `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`
    ).then(conteudoModal);
};

fecharModal.addEventListener('click', () => {
    modal.style.display = '';
});